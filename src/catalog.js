import { MUSCLES } from './catalog-muscles.js';
import { BONES, OTHER_STRUCTURES } from './catalog-bones.js';
import { LIGAMENTS, FASCIAS, GLANDS, SKIN } from './catalog-other.js';
import { BODY_MUSCLES } from './catalog-body-muscles.js';
import { ORAL_MUSCLES } from './catalog-muscles-oral.js';
import { BODY_BONES } from './catalog-body-bones.js';
import { NERVES as NERVES_BASE } from './catalog-nerves.js';
import { NERVES_CRANIAL } from './catalog-nerves-cranial.js';
import { NERVES_SENSORY } from './catalog-nerves-sensory.js';
import { NERVES_SPINAL } from './catalog-spinal.js';
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
  fascia: 'Fáscia / aponeurose',
  glandula: 'Glândula',
  estrutura: 'Estrutura',
};

export const REGIONS = {
  todos: 'Corpo',
  cabeca: 'Cabeça e pescoço',
  tronco: 'Tronco',
  membro_sup: 'Membro superior',
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
export const BODY_ITEMS = [...BODY_MUSCLES, ...ORAL_MUSCLES, ...BODY_BONES];
export const NERVES = [...NERVES_BASE, ...NERVES_CRANIAL, ...NERVES_SENSORY, ...NERVES_SPINAL];
export const ITEMS = [...HEAD_ITEMS, ...BODY_ITEMS, ...NERVES];

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
