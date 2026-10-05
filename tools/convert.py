"""Converte os OBJ do BodyParts3D em um pacote compacto (posições quantizadas + índices, gzip + base64)."""
import base64
import gzip
import json
import re
import sys

import numpy as np

from bp import load, to_site, want

ORIGIN = np.array([0.0, 1535.0, 85.0])  # mm (site: x esquerda, y cima, z frente)
SCALE = 1 / 100.0
CUT_Y = 1375.0  # corte inferior (mm) de pele/pescoço (o corte limpo é feito no navegador, em y = -1.42)


def weld(v, f, decimals=3):
    key = np.round(v, decimals)
    u, inv = np.unique(key, axis=0, return_inverse=True)
    inv = inv.reshape(-1)
    f2 = inv[f]
    ok = (f2[:, 0] != f2[:, 1]) & (f2[:, 1] != f2[:, 2]) & (f2[:, 0] != f2[:, 2])
    f2 = f2[ok]
    used = np.unique(f2)
    remap = -np.ones(len(u), dtype=np.int64)
    remap[used] = np.arange(len(used))
    return u[used], remap[f2]


def crop_below(v, f, y_min):
    cy = v[f][:, :, 1].mean(1)
    f2 = f[cy >= y_min]
    used = np.unique(f2)
    remap = -np.ones(len(v), dtype=np.int64)
    remap[used] = np.arange(len(used))
    return v[used], remap[f2]


def smooth(v, f, iters=10, lam=0.5, mu=-0.53, lock=None):
    """Suavização de Taubin (não encolhe a malha)."""
    n = len(v)
    e = np.concatenate([f[:, [0, 1]], f[:, [1, 2]], f[:, [2, 0]]])
    e = np.concatenate([e, e[:, ::-1]])
    deg = np.bincount(e[:, 0], minlength=n).astype(np.float64)
    isolated = deg == 0
    deg[deg == 0] = 1
    v = v.copy()
    for i in range(iters):
        for k in (lam, mu):
            acc = np.zeros_like(v)
            np.add.at(acc, e[:, 0], v[e[:, 1]])
            avg = acc / deg[:, None]
            d = (avg - v) * k
            d[isolated] = 0
            if lock is not None:
                d[lock] = 0
            v = v + d
    return v


def remove_small_components(v, f, min_frac=0.02):
    n = len(v)
    parent = np.arange(n)

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for a, b, c in f:
        ra, rb, rc = find(a), find(b), find(c)
        parent[rb] = ra
        parent[find(c)] = ra
    roots = np.array([find(i) for i in range(n)])
    tri_root = roots[f[:, 0]]
    ids, counts = np.unique(tri_root, return_counts=True)
    keep = ids[counts >= counts.max() * min_frac]
    f2 = f[np.isin(tri_root, keep)]
    used = np.unique(f2)
    remap = -np.ones(n, dtype=np.int64)
    remap[used] = np.arange(len(used))
    return v[used], remap[f2]


def cluster_decimate(v, f, cell):
    key = np.floor((v - v.min(0)) / cell).astype(np.int64)
    k = key[:, 0] * 1_000_003 + key[:, 1] * 1009 + key[:, 2]
    u, inv = np.unique(k, return_inverse=True)
    inv = inv.reshape(-1)
    nv = np.zeros((len(u), 3)); cnt = np.bincount(inv, minlength=len(u))
    for d in range(3):
        nv[:, d] = np.bincount(inv, weights=v[:, d], minlength=len(u)) / cnt
    f2 = inv[f]
    ok = (f2[:, 0] != f2[:, 1]) & (f2[:, 1] != f2[:, 2]) & (f2[:, 0] != f2[:, 2])
    f2 = f2[ok]
    used = np.unique(f2)
    remap = -np.ones(len(nv), dtype=np.int64)
    remap[used] = np.arange(len(used))
    return nv[used], remap[f2]


def load_site(elem):
    v, f = load(f"obj/{elem}.obj")
    v = to_site(v)
    v, f = weld(v, f)
    return v, f


