/**
 * Circulatório, vasos modelados por código (F5.2): a carótida externa e seus ramos, as veias da cabeça e do pescoço que o banco não tem,
 * os ramos da ilíaca interna (glúteas, obturatória, pudenda interna), a circunflexa femoral medial e a fibular. **São esquemas**: os
 * trajetos foram medidos no corpo do atlas (pontos de referência ósseos da cabeça, `landmarks.js`; centros das veias e dos ossos da
 * pelve e da perna), mas a posição e o calibre são aproximados e o BodyParts3D não tem nenhuma destas estruturas. Cada ficha diz isso.
 * Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.).
 *
 * O banco tem as carótidas comum e interna com uma falha no pescoço (a malha da comum termina em y ≈ −1,6 e a da interna começa em
 * y ≈ −1,0): a carótida externa é desenhada a partir do meio dessa falha, onde fica a bifurcação (C4), e a ficha avisa.
 */
import { art, vein } from './catalog-circ.js';

const H = 'cabeca';
const T = 'tronco';
const MI = 'membro_inf';
const FONTES = ['Moore, Dalley & Agur — Anatomia orientada para a clínica, 8ª ed.', "Gray's Anatomy, 42ª ed."];

const tubo = (pts, w, o = {}) => ({ kind: 'tube', pts, width: w, thick: o.thick ?? w, nf: o.nf ?? 24, nc: 8, taper: o.taper ?? 'pointed', ref: o.ref ?? [1, 0, 0] });
/** Ponto sob a pele mais próxima de p (lado esquerdo), afundado `d` (< 0). */
const sk = (p, d = -0.06) => ({ skin: true, p, d });
const base = { paired: true, mat: 'artery', fontes: FONTES };
const esq = (txt) => `ESQUEMA: ${txt}`;

// bifurcação da carótida comum, no meio da falha entre as malhas da comum e da interna (ver o cabeçalho)
const BIF = [0.27, -1.3, 0.24];
// término da carótida externa, atrás do colo da mandíbula, onde se divide em maxilar e temporal superficial
const TERM = [0.44, -0.4, 0.07];

