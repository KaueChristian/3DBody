"""Ajusta os pulmões do HRA (Visible Human masculino, em metros) ao tórax do atlas (BodyParts3D, 1 unidade = 10 cm).

Os dois corpos não são o mesmo: o tórax do BodyParts3D é de uma pessoa viva (cavidade maior, pulmões cheios) e o Visible Human é um
cadáver (pulmões menores). Por isso o ajuste é uma transformação com **escala por eixo** e translação (sem rotação: os dois estão na
posição anatômica, x para a esquerda do sujeito, y para cima, z para a frente), que minimiza:
  · a distância da base dos lobos inferiores ao diafragma;
  · a distância das faces lateral, posterior e anterior às costelas, às cartilagens costais, ao esterno e à coluna;
  · o quanto os pulmões passam para fora do envelope interno da caixa torácica;
  · o quanto os pulmões entram no coração (o encaixe é a incisura cardíaca do pulmão esquerdo);
  · a distância do ápice à 1ª costela e a dos hilos às pontas das artérias pulmonares.
Resultado em hra_transform.json (lido por convert_hra.py). Uso (em tools/):  python fit_hra.py
"""
import json
import os

import numpy as np
from scipy.optimize import minimize
from scipy.spatial import ConvexHull, cKDTree

import re

from convert_body import load_pack
from convert_hra import PIECES, SOURCES, HERE, meshes_by_node

DIST = os.path.join(HERE, "..", "dist")


def pack_pieces(pack):
    manifest, blob = load_pack(os.path.join(DIST, f"anatomy-{pack}.js"))
    out = {}
    for m in manifest:
        q = np.frombuffer(blob, dtype=np.uint16, count=m["nv"] * 3, offset=m["ov"]).reshape(-1, 3).astype(np.float64)
        lo, hi = np.array(m["lo"]), np.array(m["hi"])
        v = lo + q / 65535.0 * (hi - lo)
        f = np.frombuffer(blob, dtype=np.uint32 if m["i32"] else np.uint16, count=m["ni"], offset=m["oi"]).reshape(-1, 3).astype(np.int64)
        out[m["id"]] = (v, f)
    return out


def cloud(items):
    """Vértices e centros das faces: nuvem densa o bastante para consultas de distância."""
    pts = [np.concatenate([v, v[f].mean(1)]) for v, f in items]
    return np.concatenate(pts)


