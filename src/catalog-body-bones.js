/** Esqueleto do tronco e do membro superior (malhas reais do BodyParts3D). */

const bone = (id, name, latin, region, partIds, d, extra = {}) => ({
  kind: 'osso',
  id,
  name,
  latin,
  layer: extra.layer ?? 'osso',
  region,
  parts: partIds.map((p) => ({ id: p, mat: extra.mat ?? 'bone' })),
  campos: [
    ['Localização', d.local],
    ['Articula-se com', d.artic],
    ['Estruturas principais', d.estruturas],
    ['Função e inserções', d.funcao],
  ],
  nota: d.nota,
});

const range = (prefix, a, b) => Array.from({ length: b - a + 1 }, (_, i) => `${prefix}${a + i}`);

export const BODY_BONES = [
  /* ───────── Tórax ───────── */
  bone('o_esterno', 'Esterno', 'Sternum', 'tronco', ['esterno_manubrio', 'esterno_corpo', 'esterno_xifoide'], {
    local: 'Parede torácica anterior, na linha mediana; formado por manúbrio, corpo e processo xifoide.',
    artic: 'Clavículas (articulação esternoclavicular) e cartilagens costais 1 a 7.',
    estruturas: 'Incisura jugular, ângulo do esterno (junção manúbrio-corpo, referência da 2ª costela), incisuras costais e processo xifoide.',
    funcao: 'Protege o coração e os grandes vasos. Dá origem ao peitoral maior, esternocleidomastóideo (cabeça esternal), esterno-hióideo e esternotireóideo; origem do transverso do tórax e do reto do abdome (xifoide).',
    nota: 'O ângulo do esterno é referência clínica: marca a 2ª costela e a bifurcação da traqueia (T4–T5).',
  }),
  bone('o_costelas_verdadeiras', 'Costelas verdadeiras (I–VII)', 'Costae verae', 'tronco', range('costela_', 1, 7), {
    local: 'Parede lateral do tórax; sete pares que se ligam ao esterno por cartilagens costais próprias.',
    artic: 'Vértebras torácicas (cabeça e tubérculo) e esterno, via cartilagem costal.',
    estruturas: 'Cabeça, colo, tubérculo, ângulo e corpo; sulco costal (feixe vasculonervoso) na margem inferior.',
    funcao: 'Formam a caixa torácica e se movem na respiração. Dão inserção aos intercostais, serrátil anterior, escalenos (1ª e 2ª costelas), peitorais e outros.',
    nota: 'A 1ª costela é a mais curta e larga; o tubérculo do escaleno anterior separa a veia subclávia da artéria subclávia.',
  }),
  bone('o_costelas_falsas', 'Costelas falsas (VIII–X)', 'Costae spuriae', 'tronco', range('costela_', 8, 10), {
    local: 'Parede lateral inferior do tórax; três pares cujas cartilagens se unem à cartilagem da costela imediatamente acima.',
    artic: 'Vértebras torácicas e cartilagens costais (formando o arco costal).',
    estruturas: 'Mesmas partes das costelas típicas, com cartilagens que se unem ao arco costal.',
    funcao: 'Completam a caixa torácica e protegem fígado, baço e estômago. Dão origem ao oblíquo externo, serrátil posterior inferior e diafragma.',
  }),
  bone('o_costelas_flutuantes', 'Costelas flutuantes (XI–XII)', 'Costae fluctuantes', 'tronco', range('costela_', 11, 12), {
    local: 'Extremidade inferior do tórax; dois pares sem ligação anterior com o esterno ou outras cartilagens.',
    artic: 'Apenas com as vértebras torácicas T11 e T12.',
    estruturas: 'Cabeça com uma única faceta e ponta cartilaginosa livre.',
    funcao: 'Protegem os rins posteriormente. A 12ª costela recebe o quadrado do lombo; o diafragma também se fixa nelas.',
    nota: 'A 12ª costela é referência na lombotomia e na palpação dos rins.',
  }),
  bone('o_cartilagens_costais', 'Cartilagens costais (1–7)', 'Cartilagines costales', 'tronco', range('cartilagem_costal_', 1, 7), {
    local: 'Entre as extremidades anteriores das costelas verdadeiras e o esterno.',
    artic: 'Costelas e esterno (articulações esternocostais).',
    estruturas: 'Cartilagem hialina que pode se calcificar com a idade.',
    funcao: 'Dão elasticidade à caixa torácica, permitindo a expansão respiratória. Dão inserção a peitorais, transverso do tórax, reto do abdome e diafragma.',
  }, { layer: 'cartilagem', mat: 'cartilage' }),
  bone('o_vertebras_toracicas', 'Vértebras torácicas (T1–T12)', 'Vertebrae thoracicae', 'tronco', range('vertebra_t', 1, 12), {
    local: 'Parte posterior do tórax; doze vértebras que sustentam as costelas.',
    artic: 'Entre si (discos intervertebrais e articulações dos processos articulares) e com as costelas (facetas costais).',
    estruturas: 'Corpos em forma de coração com fóveas costais, processos espinhosos longos e inclinados para baixo, processos transversos com fóvea costal.',
    funcao: 'Sustentam a caixa torácica e protegem a medula. Dão inserção a trapézio, romboides, latíssimo, eretores da espinha e outros músculos do dorso.',
    nota: 'A cifose torácica é a curvatura fisiológica desta região.',
  }),
  bone('o_vertebras_lombares', 'Vértebras lombares (L1–L5)', 'Vertebrae lumbales', 'tronco', range('vertebra_l', 1, 5), {
    local: 'Região lombar, entre o tórax e o sacro; as cinco maiores vértebras móveis.',
    artic: 'Entre si, com T12 e com o sacro (L5-S1).',
    estruturas: 'Corpos grandes e reniformes, processos espinhosos quadrangulares, processos costais (transversos) longos, processos mamilares e acessórios.',
    funcao: 'Suportam o peso do tronco. Dão inserção a psoas maior, quadrado do lombo, multífido e eretores da espinha; origem dos pilares do diafragma (L1–L3).',
    nota: 'A hérnia de disco mais comum ocorre em L4–L5 e L5–S1. A punção lombar é feita abaixo de L2.',
  }),
  bone('o_sacro', 'Sacro e cóccix', 'Os sacrum et os coccygis', 'tronco', ['sacro'], {
    local: 'Parte posterior da pelve; cinco vértebras sacrais fundidas com o cóccix na extremidade inferior.',
    artic: 'L5 (superiormente), ossos do quadril (articulações sacroilíacas) e cóccix.',
    estruturas: 'Promontório, asas, forames sacrais anteriores e posteriores, crista sacral mediana, hiato sacral e corno sacral.',
    funcao: 'Transmite o peso do tronco aos membros inferiores e protege os nervos sacrais. Dá origem a parte do glúteo máximo, do multífido e do piriforme.',
    nota: 'O hiato sacral é usado para a anestesia caudal.',
  }),
  bone('o_osso_quadril', 'Osso do quadril', 'Os coxae', 'tronco', ['osso_quadril'], {
    local: 'Lateral da pelve; resulta da fusão de ílio, ísquio e púbis.',
    artic: 'Sacro (sacroilíaca), osso do quadril oposto (sínfise púbica) e fêmur (articulação do quadril).',
    estruturas: 'Crista ilíaca, espinhas ilíacas ântero-superior e póstero-superior, acetábulo, túber isquiático, ramo púbico, forame obturado e incisura isquiática maior.',
    funcao: 'Forma a pelve óssea, sustenta as vísceras pélvicas e transmite o peso ao membro inferior. Dá origem/inserção ao oblíquo externo e interno, transverso do abdome, reto do abdome, quadrado do lombo, ilíaco e levantador do ânus.',
  }),
  bone('o_discos', 'Discos intervertebrais', 'Disci intervertebrales', 'tronco', ['discos_cervicais', 'discos_toracicos', 'discos_lombares'], {
    local: 'Entre os corpos das vértebras, do áxis ao sacro.',
    artic: 'Unem os corpos vertebrais adjacentes (sínfise cartilagínea).',
    estruturas: 'Núcleo pulposo (gelatinoso) central e ânulo fibroso (anéis de fibrocartilagem).',
    funcao: 'Amortecem cargas, dão mobilidade à coluna e mantêm a altura dos forames intervertebrais.',
    nota: 'Na hérnia de disco o núcleo pulposo extravasa pelo ânulo e pode comprimir uma raiz nervosa.',
  }, { layer: 'cartilagem', mat: 'cartilage' }),

  /* ───────── Cintura escapular e membro superior ───────── */
  bone('o_clavicula', 'Clavícula', 'Clavicula', 'membro_sup', ['clavicula'], {
    local: 'Entre o esterno e o acrômio; osso em forma de “S” itálico.',
    artic: 'Esterno (articulação esternoclavicular) e acrômio da escápula (articulação acromioclavicular).',
    estruturas: 'Extremidades esternal e acromial, corpo, tubérculo conoide e linha trapezóidea (ligamento coracoclavicular), sulco do subclávio.',
    funcao: 'Mantém o ombro afastado do tronco e transmite forças ao esqueleto axial. Dá origem/inserção a deltoide, trapézio, peitoral maior, subclávio e esternocleidomastóideo.',
    nota: 'É o osso mais fraturado na infância; a fratura típica ocorre no terço médio.',
  }),
  bone('o_escapula', 'Escápula', 'Scapula', 'membro_sup', ['escapula'], {
    local: 'Parede posterior do tórax, entre as costelas 2 a 7.',
    artic: 'Clavícula (acrômio), úmero (cavidade glenoidal) e, funcionalmente, o tórax (articulação escapulotorácica).',
    estruturas: 'Espinha, acrômio, processo coracoide, cavidade glenoidal, fossas supra, infraespinal e subescapular, ângulos superior e inferior, incisura da escápula.',
    funcao: 'Plataforma móvel do ombro. Dá origem/inserção a trapézio, rombóides, levantador, serrátil anterior, deltoide, manguito rotador, redondo maior, bíceps, tríceps (cabeça longa) e peitoral menor.',
    nota: 'O acrômio, a espinha e o ângulo inferior são facilmente palpáveis.',
  }),
  bone('o_umero', 'Úmero', 'Humerus', 'membro_sup', ['umero'], {
    local: 'Braço; osso longo entre a escápula e o antebraço.',
    artic: 'Escápula (ombro), rádio e ulna (cotovelo).',
    estruturas: 'Cabeça, colo anatômico e cirúrgico, tubérculos maior e menor, sulco intertubercular, tuberosidade deltóidea, sulco do nervo radial, epicôndilos medial e lateral, tróclea, capítulo, fossas olecraniana e coronóidea.',
    funcao: 'Suporta o braço e é local de inserção do deltoide, manguito rotador, peitoral maior, latíssimo, coracobraquial e braquial.',
    nota: 'O nervo radial contorna a diáfise; o axilar contorna o colo cirúrgico (fraturas podem lesá-los).',
  }),
  bone('o_radio', 'Rádio', 'Radius', 'membro_sup', ['radio'], {
    local: 'Antebraço, lado lateral (polegar).',
    artic: 'Úmero (capítulo), ulna (articulações radioulnares proximal e distal) e ossos do carpo (escafoide e semilunar).',
    estruturas: 'Cabeça, colo, tuberosidade do rádio, diáfise, processo estiloide e tubérculo dorsal (de Lister), incisura ulnar.',
    funcao: 'Gira em torno da ulna (pronação/supinação) e transmite a maior parte da carga do punho. Recebe bíceps, supinador, pronador redondo e braquiorradial.',
    nota: 'A fratura de Colles é a fratura distal do rádio mais comum.',
  }),
  bone('o_ulna', 'Ulna', 'Ulna', 'membro_sup', ['ulna'], {
    local: 'Antebraço, lado medial (dedo mínimo).',
    artic: 'Úmero (tróclea), rádio (articulações radioulnares) e disco articular do punho.',
    estruturas: 'Olécrano, processo coronoide, incisura troclear e radial, tuberosidade da ulna, cabeça e processo estiloide.',
    funcao: 'Forma a articulação principal do cotovelo (flexão e extensão) e serve de eixo para a rotação do rádio. Recebe tríceps, braquial, flexor profundo dos dedos e outros.',
    nota: 'O olécrano é o “ponto do cotovelo”; o nervo ulnar passa atrás do epicôndilo medial (“osso engraçado”).',
  }),
  bone('o_carpo', 'Ossos do carpo', 'Ossa carpi', 'membro_sup', ['carpo_escafoide', 'carpo_semilunar', 'carpo_piramidal', 'carpo_pisiforme', 'carpo_trapezio', 'carpo_trapezoide', 'carpo_capitato', 'carpo_hamato'], {
    local: 'Punho; oito ossos em duas fileiras.',
    artic: 'Rádio e disco articular (fileira proximal), metacarpais (fileira distal) e entre si.',
    estruturas: 'Fileira proximal: escafoide, semilunar, piramidal e pisiforme. Fileira distal: trapézio, trapezoide, capitato e hamato (com hâmulo).',
    funcao: 'Dão mobilidade e resistência ao punho; formam o túnel do carpo, por onde passam os tendões flexores e o nervo mediano.',
    nota: 'O escafoide é o osso do carpo mais fraturado; a fratura pode comprometer a irrigação do polo proximal (necrose avascular).',
  }),
  bone('o_metacarpais', 'Ossos metacarpais', 'Ossa metacarpi', 'membro_sup', range('metacarpal_', 1, 5), {
    local: 'Palma da mão; cinco ossos longos numerados do polegar ao dedo mínimo.',
    artic: 'Ossos do carpo (base) e falanges proximais (cabeça).',
    estruturas: 'Base, corpo e cabeça (os “nós” dos dedos ao fechar a mão).',
    funcao: 'Sustentam a palma. Dão inserção a extensores e flexores do carpo e aos músculos interósseos e tenar/hipotenar.',
    nota: 'A “fratura do boxeador” ocorre no colo do 5º metacarpal.',
  }),
  bone('o_falanges_mao', 'Falanges da mão', 'Phalanges manus', 'membro_sup', [
    'falange_proximal_polegar', 'falange_proximal_indicador', 'falange_proximal_medio', 'falange_proximal_anelar', 'falange_proximal_minimo',
    'falange_media_indicador', 'falange_media_medio', 'falange_media_anelar', 'falange_media_minimo',
    'falange_distal_polegar', 'falange_distal_indicador', 'falange_distal_medio', 'falange_distal_anelar', 'falange_distal_minimo',
  ], {
    local: 'Dedos; 14 ossos por mão (o polegar possui duas falanges; os demais dedos, três).',
    artic: 'Metacarpais (articulações metacarpofalângicas) e entre si (interfalângicas proximais e distais).',
    estruturas: 'Falanges proximal, média e distal, cada uma com base, corpo e cabeça; a distal termina na tuberosidade.',
    funcao: 'Garantem a preensão e o tato fino. Recebem os tendões extensores e flexores dos dedos.',
  }),
];
