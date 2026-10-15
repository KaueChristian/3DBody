/**
 * Músculos intrínsecos do pé (F4.4, lote C) que têm malha no BodyParts3D (pacote `anatomy-leg.js`). Textos a partir de Moore, Dalley
 * & Agur (8ª ed.) e Gray's Anatomy (42ª ed.). **O banco não tem** o extensor curto dos dedos (só o do hálux, que é a parte medial dele)
 * nem os interósseos dorsais (M14 em `docs/pontos-de-melhoria.md`); a aponeurose plantar e os retináculos também ficam de fora (M13).
 * Os músculos da planta estão em quatro camadas, de superficial para profunda: 1ª (abdutor do hálux, flexor curto dos dedos e abdutor
 * do dedo mínimo), 2ª (quadrado plantar e lumbricais), 3ª (flexor curto do hálux, adutor do hálux e flexor curto do dedo mínimo) e 4ª
 * (interósseos; o tendão do fibular longo e o do tibial posterior ficam nesta camada).
 */
import { bm, P } from './catalog-body-muscles.js';

const R = 'membro_inf';

export const LEG_PE = [
  /* ═════════════ Dorso do pé ═════════════ */
  bm('extensor_curto_halux', 'Extensor curto do hálux', 'M. extensor hallucis brevis', 'med', R, P('extensor_curto_halux'), {
    acao: 'Estende a articulação metatarsofalângica do hálux (a falange proximal) e ajuda a estender os dedos.',
    origem: 'Face dorsal e lateral do calcâneo (parte anterior), no seio do tarso, e retináculo extensor inferior.',
    insercao: 'Face dorsal da base da falange proximal do hálux.',
    inervacao: 'Nervo fibular profundo (L5–S1).',
    nota: 'É a parte medial do extensor curto dos dedos, que o banco não traz (M14); os dois formam a pequena elevação carnosa do dorso do pé, na frente do maléolo lateral, que pode ser confundida com um hematoma ou um nódulo após uma entorse.',
  }),

  /* ═════════════ Planta do pé: 1ª camada ═════════════ */
  bm('abdutor_halux', 'Abdutor do hálux', 'M. abductor hallucis', 'sup', R, P('abdutor_halux'), {
    acao: 'Abduz o hálux e o flexiona na articulação metatarsofalângica; sustenta o arco longitudinal medial.',
    origem: 'Processo medial da tuberosidade do calcâneo, retináculo dos flexores e aponeurose plantar.',
    insercao: 'Face medial da base da falange proximal do hálux, com o tendão do flexor curto do hálux (cabeça medial).',
    inervacao: 'Nervo plantar medial (S2–S3).',
    nota: 'É o músculo que forma o contorno da borda medial do pé. Os nervos plantares medial e lateral entram na planta sob a origem dele; a compressão do nervo tibial ou de seus ramos no túnel do tarso, atrás do maléolo medial, é a síndrome do túnel do tarso (dor e dormência na planta).',
  }),
  bm('flexor_curto_dedos', 'Flexor curto dos dedos', 'M. flexor digitorum brevis', 'sup', R, P('flexor_curto_dedos'), {
    acao: 'Flexiona os dedos 2 a 5 nas articulações interfalângicas proximais; sustenta os arcos longitudinais.',
    origem: 'Processo medial da tuberosidade do calcâneo e aponeurose plantar.',
    insercao: 'Falanges médias dos dedos 2 a 5, por quatro tendões que se dividem para dar passagem aos do flexor longo.',
    inervacao: 'Nervo plantar medial (S2–S3).',
    nota: 'Fica sob a aponeurose plantar, na parte central da planta. A fasciite plantar, inflamação da aponeurose na origem, é a causa mais comum de dor no calcanhar.',
  }),
  bm('abdutor_minimo_pe', 'Abdutor do dedo mínimo do pé', 'M. abductor digiti minimi pedis', 'sup', R, P('abdutor_minimo_pe'), {
    acao: 'Abduz o dedo mínimo e o flexiona na articulação metatarsofalângica; sustenta o arco longitudinal lateral.',
    origem: 'Processos medial e lateral da tuberosidade do calcâneo e aponeurose plantar.',
    insercao: 'Face lateral da base da falange proximal do dedo mínimo, com um prolongamento para a tuberosidade do 5º metatarsal.',
    inervacao: 'Nervo plantar lateral (S2–S3).',
    nota: 'Forma o contorno da borda lateral do pé.',
  }),

  /* ═════════════ Planta do pé: 2ª camada ═════════════ */
  bm('quadrado_plantar', 'Quadrado plantar', 'M. quadratus plantae (flexor accessorius)', 'med', R, P('quadrado_plantar'), {
    acao: 'Ajuda o flexor longo dos dedos a flexionar os dedos 2 a 5; corrige a tração oblíqua dos tendões, que puxariam os dedos para o lado medial.',
    origem: 'Duas cabeças: a medial, na face medial do calcâneo; a lateral, na margem lateral da face plantar do calcâneo, abaixo do ligamento plantar longo.',
    insercao: 'Margem lateral do tendão do flexor longo dos dedos, antes de ele se dividir.',
    inervacao: 'Nervo plantar lateral (S2–S3).',
    nota: 'Também chamado de flexor acessório do pé.',
  }),
  bm('lumbricais_pe', 'Lumbricais do pé (4)', 'Mm. lumbricales pedis', 'med', R, P('lumbricais_pe'), {
    acao: 'Flexionam as articulações metatarsofalângicas e estendem as interfalângicas dos dedos 2 a 5; levam os dedos para o lado medial (em direção ao hálux).',
    origem: 'Tendões do flexor longo dos dedos: o 1º lumbrical, na margem medial do tendão do 2º dedo; os outros, nos lados adjacentes dos tendões vizinhos (bipenados).',
    insercao: 'Expansões extensoras (lado medial) dos dedos 2 a 5.',
    inervacao: '1º lumbrical: nervo plantar medial (S2–S3). 2º a 4º: nervo plantar lateral, ramo profundo (S2–S3).',
    nota: 'A malha do banco traz os quatro lumbricais numa peça só. Em uma parte das pessoas o 2º lumbrical também é inervado pelo plantar medial.',
  }),

  /* ═════════════ Planta do pé: 3ª camada ═════════════ */
  bm('flexor_curto_halux_medial', 'Flexor curto do hálux — cabeça medial', 'M. flexor hallucis brevis, caput mediale', 'prof', R, P('flexor_curto_halux_medial'), {
    acao: 'Flexiona a articulação metatarsofalângica do hálux; sustenta o arco longitudinal medial.',
    origem: 'Parte do tendão do tibial posterior e face plantar dos cuneiformes.',
    insercao: 'Face medial da base da falange proximal do hálux, com o abdutor do hálux; o sesamoide medial se forma no tendão.',
    inervacao: 'Nervo plantar medial (S1–S2).',
    nota: 'Os dois ossos sesamoides, sob a cabeça do 1º metatarsal, ficam nos tendões das duas cabeças; a sesamoidite é comum em corredores e bailarinos. O tendão do flexor longo do hálux passa entre eles.',
  }),
  bm('flexor_curto_halux_lateral', 'Flexor curto do hálux — cabeça lateral', 'M. flexor hallucis brevis, caput laterale', 'prof', R, P('flexor_curto_halux_lateral'), {
    acao: 'Flexiona a articulação metatarsofalângica do hálux.',
    origem: 'Face plantar do cuboide e do cuneiforme lateral.',
    insercao: 'Face lateral da base da falange proximal do hálux, com o adutor do hálux; o sesamoide lateral se forma no tendão.',
    inervacao: 'Nervo plantar medial (S1–S2).',
    nota: 'Segundo o Gray\'s, a cabeça lateral recebe o nervo plantar lateral; Moore dá o plantar medial para as duas cabeças.',
  }),
  bm('adutor_halux_obliquo', 'Adutor do hálux — cabeça oblíqua', 'M. adductor hallucis, caput obliquum', 'prof', R, P('adutor_halux_obliquo'), {
    acao: 'Aduz o hálux em direção ao 2º dedo e ajuda a flexionar a articulação metatarsofalângica; sustenta o arco transverso.',
    origem: 'Bases dos metatarsais 2 a 4, cuboide, cuneiforme lateral e bainha do tendão do fibular longo.',
    insercao: 'Lado lateral da base da falange proximal do hálux, junto com a cabeça lateral do flexor curto (sesamoide lateral).',
    inervacao: 'Nervo plantar lateral, ramo profundo (S2–S3).',
    nota: 'O eixo do pé passa pelo 2º dedo: o adutor aduz o hálux em direção a ele (na mão, o eixo é o 3º dedo).',
  }),
  bm('adutor_halux_transverso', 'Adutor do hálux — cabeça transversa', 'M. adductor hallucis, caput transversum', 'prof', R, P('adutor_halux_transverso'), {
    acao: 'Aduz o hálux e traciona os metatarsais uns contra os outros, sustentando o arco transverso do antepé.',
    origem: 'Ligamentos plantares das articulações metatarsofalângicas dos dedos 3 a 5 e ligamento metatarsal transverso profundo.',
    insercao: 'Lado lateral da base da falange proximal do hálux, com a cabeça oblíqua.',
    inervacao: 'Nervo plantar lateral, ramo profundo (S2–S3).',
    nota: 'Na deformidade em hálux valgo (joanete), o hálux se desvia para o lado lateral e o adutor e os tendões acompanham o desvio.',
  }),
  bm('flexor_curto_minimo_pe', 'Flexor curto do dedo mínimo do pé', 'M. flexor digiti minimi brevis pedis', 'prof', R, P('flexor_curto_minimo_pe'), {
    acao: 'Flexiona a articulação metatarsofalângica do dedo mínimo.',
    origem: 'Base do 5º metatarsal e bainha do tendão do fibular longo.',
    insercao: 'Face lateral da base da falange proximal do dedo mínimo.',
    inervacao: 'Nervo plantar lateral, ramo superficial (S2–S3).',
  }),
  bm('oponente_minimo_pe', 'Oponente do dedo mínimo do pé', 'M. opponens digiti minimi pedis', 'prof', R, P('oponente_minimo_pe'), {
    acao: 'Puxa o 5º metatarsal para a planta e para o lado medial; função pequena.',
    origem: 'Ligamento plantar longo e bainha do fibular longo.',
    insercao: 'Margem lateral do 5º metatarsal.',
    inervacao: 'Nervo plantar lateral, ramo superficial (S2–S3).',
    nota: 'É inconstante e muitas vezes descrito como parte do flexor curto do dedo mínimo; o banco o traz como peça separada.',
  }),

  /* ═════════════ Planta do pé: 4ª camada ═════════════ */
  bm('interosseos_plantares', 'Interósseos plantares do pé (3)', 'Mm. interossei plantares', 'prof', R, P('interosseos_plantares'), {
    acao: 'Aduzem os dedos 3 a 5 em direção ao 2º dedo e flexionam as articulações metatarsofalângicas (mnemônico PAD: plantares aduzem).',
    origem: 'Face medial dos metatarsais 3 a 5 (cada um, o seu).',
    insercao: 'Lado medial da base da falange proximal dos dedos 3 a 5 e expansão extensora.',
    inervacao: 'Nervo plantar lateral, ramo profundo (S2–S3).',
    nota: 'Os interósseos dorsais do pé (quatro, que abduzem em relação ao 2º dedo) não têm malha no banco (M14) e ficam de fora do modelo.',
  }),
];
