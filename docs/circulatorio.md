# Circulatório (F5): coração, vasos, irrigação dos músculos, linfáticos e circulação fetal

Registro da fase **F5** do roteiro (`project_context.md`): o que entrou, de onde vem, como foi gerado, o que o banco não tem e o que ficou
para depois. O catálogo está em `src/catalog-circ.js` (coração e vasos principais), `src/catalog-circ-ramos.js` (vasos de menor calibre),
`src/catalog-circ-esquemas.js` (linfáticos, sistema de condução e papilar posteromedial), `src/catalog-circ-fetal.js` (circulação fetal e
ligamento arterial); as malhas, no pacote `dist/anatomy-circ.js`. A irrigação dos músculos, os pulsos e os feixes neurovasculares ficam em
`src/irrigation.js`, `src/vessel-clinical.js` e `src/neurovascular.js`.

## 1. O que tem (140 estruturas circulatórias)

| Grupo | Fichas | Camada |
| --- | --- | --- |
| Câmaras | átrio direito, átrio esquerdo, ventrículo direito, ventrículo esquerdo | Coração |
| Valvas | tricúspide, mitral, da aorta, do tronco pulmonar (as cordas tendíneas vêm junto com a malha das valvas) | Coração |
| Músculos papilares | do ventrículo direito (3, numa ficha), anterolateral do ventrículo esquerdo (malha real) e **posteromedial** (esquema) | Coração |
| Sistema de condução | **nó sinoatrial, nó atrioventricular, fascículo atrioventricular e ramos** (esquemas por código) | Coração |
| Pericárdio | **esquema** por código (ver §3) | Coração |
| Coronárias | coronária direita, ramo interventricular posterior, ramo marginal direito, tronco da coronária esquerda, ramo interventricular anterior, ramo circunflexo | Artérias |
| Veias do coração | seio coronário, veias cardíacas magna, média e pequena, veia posterior do ventrículo esquerdo, veias cardíacas anteriores | Veias |
| Grandes vasos | aorta ascendente, arco, torácica e abdominal; tronco pulmonar e artérias pulmonares direita e esquerda; 4 veias pulmonares; veias cavas superior e inferior; veias braquiocefálicas; ázigo e hemiázigo | Artérias e Veias |
| Pescoço e tórax | tronco braquiocefálico, carótidas comum e interna, vertebral, subclávia, torácica interna; **supraescapular, cervical transversa, dorsal da escápula, tireóidea inferior e tronco costocervical; intercostais posteriores** | Artérias |
| Ombro, braço e antebraço | axilar, braquial, radial e ulnar; **toracoacromial, torácica lateral, subescapular, toracodorsal, circunflexa escapular, circunflexas umerais anterior e posterior, profunda do braço, colaterais ulnares superior e inferior, recorrentes radial e ulnar, interósseas comum e anterior, principal do polegar, arcos palmares superficial e profundo** | Artérias |
| Abdome e pelve | tronco celíaco, mesentéricas superior e inferior, renal, ilíacas comum, externa e interna; **lombares, epigástricas superior e inferior, musculofrênica, frênica inferior** | Artérias |
| Coxa, joelho, perna e pé | femoral; **femoral profunda (com as perfurantes), circunflexa femoral lateral, genicular descendente, poplítea, geniculares, tibial anterior, tibial posterior, dorsal do pé, plantares medial e lateral** | Artérias |
| Veias | jugular interna, subclávia, axilar e braquiais; ilíacas, femoral e renal; **cefálica, basílica, intermédia do cotovelo, safenas magna e parva, poplítea, tibiais anteriores e posteriores, fibulares, femoral profunda, circunflexas femorais** | Veias |
| Sistema linfático (esquemas) | cisterna do quilo, ducto torácico, ducto linfático direito e os grupos de linfonodos cervicais profundos, axilares, paratraqueais e traqueobrônquicos, lombares, ilíacos e inguinais | Sistema linfático |
| Circulação fetal (esquemas) | placenta e cordão (malhas do HRA), veia e artérias umbilicais, ducto venoso | Circulação fetal (desligada por padrão) |
| Ligamento arterial | resto do ducto arterioso (esquema) | Artérias |

Totais no catálogo: **70 artérias, 37 veias, 14 estruturas cardíacas, 9 linfáticas** e as estruturas esquemáticas (pericárdio, placenta e cordão, ligamento
arterial); o catálogo passa a **604 estruturas**. Cada artéria e veia tem ficha com origem (ou formação), trajeto, ramos (ou tributárias), território
irrigado (ou drenado) e nota clínica; as câmaras e valvas, localização, paredes e relações, estruturas internas e função. Cada ficha cita as vizinhas na
circulação (chips; a ligação vale nos dois sentidos). Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.).

Cores: artérias vermelhas e veias azuis; por convenção, o **tronco e as artérias pulmonares são azulados** (sangue pouco oxigenado) e as **veias
pulmonares, avermelhadas**. Na circulação fetal, é o contrário: a **veia umbilical é avermelhada** (sangue oxigenado) e as **artérias umbilicais, azuis**.
O tour “Circulação: grande e pequena” (8 passos) e o de “Circulação fetal e o nascimento” (6 passos, agora com a placenta, a veia e as artérias
umbilicais, o ducto venoso e o ligamento arterial em destaque) estão em `src/study/tours.js`. O quiz de localizar ganhou os tipos “Coração”,
“Artérias”, “Veias” e “Linfáticos”.

