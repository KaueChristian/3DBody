# Pendências por sistema já implementado, com a fonte de cada malha

Levantamento de **2026-10-20**, pedido pelo responsável depois da conferência da F6.2: para cada sistema que já está no atlas
(esquelético, articular, muscular, nervos periféricos, circulatório, respiratório e digestório), o que ainda falta e **de onde
virá a malha**. Complementa o [`pontos-de-melhoria.md`](pontos-de-melhoria.md) (M01–M40), que registra o que foi adiado por
decisão; aqui entram também as lacunas que **não estavam registradas em lugar nenhum** (marcadas com ★).

Sistemas que ainda não foram iniciados (encéfalo, urinário, genitais, endócrino, sentidos, tegumentar) ficam no roteiro
(`project_context.md` §6) e **não** entram nesta lista.

## 1. Como cada pendência foi classificada

Regra do responsável: *se a malha não existe no banco, avaliar quão fiel fica a estrutura modelada por código; se a semelhança
for grande, seguir com o código; se for pequena, procurar uma base compatível, como foi feito com os órgãos femininos.*

| Código | Significa |
| --- | --- |
| **B** | Há malha no **BodyParts3D** (índice local `tools/isa_element_parts.txt`) que o atlas ainda não usa, ou usa agrupada. Custo baixo: `fetch_body.py` + `convert_body.py`. |
| **H** | Há malha no **Human Reference Atlas** (CC BY 4.0), conteúdo conferido nos metadados do objeto. Exige registro no corpo (escala por pontos de referência), como nos pulmões. |
| **C+** | Sem malha; **por código com fidelidade alta**. Seguir com o código e declarar o esquema na ficha. |
| **C~** | Sem malha; por código com fidelidade **média**. Aceitável se declarado; revisar caso a caso. |
| **C−** | Sem malha; por código com fidelidade **baixa**. **Não seguir com código**: buscar fonte (§10) ou ficar só em texto. |
| **X** | Fonte candidata externa já identificada, **ainda não baixada nem testada** (§10). |
| **T** | Fica só em texto na ficha (estrutura microscópica, inconstante ou sem valor de seleção em 3D). |
| **R** | Região da malha que já existe: vira peça selecionável **sem geometria nova** (como os segmentos de Couinaud). |

**Critério da fidelidade por código** (o que decidiu entre C+, C~ e C−):

1. **Âncoras.** A estrutura é um tubo, faixa, lâmina ou cápsula entre pontos que já existem medidos no modelo (ossos, órgãos,
   outros vasos)? Então o trajeto fica determinado pelas vizinhas. Foi assim com os 112 nervos, os ligamentos do membro superior
   e as 167 artérias e veias.
2. **Escala.** O modelo é 1 unidade = 10 cm. O ajuste dos pulmões ao tórax ficou em ≈ 2 mm (erro quadrático médio) e as duas
   árvores brônquicas divergem ≈ 1,4 cm. Estrutura com poucos milímetros (ossículos, papilas, válvulas) fica sem forma reconhecível.
3. **Forma própria.** Se a forma não decorre das vizinhas (hélice da cóclea, cavidades dos seios, lábios de uma valva), o código só
   produz uma figura "genérica".

Regra de execução para os itens C−/X: **spike** curto antes de qualquer trabalho (confirmar licença, formato, tamanho e como
registrar no corpo), com autorização do responsável para cada download (`agents.md` §9).

## 2. Resumo

| Sistema | Pendências | Hoje | Mais urgente |
| --- | --- | --- | --- |
| Esquelético | 12 | 52 ossos e cartilagens, vários **agrupados** | Separar vértebras, costelas, ossos do carpo e dentes (peças individuais já existem no banco) |
| Articular e ligamentos | 26 | 13 articulações e 29 ligamentos (só cabeça, tronco superior e membro superior) | Quadril, joelho, tornozelo e pelve (F4.6); coluna (M01) |
| Muscular, fáscias e tendões | 10 | 255 músculos, 3 fáscias | Tendão do calcâneo e fáscia lata (banco); 4 músculos do pé por código |
| Nervos | 8 | 112 nervos e gânglios | Cutâneos do membro inferior (M09) e autonômicos (M22) |
| Circulatório | 14 | 14 cardíacas, 111 artérias, 56 veias, 15 linfáticas | **Timo** ★ (previsto na F6.1 e ausente), linfonodos e troncos linfáticos |
| Respiratório | 9 | 28 estruturas | **Nariz e seios paranasais**, segmentos broncopulmonares, ligamentos da laringe |
| Digestório e oral | 20 | 34 + língua, glândulas e dentes | Peritônio (omentos e ligamentos), esfíncter interno do ânus, tonsilas |
| **Total** | **99** | | |

