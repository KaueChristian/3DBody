/**
 * Músculos da língua, do palato mole, da faringe e da laringe (F2.3 a F2.5) que o BodyParts3D traz como malha.
 * Ficam no pacote do corpo (`anatomy-body.js`) e na região “Cabeça e pescoço”. Os que o banco não tem
 * (estiloglosso, palatoglosso, intrínsecos da língua…) estão em `catalog-muscles.js`, modelados por código.
 *
 * Fontes: Moore, Dalley & Agur (8ª ed.); Gray's Anatomy (42ª ed.); Netter (7ª ed.); Terminologia Anatômica (2019).
 */
import { bm, P } from './catalog-body-muscles.js';

export const ORAL_MUSCLES = [
  /* ───────── Língua (extrínsecos com malha real) ───────── */
  bm('genioglosso', 'Genioglosso', 'M. genioglossus', 'profundo', 'cabeca', P('genioglosso'), {
    acao: 'Protrai a língua (a ponta sai da boca) e a abaixa; as fibras posteriores empurram a raiz da língua para a frente, o que mantém a via aérea aberta. Um lado só desvia a ponta para o lado oposto.',
    origem: 'Espinha geniana superior da mandíbula, atrás da sínfise mentual.',
    insercao: 'Face inferior da língua, em leque, da raiz até a ponta, ao lado do septo da língua; as fibras mais baixas chegam ao corpo do hioide.',
    inervacao: 'Nervo hipoglosso (XII).',
    nota: 'É o maior dos extrínsecos e forma a massa central da língua. Na lesão do hipoglosso, ao pôr a língua para fora ela desvia para o lado lesado, porque o genioglosso do lado são a empurra. Na apneia obstrutiva do sono, a perda do tônus dele deixa a língua cair para trás; a estimulação elétrica do hipoglosso é uma das terapias.',
  }),
  bm('hioglosso', 'Hioglosso', 'M. hyoglossus', 'profundo', 'cabeca', P('hioglosso'), {
    acao: 'Abaixa os lados da língua e a retrai; com o genioglosso, torna a língua convexa para cima.',
    origem: 'Corpo e corno maior do hioide.',
    insercao: 'Parte lateral da língua, entre o estiloglosso e o longitudinal inferior.',
    inervacao: 'Nervo hipoglosso (XII).',
    nota: 'Lâmina quadrilátera que fecha, pelo lado, o assoalho da boca. Na sua face lateral correm o nervo hipoglosso, o nervo lingual e o ducto submandibular; a artéria lingual passa por dentro dele, profundamente. Por isso a artéria lingual é abordada, em cirurgia, no trígono lingual (de Pirogov), acima do hioide, com o hioglosso como assoalho.',
  }),

  /* ───────── Palato mole ───────── */
  bm('levantador_veu', 'Levantador do véu palatino', 'M. levator veli palatini', 'profundo', 'cabeca', P('levantador_veu'), {
    acao: 'Eleva o palato mole e o aproxima da parede posterior da faringe, fechando a passagem entre a boca e o nariz na deglutição e na fala (esfíncter velofaríngeo, junto com o constritor superior). A contribuição dele para abrir a tuba auditiva é pequena.',
    origem: 'Face inferior da parte petrosa do temporal, à frente do canal carótico, e parte medial da cartilagem da tuba auditiva.',
    insercao: 'Aponeurose palatina, na face superior do palato mole, onde se encontra com o do lado oposto.',
    inervacao: 'Plexo faríngeo, com fibras do vago (X), das quais parte vem da raiz craniana do acessório (XI).',
    nota: 'Forma a maior parte da massa do palato mole. Na fenda palatina suas fibras ficam inseridas na borda do defeito, em vez de se unirem na linha mediana, e a fala é hipernasal; a reconstrução cirúrgica (veloplastia intravelar) reposiciona o músculo. A disfunção da tuba, com otite média de repetição, é comum nessas crianças.',
  }),
  bm('tensor_veu', 'Tensor do véu palatino', 'M. tensor veli palatini', 'profundo', 'cabeca', P('tensor_veu'), {
    acao: 'Tensiona o palato mole e, ao contrair-se (deglutição, bocejo), abre a tuba auditiva, equalizando a pressão do ouvido médio.',
    origem: 'Fossa escafóidea do processo pterigoide, espinha do esfenoide e parede lateral da cartilagem da tuba auditiva.',
    insercao: 'Aponeurose palatina. O tendão contorna o hâmulo pterigóideo (com uma bolsa sinovial) e muda de direção para a linha mediana.',
    inervacao: 'Nervo para o tensor do véu palatino, ramo do nervo pterigóideo medial (mandibular, V3); as fibras atravessam o gânglio ótico sem relé.',
    nota: 'É o único músculo do palato mole que não é inervado pelo plexo faríngeo. Quando falha (fenda palatina, síndromes craniofaciais), a tuba não abre bem e o líquido se acumula no ouvido médio.',
  }),
  bm('musculo_uvula', 'Músculo da úvula', 'M. uvulae', 'profundo', 'cabeca', P('musculo_uvula'), {
    acao: 'Encurta e eleva a úvula, ajudando a vedar a nasofaringe.',
    origem: 'Espinha nasal posterior do palatino e aponeurose palatina.',
    insercao: 'Tecido conjuntivo da úvula (mucosa e submucosa).',
    inervacao: 'Plexo faríngeo (vago, X).',
    nota: 'O modelo mostra o par já fundido na linha mediana. Na paralisia do vago, o palato mole do lado afetado cai e a úvula se desvia para o lado são ao dizer “aaa”. Úvula bífida indica fenda palatina submucosa.',
  }, { paired: false }),
  bm('palatofaringeo', 'Palatofaríngeo', 'M. palatopharyngeus', 'profundo', 'cabeca', P('palatofaringeo'), {
    acao: 'Abaixa o palato mole e aproxima os arcos palatofaríngeos (estreitando o istmo da faringe); eleva a faringe e a laringe na deglutição.',
    origem: 'Aponeurose palatina e lâmina horizontal do palatino (duas lâminas que envolvem o levantador do véu).',
    insercao: 'Margem posterior da lâmina da cartilagem tireóidea e parede lateral da faringe; as fibras se misturam às do estilofaríngeo e do salpingofaríngeo.',
    inervacao: 'Plexo faríngeo (vago, X).',
    nota: 'Forma o arco palatofaríngeo, a prega posterior da fossa tonsilar (a tonsila palatina fica entre este arco e o arco palatoglosso). Com o constritor superior, participa da prega de Passavant, a crista que se forma na parede posterior da faringe no fechamento velofaríngeo.',
  }),

  /* ───────── Faringe ───────── */
  bm('constritor_faringe_sup', 'Constritor superior da faringe', 'M. constrictor pharyngis superior', 'profundo', 'cabeca', P('constritor_faringe_sup'), {
    acao: 'Estreita a faringe de cima para baixo, empurrando o bolo alimentar para o esôfago; na fala e na deglutição, aproxima-se do palato e forma a prega de Passavant, junto do véu.',
    origem: 'Hâmulo pterigóideo, rafe pterigomandibular, extremidade posterior da linha milo-hióidea da mandíbula e lateral da língua.',
    insercao: 'Rafe faríngea mediana, com o músculo do lado oposto, e tubérculo faríngeo do occipital.',
    inervacao: 'Plexo faríngeo (vago, X), com fibras da raiz craniana do acessório (XI).',
    nota: 'A rafe pterigomandibular o une ao bucinador. Entre a margem superior do músculo e a base do crânio passam o levantador do véu, a tuba auditiva e a artéria palatina ascendente (o “sinus de Morgagni”).',
  }),
  bm('constritor_faringe_med', 'Constritor médio da faringe', 'M. constrictor pharyngis medius', 'profundo', 'cabeca', P('constritor_faringe_med'), {
    acao: 'Estreita a faringe e conduz o bolo alimentar para baixo.',
    origem: 'Corno maior e corno menor do hioide e ligamento estilo-hióideo.',
    insercao: 'Rafe faríngea mediana.',
    inervacao: 'Plexo faríngeo (vago, X), com fibras da raiz craniana do acessório (XI).',
    nota: 'Suas fibras se abrem em leque e cobrem o superior por fora (como telhas): cada constritor sobrepõe o de cima, o que dá direção descendente ao bolo. Entre o médio e o superior passam o músculo estilofaríngeo e o nervo glossofaríngeo.',
  }),
  bm('constritor_faringe_inf', 'Constritor inferior da faringe', 'M. constrictor pharyngis inferior', 'profundo', 'cabeca', P('constritor_faringe_inf'), {
    acao: 'Estreita a faringe; a parte cricofaríngea funciona como esfíncter esofágico superior, relaxando só na deglutição.',
    origem: 'Parte tireofaríngea: linha oblíqua da lâmina da cartilagem tireóidea. Parte cricofaríngea: face lateral da cartilagem cricóidea.',
    insercao: 'Rafe faríngea mediana.',
    inervacao: 'Plexo faríngeo (vago, X), com ramos do nervo laríngeo recorrente e do ramo externo do laríngeo superior.',
    nota: 'Entre as partes tireofaríngea (oblíqua) e cricofaríngea (transversa) há uma área frágil, o triângulo de Killian, por onde se forma o divertículo faringoesofágico (de Zenker), em geral à esquerda. O nervo laríngeo recorrente passa por baixo da margem inferior do músculo.',
  }),
  bm('estilofaringeo', 'Estilofaríngeo', 'M. stylopharyngeus', 'profundo', 'cabeca', P('estilofaringeo'), {
    acao: 'Eleva a faringe e a laringe na deglutição e na fala, encurtando a faringe.',
    origem: 'Face medial da base do processo estiloide do temporal.',
    insercao: 'Margens posterior e superior da cartilagem tireóidea e parede da faringe, entre os constritores superior e médio.',
    inervacao: 'Nervo glossofaríngeo (IX).',
    nota: 'É o único músculo da faringe inervado pelo glossofaríngeo (os demais recebem o plexo faríngeo do vago) e o único que o IX inerva do ponto de vista motor. O nervo contorna sua margem posterior e passa à frente dele, entre os constritores superior e médio, rumo à base da língua.',
  }),
  bm('salpingofaringeo', 'Salpingofaríngeo', 'M. salpingopharyngeus', 'profundo', 'cabeca', P('salpingofaringeo'), {
    acao: 'Eleva a parte lateral da faringe e a laringe na deglutição.',
    origem: 'Parte inferior da cartilagem da tuba auditiva, junto ao toro tubário.',
    insercao: 'Desce pela parede da faringe e se mistura ao palatofaríngeo.',
    inervacao: 'Plexo faríngeo (vago, X).',
    nota: 'Forma a prega salpingofaríngea, vertical e fina, que parte do toro tubário na nasofaringe. Músculo delgado, que algumas descrições tratam como parte do palatofaríngeo.',
  }),

  /* ───────── Laringe ───────── */
  bm('cricotireoideo', 'Cricotireóideo', 'M. cricothyroideus (partes reta e oblíqua)', 'profundo', 'cabeca', P('cricotireoideo'), {
    acao: 'Tensiona as pregas vocais: ao se contrair, aproxima a cartilagem tireóidea da cricóidea (inclinando-a para a frente), alonga as pregas e eleva a altura do som.',
    origem: 'Face anterolateral do arco da cartilagem cricóidea.',
    insercao: 'Parte reta: margem inferior da lâmina da tireóidea. Parte oblíqua: corno inferior da tireóidea.',
    inervacao: 'Ramo externo do nervo laríngeo superior (vago, X).',
    nota: 'É o único músculo intrínseco da laringe que não é inervado pelo laríngeo recorrente, e o único externo à cartilagem, visível por fora. O ramo externo corre junto da artéria tireóidea superior e pode ser lesado na tireoidectomia: a voz perde os tons agudos e cansa com facilidade.',
  }),
  bm('cricoaritenoideo_post', 'Cricoaritenóideo posterior', 'M. cricoarytenoideus posterior', 'profundo', 'cabeca', P('cricoaritenoideo_post'), {
    acao: 'Abduz as pregas vocais, abrindo a rima da glote, ao girar lateralmente o processo vocal da aritenóide. É o único músculo que abre a glote.',
    origem: 'Face posterior da lâmina da cartilagem cricóidea (a depressão de cada lado da crista mediana).',
    insercao: 'Processo muscular da cartilagem aritenóidea, por trás.',
    inervacao: 'Nervo laríngeo recorrente (vago, X).',
    nota: 'Sua paralisia bilateral (cirurgia da tireoide, intubação prolongada) deixa as pregas vocais na linha mediana e causa estridor e dispneia: pode exigir traqueostomia. Na inspiração profunda ele abre a glote ao máximo.',
  }),
  bm('cricoaritenoideo_lat', 'Cricoaritenóideo lateral', 'M. cricoarytenoideus lateralis', 'profundo', 'cabeca', P('cricoaritenoideo_lat'), {
    acao: 'Aduz as pregas vocais, fechando a parte ligamentosa da rima da glote, ao girar medialmente o processo vocal da aritenóide.',
    origem: 'Parte lateral do arco da cartilagem cricóidea.',
    insercao: 'Processo muscular da cartilagem aritenóidea, pela frente.',
    inervacao: 'Nervo laríngeo recorrente (vago, X).',
    nota: 'Antagonista do cricoaritenóideo posterior. Em conjunto com o tireoaritenóideo, fecha a glote ao falar e na tosse (fase de compressão).',
  }),
  bm('aritenoideo_transverso', 'Aritenóideo transverso', 'M. arytenoideus transversus', 'profundo', 'cabeca', P('aritenoideo_transverso'), {
    acao: 'Aproxima as duas cartilagens aritenóideas, fechando a parte posterior (intercartilagínea) da rima da glote.',
    origem: 'Face posterior e margem lateral de uma cartilagem aritenóidea.',
    insercao: 'Face posterior e margem lateral da cartilagem aritenóidea do outro lado.',
    inervacao: 'Nervo laríngeo recorrente (vago, X), com ramos do laríngeo superior (ramo interno) em algumas descrições.',
    nota: 'É o único músculo intrínseco da laringe ímpar (sem par). Ao falar sussurrando, as pregas vocais ficam aduzidas à frente e esta fenda posterior permanece aberta.',
  }, { paired: false }),
  bm('aritenoideo_obliquo', 'Aritenóideo oblíquo', 'M. arytenoideus obliquus', 'profundo', 'cabeca', P('aritenoideo_obliquo'), {
    acao: 'Aproxima as cartilagens aritenóideas e, pela parte ariepiglótica, as bordas da epiglote: fecha o ádito da laringe, como um esfíncter, na deglutição.',
    origem: 'Face posterior do processo muscular de uma cartilagem aritenóidea.',
    insercao: 'Ápice da cartilagem aritenóidea do lado oposto; algumas fibras continuam como parte ariepiglótica, na prega ariepiglótica.',
    inervacao: 'Nervo laríngeo recorrente (vago, X).',
    nota: 'Os dois feixes se cruzam em X atrás do aritenóideo transverso. Protegem as vias aéreas, junto com a descida da epiglote, contra a aspiração do alimento.',
  }),
  bm('tireoaritenoideo', 'Tireoaritenóideo', 'M. thyroarytenoideus', 'profundo', 'cabeca', P('tireoaritenoideo'), {
    acao: 'Relaxa as pregas vocais (aproxima a tireóidea das aritenóideas) e as aduz; com as fibras superiores, estreita o vestíbulo da laringe.',
    origem: 'Metade inferior do ângulo da cartilagem tireóidea (face interna) e ligamento cricotireóideo mediano.',
    insercao: 'Face anterolateral da cartilagem aritenóidea (processo muscular e base).',
    inervacao: 'Nervo laríngeo recorrente (vago, X).',
    nota: 'Lâmina larga, lateral à prega vocal. A parte medial dele, a mais profunda e junto do ligamento vocal, é o músculo vocal (ficha separada). A paralisia unilateral do recorrente faz a prega ficar fixa e a voz soprosa (disfonia) e rouca.',
  }),
  bm('vocal', 'Vocal', 'M. vocalis', 'profundo', 'cabeca', P('vocal'), {
    acao: 'Ajusta a tensão das porções da prega vocal que vibram: encurta e engrossa a prega, produzindo as notas graves, e modula a voz com finura.',
    origem: 'Ângulo da cartilagem tireóidea (face interna), lateral ao ligamento vocal.',
    insercao: 'Processo vocal da cartilagem aritenóidea.',
    inervacao: 'Nervo laríngeo recorrente (vago, X).',
    nota: 'É a parte medial do tireoaritenóideo, individualizada no BodyParts3D; muitos textos não a listam à parte. Fica dentro da prega vocal, lateral ao ligamento vocal: dá o corpo à prega que vibra.',
  }),
];
