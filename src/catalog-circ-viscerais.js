/**
 * Circulatório, segunda leva de vasos do BodyParts3D (F5.2): artérias do polígono de Willis e da órbita, ramos do tronco celíaco e das
 * mesentéricas, suprarrenais, bronquiais e esofágicas; veia porta e afluentes, veias hepáticas, veias da pelve, da mão e do pé. Malhas
 * reais no pacote `anatomy-circ.js`. Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.).
 *
 * Os órgãos de onde saem ou para onde vão (fígado, estômago, intestinos, baço, pâncreas, rins) entram com o digestório e o urinário; aqui
 * ficam os troncos e os ramos principais, sem a árvore segmentar de cada víscera (M23).
 */
import { art, vein } from './catalog-circ.js';

const T = 'tronco';
const H = 'cabeca';

export const CIRC_VISCERAIS = [
  /* ═════════════ Encéfalo e órbita ═════════════ */
  art('arteria_oftalmica', 'Artéria oftálmica', 'Arteria ophthalmica', H, ['arteria_oftalmica'], {
    origem: 'Artéria carótida interna, logo depois de ela sair do seio cavernoso, medial ao processo clinoide anterior.',
    trajeto: 'Entra na órbita pelo canal óptico, abaixo e lateral ao nervo óptico, e o cruza por cima para chegar à parede medial da órbita.',
    ramos: 'Artéria central da retina, ciliares posteriores curtas e longas, lacrimal, supraorbital, etmoidais anterior e posterior, palpebrais, supratroclear e dorsal do nariz.',
    territorio: 'Olho, músculos extraoculares e pálpebras, glândula lacrimal, parte da cavidade nasal e a pele da fronte e do dorso do nariz.',
    nota: 'A oclusão da artéria central da retina causa cegueira súbita de um olho. A dorsal do nariz se anastomosa com a artéria facial, uma via entre as circulações da carótida interna e da externa.',
  }, { relacionados: ['arteria_carotida_interna'] }),
  art('arteria_basilar', 'Artéria basilar', 'Arteria basilaris', H, ['arteria_basilar'], {
    origem: 'União das duas artérias vertebrais, na margem inferior da ponte.',
    trajeto: 'Sobe pelo sulco basilar da ponte e termina, na cisterna interpeduncular, nas duas artérias cerebrais posteriores.',
    ramos: 'Pontinas, labiríntica, cerebelar inferior anterior, cerebelar superior e, como ramos terminais, as cerebrais posteriores.',
    territorio: 'Ponte, cerebelo, parte do mesencéfalo e a parte posterior dos hemisférios (lobo occipital e parte do temporal).',
    nota: 'É a parte posterior da circulação encefálica. A oclusão da basilar causa síndromes graves do tronco encefálico (paralisias de nervos cranianos, alterações da consciência).',
  }, { relacionados: ['arteria_vertebral', 'arteria_cerebral_posterior', 'arteria_cerebelar_superior', 'arteria_cerebelar_inferior_anterior'] }),
  art('arteria_cerebral_anterior', 'Artéria cerebral anterior', 'Arteria cerebri anterior', H, ['arteria_cerebral_anterior'], {
    origem: 'Ramo terminal medial da artéria carótida interna.',
    trajeto: 'Segue para a frente e para a linha mediana, onde se liga à do outro lado pela artéria comunicante anterior, e contorna o joelho do corpo caloso na fissura longitudinal do cérebro.',
    ramos: 'Artérias pericalosa e calosomarginal, com ramos frontais, paracentrais e parietais mediais.',
    territorio: 'Face medial dos hemisférios cerebrais e uma faixa superior da face lateral; nela, a área motora e sensitiva do membro inferior.',
    nota: 'A oclusão causa fraqueza e perda da sensibilidade do membro inferior do lado oposto, mais que do membro superior ou da face.',
  }, { relacionados: ['arteria_carotida_interna', 'arteria_comunicante_anterior'] }),
  art('arteria_cerebral_media', 'Artéria cerebral média', 'Arteria cerebri media', H, ['arteria_cerebral_media'], {
    origem: 'Ramo terminal lateral e maior da artéria carótida interna.',
    trajeto: 'Entra no sulco lateral (fissura de Sylvius) e se ramifica sobre a ínsula e a face lateral do hemisfério; antes disso dá as artérias centrais (lenticuloestriadas).',
    ramos: 'Artérias lenticuloestriadas (para os núcleos da base e a cápsula interna) e ramos corticais frontais, parietais e temporais.',
    territorio: 'Quase toda a face lateral do hemisfério, com as áreas motora e sensitiva da face e do membro superior e, do lado dominante, as áreas da linguagem; núcleos da base e cápsula interna.',
    nota: 'É a artéria mais atingida pelo acidente vascular cerebral isquêmico: fraqueza e perda da sensibilidade da face e do braço do lado oposto, com afasia se for o hemisfério dominante. As lenticuloestriadas, finas, são as que mais se rompem na hemorragia cerebral hipertensiva.',
  }, { relacionados: ['arteria_carotida_interna'] }),
  art('arteria_cerebral_posterior', 'Artéria cerebral posterior', 'Arteria cerebri posterior', H, ['arteria_cerebral_posterior'], {
    origem: 'Ramo terminal da artéria basilar (em uma parte das pessoas, nasce da carótida interna).',
    trajeto: 'Contorna o pedúnculo cerebral e passa sobre a tenda do cerebelo, recebendo, ao lado, a artéria comunicante posterior.',
    ramos: 'Artérias talamoperfurantes, coróideas posteriores e ramos corticais temporais inferiores, occipitais e calcarinos.',
    territorio: 'Face inferior do lobo temporal, lobo occipital (córtex visual) e parte do tálamo.',
    nota: 'A oclusão causa hemianopsia homônima do lado oposto, geralmente com a visão central preservada.',
  }, { relacionados: ['arteria_basilar', 'arteria_comunicante_posterior'] }),
  art('arteria_comunicante_anterior', 'Artéria comunicante anterior', 'Arteria communicans anterior', H, ['arteria_comunicante_anterior'], {
    origem: 'Liga as duas artérias cerebrais anteriores, à frente do quiasma óptico.',
    trajeto: 'É curta, com cerca de 2 mm de diâmetro, e fecha o círculo arterial do cérebro (polígono de Willis) pela frente.',
    ramos: 'Pequenos ramos perfurantes para o hipotálamo e o quiasma.',
    territorio: 'Hipotálamo anterior e vias ópticas; seu papel é equilibrar o fluxo entre os dois hemisférios.',
    nota: 'O polígono de Willis é formado pelas comunicantes anterior e posteriores, pelas cerebrais anteriores, pelas carótidas internas e pelas cerebrais posteriores. A comunicante anterior é a sede mais comum dos aneurismas saculares; a rotura causa hemorragia subaracnóidea.',
  }, { relacionados: ['arteria_cerebral_anterior'] }),
  art('arteria_comunicante_posterior', 'Artéria comunicante posterior', 'Arteria communicans posterior', H, ['arteria_comunicante_posterior'], {
    origem: 'Artéria carótida interna, perto de sua terminação.',
    trajeto: 'Segue para trás e se une à artéria cerebral posterior, ligando as circulações da carótida interna e da basilar.',
    ramos: 'Ramos centrais (talamoperfurantes e hipotalâmicos).',
    territorio: 'Hipotálamo, parte do tálamo e da cápsula interna.',
    nota: 'Permite que uma das circulações supra a outra se houver obstrução (anastomose entre a carótida e a vertebrobasilar). A junção com a carótida interna é, depois da comunicante anterior, a sede mais comum de aneurismas; o nervo oculomotor passa ao lado e pode ser comprimido (paralisia da pupila e do olhar).',
  }, { relacionados: ['arteria_carotida_interna', 'arteria_cerebral_posterior'] }),
  art('arteria_cerebelar_superior', 'Artéria cerebelar superior', 'Arteria superior cerebelli', H, ['arteria_cerebelar_superior'], {
    origem: 'Artéria basilar, logo antes de ela se dividir nas cerebrais posteriores.',
    trajeto: 'Contorna o mesencéfalo, abaixo do nervo oculomotor e da artéria cerebral posterior, até a face superior do cerebelo.',
    ramos: 'Ramos para o mesencéfalo inferior, a lâmina quadrigêmea e a face superior do cerebelo e núcleos cerebelares.',
    territorio: 'Parte superior do cerebelo e mesencéfalo.',
  }, { label: false, relacionados: ['arteria_basilar'] }),
  art('arteria_cerebelar_inferior_anterior', 'Artéria cerebelar inferior anterior', 'Arteria inferior anterior cerebelli', H, ['arteria_cerebelar_inferior_anterior'], {
    origem: 'Artéria basilar, perto do início.',
    trajeto: 'Passa para o ângulo pontocerebelar, junto aos nervos facial e vestibulococlear, e chega à parte anterior da face inferior do cerebelo.',
    ramos: 'Artéria do labirinto (labiríntica), que leva o sangue ao ouvido interno, e ramos para a ponte e o cerebelo.',
    territorio: 'Parte anterior e inferior do cerebelo, parte inferior da ponte e ouvido interno (pela artéria do labirinto).',
    nota: 'A oclusão pode causar vertigem, surdez e fraqueza facial do mesmo lado, porque a artéria do labirinto e os nervos facial e vestibulococlear estão próximos.',
  }, { label: false, relacionados: ['arteria_basilar'] }),

  /* ═════════════ Ramos do tronco celíaco ═════════════ */
  art('arteria_hepatica_comum', 'Artéria hepática comum', 'Arteria hepatica communis', T, ['arteria_hepatica_comum'], {
    origem: 'Tronco celíaco.',
    trajeto: 'Segue para a direita ao longo da margem superior da cabeça do pâncreas e se divide em artéria hepática própria e artéria gastroduodenal.',
    ramos: 'Hepática própria e gastroduodenal; a artéria gástrica direita também pode nascer dela.',
    territorio: 'Fígado, vesícula biliar, estômago, duodeno e pâncreas (pelos ramos).',
  }, { label: false, relacionados: ['arteria_tronco_celiaco', 'arteria_hepatica_propria', 'arteria_gastroduodenal'] }),
  art('arteria_hepatica_propria', 'Artéria hepática própria', 'Arteria hepatica propria', T, ['arteria_hepatica_propria'], {
    origem: 'Hepática comum, depois da origem da gastroduodenal.',
    trajeto: 'Sobe no ligamento hepatoduodenal, à frente da veia porta e à esquerda do ducto colédoco, e se divide em ramos direito e esquerdo no hilo do fígado.',
    ramos: 'Ramos direito (com a artéria cística, que irriga a vesícula biliar) e esquerdo; a artéria gástrica direita nasce dela ou da hepática comum.',
    territorio: 'Fígado e vesícula biliar.',
    nota: 'No ligamento hepatoduodenal, ao lado do colédoco e da veia porta, forma a tríade portal. A artéria cística, ramo do ramo direito, passa pelo triângulo cisto-hepático (de Calot), referência da colecistectomia, e pode ser lesada nela.',
  }, { label: false, relacionados: ['arteria_hepatica_comum', 'veia_porta'] }),
  art('arteria_gastroduodenal', 'Artéria gastroduodenal', 'Arteria gastroduodenalis', T, ['arteria_gastroduodenal'], {
    origem: 'Hepática comum, atrás da parte superior do duodeno.',
    trajeto: 'Desce atrás do duodeno e se divide em gastromental direita e pancreaticoduodenal superior anterior.',
    ramos: 'Artéria gastromental direita (curvatura maior do estômago) e artérias pancreaticoduodenais superiores anterior e posterior.',
    territorio: 'Parte do estômago (curvatura maior), duodeno e cabeça do pâncreas.',
    nota: 'Passa atrás da parte superior do duodeno: uma úlcera duodenal posterior pode erodir a artéria e causar hemorragia grave.',
  }, { label: false, relacionados: ['arteria_hepatica_comum', 'arteria_pancreaticoduodenais'] }),
  art('arteria_esplenica', 'Artéria esplênica', 'Arteria splenica (lienalis)', T, ['arteria_esplenica'], {
    origem: 'Tronco celíaco; é o maior ramo dele.',
    trajeto: 'Sinuosa, segue para a esquerda ao longo da margem superior do pâncreas, atrás do estômago, e pelo ligamento esplenorrenal chega ao hilo do baço.',
    ramos: 'Pancreáticas (incluindo a magna e a dorsal), gástricas curtas, gastromental esquerda e ramos esplênicos terminais.',
    territorio: 'Baço, parte do pâncreas e parte do estômago (fundo e curvatura maior).',
    nota: 'A artéria é tortuosa e pode ter aneurismas, mais frequentes em mulheres; a ruptura do baço (trauma abdominal) pode exigir a ligadura do pedículo ou a esplenectomia.',
  }, { relacionados: ['arteria_tronco_celiaco', 'veia_esplenica'] }),
  art('arteria_gastrica_esquerda', 'Artéria gástrica esquerda', 'Arteria gastrica sinistra', T, ['arteria_gastrica_esquerda'], {
    origem: 'Tronco celíaco; é o menor dos três ramos.',
    trajeto: 'Sobe até a junção esofagogástrica, dá os ramos esofágicos e desce na curvatura menor do estômago.',
    ramos: 'Ramos esofágicos e ramos gástricos, que se anastomosam com os da gástrica direita.',
    territorio: 'Parte abdominal do esôfago e parte superior da curvatura menor do estômago.',
    nota: 'Seus ramos esofágicos se anastomosam com as esofágicas da aorta; as veias gástricas esquerdas ligam o sistema porta ao sistema ázigo, e daí as varizes esofágicas na hipertensão portal.',
  }, { label: false, relacionados: ['arteria_tronco_celiaco', 'arteria_gastrica_direita', 'arteria_esofagicas'] }),
  art('arteria_gastrica_direita', 'Artéria gástrica direita', 'Arteria gastrica dextra', T, ['arteria_gastrica_direita'], {
    origem: 'Artéria hepática própria (ou, às vezes, a hepática comum).',
    trajeto: 'Desce até o piloro e segue para a esquerda ao longo da curvatura menor, até encontrar a gástrica esquerda.',
    ramos: 'Ramos gástricos e duodenais.',
    territorio: 'Piloro e parte inferior da curvatura menor do estômago.',
  }, { label: false, relacionados: ['arteria_hepatica_propria', 'arteria_gastrica_esquerda'] }),
  art('arteria_pancreaticoduodenais', 'Artérias pancreaticoduodenais', 'Arteriae pancreaticoduodenales', T, ['arteria_pancreaticoduodenais'], {
    origem: 'As superiores (anterior e posterior) vêm da gastroduodenal; a inferior, da artéria mesentérica superior.',
    trajeto: 'Formam duas arcadas, anterior e posterior, na cabeça do pâncreas, entre o duodeno e o pâncreas.',
    ramos: 'Ramos pancreáticos e duodenais.',
    territorio: 'Cabeça do pâncreas e duodeno.',
    nota: 'As arcadas ligam o tronco celíaco à mesentérica superior: é a principal via colateral entre as duas, na oclusão de uma delas.',
  }, { label: false, relacionados: ['arteria_gastroduodenal', 'arteria_mesenterica_superior'] }),

  /* ═════════════ Ramos das mesentéricas ═════════════ */
  art('arteria_ileocolica', 'Artéria ileocólica', 'Arteria ileocolica', T, ['arteria_ileocolica'], {
    origem: 'Artéria mesentérica superior; é o último ramo da face direita.',
    trajeto: 'Desce para a fossa ilíaca direita, na raiz do mesentério, e se divide em ramos ascendente (cólico) e descendentes (cecais, ileal e apendicular).',
    ramos: 'Ramo cólico, cecais anterior e posterior, apendicular e ileal.',
    territorio: 'Parte terminal do íleo, ceco, apêndice vermiforme e parte inferior do colo ascendente.',
  }, { label: false, relacionados: ['arteria_mesenterica_superior', 'arteria_apendicular'] }),
  art('arteria_apendicular', 'Artéria apendicular', 'Arteria appendicularis', T, ['arteria_apendicular'], {
    origem: 'Artéria ileocólica.',
    trajeto: 'Passa por trás do íleo terminal e desce no mesoapêndice, na borda livre, até a ponta do apêndice.',
    ramos: 'Pequenos ramos para o apêndice.',
    territorio: 'Apêndice vermiforme.',
    nota: 'O apêndice depende dela, com poucas colaterais; a trombose pela inflamação (apendicite) leva à isquemia e à gangrena do apêndice, com risco de perfuração.',
  }, { label: false, relacionados: ['arteria_ileocolica'] }),
  art('arteria_colica_media', 'Artéria cólica média', 'Arteria colica media', T, ['arteria_colica_media'], {
    origem: 'Artéria mesentérica superior, logo abaixo da cabeça do pâncreas.',
    trajeto: 'Entra no mesocolo transverso e se divide em ramos direito e esquerdo.',
    ramos: 'Ramos que se anastomosam com a cólica direita e com a cólica esquerda, formando a artéria marginal do colo.',
    territorio: 'Colo transverso.',
    nota: 'A artéria marginal (arcada de Drummond) liga as mesentéricas superior e inferior e mantém o suprimento do colo se uma delas falhar.',
  }, { label: false, relacionados: ['arteria_mesenterica_superior', 'arteria_colica_esquerda'] }),
  art('arteria_colica_esquerda', 'Artéria cólica esquerda', 'Arteria colica sinistra', T, ['arteria_colica_esquerda'], {
    origem: 'Artéria mesentérica inferior.',
    trajeto: 'Sobe, atrás do peritônio, e se divide em ramos ascendente e descendente.',
    ramos: 'Ramo ascendente (anastomose com a cólica média) e ramo descendente (anastomose com as sigmoideas).',
    territorio: 'Terço distal do colo transverso, flexura esquerda e colo descendente.',
  }, { label: false, relacionados: ['arteria_mesenterica_inferior', 'arteria_colica_media', 'arteria_sigmoideas'] }),
  art('arteria_sigmoideas', 'Artérias sigmoideas', 'Arteriae sigmoideae', T, ['arteria_sigmoideas'], {
    origem: 'Artéria mesentérica inferior (duas a quatro).',
    trajeto: 'Descem para a esquerda, no mesocolo sigmoide, e se anastomosam com a cólica esquerda e com a retal superior.',
    ramos: 'Ramos ascendente e descendente.',
    territorio: 'Colo sigmoide e junção retossigmoide.',
  }, { label: false, relacionados: ['arteria_mesenterica_inferior', 'arteria_colica_esquerda', 'arteria_retal_superior'] }),
  art('arteria_retal_superior', 'Artéria retal superior', 'Arteria rectalis superior', T, ['arteria_retal_superior'], {
    origem: 'Continuação da artéria mesentérica inferior, depois de ela cruzar os vasos ilíacos comuns esquerdos.',
    trajeto: 'Desce no mesorreto e se divide em dois ramos que chegam ao reto.',
    ramos: 'Ramos direito e esquerdo, que se anastomosam com as retais média e inferior (da ilíaca interna).',
    territorio: 'Parte superior do reto.',
    nota: 'As anastomoses com as retais média e inferior ligam as circulações da mesentérica inferior e da ilíaca interna; as veias correspondentes ligam o sistema porta ao sistema cava (hemorroidas).',
  }, { label: false, relacionados: ['arteria_mesenterica_inferior', 'arteria_sigmoideas'] }),

  /* ═════════════ Outros ramos da aorta ═════════════ */
  art('arteria_suprarrenais', 'Artérias suprarrenais média e inferior', 'Arteriae suprarenales mediae et inferiores', T, ['arteria_suprarrenais'], {
    origem: 'A média nasce da aorta abdominal, perto da origem da mesentérica superior; a inferior, da artéria renal. A superior (da frênica inferior) não existe no modelo.',
    trajeto: 'Cruzam o pilar do diafragma e chegam à glândula suprarrenal.',
    ramos: 'Ramos para a glândula, que formam uma rede subcapsular.',
    territorio: 'Glândulas suprarrenais.',
    nota: 'Cada suprarrenal recebe artérias de três origens (frênica inferior, aorta e renal) e é drenada por uma única veia: a direita vai à veia cava inferior, e a esquerda, à veia renal esquerda.',
  }, { label: false, relacionados: ['aorta_abdominal', 'arteria_renal', 'veia_suprarrenal'] }),
  art('arteria_bronquial', 'Artéria bronquial', 'Arteria bronchialis', T, ['arteria_bronquial'], {
    origem: 'Parte torácica da aorta (as esquerdas) ou uma artéria intercostal posterior (a direita); em geral duas à esquerda e uma à direita.',
    trajeto: 'Acompanham os brônquios principais e se ramificam junto com a árvore brônquica, até os bronquíolos respiratórios.',
    ramos: 'Ramos para os brônquios, o tecido de sustentação do pulmão, a pleura visceral e os linfonodos do hilo.',
    territorio: 'Parede dos brônquios, tecido conjuntivo do pulmão e pleura visceral (a troca de gases usa as artérias pulmonares).',
    nota: 'A circulação bronquial é a nutrição do tecido do pulmão; as veias bronquiais drenam, em parte, para o sistema ázigo e, em parte, para as veias pulmonares. Nas bronquiectasias e em outras doenças, as artérias bronquiais podem aumentar e causar hemoptise.',
  }, { label: false, relacionados: ['aorta_toracica', 'bronquio_principal_d', 'bronquio_principal_e'] }),
  art('arteria_esofagicas', 'Artérias esofágicas', 'Arteriae oesophageales', T, ['arteria_esofagicas'], {
    origem: 'Parte torácica da aorta (três a cinco ramos), além das artérias tireóidea inferior (parte cervical) e gástrica esquerda (parte abdominal).',
    trajeto: 'Chegam ao esôfago por vários níveis e formam uma rede na parede.',
    ramos: 'Ramos ascendentes e descendentes que se anastomosam entre si.',
    territorio: 'Esôfago, na parte torácica.',
    nota: 'O esôfago tem irrigação segmentar: a tireóidea inferior (cervical), a aorta (torácica) e a gástrica esquerda (abdominal), com anastomoses longitudinais.',
  }, { label: false, relacionados: ['aorta_toracica', 'arteria_gastrica_esquerda'] }),

  /* ═════════════ Veias ═════════════ */
  vein('veia_porta', 'Veia porta e ramos direito e esquerdo', 'Vena portae hepatis', T, ['veia_porta'], {
    origem: 'União das veias mesentérica superior e esplênica, por trás do colo do pâncreas, ao nível de L1–L2.',
    trajeto: 'Sobe, por trás da parte superior do duodeno, no ligamento hepatoduodenal, posterior à artéria hepática própria e ao ducto colédoco, e se divide em ramos direito e esquerdo no hilo do fígado, onde se ramifica nos sinusoides hepáticos.',
    ramos: 'Tributárias: mesentérica superior, esplênica (com a mesentérica inferior), gástricas esquerda e direita, pré-pilórica e cística.',
    territorio: 'Leva ao fígado o sangue de todo o tubo digestório abdominal (do esôfago abdominal ao reto superior), pâncreas, vesícula biliar e baço.',
    nota: 'A veia porta não tem valvas. Na hipertensão portal (cirrose), o sangue desvia para as anastomoses portossistêmicas: esofágicas (varizes esofágicas), retais (hemorroidas), paraumbilicais (cabeça de medusa) e retroperitoneais. O tronco tem cerca de 8 cm.',
  }, { relacionados: ['veia_esplenica', 'veia_mesenterica_superior', 'veia_mesenterica_inferior', 'veia_hepaticas', 'arteria_hepatica_propria'] }),
  vein('veia_esplenica', 'Veia esplênica', 'Vena splenica (lienalis)', T, ['veia_esplenica'], {
    origem: 'Veias do hilo do baço.',
    trajeto: 'Segue para a direita, atrás do pâncreas e abaixo da artéria esplênica, e se une à mesentérica superior por trás do colo do pâncreas.',
    ramos: 'Gástricas curtas, gastromental esquerda, pancreáticas e, em geral, a veia mesentérica inferior.',
    territorio: 'Baço, parte do estômago e do pâncreas e, pela mesentérica inferior, o colo descendente e o reto superior.',
  }, { label: false, relacionados: ['veia_porta', 'arteria_esplenica', 'veia_mesenterica_inferior'] }),
  vein('veia_mesenterica_superior', 'Veia mesentérica superior', 'Vena mesenterica superior', T, ['veia_mesenterica_superior'], {
    origem: 'Veias do íleo e do ceco, na fossa ilíaca direita.',
    trajeto: 'Sobe na raiz do mesentério, à direita da artéria mesentérica superior, e se une à esplênica por trás do colo do pâncreas.',
    ramos: 'Veias jejunais, ileais, ileocólica, cólica direita e média, gastromental direita e pancreaticoduodenais.',
    territorio: 'Intestino delgado, ceco, colo ascendente e colo transverso, e parte do estômago e do pâncreas.',
  }, { label: false, relacionados: ['veia_porta', 'arteria_mesenterica_superior'] }),
  vein('veia_mesenterica_inferior', 'Veia mesentérica inferior', 'Vena mesenterica inferior', T, ['veia_mesenterica_inferior'], {
    origem: 'Veia retal superior e veias sigmoideas.',
    trajeto: 'Sobe à esquerda da flexura duodenojejunal, atrás do pâncreas, e desemboca na veia esplênica (às vezes, na mesentérica superior ou na junção das duas).',
    ramos: 'Veias retal superior, sigmoideas e cólica esquerda.',
    territorio: 'Colo descendente, colo sigmoide e parte superior do reto.',
  }, { label: false, relacionados: ['veia_porta', 'veia_esplenica', 'arteria_mesenterica_inferior'] }),
  vein('veia_hepaticas', 'Veias hepáticas', 'Venae hepaticae', T, ['veia_hepaticas'], {
    origem: 'Veias centrais dos lóbulos hepáticos; as veias direita, média e esquerda são as três principais.',
    trajeto: 'Saem do fígado pela face posterior (a "área nua") e desembocam na veia cava inferior, logo abaixo do diafragma, ao nível de T8.',
    ramos: 'Tributárias intersegmentares do fígado.',
    territorio: 'Fígado: levam à cava o sangue que veio da veia porta e da artéria hepática.',
    nota: 'Não têm valvas. A trombose das veias hepáticas é a síndrome de Budd-Chiari (dor, ascite e aumento do fígado). As veias intersegmentares são as referências para dividir o fígado em segmentos nas cirurgias.',
  }, { label: false, relacionados: ['veia_cava_inferior', 'veia_porta'] }),
  vein('veia_suprarrenal', 'Veia suprarrenal', 'Vena suprarenalis', T, ['veia_suprarrenal'], {
    origem: 'Hilo da glândula suprarrenal; há uma central em cada lado.',
    trajeto: 'A direita é curta e desemboca direto na veia cava inferior; a esquerda desce e desemboca na veia renal esquerda, junto com a veia frênica inferior.',
    ramos: 'Pequenas veias da glândula.',
    territorio: 'Glândulas suprarrenais.',
    nota: 'A suprarrenal direita, curta, torna a adrenalectomia direita difícil: a veia é curta e vai direto à cava.',
  }, { label: false, relacionados: ['veia_cava_inferior', 'veia_renal', 'arteria_suprarrenais'] }),
  vein('veia_lombar_ascendente', 'Veia lombar ascendente', 'Vena lumbalis ascendens', T, ['veia_lombar_ascendente'], {
    origem: 'Liga as veias lombares, a iliolombar e a ilíaca comum, de cada lado da coluna.',
    trajeto: 'Sobe à frente dos processos transversos das vértebras lombares, atrás do psoas maior, e continua como a veia ázigo (à direita) e a hemiázigo (à esquerda), atravessando o pilar do diafragma.',
    ramos: 'Veias lombares e subcostal.',
    territorio: 'Parede posterior do abdome e plexos venosos vertebrais.',
    nota: 'É um dos ramos da via colateral cava-cava (a veia cava inferior obstruída desvia o sangue pelas lombares ascendentes, ázigo e hemiázigo à veia cava superior).',
  }, { label: false, relacionados: ['veia_azigo', 'veia_hemiazigo'] }),
  vein('veia_sacral_mediana', 'Veia sacral mediana', 'Vena sacralis mediana', T, ['veia_sacral_mediana'], {
    origem: 'Face anterior do sacro e do cóccix; acompanha a artéria sacral mediana.',
    trajeto: 'Sobe na linha mediana e desemboca na veia ilíaca comum esquerda, perto da junção das duas ilíacas comuns.',
    ramos: 'Veias sacrais pequenas.',
    territorio: 'Sacro e cóccix.',
  }, { label: false, relacionados: ['veia_iliaca_comum', 'veia_iliaca_interna'] }),
  vein('veia_gluteas', 'Veias glúteas superior e inferior', 'Venae gluteae superiores et inferiores', T, ['veia_gluteas'], {
    origem: 'Veias dos músculos glúteos, da região glútea e da parte posterior da coxa; acompanham as artérias glúteas superior e inferior.',
    trajeto: 'Saem da região glútea pelo forame isquiático maior, acima (a superior) e abaixo (a inferior) do piriforme, e desembocam na veia ilíaca interna.',
    ramos: 'Veias musculares e cutâneas da região glútea.',
    territorio: 'Músculos glúteos, parte posterior da coxa e quadril.',
  }, { label: false, relacionados: ['veia_iliaca_interna'] }),
  vein('veia_pudenda_interna', 'Veia pudenda interna', 'Vena pudenda interna', T, ['veia_pudenda_interna'], {
    origem: 'Veias do períneo e da genitália externa (dorsal profunda do pênis ou do clitóris, perineais e retais inferiores).',
    trajeto: 'Acompanha a artéria pudenda interna e o nervo pudendo, saindo pelo forame isquiático maior, passando pelo forame menor e pelo canal pudendo (de Alcock), na parede da fossa isquioanal, e desemboca na veia ilíaca interna.',
    ramos: 'Veias retais inferiores, perineais e a veia dorsal profunda do pênis ou do clitóris.',
    territorio: 'Períneo, genitália externa e parte inferior do canal anal.',
  }, { label: false, relacionados: ['veia_iliaca_interna'] }),
  vein('veia_obturatoria', 'Veia obturatória', 'Vena obturatoria', T, ['veia_obturatoria'], {
    origem: 'Veias dos músculos adutores e da região do canal obturatório.',
    trajeto: 'Atravessa o canal obturatório com o nervo e a artéria, segue pela parede lateral da pelve e desemboca na veia ilíaca interna.',
    ramos: 'Veias musculares e cutâneas da região medial da coxa.',
    territorio: 'Adutores da coxa e região do quadril.',
  }, { label: false, relacionados: ['veia_iliaca_interna'] }),
  vein('veia_radial', 'Veias radiais', 'Venae radiales', 'membro_sup', ['veia_radial'], {
    origem: 'Duas veias comitantes da artéria radial, que nascem do arco venoso palmar profundo.',
    trajeto: 'Sobem pelo antebraço, uma de cada lado da artéria radial, e se unem às veias ulnares para formar as veias braquiais.',
    ramos: 'Veias musculares do antebraço e comunicantes com as veias superficiais.',
    territorio: 'Parte lateral e posterior do antebraço e do lado radial da mão.',
  }, { label: false, relacionados: ['arteria_radial', 'veia_braquial'] }),
  vein('veia_rede_dorsal_mao', 'Rede venosa dorsal da mão', 'Rete venosum dorsale manus', 'membro_sup', ['veia_rede_dorsal_mao'], {
    origem: 'Veias digitais dorsais e metacarpais dorsais.',
    trajeto: 'Forma uma rede subcutânea no dorso da mão; do lado lateral nasce a veia cefálica e do lado medial, a veia basílica.',
    ramos: 'Veias cefálica (lateral) e basílica (medial).',
    territorio: 'Pele e tecido subcutâneo da mão.',
    nota: 'É sede comum de punção venosa e de cateteres periféricos.',
  }, { label: false, relacionados: ['veia_cefalica', 'veia_basilica'] }),
  vein('veia_arco_dorsal_pe', 'Arco venoso dorsal do pé', 'Arcus venosus dorsalis pedis', 'membro_inf', ['veia_arco_dorsal_pe'], {
    origem: 'Veias digitais dorsais e metatársicas dorsais.',
    trajeto: 'Forma um arco subcutâneo no dorso do pé; a extremidade medial dá origem à veia safena magna e a lateral, à veia safena parva.',
    ramos: 'Veias safenas magna e parva.',
    territorio: 'Pele e tecido subcutâneo do pé.',
    nota: 'A veia safena magna, na frente do maléolo medial, é local de acesso venoso em emergências (flebotomia).',
  }, { label: false, relacionados: ['veia_safena_magna', 'veia_safena_parva'] }),
  vein('veia_hemiazigo_acessoria', 'Veia hemiázigo acessória', 'Vena hemiazygos accessoria', T, ['veia_hemiazigo_acessoria'], {
    origem: 'Veias intercostais posteriores esquerdas superiores (da 4ª à 8ª).',
    trajeto: 'Desce no lado esquerdo da coluna torácica e, ao nível de T7 ou T8, cruza para a direita e se une à veia ázigo, ou à hemiázigo.',
    ramos: 'Veias intercostais posteriores esquerdas e veias esofágicas e mediastinais.',
    territorio: 'Parte superior da parede posterior esquerda do tórax.',
  }, { label: false, relacionados: ['veia_hemiazigo', 'veia_azigo'] }),
  vein('veia_toracica_interna', 'Veias torácicas internas', 'Venae thoracicae internae', T, ['veia_toracica_interna'], {
    origem: 'Veias epigástrica superior e musculofrênica.',
    trajeto: 'Acompanham a artéria torácica interna, por trás das cartilagens costais (duas veias por artéria, que se fundem em uma só na parte superior) e desembocam na veia braquiocefálica.',
    ramos: 'Veias intercostais anteriores e perfurantes (da mama).',
    territorio: 'Parede anterior do tórax e da parte superior do abdome e parte da mama.',
  }, { label: false, relacionados: ['arteria_toracica_interna', 'veia_braquiocefalica'] }),
];
