/**
 * Vias aéreas (F6.1): traqueia, brônquios principais, brônquios segmentares, cartilagens da laringe e as pleuras (esquema). Malhas reais
 * do BodyParts3D (pacote `anatomy-resp.js`, ao lado dos pulmões do Atlas de Referência Humano). Textos próprios, a partir de Moore, Dalley
 * & Agur (8ª ed.) e Gray's Anatomy (42ª ed.). A numeração B1 a B10 é a de Boyden, usada na broncoscopia; o que varia entre as fontes
 * fica na `nota`. O BodyParts3D não traz os brônquios lobares (eles ficam entre o principal e o segmentar) nem as pleuras.
 */
import { bone } from './catalog-body-bones.js';

const T = 'tronco';
const AIR = '#9cc3e0';

/** Brônquio, traqueia ou outra via aérea tubular. */
const via = (id, name, latin, region, parts, d, extra = {}) => ({
  kind: 'orgao',
  id,
  name,
  latin,
  layer: 'respiratorio',
  region,
  color: AIR,
  parts: parts.map((p) => ({ id: p, mat: 'airway' })),
  campos: [
    ['Localização', d.local],
    ['Estrutura', d.estrutura],
    ['Relações', d.relacoes],
    ['Aspectos clínicos', d.clinica],
  ],
  nota: d.nota,
  ...extra,
});

const BOYDEN = 'A numeração B1 a B10 (de Boyden) é a usada na broncoscopia.';
const UNIDADE = 'Cada segmento broncopulmonar tem o seu brônquio segmentar e a sua artéria, no centro do segmento, e é separado dos vizinhos por septos de tecido conjuntivo (as veias correm entre os segmentos): é a unidade da segmentectomia.';

/**
 * Brônquio segmentar. `lobar`: de onde nasce; `onde`: o segmento que ventila; `direcao`: para onde vai; `clinica` e `nota` opcionais.
 */
const seg = (lado, key, num, nome, latin, lobar, onde, direcao, extra = {}) => {
  const id = `bronquio_seg_${lado}_${key}`;
  const dir = lado === 'd' ? 'direito' : 'esquerdo';
  return via(id, `Brônquio segmentar ${nome} (B${num}) — pulmão ${dir}`, `Bronchus segmentalis ${latin} [B ${num}]`, T, [`bronq_seg_${lado}_${key}`], {
    local: `Nasce do ${lobar} do pulmão ${dir} e ventila o segmento ${onde}.`,
    estrutura: `Brônquio de 3ª ordem (segmentar); acompanha a artéria do segmento e se ramifica em brônquios subsegmentares até os bronquíolos. ${direcao}`,
    relacoes: 'Dentro do pulmão, o brônquio segmentar fica no centro do segmento, com a artéria segmentar; as veias correm entre os segmentos.',
    clinica: extra.clinica ?? `${UNIDADE}`,
    nota: extra.nota ?? BOYDEN,
  }, {
    relacionados: [extra.lobe, lado === 'd' ? 'bronquio_principal_d' : 'bronquio_principal_e'],
  });
};

