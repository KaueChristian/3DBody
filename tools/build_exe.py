"""Gera o executável e os arquivos da release:

    release/Anatomia3D.exe   lançador com o atlas embutido (abre sem internet)
    release/app.zip          o atlas (baixado pelo lançador quando há versão nova)
    release/version.json     versão, SHA-256 dos arquivos e identificador do lançador

Requer Windows (usa o compilador C# que já vem com o .NET Framework) e Python com numpy.
Uso:  python tools/build_exe.py [--version 2.0.7] [--repo dono/3DBody]
A versão padrão é a do package.json; o repositório padrão é o do `git remote origin`.
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import struct
import subprocess
import sys
import zlib
import zipfile

import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BUILD = os.path.join(ROOT, "build")
RELEASE = os.path.join(ROOT, "release")
FILES = [
    "index.html", "styles.css", "manifest.webmanifest", "sw.js",
    "assets/icon-192.png", "assets/icon-512.png", "assets/icon-maskable-512.png", "assets/favicon.svg",
    "dist/version.js", "dist/app.js", "dist/anatomy-data.js",
    "dist/anatomy-nerves.js", "dist/anatomy-body.js",
]
LAUNCHER = os.path.join(ROOT, "tools", "launcher", "Launcher.cs")
CSC = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), r"Microsoft.NET\Framework64\v4.0.30319\csc.exe")
DEFAULT_REPO = "KaueChristian/3DBody"


def png(rgba):
    h, w, _ = rgba.shape
    raw = b"".join(b"\x00" + rgba[y].tobytes() for y in range(h))

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


def draw_icon(n=768, maskable=False):
    """Logo Body3D: um B feito de um osso minimalista e duas curvas (que também formam um 3), sobre azul-marinho.

    Geometria no sistema do logo (grade 96x96, a mesma de assets/favicon.svg). `maskable`: fundo sem cantos
    arredondados e marca menor, para caber na zona segura dos ícones adaptativos do Android.
    """
    y, x = np.mgrid[0:n, 0:n].astype(np.float64)
    u, v = x / n, y / n
    if maskable:
        bg = np.ones((n, n), dtype=bool)
        k = 0.56
    else:
        r = 0.22
        dx = np.maximum(np.abs(u - 0.5) - (0.5 - r), 0)
        dy = np.maximum(np.abs(v - 0.5) - (0.5 - r), 0)
        bg = (dx * dx + dy * dy) <= r * r
        k = 0.6875
    # pixel -> coordenadas do logo (o grupo do SVG é deslocado em (7, -1))
    mx = ((u - 0.5) / k + 0.5) * 96 - 7
    my = ((v - 0.5) / k + 0.5) * 96 + 1

    def disc(cx, cy, rad):
        return (mx - cx) ** 2 + (my - cy) ** 2 <= rad * rad

    def box(x0, x1, y0, y1):
        return (mx >= x0) & (mx <= x1) & (my >= y0) & (my <= y1)

    def bowl(cx, cy, rad, x_from):
        """Meia coroa circular (traço de 12) à direita de cx, mais as duas barras horizontais que a fecham."""
        d2 = (mx - cx) ** 2 + (my - cy) ** 2
        ring = (d2 >= (rad - 6) ** 2) & (d2 <= (rad + 6) ** 2) & (mx >= cx)
        return ring | box(x_from, cx, cy - rad - 6, cy - rad + 6) | box(x_from, cx, cy + rad - 6, cy + rad + 6)

    bone = box(12, 20, 11, 87) | disc(12, 11, 5.5) | disc(20, 11, 5.5) | disc(12, 87, 5.5) | disc(20, 87, 5.5)
    bowls = bowl(50, 31, 17, 30) | bowl(52, 66, 18, 30)

    img = np.zeros((n, n, 4))
    img[..., :3] = [11, 18, 32]
    img[..., 3] = bg * 255
    img[bone & bg, :3] = [45, 212, 191]
    img[bowls & bg, :3] = [242, 244, 247]
    return img.astype(np.uint8)


def downscale(img, size):
    n = img.shape[0]
    k = n // size
    a = img.astype(np.float64)
    a[..., :3] *= a[..., 3:4] / 255.0  # alfa pré-multiplicado para a média
    a = a.reshape(size, k, size, k, 4).mean(axis=(1, 3))
    alpha = a[..., 3:4]
    rgb = np.where(alpha > 0, a[..., :3] / np.maximum(alpha / 255.0, 1e-6), 0)
    return np.concatenate([np.clip(rgb, 0, 255), alpha], axis=-1).round().astype(np.uint8)


def make_ico(path):
    base = draw_icon(768)
    sizes = [256, 128, 64, 48, 32, 16]
    images = [png(downscale(base, s)) for s in sizes]
    header = struct.pack("<HHH", 0, 1, len(sizes))
    offset = 6 + 16 * len(sizes)
    entries = b""
    for s, data in zip(sizes, images):
        entries += struct.pack("<BBBBHHII", 0 if s == 256 else s, 0 if s == 256 else s, 0, 0, 1, 32, len(data), offset)
        offset += len(data)
    with open(path, "wb") as f:
        f.write(header + entries + b"".join(images))


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def git_repo():
    try:
        url = subprocess.run(["git", "remote", "get-url", "origin"], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        m = re.search(r"github\.com[:/]([^/]+/[^/.]+)", url)
        return m.group(1) if m else None
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--version", help="versão da release (ex.: 2.0.7)")
    ap.add_argument("--repo", help="repositório no GitHub (dono/nome)")
    args = ap.parse_args()
    pkg = json.load(open(os.path.join(ROOT, "package.json"), encoding="utf-8"))
    version = args.version or pkg["version"]
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        sys.exit(f"Versão inválida: {version} (use números, ex.: 2.0.7)")
    repo = args.repo or git_repo() or DEFAULT_REPO
    if not os.path.exists(CSC):
        sys.exit(f"Compilador C# não encontrado em {CSC}")
    os.makedirs(BUILD, exist_ok=True)
    os.makedirs(RELEASE, exist_ok=True)

    print(f"Versão {version} · repositório {repo}")
    print("1/5 compilando o site (npm run build)...")
    subprocess.run("npm run build", cwd=ROOT, shell=True, check=True, stdout=subprocess.DEVNULL)

    print("2/5 empacotando os arquivos do site...")
    zpath = os.path.join(RELEASE, "app.zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for f in FILES:
            if f == "dist/version.js":  # o do repositório diz "dev"; no pacote vai a versão da release
                z.writestr(f, f'window.__APP_VERSION = "{version}";\n')
                continue
            src = os.path.join(ROOT, f)
            if not os.path.exists(src):
                sys.exit(f"Arquivo ausente: {f}")
            z.write(src, f)
    print("   app.zip:", round(os.path.getsize(zpath) / 1e6, 1), "MB")

    print("3/5 gerando o ícone...")
    ico = os.path.join(BUILD, "icone.ico")
    make_ico(ico)

    launcher_src = open(LAUNCHER, encoding="utf-8").read().replace("\r\n", "\n")
    launcher_hash = hashlib.sha256(launcher_src.encode("utf-8")).hexdigest()[:16]
    info = os.path.join(BUILD, "BuildInfo.cs")
    with open(info, "w", encoding="utf-8") as f:
        f.write(
            "using System.Reflection;\n"
            '[assembly: AssemblyTitle("Anatomia 3D")]\n'
            '[assembly: AssemblyProduct("Anatomia 3D")]\n'
            '[assembly: AssemblyDescription("Atlas 3D de anatomia: cabeça, tronco e membros superiores")]\n'
            '[assembly: AssemblyCopyright("Modelos 3D: BodyParts3D, © DBCLS, CC BY-SA 2.1 Japão")]\n'
            f'[assembly: AssemblyVersion("{version}.0")]\n'
            f'[assembly: AssemblyFileVersion("{version}.0")]\n'
            f'[assembly: AssemblyInformationalVersion("{version}")]\n'
            "static class BuildInfo\n{\n"
            f'    public const string Version = "{version}";\n'
            f'    public const string Repo = "{repo}";\n'
            f'    public const string LauncherHash = "{launcher_hash}";\n'
            "}\n"
        )

    print("4/5 compilando o executável...")
    exe = os.path.join(RELEASE, "Anatomia3D.exe")
    cmd = [
        CSC, "/nologo", "/target:winexe", "/optimize+", f"/out:{exe}", f"/win32icon:{ico}",
        f"/resource:{zpath},app.zip",
        "/r:System.dll", "/r:System.Drawing.dll", "/r:System.Windows.Forms.dll",
        "/r:System.IO.Compression.dll", "/r:System.IO.Compression.FileSystem.dll",
        LAUNCHER, info,
    ]
    subprocess.run(cmd, check=True)

    print("5/5 escrevendo version.json...")
    manifest = {
        "version": version,
        "app": "app.zip",
        "appSha256": sha256(zpath),
        "exe": "Anatomia3D.exe",
        "exeSha256": sha256(exe),
        "launcher": launcher_hash,
        "date": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    with open(os.path.join(RELEASE, "version.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(manifest, f, indent=2)
    print("Pronto:", exe, f"({os.path.getsize(exe) / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
