/**
 * Sistema urinário e genital masculino (F6.4): rins direito e esquerdo, ureteres direito e esquerdo, bexiga urinária, uretra
 * masculina, testículo, epidídimo, ducto deferente, glândulas seminais (vesículas seminais), próstata, corpos cavernosos, corpo
 * esponjoso e glande do pênis, artéria e veia testiculares (com o plexo pampiniforme) e artéria e veia dorsais do pênis — todos
 * com malhas reais do BodyParts3D (`dist/anatomy-urin.js`, CC BY-SA 2.1 JP).
 *
 * O ducto ejaculatório, as glândulas bulbouretrais (de Cowper), o canal inguinal (com o ligamento inguinal e os anéis inguinais
 * profundo e superficial), o funículo espermático e o músculo cremaster não existem isolados no banco e são modelados por código
 * (`proc`) sobre as coordenadas medidas nos ossos da pelve, no ducto deferente e nos vasos testiculares; cada ficha declara
 * `ESQUEMA` na nota.
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.);
 * Netter — Atlas de anatomia humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 */

const T = 'tronco';

const C_RIM = '#9e4448';
const C_VIA_URIN = '#d69868';
const C_BEXIGA = '#cc7a6e';
const C_GONADA = '#c98a78';
const C_DUCTO = '#d9ab76';
const C_GLAND = '#c77c88';
const C_ERETIL = '#a84858';
const C_INGUINAL = '#c8b282';

const urin = (id, name, latin, parts, color, d, extra = {}) => ({
  kind: extra.kind ?? 'orgao',
  id,
  name,
  latin,
  layer: extra.layer ?? 'urinario',
  region: extra.region ?? T,
  color,
  ...(parts ? { parts: parts.map((p) => ({ id: p, mat: extra.mat ?? 'viscera' })) } : { mat: extra.mat ?? 'viscera' }),
  campos: [
    ['Localização e partes', d.local],
    ['Relações e peritônio', d.relacoes],
    ['Vascularização e inervação', d.vasos],
    ['Função e clínica', d.clinica],
  ],
  nota: d.nota,
  ...extra,
});

