/**
 * Circulatório, estruturas modeladas por código (F5 / M18): o sistema linfático (ducto torácico, ducto linfático direito e os
 * principais grupos de linfonodos), o sistema de condução do coração e o músculo papilar posteromedial do ventrículo esquerdo.
 * O BodyParts3D não tem nenhuma delas como peça separada. **Todas são esquemas**: os trajetos e as posições foram medidos no
 * corpo do atlas, mas o tamanho e o desenho são aproximados (os linfonodos são pequenos elipsoides; os feixes de condução, fios
 * finos dentro do coração, que só se veem com o plano de corte do Estudo). Cada ficha diz isso.
 * Textos próprios, a partir de Moore, Dalley & Agur (Anatomia Orientada para a Clínica, 8ª ed.) e Gray's Anatomy (42ª ed.).
 */

const T = 'tronco';
const FONTES = ['Moore, Dalley & Agur — Anatomia orientada para a clínica, 8ª ed.', "Gray's Anatomy, 42ª ed."];

/** Tubo fino ou achatado por pontos (a malha segue a curva; ver `buildTube`, em proc.js). */
const tubo = (pts, width, thick = width, o = {}) => ({ kind: 'tube', pts, width, thick, nf: o.nf ?? 28, nc: o.nc ?? 10, taper: o.taper ?? 'blunt', ref: o.ref ?? [1, 0, 0] });
/** Linfonodo esquemático: um elipsoide pequeno centrado em p (comprimento `r`). */
const nodo = (p, r = 0.07) => tubo([[p[0], p[1] + r * 0.45, p[2]], [p[0], p[1] - r * 0.45, p[2]]], r * 1.15, r * 0.85, { nf: 4, nc: 8 });

const linfatico = (id, name, latin, proc, campos, extra = {}) => ({
  kind: 'linfatico',
  id,
  name,
  latin,
  layer: 'linfatico',
  region: T,
  mat: 'artery',
  proc,
  campos,
  fontes: FONTES,
  ...extra,
});

/** Grupo de linfonodos: `pontos` são do lado esquerdo (x > 0); o direito é o espelho, salvo `paired: false`. */
const grupo = (id, name, latin, pontos, r, campos, extra = {}) => linfatico(id, name, latin, pontos.map((p) => nodo(p, r)), campos, extra);

const cond = (id, name, latin, proc, campos, extra = {}) => ({
  kind: 'cardiaco',
  id,
  name,
  latin,
  layer: 'coracao',
  region: T,
  mat: 'artery',
  color: '#e8c24a',
  paired: false,
  proc,
  campos,
  fontes: FONTES,
  ...extra,
});