export const AIRWAY_ITEMS = [
  /* ═════════════ Traqueia e brônquios principais ═════════════ */
  via('traqueia', 'Traqueia', 'Trachea', ['cabeca', T], ['traqueia'], {
    local: 'Tubo na linha mediana que continua a laringe, na margem inferior da cartilagem cricóidea (C6), desce pelo pescoço e pelo mediastino superior e se bifurca na carina, no plano do ângulo do esterno (T4–T5).',
    estrutura: 'Cerca de 10 a 11 cm de comprimento e 2 cm de diâmetro, com 15 a 20 cartilagens em forma de C, abertas para trás e unidas por ligamentos anulares. A parede posterior é membranácea, com o músculo traqueal, e fica contra o esôfago.',
    relacoes: 'Atrás, o esôfago. No pescoço, na frente, o istmo da glândula tireoide (sobre os anéis 2 a 4); no tórax, o tronco braquiocefálico, a veia braquiocefálica esquerda, o arco da aorta e o timo. O nervo laríngeo recorrente corre no sulco entre a traqueia e o esôfago.',
    clinica: 'A traqueostomia é feita no pescoço, abaixo da cartilagem cricóidea; a cricotireoidotomia, pela membrana cricotireóidea, é a via de emergência. Tocar a carina na broncoscopia provoca tosse intensa.',
  }, {
    relacionados: ['bronquio_principal_d', 'bronquio_principal_e', 'cartilagem_cricoidea', 'arco_aorta', 'tronco_braquiocefalico'],
  }),
  via('bronquio_principal_d', 'Brônquio principal direito', 'Bronchus principalis dexter', T, ['bronquio_principal_d'], {
    local: 'Vai da carina ao hilo do pulmão direito.',
    estrutura: 'É mais curto (cerca de 2,5 cm), mais largo e mais vertical que o esquerdo. O brônquio lobar superior nasce antes do hilo, acima da artéria pulmonar (brônquio eparterial); depois, o principal se divide nos brônquios lobares médio e inferior.',
    relacoes: 'O arco da veia ázigo passa por cima dele, de trás para a frente, para chegar à veia cava superior; a artéria pulmonar direita fica primeiro abaixo e depois à frente do brônquio.',
    clinica: 'Os corpos estranhos aspirados vão mais para o pulmão direito, por ser o brônquio mais largo e mais vertical; o tubo endotraqueal introduzido além da carina costuma entrar nele.',
    nota: 'Os brônquios lobares (secundários) não existem isolados no BodyParts3D e estão representados por código na ficha de brônquios lobares.',
  }, {
    relacionados: ['traqueia', 'bronquios_lobares', 'arteria_pulmonar_direita', 'veia_azigo', 'pulmao_d_lobo_superior', 'pulmao_d_lobo_medio', 'pulmao_d_lobo_inferior'],
  }),
  via('bronquio_principal_e', 'Brônquio principal esquerdo', 'Bronchus principalis sinister', T, ['bronquio_principal_e'], {
    local: 'Vai da carina ao hilo do pulmão esquerdo.',
    estrutura: 'É mais longo (cerca de 5 cm), mais estreito e mais horizontal que o direito. Divide-se, no hilo, nos brônquios lobares superior e inferior; passa abaixo da artéria pulmonar (brônquio hiparterial).',
    relacoes: 'Passa por baixo do arco da aorta, na frente do esôfago e da aorta torácica, e a artéria pulmonar esquerda o cruza por cima.',
    clinica: 'O átrio esquerdo muito dilatado levanta o brônquio principal esquerdo e alarga o ângulo da carina. O arco da aorta (aneurisma) pode comprimi-lo.',
    nota: 'Os brônquios lobares (secundários) não existem isolados no BodyParts3D e estão representados por código na ficha de brônquios lobares.',
  }, {
    relacionados: ['traqueia', 'bronquios_lobares', 'arco_aorta', 'arteria_pulmonar_esquerda', 'pulmao_e_lobo_superior', 'pulmao_e_lobo_inferior'],
  }),

  /* ═════════════ Brônquios segmentares: pulmão direito ═════════════ */
  seg('d', 'apical', 1, 'apical', 'apicalis', 'brônquio lobar superior', 'apical (S1), na cúpula do pulmão', 'Sobe quase na vertical, em direção ao ápice.', {
    lobe: 'pulmao_d_lobo_superior', clinica: 'Os segmentos apicais são a sede típica da tuberculose pós-primária e dos tumores do ápice (de Pancoast).',
  }),
  seg('d', 'posterior', 2, 'posterior', 'posterior', 'brônquio lobar superior', 'posterior (S2), na parte de trás do lobo superior', 'Dirige-se para trás e para fora.', {
    lobe: 'pulmao_d_lobo_superior', clinica: 'Em decúbito dorsal, o material aspirado pode chegar aos segmentos posteriores dos lobos superiores.',
  }),
  seg('d', 'anterior', 3, 'anterior', 'anterior', 'brônquio lobar superior', 'anterior (S3), na frente do lobo superior', 'Dirige-se para a frente e um pouco para baixo.', { lobe: 'pulmao_d_lobo_superior' }),
  seg('d', 'lateral', 4, 'lateral', 'lateralis', 'brônquio lobar médio', 'lateral (S4) do lobo médio', 'Dirige-se para a face lateral do lobo médio.', {
    lobe: 'pulmao_d_lobo_medio', clinica: `${UNIDADE} O brônquio do lobo médio é longo, estreito e rodeado de linfonodos: sua compressão causa a síndrome do lobo médio.`,
  }),
  seg('d', 'medial', 5, 'medial', 'medialis', 'brônquio lobar médio', 'medial (S5) do lobo médio, junto ao coração', 'Dirige-se para a face medial do lobo médio.', {
    lobe: 'pulmao_d_lobo_medio', clinica: `${UNIDADE} O brônquio do lobo médio é longo, estreito e rodeado de linfonodos: sua compressão causa a síndrome do lobo médio.`,
  }),
  seg('d', 'superior', 6, 'superior', 'superior', 'brônquio lobar inferior', 'superior (S6) do lobo inferior', 'Nasce da parede posterior do brônquio lobar inferior e vai para trás.', {
    lobe: 'pulmao_d_lobo_inferior', clinica: 'É um dos segmentos mais atingidos pela aspiração em decúbito dorsal e por abscessos pulmonares.',
  }),
  seg('d', 'basal_medial', 7, 'basal medial', 'basalis medialis [cardiacus]', 'brônquio lobar inferior', 'basal medial (S7), junto ao coração', 'Dirige-se para a parte medial da base do lobo inferior (é o brônquio “cardíaco”).', { lobe: 'pulmao_d_lobo_inferior' }),
  seg('d', 'basal_anterior', 8, 'basal anterior', 'basalis anterior', 'brônquio lobar inferior', 'basal anterior (S8)', 'Dirige-se para a frente e para baixo, na parte anterior da base.', { lobe: 'pulmao_d_lobo_inferior' }),
  seg('d', 'basal_lateral', 9, 'basal lateral', 'basalis lateralis', 'brônquio lobar inferior', 'basal lateral (S9)', 'Dirige-se para a face lateral da base do lobo inferior.', { lobe: 'pulmao_d_lobo_inferior' }),
  seg('d', 'basal_posterior', 10, 'basal posterior', 'basalis posterior', 'brônquio lobar inferior', 'basal posterior (S10), o mais posterior e mais baixo', 'Dirige-se para trás e para baixo, na parte posterior da base.', {
    lobe: 'pulmao_d_lobo_inferior', clinica: 'Em posição ereta ou sentada, o material aspirado tende a ir para os segmentos basais do pulmão direito, sobretudo o posterior.',
  }),

  /* ═════════════ Brônquios segmentares: pulmão esquerdo ═════════════ */
  seg('e', 'apical', 1, 'apical', 'apicalis', 'brônquio lobar superior', 'apical (S1), na cúpula do pulmão', 'Sobe, em direção ao ápice.', {
    lobe: 'pulmao_e_lobo_superior', nota: `${BOYDEN} Muitos textos fundem os brônquios apical e posterior num só (apicoposterior, B1+2).`,
  }),
  seg('e', 'posterior', 2, 'posterior', 'posterior', 'brônquio lobar superior', 'posterior (S2), na parte de trás do lobo superior', 'Dirige-se para trás e para fora.', {
    lobe: 'pulmao_e_lobo_superior', nota: `${BOYDEN} Muitos textos fundem os brônquios apical e posterior num só (apicoposterior, B1+2).`,
  }),
  seg('e', 'anterior', 3, 'anterior', 'anterior', 'brônquio lobar superior', 'anterior (S3), na frente do lobo superior', 'Dirige-se para a frente.', { lobe: 'pulmao_e_lobo_superior' }),
  seg('e', 'lingular_superior', 4, 'lingular superior', 'lingularis superior', 'brônquio lingular (ramo do brônquio lobar superior)', 'lingular superior (S4), na parte alta da língula', 'Dirige-se para a frente e para baixo, para a língula.', {
    lobe: 'pulmao_e_lobo_superior', clinica: `${UNIDADE} A língula, como o lobo médio direito, é sede frequente de atelectasia.`,
  }),
  seg('e', 'lingular_inferior', 5, 'lingular inferior', 'lingularis inferior', 'brônquio lingular (ramo do brônquio lobar superior)', 'lingular inferior (S5), na parte baixa da língula', 'Dirige-se para baixo, na língula.', {
    lobe: 'pulmao_e_lobo_superior', clinica: `${UNIDADE} A língula, como o lobo médio direito, é sede frequente de atelectasia.`,
  }),
  seg('e', 'superior', 6, 'superior', 'superior', 'brônquio lobar inferior', 'superior (S6) do lobo inferior', 'Nasce da parede posterior do brônquio lobar inferior e vai para trás.', {
    lobe: 'pulmao_e_lobo_inferior', clinica: 'É um dos segmentos mais atingidos pela aspiração em decúbito dorsal e por abscessos pulmonares.',
  }),
  seg('e', 'basal_medial', 7, 'basal medial', 'basalis medialis', 'brônquio lobar inferior', 'basal medial (S7)', 'Dirige-se para a parte medial da base do lobo inferior.', {
    lobe: 'pulmao_e_lobo_inferior', nota: `${BOYDEN} Muitos textos fundem os brônquios basais medial e anterior num só (anteromedial basal, B7+8).`,
  }),
  seg('e', 'basal_anterior', 8, 'basal anterior', 'basalis anterior', 'brônquio lobar inferior', 'basal anterior (S8)', 'Dirige-se para a frente e para baixo, na parte anterior da base.', {
    lobe: 'pulmao_e_lobo_inferior', nota: `${BOYDEN} Muitos textos fundem os brônquios basais medial e anterior num só (anteromedial basal, B7+8).`,
  }),
  seg('e', 'basal_lateral', 9, 'basal lateral', 'basalis lateralis', 'brônquio lobar inferior', 'basal lateral (S9)', 'Dirige-se para a face lateral da base do lobo inferior.', { lobe: 'pulmao_e_lobo_inferior' }),
  seg('e', 'basal_posterior', 10, 'basal posterior', 'basalis posterior', 'brônquio lobar inferior', 'basal posterior (S10), o mais posterior e mais baixo', 'Dirige-se para trás e para baixo, na parte posterior da base.', { lobe: 'pulmao_e_lobo_inferior' }),

  /* ═════════════ Pleuras (esquema) ═════════════ */
  ...[['d', 'direita', ['pulmao_d_lobo_superior', 'pulmao_d_lobo_medio', 'pulmao_d_lobo_inferior'], 'Direito'], ['e', 'esquerda', ['pulmao_e_lobo_superior', 'pulmao_e_lobo_inferior'], 'Esquerdo']].map(([lado, nome, lobos, lobosNome]) => ({
    kind: 'estrutura',
    id: `pleura_${lado}`,
    name: `Pleura e cavidade pleural ${nome} — esquema`,
    latin: `Pleura et cavitas pleuralis ${lado === 'd' ? 'dextra' : 'sinistra'}`,
    layer: 'respiratorio',
    region: T,
    paired: false,
    mat: 'pericardio',
    color: '#bcd7e8',
    // contorno de cada pulmão, inflado; o banco não tem as pleuras
    proc: [{ kind: 'hull', pad: 0.07, of: lobos.map((l) => [l]) }],
    campos: [
      ['Localização', `Saco seroso que envolve o pulmão ${lobosNome === 'Direito' ? 'direito' : 'esquerdo'}, de duas lâminas contínuas: a pleura visceral, colada ao pulmão, e a pleura parietal, que forra a parede do tórax, o diafragma e o mediastino. Entre elas fica a cavidade pleural, virtual, com um pouco de líquido.`],
      ['Partes da pleura parietal', 'Costal, diafragmática, mediastinal e cervical (a cúpula, que sobe acima da 1ª costela e cobre o ápice do pulmão). A pleura se reflete da parede para o pulmão no hilo; abaixo dele, o ligamento pulmonar é uma prega de pleura.'],
      ['Recessos', 'Os recessos costodiafragmático e costomediastinal são espaços da cavidade pleural que o pulmão só ocupa na inspiração profunda. O costodiafragmático é o mais baixo: a pleura chega à 8ª costela na linha hemiclavicular, à 10ª na linha axilar média e à 12ª junto à coluna, enquanto o pulmão chega à 6ª, à 8ª e à 10ª.'],
      ['Inervação e clínica', 'A pleura parietal é sensível à dor (nervos intercostais e frênico); a visceral, não (plexo pulmonar). A toracocentese entra pela margem superior de uma costela, para poupar o feixe vasculonervoso do sulco costal; o ar na cavidade (pneumotórax) ou o líquido (derrame) afastam o pulmão da parede.'],
    ],
    nota: 'ESQUEMA: o modelo é só um envoltório inflado em volta de cada pulmão; não mostra as lâminas, a cavidade, os recessos nem a cúpula, e o BodyParts3D não tem as pleuras (M26).',
    relacionados: [...lobos, 'mediastino'],
  })),

  /* ═════════════ Cavidade nasal, seios paranasais, ligamentos da laringe, brônquios lobares e mediastino (esquemas) ═════════════ */
  {
    kind: 'orgao',
    id: 'cavidade_nasal',
    name: 'Cavidade nasal, conchas (média e superior) e meatos nasais — esquema',
    latin: 'Cavitas nasi; Conchae nasales superior et media; Meatus nasi',
    layer: 'respiratorio',
    region: 'cabeca',
    mat: 'airway',
    color: '#d48b84',
    paired: true,
    proc: [
      // Concha nasal superior e meato superior
      { kind: 'tube', pts: [[0.055, -0.19, 0.48], [0.065, -0.22, 0.56], [0.06, -0.25, 0.63]], ref: [1, 0, 0], width: 0.032, thick: 0.014, taper: 'blunt', nf: 14, nc: 8 },
      // Concha nasal média e meato médio (hiato semilunar / bula etmoidal)
      { kind: 'tube', pts: [[0.07, -0.27, 0.48], [0.088, -0.32, 0.6], [0.085, -0.36, 0.72], [0.07, -0.38, 0.8]], ref: [1, 0, 0], width: 0.048, thick: 0.018, taper: 'blunt', nf: 18, nc: 10 },
      // Corredor respiratório / coana posterior
      { kind: 'tube', pts: [[0.05, -0.46, 0.92], [0.065, -0.44, 0.72], [0.065, -0.45, 0.52], [0.06, -0.48, 0.38]], ref: [1, 0, 0], width: 0.06, thick: 0.025, taper: 'blunt', nf: 18, nc: 10 },
    ],
    campos: [
      ['Localização', 'Primeira porção das vias aéreas superiores, dividida no plano mediano pelo septo nasal (lâmina perpendicular do etmoide, vômer e cartilagem septal) em duas fossas que se abrem à frente pelas narinas (vestíbulo nasal) e atrás na nasofaringe pelas coanas (aberturas nasais posteriores).'],
      ['Estrutura', 'Cada parede lateral projeta três lâminas curvas — as conchas nasais superior e média (processos do osso etmoide) e a concha nasal inferior (osso independente) — que delimitam quatro passagens: 1) recesso esfenoetmoidal (acima da concha superior, onde abre o seio esfenoidal); 2) meato nasal superior (onde abrem as células etmoidais posteriores); 3) meato nasal médio (com a bula etmoidal e o hiato semilunar, onde drenam o seio frontal pelo infundíbulo, o seio maxilar e as células etmoidais anteriores e médias); e 4) meato nasal inferior (onde desemboca o ducto nasolacrimal).'],
      ['Relações', 'Teto formado pelos ossos nasal, frontal, lâmina cribriforme do etmoide (fossa craniana anterior, atravessada pelos filetes do nervo olfatório I) e corpo do esfenoide; assoalho formado pelo palato duro (processo palatino da maxila e lâmina horizontal do palatino); paredes laterais contíguas à órbita, ao seio maxilar e às células etmoidais.'],
      ['Aspectos clínicos', 'Aquece, umidifica e filtra o ar inspirado. Na parte anteroinferior do septo nasal situa-se o plexo arterial de Kiesselbach (área de Little — anastomose das artérias esfenopalatina, palatina maior, labial superior e etmoidais anterior e posterior), sede de cerca de 90 % das epistaxes anteriores. Fraturas da lâmina cribriforme causam rinorreia liquórica e anosmia.',],
    ],
    nota: 'ESQUEMA: a concha nasal inferior e as cartilagens nasais têm malha real no atlas; as conchas superior e média e os meatos nasais foram modelados por código entre o etmoide, o septo e a maxila.',
    relacionados: ['o_concha_inferior', 'o_etmoide', 'o_vomer', 'o_nasal', 'o_maxila', 'cartilagem_septal', 'cartilagem_nasal_lateral', 'cartilagem_alar_maior', 'ducto_nasolacrimal', 'seios_paranasais', 'tuba_auditiva', 'arteria_maxilar', 'arteria_facial'],
  },

  {
    kind: 'estrutura',
    id: 'seios_paranasais',
    name: 'Seios paranasais (frontal, maxilar, esfenoidal e etmoidais) — esquema',
    latin: 'Sinus paranasales (frontalis, maxillaris, sphenoidalis, ethmoidales)',
    layer: 'respiratorio',
    region: 'cabeca',
    mat: 'pericardio',
    color: '#8ecae6',
    paired: true,
    proc: [
      // Seio frontal (na escama/glabela do osso frontal, acima da margem supraorbital)
      { kind: 'tube', pts: [[0.04, 0.01, 0.78], [0.12, 0.04, 0.77], [0.22, 0.06, 0.74]], ref: [0, 0, 1], width: 0.085, thick: 0.045, taper: 'blunt', nf: 14, nc: 10 },
      // Células etmoidais (labirinto etmoidal entre a cavidade nasal e a parede medial da órbita)
      { kind: 'tube', pts: [[0.095, -0.15, 0.67], [0.11, -0.19, 0.58], [0.11, -0.22, 0.49]], ref: [1, 0, 0], width: 0.06, thick: 0.04, taper: 'blunt', nf: 14, nc: 10 },
      // Seio esfenoidal (dentro do corpo do esfenoide, logo abaixo da sela turca e da hipófise)
      { kind: 'tube', pts: [[0.055, -0.19, 0.4], [0.065, -0.22, 0.32]], ref: [1, 0, 0], width: 0.075, thick: 0.055, taper: 'blunt', nf: 10, nc: 10 },
      // Seio maxilar (antro de Highmore, no corpo da maxila, abaixo do assoalho da órbita)
      { kind: 'tube', pts: [[0.18, -0.32, 0.7], [0.23, -0.39, 0.66], [0.22, -0.46, 0.62]], ref: [0, 0, 1], width: 0.14, thick: 0.12, taper: 'blunt', nf: 16, nc: 12 },
    ],
    campos: [
      ['Localização', 'Quatro pares de cavidades pneumáticas revestidas por mucosa respiratória ciliada (epitélio pseudoestratificado colunar ciliado contínuo com o da cavidade nasal) escavadas nos ossos homônimos ao redor da órbita e da cavidade nasal: seios frontais, células etmoidais (anteriores, médias e posteriores), seios esfenoidais e seios maxilares.'],
      ['Drenagem e estrutura', 'Drenam para a parede lateral da cavidade nasal: 1) seio frontal → ducto frontonasal → infundíbulo etmoidal → meato médio (V1, nervo supraorbital); 2) células etmoidais anteriores e médias → meato médio, e posteriores → meato superior (V1, nervos etmoidais); 3) seio esfenoidal → recesso esfenoetmoidal (V1/V2); e 4) seio maxilar (o maior, piramidal) → óstio maxilar na parte alta da parede medial → hiato semilunar do meato médio (V2, nervos alveolares superiores e infraorbital).'],
      ['Relações', 'O teto do seio maxilar é o assoalho da órbita (com o canal infraorbital) e seu assoalho relaciona-se intimamente com as raízes dos molares e pré-molares superiores; as células etmoidais são separadas da órbita pela finíssima lâmina orbital (papirácea); o seio esfenoidal situa-se imediatamente abaixo da sela turca (hipófise) e do quiasma óptico, e medialmente aos seios cavernosos e às artérias carótidas internas.'],
      ['Aspectos clínicos', 'Como o óstio do seio maxilar fica na parte superior de sua parede medial, a drenagem em posição ortostática não é gravitacional e depende do batimento mucociliar, tornando-o o seio mais acometido nas rinossinusites; infecções dentárias superiores podem causar sinusite maxilar odontogênica (e extrações podem criar fístula oroantral). A etmoidite em crianças pode romper a lâmina papirácea e causar celulite orbitária; o seio esfenoidal é a via cirúrgica transesfenoidal padrão para abordar adenomas da hipófise.',],
    ],
    nota: 'ESQUEMA: como os ossos do crânio no BodyParts3D são cascas fechadas sem cavidades internas separadas, os quatro pares de seios paranasais foram modelados por código no interior do frontal, do etmoide, do esfenoide e da maxila.',
    relacionados: ['cavidade_nasal', 'o_frontal', 'o_maxila', 'o_esfenoide', 'o_etmoide', 'o_concha_inferior', 'hipofise', 'ducto_nasolacrimal', 'o_dentes_sup'],
  },

  {
    kind: 'ligamento',
    id: 'membrana_laringea_vocal',
    name: 'Membrana tíreo-hióidea, ligamento cricotireóideo e ligamento vocal — esquema',
    latin: 'Membrana thyrohyoidea; Ligamentum cricothyroideum; Ligamentum vocale',
    layer: 'respiratorio',
    region: 'cabeca',
    mat: 'ligament',
    color: '#e5cf8e',
    paired: true,
    proc: [
      // Membrana tíreo-hióidea: da margem superior da cartilagem tireóidea ao osso hioide
      { kind: 'tube', pts: [[0.0, -1.03, 0.34], [0.08, -1.07, 0.3], [0.15, -1.11, 0.22]], ref: [0, 1, 0], width: 0.09, thick: 0.012, taper: 'blunt', nf: 14, nc: 8 },
      // Ligamento cricotireóideo mediano e cone elástico (entre a cartilagem tireóidea e o arco da cricóidea)
      { kind: 'tube', pts: [[0.0, -1.33, 0.27], [0.035, -1.35, 0.25], [0.06, -1.36, 0.21]], ref: [0, 1, 0], width: 0.075, thick: 0.014, taper: 'blunt', nf: 12, nc: 8 },
      // Ligamento vocal (margem superior livre do cone elástico): do ângulo interno da tireóidea ao processo vocal da aritenóide
      { kind: 'tube', pts: [[0.008, -1.24, 0.31], [0.022, -1.26, 0.22], [0.034, -1.28, 0.14]], ref: [0, 1, 0], width: 0.018, thick: 0.014, taper: 'blunt', nf: 12, nc: 8 },
    ],
    campos: [
      ['Origem', 'Membrana tíreo-hióidea: margem superior das lâminas e cornos superiores da cartilagem tireóidea. Cone elástico (membrana cricovocal) e ligamento cricotireóideo: margem superior do arco da cartilagem cricóidea e face interna do ângulo da cartilagem tireóidea.'],
      ['Inserção', 'Membrana tíreo-hióidea: corpo e cornos maiores do osso hioide. Ligamento vocal (borda superior livre espessada do cone elástico): processo vocal da cartilagem aritenóidea homolateral.'],
      ['Função', 'Sustentam o esqueleto fibroelástico extrínseco e intrínseco da laringe. O ligamento vocal (rico em fibras elásticas) forma, junto com o músculo vocal, o arcabouço vibrátil da prega vocal verdadeira, delimitando a rima da glote (porção intermembranácea). Acima dele, a membrana quadrangular vai da epiglote à aritenóide e sua borda inferior livre forma o ligamento vestibular (prega vestibular ou falsa).'],
      ['Relações', 'A membrana tíreo-hióidea é perfurada lateralmente pelo ramo interno do nervo laríngeo superior e pelos vasos laríngeos superiores. O ligamento cricotireóideo mediano fica subcutâneo na linha mediana, entre as cartilagens tireóidea e cricóidea, sendo o ponto anatômico da cricotireoidotomia (coniotomia) de urgência para acesso rápido à via aérea infraglótica.'],
    ],
    nota: 'ESQUEMA: a membrana tíreo-hióidea, o ligamento cricotireóideo (cone elástico) e o ligamento vocal foram modelados por código entre o osso hioide e as cartilagens tireóidea, cricóidea e aritenóides.',
    relacionados: ['o_hioide', 'cartilagem_tireoidea', 'cartilagem_cricoidea', 'cartilagens_aritenoides', 'epiglote', 'vocal', 'tireoaritenoideo', 'cricotireoideo', 'tireohioideo'],
  },

  {
    kind: 'orgao',
    id: 'bronquios_lobares',
    name: 'Brônquios lobares (secundários) e brônquio intermediário — esquema',
    latin: 'Bronchi lobares superiores, medius et inferiores; Bronchus intermedius',
    layer: 'respiratorio',
    region: T,
    mat: 'airway',
    color: AIR,
    paired: false,
    proc: [
      // Direito: lobar superior (eparterial), brônquio intermediário, lobar médio e lobar inferior
      { kind: 'tube', pts: [[-0.24, -2.58, -0.04], [-0.34, -2.42, 0.02], [-0.42, -2.28, 0.08]], ref: [0, 0, 1], width: 0.055, thick: 0.05, taper: 'blunt', nf: 14, nc: 10 },
      { kind: 'tube', pts: [[-0.24, -2.58, -0.04], [-0.31, -2.76, -0.05], [-0.36, -2.92, -0.04]], ref: [0, 0, 1], width: 0.062, thick: 0.056, taper: 'blunt', nf: 14, nc: 10 },
      { kind: 'tube', pts: [[-0.36, -2.92, -0.04], [-0.44, -2.98, 0.14], [-0.52, -3.04, 0.28]], ref: [0, 1, 0], width: 0.045, thick: 0.042, taper: 'blunt', nf: 14, nc: 10 },
      { kind: 'tube', pts: [[-0.36, -2.92, -0.04], [-0.45, -3.12, -0.08], [-0.52, -3.28, -0.1]], ref: [0, 0, 1], width: 0.055, thick: 0.05, taper: 'blunt', nf: 14, nc: 10 },
      // Esquerdo: lobar superior (com tronco lingular) e lobar inferior
      { kind: 'tube', pts: [[0.42, -2.74, -0.08], [0.5, -2.56, 0.02], [0.56, -2.4, 0.1]], ref: [0, 0, 1], width: 0.052, thick: 0.048, taper: 'blunt', nf: 14, nc: 10 },
      { kind: 'tube', pts: [[0.5, -2.56, 0.02], [0.56, -2.78, 0.18], [0.6, -2.96, 0.3]], ref: [0, 1, 0], width: 0.042, thick: 0.038, taper: 'blunt', nf: 14, nc: 10 },
      { kind: 'tube', pts: [[0.42, -2.74, -0.08], [0.5, -2.96, -0.1], [0.56, -3.16, -0.12]], ref: [0, 0, 1], width: 0.055, thick: 0.05, taper: 'blunt', nf: 14, nc: 10 },
    ],
    campos: [
      ['Localização', 'Brônquios de 2ª ordem que nascem da divisão dos brônquios principais no hilo pulmonar (três à direita e dois à esquerda), cada um destinado a um lobo pulmonar, onde se divide nos brônquios segmentares (B1 a B10).'],
      ['Estrutura', 'À direita, o brônquio lobar superior nasce logo fora do hilo, acima da artéria pulmonar direita (brônquio eparterial, dando B1, B2 e B3), e o tronco continua por 2 a 3 cm como brônquio intermediário antes de bifurcar-se nos brônquios lobar médio (B4 e B5) e lobar inferior direito (B6 a B10). À esquerda, os dois brônquios lobares são hiparteriais (abaixo da artéria pulmonar esquerda): o brônquio lobar superior esquerdo divide-se em divisão superior (B1+2 e B3) e brônquio lingular (B4 e B5), e o lobar inferior esquerdo origina B6 a B10.'],
      ['Relações', 'Nos hilos pulmonares, os brônquios ocupam posição posterior em relação às artérias pulmonares (intermediárias) e às veias pulmonares (anteroinferiores); à direita, o brônquio lobar superior fica acima da artéria pulmonar, enquanto à esquerda a artéria pulmonar cavalga por cima do brônquio lobar superior.'],
      ['Aspectos clínicos', 'Nas lobectomias pulmonares (tratamento padrão do carcinoma pulmonar inicial), a dissecção e o grampeamento individual do brônquio lobar correspondente e dos vasos lobares no hilo permitem remover o lobo preservando os demais; a obstrução do brônquio lobar médio por linfonodos peribrônquicos produz a síndrome do lobo médio.'],
    ],
    nota: 'ESQUEMA: como o BodyParts3D traz apenas os brônquios principais e as árvores segmentares (sem o trecho lobar intermediário), os brônquios lobares e o brônquio intermediário direito foram modelados por código unindo os principais às raízes segmentares.',
    relacionados: ['bronquio_principal_d', 'bronquio_principal_e', 'pulmao_d_lobo_superior', 'pulmao_d_lobo_medio', 'pulmao_d_lobo_inferior', 'pulmao_e_lobo_superior', 'pulmao_e_lobo_inferior', 'bronquio_seg_d_apical', 'bronquio_seg_d_lateral', 'bronquio_seg_d_superior', 'bronquio_seg_e_apical', 'bronquio_seg_e_lingular_superior', 'bronquio_seg_e_superior'],
  },

  {
    kind: 'estrutura',
    id: 'mediastino',
    name: 'Mediastino (superior, anterior, médio e posterior) — esquema',
    latin: 'Mediastinum (superius, anterius, medium et posterius)',
    layer: 'respiratorio',
    region: T,
    mat: 'pericardio',
    color: '#c9b89c',
    paired: false,
    proc: [
      // Mediastino superior (da abertura superior do tórax ao plano do ângulo do esterno T4–T5)
      { kind: 'tube', pts: [[0.0, -1.75, 0.22], [0.0, -2.1, 0.25], [0.0, -2.42, 0.28]], ref: [1, 0, 0], width: 0.56, thick: 0.48, taper: 'blunt', nf: 12, nc: 12 },
      // Mediastino posterior (atrás do pericárdio e à frente das vértebras T5–T12: esôfago, aorta torácica, ázigo e ducto torácico)
      { kind: 'tube', pts: [[0.02, -2.45, -0.02], [0.04, -3.1, 0.02], [0.05, -3.75, 0.06]], ref: [1, 0, 0], width: 0.42, thick: 0.34, taper: 'blunt', nf: 14, nc: 12 },
    ],
    campos: [
      ['Localização', 'Compartimento central da cavidade torácica situado entre as duas cavidades pleurais (faces mediastinais das pleuras direita e esquerda), do esterno e cartilagens costais à frente até os corpos das vértebras torácicas (T1–T12) atrás, e da abertura superior do tórax ao diafragma.'],
      ['Divisões e conteúdo', 'O plano transverso do tórax — que passa pelo ângulo do esterno (de Louis, 2ª cartilagem costal) e pelo disco intervertebral T4–T5 (nível da carina, do início e fim do arco da aorta e da entrada da ázigo na cava superior) — divide-o em: 1) mediastino superior (timo, veias braquiocefálicas e cava superior alta, arco da aorta e seus 3 ramos, traqueia, esôfago, nervos vagos, recorrente esquerdo e frênicos, ducto torácico); e 2) mediastino inferior, subdividido pelo pericárdio em anterior (timo inferior, linfonodos e tecido adiposo), médio (pericárdio, coração, raízes dos grandes vasos, brônquios principais e nervos frênicos) e posterior (esôfago, aorta torácica descendente, sistema venoso ázigo/hemiázigo, ducto torácico, troncos vagais e troncos simpáticos torácicos).'],
      ['Relações', 'Comunica-se livremente acima com os espaços fasciais profundos do pescoço (espaço pré-traqueal e espaço retrofaríngeo/"danger space") pela abertura superior do tórax, e abaixo com o retroperitônio pelos hiatos diafragmáticos (da cava em T8, esofágico em T10 e aórtico em T12).'],
      ['Aspectos clínicos', 'Infecções odontogênicas ou retrofaríngeas do pescoço podem descer pelo espaço retrofaríngeo até o mediastino posterior, causando mediastinite necrosante aguda de alta letalidade. As massas do mediastino anterior lembram-se pelos "4 Ts": Timoma, Teratoma (tumores germinativos), Tireoide (bócio mergulhante) e "Terrível" linfoma. No pneumotórax hipertensivo, o aumento de pressão em uma cavidade pleural desvia o mediastino para o lado oposto, comprimindo as veias cavas e reduzindo o retorno venoso.',],
    ],
    nota: 'ESQUEMA: como o mediastino é uma região anatômica ocupada pelos órgãos centrais do tórax, seu volume superior e posterior é indicado por código entre as duas pleuras, o esterno e a coluna torácica.',
    relacionados: ['timo', 'pericardio', 'pleura_d', 'pleura_e', 'traqueia', 'esofago', 'arco_aorta', 'aorta_toracica', 'veia_cava_superior', 'veia_azigo', 'ducto_toracico', 'linfonodos_mediastinais', 'o_esterno', 'diafragma'],
  },

  /* ═════════════ Cartilagens da laringe ═════════════ */
  bone('cartilagem_tireoidea', 'Cartilagem tireóidea', 'Cartilago thyroidea', 'cabeca', ['cartilagem_tireoidea'], {
    local: 'Pescoço, na frente da laringe, ao nível de C4–C5; é a maior das cartilagens da laringe.',
    artic: 'Cartilagem cricóidea (articulação cricotireóidea, pelos cornos inferiores) e osso hioide (membrana tíreo-hióidea, ligada aos cornos superiores).',
    estruturas: 'Duas lâminas que se unem na frente em ângulo, a proeminência laríngea (“pomo de Adão”), mais aguda no homem (cerca de 90°) que na mulher (cerca de 120°); incisura tireóidea superior, linha oblíqua e cornos superior e inferior.',
    funcao: 'Protege as pregas vocais. Dá inserção aos músculos tireoaritenóideo e cricotireóideo e, pela linha oblíqua, ao esternotireóideo, ao tíreo-hióideo e ao constritor inferior da faringe.',
    nota: 'É de cartilagem hialina e pode ossificar com a idade. A proeminência laríngea e a incisura tireóidea superior são referências palpáveis no pescoço.',
  }, { layer: 'cartilagem', mat: 'cartilage', relacionados: ['cartilagem_cricoidea', 'epiglote', 'cartilagens_aritenoides'] }),
  bone('cartilagem_cricoidea', 'Cartilagem cricóidea', 'Cartilago cricoidea', 'cabeca', ['cartilagem_cricoidea'], {
    local: 'Pescoço, abaixo da cartilagem tireóidea, ao nível de C6; é o limite inferior da laringe e o início da traqueia e do esôfago.',
    artic: 'Cartilagem tireóidea (articulação cricotireóidea), cartilagens aritenóideas (articulações cricoaritenóideas) e o primeiro anel da traqueia (ligamento cricotraqueal).',
    estruturas: 'Anel em forma de sinete, com a lâmina posterior larga e o arco anterior estreito.',
    funcao: 'Sustenta a laringe e dá inserção aos músculos cricotireóideo (no arco), cricoaritenóideos posterior e lateral e à parte cricofaríngea do constritor inferior.',
    nota: 'É o único anel cartilagíneo completo da via aérea. A cricotireoidotomia de emergência é feita pela membrana cricotireóidea, entre a tireóidea e a cricóidea.',
  }, { layer: 'cartilagem', mat: 'cartilage', relacionados: ['cartilagem_tireoidea', 'cartilagens_aritenoides', 'traqueia'] }),
  bone('cartilagens_aritenoides', 'Cartilagens aritenóideas', 'Cartilagines arytenoideae', 'cabeca', ['cartilagens_aritenoides'], {
    local: 'Parte posterior da laringe, sobre a margem superior da lâmina da cartilagem cricóidea; são duas, em forma de pirâmide.',
    artic: 'Cartilagem cricóidea (articulação cricoaritenóidea) e, pelo ápice, cartilagem corniculada.',
    estruturas: 'Ápice, base com o processo vocal (onde se prende o ligamento vocal) e o processo muscular (inserção dos cricoaritenóideos posterior e lateral).',
    funcao: 'Deslizam e giram sobre a cricóidea: abrem e fecham a rima da glote e tensionam ou relaxam as pregas vocais.',
    nota: 'A paralisia do nervo laríngeo recorrente imobiliza a aritenóide do lado afetado e causa rouquidão.',
  }, { layer: 'cartilagem', mat: 'cartilage', relacionados: ['cartilagem_cricoidea', 'cartilagem_tireoidea', 'cartilagens_corniculadas'] }),
  bone('epiglote', 'Epiglote', 'Epiglottis', 'cabeca', ['epiglote'], {
    local: 'Atrás da raiz da língua e do osso hioide, na entrada da laringe (ádito da laringe).',
    artic: 'Prende-se ao ângulo da cartilagem tireóidea por um pecíolo (ligamento tireoepiglótico) e ao hioide pelo ligamento hioepiglótico.',
    estruturas: 'Cartilagem em forma de folha, com a face anterior (voltada para a língua, de onde saem as pregas glossoepiglóticas) e a posterior (voltada para a laringe).',
    funcao: 'Na deglutição, a laringe sobe e a epiglote se inclina sobre o ádito da laringe, desviando o alimento para o esôfago.',
    nota: 'É de cartilagem elástica, diferente da tireóidea e da cricóidea (hialinas). A epiglotite (infecção aguda) pode obstruir a via aérea.',
  }, { layer: 'cartilagem', mat: 'cartilage', relacionados: ['cartilagem_tireoidea', 'cartilagens_corniculadas', 'cartilagens_cuneiformes'] }),
  bone('cartilagens_corniculadas', 'Cartilagens corniculadas', 'Cartilagines corniculatae', 'cabeca', ['cartilagens_corniculadas'], {
    local: 'No ápice de cada cartilagem aritenóidea, dentro da prega ariepiglótica.',
    artic: 'Cartilagem aritenóidea (pelo ápice).',
    estruturas: 'Dois pequenos nódulos que formam os tubérculos corniculados, visíveis na laringoscopia.',
    funcao: 'Dão rigidez à parte posterior das pregas ariepiglóticas.',
  }, { layer: 'cartilagem', mat: 'cartilage', relacionados: ['cartilagens_aritenoides', 'cartilagens_cuneiformes', 'epiglote'] }),
  bone('cartilagens_cuneiformes', 'Cartilagens cuneiformes', 'Cartilagines cuneiformes', 'cabeca', ['cartilagens_cuneiformes'], {
    local: 'Dentro das pregas ariepiglóticas, à frente das cartilagens corniculadas.',
    artic: 'Não se articulam: ficam soltas na prega.',
    estruturas: 'Dois pequenos bastões que formam os tubérculos cuneiformes.',
    funcao: 'Dão rigidez às pregas ariepiglóticas.',
  }, { layer: 'cartilagem', mat: 'cartilage', relacionados: ['cartilagens_corniculadas', 'epiglote'] }),
];
