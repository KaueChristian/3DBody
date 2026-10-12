import { MUSCLES } from './catalog-muscles.js';
import { BONES, OTHER_STRUCTURES } from './catalog-bones.js';
import { LIGAMENTS, FASCIAS, GLANDS, SKIN } from './catalog-other.js';
import { BODY_MUSCLES } from './catalog-body-muscles.js';
import { ORAL_MUSCLES } from './catalog-muscles-oral.js';
import { BODY_BONES } from './catalog-body-bones.js';
import { LEG_BONES } from './catalog-leg-bones.js';
import { LEG_MUSCLES } from './catalog-leg-muscles.js';
import { NERVES_LEG } from './catalog-nerves-leg.js';
import { CIRC_ITEMS } from './catalog-circ.js';
import { RESP_ITEMS } from './catalog-resp.js';
import { NERVES as NERVES_BASE } from './catalog-nerves.js';
import { NERVES_CRANIAL } from './catalog-nerves-cranial.js';
import { NERVES_SENSORY } from './catalog-nerves-sensory.js';
import { NERVES_SPINAL } from './catalog-spinal.js';
import { JOINTS, JOINT_LIGAMENTS } from './catalog-joints.js';
import { SEGMENTOS, SEGMENT_ORDER, AMPLOS, PROPRIOCEPTIVOS, segmentLabel } from './segments.js';

/** Camadas, da mais superficial (depth 0) à mais profunda. */
export const LAYERS = [
  { id: 'pele', label: 'Pele', depth: 0, color: '#e6b59c' },
  { id: 'fascia', label: 'Fáscias e aponeuroses', depth: 1, color: '#aebfd3' },
  { id: 'mimica', label: 'Músculos da mímica', depth: 2, color: '#d9533f' },
  { id: 'pescoco', label: 'Platisma e pescoço', depth: 2, color: '#b0654f' },
  { id: 'sup', label: 'Músculos superficiais (tronco e membros)', depth: 2, color: '#d65a45' },
  { id: 'mastigacao', label: 'Músculos da mastigação', depth: 3, color: '#a23b6c' },
  { id: 'med', label: 'Músculos intermediários (tronco e membros)', depth: 3, color: '#b34663' },
  { id: 'profundo', label: 'Planos profundos da cabeça', depth: 4, color: '#8c3350' },
  { id: 'prof', label: 'Músculos profundos (tronco e membros)', depth: 4, color: '#8a3558' },
  { id: 'orbita', label: 'Órbita e olho', depth: 4, color: '#e98a4a' },
  { id: 'nervo', label: 'Nervos', depth: 4, color: '#f2cf55' },
  { id: 'arteria', label: 'Artérias', depth: 4, color: '#d9453d' },
  { id: 'veia', label: 'Veias', depth: 4, color: '#4a74b8' },
  { id: 'coracao', label: 'Coração', depth: 4, color: '#b83a4b' },
  { id: 'respiratorio', label: 'Sistema respiratório', depth: 4, color: '#d98f95' },
  { id: 'articulacao', label: 'Articulações (cápsulas)', depth: 4, color: '#7fb2e8' },
  { id: 'ligamento', label: 'Ligamentos', depth: 4, color: '#f1da8c' },
  { id: 'glandula', label: 'Glândulas e língua', depth: 4, color: '#dba35a' },
  { id: 'cartilagem', label: 'Cartilagens e discos', depth: 4, color: '#a9d0d6' },
  { id: 'osso', label: 'Ossos e dentes', depth: 5, color: '#ece3cc' },
];

/**
 * Camadas visíveis em cada nível de dissecação (0 = pele opaca … 6 = só ossos). Fonte única: a interface, o
 * estado salvo na URL e os testes usam esta mesma fórmula.
 */
export function layersForDissect(v) {
  return LAYERS.filter((l) => (v === 0 ? true : v === 1 ? l.id !== 'fascia' : l.depth >= v - 1)).map((l) => l.id);
}

export const KIND_LABEL = {
  musculo: 'Músculo',
  nervo: 'Nervo',
  osso: 'Osso',
  ligamento: 'Ligamento',
  articulacao: 'Articulação',
  fascia: 'Fáscia / aponeurose',
  glandula: 'Glândula',
  cardiaco: 'Estrutura cardíaca',
  orgao: 'Órgão',
  arteria: 'Artéria',
  veia: 'Veia',
  estrutura: 'Estrutura',
};

export const REGIONS = {
  todos: 'Corpo',
  cabeca: 'Cabeça e pescoço',
  tronco: 'Tronco',
  membro_sup: 'Membro superior',
  membro_inf: 'Membro inferior',
};

