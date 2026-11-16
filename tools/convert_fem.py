"""Converte o aparelho genital feminino e a mama do Atlas de Referência Humano (HRA, HuBMAP; CC BY 4.0) no pacote `fem`
(dist/anatomy-fem.js, F6.5).

Fontes (Visible Human feminino, em metros; baixadas de https://cdn.humanatlas.io/digital-objects/ref-organ/… para tools/hra/):
  uterus-female v1.2, fallopian-tube-female-left/right v1.2, ovary-female-left/right v1.3, pelvis-female v1.3,
  mammary-gland-female-left/right v1.1.

Posição:
  · útero, tubas e ovários: os GLB estão no mesmo referencial da pelve feminina; `fit_fem.py` acha a transformação (rotação, escala por
    eixo e translação) que leva os ossos da pelve feminina aos do atlas, e ela vale para os órgãos. `ORGAN_SHIFT` é o ajuste fino
    medido no navegador (ver docs/genital-feminino.md): o corpo do atlas é masculino e a bexiga e o colo sigmoide ocupam parte do
    espaço do útero;
  · mama: escala real (m → 1 unidade = 10 cm) e translação que põe a papila no 4º espaço intercostal, na linha medioclavicular, com a
    base apoiada no peitoral maior do atlas (o tórax é masculino: a mama fica “por fora” da pele);
  · pelve feminina: escala real, fora do corpo, à direita do sujeito, na altura da pelve do atlas, só para comparação.

Uso (em tools/, depois de `python fit_fem.py`):  python convert_fem.py   → anatomy-fem.js e parts_fem.npz (copie o .js para ../dist/)
"""
import json
import os

import numpy as np
from scipy.spatial import cKDTree
from scipy.spatial.transform import Rotation

from convert import weld, smooth
from convert_body import decimate_to, write_pack
from convert_hra import meshes_by_node
from fit_hra import pack_pieces

HERE = os.path.dirname(os.path.abspath(__file__))
H = lambda n: os.path.join(HERE, "hra", n)

# ajuste fino (unidades do atlas) aplicado depois da transformação dos ossos; medido no navegador
ORGAN_SHIFT = np.array([0.03, 0.0, 0.0])
# centro da pelve feminina de comparação no mundo do atlas (à direita do sujeito, fora do corpo e dos braços)
PELVIS_AT = np.array([-4.9, -6.75, -0.1])

ORGANS = {
    # peça: (arquivo, nós, triângulos)
    "utero_fundo": ("uterus-female-v1.2.glb", ["fundus_of_uterus", "cornua", "abdominal_ostium_of_uterine_tube"], 2400),
    "utero_corpo": ("uterus-female-v1.2.glb", ["body_of_uterus"], 2600),
    "utero_istmo": ("uterus-female-v1.2.glb", ["lower_uterine_segment"], 900),
    "colo_utero": ("uterus-female-v1.2.glb", ["cervix", "cervicovaginal_junction", "internal_cervical_os", "external_cervical_os"], 2600),
    "tuba_istmo": (["fallopian-tube-female-left-v1.2.glb", "fallopian-tube-female-right-v1.2.glb"], ["isthmus_of_fallopian_tube_L", "isthmus_of_fallopian_tube_R"], 1200),
    "tuba_ampola": (["fallopian-tube-female-left-v1.2.glb", "fallopian-tube-female-right-v1.2.glb"], ["ampulla_of_uterine_tube_L", "ampulla_of_uterine_tube_R"], 3200),
    "tuba_infundibulo": (["fallopian-tube-female-left-v1.2.glb", "fallopian-tube-female-right-v1.2.glb"],
                         ["uterine_tube_infundibulum_L", "fibria_of_uterine_tube_L", "uterine_tube_infundibulum_R", "fibria_of_uterine_tube_R"], 3600),
    "ovario": (["ovary-female-left-v1.3.glb", "ovary-female-right-v1.3.glb"], ["left_ovary", "right_ovary"], 900),
}
BREAST = {
    "mama_corpo_adiposo": (["fat_L", "fat_R", "suspensory_ligaments_L", "suspensory_ligaments_R"], 7000),
    "mama_glandula": (["mammary_lobes_L", "mammary_lobes_R", "main_lactiferous_ducts_L", "main_lactiferous_ducts_R",
                       "main_lactiferous_sinuses_L", "main_lactiferous_sinuses_R"], 9000),
    "mama_papila_areola": (["nipple_L", "nipple_R", "areola_L", "areola_R", "areolar_tubercles_L", "areolar_tubercles_R"], 2400),
}
PELVIS_NODES = ["sacrum", "coccyx", "ilium_compact_bone_L", "ilium_compact_bone_R", "ischium_compact_bone_L", "ischium_compact_bone_R",
                "pubis_compact_bone_L", "pubis_compact_bone_R"]

_cache = {}


