/**
 * Segmentos medulares de músculos e nervos (F2.14): fonte do mapa de miótomos e do filtro “músculos do segmento C7”.
 *
 * O campo é a lista dos segmentos que dão fibras ao músculo (ou ao nervo), na ordem craniocaudal. Os valores seguem a
 * mesma fonte das fichas (Moore, Dalley & Agur, 8ª ed.; Gray’s Anatomy, 42ª ed.; Kendall et al. para os miótomos
 * clínicos). **As fontes divergem** — por exemplo, o bíceps é C5–C6 em Moore e C5–C6 (e alguma contribuição de C7) em
 * outras; o psoas maior é L1–L3 em Moore e L2–L4 em outras — e cada divergência relevante está na nota da ficha.
 *
 * Músculos inervados só por nervos cranianos não têm segmentos. Nervos cranianos tampouco, salvo os que são
 * espinais de verdade (frênico, plexos, ramos).
 */

/** Ordem craniocaudal dos 31 segmentos. */
export const SEGMENT_ORDER = [
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4', 'S5', 'Co1',
];

/** Região do segmento: C (cervical), T (torácico), L (lombar) ou S (sacral; o coccígeo entra aqui). */
export const segRegion = (seg) => (seg.startsWith('Co') ? 'S' : seg[0]);

/** Expande 'C5-C8' ou 'C7' em lista de segmentos. */
const R = (a, b = a) => SEGMENT_ORDER.slice(SEGMENT_ORDER.indexOf(a), SEGMENT_ORDER.indexOf(b) + 1);
const cat = (...l) => l.flat();

/**
 * Músculos. As entradas marcadas em AMPLOS são os músculos próprios do dorso e do pescoço, cuja inervação por ramos
 * posteriores é segmentar em vários níveis (cada nível inerva o fascículo que o atravessa): o intervalo é o da região,
 * não um miótomo clínico.
 */
