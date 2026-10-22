/**
 * Circulação fetal e anexos (F5 / M21): placenta e cordão umbilical (malhas do Atlas de Referência Humano, HuBMAP/NIH, CC BY 4.0, no
 * pacote `anatomy-circ.js`; ver tools/convert_placenta.py), veia e artérias umbilicais e ducto venoso (esquemas por código) e, na
 * camada das artérias, o ligamento arterial (resto do ducto arterioso, esquema).
 *
 * O corpo do atlas é adulto e masculino. Por isso os elementos da vida fetal ficam numa camada própria, **desligada por padrão** (“Circulação
 * fetal (esquema)”): a placenta aparece fora do corpo, à frente, ligada ao umbigo pelo cordão, só para mostrar as conexões; a veia e as
 * artérias umbilicais e o ducto venoso são traçados dentro do abdome para o fígado, a veia cava inferior e as artérias ilíacas internas, com
 * trajetos aproximados. Desde a F6.2 o fígado está no modelo: a veia umbilical entra pela incisura do ligamento redondo e chega à parte
 * umbilical do ramo esquerdo da veia porta (pontos medidos nas malhas do fígado e da veia porta), e o ducto venoso segue pela fissura do
 * ligamento venoso, à esquerda do lobo caudado, até a veia cava inferior. Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e
 * Gray's Anatomy (42ª ed.).
 */

const T = 'tronco';
const FONTES = ['Moore, Dalley & Agur — Anatomia orientada para a clínica, 8ª ed.', "Gray's Anatomy, 42ª ed."];
const HRA = 'Human Reference Atlas 3D Reference Object Library, HuBMAP/NIH (CC BY 4.0): placenta de termo, modelo derivado do Visible Human (NLM)';

/** Tubo por pontos (ver `buildTube`, em proc.js). */
const tubo = (pts, width, thick = width, o = {}) => ({ kind: 'tube', pts, width, thick, nf: o.nf ?? 28, nc: o.nc ?? 10, taper: o.taper ?? 'blunt', ref: o.ref ?? [1, 0, 0] });
const skin = (p, d) => ({ skin: true, p, d });

/** Ponto do cordão no mundo do atlas: sai do umbigo e vai até o trecho de cordão do HRA (tools/convert_placenta.py, `FREE_END`). */
const UMBIGO = skin([0, -5.5, 1.5], 0);
const CORDAO = [UMBIGO, [0.04, -5.65, 1.62], [0.12, -5.9, 2.0], [0.2, -6.05, 2.35]];

const fetal = (kind, id, name, latin, extra) => ({
  kind,
  id,
  name,
  latin,
  layer: 'fetal',
  region: T,
  label: false,
  fontes: FONTES,
  ...extra,
});

const COR_FETAL = '#b3485a';

