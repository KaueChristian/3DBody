/**
 * Órgãos dos sentidos e tegumentar (F6.3): túnicas e meios internos do bulbo do olho, aparelho lacrimal,
 * anexos da órbita, cartilagens nasais individualizadas, lábios e orelha externa, média e interna.
 *
 * As estruturas do olho, da órbita, do aparelho lacrimal, das cartilagens nasais e dos lábios têm malhas reais
 * do BodyParts3D (`dist/anatomy-sense.js`, CC BY-SA 2.1 JP). O meato acústico externo, a membrana timpânica,
 * os ossículos da audição (martelo, bigorna e estribo), a tuba auditiva, a cóclea e o vestíbulo com os canais
 * semicirculares não existem no banco e são modelados por código (`proc`) sobre as coordenadas medidas no osso
 * temporal, nos músculos tensor do tímpano e estapédio e nos nervos vestibulococlear e corda do tímpano; a ficha
 * declara `ESQUEMA` na nota.
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.);
 * Netter — Atlas de anatomia humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 */
import { bone } from './catalog-body-bones.js';

const C = 'cabeca';

/** Cria os pontos de uma espiral cônica de 2,5 voltas para a cóclea esquerda (x > 0). */
function spiralCoclea() {
  // Do fundo do meato acústico interno / base da cóclea [0.255, -0.335, -0.032] até a cúpula (ápice)
  // voltada anterolateralmente [0.305, -0.325, 0.008], ao redor do eixo do modíolo.
  const pts = [];
  const turns = 2.5;
  const steps = 22;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * turns * Math.PI * 2;
    const r = 0.022 * (1 - 0.68 * t);
    const cx = 0.262 + 0.038 * t;
    const cy = -0.336 + 0.010 * t;
    const cz = -0.032 + 0.036 * t;
    // vetores ortogonais ao eixo aproximado [0.72, 0.18, 0.67]
    const ux = -0.67, uy = 0.0, uz = 0.74;
    const vx = -0.13, vy = 0.98, vz = -0.12;
    const c = Math.cos(ang), s = Math.sin(ang);
    pts.push([
      +(cx + r * (c * ux + s * vx)).toFixed(4),
      +(cy + r * (c * uy + s * vy)).toFixed(4),
      +(cz + r * (c * uz + s * vz)).toFixed(4),
    ]);
  }
  return pts;
}

const sense = (id, name, latin, layer, parts, color, mat, d, extra = {}) => ({
  kind: extra.kind ?? 'estrutura',
  id,
  name,
  latin,
  layer,
  region: C,
  color,
  ...(parts ? { parts: parts.map((p) => ({ id: p, mat })) } : { mat }),
  campos: [
    ['Localização', d.local],
    ['Estrutura', d.estrutura],
    ['Relações e inervação', d.relacoes],
    ['Função e clínica', d.clinica],
  ],
  nota: d.nota,
  ...extra,
});

