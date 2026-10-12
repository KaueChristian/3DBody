/**
 * Sistema respiratório (F6.1). Pulmões: malhas reais do Atlas de Referência Humano (HRA, HuBMAP/NIH, CC BY 4.0; modelo do Visible Human
 * masculino), ajustadas ao corpo do atlas por semelhança (ver `docs/fonte-hra-atlas-de-referencia.md`); o BodyParts3D não tem pulmões.
 * Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.); o que varia entre as fontes fica na `nota`.
 * `relacionados` liga cada estrutura às vizinhas (a ligação vale nos dois sentidos; ver `catalog.js`).
 */

const T = 'tronco';
const part = (id) => ({ id, mat: 'lung' });

/** Estrutura do sistema respiratório. `malha: 'hra'` faz a ficha dizer de onde vem a malha. */
const resp = (id, name, latin, parts, d, extra = {}) => ({
  kind: 'orgao',
  id,
  name,
  latin,
  layer: 'respiratorio',
  region: T,
  parts: parts.map(part),
  campos: [
    ['Localização e limites', d.local],
    ['Faces e relações', d.relacoes],
    ['Segmentos broncopulmonares', d.segmentos],
    ['Aspectos clínicos', d.clinica],
  ],
  nota: d.nota,
  ...extra,
});

const MODELO = 'A malha é do Atlas de Referência Humano (um indivíduo diferente do corpo do atlas) e foi ajustada ao tórax por escala e posição: o encaixe com o coração e as costelas é aproximado.';
const ARTERIA = { d: 'arteria_pulmonar_direita', e: 'arteria_pulmonar_esquerda' };

