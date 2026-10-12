# Pontos de melhoria adiados

Registro das decisões de **2026-10-12**, quando o roteiro (`project_context.md` §6) foi reordenado para mostrar o **corpo inteiro
e os principais sistemas o quanto antes**, seguindo o cronograma da disciplina de Anatomia. Para isso, os detalhes que não
bloqueiam essa meta saíram do caminho das fases F3–F7 e vieram para cá. **Nada foi descartado**: cada item mantém o ID de
origem, diz o que o núcleo entrega no lugar e quando voltar a ele.

## 1. Regra do núcleo e do adiado

Um item fica no **núcleo** da fase se for necessário para as quatro coisas abaixo; o que for só aprofundamento vem para cá.

1. **Ver e selecionar** a estrutura no corpo inteiro (malha, camada, cor, enquadramento).
2. **Ficha** com nome, latim e os campos básicos da estrutura (função; para músculos, ação, origem, inserção e inervação), com
   fonte.
3. **As guardas continuam valendo**: todo músculo com nervo e, para músculos de nervo espinal, com segmentos medulares. Por isso
   os ramos musculares **não** são adiados.
4. **Quiz** funcionando (localizar, escolher o nome e, onde houver campo, os de texto).

Regras para o adiado:

- **Nada some em silêncio.** Se a ficha não traz um dado por causa de um item daqui, o campo fica de fora e a `nota` diz que falta
  (`agents.md` §7.1); geometria esquemática é declarada como tal (§7.4).
- **Retomar um item** = movê-lo para uma fase ou lote do `project_context.md` com o mesmo ID, marcar aqui como “em andamento” e, ao
  concluir, ✅ com a versão.
- **Prioridade:** **A** = puxar assim que houver folga (cobrado na disciplina ou ★★★ no mapa de §4 do roteiro); **B** = próxima
  leva depois dos sistemas do cronograma; **C** = quando for útil.
- **Tamanhos** como no roteiro (P, M, G, GG).

## 2. Articulações e função (origem: F3)

A F3a (modelo e membro superior) está pronta. O resto da F3 é adiado, exceto os ligamentos da pelve (F3.4), que passam a fazer
parte da F4.6 por pertencerem à pelve.

| ID | Ponto de melhoria | Origem | O que o núcleo entrega no lugar | Gatilho para retomar | Tam. | Prio. |
| --- | --- | --- | --- | --- | --- | --- |
| M01 | Articulações e ligamentos da **coluna e do tórax**: longitudinais anterior e posterior, amarelo, interespinal, supraespinal, nucal, atlantoccipital e atlantoaxiais, costovertebrais e radiados; articulações zigapofisárias, intervertebrais e costotransversárias | F3.3 | Ossos, discos e músculos já existem; a ficha da vértebra não lista as articulações | Depois do marco 3.0, junto do sistema respiratório (mecânica da caixa torácica) | M | B |
| M02 | **Articulação temporomandibular** com ficha e movimentos (os ligamentos da cabeça já existem) | F3b | Ligamentos e músculos da mastigação continuam isolados | Depois do marco 3.0 | M | B |
| M03 | Página **“Movimentos”**, filtro “movimento → músculos”, quiz “que músculos realizam X” e os papéis **antagonista** e **fixador** | F3.5 (restante) | Dados e ficha do músculo já mostram os movimentos do membro superior; o membro inferior ganha os mesmos dados na F4.6 | Depois do marco 3.0 | G | A |
| M04 | **Origem e inserção desenhadas no osso**, com acidentes ósseos selecionáveis (tuberosidade deltóidea, sulco intertubercular…) | F3.6 | Origem e inserção só em texto, como hoje | **Primeiro item a puxar** depois dos sistemas do cronograma: é o ★★★ mais pesado que continua aberto (B8 do mapa) | GG | A |
| M05 | Bursas, bainhas sinoviais, retináculos dos extensores, aponeurose palmar, fáscia toracolombar | F3.7 | Citados em notas de fichas, sem malha | Quando houver folga; as do membro inferior entram junto (M13) | M | C |
| M06 | **Animação** ou poses de movimento (spike de viabilidade) | F3.8 | Sem animação | Depois de M03 | M | C |
| M07 | Quizzes de função: “que ligamento limita…?”, “qual a amplitude de…?” | F3.9 | Quizzes atuais | Depois de M03 | P | C |
| M08 | Inervação das carpometacarpais (fontes divergem), amplitudes de abdução e adução dos dedos, recessos e linha de inserção da cápsula | F3.2 (pendências) | Campos de fora, com nota | Quando a fonte for conferida | P | C |

