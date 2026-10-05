/**
 * Nervos. Cada nervo tem:
 *   - textos (origem, trajeto, ramos, sensibilidade, lesão);
 *   - `ramos`: músculos (ou estruturas) que inerva — é a fonte única da ligação músculo ↔ nervo do atlas.
 *     { m: id, obs?: texto, sens?: true (só sensitivo/proprioceptivo), path?: índice do trajeto, t?: [t0, t1],
 *       semRamo?: true (a malha real já chega ao músculo) };
 *   - geometria: `parts` (malhas reais do BodyParts3D, só na órbita) e/ou `paths` (trajetos procedurais).
 * Pontos dos trajetos: ver src/nerve-geo.js. Lado esquerdo (x > 0); o direito é espelhado.
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.);
 * Netter — Atlas de anatomia humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 */

const nervo = (id, name, latin, region, geom, d, extra = {}) => ({
  kind: 'nervo',
  layer: 'nervo',
  id,
  name,
  latin,
  region,
  ...geom,
  campos: [
    ['Origem', d.origem],
    ['Trajeto', d.trajeto],
    ['Ramos', d.ramos],
    ['Sensibilidade', d.sensibilidade],
    ['Lesão', d.lesao],
  ].filter(([, v]) => v),
  nota: d.nota,
  ...extra,
});

/* ───────── pontos usados por vários nervos ───────── */
const SK = (p, d) => ({ skin: true, p, d });
/** Raio de `from` na direção `dir` até a primeira superfície de `id`; d > 0 recua em direção à origem. */
const CAST = (id, from, dir, d) => ({ cast: id, from, dir, d });

// discos intervertebrais (altura y e margem posterior z), medidos no modelo
const DISC = {
  C2: [-0.884, -0.157], C3: [-1.053, -0.125], C4: [-1.201, -0.111], C5: [-1.364, -0.099], C6: [-1.518, -0.11], C7: [-1.683, -0.151],
  T1: [-1.859, -0.2], T2: [-2.063, -0.296], T3: [-2.277, -0.389], T4: [-2.504, -0.48], T5: [-2.753, -0.514], T6: [-3.011, -0.543],
  T7: [-3.284, -0.512], T8: [-3.539, -0.469], T9: [-3.798, -0.424], T10: [-4.077, -0.35], T11: [-4.361, -0.287], T12: [-4.72, -0.22],
  L1: [-4.952, -0.103], L2: [-5.267, -0.071], L3: [-5.613, -0.103], L4: [-5.937, -0.193], L5: [-6.257, -0.313],
};
/** Forame intervertebral de saída do nervo espinal `n` (C3–C8 saem acima da vértebra de mesmo número; T e L, abaixo). */
function foramen(n) {
  const key = { C3: 'C2', C4: 'C3', C5: 'C4', C6: 'C5', C7: 'C6', C8: 'C7' }[n] ?? n;
  const [y, z] = DISC[key];
  const x = n[0] === 'L' ? 0.23 : n[0] === 'C' ? 0.19 : 0.18;
  return [x, y + 0.02, z - 0.02];
}

// forame mentual (face externa do corpo da mandíbula, abaixo do 2º pré-molar)
const MENTUAL = CAST('mandibula', [0.6, -0.88, 1.15], [-0.33, 0, -0.43], 0.0);

// sulco costal (borda inferior interna) de cada costela, de trás para a frente — medido nas malhas
const RIB = {
  1: [[0.141, -1.766, -0.066], [0.236, -1.766, -0.095], [0.397, -1.807, -0.087], [0.408, -1.846, -0.035], [0.592, -1.907, 0.001], [0.64, -1.988, 0.078], [0.66, -2.052, 0.159], [0.627, -2.12, 0.26], [0.585, -2.19, 0.345], [0.515, -2.242, 0.423]],
  2: [[0.153, -1.901, -0.145], [0.361, -1.889, -0.231], [0.456, -1.905, -0.21], [0.549, -1.938, -0.17], [0.713, -2.007, -0.151], [0.814, -2.087, -0.059], [0.927, -2.187, 0.046], [0.88, -2.28, 0.17], [0.846, -2.348, 0.29], [0.76, -2.45, 0.43], [0.661, -2.534, 0.572], [0.55, -2.58, 0.67], [0.463, -2.605, 0.756]],
  3: [[0.137, -2.114, -0.283], [0.362, -2.096, -0.386], [0.535, -2.108, -0.446], [0.711, -2.145, -0.41], [0.8, -2.191, -0.372], [0.952, -2.292, -0.247], [0.996, -2.38, -0.109], [1.03, -2.476, 0.032], [1.0, -2.58, 0.24], [0.95, -2.684, 0.434], [0.82, -2.78, 0.6], [0.685, -2.846, 0.757], [0.477, -2.877, 0.919]],
  4: [[0.147, -2.329, -0.296], [0.516, -2.339, -0.564], [0.673, -2.383, -0.548], [0.826, -2.437, -0.51], [0.935, -2.522, -0.412], [0.999, -2.607, -0.264], [1.085, -2.708, -0.123], [1.114, -2.796, 0.033], [1.08, -2.9, 0.25], [1.042, -3.011, 0.474], [0.94, -3.09, 0.65], [0.838, -3.162, 0.808], [0.56, -3.197, 1.048]],
  5: [[0.198, -2.567, -0.42], [0.327, -2.585, -0.485], [0.564, -2.635, -0.661], [0.798, -2.731, -0.684], [0.923, -2.807, -0.615], [1.024, -2.873, -0.484], [1.119, -2.94, -0.313], [1.17, -3.034, -0.152], [1.214, -3.305, 0.356], [1.035, -3.516, 0.772], [0.791, -3.573, 1.094]],
  6: [[0.187, -2.834, -0.449], [0.433, -2.869, -0.705], [0.656, -3.016, -0.762], [0.818, -3.069, -0.726], [0.983, -3.125, -0.623], [1.07, -3.197, -0.513], [1.171, -3.297, -0.337], [1.296, -3.586, 0.17], [1.149, -3.838, 0.709], [0.896, -3.962, 1.028]],
  7: [[0.135, -3.085, -0.497], [0.447, -3.199, -0.703], [0.643, -3.323, -0.751], [0.834, -3.417, -0.722], [0.984, -3.504, -0.629], [1.088, -3.586, -0.499], [1.164, -3.674, -0.334], [1.255, -3.849, 0.017], [1.241, -4.109, 0.546], [1.015, -4.286, 0.861]],
  8: [[0.129, -3.336, -0.466], [0.289, -3.415, -0.655], [0.439, -3.498, -0.682], [0.656, -3.666, -0.766], [0.813, -3.751, -0.71], [0.953, -3.83, -0.61], [1.029, -3.914, -0.447], [1.156, -4.106, -0.162], [1.241, -4.372, 0.342], [1.108, -4.595, 0.696]],
  9: [[0.256, -3.656, -0.561], [0.409, -3.788, -0.628], [0.629, -4.002, -0.722], [0.777, -4.106, -0.67], [0.924, -4.199, -0.583], [1.043, -4.301, -0.455], [1.112, -4.387, -0.327], [1.228, -4.606, 0.02], [1.161, -4.838, 0.431]],
  10: [[0.18, -3.899, -0.347], [0.405, -4.096, -0.613], [0.601, -4.313, -0.68], [0.739, -4.429, -0.617], [0.842, -4.532, -0.55], [0.98, -4.68, -0.417], [1.055, -4.776, -0.287], [1.139, -4.864, -0.152], [1.106, -5.113, 0.266]],
  11: [[0.165, -4.247, -0.305], [0.404, -4.441, -0.613], [0.541, -4.558, -0.608], [0.666, -4.695, -0.587], [0.783, -4.842, -0.502], [0.886, -4.959, -0.379], [0.952, -5.072, -0.26], [1.019, -5.26, 0.065]],
  12: [[0.248, -4.603, -0.318], [0.48, -4.809, -0.515], [0.633, -4.977, -0.514], [0.718, -5.11, -0.421], [0.773, -5.203, -0.303], [0.805, -5.227, -0.246]],
};
/** Ponto do sulco costal deslocado para baixo da costela e para dentro do tórax (onde corre o feixe intercostal). */
function groove(p) {
  const dx = -p[0];
  const dz = 0.15 - p[2];
  const l = Math.hypot(dx, dz) || 1;
  return [p[0] + (dx / l) * 0.025, p[1] - 0.014, p[2] + (dz / l) * 0.025];
}
/** Suaviza o sulco costal (a borda inferior medida oscila entre as faces interna e externa da costela). */
function smoothRib(pts) {
  return pts.map((p, i) => {
    if (i === 0 || i === pts.length - 1) return p;
    return p.map((v, k) => 0.25 * pts[i - 1][k] + 0.5 * v + 0.25 * pts[i + 1][k]);
  });
}
const CART = { 1: [0.195, -2.333, 0.601], 2: [0.102, -2.514, 0.855], 3: [0.131, -2.793, 0.975], 4: [0.143, -3.051, 1.11], 5: [0.176, -3.288, 1.144], 6: [0.134, -3.457, 1.189] };

/** Nervo intercostal Tn: forame → sulco da costela → (T2–T6) ao longo da cartilagem até o esterno. */
function intercostal(n) {
  const pts = [foramen(`T${n}`), ...smoothRib(RIB[n].slice(1)).map(groove)];
  if (CART[n] && n > 1) {
    const c = CART[n];
    pts.push([c[0] + 0.12, c[1] - 0.02, c[2] - 0.06], [c[0] + 0.03, c[1] - 0.03, c[2] - 0.03], SK([c[0] + 0.02, c[1] - 0.03, c[2] + 0.1], -0.03));
  }
  return { pts, r: n === 1 ? 0.007 : 0.0085 };
}

/** Nervo toracoabdominal Tn (7–11): segue a costela e depois a parede do abdome até o reto e a pele. */
const ABD_Y = { 7: -3.75, 8: -4.15, 9: -4.6, 10: -5.62, 11: -6.0 };
function thoracoabdominal(n) {
  const rib = smoothRib(RIB[n].slice(1)).map(groove);
  const end = rib[rib.length - 1];
  const y = ABD_Y[n];
  const pts = [foramen(`T${n}`), ...rib];
  const lat = Math.max(0.62, end[0] - 0.2);
  pts.push(
    SK([lat, (end[1] + y) / 2, 1.0], -0.2),
    SK([0.5, y + 0.05, 1.2], -0.2),
    SK([0.3, y, 1.25], -0.14),
    SK([0.12, y, 1.3], -0.03),
  );
  return { pts, r: 0.0085 };
}

/** Ramo posterior de um nervo espinal: forame → contorna o processo articular → ramos medial e lateral. */
function dorsalRamus(n, medial, lateral) {
  const [x, y, z] = foramen(n);
  const back = n[0] === 'C' ? [x + 0.13, y - 0.03, z - 0.12] : [x + 0.05, y - 0.02, z - 0.13];
  const out = n[0] === 'C' ? [[x + 0.1, y - 0.01, z + 0.01]] : [];
  return [
    { pts: [[x, y, z], ...out, back, { sec: medial, y: y - 0.06, at: 'c', add: [n[0] === 'C' ? 0.06 : 0.02, 0, 0] }], r: 0.005 },
    { pts: [back, { sec: lateral, y: y - 0.1, at: 'c' }], r: 0.005 },
  ];
}
const DORSAL_PATHS = [
  ...['C3', 'C4', 'C5', 'C6', 'C7', 'C8'].flatMap((n) => dorsalRamus(n, 'semiespinal_cervical', n < 'C6' ? 'esplenio_cabeca' : 'longuissimo_cervical')),
  ...Array.from({ length: 12 }, (_, i) => `T${i + 1}`).flatMap((n) => dorsalRamus(n, 'rotadores_toracicos', 'longuissimo_toracico')),
  ...['L1', 'L2', 'L3', 'L4'].flatMap((n) => dorsalRamus(n, 'rotadores_lombares', 'iliocostal_lombar')),
  ...dorsalRamus('L5', 'intertransversarios_med', 'iliocostal_lombar'),
];

/* ───────── plexo braquial (lado esquerdo) ───────── */
const BP = {
  supTrunk: [0.55, -1.5, -0.05],
  midTrunk: [0.62, -1.72, -0.06],
  infTrunk: [0.55, -1.82, -0.08],
  latDiv: [0.85, -1.95, -0.01],
  postDiv: [0.88, -2.0, -0.03],
  medDiv: [0.86, -2.06, -0.04],
  latCord: [1.32, -2.5, 0.1],
  postCord: [1.3, -2.52, 0.03],
  medCord: [1.28, -2.56, 0.07],
  medianStart: [1.38, -2.68, 0.08],
};

