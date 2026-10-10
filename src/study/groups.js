/**
 * Grupos funcionais/compartimentos dos músculos, usados na coloração (F1.7) e na legenda.
 *
 * O mapeamento é explícito (id → grupo) e o teste `npm run test:catalog` exige que todo músculo do catálogo esteja
 * aqui: ao acrescentar um músculo, escolha o grupo dele (ou crie um novo em `GROUPS`).
 */

/** Ordem de exibição na legenda: cabeça e pescoço → tronco → membro superior. */
export const GROUPS = [
  { id: 'mimica', label: 'Mímica facial' },
  { id: 'olho', label: 'Músculos do olho e das pálpebras' },
  { id: 'mastigacao', label: 'Mastigação' },
  { id: 'lingua', label: 'Língua (extrínsecos e intrínsecos)' },
  { id: 'palato', label: 'Palato mole' },
  { id: 'faringe', label: 'Faringe' },
  { id: 'laringe', label: 'Laringe' },
  { id: 'ouvido', label: 'Ouvido médio' },
  { id: 'hioideos', label: 'Supra e infra-hióideos' },
  { id: 'pescoco', label: 'Pescoço lateral, pré-vertebrais e suboccipitais' },
  { id: 'dorso_ext', label: 'Dorso superficial (trapézio, grande dorsal, romboides)' },
  { id: 'dorso_prof', label: 'Dorso profundo (eretores e transversoespinais)' },
  { id: 'torax', label: 'Parede torácica e diafragma' },
  { id: 'abdome', label: 'Parede abdominal e parede posterior do abdome' },
  { id: 'pelve', label: 'Assoalho pélvico e períneo' },
  { id: 'ombro', label: 'Ombro (deltoide e manguito rotador)' },
  { id: 'braco_ant', label: 'Compartimento anterior do braço' },
  { id: 'braco_post', label: 'Compartimento posterior do braço' },
  { id: 'antebraco_flex', label: 'Antebraço: flexores e pronadores' },
  { id: 'antebraco_ext', label: 'Antebraço: extensores e supinador' },
  { id: 'mao_tenar', label: 'Mão: eminência tenar e adutor do polegar' },
  { id: 'mao_hipotenar', label: 'Mão: eminência hipotenar' },
  { id: 'mao_central', label: 'Mão: lumbricais e interósseos' },
];

const BY_GROUP = {
  mimica: 'frontal occipital auricular_sup auricular_ant auricular_post orbicular_olho corrugador depressor_supercilio procero nasal depressor_septo orbicular_boca levantador_labio_asa levantador_labio zigomatico_menor zigomatico_maior levantador_angulo risorio abaixador_angulo abaixador_labio mentual bucinador platisma transverso_mento incisivo_labio_sup incisivo_labio_inf temporoparietal',
  olho: 'levantador_palpebra reto_sup reto_inf reto_med reto_lat obliquo_sup obliquo_inf ciliar esfincter_pupila dilatador_pupila tarsal_sup tarsal_inf',
  mastigacao: 'masseter temporal pterigoideo_medial pterigoideo_lateral',
  lingua: 'genioglosso hioglosso estiloglosso palatoglosso lingua_long_sup lingua_long_inf lingua_transverso lingua_vertical',
  palato: 'levantador_veu tensor_veu musculo_uvula palatofaringeo',
  faringe: 'constritor_faringe_sup constritor_faringe_med constritor_faringe_inf estilofaringeo salpingofaringeo',
  laringe: 'cricotireoideo cricoaritenoideo_post cricoaritenoideo_lat aritenoideo_transverso aritenoideo_obliquo tireoaritenoideo vocal',
  ouvido: 'tensor_timpano estapedio',
  hioideos: 'digastrico milo_hioideo genio_hioideo estilo_hioideo esternohioideo esternotireoideo tireohioideo omohioideo',
  pescoco: 'ecm escaleno_ant escaleno_med escaleno_post escaleno_minimo longo_cabeca longo_pescoco reto_ant_cabeca reto_lat_cabeca reto_post_maior reto_post_menor obliquo_cabeca_sup obliquo_cabeca_inf',
  dorso_ext: 'trapezio_desc trapezio_transv trapezio_asc grande_dorsal levantador_escapula rombo_menor rombo_maior serratil_post_sup serratil_post_inf',
  dorso_prof: 'iliocostal_lombar iliocostal_toracico iliocostal_cervical longuissimo_toracico longuissimo_cervical longuissimo_cabeca espinal_toracico semiespinal_toracico semiespinal_cervical semiespinal_cabeca rotadores_cervicais interespinais_cervicais intertransversarios_cerv_ant intertransversarios_cerv_post rotadores_toracicos rotadores_lombares interespinais_toracicos interespinais_lombares intertransversarios_med intertransversarios_lat multifido esplenio_cabeca esplenio_pescoco',
  torax: 'peitoral_clav peitoral_esternocostal peitoral_abdominal peitoral_menor subclavio serratil_anterior intercostal_ext intercostal_int intercostal_intimo subcostais transverso_torax levantadores_costelas_curtos levantadores_costelas_longos diafragma',
  abdome: 'obliquo_externo obliquo_interno transverso_abdome reto_abdome piramidal quadrado_lombo psoas_maior iliaco',
  pelve: 'pubococcigeo iliococcigeo coccigeo esfincter_anal_ext bulboesponjoso isquiocavernoso transverso_superficial_perineo transverso_profundo_perineo esfincter_uretra puborretal obturador_interno',
  ombro: 'delt_clav delt_acro delt_esp supraespinal infraespinal redondo_menor redondo_maior subescapular',
  braco_ant: 'coracobraquial biceps_longa biceps_curta braquial',
  braco_post: 'triceps_longa triceps_lateral triceps_medial anconeo',
  antebraco_flex: 'pronador_redondo_h pronador_redondo_u fcr palmar_longo fcu_h fcu_u fds fdp fpl pronador_quadrado',
  antebraco_ext: 'braquiorradial ecrl ecrb ed edm ecu supinador apl epb epl extensor_indicador',
  mao_tenar: 'abdutor_polegar_curto flexor_polegar_curto oponente_polegar adutor_polegar_obliquo adutor_polegar_transverso',
  mao_hipotenar: 'palmar_curto abdutor_minimo flexor_minimo_curto oponente_minimo',
  mao_central: 'interosseos_dorsais interosseos_palmares lumbricais',
};

/** id do músculo → id do grupo. */
export const MUSCLE_GROUP = new Map(
  Object.entries(BY_GROUP).flatMap(([g, ids]) => ids.split(/\s+/).filter(Boolean).map((id) => [id, g])),
);

export const GROUP_LABEL = new Map(GROUPS.map((g) => [g.id, g.label]));

/** Cores bem espaçadas em matiz, alternando luminosidade para grupos vizinhos não parecerem iguais. */
export function groupColor(groupId) {
  const i = Math.max(0, GROUPS.findIndex((g) => g.id === groupId));
  const hue = (i * 137.508) % 360;
  const light = [58, 66, 48][i % 3];
  return `hsl(${hue.toFixed(0)}, 62%, ${light}%)`;
}
