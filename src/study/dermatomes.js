/**
 * Dermátomos sobre a pele (F2.15) — esquemáticos.
 *
 * Decisão do spike (2026-10): pintar a malha da pele por **cor de vértice**, em vez de usar textura. A pele não tem
 * coordenadas de textura, uma textura exigiria um mapeamento novo (e um arquivo de imagem a mais, num app que abre por
 * `file://` e precisa caber no orçamento de dados), e as faixas dos dermátomos seguem a anatomia do próprio corpo
 * (costelas, eixo do membro), que a classificação por vértice resolve direto. O custo é uma passada única pelos 55 mil
 * vértices (≈ 10 ms) e a resolução das bordas, que é a da malha.
 *
 * O mapa é **esquemático**: ver `docs/dermatomos.md`. Os dermátomos reais se sobrepõem e variam entre as pessoas e entre as
 * fontes (Keegan e Garrett, Foerster, os mapas de Moore e do Netter diferem); aqui se segue o mapa de Moore/Netter, e as
 * bordas são linhas nítidas por simplicidade. No tronco, cada faixa desce da coluna para a frente (acompanha a costela);
 * nos membros, as faixas seguem a sequência C5–T2 do lado radial para o ulnar. Não há membros inferiores no modelo.
 *
 * O que o modelo cobre: cabeça (divisões do trigêmeo V1–V3, e C2–C3 atrás), pescoço (C2–C4), ombro (C4–C5), braço, antebraço
 * e mão (C5–T2), tronco (T2–L1 na frente; T2–S3 atrás).
 */
import * as THREE from 'three';
import { segmentColor } from './coloring.js';

const V_COLOR = { V1: '#f472b6', V2: '#fb923c', V3: '#a3e635' };
export const DERM_LABEL = {
  V1: 'V1 · nervo oftálmico', V2: 'V2 · nervo maxilar', V3: 'V3 · nervo mandibular',
};
export const dermColor = (d) => V_COLOR[d] ?? segmentColor(d);

/** Rótulos possíveis, na ordem em que viram índice no vetor de rótulos. */
const NAMES = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'V1', 'V2', 'V3'];

const smooth = (t) => t * t * (3 - 2 * t);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Centros das faixas do tronco (y): na coluna (trás) e na linha mediana anterior (frente). */
const BAND = [
  ['T2', -1.96, -2.05], ['T3', -2.17, -2.4], ['T4', -2.39, -3.0], ['T5', -2.63, -3.35], ['T6', -2.88, -3.7], ['T7', -3.15, -4.05],
  ['T8', -3.41, -4.45], ['T9', -3.67, -4.9], ['T10', -3.94, -5.45], ['T11', -4.22, -5.85], ['T12', -4.54, -6.25],
  ['L1', -4.84, -6.65], ['L2', -5.11, -7.1], ['L3', -5.44, -7.5], ['L4', -5.78, -7.9], ['L5', -6.1, -8.3],
  ['S1', -6.4, -8.7], ['S2', -6.7, -9.1], ['S3', -7.0, -9.5],
];

/** Eixo do membro superior esquerdo: úmero (cabeça e côndilos), punho, 3º metacarpal e ponta do 3º dedo (medidos nos ossos). */
const AXIS = [[1.68, -2.12, -0.08], [2.09, -4.92, -0.15], [2.45, -7.22, 0.3], [2.65, -8.1, 0.5], [2.76, -8.8, 1.05]];
// raio do tubo de cada trecho do eixo (braço, antebraço, punho–metacarpo, dedos); a mão é larga: o polegar e o mínimo ficam a ~0,5 do eixo
const AXIS_R = [0.62, 0.5, 0.65, 0.65];

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _p = new THREE.Vector3();
const AX = AXIS.map((q) => new THREE.Vector3(...q));

/** Segmento do eixo mais próximo: { i, t (0–1 ao longo do segmento), d (distância), c (ponto do eixo) }. */
function nearestAxis(p) {
  let best = null;
  for (let i = 0; i < AX.length - 1; i++) {
    _a.copy(AX[i + 1]).sub(AX[i]);
    const t = clamp(_p.copy(p).sub(AX[i]).dot(_a) / _a.lengthSq());
    _b.copy(AX[i]).addScaledVector(_a, t);
    const d = p.distanceTo(_b);
    if (!best || d < best.d) best = { i, t, d, c: _b.clone() };
  }
  return best;
}

/** Dermátomo da cabeça (|x| espelhado), em coordenadas do modelo (x esquerda, y cima, z frente). */
function head(x, y, z) {
  if (z < -0.15) return y > -0.5 ? 'C2' : y > -0.85 ? 'C2' : 'C3'; // occipício e nuca alta
  const lat = x > 0.62 && z >= -0.15 && z < 0.25; // pavilhão da orelha e região da mastoide
  if (lat) return y > -0.35 ? 'C2' : 'C3';
  if (y > 0.02 && z >= 0.0) return 'V1'; // fronte e couro cabeludo anterior até o vértice
  if (x > 0.5 && z < 0.3 && y > -0.62) return 'V3'; // têmpora posterior: auriculotemporal
  if (x > 0.5 && z < 0.7 && y > -0.2) return 'V2'; // têmpora anterior: zigomaticotemporal
  if (x < 0.14 && z > 1.0 && y > -0.62) return 'V1'; // dorso e ponta do nariz (ramo nasal externo)
  if (y > -0.17) return 'V1'; // pálpebra superior e raiz do nariz
  if (y > -0.8 && !(x > 0.5 && z < 0.4 && y < -0.55)) return 'V2'; // pálpebra inferior, bochecha, lábio superior
  return 'V3'; // lábio inferior, queixo, ângulo e ramo da mandíbula
}

