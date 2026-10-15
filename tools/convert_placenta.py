"""Converte a placenta e o cordão umbilical do Atlas de Referência Humano (HRA, HuBMAP; CC BY 4.0) em peças do pacote `circ` (F5 / M21).

Fonte: `placenta-full-term-female` v1.1 (Visible Human feminino, em metros), baixada de
https://cdn.humanatlas.io/digital-objects/ref-organ/placenta-full-term-female/v1.1/assets/3d-vh-f-placenta-full-term.glb para tools/hra/.
O arquivo traz a placenta de termo (lâminas basal e coriônica, vasos da superfície, âmnio) e um trecho de cerca de 9 cm do cordão com as
duas artérias e a veia. Entram aqui só as lâminas (`placenta_corpo`) e a superfície do cordão (`cordao_umbilical`); o restante do cordão e
os vasos dentro do corpo são esquemas por código (src/catalog-circ-fetal.js).

O corpo do atlas é adulto e masculino; a placenta não "pertence" a ele. Por isso o objeto é posto fora do abdome, à frente, ligado ao umbigo
pelo cordão: uma escala isotrópica (m → 1 unidade = 10 cm) e uma rotação que leva a extremidade livre do cordão ao ponto `FREE_END` do
mundo do atlas, com a placenta do lado oposto (direção `OUT`). O restante do cordão, do umbigo a `FREE_END`, é um tubo do catálogo.

Uso (em tools/, depois de `convert_body.py --pack circ`):  python convert_placenta.py   → acrescenta as peças a ../dist/anatomy-circ.js
"""
import os

import numpy as np

from convert import weld
from convert_body import decimate_to, write_pack
from convert_hra import meshes_by_node

HERE = os.path.dirname(os.path.abspath(__file__))
GLB = os.path.join(HERE, "hra", "placenta-full-term-female-v1.1.glb")

# extremidade livre do cordão no mundo do atlas (1 unidade = 10 cm) e direção, a partir dela, para onde fica a placenta
FREE_END = np.array([0.20, -6.05, 2.35])
OUT = np.array([0.25, -0.15, 0.95])

PLATES = ["VH_F_basal_plate", "VH_F_chorionic_plate"]
CORD = ["VH_F_umbilical_cord", "VH_F_umbilical_artery_1", "VH_F_umbilical_artery_2", "VH_F_umbilical_vein"]


def rot_between(a, b):
    """Rotação mínima (Rodrigues) que leva o vetor a ao vetor b."""
    a, b = a / np.linalg.norm(a), b / np.linalg.norm(b)
    v = np.cross(a, b)
    c = float(np.dot(a, b))
    if np.linalg.norm(v) < 1e-9:
        return np.eye(3) if c > 0 else -np.eye(3)
    k = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    return np.eye(3) + k + k @ k * (1 / (1 + c))


def main():
    m = meshes_by_node(GLB)
    cord_v = np.concatenate([m[n][0] for n in CORD])
    plate_v = np.concatenate([m[n][0] for n in PLATES])
    # a extremidade livre do cordão é a mais afastada do centro da placenta
    center = plate_v.mean(0)
    free = cord_v[np.argmax(np.linalg.norm(cord_v - center, axis=1))]
    # o cordão de verdade termina numa seção: usa a média dos vértices do cordão a menos de 5 mm dessa ponta
    free = cord_v[np.linalg.norm(cord_v - free, axis=1) < 0.005].mean(0)
    R = rot_between(center - free, OUT)

    def place(v):
        return ((v - free) * 10.0) @ R.T + FREE_END

    out = []
    for pid, names, target in [("placenta_corpo", PLATES, 9000), ("cordao_umbilical", CORD, 3500)]:
        vs, fs, off = [], [], 0
        for n in names:
            v, f = m[n]
            vs.append(place(v))
            fs.append(f + off)
            off += len(v)
        v, f = weld(np.concatenate(vs), np.concatenate(fs), 4)
        v, f = decimate_to(v, f, target)
        print(f"{pid:20s} v={len(v):6d} f={len(f):6d}", flush=True)
        out.append(dict(id=pid, cat="orgao", region="tronco", v=v, f=f, elems=[]))
    box = np.concatenate([o["v"] for o in out])
    print("caixa no mundo do atlas:", box.min(0).round(2), box.max(0).round(2))
    write_pack(out, "circ", True)


if __name__ == "__main__":
    main()
