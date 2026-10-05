/**
 * Músculos. `proc` = geometria procedural (desenhada sobre a anatomia real); `parts` = malhas reais do BodyParts3D.
 * Coordenadas procedurais: lado esquerdo (x > 0); o direito é espelhado. Ver src/proc.js.
 */

const mus = (id, name, latin, layer, geom, d, extra = {}) => ({
  kind: 'musculo',
  id,
  name,
  latin,
  layer,
  ...geom,
  campos: [
    ['Ação', d.acao],
    ['Origem', d.origem],
    ['Inserção', d.insercao],
    ['Inervação', d.inervacao],
  ],
  nota: d.nota,
  expressao: d.expressao,
  ...extra,
});

export const MUSCLES = [
  /* ───────── Couro cabeludo e orelha ───────── */
  mus('frontal', 'Ventre frontal do occipitofrontal', 'Venter frontalis m. occipitofrontalis', 'mimica', {
    proc: [
      { kind: 'sheet', proj: 'z+', inset: 0.05, thick: 0.03,
        A: [[0.004, 0.8], [0.22, 0.81], [0.42, 0.78], [0.56, 0.7]],
        B: [[0.004, 0.2], [0.18, 0.15], [0.4, 0.14], [0.56, 0.07]] },
    ],
  }, {
    acao: 'Eleva as sobrancelhas e enruga a pele da testa (surpresa, atenção). Com o ventre occipital como ponto fixo, move o couro cabeludo.',
    origem: 'Gálea aponeurótica (aponeurose epicrânica).',
    insercao: 'Pele e tecido subcutâneo das sobrancelhas e da glabela, misturando-se às fibras do prócero, do corrugador do supercílio e do orbicular do olho.',
    inervacao: 'Ramos temporais do nervo facial (VII).',
    nota: 'Não tem inserção óssea. Na paralisia facial central (ex.: AVC) a testa costuma ser poupada, pois recebe inervação cortical bilateral; na periférica (ex.: paralisia de Bell) a testa fica lisa.',
    expressao: 'Surpresa, atenção',
  }),
  mus('occipital', 'Ventre occipital do occipitofrontal', 'Venter occipitalis m. occipitofrontalis', 'mimica', {
    proc: [
      { kind: 'sheet', proj: 'z-', inset: 0.05, thick: 0.025,
        A: [[0.02, 0.58], [0.28, 0.55], [0.5, 0.42]],
        B: [[0.02, 0.14], [0.28, 0.1], [0.5, 0.04]] },
    ],
  }, {
    acao: 'Traciona o couro cabeludo para trás, tensionando a gálea.',
    origem: 'Dois terços laterais da linha nucal suprema do occipital e processo mastoide do temporal.',
    insercao: 'Gálea aponeurótica.',
    inervacao: 'Ramo auricular posterior do nervo facial (VII).',
    nota: 'Visível pela vista posterior da cabeça — gire o modelo.',
  }),
  mus('auricular_sup', 'Auricular superior', 'M. auricularis superior', 'mimica', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.035, thick: 0.018,
        A: [[-0.14, 0.4], [-0.02, 0.43], [0.1, 0.4]],
        B: [[-0.1, 0.0], [-0.02, 0.0], [0.07, 0.0]] },
    ],
  }, {
    acao: 'Eleva discretamente a orelha (rudimentar na maioria das pessoas).',
    origem: 'Gálea aponeurótica (lateralmente).',
    insercao: 'Face superior (raiz) da cartilagem da orelha.',
    inervacao: 'Ramos temporais do nervo facial (VII).',
    nota: 'É o maior dos três músculos auriculares.',
  }),
  mus('auricular_ant', 'Auricular anterior', 'M. auricularis anterior', 'mimica', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.03, thick: 0.016,
        A: [[0.26, 0.28], [0.22, 0.12]],
        B: [[0.08, -0.05], [0.1, -0.14]] },
    ],
  }, {
    acao: 'Traciona a orelha anterior e superiormente.',
    origem: 'Fáscia temporal (parte anterior da gálea).',
    insercao: 'Hélice (parte anterior da orelha).',
    inervacao: 'Ramos temporais do nervo facial (VII).',
  }),
  mus('auricular_post', 'Auricular posterior', 'M. auricularis posterior', 'mimica', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.03, thick: 0.016,
        A: [[-0.36, -0.14], [-0.37, -0.3]],
        B: [[-0.2, -0.12], [-0.2, -0.3]] },
    ],
  }, {
    acao: 'Traciona a orelha posteriormente.',
    origem: 'Processo mastoide do temporal.',
    insercao: 'Raiz da concha da orelha (face posterior).',
    inervacao: 'Ramo auricular posterior do nervo facial (VII).',
  }),

  /* ───────── Região orbital e glabela ───────── */
  mus('orbicular_olho', 'Orbicular do olho', 'M. orbicularis oculi', 'mimica', {
    proc: [
      // parte orbital (anel externo)
      { kind: 'ring', proj: 'z+', c: [0.31, -0.165], inner: [0.2, 0.115], outer: [0.4, 0.27], inset: 0.04, thick: 0.02 },
      // parte palpebral (pálpebras)
      { kind: 'ring', proj: 'z+', c: [0.3, -0.165], inner: [0.145, 0.055], outer: [0.215, 0.125], inset: 0.022, thick: 0.01, nf: 56 },
    ],
  }, {
    acao: 'Fecha as pálpebras: a parte palpebral fecha suavemente (piscar), a parte orbital fecha com força (cerrar os olhos) e traciona a sobrancelha para baixo. A parte lacrimal auxilia a drenagem da lágrima.',
    origem: 'Parte orbital: crista lacrimal anterior, processo frontal da maxila e parte nasal do frontal. Parte palpebral: ligamento palpebral medial.',
    insercao: 'Pele ao redor da órbita, placas tarsais e ligamento palpebral lateral (rafe palpebral lateral).',
    inervacao: 'Ramos temporais e zigomáticos do nervo facial (VII).',
    nota: 'Na paralisia de Bell o olho não fecha (lagoftalmo), com risco de ressecamento da córnea. O "sorriso de Duchenne" (genuíno) envolve este músculo.',
    expressao: 'Piscar, sorriso genuíno, olhos cerrados',
  }),
  mus('corrugador', 'Corrugador do supercílio', 'M. corrugator supercilii', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.05, thick: 0.02, path: [[0.07, 0.06], [0.17, 0.11], [0.31, 0.16]], width: [0.045, 0.065, 0.035] }],
  }, {
    acao: 'Traciona as sobrancelhas medial e inferiormente: franzir a testa (preocupação, raiva, concentração). Forma as linhas verticais da glabela.',
    origem: 'Extremidade medial do arco superciliar do frontal.',
    insercao: 'Pele acima da metade medial do arco supraorbital (sobrancelha).',
    inervacao: 'Ramos temporais do nervo facial (VII).',
    nota: 'Alvo frequente de toxina botulínica nas rugas de expressão entre as sobrancelhas.',
    expressao: 'Preocupação, raiva, concentração',
  }),
  mus('depressor_supercilio', 'Abaixador do supercílio', 'M. depressor supercilii', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.035, thick: 0.014, path: [[0.15, -0.06], [0.15, 0.01], [0.14, 0.08]], width: [0.04, 0.045, 0.04] }],
  }, {
    acao: 'Traciona a parte medial da sobrancelha para baixo (franzir).',
    origem: 'Parte nasal do osso frontal e processo frontal da maxila (junto ao ligamento palpebral medial).',
    insercao: 'Pele da parte medial da sobrancelha (profundamente ao orbicular do olho).',
    inervacao: 'Ramos temporais e zigomáticos do nervo facial (VII).',
    nota: 'Considerado por alguns autores como parte do orbicular do olho.',
    expressao: 'Franzir, concentração',
  }),
  mus('procero', 'Prócero', 'M. procerus', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.04, thick: 0.02, path: [[0, -0.1], [0, 0.07], [0, 0.22]], width: [0.07, 0.09, 0.15] }],
  }, {
    acao: 'Traciona a pele da glabela para baixo, formando rugas transversais na raiz do nariz (desdém, concentração intensa).',
    origem: 'Fáscia sobre o osso nasal e a parte superior da cartilagem nasal lateral.',
    insercao: 'Pele da glabela, entre as sobrancelhas (une-se ao ventre frontal).',
    inervacao: 'Ramos temporais e zigomáticos do nervo facial (VII).',
    nota: 'Também chamado de "piramidal do nariz".',
    expressao: 'Desdém, concentração',
  }, { paired: false }),

  /* ───────── Nariz ───────── */
  mus('nasal', 'Nasal', 'M. nasalis (partes transversa e alar)', 'mimica', {
    proc: [
      { kind: 'ribbon', proj: 'z+', inset: 0.03, thick: 0.015, path: [[0.22, -0.52], [0.13, -0.4], [0.04, -0.3]], width: [0.06, 0.08, 0.06] },
      { kind: 'ribbon', proj: 'z+', inset: 0.03, thick: 0.012, path: [[0.26, -0.58], [0.22, -0.52], [0.19, -0.47]], width: [0.04, 0.05, 0.04] },
    ],
  }, {
    acao: 'A parte transversa comprime as narinas; a parte alar dilata-as (inspiração forçada, raiva).',
    origem: 'Maxila, lateralmente ao nariz (acima do incisivo lateral e do canino).',
    insercao: 'Parte transversa: aponeurose no dorso do nariz (une-se à do lado oposto). Parte alar: cartilagem alar maior.',
    inervacao: 'Ramos bucais do nervo facial (VII).',
    expressao: 'Dilatar as narinas, raiva',
  }),
  mus('depressor_septo', 'Abaixador do septo nasal', 'M. depressor septi nasi', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.03, thick: 0.012, path: [[0.025, -0.64], [0.025, -0.58], [0.03, -0.52]], width: [0.045, 0.05, 0.04] }],
  }, {
    acao: 'Traciona o nariz inferiormente e estreita as narinas; encurta o lábio superior ao sorrir.',
    origem: 'Maxila, sobre o incisivo central (fossa mirtiforme).',
    insercao: 'Septo nasal e parte posterior da cartilagem alar.',
    inervacao: 'Ramos bucais do nervo facial (VII).',
    nota: 'É responsável pela "ponta do nariz que cai" ao sorrir em algumas pessoas.',
  }),

  /* ───────── Boca, bochecha e mento ───────── */
  mus('orbicular_boca', 'Orbicular da boca', 'M. orbicularis oris', 'mimica', {
    proc: [{ kind: 'ring', proj: 'z+', c: [0, -0.785], inner: [0.14, 0.02], outer: [0.34, 0.17], inset: 0.045, thick: 0.03 }],
  }, {
    acao: 'Fecha e protrai os lábios (beijar, assobiar, articular palavras). Funciona como esfíncter da boca.',
    origem: 'Fibras do modíolo e dos músculos vizinhos; faixas medianas na maxila e na mandíbula.',
    insercao: 'Pele e mucosa dos lábios; modíolo (ângulo da boca).',
    inervacao: 'Ramos bucais e marginal da mandíbula do nervo facial (VII).',
    nota: 'Os demais músculos da boca inserem-se nele e no modíolo, o "nó" fibromuscular lateral à comissura labial.',
    expressao: 'Beijo, assobio, lábios apertados',
  }, { paired: false }),
  mus('levantador_labio_asa', 'Levantador do lábio superior e da asa do nariz', 'M. levator labii superioris alaeque nasi', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.04, thick: 0.015, path: [[0.11, -0.12], [0.14, -0.3], [0.19, -0.48], [0.17, -0.63]], width: [0.045, 0.05, 0.06, 0.07] }],
  }, {
    acao: 'Eleva o lábio superior e dilata a narina (expressão de desprezo, "sneer").',
    origem: 'Processo frontal da maxila.',
    insercao: 'Cartilagem alar maior e pele do lábio superior.',
    inervacao: 'Ramos zigomáticos e bucais do nervo facial (VII).',
    nota: 'Tem uma parte medial (alar) e outra lateral (labial).',
    expressao: 'Desprezo, nojo',
  }),
  mus('levantador_labio', 'Levantador do lábio superior', 'M. levator labii superioris', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.065, thick: 0.02, path: [[0.3, -0.34], [0.25, -0.5], [0.21, -0.66]], width: [0.14, 0.11, 0.09] }],
  }, {
    acao: 'Eleva e everte o lábio superior; aprofunda o sulco nasolabial.',
    origem: 'Margem infraorbital da maxila e osso zigomático (acima do forame infraorbital).',
    insercao: 'Pele e músculo do lábio superior.',
    inervacao: 'Ramos zigomáticos e bucais do nervo facial (VII).',
    nota: 'Cobre o nervo e os vasos infraorbitais.',
    expressao: 'Tristeza, desagrado',
  }),
  mus('zigomatico_menor', 'Zigomático menor', 'M. zygomaticus minor', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.045, thick: 0.018, path: [[0.43, -0.37], [0.34, -0.52], [0.26, -0.7]], width: [0.05, 0.06, 0.05] }],
  }, {
    acao: 'Eleva o lábio superior e aprofunda o sulco nasolabial (tristeza, sorriso).',
    origem: 'Face lateral do osso zigomático (posterior à sutura zigomaticomaxilar).',
    insercao: 'Lábio superior, medialmente ao zigomático maior.',
    inervacao: 'Ramos zigomáticos e bucais do nervo facial (VII).',
    nota: 'Pode estar ausente ou ser duplicado.',
    expressao: 'Tristeza, sorriso',
  }),
  mus('zigomatico_maior', 'Zigomático maior', 'M. zygomaticus major', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.04, thick: 0.022, path: [[0.57, -0.4], [0.44, -0.58], [0.31, -0.77]], width: [0.06, 0.075, 0.06] }],
  }, {
    acao: 'Traciona o ângulo da boca superior e lateralmente — o principal músculo do sorriso.',
    origem: 'Face lateral do osso zigomático, anterior à sutura zigomaticotemporal.',
    insercao: 'Modíolo, no ângulo da boca (mistura-se ao orbicular da boca).',
    inervacao: 'Ramos zigomáticos e bucais do nervo facial (VII).',
    nota: 'No sorriso genuíno ("de Duchenne") age junto ao orbicular do olho. Cirurgias de reanimação facial usam o masseter ou o gracilis para substituir sua função.',
    expressao: 'Sorriso',
  }),
  mus('levantador_angulo', 'Levantador do ângulo da boca', 'M. levator anguli oris', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.085, thick: 0.02, path: [[0.15, -0.45], [0.2, -0.6], [0.26, -0.76]], width: [0.065, 0.07, 0.05] }],
  }, {
    acao: 'Eleva o ângulo da boca e aprofunda o sulco nasolabial.',
    origem: 'Fossa canina da maxila, abaixo do forame infraorbital.',
    insercao: 'Modíolo no ângulo da boca.',
    inervacao: 'Ramos bucais e zigomáticos do nervo facial (VII).',
    nota: 'Fica profundo ao levantador do lábio superior e ao zigomático menor.',
    expressao: 'Sorriso suave',
  }),
  mus('risorio', 'Risório', 'M. risorius', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.035, thick: 0.015, path: [[0.6, -0.64], [0.46, -0.7], [0.32, -0.76]], width: [0.07, 0.06, 0.045] }],
  }, {
    acao: 'Traciona o ângulo da boca lateralmente (sorriso forçado, "sorriso de lado").',
    origem: 'Fáscia parotideomassetérica (sobre o masseter).',
    insercao: 'Modíolo no ângulo da boca.',
    inervacao: 'Ramos bucais do nervo facial (VII).',
    nota: 'Muito variável: pode ser ausente ou ter vários fascículos.',
    expressao: 'Sorriso forçado, tensão',
  }),
  mus('abaixador_angulo', 'Abaixador do ângulo da boca', 'M. depressor anguli oris', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.045, thick: 0.02, path: [[0.46, -1.04], [0.37, -0.92], [0.29, -0.8]], width: [0.14, 0.09, 0.045] }],
  }, {
    acao: 'Abaixa o ângulo da boca (tristeza, desaprovação).',
    origem: 'Linha oblíqua da mandíbula.',
    insercao: 'Modíolo no ângulo da boca.',
    inervacao: 'Ramos bucais e marginal da mandíbula do nervo facial (VII).',
    nota: 'Também chamado de "triangular dos lábios".',
    expressao: 'Tristeza, desaprovação',
  }),
  mus('abaixador_labio', 'Abaixador do lábio inferior', 'M. depressor labii inferioris', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.065, thick: 0.02, path: [[0.3, -1.05], [0.2, -0.97], [0.1, -0.88]], width: [0.12, 0.13, 0.11] }],
  }, {
    acao: 'Abaixa e everte o lábio inferior (ironia, careta ao mastigar e falar).',
    origem: 'Linha oblíqua da mandíbula, entre o forame mentual e a sínfise.',
    insercao: 'Pele e mucosa do lábio inferior, fundindo-se ao do lado oposto.',
    inervacao: 'Ramo marginal da mandíbula do nervo facial (VII).',
    nota: 'Também conhecido como "quadrado do lábio inferior".',
    expressao: 'Ironia, careta',
  }),
  mus('mentual', 'Mentual', 'M. mentalis', 'mimica', {
    proc: [{ kind: 'ribbon', proj: 'z+', inset: 0.045, thick: 0.025, path: [[0.04, -0.94], [0.05, -1.05], [0.07, -1.17]], width: [0.05, 0.09, 0.12] }],
  }, {
    acao: 'Eleva e protrai o lábio inferior e enruga a pele do queixo (dúvida, "beicinho").',
    origem: 'Fossa incisiva da mandíbula (acima dos incisivos).',
    insercao: 'Pele do mento (queixo).',
    inervacao: 'Ramo marginal da mandíbula do nervo facial (VII).',
    nota: 'Quando hiperativo causa a "pele de laranja" no queixo.',
    expressao: 'Dúvida, beicinho',
  }),
  mus('bucinador', 'Bucinador', 'M. buccinator', 'profundo', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.15, thick: 0.03,
        A: [[0.46, -0.56], [0.42, -0.72], [0.46, -0.9]],
        B: [[0.88, -0.72], [0.89, -0.78], [0.88, -0.84]] },
    ],
  }, {
    acao: 'Comprime as bochechas contra os dentes (mastigação, soprar, sugar); mantém o alimento sobre a mesa oclusal.',
    origem: 'Processos alveolares da maxila e da mandíbula (região dos molares) e rafe pterigomandibular.',
    insercao: 'Modíolo e lábios (mistura-se ao orbicular da boca).',
    inervacao: 'Ramos bucais do nervo facial (VII) — motora. O nervo bucal (V3) é apenas sensitivo.',
    nota: 'É o "músculo do trompetista". O ducto da glândula parótida o atravessa.',
    expressao: 'Soprar, assobiar',
  }),

  /* ───────── Mastigação ───────── */
  mus('masseter', 'Masseter', 'M. masseter', 'mastigacao', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.085, thick: 0.045,
        A: [[0.5, -0.36], [0.34, -0.34], [0.2, -0.32], [0.08, -0.31]],
        B: [[0.36, -0.86], [0.22, -0.9], [0.1, -0.88], [0.0, -0.8]] },
    ],
  }, {
    acao: 'Eleva a mandíbula (fechar a boca, morder); a parte profunda retrai levemente a mandíbula.',
    origem: 'Arco zigomático. Parte superficial: processo zigomático da maxila e 2/3 anteriores do arco; parte profunda: terço posterior e face medial do arco.',
    insercao: 'Face lateral do ramo e do ângulo da mandíbula.',
    inervacao: 'Nervo massetérico (ramo do mandibular, V3).',
    nota: 'Um dos músculos mais fortes por área do corpo. No bruxismo pode hipertrofiar e alargar o ângulo da mandíbula.',
    expressao: 'Morder, cerrar os dentes',
  }),
  mus('temporal', 'Temporal', 'M. temporalis', 'mastigacao', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.085, thick: 0.045, minDepth: 0.024,
        A: [[0.52, 0.18], [0.38, 0.42], [0.14, 0.53], [-0.16, 0.47], [-0.32, 0.28], [-0.3, 0.06]],
        B: [[0.5, -0.19], [0.44, -0.21], [0.4, -0.22], [0.36, -0.22], [0.32, -0.2], [0.28, -0.17]] },
      { kind: 'tube', pts: [[0.55, -0.2, 0.38], [0.49, -0.3, 0.44], 'mand.coronoide'], ref: [1, 0, 0], width: 0.13, thick: 0.05, taper: 'blunt' },
    ],
  }, {
    acao: 'Eleva a mandíbula (fibras anteriores, verticais) e a retrai (fibras posteriores, horizontais).',
    origem: 'Fossa temporal e face profunda da fáscia temporal.',
    insercao: 'Processo coronoide e margem anterior do ramo da mandíbula.',
    inervacao: 'Nervos temporais profundos (V3).',
    nota: 'Em forma de leque. A cefaleia tensional costuma envolver este músculo; a "têmpora" que se move ao mastigar é o seu ventre.',
    expressao: 'Mastigar',
  }),
  mus('pterigoideo_medial', 'Pterigóideo medial', 'M. pterygoideus medialis', 'profundo', {
    proc: [{ kind: 'tube', pts: ['esf.fossa_pterigoidea', [0.3, -0.58, 0.2], 'mand.ramo_med'], ref: [1, 0, 0], width: 0.12, thick: 0.07 }],
  }, {
    acao: 'Eleva a mandíbula; participa da protrusão e dos movimentos laterais de trituração.',
    origem: 'Fossa pterigóidea (lâmina lateral do processo pterigoide); cabeça superficial: túber da maxila e processo piramidal do palatino.',
    insercao: 'Face medial do ramo e do ângulo da mandíbula.',
    inervacao: 'Nervo pterigóideo medial (V3).',
    nota: 'Forma com o masseter a "funda pterigomassetérica" ao redor do ângulo da mandíbula.',
    expressao: 'Mastigar',
  }),
  mus('pterigoideo_lateral', 'Pterigóideo lateral', 'M. pterygoideus lateralis', 'profundo', {
    proc: [
      { kind: 'tube', pts: ['esf.crista_infratemporal', [0.42, -0.25, 0.22], 'mand.colo'], ref: [0, 1, 0], width: 0.085, thick: 0.06 },
      { kind: 'tube', pts: ['esf.lamina_lat', [0.38, -0.34, 0.2], 'mand.colo'], ref: [0, 1, 0], width: 0.085, thick: 0.06 },
    ],
  }, {
    acao: 'Protrai a mandíbula e abre a boca; promove os movimentos laterais de trituração.',
    origem: 'Cabeça superior: face infratemporal da asa maior do esfenoide. Cabeça inferior: face lateral da lâmina lateral do processo pterigoide.',
    insercao: 'Colo da mandíbula (fóvea pterigóidea), cápsula e disco articular da articulação temporomandibular.',
    inervacao: 'Nervo pterigóideo lateral (V3).',
    nota: 'É o único músculo da mastigação que abre a boca (os demais a fecham).',
    expressao: 'Abrir a boca, protrair a mandíbula',
  }),

  /* ───────── Pescoço e assoalho da boca (malhas reais do BodyParts3D) ───────── */
  mus('platisma', 'Platisma', 'Platysma', 'pescoco', { parts: [{ id: 'platisma', mat: 'muscle' }] }, {
    acao: 'Abaixa a mandíbula e o lábio inferior; tensiona a pele do pescoço (horror, tensão — forma as bandas platismais).',
    origem: 'Fáscia que recobre os músculos peitoral maior e deltoide (parte superior do tórax).',
    insercao: 'Margem inferior da mandíbula, pele da parte inferior da face e modíolo.',
    inervacao: 'Ramo cervical do nervo facial (VII).',
    nota: 'Embora esteja no pescoço, é um músculo da mímica facial (embriologicamente do 2º arco faríngeo).',
    expressao: 'Horror, tensão',
  }),
  mus('ecm', 'Esternocleidomastóideo', 'M. sternocleidomastoideus', 'pescoco', { parts: [{ id: 'ecm', mat: 'muscle' }] }, {
    acao: 'Unilateral: inclina a cabeça para o mesmo lado e gira a face para o lado oposto. Bilateral: flexiona o pescoço.',
    origem: 'Manúbrio do esterno (cabeça esternal) e terço medial da clavícula (cabeça clavicular).',
    insercao: 'Processo mastoide do temporal e linha nucal superior.',
    inervacao: 'Nervo acessório (XI) e ramos ventrais de C2–C3 (proprioceptivos).',
    nota: 'Não é um músculo da face, mas é a principal referência do pescoço: separa os trígonos anterior e posterior.',
  }),
  mus('digastrico', 'Digástrico', 'M. digastricus (ventres anterior e posterior)', 'profundo', { parts: [{ id: 'digastrico', mat: 'muscle' }] }, {
    acao: 'Abaixa a mandíbula (abre a boca) e eleva o hioide na deglutição e na fala.',
    origem: 'Ventre posterior: incisura mastóidea do temporal. Ventre anterior: fossa digástrica da mandíbula.',
    insercao: 'Tendão intermédio, preso ao hioide por uma alça fibrosa.',
    inervacao: 'Ventre posterior: nervo facial (VII). Ventre anterior: nervo milo-hióideo (V3).',
    nota: 'Seus dois ventres têm origens embrionárias e inervações diferentes.',
  }),
  mus('milo_hioideo', 'Milo-hióideo', 'M. mylohyoideus', 'profundo', { parts: [{ id: 'milo_hioideo', mat: 'muscle' }] }, {
    acao: 'Forma o assoalho da boca; eleva o hioide e a língua e abaixa a mandíbula.',
    origem: 'Linha milo-hióidea da mandíbula.',
    insercao: 'Rafe mediana e corpo do hioide.',
    inervacao: 'Nervo milo-hióideo (ramo do alveolar inferior, V3).',
  }),
  mus('genio_hioideo', 'Gênio-hióideo', 'M. geniohyoideus', 'profundo', { parts: [{ id: 'genio_hioideo', mat: 'muscle' }] }, {
    acao: 'Traciona o hioide para cima e para frente; ajuda a abaixar a mandíbula.',
    origem: 'Espinha geniana inferior da mandíbula.',
    insercao: 'Corpo do hioide.',
    inervacao: 'Ramo ventral de C1, conduzido pelo nervo hipoglosso (XII).',
  }),
  mus('estilo_hioideo', 'Estilo-hióideo', 'M. stylohyoideus', 'profundo', { parts: [{ id: 'estilo_hioideo', mat: 'muscle' }] }, {
    acao: 'Eleva e retrai o hioide.',
    origem: 'Processo estiloide do temporal.',
    insercao: 'Corpo do hioide (o tendão do digástrico passa entre suas fibras).',
    inervacao: 'Nervo facial (VII).',
  }),

  /* ───────── Órbita (malhas reais) ───────── */
  mus('levantador_palpebra', 'Levantador da pálpebra superior', 'M. levator palpebrae superioris', 'orbita', { parts: [{ id: 'levantador_palpebra', mat: 'muscle' }] }, {
    acao: 'Eleva a pálpebra superior (abre o olho).',
    origem: 'Asa menor do esfenoide, acima do canal óptico.',
    insercao: 'Aponeurose que se fixa à placa tarsal superior e à pele da pálpebra.',
    inervacao: 'Nervo oculomotor (III). Fibras lisas do músculo tarsal superior (de Müller): simpático.',
    nota: 'Lesão do III par ou do simpático causa ptose palpebral.',
  }),
  mus('reto_sup', 'Reto superior', 'M. rectus superior', 'orbita', { parts: [{ id: 'reto_sup', mat: 'muscle' }] }, {
    acao: 'Eleva, aduz e faz intorção do globo ocular.',
    origem: 'Anel tendíneo comum (de Zinn), no ápice da órbita.',
    insercao: 'Parte superior da esclera, a cerca de 7 mm do limbo.',
    inervacao: 'Nervo oculomotor (III), ramo superior.',
  }),
  mus('reto_inf', 'Reto inferior', 'M. rectus inferior', 'orbita', { parts: [{ id: 'reto_inf', mat: 'muscle' }] }, {
    acao: 'Abaixa, aduz e faz extorção do globo ocular.',
    origem: 'Anel tendíneo comum (de Zinn).',
    insercao: 'Parte inferior da esclera.',
    inervacao: 'Nervo oculomotor (III), ramo inferior.',
  }),
  mus('reto_med', 'Reto medial', 'M. rectus medialis', 'orbita', { parts: [{ id: 'reto_med', mat: 'muscle' }] }, {
    acao: 'Aduz o globo ocular (olhar para o nariz).',
    origem: 'Anel tendíneo comum (de Zinn).',
    insercao: 'Face medial da esclera.',
    inervacao: 'Nervo oculomotor (III), ramo inferior.',
    nota: 'É o mais forte dos músculos extraoculares.',
  }),
  mus('reto_lat', 'Reto lateral', 'M. rectus lateralis', 'orbita', { parts: [{ id: 'reto_lat', mat: 'muscle' }] }, {
    acao: 'Abduz o globo ocular (olhar para o lado).',
    origem: 'Anel tendíneo comum (de Zinn), por duas cabeças.',
    insercao: 'Face lateral da esclera.',
    inervacao: 'Nervo abducente (VI).',
    nota: 'Paralisia do VI causa estrabismo convergente e diplopia horizontal.',
  }),
  mus('obliquo_sup', 'Oblíquo superior', 'M. obliquus superior', 'orbita', { parts: [{ id: 'obliquo_sup', mat: 'muscle' }] }, {
    acao: 'Abaixa, abduz e faz intorção do globo ocular.',
    origem: 'Corpo do esfenoide, acima do canal óptico.',
    insercao: 'Esclera súpero-lateral posterior, após o tendão passar pela tróclea.',
    inervacao: 'Nervo troclear (IV).',
    nota: 'Resumo clássico: LR6 SO4 — reto lateral pelo VI, oblíquo superior pelo IV, os demais pelo III.',
  }),
  mus('obliquo_inf', 'Oblíquo inferior', 'M. obliquus inferior', 'orbita', { parts: [{ id: 'obliquo_inf', mat: 'muscle' }] }, {
    acao: 'Eleva, abduz e faz extorção do globo ocular.',
    origem: 'Face orbital da maxila, junto à fossa do saco lacrimal.',
    insercao: 'Esclera ínfero-lateral posterior.',
    inervacao: 'Nervo oculomotor (III), ramo inferior.',
  }),
];
