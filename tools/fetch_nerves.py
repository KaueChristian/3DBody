"""Baixa (via HTTP Range) os elementos OBJ dos nervos da órbita do BodyParts3D (pasta obj/).

O BodyParts3D 4.0 só tem malhas de nervos na órbita (óptico, oculomotor, troclear, oftálmico e ramos, gânglio ciliar).
Os demais nervos do atlas são gerados por código (src/nerves.js).
"""
import os
import struct
import time
import urllib.request
import zlib
from concurrent.futures import ThreadPoolExecutor

URL = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip"
OUT = "obj"

# peça do site -> elementos (esquerdo e direito)
NERVE_PARTS = {
    # nervo óptico, quiasma e tratos
    "n_optico": ["FJ1313", "FJ1364", "FJ1771", "FJ1773", "FJ1820"],
    # ramos superior e inferior do oculomotor, gânglio ciliar e nervos ciliares curtos
    "n_oculomotor": ["FJ1321", "FJ1372", "FJ1293", "FJ1344", "FJ1288", "FJ1339", "FJ1319", "FJ1370"],
    "n_troclear": ["FJ1330", "FJ1381"],
    # oftálmico (V1): frontal, supraorbital, supratroclear, lacrimal, nasociliar, infratroclear, etmoidais,
    # ciliares longos e ramo comunicante com o gânglio ciliar
    "n_oftalmico": ["FJ1312", "FJ1363", "FJ1290", "FJ1341", "FJ1325", "FJ1376", "FJ1326", "FJ1377", "FJ1300", "FJ1351",
                    "FJ1310", "FJ1361", "FJ1296", "FJ1347", "FJ1283", "FJ1333", "FJ1315", "FJ1366", "FJ1318", "FJ1369",
                    "FJ1311", "FJ1362"],
}


def main():
    os.makedirs(OUT, exist_ok=True)
    idx = {}
    for line in open("zip_index.tsv"):
        f, fs, cs, off = line.strip().split("\t")
        idx[f.split("/")[-1][:-4]] = (int(fs), int(cs), int(off))

    def fetch(e):
        path = f"{OUT}/{e}.obj"
        if os.path.exists(path):
            return 0
        fs, cs, off = idx[e]
        end = off + 30 + 400 + cs
        for attempt in range(6):
            try:
                req = urllib.request.Request(URL, headers={"Range": f"bytes={off}-{end}"})
                with urllib.request.urlopen(req, timeout=180) as r:
                    data = r.read()
                nlen, elen = struct.unpack("<HH", data[26:30])
                start = 30 + nlen + elen
                open(path, "wb").write(zlib.decompress(data[start:start + cs], -15))
                return len(data)
            except Exception as ex:  # noqa: BLE001
                print("nova tentativa", e, attempt, ex, flush=True)
                time.sleep(2 + attempt * 2)
        return -1

    todo = sorted({e for els in NERVE_PARTS.values() for e in els})
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as ex:
        res = list(ex.map(fetch, todo))
    print(f"{len(todo)} elementos, {sum(max(r, 0) for r in res) // 1000} KB, {round(time.time() - t0)} s;",
          "falhas:", [e for e, r in zip(todo, res) if r < 0])


if __name__ == "__main__":
    main()
