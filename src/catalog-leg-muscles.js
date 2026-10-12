/**
 * Músculos do quadril e da coxa (F4.2, lote A), com malha real do BodyParts3D (pacote `anatomy-leg.js`). Textos a partir de
 * Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.). O músculo articular do joelho não tem malha no banco (M14 em
 * `docs/pontos-de-melhoria.md`); as ações de cada articulação entram com as articulações do membro inferior (F4.6).
 */
import { bm, P } from './catalog-body-muscles.js';

const R = 'membro_inf';

export const LEG_MUSCLES = [
  /* ═════════════ Região glútea ═════════════ */
  bm('gluteo_maximo', 'Glúteo máximo', 'M. gluteus maximus', 'sup', R, P('gluteo_maximo'), {
    acao: 'Estende e roda lateralmente a coxa (sobretudo com esforço: subir escadas, levantar-se da cadeira, correr); as fibras superiores abduzem e as inferiores aduzem. Pelo trato iliotibial, estabiliza o joelho estendido.',
    origem: 'Face externa do ílio atrás da linha glútea posterior, face posterior do sacro e do cóccix, ligamento sacrotuberal e fáscia toracolombar.',
    insercao: 'Em sua maior parte (fibras superiores e superficiais das inferiores) no trato iliotibial; as fibras profundas inferiores, na tuberosidade glútea do fêmur.',
    inervacao: 'Nervo glúteo inferior (L5–S2).',
    nota: 'É o músculo mais volumoso e superficial da região glútea e dá o contorno da nádega. A lesão do nervo glúteo inferior dificulta subir escadas e levantar-se da posição sentada. Bolsas o separam do trocanter maior e do túber isquiático.',
  }),
  bm('gluteo_medio', 'Glúteo médio', 'M. gluteus medius', 'med', R, P('gluteo_medio'), {
    acao: 'Abduz a coxa; as fibras anteriores a rodam medialmente e as posteriores, lateralmente. Na marcha, mantém a pelve nivelada durante o apoio de um só pé.',
    origem: 'Face externa do ílio, entre as linhas glúteas anterior e posterior, abaixo da crista ilíaca.',
    insercao: 'Face lateral do trocanter maior do fêmur, por um tendão achatado.',
    inervacao: 'Nervo glúteo superior (L4–S1).',
    nota: 'Com o glúteo mínimo, é o principal estabilizador da pelve. A fraqueza dele ou a lesão do nervo glúteo superior causa o sinal de Trendelenburg: no apoio do lado afetado, a pelve cai do lado oposto.',
  }),
  bm('gluteo_minimo', 'Glúteo mínimo', 'M. gluteus minimus', 'prof', R, P('gluteo_minimo'), {
    acao: 'Abduz e roda medialmente a coxa; com o glúteo médio, estabiliza a pelve na marcha.',
    origem: 'Face externa do ílio, entre as linhas glúteas anterior e inferior.',
    insercao: 'Face anterior do trocanter maior do fêmur.',
    inervacao: 'Nervo glúteo superior (L4–S1).',
    nota: 'Fica sob o glúteo médio; o nervo e os vasos glúteos superiores correm entre os dois.',
  }),
  bm('tensor_fascia_lata', 'Tensor da fáscia lata', 'M. tensor fasciae latae', 'sup', R, P('tensor_fascia_lata'), {
    acao: 'Flexiona, abduz e roda medialmente a coxa; tensiona o trato iliotibial e ajuda a estabilizar o joelho estendido e a pelve na marcha.',
    origem: 'Espinha ilíaca anterossuperior e parte anterior do lábio externo da crista ilíaca.',
    insercao: 'Trato iliotibial, que se fixa no côndilo lateral da tíbia.',
    inervacao: 'Nervo glúteo superior (L4–S1).',
    nota: 'Com a parte superior do glúteo máximo, tensiona o trato iliotibial; a síndrome do trato iliotibial é causa comum de dor lateral no joelho em corredores.',
  }),
  bm('piriforme', 'Piriforme', 'M. piriformis', 'prof', R, P('piriforme'), {
    acao: 'Roda lateralmente a coxa estendida e abduz a coxa fletida; ajuda a manter a cabeça do fêmur no acetábulo.',
    origem: 'Face pélvica do sacro, entre os forames sacrais anteriores 2 a 4, e margem da incisura isquiática maior.',
    insercao: 'Borda superior do trocanter maior do fêmur.',
    inervacao: 'Nervo para o piriforme (ramos anteriores de S1–S2).',
    nota: 'Atravessa o forame isquiático maior e o divide em duas passagens: o nervo glúteo superior sai acima dele; o glúteo inferior, o isquiático, o pudendo e outros saem abaixo. Em parte das pessoas o nervo isquiático (ou sua divisão fibular) perfura o músculo; a compressão do nervo no local é a síndrome do piriforme, de diagnóstico controverso.',
  }),
  bm('gemeo_superior', 'Gêmeo superior', 'M. gemellus superior', 'prof', R, P('gemeo_superior'), {
    acao: 'Roda lateralmente a coxa estendida e abduz a coxa fletida; com o obturador interno, estabiliza o quadril.',
    origem: 'Face glútea da espinha isquiática.',
    insercao: 'Tendão do obturador interno, na face medial do trocanter maior.',
    inervacao: 'Nervo para o obturador interno (L5–S1).',
    nota: 'Os dois gêmeos acompanham, por cima e por baixo, o tendão do obturador interno, que passa entre eles para o trocanter maior.',
  }),
  bm('gemeo_inferior', 'Gêmeo inferior', 'M. gemellus inferior', 'prof', R, P('gemeo_inferior'), {
    acao: 'Roda lateralmente a coxa estendida e abduz a coxa fletida; com o obturador interno, estabiliza o quadril.',
    origem: 'Parte superior do túber isquiático.',
    insercao: 'Tendão do obturador interno, na face medial do trocanter maior.',
    inervacao: 'Nervo para o quadrado femoral (L4–S1).',
  }),
  bm('obturador_externo', 'Obturador externo', 'M. obturator externus', 'prof', R, P('obturador_externo'), {
    acao: 'Roda lateralmente a coxa e a estabiliza no acetábulo.',
    origem: 'Margem do forame obturado e face externa da membrana obturadora.',
    insercao: 'Fossa trocantérica do fêmur.',
    inervacao: 'Nervo obturatório, ramo posterior (L3–L4).',
    nota: 'Contorna o colo do fêmur por baixo e por trás; o ramo posterior do nervo obturatório o atravessa antes de seguir para o adutor magno.',
  }),
  bm('quadrado_femoral', 'Quadrado femoral', 'M. quadratus femoris', 'prof', R, P('quadrado_femoral'), {
    acao: 'Roda lateralmente a coxa e a estabiliza no acetábulo.',
    origem: 'Borda lateral do túber isquiático.',
    insercao: 'Crista intertrocantérica do fêmur (tubérculo quadrado).',
    inervacao: 'Nervo para o quadrado femoral (L4–S1).',
    nota: 'Fica entre o gêmeo inferior e o adutor magno; o nervo isquiático desce por trás dele, o que o torna referência nos acessos posteriores ao quadril.',
  }),

  /* ═════════════ Compartimento anterior da coxa ═════════════ */
  bm('sartorio', 'Sartório', 'M. sartorius', 'sup', R, P('sartorio'), {
    acao: 'Flexiona, abduz e roda lateralmente a coxa (a posição de sentar com as pernas cruzadas); flexiona o joelho e roda medialmente a perna fletida.',
    origem: 'Espinha ilíaca anterossuperior e parte superior da incisura logo abaixo dela.',
    insercao: 'Parte superior da face medial da tíbia, na pata de ganso (com o grácil e o semitendíneo).',
    inervacao: 'Nervo femoral (L2–L3).',
    nota: 'É o músculo mais longo do corpo. Forma o limite lateral do trígono femoral e o teto do canal dos adutores.',
  }),
  bm('reto_femoral', 'Reto femoral', 'M. rectus femoris', 'sup', R, P('reto_femoral'), {
    acao: 'Estende a perna no joelho (com os vastos) e flexiona a coxa no quadril: é o único componente do quadríceps que cruza o quadril.',
    origem: 'Cabeça reta, na espinha ilíaca anteroinferior; cabeça refletida, no sulco acima do acetábulo.',
    insercao: 'Base da patela, pelo tendão do quadríceps; daí, pelo ligamento patelar, na tuberosidade da tíbia.',
    inervacao: 'Nervo femoral (L2–L4).',
    nota: 'A avulsão da espinha ilíaca anteroinferior, no local da origem, ocorre em jovens atletas que chutam.',
  }),
  bm('vasto_lateral', 'Vasto lateral', 'M. vastus lateralis', 'sup', R, P('vasto_lateral'), {
    acao: 'Estende a perna no joelho; tende a puxar a patela lateralmente.',
    origem: 'Trocanter maior e lábio lateral da linha áspera do fêmur.',
    insercao: 'Margem lateral da patela e tendão do quadríceps; pelo ligamento patelar, na tuberosidade da tíbia.',
    inervacao: 'Nervo femoral (L2–L4).',
    nota: 'É o maior componente do quadríceps e local de injeção intramuscular, principalmente em lactentes.',
  }),
  bm('vasto_medial', 'Vasto medial', 'M. vastus medialis', 'sup', R, P('vasto_medial'), {
    acao: 'Estende a perna no joelho; suas fibras inferiores, mais horizontais, impedem a patela de se deslocar para o lado.',
    origem: 'Metade inferior da linha intertrocantérica, lábio medial da linha áspera e linha supracondilar medial do fêmur.',
    insercao: 'Margem medial da patela e tendão do quadríceps; pelo ligamento patelar, na tuberosidade da tíbia.',
    inervacao: 'Nervo femoral (L2–L4).',
    nota: 'A fraqueza das fibras oblíquas inferiores favorece a luxação lateral da patela.',
  }),
  bm('vasto_intermedio', 'Vasto intermédio', 'M. vastus intermedius', 'prof', R, P('vasto_intermedio'), {
    acao: 'Estende a perna no joelho.',
    origem: 'Faces anterior e lateral dos dois terços superiores do corpo do fêmur.',
    insercao: 'Tendão do quadríceps, na base da patela (camada profunda); pelo ligamento patelar, na tuberosidade da tíbia.',
    inervacao: 'Nervo femoral (L2–L4).',
    nota: 'Fica sob o reto femoral. Algumas fibras profundas formam o músculo articular do joelho, que não tem malha no banco e fica fora do modelo (M14).',
  }),
  bm('pectineo', 'Pectíneo', 'M. pectineus', 'med', R, P('pectineo'), {
    acao: 'Flexiona e aduz a coxa.',
    origem: 'Ramo superior do púbis (linha pectínea).',
    insercao: 'Linha pectínea do fêmur, entre o trocanter menor e a linha áspera.',
    inervacao: 'Nervo femoral (L2–L3); com frequência também o nervo obturatório (ramo anterior ou acessório).',
    nota: 'Participa do assoalho do trígono femoral. Pertence ao compartimento anterior mas age como adutor, e por isso a dupla inervação é comum.',
  }),

  /* ═════════════ Compartimento medial da coxa ═════════════ */
  bm('adutor_longo', 'Adutor longo', 'M. adductor longus', 'med', R, P('adutor_longo'), {
    acao: 'Aduz a coxa.',
    origem: 'Corpo do púbis, abaixo da crista púbica.',
    insercao: 'Terço médio da linha áspera do fêmur (lábio medial).',
    inervacao: 'Nervo obturatório, ramo anterior (L2–L4).',
    nota: 'É o adutor mais anterior e forma o limite medial do trígono femoral. A distensão dele é a lesão “da virilha” típica de jogadores de futebol.',
  }),
  bm('adutor_curto', 'Adutor curto', 'M. adductor brevis', 'prof', R, P('adutor_curto'), {
    acao: 'Aduz a coxa e a flexiona levemente.',
    origem: 'Corpo e ramo inferior do púbis.',
    insercao: 'Linha pectínea e parte superior da linha áspera do fêmur.',
    inervacao: 'Nervo obturatório, ramo anterior (L2–L4).',
    nota: 'Fica atrás do pectíneo e do adutor longo e à frente do adutor magno: o ramo anterior do obturatório passa à frente dele e o posterior, atrás.',
  }),
  bm('adutor_magno', 'Adutor magno', 'M. adductor magnus', 'med', R, P('adutor_magno'), {
    acao: 'A parte adutora aduz a coxa (e a flexiona); a parte isquiocondilar a estende, como os isquiotibiais.',
    origem: 'Parte adutora: ramo inferior do púbis e ramo do ísquio. Parte isquiocondilar: túber isquiático.',
    insercao: 'Parte adutora: tuberosidade glútea, linha áspera e linha supracondilar medial. Parte isquiocondilar: tubérculo do adutor, no côndilo medial do fêmur.',
    inervacao: 'Parte adutora: nervo obturatório, ramo posterior (L2–L4). Parte isquiocondilar: nervo tibial, parte do isquiático (L4).',
    nota: 'É um músculo híbrido, de dupla inervação. Entre as duas partes fica o hiato dos adutores, por onde os vasos femorais passam para a fossa poplítea.',
  }),
  bm('adutor_minimo', 'Adutor mínimo', 'M. adductor minimus', 'prof', R, P('adutor_minimo'), {
    acao: 'Aduz a coxa, como a parte adutora do adutor magno.',
    origem: 'Ramo inferior do púbis e ramo do ísquio, na parte mais anterior da origem do adutor magno.',
    insercao: 'Face posterior do fêmur, da tuberosidade glútea ao trecho superior da linha áspera.',
    inervacao: 'Nervo obturatório, ramo posterior (L2–L4).',
    nota: 'Muitos autores o descrevem como o feixe superior, mais horizontal, do adutor magno e não o separam (Moore); a malha do banco o traz como peça à parte, e por isso ele aparece aqui como entrada própria.',
  }),
  bm('gracil', 'Grácil', 'M. gracilis', 'sup', R, P('gracil'), {
    acao: 'Aduz a coxa, flexiona a perna e a roda medialmente com o joelho fletido; ajuda a flexionar o quadril.',
    origem: 'Corpo e ramo inferior do púbis.',
    insercao: 'Parte superior da face medial da tíbia, na pata de ganso (com o sartório e o semitendíneo).',
    inervacao: 'Nervo obturatório, ramo anterior (L2–L3).',
    nota: 'É o único adutor que cruza o joelho. Seu tendão, com o do semitendíneo, é usado como enxerto na reconstrução do ligamento cruzado anterior.',
  }),

  /* ═════════════ Compartimento posterior da coxa (isquiotibiais) ═════════════ */
  bm('biceps_femoral_longa', 'Bíceps femoral — cabeça longa', 'M. biceps femoris, caput longum', 'sup', R, P('biceps_femoral_longa'), {
    acao: 'Estende a coxa e flexiona a perna; roda lateralmente a perna fletida.',
    origem: 'Parte inferomedial da impressão superior do túber isquiático (tendão comum com o semitendíneo) e ligamento sacrotuberal.',
    insercao: 'Cabeça da fíbula, por um tendão comum com a cabeça curta que se divide em torno do ligamento colateral fibular.',
    inervacao: 'Nervo tibial, parte do isquiático (S1–S3).',
    nota: 'As lesões dos isquiotibiais são comuns na corrida de velocidade; a origem no túber isquiático pode sofrer avulsão. O nervo fibular comum corre ao longo da borda medial do tendão do bíceps.',
  }),
  bm('biceps_femoral_curta', 'Bíceps femoral — cabeça curta', 'M. biceps femoris, caput breve', 'med', R, P('biceps_femoral_curta'), {
    acao: 'Flexiona a perna e a roda lateralmente; por não cruzar o quadril, não estende a coxa.',
    origem: 'Lábio lateral da linha áspera e linha supracondilar lateral do fêmur.',
    insercao: 'Cabeça da fíbula, pelo tendão comum com a cabeça longa.',
    inervacao: 'Nervo fibular comum, parte do isquiático (L5–S2).',
    nota: 'É a única cabeça dos isquiotibiais inervada pela divisão fibular comum do isquiático e a única que não cruza o quadril; por isso pode ficar poupada ou isolada nas lesões do isquiático.',
  }),
  bm('semitendineo', 'Semitendíneo', 'M. semitendinosus', 'sup', R, P('semitendineo'), {
    acao: 'Estende a coxa, flexiona a perna e a roda medialmente com o joelho fletido; ajuda a erguer o tronco da posição curvada.',
    origem: 'Parte inferomedial da impressão superior do túber isquiático (tendão comum com a cabeça longa do bíceps).',
    insercao: 'Parte superior da face medial da tíbia, na pata de ganso.',
    inervacao: 'Nervo tibial, parte do isquiático (L5–S2).',
    nota: 'Seu tendão longo e cilíndrico ocupa a metade inferior do músculo; é um enxerto comum na reconstrução do ligamento cruzado anterior.',
  }),
  bm('semimembranaceo', 'Semimembranáceo', 'M. semimembranosus', 'med', R, P('semimembranaceo'), {
    acao: 'Estende a coxa, flexiona a perna e a roda medialmente com o joelho fletido.',
    origem: 'Impressão superolateral do túber isquiático.',
    insercao: 'Face posterior do côndilo medial da tíbia, com expansões para o ligamento poplíteo oblíquo e a fáscia do poplíteo.',
    inervacao: 'Nervo tibial, parte do isquiático (L5–S2).',
    nota: 'O cisto de Baker (poplíteo) se forma entre o gastrocnêmio medial e o tendão do semimembranáceo e comunica-se com a articulação do joelho.',
  }),
];
