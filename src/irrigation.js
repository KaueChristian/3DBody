/**
 * Irrigação arterial dos músculos (F5 / M15): fonte única do campo “Irrigação” da ficha de cada músculo, da lista de músculos
 * na ficha da artéria e do quiz “o que irriga isto?”.
 *
 * Cada linha é `[músculos, artérias do catálogo, texto]`. As artérias do catálogo são os troncos e ramos que existem como ficha e
 * malha no atlas; o texto diz o nome verdadeiro do ramo, mesmo quando ele não existe no modelo (a carótida externa e seus ramos, as
 * glúteas, a obturatória, a pudenda interna, a interóssea posterior…). Nesses casos o catálogo liga ao tronco do qual o ramo sai
 * (carótida comum, ilíaca interna, interóssea comum…), e a ficha diz isso.
 *
 * Fontes: Moore, Dalley & Agur (Anatomia Orientada para a Clínica, 8ª ed., descrições e quadros dos músculos) e Gray’s Anatomy
 * (42ª ed.). Os atlas divergem no detalhe dos ramos de cada músculo e a irrigação varia entre as pessoas: o texto dá o padrão
 * descrito, não todos os ramos possíveis.
 */

const C = 'arteria_carotida_comum';
const CI = 'arteria_carotida_interna';