export const SEGMENTOS_MUSCULO = {
  // pescoço e cabeça (inervados por ramos cervicais; os cranianos não aparecem)
  ecm: R('C2', 'C3'), trapezio_desc: R('C3', 'C4'), trapezio_transv: R('C3', 'C4'), trapezio_asc: R('C3', 'C4'),
  genio_hioideo: R('C1'), tireohioideo: R('C1'), esternohioideo: R('C1', 'C3'), esternotireoideo: R('C2', 'C3'), omohioideo: R('C1', 'C3'),
  longo_cabeca: R('C1', 'C3'), longo_pescoco: R('C2', 'C6'), reto_ant_cabeca: R('C1', 'C2'), reto_lat_cabeca: R('C1', 'C2'),
  reto_post_maior: R('C1'), reto_post_menor: R('C1'), obliquo_cabeca_sup: R('C1'), obliquo_cabeca_inf: R('C1'),
  escaleno_ant: R('C4', 'C6'), escaleno_med: R('C3', 'C8'), escaleno_post: R('C6', 'C8'), escaleno_minimo: R('C7'),
  levantador_escapula: R('C3', 'C5'), rombo_menor: R('C4', 'C5'), rombo_maior: R('C4', 'C5'),
  // dorso profundo (ramos posteriores; intervalos regionais)
  intertransversarios_cerv_ant: R('C2', 'C8'), intertransversarios_cerv_post: R('C2', 'C8'), interespinais_cervicais: R('C2', 'C8'),
  esplenio_cabeca: R('C3', 'C5'), esplenio_pescoco: R('C5', 'C8'),
  semiespinal_cabeca: R('C1', 'C8'), semiespinal_cervical: R('C1', 'C8'), rotadores_cervicais: R('C1', 'C8'),
  iliocostal_cervical: R('C6', 'C8'), longuissimo_cabeca: R('C4', 'C8'), longuissimo_cervical: cat(R('C3', 'C8'), R('T1', 'T6')),
  iliocostal_toracico: R('T1', 'T12'), longuissimo_toracico: cat(R('T1', 'T12'), R('L1', 'L5')), espinal_toracico: R('T1', 'T12'),
  semiespinal_toracico: R('T1', 'T12'), rotadores_toracicos: R('T1', 'T12'), interespinais_toracicos: R('T1', 'T12'),
  iliocostal_lombar: cat(R('T10', 'T12'), R('L1', 'L5')), rotadores_lombares: R('L1', 'L5'), interespinais_lombares: R('L1', 'L5'),
  intertransversarios_med: R('L1', 'L5'), intertransversarios_lat: R('L1', 'L4'), multifido: cat(R('C2', 'C8'), R('T1', 'T12'), R('L1', 'L5'), R('S1', 'S3')),
  levantadores_costelas_curtos: cat(R('C8'), R('T1', 'T11')), levantadores_costelas_longos: R('T7', 'T11'),
  // tórax e abdome
  serratil_post_sup: R('T2', 'T5'), serratil_post_inf: R('T9', 'T12'), intercostal_ext: R('T1', 'T11'), intercostal_int: R('T1', 'T11'),
  intercostal_intimo: R('T1', 'T11'), transverso_torax: R('T2', 'T6'), subcostais: R('T8', 'T12'), diafragma: R('C3', 'C5'),
  obliquo_externo: R('T7', 'T12'), obliquo_interno: R('T7', 'L1'), transverso_abdome: R('T7', 'L1'), reto_abdome: R('T7', 'T12'),
  piramidal: R('T12'), quadrado_lombo: R('T12', 'L4'), psoas_maior: R('L1', 'L3'), iliaco: R('L2', 'L4'),
  // pelve e períneo
  pubococcigeo: R('S3', 'S4'), iliococcigeo: R('S3', 'S4'), puborretal: R('S3', 'S4'), coccigeo: R('S4', 'S5'), esfincter_anal_ext: R('S2', 'S4'),
  obturador_interno: cat(R('L5'), R('S1', 'S2')),
  bulboesponjoso: R('S2', 'S4'), isquiocavernoso: R('S2', 'S4'), transverso_superficial_perineo: R('S2', 'S4'),
  transverso_profundo_perineo: R('S2', 'S4'), esfincter_uretra: R('S2', 'S4'),
  // membro superior
  peitoral_clav: R('C5', 'C7'), peitoral_esternocostal: R('C5', 'T1'), peitoral_abdominal: R('C7', 'T1'), peitoral_menor: R('C8', 'T1'),
  subclavio: R('C5', 'C6'), serratil_anterior: R('C5', 'C7'), grande_dorsal: R('C6', 'C8'),
  delt_clav: R('C5', 'C6'), delt_acro: R('C5', 'C6'), delt_esp: R('C5', 'C6'), supraespinal: R('C5', 'C6'), infraespinal: R('C5', 'C6'),
  redondo_menor: R('C5', 'C6'), redondo_maior: R('C5', 'C6'), subescapular: R('C5', 'C7'),
  coracobraquial: R('C5', 'C7'), biceps_longa: R('C5', 'C6'), biceps_curta: R('C5', 'C6'), braquial: R('C5', 'C6'),
  triceps_longa: R('C6', 'C8'), triceps_lateral: R('C6', 'C8'), triceps_medial: R('C6', 'C8'), anconeo: R('C7', 'C8'),
  pronador_redondo_h: R('C6', 'C7'), pronador_redondo_u: R('C6', 'C7'), fcr: R('C6', 'C7'), palmar_longo: R('C7', 'C8'),
  fcu_h: R('C7', 'T1'), fcu_u: R('C7', 'T1'), fds: R('C7', 'T1'), fdp: R('C8', 'T1'), fpl: R('C8', 'T1'), pronador_quadrado: R('C8', 'T1'),
  braquiorradial: R('C5', 'C6'), ecrl: R('C6', 'C7'), ecrb: R('C7', 'C8'), ed: R('C7', 'C8'), edm: R('C7', 'C8'), ecu: R('C7', 'C8'),
  supinador: R('C5', 'C6'), apl: R('C7', 'C8'), epb: R('C7', 'C8'), epl: R('C7', 'C8'), extensor_indicador: R('C7', 'C8'),
  abdutor_polegar_curto: R('C8', 'T1'), flexor_polegar_curto: R('C8', 'T1'), oponente_polegar: R('C8', 'T1'),
  adutor_polegar_obliquo: R('C8', 'T1'), adutor_polegar_transverso: R('C8', 'T1'), abdutor_minimo: R('C8', 'T1'),
  flexor_minimo_curto: R('C8', 'T1'), oponente_minimo: R('C8', 'T1'), palmar_curto: R('C8', 'T1'),
  interosseos_dorsais: R('C8', 'T1'), interosseos_palmares: R('C8', 'T1'), lumbricais: R('C8', 'T1'),
};

/**
 * Nervos: segmentos de origem das fibras. Só nervos espinais de fato; os cranianos não têm (o acessório e o hipoglosso
 * levam fibras de C1–C5 e C1, ditas na ficha, mas o tronco é craniano).
 */
