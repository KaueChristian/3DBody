"""Converte as peças do tronco e dos membros superiores em um pacote compacto (dist/anatomy-body.js)."""
import base64
import gzip
import json
import sys

import numpy as np

from bp import load, to_site
from convert import weld, crop_below, smooth, remove_small_components, ORIGIN, SCALE
from body_parts import BODY

HEAD_Y = 1375.0  # acima disso (cabeça/pescoço) a pele mantém a resolução original


def cluster_decimate(v, f, cell, keep=None):
    """Decimação por agrupamento de vértices; `keep` (bool) preserva vértices individualmente."""
    key = np.floor((v - v.min(0)) / cell).astype(np.int64)
    k = key[:, 0] * 1_000_003 + key[:, 1] * 1009 + key[:, 2]
    if keep is not None:
        k = np.where(keep, -(np.arange(len(v)) + 1), k)
    u, inv = np.unique(k, return_inverse=True)
    inv = inv.reshape(-1)
    cnt = np.bincount(inv, minlength=len(u))
    nv = np.zeros((len(u), 3))
    for d in range(3):
        nv[:, d] = np.bincount(inv, weights=v[:, d], minlength=len(u)) / cnt
    f2 = inv[f]
    ok = (f2[:, 0] != f2[:, 1]) & (f2[:, 1] != f2[:, 2]) & (f2[:, 0] != f2[:, 2])
    f2 = f2[ok]
    used = np.unique(f2)
    remap = -np.ones(len(u), dtype=np.int64)
    remap[used] = np.arange(len(used))
    return nv[used], remap[f2]


def decimate_to(v, f, target, start=0.5):
    """Decimação quadrática (preserva melhor lâminas finas); recorre ao agrupamento se não houver a biblioteca."""
    try:
        import fast_simplification as fs

        red = 1 - target / len(f)
        v2, f2 = fs.simplify(np.ascontiguousarray(v, dtype=np.float32), np.ascontiguousarray(f, dtype=np.int32), target_reduction=red, agg=6)
        f2 = f2.astype(np.int64)
        used = np.unique(f2)
        remap = -np.ones(len(v2), dtype=np.int64)
        remap[used] = np.arange(len(used))
        return v2[used].astype(np.float64), remap[f2]
    except ImportError:
        cell = start
        while len(f) > target:
            v, f = cluster_decimate(v, f, cell)
            cell *= 1.18
        return v, f


def load_elems(elems):
    vs, fs, off = [], [], 0
    for e in elems:
        v, f = load(f"obj/{e}.obj")
        v = to_site(v)
        v, f = weld(v, f)
        vs.append(v)
        fs.append(f + off)
        off += len(v)
    return np.concatenate(vs), np.concatenate(fs)


def process_skin(elems):
    v, f = load_elems(elems)
    v, f = weld(v, f)
    v = smooth(v, f, 14)
    cx = v[f][:, :, 0].mean(1)
    cy = v[f][:, :, 1].mean(1)
    cut = 860.0
    keep = (cy >= cut) | ((np.abs(cx) >= 195) & (cy >= 560))
    f = f[keep]
    used = np.unique(f)
    remap = -np.ones(len(v), dtype=np.int64)
    remap[used] = np.arange(len(used))
    v, f = v[used], remap[f]
    v, f = remove_small_components(v, f, 0.05)
    # corte limpo da cintura/coxas: achata o que passou do plano (os braços ficam intactos)
    low = (np.abs(v[:, 0]) < 195) & (v[:, 1] < cut)
    v[low, 1] = cut
    flat = low[f].all(axis=1)
    f = f[~flat]
    used = np.unique(f)
    remap = -np.ones(len(v), dtype=np.int64)
    remap[used] = np.arange(len(used))
    v, f = v[used], remap[f]
    # decimação quadrática global: preserva rosto e mãos (alta curvatura) e simplifica as áreas planas
    v2, f2 = decimate_to(v, f, 110000)
    v2 = smooth(v2, f2, 2)
    return v2, f2


