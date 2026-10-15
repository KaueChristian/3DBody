/**
 * Circulatório, vasos de menor calibre (F5.1 / M20): ramos da subclávia e da axilar, braço, antebraço, tronco, coxa, perna e pé, mais as
 * veias superficiais dos membros e as profundas da perna. Malhas reais do BodyParts3D, no mesmo pacote `anatomy-circ.js`.
 * Textos próprios, a partir de Moore, Dalley & Agur (Anatomia Orientada para a Clínica, 8ª ed.) e Gray's Anatomy (42ª ed.).
 *
 * Servem à irrigação de cada músculo (`irrigation.js`): o ramo que realmente irriga passa a ser ficha e malha. Ainda fora do
 * banco: a carótida externa e seus ramos, as glúteas, a obturatória, a pudenda interna, a circunflexa femoral medial, a fibular
 * (só em parte), a interóssea posterior e as artérias da mão além dos arcos; essas ficam no texto das fichas.
 */
import { art, vein } from './catalog-circ.js';

const T = 'tronco';
const MS = 'membro_sup';
const MI = 'membro_inf';

export const CIRC_RAMOS = [
  /* ═════════════ Ramos da subclávia (pescoço e cintura escapular) ═════════════ */
  art('arteria_supraescapular', 'Artéria supraescapular', 'Arteria suprascapularis', MS, ['arteria_supraescapular'], {
    origem: 'Tronco tireocervical, ramo da primeira parte da artéria subclávia.',
    trajeto: 'Cruza o escaleno anterior e o nervo frênico, segue atrás da clavícula e passa por cima do ligamento transverso superior da escápula, na incisura da escápula (o nervo supraescapular passa por baixo dele). Chega à fossa supraespinal e, contornando o colo da escápula, à fossa infraespinal.',
    ramos: 'Ramos musculares para o supraespinal e o infraespinal, ramo acromial, ramo articular para o ombro e ramo supraesternal.',
    territorio: 'Supraespinal, infraespinal, articulação do ombro e acrômio.',
    nota: 'Forma, com a circunflexa escapular e a dorsal da escápula, a anastomose escapular, uma via colateral entre a subclávia e a axilar quando a axilar é obstruída.',
  }, { label: false, relacionados: ['arteria_subclavia', 'arteria_circunflexa_escapular', 'arteria_escapular_dorsal'] }),
  art('arteria_cervical_transversa', 'Artéria cervical transversa', 'Arteria transversa colli', ['cabeca', MS], ['arteria_cervical_transversa'], {
    origem: 'Tronco tireocervical, ramo da primeira parte da artéria subclávia (em alguns casos, direto da subclávia).',
    trajeto: 'Cruza o trígono cervical lateral, à frente do plexo braquial e por trás do ventre inferior do omo-hióideo, e se divide em ramo superficial e ramo profundo.',
    ramos: 'Ramo superficial, que sobe para o trapézio, e ramo profundo, que desce junto à margem medial da escápula (quando este nasce da subclávia, é chamado de artéria dorsal da escápula).',
    territorio: 'Trapézio, levantador da escápula, rombóides e músculos vizinhos do pescoço.',
    nota: 'A origem do ramo profundo varia muito: ora é ramo da cervical transversa, ora nasce direto da subclávia como artéria dorsal da escápula. As fontes divergem sobre qual é o padrão mais frequente.',
  }, { label: false, relacionados: ['arteria_subclavia', 'arteria_escapular_dorsal', 'arteria_tireoidea_inferior'] }),
  art('arteria_escapular_dorsal', 'Artéria dorsal da escápula', 'Arteria dorsalis scapulae', MS, ['arteria_escapular_dorsal'], {
    origem: 'Terceira parte da artéria subclávia ou, com frequência, ramo profundo da cervical transversa.',
    trajeto: 'Passa lateralmente através do plexo braquial, profunda ao levantador da escápula, e desce ao longo da margem medial da escápula, sob os rombóides, junto com o nervo dorsal da escápula.',
    ramos: 'Ramos musculares para o levantador da escápula e os rombóides, e ramos que se anastomosam com a supraescapular e a circunflexa escapular.',
    territorio: 'Rombóides maior e menor, levantador da escápula e parte do trapézio.',
  }, { label: false, relacionados: ['arteria_subclavia', 'arteria_cervical_transversa', 'arteria_supraescapular', 'arteria_circunflexa_escapular'] }),
  art('arteria_tireoidea_inferior', 'Artéria tireóidea inferior', 'Arteria thyroidea inferior', ['cabeca'], ['arteria_tireoidea_inferior'], {
    origem: 'Tronco tireocervical, ramo da primeira parte da artéria subclávia.',
    trajeto: 'Sobe pelo escaleno anterior, faz um arco medial por trás da bainha carótica e chega à parte inferior da glândula tireoide, onde se relaciona com o nervo laríngeo recorrente.',
    ramos: 'Artéria cervical ascendente (para os escalenos e o longo do pescoço), laríngea inferior, ramos glandulares, faríngeos, esofágicos e traqueais.',
    territorio: 'Parte inferior da tireoide e das paratireoides, laringe inferior, faringe, parte cervical do esôfago e da traqueia e músculos profundos do pescoço.',
    nota: 'O nervo laríngeo recorrente cruza a artéria (por trás, à frente ou entre seus ramos); na tireoidectomia, a ligadura do tronco da artéria longe da glândula põe o nervo em risco.',
  }, { label: false, relacionados: ['arteria_subclavia', 'arteria_cervical_transversa'] }),
  art('arteria_tronco_costocervical', 'Tronco costocervical', 'Truncus costocervicalis', [T, 'cabeca'], ['arteria_tronco_costocervical'], {
    origem: 'Segunda parte da artéria subclávia, por trás do escaleno anterior (à esquerda pode nascer da primeira parte).',
    trajeto: 'Arqueia-se para trás, sobre a cúpula da pleura, até o colo da 1ª costela, onde se divide em artéria cervical profunda e artéria intercostal suprema.',
    ramos: 'Artéria cervical profunda, que sobe entre os processos transversos e o semiespinal, e artéria intercostal suprema, que desce e dá as intercostais posteriores do 1º e do 2º espaço.',
    territorio: 'Músculos profundos do pescoço e da nuca e os dois primeiros espaços intercostais posteriores.',
  }, { label: false, relacionados: ['arteria_subclavia', 'arteria_intercostais_posteriores'] }),

  /* ═════════════ Ramos da axilar ═════════════ */
  art('arteria_toracoacromial', 'Artéria toracoacromial', 'Arteria thoracoacromialis', MS, ['arteria_toracoacromial'], {
    origem: 'Segunda parte da artéria axilar, medial ao peitoral menor.',
    trajeto: 'Perfura a fáscia clavipeitoral e se divide em quatro ramos: peitoral, deltóideo, acromial e clavicular.',
    ramos: 'Ramos peitorais (entre os dois peitorais), deltóideo (ao longo da veia cefálica), acromial (rede acromial) e clavicular (para o subclávio).',
    territorio: 'Peitoral maior, peitoral menor, deltoide, subclávio e acrômio; ramos da mama.',
  }, { label: false, relacionados: ['arteria_axilar', 'arteria_toracica_lateral'] }),
  art('arteria_toracica_lateral', 'Artéria torácica lateral', 'Arteria thoracica lateralis', MS, ['arteria_toracica_lateral'], {
    origem: 'Segunda parte da artéria axilar, em geral junto da margem lateral do peitoral menor.',
    trajeto: 'Desce ao longo da margem lateral do peitoral menor, sobre o serrátil anterior, acompanhando o nervo torácico longo.',
    ramos: 'Ramos para o serrátil anterior, os peitorais, os linfonodos axilares e ramos mamários laterais.',
    territorio: 'Serrátil anterior, peitorais, parede lateral do tórax e mama.',
    nota: 'É um dos supridores da mama (ramos mamários laterais), além da torácica interna e das intercostais.',
  }, { label: false, relacionados: ['arteria_axilar', 'arteria_toracoacromial'] }),
  art('arteria_subescapular', 'Artéria subescapular', 'Arteria subscapularis', MS, ['arteria_subescapular'], {
    origem: 'Terceira parte da artéria axilar; é o maior ramo da axilar.',
    trajeto: 'Desce ao longo da margem lateral do músculo subescapular e logo se divide em artérias circunflexa escapular e toracodorsal.',
    ramos: 'Artéria circunflexa escapular e artéria toracodorsal, além de ramos para o subescapular.',
    territorio: 'Músculo subescapular, parede posterior da axila e escápula.',
  }, { label: false, relacionados: ['arteria_axilar', 'arteria_circunflexa_escapular', 'arteria_toracodorsal'] }),
  art('arteria_toracodorsal', 'Artéria toracodorsal', 'Arteria thoracodorsalis', MS, ['arteria_toracodorsal'], {
    origem: 'Continuação da artéria subescapular, depois da origem da circunflexa escapular.',
    trajeto: 'Desce com o nervo toracodorsal sobre a parede posterior da axila até o músculo latíssimo do dorso.',
    ramos: 'Ramos para o latíssimo do dorso, para o serrátil anterior e anastomoses com as intercostais posteriores.',
    territorio: 'Latíssimo do dorso, parte do serrátil anterior e parede posterior da axila.',
    nota: 'É o pedículo do retalho miocutâneo do latíssimo do dorso, usado em reconstruções, como a da mama.',
  }, { label: false, relacionados: ['arteria_subescapular'] }),
  art('arteria_circunflexa_escapular', 'Artéria circunflexa escapular', 'Arteria circumflexa scapulae', MS, ['arteria_circunflexa_escapular'], {
    origem: 'Artéria subescapular.',
    trajeto: 'Passa por trás, pelo espaço triangular (limitado pelo redondo menor, pelo redondo maior e pela cabeça longa do tríceps), e chega à fossa infraespinal.',
    ramos: 'Ramos para os músculos escapulares e anastomoses com a supraescapular e a dorsal da escápula.',
    territorio: 'Infraespinal, redondo menor, redondo maior e subescapular.',
  }, { label: false, relacionados: ['arteria_subescapular', 'arteria_supraescapular', 'arteria_escapular_dorsal'] }),
  art('arteria_circunflexa_anterior_umero', 'Artéria circunflexa anterior do úmero', 'Arteria circumflexa humeri anterior', MS, ['arteria_circunflexa_anterior_umero'], {
    origem: 'Terceira parte da artéria axilar, em geral oposta à circunflexa posterior.',
    trajeto: 'É a menor das duas; passa à frente do colo cirúrgico do úmero, profunda ao coracobraquial e à cabeça curta do bíceps, e se anastomosa com a circunflexa posterior.',
    ramos: 'Ramo ascendente (para a cabeça do úmero e a articulação do ombro) e ramos musculares.',
    territorio: 'Deltoide, bíceps, coracobraquial e articulação do ombro.',
  }, { label: false, relacionados: ['arteria_axilar', 'arteria_circunflexa_posterior_umero'] }),
  art('arteria_circunflexa_posterior_umero', 'Artéria circunflexa posterior do úmero', 'Arteria circumflexa humeri posterior', MS, ['arteria_circunflexa_posterior_umero'], {
    origem: 'Terceira parte da artéria axilar, em geral oposta à circunflexa anterior; é a maior das duas.',
    trajeto: 'Atravessa o espaço quadrangular (limitado pelo redondo menor e o subescapular, pelo redondo maior, pela cabeça longa do tríceps e pelo úmero), com o nervo axilar, e contorna o colo cirúrgico do úmero por trás.',
    ramos: 'Ramos para o deltoide, o redondo menor, a cabeça longa do tríceps e a articulação do ombro; anastomoses com a circunflexa anterior e com a braquial profunda.',
    territorio: 'Deltoide, redondo menor, redondo maior, tríceps (cabeça longa) e articulação do ombro.',
    nota: 'A fratura do colo cirúrgico do úmero ou a luxação anterior do ombro podem lesar esta artéria e o nervo axilar juntos.',
  }, { label: false, relacionados: ['arteria_axilar', 'arteria_circunflexa_anterior_umero', 'arteria_profunda_braco'] }),

  /* ═════════════ Braço e antebraço ═════════════ */
  art('arteria_profunda_braco', 'Artéria profunda do braço (braquial profunda)', 'Arteria profunda brachii', MS, ['arteria_profunda_braco'], {
    origem: 'Artéria braquial, logo abaixo da margem inferior do redondo maior.',
    trajeto: 'Acompanha o nervo radial no sulco do nervo radial, entre as cabeças do tríceps. Perto da metade do braço se divide em artéria colateral média (por trás, para a fossa do olécrano) e artéria colateral radial (que segue o nervo radial até a fossa cubital).',
    ramos: 'Ramo deltóideo, nutrícia do úmero, colaterais média e radial e ramos musculares para o tríceps.',
    territorio: 'Tríceps braquial, deltoide (em parte), braquiorradial e úmero; a rede articular do cotovelo.',
    nota: 'A fratura da diáfise do úmero no sulco do nervo radial pode lesar o nervo radial e a artéria profunda do braço.',
  }, { label: false, relacionados: ['arteria_braquial', 'arteria_circunflexa_posterior_umero', 'arteria_recorrente_radial'] }),
  art('arteria_colateral_ulnar_superior', 'Artéria colateral ulnar superior', 'Arteria collateralis ulnaris superior', MS, ['arteria_colateral_ulnar_superior'], {
    origem: 'Artéria braquial, perto da metade do braço.',
    trajeto: 'Acompanha o nervo ulnar, perfura o septo intermuscular medial e desce por trás do epicôndilo medial.',
    ramos: 'Ramos musculares para o tríceps e ramos que se anastomosam com a recorrente ulnar posterior.',
    territorio: 'Cabeça medial do tríceps e rede articular do cotovelo (lado medial).',
  }, { label: false, relacionados: ['arteria_braquial', 'arteria_colateral_ulnar_inferior', 'arteria_recorrente_ulnar'] }),
  art('arteria_colateral_ulnar_inferior', 'Artéria colateral ulnar inferior', 'Arteria collateralis ulnaris inferior', MS, ['arteria_colateral_ulnar_inferior'], {
    origem: 'Artéria braquial, cerca de 5 cm acima da fossa cubital.',
    trajeto: 'Desce à frente do epicôndilo medial, sobre o braquial, e se anastomosa com a recorrente ulnar anterior.',
    ramos: 'Ramos anterior e posterior para o cotovelo.',
    territorio: 'Braquial e rede articular do cotovelo (lado medial).',
  }, { label: false, relacionados: ['arteria_braquial', 'arteria_colateral_ulnar_superior', 'arteria_recorrente_ulnar'] }),
  art('arteria_recorrente_radial', 'Artéria recorrente radial', 'Arteria recurrens radialis', MS, ['arteria_recorrente_radial'], {
    origem: 'Artéria radial, perto da origem, na fossa cubital.',
    trajeto: 'Sobe entre o braquiorradial e o braquial, ao lado do nervo radial, e se anastomosa com a colateral radial (ramo da braquial profunda).',
    ramos: 'Ramos musculares para o braquiorradial, o supinador e os extensores radiais do carpo, e ramos articulares.',
    territorio: 'Braquiorradial, extensores radiais do carpo, supinador e rede articular do cotovelo.',
  }, { label: false, relacionados: ['arteria_radial', 'arteria_profunda_braco'] }),
  art('arteria_recorrente_ulnar', 'Artérias recorrentes ulnares', 'Arteriae recurrentes ulnares', MS, ['arteria_recorrente_ulnar'], {
    origem: 'Artéria ulnar, logo abaixo da fossa cubital; divide-se em ramo anterior e ramo posterior.',
    trajeto: 'O ramo anterior sobe entre o braquial e o pronador redondo e se anastomosa com a colateral ulnar inferior; o posterior passa entre as duas cabeças do flexor ulnar do carpo, por trás do epicôndilo medial (com o nervo ulnar), e se anastomosa com a colateral ulnar superior.',
    ramos: 'Ramos anterior e posterior, e ramos musculares para os flexores e o pronador redondo.',
    territorio: 'Pronador redondo, flexores do antebraço e rede articular do cotovelo (lado medial).',
  }, { label: false, relacionados: ['arteria_ulnar', 'arteria_colateral_ulnar_superior', 'arteria_colateral_ulnar_inferior'] }),
  art('arteria_interossea_comum', 'Artéria interóssea comum', 'Arteria interossea communis', MS, ['arteria_interossea_comum'], {
    origem: 'Artéria ulnar, logo depois das recorrentes ulnares, na fossa cubital.',
    trajeto: 'É curta e logo se divide em artéria interóssea anterior e artéria interóssea posterior; esta passa por cima da borda superior da membrana interóssea e vai ao compartimento posterior.',
    ramos: 'Interóssea anterior; interóssea posterior (com a interóssea recorrente, que sobe até a rede do cotovelo). A posterior não existe no modelo.',
    territorio: 'Os dois compartimentos profundos do antebraço, anterior (pela anterior) e posterior (pela posterior).',
    nota: 'Todos os extensores do antebraço recebem sangue, em grande parte, da interóssea posterior; por isso a interóssea comum é o elo entre a ulnar e a musculatura dorsal.',
  }, { label: false, relacionados: ['arteria_ulnar', 'arteria_interossea_anterior'] }),
  art('arteria_interossea_anterior', 'Artéria interóssea anterior', 'Arteria interossea anterior', MS, ['arteria_interossea_anterior'], {
    origem: 'Artéria interóssea comum.',
    trajeto: 'Desce sobre a membrana interóssea, entre o flexor longo do polegar e o flexor profundo dos dedos, com o nervo interósseo anterior. Acima da margem superior do pronador quadrado perfura a membrana e chega à face dorsal do carpo.',
    ramos: 'Artéria mediana (acompanha o nervo mediano), ramos nutrícios do rádio e da ulna, ramos musculares e ramo perfurante para o dorso.',
    territorio: 'Flexor profundo dos dedos, flexor longo do polegar, pronador quadrado e ossos do antebraço.',
  }, { label: false, relacionados: ['arteria_interossea_comum', 'arteria_radial'] }),
  art('arteria_princeps_polegar', 'Artéria principal do polegar', 'Arteria princeps pollicis', MS, ['arteria_princeps_polegar'], {
    origem: 'Artéria radial, depois de atravessar o primeiro espaço interósseo dorsal e chegar à palma.',
    trajeto: 'Desce ao longo do 1º metacarpal, por trás do adutor do polegar, e se divide em duas artérias digitais palmares próprias do polegar.',
    ramos: 'Duas artérias digitais palmares próprias do polegar.',
    territorio: 'Polegar e músculos da eminência tenar.',
  }, { label: false, relacionados: ['arteria_radial', 'arteria_arco_palmar_profundo'] }),
  art('arteria_arco_palmar_superficial', 'Arco palmar superficial', 'Arcus palmaris superficialis', MS, ['arteria_arco_palmar_superficial'], {
    origem: 'Continuação direta da artéria ulnar, completada, quando existe, pelo ramo palmar superficial da radial.',
    trajeto: 'Cruza a palma da mão, superficial aos tendões flexores e aos ramos digitais do nervo mediano, em curva de concavidade proximal; em geral, seu ponto mais distal está no nível da borda distal do polegar estendido.',
    ramos: 'Três artérias digitais palmares comuns, que se dividem cada uma em duas digitais palmares próprias, e uma digital própria para o lado ulnar do dedo mínimo.',
    territorio: 'Pele e partes moles da palma e os dedos, do 2º ao 5º.',
    nota: 'Em muitas pessoas o arco superficial não é completo (a radial não o fecha); isso e as anastomoses com o arco profundo importam no teste de Allen e na cirurgia da mão.',
  }, { label: false, relacionados: ['arteria_ulnar', 'arteria_arco_palmar_profundo'] }),
  art('arteria_arco_palmar_profundo', 'Arco palmar profundo', 'Arcus palmaris profundus', MS, ['arteria_arco_palmar_profundo'], {
    origem: 'Continuação direta da artéria radial, completada pelo ramo palmar profundo da ulnar.',
    trajeto: 'Passa pela palma sobre as bases dos metacarpais e os interósseos, por trás dos tendões flexores, cerca de 1 cm mais proximal que o arco superficial.',
    ramos: 'Três artérias metacarpais palmares (que se unem às digitais palmares comuns), ramos perfurantes e ramos recorrentes para o carpo.',
    territorio: 'Interósseos, metacarpais, adutor do polegar e a face profunda da palma.',
  }, { label: false, relacionados: ['arteria_radial', 'arteria_arco_palmar_superficial', 'arteria_princeps_polegar'] }),

  /* ═════════════ Tronco ═════════════ */
  art('arteria_intercostais_posteriores', 'Artérias intercostais posteriores', 'Arteriae intercostales posteriores', T, ['arteria_intercostais_posteriores'], {
    origem: 'Os 9 pares inferiores (3º ao 11º espaço) nascem da parte torácica da aorta; as duas primeiras vêm da artéria intercostal suprema, do tronco costocervical. A artéria subcostal corre sob a 12ª costela.',
    trajeto: 'Cada uma segue o sulco da costela, entre os músculos intercostais interno e íntimo, acima do nervo e abaixo da veia, e se anastomosa com as intercostais anteriores.',
    ramos: 'Ramo dorsal (músculos e pele do dorso, medula espinal), ramos colaterais, ramo cutâneo lateral e ramos mamários.',
    territorio: 'Músculos intercostais, parede do tórax e do abdome, dorso e coluna vertebral.',
    nota: 'Na coarctação da aorta, as intercostais aumentam de calibre e formam circulação colateral; a erosão das costelas por seu fluxo (sinal de Roesler) aparece na radiografia.',
  }, { label: false, relacionados: ['aorta_toracica', 'arteria_tronco_costocervical', 'arteria_toracica_interna'] }),
  art('arteria_lombares', 'Artérias lombares', 'Arteriae lumbales', T, ['arteria_lombares'], {
    origem: 'Quatro pares (L1 a L4) nascem da face posterior da aorta abdominal; o quinto, pequeno, vem da artéria sacral mediana.',
    trajeto: 'Contornam os corpos vertebrais, por trás do tronco simpático e do psoas maior, e se dividem em ramo dorsal e ramo abdominal.',
    ramos: 'Ramo dorsal (músculos e pele do dorso, canal vertebral e cauda equina) e ramo abdominal (parede do abdome, entre o transverso e o oblíquo interno).',
    territorio: 'Parede posterior e lateral do abdome, músculos do dorso e meninges espinais.',
  }, { label: false, relacionados: ['aorta_abdominal', 'arteria_iliaca_interna'] }),
  art('arteria_epigastrica_superior', 'Artéria epigástrica superior', 'Arteria epigastrica superior', T, ['arteria_epigastrica_superior'], {
    origem: 'Ramo terminal da artéria torácica interna, no 6º espaço intercostal.',
    trajeto: 'Entra na bainha do músculo reto do abdome, por trás dele, e desce até se anastomosar com a epigástrica inferior na altura do umbigo.',
    ramos: 'Ramos para o músculo reto do abdome, a pele, o diafragma e o ligamento falciforme.',
    territorio: 'Parte superior do reto do abdome e da parede anterior do abdome.',
    nota: 'A anastomose entre as epigástricas superior e inferior liga a artéria subclávia à ilíaca externa e protege a parede do abdome quando uma delas é obstruída.',
  }, { label: false, relacionados: ['arteria_toracica_interna', 'arteria_epigastrica_inferior', 'arteria_musculofrenica'] }),
  art('arteria_epigastrica_inferior', 'Artéria epigástrica inferior', 'Arteria epigastrica inferior', T, ['arteria_epigastrica_inferior'], {
    origem: 'Artéria ilíaca externa, logo acima do ligamento inguinal.',
    trajeto: 'Sobe medialmente ao anel inguinal profundo, entre o peritônio e a fáscia transversal, e entra na bainha do reto do abdome por trás do músculo, ao nível da linha arqueada.',
    ramos: 'Ramo cremastérico (artéria do ligamento redondo na mulher), ramo púbico e ramos musculares e cutâneos.',
    territorio: 'Reto do abdome, piramidal e a parte inferior da parede anterior do abdome.',
    nota: 'Limita medialmente o anel inguinal profundo: a hérnia inguinal indireta sai lateral à artéria; a direta, medial a ela (no trígono inguinal). Um ramo púbico anastomosa-se com a obturatória (a “coroa da morte”).',
  }, { label: false, relacionados: ['arteria_iliaca_externa', 'arteria_epigastrica_superior'] }),
  art('arteria_musculofrenica', 'Artéria musculofrênica', 'Arteria musculophrenica', T, ['arteria_musculofrenica'], {
    origem: 'Ramo terminal lateral da artéria torácica interna, no 6º espaço intercostal.',
    trajeto: 'Segue ao longo do arco costal, por trás das cartilagens costais, e perfura o diafragma.',
    ramos: 'Artérias intercostais anteriores dos espaços inferiores (7º ao 9º) e ramos para o diafragma e os músculos abdominais.',
    territorio: 'Diafragma (parte costal), músculos da parede do abdome superior e os últimos espaços intercostais anteriores.',
  }, { label: false, relacionados: ['arteria_toracica_interna', 'arteria_epigastrica_superior', 'arteria_frenica_inferior'] }),
  art('arteria_frenica_inferior', 'Artéria frênica inferior', 'Arteria phrenica inferior', T, ['arteria_frenica_inferior'], {
    origem: 'Aorta abdominal, logo abaixo do hiato aórtico (às vezes, do tronco celíaco); há uma de cada lado.',
    trajeto: 'Sobe sobre a face inferior do diafragma, anterior à glândula suprarrenal.',
    ramos: 'Ramos para o diafragma e as artérias suprarrenais superiores.',
    territorio: 'Face inferior do diafragma e a parte superior da glândula suprarrenal.',
  }, { label: false, relacionados: ['aorta_abdominal', 'arteria_musculofrenica', 'arteria_tronco_celiaco'] }),

  /* ═════════════ Coxa, joelho, perna e pé ═════════════ */
  art('arteria_femoral_profunda', 'Artéria femoral profunda (profunda da coxa)', 'Arteria profunda femoris', MI, ['arteria_femoral_profunda'], {
    origem: 'Lateral e posterior da artéria femoral, 3 a 4 cm abaixo do ligamento inguinal; é o maior ramo da femoral.',
    trajeto: 'Desce atrás da artéria femoral e do adutor longo, entre o pectíneo e o adutor longo, e termina como a quarta artéria perfurante. As circunflexas femorais lateral e medial costumam nascer dela.',
    ramos: 'Circunflexas femorais lateral e medial e quatro artérias perfurantes (a quarta é a continuação do tronco), que atravessam o adutor magno e chegam ao compartimento posterior.',
    territorio: 'Compartimentos posterior e medial da coxa (isquiotibiais, adutores) e o fêmur.',
    nota: 'As perfurantes se anastomosam entre si, com a glútea inferior (acima) e com os ramos da poplítea (abaixo): é a anastomose cruzada da coxa, uma via colateral importante na oclusão da femoral.',
  }, { label: false, relacionados: ['arteria_femoral', 'arteria_circunflexa_femoral_lateral', 'veia_femoral_profunda'] }),
  art('arteria_circunflexa_femoral_lateral', 'Artéria circunflexa femoral lateral', 'Arteria circumflexa femoris lateralis', MI, ['arteria_circunflexa_femoral_lateral'], {
    origem: 'Artéria femoral profunda (às vezes, direto da femoral).',
    trajeto: 'Passa lateralmente, entre as divisões do nervo femoral e por trás do sartório e do reto femoral, e se divide em ramos ascendente, transverso e descendente.',
    ramos: 'Ramo ascendente (para o tensor da fáscia lata e a região do trocânter), ramo transverso (em volta do fêmur) e ramo descendente, que segue o nervo do vasto lateral.',
    territorio: 'Quadríceps femoral, tensor da fáscia lata, região do trocânter maior e rede genicular lateral.',
  }, { label: false, relacionados: ['arteria_femoral_profunda', 'arteria_femoral', 'veia_circunflexas_femorais'] }),
  art('arteria_genicular_descendente', 'Artéria genicular descendente', 'Arteria genus descendens', MI, ['arteria_genicular_descendente'], {
    origem: 'Artéria femoral, no canal dos adutores, perto do hiato dos adutores.',
    trajeto: 'Desce junto ao nervo safeno e se divide em ramo safeno (superficial) e ramo articular (para o joelho).',
    ramos: 'Ramo safeno, ramo articular e ramos musculares para o vasto medial e o adutor magno.',
    territorio: 'Vasto medial, adutor magno (parte distal) e rede articular do joelho.',
  }, { label: false, relacionados: ['arteria_femoral', 'arteria_geniculares'] }),
  art('arteria_poplitea', 'Artéria poplítea', 'Arteria poplitea', MI, ['arteria_poplitea'], {
    origem: 'Continuação da artéria femoral, ao passar pelo hiato dos adutores.',
    trajeto: 'Atravessa a fossa poplítea, profunda à veia e ao nervo tibial, e termina na margem inferior do poplíteo, dividindo-se em artérias tibial anterior e tibial posterior.',
    ramos: 'Geniculares superior e inferior (lateral e medial), genicular média, ramos musculares (surais, para o gastrocnêmio e o sóleo) e os dois ramos terminais.',
    territorio: 'Joelho, músculos posteriores da coxa (parte distal) e da perna (gastrocnêmio, sóleo, plantar, poplíteo).',
    nota: 'O pulso poplíteo é difícil de palpar (joelho semifletido). Luxação do joelho e fraturas supracondilares do fêmur podem lesar a artéria; aneurisma poplíteo é o mais comum dos periféricos.',
  }, { relacionados: ['arteria_femoral', 'arteria_tibial_anterior', 'arteria_tibial_posterior', 'arteria_geniculares', 'veia_poplitea'] }),
  art('arteria_geniculares', 'Artérias geniculares', 'Arteriae genus', MI, ['arteria_geniculares'], {
    origem: 'Artéria poplítea: geniculares superiores lateral e medial, genicular média e geniculares inferiores lateral e medial.',
    trajeto: 'As superiores e as inferiores contornam o joelho acima e abaixo dos côndilos; a média perfura a cápsula e vai aos ligamentos cruzados.',
    ramos: 'Formam, com a genicular descendente, a recorrente tibial anterior e o ramo descendente da circunflexa lateral, a rede arterial do joelho.',
    territorio: 'Cápsula e ligamentos do joelho, côndilos do fêmur e da tíbia, patela e parte dos músculos vizinhos.',
    nota: 'A rede genicular é uma circulação colateral em volta do joelho; se a poplítea fecha de repente, ela costuma ser insuficiente.',
  }, { label: false, relacionados: ['arteria_poplitea', 'arteria_genicular_descendente'] }),
  art('arteria_tibial_anterior', 'Artéria tibial anterior', 'Arteria tibialis anterior', MI, ['arteria_tibial_anterior'], {
    origem: 'Ramo terminal menor da artéria poplítea, na margem inferior do poplíteo.',
    trajeto: 'Passa pelo hiato superior da membrana interóssea e desce sobre ela, no compartimento anterior da perna, com o nervo fibular profundo, entre o tibial anterior e o extensor longo dos dedos (depois, o extensor longo do hálux); continua, à frente do tornozelo, como a artéria dorsal do pé.',
    ramos: 'Recorrentes tibiais posterior e anterior (para a rede do joelho), maleolares anterior medial e lateral e ramos musculares.',
    territorio: 'Músculos do compartimento anterior da perna (tibial anterior, extensor longo dos dedos, extensor longo do hálux, fibular terceiro) e a rede do tornozelo.',
    nota: 'A síndrome compartimental do compartimento anterior comprime a artéria e o nervo fibular profundo; o pulso se sente mais à frente, na artéria dorsal do pé.',
  }, { relacionados: ['arteria_poplitea', 'arteria_dorsal_pe', 'veia_tibial_anterior'] }),
  art('arteria_tibial_posterior', 'Artéria tibial posterior', 'Arteria tibialis posterior', MI, ['arteria_tibial_posterior'], {
    origem: 'Ramo terminal maior da artéria poplítea, na margem inferior do poplíteo.',
    trajeto: 'Desce no compartimento posterior profundo, sob o sóleo, com o nervo tibial; passa por trás do maléolo medial, entre os tendões do flexor longo dos dedos e do flexor longo do hálux, no túnel do tarso, e se divide em artérias plantares medial e lateral.',
    ramos: 'Artéria fibular (o ramo mais calibroso), circunflexa fibular, nutrícia da tíbia, ramos maleolares mediais e calcâneos e ramos musculares.',
    territorio: 'Compartimentos posterior e lateral da perna (este pela fibular) e a planta do pé.',
    nota: 'O pulso tibial posterior se palpa atrás do maléolo medial, entre o maléolo e o tendão do calcâneo. A artéria fibular, que irriga o compartimento lateral, é uma ficha própria (esquema por código).',
  }, { relacionados: ['arteria_poplitea', 'arteria_plantar_medial', 'arteria_plantar_lateral', 'veia_tibial_posterior'] }),
  art('arteria_dorsal_pe', 'Artéria dorsal do pé', 'Arteria dorsalis pedis', MI, ['arteria_dorsal_pe'], {
    origem: 'Continuação da artéria tibial anterior, à frente do tornozelo, entre os maléolos.',
    trajeto: 'Segue o dorso do pé, lateral ao tendão do extensor longo do hálux, e no 1º espaço interósseo dá o ramo plantar profundo, que se une à plantar lateral no arco plantar profundo.',
    ramos: 'Artérias társicas medial e lateral, arqueada (que dá as metatarsais dorsais) e primeira metatársica dorsal; ramo plantar profundo.',
    territorio: 'Dorso do pé, músculos curtos dorsais e os dedos.',
    nota: 'O pulso dorsal do pé se palpa lateral ao tendão do extensor longo do hálux e é um sinal clínico da circulação do membro inferior. Em uma pequena parte das pessoas é pequeno ou ausente por variação anatômica, sem doença.',
  }, { relacionados: ['arteria_tibial_anterior', 'arteria_plantar_lateral'] }),
  art('arteria_plantar_medial', 'Artéria plantar medial', 'Arteria plantaris medialis', MI, ['arteria_plantar_medial'], {
    origem: 'Ramo terminal menor da artéria tibial posterior, sob o retináculo dos flexores.',
    trajeto: 'Segue a margem medial da planta, profunda ao abdutor do hálux, ao lado do nervo plantar medial.',
    ramos: 'Ramo profundo e ramo superficial, que se anastomosam com as metatarsais plantares, e ramos para a pele da planta medial.',
    territorio: 'Músculos da região plantar medial (abdutor do hálux, flexor curto dos dedos) e a pele da planta medial.',
  }, { label: false, relacionados: ['arteria_tibial_posterior', 'arteria_plantar_lateral'] }),
  art('arteria_plantar_lateral', 'Artéria plantar lateral', 'Arteria plantaris lateralis', MI, ['arteria_plantar_lateral'], {
    origem: 'Ramo terminal maior da artéria tibial posterior, sob o retináculo dos flexores.',
    trajeto: 'Cruza a planta obliquamente, entre o flexor curto dos dedos e o quadrado plantar, até a base do 5º metatarsal, e forma o arco plantar profundo, que se une ao ramo plantar profundo da dorsal do pé.',
    ramos: 'Arco plantar profundo, artérias metatarsais plantares (com as digitais plantares comuns) e ramos musculares.',
    territorio: 'Músculos da planta (camadas intermediária e profunda), interósseos e pele lateral da planta.',
  }, { label: false, relacionados: ['arteria_tibial_posterior', 'arteria_plantar_medial', 'arteria_dorsal_pe'] }),

  /* ═════════════ Veias superficiais dos membros e profundas da perna ═════════════ */
  vein('veia_cefalica', 'Veia cefálica', 'Vena cephalica', MS, ['veia_cefalica'], {
    origem: 'Lado lateral da rede venosa dorsal da mão.',
    trajeto: 'Sobe pela face lateral do antebraço e do braço, no tecido subcutâneo, e no sulco deltopeitoral passa pelo trígono clavipeitoral; perfura a fáscia clavipeitoral e desemboca na veia axilar.',
    ramos: 'Comunica-se com a basílica pela veia intermédia do cotovelo (e a intermédia do antebraço).',
    territorio: 'Parte lateral da mão, do antebraço e do braço (rede superficial).',
    nota: 'É via comum de venopunção e de acesso venoso; segue ao lado do ramo deltóideo da toracoacromial.',
  }, { label: false, relacionados: ['veia_axilar', 'veia_basilica', 'veia_intermedia_cotovelo'] }),
  vein('veia_basilica', 'Veia basílica', 'Vena basilica', MS, ['veia_basilica'], {
    origem: 'Lado medial da rede venosa dorsal da mão.',
    trajeto: 'Sobe pelo lado medial do antebraço e do braço, perfura a fáscia profunda perto da metade do braço e se une às veias braquiais, formando a veia axilar na margem inferior do redondo maior.',
    ramos: 'Recebe a veia intermédia do cotovelo; liga-se à cefálica.',
    territorio: 'Parte medial da mão, do antebraço e do braço (rede superficial).',
    nota: 'Os nervos cutâneos medial do braço e do antebraço acompanham a basílica; sua lesão em punções é possível.',
  }, { label: false, relacionados: ['veia_axilar', 'veia_braquial', 'veia_cefalica', 'veia_intermedia_cotovelo'] }),
  vein('veia_intermedia_cotovelo', 'Veia intermédia do cotovelo', 'Vena mediana cubiti', MS, ['veia_intermedia_cotovelo'], {
    origem: 'Ramo oblíquo que liga a veia cefálica à basílica, na fossa cubital.',
    trajeto: 'Sobe, medial, sobre a aponeurose do bíceps braquial, que a separa da artéria braquial e do nervo mediano.',
    ramos: 'Conecta a cefálica à basílica; recebe a veia intermédia do antebraço.',
    territorio: 'Rede superficial do cotovelo.',
    nota: 'É o local mais usado para venopunção; a aponeurose do bíceps protege a artéria braquial que está por baixo. O padrão das veias da fossa cubital varia (em “M” ou em “H”).',
  }, { label: false, relacionados: ['veia_cefalica', 'veia_basilica', 'arteria_braquial'] }),
  vein('veia_safena_magna', 'Veia safena magna', 'Vena saphena magna', MI, ['veia_safena_magna'], {
    origem: 'Extremidade medial do arco venoso dorsal do pé.',
    trajeto: 'Sobe à frente do maléolo medial, pelo lado medial da perna e da coxa, no tecido subcutâneo, e passa pelo hiato safeno, cerca de 3 cm abaixo e lateral ao tubérculo púbico, e desemboca na veia femoral.',
    ramos: 'Tributárias no hiato safeno: circunflexa ilíaca superficial, epigástrica superficial e pudendas externas; também acessórias e as veias comunicantes com o sistema profundo.',
    territorio: 'Pele e tecido subcutâneo do dorso e da margem medial do pé, da perna e da coxa.',
    nota: 'É a veia mais longa do corpo. É enxerto usado na revascularização do miocárdio e sede das varizes. O nervo safeno a acompanha na perna: pode ser lesado na safenectomia.',
  }, { relacionados: ['veia_femoral', 'veia_safena_parva'] }),
  vein('veia_safena_parva', 'Veia safena parva', 'Vena saphena parva', MI, ['veia_safena_parva'], {
    origem: 'Extremidade lateral do arco venoso dorsal do pé.',
    trajeto: 'Passa por trás do maléolo lateral, sobe pela face posterior da perna, entre as cabeças do gastrocnêmio, perfura a fáscia poplítea e desemboca na veia poplítea.',
    ramos: 'Comunica-se com a safena magna e com as veias profundas por veias perfurantes.',
    territorio: 'Pele e tecido subcutâneo do dorso lateral do pé e da região posterior da perna.',
    nota: 'O nervo sural a acompanha; a veia safena parva também pode ser sede de varizes.',
  }, { relacionados: ['veia_poplitea', 'veia_safena_magna'] }),
  vein('veia_poplitea', 'Veia poplítea', 'Vena poplitea', MI, ['veia_poplitea'], {
    origem: 'União das veias tibiais anterior e posterior, na margem inferior do poplíteo.',
    trajeto: 'Sobe pela fossa poplítea, entre a artéria (profunda a ela) e o nervo tibial (superficial a ela), e continua como veia femoral no hiato dos adutores.',
    ramos: 'Safena parva, veias geniculares e veias musculares (surais).',
    territorio: 'Joelho, perna e pé.',
    nota: 'Local frequente de trombose venosa profunda.',
  }, { relacionados: ['arteria_poplitea', 'veia_femoral', 'veia_safena_parva', 'veia_tibial_anterior', 'veia_tibial_posterior'] }),
  vein('veia_tibial_anterior', 'Veias tibiais anteriores', 'Venae tibiales anteriores', MI, ['veia_tibial_anterior'], {
    origem: 'Continuam as veias dorsais do pé, comitantes da artéria dorsal do pé.',
    trajeto: 'Acompanham a artéria tibial anterior, em par, atravessam o hiato da membrana interóssea e se unem às tibiais posteriores.',
    ramos: 'Veias musculares do compartimento anterior e comunicantes com a safena magna.',
    territorio: 'Compartimento anterior da perna e dorso do pé.',
  }, { label: false, relacionados: ['veia_poplitea', 'arteria_tibial_anterior'] }),
  vein('veia_tibial_posterior', 'Veias tibiais posteriores', 'Venae tibiales posteriores', MI, ['veia_tibial_posterior'], {
    origem: 'Formadas por trás do maléolo medial, pela junção das veias plantares medial e lateral.',
    trajeto: 'Sobem acompanhando a artéria tibial posterior, em par, e recebem as veias fibulares e musculares (sóleo) antes de formar a poplítea.',
    ramos: 'Veias fibulares, veias do sóleo e comunicantes com a safena magna.',
    territorio: 'Compartimentos posterior e lateral da perna e planta do pé.',
    nota: 'As veias do sóleo são locais comuns de origem de trombose venosa profunda.',
  }, { label: false, relacionados: ['veia_poplitea', 'arteria_tibial_posterior', 'veia_fibular'] }),
  vein('veia_fibular', 'Veias fibulares', 'Venae fibulares', MI, ['veia_fibular'], {
    origem: 'Veias comitantes da artéria fibular.',
    trajeto: 'Sobem pelo compartimento posterior, junto à fíbula, e desembocam nas veias tibiais posteriores.',
    ramos: 'Veias musculares do compartimento lateral e posterior.',
    territorio: 'Compartimento lateral e parte do compartimento posterior da perna.',
  }, { label: false, relacionados: ['veia_tibial_posterior'] }),
  vein('veia_femoral_profunda', 'Veia femoral profunda', 'Vena profunda femoris', MI, ['veia_femoral_profunda'], {
    origem: 'Formada por tributárias da coxa posterior e medial (veias perfurantes, circunflexas).',
    trajeto: 'Sobe com a artéria femoral profunda, à frente dela, e desemboca na veia femoral cerca de 4 cm abaixo do ligamento inguinal.',
    ramos: 'Veias perfurantes e veias circunflexas femorais lateral e medial.',
    territorio: 'Compartimentos posterior e medial da coxa.',
  }, { label: false, relacionados: ['veia_femoral', 'arteria_femoral_profunda', 'veia_circunflexas_femorais'] }),
  vein('veia_circunflexas_femorais', 'Veias circunflexas femorais', 'Venae circumflexae femoris', MI, ['veia_circunflexas_femorais'], {
    origem: 'Veias comitantes das artérias circunflexas femorais lateral e medial.',
    trajeto: 'Acompanham as artérias em volta do colo do fêmur e desembocam na veia femoral profunda ou na própria femoral.',
    ramos: 'Veias musculares da região do quadril e da coxa.',
    territorio: 'Região do trocânter, músculos do quadril e da coxa proximal.',
  }, { label: false, relacionados: ['veia_femoral_profunda', 'veia_femoral', 'arteria_circunflexa_femoral_lateral'] }),
];
