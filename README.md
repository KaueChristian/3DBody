# Anatomia 3D

Atlas 3D interativo de **cabeça, tronco e membros superiores**, com pele, fáscias, músculos, **nervos**, ligamentos,
glândulas, cartilagens, ossos e dentes em camadas. Cada estrutura tem nome em português e em latim e uma ficha: nos
músculos, **ação, origem, inserção e inervação**; nos nervos, **origem, trajeto, ramos, sensibilidade, lesão e os músculos
que inervam**; nos ossos, localização, articulações, estruturas e função; nos ligamentos, fixações e função.
Membros inferiores ficam para uma próxima etapa.

## Como abrir

Dê dois cliques em `index.html` (Chrome, Edge ou Firefox). Não precisa de internet nem de servidor.
A cabeça aparece primeiro; o tronco e os membros são carregados em segundo plano (`dist/anatomy-body.js`).

Para editar o código:

```bash
npm install
npm run watch   # recompila ao salvar
npm run build   # gera dist/app.js minificado
npm test        # integridade do catálogo + testes das ferramentas de estudo + fumaça no navegador (Chrome/Edge)
npm start       # opcional: servidor local em http://localhost:5173
```

## No celular (Android, HarmonyOS e outros)

O caminho é o **site/PWA** (GitHub Pages), aberto no navegador do aparelho e instalável na tela inicial; não há app nativo.
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

## O que tem (271 estruturas: 154 músculos e 55 nervos)

| Camada | Conteúdo |
| --- | --- |
| Pele | pele do corpo (translúcida ou opaca) e sobrancelhas |
| Fáscias e aponeuroses | gálea aponeurótica, fáscia temporal, fáscia parotideomassetérica |
| Músculos da mímica | frontal, occipital, auriculares, orbicular do olho/boca, corrugador, prócero, nasal, levantadores, zigomáticos, risório, abaixadores, mentual… |
| Músculos da mastigação e planos profundos da cabeça | masseter, temporal, pterigóideos, bucinador, supra-hióideos |
| Órbita e olho | globo ocular, 6 músculos extraoculares, levantador da pálpebra, placas tarsais |
| Músculos superficiais (tronco e membros) | peitoral maior (3 partes), trapézio (3 partes), latíssimo do dorso, oblíquo externo, reto do abdome, deltoide (3 partes), bíceps, tríceps, extensores e flexores superficiais do antebraço, tenar/hipotenar superficial |
| Músculos intermediários | peitoral menor, subclávio, serrátil anterior, rombóides, levantador da escápula, serráteis posteriores, esplênios, oblíquo interno, manguito rotador, braquial, flexor superficial, lumbricais… |
| Músculos profundos (tronco e membros) | intercostais, transverso do tórax, diafragma, transverso do abdome, quadrado do lombo, psoas, ilíaco, eretores da espinha, semiespinais, multífido, rotadores, interespinais, intertransversários, suboccipitais, pré-vertebrais, assoalho pélvico, flexor profundo, pronador quadrado, interósseos |
| Ligamentos | 10 da cabeça (temporomandibular, estilomandibular, palpebrais…), linha alba, retináculo dos flexores |
| Nervos | 55 nervos ligados a **todos** os 154 músculos (veja abaixo) |
| Glândulas e língua | parótida e ducto, submandibular, sublingual, língua |
| Cartilagens e discos | nasais, orelha, costais, discos intervertebrais |
| Ossos e dentes | crânio completo, mandíbula, hioide, coluna (atlas a sacro), costelas, esterno, quadril, clavícula, escápula, úmero, rádio, ulna, carpo, metacarpais, falanges, dentes |

Recursos: **regiões** (corpo, cabeça, tronco, braço), controle de **dissecação** (da pele aos ossos), opacidade da pele,
liga/desliga por camada ou por estrutura, busca, rótulos com linhas de chamada, câmera que enquadra a estrutura escolhida,
vistas predefinidas, ligação **músculo ↔ nervo** e **modo quiz** (dois tipos, abaixo).

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
| Nervos cranianos | óptico (II), oculomotor (III), troclear (IV), trigêmeo (V) e gânglio trigeminal, oftálmico (V1), maxilar/infraorbital (V2), mandibular (V3: nervos pterigóideos, bucal, auriculotemporal), massetérico, temporais profundos, alveolar inferior/mentual, milo-hióideo, lingual, abducente (VI), facial (VII: tronco, auricular posterior, ramos temporais, zigomáticos, bucais, marginal da mandíbula e cervical), acessório (XI), hipoglosso (XII) |
| Pescoço e dorso | plexo cervical (ramos musculares), alça cervical, frênico, suboccipital (C1), occipital maior (C2), ramos posteriores dos nervos espinais (C3–L5) |
| Membro superior | plexo braquial (raízes, troncos, divisões, fascículos), dorsal da escápula, torácico longo, supraescapular, subclávio, peitorais lateral e medial, subescapulares superior e inferior, toracodorsal, axilar, musculocutâneo, radial, interósseo posterior, mediano, interósseo anterior, ulnar e ramo profundo do ulnar |
| Tronco e pelve | intercostais (T1–T6), toracoabdominais (T7–T11), subcostal (T12), ílio-hipogástrico, ilioinguinal, plexo lombar (ramos musculares), femoral (parte pélvica), nervos do levantador do ânus/coccígeo, pudendo |

