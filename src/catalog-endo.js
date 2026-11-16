/**
 * Sistema endócrino (F6.6), camada `endocrino`. Malhas reais do BodyParts3D (`dist/anatomy-endo.js`, CC BY-SA 2.1 JP): glândulas
 * suprarrenais direita e esquerda, hipófise, glândula pineal e hipotálamo (as duas metades do banco unidas numa peça).
 *
 * A tireoide e as paratireoides não existem no BodyParts3D nem no Atlas de Referência Humano: são esquemas por código (`proc`) sobre
 * pontos medidos no modelo (cartilagens tireóidea e cricóidea, traqueia, carótida comum e músculo esternotireóideo); cada ficha
 * declara `ESQUEMA` na nota. As outras glândulas do sistema já estão nos seus sistemas e entram aqui pelos vínculos: pâncreas
 * (ilhotas), ovários e testículos.
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.); Netter — Atlas de anatomia
 * humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 */

const endo = (id, name, latin, region, parts, color, d, extra = {}) => ({
  kind: extra.kind ?? 'glandula',
  id,
  name,
  latin,
  layer: 'endocrino',
  region,
  color,
  ...(parts ? { parts: parts.map((p) => ({ id: p, mat: 'viscera' })), paired: false } : { mat: 'viscera' }),
  campos: [
    ['Localização e partes', d.local],
    ['Relações', d.relacoes],
    ['Vascularização e inervação', d.vasos],
    ['Hormônios e clínica', d.clinica],
  ],
  nota: d.nota,
  ...extra,
});

/** Lobo da tireoide: a espessura (`ref`) é lateral e a largura, anteroposterior. */
const tube = (pts, width, thick, ref, nc = 12) => ({ kind: 'tube', pts, ref, width, thick, taper: 'blunt', nf: Math.max(14, pts.length * 6), nc });

const ENDOCRINAS = ['hipofise', 'hipotalamo', 'glandula_pineal', 'tireoide', 'paratireoides', 'suprarrenal_direita', 'suprarrenal_esquerda', 'pancreas', 'ovario', 'testiculo'];
const outras = (id) => ENDOCRINAS.filter((x) => x !== id);