export const RESP_ITEMS = [
  /* ═════════════ Pulmão direito ═════════════ */
  resp('pulmao_d_lobo_superior', 'Lobo superior do pulmão direito', 'Lobus superior pulmonis dextri', ['pulmao_d_lobo_superior'], {
    local: 'Parte superior do pulmão direito, acima da fissura horizontal e à frente da parte alta da fissura oblíqua; inclui o ápice do pulmão, que sobe até a cúpula da pleura, 2 a 3 cm acima da clavícula.',
    relacoes: 'Face costal contra as costelas; face mediastinal junto da veia cava superior, da veia braquiocefálica e do arco da veia ázigo, com o sulco da artéria subclávia no ápice; a fissura horizontal, que acompanha a 4ª costela, o separa do lobo médio.',
    segmentos: 'Três: apical (S1), posterior (S2) e anterior (S3).',
    clinica: 'Um tumor do ápice (de Pancoast) pode invadir o plexo braquial e o tronco simpático, com dor no ombro e no braço e síndrome de Horner. A tuberculose pós-primária costuma começar nos segmentos apical e posterior.',
    nota: `${MODELO} Os 10 segmentos broncopulmonares do pulmão direito (3 + 2 + 5) são os da Terminologia Anatômica.`,
  }, {
    malha: 'hra',
    relacionados: ['pulmao_d_lobo_medio', 'pulmao_d_lobo_inferior', ARTERIA.d, 'veia_pulmonar_superior_direita'],
  }),
  resp('pulmao_d_lobo_medio', 'Lobo médio do pulmão direito', 'Lobus medius pulmonis dextri', ['pulmao_d_lobo_medio'], {
    local: 'Pequeno lobo em forma de cunha, entre a fissura horizontal e a parte baixa da fissura oblíqua; só existe à direita (o equivalente do lado esquerdo é a língula).',
    relacoes: 'Aparece sobretudo nas faces costal e mediastinal, na frente do pulmão, junto do átrio direito e do diafragma (face diafragmática).',
    segmentos: 'Dois: lateral (S4) e medial (S5).',
    clinica: 'Seu brônquio é longo, estreito e rodeado de linfonodos; a compressão dele (infecção, tumor) causa atelectasia do lobo, a chamada síndrome do lobo médio.',
    nota: MODELO,
  }, {
    malha: 'hra',
    relacionados: ['pulmao_d_lobo_superior', 'pulmao_d_lobo_inferior', ARTERIA.d],
  }),
  resp('pulmao_d_lobo_inferior', 'Lobo inferior do pulmão direito', 'Lobus inferior pulmonis dextri', ['pulmao_d_lobo_inferior'], {
    local: 'Parte posterior e inferior do pulmão direito, atrás e abaixo da fissura oblíqua; é o maior dos lobos e repousa sobre o diafragma.',
    relacoes: 'Face diafragmática (base) sobre a cúpula direita do diafragma, que a separa do fígado; face costal e face mediastinal junto do esôfago e da veia cava inferior; o ligamento pulmonar, uma prega de pleura, desce da margem inferior do hilo.',
    segmentos: 'Cinco: superior (S6), medial basal (S7), anterior basal (S8), lateral basal (S9) e posterior basal (S10).',
    clinica: 'O brônquio principal direito é mais curto, largo e vertical que o esquerdo; por isso os corpos estranhos aspirados vão mais para o pulmão direito, em geral para o lobo inferior. Em decúbito dorsal, a aspiração tende a chegar ao segmento superior (S6).',
    nota: MODELO,
  }, {
    malha: 'hra',
    relacionados: ['pulmao_d_lobo_superior', 'pulmao_d_lobo_medio', ARTERIA.d, 'veia_pulmonar_inferior_direita'],
  }),

  /* ═════════════ Pulmão esquerdo ═════════════ */
  resp('pulmao_e_lobo_superior', 'Lobo superior do pulmão esquerdo', 'Lobus superior pulmonis sinistri', ['pulmao_e_lobo_superior'], {
    local: 'Parte superior do pulmão esquerdo, acima da fissura oblíqua (a única fissura deste pulmão); inclui o ápice e, embaixo, a língula.',
    relacoes: 'Na frente tem a incisura cardíaca, a reentrância da margem anterior onde o coração fica, e a língula, o prolongamento que equivale ao lobo médio direito. A face mediastinal tem o sulco do arco da aorta e o da artéria subclávia esquerda.',
    segmentos: 'Cinco na Terminologia Anatômica: apical (S1), posterior (S2), anterior (S3), lingular superior (S4) e lingular inferior (S5).',
    clinica: 'A língula é, como o lobo médio, sede frequente de atelectasia e de bronquiectasias. O tumor do ápice (de Pancoast) pode ocorrer dos dois lados.',
    nota: `${MODELO} Muitos textos fundem o apical e o posterior num só segmento (apicoposterior, S1+2) e contam oito segmentos no pulmão esquerdo.`,
  }, {
    malha: 'hra',
    relacionados: ['pulmao_e_lobo_inferior', ARTERIA.e, 'veia_pulmonar_superior_esquerda'],
  }),
  resp('pulmao_e_lobo_inferior', 'Lobo inferior do pulmão esquerdo', 'Lobus inferior pulmonis sinistri', ['pulmao_e_lobo_inferior'], {
    local: 'Parte posterior e inferior do pulmão esquerdo, abaixo e atrás da fissura oblíqua; repousa sobre a cúpula esquerda do diafragma.',
    relacoes: 'Face diafragmática sobre o diafragma, que a separa do estômago e do baço; face mediastinal com o sulco da parte descendente da aorta, por trás do hilo.',
    segmentos: 'Cinco na Terminologia Anatômica: superior (S6), medial basal (S7), anterior basal (S8), lateral basal (S9) e posterior basal (S10).',
    clinica: 'A pneumonia por aspiração e as bronquiectasias dos segmentos basais são comuns; a ausculta dos lobos inferiores se faz pelo dorso, abaixo da escápula.',
    nota: `${MODELO} Muitos textos fundem os segmentos medial basal e anterior basal num só (anteromedial basal, S7+8).`,
  }, {
    malha: 'hra',
    relacionados: ['pulmao_e_lobo_superior', ARTERIA.e, 'veia_pulmonar_inferior_esquerda'],
  }),
];