Contagens de "Hoje" conferidas no catálogo carregado em 2026-10-20 (740 estruturas).

## 3. Esquelético

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P01 ★ | **Separar em peças individuais** as vértebras cervicais C3–C7, torácicas e lombares, as costelas I–XII, os ossos do carpo e do tarso e os dentes. Hoje o atlas as junta em 12 itens (`o_vertebras_toracicas`, `o_costelas_*`, `o_carpo`, `o_dentes_sup`…) | **B.** O índice do banco tem conceito por vértebra, por costela (12), por osso do carpo e por dente (incisivo, canino, pré-molar e molar por arcada). Conferido por nome; as malhas não foram abertas | **A** | — |
| P02 | Acidentes ósseos selecionáveis (tuberosidade deltóidea, sulco intertubercular…) e origem/inserção desenhadas no osso | **R.** Seleção de região da malha do osso; sem geometria nova | A | M04 |
| P03 | Ossículos da audição (martelo, bigorna, estribo) | **C−** (3 a 8 mm; forma própria). Fonte **X**: OpenEar (§10) | B | M28, M34 |
| P04 | Labirinto ósseo e cóclea (esquema do ouvido interno) | **C~** (hélice de ≈ 2,5 voltas e três canais em toro dão um esquema reconhecível), mas melhor com **X** (OpenEar) | B | M28 |
| P05 | Seios paranasais (maxilar, frontal, esfenoidal, etmoidais) | **C−** (cavidades irregulares dentro de ossos que já existem). **X**: NasalSeg cobre só cavidades nasais e seios maxilares, em voxels | B | — |
| P06 | Conchas nasais média e superior, meatos, septo ósseo em detalhe | Fazem parte do etmoide (uma peça no banco). **C−**; sem fonte identificada para as conchas. Concha inferior e cartilagens nasais já existem | C | — |
| P07 | Cartilagem alar menor e acessórias, cartilagem da tuba auditiva | O banco tem as cartilagens maior alar, lateral e septal. As demais: **C~**, pequenas | C | — |
| P08 | Sutura, fontículos e sincondroses do crânio (coronal, sagital, lambdóidea…) | **C+** como linhas projetadas na superfície do crânio (curvas sobre a malha) | B | — |
| P09 | Ossos acessórios e sesamoides da mão, fabela | Inconstantes. **T** | C | — |
| P10 | Discos intervertebrais individuais e **núcleo pulposo** | Disco por vértebra: **B** (conceito por vértebra no banco). Núcleo pulposo: **H** (o disco do HRA traz o núcleo; o arquivo original tem 19,6 MB) | C | — |
| P11 | Pelve feminina | **H** (`pelvis-female` v1.3, 1,6 MB). Entra com o genital feminino (F6.5) | — | M31 |
| P12 | Esterno em três partes (manúbrio, corpo, processo xifoide) como peças | Hoje um item. **R** sobre a malha, ou **H** (`manubrium` e `sternum` do HRA só têm o modelo feminino) | C | — |

## 4. Articulações e ligamentos

