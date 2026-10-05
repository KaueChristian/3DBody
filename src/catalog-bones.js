/** Ossos, dentes, cartilagens, globo ocular — malhas reais do BodyParts3D. */

const bone = (id, name, latin, parts, d, extra = {}) => ({
  kind: 'osso',
  id,
  name,
  latin,
  layer: 'osso',
  parts: parts.map((p) => ({ id: p, mat: 'bone' })),
  campos: [
    ['Localização', d.local],
    ['Articula-se com', d.artic],
    ['Estruturas principais', d.estruturas],
    ['Função e inserções', d.funcao],
  ],
  nota: d.nota,
  ...extra,
});

export const BONES = [
  bone('o_frontal', 'Osso frontal', 'Os frontale', ['frontal'], {
    local: 'Fronte e teto das órbitas; osso ímpar do neurocrânio.',
    artic: 'Parietais (sutura coronal), esfenoide, etmoide, nasais, lacrimais, maxilas e zigomáticos.',
    estruturas: 'Escama frontal, glabela, arcos superciliares, margem supraorbital (incisura/forame supraorbital), linhas temporais, processo zigomático, seios frontais e espinha nasal.',
    funcao: 'Protege os lobos frontais e forma o teto da órbita. Dá origem ao corrugador do supercílio e ao depressor do supercílio, e fixa-se à fáscia temporal pela linha temporal superior.',
    nota: 'O nervo supraorbital (V1) sai pela incisura supraorbital: ponto de dor à palpação na sinusite frontal.',
  }),
  bone('o_parietal', 'Ossos parietais', 'Ossa parietalia', ['parietal_d', 'parietal_e'], {
    local: 'Laterais e teto do crânio; dois ossos quadriláteros.',
    artic: 'Frontal (sutura coronal), occipital (sutura lambdóidea), parietal oposto (sutura sagital), temporal (sutura escamosa) e esfenoide (asa maior).',
    estruturas: 'Túber parietal, linhas temporais superior e inferior, sulcos da artéria meníngea média, forame parietal e sulco do seio sagital superior.',
    funcao: 'Protegem o encéfalo. A linha temporal inferior dá origem ao músculo temporal; a superior, à fáscia temporal.',
    nota: 'O ponto de junção entre sagital e coronal é o bregma; entre sagital e lambdóidea, o lambda.',
  }),
  bone('o_occipital', 'Osso occipital', 'Os occipitale', ['occipital'], {
    local: 'Base e parte posterior do crânio; osso ímpar.',
    artic: 'Parietais, temporais, esfenoide e atlas (côndilos occipitais).',
    estruturas: 'Forame magno, côndilos occipitais, protuberância occipital externa, linhas nucais (suprema, superior e inferior), canal do hipoglosso e parte basilar (clivo).',
    funcao: 'Transmite a medula e as artérias vertebrais; apoia o crânio sobre o atlas. Dá origem ao ventre occipital do occipitofrontal e inserção a vários músculos da nuca.',
  }),
  bone('o_temporal', 'Ossos temporais', 'Ossa temporalia', ['temporal_d', 'temporal_e'], {
    local: 'Parte lateral e inferior do crânio; contêm a orelha média e interna.',
    artic: 'Parietal, occipital, esfenoide, zigomático e mandíbula (articulação temporomandibular).',
    estruturas: 'Escama, processo zigomático (forma o arco zigomático), fossa mandibular e tubérculo articular, meato acústico externo, processo mastoide, processo estiloide e parte petrosa.',
    funcao: 'Alojam o aparelho auditivo e vestibular e formam a ATM. A mastoide recebe o esternocleidomastóideo; o arco zigomático dá origem ao masseter; a fossa temporal ao músculo temporal; a incisura mastóidea ao ventre posterior do digástrico; o processo estiloide a ligamentos e músculos estilo-hióideo.',
    nota: 'O nervo facial (VII) atravessa o osso temporal e sai pelo forame estilomastóideo.',
  }),
  bone('o_esfenoide', 'Osso esfenoide', 'Os sphenoidale', ['esfenoide'], {
    local: 'Centro da base do crânio, em forma de morcego; osso ímpar.',
    artic: 'Frontal, etmoide, occipital, parietais, temporais, zigomáticos, palatinos e vômer.',
    estruturas: 'Corpo com sela turca e seios esfenoidais; asas menores e maiores; canal óptico, fissuras orbitais, forames redondo, oval e espinhoso; processos pterigoides (lâminas medial e lateral, hâmulo pterigóideo).',
    funcao: 'Abriga a hipófise e conecta ossos do crânio e da face. As lâminas pterigoides dão origem aos músculos pterigóideos medial e lateral; a asa maior, ao pterigóideo lateral (cabeça superior).',
    nota: 'O forame oval transmite o nervo mandibular (V3); o redondo, o maxilar (V2).',
  }),
  bone('o_etmoide', 'Osso etmoide', 'Os ethmoidale', ['etmoide'], {
    local: 'Entre as órbitas e a cavidade nasal; osso ímpar muito frágil.',
    artic: 'Frontal, esfenoide, maxilas, lacrimais, palatinos, conchas nasais inferiores e vômer.',
    estruturas: 'Lâmina cribriforme (nervos olfatórios), crista galli, lâmina perpendicular (septo nasal), conchas nasais superior e média, lâmina orbital (papirácea) e células etmoidais.',
    funcao: 'Forma parte do septo, das paredes laterais do nariz e da parede medial da órbita; filtra e condiciona o ar.',
  }),
  bone('o_maxila', 'Maxilas', 'Maxillae', ['maxila_d', 'maxila_e'], {
    local: 'Terço médio da face; formam a maxila superior, parte da órbita, do nariz e do palato.',
    artic: 'Frontal, nasal, lacrimal, etmoide, zigomático, palatino, concha nasal inferior, vômer e maxila oposta.',
    estruturas: 'Corpo com seio maxilar; processos frontal, zigomático, alveolar e palatino; forame infraorbital; fossa canina; espinha nasal anterior; túber da maxila.',
    funcao: 'Contêm os dentes superiores. Dão origem ao levantador do lábio superior, levantador do lábio superior e da asa do nariz, nasal, depressor do septo, levantador do ângulo da boca, bucinador e parte do orbicular do olho.',
    nota: 'O nervo infraorbital (V2) emerge pelo forame infraorbital; a sinusite maxilar causa dor na região da maçã do rosto.',
  }),
  bone('o_mandibula', 'Mandíbula', 'Mandibula', ['mandibula'], {
    local: 'Osso da parte inferior da face; o único osso móvel do crânio.',
    artic: 'Ossos temporais, pela articulação temporomandibular (ATM).',
    estruturas: 'Corpo, protuberância mentual, forame mentual, linha oblíqua, ângulo, ramo, processo coronoide, côndilo (cabeça e colo), incisura da mandíbula, forame e lígula da mandíbula, canal mandibular e fóvea pterigóidea.',
    funcao: 'Mastigação e fala. Recebe o masseter, o temporal (coronoide), os pterigóideos, o platisma, os abaixadores do lábio e do ângulo da boca, o mentual, o bucinador, o milo-hióideo, o gênio-hióideo e o digástrico.',
    nota: 'O nervo alveolar inferior (V3) percorre o canal mandibular; fraturas do colo são comuns em traumas no queixo.',
  }),
  bone('o_zigomatico', 'Ossos zigomáticos', 'Ossa zygomatica', ['zigomatico_d', 'zigomatico_e'], {
    local: 'Maçãs do rosto; formam a parede lateral e parte do assoalho da órbita.',
    artic: 'Frontal, esfenoide, maxila e temporal (arco zigomático).',
    estruturas: 'Processos frontal, temporal e maxilar; forames zigomaticofacial e zigomaticotemporal; tubérculo orbital lateral.',
    funcao: 'Dão contorno à face. Origem do masseter e dos zigomáticos maior e menor; o tubérculo orbital lateral recebe o ligamento palpebral lateral.',
  }),
  bone('o_nasal', 'Ossos nasais', 'Ossa nasalia', ['nasal_d', 'nasal_e'], {
    local: 'Ponte do nariz; dois pequenos ossos retangulares.',
    artic: 'Frontal, etmoide (lâmina perpendicular), maxila (processo frontal), nasal oposto e cartilagens nasais laterais.',
    estruturas: 'Face externa convexa com forame nasal, face interna com sulco etmoidal.',
    funcao: 'Sustentam o dorso nasal. O prócero e o nasal fixam-se à sua fáscia.',
    nota: 'São os ossos da face mais frequentemente fraturados.',
  }),
  bone('o_lacrimal', 'Ossos lacrimais', 'Ossa lacrimalia', ['lacrimal_d', 'lacrimal_e'], {
    local: 'Parede medial da órbita; os menores ossos da face.',
    artic: 'Frontal, etmoide, maxila e concha nasal inferior.',
    estruturas: 'Crista lacrimal posterior e sulco lacrimal; forma, com a maxila, a fossa do saco lacrimal.',
    funcao: 'Alojam o saco lacrimal e conduzem a lágrima ao ducto nasolacrimal. A parte lacrimal do orbicular do olho (músculo de Horner) origina-se da crista lacrimal posterior.',
  }),
  bone('o_palatino', 'Ossos palatinos', 'Ossa palatina', ['palatino_d', 'palatino_e'], {
    local: 'Parte posterior do palato duro e da parede lateral da cavidade nasal; em forma de L.',
    artic: 'Maxila, esfenoide, etmoide, concha nasal inferior, vômer e palatino oposto.',
    estruturas: 'Lâminas horizontal e perpendicular; processos piramidal, orbital e esfenoidal; forames palatinos maior e menores.',
    funcao: 'Completam o palato duro e separam a boca da cavidade nasal.',
  }),
  bone('o_vomer', 'Vômer', 'Vomer', ['vomer'], {
    local: 'Parte posteroinferior do septo nasal; osso ímpar.',
    artic: 'Etmoide, esfenoide, maxilas, palatinos e cartilagem do septo nasal.',
    estruturas: 'Asa do vômer e margem posterior livre (separa as coanas).',
    funcao: 'Divide a cavidade nasal em duas metades.',
  }),
  bone('o_concha_inferior', 'Conchas nasais inferiores', 'Conchae nasales inferiores', ['concha_d', 'concha_e'], {
    local: 'Parede lateral da cavidade nasal, abaixo das conchas do etmoide.',
    artic: 'Maxila, lacrimal, etmoide e palatino.',
    estruturas: 'Lâmina enrolada com processos maxilar, lacrimal e etmoidal.',
    funcao: 'Aumentam a superfície mucosa para aquecer, umidificar e filtrar o ar inspirado.',
  }),
  bone('o_hioide', 'Osso hioide', 'Os hyoideum', ['hioide'], {
    local: 'Região anterior do pescoço, acima da laringe; osso em "U".',
    artic: 'Não se articula diretamente com outros ossos — é suspenso por músculos e ligamentos (estilo-hióideo).',
    estruturas: 'Corpo, cornos maiores e cornos menores.',
    funcao: 'Apoia a língua e a laringe. Recebe os músculos supra e infra-hióideos (milo-hióideo, gênio-hióideo, digástrico, estilo-hióideo).',
    nota: 'Sua fratura é um achado clássico na estrangulação.',
  }),
  bone('o_atlas', 'Atlas (C1)', 'Atlas (vertebra cervicalis I)', ['atlas'], {
    local: 'Primeira vértebra cervical; um anel sem corpo.',
    artic: 'Côndilos do occipital (articulação atlantoccipital) e áxis (articulações atlantoaxiais).',
    estruturas: 'Arcos anterior e posterior, massas laterais, processos transversos e forames transversários.',
    funcao: 'Sustenta o crânio e permite o movimento de flexão e extensão ("sim").',
  }),
  bone('o_axis', 'Áxis (C2)', 'Axis (vertebra cervicalis II)', ['axis'], {
    local: 'Segunda vértebra cervical.',
    artic: 'Atlas (superiormente) e C3 (inferiormente).',
    estruturas: 'Dente (processo odontoide), corpo, arco vertebral e processo espinhoso bífido.',
    funcao: 'O dente serve de pivô para a rotação do atlas e da cabeça (movimento de "não").',
    nota: 'A fratura do dente do áxis é grave por risco de lesão medular.',
  }),
  bone('o_cervicais', 'Vértebras cervicais C3–C7', 'Vertebrae cervicales III–VII', ['cervicais'], {
    local: 'Coluna cervical, abaixo do áxis.',
    artic: 'Entre si por discos intervertebrais e articulações dos processos articulares.',
    estruturas: 'Corpos pequenos, forames transversários (artéria vertebral), processos espinhosos bífidos (C3–C5); a C7 tem processo espinhoso proeminente.',
    funcao: 'Sustentam a cabeça e protegem a medula; dão inserção aos músculos do pescoço.',
  }),
  bone('o_dentes_sup', 'Dentes superiores', 'Dentes maxillares', ['dentes_sup'], {
    local: 'Arcada alveolar da maxila.',
    artic: 'Fixam-se aos alvéolos por gonfose (ligamento periodontal).',
    estruturas: 'Coroa, colo e raiz; esmalte, dentina, polpa e cemento. O modelo mostra 14 dentes (sem terceiros molares): incisivos centrais e laterais, caninos, pré-molares e molares.',
    funcao: 'Apreensão, corte e trituração do alimento; participam da fala e da estética.',
    nota: 'Fórmula dentária permanente por hemiarcada: 2 incisivos, 1 canino, 2 pré-molares, 3 molares.',
  }, { mat: 'tooth' }),
  bone('o_dentes_inf', 'Dentes inferiores', 'Dentes mandibulares', ['dentes_inf'], {
    local: 'Arcada alveolar da mandíbula.',
    artic: 'Fixam-se aos alvéolos por gonfose (ligamento periodontal).',
    estruturas: 'Coroa, colo e raiz; esmalte, dentina, polpa e cemento. O modelo mostra 14 dentes (sem terceiros molares).',
    funcao: 'Mastigação e fala; ocluem com os dentes superiores.',
  }, { mat: 'tooth' }),
];

