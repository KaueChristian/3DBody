/**
 * Músculos da perna (F4.3, lote B) e membrana interóssea da perna, com malha real do BodyParts3D (pacote `anatomy-leg.js`). Textos
 * a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.). As ações de cada articulação entram com as articulações do
 * membro inferior (F4.6). Os segmentos medulares seguem Moore; onde o Gray's difere, a diferença está na nota.
 */
import { bm, P } from './catalog-body-muscles.js';
import { lig } from './catalog-other.js';

const R = 'membro_inf';

export const LEG_PERNA = [
  /* ═════════════ Compartimento anterior da perna ═════════════ */
  bm('tibial_anterior', 'Tibial anterior', 'M. tibialis anterior', 'sup', R, P('tibial_anterior'), {
    acao: 'Dorsiflete o pé no tornozelo e o inverte (eleva a margem medial do pé); sustenta o arco longitudinal medial. Controla a descida do antepé ao chão depois do contato do calcanhar.',
    origem: 'Côndilo lateral e metade superior da face lateral da tíbia e membrana interóssea.',
    insercao: 'Face medial e plantar do cuneiforme medial e base do 1º metatarsal.',
    inervacao: 'Nervo fibular profundo (L4–L5).',
    nota: 'É o músculo que se palpa ao lado da crista da tíbia. Sua fraqueza, na lesão do nervo fibular comum, causa o pé caído: o pé bate no chão a cada passo e o paciente levanta o joelho para não arrastar os dedos (marcha escarvante). A síndrome compartimental do compartimento anterior comprime o músculo, o nervo e a artéria tibial anterior.',
  }),
  bm('extensor_longo_dedos', 'Extensor longo dos dedos', 'M. extensor digitorum longus', 'med', R, P('extensor_longo_dedos'), {
    acao: 'Estende os dedos 2 a 5 e dorsiflete o pé; ajuda a everter o pé.',
    origem: 'Côndilo lateral da tíbia, três quartos superiores da face medial da fíbula e membrana interóssea.',
    insercao: 'Falanges média e distal dos dedos 2 a 5, por quatro tendões que se continuam nas expansões extensoras.',
    inervacao: 'Nervo fibular profundo (L5–S1).',
    nota: 'Os quatro tendões passam sob os retináculos extensores superior e inferior, no dorso do pé. O fibular terceiro é a parte distal e lateral do músculo, que se separa e se insere no 5º metatarsal.',
  }),
  bm('extensor_longo_halux', 'Extensor longo do hálux', 'M. extensor hallucis longus', 'med', R, P('extensor_longo_halux'), {
    acao: 'Estende o hálux e dorsiflete o pé; ajuda a inverter o pé.',
    origem: 'Parte média da face medial da fíbula e membrana interóssea.',
    insercao: 'Face dorsal da base da falange distal do hálux.',
    inervacao: 'Nervo fibular profundo (L5–S1).',
    nota: 'Fica entre o tibial anterior e o extensor longo dos dedos. O tendão serve de referência para a artéria dorsal do pé, que fica lateral a ele, onde se palpa o pulso.',
  }),
  bm('fibular_terceiro', 'Fibular terceiro', 'M. fibularis (peroneus) tertius', 'med', R, P('fibular_terceiro'), {
    acao: 'Dorsiflete o pé e o everte.',
    origem: 'Terço distal da face medial da fíbula e membrana interóssea (continuação do extensor longo dos dedos).',
    insercao: 'Face dorsal da base do 5º metatarsal.',
    inervacao: 'Nervo fibular profundo (L5–S1).',
    nota: 'Nem sempre está presente. É o único fibular que dorsiflete o pé (os outros dois o flexionam no plano plantar).',
  }),

  /* ═════════════ Compartimento lateral da perna ═════════════ */
  bm('fibular_longo', 'Fibular longo', 'M. fibularis (peroneus) longus', 'med', R, P('fibular_longo'), {
    acao: 'Everte o pé e flexiona o pé plantarmente (fraco); sustenta os arcos longitudinal lateral e transverso do pé, como um estribo, junto com o tibial anterior.',
    origem: 'Cabeça e dois terços superiores da face lateral da fíbula.',
    insercao: 'Base do 1º metatarsal e cuneiforme medial, na face plantar, depois de cruzar a planta do pé.',
    inervacao: 'Nervo fibular superficial (L5–S2).',
    nota: 'O tendão passa por trás do maléolo lateral, num sulco que compartilha com o do fibular curto (retináculo dos fibulares), e depois no sulco do cuboide, sob o pé. O nervo fibular comum se divide ao redor do colo da fíbula, sob a origem do músculo: a fratura do colo da fíbula pode lesá-lo. O Gray\'s dá L5–S1 para a inervação.',
  }),
  bm('fibular_curto', 'Fibular curto', 'M. fibularis (peroneus) brevis', 'prof', R, P('fibular_curto'), {
    acao: 'Everte o pé e o flexiona plantarmente (fraco); com o fibular longo, equilibra a inversão que o tibial posterior faz.',
    origem: 'Dois terços inferiores da face lateral da fíbula.',
    insercao: 'Tuberosidade na base do 5º metatarsal.',
    inervacao: 'Nervo fibular superficial (L5–S2).',
    nota: 'Fica sob o fibular longo e seu tendão contorna a fíbula em frente ao do longo. A fratura por avulsão da base do 5º metatarsal (a fratura “de bailarina”) pode ocorrer no local da inserção, em uma entorse em inversão. O Gray\'s dá L5–S1 para a inervação.',
  }),

  /* ═════════════ Compartimento posterior da perna: camada superficial ═════════════ */
  bm('gastrocnemio_medial', 'Gastrocnêmio — cabeça medial', 'M. gastrocnemius, caput mediale', 'sup', R, P('gastrocnemio_medial'), {
    acao: 'Flexiona plantarmente o pé (principalmente com o joelho estendido) e flexiona a perna; na marcha, impulsiona o corpo à frente.',
    origem: 'Face poplítea do fêmur, acima do côndilo medial, e cápsula do joelho.',
    insercao: 'Face posterior do calcâneo, pelo tendão do calcâneo (de Aquiles), junto com o sóleo.',
    inervacao: 'Nervo tibial (S1–S2).',
    nota: 'É a cabeça mais longa e mais inferior das duas. Com o sóleo, forma o tríceps sural. O cisto de Baker (poplíteo) aparece entre a cabeça medial e o tendão do semimembranáceo. Uma lesão aguda da junção miotendínea medial, em esportes de corrida, é a “perna de tenista”.',
  }),
  bm('gastrocnemio_lateral', 'Gastrocnêmio — cabeça lateral', 'M. gastrocnemius, caput laterale', 'sup', R, P('gastrocnemio_lateral'), {
    acao: 'Flexiona plantarmente o pé (principalmente com o joelho estendido) e flexiona a perna.',
    origem: 'Face lateral do côndilo lateral do fêmur e cápsula do joelho.',
    insercao: 'Face posterior do calcâneo, pelo tendão do calcâneo, junto com a cabeça medial e o sóleo.',
    inervacao: 'Nervo tibial (S1–S2).',
    nota: 'As duas cabeças formam os limites inferiores da fossa poplítea. O tendão do calcâneo, o mais forte do corpo, pode romper-se em esforço súbito: o paciente não consegue ficar na ponta do pé, e a compressão da panturrilha não produz flexão plantar (teste de Thompson). O reflexo aquileu é S1–S2.',
  }),
  bm('soleo', 'Sóleo', 'M. soleus', 'med', R, P('soleo'), {
    acao: 'Flexiona plantarmente o pé em qualquer posição do joelho; mantém o corpo em pé, impedindo que ele caia para a frente sobre os pés (músculo postural).',
    origem: 'Face posterior da cabeça e do quarto superior do corpo da fíbula, linha do sóleo e terço médio da margem medial da tíbia, e arco tendíneo entre os dois ossos.',
    insercao: 'Face posterior do calcâneo, pelo tendão do calcâneo, com o gastrocnêmio.',
    inervacao: 'Nervo tibial (S1–S2).',
    nota: 'Chamado de “segundo coração” ou bomba muscular da panturrilha: a contração dele comprime as veias profundas (veias do sóleo) e empurra o sangue para o coração. As veias do sóleo são locais comuns de trombose venosa profunda. O arco tendíneo do sóleo é atravessado pelos vasos e pelo nervo tibial.',
  }),
  bm('plantar', 'Plantar', 'M. plantaris', 'med', R, P('plantar'), {
    acao: 'Fraca ajuda do gastrocnêmio na flexão plantar do pé e na flexão do joelho.',
    origem: 'Parte inferior da linha supracondilar lateral do fêmur e ligamento poplíteo oblíquo.',
    insercao: 'Face posterior do calcâneo, medial ao tendão do calcâneo (ou unido a ele).',
    inervacao: 'Nervo tibial (S1–S2).',
    nota: 'Ventre curto e tendão muito longo e fino, entre o gastrocnêmio e o sóleo. Falta em uma parte das pessoas. O tendão é usado como enxerto em reconstruções de tendões e ligamentos. A ruptura dele, antes tida como a causa da “perna de tenista”, é rara.',
  }),
  bm('popliteo', 'Poplíteo', 'M. popliteus', 'prof', R, P('popliteo'), {
    acao: 'Destrava o joelho estendido (roda lateralmente o fêmur sobre a tíbia fixa, ou medialmente a tíbia sobre o fêmur) e flexiona a perna; tensiona o menisco lateral.',
    origem: 'Face lateral do côndilo lateral do fêmur (sulco do poplíteo) e corno posterior do menisco lateral.',
    insercao: 'Face posterior da tíbia, acima da linha do sóleo.',
    inervacao: 'Nervo tibial (L4–S1).',
    nota: 'Forma o assoalho da fossa poplítea, sob os vasos e o nervo tibial. O tendão passa dentro da cápsula articular do joelho, abaixo do ligamento colateral fibular. A articulação do joelho “se destrava” pelo poplíteo no começo da flexão.',
  }),

  /* ═════════════ Compartimento posterior da perna: camada profunda ═════════════ */
  bm('tibial_posterior', 'Tibial posterior', 'M. tibialis posterior', 'prof', R, P('tibial_posterior'), {
    acao: 'Flexiona plantarmente o pé e o inverte; sustenta o arco longitudinal medial e estabiliza o tornozelo na marcha.',
    origem: 'Membrana interóssea e faces posteriores da tíbia e da fíbula.',
    insercao: 'Tuberosidade do navicular (parte principal), com expansões para os três cuneiformes, o cuboide e as bases dos metatarsais 2 a 4.',
    inervacao: 'Nervo tibial (L4–L5).',
    nota: 'É o músculo mais central do compartimento profundo. O tendão passa atrás do maléolo medial, o mais anterior dos tendões (de anterior para posterior: tibial posterior, flexor longo dos dedos, artéria e nervo tibiais, flexor longo do hálux). A disfunção do tendão é a causa mais comum do pé plano adquirido do adulto.',
  }),
  bm('flexor_longo_dedos', 'Flexor longo dos dedos', 'M. flexor digitorum longus', 'prof', R, P('flexor_longo_dedos'), {
    acao: 'Flexiona os dedos 2 a 5 e flexiona plantarmente o pé; sustenta os arcos longitudinais.',
    origem: 'Parte medial da face posterior da tíbia, abaixo da linha do sóleo.',
    insercao: 'Bases das falanges distais dos dedos 2 a 5, por quatro tendões que atravessam as fendas dos tendões do flexor curto dos dedos.',
    inervacao: 'Nervo tibial (S2–S3).',
    nota: 'O tendão passa atrás do maléolo medial e cruza o tendão do flexor longo do hálux na planta do pé (o chiasma plantar), onde dá origem aos lumbricais e recebe o quadrado plantar. O Gray\'s dá L5–S2 para a inervação.',
  }),
  bm('flexor_longo_halux', 'Flexor longo do hálux', 'M. flexor hallucis longus', 'prof', R, P('flexor_longo_halux'), {
    acao: 'Flexiona o hálux, sobretudo na fase de propulsão da marcha, e flexiona plantarmente o pé (fraco); sustenta o arco longitudinal medial.',
    origem: 'Dois terços inferiores da face posterior da fíbula e membrana interóssea adjacente.',
    insercao: 'Face plantar da base da falange distal do hálux.',
    inervacao: 'Nervo tibial (S2–S3).',
    nota: 'O tendão passa por um sulco da face posterior do tálus e sob o sustentáculo do tálus, e é o mais posterior dos tendões que contornam o maléolo medial. Ali pode ser comprimido ou inflamado (tenossinovite do bailarino, no balé na ponta dos pés). O Gray\'s dá L5–S2 para a inervação.',
  }),
];

