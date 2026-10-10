/**
 * Articulações e ligamentos do membro superior (F3.1 e F3.2).
 *
 * Articulação (`kind: 'articulacao'`):
 *   - `ossos`: estruturas ósseas do catálogo que se articulam (a guarda exige que existam e que a cápsula use só peças delas);
 *   - `ligamentos`: ids dos ligamentos próprios (fichas abaixo);
 *   - `movimentos`: [{ mov, amp?, agon: [músculos principais], sin?: [auxiliares], obs? }] — fonte única da ligação
 *     músculo ↔ articulação (o catálogo deriva o mapa `MOVEMENTS` e a linha “Movimentos e amplitude” da ficha);
 *   - `nervos`: nervos que dão ramos articulares (o catálogo os acrescenta aos `ramos` do nervo, sem desenhar ramo);
 *   - geometria: uma cápsula esquemática calculada na zona de contato entre os ossos (ver src/joint-geo.js).
 *
 * Amplitudes: valores de referência da AAOS (American Academy of Orthopaedic Surgeons), como reproduzidos em Norkin & White,
 * “Medida do movimento articular”; outras tabelas (Kapandji, Kendall, manuais de goniometria) diferem em alguns graus.
 * Músculos principais e auxiliares: Moore, Dalley & Agur, cap. 6 (Membro superior). Fichas: Moore; Gray's Anatomy (42ª ed.);
 * Terminologia Anatômica (FIPAT, 2019). Lado esquerdo (x > 0); o direito é espelhado.
 */
import { lig } from './catalog-other.js';

const R = 'membro_sup';
const MC = [1, 2, 3, 4, 5].map((k) => `metacarpal_${k}`);
const DEDO = { 1: 'polegar', 2: 'indicador', 3: 'medio', 4: 'anelar', 5: 'minimo' };
const CARPO = ['escafoide', 'semilunar', 'piramidal', 'pisiforme', 'trapezio', 'trapezoide', 'capitato', 'hamato'].map((n) => `carpo_${n}`);
const COSTELAS = [2, 3, 4, 5, 6, 7].map((k) => `costela_${k}`);

/** Cápsula na zona de contato entre as peças `a` e `b` (gap: distância máxima entre as superfícies, em unidades de 10 cm). */
const cap = (a, b, gap, o = {}) => ({ kind: 'capsule', a, b, gap, ...o });
/** Várias cápsulas numa malha só (articulações de vários dedos). */
const grupo = (of) => ({ kind: 'group', of });
/** Movimento: principais (agonistas) e auxiliares. */
const mv = (mov, amp, agon, sin = [], obs) => ({ mov, amp, agon, sin, obs });
/** Ponto na superfície da peça mais próximo de p (ver nerve-geo.js). */
const on = (part, p, d = 0) => ({ on: part, p, d });

const FONTES_ART = [
  'Moore, Dalley & Agur — Anatomia orientada para a clínica, cap. 6 (Membro superior)',
  "Gray's Anatomy, 42ª ed.",
  'Amplitudes: AAOS, em Norkin & White — Medida do movimento articular',
];

const art = (id, name, latin, region, proc, d, extra = {}) => ({
  kind: 'articulacao',
  id,
  name,
  latin,
  layer: 'articulacao',
  region,
  proc: [proc],
  ossos: d.ossos,
  ligamentos: d.ligamentos ?? [],
  movimentos: d.movimentos ?? [],
  nervos: d.nervos ?? [],
  campos: [
    ['Tipo', d.tipo],
    ['Superfícies articulares', d.superficies],
    ['Cápsula e membrana sinovial', d.capsula],
    ['Ligamentos', d.ligs],
    ['Inervação', d.inervacao],
    ['Irrigação', d.irrigacao],
  ],
  nota: d.nota,
  fontes: d.fontes ?? FONTES_ART,
  ...extra,
});

/* ═════════════ Articulações ═════════════ */