export const CIRC_ESQUEMAS = [
  /* ═════════════ Sistema linfático ═════════════ */
  linfatico('cisterna_quilo', 'Cisterna do quilo — esquema', 'Cisterna chyli', [
    tubo([[0.0, -5.28, 0.275], [0.0, -4.98, 0.265], [-0.005, -4.82, 0.245]], [0.05, 0.075, 0.035], [0.035, 0.05, 0.025], { nf: 10, nc: 8 }),
  ], [
    ['Localização', 'Dilatação alongada, à direita e por trás da aorta abdominal, à frente dos corpos de L1 e L2 e atrás do pilar direito do diafragma.'],
    ['Afluentes', 'Troncos lombares direito e esquerdo, que trazem a linfa dos membros inferiores, da pelve, das paredes e das vísceras pélvicas, e tronco intestinal, que traz a linfa do trato digestório.'],
    ['Continuação', 'Seu extremo superior se estreita e se continua com o ducto torácico, que passa ao tórax pelo hiato aórtico do diafragma (T12).'],
    ['Quilo', 'Quilo é a linfa leitosa, rica em gordura, que sai do intestino delgado; por isso a cisterna leva esse nome.'],
  ], {
    paired: false,
    nota: 'ESQUEMA: forma e tamanho são aproximados; o BodyParts3D não tem estruturas linfáticas. Variações são comuns: a cisterna nem sempre é visível como uma dilatação distinta, e o ducto pode começar de uma confluência de troncos.',
    relacionados: ['ducto_toracico', 'aorta_abdominal', 'veia_cava_inferior'],
  }),
  linfatico('ducto_toracico', 'Ducto torácico — esquema', 'Ductus thoracicus', [
    tubo([[-0.005, -4.82, 0.245], [-0.015, -4.45, 0.10], [-0.015, -3.9, 0.02], [0.0, -3.4, -0.15], [0.03, -2.95, -0.2], [0.08, -2.55, -0.1], [0.13, -2.2, 0.03], [0.18, -1.95, 0.14], [0.25, -1.82, 0.26], [0.3, -1.93, 0.325]], 0.04, 0.035, { nf: 56, nc: 8 }),
  ], [
    ['Origem', 'Continua a cisterna do quilo, ao nível de L1–L2, e passa ao tórax pelo hiato aórtico do diafragma, por T12.'],
    ['Trajeto', 'No mediastino posterior sobe à frente dos corpos vertebrais, entre a aorta (à esquerda) e a veia ázigo (à direita), por trás do esôfago. Perto de T5 cruza para a esquerda, sobe pelo mediastino superior, à esquerda do esôfago, e na raiz do pescoço se arqueia sobre a cúpula da pleura e a artéria subclávia para desembocar no ângulo venoso esquerdo, na união da veia jugular interna esquerda com a subclávia esquerda.'],
    ['Afluentes', 'Troncos lombares e intestinal (pela cisterna do quilo) e, perto da desembocadura, os troncos broncomediastinal esquerdo, subclávio esquerdo e jugular esquerdo (a linfa da cabeça e do pescoço, do membro superior e do tórax do lado esquerdo).'],
    ['Território drenado', 'Toda a linfa do corpo abaixo do diafragma e a do lado esquerdo da cabeça, do pescoço, do tórax e do membro superior esquerdo. A linfa do restante (lado direito acima do diafragma) vai ao ducto linfático direito.'],
  ], {
    paired: false,
    nota: 'ESQUEMA: o trajeto foi medido entre a aorta, a veia ázigo e os corpos vertebrais, mas é aproximado; o BodyParts3D não tem vasos linfáticos nem o esôfago. A lesão do ducto (cirurgias do tórax, traumas) causa quilotórax; a ligadura costuma ser tolerada, porque a linfa encontra vias colaterais. O ducto tem uma valva perto da desembocadura, que impede o refluxo de sangue.',
    relacionados: ['cisterna_quilo', 'aorta_toracica', 'veia_azigo', 'veia_jugular_interna', 'veia_subclavia', 'ducto_linfatico_direito'],
  }),
  linfatico('ducto_linfatico_direito', 'Ducto linfático direito — esquema', 'Ductus lymphaticus dexter', [
    tubo([[-0.26, -1.8, 0.29], [-0.28, -1.87, 0.31], [-0.3, -1.93, 0.325]], 0.032, 0.028, { nf: 8, nc: 8 }),
  ], [
    ['Origem', 'Une os troncos jugular, subclávio e broncomediastinal do lado direito, na raiz do pescoço.'],
    ['Trajeto', 'Mede cerca de 1 cm e desemboca no ângulo venoso direito, na união da veia jugular interna direita com a subclávia direita.'],
    ['Território drenado', 'Lado direito da cabeça e do pescoço, membro superior direito e lado direito do tórax (pulmão direito e lado direito do coração).'],
    ['Variação', 'Com frequência não existe como tronco único: os três troncos desembocam separadamente nas veias vizinhas.'],
  ], {
    paired: false,
    nota: 'ESQUEMA: o ducto é curto e fino e sua posição no modelo é aproximada. O ducto torácico recebe a linfa de todo o restante do corpo.',
    relacionados: ['ducto_toracico', 'veia_jugular_interna', 'veia_subclavia'],
  }),
  grupo('linfonodos_cervicais_profundos', 'Linfonodos cervicais profundos — esquema', 'Nodi lymphoidei cervicales profundi', [[0.27, -1.2, 0.3], [0.28, -1.4, 0.3], [0.27, -1.6, 0.31], [0.26, -1.78, 0.3]], 0.07, [
    ['Localização', 'Ao longo da veia jugular interna, dentro e ao lado da bainha carótica, sob o esternocleidomastóideo; formam a cadeia jugular.'],
    ['Território drenado', 'Recebem, direta ou indiretamente, a linfa de toda a cabeça e do pescoço (inclusive a das cadeias superficiais e dos linfonodos submandibulares e submentuais). Os mais conhecidos são o jugulodigástrico (que recebe a linfa da tonsila e da parte posterior da língua) e o justa-omo-hióideo (a da língua).'],
    ['Drena para', 'Troncos jugulares, que vão ao ducto torácico (à esquerda) e ao ducto linfático direito (à direita), ou diretamente ao ângulo venoso.'],
    ['Clínica', 'O aumento de um linfonodo supraclavicular esquerdo (nó de Virchow), no ângulo venoso, pode ser a primeira manifestação de um tumor do abdome ou do tórax, por causa da desembocadura do ducto torácico.'],
  ], {
    nota: 'ESQUEMA: os quatro linfonodos desenhados representam a cadeia, que tem dezenas, e estão em posição aproximada ao longo da jugular interna.',
    relacionados: ['veia_jugular_interna', 'ducto_toracico', 'ducto_linfatico_direito'],
  }),
  grupo('linfonodos_axilares', 'Linfonodos axilares — esquema', 'Nodi lymphoidei axillares', [[0.98, -2.12, 0.15], [1.2, -2.4, 0.07], [1.45, -2.5, -0.02], [1.18, -2.62, 0.3], [1.3, -2.68, -0.3]], 0.08, [
    ['Localização', 'Na gordura da axila, em volta dos vasos axilares. Cinco grupos: peitorais (anteriores, sob a margem do peitoral maior), subescapulares (posteriores, no subescapular), umerais ou laterais (ao longo da veia axilar), centrais (no centro da axila) e apicais (no ápice, junto à clavícula).'],
    ['Território drenado', 'Membro superior, parede anterolateral do tórax e do abdome superior, dorso até o nível das cristas ilíacas, e a mama (a maior parte da linfa da mama vai aos linfonodos axilares).'],
    ['Drena para', 'Os linfonodos apicais enviam a linfa ao tronco subclávio, que desemboca no ducto torácico (à esquerda) ou no ducto linfático direito (à direita).'],
    ['Clínica', 'A disseminação do câncer de mama costuma passar primeiro pelo linfonodo sentinela, em geral um dos axilares. A dissecção da axila põe em risco os nervos torácico longo e toracodorsal e o intercostobraquial.'],
  ], {
    nota: 'ESQUEMA: os cinco linfonodos desenhados representam os cinco grupos (um por grupo); o número real é de 20 a 30, e as posições são aproximadas.',
    relacionados: ['arteria_axilar', 'veia_axilar', 'arteria_toracica_lateral'],
  }),
  grupo('linfonodos_traqueobronquicos', 'Linfonodos paratraqueais e traqueobrônquicos — esquema', 'Nodi lymphoidei paratracheales et tracheobronchiales', [[0.17, -2.0, 0.07], [0.19, -2.3, 0.0], [0.28, -2.65, -0.02]], 0.07, [
    ['Localização', 'No mediastino, em volta da traqueia e dos brônquios principais: paratraqueais (nos lados da traqueia), traqueobrônquicos superiores (no ângulo entre a traqueia e cada brônquio principal) e inferiores ou subcarinais (abaixo da carina), com os broncopulmonares (hilares), que ficam no hilo de cada pulmão.'],
    ['Território drenado', 'Pulmões e brônquios, traqueia e parte do esôfago e do coração.'],
    ['Drena para', 'Troncos broncomediastinais, direito e esquerdo, que desembocam no ducto linfático direito e no ducto torácico, ou diretamente nas veias do ângulo venoso.'],
    ['Clínica', 'O aumento dos linfonodos traqueobrônquicos (câncer de pulmão, tuberculose, sarcoidose) alarga a carina e comprime o brônquio e o esôfago; a punção por broncoscopia, guiada por ultrassom, é o método para avaliar o mediastino.'],
  ], {
    nota: 'ESQUEMA: os três linfonodos desenhados em cada lado representam os grupos; os linfonodos subcarinais ficam na linha mediana e não foram desenhados separados. Posições aproximadas.',
    relacionados: ['aorta_toracica', 'arco_aorta', 'ducto_toracico'],
  }),
  grupo('linfonodos_lombares', 'Linfonodos lombares (para-aórticos) — esquema', 'Nodi lymphoidei lumbales', [[0.22, -4.7, 0.3], [0.22, -5.1, 0.34], [0.2, -5.5, 0.34]], 0.08, [
    ['Localização', 'Em volta da aorta abdominal e da veia cava inferior, de cada lado da coluna lombar: pré-aórticos (celíacos, mesentéricos superiores e inferiores, junto à origem dessas artérias), aórticos laterais (esquerdos), pré-caval, retrocaval e cavos laterais (direitos).'],
    ['Território drenado', 'Rins, glândulas suprarrenais, gônadas (testículos e ovários), parte do útero e das tubas uterinas, e parede posterior do abdome; recebem também a linfa dos linfonodos ilíacos, e portanto de toda a metade inferior do corpo.'],
    ['Drena para', 'Troncos lombares, e daí a cisterna do quilo e ao ducto torácico.'],
    ['Clínica', 'A linfa do testículo vai aos linfonodos lombares, e não aos inguinais, porque o testículo desce do abdome durante o desenvolvimento. Por isso o câncer de testículo faz metástase aos linfonodos lombares, e o do escroto, aos inguinais.'],
  ], {
    nota: 'ESQUEMA: os três linfonodos de cada lado representam os grupos lombares; as posições são aproximadas e a densidade real é bem maior.',
    relacionados: ['aorta_abdominal', 'veia_cava_inferior', 'cisterna_quilo'],
  }),
  grupo('linfonodos_iliacos', 'Linfonodos ilíacos — esquema', 'Nodi lymphoidei iliaci', [[0.2, -6.0, 0.3], [0.39, -6.45, 0.04], [0.31, -6.6, 0.0]], 0.07, [
    ['Localização', 'Em volta das artérias e veias ilíacas: ilíacos comuns, externos e internos.'],
    ['Território drenado', 'Os externos recebem a linfa dos linfonodos inguinais e da parede inferior do abdome; os internos, a da maior parte das vísceras pélvicas, do períneo profundo e da região glútea; os comuns recebem os dois.'],
    ['Drena para', 'Linfonodos lombares, pelos troncos lombares.'],
    ['Clínica', 'A disseminação de tumores da próstata, do colo do útero, do reto e da bexiga costuma passar por esses linfonodos; o esvaziamento pélvico retira os linfonodos ilíacos com o tumor.'],
  ], {
    nota: 'ESQUEMA: posições aproximadas, um linfonodo para cada grupo.',
    relacionados: ['arteria_iliaca_comum', 'arteria_iliaca_externa', 'arteria_iliaca_interna', 'linfonodos_lombares'],
  }),
  grupo('linfonodos_inguinais', 'Linfonodos inguinais — esquema', 'Nodi lymphoidei inguinales', [[0.42, -7.55, 0.6], [0.5, -7.7, 0.64], [0.36, -7.62, 0.62], [0.3, -7.58, 0.6]], 0.075, [
    ['Localização', 'Na região inguinal, logo abaixo do ligamento inguinal. Os superficiais ficam no tecido subcutâneo (um grupo horizontal, ao longo do ligamento, e um vertical, em volta da terminação da veia safena magna); os profundos, ao lado da veia femoral, no trígono femoral.'],
    ['Território drenado', 'Superficiais: pele da parede inferior do abdome, nádegas, períneo, genitália externa (inclusive o escroto), parte inferior do canal anal e a pele do membro inferior, exceto a região lateral do pé e a posterior da perna. Profundos: estruturas profundas do membro inferior e a glande do pênis ou do clitóris.'],
    ['Drena para', 'Linfonodos ilíacos externos.'],
    ['Clínica', 'O aumento dos linfonodos inguinais (linfadenopatia) é um sinal frequente de infecção do membro inferior ou da genitália, e de metástases de melanoma da pele do membro, do câncer do canal anal e do da vulva.'],
  ], {
    nota: 'ESQUEMA: quatro linfonodos representam os grupos; os superficiais reais passam de dez, e as posições são aproximadas.',
    relacionados: ['veia_femoral', 'arteria_femoral', 'linfonodos_iliacos'],
  }),

  /* ═════════════ Sistema de condução do coração ═════════════ */
  cond('no_sinoatrial', 'Nó sinoatrial — esquema', 'Nodus sinuatrialis', [
    tubo([[-0.25, -2.7, 0.3], [-0.235, -2.64, 0.36], [-0.21, -2.61, 0.42]], 0.035, 0.022, { nf: 8, nc: 8 }),
  ], [
    ['Localização', 'No átrio direito, na parte alta da crista terminal, perto da desembocadura da veia cava superior, logo abaixo do epicárdio.'],
    ['Função', 'É o marca-passo natural do coração: inicia o impulso que se espalha pelas paredes dos átrios e provoca a sístole atrial. Em repouso, a frequência do ritmo sinusal fica em geral entre 60 e 100 batimentos por minuto.'],
    ['Irrigação', 'Artéria do nó sinoatrial, ramo da coronária direita na maior parte das pessoas e da circunflexa nas demais.'],
    ['Inervação', 'O simpático acelera e o parassimpático (nervo vago) desacelera os disparos do nó.'],
  ], {
    nota: 'ESQUEMA: o tamanho (cerca de 1 a 2 cm no vivo, alongado em forma de crescente) e a posição foram aproximados no modelo, e o BodyParts3D não tem esta estrutura. Na dissecção o nó é difícil de ver; sua posição se infere pelas relações. A lesão do nó (doença do nó sinusal) é uma causa de marca-passo artificial.',
    relacionados: ['atrio_direito', 'veia_cava_superior', 'coronaria_direita', 'no_atrioventricular'],
  }),
  cond('no_atrioventricular', 'Nó atrioventricular — esquema', 'Nodus atrioventricularis', [
    tubo([[-0.04, -3.22, 0.26], [-0.01, -3.18, 0.29], [0.03, -3.15, 0.32]], 0.03, 0.02, { nf: 8, nc: 8 }),
  ], [
    ['Localização', 'No septo interatrial, na parte inferior e posterior do átrio direito, no triângulo de Koch (limitado pelo tendão de Todaro, pela inserção da cúspide septal da valva tricúspide e pelo óstio do seio coronário).'],
    ['Função', 'Recebe o impulso do átrio e o retarda por alguns centésimos de segundo, o que dá tempo para o enchimento dos ventrículos antes da sístole; é a única via entre átrios e ventrículos (fora as vias acessórias).'],
    ['Irrigação', 'Artéria do nó atrioventricular, ramo da coronária direita na maior parte das pessoas (a que dá o ramo interventricular posterior) e da circunflexa nas demais.'],
    ['Continuação', 'Dá origem ao fascículo atrioventricular (feixe de His).'],
  ], {
    nota: 'ESQUEMA: posição e tamanho aproximados; o BodyParts3D não tem esta estrutura. O bloqueio atrioventricular (de 1º, 2º ou 3º grau) é a falha dessa condução e pode exigir marca-passo; vias acessórias (como o feixe de Kent) causam a síndrome de Wolff-Parkinson-White.',
    relacionados: ['atrio_direito', 'seio_coronario', 'valva_tricuspide', 'fasciculo_atrioventricular'],
  }),
  cond('fasciculo_atrioventricular', 'Fascículo atrioventricular e ramos — esquema', 'Fasciculus atrioventricularis (truncus, crus dextrum et sinistrum)', [
    tubo([[0.03, -3.15, 0.32], [0.09, -3.11, 0.34], [0.14, -3.14, 0.37]], 0.022, 0.018, { nf: 8, nc: 6 }),
    tubo([[0.14, -3.14, 0.37], [0.2, -3.27, 0.46], [0.27, -3.4, 0.6], [0.3, -3.47, 0.72]], 0.014, 0.014, { nf: 16, nc: 6 }),
    tubo([[0.14, -3.14, 0.37], [0.2, -3.3, 0.33], [0.3, -3.45, 0.3], [0.4, -3.5, 0.3]], 0.014, 0.014, { nf: 16, nc: 6 }),
    tubo([[0.14, -3.14, 0.37], [0.18, -3.34, 0.22], [0.26, -3.5, 0.14]], 0.012, 0.012, { nf: 12, nc: 6 }),
  ], [
    ['Trajeto', 'Sai do nó atrioventricular, atravessa o esqueleto fibroso do coração e a parte membranácea do septo interventricular e, no limite superior da parte muscular do septo, se divide nos ramos direito e esquerdo.'],
    ['Ramo direito', 'Desce pelo lado direito do septo, passa pela trabécula septomarginal até o músculo papilar anterior do ventrículo direito e se ramifica nas fibras de Purkinje.'],
    ['Ramo esquerdo', 'Atravessa o septo e se abre no lado esquerdo em fascículos anterior e posterior, que chegam aos músculos papilares do ventrículo esquerdo e às fibras de Purkinje.'],
    ['Irrigação', 'Ramos septais do ramo interventricular anterior (da coronária esquerda) e do ramo interventricular posterior (da coronária direita).'],
  ], {
    nota: 'ESQUEMA: o caminho dos feixes foi desenhado dentro do septo e das paredes do coração, mas só aproximado; o BodyParts3D não os tem, e eles não se distinguem do miocárdio na dissecção comum. Use o plano de corte do Estudo para ver o interior. O bloqueio de ramo (direito ou esquerdo) atrasa a ativação de um ventrículo e aparece no eletrocardiograma como QRS alargado.',
    relacionados: ['no_atrioventricular', 'ventriculo_direito', 'ventriculo_esquerdo', 'ramo_interventricular_anterior', 'ramo_interventricular_posterior', 'papilares_vd'],
  }),
  cond('papilar_posteromedial_ve', 'Músculo papilar posteromedial do ventrículo esquerdo — esquema', 'Musculus papillaris posteromedialis ventriculi sinistri', [
    tubo([[0.31, -3.5, 0.11], [0.32, -3.41, 0.17], [0.33, -3.32, 0.23]], [0.075, 0.045, 0.02], [0.065, 0.04, 0.02], { nf: 10, nc: 8 }),
  ], [
    ['Localização', 'Parede posteromedial do ventrículo esquerdo, perto do septo; o outro grande músculo papilar é o anterolateral.'],
    ['Estrutura', 'Em geral é menor que o anterolateral e pode ser dividido em duas ou três cabeças. Suas cordas tendíneas vão às duas cúspides da valva mitral, cada uma recebendo cordas dos dois músculos.'],
    ['Funcionamento', 'Contrai-se com o ventrículo e tensiona as cordas, impedindo que as cúspides da valva mitral prolapsem para o átrio na sístole.'],
    ['Irrigação', 'Costuma depender de uma só artéria (o ramo interventricular posterior ou o circunflexo, conforme a dominância), ao contrário do anterolateral, que tem irrigação dupla.'],
  ], {
    paired: false,
    nota: 'ESQUEMA: forma e posição aproximadas; o BodyParts3D só tem o músculo papilar anterolateral (“lateral”). A ruptura do papilar posteromedial, mais frequente que a do anterolateral, causa insuficiência mitral aguda no infarto da parede inferior. As cordas tendíneas dele não estão no modelo.',
    relacionados: ['papilar_ve', 'valva_mitral', 'ventriculo_esquerdo'],
  }),
];