/** A estrutura pertence à região? (`region` pode ser uma lista, como nos nervos que cruzam regiões.) */
export function inRegion(item, region) {
  if (region === 'todos' || item.region === 'todos') return true;
  return Array.isArray(item.region) ? item.region.includes(region) : item.region === region;
}

const HEAD_ITEMS = [SKIN, ...FASCIAS, ...MUSCLES, ...LIGAMENTS, ...GLANDS, ...OTHER_STRUCTURES, ...BONES].map((i) => ({
  region: i.id === 'pele' ? 'todos' : 'cabeca',
  ...i,
}));
export const HEAD_IDS = new Set(HEAD_ITEMS.map((i) => i.id));
export const BODY_ITEMS = [...BODY_MUSCLES, ...ORAL_MUSCLES, ...BODY_BONES, ...JOINTS, ...JOINT_LIGAMENTS];
/** Estruturas do membro inferior (F4): vêm do pacote `anatomy-leg.js`, carregado depois do corpo. */
export const LEG_ITEMS = [...LEG_BONES, ...LEG_MUSCLES];
export { CIRC_ITEMS, RESP_ITEMS };
export const NERVES = [...NERVES_BASE, ...NERVES_CRANIAL, ...NERVES_SENSORY, ...NERVES_SPINAL, ...NERVES_LEG];
export const ITEMS = [...HEAD_ITEMS, ...BODY_ITEMS, ...LEG_ITEMS, ...CIRC_ITEMS, ...RESP_ITEMS, ...NERVES];

// ramos articulares (F3): a articulação diz quais nervos a inervam e o nervo ganha o ramo (sem desenhar: é só o vínculo)
{
  const byId = new Map(NERVES.map((n) => [n.id, n]));
  for (const j of JOINTS) {
    for (const nid of j.nervos) {
      const n = byId.get(nid);
      if (!n) throw new Error(`Articulação ${j.id} cita nervo inexistente: ${nid}`);
      n.ramos = [...(n.ramos ?? []), { m: j.id, obs: 'ramo articular', sens: true, semRamo: true }];
    }
  }
}

/**
 * Inervação: estrutura → nervos que a inervam (derivado de `ramos` de cada nervo).
 * @type {Map<string, {nervo: string, obs?: string, sens?: boolean}[]>}
 */
export const INNERVATION = new Map();
for (const n of NERVES) {
  for (const r of n.ramos ?? []) {
    if (!INNERVATION.has(r.m)) INNERVATION.set(r.m, []);
    INNERVATION.get(r.m).push({ nervo: n.id, obs: r.obs, sens: r.sens });
  }
}

// guardas: identificadores únicos, ramos apontando para estruturas existentes e todo músculo com nervo
{
  const seen = new Set();
  for (const i of ITEMS) {
    if (seen.has(i.id)) throw new Error(`Identificador duplicado no catálogo: ${i.id}`);
    seen.add(i.id);
  }
  for (const id of INNERVATION.keys()) if (!seen.has(id)) throw new Error(`Nervo aponta para estrutura inexistente: ${id}`);
  const semNervo = ITEMS.filter((i) => i.kind === 'musculo' && !INNERVATION.has(i.id)).map((i) => i.id);
  if (semNervo.length) throw new Error(`Músculos sem nervo no catálogo: ${semNervo.join(', ')}`);
  // circulatório (F5): `relacionados` só cita estruturas do catálogo, e toda artéria e veia diz de onde vem, por onde vai e o que irriga ou drena
  const CIRC_KINDS = new Set(['cardiaco', 'arteria', 'veia', 'estrutura', 'orgao', 'osso']);
  for (const i of [...CIRC_ITEMS, ...RESP_ITEMS]) {
    if (!CIRC_KINDS.has(i.kind)) throw new Error(`Tipo inesperado no circulatório: ${i.id} (${i.kind})`);
    for (const r of i.relacionados ?? []) if (!seen.has(r)) throw new Error(`Estrutura relacionada inexistente em ${i.id}: ${r}`);
    if ((i.kind === 'arteria' || i.kind === 'veia') && (i.campos.length < 4 || i.campos.some(([, t]) => !t))) throw new Error(`Ficha incompleta no vaso ${i.id}`);
  }
  // a ligação vale nos dois sentidos: quem é citado também passa a citar (circulatório e respiratório se ligam pelos vasos pulmonares)
  const linked = [...CIRC_ITEMS, ...RESP_ITEMS];
  const circById = new Map(linked.map((i) => [i.id, i]));
  for (const i of linked) {
    for (const r of i.relacionados ?? []) {
      const t = circById.get(r);
      if (!t) throw new Error(`Estrutura relacionada fora do circulatório e do respiratório em ${i.id}: ${r}`);
      t.relacionados ??= [];
      if (!t.relacionados.includes(i.id)) t.relacionados.push(i.id);
    }
  }
}

