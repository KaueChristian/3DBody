/**
 * Medula espinal, raízes, gânglios espinais, nervos espinais e cauda equina (F2.13), de forma esquemática.
 *
 * Geometria: o eixo do canal vertebral foi medido no modelo (altura do corpo de cada vértebra e posição do centro
 * do canal, entre a margem posterior do corpo e a face interna da lâmina). A medula é a linha desse eixo com raio
 * variável (intumescências cervical e lombossacral, cone medular). Cada segmento medular dá raízes (anterior e posterior,
 * juntas no desenho) que descem obliquamente no canal até o forame intervertebral de saída, onde estão o gânglio espinal
 * e o início do nervo espinal. Como a medula é mais curta que o canal, as raízes lombares e sacrais ficam longas e
 * formam a cauda equina.
 *
 * Fontes: Moore, Dalley & Agur (8ª ed.); Gray's Anatomy (42ª ed.); Netter (7ª ed.); Terminologia Anatômica (2019).
 * A correspondência entre segmento medular e vértebra varia entre as fontes (e entre as pessoas): aqui segue a regra
 * clássica (cervicais ≈ vértebra −1; torácicas superiores −2; inferiores −3; lombares em T10–T12; sacrais em L1).
 */
import { nervo, foramen } from './catalog-nerves.js';

/** Eixo do canal vertebral (x = 0): [y, z] do centro do canal, do forame magno ao hiato sacral. */
const CANAL = [
  [-0.52, -0.24], [-0.76, -0.25], [-0.968, -0.245], [-1.127, -0.205], [-1.283, -0.16], [-1.441, -0.17], [-1.601, -0.215],
  [-1.771, -0.26], [-1.961, -0.333], [-2.17, -0.428], [-2.391, -0.52], [-2.628, -0.57], [-2.882, -0.605], [-3.147, -0.61],
  [-3.412, -0.575], [-3.668, -0.53], [-3.938, -0.47], [-4.219, -0.4], [-4.54, -0.34], [-4.836, -0.25], [-5.11, -0.18],
  [-5.44, -0.18], [-5.775, -0.24], [-6.097, -0.34], [-6.4, -0.5], [-6.6, -0.66], [-6.9, -0.8], [-7.3, -0.77], [-7.5, -0.72],
];
/** z do eixo do canal numa altura y (interpolação linear). */
function canalZ(y) {
  for (let i = 0; i < CANAL.length - 1; i++) {
    const [y0, z0] = CANAL[i];
    const [y1, z1] = CANAL[i + 1];
    if (y <= y0 && y >= y1) return z0 + ((z1 - z0) * (y - y0)) / (y1 - y0);
  }
  return CANAL[y > CANAL[0][0] ? 0 : CANAL.length - 1][1];
}

/** Raio da medula (x 10 cm): [y, raio]. Intumescência cervical (C4–T1), lombossacral (T9–L1) e cone medular. */
const RAIO = [
  [-0.52, 0.05], [-0.76, 0.047], [-0.968, 0.046], [-1.127, 0.05], [-1.283, 0.056], [-1.441, 0.058], [-1.601, 0.056],
  [-1.771, 0.05], [-1.961, 0.042], [-2.17, 0.04], [-2.628, 0.039], [-3.147, 0.039], [-3.668, 0.041], [-3.938, 0.044],
  [-4.219, 0.049], [-4.54, 0.05], [-4.7, 0.048], [-4.82, 0.04], [-4.9, 0.026], [-4.96, 0.013], [-5.0, 0.006],
];

const medulaPaths = RAIO.slice(0, -1).map(([y, r], i) => {
  const [y1, r1] = RAIO[i + 1];
  const ym = (y + y1) / 2;
  return { pts: [[0, y, canalZ(y)], [0, ym, canalZ(ym)], [0, y1, canalZ(y1)]], r, r1 };
});
// filo terminal: continuação fina (pia-máter) do cone ao cóccix
const FILO = [-5.0, -5.4, -5.9, -6.4, -6.9, -7.3, -7.55];
const filoPath = { pts: FILO.map((y) => [0, y, canalZ(y)]), r: 0.0045, r1: 0.0035 };