export const CIRC_CODIGO = [
  /* ═════════════ Carótida externa e ramos ═════════════ */
  art('arteria_carotida_externa', 'Artéria carótida externa — esquema', 'Arteria carotis externa', H, [], {
    origem: 'Ramo terminal da artéria carótida comum, ao nível da margem superior da cartilagem tireóidea (C4).',
    trajeto: 'Sobe pelo pescoço, no começo à frente e medial à carótida interna, depois lateral a ela, passa atrás do ventre posterior do digástrico e do estilo-hióideo e entra na glândula parótida. Atrás do colo da mandíbula divide-se em artéria maxilar e artéria temporal superficial.',
    ramos: 'No pescoço: tireóidea superior, faríngea ascendente, lingual, facial, occipital e auricular posterior. Terminais: maxilar e temporal superficial.',
    territorio: 'Pescoço (tireoide, laringe, faringe, língua), face, couro cabeludo, orelha, dentes, cavidade nasal e dura-máter; só não irriga o encéfalo e a órbita, que são da carótida interna.',
    nota: esq('os ramos foram desenhados por pontos de referência ósseos e da pele; o BodyParts3D não tem a carótida externa. O modelo tem uma falha de cerca de 6 cm entre a carótida comum e a interna: a bifurcação foi posta no meio dela. Diferença clínica: a externa dá ramos no pescoço, e a interna não. As anastomoses entre as duas (a dorsal do nariz da oftálmica com a facial, por exemplo) são vias colaterais.'),
  }, {
    ...base, paired: true, label: false,
    proc: [tubo([BIF, [0.31, -1.12, 0.18], [0.38, -0.9, 0.11], [0.41, -0.7, 0.07], [0.43, -0.5, 0.05], TERM], 0.052, { nf: 30 })],
    relacionados: ['arteria_carotida_comum', 'arteria_carotida_interna', 'arteria_tireoidea_superior', 'arteria_lingual', 'arteria_facial', 'arteria_occipital', 'arteria_auricular_posterior', 'arteria_faringea_ascendente', 'arteria_temporal_superficial', 'arteria_maxilar'],
  }),
  art('arteria_tireoidea_superior', 'Artéria tireóidea superior — esquema', 'Arteria thyroidea superior', H, [], {
    origem: 'Primeiro ramo da carótida externa, perto da bifurcação.',
    trajeto: 'Desce, à frente, junto ao ramo externo do nervo laríngeo superior, até o polo superior do lobo da glândula tireoide.',
    ramos: 'Laríngea superior (perfura a membrana tíreo-hióidea com o nervo laríngeo interno), cricotireóidea, ramo infra-hióideo, ramo esternocleidomastóideo e ramos glandulares anterior e posterior.',
    territorio: 'Parte superior da glândula tireoide, laringe (parte superior), músculos infra-hióideos e esternocleidomastóideo.',
    nota: esq('posição aproximada; a tireoide não existe no modelo. Na tireoidectomia, o ramo externo do nervo laríngeo superior fica perto da artéria, e a ligadura longe da glândula protege a voz.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.27, -1.3, 0.26], [0.23, -1.37, 0.33], [0.18, -1.45, 0.38], [0.14, -1.52, 0.36]], 0.03, { nf: 14 })],
    relacionados: ['arteria_carotida_externa', 'arteria_tireoidea_inferior'],
  }),
  art('arteria_faringea_ascendente', 'Artéria faríngea ascendente — esquema', 'Arteria pharyngea ascendens', H, [], {
    origem: 'Face medial da carótida externa, perto da origem; é o menor ramo.',
    trajeto: 'Sobe entre a carótida interna e a parede da faringe, até a base do crânio.',
    ramos: 'Faríngeos, palatino, meníngea posterior e timpânica inferior.',
    territorio: 'Faringe, palato mole, tonsila, parte do ouvido médio e dura-máter da fossa posterior.',
    nota: esq('posição aproximada; a faringe como cavidade não existe no modelo.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.26, -1.25, 0.22], [0.24, -1.0, 0.16], [0.22, -0.78, 0.14], [0.2, -0.6, 0.13]], 0.022, { nf: 14 })],
    relacionados: ['arteria_carotida_externa'],
  }),
  art('arteria_lingual', 'Artéria lingual — esquema', 'Arteria lingualis', H, [], {
    origem: 'Carótida externa, ao nível da ponta do corno maior do osso hioide.',
    trajeto: 'Faz uma alça sobre o corno maior do hioide, passa profunda ao músculo hioglosso (entre ele e o constritor médio da faringe) e sobe até a língua, onde dá a artéria profunda da língua.',
    ramos: 'Suprahióidea, dorsais da língua, sublingual e profunda da língua.',
    territorio: 'Língua, assoalho da boca, glândula sublingual, gengivas e tonsila palatina.',
    nota: esq('posição aproximada. O trígono de Pirogov (limitado pelo nervo hipoglosso, pelo tendão intermédio do digástrico e pela margem posterior do milo-hióideo) é a referência para achar a artéria numa ligadura. A língua tem boa circulação colateral, com anastomoses entre os dois lados.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.32, -1.13, 0.2], [0.25, -1.06, 0.18], [0.19, -1.0, 0.17], [0.16, -0.95, 0.28], [0.12, -0.88, 0.44], [0.08, -0.8, 0.58]], 0.03, { nf: 20 })],
    relacionados: ['arteria_carotida_externa'],
  }),
  art('arteria_facial', 'Artéria facial — esquema', 'Arteria facialis', H, [], {
    origem: 'Carótida externa, logo acima da lingual.',
    trajeto: 'Passa profunda ao digástrico e ao estilo-hióideo e à glândula submandibular, contorna a margem inferior da mandíbula, na borda anterior do masseter, e sobe pela face, em S, ao lado da boca e do nariz, até o ângulo medial do olho, onde se continua como artéria angular.',
    ramos: 'No pescoço: palatina ascendente, tonsilar, glandulares e submentual. Na face: labiais inferior e superior, nasal lateral e angular.',
    territorio: 'Face (lábios, nariz, bochecha), glândula submandibular, tonsila e palato mole.',
    nota: esq('posição aproximada, seguindo o contorno da pele (a profundidade real é de alguns milímetros a centímetros). O pulso facial se sente no ponto em que a artéria cruza a mandíbula, na borda anterior do masseter, e a compressão ali controla a hemorragia da face. A angular se anastomosa com a dorsal do nariz (da oftálmica): é uma via entre as carótidas externa e interna.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.34, -1.07, 0.19], [0.4, -0.97, 0.3], [0.47, -0.88, 0.46], sk([0.4, -0.74, 1.2], -0.1), sk([0.28, -0.62, 1.3], -0.08), sk([0.15, -0.5, 1.3], -0.07), sk([0.07, -0.34, 1.3], -0.05), sk([0.04, -0.24, 1.3], -0.04)], 0.028, { nf: 40 })],
    relacionados: ['arteria_carotida_externa', 'arteria_oftalmica', 'veia_facial'],
  }),
  art('arteria_occipital', 'Artéria occipital — esquema', 'Arteria occipitalis', H, [], {
    origem: 'Carótida externa, oposta à facial, junto à margem inferior do ventre posterior do digástrico.',
    trajeto: 'Segue para trás, pelo sulco occipital do osso temporal (medial ao processo mastoide), cruza a artéria carótida interna, a veia jugular interna e o nervo hipoglosso e sobe pelo couro cabeludo do occipício.',
    ramos: 'Ramo esternocleidomastóideo, mastóideo, auricular, ramo descendente (que se anastomosa com a cervical profunda e a vertebral) e ramos occipitais.',
    territorio: 'Couro cabeludo do occipício, músculos posteriores do pescoço, esternocleidomastóideo e trapézio (parte superior).',
    nota: esq('posição aproximada. O ramo descendente liga a carótida externa às artérias do dorso do pescoço (cervical profunda, vertebral); é uma anastomose entre a carótida e a subclávia.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.34, -1.08, 0.15], [0.43, -0.85, -0.04], [0.46, -0.58, -0.19], sk([0.62, -0.35, -0.85], -0.05), sk([0.4, 0.0, -1.05], -0.04)], 0.028, { nf: 26 })],
    relacionados: ['arteria_carotida_externa', 'arteria_vertebral', 'arteria_tronco_costocervical'],
  }),
  art('arteria_auricular_posterior', 'Artéria auricular posterior — esquema', 'Arteria auricularis posterior', H, [], {
    origem: 'Carótida externa, acima do ventre posterior do digástrico, na parótida.',
    trajeto: 'Sobe entre a orelha e o processo mastoide, atrás do pavilhão auricular.',
    ramos: 'Estilomastóidea (pelo forame de mesmo nome, ao nervo facial, ao estapédio e à orelha média), auricular, occipital e parotídeos.',
    territorio: 'Orelha, couro cabeludo atrás da orelha, parte do ouvido médio e dos músculos da orelha e da glândula parótida.',
    nota: esq('posição aproximada.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.43, -0.57, 0.04], [0.5, -0.48, -0.12], sk([0.9, -0.38, -0.12], -0.04), sk([0.9, -0.15, -0.25], -0.04)], 0.022, { nf: 16 })],
    relacionados: ['arteria_carotida_externa'],
  }),
  art('arteria_temporal_superficial', 'Artéria temporal superficial — esquema', 'Arteria temporalis superficialis', H, [], {
    origem: 'Ramo terminal menor da carótida externa, dentro da glândula parótida, atrás do colo da mandíbula.',
    trajeto: 'Sobe à frente do trago, cruza a raiz posterior do arco zigomático e, no couro cabeludo, se divide em ramos frontal e parietal.',
    ramos: 'Transversa da face, auriculares anteriores, zigomático-orbital, temporal média e os ramos terminais frontal e parietal.',
    territorio: 'Couro cabeludo da fronte e do vértice, região temporal, parte da face, glândula parótida e músculos temporal e masseter (por ramos).',
    nota: esq('posição aproximada, seguindo o contorno da pele (a profundidade real é de alguns milímetros a centímetros). O pulso se palpa à frente do trago e sobre o arco zigomático. A arterite de células gigantes (temporal) causa dor de cabeça e pode levar à perda da visão; a biópsia da artéria é usada no diagnóstico.'),
  }, {
    ...base, label: false,
    proc: [
      tubo([TERM, sk([0.9, -0.32, 0.12], -0.05), sk([0.9, -0.12, 0.17], -0.05), sk([0.85, 0.15, 0.15], -0.04)], 0.03, { nf: 20 }),
      tubo([sk([0.85, 0.15, 0.15], -0.04), sk([0.8, 0.4, 0.55], -0.04), sk([0.55, 0.65, 0.8], -0.04)], 0.02, { nf: 14 }),
      tubo([sk([0.85, 0.15, 0.15], -0.04), sk([0.85, 0.4, -0.2], -0.04), sk([0.65, 0.7, -0.3], -0.04)], 0.02, { nf: 14 }),
    ],
    relacionados: ['arteria_carotida_externa', 'arteria_maxilar', 'veia_retromandibular'],
  }),
  art('arteria_maxilar', 'Artéria maxilar — esquema', 'Arteria maxillaris', H, [], {
    origem: 'Ramo terminal maior da carótida externa, atrás do colo da mandíbula, dentro da parótida.',
    trajeto: 'Passa medialmente ao colo da mandíbula, na fossa infratemporal (superficial ou profunda ao músculo pterigóideo lateral), e chega à fossa pterigopalatina. Tem três partes: mandibular, pterigóidea e pterigopalatina.',
    ramos: 'Parte mandibular: alveolar inferior, meníngea média, auricular profunda e timpânica anterior. Parte pterigóidea: massetérica, temporais profundas, pterigóideos e bucal. Parte pterigopalatina: alveolar superior posterior, infraorbital, palatina descendente, esfenopalatina e do canal pterigóideo.',
    territorio: 'Dentes e ossos das duas arcadas, músculos da mastigação, bochecha, palato, cavidade nasal (pela esfenopalatina), dura-máter (pela meníngea média) e ouvido médio.',
    nota: esq('posição aproximada; as partes e os ramos estão só nomeados na ficha. A epistaxe posterior costuma vir da esfenopalatina, ramo da maxilar. A artéria alveolar inferior passa pelo forame da mandíbula com o nervo e é o ramo atingido no bloqueio anestésico dentário.'),
  }, {
    ...base, label: false,
    proc: [tubo([TERM, [0.4, -0.37, 0.17], [0.34, -0.38, 0.28], [0.26, -0.4, 0.36], [0.19, -0.42, 0.4]], 0.04, { nf: 22 })],
    relacionados: ['arteria_carotida_externa', 'arteria_temporal_superficial', 'arteria_meningea_media'],
  }),
  art('arteria_meningea_media', 'Artéria meníngea média — esquema', 'Arteria meningea media', H, [], {
    origem: 'Parte mandibular da artéria maxilar, na fossa infratemporal.',
    trajeto: 'Sobe entre os dois ramos do nervo auriculotemporal, entra na cavidade do crânio pelo forame espinhoso e se divide em ramos frontal e parietal, que correm em sulcos na face interna da calvária.',
    ramos: 'Ramos frontal (anterior) e parietal (posterior), e um ramo petroso.',
    territorio: 'Dura-máter e calvária (a maior parte do suprimento da dura é dela).',
    nota: esq('posição aproximada; a trajetória dentro do crânio é só indicada. O ramo frontal passa pelo ptério, a parte mais fina da calvária: a fratura nessa região pode romper a artéria e formar um hematoma extradural (epidural), com um intervalo lúcido seguido de piora.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.4, -0.37, 0.16], [0.337, -0.326, 0.085], [0.43, -0.15, 0.13], [0.56, 0.1, 0.25], [0.6, 0.35, 0.2]], 0.022, { nf: 18 })],
    relacionados: ['arteria_maxilar'],
  }),

  /* ═════════════ Veias da cabeça e do pescoço ═════════════ */
  vein('veia_jugular_externa', 'Veia jugular externa — esquema', 'Vena jugularis externa', H, [], {
    origem: 'União da divisão posterior da veia retromandibular com a veia auricular posterior, perto do ângulo da mandíbula, dentro da parótida.',
    trajeto: 'Desce, superficial, sobre o esternocleidomastóideo, sob o platisma, cruza o músculo obliquamente e perfura a fáscia cervical profunda, acima da clavícula, para desembocar na veia subclávia.',
    ramos: 'Tributárias: occipital, supraescapular, cervical transversa e jugular anterior.',
    territorio: 'Couro cabeludo, face (em parte) e parte superficial do pescoço.',
    nota: esq('posição aproximada, seguindo o contorno da pele (a profundidade real é de alguns milímetros a centímetros). A veia é visível na lateral do pescoço e se distende na insuficiência cardíaca direita e na tosse (aumento da pressão venosa); é usada em punções e cateteres.'),
  }, {
    ...base, mat: 'vein', label: false,
    proc: [tubo([[0.45, -0.85, 0.07], sk([0.7, -1.1, 0.18], -0.04), sk([0.65, -1.55, 0.22], -0.04), [0.42, -1.93, 0.31]], 0.045, { nf: 24 })],
    relacionados: ['veia_subclavia', 'veia_retromandibular'],
  }),
  vein('veia_retromandibular', 'Veia retromandibular — esquema', 'Vena retromandibularis', H, [], {
    origem: 'União das veias temporal superficial e maxilar, dentro da glândula parótida.',
    trajeto: 'Desce atrás do ramo da mandíbula, na parótida, lateral à artéria carótida externa e medial ao nervo facial, e se divide em um ramo anterior e um posterior.',
    ramos: 'O ramo anterior se une à veia facial (veia facial comum, para a jugular interna); o posterior se une à veia auricular posterior e forma a jugular externa.',
    territorio: 'Parte da face e do couro cabeludo temporal, parótida e fossa infratemporal.',
    nota: esq('posição aproximada. Na parótida, de lateral para medial, ficam o nervo facial, a veia retromandibular e a artéria carótida externa.'),
  }, {
    ...base, mat: 'vein', label: false,
    proc: [tubo([[0.48, -0.42, 0.05], [0.46, -0.62, 0.04], [0.45, -0.82, 0.06]], 0.04, { nf: 12 })],
    relacionados: ['veia_jugular_externa', 'veia_facial', 'arteria_temporal_superficial', 'arteria_maxilar'],
  }),
  vein('veia_facial', 'Veia facial — esquema', 'Vena facialis', H, [], {
    origem: 'Continuação da veia angular, no ângulo medial do olho, pela união das veias supratroclear e supraorbital.',
    trajeto: 'Desce ao lado do nariz, atrás da artéria facial e sem acompanhar suas curvas, cruza a mandíbula e, na altura do ângulo, se une ao ramo anterior da retromandibular; a veia facial comum desemboca na veia jugular interna.',
    ramos: 'Tributárias: supraorbital, supratroclear, nasais externas, labiais, bucais e palatina externa.',
    territorio: 'Face (fronte, nariz, lábios e bochecha).',
    nota: esq('posição aproximada, seguindo o contorno da pele (a profundidade real é de alguns milímetros a centímetros); a veia jugular interna do modelo não chega até a cabeça, de modo que a terminação fica solta no espaço. Triângulo de perigo da face: a veia facial se comunica com o seio cavernoso pela veia oftálmica superior e não tem valvas, de modo que uma infecção do nariz e do lábio superior pode levar a uma tromboflebite séptica do seio cavernoso.'),
  }, {
    ...base, mat: 'vein', label: false,
    proc: [tubo([sk([0.04, -0.24, 1.3], -0.05), sk([0.09, -0.38, 1.3], -0.06), sk([0.22, -0.58, 1.3], -0.08), sk([0.35, -0.72, 1.2], -0.1), [0.45, -0.88, 0.5], [0.36, -1.0, 0.22]], 0.035, { nf: 36 })],
    relacionados: ['arteria_facial', 'veia_retromandibular', 'veia_jugular_interna'],
  }),

  /* ═════════════ Ramos da ilíaca interna ═════════════ */
  art('arteria_glutea_superior', 'Artéria glútea superior — esquema', 'Arteria glutea superior', T, [], {
    origem: 'Maior ramo da divisão posterior da artéria ilíaca interna.',
    trajeto: 'Sai da pelve pelo forame isquiático maior, acima do músculo piriforme, com o nervo glúteo superior, e se divide em ramos superficial e profundo.',
    ramos: 'Ramo superficial (glúteo máximo) e ramo profundo (glúteos médio e mínimo, que se anastomosa com a circunflexa femoral lateral).',
    territorio: 'Músculos glúteos máximo, médio e mínimo, tensor da fáscia lata e articulação do quadril.',
    nota: esq('posição aproximada, seguindo a veia glútea do modelo. A injeção intramuscular no quadrante superolateral da nádega evita a artéria e o nervo glúteo superior e o nervo isquiático.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.3, -6.7, -0.4], [0.42, -6.62, -0.62], [0.6, -6.55, -0.75], [0.82, -6.5, -0.8], [1.05, -6.45, -0.7]], 0.036, { nf: 22 })],
    relacionados: ['arteria_iliaca_interna', 'arteria_glutea_inferior', 'veia_gluteas'],
  }),
  art('arteria_glutea_inferior', 'Artéria glútea inferior — esquema', 'Arteria glutea inferior', T, [], {
    origem: 'Divisão anterior da artéria ilíaca interna.',
    trajeto: 'Sai da pelve pelo forame isquiático maior, abaixo do músculo piriforme, com o nervo isquiático, e desce, profunda ao glúteo máximo, pela região glútea.',
    ramos: 'Ramos musculares, ramo que acompanha o nervo isquiático e ramos que se anastomosam com as circunflexas femorais e as perfurantes.',
    territorio: 'Glúteo máximo, quadrado femoral, parte proximal dos isquiotibiais, nervo isquiático e articulação do quadril.',
    nota: esq('posição aproximada, seguindo a veia glútea do modelo. Forma, com as circunflexas femorais medial e lateral e a primeira perfurante, a anastomose cruzada da coxa: uma via colateral importante entre a ilíaca interna e a femoral.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.29, -6.86, -0.69], [0.34, -7.1, -0.86], [0.4, -7.3, -0.99], [0.45, -7.5, -0.93], [0.52, -7.78, -0.77]], 0.036, { nf: 22 })],
    relacionados: ['arteria_iliaca_interna', 'arteria_glutea_superior', 'veia_gluteas', 'arteria_femoral_profunda'],
  }),
  art('arteria_obturatoria', 'Artéria obturatória — esquema', 'Arteria obturatoria', T, [], {
    origem: 'Divisão anterior da artéria ilíaca interna (às vezes, da epigástrica inferior).',
    trajeto: 'Segue pela parede lateral da pelve, com o nervo obturatório, e passa ao compartimento medial da coxa pelo canal obturatório.',
    ramos: 'Ramos anterior e posterior (ao redor do forame obturado) e o ramo acetabular, que passa pelo ligamento da cabeça do fêmur.',
    territorio: 'Músculos adutores e obturador externo, pelve (obturador interno) e cabeça do fêmur (parte).',
    nota: esq('posição aproximada, seguindo a veia obturatória do modelo. Em uma parte das pessoas a obturatória nasce da epigástrica inferior (artéria obturatória aberrante, ou “coroa da morte”), passando perto do anel femoral: pode ser lesada nas cirurgias de hérnia.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.25, -6.51, 0.0], [0.38, -6.7, -0.15], [0.48, -6.84, -0.27], [0.45, -6.99, -0.12], [0.34, -7.14, 0.02], [0.33, -7.26, 0.06]], 0.032, { nf: 24 })],
    relacionados: ['arteria_iliaca_interna', 'arteria_epigastrica_inferior', 'veia_obturatoria'],
  }),
  art('arteria_pudenda_interna', 'Artéria pudenda interna — esquema', 'Arteria pudenda interna', T, [], {
    origem: 'Divisão anterior da artéria ilíaca interna.',
    trajeto: 'Sai da pelve pelo forame isquiático maior, abaixo do piriforme, contorna a espinha isquiática, entra no períneo pelo forame isquiático menor e segue no canal pudendo (de Alcock), na parede lateral da fossa isquioanal, com o nervo pudendo.',
    ramos: 'Retal inferior, perineal, artéria do bulbo do pênis (do vestíbulo, na mulher), uretral e as artérias profunda e dorsal do pênis (do clitóris).',
    territorio: 'Parte inferior do canal anal, períneo e genitália externa.',
    nota: esq('posição aproximada, seguindo a veia pudenda interna do modelo. O bloqueio do nervo pudendo (analgesia do parto) é feito perto da espinha isquiática, referência da passagem do nervo e dos vasos.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.27, -6.7, -0.35], [0.24, -6.84, -0.44], [0.32, -7.0, -0.57], [0.32, -7.16, -0.68], [0.32, -7.3, -0.71], [0.29, -7.46, -0.63], [0.17, -7.61, -0.49], [0.07, -7.7, -0.33]], 0.03, { nf: 30 })],
    relacionados: ['arteria_iliaca_interna', 'veia_pudenda_interna'],
  }),

  /* ═════════════ Coxa e perna ═════════════ */
  art('arteria_circunflexa_femoral_medial', 'Artéria circunflexa femoral medial — esquema', 'Arteria circumflexa femoris medialis', MI, [], {
    origem: 'Artéria femoral profunda (às vezes, a femoral).',
    trajeto: 'Passa entre o pectíneo e o iliopsoas, contorna o colo do fêmur posteriormente, entre o quadrado femoral e o obturador externo, e chega à fossa trocantérica.',
    ramos: 'Ramos ascendente, transverso e profundo (que dá os ramos retinaculares do colo do fêmur).',
    territorio: 'Colo e cabeça do fêmur (a principal irrigação), adutores e músculos rotadores laterais.',
    nota: esq('posição aproximada. A fratura do colo do fêmur ou a luxação do quadril podem lesar a artéria e causar necrose avascular da cabeça do fêmur, porque é a principal irrigação dela (o ramo do ligamento da cabeça, da obturatória, é pequeno no adulto).'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.78, -7.55, 0.3], [0.8, -7.75, 0.05], [0.78, -7.85, -0.18], [0.95, -7.8, -0.38], [1.15, -7.55, -0.42], [1.25, -7.45, -0.3]], 0.034, { nf: 24 })],
    relacionados: ['arteria_femoral_profunda', 'arteria_circunflexa_femoral_lateral', 'arteria_glutea_inferior'],
  }),
  art('arteria_fibular', 'Artéria fibular — esquema', 'Arteria fibularis (peronea)', MI, [], {
    origem: 'Artéria tibial posterior, cerca de 2,5 cm abaixo da margem inferior do poplíteo; é o ramo mais calibroso dela.',
    trajeto: 'Desce no compartimento posterior, junto à face medial da fíbula, profunda ao flexor longo do hálux, até o calcanhar.',
    ramos: 'Nutrícia da fíbula, ramos musculares, perfurante, comunicante, maleolar lateral e ramos calcâneos laterais.',
    territorio: 'Compartimentos lateral e posterior da perna, fíbula e articulação do tornozelo (lado lateral).',
    nota: esq('posição aproximada. A fibular perfurante e a comunicante se anastomosam com a tibial anterior e a posterior; em uma parte das pessoas o ramo perfurante é muito calibroso e substitui a dorsal do pé.'),
  }, {
    ...base, label: false,
    proc: [tubo([[0.88, -12.5, -0.3], [0.95, -13.0, -0.3], [0.93, -13.5, -0.3], [0.9, -14.5, -0.33], [0.88, -15.2, -0.3], [0.9, -15.5, -0.28]], 0.028, { nf: 26 })],
    relacionados: ['arteria_tibial_posterior', 'veia_fibular'],
  }),
];
