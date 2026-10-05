/** Ligamentos, fáscias, glândulas, língua e pele. */

const lig = (id, name, latin, geom, d, extra = {}) => ({
  kind: 'ligamento',
  id,
  name,
  latin,
  layer: 'ligamento',
  ...geom,
  campos: [
    ['Origem', d.origem],
    ['Inserção', d.insercao],
    ['Função', d.funcao],
    ['Relações', d.relacoes],
  ],
  nota: d.nota,
  ...extra,
});

export const LIGAMENTS = [
  lig('lig_temporomandibular', 'Ligamento temporomandibular (lateral)', 'Lig. temporomandibulare', {
    proc: [{ kind: 'tube', pts: ['temp.tuberculo_articular', [0.52, -0.3, 0.16], 'mand.colo'], ref: [1, 0, 0], width: 0.075, thick: 0.014, taper: 'blunt' }],
  }, {
    origem: 'Tubérculo articular e processo zigomático do temporal.',
    insercao: 'Face lateral e posterior do colo da mandíbula.',
    funcao: 'Reforça lateralmente a cápsula da ATM; limita o deslocamento posterior do côndilo e a abertura excessiva.',
    relacoes: 'Recoberto pela glândula parótida; relacionado ao disco articular e ao músculo pterigóideo lateral.',
    nota: 'A luxação anterior da mandíbula (boca "travada" aberta) ocorre quando o côndilo ultrapassa o tubérculo articular.',
  }),
  lig('lig_estilomandibular', 'Ligamento estilomandibular', 'Lig. stylomandibulare', {
    proc: [{ kind: 'tube', pts: ['temp.estiloide', [0.4, -0.7, 0.07], [0.41, -0.8, 0.1]], ref: [1, 0, 0], width: 0.045, thick: 0.012, taper: 'blunt' }],
  }, {
    origem: 'Ápice do processo estiloide do temporal.',
    insercao: 'Margem posterior do ramo e ângulo da mandíbula.',
    funcao: 'Limita a protrusão excessiva da mandíbula.',
    relacoes: 'Espessamento da fáscia cervical profunda; separa a glândula parótida da submandibular.',
  }),
  lig('lig_esfenomandibular', 'Ligamento esfenomandibular', 'Lig. sphenomandibulare', {
    proc: [{ kind: 'tube', pts: ['esf.espinha', [0.35, -0.41, 0.15], 'mand.lingula'], ref: [0, 1, 0], width: 0.055, thick: 0.012, taper: 'blunt' }],
  }, {
    origem: 'Espinha do esfenoide.',
    insercao: 'Lígula da mandíbula (ao lado do forame da mandíbula).',
    funcao: 'Suspende a mandíbula e guia seus movimentos de abertura e fechamento (age como eixo "passivo").',
    relacoes: 'O nervo alveolar inferior e os vasos entram no forame da mandíbula medialmente a ele.',
  }),
  lig('rafe_pterigomandibular', 'Rafe pterigomandibular', 'Raphe pterygomandibularis', {
    proc: [{ kind: 'tube', pts: ['esf.hamulo', [0.26, -0.6, 0.4], 'mand.retromolar'], ref: [1, 0, 0], width: 0.04, thick: 0.012, taper: 'blunt' }],
  }, {
    origem: 'Hâmulo pterigóideo do esfenoide.',
    insercao: 'Extremidade posterior da linha milo-hióidea, próxima ao trígono retromolar da mandíbula.',
    funcao: 'Intersecção tendínea que une o bucinador (anteriormente) ao constritor superior da faringe (posteriormente).',
    relacoes: 'Ponto de referência na anestesia do nervo alveolar inferior.',
  }),
  lig('lig_palpebral_medial', 'Ligamento palpebral medial', 'Lig. palpebrale mediale', {
    proc: [
      { kind: 'tube', pts: ['max.crista_lacrimal_ant', [0.16, -0.16, 0.8], [0.19, -0.12, 0.81]], ref: [0, 0, 1], width: 0.028, thick: 0.014, taper: 'blunt', nf: 12 },
      { kind: 'tube', pts: ['max.crista_lacrimal_ant', [0.16, -0.22, 0.79], [0.19, -0.25, 0.8]], ref: [0, 0, 1], width: 0.028, thick: 0.014, taper: 'blunt', nf: 12 },
    ],
  }, {
    origem: 'Crista lacrimal anterior e processo frontal da maxila.',
    insercao: 'Extremidades mediais das placas tarsais superior e inferior.',
    funcao: 'Ancora as pálpebras ao rebordo orbital medial e mantém o saco lacrimal.',
    relacoes: 'Dá origem à parte palpebral do orbicular do olho; o saco lacrimal fica posteriormente a ele.',
    nota: 'Sua frouxidão causa deformidades do canto medial (telecanto).',
  }),
  lig('lig_palpebral_lateral', 'Ligamento palpebral lateral', 'Lig. palpebrale laterale', {
    proc: [
      { kind: 'tube', pts: ['zig.tuberculo_orbital', [0.46, -0.08, 0.73], [0.43, -0.11, 0.79]], ref: [0, 0, 1], width: 0.03, thick: 0.014, taper: 'blunt', nf: 12 },
      { kind: 'tube', pts: ['zig.tuberculo_orbital', [0.46, -0.16, 0.72], [0.42, -0.23, 0.78]], ref: [0, 0, 1], width: 0.03, thick: 0.014, taper: 'blunt', nf: 12 },
    ],
  }, {
    origem: 'Tubérculo orbital lateral (de Whitnall) do osso zigomático.',
    insercao: 'Extremidades laterais das placas tarsais.',
    funcao: 'Mantém as pálpebras junto ao globo ocular e forma o canto lateral do olho.',
    relacoes: 'Funde-se à rafe palpebral lateral do orbicular do olho.',
  }),
  lig('lig_retencao_zigomatico', 'Ligamentos de retenção da face (zigomático e mandibular)', 'Retinacula cutis (lig. zygomaticum e mandibulare)', {
    proc: [
      { kind: 'tube', pts: [[0.52, -0.31, 0.66], { a: 0.56, b: -0.31, proj: 'z+', inset: 0.012 }], ref: [0, 1, 0], width: 0.03, thick: 0.02, taper: 'blunt', nf: 8 },
      { kind: 'tube', pts: [[0.46, -0.4, 0.7], { a: 0.5, b: -0.4, proj: 'z+', inset: 0.012 }], ref: [0, 1, 0], width: 0.03, thick: 0.02, taper: 'blunt', nf: 8 },
      { kind: 'tube', pts: [[0.34, -0.96, 0.58], { a: 0.34, b: -1.0, proj: 'z+', inset: 0.012 }], ref: [1, 0, 0], width: 0.03, thick: 0.02, taper: 'blunt', nf: 8 },
      { kind: 'tube', pts: [[0.2, -1.0, 0.76], { a: 0.2, b: -1.04, proj: 'z+', inset: 0.012 }], ref: [1, 0, 0], width: 0.03, thick: 0.02, taper: 'blunt', nf: 8 },
    ],
  }, {
    origem: 'Periósteo do osso zigomático (ligamento zigomático ou de McGregor) e do corpo da mandíbula (ligamento mandibular).',
    insercao: 'Derme da pele da bochecha e do queixo, atravessando o plano músculo-aponeurótico (SMAS).',
    funcao: 'Fixam a pele aos ossos e sustentam os tecidos moles da face.',
    relacoes: 'O ramo zigomático do nervo facial passa próximo aos ligamentos zigomáticos.',
    nota: 'A frouxidão desses ligamentos com a idade contribui para a ptose da face (jowls e sulco nasolabial).',
  }, { label: false }),
  lig('lig_estilo_hioideo', 'Ligamento estilo-hióideo', 'Lig. stylohyoideum', { parts: [{ id: 'lig_estiloioideo_d', mat: 'ligament' }, { id: 'lig_estiloioideo_e', mat: 'ligament' }] }, {
    origem: 'Ápice do processo estiloide do temporal.',
    insercao: 'Corno menor do hioide.',
    funcao: 'Suspende o hioide ao crânio; é remanescente do 2º arco faríngeo.',
    relacoes: 'Pode calcificar-se, o que alonga o processo estiloide (síndrome de Eagle).',
  }),
  lig('lig_check', 'Ligamentos de contenção (check) dos retos', 'Ligamenta check m. recti', { parts: ['check_lat_d', 'check_lat_e', 'check_med_d', 'check_med_e'].map((id) => ({ id, mat: 'ligament' })) }, {
    origem: 'Bainhas dos músculos reto lateral e reto medial.',
    insercao: 'Rebordo orbital lateral (zigomático) e medial (osso lacrimal).',
    funcao: 'Limitam a ação dos retos lateral e medial, impedindo a rotação excessiva do globo ocular.',
    relacoes: 'Fundem-se à cápsula de Tenon (fáscia do bulbo).',
  }),
  lig('lig_alar', 'Ligamentos alares', 'Ligamenta alaria', {
    proc: [{ kind: 'tube', pts: ['axis.dente', 'occ.condilo'], ref: [0, 0, 1], width: 0.04, thick: 0.04, nf: 10, nc: 8 }],
  }, {
    origem: 'Lados do dente (processo odontoide) do áxis.',
    insercao: 'Face medial dos côndilos do occipital.',
    funcao: 'Limitam a rotação e a inclinação lateral da cabeça sobre o áxis.',
    relacoes: 'Estão posteriores ao dente e à membrana tectória.',
    nota: 'Sua lesão em acidentes (ex.: chicote) pode causar instabilidade craniocervical.',
  }),
];