export const SENSE_ITEMS = [
  /* ═════════════════════ Bulbo do olho: túnica vascular, retina e câmaras ═════════════════════ */
  sense('corioide', 'Corioide (coroide)', 'Choroidea', 'orbita', ['corioide'], '#9e3b42', 'viscera', {
    local: 'Parte posterior da túnica vascular do bulbo do olho (úvea), situada entre a esclera (por fora) e a retina (por dentro), do nervo óptico até a ora serrata.',
    estrutura: 'Membrana fina, intensamente vascularizada e pigmentada (rica em melanócitos), formada pela lâmina supracorioidea, pela lâmina vascular, pela lâmina coriocapilar (que nutre os fotorreceptores) e pela lâmina basal (membrana de Bruch).',
    relacoes: 'Continua-se anteriormente com o corpo ciliar na altura da ora serrata; é perfurada posteriormente pelo nervo óptico e pelas artérias e nervos ciliares curtos e longos, e drenada pelas quatro veias vorticosas para as veias oftálmicas.',
    clinica: 'Nutre a parte externa da retina e absorve a luz dispersa, evitando reflexos dentro do olho. O reflexo vermelho do fundo de olho (“olho vermelho” em fotos) vem da corioide; o descolamento de retina separa a retina neural do epitélio pigmentado junto à corioide.',
    nota: 'Com o corpo ciliar e a íris, forma a túnica vascular do olho (úvea); a inflamação desse conjunto é a uveíte.',
  }, {
    relacionados: ['esclera', 'retina', 'corpo_ciliar', 'iris', 'arteria_oftalmica'],
  }),

  sense('corpo_ciliar', 'Corpo ciliar', 'Corpus ciliare', 'orbita', ['corpo_ciliar'], '#b54d52', 'viscera', {
    local: 'Espessamento anular da túnica vascular do olho, entre a ora serrata (onde continua a corioide) e a margem periférica da íris.',
    estrutura: 'Compreende a coroa ciliar (anterior, pregueada em cerca de 70 processos ciliares que secretam o humor aquoso), o orbiculo ciliar (posterior, liso) e o músculo ciliar (fibras lisas meridionais, radiais e circulares).',
    relacoes: 'Prende-se ao cristalino pelas fibras da zônula ciliar. O músculo ciliar recebe inervação parassimpática do nervo oculomotor (III), via gânglio ciliar e nervos ciliares curtos; a sensibilidade geral vem do nervo nasociliar (V1).',
    clinica: 'Dupla função essencial: o músculo ciliar realiza a acomodação visual (ao contrair, relaxa a zônula e deixa o cristalino mais convexo para visão de perto) e os processos ciliares produzem o humor aquoso, cuja pressão elevada caracteriza o glaucoma.',
    nota: 'A malha do BodyParts3D representa o anel do corpo ciliar; o músculo ciliar também possui ficha própria na camada de músculos da órbita.',
  }, {
    relacionados: ['corioide', 'iris', 'zonula_ciliar', 'cristalino', 'camara_anterior_olho', 'ciliar', 'esclera'],
  }),

  sense('zonula_ciliar', 'Zônula ciliar (ligamento suspensor do cristalino)', 'Zonula ciliaris', 'orbita', ['zonula_ciliar'], '#e6d39a', 'ligament', {
    local: 'Anel de fibras microfibrilares na câmara posterior do olho, estendido entre os processos do corpo ciliar e a cápsula do equador do cristalino.',
    estrutura: 'Conjunto de delicadas fibras zonulares (de Zinn), ricas em fibrilina, que mantêm o cristalino suspenso e centrado no eixo óptico.',
    relacoes: 'Banhada pelo humor aquoso da câmara posterior, fica logo à frente da fossa hialoidea do corpo vítreo e atrás da íris.',
    clinica: 'Transmite ao cristalino a ação do músculo ciliar: em repouso (visão de longe), a zônula fica tensa e achata o cristalino; quando o músculo ciliar contrai (visão de perto), a zônula afrouxa e o cristalino arredonda. Na síndrome de Marfan (defeito na fibrilina), a zônula enfraquece e provoca subluxação do cristalino (ectopia lentis).',
  }, {
    relacionados: ['corpo_ciliar', 'cristalino', 'ciliar', 'corpo_vitreo', 'iris'],
  }),

  sense('retina', 'Retina (parte óptica)', 'Retina, pars optica', 'orbita', ['retina'], '#e89c54', 'viscera', {
    local: 'Túnica interna (nervosa) do bulbo do olho, estendida da papila (disco) do nervo óptico até a ora serrata, entre a corioide e o corpo vítreo.',
    estrutura: 'Formada por duas lâminas embrionárias: o estrato pigmentoso (externo, colado à corioide) e o estrato nervoso (interno, com cones, bastonetes, células bipolares e células ganglionares cujos axônios formam o nervo óptico). No polo posterior ficam a mácula lútea e a fóvea central (máxima acuidade visual); medialmente a ela, o disco óptico (ponto cego, sem fotorreceptores).',
    relacoes: 'Suprida nas camadas internas pela artéria central da retina (ramo da oftálmica que entra pelo nervo óptico) e nas camadas externas (fotorreceptores) pela coriocapilar da corioide.',
    clinica: 'Converte a luz em impulsos nervosos (fototransdução) levados pelo nervo óptico (II). No descolamento de retina, o estrato nervoso se separa do estrato pigmentoso; a oclusão da artéria central da retina causa cegueira súbita indolor, e a retinopatia diabética ou hipertensiva é avaliada diretamente pela fundoscopia.',
    nota: 'A parte cega da retina (pars caeca) continua adiante da ora serrata revestindo a face interna do corpo ciliar e da íris.',
  }, {
    relacionados: ['corioide', 'corpo_vitreo', 'esclera', 'arteria_oftalmica'],
  }),

  sense('corpo_vitreo', 'Corpo vítreo', 'Corpus vitreum', 'orbita', ['corpo_vitreo'], '#b8e0ec', 'vitreo', {
    local: 'Preenche a câmara postrema (vítrea) do bulbo do olho, nos quatro quintos posteriores do globo, entre a face posterior do cristalino e a retina.',
    estrutura: 'Massa gelatinosa avascular e transparente (99 % de água com rede de colágeno e ácido hialurônico — o humor vítreo), envolvida pela membrana vítrea e escavada na frente pela fossa hialoidea (onde repousa o cristalino).',
    relacoes: 'Atrás e nos lados, apoia a retina contra a corioide; na frente, relaciona-se com o cristalino, a zônula ciliar e o corpo ciliar. No feto, é atravessado pelo canal hialoideo (de Cloquet), por onde passava a artéria hialoidea.',
    clinica: 'Transmite a luz até a retina e mantém a forma esférica do globo ocular e a aposição da retina. Com o envelhecimento, a liquefação do gel produz opacidades móveis (“moscas volantes”, miodesopsias) e o descolamento do vítreo posterior pode tracionar a retina.',
    nota: 'Ao contrário do humor aquoso, o humor vítreo não é renovado continuamente.',
  }, {
    relacionados: ['retina', 'cristalino', 'zonula_ciliar', 'corpo_ciliar', 'esclera'],
  }),

  sense('camara_anterior_olho', 'Câmara anterior do bulbo do olho (humor aquoso)', 'Camera anterior bulbi oculi', 'orbita', ['camara_anterior_olho'], '#c8edf5', 'vitreo', {
    local: 'Espaço do segmento anterior do bulbo do olho situado entre a face posterior da córnea (na frente) e a íris e a pupila (atrás).',
    estrutura: 'Preenchida pelo humor aquoso, líquido claro secretado pelos processos ciliares na câmara posterior (entre a íris e o cristalino), que passa pela pupila para a câmara anterior e drena no ângulo iridocorneano pela rede trabecular para o seio venoso da esclera (canal de Schlemm).',
    relacoes: 'Comunica-se através da pupila com a câmara posterior do olho; na periferia forma o ângulo iridocorneano, entre a limbo da córnea, a base da íris e o corpo ciliar.',
    clinica: 'O humor aquoso nutre a córnea e o cristalino (ambos avasculares) e mantém a pressão intraocular (10 a 21 mmHg). A obstrução da drenagem no ângulo iridocorneano eleva a pressão intraocular e lesa o nervo óptico (glaucoma de ângulo aberto ou fechado); sangue na câmara anterior é o hifema, e pus, o hipópio.',
  }, {
    relacionados: ['cornea', 'iris', 'cristalino', 'corpo_ciliar', 'esclera'],
  }),

  /* ═════════════════════ Anexos da órbita: anel tendíneo e tróclea ═════════════════════ */
  sense('anel_tendineo_comum', 'Anel tendíneo comum (de Zinn)', 'Anulus tendineus communis', 'orbita', ['anel_tendineo_comum'], '#f1da8c', 'ligament', {
    local: 'Ápice da órbita, circundando o canal óptico e a parte medial da fissura orbital superior, no osso esfenoide.',
    estrutura: 'Espessamento fibroso do periósteo orbitário (periórbita) que serve de origem tendínea comum aos quatro músculos retos do bulbo do olho (superior, inferior, medial e lateral).',
    relacoes: 'Passam por dentro do anel: o nervo óptico (II) e a artéria oftálmica (pelo canal óptico), e as divisões superior e inferior do nervo oculomotor (III), o nervo abducente (VI) e o nervo nasociliar (V1) (pela fissura orbital superior). Passam por fora do anel: os nervos troclear (IV), frontal (V1), lacrimal (V1) e a veia oftálmica superior.',
    clinica: 'Marco cirúrgico e anatômico fundamental do ápice orbitário: na síndrome do ápice orbitário ou na neurite óptica retrobulbar, a dor ao movimentar o olho decorre da tração dos músculos retos sobre a bainha dural do nervo óptico, intimamente aderida ao anel.',
  }, {
    relacionados: ['reto_sup', 'reto_inf', 'reto_med', 'reto_lat', 'levantador_palpebra', 'obliquo_sup', 'o_esfenoide', 'arteria_oftalmica'],
  }),

  sense('troclea_obliquo_superior', 'Tróclea do músculo oblíquo superior', 'Trochlea musculi obliqui superioris', 'orbita', ['troclea_obliquo_superior'], '#9fc3c9', 'cartilage', {
    local: 'Ângulo superomedial da órbita, presa à fóvea (ou espinha) troclear da parte orbital do osso frontal, poucos milímetros atrás da margem supraorbital.',
    estrutura: 'Pequena polia fibrocartilaginosa em forma de U, revestida por bainha sinovial, pela qual desliza o tendão redondo do músculo oblíquo superior.',
    relacoes: 'Ao passar pela tróclea, o tendão do oblíquo superior muda bruscamente de direção — dirige-se para trás, para baixo e lateralmente, passando sob o reto superior até inserir-se no quadrante posterossuperior da esclera. O nervo supratroclear e o infratroclear passam acima e abaixo dela.',
    clinica: 'Funciona como a origem funcional (polia mecânica) do oblíquo superior, explicando por que esse músculo abaixa, abduz e intorciona o olho. A tenossinovite ou o encarceramento do tendão na tróclea causa a síndrome de Brown (incapacidade de elevar o olho em adução).',
  }, {
    relacionados: ['obliquo_sup', 'o_frontal', 'esclera', 'reto_sup'],
  }),

  /* ═════════════════════ Aparelho lacrimal ═════════════════════ */
  sense('glandula_lacrimal', 'Glândula lacrimal', 'Glandula lacrimalis', 'orbita', ['glandula_lacrimal'], '#dca35e', 'gland', {
    local: 'Fossa da glândula lacrimal, no ângulo superolateral da órbita (parte orbital do osso frontal), acima do músculo reto lateral.',
    estrutura: 'Glândula exócrina serosa túbulo-acinar, com cerca de 2 cm, dividida pela expansão lateral da aponeurose do músculo levantador da pálpebra superior em parte orbital (maior, superior) e parte palpebral (menor, inferior), de onde saem 8 a 12 dúctulos excretores para o fórnice superior da conjuntiva.',
    relacoes: 'Irrigada pela artéria lacrimal (ramo da oftálmica). A inervação sensitiva é do nervo lacrimal (V1); a secretomotora parassimpática nasce no núcleo lacrimal do nervo facial (VII), segue pelo nervo petroso maior até o gânglio pterigopalatino e chega à glândula pelos nervos zigomático (V2) e lacrimal (V1).',
    clinica: 'Produz a camada aquosa do filme lacrimal (rica em lisozima e IgA), que umedece e protege a córnea a cada piscar. A dacrioadenite é a inflamação da glândula; na síndrome de Sjögren e nas lesões do facial proximais ao gânglio geniculado ocorre olho seco (ceratoconjuntivite seca).',
  }, {
    kind: 'glandula',
    relacionados: ['lago_lacrimal', 'canaliculos_lacrimais', 'saco_lacrimal', 'ducto_nasolacrimal', 'levantador_palpebra', 'reto_lat', 'o_frontal', 'arteria_oftalmica'],
  }),

  sense('lago_lacrimal', 'Lago lacrimal', 'Lacus lacrimalis', 'orbita', ['lago_lacrimal'], '#7fb8d8', 'viscera', {
    local: 'Ângulo medial (canto interno) do olho, no recesso triangular delimitado pelas margens livres das pálpebras superior e inferior.',
    estrutura: 'Pequeno espaço conjuntival que abriga a carúncula lacrimal (elevação rosada de pele modificada com glândulas sebáceas e sudoríparas) e, lateralmente a ela, a prega semilunar da conjuntiva.',
    relacoes: 'Nas margens palpebrais que o limitam erguem-se as papilas lacrimais superior e inferior, cada qual com o ponto lacrimal voltado para o lago, de onde partem os canalículos lacrimais.',
    clinica: 'Reservatório onde a lágrima se acumula após banhar a superfície ocular de lateral para medial, impulsionada pelo músculo orbicular do olho, antes de ser aspirada pelos pontos e canalículos lacrimais.',
  }, {
    relacionados: ['glandula_lacrimal', 'canaliculos_lacrimais', 'saco_lacrimal', 'orbicular_olho', 'tarsos'],
  }),

  sense('canaliculos_lacrimais', 'Canalículos lacrimais', 'Canaliculi lacrimales', 'orbita', ['canaliculos_lacrimais'], '#6fa8c9', 'viscera', {
    local: 'Canto medial das pálpebras superior e inferior, entre os pontos lacrimais (nas papilas lacrimais) e a parede lateral do saco lacrimal.',
    estrutura: 'Dois pequenos túbulos (superior e inferior) de cerca de 8 a 10 mm, cada um com um curto segmento vertical (2 mm, com uma ampola) e um segmento horizontal mais longo (8 mm) que converge medialmente, muitas vezes unindo-se num canalículo comum antes do saco lacrimal.',
    relacoes: 'Correm dentro da margem medial das pálpebras, envolvidos pelas fibras da parte lacrimal do músculo orbicular do olho (músculo de Horner), atrás do ligamento palpebral medial.',
    clinica: 'Drenam a lágrima do lago lacrimal para o saco lacrimal: ao piscar, a contração do orbicular do olho comprime os canalículos e dilata o saco, funcionando como uma bomba lacrimal. A laceração palpebral medial exige reconstrução microcirúrgica do canalículo para evitar epífora (lacrimejamento constante).',
  }, {
    relacionados: ['lago_lacrimal', 'saco_lacrimal', 'ducto_nasolacrimal', 'glandula_lacrimal', 'orbicular_olho'],
  }),

  sense('saco_lacrimal', 'Saco lacrimal', 'Saccus lacrimalis', 'orbita', ['saco_lacrimal'], '#5d97ba', 'viscera', {
    local: 'Fossa do saco lacrimal, na parede anteromedial da órbita, formada pelo sulco lacrimal do osso lacrimal e pelo processo frontal da maxila.',
    estrutura: 'Porção superior dilatada do ducto nasolacrimal, com cerca de 12 mm de altura e fundo cego superior (fórnice do saco lacrimal), revestida por epitélio colunar pseudoestratificado.',
    relacoes: 'Fica entre as cristas lacrimais anterior (maxila) e posterior (osso lacrimal), atrás do ligamento palpebral medial e à frente da parte lacrimal do músculo orbicular do olho. Recebe lateralmente os canalículos lacrimais e continua para baixo como ducto nasolacrimal.',
    clinica: 'A obstrução do ducto nasolacrimal retém lágrima e muco no saco, predispondo à dacriocistite (infecção aguda dolorosa e avermelhada abaixo do canto medial do olho); trata-se por sondagem ou dacriocistorrinostomia (abertura direta do saco para a cavidade nasal).',
  }, {
    relacionados: ['canaliculos_lacrimais', 'ducto_nasolacrimal', 'lago_lacrimal', 'glandula_lacrimal', 'o_lacrimal', 'o_maxila', 'orbicular_olho'],
  }),

  sense('ducto_nasolacrimal', 'Ducto nasolacrimal', 'Ductus nasolacrimalis', 'orbita', ['ducto_nasolacrimal'], '#4f88ab', 'viscera', {
    local: 'Canal ósseo nasolacrimal, escavado entre a maxila, o osso lacrimal e a concha nasal inferior, ligando o saco lacrimal ao meato nasal inferior.',
    estrutura: 'Tubo membranáceo de cerca de 18 mm de comprimento que desce um pouco para trás e lateralmente; na abertura inferior, sob a concha nasal inferior, apresenta uma prega mucosa valvular (prega lacrimal, ou válvula de Hasner).',
    relacoes: 'Continua a extremidade inferior do saco lacrimal, percorre a parede lateral da cavidade nasal (medialmente ao seio maxilar) e desemboca na parte anterior do meato nasal inferior.',
    clinica: 'Explica por que o nariz escorre ao chorar e por que colírios podem ser sentidos na garganta. Nos recém-nascidos, a persistência de uma membrana na válvula de Hasner é a causa mais comum de obstrução lacrimal congênita (epífora neonatal).',
  }, {
    relacionados: ['saco_lacrimal', 'canaliculos_lacrimais', 'glandula_lacrimal', 'o_lacrimal', 'o_maxila', 'o_concha_inferior'],
  }),

  /* ═════════════════════ Cartilagens nasais individualizadas ═════════════════════ */
  bone('cartilagem_septal', 'Cartilagem do septo nasal', 'Cartilago septi nasi', C, ['cartilagem_septal'], {
    local: 'Parte anterior e mediana da cavidade nasal, formando a porção cartilaginosa do septo nasal entre as duas fossas nasais.',
    artic: 'Atrás e acima, lâmina perpendicular do etmoide; atrás e abaixo, vômer; na frente e acima, ossos nasais e processos laterais (cartilagens nasais laterais); abaixo, crista nasal da maxila e espinha nasal anterior.',
    estruturas: 'Lâmina quadrangular de cartilagem hialina que dá sustentação ao dorso cartilaginoso do nariz até o ápice; emite processos laterais e o processo posterior (esfenoidal).',
    funcao: 'Divide a parte anterior da cavidade nasal em duas câmaras e mantém a projeção do dorso e da ponta do nariz.',
    nota: 'A área anteroinferior do septo (plexo de Kiesselbach, ou área de Little) reúne anastomoses das artérias etmoidais, esfenopalatina, palatina maior e labial superior, sendo sede de 90 % das epistaxes. Traumas podem causar hematoma septal (que exige drenagem para evitar necrose da cartilagem e “nariz em sela”) ou desvio do septo.',
  }, {
    layer: 'cartilagem',
    mat: 'cartilage',
    relacionados: ['cartilagem_nasal_lateral', 'cartilagem_alar_maior', 'o_etmoide', 'o_vomer', 'o_nasal', 'o_maxila', 'depressor_septo'],
  }),

  bone('cartilagem_nasal_lateral', 'Cartilagens nasais laterais (processos laterais)', 'Cartilagines nasi laterales', C, ['cartilagem_nasal_lateral'], {
    local: 'Terço médio da pirâmide nasal, abaixo da margem inferior dos ossos nasais e acima das cartilagens alares maiores.',
    artic: 'Superiormente, ossos nasais; lateralmente, processos frontais das maxilas; medialmente, fundem-se na linha mediana com a margem anterossuperior da cartilagem do septo nasal.',
    estruturas: 'Duas lâminas triangulares e planas de cartilagem hialina que a Terminologia Anatômica trata como processos laterais da cartilagem do septo nasal.',
    funcao: 'Sustentam as paredes laterais do nariz e, na junção com o septo e com a margem superior da cartilagem alar maior, delimitam a válvula nasal interna (ponto mais estreito da via aérea superior).',
    nota: 'O músculo nasal (parte transversa) passa sobre elas para comprimir a abertura nasal.',
  }, {
    layer: 'cartilagem',
    mat: 'cartilage',
    relacionados: ['cartilagem_septal', 'cartilagem_alar_maior', 'o_nasal', 'o_maxila', 'nasal', 'procero'],
  }),

  bone('cartilagem_alar_maior', 'Cartilagens alares maiores', 'Cartilagines alares majores', C, ['cartilagem_alar_maior'], {
    local: 'Ápice (ponta) do nariz, contornando a parte anterior de cada narina.',
    artic: 'Unidas por tecido fibroso às cartilagens nasais laterais (acima), à cartilagem do septo nasal (entre os ramos mediais) e à pele da asa do nariz.',
    estruturas: 'Duas cartilagens hialinas finas e flexíveis, dobradas em U: o ramo medial (crus mediale) entra na formação da parte móvel do septo (columela) e o ramo lateral (crus laterale) sustenta a parede lateral da ponta do nariz.',
    funcao: 'Definem o contorno do ápice nasal e mantêm as narinas abertas durante a inspiração.',
    nota: 'A margem lateral da asa do nariz em si é fibrofatosa (sem cartilagem alar maior), com pequenas cartilagens alares menores embutidas. Os músculos nasal (parte alar) e depressor do septo nasal tracionam as cartilagens alares.',
  }, {
    layer: 'cartilagem',
    mat: 'cartilage',
    relacionados: ['cartilagem_septal', 'cartilagem_nasal_lateral', 'nasal', 'depressor_septo', 'levantador_labio_asa', 'labios'],
  }),

  /* ═════════════════════ Lábios (cavidade oral e tegumento) ═════════════════════ */
  sense('labios', 'Lábios (superior e inferior)', 'Labia oris (labium superius et labium inferius)', 'glandula', ['labios'], '#c9606c', 'tongue', {
    local: 'Entrada da cavidade oral, delimitando a rima da boca e separando o vestíbulo da boca do meio externo.',
    estrutura: 'Pregas musculofibrosas móveis cujo eixo é o músculo orbicular da boca, revestidas externamente por pele fina (com folículos pilosos e glândulas sebáceas e sudoríparas), internamente por mucosa oral (com glândulas salivares labiais) e, na borda livre, pela zona de transição avermelhada (vermelhão do lábio, sem pelos nem glândulas sudoríparas, rico em alças capilares dérmicas). O lábio superior apresenta na linha mediana o filtro e o tubérculo; internamente, os frênulos labiais ligam cada lábio à gengiva.',
    relacoes: 'Irrigados pelas artérias labiais superior e inferior (ramos da artéria facial, que formam um anel arterial submucoso). A sensibilidade do lábio superior vem dos ramos labiais superiores do nervo infraorbital (V2) e a do lábio inferior, dos ramos labiais inferiores do nervo mentual (V3); a motricidade é do nervo facial (VII).',
    clinica: 'Essenciais na preensão dos alimentos, na sucção, na articulação dos fonemas bilabiais e labiodentais e na expressão facial. A coloração do vermelhão permite identificar rapidamente a cianose central; as fissuras labiais congênitas (lábio leporino) resultam da falha de fusão entre o processo nasal medial e o processo maxilar no embrião.',
  }, {
    relacionados: ['lingua', 'orbicular_boca', 'arteria_facial', 'veia_facial', 'cartilagem_alar_maior', 'o_dentes_sup', 'o_dentes_inf'],
  }),

  /* ═════════════════════ Orelha externa, média e interna (esquemas por código) ═════════════════════ */
  sense('meato_acustico_externo', 'Meato acústico externo — esquema', 'Meatus acusticus externus', 'ouvido', null, '#d49a6a', 'viscera', {
    local: 'Canal da orelha externa que vai do fundo da concha do pavilhão auricular até a membrana timpânica, atravessando a parte timpânica e escamosa do osso temporal.',
    estrutura: 'Tubo em S suave com cerca de 2,5 cm no adulto: o terço lateral (cerca de 8 mm) tem esqueleto de cartilagem elástica contínua com a do pavilhão e pele rica em pelos (tragos), glândulas sebáceas e glândulas ceruminosas; os dois terços mediais (cerca de 16 mm) têm parede óssea e pele muito fina, aderida ao periósteo.',
    relacoes: 'Na frente, relaciona-se com a articulação temporomandibular e a glândula parótida; atrás, com as células mastóideas. Inervação sensitiva: nervo auriculotemporal (V3, paredes anterior e superior), ramo auricular do vago (X, nervo de Arnold, paredes posterior e inferior) e ramos do facial (VII).',
    clinica: 'Conduz e amplifica por ressonância as ondas sonoras (sobretudo entre 2 e 4 kHz) até a membrana timpânica. Na otoscopia do adulto, traciona-se o pavilhão para cima, para trás e para fora para retificar a curvatura do meato; a estimulação do ramo auricular do vago durante a limpeza do conduto pode desencadear tosse reflexa ou bradicardia.',
    nota: 'ESQUEMA: tubo modelado por código da concha da cartilagem da orelha até a membrana timpânica no osso temporal (o BodyParts3D não inclui o revestimento do meato).',
  }, {
    proc: [{ kind: 'tube', pts: [[0.64, -0.32, -0.025], [0.53, -0.31, -0.015], [0.425, -0.305, -0.008]], ref: [0, 1, 0], width: [0.075, 0.062, 0.068], thick: [0.09, 0.072, 0.08], taper: 'blunt', nf: 16, nc: 12 }],
    relacionados: ['orelha', 'membrana_timpanica', 'o_temporal', 'parotida'],
  }),

  sense('membrana_timpanica', 'Membrana timpânica (tímpano) — esquema', 'Membrana tympanica', 'ouvido', null, '#e8d8b8', 'fascia', {
    local: 'Fundo do meato acústico externo, formando a parede lateral da cavidade timpânica (orelha média), no sulco timpânico do osso temporal.',
    estrutura: 'Membrana fina (cerca de 0,1 mm), oval e semitransparente, de quase 1 cm de diâmetro, inclinada obliquamente para baixo, para a frente e medialmente (a cerca de 55° com o assoalho do meato). Possui três camadas (cutânea externa, fibrosa radiada/circular média e mucosa interna), a parte tensa (maior, inserida pelo anel fibrocartilaginoso) e a parte flácida (superior, de Shrapnell); no centro fica o umbigo (umbo), tracionado para dentro pela ponta do cabo do martelo.',
    relacoes: 'A corda do tímpano (ramo do VII) cruza sua face medial no colo do martelo. A face externa é inervada pelo auriculotemporal (V3) e pelo ramo auricular do vago (X); a face interna (mucosa), pelo nervo timpânico do glossofaríngeo (IX, de Jacobson).',
    clinica: 'Vibra com as ondas sonoras e transmite o movimento ao cabo do martelo. Na otoscopia normal é cinza-perolada e reflete o cone luminoso no quadrante anteroinferior; na otite média aguda fica abaulada e hiperemiada, e a miringotomia (incisão para drenagem) é feita no quadrante posteroinferior para não lesar a corda do tímpano nem os ossículos.',
    nota: 'ESQUEMA: disco modelado por código na extremidade medial do meato acústico externo, junto ao cabo do martelo e ao trajeto da corda do tímpano.',
  }, {
    proc: [{ kind: 'torus', c: [0.42, -0.305, -0.008], axis: [0.82, -0.45, 0.35], R: 0.024, rb: 0.024, rn: 0.004, nt: 18, nr: 10 }],
    relacionados: ['meato_acustico_externo', 'martelo', 'bigorna', 'tuba_auditiva', 'o_temporal'],
  }),

  sense('martelo', 'Martelo (ossículo da audição) — esquema', 'Malleus', 'ouvido', null, '#ece3cc', 'bone', {
    local: 'Cavidade timpânica (orelha média), na parte petrosa do osso temporal; é o mais lateral e o maior dos três ossículos da audição (cerca de 8 a 9 mm).',
    estrutura: 'Apresenta a cabeça (arredondada, aloja-se no recesso epitimpânico e articula-se com o corpo da bigorna), o colo, os processos anterior e lateral e o cabo (manúbrio), intimamente preso à túnica fibrosa da membrana timpânica até o umbigo.',
    relacoes: 'Articula-se com a bigorna (articulação incudomaleolar, sinovial em sela). Recebe na parte superior do cabo o tendão do músculo tensor do tímpano (inervado pelo V3); a corda do tímpano passa na face medial do seu colo.',
    clinica: 'Recebe as vibrações da membrana timpânica e as transfere à bigorna, funcionando como o primeiro braço de alavanca da cadeia ossicular. Quando o tensor do tímpano contrai, puxa o cabo medialmente, retesando o tímpano e atenuando sons graves e intensos.',
    nota: 'ESQUEMA: modelado por código no interior do osso temporal, entre a membrana timpânica (onde termina o músculo tensor do tímpano) e a bigorna. Oculte o osso temporal para visualizar o conjunto da orelha média.',
  }, {
    kind: 'osso',
    proc: [
      { kind: 'tube', pts: [[0.418, -0.305, -0.008], [0.412, -0.288, -0.006], [0.405, -0.268, -0.005]], ref: [0, 0, 1], width: [0.006, 0.008, 0.015], thick: [0.006, 0.008, 0.015], taper: 'blunt', nf: 10, nc: 8 },
    ],
    relacionados: ['membrana_timpanica', 'bigorna', 'estribo', 'tensor_timpano', 'o_temporal'],
  }),

  sense('bigorna', 'Bigorna (ossículo da audição) — esquema', 'Incus', 'ouvido', null, '#e5dac0', 'bone', {
    local: 'Cavidade timpânica (orelha média), situada entre o martelo (lateralmente) e o estribo (medialmente).',
    estrutura: 'Ossículo em forma de dente pré-molar com duas raízes: possui um corpo volumoso no recesso epitimpânico (que se articula com a cabeça do martelo), um ramo curto (posterior, preso por ligamento à fossa da bigorna) e um ramo longo (que desce paralelamente ao cabo do martelo e termina no processo lenticular, articulado com a cabeça do estribo).',
    relacoes: 'Une o martelo (articulação incudomaleolar) ao estribo (articulação incudoestapedial, sinovial esferóidea). A corda do tímpano passa entre o ramo longo da bigorna (medial) e o colo do martelo (lateral).',
    clinica: 'Transmite a vibração do martelo ao estribo com ganho mecânico. O ramo longo da bigorna tem vascularização terminal delicada e é o segmento ossicular mais sujeito à erosão nas otites médias crônicas e no colesteatoma, causando perda auditiva condutiva.',
    nota: 'ESQUEMA: modelado por código no interior do osso temporal, articulando o martelo ao estribo.',
  }, {
    kind: 'osso',
    proc: [
      { kind: 'tube', pts: [[0.398, -0.268, -0.012], [0.390, -0.280, -0.015], [0.382, -0.292, -0.018]], ref: [0, 0, 1], width: [0.015, 0.008, 0.007], thick: [0.015, 0.008, 0.007], taper: 'blunt', nf: 10, nc: 8 },
      { kind: 'tube', pts: [[0.398, -0.268, -0.012], [0.395, -0.268, -0.032]], ref: [0, 1, 0], width: [0.013, 0.007], thick: [0.013, 0.007], taper: 'blunt', nf: 8, nc: 8 },
    ],
    relacionados: ['martelo', 'estribo', 'membrana_timpanica', 'o_temporal'],
  }),

  sense('estribo', 'Estribo (ossículo da audição) — esquema', 'Stapes', 'ouvido', null, '#dfd2b4', 'bone', {
    local: 'Parte medial da cavidade timpânica, estendido do processo lenticular da bigorna até a janela do vestíbulo (janela oval), na parede labiríntica da orelha média.',
    estrutura: 'É o menor osso do corpo humano (cerca de 3 mm): compõe-se de cabeça (articulada com a bigorna), colo (onde se insere o tendão do músculo estapédio), dois ramos ou cruras (anterior, mais reto, e posterior, mais curvo) e uma base oval (platina), presa à janela do vestíbulo pelo ligamento anular do estribo.',
    relacoes: 'Sua base fecha a janela do vestíbulo e fica em contato direto com a perilinfa da rampa do vestíbulo da orelha interna; acima dela passa o canal do nervo facial (VII) na parede medial da caixa do tímpano.',
    clinica: 'Como a área da membrana timpânica é cerca de 17 vezes maior que a da base do estribo, a cadeia ossicular concentra a energia sonora para vencer a impedância do líquido da orelha interna. Na otosclerose, a neoformação óssea imobiliza a base do estribo na janela oval, provocando surdez condutiva progressiva (tratada por estapedectomia); a paralisia do músculo estapédio causa hiperacusia.',
    nota: 'ESQUEMA: modelado por código entre a bigorna, o músculo estapédio e o vestíbulo da orelha interna.',
  }, {
    kind: 'osso',
    proc: [
      { kind: 'tube', pts: [[0.376, -0.291, -0.019], [0.355, -0.289, -0.025], [0.335, -0.292, -0.035]], ref: [0, 1, 0], width: [0.007, 0.005, 0.014], thick: [0.007, 0.005, 0.010], taper: 'blunt', nf: 10, nc: 8 },
      { kind: 'tube', pts: [[0.370, -0.291, -0.021], [0.352, -0.294, -0.032], [0.335, -0.292, -0.035]], ref: [0, 1, 0], width: 0.005, thick: 0.005, taper: 'blunt', nf: 8, nc: 8 },
    ],
    relacionados: ['bigorna', 'martelo', 'estapedio', 'canais_semicirculares', 'coclea', 'o_temporal'],
  }),

  sense('tuba_auditiva', 'Tuba auditiva (de Eustáquio) — esquema', 'Tuba auditiva', 'ouvido', null, '#c9886b', 'viscera', {
    local: 'Canal osteocartilagíneo que liga a parede anterior (carótica) da cavidade timpânica à parede lateral da parte nasal da faringe (nasofaringe), atrás do meato nasal inferior.',
    estrutura: 'Mede cerca de 3,5 a 4 cm no adulto, dirigida para baixo, para a frente e medialmente (a cerca de 45°): o terço posterolateral é ósseo (semicanal da tuba auditiva, no canal musculotubário do temporal, abaixo do tensor do tímpano) e os dois terços anteromediais são cartilagíneos, abrindo-se na nasofaringe junto ao tórus tubário.',
    relacoes: 'Fica lateralmente ao canal carótico e medialmente à fossa infratemporal e ao nervo mandibular (V3). Os músculos tensor do véu palatino (V3), levantador do véu palatino e salpingofaríngeo (plexo faríngeo, X) prendem-se à sua cartilagem e abrem a tuba ao deglutir ou bocejar; a mucosa é inervada pelo plexo timpânico (glossofaríngeo, IX).',
    clinica: 'Iguala a pressão do ar da orelha média com a pressão atmosférica e drena secreções para a nasofaringe. Na criança, a tuba é mais curta, mais larga e mais horizontal, facilitando a subida de infecções da rinofaringe para a orelha média (otite média aguda) e a obstrução do óstio faríngeo pela hipertrofia da tonsila faríngea (adenoide).',
    nota: 'ESQUEMA: tubo modelado por código da cavidade timpânica até a parede lateral da nasofaringe, acompanhando o trajeto imediatamente inferior ao músculo tensor do tímpano.',
  }, {
    proc: [{ kind: 'tube', pts: [[0.37, -0.315, 0.015], [0.29, -0.36, 0.11], [0.21, -0.40, 0.20], [0.14, -0.44, 0.28]], ref: [0, 1, 0], width: [0.026, 0.022, 0.035, 0.048], thick: [0.032, 0.028, 0.05, 0.068], taper: 'blunt', nf: 20, nc: 10 }],
    relacionados: ['membrana_timpanica', 'tensor_timpano', 'tensor_veu', 'levantador_veu', 'salpingofaringeo', 'o_temporal'],
  }),

  sense('coclea', 'Cóclea (orelha interna) — esquema', 'Cochlea', 'ouvido', null, '#e0b065', 'viscera', {
    local: 'Parte anterior (auditiva) do labirinto ósseo e membranáceo da orelha interna, escavada na parte petrosa do osso temporal, à frente do vestíbulo e lateralmente ao fundo do meato acústico interno.',
    estrutura: 'Canal ósseo espiralado em forma de concha de caracol que dá cerca de 2,5 voltas ao redor de um eixo ósseo cônico, o modíolo (cuja base se abre para o meato acústico interno e cuja primeira volta forma o promontório na parede medial da caixa do tímpano). Dentro dele, o ducto coclear membranáceo (rampa média, com endolinfa) separa a rampa do vestíbulo (ligada à janela oval) da rampa do tímpano (ligada à janela redonda), que se comunicam no ápice pelo helicotrema.',
    relacoes: 'Sobre a membrana basilar do ducto coclear repousa o órgão espiral (de Corti), cujas células ciliadas são inervadas pelos neurônios bipolares do gânglio espiral da cóclea, que formam a parte coclear do nervo vestibulococlear (VIII).',
    clinica: 'Órgão receptor da audição, organizado de forma tonotópica: sons agudos estimulam a base da cóclea e sons graves, o ápice. A perda das células ciliadas por ruído, envelhecimento (presbiacusia) ou fármacos ototóxicos causa surdez neurossensorial, que pode ser reabilitada com implante coclear introduzido na rampa do tímpano.',
    nota: 'ESQUEMA: espiral cônica de 2,5 voltas modelada por código na parte petrosa do temporal, conectada à extremidade do ramo coclear do nervo vestibulococlear (VIII).',
  }, {
    proc: [{ kind: 'tube', pts: spiralCoclea(), ref: [0, 1, 0], width: 0.012, thick: 0.012, taper: 'tip', nf: 36, nc: 8 }],
    relacionados: ['canais_semicirculares', 'estribo', 'o_temporal'],
  }),

  sense('canais_semicirculares', 'Vestíbulo e canais semicirculares (orelha interna) — esquema', 'Vestibulum et canales semicirculares', 'ouvido', null, '#d9a15b', 'viscera', {
    local: 'Parte posterior e central (vestibular) do labirinto da orelha interna, na parte petrosa do osso temporal, entre a cavidade timpânica (lateralmente, onde fica a janela do vestíbulo) e o meato acústico interno (medialmente).',
    estrutura: 'O vestíbulo é a câmara central oval que abriga o utrículo e o sáculo do labirinto membranáceo (com as máculas otolíticas, sensíveis à gravidade e à aceleração linear). Posterossuperiormente a ele abrem-se os três canais semicirculares (anterior, posterior e lateral), dispostos em planos aproximadamente perpendiculares entre si; cada um possui numa extremidade uma dilatação (ampola) com a crista ampular, sensível à aceleração angular (rotação da cabeça).',
    relacoes: 'A parede lateral do vestíbulo recebe a base do estribo na janela do vestíbulo; medialmente, as fibras das máculas e das cristas ampulares reúnem-se no gânglio vestibular (de Scarpa) e formam a parte vestibular do nervo vestibulococlear (VIII).',
    clinica: 'Órgãos receptores do equilíbrio estático e dinâmico, que coordenam com os núcleos vestibulares e o cerebelo a postura e o reflexo vestíbulo-ocular (estabilização do olhar). O deslocamento de otólitos do utrículo para um canal semicircular (sobretudo o posterior) causa a vertigem posicional paroxística benigna (VPPB), tratada por manobras de reposicionamento (Epley); a hidropisia endolinfática caracteriza a doença de Ménière (vertigem, zumbido e hipoacusia).',
    nota: 'ESQUEMA: vestíbulo e três arcos ortogonais modelados por código na parte petrosa do temporal, entre a platina do estribo e o ramo vestibular do nervo vestibulococlear (VIII).',
  }, {
    proc: [
      // vestíbulo (entre o ramo vestibular do VIII e a platina do estribo)
      { kind: 'tube', pts: [[0.275, -0.296, -0.068], [0.305, -0.292, -0.052], [0.332, -0.292, -0.036]], ref: [0, 1, 0], width: [0.018, 0.026, 0.018], thick: [0.018, 0.026, 0.018], taper: 'blunt', nf: 12, nc: 10 },
      // canal semicircular anterior (superior)
      { kind: 'tube', pts: [[0.305, -0.285, -0.048], [0.318, -0.252, -0.038], [0.302, -0.238, -0.055], [0.285, -0.255, -0.072], [0.292, -0.282, -0.068]], ref: [1, 0, 0], width: 0.008, thick: 0.008, taper: 'blunt', nf: 18, nc: 8 },
      // canal semicircular posterior
      { kind: 'tube', pts: [[0.292, -0.282, -0.068], [0.282, -0.268, -0.095], [0.295, -0.292, -0.112], [0.308, -0.312, -0.092], [0.302, -0.298, -0.065]], ref: [1, 0, 0], width: 0.008, thick: 0.008, taper: 'blunt', nf: 18, nc: 8 },
      // canal semicircular lateral (horizontal)
      { kind: 'tube', pts: [[0.312, -0.290, -0.046], [0.338, -0.288, -0.058], [0.342, -0.290, -0.082], [0.320, -0.292, -0.092], [0.300, -0.292, -0.068]], ref: [0, 1, 0], width: 0.008, thick: 0.008, taper: 'blunt', nf: 18, nc: 8 },
    ],
    relacionados: ['coclea', 'estribo', 'o_temporal'],
  }),
];
