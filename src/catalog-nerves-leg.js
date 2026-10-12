/**
 * Nervos do membro inferior e da região glútea (F4.2: os que inervam o quadril e a coxa; o restante, na F4.5).
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
    nota: 'A divisão em tibial e fibular comum ocorre em altura variável (às vezes já na pelve, e a divisão fibular pode atravessar o piriforme). Aqui o nervo termina no ápice da fossa poplítea; o tibial e o fibular comum entram com os demais nervos do membro inferior (F4.5).',
  }),
];
