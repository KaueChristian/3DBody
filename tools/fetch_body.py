import json, os, struct, sys, time, urllib.request, zlib
from concurrent.futures import ThreadPoolExecutor
from body_parts import resolve, idx
URL = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip"
os.makedirs("obj", exist_ok=True)
res = resolve()
miss = [k for k, v in res.items() if not v]
print("sem elementos:", miss, flush=True)
json.dump(res, open("body_elems.json", "w"))
todo = sorted({e for v in res.values() for e in v})
print("elementos:", len(todo), "compactados:", sum(idx[e][1] for e in todo)//1000, "KB", flush=True)
done = 0; total = 0; t0 = time.time()
def fetch(e):
    path = f"obj/{e}.obj"
    if os.path.exists(path): return 0
    fs, cs, off = idx[e]
    end = off + 30 + 400 + cs
    for attempt in range(6):
        try:
            req = urllib.request.Request(URL, headers={"Range": f"bytes={off}-{end}"})
            with urllib.request.urlopen(req, timeout=240) as r: data = r.read()
            nlen, elen = struct.unpack("<HH", data[26:30])
            start = 30 + nlen + elen
            raw = zlib.decompress(data[start:start + cs], -15)
            open(path, "wb").write(raw)
            return len(data)
        except Exception as ex:
            print("retry", e, attempt, ex, flush=True); time.sleep(2 + attempt * 2)
    return -1
with ThreadPoolExecutor(max_workers=12) as ex:
    for e, n in zip(todo, ex.map(fetch, todo)):
        done += 1; total += max(n, 0)
        if done % 20 == 0 or n < 0: print(f"{done}/{len(todo)} {total//1000} KB {round(time.time()-t0)}s", flush=True)
print("FIM", done, total//1000, "KB", round(time.time()-t0), "s", flush=True)