def main():
    body, circ = pack_pieces("body"), pack_pieces("circ")
    ribs = cloud([body[f"costela_{i}"] for i in range(1, 13)])
    cart = cloud([body[f"cartilagem_costal_{i}"] for i in range(1, 8)])
    stern = cloud([body[k] for k in ("esterno_manubrio", "esterno_corpo", "esterno_xifoide")])
    vert = cloud([body[f"vertebra_t{i}"] for i in range(1, 13)])
    diaph = cloud([body["diafragma"]])
    rib1 = cloud([body["costela_1"]])
    heart_v = np.concatenate([circ[k][0] for k in circ if k.startswith(("cor_parede", "valva"))])
    heart = ConvexHull(heart_v[np.random.default_rng(2).choice(len(heart_v), size=min(len(heart_v), 1500), replace=False)])
    pa = {s: circ[f"arteria_pulmonar_{'direita' if s == 'd' else 'esquerda'}"][0] for s in "de"}
    tips = {s: pa[s][np.argsort(np.abs(pa[s][:, 0]))[-max(8, len(pa[s]) // 8):]].mean(0) for s in "de"}

    # pulmões do HRA, em metros
    nodes = meshes_by_node(os.path.join(HERE, SOURCES["lung-male"][0]))
    allv = []
    for pid, (src, pats) in PIECES.items():
        for name, (v, f) in nodes.items():
            if any(re.fullmatch(p, name) for p in pats):
                allv.append(v)
    L = np.unique(np.round(np.concatenate(allv), 5), axis=0)
    hil = {s: np.concatenate([nodes[n][0] for n in nodes if n.startswith("VH_M_hilum") and n.endswith("_" + suf)]).mean(0) for s, suf in (("d", "R"), ("e", "L"))}

    y0, y1 = L[:, 1].min(), L[:, 1].max()
    right, left = L[:, 0] < 0.004, L[:, 0] >= 0.004
    base = np.where(L[:, 1] < y0 + 0.12 * (y1 - y0))[0]
    lat = np.where((np.abs(L[:, 0] - 0.004) > np.quantile(np.abs(L[:, 0] - 0.004), 0.93)))[0]
    post = np.where(L[:, 2] < np.quantile(L[:, 2], 0.07))[0]
    ant = np.where(L[:, 2] > np.quantile(L[:, 2], 0.93))[0]
    apex = np.where(L[:, 1] > y1 - 0.02 * (y1 - y0))[0]
    notch = np.where(left & (L[:, 2] > np.quantile(L[:, 2], 0.5)))[0]

    # contenção e coração só precisam de uma amostra dos pontos (a avaliação roda milhares de vezes)
    rng = np.random.default_rng(1)
    samp = rng.choice(len(L), size=min(len(L), 900), replace=False)
    notch = samp
    t_ribs, t_cart, t_stern, t_vert, t_diaph = (cKDTree(c) for c in (ribs, cart, stern, vert, diaph))
    t_front = cKDTree(np.concatenate([ribs, cart, stern]))
    t_back = cKDTree(np.concatenate([ribs, vert]))
    cage = np.concatenate([ribs, cart, stern, vert])
    # envelope interno em coordenadas cilíndricas em volta do eixo do tórax
    x0 = 0.0
    z0 = float((cage[:, 2].min() + cage[:, 2].max()) / 2)
    NT, YB = 48, 0.35
    ys = np.arange(cage[:, 1].min() - 1e-6, rib1[:, 1].max() + YB, YB)
    cth = np.arctan2(cage[:, 0] - x0, cage[:, 2] - z0)
    cr = np.hypot(cage[:, 0] - x0, cage[:, 2] - z0)
    cit = ((cth + np.pi) / (2 * np.pi) * NT).astype(int) % NT
    ciy = np.clip(((cage[:, 1] - ys[0]) / YB).astype(int), 0, len(ys) - 1)
    env = np.full((len(ys), NT), np.nan)
    for r_, t_, y_ in zip(cr, cit, ciy):
        if np.isnan(env[y_, t_]) or r_ < env[y_, t_]:
            env[y_, t_] = r_
    for iy in range(len(ys)):  # lacunas: usa a menor vizinhança angular
        row = env[iy]
        for it in range(NT):
            if np.isnan(row[it]):
                ring = [row[(it + k) % NT] for k in range(-3, 4)]
                ring = [x for x in ring if not np.isnan(x)]
                env[iy, it] = min(ring) if ring else 9.0
    top_cage = rib1[:, 1].max()

    def place(p, x):
        return L * x[:3] + x[3:]

    import time
    calls = [0, time.time()]

    def cost(x, report=False):
        calls[0] += 1
        if calls[0] % 200 == 0:
            print(f'  {calls[0]} avaliacoes, {time.time() - calls[1]:.0f}s', flush=True)
        if np.any(x[:3] < 6) or np.any(x[:3] > 16):
            return 1e6
        P = place(None, x)
        terms = {}
        terms["base-diafragma"] = np.mean((t_diaph.query(P[base])[0] - 0.07) ** 2)
        terms["lateral-costelas"] = np.mean((t_ribs.query(P[lat])[0] - 0.10) ** 2)
        terms["posterior"] = np.mean((t_back.query(P[post])[0] - 0.10) ** 2)
        terms["anterior"] = np.mean((t_front.query(P[ant])[0] - 0.12) ** 2)
        terms["apice"] = (P[apex, 1].mean() - (top_cage + 0.25)) ** 2
        # contenção
        Ps = P[samp]
        inside = Ps[:, 1] < top_cage
        th = np.arctan2(Ps[:, 0] - x0, Ps[:, 2] - z0)
        r = np.hypot(Ps[:, 0] - x0, Ps[:, 2] - z0)
        it_ = ((th + np.pi) / (2 * np.pi) * NT).astype(int) % NT
        iy_ = np.clip(((Ps[:, 1] - ys[0]) / YB).astype(int), 0, len(ys) - 1)
        over = np.maximum(0, r - (env[iy_, it_] - 0.05)) * inside
        terms["contencao"] = np.mean(over ** 2) * 6
        # coração: profundidade dentro do casco
        depth = -(Ps @ heart.equations[:, :3].T + heart.equations[:, 3]).max(1)
        terms["coracao"] = np.mean(np.maximum(0, depth - 0.04) ** 2) * 6
        # hilos
        hp = {s: hil[s] * x[:3] + x[3:] for s in "de"}
        terms["hilos"] = 0.4 * sum(np.sum((hp[s] - tips[s]) ** 2) for s in "de") / 2
        terms["forma"] = 0.02 * ((x[0] / x[2] - 1) ** 2 + (x[1] / x[0] - 1.1) ** 2)
        total = sum(terms.values())
        if report:
            return total, terms
        return total

    print('pontos:', len(L), 'amostra', len(samp), 'facetas do coracao', len(heart.equations), flush=True)
    best = None
    for s0 in (9.5, 11.5):
        t0 = np.array([0.0, -3.0, 0.2]) - (L.mean(0) * s0)
        x0_ = np.concatenate([[s0, s0, s0], t0 + np.array([0, 0.3, 0])])
        res = minimize(cost, x0_, method="Powell", options=dict(xtol=1e-4, ftol=1e-9, maxiter=6000))
        res = minimize(cost, res.x, method="Nelder-Mead", options=dict(xatol=1e-4, fatol=1e-9, maxiter=2500))
        if best is None or res.fun < best.fun:
            best = res
        print(f"início s={s0:4.1f} -> custo {res.fun:.5f}  escala {np.round(res.x[:3], 2)}  t {np.round(res.x[3:], 2)}", flush=True)
    x = best.x
    total, terms = cost(x, True)
    print("termos:", {k: round(float(v), 5) for k, v in terms.items()})
    P = place(None, x)
    print("pulmões no atlas: x", P[:, 0].min().round(2), P[:, 0].max().round(2), "y", P[:, 1].min().round(2), P[:, 1].max().round(2), "z", P[:, 2].min().round(2), P[:, 2].max().round(2))
    json.dump({"scale": [round(float(v), 4) for v in x[:3]], "translation": [round(float(v), 4) for v in x[3:]],
               "nota": "ajustado por fit_hra.py (escala por eixo): diafragma, costelas, contenção na caixa torácica, coração e hilos"},
              open(os.path.join(HERE, "hra_transform.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