const fascia = (id, name, latin, geom, d, extra = {}) => ({
  kind: 'fascia',
  id,
  name,
  latin,
  layer: 'fascia',
  ...geom,
  campos: [
    ['Localização', d.local],
    ['Fixação e continuidade', d.fixacao],
    ['Função', d.funcao],
  ],
  nota: d.nota,
  ...extra,
});

export const FASCIAS = [
  fascia('galea', 'Gálea aponeurótica', 'Galea aponeurotica (aponeurose epicrânica)', {
    proc: [
      { kind: 'sheet', proj: 'y+', inset: 0.04, thick: 0.01, minDepth: 0.006, nf: 32, nc: 14,
        A: [[-0.5, 0.52], [-0.25, 0.66], [0, 0.7], [0.25, 0.66], [0.5, 0.52]],
        B: [[-0.5, -0.72], [-0.25, -0.9], [0, -0.94], [0.25, -0.9], [0.5, -0.72]] },
    ],
  }, {
    local: 'Cobre a abóbada do crânio, entre os ventres frontal e occipital.',
    fixacao: 'Continua-se anteriormente com o ventre frontal, posteriormente com o occipital e lateralmente com a fáscia temporoparietal e os auriculares.',
    funcao: 'Transmite a tração entre os ventres e permite o deslizamento do couro cabeludo sobre o periósteo.',
    nota: 'Camada do "SCALP": Skin (pele), Connective tissue (tecido conjuntivo), Aponeurosis (gálea), Loose areolar tissue (tecido areolar frouxo) e Pericranium. O tecido frouxo explica o descolamento do couro cabeludo em traumas.',
  }, { paired: false }),
  fascia('fascia_temporal', 'Fáscia temporal', 'Fascia temporalis', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.028, thick: 0.008, minDepth: 0.006, nf: 24, nc: 14,
        A: [[0.56, 0.2], [0.4, 0.52], [0.12, 0.64], [-0.2, 0.57], [-0.4, 0.3], [-0.36, 0.04]],
        B: [[0.58, -0.17], [0.42, -0.22], [0.2, -0.24], [0.0, -0.2], [-0.2, -0.16], [-0.34, -0.1]] },
    ],
  }, {
    local: 'Reveste o músculo temporal, na fossa temporal.',
    fixacao: 'Linha temporal superior (acima) e arco zigomático (abaixo, em duas lâminas: superficial e profunda).',
    funcao: 'Protege e contém o músculo temporal; fornece área de origem para parte de suas fibras.',
    nota: 'Entre as duas lâminas inferiores há gordura e a artéria temporal média.',
  }),
  fascia('fascia_parotideomasseterica', 'Fáscia parotideomassetérica', 'Fascia parotideomasseterica', {
    proc: [
      { kind: 'sheet', proj: 'x+', inset: 0.034, thick: 0.008, minDepth: 0.006, nf: 24, nc: 14,
        A: [[0.5, -0.32], [0.34, -0.3], [0.16, -0.28], [-0.02, -0.22]],
        B: [[0.4, -0.88], [0.24, -0.93], [0.08, -0.92], [-0.06, -0.84]] },
    ],
  }, {
    local: 'Cobre a glândula parótida e o músculo masseter (parte do SMAS na bochecha).',
    fixacao: 'Arco zigomático (acima), margem inferior da mandíbula (abaixo); continua-se com o platisma e a fáscia temporoparietal.',
    funcao: 'Forma a cápsula da parótida e dá origem ao risório; transmite a tração dos músculos da mímica à pele.',
    nota: 'O SMAS (sistema músculo-aponeurótico superficial) é a camada tratada nos procedimentos de "lifting" facial.',
  }),
];