O banco tem poucos ligamentos. Os que existem e **não estão no atlas**: ligamento plantar longo (`FJ1424`), ligamentos da laringe
(`FJ2786`–`FJ2789`, `FJ2804`–`FJ2805`) e o disco da sínfise púbica. Os de cabeça e membro superior já foram usados.

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P13 | **Quadril**: cápsula, iliofemoral, pubofemoral, isquiofemoral, ligamento da cabeça do fêmur, ligamento transverso e lábio do acetábulo | Cápsula e ligamentos: **C+** (faixas entre pontos medidos nos ossos, mesmo molde `L(...)` do ombro). Lábio: **C~** | **A** | F4.6 |
| P14 | **Joelho**: ligamentos cruzados anterior e posterior, colaterais tibial e fibular, patelar, retináculos, poplíteo oblíquo e arqueado | Cruzados: **C+** (da fossa intercondilar às áreas intercondilares da tíbia, pontos medidos). Colaterais e patelar: **C+**. Poplíteo oblíquo e arqueado: **C~** | **A** | F4.6 |
| P15 | **Meniscos** medial e lateral | **H**: o objeto `knee` do HRA (0,44 MB) traz "meniscus", cartilagem articular, fêmur, tíbia, fíbula e patela. Alternativa **C~** (anel em C sobre o platô tibial, forma pouco variável). Não traz cruzados nem colaterais | **A** | F4.6 |
| P16 | **Tornozelo e subtalar**: deltoide, talofibulares anterior e posterior, calcaneofibular, tibiofibular distal (sindesmose) | **C+** | **A** | F4.6 |
| P17 | Ligamento **plantar longo** | **B** (`FJ1424`) | B | M12 |
| P18 | Ligamento calcaneonavicular plantar (mola), bifurcado, ligamentos do tarso e metatarso, aponeurose plantar, arcos do pé | Ligamentos: **C~** (pequenos e numerosos). Aponeurose: **C~**. Arcos: **R**/marcação | B | M12, M13 |
| P19 | **Pelve**: sacroilíacos, sacrotuberal, sacroespinal, membrana obturadora, sínfise púbica e seu disco | Ligamentos: **C+**. Disco: **B** (conceito `articular disk of symphysis`) | A | F4.6 |
| P20 | **Coluna**: longitudinais anterior e posterior, amarelo, interespinal, supraespinal, nucal, sacrococcígeo | **C+** (faixas sobre corpos, discos e processos que existem) | **A** | M01 |
| P21 | Articulações **zigapofisárias, intervertebrais, costovertebrais e costotransversárias** (cápsulas) | **C+**, com `cap(...)` | A | M01 |
| P22 | Atlantooccipital e atlantoaxiais: membranas, ligamento transverso do atlas, cruciforme, do ápice do dente, membrana tectória (o alar já existe) | **C+** | B | M01 |
| P23 | **Articulação temporomandibular**: cápsula e disco articular (o ligamento lateral já existe) | Cápsula: **C+**. Disco: **C~** | B | M02 |
| P24 | Articulações esternocostais, costocondrais, manubrioesternal, xifoesternal; membranas intercostais | **C+** nas junções (as cartilagens costais já existem) | B | M01 |
| P25 | **Ligamentos do carpo** (≈ 30: radiolunar, escafolunar, escafocapitato, ulnocarpais, intercarpais dorsais e palmares, pisiuncinado, pisometacarpal…) | **C~**. São pequenos e muitos; agrupar nos feixes principais e declarar. Os colaterais e radiocarpais já existem | C | M08 |
| P26 | Ligamento transverso superior da escápula, lacunar, arqueados do diafragma, costocoracóideo | **C+** os três primeiros; arqueados: **C~** | C | — |
| P27 | **Ligamentos da laringe**: vocal, cricotireóideo, membrana tíreo-hióidea, hioepiglótico, tireoepiglótico | **B** (`FJ2786`–`FJ2789`, `FJ2804`–`FJ2805`; o banco as tem e o atlas só usou as cartilagens) | **A** | F6.1 |
| P28 ★ | Retináculos (extensores do punho, do tornozelo), bainhas sinoviais, bursas | Retináculo dos flexores já existe. Demais: **C~**; bursas e bainhas **T** | C | M05, M13 |
| P29 | Articulações dos ossículos e ligamentos do martelo, da bigorna e anular do estribo | Junto de P03 (**X**) | C | M28 |
| P30 | Ligamentos hepáticos, esplênicos e peritoneais | Ver P81 a P84 (digestório) | — | M24 |
| P31 | Sindesmose dentoalveolar e ligamento periodontal | **T** | C | — |
| P32 | Amplitudes, movimentos e antagonistas do membro inferior (dados, sem malha) | Dados | B | M03 |
| P33 | Quiz de ligamentos e amplitudes | Interface | C | M07 |
| P34 | Inervação das articulações do membro inferior | Dados; entra com P13–P16 | B | F4.6 |
| P35 | Cápsulas e ligamentos das articulações metatarsofalângicas e interfalângicas do pé | **C+** | C | M12 |
| P36 | Articulação sacroilíaca (cápsula) e sínfise: ficha e movimentos | **C+**, junto de P19 | A | F4.6 |
| P37 | Articulação do ombro: bursa subacromial e cápsula em detalhe | **T** | C | M05 |
| P38 | Articulações femoropatelar e tibiofibular proximal | **C+** | B | F4.6 |