## 3. Membros inferiores e pelve (origem: F4)

O **núcleo da F4** é o corpo inteiro com ossos, todos os músculos, os nervos que ligam cada músculo, as grandes articulações e seus
ligamentos principais (quadril, joelho, tornozelo, sacroilíaca, púbica). Ficam para cá:

| ID | Ponto de melhoria | Origem | O que o núcleo entrega no lugar | Gatilho para retomar | Tam. | Prio. |
| --- | --- | --- | --- | --- | --- | --- |
| M09 | **Nervos cutâneos** do membro inferior, da região glútea e da virilha: cutâneo sural, safeno, cutâneos femorais lateral, posterior e medial, genitofemoral, clúnios, fibular superficial sensitivo, cutâneos do obturatório | F4.5 | Os nervos motores têm o território sensitivo descrito no texto da ficha; sem trajeto desenhado | Depois dos sistemas do cronograma | G | B |
| M10 | **Plexos lombar e sacral** desenhados (raízes, trajeto intrapélvico, ramos curtos um a um) | F4.5 | Cada músculo recebe o ramo curto como ramo do plexo, **sem trajeto próprio**; os segmentos medulares entram (a guarda os exige) | Junto de M09 | M | B |
| M11 | **Dermátomos L1–S2** sobre a pele do membro inferior | F4.5 | Dermátomos só até o membro superior; desde a F4.1 a pele das pernas e da pelve fica sem cor de dermátomo (`dermatomeOf` devolve `null` abaixo da cintura) | Junto de M09 | P | B |
| M12 | Articulações menores do pé e ligamentos secundários: talocalcaneonavicular, calcaneocubóidea, transversa do tarso, tarsometatarsais, metatarsofalângicas, interfalângicas; ligamentos plantar longo e mola; **arcos do pé** | F4.6 | Tornozelo e subtalar com os ligamentos principais (colaterais lateral e medial/deltóideo) | Depois dos sistemas do cronograma | G | B |
| M13 | **Aponeurose plantar**, trato iliotibial em detalhe (o banco o tem: conceito “iliotibial tract”, ≈ 2,3 MB de OBJ, pesado), retináculos do tornozelo e da patela, bursas do joelho e do quadril | F4.4, F3.7 | Citados em notas | Junto de M05 | M | C |
| M14 | Músculos do membro inferior **sem malha** no banco, por código: **articular do joelho**, **extensor curto dos dedos** (o banco só tem o extensor curto do hálux) e os **interósseos dorsais do pé** (o banco só tem os plantares) — lista do inventário da F4.1 (`docs/inventario-membro-inferior.md`) | F4.2, F4.4 | Os que têm malha entram; os demais ficam listados em `docs/cobertura.md` com o motivo | Depois dos lotes A a C | M | B |

## 4. Coração e vasos (origem: F5)

O **núcleo da F5** é o coração (câmaras, valvas, coronárias), o pericárdio esquemático e as artérias e veias principais com malha
real, com camadas, ficha básica (origem, trajeto, ramos principais, território e relações importantes) e quiz de localizar.

