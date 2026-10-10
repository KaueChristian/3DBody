# Cobertura de músculos e nervos (F2)

Auditoria feita ao fechar a **F2** do roteiro (`project_context.md`): para cada músculo da Terminologia Anatômica (TA) da
cabeça, do pescoço, do tronco e do membro superior, a entrada correspondente no catálogo — ou a exclusão, com o motivo.
Os músculos e os nervos dos membros inferiores ficam para a F4. Contagem atual: **204 músculos**, **100 nervos e gânglios**,
mais a medula espinal (367 estruturas no atlas).

Método: conferência da lista da TA e dos capítulos de miologia de Moore e do Gray’s contra os ids do catálogo; cada músculo
foi verificado no banco BodyParts3D (nome do conceito em `tools/isa_element_parts.txt`) antes de ser modelado por código.

## 1. Músculos

| Região / grupo (TA) | Situação |
| --- | --- |
| Epicrânio (occipitofrontal, temporoparietal), auriculares | ✅ `frontal`, `occipital`, `temporoparietal`, `auricular_*` |
| Pálpebras, nariz e boca (mímica) | ✅ orbicular do olho, corrugador, abaixador do supercílio, prócero, nasal, abaixador do septo, orbicular da boca, levantadores, zigomáticos, risório, abaixadores, mentual, bucinador, platisma; **novos:** transverso do mento e incisivos labiais |
| Mastigação | ✅ masseter, temporal, pterigóideos medial e lateral |
| Língua (extrínsecos e intrínsecos) | ✅ **F2.3**: genioglosso e hioglosso (malha real), estiloglosso e palatoglosso (por código), longitudinais superior e inferior, transverso e vertical (por código, dentro da malha da língua) |
| Palato mole e faringe | ✅ **F2.4**: levantador e tensor do véu palatino, músculo da úvula, palatofaríngeo, constritores superior, médio e inferior, estilofaríngeo, salpingofaríngeo (malhas reais) |
| Laringe | ✅ **F2.5**: cricotireóideo, cricoaritenóideos posterior e lateral, aritenóideos transverso e oblíquo, tireoaritenóideo e vocal (malhas reais) |
| Ouvido médio | ✅ **F2.6**: tensor do tímpano e estapédio (por código, intraósseos, sem os ossículos) |
| Músculos do olho | ✅ 6 extraoculares e levantador da pálpebra (malha real); **F2.7**: ciliar, esfíncter e dilatador da pupila, tarsais superior e inferior (lisos, esquemáticos) |
| Supra e infra-hióideos | ✅ digástrico, milo-hióideo, gênio-hióideo, estilo-hióideo, esterno-hióideo, esternotireóideo, tíreo-hióideo, omo-hióideo |
| Pescoço lateral e pré-vertebrais | ✅ ECM, escalenos anterior, médio, posterior e mínimo, longos da cabeça e do pescoço, retos anterior e lateral da cabeça |
| Suboccipitais | ✅ retos posteriores maior e menor, oblíquos superior e inferior da cabeça |
| Coluna cervical: curtos | ✅ **novos nesta etapa**: intertransversários cervicais anteriores e posteriores, interespinais cervicais (malhas reais) |
| Dorso (eretores e transversoespinais) | ✅ iliocostal (lombar, torácico, cervical), longuíssimo (torácico, cervical, da cabeça), espinal torácico, semiespinais, multífido, rotadores, interespinais e intertransversários (torácicos/lombares, ver exclusões) |
| Dorso superficial | ✅ trapézio (3 partes), latíssimo, romboides, levantador da escápula, serráteis posteriores |
| Parede do tórax e diafragma | ✅ intercostais externos, internos e íntimos, subcostais, transverso do tórax, levantadores das costelas, diafragma |
| Parede do abdome | ✅ oblíquos externo e interno, transverso do abdome, reto do abdome, piramidal, quadrado do lombo, psoas maior, ilíaco |
| Assoalho pélvico e períneo | ✅ **F2.8**: pubococcígeo, iliococcígeo, **puborretal**, coccígeo, esfíncter externo do ânus, **bulboesponjoso, isquiocavernoso, transversos superficial e profundo do períneo, esfíncter externo da uretra**, obturador interno (a parede lateral da pelve) |
| Cintura escapular, ombro e braço | ✅ peitoral maior (3 partes), peitoral menor, subclávio, serrátil anterior, deltoide (3 partes), manguito rotador, redondo maior, coracobraquial, bíceps, braquial, tríceps, ancôneo |
| Antebraço | ✅ pronadores, flexores (radial e ulnar do carpo, palmar longo, superficial e profundo dos dedos, flexor longo do polegar), extensores e supinador, braquiorradial |
| Mão | ✅ tenares, hipotenares (com o **palmar curto**), adutor do polegar, lumbricais, interósseos |