## 5. Músculos, fáscias e tendões

Cobertura de músculos praticamente completa (o cruzamento com a Terminologia Anatômica deixou só as exclusões já justificadas
em [`cobertura.md`](cobertura.md)). Pendem os tendões, as fáscias e três músculos sem malha.

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P39 ★ | **Tendão do calcâneo** (de Aquiles) | **B** (`FJ1405`) | **A** | — |
| P40 ★ | **Fáscia lata** e trato iliotibial | **B** (`FJ1423`; o trato tem ≈ 2,3 MB de OBJ) | B | M13 |
| P41 ★ | Outros tendões isolados do banco | **B**: o conceito `tendon` tem 6 peças (`FJ1343`, `FJ1465`, `FJ1581`, `FJ2552`, `FJ2553`); identificar a qual estrutura cada uma pertence antes de usar | C | — |
| P42 | Articular do joelho | **C~** (lâmina fina sob o quadríceps, entre o fêmur e a bolsa suprapatelar) | C | M14 |
| P43 | Extensor curto dos dedos | **C+** (ventre fusiforme no dorso do pé; origem no calcâneo, tendões para os dedos 2 a 4) | B | M14 |
| P44 | Interósseos dorsais do pé (4) | **C+/C~** (entre os metatarsais, como os da mão que o banco tem) | B | M14 |
| P45 | Fáscia toracolombar, aponeurose palmar, aponeurose plantar, fáscias profundas do pescoço | **C~** (lâminas sobre músculos existentes) | C | M05 |
| P46 | Partes dos constritores da faringe, condroglosso e ceratoglosso, partes do levantador do ânus (puboanal, puboprostático…) | **T** (descritas nas fichas do músculo-pai) | C | — |
| P47 | Cremaster; levantador da glândula tireoide | Entram com os sistemas genital masculino e endócrino | — | F6.4, F6.6 |
| P48 | Músculos intrínsecos da orelha, músculo orbital | Exclusão declarada (vestigiais) | — | — |

## 6. Nervos

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P49 | **Nervos cutâneos do membro inferior** (sural, safeno, cutâneos femorais, genitofemoral, clúnios, fibular superficial sensitivo) | **C+**, mesmo método do F2.12 (ancorados na pele) | B | M09 |
| P50 | **Plexos lombar e sacral** desenhados | **C+/C~** | B | M10 |
| P51 | Dermátomos L1–S2 | Dados | B | M11 |
| P52 | **Tronco simpático** torácico e lombar, gânglios paravertebrais, nervos esplâncnicos | **C~** (finos; trajeto ao lado da coluna, medido nos ossos) | B | M22 |
| P53 | **Plexos autonômicos**: cardíaco, pulmonar, esofágico, celíaco, mesentéricos, aórtico abdominal, hipogástricos, plexo pélvico | **C~** (rede; representar como tubos principais, declarado) | B | M22 |
| P54 | Ramos do vago no tórax e abdome (troncos vagais, cardíacos, pulmonares, esofágicos) | **C~** | B | M22 |
| P55 | Plexo entérico (mioentérico e submucoso) | **T** (microscópico) | C | — |
| P56 | Ramos finos do trigêmeo e do facial (alveolares, nasais posteriores, petrosos, timpânico, ampulares) | **T** (já descritos nas fichas) | C | — |

## 7. Circulatório