| ID | Ponto de melhoria | Origem | O que o núcleo entrega no lugar | Gatilho para retomar | Tam. | Prio. |
| --- | --- | --- | --- | --- | --- | --- |
| M15 | Campo **Irrigação** em todos os ≈ 270 músculos + mapa `IRRIGATION` + guarda “todo músculo tem ≥ 1 artéria” | F5.3 | A ficha do músculo não mostra irrigação; a ficha da artéria mostra o território em texto | Depois de M04; sem ele o ★★★ C3 do mapa fica aberto | G | A |
| M16 | Ficha de vaso completa: pulsos, pontos de compressão, relações detalhadas | F5.2 (restante) | Ficha básica | Junto de M15 | M | B |
| M17 | **Feixes neurovasculares** como conjunto selecionável (axilar, braquial, femoral, poplíteo, tibial posterior…) | F5.4 | Nervo e vaso selecionados separadamente | Depois de M15 | M | B |
| M18 | **Sistema linfático**: linfonodos regionais e ducto torácico (por código; o banco não tem) | F5.5 | Ausente; a ficha do sistema diz que não está coberto | Depois de M15 | G | B |
| M19 | Quiz **“o que irriga isto?”** | F5.6 (restante) | Quiz de localizar os vasos | Depende de M15 | P | B |
| M20 | Vasos de menor calibre: ramos distais, veias superficiais detalhadas, plexos venosos, seios venosos da dura-máter | F5.1 | Troncos e ramos principais | Seios venosos junto do encéfalo (F7.1) | G | C |
| M21 | **Circulação fetal e anexos** (placenta, cordão, ducto arterioso, forame oval, ducto venoso): o BodyParts3D **não tem** nenhuma dessas estruturas; seria um **esquema por código**, declarado como tal | — (pedido da disciplina) | Tour e ficha de texto sobre a circulação fetal, sem modelo 3D | **Puxar se a avaliação cobrar**; a aula está no cronograma de 13/10 | M | A |

## 5. Vísceras e sistemas (origem: F6 e F7.4)

O **núcleo de cada sistema** é: camada própria, malhas disponíveis no banco, ficha básica (função, partes, relações e nota
clínica curta, com fonte) e quizzes de localizar e escolher o nome. Ficam para cá os aprofundamentos transversais:

| ID | Ponto de melhoria | Origem | O que o núcleo entrega no lugar | Gatilho para retomar | Tam. | Prio. |
| --- | --- | --- | --- | --- | --- | --- |
| M22 | **Inervação autonômica das vísceras**: ramos cardíacos, pulmonares e esofágicos do vago, troncos vagais, plexos do tórax e do abdome, tronco simpático torácico e lombar, nervos esplâncnicos | F6 (cada sistema) | Ficha cita a inervação em texto; sem trajeto desenhado | Depois dos sistemas do cronograma | G | B |
| M23 | **Irrigação e drenagem específicas** de cada víscera (artérias e veias de cada órgão, sistema porta) além dos troncos da F5 | F6 (cada sistema) | Troncos principais da F5 | Depende de M15 | G | B |
| M24 | **Omentos, recessos e pregas do peritônio** (o banco tem os mesentérios e regiões do peritônio, a conferir) | F6.2 | Órgãos e mesentérios disponíveis, sem omentos nem recessos | Depois do digestório | M | B |
| M25 | **Regiões e espaços clínicos**: triângulos do pescoço, fossas axilar e cubital, canal do carpo, trígono femoral, fossa poplítea, canal inguinal em detalhe | F6.5 antigo | Cremaster e cordão espermático entram no sistema genital masculino (F6.4) | Depois de M22 | M | B |
| M26 | **Pleuras, seios do pericárdio e mediastino por compartimentos** | F6.1 | Pleura e pericárdio como envoltórios esquemáticos | Depois do respiratório | M | B |
| M27 | **Subdivisões internas** dos órgãos: segmentos pulmonares, hepáticos e renais, cálices e pirâmides (o banco tem segmentos pulmonares e setores do fígado) | F6 | Órgão inteiro | Quando houver folga | G | C |
| M28 | **Ouvido médio e interno** em detalhe: ossículos, membrana timpânica, cóclea, labirinto, tuba auditiva (ausentes do banco; por código, esquemáticos) | F7.4 | Orelha externa com malha real; os músculos do ouvido médio já existem; ficha com esquema em texto | Depois dos sistemas do cronograma | G | B |
| M29 | **Olho em detalhe**: túnicas, câmaras e aparelho lacrimal | F7.4 | Globo com córnea, cristalino, íris, corpo vítreo e retina (malhas do banco); a glândula lacrimal existe no banco e entra se couber | Depois dos sistemas do cronograma | M | B |
| M30 | **Pele em camadas e anexos** (epiderme, derme, hipoderme, pelos, glândulas, unhas) e anatomia de superfície (A13) | A13 | Pele atual translúcida com ficha de camadas em texto | Depois dos sistemas do cronograma | M | B |
| M31 | **Genital feminino em detalhe** (ligamentos largo e redondo, irrigação uterina, mama, períneo feminino) e a **conferência de uma fonte melhor** para o modelo feminino | F6.5 | Esquema declarado do útero, tubas, ovários e vagina, ou outra fonte, conforme a decisão do spike | Depois do núcleo do sistema | G | B |
| M32 | Histologia e embriologia por sistema (A14) | F8 | Ausente | Lotes da F8 | G | C |