export const URIN_ITEMS = [
  /* ═════════════════════ Sistema urinário: rins, ureteres, bexiga e uretra ═════════════════════ */
  urin('rim_direito', 'Rim direito', 'Ren dexter', ['rim_direito'], C_RIM, {
    local: 'Órgão par retroperitoneal no espaço pararrenal/perirrenal da parede abdominal posterior, ao nível de T12 a L3 (1 a 2 cm mais baixo que o rim esquerdo por causa do grande lobo direito do fígado). Mede cerca de 10–12 cm × 5–6 cm × 3 cm e apresenta polos superior e inferior, faces anterior e posterior, margem lateral convexa e margem medial côncava com o hilo renal (que dá acesso ao seio renal). Internamente divide-se em córtex renal (externo e colunas renais de Bertin) e medula renal (pirâmides renais de Malpighi, cujos ápices — as papilas renais — se abrem nos cálices renais menores e maiores e na pelve renal).',
    relacoes: 'Primariamente retroperitoneal, envolto pela cápsula fibrosa, pela cápsula adiposa (gordura perirrenal) e pela fáscia renal (de Gerota, aberta inferiormente). Polo superior coberto pela glândula suprarrenal direita; face anterior relacionada ao fígado (impressão renal no segmento VI, separada pelo recesso hepatorrenal de Morison), à parte descendente do duodeno (sobre o hilo) e à flexura cólica direita; face posterior apoiada no diafragma (12ª costela), psoas maior, quadrado do lombo e transverso do abdome, cruzada pelos nervos subcostal, ílio-hipogástrico e ilioinguinal.',
    vasos: 'Artéria renal direita (ramo lateral da aorta abdominal em L1–L2, que passa atrás da veia cava inferior e se divide em 5 artérias segmentares terminais: superior, anterossuperior, anteroinferior, inferior e posterior). No hilo renal, de anterior para posterior, dispõem-se a veia renal, a artéria renal e a pelve renal (VAP). A veia renal direita é curta (~2,5 cm) e drena direto para a veia cava inferior. Linfáticos para os linfonodos lombares (cavais). Inervação pelo plexo renal (simpático T10–L1 via nervo esplâncnico imino e vago).',
    clinica: 'Filtra o plasma nos néfrons (~1 milhão por rim), regula o equilíbrio hidroeletrolítico e ácido-básico, excreta escórias nitrogenadas e produz renina, eritropoietina e calcitriol. O recesso hepatorrenal (espaço de Morison), entre o fígado e o rim direito, é o local mais declive do abdome superior em decúbito dorsal (avaliado no protocolo FAST). As artérias segmentares não têm anastomoses entre si, definindo planos avasculares para nefrectomia parcial.',
  }, {
    relacionados: ['rim_esquerdo', 'ureter_direito', 'arteria_renal', 'veia_renal', 'aorta_abdominal', 'veia_cava_inferior', 'figado_seg_vi', 'duodeno', 'colo_ascendente', 'diafragma', 'psoas_maior', 'quadrado_lombo', 'linfonodos_lombares'],
  }),

  urin('rim_esquerdo', 'Rim esquerdo', 'Ren sinister', ['rim_esquerdo'], C_RIM, {
    local: 'Órgão retroperitoneal situado à esquerda da coluna vertebral, de T11/T12 a L2/L3 (ligeiramente mais longo, estreito e mais alto que o direito, alcançando a 11ª e a 12ª costelas). Possui hilo renal medial ao nível do plano transpilórico (L1), a cerca de 5 cm do plano mediano, conduzindo ao seio renal onde os cálices menores (7 a 14) confluem em 2 a 3 cálices maiores e na pelve renal.',
    relacoes: 'Retroperitoneal, no interior da fáscia renal (de Gerota). Relaciona-se anteriormente e superiormente com a glândula suprarrenal esquerda, o fundo do estômago e o baço; na parte média, com o corpo e a cauda do pâncreas e os vasos esplênicos; e inferiormente, com a flexura cólica esquerda, o colo descendente e alças do jejuno. Posteriormente apoia-se no diafragma (11ª e 12ª costelas), psoas maior, quadrado do lombo e transverso do abdome.',
    vasos: 'Artéria renal esquerda (mais curta que a direita), dividida nas cinco artérias segmentares terminais. A veia renal esquerda é longa (~7,5 cm), recebe as veias suprarrenal esquerda, frênica inferior esquerda e testicular (ou ovárica) esquerda, e cruza anteriormente a aorta abdominal logo abaixo da origem da artéria mesentérica superior para desembocar na veia cava inferior. Linfáticos para os linfonodos lombares (pré e para-aórticos). Plexo nervoso renal (T10–L1 e vago).',
    clinica: 'Por sua veia renal mais longa, o rim esquerdo é o preferido na doação renal em transplante. A passagem da veia renal esquerda no ângulo agudo entre a aorta abdominal e a artéria mesentérica superior pode sofrer compressão (síndrome do quebra-nozes / nutcracker), causando hematúria, dor no flanco esquerdo e varicocele à esquerda.',
  }, {
    relacionados: ['rim_direito', 'ureter_esquerdo', 'arteria_renal', 'veia_renal', 'veia_testicular', 'veia_suprarrenal', 'aorta_abdominal', 'arteria_mesenterica_superior', 'estomago', 'baco', 'pancreas', 'colo_descendente', 'diafragma', 'psoas_maior', 'quadrado_lombo', 'linfonodos_lombares'],
  }),

  urin('ureter_direito', 'Ureter direito', 'Ureter dexter', ['ureter_direito'], C_VIA_URIN, {
    local: 'Conduto muscular retroperitoneal de 25 a 30 cm que continua a pelve renal direita no ápice do hilo (junção pieloureteral, ao nível de L2) e desce até o fundo da bexiga urinária. Divide-se em parte abdominal (da pelve renal à linha terminal da pelve), parte pélvica (na parede lateral da pelve menor) e parte intramural (trajeto oblíquo na parede vesical até o óstio ureteral direito).',
    relacoes: 'Desce verticalmente sobre a face anterior do músculo psoas maior, aderido ao peritônio parietal posterior. À direita, é coberto na origem pela parte descendente do duodeno, é cruzado anteriormente pelos vasos testiculares (gonadais) direitos e pelos vasos cólicos direitos e ileocólicos, e passa atrás do íleo terminal. Entra na pelve cruzando a origem da artéria ilíaca externa (logo após a bifurcação da ilíaca comum) e, no homem, passa posterolateralmente e depois inferiormente ao ducto deferente direito (“água passa debaixo da ponte”) antes de entrar na bexiga.',
    vasos: 'Irrigação longitudinal ricamente anastomosada na adventícia: ramos ureterais da artéria renal (terço superior, abordando medialmente), da artéria testicular, da aorta e da ilíaca comum (terço médio) e das artérias vesicais inferior e superior (terço pélvico, abordando lateralmente). Drenagem venosa homônima e linfática para linfonodos lombares e ilíacos. Fibras aferentes viscerais de dor acompanham o simpático até T11–L2.',
    clinica: 'Apresenta três estreitamentos fisiológicos onde cálculos renais costumam impactar: 1º na junção ureteropélvica (pieloureteral), 2º no cruzamento da abertura superior da pelve sobre os vasos ilíacos e 3º na passagem intramural pela parede da bexiga (o mais estreito). A cólica nefrética irradia em faixa do ângulo costovertebral pelo flanco até a virilha e o escroto ("do lombo à virilha", dermátomos T11–L2, via nervos ílio-hipogástrico, ilioinguinal e genitofemoral).',
  }, {
    relacionados: ['rim_direito', 'ureter_esquerdo', 'bexiga_urinaria', 'ducto_deferente', 'psoas_maior', 'duodeno', 'ileo', 'arteria_renal', 'arteria_testicular', 'arteria_iliaca_comum', 'arteria_iliaca_externa', 'arteria_iliaca_interna'],
  }),

  urin('ureter_esquerdo', 'Ureter esquerdo', 'Ureter sinister', ['ureter_esquerdo'], C_VIA_URIN, {
    local: 'Conduto muscular liso retroperitoneal de 25 a 30 cm e cerca de 3 mm de lúmen, estendido da pelve renal esquerda (ao nível de L1–L2) até o óstio ureteral esquerdo no ângulo superolateral do trígono da bexiga. Suas projeções radiológicas acompanham as pontas dos processos transversos lombares e a espinha isquiática na pelve.',
    relacoes: 'Desce sobre o psoas maior esquerdo, cruzado anteriormente pelos vasos testiculares (gonadais) esquerdos, pela artéria cólica esquerda e pelos vasos sigmoideos (passando atrás do recesso intersigmoide do mesocolo sigmoide). Cruza a bifurcação da artéria ilíaca comum esquerda na abertura superior da pelve, desce na frente da artéria ilíaca interna e, junto à espinha isquiática, curva-se anteromedialmente acima do levantador do ânus, passando sob o ducto deferente esquerdo antes de penetrar na base da bexiga.',
    vasos: 'Suprimento segmentar anastomosado: ramos da artéria renal esquerda (parte superior), da artéria testicular esquerda e da aorta abdominal (parte média) e das artérias ilíaca interna e vesicais superior e inferior (parte pélvica). Nas cirurgias retroperitoneais, o ureter abdominal é mobilizado preservando o mesoureter medial (no abdome) e lateral (na pelve) para evitar necrose isquêmica. Inervação pelos plexos renal, aórtico e hipogástricos (T11–L2 e S2–S4).',
    clinica: 'O trajeto oblíquo de 1,5 a 2 cm da parte intramural na parede vesical funciona como válvula unidirecional passiva: quando o detrusor contrai e a pressão vesical sobe, achata o ureter intramural e impede o refluxo vesicoureteral. Na colectomia esquerda ou retossigmoidectomia, o ureter esquerdo deve ser identificado no cruzamento dos vasos ilíacos e sob a raiz do mesocolo sigmoide.',
  }, {
    relacionados: ['rim_esquerdo', 'ureter_direito', 'bexiga_urinaria', 'ducto_deferente', 'psoas_maior', 'colo_sigmoide', 'arteria_renal', 'arteria_testicular', 'arteria_colica_esquerda', 'arteria_sigmoideas', 'arteria_iliaca_comum', 'arteria_iliaca_interna'],
  }),

  urin('bexiga_urinaria', 'Bexiga urinária', 'Vesica urinaria', ['bexiga_urinaria'], C_BEXIGA, {
    local: 'Víscera oca muscular subperitoneal que atua como reservatório temporário da urina (capacidade fisiológica normal de 350 a 500 mL). Quando vazia, tem forma tetraédrica e fica inteiramente na pelve menor, atrás da sínfise púbica; quando cheia, sobe para o abdome no espaço retropúbico. Compreende quatro partes: ápice (voltado para a borda superior da sínfise púbica, continuado até o umbigo pelo ligamento umbilical mediano, remanescente do úraco), corpo, fundo (base posterior triangular) e colo (inferior, onde se abre o óstio interno da uretra).',
    relacoes: 'Sua parede é formada pelo músculo detrusor (três camadas entrelaçadas de músculo liso) e revestida por urotélio (epitélio de transição); internamente no fundo fica o trígono da bexiga, liso e sem pregas, delimitado pelos dois óstios ureterais (unidos pela prega interureteral) e pelo óstio interno da uretra (com a úvula da bexiga). O peritônio cobre apenas a face superior, refletindo-se posteriormente sobre as vesículas seminais e o reto na escavação retovesical (de Douglas masculina). Abaixo do colo apoia-se diretamente sobre a base da próstata, fixado pelos ligamentos puboprostáticos; anteriormente fica o espaço retropúbico (de Retzius).',
    vasos: 'Artérias vesicais superiores (da parte patente da artéria umbilical) e artéria vesical inferior (no homem, ramo da divisão anterior da artéria ilíaca interna). Drenagem pelo plexo venoso vesical (comunicante com o plexo prostático) para as veias ilíacas internas; linfáticos para os linfonodos ilíacos externos e internos. Inervação pelo plexo vesical: parassimpática motora (nervos esplâncnicos pélvicos, S2–S4 — contrai o detrusor e relaxa o esfíncter interno na micção) e simpática de enchimento/ejaculação (T11–L2 — contrai o esfíncter interno no homem para impedir ejaculação retrógrada).',
    clinica: 'Quando distendida na retenção urinária aguda ("bexigoma"), a bexiga sobe acima da sínfise púbica levantando o peritônio parietal, o que permite a punção ou cistostomia suprapúbica extraperitoneal sem entrar na cavidade peritoneal. Fraturas da pelve podem provocar ruptura vesical extraperitoneal (mais comum, no colo/espaço de Retzius) ou intraperitoneal (na cúpula, quando a bexiga está cheia).',
  }, {
    relacionados: ['ureter_direito', 'ureter_esquerdo', 'uretra_masculina', 'prostata', 'vesicula_seminal', 'ducto_deferente', 'reto', 'o_osso_quadril', 'pubococcigeo', 'arteria_iliaca_interna', 'veia_iliaca_interna', 'arterias_umbilicais', 'linfonodos_iliacos'],
  }),

  urin('uretra_masculina', 'Uretra masculina', 'Urethra masculina', ['uretra_masculina'], C_VIA_URIN, {
    local: 'Tubo fibromuscular de 18 a 22 cm que conduz a urina do óstio interno da uretra (no colo da bexiga) até o óstio externo da uretra (na extremidade da glande do pênis) e, a partir da parte prostática, serve como via comum para a urina e o sêmen. Divide-se em quatro partes: 1) parte intramural ou pré-prostática (0,5–1,5 cm, no colo da bexiga, cercada pelo esfíncter interno da uretra, de músculo liso); 2) parte prostática (3–4 cm, a mais larga e dilatável, com a crista uretral, o colículo seminal, o utrículo prostático e os óstios dos ductos ejaculatórios e dos seios prostáticos); 3) parte membranácea ou intermédia (1–1,5 cm, a mais curta, estreita e menos distensível, salvo o óstio externo); e 4) parte esponjosa (cerca de 15 cm, dentro do corpo esponjoso, com dilatações na fossa intrabulbar e na fossa navicular da glande).',
    relacoes: 'A parte prostática atravessa verticalmente a próstata, mais próxima da face anterior. A parte membranácea atravessa a bolsa profunda do períneo (envolvida pelo músculo esfíncter externo da uretra, estriado voluntário, e flanqueada pelas glândulas bulbouretrais) e perfura a membrana perineal. A parte esponjosa entra no bulbo do pênis (onde recebe os ductos das glândulas bulbouretrais e apresenta as glândulas uretrais de Littré) e percorre todo o corpo esponjoso e a glande.',
    vasos: 'Partes intramural e prostática: ramos prostáticos das artérias vesical inferior e retal média. Parte membranácea e esponjosa: artéria do bulbo do pênis e artéria uretral (ramos da artéria pudenda interna) e ramos da artéria dorsal do pênis. Drenagem venosa para o plexo venoso prostático e veias pudendas internas. Inervação pelo plexo prostático (autônomo) e pelo nervo pudendo (S2–S4, somático para o esfíncter externo e sensibilidade da uretra esponjosa via nervo dorsal do pênis).',
    clinica: 'No cateterismo vesical masculino (sondagem de Foley), o conhecimento das duas curvaturas da uretra é essencial: a curvatura infrapúbica (côncava anterossuperiormente, fixa na junção bulbomembranácea) e a curvatura pré-púbica (móvel, desfeita ao elevar o pênis). Nos traumas pélvicos ("queda a cavaleiro" ou fratura dos ramos púbicos), a parte membranácea (posterior) ou a bulbar (anterior) são os locais clássicos de lesão uretral (sangue no meato uretral, retenção urinária e próstata alta ao toque).',
  }, {
    relacionados: ['bexiga_urinaria', 'prostata', 'ducto_ejaculatorio', 'glandulas_bulbouretrais', 'corpo_esponjoso_penis', 'glande_penis', 'esfincter_uretra', 'transverso_profundo_perineo', 'bulboesponjoso', 'arteria_pudenda_interna', 'veia_pudenda_interna'],
  }),

  /* ═════════════════════ Sistema genital masculino: gônada, vias espermáticas e glândulas anexas ═════════════════════ */
  urin('testiculo', 'Testículo', 'Testis [Orchis]', ['testiculo'], C_GONADA, {
    local: 'Gônada masculina par, ovoide (4 a 5 cm de comprimento × 2,5 cm × 3 cm, 10 a 15 g), suspensa no escroto pelo funículo espermático; o testículo esquerdo costuma ficar cerca de 1 cm mais baixo que o direito. É revestido por uma cápsula fibrosa densa e esbranquiçada, a túnica albugínea, que se espessa na margem posterior formando o mediastino do testículo e emite septos radiados dividindo o parênquima em 200 a 300 lóbulos do testículo.',
    relacoes: 'Envolvido anterolateralmente pela túnica vaginal do testículo (saco seroso fechado de dupla lâmina — visceral e parietal — derivado do processo vaginal do peritônio embrionário). Cada lóbulo contém 1 a 3 túbulos seminíferos contorcidos (sede da espermatogênese, com células de Sertoli e células intersticiais de Leydig no estroma), que convergem em túbulos seminíferos retos, na rede do testículo (rete testis, no mediastino) e em 12 a 20 dúctulos eferentes que penetram na cabeça do epidídimo.',
    vasos: 'Artéria testicular (ramo direto da aorta abdominal em L2), anastomosada no polo inferior com a artéria do ducto deferente e a artéria cremastérica. Drenagem pelo plexo venoso pampiniforme para as veias testiculares. Como os testículos se originam no retroperitônio lombar alto e descem pelo canal inguinal guiados pelo gubernáculo, **sua drenagem linfática vai diretamente para os linfonodos lombares (pré-aórticos e cavais, T11–L2)**, e não para os inguinais. Inervação autonômica e aferente visceral pelo plexo testicular (T10–T11).',
    clinica: 'Exerce dupla função: exócrina (espermatogênese, que exige temperatura 2 a 3 °C abaixo da corporal, mantida pelo escroto, pelo plexo pampiniforme e pelos músculos dartos e cremaster) e endócrina (secreção de testosterona pelas células de Leydig sob estímulo do LH). Na torção testicular, o giro do funículo espermático obstrui primeiro o retorno venoso e depois a artéria testicular (emergência cirúrgica de 6 h; o testículo fica alto e horizontalizado e o reflexo cremastérico desaparece). O acúmulo de líquido na túnica vaginal é a hidrocele; a falha na descida testicular é a criptorquidia.',
  }, {
    relacionados: ['epididimo', 'ducto_deferente', 'funiculo_espermatico', 'cremaster', 'canal_inguinal', 'arteria_testicular', 'veia_testicular', 'linfonodos_lombares'],
  }),

  urin('epididimo', 'Epidídimo', 'Epididymis', ['epididimo'], C_GONADA, {
    local: 'Órgão alongado em forma de vírgula (cerca de 4 a 5 cm in situ, mas contendo o ducto do epidídimo altamente enovelado, que mede cerca de 4 a 6 metros se desenrolado), aplicado firmemente ao polo superior e à margem posterolateral do testículo. Divide-se em cabeça (superior e expandida, formada pelos lóbulos/cones vasculosos dos dúctulos eferentes do testículo), corpo (separado lateralmente do testículo pelo seio do epidídimo, recesso da túnica vaginal) e cauda (inferior, onde a túnica muscular se espessa e continua diretamente como o ducto deferente).',
    relacoes: 'Coberto anterolateralmente pela lâmina visceral da túnica vaginal; medialmente ao corpo do epidídimo passam os vasos testiculares e o início do ducto deferente. Na cabeça pode existir o apêndice do epidídimo (remanescente pediculado do ducto mesonéfrico de Wolff), assim como no polo superior do testículo fica o apêndice do testículo (hidátide de Morgagni, remanescente do ducto paramesonéfrico de Müller).',
    vasos: 'Ramo epididimário da artéria testicular, anastomosado na cauda com a artéria do ducto deferente (ramo da vesical superior ou inferior). Drenagem venosa para o plexo pampiniforme e linfática para os linfonodos lombares. Inervação pelo plexo testicular (fibras simpáticas estimulam o peristaltismo da cauda na ejaculação).',
    clinica: 'Local de maturação funcional (aquisição de motilidade progressiva e capacidade fecundante ao longo de 10 a 14 dias), reabsorção do fluido tubular pelas células principais com estereocílios e armazenamento dos espermatozoides na cauda até a ejaculação. A epididimite aguda (ascendente a partir da uretra/próstata) cursa com dor escrotal gradual e alívio parcial à elevação do testículo (sinal de Prehn), diferenciando-se da torção testicular ou da torção do apêndice testicular ("sinal do ponto azul").',
  }, {
    relacionados: ['testiculo', 'ducto_deferente', 'funiculo_espermatico', 'arteria_testicular', 'veia_testicular', 'linfonodos_lombares'],
  }),

  urin('ducto_deferente', 'Ducto deferente', 'Ductus deferens', ['ducto_deferente'], C_DUCTO, {
    local: 'Tubo fibromuscular de parede muito espessa e lúmen estreito (cerca de 45 cm de comprimento), que continua a cauda do epidídimo e conduz os espermatozoides até o ducto ejaculatório. Percorre quatro segmentos sucessivos: 1) parte escrotal (sobe medialmente ao epidídimo, na borda posterior do testículo); 2) parte funicular (sobe como componente posterior e palpável do funículo espermático); 3) parte inguinal (atravessa o canal inguinal do anel superficial ao anel profundo); e 4) parte pélvica (contorna lateralmente a artéria epigástrica inferior no anel profundo, cruza os vasos ilíacos externos e desce na parede lateral da pelve até a base da bexiga, onde se dilata na ampola do ducto deferente).',
    relacoes: 'Sua espessa túnica muscular lisa (camadas longitudinal interna, circular média e longitudinal externa) confere-lhe consistência firme de "cordão de chicote" à palpação no escroto. Na pelve, corre imediatamente sob o peritônio, cruzando superiormente os vasos e o nervo obturatórios, as artérias vesicais superiores e **o ureter** (passando por cima e pela frente dele no ângulo posterolateral da bexiga). No fundo da bexiga, as duas ampolas convergem medialmente às glândulas seminais e unem-se aos ductos destas na base da próstata para formar os ductos ejaculatórios.',
    vasos: 'Artéria do ducto deferente (ramo da artéria vesical superior ou inferior, da ilíaca interna), que o acompanha até a cauda do epidídimo, onde se anastomosa com a artéria testicular. Veias drenam para o plexo pampiniforme (parte funicular) e para o plexo venoso vesical/prostático (parte pélvica). Rica inervação simpática (nervo hipogástrico, T12–L2), responsável pelas contrações peristálticas vigorosas que impulsionam os espermatozoides durante a fase de emissão da ejaculação.',
    clinica: 'A vasectomia (deferentectomia), método cirúrgico de contracepção masculina, é realizada por pequena incisão ou punção na parte alta do escroto, isolando e seccionando a parte funicular do ducto deferente. Na hernioplastia inguinal, o ducto deferente deve ser identificado e preservado ao abrir o funículo espermático ou ao posicionar a tela no anel inguinal profundo.',
  }, {
    relacionados: ['epididimo', 'testiculo', 'vesicula_seminal', 'ducto_ejaculatorio', 'prostata', 'bexiga_urinaria', 'ureter_direito', 'ureter_esquerdo', 'funiculo_espermatico', 'canal_inguinal', 'arteria_testicular', 'veia_testicular', 'arteria_epigastrica_inferior', 'arteria_iliaca_externa', 'arteria_iliaca_interna'],
  }),

  urin('vesicula_seminal', 'Glândulas seminais (vesículas seminais)', 'Glandula vesiculosa [Glandula seminalis; Vesicula seminalis]', ['vesicula_seminal'], C_GLAND, {
    local: 'Glândulas exócrinas pares, alongadas e lobuladas (cerca de 5 cm de comprimento in situ, formadas por um tubo cego enovelado de ~15 cm), dispostas obliquamente entre o fundo da bexiga urinária (na frente) e o reto (atrás), lateralmente à ampola do ducto deferente correspondente. Sua extremidade inferior estreita-se no ducto excretor, que se une à ampola do ducto deferente na base da próstata para formar o ducto ejaculatório.',
    relacoes: 'Suas extremidades superiores divergentes são cobertas pelo peritônio do fundo da escavação retovesical e ficam logo abaixo da entrada dos ureteres na bexiga; posteriormente são separadas do reto pelo septo retovesical (fáscia de Denonvilliers). Ao contrário do nome tradicional ("vesícula"), **não armazenam espermatozoides**: são glândulas secretoras anexas.',
    vasos: 'Ramos das artérias vesical inferior e retal média (da artéria ilíaca interna). Drenagem venosa para os plexos venosos vesical e prostático (tributários das veias ilíacas internas) e linfática para os linfonodos ilíacos internos e externos. Inervação simpática (nervos lombares esplâncnicos e plexo hipogástrico, T12–L2, que contrai sua parede muscular na emissão) e parassimpática (nervos esplâncnicos pélvicos, S2–S4).',
    clinica: 'Secretam um líquido espesso, alcalino e rico em frutose (principal fonte energética para os espermatozoides), prostaglandinas e semenogelina (que coagula o sêmen logo após a ejaculação), compondo cerca de **60 a 70 % do volume total do ejaculado**. Normalmente não são palpáveis ao toque retal, mas tornam-se palpáveis quando distendidas ou inflamadas (vesiculite seminal, frequentemente associada a hematospermia).',
  }, {
    relacionados: ['ducto_deferente', 'ducto_ejaculatorio', 'prostata', 'bexiga_urinaria', 'ureter_direito', 'ureter_esquerdo', 'reto', 'arteria_iliaca_interna', 'veia_iliaca_interna', 'linfonodos_iliacos'],
  }),

  urin('ducto_ejaculatorio', 'Ducto ejaculatório — esquema', 'Ductus ejaculatorius', null, C_DUCTO, {
    local: 'Par de condutos delgados de cerca de 2 a 2,5 cm de comprimento, formados junto à base da próstata pela união em ângulo agudo do ducto da glândula seminal com a extremidade afilada da ampola do ducto deferente.',
    relacoes: 'Atravessam obliquamente para baixo, para a frente e para o plano mediano a zona central do parênquima prostático, convergindo um para o outro aos lados do utrículo prostático, e desembocam por dois pequenos óstios em fenda no colículo seminal (verumontanum), na parede posterior da parte prostática da uretra.',
    vasos: 'Irrigados por ramos da artéria do ducto deferente e das artérias prostáticas (da vesical inferior). Drenagem para o plexo venoso prostático e linfonodos ilíacos internos. Inervação pelo plexo prostático.',
    clinica: 'Conduzem a mistura dos espermatozoides (vindos da ampola do ducto deferente) com a secreção das glândulas seminais até a uretra prostática durante a fase de emissão da ejaculação. A obstrução congênita (cisto de utrículo ou de ducto de Wolff) ou adquirida (pós-inflamatória ou pós-ressecção transuretral) dos ductos ejaculatórios causa oligospermia ou azoospermia obstrutiva com baixo volume seminal e pH ácido.',
    nota: 'ESQUEMA: o BodyParts3D traz o ducto deferente e a glândula seminal até a base da próstata, mas não modela o trajeto intraprostático do ducto ejaculatório; os dois condutos foram gerados por código da junção deferente-seminal até o colículo seminal na uretra prostática.',
  }, {
    paired: true,
    proc: [
      { kind: 'tube', pts: [[0.046, -7.415, -0.165], [0.028, -7.475, -0.105], [0.008, -7.528, -0.042]], ref: [1, 0, 0], width: 0.014, thick: 0.014, taper: 'pointed', nf: 16, nc: 8 },
    ],
    relacionados: ['ducto_deferente', 'vesicula_seminal', 'prostata', 'uretra_masculina'],
  }),

  urin('prostata', 'Próstata', 'Prostata', ['prostata'], C_GLAND, {
    local: 'Maior glândula acessória do sistema genital masculino, ímpar, de formato cônico invertido (semelhante a uma castanha, ~3 cm de altura × 4 cm de largura × 2 cm anteroposterior, ~20 g no adulto jovem), envolvendo a parte prostática da uretra na pelve menor. Apresenta base superior (contínua com o colo da bexiga), ápice inferior (apoiado sobre o esfíncter externo da uretra e a bolsa profunda do períneo), face anterior (atrás da sínfise púbica, a ~2 cm dela, ligada pelos ligamentos puboprostáticos), face posterior (plana, com um sulco mediano palpável ao toque retal) e faces inferolaterais (apoiadas sobre as fibras puboprostáticas do levantador do ânus).',
    relacoes: 'Anatomicamente descrevem-se os lobos direito e esquerdo, o istmo anterior (fibromuscular) e o lobo médio (entre a uretra e os ductos ejaculatórios). Na classificação zonal anatomoclínica de McNeal divide-se em: **zona periférica** (~70 % do tecido glandular, posterior e lateral — palpável ao toque retal), **zona central** (~25 %, em cunha ao redor dos ductos ejaculatórios), **zona de transição** (~5 %, periuretral) e estroma fibromuscular anterior. É envolvida por cápsula fibrosa própria e pela bainha prostática da fáscia pélvica visceral; posteriormente o septo retovesical (fáscia de Denonvilliers) a separa da ampola do reto.',
    vasos: 'Artérias prostáticas, ramos principalmente da artéria vesical inferior, auxiliadas pelas artérias pudenda interna e retal média. O volumoso **plexo venoso prostático** (de Santorini), que recebe a veia dorsal profunda do pênis, drena para as veias ilíacas internas e comunica-se diretamente (sem valvas) com o **plexo venoso vertebral interno (de Batson)** — via clássica de metástases ósseas osteoblásticas na coluna lombossacral. Os feixes neurovasculares cavernosos (nervos eretores, de S2–S4) correm posterolateralmente à cápsula prostática.',
    clinica: 'Secreta líquido levemente ácido (~20 a 30 % do volume seminal), rico em ácido cítrico, zinco, fosfatase ácida e antígeno prostático específico (PSA, serina-protease que liquefaz o coágulo seminal). **A hiperplasia prostática benigna (HPB) acomete a zona de transição periuretral**, comprimindo a uretra prostática (jato fraco, hesitação, noctúria) e projetando o lobo médio para o trígono vesical; **o adenocarcinoma de próstata origina-se em ~75–80 % dos casos na zona periférica posterior**, sendo acessível ao toque retal e à biópsia transretal. Na prostatectomia radical, a preservação dos feixes neurovasculares posterolaterais e do esfíncter externo da uretra no ápice é decisiva para evitar disfunção erétil e incontinência urinária.',
  }, {
    relacionados: ['bexiga_urinaria', 'uretra_masculina', 'vesicula_seminal', 'ducto_deferente', 'ducto_ejaculatorio', 'glandulas_bulbouretrais', 'esfincter_uretra', 'pubococcigeo', 'puborretal', 'reto', 'veia_dorsal_profunda_penis', 'arteria_iliaca_interna', 'veia_iliaca_interna', 'linfonodos_iliacos'],
  }),

  urin('glandulas_bulbouretrais', 'Glândulas bulbouretrais (de Cowper) — esquema', 'Glandulae bulbourethrales', null, C_GLAND, {
    local: 'Par de pequenas glândulas tubuloalveolares arredondadas (do tamanho de uma ervilha, ~0,5 a 1 cm de diâmetro), situadas na bolsa profunda do períneo, posterolateralmente à parte membranácea (intermédia) da uretra e imersas entre as fibras do músculo esfíncter externo da uretra e do transverso profundo do períneo, logo acima da membrana perineal.',
    relacoes: 'Seus ductos excretores delgados (2,5 a 3 cm de comprimento) dirigem-se obliquamente para baixo e para a frente, perfuram a membrana perineal e penetram no bulbo do pênis para desembocar, lado a lado, no assoalho da parte esponjosa proximal da uretra (fossa intrabulbar). São homólogas embrionárias das glândulas vestibulares maiores (de Bartholin) da mulher.',
    vasos: 'Irrigadas pela artéria do bulbo do pênis (ramo da artéria pudenda interna); drenagem venosa para o plexo prostático e veias pudendas internas, e linfática para os linfonodos ilíacos internos. Inervação secretomotora parassimpática pelo plexo prostático / nervos cavernosos (S2–S4).',
    clinica: 'Durante a excitação sexual (antes da ejaculação), secretam um fluido mucoso, claro e alcalino (pré-ejaculado) que lubrifica a uretra esponjosa e a extremidade da glande e neutraliza os resíduos ácidos da urina na uretra, protegendo a viabilidade dos espermatozoides.',
    nota: 'ESQUEMA: as glândulas bulbouretrais e seus ductos não constam no banco BodyParts3D; foram modeladas por código na bolsa profunda do períneo, posterolateralmente à uretra membranácea, com os ductos entrando na parte bulbar do corpo esponjoso.',
  }, {
    kind: 'glandula',
    paired: true,
    proc: [
      { kind: 'tube', pts: [[0.038, -7.638, -0.045], [0.036, -7.658, -0.025]], ref: [1, 0, 0], width: 0.034, thick: 0.028, taper: 'blunt', nf: 14, nc: 10 },
      { kind: 'tube', pts: [[0.034, -7.66, -0.02], [0.025, -7.695, 0.012], [0.014, -7.73, 0.045]], ref: [1, 0, 0], width: 0.010, thick: 0.010, taper: 'pointed', nf: 14, nc: 8 },
    ],
    relacionados: ['uretra_masculina', 'prostata', 'corpo_esponjoso_penis', 'esfincter_uretra', 'transverso_profundo_perineo', 'bulboesponjoso', 'arteria_pudenda_interna'],
  }),

  /* ═════════════════════ Órgãos eréteis do pênis e vasos penianos e gonadais ═════════════════════ */
  urin('corpo_cavernoso_penis', 'Corpos cavernosos do pênis', 'Corpora cavernosa penis', ['corpo_cavernoso_penis'], C_ERETIL, {
    local: 'Par de cilindros dorsolaterais de tecido erétil que formam a maior parte da raiz e do corpo do pênis. Na raiz do pênis (bolsa superficial do períneo), começam separados como os **ramos do pênis (crura penis)**, fixados firmemente à face interna dos ramos isquiopúbicos e à membrana perineal. Sob a sínfise púbica fundem-se lado a lado no corpo do pênis, separados pelo septo do pênis (incompleto distalmente, em pente — *septum pectiniforme*), e terminam em pontas cônicas encaixadas sob a coroa da glande.',
    relacoes: 'Cada ramo do pênis é revestido pelo músculo isquiocavernoso, cuja contração comprime os ramos contra o osso e restringe o retorno venoso para manter a rigidez da ereção. No corpo do pênis, os dois corpos cavernosos são envolvidos por uma espessa cápsula fibroelástica (a túnica albugínea dos corpos cavernosos, ~2 mm) e, em conjunto com o corpo esponjoso ventral, pela fáscia profunda do pênis (fáscia de Buck), sob a qual correm a veia dorsal profunda, as artérias dorsais e os nervos dorsais do pênis. A raiz do pênis é sustentada pelos ligamentos fundiforme (da linha alba) e suspensor do pênis (da sínfise púbica).',
    vasos: 'Percorridos centralmente pelas **artérias profundas do pênis (artérias cavernosas)**, ramos terminais da artéria pudenda interna que emitem as artérias helicinas espiraladas; estas se abrem diretamente nas cavernas (espaços sinusoidais revestidos por endotélio e cercados por trabéculas de músculo liso). Drenagem pelas veias emissárias (que atravessam obliquamente a túnica albugínea) e circunflexas para a veia dorsal profunda do pênis. Inervação parassimpática vasodilatadora pelos nervos cavernosos (S2–S4, liberação de óxido nítrico — ereção) e simpática vasoconstritora (T11–L2 — detumescência).',
    clinica: 'Na ereção, o estímulo parassimpático relaxa o músculo liso das artérias helicinas e das trabéculas cavernosas: os sinusoides enchem-se de sangue sob pressão arterial e comprimem as vênulas subtúnicas contra a túnica albugínea inextensível (mecanismo veno-oclusivo). O trauma sobre o pênis ereto pode romper a túnica albugínea ("fratura do pênis", com estalido, dor aguda, hematoma contido pela fáscia de Buck e desvio contralateral); a fibrose em placas da túnica albugínea é a doença de Peyronie.',
  }, {
    relacionados: ['corpo_esponjoso_penis', 'glande_penis', 'uretra_masculina', 'isquiocavernoso', 'bulboesponjoso', 'o_osso_quadril', 'arteria_dorsal_penis', 'veia_dorsal_profunda_penis', 'arteria_pudenda_interna', 'veia_pudenda_interna'],
  }),

  urin('corpo_esponjoso_penis', 'Corpo esponjoso e bulbo do pênis', 'Corpus spongiosum penis; Bulbus penis', ['corpo_esponjoso_penis'], C_ERETIL, {
    local: 'Cilindro ímpar e mediano de tecido erétil situado no sulco ventral entre os dois corpos cavernosos, atravessado em toda a sua extensão pela parte esponjosa da uretra. Na raiz do pênis (bolsa superficial do períneo), dilata-se posteriormente formando o **bulbo do pênis**, fixado à face inferior da membrana perineal; anteriormente afina-se no corpo do pênis e, na extremidade distal, expande-se novamente formando a glande do pênis.',
    relacoes: 'O bulbo do pênis é envolvido inferiormente e lateralmente pelas duas metades do músculo bulboesponjoso (unidas por rafe mediana e presas ao corpo do períneo) e recebe na sua face superior a entrada da parte membranácea da uretra e os ductos das glândulas bulbouretrais. Sua túnica albugínea é muito mais fina e elástica que a dos corpos cavernosos, e suas lacunas venosas são mais uniformes.',
    vasos: 'Irrigado pela artéria do bulbo do pênis e pela artéria uretral (ramos da artéria pudenda interna), além de anastomoses com a artéria dorsal do pênis na glande. Drenagem venosa para a veia dorsal profunda do pênis e para as veias pudendas internas. Inervação pelos nervos cavernosos (plexo prostático, S2–S4) e pelo ramo perineal do nervo pudendo (que inerva o músculo bulboesponjoso).',
    clinica: 'Por ter túnica albugínea fina e menor pressão intraluminal durante a ereção que os corpos cavernosos, **o corpo esponjoso permanece compressível na ereção, mantendo a uretra esponjosa pérvia para a passagem do sêmen na ejaculação**. As contrações rítmicas do músculo bulboesponjoso sobre o bulbo do pênis expulsam as últimas gotas de urina na micção e impulsionam o sêmen na fase de expulsão da ejaculação.',
  }, {
    relacionados: ['corpo_cavernoso_penis', 'glande_penis', 'uretra_masculina', 'glandulas_bulbouretrais', 'bulboesponjoso', 'isquiocavernoso', 'transverso_superficial_perineo', 'arteria_dorsal_penis', 'veia_dorsal_profunda_penis', 'arteria_pudenda_interna', 'veia_pudenda_interna'],
  }),

  urin('glande_penis', 'Glande do pênis', 'Glans penis', ['glande_penis'], C_ERETIL, {
    local: 'Expansão distal cônica do corpo esponjoso do pênis que recobre em forma de capuz as extremidades rombas dos dois corpos cavernosos. Sua margem posterior proeminente é a **coroa da glande**, que sobressai obliquamente sobre uma constrição anular, o **colo da glande** (sulco balanoprepucial); no ápice da glande abre-se em fenda vertical o óstio externo da uretra, precedido internamente por uma dilatação, a fossa navicular da uretra.',
    relacoes: 'Recoberta por pele fina, sem pelos e aderida diretamente ao tecido esponjoso subjacente, envolvida externamente por uma prega dupla e móvel de pele e mucosa, o prepúcio do pênis, que se prende à face uretral (ventral) da glande por uma prega mediana rica em vasos e fibras sensitivas, o **frênulo do prepúcio**.',
    vasos: 'Irrigada pelos ramos terminais das artérias dorsais do pênis (que formam um anel arterial no colo da glande) anastomosados com as artérias do corpo esponjoso; a artéria do frênulo pode sangrar profusamente em lacerações. Drenagem para a veia dorsal profunda do pênis; **a linfa da glande drena para os linfonodos inguinais profundos (de Cloquet) e ilíacos externos**, enquanto a pele do corpo do pênis e do prepúcio drena para os linfonodos inguinais superficiais. Inervação sensitiva riquíssima pelos **nervos dorsais do pênis** (ramos terminais do nervo pudendo, S2–S4).',
    clinica: 'É a região de maior densidade de terminações nervosas sensitivas do pênis (principal zona aferente do reflexo da ereção e da ejaculação). Quando o anel prepucial é estreito demais para ser retraído sobre a glande, configura-se a fimose (tratada cirurgicamente pela postectomia/circuncisão); quando o prepúcio retraído fica aprisionado atrás da coroa no colo da glande, causando edema e congestão venosa progressiva, constitui a parafimose (urgência urológica).',
  }, {
    relacionados: ['corpo_esponjoso_penis', 'corpo_cavernoso_penis', 'uretra_masculina', 'arteria_dorsal_penis', 'veia_dorsal_profunda_penis', 'linfonodos_inguinais', 'linfonodos_iliacos'],
  }),

  urin('arteria_testicular', 'Artéria testicular (gonadal)', 'Arteria testicularis', ['arteria_testicular'], '#d9453d', {
    local: 'Par de artérias longas e delgadas que nascem da face anterolateral da aorta abdominal ao nível de L2, cerca de 2 a 3 cm abaixo da origem das artérias renais e acima da artéria mesentérica inferior.',
    relacoes: 'Descem obliquamente pelo retroperitônio sobre o músculo psoas maior (a direita cruza anteriormente a veia cava inferior), cruzando anteriormente o nervo genitofemoral e o ureter (dando pequenos ramos ureterais) e passando profundamente aos vasos cólicos. Na fossa ilíaca cruzam a parte distal da artéria ilíaca externa, entram no canal inguinal pelo anel inguinal profundo e descem dentro do funículo espermático até a margem posterior do testículo, onde se dividem em ramos testiculares e epididimários.',
    vasos: 'No funículo espermático, a artéria testicular é estreitamente envolvida pelas numerosas veias do plexo pampiniforme (troca de calor em contracorrente, que resfria o sangue arterial antes de chegar ao testículo) e anastomosa-se no testículo com a artéria do ducto deferente e a artéria cremastérica (via colateral em três fontes). É acompanhada pelo plexo nervoso testicular (T10–T11).',
    clinica: 'Sua origem aórtica alta em L2 reflete a embriologia do testículo, que se forma na crista urogenital lombar e desce até o escroto. Em cirurgias retroperitoneais e de cólon, os vasos testiculares cruzam o ureter pela frente; na hernioplastia inguinal e na correção cirúrgica de varicocele (varicocelectomia subinguinal microcirúrgica), a artéria testicular deve ser cuidadosamente poupada para evitar atrofia testicular.',
  }, {
    kind: 'arteria',
    layer: 'arteria',
    mat: 'artery',
    relacionados: ['aorta_abdominal', 'arteria_renal', 'veia_testicular', 'testiculo', 'epididimo', 'ducto_deferente', 'funiculo_espermatico', 'canal_inguinal', 'ureter_direito', 'ureter_esquerdo', 'psoas_maior'],
  }),

  urin('veia_testicular', 'Veia testicular e plexo pampiniforme', 'Vena testicularis; Plexus pampiniformis', ['veia_testicular'], '#4a74b8', {
    local: 'Inicia-se na margem posterior do testículo e do epidídimo como uma rede enovelada de 8 a 12 veias anastomosadas — o **plexo venoso pampiniforme** —, que envolve a artéria testicular e constitui a massa mais volumosa do funículo espermático. Ao atravessar o canal inguinal e o anel inguinal profundo, o plexo coalescer em 2 ou 3 veias que logo se unem em uma única **veia testicular** de cada lado.',
    relacoes: 'As veias testiculares sobem no retroperitônio sobre o psoas maior, acompanhando lateralmente as artérias testiculares e cruzando anteriormente os ureteres. Apresentam uma **assimetria anatômica fundamental na desembocadura**: **a veia testicular direita desemboca diretamente na face anterolateral da veia cava inferior em ângulo agudo**, enquanto **a veia testicular esquerda sobe mais alto e desemboca perpendicularmente (em ângulo de 90°) na veia renal esquerda**.',
    vasos: 'Possuem válvulas venosas (frequentemente ausentes ou insuficientes no óstio da veia testicular esquerda na veia renal) e comunicam-se no escroto com as veias cremastéricas (tributárias da epigástrica inferior) e pudendas externas.',
    clinica: 'O plexo pampiniforme atua como trocador de calor em contracorrente, resfriando o sangue da artéria testicular de 37 °C para ~34–35 °C. **A varicocele (dilatação e tortuosidade do plexo pampiniforme, com sensação palpatória de "saco de vermes" e importante causa tratável de infertilidade masculina) ocorre em 85 a 90 % das vezes à esquerda**, porque a veia testicular esquerda é mais longa, entra em ângulo reto na veia renal esquerda (maior pressão hidrostática) e a veia renal esquerda pode ser comprimida na pinça aórtico-mesentérica. Uma varicocele aguda de início recente ou que não esvazia em decúbito sugere compressão retroperitoneal ou trombo tumoral na veia renal (carcinoma de células renais).',
  }, {
    kind: 'veia',
    layer: 'veia',
    mat: 'vein',
    relacionados: ['veia_cava_inferior', 'veia_renal', 'arteria_testicular', 'testiculo', 'epididimo', 'ducto_deferente', 'funiculo_espermatico', 'canal_inguinal', 'ureter_direito', 'ureter_esquerdo', 'rim_esquerdo'],
  }),

  urin('arteria_dorsal_penis', 'Artéria dorsal do pênis', 'Arteria dorsalis penis', ['arteria_dorsal_penis'], '#d9453d', {
    local: 'Ramo terminal da artéria pudenda interna (ao lado da artéria profunda do pênis), originado na bolsa profunda do períneo. Perfura a membrana perineal, passa entre o ramo do pênis e a sínfise púbica, atravessa o ligamento suspensor do pênis e segue para a frente no dorso do pênis.',
    relacoes: 'No dorso dos corpos cavernosos, profundamente à fáscia profunda do pênis (de Buck), **as duas artérias dorsais do pênis correm lado a lado: medialmente a elas fica a veia dorsal profunda (ímpar), e lateralmente a cada artéria corre o nervo dorsal do pênis correspondente** (do centro para os lados: Veia — Artéria — Nervo).',
    vasos: 'Emite ramos superficiais para a pele e as fáscias do pênis, ramos circunflexos que contornam os corpos cavernosos para suprir o corpo esponjoso e a uretra, e termina ramificando-se na glande do pênis e no prepúcio.',
    clinica: 'Supre o tecido fibroso dos corpos cavernosos, o corpo esponjoso, a pele peniana e principalmente a glande do pênis. Em cirurgias reconstrutivas de uretra e faloplastias, sua disposição constante sob a fáscia de Buck ao lado do nervo dorsal é referência anatômica essencial.',
  }, {
    kind: 'arteria',
    layer: 'arteria',
    mat: 'artery',
    relacionados: ['arteria_pudenda_interna', 'veia_dorsal_profunda_penis', 'corpo_cavernoso_penis', 'corpo_esponjoso_penis', 'glande_penis'],
  }),

  urin('veia_dorsal_profunda_penis', 'Veia dorsal profunda do pênis', 'Vena dorsalis profunda penis', ['veia_dorsal_profunda_penis'], '#4a74b8', {
    local: 'Veia mediana ímpar (às vezes dupla em trechos) que se origina atrás da coroa da glande do pênis pela confluência do plexo venoso retrocoronal e corre para trás no sulco mediano dorsal entre os dois corpos cavernosos, profundamente à fáscia profunda do pênis (de Buck) e entre as duas artérias dorsais do pênis.',
    relacoes: 'Ao longo do corpo do pênis recebe as veias emissárias e as veias circunflexas que drenam o sangue dos corpos cavernosos e do corpo esponjoso. Na raiz do pênis, passa entre as duas lâminas do ligamento suspensor do pênis e **entra na pelve por baixo da sínfise púbica (entre o ligamento arqueado do púbis e o ligamento transverso do períneo)** para desembocar diretamente no **plexo venoso prostático** (e não na veia pudenda interna, ao contrário da veia dorsal superficial, que drena para a veia safena magna via pudendas externas).',
    vasos: 'Possui válvulas venosas ao longo de seu trajeto dorsal e comunica-se na pelve com o plexo venoso vesical e as veias ilíacas internas.',
    clinica: 'É a principal via de retorno venoso do tecido erétil dos corpos cavernosos e da glande; a falha na compressão de suas tributárias subtúnicas durante a ereção causa disfunção erétil por fuga venosa. Na prostatectomia radical retropúbica, o complexo da veia dorsal profunda (complexo de Santorini), logo atrás da sínfise púbica e à frente do ápice da próstata, deve ser ligado com precisão para evitar sangramento venoso intenso.',
  }, {
    kind: 'veia',
    layer: 'veia',
    mat: 'vein',
    relacionados: ['arteria_dorsal_penis', 'veia_pudenda_interna', 'veia_iliaca_interna', 'prostata', 'corpo_cavernoso_penis', 'corpo_esponjoso_penis', 'glande_penis'],
  }),

  /* ═════════════════════ Canal inguinal, funículo espermático e músculo cremaster (por código) ═════════════════════ */
  urin('canal_inguinal', 'Canal inguinal e anéis inguinais — esquema', 'Canalis inguinalis; Anulus inguinalis profundus et superficialis', null, C_INGUINAL, {
    local: 'Passagem oblíqua de 4 cm de comprimento na parte inferior da parede abdominal anterolateral, logo acima e paralela à metade medial do ligamento inguinal (de Poupart). Começa no **anel inguinal profundo (interno)** — evaginação da fáscia transversal situada 1,5 cm acima do ponto médio inguinal e **lateralmente aos vasos epigástricos inferiores** — e termina no **anel inguinal superficial (externo)** — fenda triangular na aponeurose do músculo oblíquo externo (entre os pilares medial e lateral, reforçada pelas fibras intercrurais e pelo ligamento reflexo), superolateral ao tubérculo púbico.',
    relacoes: 'Possui quatro paredes clássicas ("MALT"): 1) **parede anterior**: aponeurose do oblíquo externo em toda a extensão, reforçada no terço lateral por fibras do oblíquo interno; 2) **parede posterior**: fáscia transversal em toda a extensão, reforçada no terço medial pela foice inguinal (tendão conjunto do oblíquo interno e transverso) — na parede posterior fica o **trígono inguinal (de Hesselbach)**, limitado medialmente pela borda lateral do reto do abdome, lateralmente pelos vasos epigástricos inferiores e inferiormente pelo ligamento inguinal; 3) **teto (superior)**: fibras arqueadas dos músculos oblíquo interno e transverso do abdome; e 4) **assoalho (inferior)**: ligamento inguinal (borda inferior revirada da aponeurose do oblíquo externo, da espinha ilíaca anterossuperior ao tubérculo púbico) e, medialmente, o ligamento lacunar (de Gimbernat).',
    vasos: 'Transmite no homem o **funículo espermático** (e na mulher o ligamento redondo do útero), além do **nervo ilioinguinal (L1)** (que entra no canal perfurando o oblíquo interno, corre fora do funículo e sai pelo anel superficial) e do **ramo genital do nervo genitofemoral (L1–L2)**. Os vasos epigástricos inferiores (ramos da ilíaca externa) sobem na parede posterior medialmente ao anel inguinal profundo.',
    clinica: 'Representa uma área de fraqueza natural da parede abdominal (originada pela descida embrionária do testículo e do processo vaginal). **A hérnia inguinal indireta** (a mais comum, 2/3 dos casos) entra no canal pelo anel inguinal profundo **lateralmente aos vasos epigástricos inferiores**, dentro das túnicas do funículo espermático, podendo descer até o escroto; **a hérnia inguinal direta** (adquirida, por fraqueza da fáscia transversal) protrui pela parede posterior no trígono de Hesselbach, **medialmente aos vasos epigástricos inferiores**, raramente descendo ao escroto.',
    nota: 'ESQUEMA: modelado por código com o envoltório do canal inguinal (do anel profundo ao superficial) e a faixa do ligamento inguinal (da espinha ilíaca anterossuperior ao tubérculo púbico), medidos diretamente sobre o osso do quadril, o ducto deferente e os vasos testiculares.',
  }, {
    kind: 'estrutura',
    mat: 'fascia',
    paired: true,
    proc: [
      // Túnel do canal inguinal: do anel inguinal profundo [0.97, -6.81, 0.42] ao anel inguinal superficial [0.35, -7.32, 0.65]
      { kind: 'tube', pts: [[0.97, -6.81, 0.42], [0.82, -6.93, 0.58], [0.62, -7.06, 0.64], [0.46, -7.18, 0.66], [0.35, -7.32, 0.65]], ref: [0, 0, 1], width: 0.068, thick: 0.052, taper: 'blunt', nf: 20, nc: 12 },
      // Ligamento inguinal (de Poupart, assoalho do canal): da EIAS [1.28, -6.41, 0.54] ao tubérculo púbico [0.19, -7.35, 0.54]
      { kind: 'tube', pts: [[1.28, -6.41, 0.54], [0.98, -6.78, 0.56], [0.66, -7.08, 0.56], [0.38, -7.26, 0.55], [0.19, -7.35, 0.54]], ref: [0, 0, 1], width: 0.032, thick: 0.018, taper: 'blunt', nf: 22, nc: 8 },
    ],
    relacionados: ['funiculo_espermatico', 'cremaster', 'ducto_deferente', 'testiculo', 'obliquo_externo', 'obliquo_interno', 'transverso_abdome', 'reto_abdome', 'o_osso_quadril', 'arteria_epigastrica_inferior', 'arteria_testicular', 'veia_testicular', 'linfonodos_inguinais'],
  }),

  urin('funiculo_espermatico', 'Funículo espermático (cordão espermático) — esquema', 'Funiculus spermaticus', null, '#d4a67a', {
    local: 'Estrutura cilíndrica que suspende o testículo no escroto e reúne os vasos, nervos e o ducto que vão ao testículo ou dele saem. Começa no **anel inguinal profundo** (lateralmente à artéria epigástrica inferior), atravessa obliquamente o **canal inguinal**, emerge pelo **anel inguinal superficial** sobre o tubérculo púbico e desce pelo escroto até a margem posterior do testículo.',
    relacoes: 'Ao atravessar as camadas da parede abdominal durante a descida testicular, recebe **três túnicas concêntricas**: 1) **fáscia espermática interna** (profunda, derivada da fáscia transversal no anel profundo); 2) **fáscia cremastérica com o músculo cremaster** (média, derivada da fáscia e das fibras do músculo oblíquo interno); e 3) **fáscia espermática externa** (superficial, derivada da aponeurose de revestimento do oblíquo externo no anel superficial). O nervo ilioinguinal corre aplicado à face externa do funículo no canal inguinal.',
    vasos: 'Contém em seu interior ("3 artérias, 3 nervos e 3 outras estruturas"): **3 artérias** — artéria testicular (da aorta), artéria do ducto deferente (da vesical inferior/superior) e artéria cremastérica (da epigástrica inferior); **3 outras estruturas** — o **ducto deferente** (posterior), o **plexo venoso pampiniforme** (anterior e mais volumoso) e os **vasos linfáticos testiculares** (que vão aos linfonodos lombares, mais o vestígio do processo vaginal); e **3 estruturas nervosas** — o **ramo genital do nervo genitofemoral** (para o cremaster), fibras simpáticas e aferentes viscerais do plexo testicular e do ducto deferente, e o nervo ilioinguinal (junto ao funículo).',
    clinica: 'Por conter três artérias anastomosadas entre si (testicular, deferencial e cremastérica), a secção isolada de uma delas pode não necrosar o testículo, mas a torção do funículo espermático obstrui todo o pedículo vascular de uma vez. A persistência do processo vaginal peritoneal no interior do funículo espermático dá origem à hérnia inguinal indireta congênita e à hidrocele comunicante ou ao cisto de cordão.',
    nota: 'ESQUEMA: a bainha das túnicas espermáticas não existe como malha no BodyParts3D; foi modelada por código envolvendo diretamente os trajetos reais do ducto deferente e da artéria e veia testiculares, do anel inguinal profundo até o testículo.',
  }, {
    kind: 'estrutura',
    mat: 'fascia',
    paired: true,
    proc: [
      { kind: 'tube', pts: [[0.92, -6.85, 0.56], [0.66, -7.04, 0.64], [0.42, -7.24, 0.66], [0.28, -7.52, 0.63], [0.21, -7.85, 0.59], [0.19, -8.18, 0.59]], ref: [0, 0, 1], width: 0.052, thick: 0.044, taper: 'blunt', nf: 24, nc: 12 },
    ],
    relacionados: ['canal_inguinal', 'cremaster', 'ducto_deferente', 'testiculo', 'epididimo', 'arteria_testicular', 'veia_testicular', 'arteria_epigastrica_inferior', 'obliquo_externo', 'obliquo_interno', 'transverso_abdome'],
  }),

  {
    kind: 'musculo',
    id: 'cremaster',
    name: 'Cremaster — esquema',
    latin: 'M. cremaster',
    layer: 'urinario',
    region: T,
    color: '#c2524c',
    paired: true,
    proc: [
      { kind: 'tube', pts: [[0.76, -6.96, 0.63], [0.52, -7.14, 0.67], [0.35, -7.36, 0.67], [0.25, -7.68, 0.65], [0.21, -8.02, 0.65], [0.18, -8.32, 0.66], [0.15, -7.95, 0.61], [0.18, -7.38, 0.56]], ref: [0, 0, 1], width: 0.036, thick: 0.016, taper: 'blunt', nf: 26, nc: 10 },
    ],
    campos: [
      ['Ação', 'Eleva reflexamente o testículo e o funículo espermático em direção ao anel inguinal superficial, aproximando a gônada do corpo para termorregulação (frio) e proteção mecânica.'],
      ['Origem', 'Margem inferior do músculo oblíquo interno do abdome (e, às vezes, do transverso do abdome) e face superior do terço médio do ligamento inguinal.'],
      ['Inserção', 'Suas fibras descem em alças (fascículos lateral e medial) dentro da fáscia cremastérica ao redor do funículo espermático e da túnica vaginal do testículo, retornando para inserir-se no tubérculo púbico e na crista púbica.'],
      ['Inervação', 'Ramo genital do nervo genitofemoral (L1–L2).'],
    ],
    nota: 'ESQUEMA: músculo estriado esquelético (mas de controle reflexo involuntário) derivado do oblíquo interno durante a descida testicular; modelado por código em alça ao longo do funículo espermático. **Reflexo cremastérico**: o estímulo tátil leve na pele superomedial da coxa (via aferente: ramo femoral do genitofemoral e nervo ilioinguinal, L1–L2) provoca a contração rápida do cremaster e a elevação ipsilateral do testículo (via eferente: ramo genital do genitofemoral, L1–L2); sua abolição é sinal clínico clássico na torção testicular. Atua em sinergia térmica com o músculo dartos (liso, da tela subcutânea do escroto, simpático).',
    relacionados: ['funiculo_espermatico', 'canal_inguinal', 'testiculo', 'epididimo', 'ducto_deferente', 'obliquo_interno', 'transverso_abdome', 'arteria_epigastrica_inferior', 'arteria_testicular'],
  },
];

/**
 * Órgãos só do homem: saem de cena quando a camada `feminino` (o modelo feminino, F6.5) está ligada, porque o útero, a vagina e a
 * vulva ocupam o mesmo lugar na pelve e no períneo (ver `itemVisible` em main.js). Bexiga, ureteres, rins e canal inguinal ficam.
 */
const MASCULINOS = new Set(['uretra_masculina', 'testiculo', 'epididimo', 'ducto_deferente', 'vesicula_seminal', 'ducto_ejaculatorio', 'prostata', 'glandulas_bulbouretrais', 'corpo_cavernoso_penis', 'corpo_esponjoso_penis', 'glande_penis', 'arteria_testicular', 'veia_testicular', 'arteria_dorsal_penis', 'veia_dorsal_profunda_penis', 'funiculo_espermatico', 'cremaster']);
for (const i of URIN_ITEMS) if (MASCULINOS.has(i.id)) i.sexo = 'm';
