# Body3D

> **Identidade (2026-10-07):** nome provisório **Body3D** e logo novo: um “B” formado por um osso minimalista e duas curvas que também
> desenham um “3”, em azul-marinho (`#0B1220`), branco (`#F2F4F7`) e verde-água (`#2DD4BF`). A interface usa o mesmo verde-água como acento sobre azul-marinho (variáveis em `:root` de `styles.css`). Arquivos em `assets/` (`favicon.svg`,
> `logo-mark.svg`, `icon-*.png`); `python tools/gen_pwa_icons.py` regenera os PNG e o mesmo desenho gera o ícone do `.exe`
> (`draw_icon` em `tools/build_exe.py`). O executável, o repositório e a pasta de instalação **ainda se chamam** `Anatomia3D`/`3DBody`:
> renomear o lançador faz o `.exe` se trocar sozinho, então fica para uma release própria.

Atlas 3D interativo do **corpo humano**, com pele, fáscias, músculos, **nervos**, **articulações**,
ligamentos, **coração, artérias, veias, sistema linfático**, **sistema respiratório**, **sistema digestório e baço**, glândulas, cartilagens, ossos e dentes em camadas. Cada estrutura tem nome em português e em latim e uma ficha: nos
músculos, **ação, origem, inserção, inervação, irrigação e os movimentos que realizam**; nos nervos, **origem, trajeto, ramos, sensibilidade,
lesão e os músculos que inervam**; nas articulações, **tipo, superfícies, cápsula, ligamentos, movimentos com amplitude e músculos,
inervação e irrigação**; nos vasos, **origem (ou formação), trajeto, ramos (ou tributárias), território, pulsos e relações**; nos órgãos, **localização e partes, relações e peritônio/pleura, irrigação, drenagem, inervação e clínica**; nos ossos, localização, articulações, estruturas e função; nos ligamentos, fixações e função.
O **membro inferior** (F4) tem o esqueleto (fêmur, patela, tíbia, fíbula, tarso, metatarsais, falanges e sesamoides), a pele inteira, os **24 músculos do quadril e da coxa**, os **14 da perna** (compartimentos anterior, lateral e posterior) e a membrana interóssea, os **13 do pé** que o banco tem (o extensor curto dos dedos e os interósseos dorsais não existem no banco) e os nervos que os inervam (femoral, obturatório, glúteos, isquiático, **tibial, fibulares comum, superficial e profundo, plantares medial e lateral**); as articulações e os ligamentos do quadril, do joelho e do tornozelo entram no próximo lote (F4.6).

## Como abrir

Dê dois cliques em `index.html` (Chrome, Edge ou Firefox). Não precisa de internet nem de servidor.
A cabeça aparece primeiro; o tronco, os membros e os sistemas são carregados em segundo plano (`dist/anatomy-body.js` e, depois dele, o membro inferior em `dist/anatomy-leg.js`, o coração e os vasos em `dist/anatomy-circ.js`, o sistema respiratório em `dist/anatomy-resp.js` e o sistema digestório em `dist/anatomy-digest.js`).

Para editar o código:

```bash
npm install
npm run watch   # recompila ao salvar
npm run build   # gera dist/app.js minificado
npm test        # integridade do catálogo + testes das ferramentas de estudo + fumaça no navegador (Chrome/Edge)
npm start       # opcional: servidor local em http://localhost:5173
```

## No celular (Android, HarmonyOS e outros)

O caminho é o **site/PWA** em **<https://body3d.app>** (GitHub Pages), aberto no navegador do aparelho e instalável na tela inicial; não há app nativo.
Decisão, o que falta e como publicar: [`docs/publicacao-web.md`](docs/publicacao-web.md).

## Executável para Windows (com atualização automática)

**Download:** <https://github.com/KaueChristian/3DBody/releases/latest/download/Anatomia3D.exe>
(este link sempre aponta para a versão mais nova).

`Anatomia3D.exe` (≈ 8 MB) é um arquivo único, sem instalação: o atlas vai embutido e abre numa janela própria do
Microsoft Edge (que já vem no Windows 10/11) ou do Google Chrome, sem barra de endereço. Funciona sem internet.

- **Atualização automática:** ao abrir, o programa consulta a última release deste repositório. Se houver versão nova,
  mostra uma janela de progresso, baixa o `app.zip`, confere o SHA-256 e abre já atualizado. Sem internet (ou se a pessoa
  clicar em *Pular*), abre a versão instalada. Se o próprio lançador mudar, o `.exe` também é trocado (vale na abertura seguinte).
- A versão aparece no rodapé do atlas (“versão 2.0.x”).
- Arquivos ficam em `%LOCALAPPDATA%\Anatomia3D` (o registro das atualizações em `atualizacao.log`). Para remover tudo,
  apague essa pasta e o `.exe`.
- Como o arquivo não é assinado digitalmente, o Windows SmartScreen pode avisar: clique em **Mais informações → Executar assim mesmo**.
- Parâmetros: `--sem-atualizar` (não consulta a internet) e `--extrair` (instala/atualiza sem abrir a janela; para testes).

### Como publicar uma nova versão