## 6. Dívida técnica e achados anteriores

| ID | Ponto de melhoria | Origem | Tam. | Prio. |
| --- | --- | --- | --- | --- |
| M33 | **Geometria por código com muita interseção com osso** (ligamento temporomandibular 56 %, pterigóideo lateral 34 %, ligamento alar 24 %, orbicular da boca 20 %, esfenomandibular 16 %, multífido 15 %) | Bateria de 2026-10-08 | M | B |
| M34 | Estruturas esquemáticas da F2: intrínsecos da língua, músculos do ouvido médio e lisos do olho; cartilagens da laringe e ossículos ausentes | F2 (pendências) | G | C |
| M35 | **Busca com sinônimos e inglês** (“flexiona” × “flete”, “ulnar”); nome em inglês e epônimos nas fichas (C6) | Bateria de 2026-10-08 | M | B |
| M36 | `hid=` do hash cresce sem limite ao ocultar muitas estruturas uma a uma | Bateria de 2026-10-08 | P | C |
| M37 | **Desempenho no celular**: leva 1 de `docs/otimizacao-mobile.md` (renderização sob demanda, resolução adaptativa, nervos mais leves, sem leitura de layout no laço) | Levantamento de 2026-10-08 | M | **A: antes da F4.5** (medição do lote A: 31,7–32,7 s; limite 35 s) |
| M38 | Revisão de fontes dos textos dos 6 tours; plano de corte sem “tampa” (as malhas são cascas) | F1 | M | C |
| M39 | Medir o site e a atualização do PWA em aparelhos reais; marcar *Enforce HTTPS* no Pages | `docs/publicacao-web.md` | P | B |
| M40 | **Retirar a `pele_corpo` do pacote `anatomy-body.js`** (≈ 1 MB e 55 mil vértices que a `pele_inteira` do pacote do membro inferior deixa sem uso) e, junto, voltar a decimar a pele inteira só uma vez; exige regenerar o pacote do corpo (baixar ≈ 60 MB) | F4.1 | M | C |

**M37 é condicional:** o membro inferior soma ≈ 4,4 MB de malhas (previsto, `docs/inventario-membro-inferior.md`) e dezenas de nervos novos, e a
carga no celular já era o ponto mais frágil. Medição de 2026-10-12 (`node tools/perf_mobile.js 4`): 26,3–26,8 s antes da F4.1 e **28,4 s com ela**
(os 19 s de 2026-10-08 eram com 55 nervos). **Limite: 35 000 ms** em `totalReadyMs` nessa medição; passou disso, M37 passa na frente de
qualquer outro item. **Atualização do fim do lote A (F4.2): 31,7–32,7 s**, com os nervos em 20,2–20,3 s (≈ 0,37 s por nervo novo). A F4.5 deve levar a 35–38 s, então **M37 entra antes da F4.5** (prioridade A, não mais condicional). Repetir a medição depois da F4.3 e da F4.4.

## 7. Como este registro é mantido

- Ao adiar algo novo, acrescente a linha aqui (próximo ID livre) **no mesmo commit** em que o roteiro mudar.
- Ao retomar, troque a coluna de gatilho por “em andamento — F… ” e, ao terminar, “✅ versão x.y”.
- Itens que viraram desnecessários não se apagam: marque “descartado” com o motivo, para não serem redescobertos.
