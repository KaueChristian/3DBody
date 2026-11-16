"""Ajusta a pelve feminina do HRA (Visible Human feminino, em metros) à pelve do atlas (BodyParts3D, 1 unidade = 10 cm).

Os GLB do útero, das tubas, dos ovários e da pelve feminina do HRA estão no **mesmo referencial** (o corpo do Visible Human feminino):
as tubas encostam nos cornos do útero, os ovários ficam junto às fímbrias e a sínfise púbica cai no plano mediano do útero. Por isso
basta uma transformação, calculada pelos ossos, para levar os órgãos à pelve do atlas.

O corpo do atlas é masculino: a pelve é mais estreita e mais alta que a feminina. O ajuste é uma semelhança com **escala por eixo**,
rotação e translação que minimiza a distância (nos dois sentidos, com corte robusto) entre a superfície dos ossos do quadril e do sacro
do HRA e a dos ossos do atlas. O cóccix fica de fora (o atlas o junta ao sacro). Depois disso, um termo pequeno afasta o útero da
bexiga e do reto do atlas, que não são os da mesma pessoa (a bexiga do BodyParts3D está vazia e o reto, cheio).

Resultado em fem_transform.json (lido por convert_fem.py). Uso (em tools/):  python fit_fem.py
"""
import json
import os

import numpy as np
from scipy.optimize import minimize
from scipy.spatial import cKDTree
from scipy.spatial.transform import Rotation

from convert_hra import meshes_by_node
from fit_hra import pack_pieces

HERE = os.path.dirname(os.path.abspath(__file__))
PELVIS = os.path.join(HERE, "hra", "pelvis-female-v1.3.glb")
UTERUS = os.path.join(HERE, "hra", "uterus-female-v1.2.glb")
BONES = ["sacrum", "ilium_compact_bone_L", "ilium_compact_bone_R", "ischium_compact_bone_L", "ischium_compact_bone_R",
         "pubis_compact_bone_L", "pubis_compact_bone_R"]


def sample(v, f, n, rng):
    """Pontos sorteados na superfície, com peso pela área (as malhas têm densidades muito diferentes)."""
    tri = v[f]
    area = 0.5 * np.linalg.norm(np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0]), axis=1)
    k = rng.choice(len(f), n, p=area / area.sum())
    a, b = rng.random(n), rng.random(n)
    flip = a + b > 1
    a[flip], b[flip] = 1 - a[flip], 1 - b[flip]
    t = tri[k]
    return t[:, 0] + a[:, None] * (t[:, 1] - t[:, 0]) + b[:, None] * (t[:, 2] - t[:, 0])


def make(p, ch, ca):
    R = Rotation.from_rotvec(p[:3]).as_matrix()
    s = p[3:6]
    t = p[6:9]
    return lambda x: ((x - ch) * s) @ R.T + ca + t


def main():
    rng = np.random.default_rng(7)
    hra = meshes_by_node(PELVIS)
    hv = np.concatenate([sample(*hra[f"VH_F_{b}"], 1400, rng) for b in BONES])
    body = pack_pieces("body")
    av = np.concatenate([sample(*body["osso_quadril"], 6000, rng), sample(*body["sacro"], 2500, rng)])
    tree_a = cKDTree(av)
    ch, ca = hv.mean(0), av.mean(0)

    ut = meshes_by_node(UTERUS)
    uv = np.concatenate([sample(v, f, 300, rng) for v, f in ut.values()])
    urin, dig = pack_pieces("urin"), pack_pieces("digest")
    soft = {"bexiga": urin["bexiga_urinaria"], "reto": dig["reto"]}
    soft_pts = {k: sample(*vf, 1500, rng) for k, vf in soft.items()}
    soft_c = {k: p.mean(0) for k, p in soft_pts.items()}
    soft_r = {k: np.percentile(np.linalg.norm(p - soft_c[k], axis=1), 60) for k, p in soft_pts.items()}

    def huber(d, c=0.25):
        return np.where(d < c, d * d, 2 * c * d - c * c)

    def cost(p, with_soft=True):
        T = make(p, ch, ca)
        hv2 = T(hv)
        d1, _ = tree_a.query(hv2)
        d2, _ = cKDTree(hv2).query(av)
        c = huber(d1).mean() + huber(d2).mean()
        # a pelve masculina é mais estreita: não deixa a escala fugir demais da proporção real (10 = metros → 1 unidade = 10 cm)
        c += 0.02 * np.sum((np.log(p[3:6] / 10.0)) ** 2)
        if with_soft:
            u2 = T(uv)
            for k in soft:
                dd = np.linalg.norm(u2 - soft_c[k], axis=1)
                c += 0.5 * np.mean(np.clip(soft_r[k] - dd, 0, None) ** 2)
        return c

    p0 = np.array([0, 0, 0, 10, 10, 10, 0, 0, 0], dtype=np.float64)
    best = None
    for rx in (-0.35, -0.15, 0.0, 0.15, 0.35):
        p = p0.copy()
        p[0] = rx
        r = minimize(cost, p, args=(False,), method="Powell", options=dict(maxiter=6000, xtol=1e-4, ftol=1e-7))
        print(f"início rx={rx:+.2f} → custo {r.fun:.5f}", flush=True)
        if best is None or r.fun < best.fun:
            best = r
    r = minimize(cost, best.x, method="Powell", options=dict(maxiter=8000, xtol=1e-5, ftol=1e-8))
    p = r.x
    T = make(p, ch, ca)
    d1, _ = tree_a.query(T(hv))
    print("rotação (graus):", np.degrees(Rotation.from_rotvec(p[:3]).as_euler("xyz")).round(1))
    print("escala por eixo:", p[3:6].round(3), "· distância osso→osso: mediana", np.median(d1).round(3), "p90", np.percentile(d1, 90).round(3))
    u2 = T(uv)
    print("útero no atlas:", u2.min(0).round(3), u2.max(0).round(3))
    for k in soft:
        print(f"  pontos do útero dentro do raio de {k}:", int((np.linalg.norm(u2 - soft_c[k], axis=1) < soft_r[k]).sum()), "de", len(u2))
    out = dict(rotvec=p[:3].tolist(), scale=p[3:6].tolist(), translation=p[6:9].tolist(), hra_center=ch.tolist(), atlas_center=ca.tolist())
    json.dump(out, open(os.path.join(HERE, "fem_transform.json"), "w"), indent=1)
    print("fem_transform.json gravado")


if __name__ == "__main__":
    main()