Os textos seguem Moore, Dalley & Agur (*Anatomia orientada para a clínica*), *Gray's Anatomy*, Netter e a Terminologia
Anatômica; onde as fontes divergem (ex.: segmentos medulares de alguns músculos), a ficha diz isso.

**Geometria:** o BodyParts3D só tem nervos da órbita (óptico, oculomotor, troclear, oftálmico e ramos, gânglio ciliar) —
esses usam as malhas reais. Os demais são **modelados por código** (`src/catalog-nerves.js` + `src/nerve-geo.js`):
cada trajeto passa por pontos medidos no próprio modelo — forames da base do crânio, forames intervertebrais, sulcos das
costelas, sulco do nervo radial, túnel do carpo, espaços entre músculos (“entre o flexor superficial e o profundo”) — e
os ramos finais vão até a superfície de cada músculo inervado. São aproximações didáticas: a posição geral e as relações
estão certas, mas espessuras e pequenos ramos são esquemáticos.

## Modo quiz

O botão **Modo quiz** abre uma janela para escolher o tipo de treino. Em todos os tipos há o filtro **Quais estruturas**
(*Todas*, *⭐ Favoritas*, *🔁 Revisão de hoje*, *🎯 Pontos fracos*, *🆕 Ainda não estudadas* ou uma de *Minhas listas*), com a
quantidade de estruturas de cada opção; opções sem nada ficam desabilitadas.

- **Localizar** — aparece o *nome* de um músculo, osso, ligamento etc. e a pessoa precisa **clicar nele no modelo 3D**.
  Não há alternativas para eliminar. Configurações: região (corpo, cabeça, tronco, braço), o que praticar (músculos,
  nervos, ossos, ligamentos e outras), número de perguntas (10, 20, 30 ou todas) e se mostra o nome em latim.
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
  (as erradas nunca são nervos/músculos que também seriam resposta). Para **músculos**: qual nervo o inerva, qual tem esta
  ação / origem / inserção, a que músculo se refere uma observação. Para **nervos**: qual destes músculos ele inerva, a lesão
  de qual nervo causa um quadro, qual nervo cuida de uma sensibilidade. Enunciados que citariam o nome da resposta são
  descartados. Respeita região, tipos (só músculos e nervos), quantidade e filtro; no fim mostra o resultado e **Treinar só as erradas**.

Durante o quiz os nomes da lista e os rótulos ficam escondidos, a coloração temática é suspensa e a região fica fixa.
A última configuração é lembrada no navegador. **Toda resposta** (nos três tipos) alimenta o progresso por estrutura e a
**repetição espaçada** (SM-2 simplificado); cada rodada entra no histórico.

## Ferramentas de estudo (versão 2.1)

O botão **📚 Estudo** abre um painel com abas. Tudo funciona offline e os dados do estudante ficam só no navegador
(`localStorage`), com exportação e importação em JSON.

- **Tours** — 6 roteiros com 24 passos (manguito rotador, plexo braquial, nervo radial, mastigação e V3, nervo facial e
  mímica, parede abdominal). Cada passo escolhe região, dissecação e a estrutura em destaque; a câmera enquadra a estrutura
  (cópia esquerda) pelo lado indicado. Setas ← → navegam, **Esc** sai. Os textos dos tours são resumos didáticos que ainda
  **não passaram** pela revisão de fontes (`docs/revisao-conteudo.md` cobre as fichas): confira nas referências antes de citar.
- **Progresso** — estruturas estudadas, precisão geral, revisões que vencem hoje (e amanhã/7 dias), pontos fracos, estruturas
  bem fixadas e ainda não estudadas, lista de **onde você mais erra** (com as últimas respostas) e o **histórico** das últimas
  rodadas. Botões levam direto ao quiz com o filtro certo. *Ponto fraco* = errou a última vez **ou** acertou menos de 70%
  das últimas 5 respostas; ao voltar a acertar, sai da lista.
- **Listas** — listas de estudo próprias (“Prova de membro superior”): adicione pelo nome, pela seleção atual ou pelos
  favoritos e treine só com ela em qualquer tipo de quiz.
