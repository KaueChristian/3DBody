/**
 * Irrigação arterial dos músculos (F5 / M15): fonte única do campo “Irrigação” da ficha de cada músculo, da lista de músculos
 * na ficha da artéria e do quiz “o que irriga isto?”.
 *
 * Cada linha é `[músculos, artérias do catálogo, texto]`. As artérias do catálogo são os troncos e ramos que existem como ficha e
 * malha no atlas (inclusive, por código, a carótida externa e seus ramos, as glúteas, a obturatória e a pudenda interna: esquemas); o
 * texto diz o nome verdadeiro do ramo. Onde o ramo não existe nem como esquema (a interóssea posterior, a vesical inferior…), o catálogo
 * liga ao tronco do qual ele sai (interóssea comum, ilíaca interna…), e a ficha diz isso.
 *
 * Fontes: Moore, Dalley & Agur (Anatomia Orientada para a Clínica, 8ª ed., descrições e quadros dos músculos) e Gray’s Anatomy
 * (42ª ed.). Os atlas divergem no detalhe dos ramos de cada músculo e a irrigação varia entre as pessoas: o texto dá o padrão
 * descrito, não todos os ramos possíveis.
 */

/** @type {Array<[string[], string[], string]>} */
export const IRRIGACAO = [
  /* ═════════ Cabeça: couro cabeludo e mímica ═════════ */
  [['frontal'], ['arteria_oftalmica', 'arteria_temporal_superficial'], 'Artérias supraorbital e supratroclear (ramos da oftálmica, da carótida interna) e ramo frontal da artéria temporal superficial (da carótida externa).'],
  [['occipital'], ['arteria_occipital', 'arteria_auricular_posterior'], 'Artéria occipital e artéria auricular posterior (ramos da carótida externa).'],
  [['auricular_sup', 'auricular_ant', 'temporoparietal'], ['arteria_temporal_superficial'], 'Artéria temporal superficial (ramo terminal da carótida externa), por seus ramos auriculares anteriores e frontal.'],
  [['auricular_post'], ['arteria_auricular_posterior'], 'Artéria auricular posterior (ramo da carótida externa).'],
  [['orbicular_olho'], ['arteria_facial', 'arteria_temporal_superficial', 'arteria_oftalmica', 'arteria_maxilar'], 'Ramos das artérias facial, temporal superficial e transversa da face (da carótida externa), infraorbital (da maxilar) e das artérias palpebrais e supraorbital (da oftálmica, da carótida interna).'],
  [['corrugador', 'depressor_supercilio', 'procero'], ['arteria_oftalmica', 'arteria_facial'], 'Artérias supraorbital, supratroclear e dorsal do nariz (ramos da oftálmica, da carótida interna) e ramo angular da artéria facial (da carótida externa).'],
  [['nasal', 'depressor_septo'], ['arteria_facial', 'arteria_maxilar', 'arteria_oftalmica'], 'Artéria facial (ramos nasais laterais e labial superior) e infraorbital (da maxilar), ramos da carótida externa; artéria dorsal do nariz (da oftálmica).'],
  [['orbicular_boca'], ['arteria_facial', 'arteria_maxilar'], 'Artérias labiais superior e inferior (ramos da facial), com ramos da infraorbital e mentual (da maxilar), todos da carótida externa.'],
  [['levantador_labio_asa', 'levantador_labio', 'zigomatico_menor', 'levantador_angulo', 'incisivo_labio_sup'], ['arteria_facial', 'arteria_maxilar'], 'Artéria facial (ramos angular e labial superior) e artéria infraorbital (da maxilar), ramos da carótida externa.'],
  [['zigomatico_maior', 'risorio'], ['arteria_facial', 'arteria_temporal_superficial'], 'Artéria facial e artéria transversa da face (da temporal superficial), ramos da carótida externa.'],
  [['abaixador_angulo', 'abaixador_labio', 'mentual', 'incisivo_labio_inf'], ['arteria_facial', 'arteria_maxilar'], 'Artéria labial inferior e ramo submentual (da facial) e artéria mentual (ramo da alveolar inferior, da maxilar), da carótida externa.'],
  [['transverso_mento'], ['arteria_facial'], 'Artéria submentual (ramo da facial, da carótida externa).'],
  [['bucinador'], ['arteria_maxilar', 'arteria_facial'], 'Artéria bucal (ramo da maxilar) e ramos da facial e da transversa da face, da carótida externa.'],
  [['platisma'], ['arteria_facial', 'arteria_supraescapular'], 'Ramo submentual da artéria facial (carótida externa) e ramos da artéria supraescapular (do tronco tireocervical, da subclávia).'],

  /* ═════════ Mastigação ═════════ */
  [['masseter'], ['arteria_maxilar', 'arteria_temporal_superficial', 'arteria_facial'], 'Artéria massetérica (ramo da maxilar), ramos da artéria transversa da face (da temporal superficial) e da facial, da carótida externa.'],
  [['temporal'], ['arteria_maxilar', 'arteria_temporal_superficial'], 'Artérias temporais profundas anterior e posterior (ramos da maxilar) e ramos da temporal superficial (artéria temporal média), da carótida externa.'],
  [['pterigoideo_medial', 'pterigoideo_lateral'], ['arteria_maxilar'], 'Ramos pterigóideos da artéria maxilar (ramo terminal da carótida externa).'],

  /* ═════════ Pescoço: superficial, supra-hióideos, infra-hióideos ═════════ */
  [['ecm'], ['arteria_occipital', 'arteria_tireoidea_superior', 'arteria_supraescapular'], 'Ramos esternocleidomastóideos das artérias occipital e tireóidea superior (da carótida externa) e, na parte inferior, ramos da supraescapular (do tronco tireocervical).'],
  [['digastrico'], ['arteria_facial', 'arteria_occipital', 'arteria_auricular_posterior'], 'Ventre anterior: artéria submentual (da facial). Ventre posterior: ramos das artérias occipital e auricular posterior. Todas, da carótida externa.'],
  [['milo_hioideo'], ['arteria_maxilar', 'arteria_facial', 'arteria_lingual'], 'Artéria milo-hióidea (ramo da alveolar inferior, da maxilar) e ramos da submentual (da facial) e da lingual, da carótida externa.'],
  [['genio_hioideo'], ['arteria_lingual', 'arteria_facial'], 'Ramo sublingual da artéria lingual e artéria submentual (da facial), da carótida externa.'],
  [['estilo_hioideo'], ['arteria_facial', 'arteria_occipital', 'arteria_auricular_posterior'], 'Ramos de artérias vizinhas da carótida externa (facial, occipital e auricular posterior).'],
  [['esternohioideo', 'esternotireoideo', 'tireohioideo', 'omohioideo'], ['arteria_tireoidea_superior', 'arteria_lingual'], 'Ramos infra-hióideos das artérias tireóidea superior e lingual, da carótida externa.'],

  /* ═════════ Órbita e olho ═════════ */
  [['reto_sup', 'reto_med', 'obliquo_sup', 'levantador_palpebra'], ['arteria_oftalmica'], 'Ramos musculares (lateral e medial) da artéria oftálmica, ramo da carótida interna.'],
  [['reto_lat'], ['arteria_oftalmica'], 'Ramo muscular lateral da artéria oftálmica e ramos da artéria lacrimal, da carótida interna.'],
  [['reto_inf', 'obliquo_inf'], ['arteria_oftalmica', 'arteria_maxilar'], 'Ramo muscular medial da artéria oftálmica (carótida interna) e ramos da artéria infraorbital (da maxilar, carótida externa).'],
  [['tarsal_sup', 'tarsal_inf'], ['arteria_oftalmica'], 'Arcos arteriais palpebrais superior e inferior, formados pelas artérias palpebrais mediais e laterais (ramos da oftálmica).'],
  [['ciliar', 'esfincter_pupila', 'dilatador_pupila'], ['arteria_oftalmica'], 'Artérias ciliares posteriores longas e curtas e círculo arterial maior da íris (ramos da oftálmica, da carótida interna).'],

  /* ═════════ Língua, palato, faringe, laringe ═════════ */
  [['estiloglosso', 'hioglosso', 'genioglosso', 'lingua_long_sup', 'lingua_long_inf', 'lingua_transverso', 'lingua_vertical'], ['arteria_lingual'], 'Artéria lingual (ramos dorsais da língua, sublingual e artéria profunda da língua), da carótida externa.'],
  [['levantador_veu', 'tensor_veu', 'musculo_uvula', 'palatoglosso', 'palatofaringeo', 'salpingofaringeo'], ['arteria_facial', 'arteria_maxilar', 'arteria_faringea_ascendente'], 'Artéria palatina ascendente (da facial), artérias palatinas descendentes (palatina maior e menores, da maxilar) e ramo palatino da faríngea ascendente, da carótida externa.'],
  [['tensor_timpano'], ['arteria_meningea_media', 'arteria_maxilar'], 'Artéria timpânica superior (ramo da meníngea média, da maxilar).'],
  [['estapedio'], ['arteria_auricular_posterior', 'arteria_occipital'], 'Ramo estilomastóideo da artéria auricular posterior (ou da occipital).'],
  [['constritor_faringe_sup', 'constritor_faringe_med', 'estilofaringeo'], ['arteria_faringea_ascendente', 'arteria_facial', 'arteria_lingual', 'arteria_maxilar'], 'Artéria faríngea ascendente e ramos faríngeos das artérias facial (palatina ascendente e tonsilar), lingual (dorsal da língua) e maxilar, da carótida externa.'],
  [['constritor_faringe_inf'], ['arteria_faringea_ascendente', 'arteria_tireoidea_superior', 'arteria_tireoidea_inferior'], 'Artéria faríngea ascendente, ramos faríngeos da tireóidea superior (carótida externa) e da tireóidea inferior (tronco tireocervical, da subclávia).'],
  [['cricotireoideo'], ['arteria_tireoidea_superior'], 'Artéria cricotireóidea, ramo da tireóidea superior (da carótida externa).'],
  [['cricoaritenoideo_post', 'cricoaritenoideo_lat', 'aritenoideo_transverso', 'aritenoideo_obliquo', 'tireoaritenoideo', 'vocal'], ['arteria_tireoidea_superior', 'arteria_tireoidea_inferior'], 'Artéria laríngea superior (ramo da tireóidea superior, da carótida externa) e artéria laríngea inferior (ramo da tireóidea inferior, do tronco tireocervical).'],

  /* ═════════ Músculos profundos do pescoço e da nuca ═════════ */
  [['iliocostal_cervical', 'longuissimo_cervical', 'longuissimo_cabeca', 'semiespinal_cervical', 'semiespinal_cabeca', 'rotadores_cervicais', 'interespinais_cervicais', 'intertransversarios_cerv_post'], ['arteria_tronco_costocervical', 'arteria_vertebral', 'arteria_occipital'], 'Artéria cervical profunda (do tronco costocervical), ramos musculares da vertebral e da occipital (carótida externa) e cervical ascendente (da tireóidea inferior).'],
  [['esplenio_cabeca', 'esplenio_pescoco'], ['arteria_occipital', 'arteria_cervical_transversa'], 'Ramos musculares da artéria occipital (carótida externa) e da cervical transversa (ramo profundo).'],
  [['reto_post_maior', 'reto_post_menor', 'obliquo_cabeca_sup', 'obliquo_cabeca_inf'], ['arteria_vertebral', 'arteria_occipital'], 'Ramos musculares da artéria vertebral, no triângulo suboccipital, e da occipital (carótida externa).'],
  [['longo_cabeca', 'longo_pescoco'], ['arteria_tireoidea_inferior', 'arteria_vertebral', 'arteria_faringea_ascendente'], 'Ramos da artéria tireóidea inferior (cervical ascendente), da vertebral e da faríngea ascendente.'],
  [['reto_ant_cabeca', 'reto_lat_cabeca'], ['arteria_vertebral', 'arteria_faringea_ascendente'], 'Ramos da artéria vertebral e da faríngea ascendente (carótida externa).'],
  [['intertransversarios_cerv_ant'], ['arteria_vertebral', 'arteria_tireoidea_inferior'], 'Ramos da artéria vertebral e da cervical ascendente (da tireóidea inferior).'],
  [['escaleno_ant', 'escaleno_med', 'escaleno_post', 'escaleno_minimo'], ['arteria_tireoidea_inferior', 'arteria_cervical_transversa'], 'Ramos da artéria tireóidea inferior (cervical ascendente) e da cervical transversa; ramos diretos da subclávia ao redor da inserção.'],

  /* ═════════ Cintura escapular e tórax ═════════ */
  [['peitoral_clav', 'peitoral_esternocostal', 'peitoral_abdominal'], ['arteria_toracoacromial', 'arteria_toracica_interna'], 'Ramos peitorais da artéria toracoacromial (da axilar) e ramos perfurantes e intercostais anteriores da torácica interna.'],
  [['peitoral_menor'], ['arteria_toracoacromial', 'arteria_toracica_lateral'], 'Ramos peitorais da toracoacromial e ramos da torácica lateral, ambas da artéria axilar.'],
  [['subclavio'], ['arteria_toracoacromial', 'arteria_supraescapular'], 'Ramo clavicular da toracoacromial (da axilar) e ramos da supraescapular (do tronco tireocervical).'],
  [['serratil_anterior'], ['arteria_toracica_lateral', 'arteria_toracodorsal', 'arteria_cervical_transversa'], 'Artéria torácica lateral (da axilar) e ramos da toracodorsal (da subescapular); a parte superior recebe também ramos da cervical transversa.'],
  [['trapezio_desc', 'trapezio_transv', 'trapezio_asc'], ['arteria_cervical_transversa', 'arteria_occipital', 'arteria_intercostais_posteriores', 'arteria_escapular_dorsal'], 'Ramo superficial da artéria cervical transversa (principal), artéria occipital (carótida externa), ramos perfurantes das intercostais posteriores e ramo da dorsal da escápula.'],
  [['levantador_escapula'], ['arteria_cervical_transversa', 'arteria_escapular_dorsal', 'arteria_tireoidea_inferior'], 'Artéria cervical transversa (ramo ascendente), artéria dorsal da escápula e cervical ascendente (da tireóidea inferior).'],
  [['rombo_menor', 'rombo_maior'], ['arteria_escapular_dorsal', 'arteria_intercostais_posteriores'], 'Artéria dorsal da escápula e ramos perfurantes das intercostais posteriores.'],
  [['grande_dorsal'], ['arteria_toracodorsal', 'arteria_intercostais_posteriores', 'arteria_lombares'], 'Artéria toracodorsal (da subescapular, da axilar) e ramos perfurantes posteriores das intercostais posteriores e das lombares.'],
  [['serratil_post_sup', 'serratil_post_inf'], ['arteria_intercostais_posteriores'], 'Artérias intercostais posteriores (a inferior, também a subcostal).'],
  [['iliocostal_toracico', 'longuissimo_toracico', 'espinal_toracico', 'semiespinal_toracico', 'rotadores_toracicos', 'interespinais_toracicos', 'levantadores_costelas_curtos', 'levantadores_costelas_longos'], ['arteria_intercostais_posteriores'], 'Ramos dorsais das artérias intercostais posteriores e da subcostal.'],
  [['iliocostal_lombar', 'rotadores_lombares', 'interespinais_lombares', 'intertransversarios_med', 'intertransversarios_lat'], ['arteria_lombares'], 'Ramos dorsais das artérias lombares e da subcostal.'],
  [['multifido'], ['arteria_intercostais_posteriores', 'arteria_lombares', 'arteria_iliaca_interna'], 'Ramos dorsais das intercostais posteriores e das lombares e artérias sacrais laterais (da ilíaca interna).'],
  [['intercostal_ext', 'intercostal_int', 'intercostal_intimo'], ['arteria_intercostais_posteriores', 'arteria_toracica_interna'], 'Artérias intercostais posteriores (da aorta, ou da intercostal suprema nos dois primeiros espaços) e anteriores (da torácica interna e da musculofrênica), que se anastomosam em cada espaço.'],
  [['subcostais'], ['arteria_intercostais_posteriores'], 'Artéria subcostal e ramos das intercostais posteriores inferiores.'],
  [['transverso_torax'], ['arteria_toracica_interna'], 'Ramos intercostais anteriores da artéria torácica interna.'],
  [['diafragma'], ['arteria_frenica_inferior', 'arteria_musculofrenica', 'arteria_toracica_interna', 'arteria_intercostais_posteriores'], 'Artérias frênicas inferiores (da aorta abdominal), musculofrênica e pericardicofrênica (da torácica interna) e intercostais posteriores inferiores.'],

  /* ═════════ Parede do abdome e dorso do tronco ═════════ */
  [['obliquo_externo', 'obliquo_interno', 'transverso_abdome'], ['arteria_epigastrica_inferior', 'arteria_epigastrica_superior', 'arteria_intercostais_posteriores', 'arteria_lombares'], 'Artérias epigástricas superior e inferior, musculofrênica, circunflexa ilíaca profunda (da ilíaca externa), subcostal, intercostais posteriores inferiores e lombares.'],
  [['reto_abdome'], ['arteria_epigastrica_superior', 'arteria_epigastrica_inferior', 'arteria_musculofrenica', 'arteria_intercostais_posteriores'], 'Artérias epigástricas superior (da torácica interna) e inferior (da ilíaca externa), que se anastomosam dentro da bainha, musculofrênica e ramos das intercostais posteriores inferiores.'],
  [['piramidal'], ['arteria_epigastrica_inferior', 'arteria_iliaca_externa'], 'Artéria epigástrica inferior (ramo da ilíaca externa).'],
  [['quadrado_lombo'], ['arteria_lombares', 'arteria_iliaca_interna'], 'Artérias lombares, subcostal e iliolombar (da ilíaca interna).'],
  [['psoas_maior'], ['arteria_lombares', 'arteria_iliaca_interna'], 'Ramos das artérias lombares (da aorta abdominal) e iliolombar (da ilíaca interna).'],
  [['iliaco'], ['arteria_iliaca_interna', 'arteria_iliaca_externa'], 'Artéria iliolombar (ramo ilíaco, da ilíaca interna) e circunflexa ilíaca profunda (da ilíaca externa).'],

  /* ═════════ Pelve e períneo ═════════ */
  [['pubococcigeo', 'iliococcigeo', 'puborretal'], ['arteria_pudenda_interna', 'arteria_glutea_inferior', 'arteria_iliaca_interna'], 'Ramos da artéria pudenda interna (retal inferior), da glútea inferior e da vesical inferior (da ilíaca interna).'],
  [['coccigeo'], ['arteria_glutea_inferior', 'arteria_iliaca_interna'], 'Ramos da glútea inferior e das artérias sacrais laterais (da ilíaca interna).'],
  [['esfincter_anal_ext'], ['arteria_pudenda_interna'], 'Artéria retal inferior (ramo da pudenda interna, da ilíaca interna).'],
  [['obturador_interno'], ['arteria_obturatoria', 'arteria_pudenda_interna', 'arteria_glutea_inferior'], 'Artérias obturatória, pudenda interna e glútea inferior (da ilíaca interna).'],
  [['bulboesponjoso', 'isquiocavernoso', 'transverso_superficial_perineo', 'transverso_profundo_perineo', 'esfincter_uretra'], ['arteria_pudenda_interna'], 'Ramos da artéria pudenda interna (artéria perineal e artérias do bulbo e do corpo cavernoso do pênis), da ilíaca interna.'],

  /* ═════════ Ombro e braço ═════════ */
  [['delt_clav', 'delt_acro', 'delt_esp'], ['arteria_circunflexa_posterior_umero', 'arteria_toracoacromial', 'arteria_profunda_braco', 'arteria_circunflexa_anterior_umero'], 'Artéria circunflexa posterior do úmero (principal), ramos deltóideo e acromial da toracoacromial, ramo deltóideo da profunda do braço e circunflexa anterior do úmero.'],
  [['supraespinal'], ['arteria_supraescapular', 'arteria_escapular_dorsal'], 'Artéria supraescapular e artéria dorsal da escápula.'],
  [['infraespinal'], ['arteria_supraescapular', 'arteria_circunflexa_escapular', 'arteria_escapular_dorsal'], 'Artérias supraescapular e circunflexa escapular, com ramos da dorsal da escápula.'],
  [['redondo_menor'], ['arteria_circunflexa_escapular', 'arteria_circunflexa_posterior_umero'], 'Artérias circunflexa escapular e circunflexa posterior do úmero.'],
  [['redondo_maior'], ['arteria_circunflexa_escapular'], 'Artéria circunflexa escapular (ramo da subescapular, da axilar).'],
  [['subescapular'], ['arteria_subescapular', 'arteria_supraescapular', 'arteria_escapular_dorsal'], 'Artéria subescapular e seus ramos, com ramos da supraescapular e da dorsal da escápula na fossa subescapular.'],
  [['coracobraquial'], ['arteria_braquial', 'arteria_circunflexa_anterior_umero'], 'Ramos musculares da artéria braquial e da circunflexa anterior do úmero.'],
  [['biceps_longa', 'biceps_curta'], ['arteria_braquial', 'arteria_circunflexa_anterior_umero'], 'Ramos musculares da artéria braquial; a cabeça longa também recebe ramos da circunflexa anterior do úmero.'],
  [['braquial'], ['arteria_braquial', 'arteria_recorrente_radial'], 'Ramos musculares da artéria braquial e a recorrente radial.'],
  [['triceps_longa', 'triceps_lateral', 'triceps_medial'], ['arteria_profunda_braco', 'arteria_circunflexa_posterior_umero', 'arteria_colateral_ulnar_superior'], 'Artéria profunda do braço (principal), circunflexa posterior do úmero (cabeça longa) e colateral ulnar superior (cabeça medial).'],
  [['anconeo'], ['arteria_profunda_braco', 'arteria_interossea_comum'], 'Artéria colateral média (da profunda do braço) e interóssea recorrente (da interóssea comum).'],

  /* ═════════ Antebraço ═════════ */
  [['pronador_redondo_h', 'pronador_redondo_u'], ['arteria_ulnar', 'arteria_recorrente_ulnar', 'arteria_radial'], 'Ramos da artéria ulnar (inclusive a recorrente ulnar) e da radial.'],
  [['fcr'], ['arteria_radial'], 'Ramos da artéria radial.'],
  [['palmar_longo'], ['arteria_ulnar', 'arteria_recorrente_ulnar'], 'Ramos da artéria ulnar (e da recorrente ulnar).'],
  [['fcu_h', 'fcu_u'], ['arteria_ulnar', 'arteria_recorrente_ulnar'], 'Artéria ulnar, com a recorrente ulnar posterior.'],
  [['fds'], ['arteria_ulnar', 'arteria_radial'], 'Ramos das artérias ulnar e radial.'],
  [['fdp'], ['arteria_interossea_anterior', 'arteria_ulnar'], 'Artéria interóssea anterior (da interóssea comum) e ramos da ulnar.'],
  [['fpl'], ['arteria_interossea_anterior', 'arteria_radial'], 'Artéria interóssea anterior e ramos da radial.'],
  [['pronador_quadrado'], ['arteria_interossea_anterior'], 'Artéria interóssea anterior (e ramos da radial e da ulnar na parte distal).'],
  [['braquiorradial'], ['arteria_radial', 'arteria_recorrente_radial', 'arteria_profunda_braco'], 'Artéria radial, recorrente radial e colateral radial (da profunda do braço).'],
  [['ecrl'], ['arteria_radial', 'arteria_recorrente_radial', 'arteria_profunda_braco'], 'Artéria radial, recorrente radial e colateral radial (da profunda do braço).'],
  [['ecrb'], ['arteria_radial', 'arteria_recorrente_radial', 'arteria_interossea_comum'], 'Artéria radial e recorrente radial, com ramos da interóssea posterior.'],
  [['ed', 'edm', 'ecu'], ['arteria_interossea_comum', 'arteria_interossea_anterior'], 'Artéria interóssea posterior (da interóssea comum), com ramos terminais da interóssea anterior no dorso do punho.'],
  [['supinador'], ['arteria_recorrente_radial', 'arteria_interossea_comum'], 'Artérias recorrente radial e interóssea recorrente (da interóssea posterior).'],
  [['apl', 'epb'], ['arteria_interossea_comum', 'arteria_radial'], 'Artéria interóssea posterior (da interóssea comum) e ramos da radial.'],
  [['epl', 'extensor_indicador'], ['arteria_interossea_comum', 'arteria_interossea_anterior'], 'Artéria interóssea posterior (da interóssea comum), com ramos terminais da interóssea anterior.'],

  /* ═════════ Mão ═════════ */
  [['abdutor_polegar_curto', 'flexor_polegar_curto', 'oponente_polegar'], ['arteria_radial', 'arteria_princeps_polegar', 'arteria_arco_palmar_superficial'], 'Ramo palmar superficial da radial e artéria principal do polegar; o flexor curto também recebe ramos do arco palmar superficial.'],
  [['adutor_polegar_obliquo', 'adutor_polegar_transverso'], ['arteria_princeps_polegar', 'arteria_arco_palmar_profundo'], 'Artéria principal do polegar e arco palmar profundo (continuação da radial).'],
  [['abdutor_minimo', 'flexor_minimo_curto', 'oponente_minimo', 'palmar_curto'], ['arteria_ulnar', 'arteria_arco_palmar_superficial'], 'Ramos da artéria ulnar: arco palmar superficial e ramo palmar profundo.'],
  [['interosseos_dorsais', 'interosseos_palmares'], ['arteria_arco_palmar_profundo', 'arteria_arco_palmar_superficial'], 'Arco palmar profundo (artérias metacarpais palmares), artérias metacarpais dorsais (da rede dorsal do carpo) e digitais palmares comuns.'],
  [['lumbricais'], ['arteria_arco_palmar_superficial', 'arteria_arco_palmar_profundo'], 'Artérias digitais palmares comuns (do arco palmar superficial) e metacarpais palmares (do arco profundo).'],

  /* ═════════ Quadril e coxa ═════════ */
  [['gluteo_maximo'], ['arteria_glutea_inferior', 'arteria_glutea_superior', 'arteria_femoral_profunda'], 'Artérias glútea inferior e glútea superior (ramo superficial), da ilíaca interna, com perfurantes da femoral profunda.'],
  [['gluteo_medio'], ['arteria_glutea_superior'], 'Artéria glútea superior (ramos superficial e profundo), da ilíaca interna.'],
  [['gluteo_minimo'], ['arteria_glutea_superior', 'arteria_glutea_inferior', 'arteria_circunflexa_femoral_lateral'], 'Artéria glútea superior (ramo profundo) e glútea inferior, da ilíaca interna; ramo ascendente da circunflexa femoral lateral.'],
  [['tensor_fascia_lata'], ['arteria_circunflexa_femoral_lateral', 'arteria_glutea_superior'], 'Ramo ascendente da circunflexa femoral lateral e artéria glútea superior (da ilíaca interna).'],
  [['piriforme'], ['arteria_glutea_superior', 'arteria_glutea_inferior'], 'Artérias glúteas superior e inferior e sacrais laterais (da ilíaca interna).'],
  [['gemeo_superior', 'gemeo_inferior'], ['arteria_glutea_inferior', 'arteria_pudenda_interna', 'arteria_circunflexa_femoral_medial'], 'Artérias glútea inferior e pudenda interna (da ilíaca interna) e circunflexa femoral medial.'],
  [['obturador_externo'], ['arteria_obturatoria', 'arteria_circunflexa_femoral_medial'], 'Ramo posterior da artéria obturatória (da ilíaca interna) e circunflexa femoral medial.'],
  [['quadrado_femoral'], ['arteria_circunflexa_femoral_medial', 'arteria_glutea_inferior'], 'Ramo da circunflexa femoral medial e da glútea inferior (da ilíaca interna).'],
  [['sartorio'], ['arteria_femoral'], 'Ramos musculares da artéria femoral.'],
  [['reto_femoral'], ['arteria_circunflexa_femoral_lateral', 'arteria_femoral'], 'Ramos ascendente e descendente da circunflexa femoral lateral e ramos musculares da femoral.'],
  [['vasto_lateral', 'vasto_intermedio'], ['arteria_circunflexa_femoral_lateral', 'arteria_femoral_profunda', 'arteria_femoral'], 'Ramo descendente da circunflexa femoral lateral e perfurantes da femoral profunda; ramos musculares da femoral.'],
  [['vasto_medial'], ['arteria_femoral', 'arteria_genicular_descendente', 'arteria_femoral_profunda'], 'Ramos musculares da femoral, genicular descendente e femoral profunda.'],
  [['pectineo'], ['arteria_femoral', 'arteria_femoral_profunda', 'arteria_obturatoria'], 'Ramos da femoral e da femoral profunda e ramo anterior da obturatória (da ilíaca interna).'],
  [['adutor_longo'], ['arteria_femoral_profunda'], 'Artéria femoral profunda (ramos musculares e perfurantes).'],
  [['adutor_curto'], ['arteria_femoral_profunda', 'arteria_obturatoria', 'arteria_circunflexa_femoral_medial'], 'Artéria femoral profunda, ramo anterior da obturatória (da ilíaca interna) e circunflexa femoral medial.'],
  [['adutor_magno', 'adutor_minimo'], ['arteria_femoral_profunda', 'arteria_obturatoria', 'arteria_genicular_descendente', 'arteria_poplitea'], 'Perfurantes da femoral profunda, ramo posterior da obturatória (da ilíaca interna) e genicular descendente, com ramos da poplítea.'],
  [['gracil'], ['arteria_femoral_profunda', 'arteria_femoral'], 'Ramos musculares da femoral profunda e da femoral.'],
  [['biceps_femoral_longa', 'semitendineo', 'semimembranaceo'], ['arteria_femoral_profunda', 'arteria_poplitea', 'arteria_glutea_inferior'], 'Perfurantes da femoral profunda, glútea inferior (parte proximal) e ramos musculares da poplítea.'],
  [['biceps_femoral_curta'], ['arteria_femoral_profunda', 'arteria_poplitea'], 'Perfurantes da femoral profunda e ramos musculares da poplítea.'],

  /* ═════════ Perna e pé ═════════ */
  [['tibial_anterior', 'extensor_longo_dedos'], ['arteria_tibial_anterior'], 'Artéria tibial anterior (ramos musculares) e artéria recorrente tibial anterior, na parte proximal.'],
  [['extensor_longo_halux', 'fibular_terceiro'], ['arteria_tibial_anterior', 'arteria_fibular'], 'Artéria tibial anterior (ramos musculares) e ramo perfurante da artéria fibular.'],
  [['fibular_longo', 'fibular_curto'], ['arteria_fibular', 'arteria_tibial_anterior'], 'Artéria fibular, por ramos musculares e perfurantes; na parte proximal, também ramos da tibial anterior.'],
  [['gastrocnemio_medial', 'gastrocnemio_lateral', 'plantar'], ['arteria_poplitea'], 'Artérias surais, ramos da artéria poplítea.'],
  [['soleo'], ['arteria_poplitea', 'arteria_tibial_posterior', 'arteria_fibular'], 'Artérias surais (da poplítea) e ramos musculares da tibial posterior e da fibular.'],
  [['popliteo'], ['arteria_geniculares', 'arteria_tibial_posterior'], 'Artérias geniculares inferiores (da poplítea) e ramos da tibial posterior.'],
  [['tibial_posterior', 'flexor_longo_halux'], ['arteria_fibular', 'arteria_tibial_posterior'], 'Artéria fibular (a principal, sobretudo para o flexor longo do hálux) e ramos musculares da tibial posterior.'],
  [['flexor_longo_dedos'], ['arteria_tibial_posterior'], 'Ramos musculares da artéria tibial posterior.'],
  [['extensor_curto_halux'], ['arteria_dorsal_pe'], 'Artéria dorsal do pé (e ramos da társica lateral).'],
  [['abdutor_halux', 'flexor_curto_dedos', 'flexor_curto_halux_medial', 'flexor_curto_halux_lateral'], ['arteria_plantar_medial', 'arteria_plantar_lateral'], 'Artéria plantar medial (principal) e ramos da plantar lateral e do arco plantar.'],
  [['abdutor_minimo_pe', 'quadrado_plantar', 'flexor_curto_minimo_pe', 'oponente_minimo_pe'], ['arteria_plantar_lateral'], 'Artéria plantar lateral.'],
  [['adutor_halux_obliquo', 'adutor_halux_transverso', 'interosseos_plantares', 'lumbricais_pe'], ['arteria_plantar_lateral', 'arteria_dorsal_pe'], 'Arco plantar profundo (da plantar lateral e do ramo plantar profundo da dorsal do pé) e artérias metatarsais plantares.'],
];