/** Dermátomo do tronco/pescoço (sem os membros) por faixas oblíquas. */
function trunk(x, y, z) {
  // pescoço: C2–C4
  if (y > -1.85 && Math.abs(x) < 1.4) {
    if (z < -0.15) return y > -0.85 ? 'C2' : y > -1.25 ? 'C3' : 'C4';
    return y > -1.35 ? 'C3' : 'C4';
  }
  // parte dorsal e ventral do tronco: ângulo em torno do eixo do tronco (0 atrás, π na frente)
  const theta = Math.atan2(Math.abs(x), -(z - 0.15));
  const s = smooth(clamp(theta / Math.PI));
  let best = null;
  for (const [d, yb, yf] of BAND) {
    const yc = yb + (yf - yb) * s;
    const dd = Math.abs(y - yc);
    if (!best || dd < best.dd) best = { d, dd };
  }
  return best.d;
}

/** Dermátomo do membro superior (vértice já considerado do membro), pelo ângulo ao redor do eixo e pela posição ao longo dele. */
function limb(p, ax) {
  const rel = _p.copy(p).sub(ax.c);
  const phi = Math.atan2(rel.z, rel.x) * (180 / Math.PI); // 0 lateral, +90 anterior, ±180 medial, −90 posterior
  const medial = phi > 100 || phi < -110;
  const along = ax.i + ax.t; // 0 ombro … 1 cotovelo … 2 punho … 3 dedos
  if (along < 1) {
    // braço: metade lateral C5; metade medial T2 (proximal) e T1 (distal)
    return Math.abs(phi) <= 90 ? 'C5' : along < 0.55 ? 'T2' : 'T1';
  }
  if (along < 2) {
    // antebraço: lateral C6, centro C7 (posterior e uma faixa anterior estreita), medial T1 (proximal) e C8 (distal)
    if (medial) return along < 1.5 ? 'T1' : 'C8';
    if (phi > -45 && phi <= 75) return 'C6';
    return 'C7';
  }
  // mão e dedos: pela posição transversal (polegar e indicador C6, médio C7, anular e mínimo C8)
  return p.x >= 2.88 ? 'C6' : p.x >= 2.6 ? 'C7' : 'C8';
}

/** Classifica um vértice da pele do corpo. `p` em coordenadas do modelo (lado esquerdo e direito). */
export function dermatomeOf(x, y, z, tmp = new THREE.Vector3()) {
  const ax = Math.abs(x);
  if (y > -1.15 || (y > -1.5 && z < -0.15 && ax < 0.9)) return head(ax, y, z);
  tmp.set(ax, y, z);
  // ombro: acima da cabeça do úmero, junto ao pescoço, C4; mais lateral e abaixo, C5
  const wall = y > -4.7 ? 1.45 : 1.6;
  if (ax > 1.15 && y > -2.2) return ax < 1.62 && y > -1.9 ? 'C4' : 'C5';
  if (ax > wall) {
    const near = nearestAxis(tmp);
    // abaixo da cintura só restam os membros: o tronco da pele termina em y ≈ −6,9
    if (y < -6.95 || near.d < (AXIS_R[near.i] ?? 0.4) * 1.12) return limb(tmp, near);
  }
  return trunk(ax, y, z);
}

export class DermatomeOverlay {
  /** @param {object} app interface do main.js (M, state, setColorOverrides…) */
  constructor(app) {
    this.app = app;
    this.on = false;
    this.labels = null; // Uint8Array: índice na lista `names` de cada vértice
    this.names = [];
    this.geo = null;
    this.prev = null; // opacidade da pele antes de ligar
  }

  skin() { return this.app.M.get('pele'); }

  /** Calcula o rótulo de cada vértice da pele do corpo (uma vez por geometria). */
  prepare() {
    const sk = this.skin();
    const geo = sk?.meshes[0]?.geometry;
    if (!geo || !this.app.state.bodyReady) return false;
    if (this.geo === geo) return true;
    const pos = geo.attributes.position;
    const names = NAMES;
    const idx = new Map(names.map((n, i) => [n, i]));
    const labels = new Uint8Array(pos.count);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const d = dermatomeOf(pos.getX(i), pos.getY(i), pos.getZ(i), tmp);
      labels[i] = idx.get(d) ?? 0;
    }
    this.labels = labels;
    this.names = names;
    this.geo = geo;
    if (!geo.attributes.color) geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3));
    return true;
  }

  /** Dermátomos presentes e a contagem de vértices (para a legenda). */
  legend() {
    if (!this.labels) return [];
    const n = new Map();
    for (const l of this.labels) n.set(l, (n.get(l) ?? 0) + 1);
    return this.names.map((d, i) => ({ key: d, label: DERM_LABEL[d] ?? d, color: dermColor(d), n: n.get(i) ?? 0 })).filter((e) => e.n > 0);
  }

  /** Pinta (ou limpa) a pele. `segment` destaca uma faixa e esmaece as outras. */
  update(segment) {
    const sk = this.skin();
    if (!sk) return;
    const mat = sk.mats[0];
    if (!this.on || !this.prepare()) {
      mat.vertexColors = false;
      mat.needsUpdate = true;
      return;
    }
    const col = this.geo.attributes.color;
    const palette = this.names.map((d) => {
      const c = new THREE.Color(dermColor(d));
      if (segment && d !== segment) c.lerp(new THREE.Color('#c9b8a8'), 0.8); // esmaece as outras (cor da pele)
      return c;
    });
    for (let i = 0; i < this.labels.length; i++) {
      const c = palette[this.labels[i]];
      col.setXYZ(i, c.r, c.g, c.b);
    }
    col.needsUpdate = true;
    mat.vertexColors = true;
    mat.needsUpdate = true;
  }
}