export const CIRC_FETAL = [
  fetal('estrutura', 'placenta', 'Placenta — esquema de posição', 'Placenta', {
    parts: [{ id: 'placenta_corpo', mat: 'cardiac' }],
    mat: 'cardiac',
    color: COR_FETAL,
    paired: false,
    malha: 'hra',
    campos: [
      ['Estrutura', 'Disco de cerca de 15 a 25 cm de diâmetro e 2 a 3 cm de espessura a termo, com peso em torno de 500 g. Tem uma face fetal, lisa e recoberta pelo âmnio (a lâmina coriônica, de onde sai o cordão), e uma face materna, rugosa e dividida em cotilédones (a lâmina basal, ligada à decídua).'],
      ['Troca e circulação', 'O sangue materno chega pelo espaço interviloso e banha as vilosidades coriônicas, por onde passam os vasos do feto; os dois sangues não se misturam. Gases, nutrientes e excretas atravessam a barreira placentária (o sincício, o tecido conjuntivo e o endotélio fetal).'],
      ['Funções', 'Troca de gases, nutrientes e excretas; produção de hormônios (gonadotrofina coriônica, progesterona, estrogênios, lactogênio placentário); transferência de anticorpos IgG; barreira parcial a microrganismos.'],
      ['Vasos', 'Duas artérias umbilicais levam o sangue pouco oxigenado do feto à placenta; uma veia umbilical traz o sangue oxigenado da placenta ao feto.'],
    ],
    nota: 'ESQUEMA DE POSIÇÃO: o corpo do atlas é adulto e masculino. A placenta (malha do Atlas de Referência Humano, HuBMAP/NIH, CC BY 4.0, derivada do Visible Human feminino) é mostrada fora do corpo, à frente, ligada ao umbigo pelo cordão, só para mostrar as conexões; não é a posição real, que é dentro do útero. A placenta prévia e o descolamento prematuro de placenta são causas importantes de sangramento no fim da gestação.',
    fontes: [...FONTES, HRA],
    relacionados: ['cordao_umbilical', 'veia_umbilical', 'arterias_umbilicais'],
  }),
  fetal('estrutura', 'cordao_umbilical', 'Cordão umbilical — esquema', 'Funiculus umbilicalis', {
    parts: [{ id: 'cordao_umbilical', mat: 'cardiac' }],
    proc: [tubo(CORDAO, 0.16, 0.15, { nf: 24, nc: 12 })],
    mat: 'cardiac',
    color: '#e3d6bb',
    paired: false,
    malha: 'hra',
    campos: [
      ['Estrutura', 'Cordão de 1 a 2 cm de diâmetro e, a termo, de 30 a 90 cm de comprimento, que liga o umbigo do feto à placenta. Dentro dele vão duas artérias umbilicais e uma veia umbilical, envolvidas pela geleia de Wharton (tecido conjuntivo mucoso) e por uma bainha de âmnio.'],
      ['Circulação', 'A veia umbilical leva sangue oxigenado (de 80% de saturação, aproximadamente) da placenta ao feto; as duas artérias levam o sangue pouco oxigenado do feto à placenta.'],
      ['Depois do nascimento', 'O cordão é pinçado e cortado; o coto cai em alguns dias e deixa o umbigo. Dentro do corpo, as estruturas umbilicais se fecham: a veia vira o ligamento redondo do fígado e as artérias, os ligamentos umbilicais mediais.'],
      ['Variações', 'A artéria umbilical única (uma só artéria no cordão) se associa a malformações em parte dos casos e justifica a investigação por ultrassom; a inserção do cordão pode ser central, excêntrica ou marginal.'],
    ],
    nota: 'ESQUEMA: o trecho de cordão perto da placenta é a malha do Atlas de Referência Humano (HuBMAP/NIH, CC BY 4.0); o trecho até o umbigo é um tubo desenhado por código, e as artérias e a veia não estão desenhadas dentro do cordão. O comprimento no modelo é bem menor que o real.',
    fontes: [...FONTES, HRA],
    relacionados: ['placenta', 'veia_umbilical', 'arterias_umbilicais'],
  }),
  fetal('veia', 'veia_umbilical', 'Veia umbilical — esquema', 'Vena umbilicalis', {
    // da parede anterior à incisura do ligamento redondo (borda inferior do fígado, entre os segmentos III e IV) e, pela fissura,
    // à parte umbilical do ramo esquerdo da veia porta (recesso de Rex)
    proc: [tubo([...CORDAO.slice(0, 1), skin([0, -5.45, 1.5], -0.1), skin([0, -5.15, 1.5], -0.2), skin([0, -4.8, 1.5], -0.32), [0.0, -4.5, 1.06], [0.03, -4.32, 0.99], [0.08, -4.19, 0.93]], 0.055, 0.05, { nf: 36, nc: 10 })],
    mat: 'vein',
    color: '#d2625a',
    paired: false,
    campos: [
      ['Formação', 'Reunião das veias das vilosidades coriônicas na placenta. No feto há uma só veia umbilical (a direita desaparece cedo), no cordão.'],
      ['Trajeto', 'Passa do cordão ao umbigo, sobe pela face interna da parede anterior do abdome, na borda livre do ligamento falciforme, até o fígado, onde se une à parte esquerda da veia porta.'],
      ['Tributárias', 'Dá origem ao ducto venoso, que leva parte do sangue direto à veia cava inferior; o restante vai ao fígado pelo seio da veia porta.'],
      ['Território drenado', 'Traz ao feto o sangue oxigenado da placenta (cerca de 80% de saturação), que a veia cava inferior leva ao átrio direito.'],
    ],
    nota: 'ESQUEMA: o trajeto é aproximado. O fígado do modelo é de adulto: a veia foi traçada da parede anterior do abdome até a incisura do ligamento redondo e, pela fissura, até o ramo esquerdo da veia porta, onde estaria no feto. Depois do nascimento, a veia umbilical se fecha e vira o ligamento redondo do fígado, no ligamento falciforme; a veia paraumbilical recanalizada é uma via colateral na hipertensão portal (cabeça de medusa).',
    relacionados: ['ducto_venoso', 'cordao_umbilical', 'placenta'],
  }),
  fetal('arteria', 'arterias_umbilicais', 'Artérias umbilicais — esquema', 'Arteriae umbilicales', {
    proc: [tubo([UMBIGO, [0.06, -5.7, 1.08], [0.14, -6.0, 0.98], [0.22, -6.25, 0.75], [0.29, -6.35, 0.45], { on: 'arteria_iliaca_interna', p: [0.31, -6.3, 0.15], d: 0 }], 0.045, 0.04, { nf: 36, nc: 10 })],
    mat: 'artery',
    color: '#4f78bd',
    paired: true,
    campos: [
      ['Origem', 'Ramos das artérias ilíacas internas, uma de cada lado.'],
      ['Trajeto', 'Sobem pelos lados da bexiga, na face interna da parede anterior do abdome, até o umbigo, e passam ao cordão umbilical.'],
      ['Ramos', 'Na vida fetal as duas artérias se continuam com as da placenta; depois do nascimento, a parte proximal continua permeável como artéria vesical superior.'],
      ['Território irrigado', 'Levam o sangue pouco oxigenado do feto à placenta.'],
    ],
    nota: 'ESQUEMA: o desenho vai do umbigo até as ilíacas internas, com trajeto aproximado; o BodyParts3D não tem estas artérias. Depois do nascimento a parte distal se oblitera e vira o ligamento umbilical medial, que levanta a prega umbilical medial do peritônio na parede anterior do abdome. O sangue delas é pouco oxigenado, por isso aparecem em azul.',
    relacionados: ['arteria_iliaca_interna', 'cordao_umbilical', 'placenta'],
  }),
  fetal('veia', 'ducto_venoso', 'Ducto venoso — esquema', 'Ductus venosus', {
    // do ramo esquerdo da veia porta, em frente à chegada da veia umbilical, pela fissura do ligamento venoso (à esquerda do lobo
    // caudado) até a veia cava inferior, junto da veia hepática esquerda
    proc: [tubo([[0.08, -4.19, 0.93], [0.04, -4.06, 0.76], [0.06, -3.95, 0.6], [0.11, -3.87, 0.48], [0.04, -3.79, 0.39], [-0.07, -3.76, 0.34]], 0.04, 0.035, { nf: 24, nc: 8 })],
    mat: 'vein',
    color: '#b45a7a',
    paired: false,
    campos: [
      ['Origem', 'Termina a veia umbilical, no seio da veia porta, na face visceral do fígado.'],
      ['Trajeto', 'Curto desvio que atravessa o fígado e leva o sangue direto à veia cava inferior, junto à desembocadura das veias hepáticas.'],
      ['Função', 'Desvia cerca de metade do sangue da veia umbilical do fígado, que não precisa filtrá-lo; o sangue oxigenado chega ao átrio direito misturado com o da veia cava inferior.'],
      ['Depois do nascimento', 'Fecha-se nos primeiros dias de vida e vira o ligamento venoso, na fissura do ligamento venoso do fígado.'],
    ],
    nota: 'ESQUEMA: o BodyParts3D não tem o ducto venoso. O trajeto foi traçado no fígado adulto do modelo, pela fissura do ligamento venoso, do ramo esquerdo da veia porta à veia cava inferior; no adulto, ali fica o ligamento venoso. Para vê-lo, oculte o fígado. O ducto venoso persistente é uma malformação rara. A proporção que passa pelo ducto varia nas fontes e com a idade gestacional.',
    relacionados: ['veia_umbilical', 'veia_cava_inferior'],
  }),
  {
    kind: 'estrutura',
    id: 'ligamento_arterial',
    name: 'Ligamento arterial (ducto arterioso) — esquema',
    latin: 'Ligamentum arteriosum (ductus arteriosus)',
    layer: 'arteria',
    region: T,
    paired: false,
    mat: 'artery',
    color: '#8a6aa8',
    proc: [tubo([{ on: 'arteria_pulmonar_esquerda', p: [0.3, -2.58, 0.16], d: 0 }, [0.28, -2.52, 0.12], { on: 'arco_aorta', p: [0.27, -2.45, 0.08], d: 0 }], 0.045, 0.04, { nf: 10, nc: 8 })],
    campos: [
      ['Localização', 'Liga a face inferior do arco da aorta, logo depois da origem da artéria subclávia esquerda, à origem da artéria pulmonar esquerda (ou à bifurcação do tronco pulmonar).'],
      ['Na vida fetal', 'É o ducto arterioso, um vaso pérvio e muscular que desvia para a aorta a maior parte do sangue do ventrículo direito: os pulmões não funcionam, e a resistência dos vasos pulmonares é alta.'],
      ['No adulto', 'O ducto se contrai nas primeiras horas ou dias depois do nascimento e se oblitera, tornando-se um cordão fibroso, o ligamento arterial.'],
      ['Relações', 'O nervo laríngeo recorrente esquerdo contorna o arco da aorta e o ligamento arterial, por baixo; o nervo vago esquerdo e o frênico esquerdo passam à frente do arco, e o plexo cardíaco fica sobre ele.'],
    ],
    nota: 'ESQUEMA: o BodyParts3D não tem o ducto arterioso nem o ligamento arterial; o desenho é um tubo curto entre as duas artérias, com posição aproximada. Persistência do canal arterial: o ducto não se fecha, e o sangue passa da aorta ao tronco pulmonar (sopro contínuo); mantê-lo aberto com prostaglandina E1 é um recurso em cardiopatias congênitas que dependem dele. A lesão do nervo laríngeo recorrente esquerdo (rouquidão) pode ocorrer em aneurismas do arco ou em cirurgias do ducto.',
    fontes: FONTES,
    relacionados: ['arco_aorta', 'arteria_pulmonar_esquerda', 'tronco_pulmonar'],
  },
];
