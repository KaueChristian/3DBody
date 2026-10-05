"""Converte os nervos da órbita do BodyParts3D num pacote compacto (dist/anatomy-nerves.js).

Uso (na pasta com obj/, bp.py, convert.py e convert_body.py):  python convert_nerves.py
"""
import base64
import gzip
import json

import numpy as np

from bp import load, to_site
from convert import weld, smooth, remove_small_components, ORIGIN, SCALE
from convert_body import decimate_to
from fetch_nerves import NERVE_PARTS

MAX_TRIS = 9000


def main():
    out = []
    for pid, elems in NERVE_PARTS.items():
        vs, fs, off = [], [], 0
        for e in elems:
            v, f = load(f"obj/{e}.obj")
            v, f = weld(to_site(v), f)
            vs.append(v)
            fs.append(f + off)
            off += len(v)
        v, f = np.concatenate(vs), np.concatenate(fs)
        v, f = remove_small_components(v, f, 0.002)
        if len(f) > MAX_TRIS:
            v, f = decimate_to(v, f, MAX_TRIS)
        v = smooth(v, f, 4)
        v = (v - ORIGIN) * SCALE
        out.append(dict(id=pid, v=v, f=f))
        print(f"{pid:14s} elems={len(elems):2d} v={len(v):6d} f={len(f):6d}  bbox {v.min(0).round(2)} {v.max(0).round(2)}")

    blob = bytearray()
    manifest = []
    for p in out:
        v, f = p["v"], p["f"]
        lo, hi = v.min(0), v.max(0)
        q = np.round((v - lo) / np.maximum(hi - lo, 1e-9) * 65535).astype(np.uint16)
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
        manifest.append(dict(id=p["id"], cat="nervo", region="cabeca", nv=int(len(v)), ni=int(len(idx)),
                             lo=lo.round(5).tolist(), hi=hi.round(5).tolist(), ov=o_v, oi=o_i, i32=bool(i32)))
    gz = gzip.compress(bytes(blob), 9)
    js = "window.__ANATOMY_NERVES=" + json.dumps({"manifest": manifest, "data": base64.b64encode(gz).decode()}) + ";"
    open("anatomy-nerves.js", "w").write(js)
    print("anatomy-nerves.js", len(js) // 1024, "KB")


if __name__ == "__main__":
    main()