/** Membrana interóssea da perna: a malha do banco é a sindesmose entre a tíbia e a fíbula. */
export const LEG_LIGS = [
  lig('membrana_interossea_perna', 'Membrana interóssea da perna', 'Membrana interossea cruris', {
    region: R,
    parts: [{ id: 'membrana_interossea_perna', mat: 'ligament' }],
  }, {
    origem: 'Margem interóssea da tíbia.',
    insercao: 'Margem interóssea da fíbula (as fibras descem em direção oblíqua, da tíbia para a fíbula).',
    funcao: 'Une a tíbia e a fíbula em uma sindesmose fibrosa, transmite à tíbia parte das forças que chegam à fíbula e dá origem ao tibial anterior, ao extensor longo dos dedos, ao extensor longo do hálux, ao fibular terceiro, ao tibial posterior e ao flexor longo do hálux.',
    relacoes: 'O hiato superior, na parte alta, deixa passar a artéria tibial anterior para o compartimento anterior; o inferior, acima do tornozelo, deixa passar o ramo perfurante da artéria fibular. O nervo fibular profundo e a artéria tibial anterior descem sobre a face anterior da membrana.',
    nota: 'A sindesmose tibiofibular distal (os ligamentos tibiofibulares) entra com as articulações do tornozelo (F4.6).',
  }),
];