/** Altura (y) da emergência das raízes de cada segmento na medula, pela regra clássica (ver o cabeçalho). */
const SEG_Y = {
  C1: -0.6, C2: -0.7, C3: -0.85, C4: -1.0, C5: -1.15, C6: -1.3, C7: -1.45, C8: -1.55,
  T1: -1.7, T2: -1.85, T3: -2.0, T4: -2.17, T5: -2.35, T6: -2.55, T7: -2.78, T8: -3.0, T9: -3.25, T10: -3.5, T11: -3.72, T12: -3.94,
  L1: -4.05, L2: -4.17, L3: -4.28, L4: -4.4, L5: -4.5, S1: -4.62, S2: -4.7, S3: -4.78, S4: -4.84, S5: -4.89, Co1: -4.93,
};
/** Saída: forame intervertebral (C1–L5) ou forame sacral anterior (S1–S4) / hiato sacral (S5, Co1). Lado esquerdo. */
const EXIT = {
  C1: [0.11, -0.6, -0.27], C2: [0.17, -0.74, -0.29],
  S1: [0.2, -6.46, -0.22], S2: [0.17, -6.66, -0.6], S3: [0.14, -6.84, -0.7], S4: [0.12, -6.98, -0.7],
  S5: [0.08, -7.35, -0.78], Co1: [0.06, -7.47, -0.74],
};
const exitPoint = (n) => EXIT[n] ?? foramen(n);

/** Trajetos de um segmento: raízes (da medula ao forame), gânglio espinal e início do nervo espinal. `parts` escolhe o que desenhar. */
function segmento(n, { raiz = true, gangl = true } = {}) {
  const out = [];
  const [fx, fy, fz] = exitPoint(n);
  const ys = SEG_Y[n];
  const tail = [fx, fy, fz];
  if (raiz) {
    const start = [0.04, ys, canalZ(ys)];
    // desce junto à medula e à linha média do canal e só no fim se afasta para o forame: raízes longas ficam paralelas
    const midY = ys + (fy - ys) * 0.7;
    const mid = [Math.min(0.09, fx * 0.5), midY, canalZ(midY)];
    out.push({ pts: [start, mid, [fx - 0.035, fy, fz]], r: 0.0032 });
  }
  if (gangl) {
    out.push({ pts: [[fx - 0.035, fy, fz], [fx + 0.015, fy - 0.005, fz]], r: 0.0105 });
    // início do nervo espinal (ramos anterior e posterior saem logo adiante)
    out.push({ pts: [[fx + 0.015, fy - 0.005, fz], [fx + 0.06, fy - 0.025, fz + 0.01]], r: 0.0065 });
  }
  return out;
}

const seg = (ids, o) => ids.flatMap((n) => segmento(n, o));
const C = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
const T = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);
const L = ['L1', 'L2', 'L3', 'L4', 'L5'];
const S = ['S1', 'S2', 'S3', 'S4', 'S5', 'Co1'];

/** Raízes de L2 a Co1 (cauda equina): da medula ao ponto de saída, sem gânglio. */
const caudaPaths = [...L.slice(1), ...S].flatMap((n) => segmento(n, { gangl: false }));

