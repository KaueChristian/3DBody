/**
 * Sistema genital feminino e mama (F6.5), na camada `feminino` (opcional: desligada por padrão). Ligar a camada é ver o “modelo
 * feminino”: os órgãos genitais masculinos (`sexo: 'm'` em catalog-urin.js) saem de cena, porque os dois ocupariam a mesma pelve.
 *
 * Malhas reais do Atlas de Referência Humano (HRA, HuBMAP/NIH, CC BY 4.0; Visible Human feminino) em `dist/anatomy-fem.js`: útero
 * (fundo, corpo, istmo e colo), tubas uterinas (istmo, ampola, infundíbulo e fímbrias), ovários, mama (corpo adiposo, glândula e
 * papila com a aréola) e a pelve feminina. Útero, tubas e ovários foram levados à pelve do atlas pela transformação que ajusta os ossos
 * da pelve feminina do HRA aos do BodyParts3D (tools/fit_fem.py); a mama, por escala real com a papila no 4º espaço intercostal; a
 * pelve feminina fica fora do corpo, à direita, só para comparação (tools/convert_fem.py).
 *
 * Vagina, uretra feminina, vulva (lábios, clitóris, bulbos do vestíbulo e glândulas vestibulares maiores), os ligamentos do útero e do
 * ovário e as artérias uterina e ovárica e a veia ovárica não existem no HRA nem no BodyParts3D: são esquemas por código (`proc`) sobre
 * pontos medidos no modelo (colo do útero, bexiga, canal anal, sínfise púbica, ramos isquiopúbicos, ureteres, vasos ilíacos e o
 * trajeto dos vasos testiculares, que os ováricos repetem até a abertura superior da pelve); cada ficha declara `ESQUEMA` na nota.
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.); Netter — Atlas de anatomia
 * humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 */

const T = 'tronco';

const C_UTERO = '#b85c6e';
const C_COLO = '#c9768a';
const C_TUBA = '#d8956f';
const C_OVARIO = '#e8c9a8';
const C_VAGINA = '#c97f8c';
const C_VULVA = '#d7a08c';
const C_ERETIL = '#a84858';
const C_LIG = '#e3c9a0';
const C_PERIT = '#d9b3b8';
const C_ART = '#d9453d';
const C_VEIA = '#4a74b8';

/** O corpo do atlas é masculino: toda peça do HRA diz que a posição é de referência. */
const HRA_FONTE = 'malha real do Atlas de Referência Humano (HuBMAP/NIH, CC BY 4.0), modelada no Visible Human feminino (doadora de 59 anos, na pós-menopausa)';
const HRA_POS = `POSIÇÃO DE REFERÊNCIA: ${HRA_FONTE}; o útero e os ovários são menores que os de uma mulher em idade reprodutiva. Como o corpo do atlas é masculino, o conjunto foi levado à pelve dele pela mesma transformação que ajusta os ossos da pelve feminina do HRA aos do atlas; a relação com a bexiga, o reto e o colo sigmoide, que são de outra pessoa, é aproximada.`;
/** A mama não segue a pelve: escala real, papila no 4º espaço intercostal (tools/convert_fem.py). */
const MAMA_POS = `POSIÇÃO DE REFERÊNCIA: ${HRA_FONTE}. O corpo do atlas é masculino: a mama foi posta no tórax em escala real, com a papila no 4º espaço intercostal, na linha medioclavicular, e a base apoiada no peitoral maior; por isso fica por fora da pele do atlas.`;

const fem = (id, name, latin, parts, color, d, extra = {}) => ({
  kind: extra.kind ?? 'orgao',
  id,
  name,
  latin,
  layer: 'feminino',
  region: T,
  color,
  ...(parts ? { parts: parts.map((p) => ({ id: p, mat: extra.mat ?? 'viscera' })), malha: 'hra', paired: false } : { mat: extra.mat ?? 'viscera' }),
  campos: d.campos ?? [
    ['Localização e partes', d.local],
    ['Relações e peritônio', d.relacoes],
    ['Vascularização e inervação', d.vasos],
    ['Função e clínica', d.clinica],
  ],
  nota: d.nota ?? (parts ? HRA_POS : undefined),
  ...extra,
});

/** Tubo por pontos (proc.js, `buildTube`): `ref` é a direção da espessura; a largura fica perpendicular a ela e ao trajeto. */
const tube = (pts, width, thick, ref = [0, 0, 1], o = {}) => ({ kind: 'tube', pts, ref, width, thick, taper: 'blunt', nf: o.nf ?? Math.max(14, pts.length * 5), nc: o.nc ?? 10, ...o });