export const NERVES = [
  /* ═════════════════════ Nervos cranianos ═════════════════════ */
  nervo('n_optico', 'Nervo óptico (II)', 'N. opticus', 'cabeca', {
    parts: [{ id: 'n_optico', mat: 'nerve' }],
  }, {
    origem: 'Axônios das células ganglionares da retina. É, na verdade, um trato do sistema nervoso central, envolvido pelas meninges.',
    trajeto: 'Sai do bulbo do olho pelo polo posterior, atravessa a órbita dentro do cone dos músculos retos e entra no crânio pelo canal óptico. No quiasma óptico cruzam as fibras das metades nasais das duas retinas; daí seguem os tratos ópticos até o corpo geniculado lateral.',
    sensibilidade: 'Visão (aferência especial). Não inerva músculos.',
    lesao: 'Lesão do nervo: cegueira do olho afetado e perda do reflexo fotomotor direto (o consensual se mantém ao iluminar o outro olho). Compressão do quiasma (ex.: adenoma de hipófise): hemianopsia bitemporal.',
    nota: 'O edema de papila no fundo de olho é sinal de hipertensão intracraniana.',
  }),
  nervo('n_oculomotor', 'Nervo oculomotor (III)', 'N. oculomotorius', 'cabeca', {
    parts: [{ id: 'n_oculomotor', mat: 'nerve' }],
    paths: [{ pts: [[0.025, -0.07, 0.04], [0.07, -0.07, 0.09], [0.115, -0.075, 0.16], [0.135, -0.068, 0.24], [0.148, -0.066, 0.31]], r: 0.011 }],
    ramos: [
      { m: 'levantador_palpebra', obs: 'ramo superior', semRamo: true },
      { m: 'reto_sup', obs: 'ramo superior', semRamo: true },
      { m: 'reto_med', obs: 'ramo inferior', semRamo: true },
      { m: 'reto_inf', obs: 'ramo inferior', semRamo: true },
      { m: 'obliquo_inf', obs: 'ramo inferior', semRamo: true },
    ],
  }, {
    origem: 'Núcleo do oculomotor (motor) e núcleo de Edinger-Westphal (parassimpático), no mesencéfalo. Emerge na fossa interpeduncular.',
    trajeto: 'Passa entre as artérias cerebral posterior e cerebelar superior, corre na parede lateral do seio cavernoso e entra na órbita pela fissura orbital superior, dentro do anel tendíneo comum, onde se divide em ramo superior e ramo inferior.',
    ramos: 'Ramo superior: reto superior e levantador da pálpebra superior. Ramo inferior: reto medial, reto inferior e oblíquo inferior, além da raiz parassimpática para o gânglio ciliar (esfíncter da pupila e músculo ciliar, pelos nervos ciliares curtos).',
    lesao: 'Olho “para baixo e para fora” (reto lateral e oblíquo superior sem oposição), ptose, midríase e perda da acomodação. Aneurisma da artéria comunicante posterior comprime primeiro as fibras pupilares, que são periféricas.',
  }),
  nervo('n_troclear', 'Nervo troclear (IV)', 'N. trochlearis', 'cabeca', {
    parts: [{ id: 'n_troclear', mat: 'nerve' }],
    ramos: [{ m: 'obliquo_sup', semRamo: true }],
  }, {
    origem: 'Núcleo do troclear, no mesencéfalo (altura do colículo inferior). É o único nervo craniano que emerge da face dorsal do tronco encefálico e cujas fibras cruzam totalmente.',
    trajeto: 'Contorna o pedúnculo cerebral, segue na parede lateral do seio cavernoso e entra na órbita pela fissura orbital superior, por fora do anel tendíneo comum, chegando ao oblíquo superior pela face superior.',
    lesao: 'Diplopia vertical, pior ao olhar para baixo e para dentro (descer escadas, ler). A pessoa inclina a cabeça para o lado oposto para compensar.',
    nota: 'É o nervo craniano mais fino e o de trajeto intracraniano mais longo.',
  }),
  nervo('n_abducente', 'Nervo abducente (VI)', 'N. abducens', 'cabeca', {
    paths: [{ pts: [[0.03, -0.37, -0.08], [0.05, -0.3, -0.02], [0.09, -0.21, 0.05], [0.135, -0.13, 0.17], [0.15, -0.1, 0.25], [0.16, -0.09, 0.31], [0.17, -0.085, 0.345]], r: 0.007 }],
    ramos: [{ m: 'reto_lat' }],
  }, {
    origem: 'Núcleo do abducente, na ponte (sob o colículo facial). Emerge no sulco bulbopontino.',
    trajeto: 'Sobe pelo clivo, atravessa a dura-máter e o canal de Dorello, corre dentro do seio cavernoso (lateral à artéria carótida interna) e entra na órbita pela fissura orbital superior, dentro do anel tendíneo comum, até a face interna do reto lateral.',
    lesao: 'O olho não abduz e fica desviado medialmente (estrabismo convergente), com diplopia horizontal. Pelo longo trajeto intracraniano, é afetado cedo na hipertensão intracraniana.',
  }),
  nervo('n_trigemeo', 'Nervo trigêmeo (V) e gânglio trigeminal', 'N. trigeminus; Ganglion trigeminale', 'cabeca', {
    paths: [
      { pts: [[0.1, -0.25, -0.03], [0.16, -0.205, 0.02], [0.21, -0.17, 0.06]], r: 0.019 },
      { pts: [[0.19, -0.13, 0.07], [0.215, -0.155, 0.065], [0.24, -0.185, 0.08]], r: 0.022 },
    ],
  }, {
    origem: 'Raiz sensitiva (núcleos sensitivos do trigêmeo, do mesencéfalo à medula cervical alta) e raiz motora (núcleo motor, na ponte). Emerge da face lateral da ponte.',
    trajeto: 'Cruza o ápice da parte petrosa do temporal até o gânglio trigeminal (de Gasser), no cavo trigeminal (de Meckel). Do gânglio saem três divisões: oftálmica (V1, fissura orbital superior), maxilar (V2, forame redondo) e mandibular (V3, forame oval). A raiz motora passa sob o gânglio e acompanha só o V3.',
    sensibilidade: 'Sensibilidade geral de quase toda a face, da metade anterior do couro cabeludo, das cavidades nasal e oral, dos dentes e de grande parte da dura-máter.',
    lesao: 'Neuralgia do trigêmeo: dor em choque no território de V2 ou V3. Lesão completa: anestesia da hemiface, perda do reflexo corneano (via aferente) e fraqueza da mastigação do mesmo lado — ao abrir a boca, a mandíbula desvia para o lado lesado.',
  }),
  nervo('n_oftalmico', 'Nervo oftálmico (V1)', 'N. ophthalmicus', 'cabeca', {
    parts: [{ id: 'n_oftalmico', mat: 'nerve' }],
    paths: [{ pts: [[0.205, -0.15, 0.07], [0.19, -0.135, 0.085], [0.177, -0.127, 0.1]], r: 0.012 }],
  }, {
    origem: 'Divisão superior, puramente sensitiva, do gânglio trigeminal.',
    trajeto: 'Corre na parede lateral do seio cavernoso e, antes da fissura orbital superior, divide-se em nervos lacrimal, frontal (que dá os nervos supraorbital e supratroclear) e nasociliar.',
    ramos: 'Nasociliar: nervos ciliares longos, etmoidais anterior e posterior, infratroclear e ramo comunicante com o gânglio ciliar.',
    sensibilidade: 'Fronte, pálpebra superior, dorso do nariz, córnea e conjuntiva, seios frontal e etmoidal, parte da cavidade nasal e dura-máter da fossa anterior.',
    lesao: 'O herpes-zóster oftálmico acomete este território. Lesões na ponta do nariz (sinal de Hutchinson, ramo nasal externo do nasociliar) indicam risco de comprometimento do olho.',
    nota: 'O nervo nasociliar é a via aferente do reflexo corneano. Não inerva músculos.',
  }),
  nervo('n_maxilar', 'Nervo maxilar (V2) e nervo infraorbital', 'N. maxillaris; N. infraorbitalis', 'cabeca', {
    paths: [
      { pts: [[0.225, -0.165, 0.08], [0.205, -0.19, 0.17], [0.194, -0.215, 0.26], [0.2, -0.255, 0.34], [0.235, -0.27, 0.44], [0.25, -0.295, 0.58], [0.252, -0.325, 0.72], [0.26, -0.36, 0.86]], r: 0.009 },
      { pts: [[0.26, -0.36, 0.86], SK([0.29, -0.27, 0.86], -0.035), SK([0.32, -0.23, 0.84], -0.03)], r: 0.0045 },
      { pts: [[0.26, -0.36, 0.86], SK([0.17, -0.38, 0.98], -0.035), SK([0.12, -0.42, 1.05], -0.03)], r: 0.0045 },
      { pts: [[0.26, -0.36, 0.86], SK([0.24, -0.5, 0.95], -0.04), SK([0.2, -0.62, 1.0], -0.035)], r: 0.005 },
    ],
  }, {
    origem: 'Divisão intermediária, puramente sensitiva, do gânglio trigeminal.',
    trajeto: 'Passa pelo forame redondo até a fossa pterigopalatina (onde se relaciona com o gânglio pterigopalatino), entra na órbita pela fissura orbital inferior como nervo infraorbital, percorre o sulco e o canal infraorbitais e emerge na face pelo forame infraorbital.',
    ramos: 'Zigomático, alveolares superiores (posteriores, médio e anterior) e ramos do gânglio pterigopalatino (palatinos e nasais). Na face, o infraorbital dá ramos palpebrais inferiores, nasais externos e labiais superiores.',
    sensibilidade: 'Pálpebra inferior, bochecha, asa do nariz, lábio superior, dentes e gengiva superiores, palato, seio maxilar e parte da cavidade nasal.',
    lesao: 'Fraturas do assoalho da órbita e do zigomático podem lesar o nervo infraorbital: dormência da bochecha, do lábio superior e dos dentes superiores.',
    nota: 'Não inerva músculos.',
  }),
  nervo('n_mandibular', 'Nervo mandibular (V3)', 'N. mandibularis', 'cabeca', {
    paths: [
      // tronco: gânglio → forame oval → fossa infratemporal
      { pts: [[0.24, -0.185, 0.08], [0.238, -0.22, 0.135], [0.237, -0.28, 0.165], [0.24, -0.36, 0.165], [0.25, -0.42, 0.165]], r: 0.013 },
      // nervo pterigóideo medial
      { pts: [[0.25, -0.42, 0.165], [0.25, -0.45, 0.19], [0.25, -0.47, 0.22]], r: 0.004 },
      // nervo pterigóideo lateral (divisão anterior)
      { pts: [[0.26, -0.42, 0.175], [0.33, -0.41, 0.21]], r: 0.004 },
      // nervo bucal (sensitivo): entre as cabeças do pterigóideo lateral → face externa do bucinador
      { pts: [[0.26, -0.42, 0.175], [0.345, -0.42, 0.27], [0.39, -0.47, 0.42], [0.41, -0.56, 0.56], [0.39, -0.62, 0.7]], r: 0.005 },
      // nervo auriculotemporal (sensitivo): atrás do colo da mandíbula → à frente da orelha
      { pts: [[0.25, -0.42, 0.16], [0.34, -0.42, 0.08], [0.42, -0.385, 0.035], [0.52, -0.33, 0.03], SK([0.68, -0.18, 0.06], -0.04), SK([0.67, 0.1, 0.12], -0.035)], r: 0.005 },
    ],
    ramos: [
      { m: 'pterigoideo_medial', path: 1 },
      { m: 'pterigoideo_lateral', path: 2 },
    ],
  }, {
    origem: 'Divisão inferior do trigêmeo: raiz sensitiva do gânglio trigeminal unida à raiz motora. É a única divisão mista.',
    trajeto: 'Sai pelo forame oval para a fossa infratemporal, entre o tensor do véu palatino (medialmente) e o pterigóideo lateral. Após um tronco curto, dá o nervo pterigóideo medial e se divide em divisão anterior (massetérico, temporais profundos, pterigóideo lateral e bucal) e divisão posterior (auriculotemporal, lingual e alveolar inferior).',
    ramos: 'Aqui: tronco, nervos pterigóideos medial e lateral, nervo bucal e nervo auriculotemporal. Massetérico, temporais profundos, alveolar inferior, milo-hióideo e lingual têm fichas próprias.',
    sensibilidade: 'Nervo bucal: pele e mucosa da bochecha (atravessa o bucinador sem inervá-lo). Auriculotemporal: região temporal, pavilhão e meato acústico externo; leva à parótida as fibras parassimpáticas do glossofaríngeo (via gânglio ótico).',
    lesao: 'A lesão da raiz motora enfraquece a mastigação do mesmo lado. Bloqueios anestésicos do tronco (Gow-Gates) anestesiam toda a hemimandíbula.',
    nota: 'O nervo pterigóideo medial também supre o tensor do véu palatino e o tensor do tímpano (não representados).',
  }),
  nervo('n_masseterico', 'Nervo massetérico', 'N. massetericus', 'cabeca', {
    paths: [{ pts: [[0.26, -0.42, 0.175], [0.37, -0.405, 0.22], [0.42, -0.44, 0.31], [0.437, -0.47, 0.34], [0.47, -0.52, 0.36]], r: 0.0055 }],
    ramos: [{ m: 'masseter' }],
  }, {
    origem: 'Divisão anterior do nervo mandibular (V3).',
    trajeto: 'Passa lateralmente acima do pterigóideo lateral, atravessa a incisura da mandíbula com a artéria massetérica e penetra no masseter pela face profunda. Dá um ramo para a articulação temporomandibular.',
    lesao: 'Raramente lesado isoladamente. É usado como nervo doador na reanimação da paralisia facial (transferência massetérico-facial).',
  }),
  nervo('n_temporais_profundos', 'Nervos temporais profundos', 'Nn. temporales profundi', 'cabeca', {
    paths: [
      { pts: [[0.26, -0.42, 0.18], [0.4, -0.4, 0.26], [0.47, -0.33, 0.27], CAST('cranio', [1.2, -0.18, 0.27], [-1, 0, 0], 0.015), CAST('cranio', [1.2, -0.02, 0.29], [-1, 0, 0], 0.015), CAST('cranio', [1.2, 0.2, 0.27], [-1, 0, 0], 0.015)], r: 0.005 },
      { pts: [[0.4, -0.4, 0.26], [0.47, -0.33, 0.2], CAST('cranio', [1.2, -0.17, 0.17], [-1, 0, 0], 0.015), CAST('cranio', [1.2, 0.0, 0.1], [-1, 0, 0], 0.015), CAST('cranio', [1.2, 0.25, 0.02], [-1, 0, 0], 0.015)], r: 0.0045 },
    ],
    ramos: [{ m: 'temporal' }],
  }, {
    origem: 'Divisão anterior do nervo mandibular (V3); em geral dois ou três (anterior, médio e posterior).',
    trajeto: 'Sobem pela margem superior do pterigóideo lateral, contornam a crista infratemporal e entram no músculo temporal pela face profunda, entre o músculo e o osso.',
  }),
  nervo('n_alveolar_inferior', 'Nervo alveolar inferior e nervo mentual', 'N. alveolaris inferior; N. mentalis', 'cabeca', {
    paths: [
      { pts: [[0.25, -0.425, 0.165], [0.3, -0.46, 0.16], [0.35, -0.49, 0.18], [0.372, -0.525, 0.19], CAST('mandibula', [1.2, -0.63, 0.29], [-1, 0, 0], -0.035), CAST('mandibula', [1.2, -0.75, 0.45], [-1, 0, 0], -0.04), CAST('mandibula', [1.2, -0.88, 0.6], [-1, 0, 0], -0.04), MENTUAL], r: 0.008 },
      // nervo mentual: forame mentual → lábio inferior e mento
      { pts: [MENTUAL, SK([0.24, -0.82, 0.88], -0.035), SK([0.16, -0.76, 0.98], -0.03)], r: 0.005 },
      { pts: [MENTUAL, SK([0.2, -0.95, 0.9], -0.035)], r: 0.004 },
    ],
  }, {
    origem: 'Divisão posterior do nervo mandibular (V3).',
    trajeto: 'Desce medialmente ao pterigóideo lateral e entre o ligamento esfenomandibular e o ramo da mandíbula; entra no forame da mandíbula (junto à língula), percorre o canal da mandíbula e, no forame mentual (abaixo do 2º pré-molar), dá o nervo mentual.',
    ramos: 'Nervo milo-hióideo (antes do forame — ficha própria), ramos dentais para os dentes inferiores, ramo incisivo e nervo mentual.',
    sensibilidade: 'Dentes e gengiva inferiores; pelo nervo mentual, a pele do mento e o lábio inferior.',
    lesao: 'Pode ser lesado na extração do 3º molar inferior ou em implantes: parestesia do lábio inferior e do mento. É o alvo do bloqueio do alveolar inferior, a anestesia odontológica mais comum.',
    nota: 'Dentro do canal fica escondido pelo osso: use a camada de ossos desligada ou a pele translúcida para vê-lo.',
  }),
  nervo('n_milo_hioideo', 'Nervo milo-hióideo', 'N. mylohyoideus', 'cabeca', {
    paths: [{ pts: [[0.362, -0.505, 0.185], CAST('mandibula', [0.0, -0.68, 0.3], [1, 0, 0], 0.012), CAST('mandibula', [0.0, -0.86, 0.45], [1, 0, 0], 0.015), [0.17, -1.0, 0.56], [0.11, -1.05, 0.68]], r: 0.0045 }],
    ramos: [{ m: 'milo_hioideo' }, { m: 'digastrico', obs: 'ventre anterior', t: [0.6, 1] }],
  }, {
    origem: 'Ramo do nervo alveolar inferior (V3), pouco antes de ele entrar no forame da mandíbula.',
    trajeto: 'Perfura o ligamento esfenomandibular, desce no sulco milo-hióideo da face medial do ramo e corre na face inferior do milo-hióideo até o ventre anterior do digástrico.',
    nota: 'Explica a dupla inervação do digástrico: o ventre anterior vem do 1º arco faríngeo (V3) e o posterior, do 2º arco (VII).',
  }),
  nervo('n_lingual', 'Nervo lingual', 'N. lingualis', 'cabeca', {
    paths: [{ pts: [[0.25, -0.425, 0.165], [0.29, -0.47, 0.2], [0.325, -0.56, 0.27], CAST('mandibula', [0.0, -0.69, 0.42], [1, 0, 0], 0.025), CAST('mandibula', [0.0, -0.77, 0.47], [1, 0, 0], 0.025), [0.2, -0.83, 0.53], [0.16, -0.82, 0.62], [0.1, -0.79, 0.72]], r: 0.007 }],
  }, {
    origem: 'Divisão posterior do nervo mandibular (V3).',
    trajeto: 'Desce medialmente ao pterigóideo lateral, recebe a corda do tímpano (do facial), passa entre o pterigóideo medial e o ramo da mandíbula e corre sob a mucosa, medial ao 3º molar inferior. No assoalho da boca cruza o ducto submandibular por baixo e entra na língua.',
    sensibilidade: 'Sensibilidade geral dos 2/3 anteriores da língua, do assoalho da boca e da gengiva lingual inferior. Pela corda do tímpano: paladar dos 2/3 anteriores e fibras parassimpáticas para as glândulas submandibular e sublingual.',
    lesao: 'Pode ser lesado na cirurgia do 3º molar inferior: dormência e perda do paladar na metade anterior da língua do mesmo lado.',
    nota: 'Não inerva músculos da língua: eles recebem o hipoglosso (XII), exceto o palatoglosso.',
  }),
  nervo('n_facial', 'Nervo facial (VII)', 'N. facialis', 'cabeca', {
    paths: [{
      pts: [[0.09, -0.34, -0.1], [0.17, -0.31, -0.08], [0.24, -0.285, -0.06], [0.28, -0.275, -0.03], [0.33, -0.3, -0.1], [0.36, -0.4, -0.12], [0.39, -0.5, -0.09],
        [0.44, -0.535, -0.03], [0.5, -0.545, 0.04], [0.54, -0.55, 0.1]],
      r: 0.011,
    }],
    ramos: [
      { m: 'digastrico', obs: 'ventre posterior', t: [0.6, 0.85] },
      { m: 'estilo_hioideo', t: [0.6, 0.9] },
    ],
  }, {
    origem: 'Núcleo motor do facial (ponte) e nervo intermédio (paladar e fibras parassimpáticas). Emerge no ângulo pontocerebelar.',
    trajeto: 'Entra no meato acústico interno, percorre o canal do facial no temporal — joelho com o gânglio geniculado, parede medial da cavidade timpânica e segmento mastóideo — e sai pelo forame estilomastóideo. Logo depois dá o nervo auricular posterior e os ramos para o ventre posterior do digástrico e para o estilo-hióideo; entra na parótida, forma o plexo intraparotídeo e se divide em cinco grupos de ramos (temporais, zigomáticos, bucais, marginal da mandíbula e cervical).',
    ramos: 'Dentro do osso: nervo petroso maior (glândula lacrimal e mucosas, via gânglio pterigopalatino), nervo para o estapédio e corda do tímpano (paladar dos 2/3 anteriores da língua e glândulas submandibular e sublingual).',
    lesao: 'Paralisia facial periférica (ex.: paralisia de Bell, tumor de parótida): toda a hemiface fica paralisada, inclusive a testa, e o olho não fecha. Conforme o nível, também hiperacusia (estapédio) e perda do paladar (corda do tímpano).',
    nota: 'A parótida não é inervada pelo facial (é o glossofaríngeo, via gânglio ótico e nervo auriculotemporal): o facial só passa por dentro dela.',
  }),
  nervo('n_auricular_posterior', 'Nervo auricular posterior', 'N. auricularis posterior', 'cabeca', {
    paths: [
      { pts: [[0.41, -0.51, -0.075], SK([0.56, -0.5, -0.15], -0.015), SK([0.6, -0.33, -0.2], -0.02), SK([0.55, -0.12, -0.5], -0.045), SK([0.45, 0.05, -0.78], -0.045)], r: 0.004 },
      { pts: [SK([0.6, -0.33, -0.2], -0.04), SK([0.68, -0.28, -0.12], -0.03)], r: 0.003 },
    ],
    ramos: [{ m: 'auricular_post' }, { m: 'occipital' }],
  }, {
    origem: 'Nervo facial (VII), logo após o forame estilomastóideo.',
    trajeto: 'Sobe entre o processo mastoide e a orelha e se divide em ramo auricular (auricular posterior e músculos intrínsecos da orelha) e ramo occipital (ventre occipital do occipitofrontal).',
  }),
  nervo('n_facial_temporal', 'Ramos temporais do nervo facial', 'Rami temporales n. facialis', 'cabeca', {
    superficial: true,
    paths: [
      { pts: [[0.55, -0.53, 0.12], [0.6, -0.42, 0.14], SK([0.7, -0.3, 0.22], -0.05), SK([0.67, -0.1, 0.36], -0.05), SK([0.6, 0.1, 0.52], -0.05), SK([0.48, 0.3, 0.7], -0.05)], r: 0.004 },
      { pts: [SK([0.67, -0.1, 0.36], -0.05), SK([0.56, -0.02, 0.66], -0.045), SK([0.42, 0.04, 0.82], -0.04)], r: 0.0035 },
      { pts: [SK([0.7, -0.3, 0.22], -0.05), SK([0.73, -0.15, 0.08], -0.035)], r: 0.003 },
    ],
    ramos: [
      { m: 'frontal' }, { m: 'auricular_sup' }, { m: 'auricular_ant' }, { m: 'orbicular_olho', obs: 'parte superior' },
      { m: 'corrugador' }, { m: 'depressor_supercilio' }, { m: 'procero' },
    ],
  }, {
    origem: 'Divisão temporofacial do plexo intraparotídeo do nervo facial (VII).',
    trajeto: 'Saem pela margem superior da parótida, cruzam o arco zigomático (aproximadamente no seu terço médio) e sobem obliquamente na fáscia temporal superficial até a fronte e a sobrancelha.',
    lesao: 'Cirurgias da região temporal, ritidoplastia ou trauma do arco zigomático: a sobrancelha cai e a testa não enruga do lado afetado. A linha de Pitanguy (do lóbulo da orelha a 1,5 cm acima da extremidade lateral do supercílio) estima o trajeto.',
  }),
  nervo('n_facial_zigomatico', 'Ramos zigomáticos do nervo facial', 'Rami zygomatici n. facialis', 'cabeca', {
    superficial: true,
    paths: [
      { pts: [[0.55, -0.55, 0.13], SK([0.68, -0.42, 0.3], -0.06), SK([0.62, -0.33, 0.52], -0.055), SK([0.5, -0.24, 0.72], -0.045), SK([0.38, -0.25, 0.84], -0.04)], r: 0.004 },
      { pts: [SK([0.62, -0.33, 0.52], -0.055), SK([0.48, -0.42, 0.78], -0.05), SK([0.32, -0.43, 0.9], -0.045)], r: 0.0035 },
    ],
    ramos: [
      { m: 'orbicular_olho', obs: 'parte inferior' }, { m: 'zigomatico_maior' }, { m: 'zigomatico_menor' }, { m: 'levantador_labio' },
      { m: 'levantador_labio_asa' }, { m: 'levantador_angulo' }, { m: 'procero' }, { m: 'depressor_supercilio' },
    ],
  }, {
    origem: 'Plexo intraparotídeo do nervo facial (VII).',
    trajeto: 'Cruzam o osso zigomático em direção ao ângulo lateral do olho, profundamente aos músculos que inervam.',
    lesao: 'O olho não fecha completamente (lagoftalmo), com risco de lesão da córnea por ressecamento.',
  }),
  nervo('n_facial_bucal', 'Ramos bucais do nervo facial', 'Rami buccales n. facialis', 'cabeca', {
    superficial: true,
    paths: [
      { pts: [[0.55, -0.57, 0.13], SK([0.69, -0.48, 0.32], -0.075), SK([0.63, -0.5, 0.55], -0.075), SK([0.5, -0.54, 0.74], -0.065), SK([0.33, -0.5, 0.92], -0.05), SK([0.16, -0.42, 1.02], -0.04)], r: 0.0045 },
      { pts: [SK([0.5, -0.54, 0.74], -0.065), SK([0.36, -0.67, 0.9], -0.05), SK([0.22, -0.7, 0.98], -0.045)], r: 0.0035 },
    ],
    ramos: [
      { m: 'bucinador' }, { m: 'orbicular_boca', obs: 'parte superior' }, { m: 'nasal' }, { m: 'depressor_septo' }, { m: 'risorio' },
      { m: 'levantador_labio' }, { m: 'levantador_labio_asa' }, { m: 'zigomatico_maior' }, { m: 'zigomatico_menor' },
      { m: 'levantador_angulo' }, { m: 'abaixador_angulo' },
    ],
  }, {
    origem: 'Plexo intraparotídeo do nervo facial (VII).',
    trajeto: 'Correm horizontalmente sobre o masseter, acompanhando o ducto parotídeo, até os músculos do lábio superior e do nariz e o bucinador. Os ramos superiores e inferiores se anastomosam com os zigomáticos e com o marginal da mandíbula.',
    lesao: 'Comida acumula no vestíbulo da boca (bucinador fraco) e o sorriso fica assimétrico.',
    nota: 'O nervo bucal do V3 tem o mesmo nome e passa pela mesma região, mas é só sensitivo.',
  }),
  nervo('n_facial_marginal', 'Ramo marginal da mandíbula do nervo facial', 'Ramus marginalis mandibularis n. facialis', 'cabeca', {
    superficial: true,
    paths: [{ pts: [[0.53, -0.6, 0.12], SK([0.58, -0.82, 0.2], -0.07), SK([0.52, -0.93, 0.45], -0.06), SK([0.4, -0.93, 0.72], -0.05), SK([0.22, -0.86, 0.92], -0.04)], r: 0.004 }],
    ramos: [{ m: 'abaixador_angulo' }, { m: 'abaixador_labio' }, { m: 'mentual' }, { m: 'orbicular_boca', obs: 'parte inferior' }],
  }, {
    origem: 'Divisão cervicofacial do plexo intraparotídeo do nervo facial (VII).',
    trajeto: 'Corre ao longo da margem inferior da mandíbula — às vezes 1 a 2 cm abaixo dela, sob o platisma —, cruza superficialmente os vasos faciais e chega aos músculos do lábio inferior e do mento.',
    lesao: 'Comum em cirurgias da glândula submandibular e do pescoço: o lábio inferior do lado afetado não abaixa e o sorriso fica torto.',
  }),
  nervo('n_facial_cervical', 'Ramo cervical do nervo facial', 'Ramus colli n. facialis', 'cabeca', {
    superficial: true,
    paths: [{ pts: [[0.52, -0.62, 0.1], SK([0.56, -0.93, 0.15], -0.05), SK([0.52, -1.22, 0.3], -0.04), SK([0.44, -1.48, 0.45], -0.035)], r: 0.004 }],
    ramos: [{ m: 'platisma' }],
  }, {
    origem: 'Divisão cervicofacial do plexo intraparotídeo do nervo facial (VII).',
    trajeto: 'Sai pelo polo inferior da parótida, atrás do ângulo da mandíbula, e desce no pescoço até a face profunda do platisma; comunica-se com o nervo cervical transverso.',
  }),
  nervo('n_hipoglosso', 'Nervo hipoglosso (XII)', 'N. hypoglossus', 'cabeca', {
    paths: [{ pts: [[0.04, -0.42, -0.09], [0.09, -0.45, -0.05], [0.12, -0.5, 0.0], [0.2, -0.6, 0.02], [0.235, -0.75, 0.04], [0.245, -0.87, 0.11], [0.205, -0.925, 0.22], [0.16, -0.9, 0.37], [0.11, -0.83, 0.52]], r: 0.009 }],
    ramos: [
      { m: 'lingua', obs: 'músculos intrínsecos e extrínsecos, exceto o palatoglosso' },
      { m: 'genio_hioideo', obs: 'fibras de C1 conduzidas pelo XII' },
      { m: 'tireohioideo', obs: 'fibras de C1 conduzidas pelo XII' },
    ],
  }, {
    origem: 'Núcleo do hipoglosso, no bulbo. Emerge no sulco anterolateral, entre a pirâmide e a oliva.',
    trajeto: 'Sai pelo canal do hipoglosso, desce entre a artéria carótida interna e a veia jugular interna, contorna a artéria occipital na altura do ângulo da mandíbula e segue para a frente acima do corno maior do hioide, sobre o hioglosso e sob o milo-hióideo, até a língua. Recebe fibras de C1, que deixa como raiz superior da alça cervical e como ramos para o tíreo-hióideo e o gênio-hióideo.',
    lesao: 'Ao pôr a língua para fora, ela desvia para o lado lesado (o genioglosso do lado são empurra a língua), com atrofia e fasciculações desse lado.',
    nota: 'Inerva todos os músculos intrínsecos e extrínsecos da língua, exceto o palatoglosso (vago, via plexo faríngeo).',
  }),
  nervo('n_acessorio', 'Nervo acessório (XI)', 'N. accessorius', ['cabeca', 'tronco'], {
    paths: [{
      pts: [[0.1, -0.45, -0.13], [0.19, -0.47, -0.07], [0.27, -0.6, -0.05], [0.36, -0.75, -0.1], { sec: 'ecm', y: -0.92, at: 'c' }, { sec: 'ecm', y: -1.18, at: 'post', d: 0.02 },
        { sec: 'levantador_escapula', y: -1.42, at: 'lat', d: 0.03 }, CAST('trapezio_desc', [0.6, -1.6, -0.15], [0, 0, -1], 0.03), CAST('trapezio_transv', [0.5, -2.0, -0.3], [0, 0, -1], 0.03),
        CAST('trapezio_asc', [0.42, -2.6, -0.3], [0, 0, -1], 0.03), CAST('trapezio_asc', [0.4, -3.1, 0.0], [0, 0, -1], 0.03)],
      r: 0.007,
    }],
    ramos: [{ m: 'ecm' }, { m: 'trapezio_desc' }, { m: 'trapezio_transv' }, { m: 'trapezio_asc' }],
  }, {
    origem: 'Raiz espinal: núcleo do acessório na coluna anterior de C1–C5, que sobe pelo forame magno. Muitos autores consideram a antiga “raiz craniana” parte do vago.',
    trajeto: 'Sai do crânio pelo forame jugular, desce posterolateralmente (em geral cruzando a veia jugular interna por fora), penetra na face profunda do esternocleidomastóideo, emerge da sua margem posterior (por volta do ponto médio), cruza o trígono posterior do pescoço sobre o levantador da escápula e chega à face profunda do trapézio, cerca de 5 cm acima da clavícula.',
    lesao: 'É muito superficial no trígono posterior e pode ser lesado em biópsias de linfonodo: queda do ombro, dificuldade de elevar o braço acima de 90° e escápula alada lateral (trapézio). A rotação da cabeça para o lado oposto enfraquece (ECM).',
  }),
  nervo('n_ramos_cervicais', 'Plexo cervical — ramos musculares', 'Plexus cervicalis, rami musculares', 'cabeca', {
    paths: [
      { pts: [[0.1, -0.575, -0.27], [0.22, -0.58, -0.2], [0.27, -0.6, -0.07], [0.23, -0.62, 0.02]], r: 0.005 },
      { pts: [[0.14, -0.74, -0.22], [0.27, -0.74, -0.12], [0.28, -0.77, -0.03]], r: 0.006 },
      { pts: [foramen('C3'), [0.28, -0.89, -0.09], [0.31, -0.93, -0.07]], r: 0.007 },
      { pts: [foramen('C4'), [0.29, -1.06, -0.07], [0.32, -1.09, -0.05]], r: 0.007 },
      // alças em frente aos processos transversos (C1–C4)
      { pts: [[0.23, -0.62, 0.02], [0.28, -0.77, -0.03], [0.31, -0.93, -0.07], [0.32, -1.09, -0.05]], r: 0.005 },
      // C3–C4 para o levantador da escápula e o trapézio (propriocepção)
      { pts: [[0.32, -1.09, -0.05], [0.42, -1.22, -0.2], CAST('trapezio_desc', [0.58, -1.55, -0.15], [0, 0, -1], 0.03)], r: 0.0045 },
    ],
    ramos: [
      { m: 'longo_cabeca' }, { m: 'reto_ant_cabeca' }, { m: 'reto_lat_cabeca' },
      { m: 'escaleno_ant', obs: 'C4–C6' }, { m: 'escaleno_med', obs: 'C3–C8' }, { m: 'escaleno_post', obs: 'C6–C8' },
      { m: 'levantador_escapula', obs: 'C3–C4' },
      { m: 'ecm', obs: 'C2–C3, dor e propriocepção', sens: true },
      { m: 'trapezio_desc', obs: 'C3–C4, dor e propriocepção', sens: true },
    ],
  }, {
    origem: 'Ramos anteriores de C1 a C4 (plexo cervical), com ramos segmentares de C5 a C8 para os escalenos.',
    trajeto: 'Saem pelos forames intervertebrais, correm no sulco dos processos transversos e formam alças em frente a eles, sob a lâmina pré-vertebral. Ramos curtos vão diretamente aos músculos pré-vertebrais, aos escalenos e ao levantador da escápula; ramos de C2–C4 levam fibras de dor e propriocepção ao esternocleidomastóideo e ao trapézio.',
    ramos: 'O plexo cervical também forma ramos cutâneos (occipital menor, auricular magno, cervical transverso e supraclaviculares, que emergem no ponto de Erb, na margem posterior do ECM), a alça cervical e o nervo frênico (fichas próprias).',
    lesao: 'O bloqueio do plexo cervical superficial, no ponto médio da margem posterior do ECM, anestesia a pele do pescoço.',
  }),
  nervo('n_alca_cervical', 'Alça cervical', 'Ansa cervicalis', 'cabeca', {
    paths: [
      // raiz superior (C1, junto do hipoglosso)
      { pts: [[0.245, -0.86, 0.1], [0.24, -1.05, 0.12], [0.235, -1.3, 0.13], [0.22, -1.5, 0.13]], r: 0.0045 },
      // raiz inferior (C2–C3)
      { pts: [[0.28, -0.92, -0.08], [0.33, -1.15, -0.04], [0.3, -1.4, 0.06], [0.22, -1.5, 0.13]], r: 0.0045 },
    ],
    ramos: [{ m: 'esternohioideo' }, { m: 'esternotireoideo' }, { m: 'omohioideo', obs: 'ventres superior e inferior' }],
  }, {
    origem: 'Plexo cervical (C1–C3): raiz superior (fibras de C1 que acompanham o hipoglosso) e raiz inferior (C2–C3).',
    trajeto: 'A raiz superior desce sobre a bainha carótica; a raiz inferior contorna a veia jugular interna. As duas se unem numa alça sobre a bainha, em geral na altura da cartilagem cricoide, de onde saem os ramos para os infra-hióideos.',
    lesao: 'Pode servir de nervo doador para reinervar a laringe ou a língua. Na tireoidectomia, seccionar os infra-hióideos na parte alta poupa a sua inervação, que chega por baixo.',
    nota: 'O tíreo-hióideo e o gênio-hióideo também recebem C1, mas pelo próprio hipoglosso, não pela alça.',
  }),
  nervo('n_frenico', 'Nervo frênico', 'N. phrenicus', ['cabeca', 'tronco'], {
    paths: [
      { pts: [[0.31, -0.93, -0.07], [0.32, -1.06, -0.04], [0.31, -1.18, -0.01], { sec: 'escaleno_ant', y: -1.3, x: 0.36, at: 'ant', d: 0.015 }, { sec: 'escaleno_ant', y: -1.65, x: 0.3, at: 'ant', d: 0.015 }, [0.22, -1.9, 0.14], [0.3, -2.25, 0.3], [0.45, -2.7, 0.42], [0.58, -3.15, 0.48], [0.6, -3.55, 0.45]], r: 0.0065 },
      { pts: [foramen('C5'), [0.28, -1.28, -0.04], [0.31, -1.4, 0.04]], r: 0.004 },
    ],
    ramos: [{ m: 'diafragma', obs: 'inervação motora (única)' }],
  }, {
    origem: 'Ramos anteriores de C3, C4 e C5, principalmente C4 — “C3, 4 e 5 mantêm o diafragma vivo”.',
    trajeto: 'Desce oblíquo sobre a face anterior do escaleno anterior (de lateral para medial), sob a lâmina pré-vertebral, passa entre a artéria e a veia subclávias e entra no tórax. Segue anterior à raiz do pulmão, entre o pericárdio fibroso e a pleura mediastinal, até o diafragma, que penetra para inervá-lo pela face inferior.',
    sensibilidade: 'Pericárdio, pleura mediastinal e diafragmática e peritônio da parte central do diafragma — por isso a irritação dessas áreas dói no ombro (dermátomo C4).',
    lesao: 'Lesão unilateral: paralisia e elevação da cúpula do diafragma do mesmo lado, com movimento paradoxal na inspiração. Lesão medular acima de C3 exige ventilação mecânica.',
    nota: 'O nervo frênico acessório (de C5, via nervo subclávio) existe em cerca de 1/3 das pessoas. O direito desce ao lado da veia cava superior; o esquerdo, sobre o ventrículo esquerdo.',
  }),
  nervo('n_suboccipital', 'Nervo suboccipital (C1)', 'N. suboccipitalis', 'cabeca', {
    paths: [{ pts: [[0.05, -0.61, -0.3], [0.13, -0.63, -0.42], [0.2, -0.66, -0.5]], r: 0.0055 }],
    ramos: [
      { m: 'reto_post_maior' }, { m: 'reto_post_menor' }, { m: 'obliquo_cabeca_sup' }, { m: 'obliquo_cabeca_inf' },
      { m: 'semiespinal_cabeca', obs: 'ramo inconstante' },
    ],
  }, {
    origem: 'Ramo posterior (dorsal) de C1.',
    trajeto: 'Sai entre o osso occipital e o arco posterior do atlas, acima da artéria vertebral, e entra no trígono suboccipital (limitado pelo reto posterior maior e pelos oblíquos superior e inferior da cabeça).',
    sensibilidade: 'É praticamente só motor: C1 em geral não tem raiz sensitiva.',
    nota: 'Comunica-se com o nervo occipital maior.',
  }),
  nervo('n_occipital_maior', 'Nervo occipital maior (C2)', 'N. occipitalis major', 'cabeca', {
    paths: [{ pts: [[0.12, -0.76, -0.4], [0.2, -0.79, -0.55], [0.19, -0.66, -0.64], [0.15, -0.5, -0.74], SK([0.14, -0.3, -0.95], -0.03), SK([0.15, 0.1, -1.0], -0.03), SK([0.16, 0.5, -0.88], -0.03)], r: 0.0055 }],
    ramos: [{ m: 'semiespinal_cabeca' }],
  }, {
    origem: 'Ramo medial do ramo posterior (dorsal) de C2.',
    trajeto: 'Emerge abaixo do oblíquo inferior da cabeça, contorna sua margem inferior, sobe cruzando o trígono suboccipital, perfura o semiespinal da cabeça e o trapézio perto da protuberância occipital externa e acompanha a artéria occipital até o vértice.',
    sensibilidade: 'Couro cabeludo da região occipital até o vértice.',
    lesao: 'Neuralgia occipital: dor em pontada na nuca e no couro cabeludo. O bloqueio é feito cerca de 2 cm lateral e 2 cm abaixo da protuberância occipital externa.',
  }),
  nervo('n_ramos_posteriores', 'Ramos posteriores dos nervos espinais', 'Rami posteriores nn. spinalium', ['cabeca', 'tronco'], {
    paths: DORSAL_PATHS,
    ramos: [
      { m: 'iliocostal_cervical' }, { m: 'iliocostal_toracico' }, { m: 'iliocostal_lombar' },
      { m: 'longuissimo_cabeca' }, { m: 'longuissimo_cervical' }, { m: 'longuissimo_toracico' }, { m: 'espinal_toracico' },
      { m: 'semiespinal_cabeca' }, { m: 'semiespinal_cervical' }, { m: 'semiespinal_toracico' }, { m: 'multifido' },
      { m: 'rotadores_cervicais' }, { m: 'rotadores_toracicos' }, { m: 'rotadores_lombares' },
      { m: 'interespinais_toracicos' }, { m: 'interespinais_lombares' }, { m: 'intertransversarios_med' },
      { m: 'esplenio_cabeca' }, { m: 'esplenio_pescoco' },
    ],
    labelAt: 0.5,
  }, {
    origem: 'Ramos posteriores (dorsais) dos nervos espinais de C3 a L5 (os de C1 e C2 têm fichas próprias).',
    trajeto: 'Logo após o forame intervertebral, cada nervo espinal dá um ramo posterior, que passa para trás junto à articulação dos processos articulares e se divide em ramo medial (transversoespinais, interespinais e a própria articulação) e ramo lateral (iliocostal, longuíssimo e esplênios). A inervação é segmentar.',
    sensibilidade: 'Pele do dorso numa faixa paravertebral (os ramos laterais lombares superiores — nervos clúnios superiores — chegam à nádega) e articulações dos processos articulares.',
    lesao: 'A denervação do ramo medial por radiofrequência é usada na dor das articulações dos processos articulares (dor facetária).',
    nota: 'Todos os músculos intrínsecos (“próprios”) do dorso são inervados por ramos posteriores. Os superficiais — trapézio, latíssimo, romboides — vieram do membro superior e recebem ramos anteriores.',
  }),

  /* ═════════════════════ Plexo braquial ═════════════════════ */
  nervo('n_plexo_braquial', 'Plexo braquial', 'Plexus brachialis', ['cabeca', 'tronco', 'membro_sup'], {
    paths: [
      // raízes C5–T1 (entre os escalenos anterior e médio)
      { pts: [foramen('C5'), [0.33, -1.27, -0.06], [0.46, -1.38, -0.05], BP.supTrunk], r: 0.013 },
      { pts: [foramen('C6'), [0.34, -1.42, -0.06], [0.47, -1.48, -0.05], BP.supTrunk], r: 0.014 },
      { pts: [foramen('C7'), [0.35, -1.58, -0.07], [0.5, -1.66, -0.07], BP.midTrunk], r: 0.014 },
      { pts: [foramen('C8'), [0.35, -1.72, -0.1], [0.48, -1.79, -0.09], BP.infTrunk], r: 0.014 },
      { pts: [foramen('T1'), [0.3, -1.84, -0.13], [0.45, -1.84, -0.1], BP.infTrunk], r: 0.013 },
      // troncos → divisões (atrás da clavícula) → fascículos (axila, atrás do peitoral menor)
      { pts: [BP.supTrunk, [0.7, -1.72, -0.03], BP.latDiv, [1.05, -2.15, 0.06], [1.22, -2.33, 0.11], BP.latCord], r: 0.016 },
      { pts: [BP.midTrunk, [0.78, -1.88, -0.04], BP.postDiv, [1.05, -2.2, 0.0], [1.2, -2.38, 0.03], BP.postCord], r: 0.016 },
      { pts: [BP.infTrunk, [0.7, -1.96, -0.06], BP.medDiv, [1.02, -2.26, 0.02], [1.17, -2.42, 0.06], BP.medCord], r: 0.016 },
      // divisões posteriores dos troncos superior e inferior para o fascículo posterior
      { pts: [[0.7, -1.72, -0.03], [0.85, -1.92, -0.05], BP.postDiv], r: 0.011 },
      { pts: [[0.7, -1.96, -0.06], [0.85, -2.02, -0.05], BP.postDiv], r: 0.011 },
      // raízes do mediano
      { pts: [BP.latCord, [1.35, -2.6, 0.1], BP.medianStart], r: 0.012 },
      { pts: [BP.medCord, [1.33, -2.63, 0.09], BP.medianStart], r: 0.012 },
    ],
    labelAt: 0.75,
  }, {
    origem: 'Ramos anteriores de C5, C6, C7, C8 e T1 (as “raízes”), às vezes com contribuição de C4 (plexo pré-fixado) ou de T2 (pós-fixado).',
    trajeto: 'As raízes saem entre os escalenos anterior e médio e formam os troncos superior (C5–C6), médio (C7) e inferior (C8–T1) no trígono posterior do pescoço, sobre a 1ª costela. Atrás da clavícula, cada tronco se divide em divisões anterior e posterior, que formam, na axila, os fascículos lateral, posterior e medial ao redor da artéria axilar, atrás do peitoral menor.',
    ramos: 'Das raízes: dorsal da escápula e torácico longo. Do tronco superior: supraescapular e nervo para o subclávio. Fascículo lateral: peitoral lateral, musculocutâneo e raiz lateral do mediano. Fascículo medial: peitoral medial, cutâneos medial do braço e do antebraço, ulnar e raiz medial do mediano. Fascículo posterior: subescapulares superior e inferior, toracodorsal, axilar e radial.',
    lesao: 'Erb-Duchenne (C5–C6; queda que afasta a cabeça do ombro, parto difícil): braço aduzido e rodado medialmente, cotovelo estendido e antebraço pronado (“gorjeta de garçom”). Klumpke (C8–T1; tração do braço para cima): mão em garra e, às vezes, síndrome de Horner.',
    nota: 'Os músculos são inervados pelos nervos que saem do plexo (fichas próprias). Sequência para lembrar: raízes, troncos, divisões, fascículos, ramos terminais.',
  }),
  nervo('n_dorsal_escapula', 'Nervo dorsal da escápula', 'N. dorsalis scapulae', 'tronco', {
    paths: [{ pts: [[0.25, -1.24, -0.08], [0.38, -1.3, -0.12], [0.5, -1.48, -0.3], { sec: 'rombo_menor', y: -2.0, x: 0.55, at: 'ant', d: 0.02 }, { sec: 'rombo_maior', y: -2.5, x: 0.55, at: 'ant', d: 0.02 }, { sec: 'rombo_maior', y: -3.05, x: 0.65, at: 'ant', d: 0.02 }], r: 0.005 }],
    ramos: [{ m: 'levantador_escapula' }, { m: 'rombo_menor' }, { m: 'rombo_maior' }],
  }, {
    origem: 'Raiz C5 do plexo braquial (com fibras de C4).',
    trajeto: 'Perfura o escaleno médio, passa profundamente ao levantador da escápula e desce ao longo da margem medial da escápula, sob os romboides, com a artéria dorsal da escápula.',
    lesao: 'Rara. A escápula do lado afetado se afasta da coluna (romboides fracos), com discreta escápula alada.',
  }),
  nervo('n_toracico_longo', 'Nervo torácico longo', 'N. thoracicus longus', 'tronco', {
    paths: [
      { pts: [[0.24, -1.25, -0.08], [0.4, -1.5, -0.14], [0.5, -1.75, -0.12]], r: 0.0045 },
      { pts: [[0.24, -1.4, -0.08], [0.42, -1.6, -0.13], [0.5, -1.75, -0.12]], r: 0.0045 },
      { pts: [[0.24, -1.55, -0.08], [0.42, -1.66, -0.08], [0.5, -1.75, -0.12]], r: 0.0045 },
      { pts: [[0.5, -1.75, -0.12], [0.68, -2.0, -0.14], [0.86, -2.3, -0.06], CAST('serratil_anterior', [1.9, -2.8, 0.05], [-1, 0, 0], 0.012), CAST('serratil_anterior', [1.9, -3.4, 0.1], [-1, 0, 0], 0.012), CAST('serratil_anterior', [1.9, -4.05, 0.15], [-1, 0, 0], 0.012)], r: 0.006 },
    ],
    ramos: [{ m: 'serratil_anterior' }],
  }, {
    origem: 'Raízes C5, C6 e C7 do plexo braquial.',
    trajeto: 'C5 e C6 atravessam o escaleno médio; C7 passa à frente dele. Unidos, descem atrás do plexo e dos vasos axilares e seguem pela face externa do serrátil anterior, na linha axilar média, dando um ramo para cada digitação.',
    lesao: 'É superficial na parede lateral do tórax (lesão em esvaziamento axilar, drenos, peso sobre o ombro): escápula alada medial — a margem medial descola do tórax ao empurrar a parede — e dificuldade de elevar o braço acima da horizontal.',
  }),
  nervo('n_supraescapular', 'Nervo supraescapular', 'N. suprascapularis', 'membro_sup', {
    paths: [{ pts: [[0.6, -1.58, -0.05], [0.8, -1.78, -0.2], [0.98, -2.04, -0.3], [1.0, -2.09, -0.33], CAST('escapula', [1.15, -1.4, -0.45], [0, -1, 0], 0.03), CAST('escapula', [1.3, -1.4, -0.45], [0, -1, 0], 0.03), [1.4, -2.24, -0.42], CAST('escapula', [1.2, -2.7, -1.6], [0, 0, 1], 0.025), CAST('escapula', [1.0, -2.9, -1.6], [0, 0, 1], 0.025)], r: 0.0065 }],
    ramos: [{ m: 'supraespinal' }, { m: 'infraespinal' }],
  }, {
    origem: 'Tronco superior do plexo braquial (C5–C6).',
    trajeto: 'Cruza o trígono posterior do pescoço, passa pela incisura da escápula sob o ligamento transverso superior da escápula (a artéria passa por cima), percorre a fossa supraespinal e contorna a incisura espinoglenoidal até a fossa infraespinal.',
    sensibilidade: 'Articulações do ombro e acromioclavicular.',
    lesao: 'Compressão na incisura da escápula (cisto, ligamento calcificado): fraqueza da abdução inicial e da rotação lateral e atrofia das fossas. Na incisura espinoglenoidal só o infraespinal é afetado (comum em jogadores de vôlei).',
    nota: 'Para lembrar a relação com a artéria: “o exército (artéria) passa por cima da ponte, a marinha (nervo) por baixo”.',
  }),
  nervo('n_subclavio', 'Nervo subclávio', 'N. subclavius', 'tronco', {
    paths: [{ pts: [[0.57, -1.54, -0.04], [0.62, -1.78, 0.02], [0.66, -1.98, 0.12]], r: 0.0035 }],
    ramos: [{ m: 'subclavio' }],
  }, {
    origem: 'Tronco superior do plexo braquial (C5–C6).',
    trajeto: 'Desce à frente do plexo e da artéria subclávia, atrás da clavícula, até o músculo subclávio.',
    nota: 'Pode dar o nervo frênico acessório.',
  }),
  nervo('n_peitoral_lateral', 'Nervo peitoral lateral', 'N. pectoralis lateralis', 'tronco', {
    paths: [{ pts: [[1.0, -2.1, 0.04], [1.0, -2.18, 0.22], { sec: 'peitoral_clav', y: -2.3, x: 0.9, at: 'post', d: 0.02 }, CAST('peitoral_esternocostal', [0.75, -2.7, 0.0], [0, 0, 1], 0.02)], r: 0.0055 }],
    ramos: [{ m: 'peitoral_clav' }, { m: 'peitoral_esternocostal', obs: 'parte superior' }],
  }, {
    origem: 'Fascículo lateral do plexo braquial (C5–C7).',
    trajeto: 'Atravessa a fáscia clavipeitoral acima do peitoral menor e penetra no peitoral maior pela face profunda, sobretudo na parte clavicular. Envia uma alça comunicante ao peitoral medial, levando fibras também ao peitoral menor.',
    nota: 'O nome indica a origem no fascículo lateral, não a posição: na parede do tórax ele fica medial ao nervo peitoral medial.',
  }),
  nervo('n_peitoral_medial', 'Nervo peitoral medial', 'N. pectoralis medialis', 'tronco', {
    paths: [{ pts: [[1.12, -2.36, 0.06], [1.12, -2.48, 0.2], [1.05, -2.62, 0.36], CAST('peitoral_esternocostal', [0.95, -2.95, 0.0], [0, 0, 1], 0.02), { sec: 'peitoral_abdominal', y: -3.45, x: 0.95, at: 'post', d: 0.02 }], r: 0.0055 }],
    ramos: [{ m: 'peitoral_menor' }, { m: 'peitoral_esternocostal', obs: 'parte inferior' }, { m: 'peitoral_abdominal' }],
  }, {
    origem: 'Fascículo medial do plexo braquial (C8–T1).',
    trajeto: 'Passa entre a artéria e a veia axilares, perfura o peitoral menor (que inerva) e termina na parte inferior do peitoral maior (esternocostal e abdominal).',
  }),
  nervo('n_subescapular_sup', 'Nervo subescapular superior', 'N. subscapularis superior', 'membro_sup', {
    paths: [{ pts: [[1.05, -2.2, 0.0], [1.06, -2.28, -0.08], CAST('subescapular', [1.1, -2.35, 0.6], [0, 0, -1], 0.02)], r: 0.004 }],
    ramos: [{ m: 'subescapular', obs: 'parte superior' }],
  }, {
    origem: 'Fascículo posterior do plexo braquial (C5–C6).',
    trajeto: 'Curto; entra na parte superior do subescapular pela face anterior.',
  }),
  nervo('n_toracodorsal', 'Nervo toracodorsal', 'N. thoracodorsalis', 'tronco', {
    paths: [{ pts: [[1.15, -2.32, 0.02], CAST('subescapular', [1.15, -2.7, 0.6], [0, 0, -1], 0.02), CAST('redondo_maior', [1.2, -3.1, 0.6], [0, 0, -1], 0.03), [1.3, -3.5, -0.4], [1.28, -3.95, -0.32]], r: 0.0055 }],
    ramos: [{ m: 'grande_dorsal' }],
  }, {
    origem: 'Fascículo posterior do plexo braquial (C6–C8), entre os dois nervos subescapulares.',
    trajeto: 'Desce pela parede posterior da axila, sobre o subescapular e o redondo maior, com a artéria toracodorsal, e entra na face profunda do latíssimo do dorso perto da sua margem anterior.',
    lesao: 'Pode ser lesado no esvaziamento axilar: fraqueza da adução e da extensão do braço (subir em corda, nadar). O latíssimo com este nervo é muito usado em retalhos de reconstrução mamária.',
  }),
  nervo('n_subescapular_inf', 'Nervo subescapular inferior', 'N. subscapularis inferior', 'membro_sup', {
    paths: [{ pts: [[1.2, -2.38, 0.03], { sec: 'subescapular', y: -2.75, x: 1.2, at: 'ant', d: 0.02 }, { sec: 'subescapular', y: -3.0, x: 1.15, at: 'ant', d: 0.02 }], r: 0.0045 }],
    ramos: [{ m: 'subescapular', obs: 'parte inferior' }, { m: 'redondo_maior' }],
  }, {
    origem: 'Fascículo posterior do plexo braquial (C5–C6).',
    trajeto: 'Desce pela face anterior do subescapular, inervando a sua parte inferior, e termina no redondo maior.',
  }),
  nervo('n_axilar', 'Nervo axilar', 'N. axillaris', 'membro_sup', {
    paths: [
      { pts: [BP.postCord, [1.42, -2.56, -0.12], [1.55, -2.6, -0.3], CAST('umero', [1.75, -2.55, -1.2], [0, 0, 1], 0.045), CAST('umero', [2.8, -2.5, -0.06], [-1, 0, 0], 0.05), CAST('umero', [1.8, -2.45, 1.2], [0, 0, -1], 0.05)], r: 0.008 },
      // nervo cutâneo lateral superior do braço
      { pts: [[1.62, -2.63, -0.32], [1.8, -2.82, -0.4], SK([1.98, -2.9, -0.25], -0.03)], r: 0.004 },
    ],
    ramos: [{ m: 'redondo_menor', path: 0, t: [0.25, 0.55] }, { m: 'delt_esp' }, { m: 'delt_acro' }, { m: 'delt_clav' }],
  }, {
    origem: 'Fascículo posterior do plexo braquial (C5–C6).',
    trajeto: 'Passa abaixo da articulação do ombro, atravessa o espaço quadrangular (redondo menor acima, redondo maior abaixo, cabeça longa do tríceps medialmente e colo cirúrgico do úmero lateralmente) com a artéria circunflexa posterior do úmero e contorna o colo cirúrgico por trás, sob o deltoide.',
    sensibilidade: 'Pele sobre a parte inferior do deltoide (nervo cutâneo lateral superior do braço) e articulação do ombro.',
    lesao: 'Fratura do colo cirúrgico do úmero ou luxação anterior do ombro: abdução fraca (perde-se após os primeiros 15°, feitos pelo supraespinal), atrofia do deltoide (ombro “quadrado”) e dormência na face lateral do ombro.',
  }),
  nervo('n_musculocutaneo', 'Nervo musculocutâneo', 'N. musculocutaneus', 'membro_sup', {
    paths: [
      { pts: [BP.latCord, [1.42, -2.6, 0.09], { sec: 'coracobraquial', y: -2.8, at: 'c' }, { between: ['biceps_curta', 'braquial'], y: -3.3, w: 0.2 }, { between: ['biceps_longa', 'braquial'], y: -3.9, w: 0.35 }, { between: ['biceps_longa', 'braquial'], y: -4.45, w: 0.4 }, { sec: 'biceps_longa', y: -4.75, at: 'lat', d: 0.03 }], r: 0.0075 },
      // nervo cutâneo lateral do antebraço
      { pts: [{ sec: 'biceps_longa', y: -4.75, at: 'lat', d: 0.03 }, SK([2.42, -5.3, 0.1], -0.04), SK([2.6, -6.3, 0.2], -0.04), SK([2.68, -7.0, 0.35], -0.035)], r: 0.004 },
    ],
    ramos: [{ m: 'coracobraquial', obs: 'atravessa o músculo' }, { m: 'biceps_curta' }, { m: 'biceps_longa' }, { m: 'braquial', obs: 'maior parte' }],
  }, {
    origem: 'Fascículo lateral do plexo braquial (C5–C7).',
    trajeto: 'Perfura o coracobraquial, desce entre o bíceps e o braquial — inervando os três — e emerge lateralmente ao tendão do bíceps, acima do cotovelo, como nervo cutâneo lateral do antebraço.',
    sensibilidade: 'Pele da face lateral do antebraço (nervo cutâneo lateral do antebraço).',
    lesao: 'Isolada é rara: flexão do cotovelo e supinação fracas (o braquiorradial e o supinador compensam em parte), reflexo bicipital diminuído e dormência na face lateral do antebraço.',
  }),
  nervo('n_radial', 'Nervo radial', 'N. radialis', 'membro_sup', {
    paths: [
      { pts: [BP.postCord, [1.4, -2.7, -0.05], [1.55, -2.92, -0.2], { sec: 'umero', y: -3.15, at: 'post-med', d: 0.035 }, { sec: 'umero', y: -3.5, at: 'post', d: 0.035 }, { sec: 'umero', y: -3.85, at: 'post-lat', d: 0.035 }, { sec: 'umero', y: -4.1, at: 'lat', d: 0.04 }, { between: ['braquial', 'braquiorradial'], y: -4.45 }, { between: ['braquial', 'braquiorradial'], y: -4.75, add: [0, 0, 0.04] }, [2.3, -4.92, -0.02]], r: 0.009 },
      // ramo superficial (sensitivo)
      { pts: [[2.3, -4.92, -0.02], { sec: 'braquiorradial', y: -5.5, at: 'med', d: 0.0 }, { between: ['braquiorradial', 'ecrl'], y: -6.2 }, SK([2.74, -6.85, 0.16], -0.04), SK([2.86, -7.5, 0.34], -0.03), SK([2.95, -7.78, 0.45], -0.03)], r: 0.0045 },
    ],
    ramos: [
      { m: 'triceps_longa', path: 0, t: [0.1, 0.45] }, { m: 'triceps_lateral', path: 0 }, { m: 'triceps_medial', path: 0 },
      { m: 'anconeo', path: 0 }, { m: 'braquiorradial', path: 0 }, { m: 'ecrl', path: 0 },
      { m: 'braquial', obs: 'parte lateral (pequena)', path: 0 },
    ],
  }, {
    origem: 'Fascículo posterior do plexo braquial (C5–T1). É o maior ramo do plexo.',
    trajeto: 'Passa atrás da artéria axilar, deixa a axila pelo intervalo triangular (abaixo do redondo maior, entre a cabeça longa do tríceps e o úmero) e espirala no sulco do nervo radial, na face posterior do úmero, entre as cabeças lateral e medial do tríceps, com a artéria braquial profunda. No terço distal perfura o septo intermuscular lateral e desce entre o braquial e o braquiorradial; à frente do epicôndilo lateral divide-se em ramo superficial (sensitivo) e ramo profundo (motor).',
    ramos: 'No braço: tríceps, ancôneo, braquiorradial, extensor radial longo do carpo e parte lateral do braquial; nervos cutâneos posterior do braço, lateral inferior do braço e posterior do antebraço. Ramo superficial: sob o braquiorradial até o dorso da mão. Ramo profundo: ficha própria.',
    sensibilidade: 'Face posterior do braço e do antebraço; dorso da mão do lado radial e dos 3½ dedos laterais até a falange média (área característica: 1º espaço interósseo dorsal).',
    lesao: 'Fratura da diáfise do úmero ou “paralisia do sábado à noite”: mão caída (punho e dedos não estendem), com o tríceps preservado, pois os seus ramos saem antes do sulco. Na axila (muletas), o tríceps também fica fraco.',
  }),
  nervo('n_interosseo_posterior', 'Ramo profundo do nervo radial (nervo interósseo posterior)', 'R. profundus n. radialis; N. interosseus antebrachii posterior', 'membro_sup', {
    paths: [{ pts: [[2.3, -4.92, -0.02], { between: ['braquiorradial', 'supinador'], y: -5.05 }, { sec: 'supinador', y: -5.2, at: 'lat', d: -0.025 }, { sec: 'supinador', y: -5.45, at: 'post-lat', d: -0.025 }, { between: ['ed', 'apl'], y: -5.85 }, { between: ['ed', 'apl'], y: -6.25 }, { between: ['ed', 'epl'], y: -6.7 }, [2.52, -7.18, 0.13]], r: 0.0065 }],
    ramos: [
      { m: 'ecrb' }, { m: 'supinador', obs: 'atravessa o músculo' }, { m: 'ed' }, { m: 'edm' }, { m: 'ecu' },
      { m: 'apl' }, { m: 'epb' }, { m: 'epl' }, { m: 'extensor_indicador' },
    ],
  }, {
    origem: 'Ramo profundo do nervo radial, que se separa à frente do epicôndilo lateral (C7–C8).',
    trajeto: 'Inerva o extensor radial curto do carpo e o supinador, entra no supinador sob a arcada de Frohse, contorna o colo do rádio dentro dele e emerge no compartimento posterior como nervo interósseo posterior, entre os extensores superficiais e profundos, descendo sobre a membrana interóssea até o punho.',
    sensibilidade: 'Só articular (punho e carpo); não tem território cutâneo.',
    lesao: 'Compressão na arcada de Frohse ou fratura da cabeça do rádio: dedos e polegar não estendem, mas o punho ainda estende com desvio radial (extensor radial longo preservado). Não há perda de sensibilidade.',
  }),
  nervo('n_mediano', 'Nervo mediano', 'N. medianus', 'membro_sup', {
    paths: [
      { pts: [BP.medianStart, { between: ['coracobraquial', 'triceps_longa'], y: -3.0, w: 0.25 }, { between: ['biceps_curta', 'triceps_medial'], y: -3.6, w: 0.4 }, { between: ['biceps_curta', 'triceps_medial'], y: -4.2, w: 0.4 }, { sec: 'braquial', y: -4.72, at: 'ant-med', d: 0.02 }, { between: ['pronador_redondo_h', 'pronador_redondo_u'], y: -5.15 }, { between: ['fds', 'fdp'], y: -5.6 }, { between: ['fds', 'fdp'], y: -6.2 }, { between: ['fds', 'fdp'], y: -6.8 }, { between: ['fcr', 'fds'], y: -7.1, w: 0.6 }, [2.56, -7.38, 0.42], [2.6, -7.58, 0.47]], r: 0.0095 },
      // ramo recorrente (tenar)
      { pts: [[2.6, -7.55, 0.47], [2.7, -7.52, 0.53], [2.78, -7.47, 0.58]], r: 0.004 },
      // nervos digitais palmares (polegar, indicador, médio e metade do anular)
      { pts: [[2.6, -7.58, 0.47], [2.78, -7.72, 0.6], SK([2.95, -7.9, 0.75], -0.03)], r: 0.0045 },
      { pts: [[2.6, -7.58, 0.47], [2.7, -7.85, 0.55], SK([2.82, -8.2, 0.72], -0.03)], r: 0.0045 },
      { pts: [[2.6, -7.58, 0.47], [2.6, -7.9, 0.54], SK([2.66, -8.25, 0.74], -0.03)], r: 0.0045 },
    ],
    ramos: [
      { m: 'pronador_redondo_h', path: 0 }, { m: 'pronador_redondo_u', path: 0 }, { m: 'fcr', path: 0 }, { m: 'palmar_longo', path: 0 }, { m: 'fds', path: 0 },
      { m: 'abdutor_polegar_curto', path: 1 }, { m: 'flexor_polegar_curto', obs: 'cabeça superficial', path: 1 }, { m: 'oponente_polegar', path: 1 },
      { m: 'lumbricais', obs: '1º e 2º lumbricais', path: 3 },
    ],
  }, {
    origem: 'Raízes lateral (fascículo lateral, C6–C7) e medial (fascículo medial, C8–T1), que se unem à frente da artéria axilar.',
    trajeto: 'Desce no braço junto à artéria braquial (primeiro lateral, depois medial a ela), sem ramos musculares no braço. Na fossa cubital fica medial ao tendão do bíceps e à artéria, passa entre as duas cabeças do pronador redondo e desce entre o flexor superficial e o flexor profundo dos dedos. No punho fica entre os tendões do flexor radial do carpo e do flexor superficial, sob o palmar longo, e passa pelo túnel do carpo.',
    ramos: 'Antebraço: pronador redondo, flexor radial do carpo, palmar longo e flexor superficial; nervo interósseo anterior (ficha própria); ramo cutâneo palmar. Mão: ramo recorrente (tenares) e nervos digitais palmares (1º e 2º lumbricais e pele).',
    sensibilidade: 'Palma do lado radial e face palmar dos 3½ dedos laterais, incluindo os leitos ungueais.',
    lesao: 'Síndrome do túnel do carpo: dormência noturna nos três primeiros dedos e atrofia tenar, com a palma poupada (o ramo cutâneo palmar passa por cima do retináculo). Lesão no cotovelo: “mão de bênção” ao tentar fechar a mão e perda da pronação.',
    nota: 'O ramo recorrente é superficial na eminência tenar e vulnerável em cortes (“nervo de um milhão de dólares”). Mnemônico dos músculos da mão inervados pelo mediano: LOAF (lumbricais 1–2, oponente, abdutor curto e flexor curto do polegar).',
  }),
  nervo('n_interosseo_anterior', 'Nervo interósseo anterior', 'N. interosseus antebrachii anterior', 'membro_sup', {
    paths: [{ pts: [{ between: ['pronador_redondo_h', 'pronador_redondo_u'], y: -5.25 }, { between: ['radio', 'ulna'], y: -5.8, add: [0, 0, 0.035] }, { between: ['radio', 'ulna'], y: -6.35, add: [0, 0, 0.035] }, { between: ['radio', 'ulna'], y: -6.9, add: [0, 0, 0.01] }], r: 0.005 }],
    ramos: [{ m: 'fdp', obs: 'parte lateral (dedos indicador e médio)' }, { m: 'fpl' }, { m: 'pronador_quadrado' }],
  }, {
    origem: 'Nervo mediano, logo abaixo do pronador redondo (C8–T1).',
    trajeto: 'Desce sobre a membrana interóssea entre o flexor profundo dos dedos e o flexor longo do polegar, com a artéria interóssea anterior, até a face profunda do pronador quadrado.',
    sensibilidade: 'Só articular (punho e carpo).',
    lesao: 'Não consegue fazer o sinal de “OK”: a pinça vira um “bico de pato”, pois as falanges distais do polegar e do indicador não fletem. Não há perda de sensibilidade.',
  }),
  nervo('n_ulnar', 'Nervo ulnar', 'N. ulnaris', 'membro_sup', {
    paths: [
      { pts: [BP.medCord, [1.4, -2.8, 0.0], { sec: 'triceps_medial', y: -3.3, at: 'med', d: 0.04 }, { sec: 'triceps_medial', y: -3.9, at: 'med', d: 0.025 }, { sec: 'triceps_medial', y: -4.4, at: 'med', d: 0.02 }, [1.76, -4.85, -0.26], { between: ['fcu_h', 'fcu_u'], y: -5.1 }, { between: ['fcu_h', 'fdp'], y: -5.7, add: [-0.02, 0, 0.02] }, { between: ['fcu_h', 'fdp'], y: -6.4, add: [-0.03, 0, 0.03] }, { sec: 'fcu_h', y: -7.1, at: 'lat', d: 0.03 }, [2.4, -7.4, 0.52]], r: 0.0085 },
      // ramo superficial (sensitivo) para o dedo mínimo e metade do anular
      { pts: [[2.4, -7.42, 0.52], [2.37, -7.62, 0.56], SK([2.3, -8.0, 0.66], -0.03)], r: 0.004 },
      // ramo cutâneo dorsal
      { pts: [{ between: ['fcu_h', 'fdp'], y: -6.6 }, SK([2.22, -7.0, 0.1], -0.04), SK([2.25, -7.6, 0.3], -0.03)], r: 0.004 },
    ],
    ramos: [{ m: 'fcu_h', path: 0 }, { m: 'fcu_u', path: 0 }, { m: 'fdp', obs: 'parte medial (dedos anular e mínimo)', path: 0 }],
  }, {
    origem: 'Fascículo medial do plexo braquial (C8–T1, às vezes C7).',
    trajeto: 'Desce medial à artéria braquial; no meio do braço perfura o septo intermuscular medial e passa atrás do epicôndilo medial (túnel cubital), sem dar ramos no braço. Entra no antebraço entre as cabeças do flexor ulnar do carpo e corre sob ele, sobre o flexor profundo dos dedos. No punho passa lateral ao pisiforme, superficial ao retináculo dos flexores, pelo canal ulnar (de Guyon), e se divide em ramos superficial e profundo.',
    ramos: 'Antebraço: flexor ulnar do carpo e metade medial do flexor profundo; ramos cutâneos palmar e dorsal. Ramo superficial: palmar curto e pele. Ramo profundo: ficha própria.',
    sensibilidade: 'Lado ulnar da mão: dedo mínimo e metade medial do anular, nas faces palmar e dorsal.',
    lesao: 'No cotovelo (“osso do cotovelo”, túnel cubital): formigamento no 4º e 5º dedos, atrofia dos interósseos e garra ulnar. Sinal de Froment: ao segurar um papel entre o polegar e o indicador, o polegar flete na falange distal (adutor fraco; o flexor longo compensa).',
    nota: 'Paradoxo ulnar: a garra é mais marcada na lesão no punho do que no cotovelo, porque nesta o flexor profundo dos dedos 4–5 também fica fraco.',
  }),
  nervo('n_ulnar_profundo', 'Ramo profundo do nervo ulnar', 'R. profundus n. ulnaris', 'membro_sup', {
    paths: [{ pts: [[2.4, -7.42, 0.52], { between: ['abdutor_minimo', 'flexor_minimo_curto'], y: -7.55 }, [2.47, -7.56, 0.49], [2.56, -7.63, 0.5], [2.66, -7.64, 0.5], [2.76, -7.64, 0.51], [2.85, -7.62, 0.53]], r: 0.0055 }],
    ramos: [
      { m: 'abdutor_minimo' }, { m: 'flexor_minimo_curto' }, { m: 'oponente_minimo' },
      { m: 'interosseos_dorsais' }, { m: 'interosseos_palmares' }, { m: 'lumbricais', obs: '3º e 4º lumbricais' },
      { m: 'adutor_polegar_obliquo' }, { m: 'adutor_polegar_transverso' }, { m: 'flexor_polegar_curto', obs: 'cabeça profunda' },
    ],
  }, {
    origem: 'Divisão do nervo ulnar no canal ulnar (de Guyon), junto ao pisiforme.',
    trajeto: 'Passa entre o abdutor e o flexor curto do dedo mínimo, atravessa o oponente do dedo mínimo, contorna o hâmulo do hamato e cruza a palma profundamente aos tendões flexores, junto ao arco palmar profundo, até o adutor do polegar e o 1º interósseo dorsal.',
    lesao: 'Compressão no canal de Guyon (ciclistas, ferramentas): fraqueza dos interósseos e do adutor do polegar e garra ulnar; a sensibilidade pode estar preservada se só o ramo profundo for lesado.',
    nota: 'Inerva todos os músculos intrínsecos da mão, exceto os do mediano (LOAF).',
  }),

  /* ═════════════════════ Tronco ═════════════════════ */
  nervo('n_intercostais', 'Nervos intercostais (T1–T6)', 'Nn. intercostales', 'tronco', {
    paths: [1, 2, 3, 4, 5, 6].map(intercostal),
    ramos: [
      { m: 'intercostal_ext' }, { m: 'intercostal_int' }, { m: 'intercostal_intimo' },
      { m: 'transverso_torax', obs: 'T2–T6' }, { m: 'serratil_post_sup', obs: 'T2–T5' },
    ],
    labelAt: 0.55,
  }, {
    origem: 'Ramos anteriores de T1 a T6 (o de T1 manda a maior parte das fibras ao plexo braquial).',
    trajeto: 'Cada nervo sai pelo forame intervertebral abaixo da vértebra de mesmo número, entra no espaço intercostal e corre no sulco da costela, abaixo da veia e da artéria (de cima para baixo: veia, artéria, nervo), entre os intercostais internos e íntimos. Termina perto do esterno como ramo cutâneo anterior.',
    ramos: 'Ramo colateral, ramo cutâneo lateral (linha axilar média) e ramo cutâneo anterior. O cutâneo lateral de T2 forma o nervo intercostobraquial (axila e face medial do braço).',
    sensibilidade: 'Pele do tórax em faixas (dermátomos; T4 no mamilo) e pleura parietal costal.',
    lesao: 'O herpes-zóster segue um dermátomo intercostal. Toracocentese e bloqueios são feitos junto à margem superior da costela de baixo, para não lesar o feixe vasculonervoso.',
  }),
  nervo('n_toracoabdominais', 'Nervos toracoabdominais (T7–T11)', 'Nn. thoracoabdominales', 'tronco', {
    paths: [7, 8, 9, 10, 11].map(thoracoabdominal),
    ramos: [
      { m: 'intercostal_ext' }, { m: 'intercostal_int' }, { m: 'intercostal_intimo' }, { m: 'serratil_post_inf', obs: 'T9–T11' },
      { m: 'reto_abdome' }, { m: 'obliquo_externo' }, { m: 'obliquo_interno' }, { m: 'transverso_abdome' },
      { m: 'diafragma', obs: 'sensibilidade da periferia', sens: true },
    ],
    labelAt: 0.6,
  }, {
    origem: 'Ramos anteriores de T7 a T11 (nervos intercostais inferiores).',
    trajeto: 'Correm nos espaços intercostais inferiores e, ao chegar à margem costal, passam para a parede do abdome entre o oblíquo interno e o transverso do abdome; penetram na bainha do reto pela face posterior e terminam como ramos cutâneos anteriores.',
    sensibilidade: 'Pele da parede abdominal em faixas (T7 no processo xifoide, T10 no umbigo), peritônio parietal e periferia do diafragma.',
    lesao: 'Incisões verticais na margem lateral do reto podem seccioná-los e denervar o músculo, favorecendo hérnias.',
  }),
  nervo('n_subcostal', 'Nervo subcostal (T12)', 'N. subcostalis', 'tronco', {
    paths: [{ pts: [foramen('T12'), ...smoothRib(RIB[12].slice(1)).map(groove), [0.98, -5.45, -0.05], SK([1.2, -5.85, 0.3], -0.22), SK([0.6, -6.25, 1.12], -0.2), SK([0.3, -6.45, 1.15], -0.14), SK([0.12, -6.5, 1.15], -0.04)], r: 0.008 }],
    ramos: [
      { m: 'reto_abdome' }, { m: 'piramidal' }, { m: 'obliquo_externo' }, { m: 'obliquo_interno' }, { m: 'transverso_abdome' },
      { m: 'quadrado_lombo', obs: 'fibras de T12' }, { m: 'serratil_post_inf' },
    ],
  }, {
    origem: 'Ramo anterior de T12.',
    trajeto: 'Corre abaixo da 12ª costela, passa atrás do rim e à frente do quadrado do lombo, perfura o transverso do abdome e segue entre ele e o oblíquo interno até o reto do abdome e o piramidal.',
    sensibilidade: 'Pele entre o umbigo e a sínfise púbica e, pelo ramo cutâneo lateral, a região da crista ilíaca e da nádega anterior.',
  }),
  nervo('n_ilio_hipogastrico', 'Nervo ílio-hipogástrico (L1)', 'N. iliohypogastricus', 'tronco', {
    paths: [{ pts: [foramen('L1'), { sec: 'psoas_maior', y: -5.2, at: 'lat', d: 0.02 }, [0.78, -5.48, -0.12], SK([1.3, -5.7, 0.1], -0.25), SK([1.18, -6.2, 0.6], -0.2), SK([0.8, -6.85, 0.98], -0.14), SK([0.3, -7.08, 1.05], -0.04)], r: 0.0065 }],
    ramos: [{ m: 'obliquo_interno' }, { m: 'transverso_abdome' }],
  }, {
    origem: 'Ramo anterior de L1 (com fibras de T12).',
    trajeto: 'Emerge da margem lateral do psoas maior, cruza à frente do quadrado do lombo (atrás do rim), perfura o transverso do abdome acima da crista ilíaca e corre entre ele e o oblíquo interno; perfura o oblíquo interno perto da espinha ilíaca anterossuperior e termina acima do anel inguinal superficial.',
    sensibilidade: 'Pele da região suprapúbica (ramo cutâneo anterior) e da parte lateral da nádega (ramo cutâneo lateral).',
    lesao: 'Pode ser lesado em incisões baixas (apendicectomia, Pfannenstiel): dormência suprapúbica e fraqueza da parede, com risco de hérnia.',
  }),
  nervo('n_ilioinguinal', 'Nervo ilioinguinal (L1)', 'N. ilioinguinalis', 'tronco', {
    paths: [{ pts: [foramen('L1'), { sec: 'psoas_maior', y: -5.4, at: 'lat', d: 0.02 }, [0.86, -5.78, -0.05], CAST('iliaco', [1.0, -6.05, 1.2], [0, 0, -1], 0.02), [1.15, -6.4, 0.5], SK([1.02, -6.72, 0.82], -0.16), SK([0.62, -7.05, 0.95], -0.1), SK([0.3, -7.45, 0.9], -0.04)], r: 0.0055 }],
    ramos: [{ m: 'obliquo_interno' }, { m: 'transverso_abdome' }],
  }, {
    origem: 'Ramo anterior de L1, abaixo do ílio-hipogástrico.',
    trajeto: 'Emerge da margem lateral do psoas, cruza o quadrado do lombo e o ilíaco, perfura o transverso e o oblíquo interno perto da espinha ilíaca anterossuperior e percorre o canal inguinal (lateral ao funículo espermático ou ao ligamento redondo), saindo pelo anel inguinal superficial.',
    sensibilidade: 'Pele da face medial superior da coxa, raiz do pênis e parte anterior do escroto (ou monte do púbis e lábio maior).',
    lesao: 'Neuralgia após hernioplastia inguinal (aprisionamento por tela ou sutura): dor que irradia para a virilha e o escroto ou lábio.',
  }),
  nervo('n_plexo_lombar', 'Plexo lombar — ramos musculares', 'Plexus lumbalis, rami musculares', 'tronco', {
    paths: [
      ...['L1', 'L2', 'L3', 'L4'].map((n) => ({ pts: [foramen(n), { sec: 'psoas_maior', y: DISC[n][0] - 0.12, at: 'c' }], r: 0.007 })),
      { pts: [foramen('L1'), [0.45, -5.05, -0.2], [0.62, -5.1, -0.25]], r: 0.004 },
      { pts: [foramen('L3'), [0.45, -5.7, -0.22], [0.62, -5.75, -0.27]], r: 0.004 },
    ],
    ramos: [{ m: 'psoas_maior', obs: 'L1–L3' }, { m: 'quadrado_lombo', obs: 'T12–L4' }, { m: 'intertransversarios_lat' }],
  }, {
    origem: 'Ramos anteriores de T12 e L1–L4, que formam o plexo lombar dentro do psoas maior.',
    trajeto: 'Ramos musculares curtos saem das raízes diretamente para o psoas maior (L1–L3), o quadrado do lombo (T12–L4) e os intertransversários laterais lombares.',
    ramos: 'O plexo lombar também forma os nervos ílio-hipogástrico, ilioinguinal, genitofemoral, cutâneo femoral lateral, femoral e obturatório (os do membro inferior ficam para a próxima etapa).',
  }),
  nervo('n_femoral', 'Nervo femoral', 'N. femoralis', 'tronco', {
    paths: [
      { pts: [{ sec: 'psoas_maior', y: -5.95, at: 'c' }, { sec: 'psoas_maior', y: -6.25, at: 'lat', d: 0.01 }, { between: ['psoas_maior', 'iliaco'], y: -6.6 }, { between: ['psoas_maior', 'iliaco'], y: -7.0 }, [0.86, -7.38, 0.46]], r: 0.0095 },
      ...['L2', 'L3', 'L4'].map((n) => ({ pts: [foramen(n), { sec: 'psoas_maior', y: -5.95, at: 'c' }], r: 0.006 })),
    ],
    ramos: [{ m: 'iliaco' }],
  }, {
    origem: 'Divisões posteriores dos ramos anteriores de L2, L3 e L4, dentro do psoas maior. É o maior ramo do plexo lombar.',
    trajeto: 'Emerge da margem lateral do psoas, desce no sulco entre o psoas e o ilíaco (dá os ramos do ilíaco) e passa sob o ligamento inguinal, lateral à artéria femoral, para a coxa.',
    lesao: 'Na pelve pode ser comprimido por hematoma do psoas (anticoagulação) ou lesado em cirurgias pélvicas: flexão do quadril fraca e perda da extensão do joelho.',
    nota: 'Na coxa inerva o quadríceps, o sartório e o pectíneo e dá o nervo safeno (membros inferiores: próxima etapa).',
  }),
  nervo('n_levantador_anus', 'Nervos do levantador do ânus e do coccígeo (S3–S5)', 'N. musculi levatoris ani; plexus coccygeus', 'tronco', {
    paths: [
      { pts: [[0.24, -6.85, -0.47], [0.3, -7.0, -0.45], CAST('iliococcigeo', [0.32, -6.6, -0.45], [0, -1, 0], 0.02), CAST('pubococcigeo', [0.22, -6.8, -0.2], [0, -1, 0], 0.02)], r: 0.004 },
      { pts: [[0.17, -7.05, -0.62], CAST('coccigeo', [0.26, -6.7, -0.62], [0, -1, 0], 0.02)], r: 0.0035 },
    ],
    ramos: [{ m: 'iliococcigeo' }, { m: 'pubococcigeo' }, { m: 'coccigeo', obs: 'S4–S5' }],
  }, {
    origem: 'Ramos diretos dos ramos anteriores de S3–S4 (nervo para o levantador do ânus) e de S4–S5 (coccígeo).',
    trajeto: 'Correm na face superior (pélvica) do diafragma da pelve e penetram o levantador do ânus e o coccígeo por cima.',
    lesao: 'Lesões no parto vaginal podem enfraquecer o assoalho pélvico, contribuindo para incontinência e prolapso.',
    nota: 'O levantador do ânus recebe também ramos do nervo pudendo (retal inferior e perineal) pela face inferior.',
  }),
  nervo('n_pudendo', 'Nervo pudendo', 'N. pudendus', 'tronco', {
    paths: [
      { pts: [[0.28, -6.6, -0.27], [0.4, -6.8, -0.45], [0.48, -6.98, -0.56], [0.47, -7.17, -0.57], [0.43, -7.42, -0.44], [0.36, -7.6, -0.28]], r: 0.0075 },
      { pts: [[0.24, -6.85, -0.47], [0.4, -6.87, -0.5]], r: 0.005 },
      { pts: [[0.17, -7.05, -0.62], [0.43, -6.97, -0.55]], r: 0.005 },
      // nervo retal inferior → esfíncter externo do ânus
      { pts: [[0.43, -7.45, -0.42], [0.25, -7.62, -0.52], [0.13, -7.7, -0.56]], r: 0.004 },
    ],
    ramos: [
      { m: 'esfincter_anal_ext', obs: 'nervo retal inferior' }, { m: 'perineo_superficial', obs: 'nervo perineal' },
      { m: 'pubococcigeo', obs: 'ramos retal inferior e perineal (face inferior)' },
    ],
  }, {
    origem: 'Ramos anteriores de S2, S3 e S4 (plexo sacral).',
    trajeto: 'Sai da pelve pelo forame isquiático maior abaixo do piriforme, contorna a espinha isquiática e o ligamento sacroespinal e reentra pelo forame isquiático menor no canal do pudendo (de Alcock), na parede lateral da fossa isquioanal, onde dá o nervo retal inferior, o nervo perineal e o nervo dorsal do pênis ou do clitóris.',
    sensibilidade: 'Períneo, ânus, escroto ou lábios e pênis ou clitóris.',
    lesao: 'O bloqueio do pudendo, junto à espinha isquiática, é usado no parto. Compressão no canal (ciclistas): dor e dormência perineal.',
  }),
];