### Exclusões justificadas (músculos que **não** estão no catálogo, por ora)

| Músculo | Motivo |
| --- | --- |
| Músculos intrínsecos da orelha (helicino maior e menor, trágico, antitrágico, transverso e oblíquo da orelha) | Vestigiais no ser humano, sem função reconhecida e sem malha no banco; ocupariam uma lâmina do pavilhão da orelha |
| Músculo orbital (liso, na fissura orbital inferior) | Vestigial no ser humano |
| Espinal da cabeça e espinal cervical | Inconstantes; costumam estar fundidos ao semiespinal da cabeça |
| Intertransversários torácicos | Rudimentares, sem malha no banco |
| Ariepiglótico e tireoepiglótico | São partes do aritenóideo oblíquo e do tireoaritenóideo; descritos na ficha desses músculos |
| Partes dos constritores (pterigofaríngea, bucofaríngea, milofaríngea, glossofaríngea; tireofaríngea e cricofaríngea) | O atlas mostra cada constritor como um músculo só; as partes e o triângulo de Killian estão na ficha |
| Levantador da glândula tireoide | Inconstante; entra com a tireoide (F6) |
| Cremaster | É do canal inguinal e do cordão espermático: entra com o sistema genital (F6.4) |
| Piriforme, gêmeos, quadrado femoral, obturador externo e demais músculos do quadril e da coxa | Membro inferior (F4) |

O número de músculos de uma região varia entre as fontes (cabeças e partes contadas à parte). Aqui cada parte com malha
separada no BodyParts3D ou com inervação própria é uma entrada.

## 2. Nervos

| Grupo | Situação |
| --- | --- |
| Os 12 pares cranianos | ✅ I, II, III, IV, V (V1, V2, V3 e ramos), VI, VII (tronco e ramos), VIII, IX, X (tronco cervical e torácico alto), XI e XII |
| Ramos de V e VII | ✅ **F2.10**: frontal (supraorbital e supratroclear), lacrimal, nasociliar, zigomático, palatinos, nasopalatino, corda do tímpano, petroso maior, nervo do estapédio e nervos dos tensores |
| Vago e ramos | ✅ **F2.9**: plexo faríngeo, laríngeo superior (interno e externo), laríngeo recorrente |
| Autônomos da cabeça e do pescoço | ✅ **F2.11**: gânglios pterigopalatino, ótico e submandibular; tronco simpático cervical com os gânglios superior, médio e estrelado (o ciliar é parte da malha real do oculomotor) |
| Plexo cervical | ✅ ramos musculares, alça cervical, frênico e, agora, os cutâneos: occipital menor, auricular magno, cervical transverso e supraclaviculares (**F2.12**) |
| Plexo braquial e ramos | ✅ plexo, dorsal da escápula, torácico longo, supraescapular, subclávio, peitorais, subescapulares, toracodorsal, axilar, musculocutâneo, radial (com interósseo posterior), mediano (com interósseo anterior), ulnar (com o ramo profundo) |
| Sensitivos do membro superior | ✅ **F2.12**: intercostobraquial, cutâneos medial do braço e do antebraço, posterior e lateral inferior do braço, posterior do antebraço (ramos do radial), lateral superior do braço (axilar), lateral do antebraço (musculocutâneo), ramo superficial do radial, ramos cutâneos palmar (mediano e ulnar) e dorsal (ulnar), digitais palmares e dorsais |
| Tronco | ✅ intercostais, toracoabdominais, subcostal, ílio-hipogástrico, ilioinguinal, ramos posteriores |
| Medula e espinais | ✅ **F2.13**: medula espinal, 31 pares (raízes, gânglios e início do nervo, em quatro fichas), cauda equina e filo terminal |
| Pelve e períneo | ✅ pudendo, nervos do levantador do ânus e do coccígeo, nervo do obturador interno |