export const FEM_ITEMS = [
  /* ═════════════════════ Útero (malhas do HRA) ═════════════════════ */
  fem('utero_fundo', 'Fundo do útero', 'Fundus uteri', ['utero_fundo'], C_UTERO, {
    local: 'Parte arredondada do corpo do útero situada acima da linha que une os óstios uterinos das tubas. Os ângulos superolaterais são os cornos do útero, onde cada tuba uterina penetra na parede; logo abaixo e à frente da tuba prende-se o ligamento redondo do útero e, abaixo e atrás dela, o ligamento útero-ovárico.',
    relacoes: 'Coberto pelo peritônio (perimétrio), que continua lateralmente nas duas lâminas do ligamento largo. No útero antevertido e antefletido, o fundo fica voltado para a frente e para cima, sobre a face superior da bexiga urinária; alças do íleo e o colo sigmoide repousam sobre ele e sobre a face posterior do corpo.',
    vasos: 'Irrigado pelos ramos terminais da artéria uterina, que sobe pela margem lateral do útero e se anastomosa no corno com a artéria ovárica (ramos tubário e ovárico). A linfa do fundo e da parte superior do corpo acompanha os vasos ováricos até os linfonodos lombares; parte segue o ligamento redondo até os linfonodos inguinais superficiais. Inervação autônoma pelo plexo uterovaginal; a dor do fundo e do corpo, acima da “linha de dor pélvica”, sobe com as fibras simpáticas até os segmentos torácicos inferiores e lombares superiores da medula.',
    clinica: 'Na gestação o fundo sobe e serve de referência ao exame: por volta de 12 semanas passa a ser palpado acima da sínfise púbica, perto de 20 semanas chega ao umbigo e por volta de 36 semanas alcança o processo xifoide. Entre 20 e 36 semanas a altura do fundo uterino em centímetros, medida da sínfise, aproxima-se da idade gestacional em semanas. A linfa que segue o ligamento redondo explica metástases de câncer do útero nos linfonodos inguinais superficiais.',
  }, {
    relacionados: ['utero_corpo', 'utero_istmo', 'colo_utero', 'tuba_istmo', 'lig_redondo_utero', 'lig_utero_ovarico', 'lig_largo_utero', 'arteria_uterina', 'arteria_ovarica', 'bexiga_urinaria', 'colo_sigmoide', 'linfonodos_lombares', 'linfonodos_inguinais'],
  }),

  fem('utero_corpo', 'Corpo do útero', 'Corpus uteri', ['utero_corpo'], C_UTERO, {
    local: 'Os dois terços superiores do útero, órgão muscular oco em forma de pera invertida (na nulípara, cerca de 7,5 cm de comprimento, 5 cm de largura e 2 a 2,5 cm de espessura). Tem uma face vesical (anteroinferior), uma face intestinal (posterossuperior) e duas margens laterais. A cavidade do útero é uma fenda triangular no plano frontal, com os óstios das tubas nos ângulos superiores e o óstio interno no ângulo inferior. A parede tem três camadas: perimétrio (serosa), miométrio (músculo liso espesso) e endométrio (mucosa que se renova a cada ciclo).',
    relacoes: 'Na posição habitual o útero está antevertido (o eixo do colo forma cerca de 90° com o da vagina) e antefletido (o corpo dobra-se para a frente sobre o colo), apoiado na bexiga. O peritônio cobre as duas faces: na frente reflete-se sobre a bexiga na altura do istmo, formando a escavação vesicouterina; atrás desce até o fórnice posterior da vagina antes de passar ao reto, formando a escavação retouterina (de Douglas). Das margens laterais partem as duas lâminas do ligamento largo, entre as quais sobem as artérias uterinas.',
    vasos: 'Artérias uterinas (ramos da divisão anterior da artéria ilíaca interna), tortuosas ao longo das margens laterais, com anastomose com as artérias ováricas. As veias formam o plexo venoso uterino no ligamento largo e drenam para as veias ilíacas internas. A linfa do corpo vai sobretudo aos linfonodos ilíacos externos; a do fundo, aos lombares. Plexo uterovaginal, formado a partir do plexo hipogástrico inferior: fibras simpáticas dos segmentos torácicos inferiores e lombares superiores e parassimpáticas de S2–S4 (nervos esplâncnicos pélvicos).',
    clinica: 'O endométrio prolifera e descama a cada ciclo menstrual e recebe o embrião na nidação. Os leiomiomas (miomas), tumores benignos do miométrio, são os tumores pélvicos mais comuns da mulher e causam sangramento aumentado e dor. O sangramento depois da menopausa é o sinal de alerta do carcinoma do endométrio. Na retroversão, o corpo inclina-se para trás, sobre o reto.',
  }, {
    relacionados: ['utero_fundo', 'utero_istmo', 'colo_utero', 'lig_largo_utero', 'lig_redondo_utero', 'arteria_uterina', 'bexiga_urinaria', 'reto', 'colo_sigmoide', 'arteria_iliaca_interna', 'veia_iliaca_interna', 'linfonodos_iliacos'],
  }),

  fem('utero_istmo', 'Istmo do útero (segmento inferior)', 'Isthmus uteri', ['utero_istmo'], C_COLO, {
    local: 'Parte estreitada, de cerca de 1 cm, entre o corpo e o colo do útero. Por dentro corresponde à passagem da cavidade do corpo para o canal do colo (óstio anatômico interno). O modelo do HRA chama esta região de “segmento uterino inferior”, nome que ela recebe na gestação.',
    relacoes: 'É na altura do istmo que o peritônio da face anterior do útero se reflete sobre a bexiga, formando a escavação vesicouterina. Lateralmente, na base do ligamento largo, a artéria uterina chega à margem do útero logo abaixo do istmo, depois de cruzar por cima do ureter.',
    vasos: 'Ramos da artéria uterina, no ponto em que ela se divide no ramo ascendente (para o corpo) e no ramo cervicovaginal (para o colo e a vagina). Drenagem para o plexo venoso uterino e linfa para os linfonodos ilíacos externos e internos. Plexo uterovaginal.',
    clinica: 'No fim da gestação o istmo se alonga e afina e passa a fazer parte da parede do útero gravídico como segmento inferior. Por ter menos músculo e sangrar menos, é ali que se faz a incisão transversal baixa da cesariana, que também tem menor risco de ruptura do útero numa gestação seguinte.',
  }, {
    relacionados: ['utero_corpo', 'colo_utero', 'bexiga_urinaria', 'arteria_uterina', 'ureter_direito', 'ureter_esquerdo', 'lig_largo_utero'],
  }),

  fem('colo_utero', 'Colo do útero', 'Cervix uteri', ['colo_utero'], C_COLO, {
    local: 'Terço inferior do útero, cilíndrico, com cerca de 2,5 cm. Divide-se em parte supravaginal (acima da inserção da vagina) e parte vaginal (que se projeta na parte superior da vagina, cercada pelos fórnices anterior, posterior — o mais profundo — e laterais). O canal do colo vai do óstio interno ao óstio externo, puntiforme na nulípara e em fenda transversal depois de um parto vaginal. A malha do HRA traz junto a junção do colo com a vagina.',
    relacoes: 'A parte supravaginal fica atrás da bexiga, separada dela por tecido conjuntivo, e tem o ureter a cerca de 2 cm de cada lado, cruzado por cima pela artéria uterina. Atrás, o peritônio do fórnice posterior forma a escavação retouterina, ponto mais baixo da cavidade peritoneal na mulher em pé. O colo é o ponto de fixação dos principais meios de sustentação do útero: os ligamentos transversos do colo (cardinais), lateralmente, e os uterossacros, atrás.',
    vasos: 'Ramo cervicovaginal da artéria uterina; veias para o plexo venoso uterovaginal. A linfa do colo vai aos linfonodos ilíacos internos, ilíacos externos e sacrais. A dor do colo e da parte superior da vagina, abaixo da “linha de dor pélvica”, segue as fibras parassimpáticas (S2–S4).',
    clinica: 'A ectocérvice tem epitélio escamoso; o canal, epitélio colunar mucossecretor. A transição entre os dois (zona de transformação) é onde surge quase todo o câncer do colo, ligado ao HPV; o exame citopatológico (Papanicolau) e a vacina contra o HPV são as medidas de prevenção. No parto, o colo se apaga e se dilata até cerca de 10 cm. No prolapso uterino o colo desce pela vagina quando os ligamentos e o assoalho pélvico enfraquecem.',
  }, {
    relacionados: ['utero_istmo', 'utero_corpo', 'vagina', 'bexiga_urinaria', 'reto', 'ureter_direito', 'ureter_esquerdo', 'arteria_uterina', 'lig_transverso_colo', 'lig_uterossacro', 'linfonodos_iliacos'],
  }),

  /* ═════════════════════ Tubas uterinas e ovários (malhas do HRA) ═════════════════════ */
  fem('tuba_istmo', 'Tuba uterina — istmo', 'Tuba uterina, isthmus', ['tuba_istmo'], C_TUBA, {
    local: 'Cada tuba uterina tem cerca de 10 cm e quatro partes, de medial para lateral: parte uterina (intramural, dentro da parede do corno do útero, que se abre no óstio uterino), istmo, ampola e infundíbulo. O istmo é o terço medial, estreito e de parede muscular espessa, que continua a parte uterina. O modelo mostra a parte uterina dentro do corno do útero.',
    relacoes: 'Corre na margem superior livre do ligamento largo, envolvida pela mesossalpinge. Logo abaixo e à frente do ponto em que entra no útero prende-se o ligamento redondo; logo abaixo e atrás, o ligamento útero-ovárico.',
    vasos: 'Ramos tubários das artérias uterina e ovárica, que se anastomosam na mesossalpinge; veias homônimas. Linfa para os linfonodos lombares. Inervação pelos plexos ovárico e uterino.',
    clinica: 'É no istmo que se faz, em geral, a laqueadura tubária (ligadura ou retirada de um segmento da tuba), método definitivo de contracepção. A inflamação da tuba (salpingite, na doença inflamatória pélvica) pode estreitar o istmo e levar à infertilidade ou à gravidez ectópica.',
  }, {
    relacionados: ['tuba_ampola', 'utero_fundo', 'lig_largo_utero', 'lig_redondo_utero', 'lig_utero_ovarico', 'arteria_uterina', 'arteria_ovarica'],
  }),

  fem('tuba_ampola', 'Tuba uterina — ampola', 'Tuba uterina, ampulla', ['tuba_ampola'], C_TUBA, {
    local: 'A parte mais longa e larga da tuba (mais da metade do seu comprimento), entre o istmo e o infundíbulo. A mucosa tem pregas longitudinais altas e ramificadas, com células ciliadas e secretoras.',
    relacoes: 'Arqueia-se sobre o polo superior (tubário) do ovário, na margem superior do ligamento largo (mesossalpinge), perto da parede lateral da pelve.',
    vasos: 'Ramos tubários das artérias ovárica e uterina; veias para o plexo ovárico e uterino. Linfa para os linfonodos lombares. Plexo ovárico.',
    clinica: 'A fecundação acontece habitualmente na ampola. É também o local mais comum da gravidez ectópica, que pode romper a tuba entre a 6ª e a 8ª semana e causar hemorragia intraperitoneal grave; à direita, a dor pode ser confundida com apendicite.',
  }, {
    relacionados: ['tuba_istmo', 'tuba_infundibulo', 'ovario', 'lig_largo_utero', 'arteria_ovarica', 'arteria_uterina'],
  }),

  fem('tuba_infundibulo', 'Tuba uterina — infundíbulo e fímbrias', 'Tuba uterina, infundibulum; fimbriae tubae', ['tuba_infundibulo'], C_TUBA, {
    local: 'Extremidade lateral da tuba, em forma de funil, que se abre na cavidade peritoneal pelo óstio abdominal. A borda do funil é recortada em projeções digitiformes, as fímbrias; uma delas, a fímbria ovárica, é mais longa e se prende ao polo superior do ovário.',
    relacoes: 'Fica junto ao polo tubário do ovário, perto do ligamento suspensor do ovário e da parede lateral da pelve. Por meio do óstio abdominal, a cavidade peritoneal da mulher comunica-se com o exterior (tuba, útero e vagina).',
    vasos: 'Ramos tubários da artéria ovárica, que chega pelo ligamento suspensor do ovário; drenagem para o plexo pampiniforme do ovário. Linfa para os linfonodos lombares.',
    clinica: 'Na ovulação, as fímbrias “varrem” a superfície do ovário e captam o ovócito. A comunicação do peritônio com o exterior explica que uma infecção genital ascendente chegue à pelve (peritonite pélvica) e, raramente, ao espaço sub-hepático (síndrome de Fitz-Hugh–Curtis).',
  }, {
    relacionados: ['tuba_ampola', 'ovario', 'lig_suspensor_ovario', 'arteria_ovarica', 'veia_ovarica'],
  }),

  fem('ovario', 'Ovário', 'Ovarium', ['ovario'], C_OVARIO, {
    local: 'Gônada feminina par, em forma de amêndoa (no adulto jovem, cerca de 3 × 1,5 × 1 cm), situada na fossa ovárica da parede lateral da pelve. Tem um polo superior (tubário), ligado ao ligamento suspensor do ovário e à fímbria ovárica, e um polo inferior (uterino), ligado ao útero pelo ligamento útero-ovárico; a margem anterior (mesovárica) tem o hilo do ovário.',
    relacoes: 'A fossa ovárica é limitada pelos vasos ilíacos externos (acima e à frente) e pelos vasos ilíacos internos e o ureter (atrás); o nervo obturatório corre na parede lateral, junto a ela. O ovário prende-se à face posterior do ligamento largo pelo mesovário. A superfície não é coberta por peritônio verdadeiro, mas por um epitélio superficial cúbico: o ovócito é liberado na cavidade peritoneal.',
    vasos: 'Artéria ovárica (da aorta abdominal, pelo ligamento suspensor do ovário) e ramo ovárico da artéria uterina. As veias formam um plexo pampiniforme que origina a veia ovárica: a direita drena para a veia cava inferior e a esquerda, para a veia renal esquerda. A linfa acompanha os vasos ováricos até os linfonodos lombares. Plexo ovárico (fibras aferentes até T10–T11).',
    clinica: 'Produz os ovócitos (oogênese) e os hormônios estrogênio e progesterona (ver “Sistema endócrino”). A dor de um processo no ovário pode ser referida à face medial da coxa, por irritação do nervo obturatório. A torção do ovário, em geral sobre um cisto, é emergência cirúrgica. O câncer de ovário costuma ser descoberto tarde e se espalha pela superfície do peritônio e pelos linfonodos lombares. O modelo não mostra folículos nem corpo lúteo.',
  }, {
    kind: 'orgao',
    relacionados: ['tuba_infundibulo', 'tuba_ampola', 'lig_suspensor_ovario', 'lig_utero_ovarico', 'lig_largo_utero', 'arteria_ovarica', 'veia_ovarica', 'arteria_uterina', 'arteria_iliaca_externa', 'arteria_iliaca_interna', 'ureter_direito', 'ureter_esquerdo', 'linfonodos_lombares'],
  }),

  /* ═════════════════════ Vagina, uretra feminina e vulva (por código) ═════════════════════ */
  fem('vagina', 'Vagina — esquema', 'Vagina', null, C_VAGINA, {
    local: 'Tubo musculomembranáceo de 7 a 9 cm que vai do colo do útero ao vestíbulo da vagina; a parede anterior (cerca de 7,5 cm) é mais curta que a posterior (cerca de 9 cm), porque o colo entra pela parede anterior. Em repouso as paredes estão encostadas e o lúmen tem forma de H em corte. Em volta da parte vaginal do colo formam-se os fórnices anterior, posterior (o mais profundo) e laterais. O óstio da vagina abre-se no vestíbulo, atrás do óstio externo da uretra, parcialmente fechado pelo hímen ou pelas carúnculas himenais.',
    relacoes: 'Na frente: o fundo da bexiga e a uretra, incrustada na parede anterior. Atrás: a escavação retouterina (pelo fórnice posterior), a ampola do reto e, embaixo, o corpo do períneo, que a separa do canal anal. Dos lados: os ureteres, perto dos fórnices laterais, e o músculo levantador do ânus (parte pubovaginal), que a comprime. Atravessa o diafragma da pelve e a membrana perineal.',
    vasos: 'Artéria vaginal (ramo da ilíaca interna ou da uterina) e ramo cervicovaginal da artéria uterina, além de ramos das artérias retal média e pudenda interna; plexo venoso vaginal para as veias ilíacas internas. A linfa da parte superior vai aos linfonodos ilíacos internos e externos; a da parte inferior, aos sacrais e ilíacos comuns; a do óstio, aos inguinais superficiais. Os três quartos superiores têm inervação visceral (plexo uterovaginal); só a parte inferior tem sensibilidade somática, pelo nervo pudendo.',
    clinica: 'Pelo fórnice posterior pode-se puncionar a escavação retouterina (culdocentese) para drenar líquido ou sangue da cavidade peritoneal. O exame com espéculo mostra o colo do útero. No parto, a vagina e o períneo se distendem muito; a episiotomia (corte do períneo) é feita só quando indicada. O enfraquecimento das paredes leva à cistocele (prolapso da bexiga pela parede anterior) e à retocele (do reto pela parede posterior).',
    nota: 'ESQUEMA: a vagina não existe no HRA nem no BodyParts3D. Foi modelada por código como um tubo achatado do colo do útero (malha do HRA) até o períneo, entre a bexiga e o canal anal do modelo (que é masculino), com largura e espessura aproximadas.',
  }, {
    paired: false,
    proc: [tube([[0, -7.26, -0.17], [0, -7.42, -0.195], [0, -7.6, -0.17], [0, -7.77, -0.13], [0, -7.92, -0.08]], [0.5, 0.32, 0.26, 0.27, 0.34], [0.3, 0.11, 0.08, 0.09, 0.12], [0, 0, 1], { nf: 30, nc: 16 })],
    relacionados: ['colo_utero', 'uretra_feminina', 'bexiga_urinaria', 'reto', 'canal_anal', 'ureter_direito', 'ureter_esquerdo', 'pubococcigeo', 'transverso_profundo_perineo', 'bulbos_vestibulo', 'glandulas_vestibulares_maiores', 'arteria_uterina', 'arteria_pudenda_interna', 'linfonodos_iliacos', 'linfonodos_inguinais'],
  }),

  fem('uretra_feminina', 'Uretra feminina — esquema', 'Urethra feminina', null, '#d69868', {
    local: 'Canal de cerca de 4 cm de comprimento e 6 mm de diâmetro, do óstio interno da uretra, no colo da bexiga, ao óstio externo da uretra, no vestíbulo da vagina, logo à frente do óstio da vagina e cerca de 2,5 cm atrás da glande do clitóris. Desce para a frente e para baixo, atrás e abaixo da sínfise púbica.',
    relacoes: 'Fica sobre a parede anterior da vagina, unida a ela pelo septo uretrovaginal. Atravessa a bolsa profunda do períneo, onde é envolvida pelo músculo esfíncter externo da uretra (estriado) e pelo esfíncter uretrovaginal, e perfura a membrana perineal. Na parede há glândulas uretrais e, junto ao óstio externo, as glândulas parauretrais (de Skene), homólogas da próstata.',
    vasos: 'Artérias pudenda interna e vaginal; veias para as homônimas. A linfa da maior parte da uretra vai aos linfonodos sacrais e ilíacos internos; a da parte distal, aos inguinais. Inervação pelo plexo vesical (autônomo) e pelo nervo pudendo (esfíncter externo e sensibilidade).',
    clinica: 'Curta, reta e próxima do ânus e da vagina, a uretra feminina explica a frequência muito maior de infecção urinária (cistite) na mulher, e torna o cateterismo vesical mais simples que no homem. A perda do apoio da uretra e do colo da bexiga pelo assoalho pélvico é a base da incontinência urinária de esforço.',
    nota: 'ESQUEMA: modelada por código do colo da bexiga (malha do BodyParts3D, que é masculina) até o vestíbulo, atrás da sínfise púbica e à frente da vagina. Com o modelo feminino ligado, a uretra masculina e a próstata saem de cena.',
  }, {
    paired: false,
    proc: [tube([[0, -7.44, -0.02], [0, -7.56, -0.025], [0, -7.68, -0.015], [0, -7.8, 0.01], [0, -7.885, 0.035]], 0.06, 0.06, [0, 0, 1], { nc: 12 })],
    relacionados: ['bexiga_urinaria', 'vagina', 'clitoris', 'esfincter_uretra', 'transverso_profundo_perineo', 'o_osso_quadril', 'arteria_pudenda_interna', 'linfonodos_iliacos'],
  }),

  fem('labios_menores', 'Lábios menores e vestíbulo da vagina — esquema', 'Labia minora pudendi; Vestibulum vaginae', null, C_VULVA, {
    local: 'Os lábios menores são duas pregas finas de pele, sem gordura e sem pelos, por dentro dos lábios maiores. Delimitam o vestíbulo da vagina, onde se abrem o óstio externo da uretra, o óstio da vagina e os ductos das glândulas vestibulares maiores e menores. À frente, cada lábio menor divide-se numa lâmina lateral, que forma o prepúcio do clitóris, e numa medial, que forma o frênulo do clitóris; atrás, os dois se unem no frênulo dos lábios menores (fúrcula).',
    relacoes: 'O vestíbulo fica entre os lábios menores, à frente do corpo do períneo e abaixo da sínfise púbica. Sob a pele dos lados do vestíbulo ficam os bulbos do vestíbulo e, atrás deles, as glândulas vestibulares maiores, cobertos pelo músculo bulboesponjoso. Os lábios menores, os lábios maiores, o monte do púbis, o clitóris, o vestíbulo e os bulbos formam o pudendo feminino (vulva).',
    vasos: 'Ramos labiais posteriores da artéria pudenda interna e, na frente, ramos labiais anteriores da artéria pudenda externa (da femoral). Linfa para os linfonodos inguinais superficiais. Inervação sensitiva pelos ramos labiais posteriores do nervo pudendo (perineal) e, na parte anterior, pelo nervo ilioinguinal e pelo ramo genital do genitofemoral.',
    clinica: 'A pele do vestíbulo é muito sensível e participa da resposta sexual. Os linfonodos inguinais superficiais são os primeiros a receber metástases do câncer da vulva. O bloqueio do nervo pudendo, junto à espinha isquiática, anestesia boa parte do períneo no parto.',
    nota: 'ESQUEMA: os lábios menores foram desenhados por código como pregas finas em volta do vestíbulo, na posição medida no períneo do modelo. A pele do atlas é masculina: com a pele visível, a vulva e o escroto ocupam o mesmo lugar. Para ver a vulva, deixe a pele transparente ou desligada.',
  }, {
    kind: 'estrutura',
    proc: [tube([[0.035, -7.86, 0.2], [0.07, -7.93, 0.08], [0.075, -7.97, -0.04], [0.05, -7.98, -0.13], [0.015, -7.97, -0.18]], 0.08, 0.016, [1, 0, 0], { nc: 8 })],
    relacionados: ['labios_maiores', 'clitoris', 'vagina', 'uretra_feminina', 'bulbos_vestibulo', 'glandulas_vestibulares_maiores', 'bulboesponjoso', 'arteria_pudenda_interna', 'linfonodos_inguinais'],
  }),

  fem('labios_maiores', 'Lábios maiores e monte do púbis — esquema', 'Labia majora pudendi; Mons pubis', null, '#d2a48e', {
    local: 'Os lábios maiores são duas pregas largas de pele com tecido adiposo, que limitam lateralmente a rima do pudendo. A face externa, pigmentada, tem pelos depois da puberdade; a interna é lisa e tem glândulas sebáceas. À frente, unem-se na comissura anterior, logo abaixo do monte do púbis (elevação de gordura sobre a sínfise púbica); atrás, na comissura posterior, à frente do ânus.',
    relacoes: 'Contêm a terminação do ligamento redondo do útero, que chega a eles pelo canal inguinal, e às vezes um resto do processo vaginal do peritônio (canal de Nuck). São homólogos do escroto.',
    vasos: 'Artérias pudendas externas (da femoral) na parte anterior e ramos labiais posteriores da pudenda interna na posterior. Linfa para os linfonodos inguinais superficiais. Inervação: nervo ilioinguinal e ramo genital do genitofemoral (ramos labiais anteriores, L1), ramos labiais posteriores do nervo pudendo (S2–S4) e ramo perineal do nervo cutâneo femoral posterior.',
    clinica: 'Uma hérnia inguinal indireta pode descer até o lábio maior, seguindo o ligamento redondo, assim como no homem desce ao escroto. O tecido frouxo dos lábios maiores acumula edema e hematomas com facilidade (por exemplo, depois de trauma ou do parto).',
    nota: 'ESQUEMA: desenhados por código na posição medida no períneo do modelo. A pele do atlas é masculina: com a pele visível, os lábios maiores ficam no lugar do escroto.',
  }, {
    kind: 'estrutura',
    proc: [tube([[0.09, -7.72, 0.42], [0.15, -7.86, 0.25], [0.17, -7.97, 0.06], [0.13, -8.0, -0.1], [0.05, -7.98, -0.2]], 0.13, 0.08, [1, 0, 0], { nc: 10 })],
    relacionados: ['labios_menores', 'clitoris', 'lig_redondo_utero', 'canal_inguinal', 'linfonodos_inguinais'],
  }),

  fem('clitoris', 'Clitóris — esquema', 'Clitoris', null, C_ERETIL, {
    local: 'Órgão erétil formado por dois corpos cavernosos. Cada ramo (crus) do clitóris começa preso à face interna do ramo isquiopúbico; os dois ramos se unem abaixo da sínfise púbica e formam o corpo do clitóris, que se dobra para baixo e termina na glande do clitóris, a única parte visível, coberta pelo prepúcio e presa ao frênulo (ambos formados pelos lábios menores).',
    relacoes: 'Os ramos são cobertos pelos músculos isquiocavernosos, na bolsa superficial do períneo; o corpo prende-se à sínfise pelo ligamento suspensor do clitóris. A glande fica na parte anterior do vestíbulo, cerca de 2,5 cm à frente do óstio externo da uretra. É homólogo dos corpos cavernosos do pênis, mas não é atravessado pela uretra.',
    vasos: 'Artérias profundas e dorsais do clitóris (ramos da pudenda interna); veia dorsal profunda do clitóris para o plexo venoso vesical. Inervação sensitiva muito rica pelo nervo dorsal do clitóris (ramo terminal do pudendo, S2–S4) e fibras parassimpáticas eretoras pelos nervos cavernosos (plexo uterovaginal).',
    clinica: 'É a principal estrutura sensitiva da resposta sexual feminina; a ereção segue o mesmo mecanismo do pênis (relaxamento do músculo liso das artérias e das cavernas). O nervo dorsal do clitóris pode ser lesado em fraturas do ramo isquiopúbico e em cirurgias do períneo.',
    nota: 'ESQUEMA: os ramos foram desenhados por código ao longo do mesmo trajeto dos ramos do pênis do BodyParts3D (presos ao ramo isquiopúbico) e o corpo e a glande, abaixo da sínfise púbica. As dimensões são aproximadas.',
  }, {
    proc: [
      tube([[0.24, -7.725, -0.07], [0.2, -7.7, -0.03], [0.16, -7.66, 0.07], [0.12, -7.62, 0.18], [0.04, -7.62, 0.25]], [0.03, 0.055, 0.06, 0.06, 0.06], 0.045, [1, 0, 0], { nc: 10 }),
      tube([[0.03, -7.62, 0.26], [0.018, -7.68, 0.29], [0.01, -7.76, 0.28]], 0.05, 0.045, [1, 0, 0], { nc: 10 }),
      tube([[0.006, -7.765, 0.278], [0.004, -7.81, 0.255]], 0.06, 0.05, [1, 0, 0], { nc: 10 }),
    ],
    relacionados: ['labios_menores', 'bulbos_vestibulo', 'uretra_feminina', 'isquiocavernoso', 'o_osso_quadril', 'arteria_pudenda_interna', 'veia_pudenda_interna'],
  }),

  fem('bulbos_vestibulo', 'Bulbos do vestíbulo — esquema', 'Bulbus vestibuli', null, C_ERETIL, {
    local: 'Duas massas alongadas de tecido erétil, de cerca de 3 cm, situadas de cada lado do óstio da vagina, por baixo dos lábios menores. Na frente afinam-se e ligam-se à glande do clitóris por uma faixa venosa; atrás encostam nas glândulas vestibulares maiores.',
    relacoes: 'Ficam na bolsa superficial do períneo, presos à face inferior da membrana perineal e cobertos pelo músculo bulboesponjoso, que, na mulher, se divide em duas metades em volta do óstio da vagina. São homólogos do bulbo do pênis e do corpo esponjoso.',
    vasos: 'Artéria do bulbo do vestíbulo (ramo da pudenda interna); drenagem para as veias pudendas internas. Inervação autônoma pelos nervos cavernosos e somática (músculo bulboesponjoso) pelo nervo pudendo.',
    clinica: 'Enchem-se de sangue na excitação sexual e estreitam o óstio da vagina. A ruptura do bulbo no parto ou num trauma causa hematoma vulvar volumoso.',
    nota: 'ESQUEMA: desenhados por código dos lados do óstio da vagina; dimensões aproximadas.',
  }, {
    proc: [tube([[0.05, -7.8, 0.17], [0.085, -7.86, 0.08], [0.1, -7.9, -0.02], [0.09, -7.92, -0.11]], [0.03, 0.07, 0.08, 0.05], 0.045, [1, 0, 0], { nc: 10 })],
    relacionados: ['clitoris', 'vagina', 'labios_menores', 'glandulas_vestibulares_maiores', 'bulboesponjoso', 'arteria_pudenda_interna'],
  }),

  fem('glandulas_vestibulares_maiores', 'Glândulas vestibulares maiores (de Bartholin) — esquema', 'Glandulae vestibulares majores', null, '#c77c88', {
    local: 'Duas glândulas arredondadas de cerca de 0,5 cm, situadas atrás e de cada lado do óstio da vagina, encostadas na extremidade posterior dos bulbos do vestíbulo. O ducto de cada uma, de cerca de 2 cm, abre-se no vestíbulo entre o hímen e o lábio menor, nas posições de 5 e 7 horas.',
    relacoes: 'Na bolsa superficial do períneo, parcialmente cobertas pelo músculo bulboesponjoso. São homólogas das glândulas bulbouretrais (de Cowper) do homem, que ficam na bolsa profunda.',
    vasos: 'Ramos da artéria do bulbo do vestíbulo e labiais posteriores (pudenda interna). Linfa para os linfonodos inguinais superficiais. Inervação secretora pelo plexo uterovaginal.',
    clinica: 'Secretam muco que lubrifica o vestíbulo durante a excitação sexual. A obstrução do ducto forma o cisto de Bartholin, que pode infeccionar e virar abscesso doloroso, tratado com drenagem ou marsupialização.',
    nota: 'ESQUEMA: modeladas por código atrás dos bulbos do vestíbulo; tamanho aproximado.',
  }, {
    kind: 'glandula',
    proc: [tube([[0.085, -7.93, -0.15], [0.075, -7.945, -0.195]], 0.055, 0.045, [1, 0, 0], { nc: 10 })],
    relacionados: ['bulbos_vestibulo', 'vagina', 'labios_menores', 'bulboesponjoso', 'arteria_pudenda_interna', 'linfonodos_inguinais'],
  }),

  /* ═════════════════════ Ligamentos do útero e do ovário (por código) ═════════════════════ */
  fem('lig_largo_utero', 'Ligamento largo do útero — esquema', 'Ligamentum latum uteri', null, C_PERIT, {
    local: 'Prega dupla de peritônio que vai de cada margem lateral do útero à parede lateral e ao assoalho da pelve. Tem três partes: mesométrio (a maior, junto ao útero), mesossalpinge (em volta da tuba, na margem superior livre) e mesovário (que prende o ovário à face posterior). A parte lateral da margem superior, acima dos vasos ováricos, forma o ligamento suspensor do ovário.',
    relacoes: 'Entre as duas lâminas ficam a tuba uterina, o ligamento útero-ovárico, o ligamento redondo do útero, a artéria e as veias uterinas e, na base, o ureter, que passa por baixo da artéria uterina; também há tecido conjuntivo (paramétrio) e restos embrionários (epoóforo e paraoóforo). Divide a pelve feminina numa parte anterior (escavação vesicouterina) e numa posterior (escavação retouterina).',
    vasos: 'Contém as artérias e veias uterinas e o plexo venoso uterino, e, junto à margem superior, os ramos tubários e ováricos que unem as artérias uterina e ovárica.',
    clinica: 'Dá pouca sustentação ao útero (os apoios principais são os ligamentos transversos do colo, os uterossacros e o assoalho pélvico). Na histerectomia, é aberto para chegar à artéria uterina; o paramétrio é avaliado no estadiamento do câncer do colo do útero.',
    nota: 'ESQUEMA: representado por código como uma lâmina translúcida da margem lateral do útero até a parede lateral da pelve, sob a tuba; a forma real é uma prega que envolve as estruturas citadas.',
  }, {
    kind: 'ligamento',
    mat: 'peritonio',
    proc: [tube([[0.12, -7.09, 0.02], [0.3, -7.05, 0.0], [0.48, -6.99, -0.03], [0.6, -6.95, -0.05]], 0.3, 0.012, [0, -0.62, 0.78], { nc: 8 })],
    relacionados: ['utero_corpo', 'utero_istmo', 'tuba_istmo', 'tuba_ampola', 'ovario', 'lig_redondo_utero', 'lig_utero_ovarico', 'lig_suspensor_ovario', 'arteria_uterina', 'ureter_direito', 'ureter_esquerdo'],
  }),

  fem('lig_redondo_utero', 'Ligamento redondo do útero — esquema', 'Ligamentum teres uteri', null, C_LIG, {
    local: 'Cordão fibromuscular de 10 a 12 cm que nasce no corno do útero, à frente e abaixo da entrada da tuba, corre entre as lâminas do ligamento largo, cruza por cima dos vasos ilíacos externos e entra no anel inguinal profundo, lateralmente aos vasos epigástricos inferiores. Atravessa o canal inguinal e termina no tecido subcutâneo do lábio maior.',
    relacoes: 'Na mulher, é o principal conteúdo do canal inguinal, junto com o nervo ilioinguinal e o ramo genital do genitofemoral. Junto com o ligamento útero-ovárico é o resto do gubernáculo embrionário do ovário.',
    vasos: 'Leva a artéria do ligamento redondo (ramo da epigástrica inferior) e vasos linfáticos do fundo e dos cornos do útero, que drenam para os linfonodos inguinais superficiais.',
    clinica: 'Mantém um pouco a anteversão do útero. Na gestação ele se estira e pode doer na virilha (dor do ligamento redondo). Explica a metástase de câncer do corpo do útero para os linfonodos inguinais e a hérnia inguinal indireta que desce até o lábio maior.',
    nota: 'ESQUEMA: desenhado por código do corno do útero ao anel inguinal profundo e daí pelo mesmo trajeto do canal inguinal do modelo até o lábio maior.',
  }, {
    kind: 'ligamento',
    mat: 'ligament',
    proc: [tube([[0.2, -7.0, 0.17], [0.42, -6.97, 0.3], [0.7, -6.88, 0.4], [0.95, -6.82, 0.44], [0.82, -6.93, 0.58], [0.62, -7.06, 0.64], [0.46, -7.18, 0.66], [0.35, -7.32, 0.65], [0.24, -7.52, 0.6]], 0.028, 0.022, [0, 0, 1], { nf: 60, nc: 8 })],
    relacionados: ['utero_fundo', 'lig_largo_utero', 'canal_inguinal', 'labios_maiores', 'arteria_epigastrica_inferior', 'arteria_iliaca_externa', 'linfonodos_inguinais'],
  }),

  fem('lig_utero_ovarico', 'Ligamento útero-ovárico (próprio do ovário) — esquema', 'Ligamentum ovarii proprium', null, C_LIG, {
    local: 'Cordão fibromuscular curto que liga o polo uterino (inferior) do ovário ao ângulo lateral do útero, logo abaixo e atrás da entrada da tuba uterina.',
    relacoes: 'Corre entre as lâminas do ligamento largo, no mesovário. Continua-se, no útero, com o ligamento redondo: os dois são restos do gubernáculo do ovário.',
    vasos: 'É acompanhado pelo ramo ovárico da artéria uterina, que se anastomosa com a artéria ovárica perto do hilo do ovário.',
    clinica: 'Mantém o ovário perto do útero. Na retirada do ovário com preservação do útero (ooforectomia), é seccionado junto ao corno do útero.',
    nota: 'ESQUEMA: desenhado por código do corno do útero ao polo inferior do ovário.',
  }, {
    kind: 'ligamento',
    mat: 'ligament',
    proc: [tube([[0.2, -7.02, 0.1], [0.32, -6.96, 0.095], [0.44, -6.88, 0.1]], 0.026, 0.02, [0, 0, 1], { nc: 8 })],
    relacionados: ['ovario', 'utero_fundo', 'lig_largo_utero', 'lig_redondo_utero', 'arteria_uterina'],
  }),

  fem('lig_suspensor_ovario', 'Ligamento suspensor do ovário (infundibulopélvico) — esquema', 'Ligamentum suspensorium ovarii', null, C_PERIT, {
    local: 'Prega de peritônio que vai do polo tubário (superior) do ovário e do infundíbulo da tuba à parede lateral da pelve, passando por cima dos vasos ilíacos externos. É a parte lateral da margem superior do ligamento largo.',
    relacoes: 'Leva os vasos ováricos, os linfáticos e os nervos do ovário. O ureter cruza a abertura superior da pelve logo atrás e medialmente a ele.',
    vasos: 'Contém a artéria e a veia ováricas e os vasos linfáticos que vão aos linfonodos lombares.',
    clinica: 'Na retirada do ovário, os vasos ováricos são ligados dentro deste ligamento; como o ureter está muito perto, ele deve ser identificado antes, para não ser ligado junto.',
    nota: 'ESQUEMA: lâmina translúcida desenhada por código do polo superior do ovário até a abertura superior da pelve, junto ao trajeto da artéria ovárica.',
  }, {
    kind: 'ligamento',
    mat: 'peritonio',
    proc: [tube([[0.53, -6.71, 0.125], [0.57, -6.56, 0.13], [0.54, -6.4, 0.13], [0.48, -6.24, 0.135]], 0.075, 0.03, [1, 0, 0], { nc: 8 })],
    relacionados: ['ovario', 'tuba_infundibulo', 'lig_largo_utero', 'arteria_ovarica', 'veia_ovarica', 'arteria_iliaca_externa', 'ureter_direito', 'ureter_esquerdo'],
  }),

  fem('lig_uterossacro', 'Ligamento uterossacro — esquema', 'Ligamentum rectouterinum; Ligamentum uterosacrale', null, C_LIG, {
    local: 'Faixa de tecido fibroso e músculo liso que vai da face posterolateral da parte supravaginal do colo do útero à face anterior do sacro, contornando o reto de cada lado. Levanta o peritônio nas pregas retouterinas, que limitam lateralmente a escavação retouterina.',
    relacoes: 'Passa dos lados do reto; forma, junto com os ligamentos transversos do colo, a parte mais firme do paramétrio. Leva fibras do plexo hipogástrico inferior para o útero.',
    vasos: 'Contém pequenos vasos e nervos autônomos do plexo uterovaginal.',
    clinica: 'Puxa o colo para trás e para cima, ajudando a manter o útero antevertido. É um dos apoios usados nas cirurgias de correção do prolapso. A endometriose costuma implantar-se nesses ligamentos e na escavação retouterina e causa dor na relação sexual e na evacuação.',
    nota: 'ESQUEMA: desenhado por código do colo do útero ao sacro, passando ao lado do reto do modelo.',
  }, {
    kind: 'ligamento',
    mat: 'ligament',
    proc: [tube([[0.06, -7.22, -0.23], [0.2, -7.14, -0.36], [0.3, -7.0, -0.5], [0.24, -6.86, -0.62]], 0.034, 0.026, [0, 1, 0], { nc: 8 })],
    relacionados: ['colo_utero', 'reto', 'o_sacro', 'lig_transverso_colo', 'vagina'],
  }),

  fem('lig_transverso_colo', 'Ligamento transverso do colo (cardinal) — esquema', 'Ligamentum cardinale; Ligamentum transversum cervicis', null, C_LIG, {
    local: 'Condensação de tecido conjuntivo e músculo liso da fáscia pélvica que vai da margem lateral do colo do útero e dos fórnices laterais da vagina à parede lateral da pelve, na base do ligamento largo.',
    relacoes: 'Acompanha as artérias uterinas e vaginais; o ureter atravessa a parte superior dele, logo abaixo da artéria uterina, perto do colo.',
    vasos: 'Leva as artérias e veias uterinas e vaginais e linfáticos do colo para os linfonodos ilíacos.',
    clinica: 'Com os ligamentos uterossacros e o assoalho pélvico (levantador do ânus e corpo do períneo), é o principal apoio passivo do útero; seu enfraquecimento, depois de partos e com a idade, leva ao prolapso uterino. Na histerectomia radical, é retirado junto com o útero no câncer do colo.',
    nota: 'ESQUEMA: faixa desenhada por código da margem lateral do colo até a parede lateral da pelve.',
  }, {
    kind: 'ligamento',
    mat: 'ligament',
    proc: [tube([[0.12, -7.22, -0.15], [0.3, -7.25, -0.19], [0.48, -7.27, -0.24]], 0.12, 0.035, [0, 1, 0], { nc: 8 })],
    relacionados: ['colo_utero', 'vagina', 'arteria_uterina', 'ureter_direito', 'ureter_esquerdo', 'lig_uterossacro', 'lig_largo_utero', 'pubococcigeo'],
  }),

  /* ═════════════════════ Vasos do útero e do ovário (por código) ═════════════════════ */
  fem('arteria_uterina', 'Artéria uterina — esquema', 'Arteria uterina', null, C_ART, {
    local: 'Ramo da divisão anterior da artéria ilíaca interna (às vezes de um tronco comum com a artéria umbilical ou a vaginal). Desce pela parede lateral da pelve e segue medialmente na base do ligamento largo, dentro do ligamento transverso do colo, até a margem lateral do útero, na altura do istmo.',
    relacoes: 'A cerca de 2 cm do colo do útero, **cruza por cima e pela frente do ureter**, que passa por baixo dela a caminho da bexiga (“a água passa sob a ponte”). Junto ao útero, dá o ramo cervicovaginal, que desce para o colo e a vagina, e sobe tortuosa entre as lâminas do ligamento largo, ao longo da margem lateral do útero, até o corno, onde termina nos ramos tubário e ovárico.',
    vasos: 'Os ramos tubário e ovárico anastomosam-se com a artéria ovárica no ligamento largo, formando uma arcada que irriga útero, tuba e ovário por dois lados. É acompanhada pelas veias uterinas (plexo venoso uterino), que drenam para as veias ilíacas internas.',
    clinica: 'Na histerectomia, a ligadura da artéria uterina é o momento de maior risco de ligar ou cortar o ureter, que passa logo abaixo. Na gestação, a artéria cresce muito e seu fluxo é medido no ultrassom com Doppler. A embolização das artérias uterinas trata miomas e hemorragias pós-parto.',
    nota: 'ESQUEMA: trajeto desenhado por código da artéria ilíaca interna do modelo até a margem lateral do útero (malha do HRA), passando por cima do ureter esquerdo e direito do modelo. Calibre e tortuosidade aproximados.',
  }, {
    kind: 'arteria',
    mat: 'artery',
    proc: [
      tube([[0.29, -6.66, -0.37], [0.32, -6.82, -0.24], [0.315, -6.97, -0.12], [0.27, -7.07, -0.08], [0.17, -7.13, -0.07], [0.17, -7.08, 0.01], [0.2, -7.03, 0.08], [0.225, -6.99, 0.13], [0.24, -6.965, 0.15]], 0.022, 0.022, [0, 0, 1], { nf: 64, nc: 8 }),
      tube([[0.24, -6.965, 0.15], [0.34, -6.93, 0.13], [0.44, -6.88, 0.115]], 0.016, 0.016, [0, 0, 1], { nc: 8 }),
      tube([[0.17, -7.13, -0.07], [0.16, -7.24, -0.13], [0.15, -7.36, -0.17]], 0.016, 0.016, [0, 0, 1], { nc: 8 }),
    ],
    relacionados: ['arteria_iliaca_interna', 'ureter_direito', 'ureter_esquerdo', 'utero_corpo', 'utero_istmo', 'colo_utero', 'vagina', 'arteria_ovarica', 'lig_largo_utero', 'lig_transverso_colo', 'veia_iliaca_interna'],
  }),

  fem('arteria_ovarica', 'Artéria ovárica (gonadal) — esquema', 'Arteria ovarica', null, C_ART, {
    local: 'Artéria longa e fina que nasce da face anterior da aorta abdominal, abaixo das artérias renais (por volta de L2), como a testicular no homem. Desce pelo retroperitônio sobre o músculo psoas maior e, na abertura superior da pelve, cruza por cima dos vasos ilíacos externos e entra no ligamento suspensor do ovário.',
    relacoes: 'No abdome, cruza o ureter pela frente; a direita passa à frente da veia cava inferior. No ligamento suspensor chega ao polo superior do ovário e continua no ligamento largo, onde dá ramos para o ovário e a tuba.',
    vasos: 'Anastomosa-se com os ramos ovárico e tubário da artéria uterina. É acompanhada pela veia ovárica, que se forma do plexo pampiniforme do ovário.',
    clinica: 'Na retirada do ovário, é ligada dentro do ligamento suspensor, onde o ureter está muito perto. A origem alta, na aorta, lembra que o ovário se forma na região lombar e desce para a pelve; por isso a linfa do ovário vai aos linfonodos lombares.',
    nota: 'ESQUEMA: trajeto desenhado por código; até a abertura superior da pelve segue o mesmo caminho medido na artéria testicular do BodyParts3D, que tem a mesma origem e o mesmo trajeto abdominal.',
  }, {
    kind: 'arteria',
    mat: 'artery',
    proc: [tube([[0.09, -5.12, 0.42], [0.175, -5.3, 0.405], [0.296, -5.462, 0.358], [0.373, -5.601, 0.314], [0.424, -5.749, 0.281], [0.456, -5.884, 0.244], [0.465, -6.044, 0.2], [0.47, -6.2, 0.14], [0.53, -6.38, 0.13], [0.565, -6.55, 0.13], [0.53, -6.7, 0.125]], 0.018, 0.018, [0, 0, 1], { nf: 70, nc: 8 })],
    relacionados: ['aorta_abdominal', 'arteria_renal', 'ovario', 'tuba_infundibulo', 'lig_suspensor_ovario', 'arteria_uterina', 'veia_ovarica', 'ureter_direito', 'ureter_esquerdo', 'arteria_iliaca_externa', 'psoas_maior', 'veia_cava_inferior'],
  }),

  fem('veia_ovarica', 'Veia ovárica — esquema', 'Vena ovarica', null, C_VEIA, {
    local: 'Forma-se do plexo pampiniforme do ovário, no ligamento largo, sobe no ligamento suspensor do ovário e no retroperitônio, sobre o músculo psoas maior, ao lado da artéria ovárica.',
    relacoes: 'Termina de modo diferente dos dois lados, como a testicular: **a veia ovárica direita desemboca na veia cava inferior**, e **a esquerda, na veia renal esquerda**, em ângulo reto. As duas cruzam o ureter pela frente.',
    vasos: 'Tem valvas em quantidade variável; comunica-se no ligamento largo com o plexo venoso uterino.',
    clinica: 'A dilatação das veias ováricas e do plexo pélvico, mais comum à esquerda, causa a síndrome de congestão pélvica (dor pélvica crônica que piora em pé). No pós-parto, a tromboflebite da veia ovárica, mais comum à direita, pode causar febre e dor que imita apendicite.',
    nota: 'ESQUEMA: trajeto desenhado por código; à esquerda segue o caminho medido na veia testicular do BodyParts3D até a veia renal esquerda, e à direita termina na veia cava inferior do modelo.',
  }, {
    kind: 'veia',
    mat: 'vein',
    paired: false,
    proc: [
      tube([[0.55, -6.71, 0.11], [0.59, -6.56, 0.115], [0.565, -6.4, 0.115], [0.515, -6.349, 0.112], [0.515, -6.196, 0.132], [0.516, -6.053, 0.177], [0.507, -5.896, 0.259], [0.477, -5.753, 0.326], [0.427, -5.604, 0.371], [0.351, -5.44, 0.407], [0.267, -5.303, 0.417], [0.208, -5.138, 0.416], [0.173, -5.002, 0.413]], 0.026, 0.026, [0, 0, 1], { nf: 80, nc: 8 }),
      tube([[-0.55, -6.71, 0.11], [-0.59, -6.56, 0.115], [-0.565, -6.4, 0.115], [-0.515, -6.349, 0.112], [-0.515, -6.196, 0.132], [-0.516, -6.053, 0.177], [-0.507, -5.896, 0.259], [-0.477, -5.753, 0.326], [-0.427, -5.604, 0.371], [-0.33, -5.47, 0.42], [-0.22, -5.38, 0.44], [-0.17, -5.33, 0.43]], 0.026, 0.026, [0, 0, 1], { nf: 72, nc: 8 }),
    ],
    relacionados: ['ovario', 'lig_suspensor_ovario', 'arteria_ovarica', 'veia_renal', 'veia_cava_inferior', 'ureter_direito', 'ureter_esquerdo', 'psoas_maior'],
  }),

  /* ═════════════════════ Mama (malhas do HRA) ═════════════════════ */
  fem('mama_corpo_adiposo', 'Mama — tecido adiposo e ligamentos suspensores', 'Mamma; Ligamenta suspensoria mammaria', ['mama_corpo_adiposo'], '#f1d4b5', {
    local: 'A mama feminina adulta estende-se, na parede anterior do tórax, da 2ª à 6ª costela e da margem lateral do esterno à linha axilar média. Cerca de dois terços repousam sobre a fáscia do peitoral maior e um terço sobre a do serrátil anterior. Um prolongamento, o processo axilar, segue a margem inferolateral do peitoral maior até a axila. A maior parte do volume é gordura, atravessada pelos ligamentos suspensores (de Cooper), septos que vão da derme à fáscia profunda.',
    relacoes: 'Entre a mama e a fáscia peitoral há o espaço retromamário, de tecido frouxo, que permite que ela deslize sobre o músculo. Para descrever achados, a mama é dividida em quatro quadrantes (superolateral, superomedial, inferolateral e inferomedial) mais a região central da aréola.',
    vasos: 'Artéria torácica interna (ramos mamários mediais, pelos espaços intercostais 2º a 4º), artérias torácica lateral e toracoacromial (da axilar) e intercostais posteriores. Veias sobretudo para a veia axilar e a torácica interna. Cerca de 75 % da linfa vai aos linfonodos axilares (primeiro aos peitorais); a maior parte do restante, aos paraesternais (torácicos internos). Inervação sensitiva pelos ramos cutâneos anteriores e laterais dos nervos intercostais 4º a 6º.',
    clinica: 'O quadrante superolateral tem mais tecido glandular e é onde aparece a maioria dos cânceres de mama. O tumor que puxa os ligamentos suspensores retrai a pele; o bloqueio dos linfáticos dá o aspecto de “casca de laranja”; a fixação da mama ao músculo sugere invasão do espaço retromamário. O autoexame e a mamografia de rastreamento procuram esses sinais cedo.',
    nota: MAMA_POS,
  }, {
    kind: 'estrutura',
    mat: 'peritonio',
    relacionados: ['mama_glandula', 'mama_papila_areola', 'peitoral_esternocostal', 'peitoral_clav', 'serratil_anterior', 'arteria_toracica_interna', 'arteria_axilar', 'veia_axilar', 'linfonodos_axilares', 'linfonodos_mamarios_internos'],
  }),

  fem('mama_glandula', 'Glândula mamária — lobos e ductos lactíferos', 'Glandula mammaria; Ductus lactiferi; Sinus lactiferi', ['mama_glandula'], '#d98d80', {
    local: 'Glândula sudorípara modificada formada por 15 a 20 lobos de tecido glandular, dispostos em raio em volta da papila. Cada lobo, dividido em lóbulos, é drenado por um ducto lactífero que se abre na papila; logo abaixo da aréola, cada ducto tem uma dilatação, o seio lactífero, onde o leite se acumula na lactação.',
    relacoes: 'Os lobos ficam imersos no tecido adiposo e separados pelos ligamentos suspensores. Na mulher que não amamenta, o tecido glandular é pequeno perto da gordura; ele cresce na puberdade (estrogênio) e muito mais na gestação.',
    vasos: 'Os mesmos da mama: artérias torácica interna, torácica lateral, toracoacromial e intercostais; linfa principalmente para os linfonodos axilares e paraesternais.',
    clinica: 'O estrogênio faz crescer os ductos; a progesterona, os alvéolos; a prolactina estimula a produção do leite e a ocitocina contrai as células mioepiteliais para ejetá-lo na sucção. O carcinoma ductal é o tipo mais comum de câncer de mama; o fibroadenoma, o tumor benigno mais comum da mulher jovem; a mastite é frequente na amamentação.',
    nota: `${MAMA_POS} A malha junta os lobos, os ductos e os seios lactíferos.`,
  }, {
    kind: 'glandula',
    relacionados: ['mama_corpo_adiposo', 'mama_papila_areola', 'arteria_toracica_interna', 'linfonodos_axilares', 'linfonodos_mamarios_internos'],
  }),

  fem('mama_papila_areola', 'Papila mamária e aréola', 'Papilla mammaria; Areola mammae', ['mama_papila_areola'], '#9a5848', {
    local: 'A papila (mamilo) é uma projeção cônica onde se abrem os ductos lactíferos; fica no centro da aréola, uma área circular de pele pigmentada. No homem e na mulher jovem que não amamentou, a papila fica habitualmente no 4º espaço intercostal, na linha medioclavicular; na mulher a posição varia com o tamanho e a forma da mama.',
    relacoes: 'A aréola tem pequenas elevações, os tubérculos areolares, formados pelas glândulas areolares (de Montgomery), sebáceas, que lubrificam a pele na amamentação. A papila e a aréola têm fibras de músculo liso que fazem a papila ficar ereta com o frio, o toque ou a sucção.',
    vasos: 'Rede vascular subareolar das artérias da mama; plexo linfático subareolar que drena com a mama para os linfonodos axilares. Inervação pelo ramo cutâneo do 4º nervo intercostal (a papila marca o dermátomo T4).',
    clinica: 'Retração recente da papila e saída de secreção com sangue são sinais de alerta de câncer. Papilas extranumerárias (politelia) podem aparecer ao longo da linha mamária, da axila à virilha. Fissuras na papila são comuns no início da amamentação.',
    nota: MAMA_POS,
  }, {
    kind: 'estrutura',
    relacionados: ['mama_glandula', 'mama_corpo_adiposo', 'linfonodos_axilares'],
  }),

  /* ═════════════════════ Pelve feminina para comparação (malha do HRA, fora do corpo) ═════════════════════ */
  fem('pelve_feminina', 'Pelve feminina (comparação)', 'Pelvis feminina', ['pelve_feminina'], '#e8dcc0', {
    campos: [
      ['O que é', 'Os ossos do quadril, o sacro e o cóccix de uma mulher, mostrados ao lado do corpo do atlas (que é masculino) para comparar as duas pelves. A pelve feminina é adaptada ao parto: mais larga e mais rasa, com o canal mais amplo.'],
      ['Diferenças em relação à pelve masculina', 'Abertura superior oval ou arredondada (no homem, em forma de coração, com o promontório mais saliente); ângulo subpúbico mais aberto, perto de 90° ou mais (no homem, perto de 60–70°), com arco púbico arredondado; forame obturado oval (no homem, mais redondo); incisura isquiática maior mais larga; espinhas isquiáticas menos salientes; sacro mais curto, mais largo e menos curvo; acetábulos menores e mais afastados; ossos mais finos, com inserções musculares menos marcadas.'],
      ['Diâmetros obstétricos', 'O conjugado verdadeiro (obstétrico), do promontório à face posterior da sínfise, mede em geral 11 cm ou mais; como não pode ser medido no toque, estima-se pelo conjugado diagonal (do promontório à margem inferior da sínfise, cerca de 1,5 cm maior). O diâmetro transverso da abertura superior tem cerca de 13 cm, e a distância entre as espinhas isquiáticas, a parte mais estreita do canal, cerca de 10 cm.'],
      ['Clínica', 'A forma da pelve (ginecoide, a mais comum na mulher; androide, antropoide e platipeloide) influencia o trabalho de parto; uma pelve estreita em relação à cabeça do feto (desproporção cefalopélvica) pode impedir o parto vaginal. As espinhas isquiáticas são a referência da altura da apresentação no toque e do bloqueio do nervo pudendo.'],
    ],
    nota: 'COMPARAÇÃO, FORA DO CORPO: malha real do Atlas de Referência Humano (HuBMAP/NIH, CC BY 4.0), do Visible Human feminino, em escala real, colocada à direita do corpo do atlas, na altura da pelve. Não faz parte do esqueleto do modelo: a pelve dele continua sendo a masculina do BodyParts3D.',
  }, {
    kind: 'osso',
    mat: 'bone',
    relacionados: ['o_osso_quadril', 'o_sacro', 'utero_corpo', 'vagina'],
  }),

  /* ═════════════════════ Períneo feminino, hímen/glândulas parauretrais e vasos vaginais (esquemas) ═════════════════════ */
  fem('corpo_perineo', 'Corpo do períneo (centro tendíneo do períneo) — esquema', 'Corpus perineale; Centrum perinei', null, '#c9886a', {
    local: 'Massa fibromuscular cuneiforme (piramidal) situada no plano mediano do períneo, exatamente no ponto central entre o triângulo urogenital (à frente) e o triângulo anal (atrás) — na mulher, entre a parede posterior da parte inferior da vagina e a parede anterior do canal anal (e no homem, entre o bulbo do pênis e o canal anal).',
    relacoes: 'É o nó central de convergência e ancoragem das fáscias e músculos do assoalho pélvico e do períneo: nele se entrelaçam as fibras dos músculos bulboesponjosos, transversos superficiais e profundos do períneo, esfíncter externo do ânus, esfíncter externo da uretra / uretrovaginal, membrana perineal e feixes mediais do músculo levantador do ânus (puboperineal/pubovaginal), além da musculatura lisa longitudinal da parede retovaginal.',
    vasos: 'Suprido por ramos das artérias perineal e retal inferior (ramos da artéria pudenda interna); inervação dos músculos convergentes pelos ramos perineal e retal inferior do nervo pudendo (S2–S4).',
    clinica: 'É a chave de sustentação final das vísceras pélvicas (vagina, útero, bexiga e reto) sobre o hiato urogenital do levantador do ânus. Durante o período expulsivo do parto vaginal, sofre intenso estiramento; sua ruptura não reparada (ou laceração obstétrica de 3º e 4º graus, que atinge os esfíncteres anais e a mucosa retal) enfraquece o assoalho pélvico e predispõe ao prolapso de parede vaginal posterior (retocele), prolapso uterino e incontinência fecal. Na episiotomia, prefere-se a incisão mediolateral à mediana para proteger o corpo do períneo e o esfíncter do ânus.',
    nota: 'ESQUEMA: massa fibromuscular mediana modelada por código no espaço retovaginal inferior, entre o vestíbulo/vagina, o bulboesponjoso, os transversos do períneo e o esfíncter externo do ânus.',
  }, {
    kind: 'estrutura',
    mat: 'ligament',
    paired: false,
    proc: [
      tube([[0.0, -7.62, -0.26], [0.0, -7.74, -0.29], [0.0, -7.85, -0.32]], 0.095, 0.08, [1, 0, 0], { nc: 10 }),
    ],
    relacionados: ['vagina', 'canal_anal', 'reto', 'bulboesponjoso', 'transverso_superficial_perineo', 'transverso_profundo_perineo', 'esfincter_anal_ext', 'esfincter_interno_anus', 'esfincter_uretra', 'pubococcigeo', 'puborretal', 'bulbos_vestibulo', 'glandulas_vestibulares_maiores'],
  }),

  fem('himen_glandulas_parauretrais', 'Óstio da vagina, hímen e glândulas parauretrais (de Skene) — esquema', 'Ostium vaginae; Hymen; Glandulae paraurethrales [Skenei]', null, '#d47e8c', {
    local: 'Estruturas do vestíbulo da vagina (espaço entre os lábios menores): 1) o óstio da vagina abre-se na parte posterior do vestíbulo, abaixo e atrás do óstio externo da uretra feminina, sendo circundado nas mulheres jovens pela prega mucosa do hímen (anular, semilunar, septado ou cribriforme; após o parto vaginal restam apenas pequenos mamilos mucosos chamados carúnculas himenais); e 2) as glândulas parauretrais (de Skene) situam-se de cada lado da parte distal da uretra feminina, abrindo seus ductos parauretrais nas margens posterolaterais do óstio externo da uretra.',
    relacoes: 'O hímen marca o limite anatômico e embriológico entre o lúmen da vagina (acima) e o vestíbulo da vagina derivado do seio urogenital (abaixo; nos sulcos entre o hímen e os lábios menores abrem-se os ductos das glândulas vestibulares maiores de Bartholin). As glândulas parauretrais de Skene são as **homólogas embrionárias femininas da glândula próstata** masculina.',
    vasos: 'Ramos das artérias pudenda interna (artéria do bulbo do vestíbulo) e vaginal inferior. Drenagem linfática para os linfonodos inguinais superficiais e ilíacos internos; inervação sensitiva pelo nervo pudendo (nervos labiais posteriores e ramo perineal).',
    clinica: 'O **hímen imperfurado** (anomalia congênita de canalização do extremo inferior da vagina) impede a exteriorização do fluxo menstrual na menarca, causando amenorreia primária aparente com dor pélvica cíclica mensal e retenção de sangue na vagina (**hematocolpo**) e no útero (**hematométrio**), resolvida por himenotomia em cruz. A obstrução ou infecção das glândulas de Skene forma cistos ou abscessos parauretrais junto ao meato uretral externo.',
    nota: 'ESQUEMA: anel mucoso no óstio da vagina e glândulas parauretrais ao lado do meato uretral modelados por código no vestíbulo da vagina.',
  }, {
    kind: 'estrutura',
    proc: [
      // Glândulas parauretrais (de Skene) ao lado da terminação da uretra feminina
      tube([[0.032, -7.76, 0.02], [0.03, -7.81, 0.04]], 0.028, 0.024, [1, 0, 0], { nc: 8 }),
      // Borda do óstio da vagina e hímen
      tube([[0.01, -7.88, -0.02], [0.055, -7.89, -0.08], [0.01, -7.9, -0.15]], 0.03, 0.016, [1, 0, 0], { nc: 8 }),
    ],
    relacionados: ['vagina', 'uretra_feminina', 'labios_menores', 'bulbos_vestibulo', 'glandulas_vestibulares_maiores', 'prostata', 'corpo_perineo'],
  }),

  fem('arteria_plexo_vaginal', 'Artéria vaginal e plexo venoso uterovaginal — esquema', 'Arteria vaginalis; Plexus venosus uterovaginalis', null, C_ART, {
    local: 'A artéria vaginal nasce da divisão anterior da artéria ilíaca interna (ou como ramo cervical/vaginal da artéria uterina) e desce na pelve menor para suprir as paredes anterior e posterior da vagina; o plexo venoso uterovaginal forma uma rica malha venosa avalvular nas paredes laterais da vagina e na base do ligamento largo (paramétrio).',
    relacoes: 'A artéria vaginal é a **homóloga feminina da artéria vesical inferior do homem**: desce medialmente ao ureter pélvico terminal e envia ramos que se anastomosam na linha mediana das faces anterior e posterior da vagina com o ramo vaginal da artéria uterina e da pudenda interna, formando as artérias ázigos da vagina. O plexo venoso uterovaginal envolve o cruzamento da artéria uterina com o ureter no ligamento transverso do colo.',
    vasos: 'Além da vagina, a artéria vaginal envia ramos para o fundo (base) da bexiga urinária, o bulbo do vestíbulo e a parte adjacente do reto. O plexo venoso uterovaginal comunica-se amplamente com os plexos venosos vesical e retal, drena pelas veias uterinas para a veia ilíaca interna e comunica-se também com o plexo venoso vertebral interno (de Batson).',
    clinica: 'Durante o parto vaginal ou em cirurgias ginecológicas (colporrafia e histerectomia vaginal), lacerações das paredes laterais da vagina e dos fórnices podem causar sangramento volumoso pela riqueza da arcada arterial das artérias uterina/vaginal e do plexo venoso uterovaginal.',
    nota: 'ESQUEMA: trajeto da artéria vaginal e do plexo uterovaginal modelado por código da artéria ilíaca interna até a parede lateral da vagina e o fundo da bexiga.',
  }, {
    kind: 'arteria',
    mat: 'artery',
    proc: [
      tube([[0.28, -6.78, -0.32], [0.25, -7.1, -0.22], [0.16, -7.38, -0.15], [0.11, -7.65, -0.12]], 0.02, 0.02, [0, 0, 1], { nf: 20, nc: 8 }),
    ],
    relacionados: ['arteria_iliaca_interna', 'arteria_uterina', 'vagina', 'colo_utero', 'bexiga_urinaria', 'uretra_feminina', 'ureter_direito', 'ureter_esquerdo', 'lig_transverso_colo', 'veia_iliaca_interna'],
  }),
];
