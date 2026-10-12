"""Converte modelos GLB do Atlas de Referência Humano (HRA, HuBMAP; CC BY 4.0) em peças do atlas, no pacote `resp` (dist/anatomy-resp.js).

Os GLB ficam em tools/hra/ (ver docs/fonte-hra-atlas-de-referencia.md; baixe-os com `curl` da URL em `SOURCES`). Eles estão no espaço do
Visible Human masculino, em metros; o corpo do atlas é o do BodyParts3D (1 unidade = 10 cm, origem própria). `hra_transform.json` guarda
a semelhança (escala e translação, eixos iguais: x para a esquerda do sujeito, y para cima, z para a frente) que leva um ao outro, calculada
por `fit_hra.py` contra os brônquios do BodyParts3D.

Uso (em tools/):  python convert_hra.py [--append]   → anatomy-resp.js e parts_resp.npz (copie o .js para ../dist/)
Com `--append`, acrescenta as peças ao pacote que já existe em ../dist/ (as peças do BodyParts3D entram antes, com `convert_body.py --pack resp`).
"""
import json
import os
import re
import struct
import sys

import numpy as np

from convert import weld
from convert_body import write_pack

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCES = {"lung-male": ("hra/lung-male-v1.4.glb", "https://cdn.humanatlas.io/digital-objects/ref-organ/lung-male/v1.4/assets/3d-vh-m-lung.glb")}

# peça → (arquivo, padrões dos nomes dos nós cujas malhas entram, categoria, região). Os segmentos broncopulmonares de cada lobo são
# fundidos numa peça só; o `hilum_*` de cada lobo também (tampa o hilo do pulmão onde a malha dos segmentos é aberta).
SEG = r"VH_M_(?:left|right)_[a-z_]*bronchopulmonary_segment"
PIECES = {
    "pulmao_d_lobo_superior": ("lung-male", [r"VH_M_right_(?:apical|posterior|anterior)_bronchopulmonary_segment", r"VH_M_hilum_upper_R"]),
    "pulmao_d_lobo_medio": ("lung-male", [r"VH_M_right_(?:lateral|medial)_bronchopulmonary_segment", r"VH_M_hilum_middle_R"]),
    "pulmao_d_lobo_inferior": ("lung-male", [r"VH_M_right_(?:superior|[a-z]+_basal)_bronchopulmonary_segment", r"VH_M_hilum_lower_R"]),
    "pulmao_e_lobo_superior": ("lung-male", [r"VH_M_left_(?:lingula_superior|lingula_inferior|posterior|anterior|apical)_bronchopulmonary_segment", r"VH_M_hilum_upper_L"]),
    "pulmao_e_lobo_inferior": ("lung-male", [r"VH_M_left_(?:superior|anterior_basal|lateral_basal|medial_basal|posetrior_basal)_bronchopulmonary_segment", r"VH_M_hilum_lower_L"]),
}


def read_glb(path):
    data = open(path, "rb").read()
    magic, ver, length = struct.unpack("<4sII", data[:12])
    assert magic == b"glTF" and ver == 2 and length == len(data), "não é um GLB 2.0 íntegro"
    off, js, blob = 12, None, None
    while off < len(data):
        clen, ctype = struct.unpack("<II", data[off:off + 8])
        chunk = data[off + 8:off + 8 + clen]
        if ctype == 0x4E4F534A:
            js = json.loads(chunk.decode("utf-8"))
        elif ctype == 0x004E4942:
            blob = chunk
        off += 8 + clen
    return js, blob


def accessor(js, blob, i):
    a = js["accessors"][i]
    bv = js["bufferViews"][a["bufferView"]]
    comp = {5126: ("<f4", 4), 5123: ("<u2", 2), 5125: ("<u4", 4)}[a["componentType"]]
    n = {"SCALAR": 1, "VEC3": 3}[a["type"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    arr = np.frombuffer(blob, dtype=comp[0], count=a["count"] * n, offset=start)
    return arr.reshape(-1, n) if n > 1 else arr


def meshes_by_node(path):
    """{nome do nó: (vértices, faces)} em metros, só dos nós com malha triangular indexada."""
    js, blob = read_glb(path)
    out = {}
    for n in js["nodes"]:
        if "mesh" not in n:
            continue
        assert not any(k in n for k in ("matrix", "translation", "rotation", "scale")), f"nó com transformação: {n.get('name')}"
        for p in js["meshes"][n["mesh"]]["primitives"]:
            if "indices" not in p or p.get("mode", 4) != 4:
                continue
            v = accessor(js, blob, p["attributes"]["POSITION"]).astype(np.float64)
            f = accessor(js, blob, p["indices"]).astype(np.int64).reshape(-1, 3)
            out[n["name"]] = (v, f)
    return out


def transform():
    t = json.load(open(os.path.join(HERE, "hra_transform.json")))
    return np.broadcast_to(np.array(t["scale"], dtype=np.float64), (3,)), np.array(t["translation"], dtype=np.float64)


def build(only=None):
    s, t = transform()
    cache, out = {}, []
    for pid, (src, pats) in PIECES.items():
        if only and pid not in only:
            continue
        if src not in cache:
            cache[src] = meshes_by_node(os.path.join(HERE, SOURCES[src][0]))
        vs, fs, off, used = [], [], 0, []
        for name, (v, f) in cache[src].items():
            if any(re.fullmatch(p, name) for p in pats):
                vs.append(v)
                fs.append(f + off)
                off += len(v)
                used.append(name)
        assert used, f"nenhuma malha para {pid}"
        v, f = weld(np.concatenate(vs) * s + t, np.concatenate(fs), 4)
        out.append(dict(id=pid, cat="orgao", region="tronco", v=v, f=f, elems=[]))
        print(f"{pid:26s} malhas={len(used):2d} v={len(v):6d} f={len(f):6d}", flush=True)
    return out


if __name__ == "__main__":
    args = sys.argv[1:]
    write_pack(build({a for a in args if not a.startswith("--")} or None), "resp", "--append" in args)
