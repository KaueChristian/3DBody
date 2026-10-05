"""Baixa (via HTTP Range) apenas os elementos OBJ necessários do BodyParts3D."""
import collections
import json
import os
import re
import struct
import sys
import time
import urllib.request
import zlib
from concurrent.futures import ThreadPoolExecutor

URL = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip"
OUT = "obj"
os.makedirs(OUT, exist_ok=True)

m = collections.defaultdict(list)
names = {}
for line in open("isa_element_parts.txt", encoding="utf-8").read().splitlines()[1:]:
    c, n, e = line.split("\t")
    m[c].append(e)
    names[c] = n

idx = {}
for line in open("zip_index.tsv"):
    f, fs, cs, off = line.strip().split("\t")
    idx[f.split("/")[-1][:-4]] = (int(fs), int(cs), int(off))

want = {}  # elemento -> rótulo


def add(concept, label=None):
    for e in m[concept]:
        want[e] = label or names[concept]


# ossos do crânio e pescoço
for c in ["FMA52734", "FMA52788", "FMA52789", "FMA52735", "FMA52738", "FMA52739", "FMA52736", "FMA52740",
          "FMA53649", "FMA53650", "FMA52748", "FMA52892", "FMA52893", "FMA53647", "FMA53648", "FMA53645",
          "FMA53646", "FMA53655", "FMA53656", "FMA9710", "FMA54737", "FMA54738", "FMA52749",
          "FMA12519", "FMA12520", "FMA12521", "FMA12522", "FMA12523", "FMA12524", "FMA12525"]:
    add(c)
# olhos, cartilagens, orelha, sobrancelha, pele
for c in ["FMA12514", "FMA12515", "FMA59503", "FMA59505", "FMA59506", "FMA59512", "FMA59513", "FMA52781",
          "FMA54237", "FMA7163"]:
    add(c)
# dentes definitivos
for c, n in names.items():
    if re.search(r"secondary .*tooth$", n) and len(m[c]) == 1 and re.match(r"(left|right) (upper|lower)", n):
        add(c)
# músculos extraoculares + levantador da pálpebra, suprahioideos, ECM, platisma
for c in ["FMA49035", "FMA49036", "FMA49037", "FMA49038", "FMA49039", "FMA49040", "FMA49041", "FMA49042",
          "FMA13407", "FMA45738", "FMA46291", "FMA46320"]:
    add(c)
for c, n in names.items():
    if re.search(r"^(left|right) (superior|inferior|lateral|medial) rectus$|^(left|right) (superior|inferior) oblique$|^(left|right) levator palpebrae superioris$|^(left|right) (geniohyoid|stylohyoid|mylohyoid|digastric|sternocleidomastoid|platysma)$", n):
        add(c)

for c in ["FMA58271","FMA58272","FMA58239","FMA58240","FMA58236","FMA58237","FMA58242","FMA58243","FMA59089","FMA59090","FMA59091","FMA59092",
          "FMA49144","FMA49145","FMA49147","FMA49148","FMA72309","FMA72311","FMA59802","FMA59803","FMA59804","FMA59805","FMA54640","FMA59816"]:
    add(c)
todo = sorted(want)
print("elementos:", len(todo), "compactados:", sum(idx[e][1] for e in todo) // 1000, "KB", flush=True)
json.dump(want, open("want.json", "w"))
done = 0
t0 = time.time()
total = 0


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
            raw = zlib.decompress(data[start:start + cs], -15)
            open(path, "wb").write(raw)
            return len(data)
        except Exception as ex:  # noqa: BLE001
            print("retry", e, attempt, ex, flush=True)
            time.sleep(2 + attempt * 2)
    return -1


with ThreadPoolExecutor(max_workers=10) as ex:
    for e, n in zip(todo, ex.map(fetch, todo)):
        done += 1
        total += max(n, 0)
        if done % 10 == 0 or n < 0:
            print(f"{done}/{len(todo)} {total // 1000} KB {round(time.time() - t0)}s", flush=True)
print("FIM", done, total // 1000, "KB", round(time.time() - t0), "s", flush=True)