export const NERVES_SPINAL = [
  nervo('medula_espinal', 'Medula espinal', 'Medulla spinalis', ['cabeca', 'tronco'], {
    paths: [...medulaPaths, filoPath],
    labelAt: 0.35,
  }, {
    origem: 'Continua o bulbo (medula oblonga) ao nível do forame magno.',
    trajeto: 'Desce no canal vertebral, envolvida pelas meninges, até o cone medular, que no adulto termina entre L1 e L2 (varia de T12 a L3; no recém-nascido chega a L3). Daí o filo terminal, continuação da pia-máter, desce até o cóccix e ancora a medula. Tem duas intumescências: a cervical (C4–T1, de onde sai o plexo braquial) e a lombossacral (segmentos L1–S3, na altura das vértebras T9–T12, origem do plexo lombossacral). Em corte, a substância cinzenta tem a forma de H: cornos anteriores (motoneurônios), posteriores (sensibilidade) e laterais (T1–L2 e S2–S4: neurônios autônomos), cercada pela substância branca.',
    ramos: '31 pares de nervos espinais (8 cervicais, 12 torácicos, 5 lombares, 5 sacrais e 1 coccígeo). Cada um nasce da união de uma raiz anterior (motora) e uma posterior (sensitiva, com o gânglio espinal).',
    sensibilidade: 'Conduz as vias ascendentes (tato, dor, temperatura e propriocepção) e as descendentes (corticoespinal e outras). Os reflexos espinais (patelar, bicipital) fecham-se na própria medula.',
    lesao: 'Lesão completa: paralisia e perda da sensibilidade abaixo do nível (tetraplegia acima de T1, paraplegia abaixo), com choque medular no início. Hemissecção (Brown-Séquard): paralisia e perda da propriocepção do mesmo lado e perda de dor e temperatura do lado oposto. Lesão do cone (L1–L2): disfunção esfincteriana precoce.',
    nota: 'A medula é mais curta que o canal vertebral (cresce menos que a coluna): o nível da medula e o da vértebra não coincidem, e a diferença aumenta embaixo. Por isso a punção lombar e a raquianestesia são feitas abaixo de L2–L3, onde há só as raízes (a cauda equina). Representação esquemática: o modelo não tem as meninges nem a substância cinzenta, e o raio da medula é indicativo. A passagem do bulbo à medula, em geral na altura do atlas, não é marcada.',
  }, { kind: 'estrutura' }),
  nervo('n_espinais_cervicais', 'Nervos espinais cervicais (C1–C8)', 'Nn. spinales cervicales', ['cabeca', 'tronco'], {
    paths: seg(C),
    labelAt: 0.3,
  }, {
    origem: 'Raízes anterior (motora) e posterior (sensitiva, com o gânglio espinal) de cada segmento cervical da medula, unidas no forame intervertebral.',
    trajeto: 'C1 sai entre o occipital e o atlas e C2 entre o atlas e o áxis; de C3 a C7 saem acima da vértebra de mesmo número; C8 sai abaixo de C7 (há 8 nervos cervicais para 7 vértebras). Ao sair, cada nervo se divide em ramo posterior e ramo anterior. Os ramos anteriores de C1–C4 formam o plexo cervical e os de C5–T1, o plexo braquial. As raízes seguem para baixo no canal, porque cada segmento medular está uma vértebra acima do forame de saída.',
    ramos: 'Ramos posteriores: suboccipital (C1), occipital maior (C2) e ramos posteriores dos demais, para os músculos próprios do dorso e para a pele. Ramos anteriores: plexo cervical (C1–C4, com o frênico) e plexo braquial (C5–T1).',
    sensibilidade: 'Pele da nuca, do pescoço, do ombro e do membro superior (dermátomos C2 a T1; C1 em geral não tem dermátomo).',
    lesao: 'Radiculopatia cervical (hérnia de disco ou osteófitos): dor irradiada, parestesia no dermátomo, fraqueza do miótomo e reflexo diminuído. Mais frequente em C6 e C7 (discos C5–C6 e C6–C7). Reflexo bicipital C5–C6, estilorradial C5–C6 e tricipital C7. Lesão completa da medula acima de C4: perda da respiração espontânea (frênico, C3–C5).',
    nota: 'Os raios e a posição dos gânglios são indicativos. Os ramos para os músculos e a pele têm fichas próprias (plexos cervical e braquial, ramos posteriores). O ponto de saída de C1 e C2 foi estimado: o forame de C2 fica atrás da articulação atlantoaxial lateral.',
  }),
  nervo('n_espinais_toracicos', 'Nervos espinais torácicos (T1–T12)', 'Nn. spinales thoracici', ['tronco'], {
    paths: seg(T),
    labelAt: 0.3,
  }, {
    origem: 'Raízes anterior e posterior dos segmentos torácicos da medula, unidas no forame intervertebral. De T1 a L2, o corno lateral da substância cinzenta tem os neurônios pré-ganglionares simpáticos.',
    trajeto: 'Saem abaixo da vértebra de mesmo número. Os ramos anteriores formam os nervos intercostais (T1–T11) e o nervo subcostal (T12); T1 contribui também para o plexo braquial. Os ramos comunicantes brancos levam as fibras pré-ganglionares simpáticas ao tronco simpático. As raízes descem muito no canal (cada segmento medular fica 2 a 3 vértebras acima do forame de saída).',
    ramos: 'Ramos posteriores (músculos próprios do dorso e pele) e anteriores (nervos intercostais e subcostal, ver fichas próprias). Ramos comunicantes brancos (T1–L2) e cinzentos.',
    sensibilidade: 'Pele do tórax e do abdome em faixas (dermátomos T2–T12; T4 no mamilo, T10 no umbigo), pleura e peritônio parietais.',
    lesao: 'O herpes-zóster segue o dermátomo (cinturão de vesículas). A compressão medular torácica dá nível sensitivo em faixa e paraplegia espástica. A dor visceral é referida em dermátomos torácicos (infarto em T1–T4).',
    nota: 'Os pontos de saída seguem os forames intervertebrais medidos no modelo. As fichas dos intercostais mostram a continuação dos ramos anteriores.',
  }),
  nervo('n_espinais_lombares', 'Nervos espinais lombares (L1–L5)', 'Nn. spinales lumbales', ['tronco'], {
    // as raízes de L2 a L5 pertencem à cauda equina (ficha própria): aqui só o gânglio e o início de cada nervo
    paths: [...segmento('L1'), ...L.slice(1).flatMap((n) => segmento(n, { raiz: false }))],
    labelAt: 0.3,
  }, {
    origem: 'Raízes anterior e posterior dos segmentos lombares da medula, unidas no forame intervertebral. Os segmentos L1–L5 ficam atrás dos corpos de T10 a T12.',
    trajeto: 'Saem abaixo da vértebra de mesmo número. As raízes de L2 a L5 descem muito no canal, dentro do saco dural, como parte da cauda equina. Os ramos anteriores formam o plexo lombar (L1–L4, no psoas maior) e, com L4–L5, o tronco lombossacral para o plexo sacral. Os ramos posteriores inervam os músculos próprios do dorso e a pele da região lombar e da nádega.',
    ramos: 'Plexo lombar (ílio-hipogástrico, ilioinguinal, genitofemoral, cutâneo femoral lateral, femoral e obturatório) e tronco lombossacral. Ramos posteriores com fichas próprias.',
    sensibilidade: 'Pele da região lombar, da parte anterior da coxa e da perna (dermátomos L1 a L5; L4 na face medial da perna, L5 no dorso do pé).',
    lesao: 'Radiculopatia lombar (hérnia de disco, em geral L4–L5 e L5–S1, que comprime a raiz que passa por baixo do disco): ciática, dormência no dermátomo e fraqueza do miótomo (L4: extensão do joelho; L5: dorsiflexão do pé e do hálux). Reflexo patelar: L3–L4.',
    nota: 'Os ramos do plexo lombar que vão aos membros inferiores ficam para a etapa dos membros inferiores. Aqui só o gânglio e o início de cada nervo.',
  }),
  nervo('n_espinais_sacrais', 'Nervos espinais sacrais e coccígeo (S1–S5 e Co1)', 'Nn. spinales sacrales et n. coccygeus', ['tronco'], {
    paths: seg(S, { raiz: false }),
    labelAt: 0.3,
  }, {
    origem: 'Raízes anterior e posterior dos segmentos sacrais e coccígeo da medula (atrás de L1), unidas nos forames sacrais.',
    trajeto: 'S1 a S4 saem pelos forames sacrais, os ramos anteriores pelos forames anteriores (pélvicos) e os posteriores pelos posteriores; S5 e o nervo coccígeo saem pelo hiato sacral. Os ramos anteriores de L4 a S4 formam o plexo sacral (ciático, pudendo, glúteos) e os de S4 a Co1, o plexo coccígeo. De S2 a S4 saem também as fibras parassimpáticas pélvicas (nervos esplâncnicos pélvicos).',
    ramos: 'Plexo sacral (ciático, glúteos superior e inferior, pudendo e outros) e plexo coccígeo (nervo anococcígeo). Os nervos do assoalho pélvico e do períneo (levantador do ânus, pudendo) já têm fichas.',
    sensibilidade: 'Pele da face posterior da coxa e da perna, do pé (S1 na borda lateral), do períneo e da região anal (S2–S5, “anestesia em sela”).',
    lesao: 'A lesão de S2–S4 (cone medular, cauda equina ou sacro) causa disfunção da bexiga, do intestino e sexual, e anestesia em sela. Reflexo aquileu: S1–S2. Fratura do sacro com lesão das raízes: incontinência.',
    nota: 'O sacro do modelo é uma peça maciça: os forames são aproximados e os trajetos dentro dele são intraósseos por construção. O ponto de saída dos nervos S1–S4 foi estimado na face anterior.',
  }),
  nervo('cauda_equina', 'Cauda equina e filo terminal', 'Cauda equina; Filum terminale', ['tronco'], {
    paths: [...caudaPaths, filoPath],
    labelAt: 0.5,
  }, {
    origem: 'Raízes anteriores e posteriores dos segmentos L2 a Co1, que emergem do cone medular, e o filo terminal.',
    trajeto: 'Descem no canal vertebral, dentro do saco dural, banhadas pelo líquor (cisterna lombar), até os seus forames de saída: as lombares pelos forames intervertebrais, as sacrais pelos forames sacrais e o hiato sacral. O saco dural termina em geral em S2; o filo terminal, que atravessa o saco dural, continua como filo terminal externo e se fixa no cóccix. Nesta região do canal só há raízes e líquor, e não a medula.',
    ramos: 'Raízes anteriores (motoras) e posteriores (sensitivas) de L2 a Co1, que se unem aos gânglios espinais nos forames de saída (ver as fichas dos nervos espinais lombares e sacrais).',
    sensibilidade: 'As raízes posteriores levam a sensibilidade da pele e da musculatura dos membros inferiores, do períneo e das vísceras pélvicas.',
    lesao: 'Síndrome da cauda equina (hérnia de disco volumosa, tumor, hematoma, fratura): dor lombar e ciática de um ou dos dois lados, anestesia em sela, retenção ou incontinência urinária e fecal, fraqueza dos membros inferiores com arreflexia. É emergência cirúrgica.',
    nota: 'O nome vem do latim: “rabo de cavalo”. Como as raízes flutuam no líquor, são empurradas pela agulha em vez de perfuradas: por isso a punção lombar e a raquianestesia são feitas abaixo do cone (L3–L4 ou L4–L5). Os raios são indicativos, e o número de raízes foi simplificado (uma por segmento).',
  }),
];