## 2. Irrigação dos músculos, pulsos, relações e feixes (M15 a M17, M19)

- **Irrigação (M15).** Cada um dos 228 músculos tem o campo “Irrigação” na ficha (texto com o nome verdadeiro dos ramos) e a lista de artérias do
  catálogo (chips; o botão “Isolar com nervos e artérias” mostra tudo junto). A ficha da artéria lista os músculos irrigados. Fonte única:
  `src/irrigation.js` (linhas `[músculos, artérias, texto]`); `catalog.js` deriva os mapas `IRRIGATION` e `IRRIGATED` e **lança erro** se um músculo
  ficar sem artéria, se uma artéria citada não existir ou se um músculo se repetir. Quando o ramo verdadeiro não existe no modelo (a carótida
  externa e seus ramos, as glúteas, a obturatória, a pudenda interna, a interóssea posterior…), o catálogo liga ao tronco do qual ele sai (a carótida
  comum, a ilíaca interna, a interóssea comum…) e o texto diz o ramo. Os atlas divergem nos ramos de cada músculo; o texto dá o padrão descrito.
- **Pulsos, pontos de compressão e relações (M16).** `src/vessel-clinical.js`: campos “Pulso e compressão” e “Relações” nas artérias de pulso
  palpável (carótida comum, subclávia, axilar, braquial, radial, ulnar, femoral, poplítea, tibial posterior, dorsal do pé e aorta abdominal).
- **Feixes neurovasculares (M17).** `src/neurovascular.js`: 14 feixes (bainha carótica, axila, braço, sulco do nervo radial, espaço quadrangular,
  supraescapular, dorsal da escápula, toracodorsal, serrátil anterior, radial e ulnar do antebraço, trígono femoral, fossa poplítea, intercostal). A ficha
  de qualquer membro mostra o texto, os outros membros e o botão **“Isolar o feixe”**. Guarda em `catalog.js`: todo membro existe e cada feixe tem artéria e nervo.
- **Quiz “o que irriga isto?” (M19).** Novo tipo de pergunta do quiz teórico: “Qual artéria irriga X?”; as erradas são artérias que não irrigam o músculo
  (só entram artérias que irrigam algum músculo, não as coronárias).

## 3. Fonte e pipeline

Malhas reais do BodyParts3D (CC BY-SA 2.1 JP), definidas por nome de conceito em `tools/body_parts.py` (`addc(...)`, `pack="circ"`):

```bash
cd tools
python fetch_body.py --pack circ     # ≈ 20 MB compactados por faixas de bytes (5,8 MB do coração e vasos principais + 14,5 MB dos vasos menores)
python convert_body.py --pack circ   # → anatomy-circ.js e parts_circ.npz (copie o .js para ../dist/)
python convert_placenta.py           # acrescenta a placenta e o cordão (HRA) ao pacote que está em ../dist/
```

(No Windows, com `python -P`, defina `PYTHONPATH=.` para os comandos.) O pacote tem **116 peças do BodyParts3D e 2 do HRA, ≈ 2,1 MB**.
O `convert_placenta.py` lê `tools/hra/placenta-full-term-female-v1.1.glb` (4,9 MB, Atlas de Referência Humano, HuBMAP/NIH, CC BY 4.0; URL no
cabeçalho do script), converte para as unidades do atlas e põe a placenta fora do corpo (a extremidade livre do cordão vai a `FREE_END`).

Decisões do pipeline:

- **Parede dos dois ventrículos.** O banco só tem “parede do ventrículo” numa peça única. `convert_body.py` a divide em `cor_parede_ventriculo_d` e
  `_e` atribuindo cada triângulo à cavidade (molde de sangue) mais próxima, com o ventrículo esquerdo favorecido por um fator 0,55 (a parede do
  direito é fina, e sem o fator o limite cairia sobre o lado esquerdo do sulco interventricular), e um filtro de maioria entre faces vizinhas
  para tirar os dentes do limite. Conferido a olho nas vistas anterior e lateral esquerda: o limite cai no sulco interventricular anterior.
- **Cavidades.** Os moldes de sangue das câmaras coincidem com a face interna das paredes (z-fighting no plano de corte) e não acrescentam nada
  ao estudo; ficaram **fora do pacote** e só servem de referência para a divisão acima. O interior se vê com o plano de corte do Estudo: aparecem as
  valvas, as cordas e os músculos papilares.
- **Coronárias.** O banco as tem por conceitos agregados (tronco mais ramos). Foram separadas em coronária direita (com os ramos ventriculares),
  ramo interventricular posterior, ramo marginal direito, tronco da esquerda, ramo interventricular anterior (com os diagonais) e circunflexo.