### Nervos e ramos ainda fora do catálogo

| Item | Onde entra |
| --- | --- |
| Nervos cutâneos, motores e plexos lombar e sacral para o membro inferior (femoral na coxa, obturatório, glúteos, ciático e ramos, safeno, cutâneos…) | F4.5 (membros inferiores) |
| Ramos cardíacos, pulmonares e esofágicos do vago, troncos vagais, plexos autonômicos do tórax e do abdome, tronco simpático torácico e lombar, nervos esplâncnicos | F6 (vísceras) |
| Ramos do trigêmeo de calibre pequeno: alveolares superiores, nasais posteriores, faríngeo (de Bock), meníngeo médio, nervos dentais | Ficam nos textos das fichas de V1–V3 (não são desenhados) |
| Nervo timpânico (de Jacobson), petroso menor, nervo do canal pterigóideo, petroso profundo, ramo auricular do vago, nervo meníngeo | Descritos na ficha do nervo que os origina (IX, VII, X); fios curtos demais para o modelo |
| Ramos cutâneos laterais e anteriores dos intercostais, nervos clúnios superiores | Descritos nas fichas de origem (intercostais, ramos posteriores) |

## 3. Geometria e precisão

- Os músculos novos com malha real (língua, palato, faringe, laringe, cervicais curtos, puborretal e obturador interno) usam o
  mesmo pipeline dos demais (`tools/body_parts.py` + `fetch_body.py` + `convert_body.py --append`).
- Os modelados por código (estiloglosso, palatoglosso, intrínsecos da língua, ouvido médio, face, olho e períneo urogenital) são
  **aproximados** e dizem isso na ficha. Os do ouvido médio são intraósseos (o modelo não tem o ouvido médio), e os músculos
  lisos do olho estão dentro do globo.
- **Correção importante:** o banco BodyParts3D só tem um “músculo perineal”, e ele é, na verdade, o esfíncter externo do ânus (as
  mesmas quatro peças). O atlas mostrava essa malha como “Músculos perineais superficiais”; ela foi removida e os músculos do
  períneo urogenital (bulboesponjoso, isquiocavernoso, transversos e esfíncter da uretra) foram modelados por código.
  Quem tiver esse id (`perineo_superficial`) em favoritos, listas ou progresso não perde o resto: a estrutura some do atlas e o id aparece só como texto nas listas.
- Os nervos novos que correm sob a pele (sensitivos) são ancorados na pele do modelo; os que atravessam forames e canais
  (VIII, IX, X, petrosos, corda do tímpano) têm trechos intraósseos, como na realidade. O modelo não tem as artérias, as veias
  nem as vísceras: os laços do laríngeo recorrente e o trajeto do vago no tórax são aproximados.

## 4. Verificação

`npm run test:catalog` (guardas do catálogo: ids únicos, todo músculo com nervo e, agora, todo músculo inervado por nervo
espinal com `segmentos`), `npm run test:study` e `npm run test:smoke` passam com o catálogo completo. `node tools/gen_revisao.js` e
`node tools/gen_miotomos.js` regeneram `docs/revisao-conteudo.md` e `docs/miotomos.md`.