def merge(meshes):
    vs, fs, off = [], [], 0
    for v, f in meshes:
        vs.append(v)
        fs.append(f + off)
        off += len(v)
    return np.concatenate(vs), np.concatenate(fs)


# ───────── definição das peças ─────────
# (id, categoria, lado, elementos)
def by_name(pattern):
    return sorted([e for e, n in want.items() if re.fullmatch(pattern, n)])


PARTS = []


def part(pid, cat, elems, smooth_it=6, crop=False):
    PARTS.append(dict(id=pid, cat=cat, elems=elems, smooth=smooth_it, crop=crop))


# ossos
for pid, pat in [
    ("frontal", r"frontal bone"), ("parietal_d", r"right parietal bone"), ("parietal_e", r"left parietal bone"),
    ("occipital", r"occipital bone"), ("temporal_d", r"right temporal bone"), ("temporal_e", r"left temporal bone"),
    ("esfenoide", r"sphenoid bone"), ("etmoide", r"ethmoid"), ("maxila_d", r"right maxilla"), ("maxila_e", r"left maxilla"),
    ("mandibula", r"mandible"), ("zigomatico_d", r"right zygomatic bone"), ("zigomatico_e", r"left zygomatic bone"),
    ("nasal_d", r"right nasal bone"), ("nasal_e", r"left nasal bone"), ("lacrimal_d", r"right lacrimal bone"),
    ("lacrimal_e", r"left lacrimal bone"), ("palatino_d", r"right palatine bone"), ("palatino_e", r"left palatine bone"),
    ("vomer", r"vomer"), ("concha_d", r"right inferior nasal concha"), ("concha_e", r"left inferior nasal concha"),
    ("hioide", r"hyoid bone"), ("atlas", r"atlas"), ("axis", r"axis"),
]:
    part(pid, "osso", by_name(pat), 4)
part("cervicais", "osso", by_name(r"(third|fourth|fifth|sixth|seventh) cervical vertebra"), 4)
part("dentes_sup", "dente", by_name(r"(left|right) upper .*tooth"), 2)
part("dentes_inf", "dente", by_name(r"(left|right) lower .*tooth"), 2)

# olhos / cartilagens / pele
for pid, pat in [
    ("esclera_d", r"right sclera"), ("esclera_e", r"left sclera"), ("cornea_d", r"right cornea"), ("cornea_e", r"left cornea"),
    ("iris_d", r"right iris"), ("iris_e", r"left iris"), ("cristalino_d", r"right lens"), ("cristalino_e", r"left lens"),
]:
    part(pid, "olho", by_name(pat), 3)
for pid, pat in [
    ("tarsal_sup_d", r"tarsal plate of right upper eyelid"), ("tarsal_sup_e", r"tarsal plate of left upper eyelid"),
    ("tarsal_inf_d", r"tarsal plate of right lower eyelid"), ("tarsal_inf_e", r"tarsal plate of left lower eyelid"),
    ("check_lat_d", r"check ligament of right lateral rectus"), ("check_lat_e", r"check ligament of left lateral rectus"),
    ("check_med_d", r"check ligament of right medial rectus"), ("check_med_e", r"check ligament of left medial rectus"),
    ("lig_estiloioideo_d", r"right stylohyoid ligament"), ("lig_estiloioideo_e", r"left stylohyoid ligament"),
]:
    part(pid, "ligamento", by_name(pat), 3)
for pid, pat in [("submandibular", r"(left|right) submandibular gland"), ("sublingual", r"(left|right) sublingual gland")]:
    part(pid, "glandula", by_name(pat), 4)
part("lingua", "lingua", by_name(r"tongue"), 5)
part("cartilagem_nasal", "cartilagem", by_name(r"(septal nasal cartilage|right major alar cartilage|left major alar cartilage|right lateral nasal cartilage|left lateral nasal cartilage)"), 4)
part("orelha", "cartilagem", by_name(r"external ear"), 6)
part("sobrancelha", "pele", by_name(r"eyebrow"), 2)
part("pele", "pele", by_name(r"skin"), 14, crop=True)