// segmentos medulares (F2.14): campo estruturado `segmentos` + linha na ficha; guardas de coerência
{
  const byId = new Map(ITEMS.map((i) => [i.id, i]));
  for (const [id, segs] of Object.entries(SEGMENTOS)) {
    const item = byId.get(id);
    if (!item) throw new Error(`Segmentos de estrutura inexistente: ${id}`);
    const bad = segs.filter((s) => !SEGMENT_ORDER.includes(s));
    if (bad.length) throw new Error(`Segmento inválido em ${id}: ${bad.join(', ')}`);
    item.segmentos = segs;
    const nota = PROPRIOCEPTIVOS.has(id) ? ' (só proprioceptivos; a parte motora é do nervo acessório)' : AMPLOS.has(id) ? ' (inervação segmentar regional, não é um miótomo clínico)' : '';
    item.campos = [...item.campos, ['Segmentos medulares', segmentLabel(segs) + nota]];
  }
  // todo músculo inervado por um nervo espinal tem de dizer os seus segmentos
  const semSegmento = ITEMS.filter((i) => i.kind === 'musculo' && !i.segmentos
    && (INNERVATION.get(i.id) ?? []).some((l) => SEGMENTOS[l.nervo]));
  if (semSegmento.length) throw new Error(`Músculos sem segmentos medulares: ${semSegmento.map((i) => i.id).join(', ')}`);
}

/**
 * Articulações (F3): movimentos de cada músculo e articulações de cada osso e ligamento, derivados das fichas das articulações.
 * @type {Map<string, {art: string, mov: string, papel: 'principal'|'auxiliar'}[]>}
 */
export const MOVEMENTS = new Map();
/** Osso ou ligamento → articulações de que faz parte. @type {Map<string, string[]>} */
export const JOINTS_OF = new Map();
{
  const byId = new Map(ITEMS.map((i) => [i.id, i]));
  const kindOf = (id) => byId.get(id)?.kind;
  for (const j of JOINTS) {
    // a cápsula só pode usar peças dos ossos citados: assim a geometria e o texto não divergem
    const parts = new Set();
    for (const o of j.ossos) {
      if (kindOf(o) !== 'osso') throw new Error(`Articulação ${j.id} cita osso inexistente: ${o}`);
      for (const p of byId.get(o).parts ?? []) parts.add(p.id);
    }
    const used = new Set();
    const walk = (spec) => {
      if (spec.kind === 'group') spec.of.forEach(walk);
      else if (spec.kind === 'capsule') [...spec.a, ...spec.b].forEach((p) => used.add(p));
    };
    j.proc.forEach(walk);
    const alheias = [...used].filter((p) => !parts.has(p));
    if (alheias.length) throw new Error(`Cápsula de ${j.id} usa peças fora dos ossos citados: ${alheias.join(', ')}`);
    // “toda articulação cita ≥ 2 ossos”: conta ossos do catálogo ou, dentro de um grupo (carpo, falanges), as peças
    if (j.ossos.length < 2 && used.size < 2) throw new Error(`Articulação ${j.id} cita menos de dois ossos`);
    for (const l of j.ligamentos) if (kindOf(l) !== 'ligamento') throw new Error(`Articulação ${j.id} cita ligamento inexistente: ${l}`);
    for (const id of [...j.ossos, ...j.ligamentos]) {
      if (!JOINTS_OF.has(id)) JOINTS_OF.set(id, []);
      JOINTS_OF.get(id).push(j.id);
    }
    for (const m of j.movimentos) {
      for (const [papel, list] of [['principal', m.agon], ['auxiliar', m.sin]]) {
        for (const mid of list) {
          if (kindOf(mid) !== 'musculo') throw new Error(`Movimento "${m.mov}" de ${j.id} cita músculo inexistente: ${mid}`);
          if (!MOVEMENTS.has(mid)) MOVEMENTS.set(mid, []);
          MOVEMENTS.get(mid).push({ art: j.id, mov: m.mov, papel });
        }
      }
    }
    // linha de texto da ficha (busca, impressão e quiz); a lista com os músculos é desenhada pela interface
    const txt = j.movimentos.map((m) => (m.amp ? `${m.mov} (${m.amp})` : m.mov)).join('; ');
    if (txt) j.campos.splice(4, 0, ['Movimentos e amplitude', `${txt}.`]);
  }
}
