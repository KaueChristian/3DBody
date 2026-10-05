# Anatomia 3D

Atlas 3D interativo de **cabeça, tronco e membros superiores**, com pele, fáscias, músculos, ligamentos, glândulas,
cartilagens, ossos e dentes em camadas. Cada estrutura tem nome em português e em latim e uma ficha: nos músculos,
**ação, origem, inserção e inervação**; nos ossos, localização, articulações, estruturas e função; nos ligamentos,
fixações e função. Membros inferiores ficam para uma próxima etapa.

## Como abrir

Dê dois cliques em `index.html` (Chrome, Edge ou Firefox). Não precisa de internet nem de servidor.
A cabeça aparece primeiro; o tronco e os membros são carregados em segundo plano (`dist/anatomy-body.js`).

Para editar o código:

```bash
npm install
npm run watch   # recompila ao salvar
npm run build   # gera dist/app.js minificado
npm start       # opcional: servidor local em http://localhost:5173
```

## Executável para Windows (com atualização automática)

**Download:** <https://github.com/KaueFirmo/3DBody/releases/latest/download/Anatomia3D.exe>
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

## O que tem (216 estruturas, 154 delas músculos)

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
| Glândulas e língua | parótida e ducto, submandibular, sublingual, língua |
| Cartilagens e discos | nasais, orelha, costais, discos intervertebrais |
| Ossos e dentes | crânio completo, mandíbula, hioide, coluna (atlas a sacro), costelas, esterno, quadril, clavícula, escápula, úmero, rádio, ulna, carpo, metacarpais, falanges, dentes |

Recursos: **regiões** (corpo, cabeça, tronco, braço), controle de **dissecação** (da pele aos ossos), opacidade da pele,
liga/desliga por camada ou por estrutura, busca, rótulos com linhas de chamada, câmera que enquadra a estrutura escolhida,
vistas predefinidas e **modo quiz** (dois tipos, abaixo).

## Modo quiz

O botão **Modo quiz** abre uma janela para escolher o tipo de treino:

- **Localizar** — aparece o *nome* de um músculo, osso, ligamento etc. e a pessoa precisa **clicar nele no modelo 3D**.
  Não há alternativas para eliminar. Configurações: região (corpo, cabeça, tronco, braço), o que praticar (músculos,
  ossos, ligamentos e outras), número de perguntas (10, 20, 30 ou todas) e se mostra o nome em latim.
  - **3 tentativas** por pergunta. Acertar de primeira vale **1 ponto**; acertar com erro ou dica, **0,5**; esgotar as
    tentativas (ou pular) revela a resposta e vale 0. Clicar de novo na mesma estrutura errada não gasta tentativa.
  - **Dissecação e camadas** continuam disponíveis para chegar às estruturas profundas. O botão **Remover** (ou o
    **botão direito** do mouse) oculta o que estiver no caminho; **Restaurar** traz tudo de volta.
  - **Dica**: a 1ª mostra a camada em que a estrutura está (e deixa visíveis só ela e as mais profundas); a 2ª gira o
    modelo para o lado em que ela aparece. Qualquer dica limita a pergunta a 0,5 ponto.
  - Ao final: pontuação, tempo, acertos de primeira, com ajuda e erradas, lista **“Para revisar”** e o botão
    **Treinar só essas**. A pele e as fáscias translúcidas não atrapalham o clique.
- **Escolher o nome** — a estrutura aparece destacada e a pessoa escolhe o nome entre 4 alternativas (sem fim).

Nos dois tipos os nomes da lista e os rótulos ficam escondidos durante a pergunta. A última configuração é lembrada no navegador.

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

São aproximações didáticas. Por causa da licença **Share-Alike**, os arquivos `dist/anatomy-data.js` e
`dist/anatomy-body.js` (malhas derivadas) devem manter a atribuição acima e a mesma licença CC BY-SA ao serem redistribuídos.

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
```

(`isa_element_parts.txt`, `zip_index.tsv` e `want.json` já estão em `tools/`; copie os `.js` gerados para `dist/`.)

## Estrutura

| Arquivo | Função |
| --- | --- |
| `src/catalog*.js` | **Textos e geometria de cada estrutura** (edite aqui para corrigir ou acrescentar) |
| `src/landmarks.js` | Pontos de referência ósseos usados por músculos profundos e ligamentos |
| `src/proc.js` | Geração das malhas procedurais (fita, lâmina, anel, tubo) |
| `src/surfaces.js` | Projeção de pontos sobre a pele e o esqueleto (BVH) |
| `src/anatomy.js` | Carrega e descompacta as malhas reais |
| `src/main.js` | Cena, interface, rótulos e quiz |
| `tools/` | Pipeline de dados (Python) e do executável (`build_exe.py`, `launcher/Launcher.cs`) |
| `.github/workflows/release.yml` | Gera e publica a release a cada push na `main` |

### Acrescentar uma estrutura procedural

No catálogo, use `proc: [ { kind, proj, ... } ]`. As formas 2D (`ribbon`, `sheet`, `ring`) são desenhadas no plano de
projeção (`'z+'` frente, `'x+'` lateral, `'y+'` topo, `'z-'` costas, `'r+'` radial ao redor do tronco: coordenadas
`[ângulo, altura]`) e projetadas na pele, afundadas `inset` unidades (1 unidade = 10 cm). `tube` liga pontos 3D —
nomes de `landmarks.js`, coordenadas ou pontos projetados na pele. Desenhe só o lado esquerdo (x > 0); o direito é
espelhado, a menos que `paired: false`.

## Aviso

Material de apoio ao estudo, não substitui atlas, aulas ou dissecação. O modelo é de um único indivíduo e as estruturas
geradas por código têm formato e posição aproximados. Confirme detalhes em um atlas de referência (Netter, Gray, Sobotta).