# músculos reais do BP3D
for pid, pat in [
    ("reto_sup", r"(left|right) superior rectus"), ("reto_inf", r"(left|right) inferior rectus"),
    ("reto_med", r"(left|right) medial rectus"), ("reto_lat", r"(left|right) lateral rectus"),
    ("obliquo_sup", r"(left|right) superior oblique"), ("obliquo_inf", r"(left|right) inferior oblique"),
    ("levantador_palpebra", r"(left|right) levator palpebrae superioris"),
    ("digastrico", r"(left|right) digastric"), ("milo_hioideo", r"(left|right) mylohyoid"),
    ("genio_hioideo", r"(left|right) geniohyoid"), ("estilo_hioideo", r"(left|right) stylohyoid"),
    ("platisma", r"(left|right) platysma"), ("ecm", r"(left|right) sternocleidomastoid"),
]:
    part(pid, "musculo", by_name(pat), 5, crop=False)


def quant(parts_out):
    blob = bytearray()
    manifest = []
    for p in parts_out:
        v, f = p["v"], p["f"]
        lo, hi = v.min(0), v.max(0)
        span = np.maximum(hi - lo, 1e-9)
        q = np.round((v - lo) / span * 65535).astype(np.uint16)
        idx_type = np.uint16 if len(v) < 65536 else np.uint32
        idx = f.astype(idx_type).reshape(-1)
        while len(blob) % 4:
            blob.append(0)
        o_v = len(blob)
        blob += q.tobytes()
        while len(blob) % 4:
            blob.append(0)
        o_i = len(blob)
        blob += idx.tobytes()
        manifest.append(dict(id=p["id"], cat=p["cat"], nv=int(len(v)), ni=int(len(idx)),
                             lo=lo.round(5).tolist(), hi=hi.round(5).tolist(), ov=o_v, oi=o_i,
                             i32=bool(idx_type is np.uint32), elems=p["elems"]))
    return bytes(blob), manifest


def main():
    out = []
    for p in PARTS:
        if not p["elems"]:
            print("SEM ELEMENTOS:", p["id"])
            continue
        meshes = [load_site(e) for e in p["elems"]]
        v, f = merge(meshes)
        if p["id"] == "pele":
            v, f = weld(v, f)
            v, f = crop_below(v, f, CUT_Y)
            v, f = remove_small_components(v, f, 0.2)
        elif p["crop"]:
            v, f = crop_below(v, f, CUT_Y)
        if p["cat"] == "olho":
            v, f = remove_small_components(v, f, 0.3)
        if len(f) > 16000 and p["id"] != "pele":
            cell = 0.6
            while len(f) > 16000:
                v, f = cluster_decimate(v, f, cell)
                cell *= 1.2
        if p["smooth"] > 0 and p["cat"] not in ("dente",):
            v = smooth(v, f, p["smooth"])
        elif p["cat"] == "dente":
            v = smooth(v, f, p["smooth"])
        v = (v - ORIGIN) * SCALE
        out.append(dict(id=p["id"], cat=p["cat"], v=v, f=f, elems=p["elems"]))
        print(f"{p['id']:22s} elems={len(p['elems']):2d} v={len(v):6d} f={len(f):6d}  y[{v[:,1].min():.2f},{v[:,1].max():.2f}] x[{v[:,0].min():.2f},{v[:,0].max():.2f}] z[{v[:,2].min():.2f},{v[:,2].max():.2f}]")
    blob, manifest = quant(out)
    print("blob", len(blob) // 1024, "KB")
    gz = gzip.compress(blob, 9)
    print("gzip", len(gz) // 1024, "KB")
    json.dump(manifest, open("manifest.json", "w"))
    js = "window.__ANATOMY=" + json.dumps({"manifest": manifest, "data": base64.b64encode(gz).decode()}) + ";"
    open("anatomy-data.js", "w").write(js)
    print("anatomy-data.js", len(js) // 1024, "KB")
    # versão em numpy para análises (landmarks)
    np.savez_compressed("parts.npz", **{p["id"] + "__v": p["v"] for p in out}, **{p["id"] + "__f": p["f"] for p in out})


if __name__ == "__main__":
    main()
