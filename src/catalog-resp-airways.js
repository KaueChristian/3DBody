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
    nota: 'Os brônquios lobares, que ficam entre o principal e os segmentares, não existem no BodyParts3D e não estão no modelo.',
  }, {
    relacionados: ['traqueia', 'arteria_pulmonar_direita', 'veia_azigo', 'pulmao_d_lobo_superior', 'pulmao_d_lobo_medio', 'pulmao_d_lobo_inferior'],
  }),
  via('bronquio_principal_e', 'Brônquio principal esquerdo', 'Bronchus principalis sinister', T, ['bronquio_principal_e'], {
    local: 'Vai da carina ao hilo do pulmão esquerdo.',
    estrutura: 'É mais longo (cerca de 5 cm), mais estreito e mais horizontal que o direito. Divide-se, no hilo, nos brônquios lobares superior e inferior; passa abaixo da artéria pulmonar (brônquio hiparterial).',
    relacoes: 'Passa por baixo do arco da aorta, na frente do esôfago e da aorta torácica, e a artéria pulmonar esquerda o cruza por cima.',
    clinica: 'O átrio esquerdo muito dilatado levanta o brônquio principal esquerdo e alarga o ângulo da carina. O arco da aorta (aneurisma) pode comprimi-lo.',
    nota: 'Os brônquios lobares não existem no BodyParts3D e não estão no modelo.',
  }, {
    relacionados: ['traqueia', 'arco_aorta', 'arteria_pulmonar_esquerda', 'pulmao_e_lobo_superior', 'pulmao_e_lobo_inferior'],
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
    relacionados: lobos,
  })),

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