- **Corte** — plano **sagital**, **coronal** ou **axial** com controle deslizante (o curso vem do tamanho do modelo) e
  botão para inverter o lado. Esconde um dos lados do plano; as malhas são cascas, então o corte mostra o interior delas,
  sem desenhar a superfície da fatia. Um aviso na tela lembra que há corte ativo.
- **Cores** — por camada (padrão), por **nervo que inerva** (nervo principal do músculo), por **região** ou por **grupo /
  compartimento** (18 grupos definidos músculo a músculo em `src/study/groups.js`). A cor sobrevive a seleção e hover e há
  legenda na tela.
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

- cabeça: músculos da expressão facial, masseter, temporal, pterigóideos, bucinador, ligamentos, fáscias e parótida;
- tronco: latíssimo do dorso, reto do abdome, piramidal, oblíquo interno, transverso do abdome, quadrado do lombo e multífido;
- mão: lumbricais.

São aproximações didáticas. Por causa da licença **Share-Alike**, os arquivos `dist/anatomy-data.js`,
`dist/anatomy-body.js` e `dist/anatomy-nerves.js` (malhas derivadas) devem manter a atribuição acima e a mesma licença CC BY-SA ao serem redistribuídos.

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
python fetch_nerves.py    # nervos da órbita: baixa os elementos usados
python convert_nerves.py  # nervos da órbita: converte e empacota → anatomy-nerves.js
```

(`isa_element_parts.txt`, `zip_index.tsv` e `want.json` já estão em `tools/`; copie os `.js` gerados para `dist/`.)

## Estrutura

| Arquivo | Função |
| --- | --- |
| `src/catalog*.js` | **Textos e geometria de cada estrutura** (edite aqui para corrigir ou acrescentar) |
| `src/catalog-nerves.js` | Nervos: textos, trajetos e a lista de músculos de cada um (fonte da ligação músculo ↔ nervo) |
| `src/nerve-geo.js` | Geometria dos nervos: resolve os pontos dos trajetos e gera os ramos até os músculos |
| `src/landmarks.js` | Pontos de referência ósseos usados por músculos profundos e ligamentos |
| `src/proc.js` | Geração das malhas procedurais (fita, lâmina, anel, tubo) |
| `src/surfaces.js` | Projeção de pontos sobre a pele e o esqueleto (BVH) |
| `src/anatomy.js` | Carrega e descompacta as malhas reais |
| `src/main.js` | Cena, interface, rótulos e quizzes de localizar e de escolher o nome |
| `src/study/` | Ferramentas de estudo: `ui.js` (controlador e modal), `storage.js`, `sm2.js`, `views.js`, `clipping.js`, `coloring.js` + `groups.js`, `tours.js`, `text-quiz.js` + `text-quiz-ui.js`, `lists-ui.js`, `progress-ui.js`, `export.js` |
| `tools/` | Pipeline de dados (Python) e do executável (`build_exe.py`, `launcher/Launcher.cs`) |
| `.github/workflows/release.yml` | Gera e publica a release a cada push na `main` |
| `tests/` | Testes: integridade do catálogo, dos tours e dos grupos (`test_catalog.js`), lógica das ferramentas de estudo (`test_study.js`) e fumaça no navegador (`smoke_test.js`; `SMOKE_FILE=1` abre por `file://`) |
| `docs/` | Auditoria de conteúdo (`revisao-conteudo.md`), desempenho (`desempenho.md`), concorrentes (`concorrentes.md`) e publicação como site/celular (`publicacao-web.md`) |
| `project_context.md` | Roteiro: mapa do que atlas de anatomia costumam ter e a ordem de desenvolvimento por fases |
| `agents.md` | Guia para agentes de código e colaboradores: convenções, verificação, regras de conteúdo e de publicação |

### Acrescentar uma estrutura procedural

No catálogo, use `proc: [ { kind, proj, ... } ]`. As formas 2D (`ribbon`, `sheet`, `ring`) são desenhadas no plano de
projeção (`'z+'` frente, `'x+'` lateral, `'y+'` topo, `'z-'` costas, `'r+'` radial ao redor do tronco: coordenadas
`[ângulo, altura]`) e projetadas na pele, afundadas `inset` unidades (1 unidade = 10 cm). `tube` liga pontos 3D —
nomes de `landmarks.js`, coordenadas ou pontos projetados na pele. Desenhe só o lado esquerdo (x > 0); o direito é
espelhado, a menos que `paired: false`.

## Aviso

Material de apoio ao estudo, não substitui atlas, aulas ou dissecação. O modelo é de um único indivíduo e as estruturas
geradas por código têm formato e posição aproximados. Confirme detalhes em um atlas de referência (Netter, Gray, Sobotta).