export const JOINTS = [
  art('art_esternoclavicular', 'Articulação esternoclavicular', 'Articulatio sternoclavicularis', [R, 'tronco'],
    cap(['clavicula'], ['esterno_manubrio', 'cartilagem_costal_1'], 0.04), {
      ossos: ['o_clavicula', 'o_esterno', 'o_cartilagens_costais'],
      ligamentos: ['lig_esternoclaviculares', 'lig_interclavicular', 'lig_costoclavicular'],
      tipo: 'Sinovial selar, com disco articular que a divide em dois compartimentos; na prática funciona como esferoidal (três eixos).',
      superficies: 'Extremidade esternal da clavícula, a incisura clavicular do manúbrio e a 1ª cartilagem costal, revestidas por fibrocartilagem.',
      capsula: 'Cápsula fibrosa reforçada pelos ligamentos esternoclaviculares. O disco articular prende-se à clavícula em cima e à 1ª cartilagem costal embaixo, o que impede a clavícula de deslizar para dentro sobre o esterno.',
      ligs: 'Esternoclaviculares anterior e posterior, interclavicular (une as duas clavículas por cima da incisura jugular) e costoclavicular (principal limitador da elevação).',
      movimentos: [
        mv('Elevação e abaixamento da clavícula', null, [], [], 'acompanham os movimentos da escápula (veja a articulação escapulotorácica)'),
        mv('Protração e retração', null, [], [], 'acompanham a escápula'),
        mv('Rotação em torno do eixo longo', null, [], [], 'ocorre na flexão e na abdução completas do braço'),
        mv('Abaixamento e fixação da clavícula', null, ['subclavio']),
      ],
      nervos: ['n_supraclaviculares', 'n_subclavio'],
      inervacao: 'Ramos do nervo supraclavicular medial e do nervo para o subclávio.',
      irrigacao: 'Artérias torácica interna e supraescapular.',
      nota: 'É a única articulação entre o membro superior e o esqueleto axial. É tão firme que um trauma costuma fraturar a clavícula antes de luxá-la; a luxação posterior, rara, ameaça os grandes vasos e a traqueia logo atrás. Na elevação completa do membro a clavícula sobe cerca de 60° (Moore).',
    }),
  art('art_acromioclavicular', 'Articulação acromioclavicular', 'Articulatio acromioclavicularis', R,
    cap(['clavicula'], ['escapula'], 0.04), {
      ossos: ['o_clavicula', 'o_escapula'],
      ligamentos: ['lig_acromioclavicular', 'lig_coracoclavicular'],
      tipo: 'Sinovial plana.',
      superficies: 'Extremidade acromial da clavícula e margem medial do acrômio, revestidas por fibrocartilagem; às vezes há um disco articular incompleto, em cunha.',
      capsula: 'Cápsula frouxa, reforçada em cima pelo ligamento acromioclavicular e por fibras do trapézio.',
      ligs: 'Acromioclavicular (reforço da cápsula) e, à distância, o coracoclavicular (partes trapezóidea e conoide), que dá a maior parte da estabilidade: a escápula fica “pendurada” na clavícula por ele.',
      movimentos: [
        mv('Deslizamento e rotação do acrômio sobre a clavícula', null, [], [], 'nenhum músculo cruza só esta articulação: ela se move com a escápula'),
      ],
      nervos: ['n_supraclaviculares', 'n_peitoral_lateral', 'n_axilar'],
      inervacao: 'Nervos supraclavicular (lateral), peitoral lateral e axilar.',
      irrigacao: 'Artérias supraescapular e toracoacromial.',
      nota: 'A luxação acromioclavicular (“ombro separado”) vem de queda sobre o ombro. Se só os ligamentos acromioclaviculares rompem, a lesão é leve; se o coracoclavicular também rompe, a escápula desce e a extremidade da clavícula fica saliente.',
    }),
  art('art_escapulotoracica', 'Articulação escapulotorácica (funcional)', 'Junctura scapulothoracica (termo funcional, ausente da TA)', R,
    cap(['escapula'], COSTELAS, 0.3, { one: true, flat: 0.04 }), {
      ossos: ['o_escapula', 'o_costelas_verdadeiras'],
      tipo: 'Não é uma articulação anatômica: não tem cartilagem nem cápsula. É o plano em que a escápula desliza sobre a parede do tórax (Moore a chama de articulação fisiológica).',
      superficies: 'Face costal da escápula sobre as costelas 2 a 7, separadas pelo subescapular, pelo serrátil anterior e por tecido conjuntivo frouxo.',
      capsula: 'Não tem. No modelo, o disco translúcido marca só o espaço de deslizamento.',
      ligs: 'Nenhum próprio; a escápula fica presa ao tronco pela clavícula (articulações acromioclavicular e esternoclavicular) e pelos músculos.',
      movimentos: [
        mv('Elevação', null, ['trapezio_desc', 'levantador_escapula'], ['rombo_maior', 'rombo_menor']),
        mv('Abaixamento', null, ['peitoral_menor', 'trapezio_asc'], ['grande_dorsal'], 'o latíssimo do dorso age pelo úmero'),
        mv('Protração', null, ['serratil_anterior'], ['peitoral_menor']),
        mv('Retração', null, ['trapezio_transv', 'rombo_maior', 'rombo_menor'], ['grande_dorsal']),
        mv('Rotação superior (a cavidade glenoidal vira para cima)', '≈ 60° na elevação completa do braço', ['trapezio_desc', 'trapezio_asc', 'serratil_anterior']),
        mv('Rotação inferior', null, ['levantador_escapula', 'rombo_maior', 'rombo_menor'], ['peitoral_menor', 'grande_dorsal']),
      ],
      inervacao: 'Não tem inervação articular própria (não há cápsula).',
      irrigacao: 'Não se aplica (não há cápsula).',
      nota: 'Ritmo escapuloumeral: dos 180° de elevação do braço, cerca de 120° ocorrem no ombro (glenoumeral) e 60° na rotação da escápula, uma proporção de aproximadamente 2:1. A paralisia do serrátil anterior (nervo torácico longo) faz a escápula “alada”.',
    }),
  art('art_ombro', 'Articulação do ombro (glenoumeral)', 'Articulatio humeri (glenohumeralis)', R,
    cap(['umero'], ['escapula'], 0.06, { pad: 0.05 }), {
      ossos: ['o_umero', 'o_escapula'],
      ligamentos: ['lig_glenoumerais', 'lig_coracoumeral', 'lig_coracoacromial'],
      tipo: 'Sinovial esferoidal (multiaxial). É a articulação mais móvel do corpo e, por isso, a menos estável.',
      superficies: 'Cabeça do úmero, grande e arredondada, e cavidade glenoidal da escápula, rasa: recebe pouco mais de um terço da cabeça. O lábio glenoidal, um anel de fibrocartilagem, aprofunda a cavidade.',
      capsula: 'Frouxa: vai da margem da cavidade glenoidal ao colo anatômico do úmero e forma embaixo o recesso axilar, que se desfaz na abdução. Tem uma abertura para o tendão da cabeça longa do bíceps, que atravessa a articulação envolvido por bainha sinovial, e outra para a bolsa subtendínea do subescapular.',
      ligs: 'Glenoumerais superior, médio e inferior (espessamentos anteriores da cápsula), coracoumeral e transverso do úmero; por cima, o arco coracoacromial (acrômio, ligamento coracoacromial e processo coracoide) impede a cabeça de subir.',
      movimentos: [
        mv('Flexão', '0–180°', ['delt_clav', 'peitoral_clav'], ['coracobraquial', 'biceps_curta', 'biceps_longa']),
        mv('Extensão', '0–60°', ['delt_esp', 'grande_dorsal'], ['redondo_maior', 'triceps_longa'], 'outras tabelas (ex.: Kendall) trazem 45°'),
        mv('Abdução', '0–180°', ['delt_acro', 'supraespinal'], [], 'acima de cerca de 90° depende da rotação superior da escápula e da rotação lateral do úmero'),
        mv('Adução', null, ['peitoral_esternocostal', 'grande_dorsal'], ['redondo_maior', 'triceps_longa', 'peitoral_abdominal', 'coracobraquial'], 'volta à posição anatômica; além dela, só com o braço levemente fletido'),
        mv('Rotação medial', '0–70°', ['subescapular', 'peitoral_esternocostal', 'grande_dorsal'], ['redondo_maior', 'delt_clav']),
        mv('Rotação lateral', '0–90°', ['infraespinal', 'redondo_menor'], ['delt_esp']),
      ],
      nervos: ['n_supraescapular', 'n_axilar', 'n_peitoral_lateral'],
      inervacao: 'Nervos supraescapular, axilar e peitoral lateral.',
      irrigacao: 'Artérias circunflexas anterior e posterior do úmero e ramos da artéria supraescapular.',
      nota: 'A estabilidade vem sobretudo dos músculos do manguito rotador (supraespinal, infraespinal, redondo menor e subescapular), que mantêm a cabeça na cavidade. A luxação mais comum é a anterior (anteroinferior), em que a cabeça sai por baixo, onde a cápsula não é reforçada; pode estirar o nervo axilar.',
    }),
  art('art_cotovelo', 'Articulação do cotovelo', 'Articulatio cubiti', R,
    cap(['umero'], ['ulna', 'radio'], 0.06, { pad: 0.04 }), {
      ossos: ['o_umero', 'o_ulna', 'o_radio'],
      ligamentos: ['lig_colateral_ulnar', 'lig_colateral_radial'],
      tipo: 'Sinovial composta, em gínglimo (dobradiça): umeroulnar (gínglimo) e umerorradial, dentro da mesma cápsula que a radiulnar proximal.',
      superficies: 'Tróclea e capítulo do úmero, que se articulam com a incisura troclear da ulna e com a fóvea da cabeça do rádio.',
      capsula: 'Fina na frente e atrás, onde sobe acima das fossas coronóidea e do olécrano; reforçada dos lados pelos ligamentos colaterais. Envolve também a radiulnar proximal.',
      ligs: 'Colateral ulnar (feixes anterior, o mais forte, posterior e oblíquo; do epicôndilo medial ao processo coronoide e ao olécrano) e colateral radial (do epicôndilo lateral ao ligamento anular do rádio).',
      movimentos: [
        mv('Flexão', '0–150°', ['braquial', 'biceps_longa', 'biceps_curta'], ['braquiorradial', 'pronador_redondo_h']),
        mv('Extensão', '0°', ['triceps_longa', 'triceps_lateral', 'triceps_medial'], ['anconeo'], 'é o retorno da flexão; alguns graus de hiperextensão são comuns'),
      ],
      nervos: ['n_musculocutaneo', 'n_radial', 'n_ulnar'],
      inervacao: 'Ramos dos nervos musculocutâneo, radial e ulnar (algumas fontes acrescentam o mediano).',
      irrigacao: 'Rede articular do cotovelo, formada pelas artérias colaterais (ramos das artérias braquial e braquial profunda) e recorrentes (ramos das artérias radial, ulnar e interóssea).',
      nota: 'Em extensão, o antebraço fica levemente desviado para fora (ângulo de carregamento), mais acentuado nas mulheres. Na luxação posterior, típica de queda com a mão espalmada, o nervo ulnar pode ser lesado.',
    }),
  art('art_radiulnar_proximal', 'Articulação radiulnar proximal', 'Articulatio radioulnaris proximalis', R,
    cap(['radio'], ['ulna'], 0.05, { y: [-5.6, -4.5] }), {
      ossos: ['o_radio', 'o_ulna'],
      ligamentos: ['lig_anular_radio'],
      tipo: 'Sinovial trocoide (pivô), uniaxial.',
      superficies: 'Circunferência articular da cabeça do rádio, que gira na incisura radial da ulna e dentro do ligamento anular.',
      capsula: 'Compartilha a cápsula do cotovelo; a membrana sinovial reveste a face interna do ligamento anular.',
      ligs: 'Anular do rádio, que com a incisura radial forma um anel em volta da cabeça; ligamento quadrado, do colo do rádio à ulna, logo abaixo.',
      movimentos: [
        mv('Pronação', '0–80°', ['pronador_quadrado'], ['pronador_redondo_h', 'pronador_redondo_u'], 'o pronador redondo entra na pronação rápida ou contra resistência'),
        mv('Supinação', '0–80°', ['supinador', 'biceps_longa', 'biceps_curta'], [], 'o supinador basta sem resistência; o bíceps entra na supinação rápida ou forte, com o cotovelo fletido'),
      ],
      nervos: ['n_musculocutaneo', 'n_mediano', 'n_radial'],
      inervacao: 'Ramos dos nervos musculocutâneo, mediano e radial.',
      irrigacao: 'Parte radial da rede articular do cotovelo (artérias colateral radial e recorrente radial).',
      nota: 'Pronação dolorosa (“cotovelo puxado”): em crianças pequenas puxadas pela mão, a cabeça do rádio escorrega parcialmente para fora do ligamento anular. Pronação e supinação ocorrem ao mesmo tempo nas radiulnares proximal e distal.',
    }),
  art('art_radiulnar_distal', 'Articulação radiulnar distal', 'Articulatio radioulnaris distalis', R,
    cap(['radio'], ['ulna'], 0.05, { y: [-7.4, -6.8] }), {
      ossos: ['o_radio', 'o_ulna'],
      tipo: 'Sinovial trocoide (pivô), uniaxial.',
      superficies: 'Cabeça da ulna e incisura ulnar do rádio. O disco articular (fibrocartilagem triangular) separa a cabeça da ulna dos ossos do carpo.',
      capsula: 'Frouxa; a membrana sinovial sobe entre o rádio e a ulna, formando o recesso sacciforme.',
      ligs: 'Radiulnares anterior e posterior, fracos; a principal união é o disco articular, que vai da margem medial do rádio à base do processo estiloide da ulna.',
      movimentos: [
        mv('Pronação', '0–80°', ['pronador_quadrado'], ['pronador_redondo_h', 'pronador_redondo_u'], 'o rádio gira em torno da cabeça da ulna, levando a mão'),
        mv('Supinação', '0–80°', ['supinador', 'biceps_longa', 'biceps_curta']),
      ],
      nervos: ['n_interosseo_anterior', 'n_interosseo_posterior'],
      inervacao: 'Nervos interósseos anterior (do mediano) e posterior (do radial).',
      irrigacao: 'Artérias interósseas anterior e posterior.',
      nota: 'O disco articular faz parte do complexo fibrocartilagíneo triangular, cuja lesão em quedas causa dor no lado ulnar do punho.',
    }),
  art('art_radiocarpal', 'Articulação radiocarpal (do punho)', 'Articulatio radiocarpalis', R,
    cap(['radio'], ['carpo_escafoide', 'carpo_semilunar', 'carpo_piramidal'], 0.05), {
      ossos: ['o_radio', 'o_carpo'],
      ligamentos: ['lig_radiocarpais', 'lig_colaterais_carpo'],
      tipo: 'Sinovial elipsóidea (condilar), biaxial.',
      superficies: 'Extremidade distal do rádio e disco articular, de um lado; escafoide, semilunar e piramidal (fileira proximal do carpo), do outro. A ulna não toca o carpo.',
      capsula: 'Envolve a articulação e é reforçada pelos ligamentos radiocarpais e colaterais; a membrana sinovial forma várias pregas.',
      ligs: 'Radiocarpais palmar (mais forte) e dorsal; colaterais radial (do processo estiloide do rádio ao escafoide) e ulnar do carpo (do processo estiloide da ulna ao piramidal).',
      movimentos: [
        mv('Flexão', '0–80°', ['fcr', 'fcu_h', 'fcu_u'], ['palmar_longo', 'fds', 'fdp'], 'soma-se ao movimento da articulação mediocarpal'),
        mv('Extensão', '0–70°', ['ecrl', 'ecrb', 'ecu'], ['ed', 'extensor_indicador', 'edm']),
        mv('Abdução (desvio radial)', '0–20°', ['fcr', 'ecrl', 'ecrb'], ['apl']),
        mv('Adução (desvio ulnar)', '0–30°', ['fcu_h', 'fcu_u', 'ecu']),
      ],
      nervos: ['n_interosseo_anterior', 'n_interosseo_posterior', 'n_ramo_dorsal_ulnar', 'n_ulnar_profundo'],
      inervacao: 'Nervos interósseo anterior (mediano) e interósseo posterior (radial) e ramos dorsal e profundo do nervo ulnar.',
      irrigacao: 'Redes carpais palmar e dorsal.',
      nota: 'Os ligamentos palmares fazem a mão acompanhar o rádio na supinação. Queda sobre a mão espalmada fratura o escafoide ou a extremidade distal do rádio (fratura de Colles).',
    }),
  art('art_intercarpais', 'Articulações intercarpais e mediocarpal', 'Articulationes intercarpales; articulatio mediocarpalis', R,
    cap(CARPO.slice(0, 4), CARPO.slice(4), 0.03), {
      ossos: ['o_carpo'],
      tipo: 'Sinoviais planas entre os ossos de cada fileira; a mediocarpal, entre as duas fileiras, é composta, com a cavidade em forma de S.',
      superficies: 'Faces vizinhas dos ossos do carpo. Na mediocarpal, escafoide, semilunar e piramidal se articulam com trapézio, trapezoide, capitato e hamato; a cabeça do capitato e o hamato encaixam-se na concavidade da fileira proximal. O pisiforme articula-se à parte, sobre o piramidal.',
      capsula: 'Uma cavidade sinovial comum às intercarpais e à mediocarpal, que costuma se comunicar com as carpometacarpais do 2º ao 5º dedo; a do pisiforme é separada.',
      ligs: 'Intercarpais palmares, dorsais e interósseos (entre ossos da mesma fileira); pisoamato e pisometacarpal, que continuam o tendão do flexor ulnar do carpo.',
      movimentos: [
        mv('Pequenos deslizamentos entre os ossos', null, [], [], 'somam-se à flexão, à extensão e aos desvios do punho; os músculos são os da articulação radiocarpal'),
      ],
      nervos: ['n_interosseo_anterior', 'n_interosseo_posterior', 'n_ramo_dorsal_ulnar', 'n_ulnar_profundo'],
      inervacao: 'Os mesmos nervos da radiocarpal: interósseos anterior e posterior e ramos dorsal e profundo do ulnar.',
      irrigacao: 'Redes carpais palmar e dorsal.',
      nota: 'A lesão do ligamento entre escafoide e semilunar desestabiliza o carpo. Na luxação do semilunar, ele é empurrado para a frente e pode comprimir o nervo mediano no túnel do carpo.',
    }),
  art('art_cmc_polegar', 'Articulação carpometacarpal do polegar', 'Articulatio carpometacarpalis pollicis', R,
    cap(['carpo_trapezio'], ['metacarpal_1'], 0.04), {
      ossos: ['o_carpo', 'o_metacarpais'],
      tipo: 'Sinovial selar, biaxial; a forma de sela e a cápsula frouxa permitem uma rotação que, somada à flexão e à abdução, produz a oposição.',
      superficies: 'Trapézio e base do 1º metacarpal, ambos em forma de sela.',
      capsula: 'Frouxa e independente, sem comunicação com as demais carpometacarpais.',
      ligs: 'Ligamentos próprios que reforçam a cápsula (radial, oblíquos e intermetacarpal); a nomenclatura deles varia entre os autores.',
      movimentos: [
        mv('Flexão', '0–15°', ['flexor_polegar_curto'], ['fpl', 'oponente_polegar'], 'no plano da palma'),
        mv('Extensão', '0–20°', ['epl', 'epb'], ['apl']),
        mv('Abdução', '0–70°', ['apl', 'abdutor_polegar_curto'], [], 'perpendicular à palma'),
        mv('Adução', null, ['adutor_polegar_obliquo', 'adutor_polegar_transverso']),
        mv('Oposição', 'polpa do polegar até a do dedo mínimo', ['oponente_polegar'], ['abdutor_polegar_curto', 'flexor_polegar_curto']),
      ],
      inervacao: 'Ramos articulares dos nervos vizinhos (mediano, radial e ulnar); o padrão exato varia e não é detalhado aqui.',
      irrigacao: 'Ramos das redes carpais e do arco palmar profundo.',
      nota: 'É sede frequente de artrose (rizartrose), que dói na base do polegar ao fazer pinça. A fratura-luxação da base do 1º metacarpal é a fratura de Bennett.',
    }),
  art('art_carpometacarpais', 'Articulações carpometacarpais (2º ao 5º dedo)', 'Articulationes carpometacarpales II–V', R,
    cap(['carpo_trapezio', 'carpo_trapezoide', 'carpo_capitato', 'carpo_hamato'], MC.slice(1), 0.04), {
      ossos: ['o_carpo', 'o_metacarpais'],
      tipo: 'Sinoviais planas; a do 5º dedo (hamato e 5º metacarpal) tem forma de sela e é a mais móvel. Entre as bases dos metacarpais ficam as intermetacarpais, também planas.',
      superficies: 'Trapézio, trapezoide, capitato e hamato com as bases do 2º ao 5º metacarpal.',
      capsula: 'Cavidade sinovial em geral comum com as intercarpais.',
      ligs: 'Carpometacarpais dorsais e palmares; intermetacarpais dorsais, palmares e interósseos entre as bases.',
      movimentos: [
        mv('Flexão e rotação do 4º e sobretudo do 5º metacarpal', null, ['oponente_minimo'], [], 'fecham a mão em concha; o 2º e o 3º quase não se movem'),
      ],
      inervacao: 'Ramos articulares dos nervos vizinhos (mediano, radial e ulnar); o padrão exato varia e não é detalhado aqui.',
      irrigacao: 'Ramos das redes carpais e do arco palmar profundo.',
      nota: 'O 2º e o 3º metacarpais formam o eixo fixo da mão; nas bases deles se inserem os extensores radiais longo e curto do carpo.',
    }),
  art('art_metacarpofalangicas', 'Articulações metacarpofalângicas', 'Articulationes metacarpophalangeae', R,
    grupo([1, 2, 3, 4, 5].map((k) => cap([MC[k - 1]], [`falange_proximal_${DEDO[k]}`], 0.04))), {
      ossos: ['o_metacarpais', 'o_falanges_mao'],
      ligamentos: ['lig_colaterais_dedos', 'lig_metacarpal_transverso_profundo'],
      tipo: 'Sinoviais elipsóideas (condilares), biaxiais, do 2º ao 5º dedo; a do polegar se comporta como gínglimo.',
      superficies: 'Cabeças dos metacarpais e bases côncavas das falanges proximais.',
      capsula: 'Reforçada dos lados pelos ligamentos colaterais e na face palmar pela placa palmar; no dorso, o capuz extensor cobre a cápsula.',
      ligs: 'Colaterais (frouxos em extensão e tensos em flexão: por isso os dedos não se afastam com a mão fechada), placa palmar e ligamento metacarpal transverso profundo, que une as placas do 2º ao 5º dedo.',
      movimentos: [
        mv('Flexão (dedos 2 a 5)', '0–90°', ['lumbricais', 'interosseos_dorsais', 'interosseos_palmares'], ['fds', 'fdp', 'flexor_minimo_curto']),
        mv('Extensão e hiperextensão (dedos 2 a 5)', '0–45°', ['ed'], ['extensor_indicador', 'edm']),
        mv('Abdução (afastar do 3º dedo)', null, ['interosseos_dorsais', 'abdutor_minimo']),
        mv('Adução (aproximar do 3º dedo)', null, ['interosseos_palmares']),
        mv('Flexão do polegar', '0–50°', ['flexor_polegar_curto', 'fpl']),
        mv('Extensão do polegar', null, ['epb'], ['epl']),
      ],
      nervos: ['n_digitais_palmares'],
      inervacao: 'Nervos digitais, ramos do mediano e do ulnar.',
      irrigacao: 'Artérias digitais, do arco palmar superficial.',
      nota: 'Fraturas e cirurgias da mão são imobilizadas com as metacarpofalângicas fletidas, com os colaterais esticados; imobilizadas em extensão, elas tendem a enrijecer.',
    }),
  art('art_interfalangicas', 'Articulações interfalângicas da mão', 'Articulationes interphalangeae manus', R,
    grupo([
      cap(['falange_proximal_polegar'], ['falange_distal_polegar'], 0.04),
      ...[2, 3, 4, 5].flatMap((k) => [
        cap([`falange_proximal_${DEDO[k]}`], [`falange_media_${DEDO[k]}`], 0.04),
        cap([`falange_media_${DEDO[k]}`], [`falange_distal_${DEDO[k]}`], 0.04),
      ]),
    ]), {
      ossos: ['o_falanges_mao'],
      ligamentos: ['lig_colaterais_dedos'],
      tipo: 'Gínglimos (uniaxiais): proximais e distais do 2º ao 5º dedo e uma só no polegar.',
      superficies: 'Cabeças das falanges proximais e médias, em forma de polia, e bases das falanges seguintes.',
      capsula: 'Como nas metacarpofalângicas, reforçada pelos colaterais e pela placa palmar.',
      ligs: 'Colaterais e placa palmar.',
      movimentos: [
        mv('Flexão das interfalângicas proximais', '0–100°', ['fds'], ['fdp']),
        mv('Flexão das interfalângicas distais', '0–90°', ['fdp']),
        mv('Extensão das interfalângicas', null, ['lumbricais', 'interosseos_dorsais', 'interosseos_palmares'], ['ed', 'extensor_indicador', 'edm'], 'pela expansão extensora; na distal, alguns graus de hiperextensão'),
        mv('Flexão do polegar', '0–80°', ['fpl']),
        mv('Extensão do polegar', null, ['epl']),
      ],
      nervos: ['n_digitais_palmares'],
      inervacao: 'Nervos digitais, ramos do mediano e do ulnar.',
      irrigacao: 'Artérias digitais.',
      nota: '“Dedo em martelo”: a ruptura do tendão extensor na base da falange distal deixa a interfalângica distal caída. “Deformidade em botoeira”: a ruptura da banda central sobre a interfalângica proximal deixa-a fletida e a distal estendida.',
    }),
];

