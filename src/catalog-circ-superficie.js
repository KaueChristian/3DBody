/**
 * Anatomia de superfície do coração (F5.2): projeção do coração na parede do tórax e focos de ausculta, desenhados sobre a pele a partir
 * dos pontos medidos nas cartilagens costais e no esterno do atlas (as pontas esternais das cartilagens 2 a 7 e o ápice do ventrículo
 * esquerdo). **São esquemas**: o contorno é o clássico de livro-texto, ajustado a este corpo, e não o de um coração vivo. Textos próprios, a
 * partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.).
 */

const T = 'tronco';
const FONTES = ['Moore, Dalley & Agur — Anatomia orientada para a clínica, 8ª ed.', "Gray's Anatomy, 42ª ed."];

/** Ponto sobre a pele do tórax, à frente de (x, y). */
const sk = (x, y) => ({ skin: true, p: [x, y, 1.9], d: 0 });
const tubo = (pts, w, o = {}) => ({ kind: 'tube', pts, width: w, thick: o.thick ?? w, nf: o.nf ?? 28, nc: 8, taper: o.taper ?? 'blunt', ref: [0, 0, 1] });
/** Botão pequeno (elipsoide) apoiado na pele, no ponto (x, y). */
const foco = (x, y) => tubo([{ skin: true, p: [x, y, 1.9], d: 0, add: [0, 0, -0.02] }, { skin: true, p: [x, y, 1.9], d: 0, add: [0, 0, 0.1] }], 0.11, { thick: 0.11, nf: 10, taper: 'pointed' });

const base = { kind: 'estrutura', layer: 'coracao', region: T, paired: false, mat: 'artery', fontes: FONTES };

export const CIRC_SUPERFICIE = [
  {
    ...base,
    id: 'projecao_coracao',
    name: 'Projeção do coração na parede do tórax — esquema',
    latin: 'Projectio cordis in pariete thoracis',
    color: '#e8c24a',
    proc: [tubo([
      sk(0.22, -2.62), sk(-0.22, -2.78), sk(-0.32, -3.1), sk(-0.25, -3.5), sk(0.0, -3.6), sk(0.4, -3.65), sk(0.85, -3.62),
      sk(0.86, -3.3), sk(0.65, -2.95), sk(0.4, -2.68), sk(0.22, -2.62),
    ], 0.022, { nf: 60 })],
    campos: [
      ['Limite superior', 'Linha que vai da borda inferior da 2ª cartilagem costal esquerda, a cerca de 1 cm do esterno, à borda superior da 3ª cartilagem costal direita, também a cerca de 1 cm do esterno. Corresponde às grandes artérias que saem do coração.'],
      ['Limite direito', 'Curva convexa para a direita, da 3ª à 6ª cartilagem costal direita, de 1 a 2 cm do esterno; é formado pelo átrio direito.'],
      ['Limite inferior', 'Da 6ª cartilagem costal direita, a cerca de 1 cm do esterno, até o ápice, no 5º espaço intercostal esquerdo, a cerca de 9 cm da linha mediana (na linha hemiclavicular); é formado pelo ventrículo direito e, no ápice, pelo esquerdo.'],
      ['Limite esquerdo', 'Curva convexa do ápice à 2ª cartilagem costal esquerda, a cerca de 2 cm do esterno; é formado pelo ventrículo esquerdo e, no alto, pela aurícula esquerda.'],
    ],
    nota: 'ESQUEMA: o contorno é o de livro-texto (vivo, em posição anatômica e na expiração), traçado sobre a pele do atlas. O coração muda de posição com a respiração, a postura e o biótipo, e na criança o ápice fica mais alto. O ápice, no 5º espaço intercostal, é o ponto onde se palpa o impulso apical (choque da ponta). As distâncias ao esterno (de 1 a 2 cm) variam entre as fontes.',
    relacionados: ['ventriculo_esquerdo', 'atrio_direito', 'ventriculo_direito', 'atrio_esquerdo', 'focos_ausculta'],
  },
  {
    ...base,
    id: 'focos_ausculta',
    name: 'Focos de ausculta cardíaca — esquema',
    latin: 'Foci auscultationis cordis',
    color: '#ffd166',
    proc: [foco(-0.22, -2.68), foco(0.22, -2.68), foco(0.23, -2.92), foco(0.22, -3.38), foco(0.82, -3.62)],
    campos: [
      ['Aórtico', '2º espaço intercostal direito, junto ao esterno. Melhor foco para ouvir as bulhas da valva da aorta e os sopros da estenose aórtica (que se irradiam para o pescoço).'],
      ['Pulmonar', '2º espaço intercostal esquerdo, junto ao esterno. Melhor foco para a valva do tronco pulmonar e para o desdobramento da segunda bulha.'],
      ['Ponto de Erb', '3º espaço intercostal esquerdo, junto ao esterno. Foco acessório, útil para os sopros de insuficiência da valva da aorta e da valva pulmonar.'],
      ['Tricúspide', 'Borda esternal esquerda inferior, no 4º ou 5º espaço intercostal (perto do processo xifoide). Melhor foco para a valva tricúspide e para sopros do coração direito.'],
      ['Mitral', 'Ápice do coração, no 5º espaço intercostal esquerdo, na linha hemiclavicular. Melhor foco para a valva mitral e para os sopros da estenose e da insuficiência mitral (que se irradiam para a axila).'],
    ],
    nota: 'ESQUEMA: os cinco botões estão sobre a pele, nos pontos de livro-texto. Os focos não ficam sobre as valvas: cada um é o lugar onde o som de uma valva é mais claro, porque o som viaja pelo fluxo do sangue. A primeira bulha é o fechamento das valvas mitral e tricúspide, e a segunda, o das valvas da aorta e do tronco pulmonar.',
    relacionados: ['valva_aortica', 'valva_pulmonar', 'valva_tricuspide', 'valva_mitral', 'projecao_coracao'],
  },
];