/** @type {Array<[string[], string[], string]>} */
export const IRRIGACAO = [
  /* ═════════ Cabeça: couro cabeludo e mímica ═════════ */
  [['frontal'], [CI, C], 'Artérias supraorbital e supratroclear (ramos da oftálmica, da carótida interna) e ramo frontal da artéria temporal superficial (da carótida externa).'],
  [['occipital'], [C], 'Artéria occipital e artéria auricular posterior (ramos da carótida externa).'],
  [['auricular_sup', 'auricular_ant', 'temporoparietal'], [C], 'Artéria temporal superficial (ramo terminal da carótida externa), por seus ramos auriculares anteriores e frontal.'],
  [['auricular_post'], [C], 'Artéria auricular posterior (ramo da carótida externa).'],
  [['orbicular_olho'], [C, CI], 'Ramos das artérias facial, temporal superficial e transversa da face (da carótida externa), infraorbital (da maxilar) e das artérias palpebrais e supraorbital (da oftálmica, da carótida interna).'],
  [['corrugador', 'depressor_supercilio', 'procero'], [CI, C], 'Artérias supraorbital, supratroclear e dorsal do nariz (ramos da oftálmica, da carótida interna) e ramo angular da artéria facial (da carótida externa).'],
  [['nasal', 'depressor_septo'], [C, CI], 'Artéria facial (ramos nasais laterais e labial superior) e infraorbital (da maxilar), ramos da carótida externa; artéria dorsal do nariz (da oftálmica).'],
  [['orbicular_boca'], [C], 'Artérias labiais superior e inferior (ramos da facial), com ramos da infraorbital e mentual (da maxilar), todos da carótida externa.'],
  [['levantador_labio_asa', 'levantador_labio', 'zigomatico_menor', 'levantador_angulo', 'incisivo_labio_sup'], [C], 'Artéria facial (ramos angular e labial superior) e artéria infraorbital (da maxilar), ramos da carótida externa.'],
  [['zigomatico_maior', 'risorio'], [C], 'Artéria facial e artéria transversa da face (da temporal superficial), ramos da carótida externa.'],
  [['abaixador_angulo', 'abaixador_labio', 'mentual', 'incisivo_labio_inf'], [C], 'Artéria labial inferior e ramo submentual (da facial) e artéria mentual (ramo da alveolar inferior, da maxilar), da carótida externa.'],
  [['transverso_mento'], [C], 'Artéria submentual (ramo da facial, da carótida externa).'],
  [['bucinador'], [C], 'Artéria bucal (ramo da maxilar) e ramos da facial e da transversa da face, da carótida externa.'],
  [['platisma'], [C, 'arteria_supraescapular'], 'Ramo submentual da artéria facial (carótida externa) e ramos da artéria supraescapular (do tronco tireocervical, da subclávia).'],

  /* ═════════ Mastigação ═════════ */
  [['masseter'], [C], 'Artéria massetérica (ramo da maxilar), ramos da artéria transversa da face (da temporal superficial) e da facial, da carótida externa.'],
  [['temporal'], [C], 'Artérias temporais profundas anterior e posterior (ramos da maxilar) e ramos da temporal superficial (artéria temporal média), da carótida externa.'],
  [['pterigoideo_medial', 'pterigoideo_lateral'], [C], 'Ramos pterigóideos da artéria maxilar (ramo terminal da carótida externa).'],

  /* ═════════ Pescoço: superficial, supra-hióideos, infra-hióideos ═════════ */
  [['ecm'], [C, 'arteria_supraescapular'], 'Ramos esternocleidomastóideos das artérias occipital e tireóidea superior (da carótida externa) e, na parte inferior, ramos da supraescapular (do tronco tireocervical).'],
  [['digastrico'], [C], 'Ventre anterior: artéria submentual (da facial). Ventre posterior: ramos das artérias occipital e auricular posterior. Todas, da carótida externa.'],
  [['milo_hioideo'], [C], 'Artéria milo-hióidea (ramo da alveolar inferior, da maxilar) e ramos da submentual (da facial) e da lingual, da carótida externa.'],
  [['genio_hioideo'], [C], 'Ramo sublingual da artéria lingual e artéria submentual (da facial), da carótida externa.'],
  [['estilo_hioideo'], [C], 'Ramos de artérias vizinhas da carótida externa (facial, occipital e auricular posterior).'],
  [['esternohioideo', 'esternotireoideo', 'tireohioideo', 'omohioideo'], [C], 'Ramos infra-hióideos das artérias tireóidea superior e lingual, da carótida externa.'],

  /* ═════════ Órbita e olho ═════════ */
  [['reto_sup', 'reto_med', 'obliquo_sup', 'levantador_palpebra'], [CI], 'Ramos musculares (lateral e medial) da artéria oftálmica, ramo da carótida interna.'],
  [['reto_lat'], [CI], 'Ramo muscular lateral da artéria oftálmica e ramos da artéria lacrimal, da carótida interna.'],
  [['reto_inf', 'obliquo_inf'], [CI, C], 'Ramo muscular medial da artéria oftálmica (carótida interna) e ramos da artéria infraorbital (da maxilar, carótida externa).'],
  [['tarsal_sup', 'tarsal_inf'], [CI], 'Arcos arteriais palpebrais superior e inferior, formados pelas artérias palpebrais mediais e laterais (ramos da oftálmica).'],
  [['ciliar', 'esfincter_pupila', 'dilatador_pupila'], [CI], 'Artérias ciliares posteriores longas e curtas e círculo arterial maior da íris (ramos da oftálmica, da carótida interna).'],

  /* ═════════ Língua, palato, faringe, laringe ═════════ */
  [['estiloglosso', 'hioglosso', 'genioglosso', 'lingua_long_sup', 'lingua_long_inf', 'lingua_transverso', 'lingua_vertical'], [C], 'Artéria lingual (ramos dorsais da língua, sublingual e artéria profunda da língua), da carótida externa.'],
  [['levantador_veu', 'tensor_veu', 'musculo_uvula', 'palatoglosso', 'palatofaringeo', 'salpingofaringeo'], [C], 'Artéria palatina ascendente (da facial), artérias palatinas descendentes (palatina maior e menores, da maxilar) e ramo palatino da faríngea ascendente, da carótida externa.'],
  [['tensor_timpano'], [C], 'Artéria timpânica superior (ramo da meníngea média, da maxilar).'],
  [['estapedio'], [C], 'Ramo estilomastóideo da artéria auricular posterior (ou da occipital).'],
  [['constritor_faringe_sup', 'constritor_faringe_med', 'estilofaringeo'], [C], 'Artéria faríngea ascendente e ramos faríngeos das artérias facial (palatina ascendente e tonsilar), lingual (dorsal da língua) e maxilar, da carótida externa.'],
  [['constritor_faringe_inf'], [C, 'arteria_tireoidea_inferior'], 'Artéria faríngea ascendente, ramos faríngeos da tireóidea superior (carótida externa) e da tireóidea inferior (tronco tireocervical, da subclávia).'],
  [['cricotireoideo'], [C], 'Artéria cricotireóidea, ramo da tireóidea superior (da carótida externa).'],
  [['cricoaritenoideo_post', 'cricoaritenoideo_lat', 'aritenoideo_transverso', 'aritenoideo_obliquo', 'tireoaritenoideo', 'vocal'], [C, 'arteria_tireoidea_inferior'], 'Artéria laríngea superior (ramo da tireóidea superior, da carótida externa) e artéria laríngea inferior (ramo da tireóidea inferior, do tronco tireocervical).'],

  /* ═════════ Músculos profundos do pescoço e da nuca ═════════ */
  [['iliocostal_cervical', 'longuissimo_cervical', 'longuissimo_cabeca', 'semiespinal_cervical', 'semiespinal_cabeca', 'rotadores_cervicais', 'interespinais_cervicais', 'intertransversarios_cerv_post'], ['arteria_tronco_costocervical', 'arteria_vertebral', C], 'Artéria cervical profunda (do tronco costocervical), ramos musculares da vertebral e da occipital (carótida externa) e cervical ascendente (da tireóidea inferior).'],
  [['esplenio_cabeca', 'esplenio_pescoco'], [C, 'arteria_cervical_transversa'], 'Ramos musculares da artéria occipital (carótida externa) e da cervical transversa (ramo profundo).'],
  [['reto_post_maior', 'reto_post_menor', 'obliquo_cabeca_sup', 'obliquo_cabeca_inf'], ['arteria_vertebral', C], 'Ramos musculares da artéria vertebral, no triângulo suboccipital, e da occipital (carótida externa).'],
  [['longo_cabeca', 'longo_pescoco'], ['arteria_tireoidea_inferior', 'arteria_vertebral'], 'Ramos da artéria tireóidea inferior (cervical ascendente), da vertebral e da faríngea ascendente.'],
  [['reto_ant_cabeca', 'reto_lat_cabeca'], ['arteria_vertebral', C], 'Ramos da artéria vertebral e da faríngea ascendente (carótida externa).'],
  [['intertransversarios_cerv_ant'], ['arteria_vertebral', 'arteria_tireoidea_inferior'], 'Ramos da artéria vertebral e da cervical ascendente (da tireóidea inferior).'],
  [['escaleno_ant', 'escaleno_med', 'escaleno_post', 'escaleno_minimo'], ['arteria_tireoidea_inferior', 'arteria_cervical_transversa'], 'Ramos da artéria tireóidea inferior (cervical ascendente) e da cervical transversa; ramos diretos da subclávia ao redor da inserção.'],

  /* ═════════ Cintura escapular e tórax ═════════ */
  [['peitoral_clav', 'peitoral_esternocostal', 'peitoral_abdominal'], ['arteria_toracoacromial', 'arteria_toracica_interna'], 'Ramos peitorais da artéria toracoacromial (da axilar) e ramos perfurantes e intercostais anteriores da torácica interna.'],
  [['peitoral_menor'], ['arteria_toracoacromial', 'arteria_toracica_lateral'], 'Ramos peitorais da toracoacromial e ramos da torácica lateral, ambas da artéria axilar.'],
  [['subclavio'], ['arteria_toracoacromial', 'arteria_supraescapular'], 'Ramo clavicular da toracoacromial (da axilar) e ramos da supraescapular (do tronco tireocervical).'],
  [['serratil_anterior'], ['arteria_toracica_lateral', 'arteria_toracodorsal', 'arteria_cervical_transversa'], 'Artéria torácica lateral (da axilar) e ramos da toracodorsal (da subescapular); a parte superior recebe também ramos da cervical transversa.'],
  [['trapezio_desc', 'trapezio_transv', 'trapezio_asc'], ['arteria_cervical_transversa', C, 'arteria_intercostais_posteriores'], 'Ramo superficial da artéria cervical transversa (principal), artéria occipital (carótida externa), ramos perfurantes das intercostais posteriores e ramo da dorsal da escápula.'],
  [['levantador_escapula'], ['arteria_cervical_transversa', 'arteria_escapular_dorsal'], 'Artéria cervical transversa (ramo ascendente), artéria dorsal da escápula e cervical ascendente (da tireóidea inferior).'],
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
  [['pubococcigeo', 'iliococcigeo', 'puborretal'], ['arteria_iliaca_interna'], 'Ramos da artéria pudenda interna (retal inferior), da glútea inferior e da vesical inferior (da ilíaca interna).'],
  [['coccigeo'], ['arteria_iliaca_interna'], 'Ramos da glútea inferior e das artérias sacrais laterais (da ilíaca interna).'],
  [['esfincter_anal_ext'], ['arteria_iliaca_interna'], 'Artéria retal inferior (ramo da pudenda interna, da ilíaca interna).'],
  [['obturador_interno'], ['arteria_iliaca_interna'], 'Artérias obturatória, pudenda interna e glútea inferior (da ilíaca interna).'],
  [['bulboesponjoso', 'isquiocavernoso', 'transverso_superficial_perineo', 'transverso_profundo_perineo', 'esfincter_uretra'], ['arteria_iliaca_interna'], 'Ramos da artéria pudenda interna (artéria perineal e artérias do bulbo e do corpo cavernoso do pênis), da ilíaca interna.'],

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
  [['gluteo_maximo'], ['arteria_iliaca_interna', 'arteria_femoral_profunda'], 'Artérias glútea inferior e glútea superior (ramo superficial), da ilíaca interna, com perfurantes da femoral profunda.'],
  [['gluteo_medio'], ['arteria_iliaca_interna'], 'Artéria glútea superior (ramos superficial e profundo), da ilíaca interna.'],
  [['gluteo_minimo'], ['arteria_iliaca_interna', 'arteria_circunflexa_femoral_lateral'], 'Artéria glútea superior (ramo profundo) e glútea inferior, da ilíaca interna; ramo ascendente da circunflexa femoral lateral.'],
  [['tensor_fascia_lata'], ['arteria_circunflexa_femoral_lateral', 'arteria_iliaca_interna'], 'Ramo ascendente da circunflexa femoral lateral e artéria glútea superior (da ilíaca interna).'],
  [['piriforme'], ['arteria_iliaca_interna'], 'Artérias glúteas superior e inferior e sacrais laterais (da ilíaca interna).'],
  [['gemeo_superior', 'gemeo_inferior'], ['arteria_iliaca_interna', 'arteria_femoral_profunda'], 'Artérias glútea inferior e pudenda interna (da ilíaca interna) e circunflexa femoral medial.'],
  [['obturador_externo'], ['arteria_iliaca_interna', 'arteria_femoral_profunda'], 'Ramo posterior da artéria obturatória (da ilíaca interna) e circunflexa femoral medial.'],
  [['quadrado_femoral'], ['arteria_femoral_profunda', 'arteria_iliaca_interna'], 'Ramo da circunflexa femoral medial e da glútea inferior (da ilíaca interna).'],
  [['sartorio'], ['arteria_femoral'], 'Ramos musculares da artéria femoral.'],
  [['reto_femoral'], ['arteria_circunflexa_femoral_lateral', 'arteria_femoral'], 'Ramos ascendente e descendente da circunflexa femoral lateral e ramos musculares da femoral.'],
  [['vasto_lateral', 'vasto_intermedio'], ['arteria_circunflexa_femoral_lateral', 'arteria_femoral_profunda'], 'Ramo descendente da circunflexa femoral lateral e perfurantes da femoral profunda; ramos musculares da femoral.'],
  [['vasto_medial'], ['arteria_femoral', 'arteria_genicular_descendente', 'arteria_femoral_profunda'], 'Ramos musculares da femoral, genicular descendente e femoral profunda.'],
  [['pectineo'], ['arteria_femoral', 'arteria_femoral_profunda', 'arteria_iliaca_interna'], 'Ramos da femoral e da femoral profunda e ramo anterior da obturatória (da ilíaca interna).'],
  [['adutor_longo'], ['arteria_femoral_profunda'], 'Artéria femoral profunda (ramos musculares e perfurantes).'],
  [['adutor_curto'], ['arteria_femoral_profunda', 'arteria_iliaca_interna'], 'Artéria femoral profunda, ramo anterior da obturatória (da ilíaca interna) e circunflexa femoral medial.'],
  [['adutor_magno', 'adutor_minimo'], ['arteria_femoral_profunda', 'arteria_iliaca_interna', 'arteria_genicular_descendente'], 'Perfurantes da femoral profunda, ramo posterior da obturatória (da ilíaca interna) e genicular descendente, com ramos da poplítea.'],
  [['gracil'], ['arteria_femoral_profunda', 'arteria_femoral'], 'Ramos musculares da femoral profunda e da femoral.'],
  [['biceps_femoral_longa', 'semitendineo', 'semimembranaceo'], ['arteria_femoral_profunda', 'arteria_poplitea', 'arteria_iliaca_interna'], 'Perfurantes da femoral profunda, glútea inferior (parte proximal) e ramos musculares da poplítea.'],
  [['biceps_femoral_curta'], ['arteria_femoral_profunda', 'arteria_poplitea'], 'Perfurantes da femoral profunda e ramos musculares da poplítea.'],
];
