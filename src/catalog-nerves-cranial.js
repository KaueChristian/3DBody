/**
 * Nervos cranianos e autônomos da cabeça e do pescoço que faltavam (F2.9 a F2.11): olfatório, vestibulococlear,
 * glossofaríngeo, vago e seus ramos, ramos de V e VII, gânglios autônomos e tronco simpático cervical.
 * Mesma convenção de catalog-nerves.js (lado esquerdo, x > 0; o direito é espelhado).
 *
 * Fontes: Moore, Dalley & Agur — Anatomia orientada para a clínica (8ª ed.); Gray's Anatomy (42ª ed.);
 * Netter — Atlas de anatomia humana (7ª ed.); Terminologia Anatômica (FIPAT, 2019).
 * Os pontos foram medidos no próprio modelo; trechos dentro de osso (canais, forames) são intraósseos de verdade.
 */
import { nervo, SK } from './catalog-nerves.js';

export const NERVES_CRANIAL = [
  /* ═════════════════════ F2.9 Pares cranianos ═════════════════════ */
  nervo('n_olfatorio', 'Nervo olfatório (I)', 'N. olfactorius', 'cabeca', {
    paths: [
      // bulbo olfatório (sobre a lâmina crivosa) e trato olfatório (para trás, sob o lobo frontal)
      { pts: [[0.12, -0.095, 0.69], [0.12, -0.095, 0.6]], r: 0.017 },
      { pts: [[0.12, -0.095, 0.6], [0.125, -0.09, 0.52], [0.13, -0.085, 0.45]], r: 0.007 },
      // filetes olfatórios: atravessam a lâmina crivosa e chegam à mucosa do teto da cavidade nasal
      { pts: [[0.12, -0.112, 0.66], [0.11, -0.2, 0.665], [0.1, -0.29, 0.67]], r: 0.0022 },
      { pts: [[0.115, -0.112, 0.62], [0.105, -0.2, 0.625], [0.09, -0.29, 0.63]], r: 0.0022 },
      { pts: [[0.125, -0.112, 0.68], [0.115, -0.2, 0.685], [0.12, -0.3, 0.7]], r: 0.0022 },
      { pts: [[0.12, -0.11, 0.58], [0.11, -0.2, 0.585], [0.08, -0.28, 0.59]], r: 0.0022 },
    ],
  }, {
    origem: 'Células receptoras (neurônios sensoriais olfatórios) da mucosa olfatória, no teto da cavidade nasal (concha nasal superior e parte alta do septo).',
    trajeto: 'Cerca de vinte filetes de cada lado atravessam a lâmina crivosa do etmoide e fazem sinapse no bulbo olfatório, na face inferior do lobo frontal. Do bulbo, o trato olfatório segue para trás e se divide nas estrias olfatórias medial e lateral.',
    sensibilidade: 'Olfato (aferência visceral especial). Não inerva músculos. A via olfatória é a única via sensorial que chega ao córtex sem relé obrigatório no tálamo.',
    lesao: 'Anosmia, unilateral ou bilateral. Traumatismo craniano (os filetes se rompem na lâmina crivosa com o movimento do encéfalo), fratura da lâmina crivosa (com risco de rinorreia de líquor), meningioma do sulco olfatório e infecções virais — a COVID-19 causou anosmia transitória em muitos casos.',
    nota: 'O bulbo, o trato e os filetes são desenhados de forma esquemática (o modelo não tem o encéfalo). A lâmina crivosa fica no teto da cavidade nasal, entre as órbitas.',
  }),
  nervo('n_vestibulococlear', 'Nervo vestibulococlear (VIII)', 'N. vestibulocochlearis', 'cabeca', {
    paths: [
      // do sulco bulbopontino ao fundo do meato acústico interno
      { pts: [[0.04, -0.32, -0.12], [0.09, -0.34, -0.1], [0.17, -0.325, -0.085]], r: 0.0105 },
      // parte coclear (anterior, para a cóclea) e parte vestibular (posterior, para o vestíbulo e os canais semicirculares)
      { pts: [[0.17, -0.325, -0.085], [0.21, -0.335, -0.06], [0.245, -0.34, -0.035]], r: 0.0065 },
      { pts: [[0.17, -0.325, -0.085], [0.21, -0.31, -0.095], [0.245, -0.3, -0.105]], r: 0.0065 },
    ],
  }, {
    origem: 'Parte coclear: gânglio espiral da cóclea (audição). Parte vestibular: gânglio vestibular (equilíbrio). Entram no tronco encefálico no sulco bulbopontino, lateralmente ao facial.',
    trajeto: 'As duas partes seguem juntas, unidas ao facial e ao nervo intermédio, pelo ângulo pontocerebelar e pelo meato acústico interno, até o fundo do meato. Ali se separam: a parte coclear vai à cóclea e a vestibular, ao utrículo, ao sáculo e às ampolas dos canais semicirculares.',
    ramos: 'Parte coclear (da cóclea aos núcleos cocleares) e parte vestibular (do labirinto vestibular aos núcleos vestibulares e ao cerebelo).',
    sensibilidade: 'Audição e equilíbrio (aferência somática especial). Não inerva músculos.',
    lesao: 'Perda auditiva neurossensorial, zumbido (tinnitus), vertigem e nistagmo. O schwannoma do vestibular (“neuroma do acústico”) nasce no meato acústico interno e comprime também o facial, no ângulo pontocerebelar. A ototoxicidade (aminoglicosídeos, cisplatina) lesa as células ciliadas.',
    nota: 'O ouvido interno (cóclea, vestíbulo, canais semicirculares) não está no modelo: o nervo termina no fundo do meato acústico interno, dentro do temporal. Os trechos desenhados ficam, de fato, dentro do osso.',
  }),
  nervo('n_glossofaringeo', 'Nervo glossofaríngeo (IX)', 'N. glossopharyngeus', 'cabeca', {
    paths: [
      { pts: [[0.11, -0.45, -0.12], [0.18, -0.56, -0.04], [0.25, -0.67, 0.07], [0.27, -0.76, 0.14], [0.24, -0.83, 0.23], [0.2, -0.85, 0.31], [0.155, -0.835, 0.4]], r: 0.0065 },
      // ramo para o estilofaríngeo
      { pts: [[0.25, -0.67, 0.07], [0.27, -0.73, 0.08]], r: 0.0035 },
      // ramo do seio carótico
      { pts: [[0.27, -0.76, 0.14], [0.3, -0.9, 0.14], [0.3, -1.0, 0.13]], r: 0.0025 },
    ],
    ramos: [{ m: 'estilofaringeo', obs: 'única inervação motora', path: 1 }],
  }, {
    origem: 'Núcleos do bulbo (ambíguo, salivatório inferior, do trato solitário e do trato espinal do trigêmeo). Emerge do sulco retro-olivar, acima do vago.',
    trajeto: 'Sai do crânio pelo forame jugular, com o vago e o acessório, passa entre a artéria carótida interna e a veia jugular interna, contorna o estilofaríngeo (que inerva) e segue entre os constritores superior e médio da faringe até a base da língua e a tonsila palatina.',
    ramos: 'Nervo timpânico (de Jacobson), que forma o plexo timpânico e, pelo nervo petroso menor, leva fibras parassimpáticas ao gânglio ótico e à parótida; ramo do seio carótico; ramos faríngeos (sensitivos); ramo para o estilofaríngeo; ramos tonsilares e linguais.',
    sensibilidade: 'Sensibilidade geral e paladar do terço posterior da língua; mucosa da orofaringe, da tonsila palatina, da tuba auditiva e da cavidade timpânica; quimiorreceptores e barorreceptores (corpo e seio carótico).',
    lesao: 'Perda do reflexo do vômito (aferência IX, eferência X) e da sensibilidade e do paladar do terço posterior da língua. Neuralgia do glossofaríngeo: dor em choque na garganta e no ouvido, desencadeada por deglutir ou falar. É lesado junto com o vago e o acessório no forame jugular (síndrome do forame jugular).',
    nota: 'É a única inervação motora do estilofaríngeo. A parótida recebe fibras parassimpáticas dele, que fazem relé no gânglio ótico.',
  }),
  nervo('n_vago', 'Nervo vago (X)', 'N. vagus', ['cabeca', 'tronco'], {
    paths: [
      // gânglio superior (no forame jugular) e inferior (logo abaixo)
      { pts: [[0.12, -0.46, -0.12], [0.16, -0.54, -0.07]], r: 0.0085 },
      { pts: [[0.16, -0.54, -0.07], [0.19, -0.63, -0.03]], r: 0.0105 },
      // tronco cervical (bainha carótica) até a abertura superior do tórax e o mediastino superior, atrás da raiz do pulmão
      { pts: [[0.19, -0.63, -0.03], [0.22, -0.74, 0.0], [0.245, -0.95, 0.03], [0.255, -1.2, 0.06], [0.245, -1.5, 0.085], [0.225, -1.78, 0.1], [0.215, -2.05, 0.11], [0.22, -2.3, 0.12], [0.2, -2.55, 0.1], [0.17, -2.8, 0.03]], r: 0.0075 },
    ],
    labelAt: 0.4,
  }, {
    origem: 'Núcleos do bulbo (ambíguo, motor dorsal do vago e do trato solitário). Emerge do sulco retro-olivar, abaixo do glossofaríngeo, por 8 a 10 radículas.',
    trajeto: 'Sai pelo forame jugular, com dois gânglios (superior, no forame, e inferior, logo abaixo). Desce no pescoço dentro da bainha carótica, entre a veia jugular interna (lateral) e a artéria carótida (medial). Entra no tórax pela abertura superior, atrás da articulação esternoclavicular, e continua no mediastino, atrás da raiz do pulmão, até o plexo esofágico e o abdome. Aqui o trajeto vai só até a altura de T4–T5.',
    ramos: 'No pescoço: ramos meníngeo e auricular, ramos faríngeos (plexo faríngeo), nervo laríngeo superior, ramos para o seio e o corpo carótico e ramos cardíacos cervicais. No tórax: nervo laríngeo recorrente, ramos cardíacos, pulmonares e esofágicos. No abdome: troncos vagais anterior e posterior. Os que têm músculos para inervar têm fichas próprias.',
    sensibilidade: 'Meato acústico externo e parte da membrana timpânica (ramo auricular), faringe, laringe e vísceras do tórax e do abdome; paladar da epiglote. Fibras parassimpáticas para o coração, os pulmões e o tubo digestório até a flexura esquerda do colo.',
    lesao: 'Paralisia unilateral: rouquidão, disfagia e voz nasal; o palato mole do lado afetado não sobe e a úvula desvia para o lado são ao dizer “aaa”. Lesão bilateral alta é grave (arritmia e perda da proteção das vias aéreas). A estimulação vagal causa bradicardia e síncope vasovagal.',
    nota: 'É o nervo craniano mais longo. Na lesão do núcleo ambíguo (síndrome bulbar lateral, ou de Wallenberg) os músculos da faringe e da laringe ficam paralisados. O modelo mostra só o trajeto cervical e o mediastino superior: o restante exige as vísceras.',
  }),
  nervo('n_plexo_faringeo', 'Plexo faríngeo (ramos faríngeos do vago)', 'Plexus pharyngeus; rami pharyngei n. vagi', 'cabeca', {
    paths: [
      { pts: [[0.19, -0.64, -0.03], [0.17, -0.7, 0.07], [0.12, -0.77, 0.13], [0.06, -0.83, 0.14]], r: 0.005 },
    ],
    ramos: [
      { m: 'constritor_faringe_sup' }, { m: 'constritor_faringe_med' }, { m: 'constritor_faringe_inf', obs: 'também ramos do laríngeo recorrente e do externo' },
      { m: 'levantador_veu' }, { m: 'musculo_uvula' }, { m: 'palatofaringeo' }, { m: 'salpingofaringeo' }, { m: 'palatoglosso' },
    ],
  }, {
    origem: 'Ramos faríngeos do nervo vago (X), com fibras motoras da raiz craniana do acessório (XI) e ramos sensitivos do glossofaríngeo (IX).',
    trajeto: 'Saem do gânglio inferior do vago, passam entre as artérias carótidas interna e externa e formam um plexo sobre a face externa do constritor médio, de onde se distribuem aos constritores da faringe, aos músculos do palato mole (menos o tensor do véu) e ao palatoglosso.',
    ramos: 'Constritores superior, médio e inferior; levantador do véu palatino; músculo da úvula; palatofaríngeo; salpingofaríngeo; palatoglosso.',
    sensibilidade: 'Mucosa da faringe (pelo glossofaríngeo, em grande parte).',
    lesao: 'Disfagia, regurgitação nasal de líquidos, voz hipernasal e desvio da úvula. Lesões da base do crânio (forame jugular) e do bulbo (síndrome de Wallenberg, que atinge o núcleo ambíguo) comprometem a inervação.',
    nota: 'As fibras motoras da “raiz craniana do acessório” juntam-se ao vago logo abaixo do forame jugular e saem pelos ramos faríngeos: por isso muitos textos atribuem estes músculos ao vago, e outros ao acessório craniano. Segue-se Moore: vago, com fibras da raiz craniana do XI. O estilofaríngeo é inervado pelo IX e o tensor do véu palatino, pelo V3. Os ramos são desenhados de forma esquemática.',
  }),
  nervo('n_laringeo_superior', 'Nervo laríngeo superior (ramos interno e externo)', 'N. laryngeus superior; rr. internus et externus', 'cabeca', {
    paths: [
      { pts: [[0.215, -0.72, 0.0], [0.2, -0.85, 0.1], [0.17, -0.99, 0.17]], r: 0.0055 },
      // ramo interno: perfura a membrana tíreo-hióidea (sensitivo)
      { pts: [[0.17, -0.99, 0.17], [0.13, -1.1, 0.2], [0.1, -1.17, 0.2]], r: 0.0045 },
      // ramo externo: desce com a artéria tireóidea superior até o cricotireóideo
      { pts: [[0.17, -0.99, 0.17], [0.155, -1.2, 0.215], [0.125, -1.33, 0.225]], r: 0.0045 },
    ],
    ramos: [{ m: 'cricotireoideo', obs: 'ramo externo', path: 2 }, { m: 'constritor_faringe_inf', obs: 'ramo externo', path: 2, t: [0.3, 1] }],
  }, {
    origem: 'Nervo vago (X), no gânglio inferior.',
    trajeto: 'Desce medialmente atrás da artéria carótida interna até o nível do corno maior do hioide, onde se divide. O ramo interno (sensitivo) perfura a membrana tíreo-hióidea com a artéria laríngea superior e o ramo externo (motor) desce junto à artéria tireóidea superior, sobre o constritor inferior da faringe, até o cricotireóideo.',
    ramos: 'Ramo interno: sensibilidade da laringe acima das pregas vocais. Ramo externo: cricotireóideo e parte do constritor inferior da faringe.',
    sensibilidade: 'Mucosa da laringe acima das pregas vocais (vestíbulo), da epiglote e da base da língua (paladar).',
    lesao: 'A lesão do ramo externo (ligadura da artéria tireóidea superior, tireoidectomia) enfraquece o cricotireóideo: a voz perde os tons agudos e cansa depressa, sem rouquidão marcada. Lesão do ramo interno: perde-se a sensibilidade acima das pregas, com risco de aspiração sem tosse.',
    nota: 'O ramo interno é a via aferente do reflexo da tosse laríngea. O ramo externo é por vezes chamado “nervo do cantor”, pois controla o tom.',
  }),
  nervo('n_laringeo_recorrente', 'Nervo laríngeo recorrente', 'N. laryngeus recurrens', ['cabeca', 'tronco'], {
    paths: [
      // alça: sai do vago abaixo do arco da aorta (à esquerda), contorna-o e sobe no sulco traqueoesofágico
      { pts: [[0.2, -2.55, 0.1], [0.155, -2.7, 0.085], [0.11, -2.55, 0.065], [0.09, -2.25, 0.06], [0.085, -1.95, 0.055], [0.08, -1.7, 0.05], [0.075, -1.55, 0.05], [0.07, -1.45, 0.06], [0.065, -1.39, 0.085]], r: 0.005 },
    ],
    ramos: [
      { m: 'cricoaritenoideo_post' }, { m: 'cricoaritenoideo_lat' }, { m: 'aritenoideo_transverso' }, { m: 'aritenoideo_obliquo' },
      { m: 'tireoaritenoideo' }, { m: 'vocal' }, { m: 'constritor_faringe_inf', obs: 'parte cricofaríngea' },
    ],
  }, {
    origem: 'Nervo vago (X). À direita, a alça passa sob a artéria subclávia; à esquerda, sob o arco da aorta, junto ao ligamento arterial.',
    trajeto: 'Sobe no sulco entre a traqueia e o esôfago, atrás do lobo da tireoide (com a artéria tireóidea inferior) e entra na laringe sob a margem inferior do constritor inferior da faringe, atrás da articulação cricotireóidea, como nervo laríngeo inferior.',
    ramos: 'Ramos para o esôfago e a traqueia, ramos faríngeos e os ramos laríngeos para todos os músculos intrínsecos da laringe, exceto o cricotireóideo.',
    sensibilidade: 'Mucosa da laringe abaixo das pregas vocais; parte superior da traqueia e do esôfago.',
    lesao: 'Paralisia da prega vocal do mesmo lado: rouquidão, voz soprosa e tosse fraca; a prega fica em posição paramediana. É lesado na tireoidectomia, em tumores do ápice do pulmão, em aneurismas da aorta (esquerda), na dilatação do átrio esquerdo e em tumores do mediastino. A lesão bilateral causa estridor e dispneia.',
    nota: 'O nervo esquerdo, mais longo e com alça mais baixa, é atingido por mais doenças torácicas. O desenho é aproximado: o modelo ainda não tem a aorta nem a subclávia, e o lado direito é o espelho do esquerdo (na realidade a alça direita é mais alta, sob a subclávia).',
  }),

  /* ═════════════════════ F2.10 Ramos de V e VII ═════════════════════ */
  nervo('n_frontal', 'Nervo frontal (V1) e nervos supraorbital e supratroclear', 'N. frontalis; N. supraorbitalis; N. supratrochlearis', 'cabeca', {
    parts: [{ id: 'n_frontal', mat: 'nerve' }],
  }, {
    origem: 'Maior ramo do nervo oftálmico (V1). Entra na órbita pela fissura orbital superior, por fora do anel tendíneo comum.',
    trajeto: 'Corre sobre o levantador da pálpebra superior, sob o teto da órbita, e se divide, no meio da órbita, em nervo supraorbital (lateral, maior) e nervo supratroclear (medial). O supraorbital sai pela incisura (ou forame) supraorbital e sobe pela fronte até o vértice; o supratroclear contorna o rebordo supraorbital medial, perto da tróclea.',
    ramos: 'Supraorbital: ramos medial e lateral para a fronte, o couro cabeludo, a pálpebra superior e o seio frontal. Supratroclear: pele da raiz do nariz, da parte medial da fronte e da pálpebra superior.',
    sensibilidade: 'Fronte, couro cabeludo até o vértice, pálpebra superior com a conjuntiva e seio frontal.',
    lesao: 'Neuralgia supraorbital: dor em ponto sobre a incisura (por exemplo, por óculos de natação). O herpes-zóster oftálmico causa vesículas na fronte e no couro cabeludo. A dormência da fronte após trauma frontal indica lesão do supraorbital.',
    nota: 'Não inerva músculos: os músculos da testa e da sobrancelha recebem o facial. O frontal e seus ramos são malha real do BodyParts3D (a fronte e a órbita).',
  }),
  nervo('n_lacrimal', 'Nervo lacrimal (V1)', 'N. lacrimalis', 'cabeca', {
    parts: [{ id: 'n_lacrimal', mat: 'nerve' }],
  }, {
    origem: 'Menor ramo do nervo oftálmico (V1). Entra na órbita pela fissura orbital superior, por fora do anel tendíneo comum.',
    trajeto: 'Segue pela parede lateral da órbita, junto à margem superior do reto lateral, até a glândula lacrimal e a parte lateral da pálpebra superior. Recebe um ramo comunicante do zigomático (V2), que lhe leva as fibras parassimpáticas secretomotoras vindas do gânglio pterigopalatino.',
    sensibilidade: 'Glândula lacrimal, conjuntiva e pele da parte lateral da pálpebra superior.',
    lesao: 'Dormência da pálpebra superior lateral. A via secretomotora da glândula (facial → petroso maior → gânglio pterigopalatino → zigomático → lacrimal) explica o olho seco que acompanha as lesões do facial proximais ao gânglio geniculado.',
    nota: 'Não inerva músculos. A glândula lacrimal ainda não está no modelo.',
  }),
  nervo('n_nasociliar', 'Nervo nasociliar (V1) e seus ramos', 'N. nasociliaris', 'cabeca', {
    parts: [{ id: 'n_nasociliar', mat: 'nerve' }],
    ramos: [{ m: 'dilatador_pupila', obs: 'fibras simpáticas, pelos nervos ciliares longos', semRamo: true }],
  }, {
    origem: 'Ramo do nervo oftálmico (V1). Entra na órbita pelo anel tendíneo comum, entre as duas divisões do oculomotor.',
    trajeto: 'Cruza sobre o nervo óptico, corre sob o reto superior pela parede medial da órbita e termina como nervo etmoidal anterior e nervo infratroclear. O etmoidal anterior entra no crânio pelo forame etmoidal anterior, desce pela lâmina crivosa até a cavidade nasal e dá o ramo nasal externo.',
    ramos: 'Raiz sensitiva do gânglio ciliar (ramo comunicante), nervos ciliares longos, etmoidal posterior, etmoidal anterior (com o ramo nasal externo) e infratroclear.',
    sensibilidade: 'Córnea, corpo ciliar e íris; seios etmoidais e esfenoidal; parte anterior da cavidade nasal; dorso e ponta do nariz (ramo nasal externo); raiz do nariz e ângulo medial das pálpebras (infratroclear).',
    lesao: 'É a via aferente do reflexo corneano: sua lesão, ou a do V1, abole o reflexo e deixa a córnea vulnerável. Sinal de Hutchinson: vesículas de herpes-zóster na ponta do nariz indicam comprometimento do ramo nasal externo e risco de envolvimento do olho.',
    nota: 'Os ciliares longos levam, além da sensibilidade, as fibras simpáticas do dilatador da pupila. Não inerva músculos esqueléticos.',
  }),
  nervo('n_zigomatico', 'Nervo zigomático (V2)', 'N. zygomaticus', 'cabeca', {
    superficial: true,
    paths: [
      // da fossa pterigopalatina, pela fissura orbital inferior e pela parede lateral da órbita
      { pts: [[0.24, -0.31, 0.35], [0.26, -0.27, 0.43], [0.34, -0.2, 0.52], [0.4, -0.15, 0.6]], r: 0.0045 },
      // zigomaticofacial: atravessa o osso zigomático até a pele da bochecha
      { pts: [[0.4, -0.15, 0.6], [0.47, -0.2, 0.67], SK([0.53, -0.27, 0.72], -0.03)], r: 0.003 },
      // zigomaticotemporal: pela parede lateral até a pele da têmpora anterior
      { pts: [[0.4, -0.15, 0.6], [0.5, -0.1, 0.5], SK([0.62, -0.06, 0.4], -0.03)], r: 0.003 },
    ],
  }, {
    origem: 'Ramo do nervo maxilar (V2), na fossa pterigopalatina.',
    trajeto: 'Entra na órbita pela fissura orbital inferior, corre pela parede lateral e se divide nos ramos zigomaticofacial e zigomaticotemporal, que atravessam o osso zigomático e chegam à pele da bochecha e da têmpora. Leva ao nervo lacrimal as fibras parassimpáticas pós-ganglionares do gânglio pterigopalatino para a glândula lacrimal.',
    sensibilidade: 'Pele da proeminência malar (zigomaticofacial) e da região temporal anterior (zigomaticotemporal).',
    lesao: 'Fraturas do zigomático (“do tripé”) podem lesar o zigomático e o infraorbital: dormência da bochecha. A comunicação com o lacrimal ajuda a explicar o lacrimejamento reflexo.',
    nota: 'Não inerva músculos. Leva a via secretomotora da glândula lacrimal (facial → petroso maior → gânglio pterigopalatino → zigomático → lacrimal).',
  }),
  nervo('n_palatinos', 'Nervos palatinos maior e menores (V2)', 'N. palatinus major; Nn. palatini minores', 'cabeca', {
    paths: [
      // palatino maior: canal palatino maior → forame palatino maior → palato duro, para a frente
      { pts: [[0.25, -0.33, 0.36], [0.235, -0.43, 0.39], [0.215, -0.54, 0.42], [0.2, -0.575, 0.44], [0.16, -0.58, 0.58], [0.1, -0.58, 0.72], [0.06, -0.575, 0.84]], r: 0.0035 },
      // palatinos menores: palato mole e tonsila
      { pts: [[0.235, -0.43, 0.38], [0.2, -0.56, 0.38], [0.15, -0.62, 0.32], [0.1, -0.63, 0.26]], r: 0.0025 },
    ],
  }, {
    origem: 'Ramos do nervo maxilar (V2) que atravessam o gânglio pterigopalatino, na fossa pterigopalatina (as fibras sensitivas não fazem relé).',
    trajeto: 'Descem pelo canal palatino maior. O nervo palatino maior sai pelo forame palatino maior, junto ao 3º molar superior, e corre para a frente no palato duro; os palatinos menores saem pelos forames menores e vão ao palato mole e à tonsila.',
    ramos: 'Palatino maior: mucosa e gengiva do palato duro (até o canino). Palatinos menores: palato mole, úvula e tonsila. Levam também fibras parassimpáticas (do VII) para as glândulas do palato.',
    sensibilidade: 'Mucosa do palato duro e do palato mole.',
    lesao: 'O bloqueio do palatino maior, no forame, anestesia a mucosa do palato posterior em procedimentos odontológicos; pode causar sensação de engasgo se o anestésico atingir os palatinos menores.',
    nota: 'Não inervam músculos: a inervação motora do palato mole é o plexo faríngeo (e o V3, para o tensor do véu).',
  }),
  nervo('n_nasopalatino', 'Nervo nasopalatino (V2)', 'N. nasopalatinus', 'cabeca', {
    paths: [{ pts: [[0.25, -0.32, 0.36], [0.17, -0.31, 0.4], [0.06, -0.34, 0.5], [0.03, -0.4, 0.68], [0.02, -0.48, 0.84], [0.01, -0.55, 0.92]], r: 0.0035 }],
  }, {
    origem: 'Ramo do nervo maxilar (V2), pelo gânglio pterigopalatino, na fossa pterigopalatina.',
    trajeto: 'Entra na cavidade nasal pelo forame esfenopalatino, cruza o teto da cavidade e desce obliquamente para a frente no septo nasal, entre a mucosa e o vômer, até o canal incisivo, atrás dos incisivos superiores, onde se anastomosa com o palatino maior.',
    sensibilidade: 'Septo nasal e mucosa do palato duro anterior (atrás dos incisivos superiores).',
    lesao: 'É bloqueado na papila incisiva para anestesiar o palato anterior. Pode ser lesado em cirurgias do septo e em fraturas da face.',
    nota: 'Cruza o teto da cavidade nasal e acompanha o septo, por isso é chamado de “nervo do septo”. Não inerva músculos.',
  }),
  nervo('n_corda_timpano', 'Corda do tímpano', 'Chorda tympani', 'cabeca', {
    paths: [{ pts: [[0.33, -0.34, -0.085], [0.36, -0.315, -0.05], [0.395, -0.3, -0.015], [0.375, -0.325, 0.065], [0.33, -0.4, 0.12], [0.29, -0.465, 0.195]], r: 0.0035 }],
    ramos: [{ m: 'submandibular', obs: 'secretomotor, via gânglio submandibular' }, { m: 'sublingual', obs: 'secretomotor, via gânglio submandibular' }],
  }, {
    origem: 'Nervo facial (VII), na parte descendente do canal do facial, cerca de 6 mm acima do forame estilomastóideo.',
    trajeto: 'Sobe por um canalículo e entra na cavidade timpânica, onde cruza a face medial da membrana timpânica, entre o martelo e a bigorna, e sai pela fissura petrotimpânica (de Glaser). Na fossa infratemporal junta-se ao nervo lingual, que a conduz à língua e ao gânglio submandibular.',
    sensibilidade: 'Paladar dos dois terços anteriores da língua (aferência visceral especial) e fibras parassimpáticas pré-ganglionares para as glândulas submandibular e sublingual, com relé no gânglio submandibular.',
    lesao: 'Perda do paladar nos 2/3 anteriores da língua e menor salivação do mesmo lado. Pode ser lesada em otite média, em cirurgia da orelha e, junto com o lingual, na extração do 3º molar inferior.',
    nota: 'Explica por que a paralisia do facial dentro do osso, acima da origem da corda, também altera o paladar. Não inerva músculos. O modelo não tem a membrana timpânica: o trecho no ouvido médio é aproximado.',
  }, { label: false }),
  nervo('n_petroso_maior', 'Nervo petroso maior', 'N. petrosus major', 'cabeca', {
    paths: [{ pts: [[0.28, -0.275, -0.03], [0.268, -0.19, -0.02], [0.255, -0.195, 0.04], [0.235, -0.235, 0.12], [0.215, -0.205, 0.22], [0.215, -0.26, 0.31], [0.235, -0.3, 0.335]], r: 0.0035 }],
  }, {
    origem: 'Nervo facial (VII), no gânglio geniculado, no joelho do canal do facial.',
    trajeto: 'Sai pelo hiato do canal do nervo petroso maior e corre no sulco da face anterior da parte petrosa do temporal, sob o gânglio trigeminal, até o forame lacerado. Une-se ao nervo petroso profundo (simpático, do plexo carótico) e forma o nervo do canal pterigóideo, que chega ao gânglio pterigopalatino.',
    sensibilidade: 'Fibras parassimpáticas pré-ganglionares (secretomotoras) para a glândula lacrimal, as glândulas da mucosa nasal e as do palato; algumas fibras de paladar do palato mole.',
    lesao: 'Lesão do facial acima do gânglio geniculado: além da paralisia facial, olho seco (menos lágrima). A regeneração aberrante após paralisia produz a “síndrome da lágrima de crocodilo”: lacrimejar ao comer.',
    nota: 'Não inerva músculos. A glândula lacrimal ainda não está no modelo.',
  }, { label: false }),
  nervo('n_estapedio', 'Nervo para o estapédio', 'N. stapedius', 'cabeca', {
    paths: [{ pts: [[0.345, -0.295, -0.115], [0.36, -0.285, -0.095], [0.37, -0.275, -0.078]], r: 0.0028 }],
    ramos: [{ m: 'estapedio', semRamo: true }],
  }, {
    origem: 'Nervo facial (VII), na parte descendente (mastóidea) do canal do facial, junto à eminência piramidal.',
    trajeto: 'Ramo curto, que sai do facial no canal e entra no ventre do estapédio pelo ápice da eminência piramidal.',
    lesao: 'A lesão do facial acima da origem do nervo (paralisia de Bell, tumor) abole o reflexo estapédico e causa hiperacusia: os sons parecem excessivamente altos, pois o estribo vibra livremente.',
    nota: 'É o menor nervo motor do corpo, e seu músculo é o menor músculo esquelético. Trecho intraósseo e aproximado.',
  }, { label: false }),
  nervo('n_tensores', 'Nervos do tensor do véu palatino e do tensor do tímpano (V3)', 'N. musculi tensoris veli palatini; N. musculi tensoris tympani', 'cabeca', {
    paths: [
      // do nervo para o pterigóideo medial, pelo gânglio ótico (sem relé), ao tensor do véu palatino
      { pts: [[0.25, -0.47, 0.215], [0.235, -0.46, 0.24], [0.205, -0.45, 0.27]], r: 0.003 },
      // ao tensor do tímpano, que está no canal musculotubário (acima da tuba auditiva)
      { pts: [[0.25, -0.465, 0.215], [0.255, -0.42, 0.18], [0.27, -0.37, 0.15], [0.285, -0.335, 0.125]], r: 0.003 },
    ],
    ramos: [{ m: 'tensor_veu', semRamo: true }, { m: 'tensor_timpano', semRamo: true }],
  }, {
    origem: 'Ramos do nervo para o pterigóideo medial, tronco do nervo mandibular (V3).',
    trajeto: 'Atravessam o gânglio ótico sem fazer relé. O nervo do tensor do véu palatino acompanha o músculo; o do tensor do tímpano entra no canal musculotubário, acima da tuba auditiva, até o músculo.',
    lesao: 'Lesão rara. A falha do tensor do véu palatino impede a abertura adequada da tuba auditiva, com acúmulo de líquido no ouvido médio (otite serosa), como ocorre na fenda palatina.',
    nota: 'Os dois músculos derivam do 1º arco faríngeo e por isso são inervados pelo V3; os demais músculos do palato recebem o plexo faríngeo e o estapédio, o facial.',
  }, { label: false }),

  /* ═════════════════════ F2.11 Gânglios autônomos e tronco simpático cervical ═════════════════════ */
  nervo('g_pterigopalatino', 'Gânglio pterigopalatino', 'Ganglion pterygopalatinum', 'cabeca', {
    paths: [{ pts: [[0.235, -0.3, 0.33], [0.25, -0.33, 0.365]], r: 0.0165 }],
  }, {
    origem: 'Parassimpático: nervo petroso maior (VII), pelo nervo do canal pterigóideo. Simpático: nervo petroso profundo (plexo carótico). Sensitivo: ramos do V2, que o atravessam sem relé.',
    trajeto: 'Fica pendurado no nervo maxilar, na fossa pterigopalatina, anterior ao canal pterigóideo, junto ao forame esfenopalatino. É o maior gânglio parassimpático da cabeça.',
    ramos: 'Pós-ganglionares: nervos nasais posteriores, nasopalatino, palatinos, faríngeo e, pelo zigomático e pelo lacrimal, a glândula lacrimal.',
    lesao: 'Secreção reduzida da lágrima e da mucosa nasal e palatina. A cefaleia em salvas e algumas neuralgias são tratadas por bloqueio do gânglio.',
    nota: 'É o gânglio parassimpático “do nariz e da lágrima”: faz relé para as glândulas lacrimal, nasais e palatinas. Não inerva músculos.',
  }, { label: false }),
  nervo('g_otico', 'Gânglio ótico', 'Ganglion oticum', 'cabeca', {
    paths: [{ pts: [[0.215, -0.435, 0.16], [0.227, -0.455, 0.185]], r: 0.0115 }],
    ramos: [{ m: 'parotida', obs: 'secretomotor, via nervo auriculotemporal' }],
  }, {
    origem: 'Parassimpático: nervo petroso menor (do glossofaríngeo, IX, pelo plexo timpânico).',
    trajeto: 'Fica na fossa infratemporal, abaixo do forame oval, medial ao nervo mandibular e lateral ao tensor do véu palatino. As fibras do nervo para o pterigóideo medial e para os tensores passam por ele sem relé.',
    ramos: 'Fibras pós-ganglionares, que se juntam ao nervo auriculotemporal para chegar à glândula parótida.',
    lesao: 'Cirurgia da parótida pode causar a síndrome de Frey (sudorese e rubor da pele da região pré-auricular ao comer), por regeneração aberrante das fibras parassimpáticas para as glândulas sudoríparas.',
    nota: 'Gânglio parassimpático da parótida. Não faz relé nas fibras motoras que o atravessam.',
  }, { label: false }),
  nervo('g_submandibular', 'Gânglio submandibular', 'Ganglion submandibulare', 'cabeca', {
    paths: [{ pts: [[0.185, -0.795, 0.49], [0.195, -0.797, 0.52]], r: 0.009 }],
    ramos: [{ m: 'submandibular', obs: 'secretomotor' }, { m: 'sublingual', obs: 'secretomotor' }],
  }, {
    origem: 'Parassimpático: corda do tímpano (VII), pelo nervo lingual.',
    trajeto: 'Fica suspenso no nervo lingual, acima da parte profunda da glândula submandibular, sobre o hioglosso.',
    ramos: 'Fibras pós-ganglionares para as glândulas submandibular e sublingual e para as pequenas glândulas da língua.',
    lesao: 'A salivação diminui do mesmo lado quando há lesão da corda do tímpano ou do gânglio.',
    nota: 'Gânglio parassimpático das glândulas submandibular e sublingual. Não inerva músculos.',
  }, { label: false }),
  nervo('n_simpatico_cervical', 'Tronco simpático cervical e gânglios cervicais', 'Truncus sympathicus cervicalis; Ganglia cervicalia', ['cabeca', 'tronco'], {
    paths: [
      // gânglio cervical superior (C2–C3, fusiforme)
      { pts: [[0.255, -0.8, -0.032], [0.258, -1.04, -0.028]], r: 0.0105 },
      // tronco, gânglio cervical médio (C6) e gânglio cervical inferior, fundido ao 1º torácico (cervicotorácico, estrelado)
      { pts: [[0.258, -1.04, -0.028], [0.25, -1.25, -0.03], [0.24, -1.45, -0.03]], r: 0.0042 },
      { pts: [[0.24, -1.45, -0.03], [0.24, -1.53, -0.03]], r: 0.007 },
      { pts: [[0.24, -1.53, -0.03], [0.25, -1.7, -0.06], [0.26, -1.77, -0.09]], r: 0.0042 },
      { pts: [[0.26, -1.77, -0.09], [0.27, -1.87, -0.11]], r: 0.0115 },
      // nervo carótico interno: do polo superior ao canal carótico e à órbita (fibras para o dilatador da pupila e os tarsais)
      { pts: [[0.255, -0.8, -0.032], [0.24, -0.62, -0.035], [0.22, -0.5, 0.0], [0.2, -0.4, 0.05], [0.18, -0.28, 0.1], [0.2, -0.2, 0.2], [0.22, -0.17, 0.35], [0.26, -0.16, 0.5], [0.3, -0.17, 0.62]], r: 0.0035 },
    ],
    ramos: [
      { m: 'dilatador_pupila', obs: 'via nervos ciliares longos', path: 5 },
      { m: 'tarsal_sup', obs: 'fibras que acompanham o oculomotor e o oftálmico', path: 5 },
      { m: 'tarsal_inf', path: 5 },
    ],
  }, {
    origem: 'Neurônios pré-ganglionares da coluna lateral da medula (T1–T4, sobretudo T1–T2), que sobem pelo tronco simpático e fazem relé nos gânglios cervicais.',
    trajeto: 'O tronco simpático cervical desce à frente dos processos transversos, atrás da bainha carótica, da base do crânio à 1ª costela. Tem três gânglios: o superior (C2–C3), o maior, fusiforme; o médio (cerca de C6), pequeno e inconstante; e o inferior (C7–T1), que em geral se funde ao 1º torácico e forma o gânglio cervicotorácico (estrelado).',
    ramos: 'Gânglio superior: nervo carótico interno (plexo carótico), nervos para IX–XII e C1–C4 e nervo cardíaco cervical superior. Gânglios médio e inferior: ramos para C5–C8, nervos cardíacos médio e inferior e o plexo da artéria vertebral.',
    sensibilidade: 'Eferente (simpático): dilatador da pupila, músculos tarsais, glândulas sudoríparas e vasos da face e do pescoço, glândulas salivares e lacrimal (vasoconstrição), coração. Leva fibras de dor visceral do coração (pelos nervos cardíacos).',
    lesao: 'Síndrome de Horner: ptose leve (tarsal superior), miose (dilatador), enoftalmo aparente e anidrose da hemiface, do mesmo lado. Causas: tumor do ápice do pulmão (Pancoast), dissecção da carótida interna, cirurgia ou trauma cervical.',
    nota: 'O gânglio estrelado é alvo de bloqueios anestésicos para dor simpática da face e do membro superior. Os ramos cinzentos que ligam os gânglios aos nervos espinais (e a via de entrada, pelos ramos comunicantes brancos de T1–T4) não estão desenhados. Os músculos lisos do olho (dilatador e tarsais) estão no modelo de forma esquemática.',
  }),
];
