/**
 * Sistema digestório e baço (F6.2): tubo digestório (esôfago, estômago, duodeno, jejuno, íleo, ceco, apêndice vermiforme, colos
 * ascendente, transverso, descendente e sigmoide, tênias do colo, reto e canal anal), fígado (lobos caudado e quadrado e segmentos
 * funcionais de Couinaud I a VIII), vesícula biliar e vias biliares extra-hepáticas (ductos hepáticos direito, esquerdo e comum,
 * ducto cístico e ducto colédoco), pâncreas e ducto pancreático, baço e pregas peritoneais (mesentério, mesocolo transverso e
 * mesoapêndice). Malhas reais do BodyParts3D (`dist/anatomy-digest.js`).
 *
 * Textos próprios, a partir de Moore, Dalley & Agur (Anatomia Orientada para a Clínica, 8ª ed.), Gray's Anatomy (42ª ed.) e
 * Terminologia Anatômica; divergências entre fontes ficam na `nota`.
 */

const T = 'tronco';

const C_TUBO = '#cf7e6b';
const C_DELGADO = '#d88c76';
const C_GROSSO = '#c47260';
const C_FIGADO = '#96463c';
const C_BILE = '#568c52';
const C_PANCREAS = '#dcb478';
const C_BACO = '#82374c';
const C_PERITONIO = '#dfb888';

// Os nomes em português seguem a divisão cirúrgica de Couinaud (Brisbane 2000): setores anterior e posterior, segmentos
// superior e inferior. O latim é o da TA, que usa uma nomenclatura mais antiga: lá "anterior" é o segmento inferior (caudal) e
// "posterior" o superior, e "lateral/medial" correspondem aos setores posterior/anterior do lobo direito. Os nomes parecem se
// contradizer (o VI é "posterior" num e "anterior" no outro), mas descrevem o mesmo segmento: a nota explica.
const notaTA = (n, ta, pt) => `Nomenclatura: o latim da Terminologia Anatômica chama o segmento ${n} de “${ta}”, e a divisão cirúrgica (Couinaud, revista em Brisbane, 2000) o descreve como ${pt}. É o mesmo segmento: a TA usa uma nomenclatura mais antiga, que chama de anterior o segmento inferior e de posterior o superior e, no lobo direito, chama de lateral e medial os setores que a cirurgia chama de posterior e anterior.`;