A comparação automática com a Terminologia Anatômica (cap. 12 e 13) apontou **candidatas**, não lacunas certas: vários vasos
já existem com outra grafia do latim (as veias cardíacas, por exemplo). Só entram abaixo as que conferi à mão.

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P57 ★ | **Timo.** O roteiro previa "timo e mediastino simples" na F6.1; o catálogo não tem o timo | **B** (`lobe of thymus`, 2 peças) ou **H** (`thymus`, de 0,07 a 4 MB) | **A** | F6.1 |
| P58 | Troncos linfáticos (jugular, subclávio, broncomediastinal, lombar, intestinal) e vasos coletores principais | **C+** (tubos curtos entre ductos e grupos já desenhados) | B | M18 |
| P59 | **Grupos de linfonodos que faltam**: cervicais superficiais, parotídeos, pré-laríngeos e pré-traqueais, braquiais e supratrocleares, subgrupos axilares, pré-vertebrais, pulmonares, gástricos, pancreáticos, cólicos, mesentéricos superiores e inferiores, pélvicos viscerais, glúteos | **C~**. Posição aproximada, declarada. A forma de cada linfonodo pode vir do `lymph-node` do HRA (7,4 MB, **H**) instanciado, mas a **posição continua aproximada** | B | M18 |
| P60 | Valvas: cúspides individuais, cordas tendíneas, septos, fossa oval, crista terminal, trabéculas | Cúspides: **B** (o banco tem `cusp of aortic valve`, folhetos da mitral e da tricúspide). Demais: verificar | B | — |
| P61 | Artérias de menor calibre dos membros (circunflexas, geniculares, maleolares, metacarpais e metatarsais, digitais, nutrícias) | **B** quando houver conceito no banco (não conferido um a um); senão **C+** (tubos) | C | M20 |
| P62 | Artérias lombares, iliolombar, sacrais laterais, circunflexa ilíaca, epigástrica superficial, pudenda externa | **B/C+** | C | M20 |
| P63 | Artérias das vísceras ainda sem sistema (uterina, ovárica, vesicais, retais média e inferior, renais segmentares) | Entram com os sistemas urogenitais | — | M23 |
| P64 | **Seios venosos da dura-máter**, veias cerebrais, diploicas, oftálmicas, do labirinto | Entram com o encéfalo e o olho (F7.1, F7.4) | — | M20 |
| P65 | Plexos venosos (pterigóideo, vertebral, sacral, tireóideo) | **C~** | C | M20 |
| P66 | Veias superficiais dos membros (safena acessória, mediana do antebraço, marginais) | **B/C+** | C | M20 |
| P67 | Veias intercostais, frênicas, tímicas, esofágicas, tireóideas inferiores | **C+** | C | M20 |
| P68 | Arcada marginal do cólon e vasos retos; ramos segmentares de cada órgão | **C~** | C | M23 |
| P69 | Vasos intra-hepáticos e anastomoses portossistêmicas (desenhadas) | **C~** | C | M21, M23 |
| P70 | Forame oval como peça | **C~** | C | M21 |

