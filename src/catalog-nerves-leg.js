/**
 * Nervos do membro inferior e da região glútea (F4.2: os que inervam o quadril e a coxa; F4.5: tibial, fibulares e plantares).
 * Mesmas convenções de `catalog-nerves.js`; pontos medidos no modelo. Os nervos cutâneos (M09) e os plexos desenhados (M10)
 * ficam para depois.
 */
import { nervo, CAST } from './catalog-nerves.js';

const R2 = ['tronco', 'membro_inf'];

export const NERVES_LEG = [
  nervo('n_obturatorio', 'Nervo obturatório', 'N. obturatorius', R2, {
    paths: [
      // tronco: do psoas, pela parede lateral da pelve, ao canal obturatório
      { pts: [{ sec: 'psoas_maior', y: -5.95, at: 'c' }, { sec: 'psoas_maior', y: -6.3, at: 'med', d: 0.01 }, [0.52, -6.75, 0.0], [0.47, -7.05, 0.15], [0.5, -7.33, 0.2]], r: 0.0065 },
      // ramo anterior: à frente do obturador externo e do adutor curto
      { pts: [[0.5, -7.33, 0.2], [0.58, -7.55, 0.3], [0.6, -8.0, 0.3], [0.55, -8.6, 0.24]], r: 0.0045 },
      // ramo posterior: atravessa o obturador externo e desce sobre o adutor magno
      { pts: [[0.5, -7.33, 0.2], [0.6, -7.5, 0.12], [0.64, -8.0, 0.1], [0.7, -8.8, 0.07]], r: 0.0042 },
    ],
    ramos: [
      { m: 'obturador_externo', obs: 'ramo posterior' },
      { m: 'adutor_longo', obs: 'ramo anterior' }, { m: 'adutor_curto', obs: 'ramo anterior' }, { m: 'gracil', obs: 'ramo anterior' },
      { m: 'pectineo', obs: 'ramo anterior (acessório; frequente)' },
      { m: 'adutor_magno', obs: 'ramo posterior (parte adutora)' }, { m: 'adutor_minimo', obs: 'ramo posterior' },
    ],
  }, {
    origem: 'Divisões anteriores dos ramos anteriores de L2, L3 e L4, dentro do psoas maior.',
    trajeto: 'Emerge da margem medial do psoas maior, cruza a entrada da pelve à frente da articulação sacroilíaca e segue pela parede lateral da pelve até o canal obturatório. Na coxa divide-se em ramo anterior (passa à frente do adutor curto, atrás do pectíneo e do adutor longo) e ramo posterior (atravessa o obturador externo e desce entre o adutor curto e o adutor magno).',
    ramos: 'Ramo anterior: adutor longo, adutor curto, grácil (e, às vezes, o pectíneo) e ramo cutâneo da face medial da coxa. Ramo posterior: obturador externo, adutor magno (parte adutora), adutor mínimo e ramos articulares do quadril e do joelho.',
    sensibilidade: 'Pele da parte medial e distal da coxa (ramo cutâneo), articulações do quadril e do joelho.',
    lesao: 'Fraturas pélvicas, cirurgia do quadril e parto laborioso podem lesá-lo: fraqueza da adução da coxa e dormência da face medial da coxa. A hérnia obturatória comprime o nervo e causa dor na face medial da coxa (sinal de Howship-Romberg).',
  }),
  nervo('n_gluteo_superior', 'Nervo glúteo superior', 'N. gluteus superior', R2, {
    paths: [{ pts: [
      [0.42, -6.72, -0.28], [0.6, -6.72, -0.5], [0.85, -6.64, -0.38],
      CAST('gluteo_minimo', [2.0, -6.65, -0.34], [-1, 0, 0], 0), CAST('gluteo_minimo', [2.0, -6.65, -0.3], [-1, 0, 0], 0), CAST('gluteo_minimo', [2.0, -6.65, -0.15], [-1, 0, 0], 0), CAST('gluteo_minimo', [2.0, -6.65, 0.0], [-1, 0, 0], 0), [1.28, -6.85, 0.2],
    ], r: 0.0055 }],
    ramos: [{ m: 'gluteo_medio' }, { m: 'gluteo_minimo' }, { m: 'tensor_fascia_lata' }],
  }, {
    origem: 'Divisões posteriores dos ramos anteriores de L4, L5 e S1 (plexo sacral).',
    trajeto: 'Sai da pelve pelo forame isquiático maior, acima do piriforme, com a artéria e a veia glúteas superiores; corre entre o glúteo médio e o glúteo mínimo e termina no tensor da fáscia lata.',
    lesao: 'Pode ser lesado em injeções glúteas mal localizadas, em cirurgias do quadril por via lateral e em fraturas do acetábulo: paralisa os abdutores e causa o sinal de Trendelenburg, com a pelve caindo do lado oposto ao apoio.',
  }),
  nervo('n_gluteo_inferior', 'Nervo glúteo inferior', 'N. gluteus inferior', R2, {
    paths: [{ pts: [[0.38, -6.85, -0.36], [0.52, -7.08, -0.52], [0.6, -7.16, -0.68]], r: 0.0055 }],
    ramos: [{ m: 'gluteo_maximo' }],
  }, {
    origem: 'Divisões posteriores dos ramos anteriores de L5, S1 e S2 (plexo sacral).',
    trajeto: 'Sai da pelve pelo forame isquiático maior, abaixo do piriforme, e divide-se em vários ramos que entram na face profunda do glúteo máximo.',
    lesao: 'A lesão dificulta levantar-se da posição sentada, subir escadas e correr, e o paciente joga o tronco para trás ao pisar com o calcanhar (marcha de glúteo máximo).',
  }),
  nervo('n_piriforme', 'Nervo para o piriforme', 'N. musculi piriformis', R2, {
    paths: [{ pts: [[0.3, -6.74, -0.3], [0.4, -6.78, -0.34], CAST('piriforme', [0.45, -6.8, -0.1], [0, 0, -1], 0.008)], r: 0.0035 }],
    ramos: [{ m: 'piriforme' }],
  }, {
    origem: 'Ramos anteriores de S1 e S2 (plexo sacral).',
    trajeto: 'Ramos curtos que entram no piriforme pela face pélvica, ainda dentro da pelve.',
    nota: 'Sem importância clínica isolada; a síndrome do piriforme envolve o nervo isquiático, que passa junto ao músculo.',
  }),
  nervo('n_quadrado_femoral', 'Nervo para o quadrado femoral e gêmeo inferior', 'N. musculi quadrati femoris', R2, {
    paths: [{ pts: [[0.4, -6.92, -0.3], [0.5, -7.08, -0.54], [0.6, -7.22, -0.56], [0.7, -7.4, -0.62], [0.85, -7.58, -0.52]], r: 0.0045 }],
    ramos: [{ m: 'quadrado_femoral' }, { m: 'gemeo_inferior' }],
  }, {
    origem: 'Divisões anteriores dos ramos anteriores de L4, L5 e S1 (plexo sacral).',
    trajeto: 'Sai da pelve pelo forame isquiático maior, abaixo do piriforme, e desce por baixo do nervo isquiático, à frente dos gêmeos e do obturador interno. Dá o ramo do gêmeo inferior e entra no quadrado femoral pela face anterior (profunda); também dá um ramo articular ao quadril.',
  }),
  nervo('n_isquiatico', 'Nervo isquiático (ciático)', 'N. ischiadicus', R2, {
    paths: [{ pts: [
      [0.36, -6.76, -0.34], [0.5, -7.08, -0.52], [0.72, -7.25, -0.62], [1.0, -7.55, -0.6], [1.0, -7.8, -0.48],
      [0.92, -8.2, -0.38], [0.9, -9.0, -0.28], [0.85, -10.0, -0.22], [0.8, -11.0, -0.2], [0.78, -11.6, -0.25],
    ], r: 0.0115, r1: 0.009 }],
    ramos: [
      { m: 'semitendineo', obs: 'divisão tibial' }, { m: 'semimembranaceo', obs: 'divisão tibial' },
      { m: 'biceps_femoral_longa', obs: 'divisão tibial' }, { m: 'adutor_magno', obs: 'parte isquiocondilar (divisão tibial)' },
      { m: 'biceps_femoral_curta', obs: 'divisão fibular comum' },
    ],
  }, {
    origem: 'Ramos anteriores de L4 a S3 (plexo sacral). É o maior nervo do corpo e reúne duas divisões, a tibial e a fibular comum, numa bainha comum.',
    trajeto: 'Sai da pelve pelo forame isquiático maior, abaixo do piriforme, e desce pela região glútea sob o glúteo máximo, entre o trocanter maior e o túber isquiático, sobre o obturador interno, os gêmeos e o quadrado femoral. Na coxa corre sob a cabeça longa do bíceps femoral e divide-se, no ápice da fossa poplítea, em nervo tibial e nervo fibular comum.',
    ramos: 'Divisão tibial: semitendíneo, semimembranáceo, cabeça longa do bíceps femoral e parte isquiocondilar do adutor magno. Divisão fibular comum: cabeça curta do bíceps femoral. Não dá ramos cutâneos na coxa.',
    sensibilidade: 'Nenhuma na coxa; a pele da perna e do pé é suprida pelos ramos do tibial e do fibular comum.',
    lesao: 'Injeção glútea fora do quadrante superior lateral, luxação posterior do quadril e fraturas do acetábulo podem lesá-lo: perda dos isquiotibiais e de todos os músculos abaixo do joelho, com pé caído. A divisão fibular, mais lateral e menos protegida, é a mais vulnerável.',
    nota: 'A divisão em tibial e fibular comum ocorre em altura variável (às vezes já na pelve, e a divisão fibular pode atravessar o piriforme). Aqui o nervo termina no ápice da fossa poplítea, onde continuam o nervo tibial e o nervo fibular comum.',
  }),

  /* ═════════════ Perna e pé (F4.5) ═════════════ */
  nervo('n_tibial', 'Nervo tibial', 'N. tibialis', 'membro_inf', {
    paths: [{ pts: [
      [0.78, -11.6, -0.25], [0.84, -11.9, -0.29], [0.9, -12.5, -0.32], [0.74, -13.0, -0.27], [0.66, -13.6, -0.23],
      [0.61, -14.4, -0.28], [0.56, -15.2, -0.3], [0.55, -15.5, -0.27],
    ], r: 0.0085, r1: 0.0065 }],
    ramos: [
      { m: 'gastrocnemio_medial', path: 0, t: [0, 0.25] }, { m: 'gastrocnemio_lateral', path: 0, t: [0, 0.25] }, { m: 'plantar', path: 0, t: [0, 0.25] },
      { m: 'popliteo', path: 0, t: [0, 0.2] }, { m: 'soleo', path: 0, t: [0, 0.35] },
      { m: 'tibial_posterior', path: 0, t: [0.15, 0.5] }, { m: 'flexor_longo_dedos', path: 0, t: [0.2, 0.6] }, { m: 'flexor_longo_halux', path: 0, t: [0.3, 0.8] },
    ],
  }, {
    origem: 'Divisão tibial do nervo isquiático, no ápice da fossa poplítea (L4–S3).',
    trajeto: 'Desce pela fossa poplítea, superficial aos vasos poplíteos, entre as duas cabeças do gastrocnêmio, e passa sob o arco tendíneo do sóleo para o compartimento posterior profundo, onde desce entre o tibial posterior e o sóleo (acompanhado pela artéria tibial posterior, que fica medial a ele). Atrás do maléolo medial, sob o retináculo dos flexores (túnel do tarso), entre os tendões do flexor longo dos dedos e do flexor longo do hálux, divide-se em nervos plantares medial e lateral.',
    ramos: 'Na fossa poplítea: nervo cutâneo sural medial (que se une ao sural lateral, do fibular comum) e ramos articulares do joelho. Na perna: ramos para as duas cabeças do gastrocnêmio, o plantar, o sóleo, o poplíteo, o tibial posterior, o flexor longo dos dedos e o flexor longo do hálux; ramos calcâneos mediais.',
    sensibilidade: 'Pele da face posterior da perna e do calcanhar e, pelos plantares, de toda a planta do pé (não desenhados: M09).',
    lesao: 'É bem protegido e raramente lesado isoladamente. A lesão alta paralisa a flexão plantar e a inversão do pé e dos dedos e causa perda de sensibilidade na planta: o paciente não consegue ficar na ponta do pé. A compressão atrás do maléolo medial é a síndrome do túnel do tarso (dor em queimação e dormência na planta, pior à noite).',
    nota: 'O gastrocnêmio recebe o ramo pouco abaixo do ápice da fossa, e os ramos do compartimento profundo saem junto ou abaixo do arco do sóleo. Os nervos cutâneos (sural, safeno, calcâneos) não estão desenhados (M09).',
  }),
  nervo('n_fibular_comum', 'Nervo fibular comum', 'N. fibularis (peroneus) communis', 'membro_inf', {
    paths: [{ pts: [[0.78, -11.6, -0.25], [0.95, -11.65, -0.38], [1.1, -11.8, -0.4], [1.24, -11.97, -0.3], [1.27, -12.1, -0.18], [1.2, -12.3, -0.1], [1.13, -12.35, -0.06]], r: 0.0065, r1: 0.0055 }],
    ramos: [],
  }, {
    origem: 'Divisão fibular comum do nervo isquiático, no ápice da fossa poplítea (L4–S2).',
    trajeto: 'Desce ao longo da margem medial do tendão do bíceps femoral, cruza a cabeça lateral do gastrocnêmio e contorna o colo da fíbula, onde é superficial e palpável, sob a origem do músculo fibular longo; nesse ponto divide-se em nervo fibular superficial e nervo fibular profundo.',
    ramos: 'Nervo cutâneo sural lateral e ramo comunicante fibular (que formam o sural), ramos articulares do joelho; depois, os fibulares superficial e profundo. A cabeça curta do bíceps femoral, inervada pela divisão fibular, já recebeu seu ramo na coxa (no isquiático).',
    sensibilidade: 'Pele da face lateral da perna (sural lateral) e, pelos fibulares superficial e profundo, do dorso do pé (não desenhados: M09).',
    lesao: 'É o nervo mais vulnerável do membro inferior, porque é superficial no colo da fíbula: a fratura do colo, a luxação do joelho, o gesso e as compressões prolongadas (cruzar as pernas, anestesia) o lesam. Causa o pé caído (perda da dorsiflexão e da eversão, marcha escarvante) e dormência da face lateral da perna e do dorso do pé.',
  }),
  nervo('n_fibular_superficial', 'Nervo fibular superficial', 'N. fibularis (peroneus) superficialis', 'membro_inf', {
    paths: [{ pts: [
      [1.13, -12.35, -0.06], [1.2, -12.45, -0.12], { between: ['fibular_longo', 'extensor_longo_dedos'], y: -12.8, w: 0.5 },
      { between: ['fibular_longo', 'extensor_longo_dedos'], y: -13.4, w: 0.5 }, { between: ['fibular_curto', 'extensor_longo_dedos'], y: -14.1, w: 0.5, add: [0.03, 0, 0] },
      [1.05, -14.8, -0.12], [1.0, -15.2, 0.0],
    ], r: 0.0045, r1: 0.003 }],
    ramos: [{ m: 'fibular_longo', path: 0, t: [0, 0.4] }, { m: 'fibular_curto', path: 0, t: [0.2, 0.6] }],
  }, {
    origem: 'Nervo fibular comum, no colo da fíbula (L5–S2).',
    trajeto: 'Desce no compartimento lateral da perna, entre o fibular longo e o fibular curto e o extensor longo dos dedos; no terço distal perfura a fáscia da perna e se torna subcutâneo, dividindo-se em nervos cutâneos dorsais medial e intermédio do pé.',
    ramos: 'Fibular longo e fibular curto (no compartimento lateral); no pé, nervos cutâneos dorsais medial e intermédio.',
    sensibilidade: 'Pele da parte distal da face lateral da perna e do dorso do pé e dos dedos, exceto o primeiro espaço interdigital (fibular profundo) e a margem lateral do pé (sural).',
    lesao: 'Perde a eversão do pé, que tende ao varo, e a sensibilidade do dorso do pé; a dorsiflexão se conserva (fibular profundo). A compressão no ponto de saída pela fáscia causa dor e formigamento no dorso do pé.',
  }),
  nervo('n_fibular_profundo', 'Nervo fibular profundo', 'N. fibularis (peroneus) profundus', 'membro_inf', {
    paths: [
      { pts: [
        [1.13, -12.35, -0.06], [1.12, -12.5, 0.02], { between: ['tibial_anterior', 'extensor_longo_dedos'], y: -12.9, w: 0.5 },
        { between: ['tibial_anterior', 'extensor_longo_dedos'], y: -13.6, w: 0.5 }, { between: ['tibial_anterior', 'extensor_longo_dedos'], y: -14.4, w: 0.5 },
        { between: ['extensor_longo_halux', 'extensor_longo_dedos'], y: -15.1, w: 0.5 }, [0.88, -15.42, 0.34],
      ], r: 0.005, r1: 0.0035 },
      // ramo lateral, para o extensor curto
      { pts: [[0.88, -15.42, 0.34], [0.93, -15.45, 0.3], [0.97, -15.48, 0.25]], r: 0.003 },
    ],
    ramos: [
      { m: 'tibial_anterior', path: 0, t: [0.05, 0.4] }, { m: 'extensor_longo_dedos', path: 0, t: [0.05, 0.5] }, { m: 'extensor_longo_halux', path: 0, t: [0.25, 0.7] },
      { m: 'fibular_terceiro', path: 0, t: [0.4, 0.8] }, { m: 'extensor_curto_halux', path: 1, obs: 'ramo lateral' },
    ],
  }, {
    origem: 'Nervo fibular comum, no colo da fíbula (L4–S1).',
    trajeto: 'Atravessa o extensor longo dos dedos para o compartimento anterior e desce sobre a membrana interóssea, lateral à artéria tibial anterior, entre o tibial anterior e o extensor longo dos dedos (e, depois, do hálux). À frente do tornozelo, sob o retináculo extensor, divide-se em ramo lateral (para o extensor curto dos dedos e do hálux) e ramo medial, que chega ao primeiro espaço interdigital.',
    ramos: 'Tibial anterior, extensor longo dos dedos, extensor longo do hálux, fibular terceiro e, no pé, o extensor curto dos dedos e do hálux; ramo articular do tornozelo; ramo cutâneo para o primeiro espaço interdigital.',
    sensibilidade: 'Pele dos lados voltados um para o outro do hálux e do 2º dedo (primeiro espaço interdigital) e articulação do tornozelo.',
    lesao: 'Perde a dorsiflexão do pé e a extensão dos dedos: o pé cai e arrasta (marcha escarvante), com a eversão preservada (fibular superficial) e dormência só do primeiro espaço interdigital. A compressão sob o retináculo extensor inferior é a síndrome do túnel do tarso anterior.',
    nota: 'O ramo lateral supre o extensor curto dos dedos; no modelo só existe o extensor curto do hálux, a parte medial dele (M14).',
  }),
  nervo('n_plantar_medial', 'Nervo plantar medial', 'N. plantaris medialis', 'membro_inf', {
    paths: [{ pts: [[0.55, -15.55, -0.27], [0.57, -15.74, -0.1], [0.62, -15.8, 0.1], [0.68, -15.84, 0.3], [0.78, -15.88, 0.6], [0.86, -15.95, 0.85]], r: 0.0055, r1: 0.0035 }],
    ramos: [
      { m: 'abdutor_halux', path: 0, t: [0, 0.5] }, { m: 'flexor_curto_dedos', path: 0, t: [0.3, 0.8] },
      { m: 'flexor_curto_halux_medial', path: 0, t: [0.5, 1] }, { m: 'flexor_curto_halux_lateral', path: 0, t: [0.5, 1], obs: 'Moore; para o Gray\'s, o plantar lateral' },
      { m: 'lumbricais_pe', path: 0, t: [0.6, 1], obs: '1º lumbrical' },
    ],
  }, {
    origem: 'Nervo tibial, sob o retináculo dos flexores, atrás do maléolo medial (L4–L5 para a pele; S2–S3 para os músculos).',
    trajeto: 'Passa sob a origem do abdutor do hálux e segue pela planta, entre o abdutor do hálux e o flexor curto dos dedos, acompanhando a artéria plantar medial. Divide-se em nervos digitais plantares comuns.',
    ramos: 'Abdutor do hálux, flexor curto dos dedos, flexor curto do hálux e 1º lumbrical; nervos digitais plantares comuns e próprios.',
    sensibilidade: 'Pele da parte medial da planta e dos 3½ dedos mediais (face plantar), inclusive os leitos ungueais dorsais: equivale ao nervo mediano da mão.',
    lesao: 'A compressão no túnel do tarso, a lesão por corte e as fraturas do calcâneo causam dormência da planta medial e fraqueza dos músculos intrínsecos do pé. A neuralgia de Morton é a compressão de um nervo digital comum (em geral, o do 3º espaço) sob o ligamento metatarsal transverso profundo: dor em queimação no antepé.',
    nota: 'Os músculos inervados pelo plantar medial lembram o mnemônico “AFFL”: abdutor do hálux, flexor curto dos dedos, flexor curto do hálux e 1º lumbrical.',
  }),
  nervo('n_plantar_lateral', 'Nervo plantar lateral', 'N. plantaris lateralis', 'membro_inf', {
    paths: [
      { pts: [[0.55, -15.55, -0.28], [0.6, -15.78, -0.2], [0.7, -15.82, -0.08], [0.88, -15.86, 0.08], [1.05, -15.93, 0.22], [1.18, -15.97, 0.35], [1.25, -15.98, 0.42]], r: 0.006, r1: 0.0045 },
      // ramo profundo: cruza a planta com o arco plantar profundo, sob os tendões flexores
      { pts: [[1.18, -15.97, 0.35], [1.1, -15.93, 0.5], [1.0, -15.93, 0.6], [0.9, -15.93, 0.72]], r: 0.0035 },
    ],
    ramos: [
      { m: 'quadrado_plantar', path: 0, t: [0, 0.3] }, { m: 'abdutor_minimo_pe', path: 0, t: [0.2, 0.7] },
      { m: 'flexor_curto_minimo_pe', path: 0, t: [0.6, 1], obs: 'ramo superficial' }, { m: 'oponente_minimo_pe', path: 0, t: [0.6, 1], obs: 'ramo superficial' },
      { m: 'adutor_halux_obliquo', path: 1, obs: 'ramo profundo' }, { m: 'adutor_halux_transverso', path: 1, obs: 'ramo profundo' },
      { m: 'interosseos_plantares', path: 1, obs: 'ramo profundo' }, { m: 'lumbricais_pe', path: 1, obs: '2º a 4º lumbrical (ramo profundo)' },
    ],
  }, {
    origem: 'Nervo tibial, sob o retináculo dos flexores, atrás do maléolo medial (S1–S3).',
    trajeto: 'Cruza a planta obliquamente, para o lado lateral, entre o flexor curto dos dedos e o quadrado plantar, junto com a artéria plantar lateral, e perto da base do 5º metatarsal divide-se em ramo superficial e ramo profundo, que acompanha o arco plantar profundo.',
    ramos: 'Quadrado plantar e abdutor do dedo mínimo (antes da divisão); ramo superficial: flexor curto e oponente do dedo mínimo e nervos digitais para o dedo mínimo e o lado lateral do 4º dedo; ramo profundo: adutor do hálux, interósseos, 2º a 4º lumbricais.',
    sensibilidade: 'Pele da parte lateral da planta e do 1½ dedo lateral (face plantar): equivale ao nervo ulnar da mão.',
    lesao: 'A paralisia dos músculos intrínsecos do pé, comum na neuropatia diabética, deforma os dedos em garra; a perda de sensibilidade na planta favorece as úlceras do pé diabético.',
    nota: 'Os músculos da planta que não são do plantar medial vêm do plantar lateral, inclusive o adutor do hálux; o extensor curto vem do fibular profundo.',
  }),
];