/* ═════════════ Ligamentos ═════════════ */

const L = (id, name, latin, proc, d, extra = {}) => lig(id, name, latin, { proc }, d, { region: R, ...extra });
const band = (pts, width = 0.05, thick = 0.016, o = {}) => ({ kind: 'tube', pts, ref: o.ref ?? [0, 0, 1], width, thick, taper: 'blunt', nf: o.nf ?? 14, nc: 8 });

export const JOINT_LIGAMENTS = [
  L('lig_esternoclaviculares', 'Ligamentos esternoclaviculares anterior e posterior', 'Ligg. sternoclavicularia anterius et posterius', [
    band([on('clavicula', [0.21, -2.12, 0.66], 0.01), on('esterno_manubrio', [0.14, -2.25, 0.72], 0.01)], 0.07, 0.014),
    band([on('clavicula', [0.1, -2.16, 0.3], 0.012), on('esterno_manubrio', [0.11, -2.32, 0.3], 0.012)], 0.07, 0.014),
  ], {
    origem: 'Extremidade esternal da clavícula, nas faces anterior e posterior.',
    insercao: 'Manúbrio do esterno, em volta da incisura clavicular.',
    funcao: 'Reforçam a cápsula da articulação esternoclavicular na frente e atrás.',
    relacoes: 'Na frente, a origem do esternocleidomastóideo; atrás, os músculos esterno-hióideo e esternotireóideo e a veia braquiocefálica.',
  }),
  L('lig_interclavicular', 'Ligamento interclavicular', 'Lig. interclaviculare', [
    // por cima da incisura jugular, de uma clavícula à outra (pontos medidos: topo da extremidade esternal e margem do manúbrio)
    band([[0.15, -1.995, 0.49], [0.07, -2.06, 0.5], [0, -2.08, 0.5], [-0.07, -2.06, 0.5], [-0.15, -1.995, 0.49]], 0.035, 0.016, { ref: [0, 1, 0], nf: 20 }),
  ], {
    origem: 'Extremidade esternal de uma clavícula.',
    insercao: 'Extremidade esternal da clavícula oposta, prendendo-se no caminho à margem superior do manúbrio (incisura jugular).',
    funcao: 'Reforça em cima a cápsula das duas articulações esternoclaviculares.',
    relacoes: 'Fica no fundo da incisura jugular, palpável acima do manúbrio.',
  }, { paired: false }),
  L('lig_costoclavicular', 'Ligamento costoclavicular', 'Lig. costoclaviculare', [
    band([on('costela_1', [0.465, -2.18, 0.43]), on('clavicula', [0.47, -2.1, 0.46])], 0.07, 0.03),
  ], {
    origem: '1ª costela e sua cartilagem costal.',
    insercao: 'Impressão do ligamento costoclavicular, na face inferior da extremidade esternal da clavícula.',
    funcao: 'Prende a clavícula à 1ª costela e é o principal limitador da elevação da clavícula; serve de fulcro aos movimentos da articulação esternoclavicular.',
    relacoes: 'Lateralmente a ele fica o músculo subclávio.',
  }),
  L('lig_acromioclavicular', 'Ligamento acromioclavicular', 'Lig. acromioclaviculare', [
    band([on('clavicula', [1.37, -1.77, -0.17], 0.012), on('clavicula', [1.44, -1.77, -0.2], 0.015), on('escapula', [1.5, -1.8, -0.25], 0.012)], 0.06, 0.014, { ref: [0, 1, 0] }),
  ], {
    origem: 'Face superior da extremidade acromial da clavícula.',
    insercao: 'Face superior do acrômio, junto à articulação.',
    funcao: 'Reforça em cima a cápsula da articulação acromioclavicular e limita o deslocamento horizontal da clavícula sobre o acrômio.',
    relacoes: 'Recebe fibras do trapézio e do deltoide, que o reforçam.',
  }),
  L('lig_coracoclavicular', 'Ligamento coracoclavicular (trapezóideo e conoide)', 'Lig. coracoclaviculare (lig. trapezoideum et lig. conoideum)', [
    band([on('escapula', [1.19, -1.98, -0.1]), on('clavicula', [1.13, -1.9, -0.17])], 0.035, 0.03),
    band([on('escapula', [1.28, -2.0, 0.0]), on('clavicula', [1.28, -1.91, -0.08])], 0.06, 0.02),
  ], {
    origem: 'Processo coracoide da escápula: a parte conoide na base, a trapezóidea na face superior.',
    insercao: 'Tubérculo conoide e linha trapezóidea, na face inferior do terço lateral da clavícula.',
    funcao: 'Suspende a escápula da clavícula e é o principal estabilizador vertical da articulação acromioclavicular; transmite à clavícula as forças que chegam do membro.',
    relacoes: 'Entre as duas partes costuma haver uma bolsa; o músculo subclávio fica medialmente.',
    nota: 'Na luxação acromioclavicular grave ele se rompe e a escápula cai em relação à clavícula.',
  }),
  L('lig_coracoacromial', 'Ligamento coracoacromial', 'Lig. coracoacromiale', [
    band([on('escapula', [1.37, -2.06, 0.06]), on('escapula', [1.47, -1.98, 0.02], 0.02), on('escapula', [1.57, -1.9, -0.07])], 0.08, 0.014, { ref: [0, 1, 0] }),
  ], {
    origem: 'Margem lateral do processo coracoide.',
    insercao: 'Ápice do acrômio.',
    funcao: 'Com o acrômio e o processo coracoide forma o arco coracoacromial, um teto que impede a cabeça do úmero de subir.',
    relacoes: 'Por baixo dele passam a bolsa subacromial e o tendão do supraespinal.',
    nota: 'O atrito do tendão do supraespinal sob o arco (síndrome do impacto) causa dor ao elevar o braço entre cerca de 60° e 120°.',
  }),
  L('lig_coracoumeral', 'Ligamento coracoumeral', 'Lig. coracohumerale', [
    band([on('escapula', [1.36, -2.03, 0.0]), on('umero', [1.6, -2.0, 0.0], 0.02), on('umero', [1.75, -2.04, 0.02])], 0.06, 0.016, { ref: [0, 1, 0] }),
  ], {
    origem: 'Margem lateral da base do processo coracoide.',
    insercao: 'Colo anatômico do úmero, junto ao tubérculo maior (e, em parte, ao menor).',
    funcao: 'Reforça a parte superior da cápsula do ombro e ajuda a sustentar a cabeça do úmero com o braço pendente.',
    relacoes: 'Ocupa o intervalo dos rotadores, entre os tendões do supraespinal e do subescapular.',
  }),
  L('lig_glenoumerais', 'Ligamentos glenoumerais (superior, médio e inferior)', 'Ligg. glenohumeralia', [
    // por cima da face anterior da cabeça (a cápsula a envolve), da margem da cavidade glenoidal ao colo anatômico
    band([on('escapula', [1.39, -2.07, -0.06], 0.01), on('umero', [1.5, -2.08, 0.1], 0.03), on('umero', [1.62, -2.1, 0.14], 0.012)], 0.035, 0.012),
    band([on('escapula', [1.37, -2.2, -0.04], 0.01), on('umero', [1.48, -2.2, 0.12], 0.035), on('umero', [1.6, -2.22, 0.14], 0.012)], 0.04, 0.012),
    band([on('escapula', [1.41, -2.38, -0.06], 0.01), on('umero', [1.48, -2.4, 0.06], 0.03), on('umero', [1.56, -2.4, 0.06], 0.012)], 0.05, 0.014),
  ], {
    origem: 'Margem anterior da cavidade glenoidal e lábio glenoidal; o superior, junto ao tubérculo supraglenoidal.',
    insercao: 'Colo anatômico do úmero: o superior e o médio perto do tubérculo menor, o inferior na parte inferior do colo.',
    funcao: 'Espessamentos da face anterior da cápsula; o inferior é o principal freio da luxação anterior com o braço abduzido e em rotação lateral.',
    relacoes: 'Só são vistos por dentro da articulação (artroscopia); o tendão do subescapular passa à frente deles.',
    nota: 'Desenhados como faixas sobre a frente da cabeça do úmero; na realidade são espessamentos da própria cápsula, visíveis só por dentro.',
  }),
  L('lig_colateral_ulnar', 'Ligamento colateral ulnar (do cotovelo)', 'Lig. collaterale ulnare', [
    band([on('umero', [1.72, -4.86, -0.12], 0.012), on('ulna', [1.86, -5.0, -0.08], 0.03), on('ulna', [1.95, -5.11, -0.08], 0.01)], 0.05, 0.016, { ref: [1, 0, 0] }),
    band([on('umero', [1.72, -4.87, -0.2], 0.012), on('ulna', [1.88, -4.93, -0.3], 0.025), on('ulna', [1.95, -4.96, -0.36], 0.01)], 0.045, 0.016, { ref: [1, 0, 0] }),
    band([on('ulna', [1.98, -4.97, -0.31]), on('ulna', [1.95, -5.06, -0.2], 0.012), on('ulna', [1.99, -5.11, -0.1])], 0.03, 0.012, { ref: [1, 0, 0] }),
  ], {
    origem: 'Epicôndilo medial do úmero.',
    insercao: 'Processo coronoide (feixe anterior) e olécrano (feixe posterior) da ulna; o feixe oblíquo une os dois.',
    funcao: 'Estabiliza o cotovelo contra forças em valgo (que abrem o lado medial); o feixe anterior, o mais forte, fica tenso em toda a amplitude.',
    relacoes: 'O nervo ulnar passa logo atrás, no sulco do nervo ulnar.',
    nota: 'Lesão típica de arremessadores: a reconstrução cirúrgica ficou conhecida como cirurgia de Tommy John.',
  }),
  L('lig_colateral_radial', 'Ligamento colateral radial (do cotovelo)', 'Lig. collaterale radiale', [
    band([on('umero', [2.42, -4.82, -0.2]), [2.44, -4.95, -0.16], [2.43, -5.04, -0.12]], 0.05, 0.016, { ref: [1, 0, 0] }),
  ], {
    origem: 'Epicôndilo lateral do úmero.',
    insercao: 'Funde-se ao ligamento anular do rádio (sem se prender ao rádio, que precisa girar).',
    funcao: 'Estabiliza o lado lateral do cotovelo contra forças em varo.',
    relacoes: 'Coberto pela origem comum dos músculos extensores do antebraço.',
  }),
  L('lig_anular_radio', 'Ligamento anular do rádio', 'Lig. anulare radii', [
    { kind: 'torus', c: [2.3, -5.075, -0.126], axis: [-0.23, 0.9, -0.35], R: 0.15, rb: 0.012, rn: 0.035, nf: 40, nc: 8 },
  ], {
    origem: 'Margem anterior da incisura radial da ulna.',
    insercao: 'Margem posterior da incisura radial da ulna.',
    funcao: 'Com a incisura forma um anel que envolve a cabeça do rádio e a mantém junto da ulna enquanto ela gira (pronação e supinação).',
    relacoes: 'Recebe o ligamento colateral radial; é revestido por dentro pela membrana sinovial.',
    nota: 'Desenhado como anel completo; na realidade cobre cerca de quatro quintos da volta e a incisura radial da ulna fecha o resto.',
  }),
  L('lig_membrana_interossea', 'Membrana interóssea do antebraço', 'Membrana interossea antebrachii', [
    { kind: 'web', a: 'radio', b: 'ulna', y: [-6.85, -5.4], n: 28, inset: 0.025 },
  ], {
    origem: 'Margem interóssea do rádio.',
    insercao: 'Margem interóssea da ulna; a maior parte das fibras desce obliquamente do rádio para a ulna.',
    funcao: 'Une os dois ossos (sindesmose) e transmite à ulna parte da carga que a mão passa ao rádio; dá origem a músculos profundos do antebraço.',
    relacoes: 'À frente correm a artéria e o nervo interósseos anteriores; atrás, os posteriores.',
  }),
  L('lig_radiocarpais', 'Ligamentos radiocarpais palmar e dorsal', 'Ligg. radiocarpalia palmare et dorsale', [
    band([on('radio', [2.6, -7.2, 0.44]), on('carpo_semilunar', [2.46, -7.33, 0.42], 0.006), on('carpo_capitato', [2.53, -7.42, 0.42])], 0.07, 0.014),
    band([on('radio', [2.66, -7.24, 0.15], 0.008), on('carpo_semilunar', [2.48, -7.32, 0.2], 0.014), on('carpo_piramidal', [2.38, -7.4, 0.26], 0.008)], 0.06, 0.012),
  ], {
    origem: 'Margens palmar e dorsal da extremidade distal do rádio.',
    insercao: 'Ossos da fileira proximal do carpo (escafoide, semilunar e piramidal); fibras palmares chegam ao capitato.',
    funcao: 'Reforçam a cápsula do punho. Os palmares, mais fortes e oblíquos, fazem a mão acompanhar o rádio na supinação.',
    relacoes: 'Os palmares formam o assoalho do túnel do carpo, sob os tendões flexores e o nervo mediano.',
  }),
  L('lig_colaterais_carpo', 'Ligamentos colaterais radial e ulnar do carpo', 'Ligg. collaterale carpi radiale et ulnare', [
    band([on('radio', [2.84, -7.27, 0.34], 0.012), on('carpo_escafoide', [2.79, -7.31, 0.39], 0.01)], 0.04, 0.016, { ref: [1, 0, 0] }),
    band([on('ulna', [2.3, -7.29, 0.28], 0.012), on('carpo_piramidal', [2.26, -7.36, 0.34], 0.014), on('carpo_piramidal', [2.27, -7.41, 0.38], 0.01)], 0.04, 0.016, { ref: [1, 0, 0] }),
  ], {
    origem: 'Processo estiloide do rádio (colateral radial) e processo estiloide da ulna (colateral ulnar).',
    insercao: 'Escafoide (radial); piramidal e pisiforme (ulnar).',
    funcao: 'Reforçam os lados da cápsula do punho; o radial limita a adução (desvio ulnar) e o ulnar, a abdução (desvio radial).',
    relacoes: 'A artéria radial cruza perto do colateral radial, no assoalho da tabaqueira anatômica.',
  }),
  L('lig_colaterais_dedos', 'Ligamentos colaterais das articulações dos dedos', 'Ligg. collateralia articulationum metacarpophalangearum et interphalangearum manus', [
    grupo([
      ...[1, 2, 3, 4, 5].map((k) => ({ kind: 'collateral', a: MC[k - 1], b: `falange_proximal_${DEDO[k]}`, gap: 0.04, lat: k === 1 ? [0, 0, 1] : [1, 0, 0] })),
      { kind: 'collateral', a: 'falange_proximal_polegar', b: 'falange_distal_polegar', gap: 0.04, lat: [0, 0, 1] },
      ...[2, 3, 4, 5].flatMap((k) => [
        { kind: 'collateral', a: `falange_proximal_${DEDO[k]}`, b: `falange_media_${DEDO[k]}`, gap: 0.04, lat: [1, 0, 0] },
        { kind: 'collateral', a: `falange_media_${DEDO[k]}`, b: `falange_distal_${DEDO[k]}`, gap: 0.04, lat: [1, 0, 0] },
      ]),
    ]),
  ], {
    origem: 'Tubérculos dos lados das cabeças dos metacarpais e das falanges proximais e médias.',
    insercao: 'Lados das bases das falanges seguintes e placa palmar.',
    funcao: 'Estabilizam os dedos contra desvios laterais. Nas metacarpofalângicas ficam frouxos em extensão (os dedos se afastam) e tensos em flexão.',
    relacoes: 'No dorso, a expansão extensora; na face palmar, as bainhas dos tendões flexores.',
    nota: '“Polegar do esquiador” (ou do goleiro): ruptura do colateral ulnar da metacarpofalângica do polegar, que enfraquece a pinça. Desenho esquemático: cada ligamento é uma faixa entre as duas peças.',
  }),
  L('lig_metacarpal_transverso_profundo', 'Ligamento metacarpal transverso profundo', 'Lig. metacarpale transversum profundum', [
    // na face palmar das cabeças (pontos medidos nas cabeças do 2º ao 5º metacarpal, levados para a frente da superfície)
    band([2, 3, 4, 5].map((k, i) => on(MC[k - 1], [[2.85, -8.13], [2.68, -8.12], [2.5, -8.08], [2.34, -8.02]][i].concat(0.75), 0.014)), 0.035, 0.014, { ref: [0, 0, 1], nf: 24 }),
  ], {
    origem: 'Placa palmar da metacarpofalângica do 2º dedo.',
    insercao: 'Placa palmar da metacarpofalângica do 5º dedo, unindo no caminho as do 3º e do 4º.',
    funcao: 'Mantém juntas as cabeças dos metacarpais do 2º ao 5º dedo.',
    relacoes: 'Os lumbricais passam à frente dele e os interósseos, atrás.',
  }),
];