## 8. Respiratório

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P71 | **Cavidade nasal e nariz externo**: vestíbulo, conchas, meatos, coanas, septo. As cartilagens nasais e a concha inferior já existem | **C−**; fonte **X** parcial (NasalSeg: cavidades, em voxels, sem conchas). Verificar o que o plano de ensino cobra | **A** | — |
| P72 | **Seios paranasais** | Ver P05 | A | — |
| P73 | **Segmentos broncopulmonares** como peças selecionáveis | **H, já em mãos:** o `lung-male` v1.4 (em `tools/hra/`, fora do git) traz uma malha por segmento; hoje os lobos são a fusão deles | **A** | M27 |
| P74 | **Cavidade da laringe**: pregas vestibulares e vocais, ventrículo, rima da glote, ádito. Ligamento e músculo vocais: **B** (P27) | Pregas: **C~** (revestimento sobre estruturas que existem). Alternativa **H**: `larynx` (0,34 MB) | B | — |
| P75 | **Recessos pleurais** (costodiafragmático, costomediastinal), ligamento pulmonar, hilo | **C~** (derivam das pleuras esquemáticas, que já existem) | B | M26 |
| P76 | **Mediastino por compartimentos** | **C~** (regiões entre pleuras, esterno e coluna) | B | M26 |
| P77 | Carina e bifurcação da traqueia (marcação), anel e músculo traqueal | **R**/**T** | C | — |
| P78 | Artérias e veias lobares e segmentares do pulmão | **B** se houver conceito (não conferido); senão **C~** | C | M20 |
| P79 | Linfonodos pulmonares e bronco-pulmonares | **C~** | B | M18 |

## 9. Digestório e cavidade oral

Detalhe da conferência com a Terminologia Anatômica em [`digestorio.md`](digestorio.md). Os 117 de 121 termos já aparecem em
texto; abaixo, o que **ainda não é selecionável em 3D** e merece decisão.

| ID | Pendência | Origem da malha / decisão | Prio. | Ref. |
| --- | --- | --- | --- | --- |
| P80 | **Omento maior** | **H**: `omentum` do HRA (2,6 MB, uma peça). Por código seria **C−** (lâmina drapejada de forma irregular). Registro no abdome do modelo a testar | **A** | M24 |
| P81 | **Omento menor**, ligamentos hepatogástrico e hepatoduodenal | **C+** (lâmina entre a curvatura menor, o duodeno e a porta do fígado; os três têm malha) | **A** | M24 |
| P82 | Ligamentos falciforme e redondo do fígado, coronário e triangulares, venoso | Falciforme e redondo: **C+** (lâmina do fígado ao umbigo). Coronário e triangulares: **C~** | A | M24 |
| P83 | Ligamentos gastrocólico, gastroesplênico, esplenorrenal, frenicocólico | **C+/C~** | B | M24 |
| P84 | Mesocolo sigmoide | **C+** (o mesentério e o mesocolo transverso já existem como molde) | B | M24 |
| P85 | **Bolsa omental**, forame omental e recessos (hepatorrenal, subfrênico, duodenais, ileocecais, retrocecal, intersigmoide) e goteiras paracólicas | **C−** como volume (são espaços virtuais). Ficam em **T** + marcação de região; não vale esquema 3D | B | M24 |
| P86 | **Valva ileocecal** (óstio ileal) | **B** (`FJ2599`, junção ileocecal) | B | — |
| P87 | Papilas duodenais maior e menor, ampola hepatopancreática, esfíncter de Oddi, prega espiral do cístico | **C−** (milímetros, internas). **T** | C | — |
| P88 | **Esfíncter interno do ânus**, colunas anais, linha pectínea, plexo hemorroidário | Esfíncter: **C+** (anel de músculo liso em volta do canal anal, que tem malha). Colunas e linha: **T** | A | — |
| P89 | **Tonsila palatina** | **H** (`palatine-tonsil`, 0,45 MB) | B | — |
| P90 | Tonsila faríngea (adenoide), istmo das fauces e arcos palatinos | Adenoide: **C~**. Arcos: **C~** (pregas sobre os músculos palatoglosso e palatofaríngeo, que existem) | B | — |
| P91 | Lábios, gengiva, palato duro e mole (mucosa), assoalho da boca, papilas da língua | Mucosa: **H** (`mouth`, **53 MB** originais; decimação forte). Papilas: **T**. Baixo ganho | C | — |
| P92 | Regiões do estômago (cárdia, fundo, corpo, antro, piloro), do duodeno (4 partes), do colo (flexuras), do pâncreas (cabeça, colo, corpo, cauda, uncinado) | **R** (cortes na malha, como `split_cut`) | B | M27 |
| P93 | Lobos direito e esquerdo do fígado | **R** (agrupar os segmentos já existentes) | B | M27 |
| P94 | Apêndices omentais (epiploicos), haustros, pregas semilunares | `epiploic-appendage-of-transverse-colon` no HRA (1,4 MB). Baixo valor | C | — |
| P95 | Ductos das glândulas salivares (parotídeo, submandibular), glândulas salivares menores | **C+** (tubo curto) para os dois ductos; as menores em **T** | C | — |
| P96 | Ducto pancreático acessório (de Santorini) | **C~** | C | — |
| P97 | Plexos e artérias do tubo digestório: cólicas, jejunais e ileais, arcada de Drummond | **C~** | C | M23 |
| P98 | Camadas da parede do tubo (mucosa, submucosa, muscular, serosa) e vilosidades | Histologia: fora do escopo atual | C | M32 |
| P99 | Faringe: divisões (naso, oro e laringofaringe) e espaços (retrofaríngeo, parafaríngeo) | **R**/**T** | C | — |

## 10. Fontes externas avaliadas