export const OTHER_STRUCTURES = [
  {
    kind: 'estrutura', id: 'globo_ocular', name: 'Globo ocular', latin: 'Bulbus oculi', layer: 'orbita',
    parts: [
      { id: 'esclera_d', mat: 'sclera' }, { id: 'esclera_e', mat: 'sclera' },
      { id: 'cornea_d', mat: 'cornea' }, { id: 'cornea_e', mat: 'cornea' },
      { id: 'iris_d', mat: 'iris' }, { id: 'iris_e', mat: 'iris' },
      { id: 'cristalino_d', mat: 'lens' }, { id: 'cristalino_e', mat: 'lens' },
    ],
    campos: [
      ['Localização', 'Órbita, envolvido por gordura orbitária e movido pelos músculos extraoculares.'],
      ['Camadas', 'Túnica fibrosa (esclera e córnea), túnica vascular (corioide, corpo ciliar e íris) e túnica interna (retina).'],
      ['Meios transparentes', 'Córnea, humor aquoso, cristalino e corpo vítreo.'],
      ['Função', 'Capta a luz e forma a imagem na retina; o cristalino ajusta o foco (acomodação) e a íris regula a entrada de luz.'],
    ],
    nota: 'Os músculos retos e oblíquos inserem-se na esclera; o nervo óptico (II) sai pela parte posterior do globo.',
  },
  {
    kind: 'estrutura', id: 'tarsos', name: 'Placas tarsais', latin: 'Tarsi palpebrarum', layer: 'orbita',
    parts: ['tarsal_sup_d', 'tarsal_sup_e', 'tarsal_inf_d', 'tarsal_inf_e'].map((id) => ({ id, mat: 'ligament' })),
    campos: [
      ['Localização', 'Dentro das pálpebras superior e inferior (a superior é maior).'],
      ['Fixação', 'Ligamentos palpebrais medial e lateral, e aponeurose do levantador da pálpebra superior.'],
      ['Estruturas', 'Tecido fibroso denso com as glândulas tarsais (de Meibômio).'],
      ['Função', 'Dão forma e firmeza às pálpebras.'],
    ],
    nota: 'O terçol e o calázio são inflamações das glândulas tarsais.',
  },
  {
    kind: 'estrutura', id: 'cartilagem_nasal', name: 'Cartilagens nasais', latin: 'Cartilagines nasi', layer: 'cartilagem',
    parts: [{ id: 'cartilagem_nasal', mat: 'cartilage' }],
    campos: [
      ['Componentes', 'Cartilagem do septo, cartilagens laterais (direita e esquerda) e cartilagens alares maiores.'],
      ['Localização', 'Dois terços inferiores do nariz, abaixo dos ossos nasais.'],
      ['Função', 'Dão forma e flexibilidade ao nariz e mantêm as narinas abertas.'],
    ],
    nota: 'O músculo nasal (parte alar) e o depressor do septo atuam sobre as cartilagens alares.',
  },
  {
    kind: 'estrutura', id: 'orelha', name: 'Cartilagem da orelha', latin: 'Cartilago auriculae', layer: 'cartilagem',
    parts: [{ id: 'orelha', mat: 'cartilage' }],
    campos: [
      ['Localização', 'Orelha externa (pavilhão auricular).'],
      ['Estruturas', 'Hélice, anti-hélice, trago, antitrago, concha e lóbulo (sem cartilagem).'],
      ['Função', 'Capta e direciona as ondas sonoras ao meato acústico externo.'],
    ],
    nota: 'Os músculos auriculares (superior, anterior e posterior) fixam-se a ela.',
  },
];