const dig = (id, name, latin, region, parts, color, d, extra = {}) => ({
  kind: extra.kind ?? 'orgao',
  id,
  name,
  latin,
  layer: 'digestorio',
  region,
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

const tube = (pts, width, thick = width, ref = [0, 0, 1], nc = 10) => ({ kind: 'tube', pts, ref, width, thick, taper: 'blunt', nf: Math.max(14, pts.length * 5), nc });

export const DIGEST_ITEMS = [
  /* ═════════════ Tubo digestório: esôfago e estômago ═════════════ */
  dig('esofago', 'Esôfago', 'Oesophagus', ['cabeca', T], ['esofago'], C_TUBO, {
    local: 'Tubo muscular de cerca de 25 cm que continua a parte laríngea da faringe na margem inferior da cartilagem cricóidea (C6), atravessa o pescoço e o mediastino (superior e posterior), passa pelo hiato esofágico do diafragma (T10) e termina no óstio cárdico do estômago (T11). Divide-se nas partes cervical, torácica e abdominal.',
    relacoes: 'Corre à frente da coluna vertebral e atrás da traqueia (com os nervos laríngeos recorrentes nos sulcos traqueoesofágicos) e do átrio esquerdo e pericárdio. No tórax relaciona-se com o arco da aorta e a aorta torácica descendente, o brônquio principal esquerdo e o ducto torácico. Só a curta parte abdominal (1 a 2 cm) é coberta por peritônio.',
    vasos: 'Artérias tireóideas inferiores (parte cervical), ramos esofágicos da aorta torácica e das artérias bronquiais (parte torácica) e artéria gástrica esquerda e frênica inferior esquerda (parte abdominal). Drenagem venosa para as tireóideas inferiores, sistema ázigo/hemiázigo (cava superior) e veia gástrica esquerda (veia porta). Inervação pelo plexo esofágico (nervos vagos e troncos simpáticos).',
    clinica: 'Apresenta três estreitamentos anatômicos onde corpos estranhos podem impactar: cervical (cricofaríngeo, a 15 cm dos incisivos), broncoaórtico (cruzamento do arco da aorta a 22,5 cm e do brônquio principal esquerdo a 27,5 cm) e diafragmático (hiato esofágico, a 40 cm). Na hipertensão portal, a anastomose submucosa entre a veia gástrica esquerda (porta) e as veias esofágicas tributárias da ázigo (cava) forma varizes esofágicas.',
    nota: 'O terço superior tem músculo estriado esquelético, o médio é misto e o inferior tem músculo liso.',
  }, {
    relacionados: ['cartilagem_cricoidea', 'traqueia', 'bronquio_principal_e', 'arco_aorta', 'aorta_toracica', 'atrio_esquerdo', 'estomago', 'arteria_esofagicas', 'arteria_gastrica_esquerda', 'veia_azigo', 'veia_hemiazigo'],
  }),

  dig('estomago', 'Estômago', 'Gaster [Ventriculus]', T, ['estomago'], C_TUBO, {
    local: 'Porção dilatada do tubo digestório entre o esôfago e o duodeno, no epigástrio, hipocôndrio esquerdo e região umbilical. Compreende quatro partes: cárdia (em torno do óstio cárdico, com a incisura cárdica), fundo (cúpula superior sob a hemicúpula esquerda do diafragma), corpo (maior porção, com pregas gástricas longitudinais) e parte pilórica (antro pilórico, canal pilórico e esfíncter pilórico, demarcada pela incisura angular na curvatura menor).',
    relacoes: 'Órgão intraperitoneal: o omento menor prende-se à curvatura menor e o omento maior, à curvatura maior. Anteriormente relaciona-se com o diafragma, o lobo esquerdo do fígado e a parede abdominal anterior; posteriormente fecha a bolsa omental sobre o leito do estômago (pâncreas, baço, rim e suprarrenal esquerdos, mesocolo transverso e artéria esplênica).',
    vasos: 'Arco da curvatura menor: artérias gástrica esquerda (do tronco celíaco) e gástrica direita (da hepática própria). Arco da curvatura maior: gastro-omentais direita (da gastroduodenal) e esquerda (da esplênica). Fundo: gástricas curtas e posterior (da esplênica). Veias homônimas drenam para a veia porta, a esplênica e a mesentérica superior. Inervação parassimpática pelos troncos vagais anterior e posterior e simpática pelo plexo celíaco (T6–T9).',
    clinica: 'Úlceras pépticas da parede posterior do estômago podem erodir o pâncreas e a artéria esplênica, causando dor irradiada para o dorso e hemorragia grave. A hérnia de hiato (por deslizamento ou paraesofágica) projeta parte do estômago pelo hiato esofágico.',
  }, {
    relacionados: ['esofago', 'duodeno', 'pancreas', 'baco', 'figado_seg_ii', 'figado_seg_iii', 'mesocolo_transverso', 'arteria_tronco_celiaco', 'arteria_gastrica_esquerda', 'arteria_gastrica_direita', 'arteria_esplenica', 'arteria_gastroduodenal', 'veia_porta', 'veia_esplenica', 'linfonodos_celiacos_mesentericos'],
  }),

  /* ═════════════ Intestino delgado: duodeno, jejuno e íleo ═════════════ */
  dig('duodeno', 'Duodeno', 'Duodenum', T, ['duodeno'], C_DELGADO, {
    local: 'Primeira e mais curta porção do intestino delgado (25 cm), em forma de C ao redor da cabeça do pâncreas, do piloro (L1) à flexura duodenojejunal (L2, à esquerda). Divide-se em quatro partes: superior (5 cm, com a ampola ou bulbo duodenal), descendente (7 a 10 cm, onde se abrem as papilas duodenais maior e menor), horizontal ou inferior (6 a 8 cm, ao nível de L3) e ascendente (5 cm, sustentada pelo músculo suspensor do duodeno / ligamento de Treitz).',
    relacoes: 'Secundariamente retroperitoneal, exceto os 2 cm iniciais (bulbo), que são intraperitoneais e presos ao ligamento hepatoduodenal. A parte descendente recebe o ducto colédoco e o ducto pancreático na ampola hepatopancreática (papila maior). A parte horizontal passa atrás dos vasos mesentéricos superiores e à frente da veia cava inferior e da aorta abdominal (pinça aórtico-mesentérica).',
    vasos: 'Transição entre os territórios do tronco celíaco (intestino anterior) e da artéria mesentérica superior (intestino médio): artérias pancreaticoduodenais superiores anterior e posterior (da gastroduodenal) e inferiores anterior e posterior (da mesentérica superior). Drenagem venosa direta ou indireta para a veia porta. Inervação pelos plexos celíaco e mesentérico superior.',
    clinica: 'Úlceras da parede posterior do bulbo duodenal podem erodir a artéria gastroduodenal; as da parede anterior podem perfurar para a cavidade peritoneal livre. Na síndrome da artéria mesentérica superior, a 3ª parte do duodeno é comprimida no ângulo entre a aorta e a mesentérica superior.',
    nota: 'O ligamento de Treitz marca clinicamente o limite entre o trato digestório alto e o baixo (hemorragia digestiva alta ou baixa).',
  }, {
    relacionados: ['estomago', 'jejuno', 'pancreas', 'ducto_coledoco', 'ducto_pancreatico', 'vesicula_biliar', 'arteria_gastroduodenal', 'arteria_pancreaticoduodenais', 'arteria_mesenterica_superior', 'veia_mesenterica_superior', 'veia_porta', 'aorta_abdominal', 'veia_cava_inferior'],
  }),

  dig('jejuno', 'Jejuno', 'Jejunum', T, ['jejuno'], C_DELGADO, {
    local: 'Começa na flexura duodenojejunal (ao nível de L2, à esquerda) e constitui os dois quintos proximais da parte móvel do intestino delgado (cerca de 2,5 m no vivo), situando-se sobretudo no quadrante superior esquerdo do abdome.',
    relacoes: 'Órgão intraperitoneal, suspenso à parede abdominal posterior pelo mesentério e emoldurado pelos colos e pelo omento maior. Possui parede mais espessa, diâmetro mais largo, pregas circulares (válvulas coniventes de Kerckring) altas e numerosas e menos tecido linfoide que o íleo.',
    vasos: 'Artérias jejunais, ramos da artéria mesentérica superior, que formam poucas arcadas arteriais (1 ou 2 fileiras) e emitem vasos retos longos; no mesentério a gordura é mais escassa perto da parede intestinal, deixando janelas translúcidas. Veias jejunais drenam para a veia mesentérica superior (sistema porta). Os vasos quilíferos drenam para os linfonodos mesentéricos e a cisterna do quilo.',
    clinica: 'Realiza a maior parte da absorção química de carboidratos, aminoácidos, ácidos graxos, ferro, folato e cálcio. Na cirurgia abdominal, os vasos retos longos e as poucas arcadas permitem distinguir o jejuno do íleo.',
  }, {
    relacionados: ['duodeno', 'ileo', 'mesenterio', 'arteria_mesenterica_superior', 'veia_mesenterica_superior', 'cisterna_quilo', 'linfonodos_celiacos_mesentericos'],
  }),

  dig('ileo', 'Íleo', 'Ileum', T, ['ileo'], C_DELGADO, {
    local: 'Constitui os três quintos distais da parte móvel do intestino delgado (cerca de 3,5 m no vivo), ocupando principalmente o quadrante inferior direito e a pelve, sem limite brusco com o jejuno, e termina na junção ileocecal (óstio ileal).',
    relacoes: 'Intraperitoneal, preso ao mesentério. Tem parede mais delgada, lúmen mais estreito, pregas circulares baixas e esparsas (ausentes na parte terminal) e numerosos agregados linfoides submucosos, as placas de Peyer, na borda antimesentérica.',
    vasos: 'Artérias ileais (da artéria mesentérica superior) e ramo ileal da artéria ileocólica, formando múltiplas arcadas curtas (3 a 5 níveis) e vasos retos curtos imersos em mesentério mais rico em gordura. Drenagem venosa para a veia mesentérica superior.',
    clinica: 'O íleo terminal absorve os sais biliares e a vitamina B12 (ligada ao fator intrínseco gástrico) e é o local mais acometido pela doença de Crohn e pela intussuscepção ileocecal. A cerca de 60 a 100 cm da valva ileocecal pode persistir o divertículo ileal (de Meckel), remanescente do ducto onfalomesentérico.',
  }, {
    relacionados: ['jejuno', 'ceco', 'apendice_vermiforme', 'mesenterio', 'mesoapendice', 'arteria_mesenterica_superior', 'arteria_ileocolica', 'veia_mesenterica_superior', 'linfonodos_celiacos_mesentericos'],
  }),

  /* ═════════════ Intestino grosso: ceco, apêndice, colos, tênias, reto e canal anal ═════════════ */
  dig('ceco', 'Ceco', 'Caecum', T, ['ceco'], C_GROSSO, {
    local: 'Primeira porção do intestino grosso (cerca de 7,5 cm de comprimento e largura), em fundo cego abaixo do nível da junção ileocecal, na fossa ilíaca direita. Recebe o íleo terminal pelo óstio ileal (papila/valva ileocecal, com lábios ileocólico e ileocecal) e dá origem ao apêndice vermiforme cerca de 2 cm abaixo.',
    relacoes: 'Quase totalmente envolvido por peritônio (sem mesentério próprio, mas móvel sobre a fossa ilíaca), repousando sobre os músculos ilíaco e psoas maior e os nervos cutâneo femoral lateral e femoral; quando distendido, toca a parede abdominal anterior na região inguinal direita.',
    vasos: 'Artérias cecais anterior e posterior, ramos da artéria ileocólica (da mesentérica superior). Veias tributárias da veia ileocólica e da mesentérica superior. Inervação pelo plexo mesentérico superior (vago e T10–L1).',
    clinica: 'Por ter o maior calibre do cólon (lei de Laplace), é o segmento com maior risco de perfuração na obstrução colônica em alça fechada com valva ileocecal competente. Tumores do ceco costumam cursar com anemia ferropriva silenciosa antes de obstruir o lúmen.',
    nota: 'A malha é a porção cecal inferior da peça de ceco e colo ascendente do BodyParts3D, abaixo da entrada do íleo terminal.',
  }, {
    relacionados: ['ileo', 'apendice_vermiforme', 'colo_ascendente', 'tenias_colo', 'mesoapendice', 'arteria_ileocolica', 'arteria_mesenterica_superior', 'veia_mesenterica_superior'],
  }),

  dig('apendice_vermiforme', 'Apêndice vermiforme', 'Appendix vermiformis', T, ['apendice_vermiforme'], C_GROSSO, {
    local: 'Divertículo intestinal tubular e estreito (6 a 10 cm), rico em tecido linfoide, que nasce da parede posteromedial do ceco no ponto de convergência das três tênias do colo. Sua base projeta-se na superfície no ponto de McBurney (união do terço lateral com os dois terços mediais da linha entre a espinha ilíaca anterossuperior direita e o umbigo).',
    relacoes: 'Intraperitoneal, suspenso pelo mesoapêndice ao íleo terminal. A posição da ponta varia bastante: a retrocecal é a mais frequente na maioria das séries, seguida pela pélvica (que cruza a borda da pelve), subcecal, pré-ileal e pós-ileal.',
    vasos: 'Artéria apendicular (ramo da ileocólica), que corre na margem livre do mesoapêndice como artéria terminal funcional. Drenagem pela veia apendicular para a ileocólica e a veia mesentérica superior. Fibras aferentes viscerais acompanham os nervos simpáticos até o segmento medular T10.',
    clinica: 'Na apendicite aguda, a dor visceral inicial é mal localizada na região periumbilical (dermátomo T10) e depois migra para a fossa ilíaca direita ao irritar o peritônio parietal (sinal de Blumberg). O apêndice retrocecal irrita o psoas maior (sinal do psoas); o pélvico, o obturador interno (sinal do obturador).',
  }, {
    relacionados: ['ceco', 'ileo', 'mesoapendice', 'tenias_colo', 'arteria_apendicular', 'arteria_ileocolica', 'veia_mesenterica_superior'],
  }),

  dig('colo_ascendente', 'Colo ascendente', 'Colon ascendens', T, ['colo_ascendente'], C_GROSSO, {
    local: 'Sobe pelo flanco direito, do ceco (ao nível do óstio ileal) até a face visceral do lobo direito do fígado, onde se dobra para a esquerda na flexura cólica direita (flexura hepática) para continuar como colo transverso.',
    relacoes: 'Secundariamente retroperitoneal (coberto por peritônio na frente e nos lados, fixo à parede posterior pela fáscia de Toldt), separado da parede abdominal anterolateral pela goteira paracólica direita. Posteriormente relaciona-se com a fáscia ilíaca, o quadrado lombar e o polo inferior do rim direito; anteriormente, com as alças do íleo e o omento maior.',
    vasos: 'Artéria ileocólica e artéria cólica direita (ramos da mesentérica superior), anastomosadas pela artéria marginal do colo. Drenagem venosa para a veia mesentérica superior; inervação pelo plexo mesentérico superior.',
    clinica: 'A goteira paracólica direita comunica a pelve com o espaço subfrênico e o recesso hepatorrenal (de Morison), servindo de via de disseminação de líquidos, pus ou sangue na cavidade peritoneal.',
  }, {
    relacionados: ['ceco', 'colo_transverso', 'tenias_colo', 'figado_seg_vi', 'arteria_ileocolica', 'arteria_mesenterica_superior', 'veia_mesenterica_superior'],
  }),

  dig('colo_transverso', 'Colo transverso', 'Colon transversum', T, ['colo_transverso'], C_GROSSO, {
    local: 'Porção mais longa (cerca de 45 cm) e mais móvel do intestino grosso: atravessa o abdome da flexura cólica direita (hepática) à flexura cólica esquerda (esplênica, mais alta, mais aguda e mais profunda, presa ao diafragma pelo ligamento frenicocólico).',
    relacoes: 'Intraperitoneal, suspenso pelo mesocolo transverso (que se fixa à face anterior do pâncreas) e preso à curvatura maior do estômago pelo ligamento gastrocólico (parte do omento maior). Relaciona-se à direita com o fígado e a vesícula biliar, no meio com o estômago e o pâncreas, e à esquerda com o baço e o rim esquerdo.',
    vasos: 'Principalmente pela artéria cólica média (da mesentérica superior), que irriga os dois terços proximais, e pela artéria cólica esquerda (da mesentérica inferior), que irriga o terço distal, unidas pela artéria marginal (de Drummond) e, quando presente, pelo arco de Riolan. Inervação dupla: vago (até a transição próximo à flexura esplênica) e nervos esplâncnicos pélvicos (S2–S4) no terço distal.',
    clinica: 'A região próxima à flexura cólica esquerda (ponto de Griffiths) é a zona de fronteira entre os territórios das artérias mesentéricas superior e inferior, sendo o segmento mais vulnerável na colite isquêmica por baixo débito.',
  }, {
    relacionados: ['colo_ascendente', 'colo_descendente', 'mesocolo_transverso', 'tenias_colo', 'estomago', 'pancreas', 'baco', 'vesicula_biliar', 'arteria_colica_media', 'arteria_colica_esquerda', 'arteria_mesenterica_superior', 'arteria_mesenterica_inferior', 'veia_mesenterica_superior', 'veia_mesenterica_inferior'],
  }),

  dig('colo_descendente', 'Colo descendente', 'Colon descendens', T, ['colo_descendente'], C_GROSSO, {
    local: 'Desce pelo flanco esquerdo (cerca de 25 cm), da flexura cólica esquerda (esplênica) até a fossa ilíaca esquerda (nível da crista ilíaca), onde ganha mesentério e passa ao colo sigmoide.',
    relacoes: 'Secundariamente retroperitoneal, margeado lateralmente pela goteira paracólica esquerda (limitada em cima pelo ligamento frenicocólico). Passa à frente da borda lateral do rim esquerdo, dos músculos transverso do abdome, quadrado lombar, ilíaco e psoas maior e dos nervos subcostal, ílio-hipogástrico, ilioinguinal e cutâneo femoral lateral.',
    vasos: 'Artéria cólica esquerda e ramos superiores das artérias sigmoideas (ramos da mesentérica inferior). Drenagem pela veia mesentérica inferior (que desemboca na veia esplênica, rumo à porta). Inervação parassimpática pelos nervos esplâncnicos pélvicos (S2–S4) e simpática pelo plexo mesentérico inferior (L1–L2).',
    clinica: 'Como as fezes já estão mais sólidas e o calibre é menor que o do cólon direito, os tumores do cólon esquerdo costumam provocar alteração do hábito intestinal e obstrução ("sinal da maçã mordida").',
  }, {
    relacionados: ['colo_transverso', 'colo_sigmoide', 'tenias_colo', 'baco', 'arteria_colica_esquerda', 'arteria_mesenterica_inferior', 'veia_mesenterica_inferior'],
  }),

  dig('colo_sigmoide', 'Colo sigmoide', 'Colon sigmoideum', T, ['colo_sigmoide'], C_GROSSO, {
    local: 'Alça móvel em forma de S (cerca de 40 cm) que liga o colo descendente, na entrada da pelve, ao reto, na junção retossigmoidea à frente do 3º segmento sacral (S3), onde as tênias do colo se abrem numa camada longitudinal contínua.',
    relacoes: 'Intraperitoneal, suspenso pelo mesocolo sigmoide (cuja raiz em V invertido cruza os vasos ilíacos comuns esquerdos e o ureter esquerdo no ápice). Relaciona-se atrás com os vasos ilíacos externos, o plexo sacral e o piriforme, e à frente com a bexiga urinária (ou o útero) e alças do íleo.',
    vasos: 'Artérias sigmoideas (2 a 4 ramos da artéria mesentérica inferior); a última anastomosa-se com a artéria retal superior (ponto crítico de Sudeck). Veias sigmoideas drenam para a veia mesentérica inferior. Inervação pelos plexos mesentérico inferior e hipogástricos e nervos esplâncnicos pélvicos (S2–S4).',
    clinica: 'Segmento mais acometido pela doença diverticular dos cólons (herniações da mucosa nos pontos em que os vasos retos penetram a camada muscular) e pela torção sobre o seu mesocolo (volvo de sigmoide). É também a sede mais comum dos adenocarcinomas colônicos.',
    nota: 'A malha é o segmento pélvico em S da peça de colo esquerdo do BodyParts3D, entre a crista ilíaca e S3.',
  }, {
    relacionados: ['colo_descendente', 'reto', 'tenias_colo', 'arteria_sigmoideas', 'arteria_mesenterica_inferior', 'arteria_retal_superior', 'veia_mesenterica_inferior', 'arteria_iliaca_comum', 'veia_iliaca_comum'],
  }),

  dig('tenias_colo', 'Tênias do colo (livre, mesocólica e omental)', 'Taeniae coli (taenia libera, mesocolica et omentalis)', T, ['tenias_colo'], '#b56150', {
    local: 'Três faixas longitudinais espessadas da camada muscular externa do intestino grosso (com cerca de 8 mm de largura cada), que nascem na base do apêndice vermiforme, percorrem o ceco e os colos ascendente, transverso, descendente e sigmoide e se espalham na junção retossigmoidea para formar a camada longitudinal contínua do reto.',
    relacoes: 'A tênia mesocólica prende-se aos mesocolos transverso e sigmoide (e fica posteromedial nos colos ascendente e descendente); a tênia omental recebe o omento maior no colo transverso (e fica posterolateral nos colos ascendente e descendente); a tênia livre não prende mesocolo nem omento e corre na face anterior do ceco e dos colos ascendente e descendente e na face inferior do colo transverso.',
    vasos: 'Irrigadas e inervadas pelos mesmos ramos cólicos (mesentéricas superior e inferior) e plexos entéricos (mioentérico de Auerbach) que suprem a parede de cada segmento do cólon.',
    clinica: 'Por serem mais curtas que o restante da parede intestinal, franze o cólon formando as saculações (haustros). Na cirurgia, seguir a tênia livre para baixo no ceco é a manobra clássica para localizar com segurança a base do apêndice vermiforme.',
  }, {
    label: false,
    relacionados: ['ceco', 'apendice_vermiforme', 'colo_ascendente', 'colo_transverso', 'colo_descendente', 'colo_sigmoide', 'reto'],
  }),

  dig('reto', 'Reto', 'Rectum', T, ['reto'], C_GROSSO, {
    local: 'Porção pélvica fixa do intestino grosso (cerca de 12 a 15 cm), que continua o colo sigmoide ao nível de S3, acompanha a concavidade do sacro e do cóccix (flexura sacral) e termina na flexura anorretal, onde atravessa o diafragma da pelve (alça do puborretal) e passa ao canal anal. Sua parte inferior dilatada é a ampola do reto.',
    relacoes: 'Não possui tênias, haustros nem apêndices omentais; internamente apresenta três pregas transversas (válvulas de Houston). O terço superior tem peritônio na frente e nos lados; o terço médio, só na frente (formando a escavação retovesical no homem ou retouterina de Douglas na mulher); o terço inferior é subperitoneal. Atrás ficam o sacro, o cóccix e os vasos sacrais medianos; na frente, no homem, a bexiga, as vesículas seminais e a próstata (separados pela fáscia retovesical de Denonvilliers).',
    vasos: 'Artéria retal superior (ramo terminal da mesentérica inferior), artérias retais médias (da ilíaca interna) e artérias retais inferiores (da pudenda interna). O plexo venoso retal forma uma importante anastomose portossistêmica: a veia retal superior drena para a mesentérica inferior (sistema porta), enquanto as retais médias e inferiores drenam para as ilíacas internas (cava inferior).',
    clinica: 'Ao toque retal, palpam-se anteriormente a próstata e as vesículas seminais (no homem) ou o colo do útero e o fundo de saco de Douglas (na mulher). A alça do músculo puborretal mantém o ângulo anorretal (cerca de 80° a 90°), essencial para a continência fecal.',
  }, {
    relacionados: ['colo_sigmoide', 'canal_anal', 'arteria_retal_superior', 'arteria_mesenterica_inferior', 'arteria_iliaca_interna', 'arteria_pudenda_interna', 'veia_mesenterica_inferior', 'veia_iliaca_interna', 'veia_pudenda_interna'],
  }),

  dig('canal_anal', 'Canal anal', 'Canalis analis', T, ['canal_anal'], C_GROSSO, {
    local: 'Porção terminal do trato digestório (2,5 a 4 cm), que vai da flexura anorretal (borda superior do diafragma pélvico / anel anorretal) até o ânus, no períneo posterior (trígono anal), cercada pelas fossas isquioanais.',
    relacoes: 'Envolvido pelo esfíncter interno do ânus (músculo liso involuntário, espessamento da camada circular nos dois terços superiores) e pelo esfíncter externo do ânus (músculo estriado voluntário, partes profunda, superficial e subcutânea). A mucosa superior apresenta as colunas anais (de Morgagni), unidas embaixo pelas válvulas e seios anais, que formam a linha pectínea (dentada).',
    vasos: 'Acima da linha pectínea (origem endodérmica, intestino posterior): artéria e veia retais superiores (sistema porta), drenagem para os linfonodos ilíacos internos e inervação visceral autonômica (sensível apenas à distensão). Abaixo da linha pectínea (origem ectodérmica, proctodeu): artérias e veias retais inferiores (sistema cava), drenagem para os linfonodos inguinais superficiais e inervação somática pelos ramos retais inferiores do nervo pudendo (S2–S4, muito sensível à dor, tato e temperatura).',
    clinica: 'A linha pectínea divide as hemorroidas internas (acima dela, do plexo retal interno, em geral indolores) das hemorroidas externas (abaixo dela, dolorosas quando trombosadas) e os adenocarcinomas (acima) dos carcinomas epidermoides (abaixo).',
    nota: 'A malha corresponde ao segmento perineal inferior da peça retal do BodyParts3D, ao nível do puborretal e do esfíncter externo do ânus.',
  }, {
    label: false,
    relacionados: ['reto', 'arteria_retal_superior', 'arteria_pudenda_interna', 'veia_pudenda_interna', 'linfonodos_iliacos', 'linfonodos_inguinais'],
  }),

  /* ═════════════ Fígado: lobos e segmentos funcionais de Couinaud (I a VIII) ═════════════ */
  dig('figado_lobo_caudado', 'Fígado — lobo caudado (segmento I)', 'Lobus caudatus hepatis [Segmentum I]', T, ['figado_lobo_caudado'], C_FIGADO, {
    local: 'Situado na parte posterior e superior da face visceral do fígado, entre a fissura do ligamento venoso (à esquerda), o sulco da veia cava inferior (à direita) e a porta do fígado (abaixo). Emite o processo papilar (à esquerda) e o processo caudado (que o liga ao lobo direito, formando o teto do forame omental de Winslow).',
    relacoes: 'Voltado para o recesso superior da bolsa omental e separado do esôfago abdominal e da aorta pelo pilar direito do diafragma. Na divisão funcional de Couinaud constitui o segmento I (posterior), autônomo em relação aos lobos funcionais direito e esquerdo.',
    vasos: 'Recebe ramos arteriais e portais tanto do pedículo direito quanto do esquerdo, e suas veias hepáticas curtas (emissárias) drenam diretamente para a face anterior da veia cava inferior, sem passar pelas três veias hepáticas principais.',
    clinica: 'Na síndrome de Budd-Chiari (trombose das veias hepáticas principais), o lobo caudado é poupado por drenar direto na cava inferior e sofre hipertrofia compensatória acentuada.',
  }, {
    label: false,
    relacionados: ['figado_seg_ii', 'figado_lobo_quadrado', 'figado_seg_vii', 'veia_cava_inferior', 'veia_porta', 'arteria_hepatica_propria'],
  }),

  dig('figado_seg_ii', 'Fígado — segmento II (lateral superior do lobo esquerdo)', 'Segmentum hepatis II (posterius laterale sinistrum)', T, ['figado_seg_ii'], C_FIGADO, {
    local: 'Parte posterossuperior da divisão lateral esquerda do fígado, à esquerda da fissura umbilical e do ligamento falciforme. Junto com o segmento III, compõe o lobo anatômico esquerdo do fígado.',
    relacoes: 'Sua face diafragmática amolda-se à cúpula esquerda do diafragma (abaixo do coração e do pericárdio), e sua face visceral apoia-se sobre o fundo e a cárdia do estômago (impressão gástrica) e o esôfago abdominal; a margem posterossuperior dá fixação ao ligamento triangular esquerdo.',
    vasos: 'Suprido pelo ramo lateral superior do ramo esquerdo da veia porta e da artéria hepática própria; drenado pela veia hepática esquerda para a veia cava inferior.',
    clinica: 'Os segmentos II e III (setor lateral esquerdo) são a unidade anatômica mais usada nos transplantes hepáticos pediátricos com doador vivo (lobectomia lateral esquerda).',
    nota: notaTA('II', 'posterior lateral esquerdo', 'o segmento superior do setor lateral esquerdo'),
  }, {
    label: false,
    relacionados: ['figado_seg_iii', 'figado_lobo_quadrado', 'figado_lobo_caudado', 'estomago', 'esofago', 'veia_porta', 'veia_hepaticas', 'arteria_hepatica_propria', 'ducto_hepatico_esquerdo'],
  }),

  dig('figado_seg_iii', 'Fígado — lobo esquerdo, segmento III (lateral inferior)', 'Segmentum hepatis III (anterius laterale sinistrum)', T, ['figado_seg_iii'], C_FIGADO, {
    local: 'Parte anteroinferior da divisão lateral esquerda do fígado, à esquerda da fissura do ligamento redondo e do ligamento falciforme; com o segmento II, forma o lobo esquerdo anatômico do fígado.',
    relacoes: 'Avança pelo epigástrio até o hipocôndrio esquerdo, cobrindo a face anterior do corpo e do antro do estômago e o omento menor; sua margem inferior aguda é palpável no epigástrio durante a inspiração profunda.',
    vasos: 'Ramo lateral inferior (do recesso de Rex) do ramo esquerdo da veia porta e ramo da artéria hepática esquerda; drenagem pela veia hepática esquerda.',
    clinica: 'Na hepatomegalia ou nos tumores do lobo esquerdo, o segmento III é a porção palpável no epigástrio, abaixo do processo xifoide.',
    nota: notaTA('III', 'anterior lateral esquerdo', 'o segmento inferior do setor lateral esquerdo'),
  }, {
    relacionados: ['figado_seg_ii', 'figado_lobo_quadrado', 'estomago', 'veia_porta', 'veia_hepaticas', 'arteria_hepatica_propria', 'ducto_hepatico_esquerdo'],
  }),

  dig('figado_lobo_quadrado', 'Fígado — lobo quadrado e segmento medial esquerdo (IV)', 'Lobus quadratus et segmentum mediale sinistrum hepatis [Segmentum IV]', T, ['figado_lobo_quadrado'], C_FIGADO, {
    local: 'Constitui a divisão medial esquerda funcional do fígado (segmento IV de Couinaud: IVa superior e IVb inferior), situada entre a fissura umbilical / ligamento falciforme (à esquerda) e o plano principal de Cantlie (da fossa da vesícula biliar à veia cava inferior, à direita). A metade visceral inferior (IVb), entre a fossa da vesícula biliar, a fissura do ligamento redondo e a porta do fígado, é o lobo quadrado clássico.',
    relacoes: 'A face inferior (lobo quadrado) repousa sobre o piloro e a primeira parte (bulbo) do duodeno e o colo transverso; posteriormente limita a porta do fígado (hilo), por onde entram a veia porta e a artéria hepática própria e saem os ductos hepáticos.',
    vasos: 'Embora fique à direita do ligamento falciforme (sendo contado no lobo direito pela anatomia de superfície), recebe seus ramos portais e arteriais do ramo esquerdo da tríade portal e é separado do lobo direito funcional pela veia hepática média.',
    clinica: 'Demonstra a diferença entre a divisão anatômica clássica (pelo ligamento falciforme) e a divisão cirúrgica funcional de Couinaud (pelo plano de Cantlie e a veia hepática média).',
  }, {
    label: false,
    relacionados: ['figado_seg_ii', 'figado_seg_iii', 'figado_lobo_caudado', 'figado_seg_v', 'figado_seg_viii', 'vesicula_biliar', 'duodeno', 'veia_porta', 'veia_hepaticas', 'arteria_hepatica_propria', 'ducto_hepatico_esquerdo'],
  }),

  dig('figado_seg_v', 'Fígado — segmento V (anterior inferior do lobo direito)', 'Segmentum hepatis V (anterius mediale dextrum)', T, ['figado_seg_v'], C_FIGADO, {
    local: 'Parte inferior da divisão (setor) anterior direita do fígado, à direita da fossa da vesícula biliar (plano de Cantlie) e abaixo do plano transversal da bifurcação portal (abaixo do segmento VIII).',
    relacoes: 'Forma a metade direita do leito da vesícula biliar e apoia-se sobre a flexura cólica direita (hepática) e a parte descendente do duodeno; anteriormente acompanha o rebordo costal direito.',
    vasos: 'Suprido pelo ramo anterior do pedículo portal direito (veia porta e artéria hepática direita) e drenado pelas veias hepáticas média (à esquerda) e direita (à direita).',
    clinica: 'No carcinoma da vesícula biliar ou na colecistite aguda perfurada, os segmentos IVb e V são as áreas do parênquima hepático diretamente invadidas por contiguidade (leito vesicular).',
    nota: notaTA('V', 'anterior medial direito', 'o segmento inferior do setor anterior direito'),
  }, {
    label: false,
    relacionados: ['figado_lobo_quadrado', 'figado_seg_vi', 'figado_seg_viii', 'vesicula_biliar', 'colo_ascendente', 'colo_transverso', 'veia_porta', 'veia_hepaticas', 'ducto_hepatico_direito'],
  }),

  dig('figado_seg_vi', 'Fígado — segmento VI (posterior inferior do lobo direito)', 'Segmentum hepatis VI (anterius laterale dextrum)', T, ['figado_seg_vi'], C_FIGADO, {
    local: 'Parte posteroinferior e mais lateral do lobo direito do fígado (metade inferior do setor posterior direito), abaixo do segmento VII e atrás do segmento V.',
    relacoes: 'Sua face visceral apresenta a ampla impressão renal (onde se encaixa o polo superior do rim direito, delimitando o recesso hepatorrenal de Morison) e parte da impressão cólica; a face costal é coberta pelas últimas costelas direitas.',
    vasos: 'Suprido pelo ramo posterior do pedículo portal direito e drenado pela veia hepática direita para a cava inferior.',
    clinica: 'Por ser a porção mais volumosa e pendente do flanco direito, é um dos segmentos mais lesados no trauma abdominal fechado do hipocôndrio direito; pode apresentar uma projeção normal para baixo conhecida como lobo de Riedel.',
    nota: notaTA('VI', 'anterior lateral direito', 'o segmento inferior do setor posterior direito'),
  }, {
    label: false,
    relacionados: ['figado_seg_v', 'figado_seg_vii', 'colo_ascendente', 'veia_porta', 'veia_hepaticas', 'ducto_hepatico_direito'],
  }),

  dig('figado_seg_vii', 'Fígado — segmento VII (posterior superior do lobo direito)', 'Segmentum hepatis VII (posterius laterale dextrum)', T, ['figado_seg_vii'], C_FIGADO, {
    local: 'Parte posterossuperior do lobo direito do fígado (metade superior do setor posterior direito), acima do segmento VI e atrás do segmento VIII.',
    relacoes: 'Encosta na parte posterior da cúpula direita do diafragma, abrange a maior parte da área nua do fígado (delimitada pelas lâminas do ligamento coronário e pelo ligamento triangular direito, sem cobertura peritoneal) e traz a impressão suprarrenal direita, ao lado da veia cava inferior.',
    vasos: 'Ramo posterior superior do pedículo portal direito; drenado pela veia hepática direita e por tributárias diretas da cava inferior.',
    clinica: 'Abscessos amebianos ou piogênicos do segmento VII e da área nua podem atravessar o diafragma e abrir-se no espaço subfrênico ou na cavidade pleural direita.',
    nota: notaTA('VII', 'posterior lateral direito', 'o segmento superior do setor posterior direito'),
  }, {
    label: false,
    relacionados: ['figado_seg_vi', 'figado_seg_viii', 'figado_lobo_caudado', 'veia_cava_inferior', 'veia_hepaticas', 'veia_porta', 'ducto_hepatico_direito'],
  }),

  dig('figado_seg_viii', 'Fígado — lobo direito, segmento VIII (anterior superior)', 'Segmentum hepatis VIII (posterius mediale dextrum)', T, ['figado_seg_viii'], C_FIGADO, {
    local: 'Parte anterossuperior da divisão anterior direita do fígado, situada exclusivamente na face diafragmática (não alcança a face visceral inferior), acima do segmento V e entre os segmentos IV (à esquerda) e VII (atrás).',
    relacoes: 'Amolda-se diretamente sob o centro da cúpula direita do diafragma (que o separa da base do lobo inferior do pulmão direito e da pleura diafragmática), protegido pela caixa torácica direita da 5ª à 8ª costela.',
    vasos: 'Suprido pelo ramo anterior superior do pedículo portal direito; situado no alto entre os troncos das veias hepáticas média e direita, logo antes de desembocarem na veia cava inferior.',
    clinica: 'Por ficar no domo hepático sob o diafragma e entre os grandes troncos das veias hepáticas média e direita, as ressecções isoladas do segmento VIII estão entre as mais exigentes da cirurgia hepatobiliar.',
    nota: notaTA('VIII', 'posterior medial direito', 'o segmento superior do setor anterior direito'),
  }, {
    relacionados: ['figado_lobo_quadrado', 'figado_seg_v', 'figado_seg_vii', 'pulmao_d_lobo_inferior', 'veia_hepaticas', 'veia_cava_inferior', 'veia_porta', 'ducto_hepatico_direito'],
  }),

  /* ═════════════ Vesícula biliar e vias biliares ═════════════ */
  dig('vesicula_biliar', 'Vesícula biliar', 'Vesica biliaris [fellea]', T, ['vesicula_biliar'], C_BILE, {
    local: 'Saco piriforme de 7 a 10 cm de comprimento e capacidade de 30 a 50 mL, alojado na fossa da vesícula biliar na face visceral do fígado (no limite funcional entre o segmento IVb e o segmento V). Divide-se em fundo (que aflora na margem inferior do fígado, junto à 9ª cartilagem costal direita na borda lateral do reto do abdome), corpo e colo (com uma dilatação infundibular chamada bolsa de Hartmann).',
    relacoes: 'A face superior adere ao fígado por tecido conjuntivo; as faces inferior e posterior são cobertas por peritônio e apoiam-se sobre o colo transverso e a 1ª e 2ª partes do duodeno.',
    vasos: 'Artéria cística (em geral ramo da artéria hepática direita, dentro do trígono cisto-hepático de Calot). Veias císticas drenam para o parênquima hepático e a veia porta. Inervação pelo plexo celíaco (simpático T7–T9), nervo vago (contração) e fibras sensitivas do nervo frênico direito (C3–C5).',
    clinica: 'Armazena e concentra a bile hepática (em até 10 vezes) e a ejeta sob estímulo da colecistoquinina (CCK). Na colecistite aguda calculosa (impactação de cálculo na bolsa de Hartmann ou no ducto cístico), a inspiração profunda sob palpação do ponto cístico interrompe o movimento respiratório pela dor (sinal de Murphy), que pode irradiar para o ombro direito via nervo frênico (C3–C5).',
    nota: 'A malha do BodyParts3D mede cerca de 5 cm do fundo ao colo, menos que a média do adulto (7 a 10 cm): é a vesícula de um único indivíduo, e o tamanho varia com o enchimento.',
  }, {
    mat: 'airway',
    relacionados: ['ducto_cistico', 'ducto_hepatico_comum', 'ducto_coledoco', 'figado_lobo_quadrado', 'figado_seg_v', 'duodeno', 'colo_transverso', 'arteria_hepatica_propria', 'veia_porta'],
  }),

  dig('ducto_cistico', 'Ducto cístico', 'Ductus cysticus', T, ['ducto_cistico'], C_BILE, {
    local: 'Ducto de 3 a 4 cm que une o colo da vesícula biliar ao ducto hepático comum para formar o ducto colédoco, correndo entre as lâminas do ligamento hepatoduodenal.',
    relacoes: 'Sua mucosa forma uma prega espiral (válvula de Heister) que ajuda a manter o lúmen aberto. Delimita, junto com o ducto hepático comum (à esquerda) e a face visceral do fígado (acima), o trígono cisto-hepático (de Calot), atravessado pela artéria cística e pela artéria hepática direita.',
    vasos: 'Ramos da artéria cística; drenagem venosa para as veias císticas e a veia porta.',
    clinica: 'Na colecistectomia videolaparoscópica, a dissecção segura da "visão crítica de segurança" no trígono de Calot (identificando apenas o ducto cístico e a artéria cística entrando na vesícula) é essencial para não lesar o ducto hepático comum ou o colédoco.',
  }, {
    label: false,
    mat: 'airway',
    relacionados: ['vesicula_biliar', 'ducto_hepatico_comum', 'ducto_coledoco', 'arteria_hepatica_propria'],
  }),

  dig('ducto_hepatico_direito', 'Ducto hepático direito e árvore biliar direita', 'Ductus hepaticus dexter', T, ['ducto_hepatico_direito'], C_BILE, {
    local: 'Formado pela confluência do ducto setorial anterior direito (que drena os segmentos V e VIII) e do ducto setorial posterior direito (que drena os segmentos VI e VII); une-se ao ducto hepático esquerdo na porta do fígado para formar o ducto hepático comum.',
    relacoes: 'É mais curto e mais vertical que o esquerdo; o ramo setorial posterior direito costuma descrever uma curva ao redor do ramo portal direito (arco de Hjortsjö).',
    vasos: 'Acompanha os ramos direitos da artéria hepática própria e da veia porta dentro das bainhas glissonianas intra-hepáticas.',
    clinica: 'Em cerca de 15% a 20% das pessoas, o ducto setorial posterior direito desemboca mais baixo, diretamente no ducto hepático comum ou até no ducto cístico, variação de alto risco cirúrgico nas colecistectomias.',
  }, {
    label: false,
    mat: 'airway',
    relacionados: ['ducto_hepatico_esquerdo', 'ducto_hepatico_comum', 'figado_seg_v', 'figado_seg_vi', 'figado_seg_vii', 'figado_seg_viii', 'veia_porta', 'arteria_hepatica_propria'],
  }),

  dig('ducto_hepatico_esquerdo', 'Ducto hepático esquerdo e árvore biliar esquerda', 'Ductus hepaticus sinister', T, ['ducto_hepatico_esquerdo'], C_BILE, {
    local: 'Formado pela união dos ductos segmentares que drenam a bile dos segmentos II, III e IV (e parte do lobo caudado, segmento I); percorre a base do segmento IV na porta do fígado e se une ao ducto hepático direito para formar o ducto hepático comum.',
    relacoes: 'Tem trajeto extra-hepático mais longo e mais horizontal que o ducto hepático direito, correndo na placa hilar acima do ramo esquerdo da veia porta.',
    vasos: 'Acompanha os ramos esquerdos da artéria hepática própria e da veia porta.',
    clinica: 'Por ter um segmento extra-hepático mais longo e acessível na placa hilar, é a via preferida para anastomoses biliodigestivas altas em estenoses ou tumores da confluência biliar (tumor de Klatskin).',
  }, {
    label: false,
    mat: 'airway',
    relacionados: ['ducto_hepatico_direito', 'ducto_hepatico_comum', 'figado_lobo_caudado', 'figado_seg_ii', 'figado_seg_iii', 'figado_lobo_quadrado', 'veia_porta', 'arteria_hepatica_propria'],
  }),

  dig('ducto_hepatico_comum', 'Ducto hepático comum', 'Ductus hepaticus communis', T, ['ducto_hepatico_comum'], C_BILE, {
    local: 'Tubo biliar de cerca de 2,5 a 3 cm que nasce na porta do fígado pela confluência dos ductos hepáticos direito e esquerdo e desce até receber, pela direita, o ducto cístico, passando a chamar-se ducto colédoco.',
    relacoes: 'Corre na margem livre direita do omento menor (ligamento hepatoduodenal), à direita da artéria hepática própria e à frente da veia porta, formando a margem medial (esquerda) do trígono cisto-hepático de Calot.',
    vasos: 'Irrigado por ramos da artéria cística e da artéria hepática própria.',
    clinica: 'Na síndrome de Mirizzi, um cálculo grande impactado no infundíbulo da vesícula (bolsa de Hartmann) ou no ducto cístico comprime extrinsecamente o ducto hepático comum, causando icterícia obstrutiva.',
    nota: 'A malha corresponde à metade superior do tronco biliar extra-hepático do BodyParts3D, entre a confluência hilar e a entrada do ducto cístico.',
  }, {
    label: false,
    mat: 'airway',
    relacionados: ['ducto_hepatico_direito', 'ducto_hepatico_esquerdo', 'ducto_cistico', 'ducto_coledoco', 'vesicula_biliar', 'arteria_hepatica_propria', 'veia_porta'],
  }),

  dig('ducto_coledoco', 'Ducto colédoco (biliar comum)', 'Ductus choledochus [biliaris]', T, ['ducto_coledoco'], C_BILE, {
    local: 'Formado na margem livre do omento menor pela união do ducto hepático comum com o ducto cístico (cerca de 5 a 8 cm de comprimento). Desce em quatro segmentos (supraduodenal, retroduodenal, pancreático e intramural) e se une ao ducto pancreático principal para formar a ampola hepatopancreática (de Vater), que se abre na papila maior da parte descendente do duodeno, regulada pelo esfíncter de Oddi.',
    relacoes: 'No ligamento hepatoduodenal (parede anterior do forame omental de Winslow), ocupa a posição anterodireita da tríade portal, à direita da artéria hepática própria e à frente da veia porta; depois passa atrás da 1ª parte do duodeno e à direita da artéria gastroduodenal, sulcando a face posterior da cabeça do pâncreas.',
    vasos: 'Suprimento axial delicado (às 3 h e às 9 h) vindo da artéria cística e da hepática direita em cima, e das artérias retroduodenal e pancreaticoduodenal superior posterior embaixo.',
    clinica: 'A impactação de cálculos (coledocolitíase) ou o carcinoma da cabeça do pâncreas obstruem o colédoco e causam icterícia colestática, colúria e acolia fecal; no tumor periampular ou de cabeça de pâncreas, a obstrução indolor dilata a vesícula biliar de forma palpável (sinal de Courvoisier-Terrier).',
    nota: 'A malha corresponde à metade inferior do tronco biliar extra-hepático do BodyParts3D, da junção com o ducto cístico até a parede medial da 2ª porção do duodeno.',
  }, {
    label: false,
    mat: 'airway',
    relacionados: ['ducto_hepatico_comum', 'ducto_cistico', 'vesicula_biliar', 'duodeno', 'pancreas', 'ducto_pancreatico', 'arteria_hepatica_propria', 'arteria_gastroduodenal', 'veia_porta'],
  }),

  /* ═════════════ Pâncreas e baço ═════════════ */
  dig('pancreas', 'Pâncreas', 'Pancreas', T, ['pancreas'], C_PANCREAS, {
    local: 'Glândula mista (exócrina e endócrina) alongada transversalmente na parede abdominal posterior (L1–L2), atrás do estômago, entre o duodeno à direita e o baço à esquerda. Divide-se em cabeça (abraçada pelo arco do duodeno, com o processo uncinado que passa atrás dos vasos mesentéricos superiores), colo (à frente da formação da veia porta), corpo (prismático, que cruza a aorta e a vértebra L2) e cauda (que chega ao hilo do baço).',
    relacoes: 'Secundariamente retroperitoneal, exceto a ponta da cauda, que corre entre as lâminas do ligamento esplenorrenal. A face anterior é cruzada pela raiz do mesocolo transverso e forma o pavimento da bolsa omental (leito do estômago); a borda superior do corpo é percorrida pela tortuosa artéria esplênica, e a face posterior, pela veia esplênica; a cabeça é atravessada pelo ducto colédoco.',
    vasos: 'Cabeça e processo uncinado: arcadas pancreaticoduodenais superiores (da gastroduodenal) e inferiores (da mesentérica superior). Corpo e cauda: ramos pancreáticos (dorsal, magno e caudal) da artéria esplênica. Drenagem venosa para as veias esplênica, mesentérica superior e porta. Inervação pelo vago e nervos esplâncnicos via plexos celíaco e mesentérico superior.',
    clinica: 'Sua porção exócrina secreta suco pancreático alcalino rico em enzimas digestivas; as ilhotas pancreáticas (de Langerhans), mais numerosas na cauda, secretam insulina e glucagon no sangue. Na pancreatite aguda (biliar ou alcoólica), a autodigestão causa dor epigástrica em faixa irradiada para o dorso; o adenocarcinoma da cabeça comprime o colédoco precocemente.',
  }, {
    relacionados: ['duodeno', 'estomago', 'baco', 'ducto_pancreatico', 'ducto_coledoco', 'mesocolo_transverso', 'arteria_esplenica', 'arteria_gastroduodenal', 'arteria_pancreaticoduodenais', 'arteria_mesenterica_superior', 'veia_esplenica', 'veia_mesenterica_superior', 'veia_porta', 'aorta_abdominal', 'linfonodos_celiacos_mesentericos'],
  }),

  dig('ducto_pancreatico', 'Ducto pancreático (de Wirsung) e acessório (de Santorini)', 'Ductus pancreaticus et ductus pancreaticus accessorius', T, ['ducto_pancreatico'], '#e8cf9c', {
    local: 'O ducto pancreático principal (de Wirsung) começa na cauda do pâncreas, percorre todo o parênquima do corpo recebendo tributárias interlobulares em "espinha de peixe" e, no colo, curva-se para baixo e para a direita na cabeça do pâncreas até se unir ao ducto colédoco na ampola hepatopancreática (de Vater), abrindo-se na papila duodenal maior. O ducto pancreático acessório (de Santorini) drena a parte anterossuperior da cabeça e se abre cerca de 2 cm acima, na papila duodenal menor.',
    relacoes: 'Intraparenquimatoso ao longo de todo o pâncreas, aproximando-se da face posterior na cabeça. Na junção com o colédoco é cercado pelos esfíncteres do ducto pancreático e da ampola (de Oddi).',
    vasos: 'Compartilha a vascularização arterial e venosa do parênquima pancreático (artéria esplênica e arcadas pancreaticoduodenais).',
    clinica: 'Um cálculo biliar encravado na ampola hepatopancreática obstrui simultaneamente o colédoco e o ducto pancreático principal, desencadeando pancreatite aguda biliar. No pâncreas divisum (variação congênita em que os brotos dorsal e ventral não se fundem), a maior parte do pâncreas drena pela papila menor.',
  }, {
    label: false,
    mat: 'airway',
    relacionados: ['pancreas', 'ducto_coledoco', 'duodeno'],
  }),

  dig('baco', 'Baço', 'Splen [Lien]', T, ['baco'], C_BACO, {
    local: 'Maior órgão linfoide secundário do corpo (cerca de 12 cm de comprimento e 7 cm de largura), situado no hipocôndrio esquerdo sob a cúpula diafragmática, ao longo do eixo da 10ª costela (protegido da 9ª à 11ª costela esquerda). Embora pertença funcionalmente ao sistema hematolinfoide, aloja-se na loja esplênica peritoneal e drena todo o seu sangue para o sistema porta hepático.',
    relacoes: 'Totalmente envolvido por peritônio visceral, exceto no hilo esplênico, onde se fixam os ligamentos gastroesplênico (com os vasos gástricos curtos e gastro-omentais esquerdos) e esplenorrenal (com os vasos esplênicos e a cauda do pâncreas). A face diafragmática é convexa; a face visceral apresenta as impressões gástrica, renal (rim esquerdo) e cólica (flexura esplênica).',
    vasos: 'Artéria esplênica (maior ramo do tronco celíaco), que corre tortuosa pela margem superior do pâncreas e se divide no hilo em ramos segmentares sem anastomoses significativas entre si. A veia esplênica une-se à veia mesentérica inferior e depois à mesentérica superior (atrás do colo do pâncreas) para formar a veia porta.',
    clinica: 'Realiza a hemocaterese (remoção de hemácias senescentes na polpa vermelha) e a resposta imune a antígenos sanguíneos (polpa branca). Apesar de protegido pelas costelas, é o órgão parenquimatoso mais frequentemente lesado no trauma abdominal contuso (fraturas da 9ª à 11ª costelas esquerdas), podendo causar hemoperitônio maciço.',
  }, {
    relacionados: ['estomago', 'pancreas', 'colo_transverso', 'colo_descendente', 'arteria_esplenica', 'arteria_tronco_celiaco', 'veia_esplenica', 'veia_porta', 'pulmao_e_lobo_inferior'],
  }),

  /* ═════════════ Peritônio e mesentérios ═════════════ */
  dig('mesenterio', 'Mesentério (do intestino delgado)', 'Mesenterium', T, ['mesenterio'], C_PERITONIO, {
    local: 'Ampla prega de dupla lâmina de peritônio em forma de leque que suspende o jejuno e o íleo à parede abdominal posterior. Sua raiz estreita (cerca de 15 cm) desce obliquamente da flexura duodenojejunal (ao lado esquerdo de L2) até a junção ileocecal (na frente da articulação sacroilíaca direita), enquanto sua margem intestinal pregueada atinge 5 a 6 metros.',
    relacoes: 'A raiz do mesentério cruza sucessivamente as partes ascendente e horizontal do duodeno, a aorta abdominal, a veia cava inferior, o ureter direito e o músculo psoas maior direito.',
    vasos: 'Entre as duas lâminas serosas correm a artéria e a veia mesentéricas superiores e suas arcadas jejunais e ileais, os vasos linfáticos (quilíferos), mais de 100 a 200 linfonodos mesentéricos e o plexo nervoso mesentérico superior, envoltos em tecido adiposo.',
    clinica: 'Defeitos congênitos ou pós-operatórios no mesentério podem causar hérnias internas com estrangulamento vascular de alças do delgado; na infância e em infecções virais, a linfadenite mesentérica no quadrante inferior direito simula o quadro clínico da apendicite aguda.',
  }, {
    mat: 'peritonio',
    relacionados: ['jejuno', 'ileo', 'duodeno', 'ceco', 'arteria_mesenterica_superior', 'veia_mesenterica_superior', 'linfonodos_celiacos_mesentericos', 'cisterna_quilo'],
  }),

  dig('mesocolo_transverso', 'Mesocolo transverso', 'Mesocolon transversum', T, ['mesocolo_transverso'], C_PERITONIO, {
    local: 'Larga prega horizontal de peritônio que prende o colo transverso à parede abdominal posterior e divide a cavidade peritoneal em dois compartimentos clínicos: o andar supramesocólico (fígado, estômago e baço) e o andar inframesocólico (intestino delgado e colos ascendente e descendente).',
    relacoes: 'Sua raiz cruza a face anterior da parte descendente do duodeno, a cabeça e a margem anterior do corpo do pâncreas até o rim esquerdo. A lâmina superior funde-se à lâmina posterior do omento maior e forma o assoalho da bolsa omental (retrocavidade dos epíploons).',
    vasos: 'Conduz a artéria e a veia cólicas médias (ramos dos vasos mesentéricos superiores), o arco vascular marginal do colo transverso, linfáticos e fibras dos plexos mesentéricos superior e inferior.',
    clinica: 'Na ressecção gástrica ou cólica sobre o colo transverso, a abertura inadvertida do mesocolo transverso põe em risco direto a artéria cólica média, cuja ligadura pode causar isquemia do colo transverso.',
  }, {
    label: false,
    mat: 'peritonio',
    relacionados: ['colo_transverso', 'pancreas', 'duodeno', 'estomago', 'arteria_colica_media', 'arteria_mesenterica_superior', 'veia_mesenterica_superior'],
  }),

  dig('mesoapendice', 'Mesoapêndice', 'Mesoappendix', T, ['mesoapendice'], C_PERITONIO, {
    local: 'Pequena prega triangular de peritônio que deriva da face posterior do mesentério da parte terminal do íleo e envolve o apêndice vermiforme até a sua ponta.',
    relacoes: 'Situa-se na fossa ilíaca direita, atrás do íleo terminal e medial ao ceco; quando é curto, curva o apêndice em gancho ou o mantém retrocecal.',
    vasos: 'Contém em sua margem livre a artéria apendicular (ramo da ileocólica), a veia apendicular, vasos linfáticos que drenam para os linfonodos ileocólicos e fibras do plexo mesentérico superior.',
    clinica: 'Na apendicectomia, a ligadura ou cauterização da artéria apendicular dentro do mesoapêndice é etapa obrigatória antes da secção da base do apêndice junto ao ceco.',
  }, {
    label: false,
    mat: 'peritonio',
    relacionados: ['apendice_vermiforme', 'ceco', 'ileo', 'mesenterio', 'arteria_apendicular', 'arteria_ileocolica'],
  }),

  /* ═════════════ Omentos, ligamentos peritoneais, valva ileocecal, esfíncter interno, tonsilas e ductos salivares (esquemas) ═════════════ */
  dig('omento_menor', 'Omento menor (ligamentos hepatogástrico e hepatoduodenal) e forame omental — esquema', 'Omentum minus (Ligamentum hepatogastricum et ligamentum hepatoduodenale); Foramen omentale', T, null, C_PERITONIO, {
    local: 'Dupla lâmina peritoneal que une a face visceral do fígado (porta do fígado e fissura do ligamento venoso) à curvatura menor do estômago e aos 2 cm iniciais da parte superior (bulbo) do duodeno. Divide-se em duas partes contínuas: o ligamento hepatogástrico (medial, membranáceo e flácido) e o ligamento hepatoduodenal (lateral, margem livre direita espessada).',
    relacoes: 'Forma a parede anterior da bolsa omental (retrocavidade dos epíploons). Sua margem livre direita (ligamento hepatoduodenal) constitui o limite anterior do forame omental (epiploico de Winslow — comunicação única entre a grande cavidade peritoneal e a bolsa omental, limitado atrás pela veia cava inferior e pilar direito do diafragma, em cima pelo lobo caudado do fígado e embaixo pela 1ª parte do duodeno).',
    vasos: 'O ligamento hepatoduodenal encerra a tríade portal extra-hepática: o ducto colédoco à frente e à direita, a artéria hepática própria à frente e à esquerda, e a veia porta posteriormente entre os dois, acompanhados pelo plexo nervoso hepático e linfáticos. Ao longo da curvatura menor, no ligamento hepatogástrico, anastomosam-se as artérias gástricas esquerda e direita.',
    clinica: 'Em hemorragias maciças do fígado (trauma hepático ou hepatectomias), o cirurgião pode pinçar digitalmente ou com clampe vascular a margem livre do omento menor (ligamento hepatoduodenal) através do forame omental — a manobra de Pringle —, interrompendo temporariamente o influxo arterial e portal ao fígado; se o sangramento continuar, a origem é das veias hepáticas ou da cava inferior retro-hepática.',
    nota: 'ESQUEMA: modelado por código entre a porta do fígado, a curvatura menor do estômago e a 1ª porção do duodeno.',
  }, {
    kind: 'estrutura',
    mat: 'peritonio',
    paired: false,
    proc: [
      // Ligamento hepatogástrico (da fissura/porta do fígado à curvatura menor do estômago)
      tube([[-0.08, -4.05, 0.52], [0.06, -4.15, 0.56], [0.22, -4.22, 0.58]], 0.34, 0.014, [0, 0, 1], 8),
      // Ligamento hepatoduodenal (margem livre direita com a tríade portal, da porta do fígado ao duodeno superior)
      tube([[-0.22, -4.2, 0.45], [-0.24, -4.5, 0.44], [-0.22, -4.78, 0.46]], 0.12, 0.045, [0, 0, 1], 10),
    ],
    relacionados: ['estomago', 'duodeno', 'figado_lobo_caudado', 'figado_lobo_quadrado', 'ducto_coledoco', 'ducto_hepatico_comum', 'arteria_hepatica_propria', 'arteria_gastrica_esquerda', 'arteria_gastrica_direita', 'veia_porta', 'veia_cava_inferior', 'omento_maior'],
  }),

  dig('omento_maior', 'Omento maior (ligamentos gastrocólico, gastroesplênico e esplenorrenal) — esquema', 'Omentum majus (Ligamentum gastrocolicum, gastrosplenicum et splenorenale)', T, null, C_PERITONIO, {
    local: 'Grande prega peritoneal quadrilátera de quatro lâminas, infiltrada por tecido adiposo, que desce da curvatura maior do estômago e da parte proximal do duodeno como um avental à frente do intestino delgado e se dobra sobre si mesma para subir e fixar-se à face anterior da tênia omental do colo transverso e do mesocolo transverso.',
    relacoes: 'Subdivide-se em três porções funcionais: 1) ligamento gastrocólico (a maior parte, da curvatura maior ao colo transverso, fechando inferiormente a bolsa omental); 2) ligamento gastroesplênico (à esquerda, do fundo e curvatura maior alta ao hilo do baço); e 3) ligamento gastrofrênico (no fundo gástrico). Continua-se no hilo esplênico com o ligamento esplenorrenal (lieno-renal), que vai ao rim esquerdo.',
    vasos: 'Entre as lâminas anteriores do ligamento gastrocólico corre a arcada das artérias e veias gastro-omentais (gastroepiploicas) direita (da gastroduodenal) e esquerda (da esplênica). No ligamento gastroesplênico passam os vasos gástricos curtos e gastro-omentais esquerdos; no ligamento esplenorrenal passam os vasos esplênicos e a ponta da cauda do pâncreas.',
    clinica: 'Conhecido como o "policial do abdome", possui grande mobilidade e riqueza em macrófagos (manchas lácteas), deslocando-se para envolver e bloquear focos inflamatórios ou perfurações (como apendicite, diverticulite ou úlcera perfurada), evitando peritonite difusa. Também é usado como retalho vascularizado (omentoplastia) em reconstruções cirúrgicas.',
    nota: 'ESQUEMA: lâmina peritoneal anterior modelada por código descendo da curvatura maior do estômago e do colo transverso sobre as alças intestinais, acompanhada das pregas gastroesplênica e esplenorrenal.',
  }, {
    kind: 'estrutura',
    mat: 'peritonio',
    paired: false,
    proc: [
      // Avental omental (ligamento gastrocólico descendo sobre o colo transverso e as alças jejunoileais)
      tube([[-0.55, -5.05, 0.88], [-0.15, -5.45, 0.96], [0.25, -5.5, 0.96], [0.65, -5.1, 0.88]], 0.95, 0.02, [0, 0, 1], 10),
      // Ligamentos gastroesplênico e esplenorrenal (entre o fundo do estômago, o hilo do baço e o rim esquerdo)
      tube([[0.68, -4.3, 0.35], [0.78, -4.45, 0.15], [0.72, -4.75, -0.02]], 0.28, 0.022, [1, 0, 0], 8),
    ],
    relacionados: ['estomago', 'colo_transverso', 'mesocolo_transverso', 'baco', 'pancreas', 'rim_esquerdo', 'jejuno', 'ileo', 'omento_menor', 'arteria_esplenica', 'arteria_gastroduodenal'],
  }),

  dig('lig_falciforme_coronario_figado', 'Ligamentos do fígado (falciforme, redondo, coronário e triangulares) — esquema', 'Ligamentum falciforme hepatis; Ligamentum teres hepatis; Ligamentum coronarium; Ligamenta triangularia', T, null, C_PERITONIO, {
    local: 'Conjunto de reflexões peritoneais e cordões fibrosos que prendem o fígado ao diafragma e à parede abdominal anterior: o ligamento falciforme (foice sagital entre a face diafragmática do fígado, o diafragma e a parede anterior até o umbigo), o ligamento redondo do fígado (cordão fibroso na margem livre inferior do falciforme), o ligamento coronário (lâminas anterior e posterior no domo hepático) e os ligamentos triangulares direito e esquerdo.',
    relacoes: 'O ligamento falciforme marca na superfície externa a divisão anatômica clássica entre os lobos direito e esquerdo (no limite entre o segmento IV medial e os segmentos II/III laterais). As lâminas do ligamento coronário divergem na face diafragmática posterossuperior para delimitar a área nua do fígado — onde o parênquima hepático encosta diretamente no diafragma e na veia cava inferior sem serosa peritoneal — e se encontram nas pontas formando os ligamentos triangulares direito e esquerdo.',
    vasos: 'O ligamento redondo do fígado (ligamentum teres hepatis) é o remanescente pós-natal obliterado da veia umbilical fetal (que levava sangue oxigenado da placenta ao ramo esquerdo da veia porta e ao ducto venoso); ao seu redor correm as pequenas veias paraumbilicais (de Sappey), que anastomosam o ramo esquerdo da veia porta com as veias epigástricas superficiais e toracoepigástricas da parede abdominal.',
    clinica: 'Na hipertensão portal (cirrose hepática), a recanalização da veia umbilical no ligamento redondo e a dilatação das veias paraumbilicais ao redor do umbigo produzem o sinal clássico da "cabeça de Medusa" (e a síndrome de Cruveilhier-Baumgarten). Na mobilização cirúrgica do fígado, a secção dos ligamentos falciforme, coronário e triangulares expõe a área nua e as veias hepáticas.',
    nota: 'ESQUEMA: modelado por código com a lâmina sagital do ligamento falciforme, o cordão do ligamento redondo até o umbigo e a reflexão superior do ligamento coronário.',
  }, {
    kind: 'ligamento',
    mat: 'peritonio',
    paired: false,
    proc: [
      // Ligamento falciforme na fissura sagital entre os segmentos III/II e IV
      tube([[0.02, -3.65, 0.72], [0.03, -3.95, 0.98], [0.02, -4.35, 1.06]], 0.35, 0.016, [1, 0, 0], 8),
      // Ligamento redondo do fígado (da incisura do ligamento redondo até a cicatriz umbilical)
      tube([[0.02, -4.35, 0.92], [0.01, -4.75, 1.05], [0.0, -5.15, 1.12], [0.0, -5.5, 1.15]], 0.028, 0.028, [1, 0, 0], 10),
      // Ligamento coronário e triangulares no domo diafragmático
      tube([[-0.85, -3.75, 0.15], [-0.45, -3.62, 0.25], [0.0, -3.62, 0.35], [0.45, -3.68, 0.32]], 0.08, 0.022, [0, 1, 0], 10),
    ],
    relacionados: ['figado_seg_ii', 'figado_seg_iii', 'figado_lobo_quadrado', 'figado_seg_vii', 'figado_seg_viii', 'diafragma', 'reto_abdome', 'veia_porta', 'veia_cava_inferior', 'veia_umbilical', 'ducto_venoso'],
  }),

  dig('mesocolo_sigmoide', 'Mesocolo sigmoide — esquema', 'Mesocolon sigmoideum', T, null, C_PERITONIO, {
    local: 'Prega peritoneal em forma de leque que suspende o colo sigmoide à parede pélvica posterior, conferindo-lhe ampla mobilidade. Sua raiz de fixação tem a forma de um V invertido, com um ramo lateral ascendente (ao longo da margem medial do psoas maior esquerdo e dos vasos ilíacos externos esquerdos) e um ramo medial descendente (que vai do promontório sacral até a face anterior da vértebra S3, onde começa o reto).',
    relacoes: 'No ápice (vértice) da raiz em V invertido, exatamente sobre a bifurcação da artéria ilíaca comum esquerda e a articulação sacroilíaca esquerda, situa-se uma fosseta peritoneal em funil — o recesso intersigmoide —, em cujo assoalho retroperitoneal passa o ureter esquerdo descendo para a pelve.',
    vasos: 'Entre as duas lâminas do mesocolo sigmoide correm as artérias sigmoideas (3 a 4 ramos) e a artéria retal superior (ramo terminal da artéria mesentérica inferior), suas veias homônimas (tributárias da veia mesentérica inferior para o sistema porta), vasos linfáticos e fibras dos plexos mesentérico inferior e hipogástrico superior.',
    clinica: 'Quando o mesocolo sigmoide é muito longo e tem uma base de fixação estreita (comum em idosos, constipados crônicos e na colopatia chagásica), a alça sigmoidea pode sofrer torção axial sobre seu próprio mesentério — o volvo de sigmoide —, causando obstrução intestinal em alça fechada com o sinal radiográfico do "grão de café" (ou "U invertido") e risco de isquemia e perfuração. Na colectomia esquerda, o recesso intersigmoide é o marco cirúrgico para identificar e proteger o ureter esquerdo.',
    nota: 'ESQUEMA: lâmina peritoneal em V invertido modelada por código entre os vasos ilíacos esquerdos, o promontório/sacro e a alça do colo sigmoide.',
  }, {
    mat: 'peritonio',
    paired: false,
    proc: [
      tube([[0.32, -6.45, -0.05], [0.52, -6.62, 0.08], [0.35, -6.82, -0.08], [0.08, -6.95, -0.25]], 0.32, 0.018, [0, 0, 1], 10),
    ],
    relacionados: ['colo_sigmoide', 'colo_descendente', 'reto', 'ureter_esquerdo', 'arteria_sigmoideas', 'arteria_retal_superior', 'arteria_mesenterica_inferior', 'veia_mesenterica_inferior', 'arteria_iliaca_comum', 'o_sacro'],
  }),

  dig('valva_ileocecal', 'Valva ileocecal (papila ileal e óstio ileal) — esquema', 'Valva ileocaecalis (Papilla ilealis; Ostium ileale)', T, null, C_DELGADO, {
    local: 'Estrutura esfincteriana e valvular situada na transição entre o íleo terminal e o intestino grosso, na parede posteromedial da fronteira entre o ceco e o colo ascendente (fossa ilíaca direita, cerca de 2 a 3 cm acima do óstio do apêndice vermiforme). Na pessoa viva (endoscopia), projeta-se na luz cecal como uma elevação arredondada — a papila ileal —, enquanto no cadáver fixado assume a forma de dois lábios (ileocólico superior e ileocecal inferior) unidos pelos frênulos do óstio ileal.',
    relacoes: 'Anteriormente é recoberta pela prega vascular ileocecal; inferiormente relaciona-se com a prega ileocecal (sem vasos, de Treves) e o mesoapêndice, que delimitam os recessos ileocecais superior e inferior.',
    vasos: 'Irrigada pelos ramos ileal e cecal (anterior e posterior) da artéria ileocólica (ramo da mesentérica superior); drenagem venosa pela veia ileocólica para a mesentérica superior e linfática para os linfonodos ileocólicos. Inervação pelo plexo mesentérico superior (vago e simpático toracolombar).',
    clinica: 'Seu esfíncter de músculo liso mantém-se tonicamente contraído para evitar o refluxo bacteriano do ceco para o íleo e relaxa reflexamente com a chegada de alimento ao estômago (reflexo gastroileal mediado pela gastrina e pelo vago). Quando um tumor do colo obstrui o intestino grosso e a valva ileocecal é competente, o ceco sofre distensão progressiva em "alça fechada", com alto risco de perfuração diastática (lei de Laplace). A região ileocecal é também a sede mais frequente da doença de Crohn, da tuberculose intestinal e da intussuscepção ileocólica em lactentes.',
    nota: 'ESQUEMA: anel papilar modelado por código exatamente na desembocadura da malha do íleo terminal na parede posteromedial da transição entre o ceco e o colo ascendente (`y = -6.22`).',
  }, {
    paired: false,
    proc: [
      tube([[-0.64, -6.22, 0.34], [-0.72, -6.22, 0.32], [-0.8, -6.22, 0.3]], 0.095, 0.085, [0, 1, 0], 12),
    ],
    relacionados: ['ileo', 'ceco', 'colo_ascendente', 'apendice_vermiforme', 'mesenterio', 'arteria_ileocolica', 'arteria_mesenterica_superior', 'veia_mesenterica_superior'],
  }),

  dig('esfincter_interno_anus', 'Esfíncter interno do ânus e linha pectínea — esquema', 'Musculus sphincter ani internus; Linea pectinata', T, null, '#b85a52', {
    local: 'Espessamento anelar involuntário da camada circular de músculo liso da parede do intestino grosso ao longo dos três quartos superiores (2,5 a 3 cm) do canal anal, começando na junção anorretal (alça do puborretal) e terminando na linha branca interesfinctérica (sulco de Hilton), logo acima da margem anal. Na mucosa interna do meio do canal anal situa-se a linha pectínea (dentada), formada pelas válvulas e seios anais na base das 6 a 10 colunas anais verticais (de Morgagni).',
    relacoes: 'É separado externamente das partes profunda e superficial do músculo esfíncter externo do ânus (músculo estriado esquelético voluntário, inervado pelo nervo retal inferior do pudendo) pelo plano longitudinal conjunto fibromuscular (sulco interesfinctérico).',
    vasos: 'Acima da linha pectínea (origem endodérmica, intestino posterior): irrigação pela artéria retal superior (mesentérica inferior), drenagem para a veia retal superior (porta), linfa para os linfonodos ilíacos internos e inervação autonômica (visceral, insensível ao corte, sensível apenas à distensão). Abaixo da linha pectínea (origem ectodérmica, proctodeu): irrigação pela artéria retal inferior (pudenda interna), drenagem para a veia pudenda interna (cava inferior), linfa para os linfonodos inguinais superficiais e inervação somática pelo nervo retal inferior (S2–S4, altamente sensível a dor, temperatura e toque). O músculo esfíncter interno tem tônus mantido pelo simpático (L1–L2, plexo hipogástrico) e relaxa pelo parassimpático (nervos esplâncnicos pélvicos S2–S4 e reflexo inibitório retoanal intrínseco).',
    clinica: 'O esfíncter interno do ânus responde por 70 % a 85 % da pressão de repouso do canal anal (continência passiva para gases e fezes líquidas). Na doença de Hirschsprung (aganglionose mioentérica), a ausência do reflexo inibitório retoanal na manometria anorretal é diagnóstica. Na fissura anal crônica (90 % na linha mediana posterior), o espasmo doloroso do esfíncter interno causa isquemia local; o tratamento cirúrgico padrão é a esfincterotomia lateral interna parcial (nunca do esfíncter externo).',
    nota: 'ESQUEMA: manga cilíndrica de músculo liso modelada por código envolvendo o canal anal, internamente ao anel do músculo esfíncter externo do ânus.',
  }, {
    kind: 'estrutura',
    paired: false,
    proc: [
      tube([[0.0, -7.45, -0.46], [0.0, -7.58, -0.49], [0.0, -7.7, -0.52]], 0.11, 0.1, [1, 0, 0], 14),
    ],
    relacionados: ['canal_anal', 'reto', 'esfincter_anal_ext', 'puborretal', 'pubococcigeo', 'arteria_retal_superior', 'arterias_retais_media_inferior', 'plexo_venoso_pelvico', 'linfonodos_inguinais', 'linfonodos_iliacos'],
  }),

  dig('tonsilas_anel_waldeyer', 'Tonsilas palatinas, faríngea (adenoide) e anel linfático de Waldeyer — esquema', 'Tonsilla palatina; Tonsilla pharyngea; Anulus lymphoideus pharyngis', 'cabeca', null, '#c97882', {
    local: 'Conjunto circular de tecido linfoide associado à mucosa (MALT) na entrada dos tratos aerodigestivos (anel linfático da faringe de Waldeyer): 1) tonsilas palatinas (amígdalas, pares, alojadas na fossa tonsilar da orofaringe, entre o arco palatoglosso à frente e o arco palatofaríngeo atrás); 2) tonsila faríngea (adenoide, ímpar, na mucosa do teto e parede posterior da nasofaringe); 3) tonsilas tubárias (pares, junto ao tórus tubário do óstio faríngeo da tuba auditiva); e 4) tonsila lingual (na raiz/terço posterior da língua, atrás do sulco terminal).',
    relacoes: 'O leito (parede lateral) da tonsila palatina é formado pela fáscia faringobasilar e pelo músculo constritor superior da faringe; imediatamente por fora dessa parede muscular passam o nervo glossofaríngeo (IX), a alça da artéria facial (e seu ramo tonsilar), a artéria palatina ascendente e, a cerca de 2 cm posterolateralmente, a artéria carótida interna.',
    vasos: 'A tonsila palatina tem vascularização intensa (principalmente o ramo tonsilar da artéria facial, mais ramos das artérias palatina ascendente, lingual, faríngea ascendente e palatina menor); sua drenagem venosa vai para a veia paratonsilar (principal fonte de sangramento na amigdalectomia) e plexo faríngeo, e sua linfa drena diretamente para o linfonodo jugulodigástrico (das cadeias cervicais profundas). Inervação sensitiva pelo plexo tonsilar (nervo glossofaríngeo IX e palatinos menores V2) — explicando a otalgia reflexa via nervo timpânico de Jacobson nas amigdalites e após amigdalectomia.',
    clinica: 'Atuam na primeira linha de defesa imunológica (produção de IgA secretora). Na infância, a hipertrofia da tonsila faríngea (adenoide) obstrui as coanas e a tuba auditiva, levando à respiração bucal crônica ("fácies adenoideana"), ronco/apneia do sono e otite média secretora de repetição. Na amigdalite bacteriana complicada por abscesso peritonsilar (entre a cápsula tonsilar e o constritor superior), há trismo, voz de "batata quente" e desvio da úvula para o lado oposto.',
    nota: 'ESQUEMA: a tonsila palatina (na loja entre o palatoglosso e o palatofaríngeo) e a tonsila faríngea (no teto da nasofaringe) foram modeladas por código.',
  }, {
    paired: true,
    proc: [
      // Tonsila palatina na fossa tonsilar (entre o palatoglosso e o palatofaríngeo, medial ao constritor superior)
      tube([[0.15, -0.68, 0.28], [0.155, -0.76, 0.27]], 0.055, 0.038, [1, 0, 0], 10),
      // Tonsila faríngea (adenoide) no teto posterior da nasofaringe
      tube([[0.03, -0.38, 0.16], [0.03, -0.45, 0.14]], 0.05, 0.03, [1, 0, 0], 8),
    ],
    relacionados: ['lingua', 'palatoglosso', 'palatofaringeo', 'constritor_faringe_sup', 'tuba_auditiva', 'cavidade_nasal', 'arteria_facial', 'arteria_faringea_ascendente', 'arteria_carotida_interna', 'linfonodos_cervicais_profundos'],
  }),

  dig('ductos_salivares', 'Ductos salivares: parotídeo (de Stenon) e submandibular (de Wharton) — esquema', 'Ductus parotideus [Stenonis]; Ductus submandibularis [Whartoni]', 'cabeca', null, '#e2be78', {
    local: 'Ductos excretores principais das duas maiores glândulas salivares: 1) o ducto parotídeo (de Stenon/Stensen, cerca de 5 cm) emerge da margem anterior da glândula parótida, cruza horizontalmente a face lateral do músculo masseter (cerca de 1 cm abaixo do arco zigomático), dobra-se medialmente em ângulo reto contornando o corpo adiposo da bochecha, perfura o músculo bucinador e abre-se no vestíbulo da boca na papila parotídea, em frente à coroa do 2º dente molar superior; e 2) o ducto submandibular (de Wharton, cerca de 5 cm) nasce da parte profunda da glândula submandibular, corre para a frente e medialmente no assoalho da boca (entre o milo-hióideo lateralmente e o hioglosso/genioglosso medialmente, medial à glândula sublingual) e abre-se no cume da carúncula sublingual, ao lado da base do frênulo da língua.',
    relacoes: 'Na face, o ducto parotídeo corre paralelo à artéria transversa da face (acima dele) e aos ramos bucais do nervo facial. No assoalho da boca, o ducto submandibular apresenta uma relação anatômica clássica de prova com o nervo lingual (V3): o nervo lingual desce inicialmente lateral ao ducto, passa por baixo dele de fora para dentro e sobe medialmente a ele rumo à língua ("o nervo lingual faz uma alça sob o ducto de Wharton").',
    vasos: 'O ducto parotídeo recebe ramos da artéria transversa da face e da facial; o ducto submandibular é acompanhado pelos vasos sublinguais (ramos da artéria e veia linguais).',
    clinica: 'Cerca de 80 % dos cálculos salivares (sialolitíase) formam-se no ducto submandibular (de Wharton), porque sua secreção é mista seromucosa (mais viscosa e rica em cálcio/fosfato) e o ducto tem trajeto ascendente contra a gravidade e óstio estreito, provocando dor e tumefação submandibular às refeições ("cólica salivar"); ao incisá-lo no assoalho da boca, o cirurgião deve preservar o nervo lingual. Na caxumba (parotidite) é possível observar hiperemia e edema na papila do ducto parotídeo em frente ao 2º molar superior.',
    nota: 'ESQUEMA: os trajetos do ducto parotídeo (sobre o masseter até o bucinador/2º molar superior) e do ducto submandibular (da glândula submandibular até o assoalho anterior da língua) foram modelados por código.',
  }, {
    kind: 'estrutura',
    paired: true,
    proc: [
      // Ducto parotídeo (de Stenon): da margem anterior da parótida, sobre o masseter, perfurando o bucinador junto ao 2º molar superior
      tube([[0.48, -0.58, 0.25], [0.49, -0.57, 0.42], [0.42, -0.58, 0.56], [0.28, -0.59, 0.62]], 0.018, 0.018, [0, 1, 0], 8),
      // Ducto submandibular (de Wharton): da parte profunda da submandibular até a carúncula sublingual
      tube([[0.22, -0.84, 0.46], [0.16, -0.83, 0.58], [0.09, -0.82, 0.68], [0.03, -0.81, 0.75]], 0.016, 0.016, [0, 1, 0], 8),
    ],
    relacionados: ['parotida', 'submandibular', 'sublingual', 'lingua', 'masseter', 'bucinador', 'milo_hioideo', 'hioglosso', 'genioglosso', 'o_dentes_sup', 'arteria_facial', 'arteria_lingual'],
  }),
];
