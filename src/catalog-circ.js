/**
 * Circulatório (F5): coração, artérias e veias principais, com malha real do BodyParts3D (pacote `anatomy-circ.js`, carregado
 * depois do membro inferior). Textos próprios, a partir de Moore, Dalley & Agur (Anatomia Orientada para a Clínica, 8ª ed.) e
 * Gray's Anatomy (42ª ed.); porcentagens são as aproximadas desses textos. O que varia entre as fontes fica na `nota`.
 *
 * Fora do banco (e portanto fora do modelo): pericárdio, septos como peças, aurículas separadas e o músculo papilar posteromedial
 * do ventrículo esquerdo. As cordas tendíneas vêm junto com a malha das valvas; o interior se vê com o plano de corte. Vasos de menor calibre e a irrigação de cada músculo ficam para depois (M15, M20).
 * `relacionados` liga cada estrutura às vizinhas na circulação (chips da ficha e realce ao selecionar).
 */

const T = 'tronco';
const part = (id, mat) => ({ id, mat });

/** Estrutura do coração (câmara, valva, músculo papilar). */
const cardio = (id, name, latin, parts, d, extra = {}) => ({
  kind: 'cardiaco',
  id,
  name,
  latin,
  layer: 'coracao',
  region: T,
  parts,
  campos: [
    ['Localização', d.local],
    [d.k2 ?? 'Paredes e relações', d.paredes],
    [d.k3 ?? 'Estruturas internas', d.interno],
    [d.k4 ?? 'Função', d.funcao],
  ],
  nota: d.nota,
  ...extra,
});

/** Artéria ou veia. `d`: origem (ou formação), trajeto, ramos (ou tributárias), territorio (irrigado ou drenado). */
const vaso = (kind, id, name, latin, region, parts, d, extra = {}) => ({
  kind,
  id,
  name,
  latin,
  layer: kind === 'arteria' ? 'arteria' : 'veia',
  region,
  parts: parts.map((p) => part(p, kind === 'arteria' ? 'artery' : 'vein')),
  campos: [
    [kind === 'arteria' ? 'Origem' : 'Formação', d.origem],
    ['Trajeto', d.trajeto],
    [kind === 'arteria' ? 'Ramos principais' : 'Tributárias', d.ramos],
    [kind === 'arteria' ? 'Território irrigado' : 'Território drenado', d.territorio],
  ],
  nota: d.nota,
  ...extra,
});
export const art = (...a) => vaso('arteria', ...a);
export const vein = (...a) => vaso('veia', ...a);

const RED = '#d04a43'; // sangue oxigenado
const BLUE = '#4f78bd'; // sangue pouco oxigenado