| Fonte | Licença | O que traz para as pendências | Situação |
| --- | --- | --- | --- |
| **BodyParts3D** | CC BY-SA 2.1 JP | Base atual. Tem tendão do calcâneo, fáscia lata, ligamento plantar longo, ligamentos da laringe, timo, cúspides das valvas. **Não tem** meniscos, cruzados, colaterais, ossículos, cóclea, seios, omentos, bolsa omental, tireoide | Índice local conferido |
| **Human Reference Atlas** (HuBMAP) | CC BY 4.0 | 81 objetos (API consultada em 2026-10-20). Úteis aqui: `knee` (menisco), `omentum`, `palatine-tonsil`, `thymus`, `lymph-node`, `larynx`, `eye` (túnicas, corioide, esclera, corpo ciliar, mácula…), `mouth`, `intervertebral-disk` com núcleo pulposo, `large-intestine` (valva ileocecal, flexuras) | Nós lidos nos metadados (`graph.jsonld`). **Nenhum arquivo novo baixado.** Tamanhos originais: joelho 0,44 MB, omento 2,6 MB, tonsila 0,45 MB, laringe 0,34 MB, linfonodo 7,4 MB, disco 19,6 MB, olho 27 MB, boca 53 MB |
| **OpenEar** (Zenodo 1473724) | CC BY 4.0, acesso aberto | 8 ossos temporais com modelos triangulados de ossículos, membrana timpânica, compartimentos do ouvido interno, nervos e vasos (segundo o artigo) | **X.** São 59,1 GB no total (≈ 7 GB por espécime). Seria preciso extrair só as malhas de um espécime (há `tools/rangezip.py` para leitura parcial de zip). Formato e tamanho das malhas **não conferidos** |
| **NasalSeg** (Zenodo 13893419) | CC BY 4.0 | 130 TCs com cavidades nasais, nasofaringe e seios maxilares, em **voxels** | **X.** Exige marcha de cubos e registro; não traz conchas, frontal, esfenoide nem etmoide |
| **Z-Anatomy** | CC BY-SA 4.0, com peças NC (ouvido interno CC BY-NC-SA, rim CC BY-NC) | Não há lista de licença por objeto no repositório | Segue **descartada** como fonte principal. Só entra por item, com a licença da peça conferida no arquivo |
| Dryad "Subject-specific knee" | não conferida | Ossos e cápsula; não vi ligamentos nem meniscos | Não serve |
| NIH 3D | CC ou domínio público, por modelo | Não achei ossículos nem ligamentos da coluna | Conferir modelo a modelo, só se necessário |
| CGTrader, TurboSquid, Fab | proprietária / não conferida | — | Descartadas (licença) |

## 11. Ordem sugerida

1. **Baixo custo, ganho imediato (B):** P01 (peças individuais), P39 (tendão do calcâneo), P27 (ligamentos da laringe), P57 (timo),
   P17, P40 e P86. Todos já têm malha no banco; nenhum precisa de decisão nova.
2. **Já em mãos (H local):** P73 (segmentos broncopulmonares).
3. **Por código com fidelidade alta (C+), os de maior valor para estudo:** P13 a P16 e P19 (quadril, joelho, tornozelo, pelve),
   P20 e P21 (coluna), P81 e P82 (omento menor e ligamentos do fígado), P88 (esfíncter interno do ânus), P43 e P44 (músculos do pé).
4. **Spikes antes de decidir:** HRA para menisco (P15) e omento maior (P80), com registro no corpo; OpenEar para ossículos e cóclea
   (P03, P04); NasalSeg para o nariz (P05, P71).
5. **Fora do código e da malha:** P85, P87 e P98 ficam em texto. Esquema 3D não ensinaria nada além da ficha.

Os itens 1 e 3 se encaixam no calendário (N2 em 26/11) sem competir com a F6.3 a F6.7, porque são lotes pequenos. O quadril, o
joelho e o tornozelo (P13 a P16) são a F4.6, hoje fora do cronograma da N2.

## 12. Limites desta análise

- O cruzamento com a Terminologia Anatômica 2 foi **automático por nome em latim** e teve muito ruído (agrupamentos do atlas,
  grafias diferentes). Cada linha acima foi conferida à mão, mas **as listas de vasos pequenos (P61 a P68) são candidatas, não
  um inventário fechado**.
- A disponibilidade no BodyParts3D foi verificada **pelo nome do conceito** no índice local. Não abri as malhas: um conceito
  pode existir e vir pequeno, partido ou com a normal invertida.
- Os objetos do HRA foram avaliados só pelos metadados (nomes dos nós e tamanho do arquivo). Qualidade, escala e posição no
  corpo só se sabem depois de baixar e registrar.
- A classificação C+/C~/C− é **julgamento meu** pelo critério da §1, sem protótipo. Para P13 a P16 e P81 vale fazer um protótipo
  de uma estrutura antes de decidir o lote.
- Prioridades são sugestão; a decisão é do responsável.