export const ENDO_ITEMS = [
  /* ═════════════════════ Hipotálamo e hipófise ═════════════════════ */
  endo('hipotalamo', 'Hipotálamo', 'Hypothalamus', 'cabeca', ['hipotalamo'], '#c7a49a', {
    local: 'Parte ventral do diencéfalo, abaixo do sulco hipotalâmico: forma o assoalho e a parte inferior das paredes laterais do terceiro ventrículo. Na face inferior do encéfalo, vai do quiasma óptico (à frente) aos corpos mamilares (atrás); entre eles fica o túber cinéreo, com a eminência mediana, de onde desce o infundíbulo (haste) da hipófise.',
    relacoes: 'Acima, o tálamo; medialmente, o terceiro ventrículo; à frente e dos lados, o quiasma e os tratos ópticos; embaixo, a hipófise (pelo infundíbulo) e o círculo arterial do cérebro (de Willis), que o rodeia.',
    vasos: 'Pequenos ramos do círculo arterial do cérebro (das artérias comunicantes posteriores, cerebrais anteriores e posteriores). Na eminência mediana, os capilares recebem os hormônios hipotalâmicos e os levam pelas veias porta hipofisárias até a adeno-hipófise (sistema porta hipotálamo-hipofisário).',
    clinica: 'É o elo entre o sistema nervoso e o endócrino. Os núcleos supraóptico e paraventricular produzem o hormônio antidiurético (vasopressina) e a ocitocina, levados pelos axônios até a neuro-hipófise; o núcleo arqueado (infundibular) e vizinhos liberam os hormônios que estimulam ou inibem a adeno-hipófise (como TRH, CRH, GnRH, GHRH, somatostatina e dopamina). Também controla temperatura, fome, sede e o ritmo circadiano (núcleo supraquiasmático). Lesões podem causar diabetes insípido central, distúrbios da temperatura e obesidade.',
    nota: 'O atlas não tem o encéfalo: o hipotálamo (malha do BodyParts3D, unindo as duas metades do banco) aparece isolado dentro do crânio, acima da hipófise.',
  }, {
    kind: 'estrutura',
    relacionados: ['hipofise', 'glandula_pineal', 'arteria_cerebral_anterior', 'arteria_cerebral_posterior', 'arteria_carotida_interna'],
  }),

  endo('hipofise', 'Hipófise (glândula pituitária)', 'Hypophysis; Glandula pituitaria', 'cabeca', ['hipofise'], '#c97a6a', {
    local: 'Glândula pequena e oval (cerca de 1 cm), alojada na fossa hipofisial da sela turca do osso esfenoide e presa ao hipotálamo pelo infundíbulo. Tem duas partes de origem diferente: a adeno-hipófise (lobo anterior, com as partes distal, intermédia e tuberal), que vem do teto da boca do embrião (bolsa de Rathke), e a neuro-hipófise (lobo posterior e infundíbulo), que é um prolongamento do diencéfalo.',
    relacoes: 'É coberta pelo diafragma da sela (dura-máter), atravessado pelo infundíbulo. Acima e à frente fica o quiasma óptico; de cada lado, o seio cavernoso, com a artéria carótida interna e os nervos oculomotor, troclear, abducente, oftálmico e maxilar; embaixo, o seio esfenoidal.',
    vasos: 'Artérias hipofisárias superiores e inferiores (da carótida interna). A adeno-hipófise recebe a maior parte do sangue pelas veias porta hipofisárias, que trazem os hormônios do hipotálamo. As veias drenam para os seios cavernosos.',
    clinica: 'A adeno-hipófise secreta hormônio do crescimento (GH), prolactina, TSH, ACTH, FSH e LH; a neuro-hipófise armazena e libera o hormônio antidiurético e a ocitocina feitos no hipotálamo. Um adenoma que cresce para cima comprime o centro do quiasma óptico e causa hemianopsia bitemporal; o excesso de GH causa gigantismo ou acromegalia; o de prolactina, galactorreia e falta de menstruação. A necrose da hipófise depois de hemorragia no parto é a síndrome de Sheehan. Os adenomas costumam ser operados pela via transesfenoidal, através do seio esfenoidal.',
  }, {
    relacionados: ['hipotalamo', 'o_esfenoide', 'arteria_carotida_interna', ...outras('hipofise').filter((x) => x !== 'hipotalamo')],
  }),

  endo('glandula_pineal', 'Glândula pineal (corpo pineal)', 'Glandula pinealis; Corpus pineale', 'cabeca', ['glandula_pineal'], '#b88a7a', {
    local: 'Pequena estrutura cônica (cerca de 8 mm) do epitálamo, presa ao teto do terceiro ventrículo por um pedúnculo que contém as comissuras habenular e posterior. Fica na linha mediana, entre os colículos superiores do mesencéfalo e abaixo do esplênio do corpo caloso.',
    relacoes: 'Acima, o esplênio do corpo caloso e as veias cerebrais internas, que se unem logo atrás na veia cerebral magna (de Galeno); embaixo, o teto do mesencéfalo e o aqueduto do mesencéfalo.',
    vasos: 'Ramos das artérias corióideas posteriores (da cerebral posterior); drenagem para as veias cerebrais internas e a veia cerebral magna. Recebe fibras simpáticas do gânglio cervical superior, comandadas pelo núcleo supraquiasmático do hipotálamo, que por sua vez recebe a informação da luz pela retina.',
    clinica: 'Secreta melatonina, sobretudo no escuro, e participa do ritmo sono-vigília. A partir da adolescência acumula depósitos de cálcio (areia cerebral), que a tornam visível na radiografia e na tomografia como marco da linha mediana: o desvio indica massa de um lado do encéfalo. Tumores da região pineal podem comprimir o aqueduto (hidrocefalia) e o teto do mesencéfalo (paralisia do olhar para cima, síndrome de Parinaud).',
    nota: 'O atlas não tem o encéfalo: a glândula pineal (malha do BodyParts3D) aparece isolada dentro do crânio, atrás do hipotálamo.',
  }, {
    relacionados: ['hipotalamo', 'hipofise', 'arteria_cerebral_posterior'],
  }),

  /* ═════════════════════ Tireoide e paratireoides (por código) ═════════════════════ */
  endo('tireoide', 'Glândula tireoide — esquema', 'Glandula thyroidea', 'cabeca', null, '#b5584a', {
    local: 'Glândula em forma de H ou de borboleta, na parte anterior e inferior do pescoço. Tem dois lobos, direito e esquerdo, que vão da metade da lâmina da cartilagem tireóidea até o 5º ou 6º anel da traqueia, unidos pelo istmo, que cruza a frente do 2º ao 3º (ou 4º) anel traqueal. Em cerca de metade das pessoas há um lobo piramidal, que sobe do istmo em direção ao hioide (resto do ducto tireoglosso). É envolvida por uma cápsula fibrosa própria e pela lâmina pré-traqueal da fáscia cervical.',
    relacoes: 'À frente, os músculos infra-hióideos (esterno-hióideo, esternotireóideo e omo-hióideo); atrás e dos lados, a bainha carótica (artéria carótida comum, veia jugular interna e nervo vago); medialmente, laringe, traqueia, faringe e esôfago. Os nervos laríngeos recorrentes sobem no sulco entre a traqueia e o esôfago, junto à face posterior dos lobos, cruzando os ramos da artéria tireóidea inferior; o ramo externo do nervo laríngeo superior acompanha a artéria tireóidea superior até o polo superior. A fáscia prende a glândula à cartilagem cricóidea e à traqueia (ligamento suspensor), por isso ela sobe com a deglutição.',
    vasos: 'Artérias tireóideas superiores (primeiro ramo da carótida externa), que chegam ao polo superior, e inferiores (do tronco tireocervical da subclávia), que chegam à face posterior; às vezes uma artéria tireóidea ima, ímpar, do tronco braquiocefálico ou do arco da aorta. Veias tireóideas superiores e médias para a jugular interna e inferiores para as veias braquiocefálicas. Linfa para os linfonodos pré-laríngeos, pré-traqueais, paratraqueais e cervicais profundos.',
    clinica: 'As células foliculares produzem tiroxina (T4) e tri-iodotironina (T3), que dependem de iodo e são controladas pelo TSH da hipófise; as células parafoliculares (C) produzem calcitonina. O aumento da glândula é o bócio; o hipotireoidismo (por exemplo, tireoidite de Hashimoto) e o hipertireoidismo (doença de Graves) são comuns, sobretudo em mulheres. Na tireoidectomia, a lesão do nervo laríngeo recorrente causa rouquidão (e, se for dos dois lados, falta de ar), e a retirada acidental das paratireoides causa hipocalcemia. O cisto do ducto tireoglosso aparece na linha mediana e sobe quando a língua é colocada para fora.',
    nota: 'ESQUEMA: a tireoide não existe no BodyParts3D nem no Atlas de Referência Humano. Os lobos e o istmo foram desenhados por código ao lado da cartilagem tireóidea, da cartilagem cricóidea e da traqueia do modelo, atrás do músculo esternotireóideo; forma e volume aproximados, sem o lobo piramidal.',
  }, {
    proc: [
      tube([[0.172, -1.32, 0.15], [0.158, -1.43, 0.152], [0.143, -1.56, 0.15], [0.132, -1.67, 0.15], [0.12, -1.745, 0.145]], [0.12, 0.12, 0.14, 0.15, 0.2], [0.06, 0.065, 0.08, 0.09, 0.12], [1, 0, 0]),
      tube([[0, -1.575, 0.255], [0.06, -1.58, 0.248], [0.12, -1.6, 0.215]], [0.17, 0.1, 0.12], [0.05, 0.03, 0.05], [0, 0, 1], 10),
    ],
    relacionados: ['paratireoides', 'cartilagem_tireoidea', 'cartilagem_cricoidea', 'traqueia', 'esofago', 'esternotireoideo', 'arteria_tireoidea_superior', 'arteria_tireoidea_inferior', 'arteria_carotida_comum', 'arteria_carotida_externa', 'veia_jugular_interna', 'linfonodos_cervicais_profundos', 'hipofise'],
  }),

  endo('paratireoides', 'Glândulas paratireoides — esquema', 'Glandulae parathyroideae', 'cabeca', null, '#c99a4e', {
    local: 'Pequenas glândulas ovais e achatadas (cerca de 6 × 4 × 2 mm), em geral quatro — duas superiores e duas inferiores —, na face posterior dos lobos da tireoide, por fora da cápsula própria e dentro da bainha da glândula. As superiores são mais constantes e ficam perto da margem inferior da cartilagem cricóidea; as inferiores, perto do polo inferior dos lobos, mas a posição delas varia muito e podem estar no mediastino superior, junto ao timo.',
    relacoes: 'As superiores vêm da 4ª bolsa faríngea; as inferiores, da 3ª, junto com o timo, e descem com ele no embrião, o que explica que fiquem mais baixas que as superiores e possam ser achadas no tórax. Estão perto dos nervos laríngeos recorrentes e dos ramos da artéria tireóidea inferior.',
    vasos: 'Principalmente a artéria tireóidea inferior (às vezes também a superior); veias e linfáticos com os da tireoide.',
    clinica: 'Produzem o paratormônio (PTH), que aumenta o cálcio do sangue (retirando-o do osso, poupando-o no rim e ativando a vitamina D). A retirada ou lesão das paratireoides na tireoidectomia causa hipocalcemia, com formigamento e câimbras (tetania; sinais de Chvostek e de Trousseau). O adenoma de uma paratireoide causa hiperparatireoidismo, com cálculos renais e perda óssea.',
    nota: 'ESQUEMA: as paratireoides não existem no BodyParts3D nem no Atlas de Referência Humano. As quatro foram desenhadas por código na face posterior dos lobos da tireoide (também esquemáticos), nas posições mais comuns; a posição real varia, sobretudo a das inferiores.',
  }, {
    proc: [
      tube([[0.12, -1.465, 0.07], [0.118, -1.495, 0.066]], 0.055, 0.032, [1, 0, 0], 10),
      tube([[0.112, -1.69, 0.072], [0.11, -1.72, 0.068]], 0.055, 0.032, [1, 0, 0], 10),
    ],
    relacionados: ['tireoide', 'cartilagem_cricoidea', 'traqueia', 'esofago', 'arteria_tireoidea_inferior', 'arteria_tireoidea_superior'],
  }),

  /* ═════════════════════ Glândulas suprarrenais ═════════════════════ */
  endo('suprarrenal_direita', 'Glândula suprarrenal direita', 'Glandula suprarenalis dextra', 'tronco', ['suprarrenal_direita'], '#d9a441', {
    local: 'Glândula retroperitoneal em forma de pirâmide, sobre o polo superior do rim direito (cerca de 5 cm de altura, 3 cm de largura e 1 cm de espessura). Cada suprarrenal tem duas partes de origem e função diferentes: o córtex (externo, do mesoderma), com as zonas glomerulosa, fasciculada e reticulada, e a medula (interna, da crista neural), com células cromafins.',
    relacoes: 'Envolvida pela gordura perirrenal e pela fáscia renal, separada do rim por tecido conjuntivo. À frente, a área nua do fígado e, medialmente, a veia cava inferior, que a cobre em parte; atrás, o diafragma (pilar direito).',
    vasos: 'Três artérias de cada lado: suprarrenal superior (da frênica inferior), média (da aorta abdominal) e inferior (da renal). Uma veia só: a suprarrenal direita, muito curta, desemboca direto na veia cava inferior. Linfa para os linfonodos lombares. A medula recebe fibras simpáticas pré-ganglionares diretamente, pelos nervos esplâncnicos torácicos e lombares, sem passar por gânglio: funciona como um gânglio simpático modificado.',
    clinica: 'O córtex produz aldosterona (zona glomerulosa), cortisol (fasciculada) e androgênios (reticulada); a medula, adrenalina e noradrenalina. O excesso de cortisol é a síndrome de Cushing; a falta de hormônios do córtex, a doença de Addison; o excesso de aldosterona (síndrome de Conn) causa hipertensão com potássio baixo; o feocromocitoma, tumor da medula, causa crises de hipertensão. A veia curta, presa à cava, torna a adrenalectomia direita mais delicada que a esquerda.',
  }, {
    relacionados: ['rim_direito', 'veia_cava_inferior', 'veia_suprarrenal', 'arteria_suprarrenais', 'arteria_frenica_inferior', 'arteria_renal', 'diafragma', 'figado_seg_vii', 'suprarrenal_esquerda', 'hipofise', 'linfonodos_lombares'],
  }),

  endo('suprarrenal_esquerda', 'Glândula suprarrenal esquerda', 'Glandula suprarenalis sinistra', 'tronco', ['suprarrenal_esquerda'], '#d9a441', {
    local: 'Glândula retroperitoneal em forma de meia-lua, maior que a direita, sobre a margem medial do rim esquerdo, do polo superior até perto do hilo. Tem, como a direita, córtex (zonas glomerulosa, fasciculada e reticulada) e medula.',
    relacoes: 'Envolvida pela gordura perirrenal e pela fáscia renal. À frente, o estômago (atrás da bolsa omental), o pâncreas e os vasos esplênicos; em cima, o baço; atrás, o pilar esquerdo do diafragma; medialmente, a aorta abdominal e o tronco celíaco.',
    vasos: 'Artérias suprarrenais superior (da frênica inferior), média (da aorta) e inferior (da renal). A veia suprarrenal esquerda, mais longa, junta-se em geral à veia frênica inferior esquerda e desemboca na veia renal esquerda. Linfa para os linfonodos lombares. Fibras simpáticas pré-ganglionares diretas para a medula (nervos esplâncnicos).',
    clinica: 'Mesmos hormônios e doenças da suprarrenal direita. Nódulos achados por acaso na tomografia (incidentalomas) são frequentes e precisam ser avaliados quanto à produção de hormônios. A veia suprarrenal esquerda drena para a renal esquerda, como a gonadal esquerda: uma veia renal esquerda obstruída repercute nas duas.',
  }, {
    relacionados: ['rim_esquerdo', 'veia_renal', 'veia_suprarrenal', 'arteria_suprarrenais', 'arteria_frenica_inferior', 'arteria_renal', 'aorta_abdominal', 'diafragma', 'estomago', 'pancreas', 'baco', 'suprarrenal_direita', 'hipofise', 'linfonodos_lombares'],
  }),
];