export const CIRC_ITEMS = [
  /* ═════════════ Câmaras, valvas e músculos papilares ═════════════ */
  cardio('atrio_direito', 'Átrio direito', 'Atrium dextrum', [part('cor_parede_atrio_d', 'cardiac')], {
    local: 'Forma a margem direita do coração e recebe o sangue venoso do corpo: a veia cava superior chega por cima; a veia cava inferior e o seio coronário, por baixo.',
    paredes: 'A parede posterior é lisa (parte sinusal, onde desembocam as veias cavas); a anterior é rugosa, com os músculos pectíneos. As duas se separam por dentro pela crista terminal (por fora, pelo sulco terminal). A aurícula direita é o prolongamento em forma de orelha da parede anterior.',
    interno: 'Septo interatrial com a fossa oval (resto do forame oval do feto), óstio do seio coronário e óstio atrioventricular direito, com a valva tricúspide. O nó sinoatrial fica na parte alta da crista terminal, perto da veia cava superior; o nó atrioventricular, no septo interatrial, perto do óstio do seio coronário.',
    funcao: 'Recebe o sangue venoso e o envia ao ventrículo direito, pela valva tricúspide.',
    nota: 'Em cerca de um quarto dos adultos o forame oval continua com uma passagem estreita entre os átrios (forame oval pérvio), em geral sem sintomas; defeitos maiores do septo interatrial são cardiopatias congênitas.',
  }, {
    relacionados: ['veia_cava_superior', 'veia_cava_inferior', 'seio_coronario', 'valva_tricuspide', 'ventriculo_direito'],
  }),
  cardio('atrio_esquerdo', 'Átrio esquerdo', 'Atrium sinistrum', [part('cor_parede_atrio_e', 'cardiac')], {
    local: 'Forma a maior parte da base (face posterior) do coração; é a câmara mais posterior e fica à frente do esôfago.',
    paredes: 'Parede lisa, exceto a aurícula esquerda, mais longa e estreita que a direita, que tem músculos pectíneos. Recebe na parede posterior as quatro veias pulmonares, duas de cada lado, sem valvas.',
    interno: 'O septo interatrial tem, deste lado, uma depressão semilunar que corresponde à fossa oval. O óstio atrioventricular esquerdo é guardado pela valva mitral.',
    funcao: 'Recebe o sangue oxigenado dos pulmões e o envia ao ventrículo esquerdo.',
    nota: 'O átrio dilatado (na estenose mitral, por exemplo) pode comprimir o esôfago, que passa logo atrás. A aurícula esquerda é um dos locais mais comuns de formação de trombos na fibrilação atrial.',
  }, {
    relacionados: ['veia_pulmonar_superior_direita', 'veia_pulmonar_inferior_direita', 'veia_pulmonar_superior_esquerda', 'veia_pulmonar_inferior_esquerda', 'valva_mitral', 'ventriculo_esquerdo'],
  }),
  cardio('ventriculo_direito', 'Ventrículo direito', 'Ventriculus dexter', [part('cor_parede_ventriculo_d', 'cardiac')], {
    local: 'Forma a maior parte da face esternocostal (anterior) do coração e parte da face diafragmática; fica logo atrás do esterno e das cartilagens costais esquerdas.',
    paredes: 'A parede tem cerca de um terço da espessura da do ventrículo esquerdo. A câmara se divide em via de entrada (trabeculada, com trabéculas cárneas) e via de saída (cone arterial ou infundíbulo, de parede lisa), separadas pela crista supraventricular.',
    interno: 'Valva tricúspide na entrada e valva do tronco pulmonar na saída. Três músculos papilares (anterior, posterior e septal) ligam as cúspides por cordas tendíneas. A trabécula septomarginal (banda moderadora) leva o ramo direito do fascículo atrioventricular do septo ao músculo papilar anterior.',
    funcao: 'Recebe o sangue do átrio direito e o bombeia pelo tronco pulmonar aos pulmões (pequena circulação), sob pressão baixa.',
    nota: 'Por formar a maior parte da face anterior, é a câmara mais atingida nos ferimentos penetrantes do tórax.',
  }, {
    relacionados: ['atrio_direito', 'valva_tricuspide', 'papilares_vd', 'valva_pulmonar', 'tronco_pulmonar'],
  }),
  cardio('ventriculo_esquerdo', 'Ventrículo esquerdo', 'Ventriculus sinister', [part('cor_parede_ventriculo_e', 'cardiac')], {
    local: 'Forma o ápice do coração (no 5º espaço intercostal esquerdo, na linha hemiclavicular), a face pulmonar esquerda e parte das faces diafragmática e esternocostal.',
    paredes: 'A parede é cerca de três vezes mais espessa que a do ventrículo direito, porque vence a pressão da circulação sistêmica. O septo interventricular tem uma grande parte muscular e uma pequena parte membranácea, na região superior.',
    interno: 'Valva mitral na entrada; na saída, o vestíbulo da aorta (parte lisa) e a valva da aorta. Dois grandes músculos papilares (anterolateral e posteromedial) prendem, por cordas tendíneas, as cúspides da valva mitral. As trabéculas cárneas são finas e numerosas.',
    funcao: 'Recebe o sangue oxigenado do átrio esquerdo e o bombeia pela aorta a todo o corpo (grande circulação).',
    nota: 'É a câmara mais atingida pelo infarto do miocárdio. A parte membranácea do septo é a sede mais comum das comunicações interventriculares.',
  }, {
    relacionados: ['atrio_esquerdo', 'valva_mitral', 'papilar_ve', 'valva_aortica', 'aorta_ascendente'],
  }),
  cardio('valva_tricuspide', 'Valva tricúspide (atrioventricular direita)', 'Valva atrioventricularis dextra (valva tricuspidalis)', [part('valva_tricuspide', 'valve')], {
    local: 'Óstio atrioventricular direito, entre o átrio e o ventrículo direitos.',
    k2: 'Estrutura',
    paredes: 'Três cúspides (anterior, posterior e septal), presas ao anel fibroso e, por cordas tendíneas, aos músculos papilares do ventrículo direito.',
    k3: 'Funcionamento',
    interno: 'Fecha-se na sístole ventricular e impede o refluxo de sangue para o átrio direito. Os músculos papilares se contraem com o ventrículo e tensionam as cordas, o que evita que as cúspides se projetem para o átrio.',
    k4: 'Posição na circulação',
    funcao: 'Separa a câmara de entrada do ventrículo direito do átrio direito.',
    nota: 'É a valva mais atingida pela endocardite em usuários de drogas injetáveis; sua insuficiência também é frequente quando o ventrículo direito se dilata.',
  }, {
    relacionados: ['atrio_direito', 'ventriculo_direito', 'papilares_vd'],
  }),
  cardio('valva_mitral', 'Valva mitral (atrioventricular esquerda)', 'Valva atrioventricularis sinistra (valva mitralis; valva bicuspidalis)', [part('valva_mitral', 'valve')], {
    local: 'Óstio atrioventricular esquerdo, entre o átrio e o ventrículo esquerdos.',
    k2: 'Estrutura',
    paredes: 'Duas cúspides, anterior (a maior) e posterior, presas ao anel fibroso e, por cordas tendíneas, aos músculos papilares anterolateral e posteromedial. A cúspide anterior fica entre o óstio atrioventricular e a via de saída para a aorta.',
    k3: 'Funcionamento',
    interno: 'Impede o refluxo para o átrio esquerdo durante a sístole, quando a pressão no ventrículo esquerdo é a mais alta do coração.',
    k4: 'Posição na circulação',
    funcao: 'Separa o átrio esquerdo do ventrículo esquerdo.',
    nota: 'É a valva mais atingida pela cardiopatia reumática (estenose mitral); o prolapso é a projeção das cúspides para o átrio durante a sístole.',
  }, {
    relacionados: ['atrio_esquerdo', 'ventriculo_esquerdo', 'papilar_ve'],
  }),
  cardio('valva_aortica', 'Valva da aorta (aórtica)', 'Valva aortae', [part('valva_aortica', 'valve')], {
    local: 'Óstio da aorta, entre o ventrículo esquerdo e a aorta ascendente.',
    k2: 'Estrutura',
    paredes: 'Três válvulas semilunares em forma de bolsa (direita, esquerda e posterior, na Terminologia Anatômica), com um espessamento central, o nódulo. Acima de cada uma, a parede da aorta se dilata em um seio da aorta.',
    k3: 'Funcionamento',
    interno: 'Abre-se na sístole e se fecha na diástole, quando o refluxo enche as válvulas e impede a volta do sangue ao ventrículo. As artérias coronárias nascem dos seios direito e esquerdo; o seio posterior não dá origem a nenhuma artéria (válvula não coronariana).',
    k4: 'Posição na circulação',
    funcao: 'Separa o ventrículo esquerdo da aorta.',
    nota: 'Os nomes das cúspides variam: direita, esquerda e posterior na Terminologia Anatômica; anterior, posterior esquerda e posterior direita no BodyParts3D. Na descrição clássica, a cúspide anterior é a direita (de onde nasce a coronária direita), a posterior esquerda é a esquerda (de onde nasce a coronária esquerda) e a posterior direita é a posterior, sem coronária. A valva aórtica bicúspide é a malformação cardíaca congênita mais comum e, com a calcificação da idade, uma das causas principais de estenose aórtica.',
  }, {
    relacionados: ['ventriculo_esquerdo', 'aorta_ascendente', 'coronaria_direita', 'coronaria_esquerda'],
  }),
  cardio('valva_pulmonar', 'Valva do tronco pulmonar (pulmonar)', 'Valva trunci pulmonalis', [part('valva_pulmonar', 'valve')], {
    local: 'Óstio do tronco pulmonar, no ápice do cone arterial do ventrículo direito; é a mais superior e anterior das valvas do coração.',
    k2: 'Estrutura',
    paredes: 'Três válvulas semilunares (anterior, direita e esquerda, na Terminologia Anatômica), com os seios do tronco pulmonar acima delas. Não há cordas tendíneas nas valvas semilunares.',
    k3: 'Funcionamento',
    interno: 'Abre-se na sístole e impede o refluxo do tronco pulmonar para o ventrículo direito na diástole.',
    k4: 'Posição na circulação',
    funcao: 'Separa o ventrículo direito do tronco pulmonar.',
    nota: 'Os nomes das cúspides diferem no BodyParts3D (anterior esquerda, anterior direita e posterior). A estenose da via de saída do ventrículo direito é um dos quatro componentes da tetralogia de Fallot.',
  }, {
    relacionados: ['ventriculo_direito', 'tronco_pulmonar'],
  }),
  cardio('papilares_vd', 'Músculos papilares do ventrículo direito', 'Musculi papillares ventriculi dextri',
    [part('papilar_anterior_vd', 'cardiac'), part('papilar_posterior_vd', 'cardiac'), part('papilar_septal_vd', 'cardiac')], {
      local: 'Parede do ventrículo direito: um anterior (o maior), um posterior e um septal.',
      k2: 'Estrutura',
      paredes: 'Projeções musculares cônicas da parede ventricular. Cada músculo envia cordas tendíneas a duas cúspides vizinhas da valva tricúspide.',
      k3: 'Funcionamento',
      interno: 'Contraem-se com o ventrículo e tensionam as cordas, mantendo as cúspides fechadas durante a sístole.',
      k4: 'Posição na circulação',
      funcao: 'Impedem a eversão das cúspides da valva tricúspide para o átrio.',
      nota: 'A ruptura de um músculo papilar (complicação do infarto) causa insuficiência valvar aguda. As cordas tendíneas aparecem no modelo como parte da malha das valvas; use o plano de corte do Estudo para ver o interior do ventrículo.',
    }, {
      relacionados: ['valva_tricuspide', 'ventriculo_direito'],
    }),
  cardio('papilar_ve', 'Músculo papilar anterolateral do ventrículo esquerdo', 'Musculus papillaris anterolateralis ventriculi sinistri', [part('papilar_lateral_ve', 'cardiac')], {
    local: 'Parede anterolateral do ventrículo esquerdo. O banco o chama de músculo papilar lateral.',
    k2: 'Estrutura',
    paredes: 'Um dos dois grandes músculos papilares do ventrículo esquerdo (o outro é o posteromedial, que não existe no banco). Suas cordas tendíneas vão às duas cúspides da valva mitral.',
    k3: 'Funcionamento',
    interno: 'Contrai-se com o ventrículo e tensiona as cordas, mantendo as cúspides da valva mitral fechadas durante a sístole.',
    k4: 'Posição na circulação',
    funcao: 'Impede o prolapso da valva mitral para o átrio esquerdo.',
    nota: 'O músculo anterolateral costuma receber sangue de duas artérias (ramo interventricular anterior e circunflexo); o posteromedial depende, em geral, de uma só, e por isso é o que mais se rompe no infarto da parede inferior.',
  }, {
    relacionados: ['valva_mitral', 'ventriculo_esquerdo'],
  }),

  /* ═════════════ Pericárdio (esquema) ═════════════ */
  {
    kind: 'estrutura',
    id: 'pericardio',
    name: 'Pericárdio (saco pericárdico) — esquema',
    latin: 'Pericardium',
    layer: 'coracao',
    region: T,
    paired: false,
    mat: 'pericardio',
    color: '#e6d9a8',
    // contorno do coração e da raiz dos grandes vasos; o banco não tem o pericárdio
    proc: [{
      kind: 'hull',
      pad: 0.05,
      of: [
        ['cor_parede_atrio_d'], ['cor_parede_atrio_e'], ['cor_parede_ventriculo_d'], ['cor_parede_ventriculo_e'],
        ['aorta_ascendente', { y: [-9, -2.5] }], ['tronco_pulmonar'], ['veia_cava_superior', { y: [-9, -2.5] }], ['veia_cava_inferior', { y: [-3.8, 0] }],
      ],
    }],
    campos: [
      ['Localização', 'Mediastino médio, envolvendo o coração e a parte inicial dos grandes vasos (aorta ascendente, tronco pulmonar, veias cavas e veias pulmonares). Fica atrás do esterno e das cartilagens costais 2 a 6 e se apoia no centro tendíneo do diafragma.'],
      ['Camadas', 'Pericárdio fibroso, externo e resistente, preso ao diafragma e ao esterno (ligamentos esternopericárdicos), e pericárdio seroso, de duas lâminas: a parietal, que forra o fibroso por dentro, e a visceral (epicárdio), colada ao coração. Entre as duas fica a cavidade do pericárdio, com uma pequena quantidade de líquido.'],
      ['Seios', 'Os seios transverso e oblíquo do pericárdio são recessos da cavidade serosa entre as reflexões da lâmina visceral para a parietal. O seio transverso passa por trás da aorta ascendente e do tronco pulmonar.'],
      ['Função e inervação', 'Protege o coração, o mantém em posição e limita sua dilatação súbita; o líquido seroso reduz o atrito dos batimentos. O pericárdio fibroso e a lâmina parietal são inervados pelo nervo frênico (C3–C5), que desce sobre o pericárdio, entre ele e a pleura mediastinal.'],
    ],
    nota: 'ESQUEMA: o modelo é só um envoltório que acompanha o contorno do coração e da raiz dos vasos; não representa as lâminas, a cavidade nem os seios, e o BodyParts3D não tem esta estrutura. Clínica: o acúmulo rápido de líquido ou de sangue na cavidade comprime o coração (tamponamento cardíaco); a pericardiocentese costuma ser feita por via subxifóidea.',
    relacionados: ['aorta_ascendente', 'tronco_pulmonar', 'veia_cava_superior', 'veia_cava_inferior', 'atrio_direito', 'ventriculo_esquerdo'],
  },

  /* ═════════════ Artérias coronárias ═════════════ */
  art('coronaria_direita', 'Artéria coronária direita', 'Arteria coronaria dextra', T, ['coronaria_direita'], {
    origem: 'Seio direito da aorta, logo acima da valva da aorta.',
    trajeto: 'Passa entre o tronco pulmonar e a aurícula direita, desce no sulco coronário (atrioventricular) para a direita, contorna a margem direita do coração e segue pela face diafragmática até a cruz do coração (encontro dos sulcos coronário e interventricular posterior).',
    ramos: 'Ramo do nó sinoatrial e ramos atriais, ramo do cone arterial, ramo marginal direito, ramo do nó atrioventricular e, na dominância direita, o ramo interventricular posterior. Na malha, a peça traz também os ramos ventriculares; o ramo interventricular posterior e o marginal direito são fichas à parte.',
    territorio: 'Átrio e ventrículo direitos, parte posterior do septo interventricular e da parede inferior do ventrículo esquerdo e, na maioria das pessoas, os nós sinoatrial e atrioventricular.',
    nota: 'O nó sinoatrial recebe o sangue da coronária direita em cerca de 60% das pessoas (nas outras, do circunflexo) e o nó atrioventricular, em cerca de 80%. A oclusão proximal causa infarto da parede inferior, com bradicardia ou bloqueio atrioventricular por isquemia dos nós.',
  }, {
    relacionados: ['aorta_ascendente', 'ramo_interventricular_posterior', 'ramo_marginal_direito', 'veia_cardiaca_pequena'],
  }),
  art('ramo_interventricular_posterior', 'Ramo interventricular posterior', 'Ramus interventricularis posterior (arteriae coronariae dextrae)', T, ['ramo_interventricular_posterior'], {
    origem: 'Ramo terminal da artéria coronária direita (dominância direita), perto da cruz do coração.',
    trajeto: 'Desce no sulco interventricular posterior até o ápice, onde pode se anastomosar com o ramo interventricular anterior.',
    ramos: 'Ramos interventriculares septais, que perfuram o septo, e ramos para as paredes inferiores dos dois ventrículos.',
    territorio: 'Terço posterior do septo interventricular e face diafragmática dos dois ventrículos.',
    nota: 'Dominância é a artéria que dá este ramo: direita em cerca de dois terços das pessoas, esquerda (o ramo nasce do circunflexo) em cerca de 15% e codominância nas demais.',
  }, {
    relacionados: ['coronaria_direita', 'veia_cardiaca_media'],
  }),
  art('ramo_marginal_direito', 'Ramo marginal direito', 'Ramus marginalis dexter', T, ['ramo_marginal_direito'], {
    origem: 'Ramo da artéria coronária direita, na altura da margem inferior (aguda) do coração.',
    trajeto: 'Segue pela margem inferior do coração em direção ao ápice.',
    ramos: 'Pequenos ramos musculares para a parede do ventrículo direito.',
    territorio: 'Parede do ventrículo direito e parte do ápice do coração.',
    nota: 'A veia cardíaca pequena acompanha este ramo.',
  }, {
    relacionados: ['coronaria_direita', 'veia_cardiaca_pequena'],
  }),
  art('coronaria_esquerda', 'Artéria coronária esquerda (tronco)', 'Arteria coronaria sinistra', T, ['coronaria_esquerda'], {
    origem: 'Seio esquerdo da aorta, logo acima da valva da aorta.',
    trajeto: 'Tronco curto, que passa entre o tronco pulmonar e a aurícula esquerda e se divide no sulco coronário.',
    ramos: 'Ramo interventricular anterior e ramo circunflexo; em parte das pessoas, um ramo intermédio entre os dois.',
    territorio: 'Átrio esquerdo, a maior parte do ventrículo esquerdo e do septo interventricular.',
    nota: 'A obstrução do tronco da coronária esquerda compromete a maior parte do ventrículo esquerdo e é uma das mais graves.',
  }, {
    label: false,
    relacionados: ['aorta_ascendente', 'ramo_interventricular_anterior', 'ramo_circunflexo'],
  }),
  art('ramo_interventricular_anterior', 'Ramo interventricular anterior (descendente anterior)', 'Ramus interventricularis anterior (arteriae coronariae sinistrae)', T, ['ramo_interventricular_anterior'], {
    origem: 'Ramo terminal da artéria coronária esquerda.',
    trajeto: 'Desce no sulco interventricular anterior em direção ao ápice, onde pode contornar a margem inferior e se anastomosar com o ramo interventricular posterior.',
    ramos: 'Ramos diagonais (para a parede anterolateral do ventrículo esquerdo), ramos septais interventriculares e ramo do cone arterial, que se anastomosa com o ramo correspondente da coronária direita.',
    territorio: 'Parede anterior do ventrículo esquerdo, dois terços anteriores do septo interventricular (inclusive o fascículo atrioventricular e seus ramos) e parte do ventrículo direito.',
    nota: 'É a coronária mais frequentemente obstruída; a oclusão proximal causa infarto extenso da parede anterior. A veia cardíaca magna o acompanha.',
  }, {
    relacionados: ['coronaria_esquerda', 'veia_cardiaca_magna'],
  }),
  art('ramo_circunflexo', 'Ramo circunflexo', 'Ramus circumflexus (arteriae coronariae sinistrae)', T, ['ramo_circunflexo'], {
    origem: 'Ramo terminal da artéria coronária esquerda.',
    trajeto: 'Segue no sulco coronário para a esquerda, contorna a margem esquerda do coração e passa à face posterior (diafragmática).',
    ramos: 'Ramo marginal esquerdo, ramos atriais, ramo do nó sinoatrial em parte das pessoas e, na dominância esquerda, o ramo interventricular posterior.',
    territorio: 'Átrio esquerdo e paredes lateral e posterior do ventrículo esquerdo.',
    nota: 'A obstrução do circunflexo pode passar despercebida no eletrocardiograma comum, porque a parede lateral é pouco explorada pelas derivações padrão.',
  }, {
    relacionados: ['coronaria_esquerda', 'seio_coronario'],
  }),

  /* ═════════════ Veias do coração ═════════════ */
  vein('seio_coronario', 'Seio coronário', 'Sinus coronarius', T, ['seio_coronario'], {
    origem: 'Continuação da veia cardíaca magna, na extremidade esquerda do sulco coronário.',
    trajeto: 'Percorre o sulco coronário na face diafragmática do coração, entre o átrio e o ventrículo esquerdos, e desemboca no átrio direito, entre a veia cava inferior e o óstio atrioventricular direito.',
    ramos: 'Veias cardíacas magna, média e pequena, veia posterior do ventrículo esquerdo e veia oblíqua do átrio esquerdo (esta não existe no banco).',
    territorio: 'A maior parte do sangue venoso do miocárdio.',
    nota: 'O óstio tem uma valva rudimentar (do seio coronário). O seio é a via de acesso dos eletrodos de marca-passo biventricular e de muitos cateteres de eletrofisiologia.',
  }, {
    relacionados: ['atrio_direito', 'veia_cardiaca_magna', 'veia_cardiaca_media', 'veia_cardiaca_pequena', 'veia_posterior_ventriculo_e'],
  }),
  vein('veia_cardiaca_magna', 'Veia cardíaca magna', 'Vena cardiaca magna', T, ['veia_cardiaca_magna'], {
    origem: 'Começa perto do ápice e sobe pelo sulco interventricular anterior, junto ao ramo interventricular anterior (aí é chamada de veia interventricular anterior).',
    trajeto: 'No sulco coronário, contorna a margem esquerda do coração e passa à face posterior, onde se continua como seio coronário.',
    ramos: 'Veia marginal esquerda e veias do ventrículo esquerdo.',
    territorio: 'Átrio e ventrículo esquerdos e a parte anterior do septo interventricular.',
  }, {
    relacionados: ['seio_coronario', 'ramo_interventricular_anterior'],
  }),
  vein('veia_cardiaca_media', 'Veia cardíaca média', 'Vena cardiaca media', T, ['veia_cardiaca_media'], {
    origem: 'Começa perto do ápice.',
    trajeto: 'Sobe pelo sulco interventricular posterior, junto ao ramo interventricular posterior, e desemboca no seio coronário perto de sua terminação.',
    ramos: 'Veias da parede posterior dos dois ventrículos e do septo.',
    territorio: 'Parede posterior (diafragmática) dos dois ventrículos e a parte posterior do septo interventricular.',
  }, {
    relacionados: ['seio_coronario', 'ramo_interventricular_posterior'],
  }),
  vein('veia_cardiaca_pequena', 'Veia cardíaca pequena', 'Vena cardiaca parva', T, ['veia_cardiaca_pequena'], {
    origem: 'Parte inferior da margem direita do coração.',
    trajeto: 'Segue no sulco coronário, pela margem direita, ao lado da artéria coronária direita e do ramo marginal direito, e desemboca na extremidade direita do seio coronário (ou diretamente no átrio direito).',
    ramos: 'Veias marginal direita e do átrio e do ventrículo direitos.',
    territorio: 'Átrio e ventrículo direitos.',
  }, {
    relacionados: ['seio_coronario', 'coronaria_direita', 'ramo_marginal_direito'],
  }),
  vein('veia_posterior_ventriculo_e', 'Veia posterior do ventrículo esquerdo', 'Vena posterior ventriculi sinistri', T, ['veia_posterior_ventriculo_e'], {
    origem: 'Face diafragmática do ventrículo esquerdo.',
    trajeto: 'Corre pela face diafragmática do ventrículo esquerdo e desemboca no seio coronário (ou na veia cardíaca magna).',
    ramos: 'Pequenas veias da parede do ventrículo esquerdo.',
    territorio: 'Face diafragmática do ventrículo esquerdo.',
  }, {
    relacionados: ['seio_coronario', 'ventriculo_esquerdo'],
  }),
  vein('veias_cardiacas_anteriores', 'Veias cardíacas anteriores', 'Venae cardiacae anteriores', T, ['veias_cardiacas_anteriores'], {
    origem: 'Parede anterior do ventrículo direito (duas a quatro veias).',
    trajeto: 'Atravessam o sulco coronário, sobre a artéria coronária direita, e desembocam diretamente no átrio direito, sem passar pelo seio coronário.',
    ramos: 'Pequenas veias da parede do ventrículo direito.',
    territorio: 'Parede anterior do ventrículo direito.',
  }, {
    label: false,
    relacionados: ['atrio_direito', 'ventriculo_direito'],
  }),

  /* ═════════════ Grandes vasos da base do coração ═════════════ */
  art('aorta_ascendente', 'Aorta ascendente', 'Aorta ascendens', T, ['aorta_ascendente'], {
    origem: 'Óstio da aorta, na base do ventrículo esquerdo; o começo é dilatado, o bulbo da aorta, com os três seios.',
    trajeto: 'Sobe e vai um pouco para a direita, dentro do saco pericárdico, por cerca de 5 cm, junto ao tronco pulmonar (os dois são envolvidos pela mesma bainha de pericárdio seroso), até o ângulo do esterno, onde passa a arco da aorta.',
    ramos: 'Artérias coronárias direita e esquerda, os únicos ramos.',
    territorio: 'O próprio coração, pelas coronárias.',
    nota: 'A dilatação da raiz da aorta é típica da síndrome de Marfan; a dissecção aórtica tipo A compromete este segmento e é uma emergência cirúrgica.',
  }, {
    relacionados: ['valva_aortica', 'coronaria_direita', 'coronaria_esquerda', 'arco_aorta'],
  }),
  art('arco_aorta', 'Arco da aorta', 'Arcus aortae', T, ['arco_aorta'], {
    origem: 'Continua a aorta ascendente ao nível do ângulo do esterno (disco entre T4 e T5).',
    trajeto: 'Curva-se para trás e para a esquerda sobre o hilo do pulmão esquerdo e o brônquio principal esquerdo e termina à esquerda do corpo de T4, onde continua como aorta torácica. O ligamento arterial o une à artéria pulmonar esquerda; o nervo laríngeo recorrente esquerdo o contorna por baixo.',
    ramos: 'Tronco braquiocefálico, artéria carótida comum esquerda e artéria subclávia esquerda, nessa ordem, da direita para a esquerda.',
    territorio: 'Cabeça, pescoço e membros superiores, por seus três ramos.',
    nota: 'O istmo da aorta (logo depois da subclávia esquerda), fixado pelo ligamento arterial, é o ponto mais comum de rotura por desaceleração (acidentes) e de coarctação da aorta.',
  }, {
    relacionados: ['aorta_ascendente', 'tronco_braquiocefalico', 'arteria_carotida_comum', 'arteria_subclavia', 'aorta_toracica'],
  }),
  art('aorta_toracica', 'Aorta torácica (descendente)', 'Aorta thoracica (pars thoracica aortae)', T, ['aorta_toracica'], {
    origem: 'Continua o arco da aorta à esquerda do corpo de T4.',
    trajeto: 'Desce no mediastino posterior, à esquerda da coluna e depois na linha mediana, e atravessa o hiato aórtico do diafragma ao nível de T12, passando a aorta abdominal.',
    ramos: 'Artérias intercostais posteriores (da 3ª à 11ª), subcostal, bronquiais, esofágicas, mediastinais e frênicas superiores.',
    territorio: 'Parede do tórax, brônquios, esôfago e pericárdio.',
    nota: 'As intercostais posteriores correm junto à margem inferior de cada costela. A artéria radicular magna (de Adamkiewicz), que nasce de uma delas, irriga a parte baixa da medula espinal: sua lesão numa cirurgia da aorta pode causar paraplegia.',
  }, {
    relacionados: ['arco_aorta', 'aorta_abdominal'],
  }),
  art('aorta_abdominal', 'Aorta abdominal', 'Aorta abdominalis (pars abdominalis aortae)', T, ['aorta_abdominal'], {
    origem: 'Continua a aorta torácica no hiato aórtico do diafragma (T12).',
    trajeto: 'Desce pelo retroperitônio, à esquerda da linha mediana e à frente dos corpos vertebrais, e se bifurca nas artérias ilíacas comuns ao nível de L4.',
    ramos: 'Tronco celíaco (T12), mesentéricas superior (L1) e inferior (L3), renais (L1–L2), suprarrenais médias, gonadais, frênicas inferiores, lombares e sacral mediana.',
    territorio: 'Vísceras abdominais e pélvicas, parede do abdome e, pelas ilíacas, os membros inferiores.',
    nota: 'O aneurisma da aorta abdominal (acima de 3 cm de diâmetro) é mais comum abaixo da origem das artérias renais; a rotura tem mortalidade elevada.',
  }, {
    relacionados: ['aorta_toracica', 'arteria_tronco_celiaco', 'arteria_mesenterica_superior', 'arteria_mesenterica_inferior', 'arteria_renal', 'arteria_iliaca_comum'],
  }),
  art('tronco_pulmonar', 'Tronco pulmonar', 'Truncus pulmonalis', T, ['tronco_pulmonar'], {
    origem: 'Cone arterial do ventrículo direito, na valva do tronco pulmonar.',
    trajeto: 'Sobe, para a esquerda e para trás, à frente da aorta ascendente e dentro do saco pericárdico, por cerca de 5 cm, e se divide, abaixo do arco da aorta, nas artérias pulmonares direita e esquerda.',
    ramos: 'Artérias pulmonares direita e esquerda; o ligamento arterial liga a esquerda ao arco da aorta.',
    territorio: 'Leva o sangue pouco oxigenado do ventrículo direito aos pulmões.',
    nota: 'No feto, o ducto arterioso desvia o sangue do tronco pulmonar para a aorta; depois do nascimento fecha-se e vira o ligamento arterial. A persistência do ducto é uma cardiopatia congênita comum.',
  }, {
    color: BLUE,
    relacionados: ['ventriculo_direito', 'valva_pulmonar', 'arteria_pulmonar_direita', 'arteria_pulmonar_esquerda'],
  }),
  art('arteria_pulmonar_direita', 'Artéria pulmonar direita', 'Arteria pulmonalis dextra', T, ['arteria_pulmonar_direita'], {
    origem: 'Tronco pulmonar.',
    trajeto: 'Passa por trás da aorta ascendente e da veia cava superior e à frente do brônquio principal direito, até o hilo do pulmão direito.',
    ramos: 'Ramos lobares (superior, médio e inferior), que acompanham os brônquios.',
    territorio: 'Pulmão direito (leva sangue pouco oxigenado).',
    nota: 'É mais longa que a esquerda, porque o coração está deslocado para a esquerda.',
  }, {
    color: BLUE,
    relacionados: ['tronco_pulmonar', 'veia_pulmonar_superior_direita', 'veia_pulmonar_inferior_direita'],
  }),
  art('arteria_pulmonar_esquerda', 'Artéria pulmonar esquerda', 'Arteria pulmonalis sinistra', T, ['arteria_pulmonar_esquerda'], {
    origem: 'Tronco pulmonar.',
    trajeto: 'É mais curta que a direita, arqueia-se sobre o brônquio principal esquerdo e desce por trás do hilo; o ligamento arterial a liga ao arco da aorta.',
    ramos: 'Ramos lobares (superior e inferior), que acompanham os brônquios.',
    territorio: 'Pulmão esquerdo (leva sangue pouco oxigenado).',
    nota: 'O ligamento arterial é o resto do ducto arterioso do feto.',
  }, {
    color: BLUE,
    relacionados: ['tronco_pulmonar', 'arco_aorta', 'veia_pulmonar_superior_esquerda', 'veia_pulmonar_inferior_esquerda'],
  }),
  ...[
    ['veia_pulmonar_superior_direita', 'Veia pulmonar superior direita', 'Vena pulmonalis superior dextra', 'veia_pulmonar_sup_d', 'drena os lobos superior e médio do pulmão direito', 'direita'],
    ['veia_pulmonar_inferior_direita', 'Veia pulmonar inferior direita', 'Vena pulmonalis inferior dextra', 'veia_pulmonar_inf_d', 'drena o lobo inferior do pulmão direito', 'direita'],
    ['veia_pulmonar_superior_esquerda', 'Veia pulmonar superior esquerda', 'Vena pulmonalis superior sinistra', 'veia_pulmonar_sup_e', 'drena o lobo superior do pulmão esquerdo (inclusive a língula)', 'esquerda'],
    ['veia_pulmonar_inferior_esquerda', 'Veia pulmonar inferior esquerda', 'Vena pulmonalis inferior sinistra', 'veia_pulmonar_inf_e', 'drena o lobo inferior do pulmão esquerdo', 'esquerda'],
  ].map(([id, name, latin, piece, drena, lado]) => vein(id, name, latin, T, [piece], {
    origem: 'Formada no hilo do pulmão pela confluência das veias lobares e segmentares.',
    trajeto: `Sai do hilo do pulmão ${lado}, atravessa o pericárdio fibroso e desemboca na parede posterior do átrio esquerdo. Não tem valvas.`,
    ramos: 'Veias segmentares do pulmão.',
    territorio: `Leva o sangue oxigenado ao átrio esquerdo; ${drena}.`,
    nota: 'No adulto, as veias pulmonares são as únicas veias que levam sangue oxigenado. A fibrilação atrial costuma ter focos na desembocadura delas, por isso a ablação por cateter isola essa região.',
  }, {
    color: RED,
    relacionados: ['atrio_esquerdo', lado === 'direita' ? 'arteria_pulmonar_direita' : 'arteria_pulmonar_esquerda'],
  })),
  vein('veia_cava_superior', 'Veia cava superior', 'Vena cava superior', T, ['veia_cava_superior'], {
    origem: 'União das veias braquiocefálicas direita e esquerda, por trás da 1ª cartilagem costal direita.',
    trajeto: 'Desce à direita da aorta ascendente, no mediastino médio, por cerca de 7 cm, e desemboca no átrio direito ao nível da 3ª cartilagem costal direita; a metade inferior é intrapericárdica.',
    ramos: 'Veia ázigo (entra pela face posterior, logo antes de a veia penetrar no pericárdio) e pequenas veias mediastinais e pericárdicas.',
    territorio: 'Cabeça, pescoço, membros superiores e parede do tórax (o sangue acima do diafragma, exceto o do coração e o dos pulmões).',
    nota: 'A síndrome da veia cava superior (compressão por tumor do mediastino, como o câncer de pulmão e o linfoma) causa edema da face e do pescoço e veias do tórax dilatadas.',
  }, {
    relacionados: ['veia_braquiocefalica', 'veia_azigo', 'atrio_direito'],
  }),
  vein('veia_cava_inferior', 'Veia cava inferior', 'Vena cava inferior', T, ['veia_cava_inferior'], {
    origem: 'União das veias ilíacas comuns, ao nível de L5, à direita da linha mediana.',
    trajeto: 'Sobe à direita da aorta abdominal, atrás do fígado (sulco da veia cava), atravessa o forame da veia cava do diafragma (T8) e desemboca no átrio direito.',
    ramos: 'Veias lombares, gonadal direita, renais, suprarrenal direita, frênicas inferiores e hepáticas (a gonadal e a suprarrenal esquerdas entram na veia renal esquerda).',
    territorio: 'Todo o sangue abaixo do diafragma: membros inferiores, pelve e parede e vísceras do abdome (o sangue do trato digestório passa antes pelo fígado, pela veia porta).',
    nota: 'Na gravidez, em decúbito dorsal, o útero pode comprimi-la e reduzir o retorno venoso (síndrome da hipotensão supina).',
  }, {
    relacionados: ['atrio_direito', 'veia_iliaca_comum', 'veia_renal', 'aorta_abdominal'],
  }),
  vein('veia_braquiocefalica', 'Veias braquiocefálicas', 'Venae brachiocephalicae', ['tronco', 'cabeca'], ['veia_braquiocefalica'], {
    origem: 'Cada uma se forma pela união da veia jugular interna com a subclávia, por trás da extremidade medial da clavícula (ângulo venoso).',
    trajeto: 'A direita é curta (cerca de 2,5 cm) e quase vertical. A esquerda é mais longa (cerca de 6 cm), passa à frente dos três ramos do arco da aorta, por trás do manúbrio, e se une à direita para formar a veia cava superior.',
    ramos: 'Veias vertebral, torácica interna, tireóideas inferiores e intercostal superior.',
    territorio: 'Cabeça, pescoço e membro superior do lado correspondente.',
    nota: 'O ducto torácico desemboca no ângulo venoso esquerdo; o ducto linfático direito, no direito.',
  }, {
    relacionados: ['veia_cava_superior', 'veia_jugular_interna', 'veia_subclavia', 'arco_aorta'],
  }),
  vein('veia_azigo', 'Veia ázigo', 'Vena azygos', T, ['veia_azigo'], {
    origem: 'Começa no abdome, pela união da veia lombar ascendente direita com a subcostal direita (às vezes, direto da veia cava inferior).',
    trajeto: 'Sobe pelo mediastino posterior, à direita dos corpos vertebrais, e forma o arco da ázigo sobre o hilo do pulmão direito, para desembocar na veia cava superior ao nível de T4.',
    ramos: 'Veias intercostais posteriores direitas (da 4ª à 11ª), hemiázigo e hemiázigo acessória, veias esofágicas, bronquiais e mediastinais.',
    territorio: 'Parede posterior do tórax e do abdome e, por anastomoses, a coluna vertebral.',
    nota: 'Liga a veia cava inferior à superior: é uma via colateral importante quando uma delas é obstruída.',
  }, {
    relacionados: ['veia_cava_superior', 'veia_hemiazigo'],
  }),
  vein('veia_hemiazigo', 'Veia hemiázigo', 'Vena hemiazygos', T, ['veia_hemiazigo'], {
    origem: 'Começa da veia lombar ascendente esquerda e da subcostal esquerda.',
    trajeto: 'Sobe à esquerda da coluna e, entre T7 e T9, cruza para a direita por trás da aorta, do ducto torácico e do esôfago, para desembocar na veia ázigo.',
    ramos: 'Veias intercostais posteriores esquerdas (da 9ª à 11ª), esofágicas e mediastinais.',
    territorio: 'Parte inferior esquerda da parede do tórax e do abdome posterior.',
    nota: 'A hemiázigo acessória, que recebe as intercostais esquerdas superiores, não existe no banco.',
  }, {
    relacionados: ['veia_azigo'],
  }),

  /* ═════════════ Pescoço e tórax ═════════════ */
  art('tronco_braquiocefalico', 'Tronco braquiocefálico', 'Truncus brachiocephalicus', T, ['tronco_braquiocefalico'], {
    origem: 'Primeiro e maior ramo do arco da aorta, à frente da traqueia.',
    trajeto: 'Sobe para a direita por 4 a 5 cm e se divide, por trás da articulação esternoclavicular direita, em carótida comum e subclávia direitas.',
    ramos: 'Artéria carótida comum direita e artéria subclávia direita; às vezes, a artéria tireóidea ima.',
    territorio: 'Cabeça, pescoço e membro superior direitos.',
    nota: 'Só existe do lado direito; à esquerda, a carótida comum e a subclávia nascem direto do arco.',
  }, {
    relacionados: ['arco_aorta', 'arteria_carotida_comum', 'arteria_subclavia'],
  }),
  art('arteria_carotida_comum', 'Artéria carótida comum', 'Arteria carotis communis', ['cabeca', 'tronco'], ['arteria_carotida_comum'], {
    origem: 'A direita, do tronco braquiocefálico; a esquerda, direto do arco da aorta.',
    trajeto: 'Sobe pelo pescoço dentro da bainha carótica, com a veia jugular interna (lateral) e o nervo vago (posterior), e se divide, ao nível da margem superior da cartilagem tireóidea (C4), nas artérias carótidas externa e interna.',
    ramos: 'Sem ramos antes da bifurcação; as carótidas externa e interna são os ramos terminais. A carótida externa não está no modelo.',
    territorio: 'Cabeça e pescoço, pelas carótidas externa e interna.',
    nota: 'O pulso carotídeo se palpa à frente do esternocleidomastóideo, no nível da cartilagem tireóidea. O seio carótico (barorreceptor) e o glomo carótico (quimiorreceptor) ficam na bifurcação.',
  }, {
    relacionados: ['arco_aorta', 'tronco_braquiocefalico', 'arteria_carotida_interna', 'veia_jugular_interna'],
  }),
  art('arteria_carotida_interna', 'Artéria carótida interna', 'Arteria carotis interna', ['cabeca'], ['arteria_carotida_interna'], {
    origem: 'Ramo terminal da carótida comum, na bifurcação ao nível de C4.',
    trajeto: 'Sobe pelo pescoço sem dar ramos até o canal carótico do osso temporal; depois passa pelo seio cavernoso e entra na cavidade craniana.',
    ramos: 'Artéria oftálmica, comunicante posterior, coróidea anterior e, como ramos terminais, as artérias cerebrais anterior e média.',
    territorio: 'Olho e órbita e a maior parte do hemisfério cerebral (porções anterior e média do encéfalo).',
    nota: 'A estenose perto da origem é causa importante de acidente vascular cerebral isquêmico e é avaliada por ultrassom com Doppler.',
  }, {
    relacionados: ['arteria_carotida_comum'],
  }),
  art('arteria_vertebral', 'Artéria vertebral', 'Arteria vertebralis', ['cabeca', 'tronco'], ['arteria_vertebral'], {
    origem: 'Primeiro ramo da artéria subclávia.',
    trajeto: 'Sobe pelos forames transversários de C6 a C1, contorna a massa lateral do atlas, entra no crânio pelo forame magno e se une à do lado oposto para formar a artéria basilar.',
    ramos: 'Ramos espinais e musculares, artérias espinais anterior e posterior e artéria cerebelar inferior posterior.',
    territorio: 'Medula espinal cervical, bulbo, cerebelo e, pela basilar, o tronco encefálico e a parte posterior do cérebro.',
    nota: 'Entra no forame transversário de C6, não de C7 (que só dá passagem à veia vertebral acessória).',
  }, {
    relacionados: ['arteria_subclavia'],
  }),
  art('arteria_subclavia', 'Artéria subclávia', 'Arteria subclavia', ['tronco', 'membro_sup'], ['arteria_subclavia'], {
    origem: 'A direita, do tronco braquiocefálico; a esquerda, do arco da aorta.',
    trajeto: 'Arqueia-se sobre a cúpula da pleura e a 1ª costela, passa entre os músculos escalenos anterior e médio, junto com o plexo braquial, e termina na margem lateral da 1ª costela, onde passa a artéria axilar.',
    ramos: 'Vertebral, torácica interna, tronco tireocervical e tronco costocervical (e, com variação, a dorsal da escápula). Só a vertebral e a torácica interna estão no modelo.',
    territorio: 'Pescoço, parte do encéfalo, parede do tórax e, por seus ramos e pela axilar, o membro superior.',
    nota: 'A artéria passa por trás do escaleno anterior e a veia subclávia, à frente dele.',
  }, {
    relacionados: ['tronco_braquiocefalico', 'arco_aorta', 'arteria_vertebral', 'arteria_toracica_interna', 'arteria_axilar', 'veia_subclavia'],
  }),
  art('arteria_toracica_interna', 'Artéria torácica interna', 'Arteria thoracica interna', T, ['arteria_toracica_interna'], {
    origem: 'Face inferior da primeira parte da artéria subclávia.',
    trajeto: 'Desce por trás das cartilagens costais, a cerca de 1 cm da margem lateral do esterno, e se divide no 6º espaço intercostal em artérias musculofrênica e epigástrica superior.',
    ramos: 'Intercostais anteriores, ramos perfurantes (para a mama), pericardicofrênica e esternais.',
    territorio: 'Parede anterior do tórax, mama, pericárdio e diafragma e parte superior da parede do abdome.',
    nota: 'É o enxerto mais usado nas pontes de revascularização do miocárdio (em geral ligada ao ramo interventricular anterior), pela boa permeabilidade a longo prazo.',
  }, {
    relacionados: ['arteria_subclavia'],
  }),

  /* ═════════════ Membro superior ═════════════ */
  art('arteria_axilar', 'Artéria axilar', 'Arteria axillaris', 'membro_sup', ['arteria_axilar'], {
    origem: 'Continuação da artéria subclávia, na margem lateral da 1ª costela.',
    trajeto: 'Atravessa a axila, por trás do peitoral menor, que a divide em três partes, até a margem inferior do redondo maior, onde passa a artéria braquial.',
    ramos: '1ª parte: torácica superior. 2ª parte: toracoacromial e torácica lateral. 3ª parte: subescapular e circunflexas umerais anterior e posterior.',
    territorio: 'Parede do tórax, ombro e, pela braquial, o restante do membro superior.',
    nota: 'Os cordões do plexo braquial envolvem a artéria. A fratura do colo cirúrgico do úmero pode lesar a circunflexa umeral posterior e o nervo axilar.',
  }, {
    relacionados: ['arteria_subclavia', 'arteria_braquial', 'veia_axilar'],
  }),
  art('arteria_braquial', 'Artéria braquial', 'Arteria brachialis', 'membro_sup', ['arteria_braquial'], {
    origem: 'Continuação da artéria axilar, na margem inferior do redondo maior.',
    trajeto: 'Desce pelo braço, medial ao úmero e ao bíceps braquial, passa pela fossa cubital sob a aponeurose do bíceps e termina ao nível do colo do rádio, dividindo-se em artérias radial e ulnar.',
    ramos: 'Braquial profunda, colaterais ulnares superior e inferior, nutrícia do úmero e ramos musculares.',
    territorio: 'Braço, cotovelo e, pelos ramos terminais, antebraço e mão.',
    nota: 'É a artéria em que se mede a pressão arterial: o pulso se palpa na fossa cubital, medial ao tendão do bíceps.',
  }, {
    relacionados: ['arteria_axilar', 'arteria_radial', 'arteria_ulnar', 'veia_braquial'],
  }),
  art('arteria_radial', 'Artéria radial', 'Arteria radialis', 'membro_sup', ['arteria_radial'], {
    origem: 'Ramo terminal menor da artéria braquial, na fossa cubital.',
    trajeto: 'Desce pelo lado lateral do antebraço, sob o braquiorradial; no punho fica entre o tendão do flexor radial do carpo e o rádio (onde se palpa o pulso), contorna o carpo e forma o arco palmar profundo.',
    ramos: 'Recorrente radial, ramos carpais, palmar superficial e, na mão, as artérias principal do polegar e radial do indicador.',
    territorio: 'Compartimentos lateral e posterior do antebraço e o lado radial da mão.',
    nota: 'O pulso radial é o mais usado na prática. O teste de Allen verifica se a ulnar sustenta a circulação da mão antes de uma punção da radial.',
  }, {
    relacionados: ['arteria_braquial', 'arteria_ulnar'],
  }),
  art('arteria_ulnar', 'Artéria ulnar', 'Arteria ulnaris', 'membro_sup', ['arteria_ulnar'], {
    origem: 'Ramo terminal maior da artéria braquial, na fossa cubital.',
    trajeto: 'Desce pelo lado medial do antebraço, profunda aos flexores, acompanha o nervo ulnar no terço distal, passa pelo canal ulnar (de Guyon) à frente do retináculo dos flexores e forma o arco palmar superficial.',
    ramos: 'Recorrente ulnar, interóssea comum (que se divide em interósseas anterior e posterior), ramos carpais e palmar profundo.',
    territorio: 'Compartimento anterior do antebraço e o lado ulnar da mão.',
    nota: 'O arco palmar superficial é formado sobretudo pela ulnar, e o profundo, pela radial; as anastomoses entre os arcos protegem a mão da isquemia.',
  }, {
    relacionados: ['arteria_braquial', 'arteria_radial'],
  }),
  vein('veia_jugular_interna', 'Veia jugular interna', 'Vena jugularis interna', ['cabeca', 'tronco'], ['veia_jugular_interna'], {
    origem: 'Continua o seio sigmóideo, no forame jugular.',
    trajeto: 'Desce pelo pescoço dentro da bainha carótica, lateral às artérias carótidas interna e comum, e se une à veia subclávia, por trás da extremidade medial da clavícula, para formar a veia braquiocefálica.',
    ramos: 'Seio petroso inferior, veias facial, lingual, faríngeas e tireóideas superior e média.',
    territorio: 'Encéfalo, face e a maior parte da cabeça e do pescoço.',
    nota: 'É acesso comum para cateteres venosos centrais, e a pulsação de suas colunas de sangue no pescoço reflete a pressão no átrio direito.',
  }, {
    relacionados: ['veia_braquiocefalica', 'arteria_carotida_comum'],
  }),
  vein('veia_subclavia', 'Veia subclávia', 'Vena subclavia', ['tronco', 'membro_sup'], ['veia_subclavia'], {
    origem: 'Continuação da veia axilar, na margem lateral da 1ª costela.',
    trajeto: 'Passa à frente do escaleno anterior (a artéria passa atrás) e sobre a 1ª costela, e se une à jugular interna para formar a veia braquiocefálica.',
    ramos: 'Em geral, a veia jugular externa; no ângulo venoso recebe o ducto torácico (à esquerda) e o ducto linfático direito.',
    territorio: 'Membro superior e parte do ombro.',
    nota: 'É via de acesso para cateteres venosos centrais; a punção pode causar pneumotórax, pela proximidade com a cúpula da pleura.',
  }, {
    relacionados: ['veia_axilar', 'veia_braquiocefalica', 'arteria_subclavia'],
  }),
  vein('veia_axilar', 'Veia axilar', 'Vena axillaris', 'membro_sup', ['veia_axilar'], {
    origem: 'União das veias braquiais com a veia basílica, na margem inferior do redondo maior.',
    trajeto: 'Sobe pela axila, medial à artéria axilar, até a margem lateral da 1ª costela, onde passa a veia subclávia.',
    ramos: 'Veia cefálica (na parte alta da axila), subescapular, torácica lateral e toracoepigástricas.',
    territorio: 'Membro superior e parede lateral do tórax.',
  }, {
    relacionados: ['veia_subclavia', 'veia_braquial', 'arteria_axilar'],
  }),
  vein('veia_braquial', 'Veias braquiais', 'Venae brachiales', 'membro_sup', ['veia_braquial'], {
    origem: 'Duas veias que acompanham a artéria braquial (veias comitantes), formadas pelas veias radiais e ulnares.',
    trajeto: 'Sobem pelo braço, uma de cada lado da artéria, e se unem à veia basílica para formar a veia axilar.',
    ramos: 'Veias musculares do braço e comunicações com a basílica.',
    territorio: 'Músculos do braço e planos profundos do antebraço.',
  }, {
    relacionados: ['veia_axilar', 'arteria_braquial'],
  }),

  /* ═════════════ Abdome e pelve ═════════════ */
  art('arteria_tronco_celiaco', 'Tronco celíaco', 'Truncus coeliacus', T, ['arteria_tronco_celiaco'], {
    origem: 'Aorta abdominal, logo abaixo do hiato aórtico, ao nível de T12.',
    trajeto: 'Tronco curto (cerca de 1 cm), que se divide em três ramos logo depois de sair da aorta.',
    ramos: 'Artérias gástrica esquerda, esplênica e hepática comum.',
    territorio: 'Intestino anterior: parte inferior do esôfago, estômago, duodeno proximal, fígado, vesícula biliar, parte do pâncreas e baço.',
    nota: 'A compressão do tronco pelo ligamento arqueado mediano do diafragma é uma causa controversa de dor abdominal pós-prandial.',
  }, {
    label: false,
    relacionados: ['aorta_abdominal'],
  }),
  art('arteria_mesenterica_superior', 'Artéria mesentérica superior', 'Arteria mesenterica superior', T, ['arteria_mesenterica_superior'], {
    origem: 'Aorta abdominal, ao nível de L1, por trás do colo do pâncreas.',
    trajeto: 'Desce por trás do colo do pâncreas, cruza à frente da terceira parte do duodeno e entra na raiz do mesentério.',
    ramos: 'Pancreaticoduodenal inferior, jejunais e ileais, ileocólica, cólica direita e cólica média.',
    territorio: 'Intestino médio: duodeno distal, jejuno, íleo, ceco, apêndice, colo ascendente e dois terços proximais do colo transverso.',
    nota: 'A oclusão por êmbolo ou trombo causa isquemia mesentérica aguda, emergência de mortalidade elevada.',
  }, {
    relacionados: ['aorta_abdominal'],
  }),
  art('arteria_mesenterica_inferior', 'Artéria mesentérica inferior', 'Arteria mesenterica inferior', T, ['arteria_mesenterica_inferior'], {
    origem: 'Aorta abdominal, ao nível de L3.',
    trajeto: 'Desce no retroperitônio, à esquerda da aorta.',
    ramos: 'Cólica esquerda, sigmóideas e retal superior.',
    territorio: 'Intestino posterior: terço distal do colo transverso, colo descendente, sigmóide e parte superior do reto.',
    nota: 'Comunica-se com a mesentérica superior pela artéria marginal do colo, que protege o intestino quando uma delas é obstruída.',
  }, {
    label: false,
    relacionados: ['aorta_abdominal'],
  }),
  art('arteria_renal', 'Artéria renal', 'Arteria renalis', T, ['arteria_renal'], {
    origem: 'Aorta abdominal, ao nível de L1–L2, logo abaixo da mesentérica superior.',
    trajeto: 'Vai lateralmente ao hilo do rim, por trás da veia renal; a direita é mais longa e passa por trás da veia cava inferior.',
    ramos: 'Suprarrenal inferior e ramos para o ureter; no hilo, os ramos segmentares do rim.',
    territorio: 'Rim, parte da glândula suprarrenal e parte proximal do ureter.',
    nota: 'Artérias renais acessórias são comuns (cerca de um quarto das pessoas); a estenose da artéria renal causa hipertensão renovascular.',
  }, {
    relacionados: ['aorta_abdominal', 'veia_renal'],
  }),
  art('arteria_iliaca_comum', 'Artéria ilíaca comum', 'Arteria iliaca communis', T, ['arteria_iliaca_comum'], {
    origem: 'Bifurcação da aorta abdominal, ao nível de L4, à esquerda da linha mediana.',
    trajeto: 'Segue para baixo e para os lados, ao longo da margem do psoas maior, e se divide, à frente da articulação sacroilíaca, nas artérias ilíacas externa e interna.',
    ramos: 'Ilíaca externa e ilíaca interna (ramos terminais).',
    territorio: 'Pelve e membro inferior, pelos seus ramos.',
    nota: 'O ureter cruza à frente da bifurcação da ilíaca comum na entrada da pelve.',
  }, {
    relacionados: ['aorta_abdominal', 'arteria_iliaca_externa', 'arteria_iliaca_interna', 'veia_iliaca_comum'],
  }),
  art('arteria_iliaca_externa', 'Artéria ilíaca externa', 'Arteria iliaca externa', ['tronco', 'membro_inf'], ['arteria_iliaca_externa'], {
    origem: 'Ramo da ilíaca comum, à frente da articulação sacroilíaca.',
    trajeto: 'Desce ao longo da margem medial do psoas maior e passa sob o ligamento inguinal, onde se torna a artéria femoral.',
    ramos: 'Epigástrica inferior e circunflexa ilíaca profunda.',
    territorio: 'Parede inferior do abdome e, pela femoral, o membro inferior.',
    nota: 'A epigástrica inferior é referência clínica: a hérnia inguinal indireta sai lateral a ela, e a direta, medial.',
  }, {
    label: false,
    relacionados: ['arteria_iliaca_comum', 'arteria_femoral', 'veia_iliaca_externa'],
  }),
  art('arteria_iliaca_interna', 'Artéria ilíaca interna', 'Arteria iliaca interna', T, ['arteria_iliaca_interna'], {
    origem: 'Ramo da ilíaca comum, à frente da articulação sacroilíaca.',
    trajeto: 'Desce para a pelve e se divide em tronco anterior e posterior, perto da margem superior do forame isquiático maior.',
    ramos: 'Tronco anterior: umbilical, vesicais, uterina (ou do ducto deferente), retal média, pudenda interna, obturatória e glútea inferior. Tronco posterior: iliolombar, sacrais laterais e glútea superior.',
    territorio: 'Vísceras pélvicas, períneo, região glútea e paredes da pelve.',
    nota: 'A ligadura da ilíaca interna é usada para controlar hemorragias pélvicas graves.',
  }, {
    label: false,
    relacionados: ['arteria_iliaca_comum', 'veia_iliaca_interna'],
  }),
  art('arteria_femoral', 'Artéria femoral', 'Arteria femoralis', 'membro_inf', ['arteria_femoral'], {
    origem: 'Continuação da artéria ilíaca externa, ao passar sob o ligamento inguinal.',
    trajeto: 'Entra no trígono femoral, onde fica lateral à veia femoral e medial ao nervo femoral, desce pelo canal dos adutores e atravessa o hiato dos adutores, passando a artéria poplítea.',
    ramos: 'Epigástrica superficial, circunflexa ilíaca superficial, pudendas externas, descendente do joelho e, o maior deles, a artéria profunda da coxa.',
    territorio: 'Parede inferior do abdome, genitais externos e todo o membro inferior.',
    nota: 'O pulso femoral se palpa abaixo do ligamento inguinal, no ponto médio entre a espinha ilíaca anterossuperior e a sínfise púbica; é a via de acesso do cateterismo cardíaco.',
  }, {
    relacionados: ['arteria_iliaca_externa', 'veia_femoral'],
  }),
  vein('veia_iliaca_comum', 'Veia ilíaca comum', 'Vena iliaca communis', T, ['veia_iliaca_comum'], {
    origem: 'União das veias ilíacas externa e interna, à frente da articulação sacroilíaca.',
    trajeto: 'As duas ilíacas comuns se unem ao nível de L5, à direita da linha mediana, para formar a veia cava inferior; a esquerda é mais longa e passa por trás da artéria ilíaca comum direita.',
    ramos: 'Veias ilíacas externa e interna e as veias iliolombar e sacral mediana.',
    territorio: 'Pelve e membro inferior.',
    nota: 'A compressão da veia ilíaca comum esquerda pela artéria ilíaca comum direita (síndrome de May-Thurner) predispõe à trombose venosa profunda do membro inferior esquerdo.',
  }, {
    relacionados: ['veia_cava_inferior', 'veia_iliaca_externa', 'veia_iliaca_interna', 'arteria_iliaca_comum'],
  }),
  vein('veia_iliaca_externa', 'Veia ilíaca externa', 'Vena iliaca externa', ['tronco', 'membro_inf'], ['veia_iliaca_externa'], {
    origem: 'Continuação da veia femoral, ao passar sob o ligamento inguinal.',
    trajeto: 'Sobe ao lado da artéria ilíaca externa, medial a ela, e se une à veia ilíaca interna para formar a ilíaca comum.',
    ramos: 'Veias epigástrica inferior e circunflexa ilíaca profunda.',
    territorio: 'Membro inferior e parede inferior do abdome.',
  }, {
    label: false,
    relacionados: ['veia_femoral', 'veia_iliaca_comum', 'arteria_iliaca_externa'],
  }),
  vein('veia_iliaca_interna', 'Veia ilíaca interna', 'Vena iliaca interna', T, ['veia_iliaca_interna'], {
    origem: 'Formada na pelve pelas veias que acompanham os ramos da artéria ilíaca interna.',
    trajeto: 'Sobe pela parede lateral da pelve e se une à ilíaca externa para formar a ilíaca comum.',
    ramos: 'Veias glúteas, pudenda interna, obturatória, sacrais laterais, retal média, vesicais e, na mulher, uterinas e vaginais, ligadas aos plexos venosos da pelve.',
    territorio: 'Vísceras pélvicas, períneo e região glútea.',
  }, {
    label: false,
    relacionados: ['veia_iliaca_comum', 'arteria_iliaca_interna'],
  }),
  vein('veia_femoral', 'Veia femoral', 'Vena femoralis', 'membro_inf', ['veia_femoral'], {
    origem: 'Continuação da veia poplítea, no hiato dos adutores.',
    trajeto: 'Sobe pela coxa, medial à artéria femoral no trígono femoral, e passa a veia ilíaca externa ao passar sob o ligamento inguinal.',
    ramos: 'Veia safena magna (no hiato safeno) e veia profunda da coxa.',
    territorio: 'Membro inferior.',
    nota: 'No trígono femoral, de lateral para medial: nervo, artéria, veia e canal femoral (mnemônico NAVEL, com os linfáticos). A trombose venosa profunda costuma acometer essa veia.',
  }, {
    relacionados: ['veia_iliaca_externa', 'arteria_femoral'],
  }),
  vein('veia_renal', 'Veia renal', 'Vena renalis', T, ['veia_renal'], {
    origem: 'Formada no hilo do rim pela confluência das veias segmentares; passa à frente da artéria renal.',
    trajeto: 'Vai à veia cava inferior ao nível de L1–L2. A esquerda é bem mais longa que a direita e cruza à frente da aorta, logo abaixo da origem da mesentérica superior.',
    ramos: 'A veia renal esquerda recebe as veias suprarrenal esquerda e gonadal esquerda.',
    territorio: 'Rim, e, à esquerda, também a glândula suprarrenal e a gônada.',
    nota: 'A compressão da veia renal esquerda entre a aorta e a artéria mesentérica superior é a síndrome do quebra-nozes.',
  }, {
    relacionados: ['veia_cava_inferior', 'arteria_renal'],
  }),
];