- **Vasos pares** (carótidas, subclávias, braquiais…) são uma ficha só, com os dois lados; as pulmonares, que não são simétricas, têm uma ficha por veia.
- **Vasos menores (M20).** Os conceitos do banco com subdivisões (toracoacromial, tibiais, femoral profunda) entram agregados na mesma ficha; as intercostais
  posteriores, que o banco tem como um conjunto só (1,4 MB), entram numa ficha única (“Artérias intercostais posteriores”).
- **Camada opcional.** A circulação fetal fica numa camada com `optional: true` em `LAYERS`: `layersForDissect` não a liga, o “Mostrar tudo” liga, e selecionar uma
  estrutura dela (por tour, busca ou chip) a liga. Nenhuma peça fetal entra no quiz de localizar (`label: false`).

## 4. O que é esquema por código (e o que o banco não tem)

| Estrutura | O que o atlas faz |
| --- | --- |
| **Pericárdio** | **Esquema** (`src/hull-geo.js`): um envoltório liso, translúcido, que acompanha o coração e a raiz dos vasos (casco convexo suavizado). A ficha diz que é esquema e que não mostra lâminas, cavidade nem seios (os seios estão descritos em texto; M26). |
| **Sistema linfático** | Esquema: o ducto torácico, a cisterna do quilo e o ducto linfático direito seguem pontos medidos entre a aorta, a veia ázigo, os corpos vertebrais e os ângulos venosos; os linfonodos são elipsoides pequenos (um por grupo ou por região, em número bem menor que o real). Fichas com a drenagem, o destino da linfa e a clínica. |
| **Sistema de condução** | Esquema: nó sinoatrial, nó atrioventricular e fascículo atrioventricular com os ramos direito e esquerdo, em posição aproximada dentro do coração (só se veem com o plano de corte do Estudo). |
| **Músculo papilar posteromedial do ventrículo esquerdo** | Esquema (o banco só tem o anterolateral). |
| **Circulação fetal** | A placenta e o cordão vêm do HRA; a veia e as artérias umbilicais e o ducto venoso são tubos por código, no abdome, aproximados (não há fígado no modelo). O corpo do atlas é adulto e masculino: a placenta é mostrada fora do corpo, à frente, ligada ao umbigo pelo cordão, e a ficha diz que a posição não é a real. O forame oval fica só em texto (ficha dos átrios e do tour). |
| **Ligamento arterial (ducto arterioso)** | Esquema: tubo curto entre a artéria pulmonar esquerda e o arco da aorta, na camada das artérias. |
| Aurículas, septos, trabéculas e fossa oval como peças | Fazem parte das malhas das paredes; as fichas as descrevem. |
| Veia oblíqua do átrio esquerdo, ramos atriais, artéria do nó sinoatrial e do nó atrioventricular | Citados nas fichas; não existem como malha. |
| Carótida externa e seus ramos (facial, lingual, maxilar, occipital, temporal superficial…), glúteas, obturatória, pudenda interna, circunflexa femoral medial, fibular, interóssea posterior, vasos da mão além dos arcos | O banco não os tem. As fichas dos músculos que dependem deles dizem o ramo e ligam ao tronco de origem. |
| Vasos das vísceras ligados ao tubo digestório (hepática, esplênica, porta, gástricas) | Entram com o digestório (F6.2, M23). |

## 5. Medições

- Carga no celular emulado (`tools/perf_mobile.js`, CPU 4× mais lenta): o pacote do circulatório custa **≈ 0,77 s** (0,20 s para decodificar, 0,57 s para
  montar as 140 estruturas); a carga total ficou em **23,5 s** na medição de 14/10/2026, dentro do limite de 35 s do M37 (22,1 s antes dos vasos menores, dos linfáticos e do
  fetal; a variação inclui o ruído da máquina).
- Chamadas de desenho: +≈ 130 malhas (as da circulação fetal só entram quando a camada é ligada, mas são construídas na carga).

## 6. Pendências

- **Carótida externa e ramos, glúteas, obturatória, pudenda interna** e demais vasos ausentes do banco: só virariam fichas com malha por código, o que pede medições
  novas; o texto da irrigação de cada músculo já os nomeia (M20, resto).
- **Linfáticos:** só um grupo por região e sem os vasos coletores, as cadeias de linfonodos da cabeça (submandibulares, occipitais, parotídeos) e os da pelve e do
  abdome ligados às vísceras (mesentéricos, celíacos); virão com os sistemas (M18, resto).
- **Fetal:** forame oval como peça (a fossa oval está em texto), a veia umbilical e o ducto venoso dentro do fígado (digestório, F6.2) e o seio venoso.
- **Sistema de condução:** as vias internodais e os feixes acessórios não são desenhados; o desenho dos ramos é só esquemático.
- Nomes das cúspides: a descrição clássica das cúspides da **valva da aorta** (anterior = direita, posterior esquerda = esquerda, posterior direita = posterior)
  está na nota da ficha. A correspondência exata das da **valva do tronco pulmonar** entre a Terminologia Anatômica e o BodyParts3D **não foi conferida** em
  fonte e por isso não está afirmada.
- Outros itens do roteiro seguem como estavam: inervação autonômica das vísceras (M22), irrigação específica das vísceras (M23).