def nodes(files, names):
    files = [files] if isinstance(files, str) else files
    vs, fs, off = [], [], 0
    for fn in files:
        if fn not in _cache:
            _cache[fn] = meshes_by_node(H(fn))
        for n in names:
            key = f"VH_F_{n}"
            if key in _cache[fn]:
                v, f = _cache[fn][key]
                vs.append(v)
                fs.append(f + off)
                off += len(v)
    assert vs, f"nenhum nó {names} em {files}"
    return np.concatenate(vs), np.concatenate(fs)


def organ_transform():
    t = json.load(open(os.path.join(HERE, "fem_transform.json")))
    R = Rotation.from_rotvec(t["rotvec"]).as_matrix()
    s, ch, ca, tr = (np.array(t[k]) for k in ("scale", "hra_center", "atlas_center", "translation"))
    return lambda x: ((x - ch) * s) @ R.T + ca + tr + ORGAN_SHIFT


def finish(pid, v, f, target, smooth_it=1, cat="orgao"):
    v, f = weld(v, f, 6)
    if len(f) > target:
        v, f = decimate_to(v, f, target)
    if smooth_it:
        v = smooth(v, f, smooth_it)
    print(f"{pid:22s} v={len(v):6d} f={len(f):6d}  caixa {v.min(0).round(2)} {v.max(0).round(2)}", flush=True)
    return dict(id=pid, cat=cat, region="tronco", v=v, f=f, elems=[])


def breast_transform(fat_v):
    """Escala real; papila no 4º espaço intercostal (entre as costelas 4 e 5) na linha medioclavicular; base no peitoral maior."""
    body = pack_pieces("body")
    nip_v, _ = nodes([f"mammary-gland-female-left-v1.1.glb"], ["nipple_L"])
    nip = nip_v.mean(0)
    # o plano mediano do Visible Human feminino: entre as duas papilas
    nip_r, _ = nodes([f"mammary-gland-female-right-v1.1.glb"], ["nipple_R"])
    mid_x = (nip[0] + nip_r.mean(0)[0]) / 2
    cla = body["clavicula"][0]
    cla = cla[cla[:, 0] > 0]
    x_mc = (cla[:, 0].min() + cla[:, 0].max()) / 2  # linha medioclavicular
    ys = []
    for k in ("costela_4", "costela_5"):
        r = body[k][0]
        r = r[(np.abs(r[:, 0] - x_mc) < 0.15)]
        r = r[r[:, 2] > np.percentile(r[:, 2], 70)]
        ys.append(r[:, 1].mean())
    target = np.array([x_mc, np.mean(ys), 0.0])
    sc = 10.0

    # x: a papila esquerda vai para a linha medioclavicular e a direita, para a simétrica (escala só em x, pela distância entre as papilas)
    def T(x, dz=0.0):
        y = (x - np.array([mid_x, nip[1], nip[2]])) * sc
        y[:, 0] *= x_mc / ((nip[0] - mid_x) * sc)
        return y + np.array([0.0, target[1], dz])

    # base apoiada no peitoral: para cada ponto da gordura, a face anterior do peitoral logo atrás (raio de 1,5 cm no plano xy)
    pec = np.concatenate([body[k][0] for k in ("peitoral_esternocostal", "peitoral_clav") if k in body])
    tree = cKDTree(pec[:, :2])
    p0 = T(fat_v)
    zwall = np.full(len(p0), np.nan)
    for i, nb in enumerate(tree.query_ball_point(p0[:, :2], 0.15)):
        if nb:
            zwall[i] = pec[nb, 2].max()
    ok = ~np.isnan(zwall)
    # dz tal que só 3 % dos pontos da gordura com peitoral atrás fiquem abaixo da face anterior do músculo
    gap = p0[ok, 2] - zwall[ok]
    dz = -np.percentile(gap, 3) + 0.02
    print(f"mama: linha medioclavicular x={x_mc:.2f}, 4º espaço y={target[1]:.2f}, dz={dz:.2f}, pontos com peitoral atrás {ok.sum()}/{len(ok)}")
    return lambda x: T(x, dz)


def main():
    out = []
    T = organ_transform()
    for pid, (files, names, tris) in ORGANS.items():
        v, f = nodes(files, names)
        out.append(finish(pid, T(v), f, tris))
    fat_v, _ = nodes(["mammary-gland-female-left-v1.1.glb", "mammary-gland-female-right-v1.1.glb"], ["fat_L", "fat_R"])
    TB = breast_transform(fat_v)
    for pid, (names, tris) in BREAST.items():
        v, f = nodes(["mammary-gland-female-left-v1.1.glb", "mammary-gland-female-right-v1.1.glb"], names)
        out.append(finish(pid, TB(v), f, tris))
    v, f = nodes("pelvis-female-v1.3.glb", PELVIS_NODES)
    v = (v - v.mean(0)) * 10.0 + PELVIS_AT
    out.append(finish("pelve_feminina", v, f, 9000, 1, "osso"))
    write_pack(out, "fem")


if __name__ == "__main__":
    main()