export const GLANDS = [
  {
    kind: 'glandula', id: 'parotida', name: 'Glândula parótida e ducto', latin: 'Glandula parotidea (ducto de Stensen)', layer: 'glandula',
    proc: [
      { kind: 'tube', pts: [{ a: 0.0, b: -0.24, proj: 'x+', inset: 0.1 }, { a: 0.05, b: -0.5, proj: 'x+', inset: 0.11 }, { a: -0.03, b: -0.78, proj: 'x+', inset: 0.1 }], ref: [1, 0, 0], width: 0.2, thick: 0.1, taper: 'blunt' },
      { kind: 'tube', pts: [{ a: 0.2, b: -0.47, proj: 'x+', inset: 0.075 }, { a: 0.45, b: -0.56, proj: 'x+', inset: 0.085 }, { a: 0.7, b: -0.69, proj: 'x+', inset: 0.1 }], ref: [1, 0, 0], width: 0.02, thick: 0.02, taper: 'blunt', nf: 14, nc: 6 },
    ],
    campos: [
      ['Localização', 'Região parotídea: anterior e inferior à orelha, sobre o masseter e posterior ao ramo da mandíbula.'],
      ['Estruturas internas', 'O nervo facial (VII) a atravessa dividindo-a em lobos superficial e profundo; também passam a veia retromandibular e a artéria carótida externa.'],
      ['Ducto', 'O ducto parotídeo (de Stensen) cruza o masseter, perfura o bucinador e se abre no vestíbulo da boca, junto ao segundo molar superior.'],
      ['Função', 'Maior glândula salivar: produz saliva serosa rica em amilase.'],
    ],
    nota: 'Na caxumba (parotidite) a glândula incha e provoca dor ao mastigar; cirurgias da parótida arriscam lesar o nervo facial.',
  },
  {
    kind: 'glandula', id: 'submandibular', name: 'Glândula submandibular', latin: 'Glandula submandibularis', layer: 'glandula',
    parts: [{ id: 'submandibular', mat: 'gland' }],
    campos: [
      ['Localização', 'Trígono submandibular, abaixo do corpo da mandíbula.'],
      ['Ducto', 'Ducto submandibular (de Wharton), que se abre na carúncula sublingual.'],
      ['Inervação', 'Fibras parassimpáticas do nervo facial (via corda do tímpano e gânglio submandibular).'],
      ['Função', 'Produz saliva mista (serosa e mucosa).'],
    ],
    nota: 'É o local mais comum de cálculos salivares (sialolitíase).',
  },
  {
    kind: 'glandula', id: 'sublingual', name: 'Glândula sublingual', latin: 'Glandula sublingualis', layer: 'glandula',
    parts: [{ id: 'sublingual', mat: 'gland' }],
    campos: [
      ['Localização', 'Assoalho da boca, sob a língua, acima do milo-hióideo.'],
      ['Ductos', 'Pequenos ductos sublinguais (de Rivinus) e ducto de Bartholin.'],
      ['Inervação', 'Fibras parassimpáticas do nervo facial (via corda do tímpano).'],
      ['Função', 'Produz saliva predominantemente mucosa.'],
    ],
  },
  {
    kind: 'estrutura', id: 'lingua', name: 'Língua', latin: 'Lingua', layer: 'glandula',
    parts: [{ id: 'lingua', mat: 'tongue' }],
    campos: [
      ['Localização', 'Assoalho da cavidade oral.'],
      ['Músculos', 'Extrínsecos (genioglosso, hioglosso, estiloglosso, palatoglosso) e intrínsecos.'],
      ['Inervação', 'Motora: hipoglosso (XII). Sensitiva geral: lingual (V3) e glossofaríngeo; gustação: corda do tímpano (VII) e IX.'],
      ['Função', 'Mastigação, deglutição, fala e gustação.'],
    ],
    nota: 'O modelo mostra apenas o volume da língua; os músculos intrínsecos não são individualizados.',
  },
];

export const SKIN = {
  kind: 'estrutura', id: 'pele', name: 'Pele da face', latin: 'Cutis faciei', layer: 'pele',
  parts: [{ id: 'pele', mat: 'skin' }, { id: 'sobrancelha', mat: 'brow' }],
  campos: [
    ['Camadas', 'Epiderme, derme e hipoderme (tecido subcutâneo com gordura).'],
    ['Particularidades', 'É fina e muito vascularizada; muitos músculos da mímica inserem-se diretamente na derme, o que forma as rugas de expressão.'],
    ['Inervação sensitiva', 'Ramos do trigêmeo: oftálmico (V1), maxilar (V2) e mandibular (V3).'],
    ['Função', 'Proteção, termorregulação, sensibilidade e comunicação por expressões.'],
  ],
  nota: 'Use o controle de opacidade da pele para ver as camadas profundas.',
};