export const SEGMENTOS_NERVO = {
  n_ramos_cervicais: R('C1', 'C8'), n_alca_cervical: R('C1', 'C3'), n_frenico: R('C3', 'C5'), n_suboccipital: R('C1'),
  n_occipital_maior: R('C2'), n_ramos_posteriores: R('C3', 'L5'), n_occipital_menor: R('C2', 'C3'), n_auricular_magno: R('C2', 'C3'),
  n_cervical_transverso: R('C2', 'C3'), n_supraclaviculares: R('C3', 'C4'),
  n_plexo_braquial: R('C5', 'T1'), n_dorsal_escapula: R('C4', 'C5'), n_toracico_longo: R('C5', 'C7'), n_supraescapular: R('C5', 'C6'),
  n_subclavio: R('C5', 'C6'), n_peitoral_lateral: R('C5', 'C7'), n_peitoral_medial: R('C8', 'T1'), n_subescapular_sup: R('C5', 'C6'),
  n_toracodorsal: R('C6', 'C8'), n_subescapular_inf: R('C5', 'C6'), n_axilar: R('C5', 'C6'), n_musculocutaneo: R('C5', 'C7'),
  n_radial: R('C5', 'T1'), n_interosseo_posterior: R('C7', 'C8'), n_mediano: R('C6', 'T1'), n_interosseo_anterior: R('C8', 'T1'),
  n_ulnar: R('C8', 'T1'), n_ulnar_profundo: R('C8', 'T1'),
  n_intercostobraquial: R('T2'), n_cutaneo_medial_braco: R('C8', 'T1'), n_cutaneo_medial_antebraco: R('C8', 'T1'),
  n_cutaneo_posterior_braco: R('C5', 'C8'), n_cutaneo_lateral_inf_braco: R('C5', 'C6'), n_cutaneo_posterior_antebraco: R('C5', 'C8'),
  n_cutaneo_lateral_sup_braco: R('C5', 'C6'), n_cutaneo_lateral_antebraco: R('C5', 'C6'), n_radial_superficial: R('C6', 'C7'),
  n_ramo_palmar_mediano: R('C6', 'C7'), n_ramo_palmar_ulnar: R('C8'), n_ramo_dorsal_ulnar: R('C8'),
  n_digitais_palmares: R('C6', 'C8'), n_digitais_dorsais: R('C6', 'C8'),
  n_intercostais: R('T1', 'T6'), n_toracoabdominais: R('T7', 'T11'), n_subcostal: R('T12'), n_ilio_hipogastrico: R('L1'), n_ilioinguinal: R('L1'),
  n_plexo_lombar: R('T12', 'L4'), n_femoral: R('L2', 'L4'), n_levantador_anus: R('S3', 'S5'), n_pudendo: R('S2', 'S4'),
  n_obturador_interno: cat(R('L5'), R('S1', 'S2')),
  medula_espinal: SEGMENT_ORDER, n_espinais_cervicais: R('C1', 'C8'), n_espinais_toracicos: R('T1', 'T12'), n_espinais_lombares: R('L1', 'L5'),
  n_espinais_sacrais: R('S1', 'Co1'), cauda_equina: R('L2', 'Co1'),
};

/** Músculos cujo intervalo é regional (ver o cabeçalho): aparecem à parte nas listas por segmento. */
export const AMPLOS = new Set([
  'esplenio_cabeca', 'esplenio_pescoco', 'intertransversarios_cerv_ant', 'intertransversarios_cerv_post', 'interespinais_cervicais', 'semiespinal_cabeca', 'semiespinal_cervical', 'rotadores_cervicais', 'iliocostal_cervical',
  'longuissimo_cabeca', 'longuissimo_cervical', 'iliocostal_toracico', 'longuissimo_toracico', 'espinal_toracico', 'semiespinal_toracico',
  'rotadores_toracicos', 'interespinais_toracicos', 'iliocostal_lombar', 'rotadores_lombares', 'interespinais_lombares',
  'intertransversarios_med', 'intertransversarios_lat', 'multifido', 'levantadores_costelas_curtos', 'levantadores_costelas_longos',
]);

/** Músculos em que os segmentos são só proprioceptivos (a parte motora é de um nervo craniano, o acessório). */
export const PROPRIOCEPTIVOS = new Set(['ecm', 'trapezio_desc', 'trapezio_transv', 'trapezio_asc']);

export const SEGMENTOS = { ...SEGMENTOS_MUSCULO, ...SEGMENTOS_NERVO };

/** 'C5–C8', 'C7' ou 'C5, C7 e C8' a partir de uma lista de segmentos (compacta os trechos consecutivos). */
export function segmentLabel(list) {
  const idx = [...list].map((s) => SEGMENT_ORDER.indexOf(s)).filter((i) => i >= 0).sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < idx.length; ) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1] === idx[j] + 1) j++;
    parts.push(j > i ? `${SEGMENT_ORDER[idx[i]]}–${SEGMENT_ORDER[idx[j]]}` : SEGMENT_ORDER[idx[i]]);
    i = j + 1;
  }
  return parts.join(', ');
}

/** Segmento principal (o do meio da lista), usado para colorir cada músculo por um único segmento. */
export function principalSegment(list) {
  const idx = list.map((s) => SEGMENT_ORDER.indexOf(s)).sort((a, b) => a - b);
  return SEGMENT_ORDER[idx[Math.floor((idx.length - 1) / 2)]];
}
