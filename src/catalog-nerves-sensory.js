/**
 * Nervos sensitivos (cutâneos) do plexo cervical e do membro superior (F2.12). Os que já existiam como trechos dentro
 * da ficha do nervo-mãe (cutâneo lateral superior do braço, cutâneo lateral do antebraço, ramo superficial do radial,
 * ramo cutâneo dorsal do ulnar, nervos digitais do mediano) foram separados para terem ficha própria.
 * Todos correm sob a pele (a geometria é ancorada na pele do modelo, com SK), por isso `superficial: true`.
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.);
 * Netter — Atlas de anatomia humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 */
import { nervo, SK, BP, RIB, smoothRib, groove } from './catalog-nerves.js';

/** Ponto de Erb: emergência dos nervos cutâneos do plexo cervical na margem posterior do ECM, no meio dela. */
const ERB = { sec: 'ecm', y: -0.97, at: 'post', d: 0.02 };

export const NERVES_SENSORY = [
  /* ═════════════════════ Plexo cervical: ramos cutâneos ═════════════════════ */
  nervo('n_occipital_menor', 'Nervo occipital menor (C2–C3)', 'N. occipitalis minor', 'cabeca', {
    superficial: true,
    paths: [{ pts: [ERB, { sec: 'ecm', y: -0.78, at: 'post', d: 0.02 }, SK([0.5, -0.5, -0.24], -0.03), SK([0.56, -0.28, -0.42], -0.03), SK([0.5, -0.02, -0.7], -0.03), SK([0.4, 0.2, -0.88], -0.03)], r: 0.0035 }],
  }, {
    origem: 'Plexo cervical: ramos anteriores de C2 e C3 (sobretudo C2).',
    trajeto: 'Contorna a margem posterior do esternocleidomastóideo, no ponto de Erb, e sobe junto a ela até a região mastóidea, onde se divide em ramos que vão ao couro cabeludo atrás da orelha e à face posterior do pavilhão.',
    sensibilidade: 'Couro cabeludo da região mastóidea e occipital lateral e face posterior do pavilhão da orelha.',
    lesao: 'Dormência atrás da orelha após cirurgias retroauriculares e da mastoide. Participa da neuralgia occipital e da cefaleia de origem cervical.',
    nota: 'Não inerva músculos. É o ramo mais posterior do conjunto cutâneo do plexo cervical; pode vir de C3 em vez de C2.',
  }),
  nervo('n_auricular_magno', 'Nervo auricular magno (C2–C3)', 'N. auricularis magnus', 'cabeca', {
    superficial: true,
    paths: [
      { pts: [ERB, { sec: 'ecm', y: -0.85, at: 'lat', d: 0.012 }, SK([0.66, -0.66, 0.0], -0.025), SK([0.72, -0.52, 0.0], -0.02)], r: 0.0042 },
      // ramo anterior (pele sobre a parótida) e ramo posterior (processo mastoide e face posterior da orelha)
      { pts: [SK([0.66, -0.66, 0.0], -0.025), SK([0.68, -0.52, 0.12], -0.025), SK([0.6, -0.4, 0.22], -0.025)], r: 0.003 },
      { pts: [SK([0.72, -0.52, 0.0], -0.02), SK([0.72, -0.4, -0.12], -0.02), SK([0.66, -0.28, -0.18], -0.02)], r: 0.003 },
    ],
  }, {
    origem: 'Plexo cervical: ramos anteriores de C2 e C3 (sobretudo C3).',
    trajeto: 'Contorna a margem posterior do esternocleidomastóideo, no ponto de Erb, cruza obliquamente a face lateral do músculo, sob o platisma, para cima e para a frente, em direção ao lóbulo da orelha, e se divide em ramos anterior e posterior.',
    sensibilidade: 'Pele sobre a parótida e o ângulo da mandíbula, face lateral do lóbulo e do pavilhão e região da mastoide. O ramo posterior vai à face posterior do pavilhão.',
    lesao: 'É o nervo cervical mais lesado em cirurgias (parotidectomia, ritidoplastia, pescoço): dormência do lóbulo e da pele sobre a parótida. Seu ramo anterior corre sobre a glândula e serve de referência para o facial.',
    nota: 'Não inerva músculos. É o maior ramo ascendente do plexo cervical superficial e costuma ser usado como enxerto nervoso (por exemplo, para reconstruir o facial).',
  }),
  nervo('n_cervical_transverso', 'Nervo cervical transverso (C2–C3)', 'N. transversus colli', 'cabeca', {
    superficial: true,
    paths: [{ pts: [ERB, { sec: 'ecm', y: -1.0, at: 'lat', d: 0.012 }, SK([0.42, -1.0, 0.3], -0.02), SK([0.25, -1.04, 0.44], -0.02), SK([0.1, -1.05, 0.48], -0.02)], r: 0.0035 }],
  }, {
    origem: 'Plexo cervical: ramos anteriores de C2 e C3.',
    trajeto: 'Contorna a margem posterior do esternocleidomastóideo e cruza horizontalmente a face lateral do músculo, sob o platisma, até a pele da face anterior do pescoço. Comunica-se com o ramo cervical do nervo facial, formando uma alça superficial.',
    sensibilidade: 'Pele da face anterior e lateral do pescoço, do hioide ao esterno.',
    lesao: 'Dormência na face anterior do pescoço após tireoidectomia, esvaziamento cervical ou acesso à carótida.',
    nota: 'Não inerva músculos. A comunicação com o ramo cervical do facial é uma das explicações de por que a pele do pescoço pode manter sensibilidade parcial em lesões do plexo.',
  }),
  nervo('n_supraclaviculares', 'Nervos supraclaviculares (C3–C4)', 'Nn. supraclaviculares (mediais, intermédios e laterais)', ['cabeca', 'tronco'], {
    superficial: true,
    paths: [
      { pts: [ERB, SK([0.38, -1.3, 0.12], -0.02), SK([0.34, -1.6, 0.34], -0.02), SK([0.26, -1.86, 0.56], -0.02)], r: 0.0035 },
      { pts: [SK([0.38, -1.3, 0.12], -0.02), SK([0.62, -1.62, 0.2], -0.02), SK([0.66, -1.84, 0.36], -0.02)], r: 0.0035 },
      { pts: [SK([0.62, -1.62, 0.2], -0.02), SK([0.9, -1.62, 0.05], -0.02), SK([1.12, -1.72, 0.0], -0.02)], r: 0.0035 },
    ],
  }, {
    origem: 'Plexo cervical: ramos anteriores de C3 e C4.',
    trajeto: 'Contornam a margem posterior do esternocleidomastóideo, descem sob o platisma pelo trígono posterior e cruzam a clavícula em três grupos: mediais (sobre a articulação esternoclavicular e o esterno), intermédios (sobre o terço médio da clavícula) e laterais (sobre o acrômio e o deltoide).',
    sensibilidade: 'Pele sobre o ombro e a parte superior da parede anterior do tórax, até o nível da 2ª costela.',
    lesao: 'Dormência na pele subclavicular após fratura ou cirurgia da clavícula. O nível C4 é o dermátomo do ombro: a dor do diafragma e do fígado, transmitida pelo frênico (C3–C5), é referida no ombro (sinal de Kehr).',
    nota: 'Não inervam músculos. Os laterais chegam à pele do acrômio; os intermédios cruzam a clavícula, e é por isso que a fratura dela pode lesá-los.',
  }),

  /* ═════════════════════ Membro superior: nervos cutâneos ═════════════════════ */
  nervo('n_intercostobraquial', 'Nervo intercostobraquial (T2)', 'N. intercostobrachialis', ['tronco', 'membro_sup'], {
    superficial: true,
    paths: [{ pts: [[0.93, -2.2, 0.05], [1.1, -2.4, 0.0], [1.25, -2.55, -0.02], SK([1.4, -2.95, -0.02], -0.025), SK([1.5, -3.5, 0.0], -0.025)], r: 0.0035 }],
  }, {
    origem: 'Ramo cutâneo lateral do 2º nervo intercostal (T2). Pode receber fibras de T1 e do cutâneo medial do braço.',
    trajeto: 'Perfura o 2º espaço intercostal na linha axilar média, cruza a axila e segue sobre a face medial do braço, onde se une ao nervo cutâneo medial do braço.',
    sensibilidade: 'Pele da axila e da face medial e posterior da parte superior do braço.',
    lesao: 'Pode ser seccionado ou lesado no esvaziamento axilar (câncer de mama): dormência e dor neuropática na axila e na face medial do braço. A dor cardíaca (angina, infarto) pode irradiar-se por este território, pois o coração e o dermátomo T2 compartilham segmentos medulares.',
    nota: 'Não inerva músculos. É o único ramo cutâneo lateral intercostal que chega ao membro superior.',
  }),
  nervo('n_cutaneo_medial_braco', 'Nervo cutâneo medial do braço (C8–T1)', 'N. cutaneus brachii medialis', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [BP.medCord, [1.36, -2.75, 0.0], SK([1.44, -3.3, 0.02], -0.025), SK([1.6, -4.1, 0.0], -0.025), SK([1.7, -4.6, -0.03], -0.025)], r: 0.004 }],
  }, {
    origem: 'Fascículo medial do plexo braquial (C8–T1).',
    trajeto: 'Desce medialmente à veia axilar e à artéria braquial, perfura a fáscia no meio do braço e se distribui na pele da face medial até o cotovelo, comunicando-se com o intercostobraquial.',
    sensibilidade: 'Pele da face medial do braço, da axila ao epicôndilo medial.',
    lesao: 'Dormência na face medial do braço, em geral com outros nervos do fascículo medial em lesões do plexo (Klumpke, C8–T1).',
    nota: 'Não inerva músculos.',
  }),
  nervo('n_cutaneo_medial_antebraco', 'Nervo cutâneo medial do antebraço (C8–T1)', 'N. cutaneus antebrachii medialis', 'membro_sup', {
    superficial: true,
    paths: [
      { pts: [BP.medCord, [1.38, -2.7, 0.05], SK([1.5, -3.5, 0.08], -0.025), SK([1.7, -4.3, 0.1], -0.025)], r: 0.0042 },
      // ramo anterior (veia basílica e face anteromedial do antebraço)
      { pts: [SK([1.7, -4.3, 0.1], -0.025), SK([1.86, -4.9, 0.2], -0.025), SK([2.05, -5.6, 0.3], -0.025), SK([2.2, -6.5, 0.36], -0.025), SK([2.3, -7.2, 0.42], -0.025)], r: 0.003 },
      // ramo posterior (face posteromedial)
      { pts: [SK([1.7, -4.3, 0.1], -0.025), SK([1.9, -4.95, -0.08], -0.025), SK([2.1, -5.8, -0.2], -0.025), SK([2.28, -6.7, -0.12], -0.025)], r: 0.003 },
    ],
  }, {
    origem: 'Fascículo medial do plexo braquial (C8–T1).',
    trajeto: 'Desce com a artéria braquial e a veia basílica, perfura a fáscia profunda no meio do braço e se divide em ramos anterior e posterior, que descem pela face medial do antebraço até o punho.',
    sensibilidade: 'Pele da face medial (ulnar) do antebraço, anterior e posterior.',
    lesao: 'Pode ser lesado em punções da veia basílica ou da mediana cubital: dormência da face medial do antebraço. Também se altera em lesões do plexo (C8–T1).',
    nota: 'Não inerva músculos. Pode ser lesado em cirurgia do cotovelo.',
  }),
  nervo('n_cutaneo_posterior_braco', 'Nervo cutâneo posterior do braço (radial)', 'N. cutaneus brachii posterior', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [[1.4, -2.7, -0.05], SK([1.55, -3.1, -0.28], -0.025), SK([1.74, -3.8, -0.32], -0.025), SK([1.9, -4.5, -0.3], -0.025)], r: 0.003 }],
  }, {
    origem: 'Nervo radial (C5–C8), na axila, antes de ele entrar no sulco do nervo radial.',
    trajeto: 'Sai do radial na axila, atravessa a cabeça longa do tríceps e se distribui na pele da face posterior do braço.',
    sensibilidade: 'Pele da face posterior do braço, da axila ao olécrano.',
    lesao: 'Poupado nas lesões do radial no sulco (fratura da diáfise do úmero), pois sai antes: a pele posterior do braço continua com sensibilidade. A perda indica lesão do radial na axila.',
    nota: 'Não inerva músculos. O sinal da pele posterior do braço ajuda a localizar o nível da lesão do radial.',
  }),
  nervo('n_cutaneo_lateral_inf_braco', 'Nervo cutâneo lateral inferior do braço (radial)', 'N. cutaneus brachii lateralis inferior', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [{ sec: 'umero', y: -3.85, at: 'post-lat', d: 0.035 }, SK([2.0, -4.05, -0.08], -0.025), SK([2.05, -4.5, 0.04], -0.025)], r: 0.003 }],
  }, {
    origem: 'Nervo radial (C5–C6), no sulco do nervo radial.',
    trajeto: 'Perfura a cabeça lateral do tríceps junto à inserção do deltoide e desce pela fáscia, chegando à pele da face lateral da parte inferior do braço.',
    sensibilidade: 'Pele da face lateral da metade inferior do braço.',
    lesao: 'Perde-se nas lesões do radial no sulco (fratura da diáfise do úmero): dormência na face lateral do braço, acima do cotovelo.',
    nota: 'Não inerva músculos.',
  }),
  nervo('n_cutaneo_posterior_antebraco', 'Nervo cutâneo posterior do antebraço (radial)', 'N. cutaneus antebrachii posterior', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [{ sec: 'umero', y: -3.85, at: 'post-lat', d: 0.035 }, SK([2.0, -4.2, -0.28], -0.025), SK([2.18, -5.2, -0.28], -0.025), SK([2.35, -6.1, -0.26], -0.025), SK([2.5, -6.95, -0.2], -0.025)], r: 0.0035 }],
  }, {
    origem: 'Nervo radial (C5–C8), no sulco do nervo radial.',
    trajeto: 'Perfura a cabeça lateral do tríceps, passa lateralmente ao olécrano e desce pela face posterior do antebraço, quase até o punho.',
    sensibilidade: 'Pele da face posterior do antebraço.',
    lesao: 'Perde-se nas lesões do radial no sulco (fratura do úmero); a pele posterior do antebraço fica dormente. É poupado nas lesões do ramo profundo (nervo interósseo posterior).',
    nota: 'Não inerva músculos.',
  }),
  nervo('n_cutaneo_lateral_sup_braco', 'Nervo cutâneo lateral superior do braço (axilar)', 'N. cutaneus brachii lateralis superior', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [[1.62, -2.63, -0.32], [1.8, -2.82, -0.4], SK([1.98, -2.9, -0.25], -0.03)], r: 0.004 }],
  }, {
    origem: 'Nervo axilar (C5–C6), ramo terminal sensitivo.',
    trajeto: 'Contorna a margem posterior do deltoide, perfura a fáscia e chega à pele da região deltóidea inferior.',
    sensibilidade: 'Pele sobre a parte inferior do deltoide (face lateral do ombro).',
    lesao: 'A perda de sensibilidade nesta área (“distintivo regimental”, sobre o deltoide) indica lesão do nervo axilar, por exemplo na luxação anterior do ombro ou na fratura do colo cirúrgico do úmero.',
    nota: 'Não inerva músculos. O sinal do “distintivo regimental” é uma boa forma de testar o axilar.',
  }),
  nervo('n_cutaneo_lateral_antebraco', 'Nervo cutâneo lateral do antebraço (musculocutâneo)', 'N. cutaneus antebrachii lateralis', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [{ sec: 'biceps_longa', y: -4.75, at: 'lat', d: 0.03 }, SK([2.42, -5.3, 0.1], -0.04), SK([2.6, -6.3, 0.2], -0.04), SK([2.68, -7.0, 0.35], -0.035)], r: 0.004 }],
  }, {
    origem: 'Continuação do nervo musculocutâneo (C5–C6), depois dos ramos para os músculos do braço.',
    trajeto: 'Emerge lateralmente ao tendão do bíceps, acima do cotovelo, perfura a fáscia profunda e desce junto à veia cefálica pela face anterolateral do antebraço, até o punho e a base do polegar.',
    sensibilidade: 'Pele da face lateral do antebraço.',
    lesao: 'Pode ser lesado em punções da veia cefálica ou da mediana cubital: dormência lateral do antebraço. Na lesão do musculocutâneo, a pele lateral do antebraço também fica dormente, com flexão do cotovelo fraca.',
    nota: 'Não inerva músculos. No punho, sobrepõe-se ao território do ramo superficial do radial.',
  }),
  nervo('n_radial_superficial', 'Ramo superficial do nervo radial', 'R. superficialis n. radialis', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [[2.3, -4.92, -0.02], { sec: 'braquiorradial', y: -5.5, at: 'med', d: 0.0 }, { between: ['braquiorradial', 'ecrl'], y: -6.2 }, SK([2.74, -6.85, 0.16], -0.04), SK([2.86, -7.5, 0.34], -0.03), SK([2.95, -7.78, 0.45], -0.03)], r: 0.0045 }],
  }, {
    origem: 'Ramo terminal sensitivo do nervo radial, que se separa à frente do epicôndilo lateral (C6–C7).',
    trajeto: 'Desce sob o braquiorradial, ao lado da artéria radial. No terço distal do antebraço passa para trás, sob o tendão do braquiorradial, perfura a fáscia e cruza a tabaqueira anatômica e os tendões do polegar, dividindo-se nos nervos digitais dorsais.',
    sensibilidade: 'Dorso da mão do lado radial e dorso do polegar, do indicador e da metade radial do médio, até a articulação interfalângica proximal (o limite com o ulnar varia: ver a nota).',
    lesao: 'Neurite de Wartenberg (“cheiralgia parestésica”): compressão sob o braquiorradial por pulseiras, relógios e algemas, com formigamento e queimação no dorso radial da mão, sem fraqueza. Pode ser lesado em punção da veia cefálica no punho.',
    nota: 'A pele do dorso do 1º espaço interósseo é a área autônoma do radial. As fontes divergem quanto ao limite com o ulnar: Moore atribui ao radial os 3½ dedos laterais e ao ulnar o 1½ medial; Netter e outros dividem em 2½ e 2½. Segue-se a divisão em 2½ e 2½. Não inerva músculos.',
  }),
  nervo('n_ramo_palmar_mediano', 'Ramo cutâneo palmar do nervo mediano', 'R. palmaris n. mediani', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [{ between: ['fcr', 'fds'], y: -6.9, w: 0.6 }, SK([2.62, -7.28, 0.55], -0.02), SK([2.7, -7.58, 0.62], -0.02), SK([2.78, -7.75, 0.7], -0.02)], r: 0.003 }],
  }, {
    origem: 'Nervo mediano, cerca de 5 a 7 cm acima do retináculo dos flexores.',
    trajeto: 'Corre entre os tendões do palmar longo e do flexor radial do carpo, passa sobre o retináculo dos flexores (fora do túnel do carpo) e chega à pele da região tenar e do centro da palma.',
    sensibilidade: 'Pele da eminência tenar e da parte central e lateral da palma.',
    lesao: 'É poupado na síndrome do túnel do carpo (passa por cima do retináculo): a palma não fica dormente. É lesado por incisões e por lesões do punho.',
    nota: 'Não inerva músculos. O dado de poupar a palma ajuda a diferenciar a compressão no túnel do carpo de uma lesão proximal do mediano.',
  }),
  nervo('n_ramo_palmar_ulnar', 'Ramo cutâneo palmar do nervo ulnar', 'R. palmaris n. ulnaris', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [{ sec: 'fcu_h', y: -6.5, at: 'lat', d: 0.03 }, SK([2.38, -7.2, 0.48], -0.02), SK([2.34, -7.5, 0.58], -0.02)], r: 0.003 }],
  }, {
    origem: 'Nervo ulnar, no terço distal do antebraço.',
    trajeto: 'Desce junto à artéria ulnar, sobre o retináculo dos flexores e o canal ulnar, e termina na pele da eminência hipotenar.',
    sensibilidade: 'Pele da eminência hipotenar e da parte medial da palma.',
    lesao: 'É poupado na compressão do nervo ulnar no canal de Guyon (sai antes), mas se perde em lesões altas do ulnar.',
    nota: 'Não inerva músculos. É pequeno e variável.',
  }),
  nervo('n_ramo_dorsal_ulnar', 'Ramo cutâneo dorsal do nervo ulnar', 'R. dorsalis n. ulnaris', 'membro_sup', {
    superficial: true,
    paths: [{ pts: [{ between: ['fcu_h', 'fdp'], y: -6.6 }, SK([2.22, -7.0, 0.1], -0.04), SK([2.25, -7.6, 0.3], -0.03)], r: 0.004 }],
  }, {
    origem: 'Nervo ulnar (C8), cerca de 5 cm acima do pisiforme.',
    trajeto: 'Passa sob o flexor ulnar do carpo, contorna a ulna e chega ao dorso da mão, onde se divide nos nervos digitais dorsais do mínimo, do anular e do médio (lado ulnar).',
    sensibilidade: 'Dorso da mão do lado ulnar e dorso dos dedos mínimo, anular e metade ulnar do médio, até a articulação interfalângica proximal (o limite com o radial varia: ver a ficha dos nervos digitais dorsais).',
    lesao: 'Poupado na lesão do ulnar no punho (sai antes do canal de Guyon), mas perdido na lesão alta (cotovelo): a dormência atinge o dorso ulnar da mão.',
    nota: 'Não inerva músculos. Distingue a lesão no punho da lesão no cotovelo.',
  }),
  nervo('n_digitais_palmares', 'Nervos digitais palmares (comuns e próprios)', 'Nn. digitales palmares communes et proprii', 'membro_sup', {
    superficial: true,
    paths: [
      // mediano: polegar, indicador, médio e metade radial do anular
      { pts: [[2.6, -7.58, 0.47], [2.78, -7.72, 0.6], SK([3.0, -7.85, 0.8], -0.03), SK([3.12, -8.0, 0.9], -0.025)], r: 0.0045 },
      { pts: [[2.6, -7.58, 0.47], [2.7, -7.85, 0.55], SK([2.92, -8.12, 0.75], -0.03), SK([3.0, -8.4, 0.82], -0.025), SK([3.03, -8.62, 1.0], -0.02)], r: 0.0045 },
      { pts: [[2.6, -7.58, 0.47], [2.65, -7.9, 0.54], SK([2.7, -8.2, 0.75], -0.03), SK([2.74, -8.45, 0.82], -0.025), SK([2.76, -8.7, 1.08], -0.02)], r: 0.0045 },
      { pts: [[2.6, -7.58, 0.47], [2.55, -7.9, 0.54], SK([2.52, -8.15, 0.75], -0.03), SK([2.52, -8.4, 0.82], -0.025), SK([2.5, -8.6, 1.0], -0.02)], r: 0.004 },
      // ulnar (ramo superficial): metade ulnar do anular e mínimo
      { pts: [[2.37, -7.62, 0.56], SK([2.43, -7.95, 0.72], -0.03), SK([2.45, -8.25, 0.78], -0.025), SK([2.47, -8.55, 0.98], -0.02)], r: 0.0042 },
      { pts: [[2.37, -7.62, 0.56], SK([2.3, -7.95, 0.72], -0.03), SK([2.25, -8.2, 0.75], -0.025), SK([2.23, -8.45, 0.95], -0.02)], r: 0.004 },
    ],
    ramos: [{ m: 'lumbricais', obs: '1º e 2º lumbricais, pelos nervos digitais comuns do mediano', path: 1 }],
  }, {
    origem: 'Nervo mediano (três nervos digitais palmares comuns, para os 1º, 2º e 3º espaços e o polegar) e ramo superficial do nervo ulnar (um comum, para o 4º espaço, e o próprio ulnar do mínimo).',
    trajeto: 'Os nervos digitais palmares comuns atravessam a palma sobre os lumbricais, junto aos arcos arteriais, e se dividem, à altura das cabeças dos metacarpais, em nervos digitais palmares próprios. Estes correm ao longo dos lados palmares dos dedos, ao lado das artérias, e terminam na polpa e no leito ungueal.',
    ramos: 'Mediano: polegar, indicador, médio e metade radial do anular; os dois primeiros nervos comuns dão ramos aos 1º e 2º lumbricais. Ulnar: mínimo e metade ulnar do anular.',
    sensibilidade: 'Face palmar dos 3½ dedos radiais (mediano) e dos 1½ ulnares (ulnar), incluindo a polpa e o leito ungueal e o dorso das falanges distais.',
    lesao: 'Lesões por corte (vidro, facas) são comuns e deixam um lado do dedo anestesiado; o neuroma do toco é doloroso. A sensibilidade da polpa depende de dois nervos digitais próprios por dedo (um de cada lado).',
    nota: 'O desenho mostra um nervo por dedo e é esquemático. Dos músculos, só os 1º e 2º lumbricais recebem ramos pelos digitais comuns do mediano; os demais lumbricais vêm do ramo profundo do ulnar.',
  }),
  nervo('n_digitais_dorsais', 'Nervos digitais dorsais', 'Nn. digitales dorsales', 'membro_sup', {
    superficial: true,
    paths: [
      // radial superficial: polegar, indicador e metade radial do médio
      { pts: [[2.95, -7.78, 0.45], SK([3.12, -7.85, 0.55], -0.02), SK([3.22, -8.0, 0.7], -0.02)], r: 0.0035 },
      { pts: [[2.95, -7.78, 0.45], SK([2.98, -8.05, 0.36], -0.02), SK([3.03, -8.4, 0.5], -0.02), SK([3.05, -8.6, 0.8], -0.02)], r: 0.0035 },
      { pts: [[2.95, -7.78, 0.45], SK([2.78, -8.05, 0.34], -0.02), SK([2.75, -8.38, 0.5], -0.02)], r: 0.003 },
      // ramo dorsal do ulnar: médio (lado ulnar), anular e mínimo
      { pts: [[2.25, -7.6, 0.3], SK([2.45, -7.95, 0.3], -0.02), SK([2.49, -8.3, 0.5], -0.02)], r: 0.003 },
      { pts: [[2.25, -7.6, 0.3], SK([2.28, -8.0, 0.34], -0.02), SK([2.27, -8.3, 0.5], -0.02)], r: 0.003 },
    ],
  }, {
    origem: 'Ramo superficial do nervo radial (polegar, indicador e metade radial do médio) e ramo dorsal do nervo ulnar (metade ulnar do médio, anular e mínimo).',
    trajeto: 'Correm ao longo dos lados dorsais dos dedos, até a falange média. A pele do dorso da falange distal e a polpa são inervadas pelos nervos digitais palmares próprios.',
    sensibilidade: 'Dorso dos dedos até a articulação interfalângica proximal (polegar: até a interfalângica).',
    lesao: 'Lesões do dorso da mão (cortes, cirurgia) deixam áreas de dormência no dorso dos dedos. Neurite do ramo superficial do radial: ver a ficha própria.',
    nota: 'Não inervam músculos. As fontes divergem quanto ao limite entre o radial e o ulnar no dorso (Moore: 3½ e 1½; Netter e outros: 2½ e 2½); segue-se a divisão em 2½ e 2½. O desenho é esquemático, de um nervo por dedo.',
  }),
];