def mirror_x(v, f):
    """Acrescenta a cópia espelhada (x → −x) com a ordem dos vértices invertida, para as normais continuarem para fora."""
    m = v.copy()
    m[:, 0] *= -1
    return np.concatenate([v, m]), np.concatenate([f, f[:, ::-1] + len(v)])


def load_pack(path):
    """Lê um anatomy-body.js já gerado: (manifest, blob descompactado)."""
    src = open(path, encoding="utf-8").read()
    d = json.loads(src[src.index("=") + 1:].rstrip().rstrip(";"))
    return d["manifest"], bytearray(gzip.decompress(base64.b64decode(d["data"])))


def main():
    res = json.load(open("body_elems.json"))
    args = sys.argv[1:]
    # --append: converte só as peças pedidas e as acrescenta ao pacote atual (../dist/anatomy-body.js) sem tocar nas outras,
    # que continuam idênticas byte a byte (regenerar tudo exigiria baixar ~60 MB e mudaria malhas já validadas)
    append = "--append" in args
    only = {a for a in args if not a.startswith("--")}
    if append and not only:
        sys.exit("--append exige os ids das peças")
    out = []
    for pid, spec in BODY.items():
        if only and pid not in only:
            continue
        elems = res[pid]
        if pid == "pele_corpo":
            v, f = process_skin(elems)
        else:
            v, f = load_elems(elems)
            if spec["cat"] == "osso" and pid.startswith("costela"):
                pass
            v, f = remove_small_components(v, f, 0.02)
            if len(f) > spec["tris"]:
                v, f = decimate_to(v, f, spec["tris"])
            v = smooth(v, f, spec["smooth"])
        if spec.get("mirror"):
            v, f = mirror_x(v, f)
        v = (v - ORIGIN) * SCALE
        out.append(dict(id=pid, cat=spec["cat"], region=spec["region"], v=v, f=f, elems=elems))
        print(f"{pid:28s} elems={len(elems):2d} v={len(v):6d} f={len(f):6d}", flush=True)
    # empacotar
    blob = bytearray()
    manifest = []
    if append:
        manifest, blob = load_pack("../dist/anatomy-body.js")
        dup = {m["id"] for m in manifest} & {p["id"] for p in out}
        if dup:
            sys.exit(f"já estão no pacote: {sorted(dup)}")
    for p in out:
        v, f = p["v"], p["f"]
        lo, hi = v.min(0), v.max(0)
        span = np.maximum(hi - lo, 1e-9)
        q = np.round((v - lo) / span * 65535).astype(np.uint16)
        i32 = len(v) >= 65536
        idx = f.astype(np.uint32 if i32 else np.uint16).reshape(-1)
        while len(blob) % 4:
            blob.append(0)
        o_v = len(blob)
        blob += q.tobytes()
        while len(blob) % 4:
            blob.append(0)
        o_i = len(blob)
        blob += idx.tobytes()
        manifest.append(dict(id=p["id"], cat=p["cat"], region=p["region"], nv=int(len(v)), ni=int(len(idx)),
                             lo=lo.round(5).tolist(), hi=hi.round(5).tolist(), ov=o_v, oi=o_i, i32=bool(i32)))
    gz = gzip.compress(bytes(blob), 9)
    print("blob", len(blob) // 1024, "KB; gzip", len(gz) // 1024, "KB")
    js = "window.__ANATOMY_BODY=" + json.dumps({"manifest": manifest, "data": base64.b64encode(gz).decode()}) + ";"
    open("anatomy-body.js", "w").write(js)
    print("anatomy-body.js", len(js) // 1024, "KB")
    np.savez_compressed("parts_body.npz", **{p["id"] + "__v": p["v"] for p in out}, **{p["id"] + "__f": p["f"] for p in out})


if __name__ == "__main__":
    main()