1. Faça as mudanças e envie para a branch **`main`** (`git push`).
2. O GitHub Actions (`.github/workflows/release.yml`) compila o site, gera o `.exe`, o `app.zip` e o `version.json` e cria a
   release `v2.0.<número da execução>`. Leva ~3 minutos; acompanhe em *Actions*.
3. Pronto: quem abrir o programa recebe a versão nova.

Use a branch **`dev`** para trabalhar sem publicar; quando estiver bom, junte na `main`. Mudanças só no README ou em
`tools/` (pipeline de dados) não geram release. Para mudar a versão principal (2.0 → 2.1), altere `version` no `package.json`.

Para gerar o executável localmente: `npm run exe` (usa o compilador C# do próprio Windows; resultado em `release/`).

## O que tem (740 estruturas: 255 músculos, 112 nervos, 52 ossos e cartilagens, 13 articulações, 29 ligamentos, 111 artérias, 56 veias, 14 estruturas do coração, 15 do sistema linfático, 28 do sistema respiratório e 34 do sistema digestório e baço, mais o pericárdio, as 2 pleuras, a placenta, o cordão umbilical, o ligamento arterial, a projeção do coração e os focos de ausculta e a medula espinal)

| Camada | Conteúdo |
| --- | --- |
| Pele | pele do corpo (translúcida ou opaca) e sobrancelhas |
| Fáscias e aponeuroses | gálea aponeurótica, fáscia temporal, fáscia parotideomassetérica |
| Músculos da mímica | frontal, occipital, auriculares, orbicular do olho/boca, corrugador, prócero, nasal, levantadores, zigomáticos, risório, abaixadores, mentual… |
| Músculos da mastigação e planos profundos da cabeça | masseter, temporal, pterigóideos, bucinador, supra-hióideos; **língua** (genioglosso, hioglosso, estiloglosso, palatoglosso e 4 intrínsecos), **palato mole** (levantador e tensor do véu, úvula, palatofaríngeo), **faringe** (3 constritores, estilofaríngeo, salpingofaríngeo), **laringe** (cricotireóideo, cricoaritenóideos, aritenóideos, tireoaritenóideo, vocal) e **ouvido médio** (tensor do tímpano, estapédio) |
| Órbita e olho | globo ocular, 6 músculos extraoculares, levantador da pálpebra, placas tarsais e os músculos lisos intrínsecos (ciliar, esfíncter e dilatador da pupila, tarsais superior e inferior) |
| Músculos superficiais (tronco e membros) | peitoral maior (3 partes), trapézio (3 partes), latíssimo do dorso, oblíquo externo, reto do abdome, deltoide (3 partes), bíceps, tríceps, extensores e flexores superficiais do antebraço, tenar/hipotenar superficial, palmar curto; glúteo máximo, tensor da fáscia lata, sartório, reto femoral, vastos lateral e medial, grácil, bíceps femoral, semitendíneo, gastrocnêmio, fibulares, tibial anterior, abdutores e flexor curto dos dedos no pé |
| Músculos intermediários | peitoral menor, subclávio, serrátil anterior, rombóides, levantador da escápula, escalenos (incluindo o mínimo), serráteis posteriores, esplênios, oblíquo interno, manguito rotador, braquial, flexor superficial, lumbricais; glúteo médio, adutores longo e curto, semimembranáceo, sóleo, plantar, extensores longos dos dedos e do hálux, quadrado plantar, lumbricais e flexores curtos no pé… |
| Músculos profundos (tronco e membros) | intercostais, subcostais, levantadores das costelas, transverso do tórax, diafragma, transverso do abdome, quadrado do lombo, psoas, ilíaco, eretores da espinha, semiespinais, multífido, rotadores, interespinais, intertransversários, suboccipitais, pré-vertebrais (longos da cabeça e do pescoço), assoalho pélvico, flexor profundo, pronador quadrado, interósseos; glúteo mínimo, piriforme, gêmeos, obturadores, quadrado femoral, vasto intermédio, pectíneo, adutores magno e mínimo, poplíteo, tibial posterior, flexores longos dos dedos e do hálux, adutor do hálux, oponente do dedo mínimo e interósseos plantares |
| Articulações (cápsulas) | membro superior: esternoclavicular, acromioclavicular, escapulotorácica (funcional), ombro, cotovelo, radiulnares proximal e distal, radiocarpal, intercarpais, carpometacarpais (polegar e 2º–5º), metacarpofalângicas e interfalângicas |
| Ligamentos | 10 da cabeça (temporomandibular, estilomandibular, palpebrais…), linha alba, retináculo dos flexores, 16 do membro superior (esternoclaviculares, interclavicular, costoclavicular, acromioclavicular, coracoclavicular, coracoacromial, coracoumeral, glenoumerais, colaterais do cotovelo, anular do rádio, membrana interóssea, radiocarpais, colaterais do carpo, colaterais dos dedos, metacarpal transverso profundo) e a **membrana interóssea da perna** |
| Nervos | 112 nervos e gânglios, mais a **medula espinal**, ligados a **todos** os 255 músculos (veja abaixo) |
| Coração (F5) | átrios, ventrículos, as 4 valvas, músculos papilares, sistema de condução e o **pericárdio** (envoltório esquemático, declarado na ficha) |
| Sistema respiratório (F6.1) | **pulmões** (5 lobos, malhas do Atlas de Referência Humano, CC BY 4.0, ajustadas ao tórax), **traqueia, brônquios principais e os 20 segmentares** (B1 a B10), **pleuras** (esquema) e as 6 **cartilagens da laringe** ([`docs/respiratorio.md`](docs/respiratorio.md)) |
| Sistema digestório e baço (F6.2) | **esôfago, estômago**, intestino delgado (**duodeno, jejuno, íleo**), intestino grosso (**ceco, apêndice vermiforme, colos ascendente, transverso, descendente e sigmoide, tênias do colo, reto e canal anal**), **fígado** (8 segmentos de Couinaud: lobo caudado I, II, III, lobo quadrado IV, V, VI, VII e VIII), **vesícula biliar e vias biliares** (ductos cístico, hepáticos direito, esquerdo e comum, colédoco), **pâncreas e ducto pancreático**, **baço** e **peritônio** (mesentério, mesocolo transverso, mesoapêndice) ([`docs/digestorio.md`](docs/digestorio.md)) |
| Artérias e Veias (F5) | coronárias e veias do coração, aorta (ascendente, arco, torácica e abdominal), tronco e artérias pulmonares, veias pulmonares, cavas, ázigo, carótidas e **carótida externa com os ramos** (esquema por código), vertebral e **círculo arterial do cérebro**, subclávia e axilar com seus ramos, braço e antebraço até os arcos palmares, intercostais, lombares, epigástricas, **tronco celíaco, mesentéricas e seus ramos, veia porta e afluentes, veias hepáticas**, ilíacas e ramos da ilíaca interna (glúteas, obturatória, pudenda), femoral e femoral profunda, poplítea, tibiais, fibular, dorsal do pé e plantares; veias superficiais e profundas dos membros e da cabeça. Cada músculo mostra as artérias que o irrigam, e a ficha da artéria, os músculos irrigados; pulsos, relações e 20 feixes neurovasculares ([`docs/circulatorio.md`](docs/circulatorio.md)) |
| Anatomia de superfície do coração (F5, esquemas) | projeção do coração na parede do tórax e focos de ausculta, desenhados sobre a pele |
| Sistema linfático (F5, esquemas) | cisterna do quilo, ducto torácico, ducto linfático direito e os principais grupos de linfonodos (cabeça e pescoço, axilares, paraesternais, mediastinais, traqueobrônquicos, celíacos e mesentéricos, lombares, ilíacos, inguinais e poplíteos); posição aproximada, declarada na ficha |
| Circulação fetal (F5, esquemas; camada desligada por padrão) | placenta e cordão umbilical (malha do Atlas de Referência Humano, CC BY 4.0), veia e artérias umbilicais, ducto venoso; o ligamento arterial (ducto arterioso) fica na camada das artérias |
| Glândulas e língua | parótida e ducto, submandibular, sublingual, língua |
| Cartilagens e discos | nasais, orelha, 6 cartilagens da laringe (tireóidea, cricóidea, aritenóides, epiglote, corniculadas e cuneiformes), costais, discos intervertebrais |
| Ossos e dentes | crânio completo, mandíbula, hioide, coluna (atlas a sacro), costelas, esterno, quadril, clavícula, escápula, úmero, rádio, ulna, carpo, metacarpais, falanges, dentes; **membro inferior (F4.1):** fêmur, patela, tíbia, fíbula, tarso, metatarsais, falanges do pé e sesamoides |

Recursos: **regiões** (corpo, cabeça, tronco, braço, perna), controle de **dissecação** (da pele aos ossos), opacidade da pele,
liga/desliga por camada ou por estrutura, busca, rótulos com linhas de chamada, câmera que enquadra a estrutura escolhida,
vistas predefinidas, ligações **músculo ↔ nervo**, **músculo ↔ artéria** e **músculo ↔ articulação** e **modo quiz** (três tipos, abaixo).

## Nervos

Cada músculo do atlas está ligado ao(s) nervo(s) que o inervam, e cada nervo chega de fato aos seus músculos no modelo
(os ramos finais são gerados até a superfície de cada músculo).

- Na ficha de um **músculo**, a seção *Nervos (inervação)* traz chips clicáveis para os nervos; na de um **nervo**, os
  *músculos e estruturas inervados* (com observações como “ventre anterior”, “1º e 2º lumbricais” ou “sensitivo”).
- Ao selecionar um nervo, os músculos dele ficam destacados e semitransparentes, para o trajeto aparecer por dentro deles;
  ao selecionar um músculo, o nervo dele fica destacado. **Isolar com os músculos / com o nervo** mostra só o conjunto
  (com os ossos de referência).
- A camada **Nervos** liga e desliga todos; na dissecação eles aparecem até “Estruturas profundas”.
- O quiz também pergunta nervos (opção *Nervos* em “O que praticar”).

| Região | Nervos |
| --- | --- |
| Nervos cranianos | **os 12 pares**: olfatório (I), óptico (II), oculomotor (III), troclear (IV), trigêmeo (V) e gânglio trigeminal, oftálmico (V1) com os nervos frontal (supraorbital e supratroclear), lacrimal e nasociliar, maxilar/infraorbital (V2) com o zigomático, os palatinos e o nasopalatino, mandibular (V3: nervos pterigóideos, bucal, auriculotemporal), massetérico, temporais profundos, alveolar inferior/mentual, milo-hióideo, lingual, abducente (VI), facial (VII: tronco, auricular posterior, ramos temporais, zigomáticos, bucais, marginal da mandíbula, cervical, **corda do tímpano, petroso maior e nervo do estapédio**), vestibulococlear (VIII), glossofaríngeo (IX), **vago (X)** com o plexo faríngeo e os laríngeos superior e recorrente, acessório (XI), hipoglosso (XII), nervos dos tensores (V3) |
| Autônomos da cabeça e do pescoço | gânglios pterigopalatino, ótico e submandibular (o ciliar vem da malha real do oculomotor) e o **tronco simpático cervical** com os gânglios superior, médio e estrelado |
| Pescoço e dorso | plexo cervical (ramos musculares), alça cervical, frênico, suboccipital (C1), occipital maior (C2), ramos posteriores dos nervos espinais (C3–L5), e os cutâneos do plexo cervical: occipital menor, auricular magno, cervical transverso e supraclaviculares |
| Medula e nervos espinais | **medula espinal** (intumescências, cone e filo terminal), nervos espinais cervicais, torácicos, lombares e sacrais/coccígeo (raízes, gânglio espinal e início do nervo; os 31 pares) e **cauda equina** |
| Membro superior | plexo braquial (raízes, troncos, divisões, fascículos), dorsal da escápula, torácico longo, supraescapular, subclávio, peitorais lateral e medial, subescapulares superior e inferior, toracodorsal, axilar, musculocutâneo, radial, interósseo posterior, mediano, interósseo anterior, ulnar e ramo profundo do ulnar; **nervos sensitivos**: intercostobraquial, cutâneos medial do braço e do antebraço, posterior e lateral inferior do braço, posterior do antebraço, lateral superior do braço, lateral do antebraço, ramo superficial do radial, ramos cutâneos palmar (mediano e ulnar) e dorsal do ulnar, nervos digitais palmares e dorsais |
| Tronco e pelve | intercostais (T1–T6), toracoabdominais (T7–T11), subcostal (T12), ílio-hipogástrico, ilioinguinal, plexo lombar (ramos musculares), nervos do levantador do ânus/coccígeo, pudendo e nervo para o obturador interno (e gêmeo superior) |
| Membro inferior | femoral, obturatório, glúteos superior e inferior, nervo para o piriforme, nervo para o quadrado femoral (e gêmeo inferior), isquiático, tibial, fibular comum, fibulares superficial e profundo, plantares medial e lateral |

Os textos seguem Moore, Dalley & Agur (*Anatomia orientada para a clínica*), *Gray's Anatomy*, Netter e a Terminologia
Anatômica; onde as fontes divergem (ex.: segmentos medulares de alguns músculos), a ficha diz isso.

**Segmentos medulares (F2.14).** Cada músculo inervado por nervos espinais e cada nervo espinal traz na ficha os **segmentos
medulares** (por exemplo, C5–C6), um campo estruturado (`segmentos`, em `src/segments.js`) que alimenta o mapa de
**miótomos** (`docs/miotomos.md`, gerado por `node tools/gen_miotomos.js`) e o modo de cor *Por segmento medular*.

**Geometria:** o BodyParts3D só tem nervos da órbita (óptico, oculomotor, troclear, oftálmico, frontal, lacrimal,
nasociliar e seus ramos, gânglio e nervos ciliares) — esses usam as malhas reais. Os demais são **modelados por código** (`src/catalog-nerves.js` + `src/nerve-geo.js`):
cada trajeto passa por pontos medidos no próprio modelo — forames da base do crânio, forames intervertebrais, sulcos das
costelas, sulco do nervo radial, túnel do carpo, espaços entre músculos (“entre o flexor superficial e o profundo”) — e
os ramos finais vão até a superfície de cada músculo inervado. São aproximações didáticas: a posição geral e as relações
estão certas, mas espessuras e pequenos ramos são esquemáticos.

## Articulações e movimentos (F3, em andamento)

As articulações do membro superior têm ficha própria (`src/catalog-joints.js`): tipo, superfícies articulares, cápsula,
ligamentos, **movimentos com amplitude** e, para cada movimento, os **músculos principais e auxiliares** (chips clicáveis),
inervação (ramos articulares, que também aparecem na ficha do nervo) e irrigação. A ficha de cada músculo do membro superior mostra
os movimentos que ele realiza em cada articulação; a do osso e a do ligamento, as articulações de que fazem parte. Ao selecionar uma
articulação, os ossos e ligamentos dela ficam em destaque (**Isolar com ossos e ligamentos** mostra só o conjunto).

- **Cápsulas** (camada *Articulações (cápsulas)*): envoltórios translúcidos **esquemáticos**, calculados na carga a partir da zona
  em que as superfícies dos ossos se encaram. No quiz de localizar, elas só respondem ao clique quando a pergunta é uma articulação.
- **Ligamentos**: faixas ancoradas em pontos medidos nas malhas dos ossos; colaterais dos dedos, membrana interóssea e ligamento
  anular gerados por código.
- **Amplitudes**: valores de referência da AAOS (em Norkin & White); outras tabelas diferem em alguns graus e a ficha cita as
  diferenças relevantes. Fontes e decisões em [`docs/articulacoes.md`](docs/articulacoes.md).

Ainda não há: articulações da coluna, do tórax e da cabeça; página e quiz de movimentos; origem e inserção desenhadas no osso;
animação. Esses itens foram **adiados** para dar prioridade ao corpo inteiro e aos sistemas da disciplina (as da pelve e do membro
inferior entram na F4.6) e estão listados em [`docs/pontos-de-melhoria.md`](docs/pontos-de-melhoria.md).

## Modo quiz

O botão **Modo quiz** abre uma janela para escolher o tipo de treino. Em todos os tipos há o filtro **Quais estruturas**
(*Todas*, *⭐ Favoritas*, *🔁 Revisão de hoje*, *🎯 Pontos fracos*, *🆕 Ainda não estudadas* ou uma de *Minhas listas*), com a
quantidade de estruturas de cada opção; opções sem nada ficam desabilitadas.

- **Localizar** — aparece o *nome* de um músculo, osso, ligamento etc. e a pessoa precisa **clicar nele no modelo 3D**.
  Não há alternativas para eliminar. Configurações: região (corpo, cabeça, tronco, braço, perna), o que praticar (músculos,
  nervos, ossos, coração, artérias, veias, linfáticos, órgãos e o grupo “articulações, ligamentos e outras”), número de perguntas (10, 20, 30 ou todas) e se mostra o nome em latim.
  - **3 tentativas** por pergunta. Acertar de primeira vale **1 ponto**; acertar com erro ou dica, **0,5**; esgotar as
    tentativas (ou pular) revela a resposta e vale 0. Clicar de novo na mesma estrutura errada não gasta tentativa.
  - **Dissecação e camadas** continuam disponíveis para chegar às estruturas profundas. O botão **Remover** (ou o
    **botão direito** do mouse) oculta o que estiver no caminho; **Restaurar** traz tudo de volta. Com um **plano de corte**
    ativo, o clique ignora o que foi cortado.
  - **Dica**: a 1ª mostra a camada em que a estrutura está (e deixa visíveis só ela e as mais profundas); a 2ª gira o
    modelo para o lado em que ela aparece. Qualquer dica limita a pergunta a 0,5 ponto.
  - Ao final: pontuação, tempo, acertos de primeira, com ajuda e erradas, lista **“Para revisar”** e o botão
    **Treinar só essas**. A pele e as fáscias translúcidas não atrapalham o clique.
- **Escolher o nome** — a estrutura aparece destacada e a pessoa escolhe o nome entre 4 alternativas, sem fim e sem
  repetir estrutura até acabar as do filtro. Atalhos: **1–4** respondem, **Enter** avança.
- **Quiz teórico** — perguntas de texto geradas a partir das fichas, com 4 alternativas e **uma só correta**
  (as erradas nunca são nervos/artérias/músculos que também seriam resposta). Para **músculos**: qual nervo o inerva, qual artéria o irriga, qual tem esta
  ação / origem / inserção, a que músculo se refere uma observação. Para **nervos**: qual destes músculos ele inerva, a lesão
  de qual nervo causa um quadro, qual nervo cuida de uma sensibilidade. Enunciados que citariam o nome da resposta são
  descartados. Respeita região, tipos (só músculos e nervos), quantidade e filtro; no fim mostra o resultado e **Treinar só as erradas**.

Durante o quiz os nomes da lista e os rótulos ficam escondidos, a coloração temática é suspensa e a região fica fixa.
A última configuração é lembrada no navegador. **Toda resposta** (nos três tipos) alimenta o progresso por estrutura e a
**repetição espaçada** (SM-2 simplificado); cada rodada entra no histórico.

## Ferramentas de estudo (versão 2.1)

O botão **📚 Estudo** abre um painel com abas. Tudo funciona offline e os dados do estudante ficam só no navegador
(`localStorage`), com exportação e importação em JSON.

- **Tours** — 16 roteiros com 98 passos (manguito rotador, plexo braquial, nervo radial, mastigação e V3, nervo facial e
  mímica, parede abdominal, perna e pé, grande e pequena circulação, circulação fetal, generalidades do circulatório,
  coração: superfície/ausculta/condução, artérias da cabeça e do pescoço, círculo arterial do cérebro, fígado/tronco celíaco/veia porta, sistema respiratório e sistema digestório). Cada passo escolhe região, dissecação e a estrutura em destaque; a câmera enquadra a estrutura
  (cópia esquerda) pelo lado indicado. Setas ← → navegam, **Esc** sai. Os textos dos tours são resumos didáticos que ainda
  **não passaram** pela revisão de fontes (`docs/revisao-conteudo.md` cobre as fichas): confira nas referências antes de citar.
- **Progresso** — estruturas estudadas, precisão geral, revisões que vencem hoje (e amanhã/7 dias), pontos fracos, estruturas
  bem fixadas e ainda não estudadas, lista de **onde você mais erra** (com as últimas respostas) e o **histórico** das últimas
  rodadas. Botões levam direto ao quiz com o filtro certo. *Ponto fraco* = errou a última vez **ou** acertou menos de 70%
  das últimas 5 respostas; ao voltar a acertar, sai da lista.
- **Listas** — listas de estudo próprias (“Prova de membro superior”): adicione pelo nome, pela seleção atual ou pelos
  favoritos e treine só com ela em qualquer tipo de quiz.
- **Corte** — plano **sagital**, **coronal** ou **axial** com controle deslizante (o curso vem do tamanho do modelo) e
  botão para inverter o lado. Esconde um dos lados do plano; as malhas são cascas, então o corte mostra o interior dela,
  sem desenhar a superfície da fatia. Um aviso na tela lembra que há corte ativo.
- **Cores** — por camada (padrão), por **nervo que inerva** (nervo principal do músculo), por **região**, por **grupo /
  compartimento** (32 grupos definidos músculo a músculo em `src/study/groups.js`) ou por **segmento medular**: no último,
  escolha C1 a Co1 e o **miótomo** (músculos e nervos do segmento) fica em destaque, com a lista na janela. A cor sobrevive a
  seleção e hover e há legenda na tela.
- **Dermátomos** — na mesma aba, uma opção pinta a pele em faixas (V1–V3 na face, C2–C4 no pescoço, T2–L1 e L1–S3 no tronco,
  C5–T2 no membro superior), **esquemáticas** (`docs/dermatomos.md` explica a decisão e os limites). Com um segmento escolhido,
  destaca o dermátomo dele; os dois (dermátomo e miótomo) aparecem ao mesmo tempo no modo *Por segmento medular*.
- **Vistas e backup** — uma *vista* guarda região, dissecação, camadas, estruturas ocultas, opacidade da pele, rótulos,
  câmera, corte, coloração e seleção; o mesmo estado vai no `#hash` da URL. O backup JSON leva favoritos, anotações,
  progresso, listas, vistas e histórico (a importação valida o arquivo e descarta o que não reconhece).
- **Na ficha**: ★ favoritar, 🖨 imprimir e anotações pessoais (texto puro). **Na barra**: 📷 exporta PNG da vista e 🔗 copia o
  link da vista (em `file://` o link só abre neste computador; para compartilhar, use a versão web).

## De onde vêm os modelos

A pele, os ossos, os dentes, os olhos, as cartilagens, os discos e a maior parte dos músculos do pescoço, tronco e membros
superiores são malhas do **BodyParts3D** (versão 4.0), simplificadas e suavizadas.

> BodyParts3D, Copyright © 2008 The Database Center for Life Science, licenciado sob
> [CC Attribution-Share Alike 2.1 Japão](https://creativecommons.org/licenses/by-sa/2.1/jp/).
> <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/>

O BodyParts3D **não possui** alguns músculos e a maioria dos ligamentos e fáscias. Esses foram **modelados por código**
e “colados” sobre a pele e o esqueleto reais (`src/proc.js`), com posições marcadas à mão:

- cabeça: músculos da expressão facial, masseter, temporal, pterigóideos, bucinador, ligamentos, fáscias e parótida; estiloglosso, palatoglosso, os quatro intrínsecos da língua, tensor do tímpano e estapédio (intraósseos, sem os ossículos), transverso do mento, incisivos labiais, temporoparietal e os músculos lisos do olho (ciliar, esfíncter e dilatador da pupila, tarsais);
- tronco: latíssimo do dorso, reto do abdome, piramidal, oblíquo interno, transverso do abdome, quadrado do lombo e multífido; músculos do períneo urogenital (bulboesponjoso, isquiocavernoso, transversos superficial e profundo, esfíncter externo da uretra);
- mão: lumbricais, palmar curto;
- articulações do membro superior: cápsulas (esquemáticas) e os 16 ligamentos novos;
- sistema nervoso: todos os nervos, exceto os da órbita (malhas reais), e a medula espinal (esquemática: não há meninges nem substância cinzenta).

São aproximações didáticas. Por causa da licença **Share-Alike**, os arquivos `dist/anatomy-data.js`,
`dist/anatomy-body.js`, `dist/anatomy-leg.js`, `dist/anatomy-circ.js`, `dist/anatomy-digest.js` e `dist/anatomy-nerves.js` (malhas derivadas do BodyParts3D; `dist/anatomy-resp.js` traz também os pulmões do Atlas de Referência Humano, CC BY 4.0, ajustados ao tórax, e `dist/anatomy-circ.js`, a placenta e o cordão do mesmo atlas) devem manter a atribuição acima e a mesma licença CC BY-SA ao serem redistribuídos.

### Regenerar os dados

Os scripts de `tools/` baixam só os arquivos necessários do zip do BodyParts3D (via HTTP Range, ~60 MB em vez de 136 MB)
e geram os pacotes. Requer Python com `numpy` e, para a decimação do tronco, `fast-simplification` (`pip install fast-simplification`).

```bash
cd tools
python rangezip.py        # índice do zip remoto → zip_index.tsv
python fetch_parts.py     # cabeça: baixa os elementos usados (pasta obj/)
python convert.py         # cabeça: converte e empacota → anatomy-data.js
python fetch_body.py      # tronco e membros: baixa os elementos usados
python convert_body.py    # tronco e membros: converte e empacota → anatomy-body.js
python fetch_body.py --pack leg     # membro inferior (F4): baixa os elementos do pacote leg
python convert_body.py --pack leg   # membro inferior: converte e empacota → anatomy-leg.js (com a pele inteira)
python fetch_body.py --pack circ    # coração e vasos (F5): baixa os elementos do pacote circ
python convert_body.py --pack circ  # coração e vasos: converte e empacota → anatomy-circ.js (a parede dos ventrículos é dividida em direita e esquerda)
python convert_placenta.py          # placenta e cordão do HRA (GLB em tools/hra/, ver o cabeçalho do script): acrescenta ao pacote circ
# respiratório (F6.1): vias aéreas do BodyParts3D e, depois, os pulmões do Atlas de Referência Humano (baixe o GLB para tools/hra/; URL em convert_hra.py)
python fetch_body.py --pack resp && python convert_body.py --pack resp   # → anatomy-resp.js (copie para ../dist/)
python fit_hra.py                   # ajusta os pulmões ao tórax (escala por eixo) → hra_transform.json
python convert_hra.py --append      # acrescenta os lobos ao pacote em ../dist/ (copie o resultado para ../dist/)
# digestório e baço (F6.2): esôfago ao canal anal, fígado (8 segmentos), vias biliares, pâncreas, baço e mesos
python fetch_body.py --pack digest && python convert_body.py --pack digest # → anatomy-digest.js (copie para ../dist/)
python fetch_nerves.py    # nervos da órbita: baixa os elementos usados
python convert_nerves.py  # nervos da órbita: converte e empacota → anatomy-nerves.js
```

(`isa_element_parts.txt`, `zip_index.tsv` e `want.json` já estão em `tools/`; copie os `.js` gerados para `dist/`.)

Para **acrescentar** peças do tronco ou dos membros sem regenerar as outras (que ficam idênticas byte a byte), defina-as em
`tools/body_parts.py` e rode só para elas (baixa poucos KB e não precisa do `fast-simplification`):

```bash
cd tools
python fetch_body.py id1 id2            # só os elementos dessas peças
python convert_body.py --append id1 id2 # lê ../dist/anatomy-body.js e acrescenta as peças → anatomy-body.js
```

O pacote do membro inferior funciona igual, com `--pack leg` (`fetch_body.py --pack leg id1 id2` e `convert_body.py --pack leg --append id1
id2`); as peças dele (`pack="leg"` em `addl(...)`) e o que o banco não tem estão em [`docs/inventario-membro-inferior.md`](docs/inventario-membro-inferior.md).

`mirror=True` em `add(...)` cria o lado que falta no banco (cópia espelhada em x).

## Estrutura

| Arquivo | Função |
| --- | --- |
| `src/catalog*.js` | **Textos e geometria de cada estrutura** (edite aqui para corrigir ou acrescentar) |
| `src/catalog-nerves.js` | Nervos: textos, trajetos e a lista de músculos de cada um (fonte da ligação músculo ↔ nervo) |
| `src/catalog-muscles-oral.js`, `catalog-nerves-cranial.js`, `catalog-nerves-sensory.js`, `catalog-spinal.js` | Língua, palato, faringe e laringe com malha real; nervos cranianos e autônomos que faltavam; nervos sensitivos; medula, nervos espinais e cauda equina |
| `src/segments.js` | **Segmentos medulares** de músculos e nervos (fonte do mapa de miótomos e dos dermátomos por segmento) |
| `src/nerve-geo.js` | Geometria dos nervos: resolve os pontos dos trajetos e gera os ramos até os músculos |
| `src/landmarks.js` | Pontos de referência ósseos usados por músculos profundos e ligamentos |
| `src/proc.js` | Geração das malhas procedurais (fita, lâmina, anel, tubo; cápsula, lâmina entre ossos, colaterais e grupos via `joint-geo.js`) |
| `src/catalog-leg-bones.js` | **Ossos do membro inferior** (pacote `dist/anatomy-leg.js`, carregado depois do corpo) |
| `src/catalog-leg-muscles.js`, `src/catalog-leg-perna.js`, `src/catalog-leg-pe.js`, `src/catalog-nerves-leg.js` | **Músculos do quadril e da coxa, da perna e do pé**, a membrana interóssea da perna e os **nervos do membro inferior** (mesmo pacote) |
| `src/catalog-resp.js`, `src/catalog-resp-airways.js` | **Pulmões** (a ficha diz que a malha é do Atlas de Referência Humano) e **vias aéreas** (traqueia, brônquios, pleuras, cartilagens da laringe); pacote `dist/anatomy-resp.js`, carregado depois do circulatório |
| `src/catalog-digest.js` | **Sistema digestório e baço** (34 fichas: esôfago ao canal anal, 8 segmentos do fígado, vias biliares, pâncreas, baço e mesos); pacote `dist/anatomy-digest.js`, carregado depois do respiratório |
| `src/catalog-circ.js`, `src/catalog-circ-ramos.js`, `src/hull-geo.js` | **Coração e vasos** (pacote `dist/anatomy-circ.js`, carregado depois do membro inferior); os vasos de menor calibre; o casco suavizado do pericárdio esquemático |
| `src/catalog-circ-viscerais.js`, `src/catalog-circ-codigo.js` | Vasos do **encéfalo e das vísceras** (malhas do BodyParts3D) e vasos **por código** (carótida externa, veias da cabeça, ramos da ilíaca interna) |
| `src/catalog-circ-esquemas.js`, `src/catalog-circ-superficie.js`, `src/catalog-circ-fetal.js`, `src/cardio-extras.js` | **Linfáticos, sistema de condução, papilar posteromedial, projeção do coração e focos de ausculta, circulação fetal** (esquemas por código, declarados na ficha; a placenta e o cordão vêm do HRA) e os campos de irrigação, inervação e esqueleto fibroso do coração |
| `src/irrigation.js`, `src/vessel-clinical.js`, `src/neurovascular.js`, `src/vascular-links.js` | **Irrigação** de cada músculo (fonte única), pulsos e relações dos vasos, feixes neurovasculares e as seções da ficha que os mostram |
| `src/catalog-joints.js` | **Articulações e ligamentos do membro superior**: fichas, ossos, ligamentos, movimentos (fonte da ligação músculo ↔ articulação) e nervos |
| `src/joint-geo.js`, `src/joint-links.js` | Geometria das cápsulas e ligamentos medida nos ossos; seções da ficha ligadas às articulações |
| `src/surfaces.js` | Projeção de pontos sobre a pele e o esqueleto (BVH) |
| `src/anatomy.js` | Carrega e descompacta as malhas reais |
| `src/main.js` | Cena, interface, rótulos e quizzes de localizar e de escolher o nome |
| `src/study/` | Ferramentas de estudo: `ui.js` (controlador e modal), `storage.js`, `sm2.js`, `views.js`, `clipping.js`, `coloring.js` + `groups.js`, `dermatomes.js`, `tours.js`, `text-quiz.js` + `text-quiz-ui.js`, `lists-ui.js`, `progress-ui.js`, `export.js` |
| `tools/` | Pipeline de dados (Python) e do executável (`build_exe.py`, `launcher/Launcher.cs`) |
| `.github/workflows/release.yml` | Gera e publica a release a cada push na `main` |
| `tests/` | Testes: integridade do catálogo, dos tours e dos grupos (`test_catalog.js`), lógica das ferramentas de estudo (`test_study.js`) e fumaça no navegador (`smoke_test.js`; `SMOKE_FILE=1` abre por `file://`) |
| `docs/` | Auditoria de conteúdo (`revisao-conteudo.md`), cobertura (`cobertura.md`), articulações (`articulacoes.md`), membro inferior (`inventario-membro-inferior.md`), circulatório (`circulatorio.md`), respiratório (`respiratorio.md`), digestório (`digestorio.md`), fonte HRA (`fonte-hra-atlas-de-referencia.md`), miótomos (`miotomos.md`), dermátomos (`dermatomos.md`), desempenho (`desempenho.md`, `otimizacao-mobile.md`), pontos de melhoria (`pontos-de-melhoria.md`), concorrentes (`concorrentes.md`) e publicação como site/celular (`publicacao-web.md`) |
| `project_context.md` | Roteiro: mapa do que atlas de anatomia costumam ter e a ordem de desenvolvimento por fases |
| `agents.md` | Guia para agentes de código e colaboradores: convenções, verificação, regras de conteúdo e de publicação |

### Acrescentar uma estrutura procedural

No catálogo, use `proc: [ { kind, proj, ... } ]`. As formas 2D (`ribbon`, `sheet`, `ring`) são desenhadas no plano de
projeção (`'z+'` frente, `'x+'` lateral, `'y+'` topo, `'z-'` costas, `'r+'` radial ao redor do tronco: coordenadas
`[ângulo, altura]`) e projetadas na pele, afundadas `inset` unidades (1 unidade = 10 cm). `tube` liga pontos 3D —
nomes de `landmarks.js`, coordenadas ou pontos projetados na pele; `torus` desenha um anel em torno de um eixo (pupila,
corpo ciliar, esfíncter da uretra). Desenhe só o lado esquerdo (x > 0); o direito é
espelhado, a menos que `paired: false`.

## Aviso

Material de apoio ao estudo, não substitui atlas, aulas ou dissecação. O modelo é de um único indivíduo e as estruturas
geradas por código têm formato e posição aproximados. Confirme detalhes em um atlas de referência (Netter, Gray, Sobotta).
