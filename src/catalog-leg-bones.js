/**
 * Esqueleto do membro inferior (malhas reais do BodyParts3D, pacote `anatomy-leg.js`). O osso do quadril e o sacro estão em
 * `catalog-body-bones.js`. Textos a partir de Moore/Dalley/Agur e Gray's; o que varia entre as fontes fica na `nota`.
 */
import { bone, range } from './catalog-body-bones.js';

const R = 'membro_inf';

export const LEG_BONES = [
  bone('o_femur', 'Fêmur', 'Femur', R, ['femur'], {
    local: 'Coxa; é o osso mais longo, mais forte e mais pesado do corpo.',
    artic: 'Osso do quadril (acetábulo, na articulação do quadril), tíbia e patela (articulação do joelho).',
    estruturas: 'Cabeça (com a fóvea do ligamento da cabeça do fêmur), colo, trocanteres maior e menor, linha intertrocantérica e crista intertrocantérica, corpo com a linha áspera e a tuberosidade glútea, côndilos medial e lateral, epicôndilos, fossa intercondilar e face patelar.',
    funcao: 'Sustenta o peso do corpo e o transmite à tíbia. Origem dos vastos (quadríceps), da cabeça curta do bíceps femoral e dos adutores (linha áspera) e dos gastrocnêmios (côndilos); inserção do glúteo máximo (tuberosidade glútea), dos glúteos médio e mínimo, do piriforme, do obturador interno e dos gêmeos (trocanter maior) e do iliopsoas (trocanter menor).',
    nota: 'O colo do fêmur é sede frequente de fraturas, sobretudo em idosos; a cabeça recebe sangue por ramos da artéria circunflexa femoral medial, e a fratura do colo pode causar necrose avascular da cabeça.',
  }),
  bone('o_patela', 'Patela', 'Patella', R, ['patela'], {
    local: 'À frente do joelho, dentro do tendão do quadríceps femoral; é o maior osso sesamoide do corpo.',
    artic: 'Face patelar do fêmur (articulação femoropatelar).',
    estruturas: 'Base (superior), ápice (inferior), face anterior rugosa e face articular posterior, com facetas medial e lateral.',
    funcao: 'Afasta o tendão do quadríceps do eixo do joelho, aumentando a vantagem mecânica da extensão, e protege a articulação por diante. O ápice dá origem ao ligamento patelar, que a liga à tuberosidade da tíbia.',
    nota: 'A luxação da patela é quase sempre lateral; o músculo vasto medial e a face lateral mais alta do côndilo do fêmur ajudam a mantê-la centrada.',
  }),
  bone('o_tibia', 'Tíbia', 'Tibia', R, ['tibia'], {
    local: 'Parte medial da perna; é o osso que sustenta o peso.',
    artic: 'Fêmur (côndilos), fíbula (articulações tibiofibulares proximal e distal) e tálus (articulação do tornozelo).',
    estruturas: 'Côndilos medial e lateral, eminência intercondilar, tuberosidade da tíbia, margem anterior, face medial, linha do sóleo, margem interóssea e maléolo medial.',
    funcao: 'Transmite o peso do fêmur ao tálus. Origem do tibial anterior, do tibial posterior, do flexor longo dos dedos e do sóleo; recebe o ligamento patelar (quadríceps), a pata de ganso (sartório, grácil e semitendíneo) e o semimembranáceo.',
    nota: 'A margem anterior e a face medial ficam logo sob a pele: são palpáveis e as fraturas da diáfise tendem a ser expostas.',
  }),
  bone('o_fibula', 'Fíbula', 'Fibula', R, ['fibula'], {
    local: 'Parte lateral da perna, ao lado da tíbia.',
    artic: 'Tíbia (articulações tibiofibulares proximal e distal) e tálus (o maléolo lateral faz parte da articulação do tornozelo).',
    estruturas: 'Cabeça com o ápice, colo, corpo, margem interóssea, maléolo lateral e fossa maleolar.',
    funcao: 'Sustenta pouco peso; serve sobretudo de origem para músculos (fibulares longo e curto, extensores longo dos dedos e longo do hálux, fibular terceiro, sóleo, tibial posterior e flexor longo do hálux) e, com a tíbia, forma o encaixe do tornozelo. O bíceps femoral e o ligamento colateral fibular se inserem na cabeça.',
    nota: 'O nervo fibular comum contorna o colo da fíbula, logo sob a pele: ali é vulnerável a fraturas e compressões (pé caído).',
  }),
  bone('o_tarso', 'Ossos do tarso', 'Ossa tarsi', R,
    ['tarso_talo', 'tarso_calcaneo', 'tarso_navicular', 'tarso_cuboide', 'tarso_cuneiforme_medial', 'tarso_cuneiforme_intermedio', 'tarso_cuneiforme_lateral'], {
      local: 'Parte posterior do pé; sete ossos: tálus, calcâneo, navicular, cuboide e três cuneiformes (medial, intermédio e lateral).',
      artic: 'Tíbia e fíbula (pelo tálus, no tornozelo), metatarsais (cuboide e cuneiformes) e entre si.',
      estruturas: 'Tálus: cabeça, colo e tróclea. Calcâneo: tuberosidade e sustentáculo do tálus. Navicular: tuberosidade. Cuboide: sulco do tendão do fibular longo. Cuneiformes: três, alinhados com os três primeiros metatarsais.',
      funcao: 'Transmitem o peso da tíbia ao solo (do tálus para trás, ao calcâneo, e para a frente, ao navicular e aos cuneiformes) e sustentam o arco longitudinal do pé. O tendão do calcâneo se insere na tuberosidade do calcâneo.',
      nota: 'O tálus não tem inserções musculares e a sua irrigação chega por trás; fraturas do colo do tálus podem causar necrose avascular do corpo.',
    }),
  bone('o_metatarsais', 'Ossos metatarsais (I–V)', 'Ossa metatarsi', R, range('metatarsal_', 1, 5), {
    local: 'Antepé, entre o tarso e as falanges; cinco ossos numerados do lado medial para o lateral.',
    artic: 'Cuneiformes e cuboide (articulações tarsometatarsais), falanges proximais (metatarsofalângicas) e entre si.',
    estruturas: 'Base, corpo e cabeça; o primeiro é o mais curto e o mais espesso; o quinto tem uma tuberosidade lateral na base.',
    funcao: 'Formam o antepé e o arco transverso e recebem o peso na fase de propulsão. Inserção do tibial anterior e do fibular longo (1º), do fibular curto (tuberosidade do 5º) e do fibular terceiro (5º); origem dos interósseos.',
    nota: 'Os metatarsais, sobretudo o segundo, são sede comum de fraturas de estresse (fratura da marcha).',
  }),
  bone('o_falanges_pe', 'Falanges do pé', 'Phalanges pedis', R, [
    ...['halux', 'segundo', 'terceiro', 'quarto', 'minimo'].map((d) => `falange_pe_proximal_${d}`),
    ...['segundo', 'terceiro', 'quarto', 'minimo'].map((d) => `falange_pe_media_${d}`),
    ...['halux', 'segundo', 'terceiro', 'quarto', 'minimo'].map((d) => `falange_pe_distal_${d}`),
  ], {
    local: 'Dedos do pé; 14 ossos: dois no hálux (proximal e distal) e três em cada um dos outros dedos (proximal, média e distal).',
    artic: 'Metatarsais (articulações metatarsofalângicas) e entre si (interfalângicas).',
    estruturas: 'Base, corpo e cabeça; a falange distal termina numa tuberosidade sob a unha.',
    funcao: 'Dão a propulsão final da marcha e ajudam o equilíbrio; o hálux suporta boa parte da propulsão. O flexor longo e o extensor longo do hálux se inserem na falange distal do hálux; o flexor longo dos dedos, nas falanges distais dos outros dedos; o flexor curto dos dedos, nas falanges médias.',
  }),
  bone('o_sesamoides_pe', 'Ossos sesamoides do pé', 'Ossa sesamoidea pedis', R, ['sesamoides_pe'], {
    local: 'Face plantar da cabeça do 1º metatarsal; dois ossos pequenos (medial e lateral) dentro do tendão do flexor curto do hálux.',
    artic: 'Cabeça do 1º metatarsal (face plantar).',
    estruturas: 'Ossos pequenos e arredondados, com a face dorsal articular e a plantar voltada para o tendão.',
    funcao: 'Protegem o tendão do flexor curto do hálux e elevam a cabeça do 1º metatarsal, distribuindo o peso na propulsão.',
    nota: 'Podem se fraturar ou inflamar com sobrecarga (sesamoidite); a divisão em duas partes de um deles é uma variação normal.',
  }),
];
