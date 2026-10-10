# Anatomia 3D — contexto e roteiro do projeto

> Documento-guia do ritmo e da **ordem** do desenvolvimento. Lê-se de cima para baixo: §1–§3 dão o contexto, §4–§5 mapeiam
> o que sites de estudo de anatomia costumam ter e onde estamos, §6 é o roteiro em fases, §7–§9 dizem como e com que cuidado
> executar. Revisão inicial: 2026-10-05, sobre a versão **2.0.1**.
> Para regras de trabalho de quem for mexer no código (pessoa ou agente), veja [`agents.md`](agents.md).

## 1. Como usar este documento

- **A ordem das fases é a ordem de execução.** Só se abre a fase seguinte quando a anterior cumpre o *critério de saída*,
  ou quando uma decisão fica registrada em §10 explicando o desvio.
- **Uma fase = uma versão menor** (`package.json`: 2.0 → 2.1 → 2.2…). Lotes dentro da fase saem como correções (2.1.x),
  numeradas pelo GitHub Actions. O fim do osteomuscular completo vira **3.0**.
- Cada item tem um **ID** (`F2.4`) para citar em commits, issues e conversas.
- Ao concluir um item: marque ✅ aqui, anote a versão em §10 e atualize contagens do `README.md`.
- **Tamanhos** (uma pessoa, com assistente de código): **P** ≈ até 1 dia · **M** ≈ 2–4 dias · **G** ≈ 1–2 semanas ·
  **GG** > 2 semanas (precisa ser quebrado em lotes). São palpites iniciais; a tabela de §8 serve para recalibrar.
- Legenda de status: ✅ feito · 🟡 parcial · ⬜ não feito.

## 2. Visão e público

Atlas de estudo de anatomia humana em 3D, **em português**, gratuito, que funciona **offline** (no navegador ou no `.exe`
do Windows, com atualização automática), para estudantes e profissionais de saúde — medicina, fisioterapia, educação
física, enfermagem, odontologia, terapia ocupacional.

O que já nos diferencia e deve ser preservado: nomes em PT-BR com latim (Terminologia Anatômica), fichas com origem,
inserção, ação e inervação, **ligação músculo ↔ nervo** navegável, **quiz de localizar no 3D**, dissecação por camadas e
atribuição/licença clara dos dados.

Não é: substituto de atlas ou aula, ferramenta de diagnóstico, nem plataforma com contas obrigatórias.

## 3. Princípios e restrições (valem para todas as fases)

1. **Precisão antes de volume.** Todo fato de ficha tem fonte de referência (Moore/Dalley/Agur, Gray's, Netter, Sobotta,
   Terminologia Anatômica). Onde as fontes divergem, a ficha diz. Geometria aproximada é **declarada** como tal.
2. **Offline primeiro.** Tem de abrir por `file://`, sem servidor, sem CDN, sem backend obrigatório. Dados do usuário ficam
   no navegador (`localStorage`) e sempre podem ser exportados.
3. **Licença.** BodyParts3D é CC BY-SA 2.1 Japão: malhas derivadas mantêm a licença e a atribuição visível. Texto das
   fichas é escrito por nós a partir das referências — não se copia texto de atlas.
4. **Um único modelo** (corpo adulto jovem do BodyParts3D). Variação individual, sexo e idade não são representados; a
   interface não deve sugerir o contrário.
5. **Orçamento de dados e desempenho.** Hoje: ≈ 11,6 MB de dados em JS (exe de 8,5 MB compactado), cabeça visível em
   poucos segundos, resto carregado em segundo plano. Meta: **exe ≤ 30 MB**, primeira imagem < 3 s, ≥ 30 fps em notebook
   modesto, tela de celular utilizável. Região nova = pacote novo carregado sob demanda.
6. **O catálogo é a fonte da verdade** (`src/catalog*.js`). As guardas de `catalog.js` quebram a carga se houver id
   duplicado, ramo para estrutura inexistente ou músculo sem nervo; **cada sistema novo ganha guardas equivalentes**.
7. **Convenções de espaço:** x = esquerda do sujeito, y para cima, z para frente, 1 unidade = 10 cm. Desenha-se o lado
   esquerdo; o direito é espelhado.
8. **Publicar é um ato deliberado.** Push na `main` gera release para **todos** que usam o `.exe`. Trabalho em `dev`;
   release só com a fase (ou lote) pronta e verificada.
9. **Interface em PT-BR**; latim como segundo nome; inglês só como camada opcional futura.

## 4. Mapa de referência — o que sites de estudo de anatomia costumam ter

Levantamento de funcionalidades **comuns** em atlas 3D e plataformas de estudo (Zygote Body, BioDigital Human, Visible Body,
Complete Anatomy, Kenhub, TeachMeAnatomy, Anatomy.app e similares). É um mapa do domínio feito a partir do conhecimento
geral desses produtos, sem pesquisa nova; vale reconferir na F0.
**Peso:** ★★★ essencial (quase todo atlas tem) · ★★ comum · ★ diferencial.

### A. Conteúdo anatômico

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| A1 | Ossos individuais com **acidentes ósseos** (forames, processos, tuberosidades) selecionáveis | ★★★ | 🟡 38 ossos/grupos; acidentes só como pontos internos |
| A2 | Articulações (tipo, movimentos, cápsula) | ★★★ | ⬜ |
| A3 | Ligamentos | ★★★ | 🟡 12 (10 na cabeça, linha alba, retináculo) |
| A4 | Músculos esqueléticos | ★★★ | 🟡 204 (101 cabeça/pescoço, 54 tronco, 49 membro superior); sem membro inferior |
| A5 | Nervos (cranianos, espinais, plexos, ramos) | ★★★ | 🟡 100 nervos e gânglios: os 12 pares, plexos, sensitivos do membro superior e do pescoço, autônomos da cabeça; faltam os do membro inferior e os das vísceras |
| A6 | Artérias e veias | ★★★ | ⬜ |
| A7 | Sistema linfático (linfonodos, ducto torácico) | ★★ | ⬜ |
| A8 | Vísceras: respiratório, digestório, urinário, genital, endócrino, coração | ★★★ | ⬜ |
| A9 | Sistema nervoso central (encéfalo, medula, meninges, ventrículos) | ★★★ | 🟡 medula espinal e cauda equina (esquemáticas); sem encéfalo e meninges |
| A10 | Órgãos dos sentidos (olho, ouvido, nariz, língua) | ★★ | 🟡 globo ocular com músculos lisos, 6 extraoculares, língua e seus 8 músculos, músculos do ouvido médio (sem ossículos) |
| A11 | Fáscias, compartimentos, bursas, bainhas sinoviais, retináculos | ★★ | 🟡 3 fáscias da cabeça + retináculo dos flexores |
| A12 | Regiões e espaços clínicos (triângulos do pescoço, fossa cubital, canal do carpo, canal inguinal) | ★★ | ⬜ |
| A13 | Pele e anexos; anatomia de superfície | ★★ | 🟡 pele translúcida, com dermátomos esquemáticos; sem anotações de superfície |
| A14 | Histologia e embriologia | ★ | ⬜ |
| A15 | Variações (sexo, idade, anatomia comparada de variações comuns) | ★ | ⬜ |

### B. Visualização e navegação

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| B1 | Camadas / dissecação progressiva | ★★★ | ✅ |
| B2 | Mostrar, ocultar e **isolar** estruturas | ★★★ | ✅ |
| B3 | Rótulos com linhas de chamada; câmera que enquadra a seleção | ★★★ | ✅ |
| B4 | Vistas predefinidas e opacidade da pele | ★★ | ✅ |
| B5 | Salvar/compartilhar uma vista (câmera + camadas + seleção) | ★★ | ✅ vistas salvas e link com `#hash` (região, dissecação, camadas, câmera, corte, cores, seleção) |
| B6 | **Plano de corte** (sagital, coronal, axial) | ★★ | 🟡 plano sagital/coronal/axial ✅; a fatia não é “tampada” (as malhas são cascas) |
| B7 | Colorir por sistema, nervo que inerva, ação ou grupo | ★★ | ✅ por camada, nervo, região, grupo (23 grupos) e segmento medular, com legenda |
| B8 | **Origem e inserção marcadas no osso** | ★★★ | ⬜ |
| B9 | Animação de movimento / de ação muscular | ★★★ | ⬜ |
| B10 | Vista explodida; medidas (distância/ângulo) | ★ | ⬜ |
| B11 | Cortes transversais com imagem (TC/RM correlacionadas) | ★★ | ⬜ |
| B12 | Realidade aumentada / VR | ★ | ⬜ (fora do núcleo) |

### C. Ficha da estrutura

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| C1 | Nome em PT e em latim | ★★★ | ✅ |
| C2 | Origem, inserção, ação, inervação | ★★★ | ✅ |
| C3 | **Irrigação** (artérias) | ★★★ | ⬜ |
| C4 | Aplicação clínica e lesões | ★★★ | 🟡 nervos têm “Lesão”; músculos só em notas |
| C5 | Estruturas vizinhas / relações | ★★ | ⬜ |
| C6 | Nome em inglês, sinônimos e epônimos na busca | ★★ | ⬜ (busca por nome, ação e nervo ✅) |
| C7 | Fontes citadas na ficha | ★★ | 🟡 só na `nota` e no README |
| C8 | Pronúncia dos termos | ★ | ⬜ |
| C9 | Ilustrações 2D, esquemas e fotos | ★★ | ⬜ |
| C10 | Links cruzados: músculo ↔ nervo | ★★★ | ✅ |
| C11 | Links cruzados: músculo ↔ artéria, ↔ articulação, ↔ movimento | ★★★ | ⬜ |

### D. Estudo e avaliação

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| D1 | Quiz “escolha o nome” | ★★★ | ✅ |
| D2 | Quiz “localize no modelo 3D” (3 tentativas, dica, revisão) | ★★ | ✅ |
| D3 | Quiz de **texto**: inervação, ação, origem/inserção | ★★★ | ✅ músculos (nervo, ação, origem, inserção, nota) e nervos (músculos, lesão, sensibilidade) |
| D4 | Flashcards com **repetição espaçada** | ★★★ | 🟡 repetição espaçada (SM-2) agenda as estruturas dos quizzes; ainda não há flashcards |
| D5 | Progresso e estatísticas por estrutura | ★★ | ✅ painel de progresso: precisão, pontos fracos, revisões e histórico de rodadas |
| D6 | Favoritos e anotações pessoais | ★★ | ✅ favoritos e anotações por estrutura |
| D7 | Listas de estudo personalizadas (“prova de MMSS”) | ★★ | ✅ listas próprias que alimentam os três quizzes |
| D8 | **Tours / aulas guiadas** | ★★ | 🟡 6 tours (24 passos); textos ainda sem revisão de fontes |
| D9 | Exportar imagem da vista, imprimir ficha | ★★ | ✅ PNG da vista e impressão da ficha |
| D10 | Modo professor: criar e compartilhar quizzes/tours | ★ | ⬜ |

### E. Clínica e função

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| E1 | Movimentos e amplitude por articulação; músculos agonistas/antagonistas | ★★★ | ⬜ |
| E2 | **Dermátomos e miótomos** | ★★★ | ✅ miótomos por segmento (C1–Co1) e dermátomos esquemáticos (sem membro inferior) |
| E3 | Síndromes de lesão nervosa visualizadas (mão em garra, queda do punho…) | ★★ | 🟡 texto |
| E4 | Testes ortopédicos/neurológicos, pontos de palpação, pontos motores | ★★ | ⬜ |
| E5 | Patologias em 3D (fraturas, luxações, hérnias) | ★★ | ⬜ |
| E6 | Anatomia radiológica (RX/TC/RM rotulados) | ★★ | ⬜ |

### F. Plataforma e qualidade

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| F1 | Aplicativo desktop com atualização automática | ★★ | ✅ Windows |
| F2 | **Versão web** hospedada (qualquer sistema, celular, tablet) | ★★★ | ✅ <https://body3d.app> (GitHub Pages); falta medir em aparelho real |
| F3 | Funciona offline como PWA instalável | ★★ | ✅ manifesto, service worker e ícone *maskable*; falta testar a instalação e uma atualização em aparelho real |
| F4 | Acessibilidade: teclado, leitor de tela, contraste, daltonismo | ★★★ | 🟡 |
| F5 | Interface em mais de um idioma (EN/ES) | ★★ | ⬜ |
| F6 | Contas, sincronização, modo turma | ★ | ⬜ (exige backend; ver §9) |
| F7 | Testes automatizados e CI de verificação antes da release | ★★★ (interno) | ✅ `npm test`: catálogo, ferramentas de estudo e fumaça no navegador (por http e por `file://`); a CI roda `npm test` |

## 5. Viabilidade dos dados (o que dá para tirar do BodyParts3D)

Verificado em `tools/isa_element_parts.txt` (≈ 2 900 conceitos): o BodyParts3D cobre o **corpo inteiro**, não só o que o
atlas usa hoje. Há malhas reais para fêmur, tíbia, patela, calcâneo, tálus, glúteos, quadríceps, sartório, gastrocnêmio;
coração, aorta, artérias e veias (cerca de 1 900 elementos de veias), fígado, rins, estômago, pâncreas, baço, cólon,
bexiga, próstata, tireoide, laringe, brônquios, timo, adrenais, hipófise, cerebelo e encéfalo (≈ 116 elementos).
Isso significa que **membros inferiores, vasos e vísceras podem usar o pipeline que já existe** (`fetch_*` → `convert_*`
→ pacote `.js`), em vez de modelagem por código.

O que o BodyParts3D **não** traz (ou traz pouco) e continua sendo modelado por código ou buscado em outra fonte:
**nervos** (só os da órbita), **ligamentos** e cápsulas (poucos, como os do pé e da laringe), **fáscias**, **bursas**,
**linfonodos**, meniscos, músculos pequenos (mímica, laringe, ouvido médio). Os nomes de pulmões e do modelo feminino
precisam ser conferidos no índice antes de prometer. Fontes abertas derivadas do BodyParts3D com mais estruturas
(por exemplo, o projeto Z-Anatomy) são **candidatas a avaliar**, com checagem de licença e de qualidade antes de qualquer
uso (§9).

## 6. Roteiro em fases

Visão geral (a ordem é a recomendada; justificativa abaixo da tabela):

| Fase | Versão | Tema | Tam. | Depende de |
| --- | --- | --- | --- | --- |
| F0 | 2.0.x | Alicerce: testes, CI, web, acessibilidade | M | — |
| F1 | 2.1 | Ferramentas de estudo | G | F0 |
| F2 | 2.2 | Fechar músculos e nervos das regiões atuais | G | F0 |
| F3 | 2.3 | Articulações, ligamentos e movimento | GG | F2 |
| F4 | **3.0** | Membros inferiores e pelve — osteomuscular completo | GG | F3 |
| F5 | 3.1 | Sistema vascular | GG | F4 |
| F6 | 3.2+ | Vísceras e sistemas (um sistema por release) | GG | F5 |
| F7 | 3.x | Sistema nervoso central e órgãos dos sentidos | GG | F5 |
| F8 | contínua | Clínica e correlações | M por lote | F2, F3 em diante |
| F9 | a avaliar | Plataforma estendida (idiomas, turma, apps) | G | F1 |

**Por que esta ordem.** (1) F0 protege tudo o que vem depois: uma release quebrada chega a todos os usuários do `.exe`.
(2) F1 multiplica o valor de qualquer anatomia nova e não depende de dados novos, por isso vem cedo. (3) F2 fecha lacunas
nas regiões que o usuário já pediu “completas” (músculos e nervos) antes de abrir região nova. (4) F3 estabelece o modelo
de articulação/movimento, de que os membros inferiores já dependem. (5) F4 reaproveita ao máximo o pipeline validado e é
a maior lacuna visível (corpo sem pernas). (6) Vasos (F5) vêm antes de vísceras porque acompanham os nervos e entram na
ficha de todo músculo. (7) F7 é a mais pesada em dados e tem menos reaproveitamento. F1 e F8 podem ser intercalados com
as fases de conteúdo para manter o ritmo entre lotes grandes de dados.

---

### F0 — Alicerce (2.0.x) · M

Objetivo: poder evoluir rápido sem quebrar o que já foi entregue.

- [x] **F0.1** `npm test`: script Node que empacota `src/catalog.js` com esbuild e verifica ids únicos, todo músculo com
  nervo, ramos válidos, campos obrigatórios não vazios, todas as camadas existentes, cada nervo com ≥ 1 ramo ou trajeto.
  Receita pronta em `agents.md` §6. **P** ✅
- [x] **F0.2** Teste de fumaça no navegador (abrir, selecionar, entrar e sair do quiz, zero erros no console). **M** ✅
- [x] **F0.3** CI de verificação em pushes na `dev` e em PRs (build + testes, sem release); a release na `main` passa a rodar
  `npm test` antes de publicar. **P** ✅
- [x] **F0.4** Revisão de fontes: tabela estrutura × fonte × status para os 154 músculos e 55 nervos
  (`docs/revisao-conteudo.md`); campo `fontes` opcional na ficha. **G** ✅
- [x] **F0.5** Indicar na ficha se a geometria é “malha real (BodyParts3D)” ou “modelada por código (aproximada)”. **P** ✅
- [x] **F0.6** Versão web no GitHub Pages (workflow próprio) — alcança macOS, Linux, tablet e celular sem novo build. **P** ✅
- [x] **F0.7** PWA: manifesto e service worker para instalar e funcionar offline. **M** ✅
- [x] **F0.8** Acessibilidade e toque: teclado na lista e no quiz, foco visível, `aria-live`, contraste AA, pinça/arrasto no
  celular. **M** ✅
- [x] **F0.9** Linha de base de desempenho (tempo até a 1ª imagem, memória, fps) e regra de carga por pacote. **P** ✅
- [x] **F0.10** Reconferir o mapa de §4 com uma pesquisa atual dos concorrentes e ajustar pesos. **P** ✅

**Saída:** `npm test` e o teste de fumaça verdes no CI; site no ar; toda estrutura com fonte registrada; linha de base anotada.

---

### F1 — Ferramentas de estudo (2.1) · G

Objetivo: transformar o atlas em ferramenta de estudo contínuo, sem depender de dados novos.

- [x] **F1.1** Estado da vista na URL (`#hash`) + botão “copiar link”; vistas nomeadas salvas no navegador. **M** ✅
- [x] **F1.2** Favoritos e anotações por estrutura; exportar/importar tudo em JSON. **M** ✅
- [x] **F1.3** Progresso por estrutura (acertos, erros, última vez), painel de progresso e “Treinar pontos fracos”. **M** ✅ (painel desde 2026-10-07)
- [x] **F1.4** Repetição espaçada (SM-2 simplificado): “Revisão de hoje”. **M** ✅
- [x] **F1.5** Quizzes de texto a partir de campos já existentes: músculo → nervo, nervo → músculos, ação, origem, inserção, nota; nervos por lesão e sensibilidade. **M** ✅ (completo desde 2026-10-07)
- [x] **F1.6** Plano de corte sagital/coronal/axial com controle deslizante e inversão. **M** ✅
- [x] **F1.7** Colorir por: camada · nervo que inerva · região · grupo/compartimento. **P** ✅
- [x] **F1.8** Tours guiados didáticos: manguito rotador; plexo braquial; nervo radial; mastigação e V3; nervo facial e mímica; parede abdominal. **G** ✅
- [x] **F1.9** Exportar PNG da vista; imprimir ficha (CSS de impressão). **P** ✅
- [x] **F1.10** Listas de estudo personalizadas que alimentam o quiz com filtros inteligentes. **M** ✅ (interface das listas só desde 2026-10-07)

**Saída:** tudo funciona offline; dados do usuário exportáveis e restauráveis; nenhuma dependência nova de rede. ✅ Concluído.

> **Correções de 2026-10-07 (ainda dentro da 2.1):** a primeira entrega marcou a fase como concluída com defeitos que o teste de
> fumaça não pegava (ele só chamava a API). Foram corrigidos e agora cobertos por teste de interface: cartões dos tours com
> “undefined”; câmeras dos tours apontando para a altura da cabeça e 6 ids de estrutura inexistentes; coloração apagada ao passar o
> mouse; quiz teórico mostrando a resposta (rótulo) e com respostas ambíguas; listas de estudo sem interface; filtros inteligentes
> só no “Localizar”; regra de ponto fraco que nunca expirava; link copiado quebrado em `file://`; HTML injetável por nome de vista,
> anotação ou backup importado; clique que ignorava o plano de corte. Novos: painel de progresso com histórico, filtro “ainda não
> estudadas”, perguntas “nervo → músculos”, “origem”, “lesão” e “sensibilidade”, estado completo na URL e nas vistas.

---

### F2 — Fechar músculos e nervos das regiões atuais (2.2) · G

Objetivo: cumprir o pedido de “nenhum músculo de fora” e dar aos nervos a parte sensitiva. As listas abaixo foram
conferidas contra os ids do catálogo da v2.0.1; antes de começar, repetir a conferência com a Terminologia Anatômica.

**Músculos que faltam (≈ 45–50):**

- [x] **F2.1** Mão: palmar curto. ✅ (modelado por código; ramo superficial do ulnar)
- [x] **F2.2** Tórax e pescoço: levantadores das costelas (curtos e longos), subcostais, longo do pescoço, escaleno mínimo
  (variável — com nota). ✅ Levantadores e longo do pescoço com malha real (o longo do pescoço espelhado: o banco só tem o
  lado esquerdo); subcostais e escaleno mínimo modelados por código.
- [x] **F2.3** Língua: extrínsecos (genioglosso, hioglosso, estiloglosso, palatoglosso) e intrínsecos (longitudinais
  superior e inferior, transverso, vertical). ✅ Genioglosso e hioglosso com malha real; estiloglosso, palatoglosso e os quatro
  intrínsecos por código, com pontos medidos no dorso e na face inferior da língua (92 a 99 % dentro da malha da língua).
- [x] **F2.4** Palato mole e faringe: levantador e tensor do véu palatino, músculo da úvula, palatofaríngeo; constritores
  superior, médio e inferior, estilofaríngeo, salpingofaríngeo. ✅ Todos com malha real do banco.
- [x] **F2.5** Laringe: cricotireóideo, cricoaritenóideos posterior e lateral, aritenóideos transverso e oblíquo,
  tireoaritenóideo (e vocal). ✅ Todos com malha real (o vocal vem separado no banco). As cartilagens da laringe não estão no modelo.
- [x] **F2.6** Ouvido médio: tensor do tímpano e estapédio. ✅ Por código e intraósseos (o modelo não tem o ouvido médio nem os ossículos).
- [x] **F2.7** Face e olho (pequenos/variáveis, cada um com nota): transverso do mento, incisivos labiais, temporoparietal;
  músculos lisos intrínsecos do olho (ciliar, esfíncter e dilatador da pupila, tarsais). ✅ Por código; os do olho usam um tipo
  novo de forma (`torus`, um anel em torno de um eixo) dentro do globo.
- [x] **F2.8** Períneo e pelve: bulboesponjoso, isquiocavernoso, transversos superficial e profundo do períneo, esfíncter
  externo da uretra, puborretal, obturador interno. ✅ Puborretal e obturador interno com malha real; os do períneo urogenital por
  código. **Achado:** o único “músculo perineal” do banco é o esfíncter externo do ânus em duplicata; a entrada antiga
  `perineo_superficial` mostrava essa malha e foi substituída.
- [x] **Cobertura** (fora da lista original): intertransversários cervicais anteriores e posteriores e interespinais cervicais,
  que o banco tem e a TA lista (malhas reais). Exclusões justificadas: `docs/cobertura.md`.

**Nervos que faltam:**

- [x] **F2.9** Cranianos: olfatório (I), vestibulococlear (VIII), glossofaríngeo (IX), **vago (X)** com laríngeos superior e
  recorrente e ramos faríngeos. ✅ Os 12 pares estão no catálogo. O vago vai só até T4–T5 (o resto exige vísceras); o laço do
  recorrente é aproximado (o modelo não tem aorta nem subclávia).
- [x] **F2.10** Ramos de V e VII ainda ausentes: lacrimal, frontal (supraorbital e supratroclear), nasociliar, zigomático,
  palatinos, nasopalatino, corda do tímpano, petroso maior, nervo do estapédio, nervos do tensor do tímpano e do véu. ✅ Frontal,
  lacrimal e nasociliar usam as malhas reais do banco (o pacote `anatomy-nerves.js` foi regenerado com as peças separadas).
- [x] **F2.11** Autônomos da cabeça e do pescoço: gânglios pterigopalatino, ótico e submandibular; tronco simpático cervical
  e gânglios cervicais (o ciliar já existe). ✅
- [x] **F2.12** Sensitivos do plexo cervical (occipital menor, auricular magno, cervical transverso, supraclaviculares) e
  do **membro superior** (cutâneos medial e posterior do braço e do antebraço, cutâneo lateral do antebraço, ramo superficial
  do radial, ramos cutâneos palmar e dorsal, digitais, intercostobraquial, cutâneo lateral superior do braço). ✅ 18 nervos; os
  que já existiam como trechos dentro de outro nervo (cutâneo lateral do antebraço, ramo superficial do radial, dorsal do ulnar,
  digitais do mediano, cutâneo lateral superior do braço) ganharam ficha própria.
- [x] **F2.13** Medula espinal, raízes, gânglios espinais, 31 pares de nervos espinais e cauda equina (representação
  esquemática) — base para miótomos e dermátomos. ✅ Eixo do canal medido nas vértebras; medula com intumescências e cone, filo
  terminal, quatro fichas para os 31 pares e a cauda equina.
- [x] **F2.14** Campo estruturado `segmentos` (ex.: `['C5','C6']`) em músculos e nervos → **mapa de miótomos** e filtro
  “músculos do segmento C7”. ✅ `src/segments.js` (132 músculos e 58 nervos/estruturas), linha “Segmentos medulares” na ficha, guarda no
  catálogo (todo músculo inervado por nervo espinal tem segmentos), modo de cor *Por segmento medular* com lista do miótomo e
  `docs/miotomos.md`.
- [x] **F2.15** **Dermátomos** sobre a pele (spike de 1 dia para decidir entre faixas esquemáticas pintadas na malha da pele ou
  textura; documentar a decisão). ✅ Decisão: cor de vértice (`docs/dermatomos.md`); cabeça (V1–V3, C2–C3), pescoço, tronco e
  membro superior, esquemáticos.

**Saída:** cada músculo da cabeça, pescoço, tronco e membro superior previsto na TA tem entrada, ou exclusão justificada em
`docs/cobertura.md`; todos os pares cranianos presentes; guardas continuam exigindo nervo para todo músculo. ✅ Concluído em
2026-10-09; publicada como 2.2 em 2026-10-10.

---

### F3 — Articulações, ligamentos e movimento (2.3) · GG

Objetivo: a camada de **função**. Quebrar em F3a (modelo + membro superior), F3b (coluna, tórax, pelve, cabeça) e F3c (movimento).

- [ ] **F3.1** Novo `kind: 'articulacao'` com ficha: tipo, superfícies articulares, cápsula, ligamentos, movimentos e
  amplitude, músculos motores, inervação e irrigação, notas clínicas. Guarda: toda articulação cita ≥ 2 ossos existentes. **M**
- [ ] **F3.2** Articulações e ligamentos do **membro superior**: esternoclavicular, acromioclavicular (coracoclavicular),
  glenoumeral (glenoumerais, coracoumeral, coracoacromial), cotovelo (colaterais, anular), radiulnares (membrana
  interóssea), radiocarpal e carpais, carpometacarpais, metacarpofalângicas e interfalângicas. **G**
- [ ] **F3.3** Coluna e tórax: ligamentos longitudinais anterior e posterior, amarelo, interespinal, supraespinal, nucal,
  atlantoccipital e atlantoaxiais, costovertebrais e radiados. **M**
- [ ] **F3.4** Pelve: sacroilíacos, sacrotuberal, sacroespinal, inguinal, pubianos. **M**
- [ ] **F3.5** Campo estruturado `acoes` nos músculos: `{articulacao, movimento, papel: agonista|sinergista|antagonista|fixador}`
  → página “Movimentos”, filtro “movimento → músculos”, quiz “que músculos realizam X”. **G**
- [ ] **F3.6** **Origem e inserção desenhadas no osso** (áreas coloridas nas superfícies de origem/inserção) e acidentes
  ósseos selecionáveis (tuberosidade deltóidea, sulco intertubercular…). Dados: pontos e regiões em `landmarks.js`. **GG**
- [ ] **F3.7** Bursas, bainhas sinoviais, retináculos dos extensores, aponeurose palmar, fáscia toracolombar. **M**
- [ ] **F3.8** Spike: animação de movimento por segmentos rígidos (ombro, cotovelo, punho) — decidir viabilidade antes de
  prometer; se inviável, mostrar o movimento por poses predefinidas (antes/depois). **M**
- [ ] **F3.9** Quizzes de função: “que ligamento limita…?”, “qual a amplitude de…?”. **P**

**Saída:** toda articulação sinovial do membro superior e da coluna tem ficha, ligamentos e movimentos; filtro de músculos
por movimento funcionando; origem/inserção visíveis no osso para os músculos do membro superior.

---

### F4 — Membros inferiores e pelve (**3.0**, osteomuscular completo) · GG

Objetivo: corpo inteiro com ossos, músculos, nervos, articulações e ligamentos. Quebrar em quatro lotes, cada um entregável.

- [ ] **F4.1** Pipeline: estender `tools/body_parts.py` (peças por nome de conceito) e rodar `fetch_body.py`/`convert_body.py` para o membro inferior; novo pacote
  `dist/anatomy-leg.js` carregado em segundo plano (orçamento: ≤ +8 MB; decimar mais se preciso). Nova região
  “Membro inferior” em `REGIONS`, no quiz e nos botões. **M**
- [ ] **F4.2** Lote A — **quadril e coxa**: ossos (fêmur, patela, quadril já existe), glúteos (máximo, médio, mínimo), tensor da
  fáscia lata, piriforme, gêmeos superior e inferior, obturadores, quadrado femoral, sartório, quadríceps (reto femoral e três
  vastos), articular do joelho, pectíneo, adutores (longo, curto, magno), grácil, isquiotibiais (bíceps femoral, semitendíneo,
  semimembranáceo), psoas e ilíaco já presentes. **G**
- [ ] **F4.3** Lote B — **perna**: tíbia, fíbula, compartimentos anterior, lateral e posterior (tibial anterior, extensores longo
  dos dedos e do hálux, fibular terceiro, fibulares longo e curto, gastrocnêmio, sóleo, plantar, poplíteo, tibial posterior,
  flexores longo dos dedos e do hálux). **G**
- [ ] **F4.4** Lote C — **pé**: tarso, metatarso, falanges; músculos intrínsecos dorsais e plantares (extensores curtos,
  abdutores, flexores curtos, quadrado plantar, lumbricais, adutor do hálux, interósseos); aponeurose plantar. **G**
- [ ] **F4.5** Lote D — **nervos**: completar femoral (ramos musculares e cutâneos), obturatório, glúteos superior e inferior,
  ciático (tibial e fibular comum → fibulares superficial e profundo), tibial e seus ramos plantares, cutâneo sural, safeno,
  cutâneo femoral lateral e posterior, genitofemoral, plexos lombar e sacral completos; dermátomos de L1–S2. **GG**
- [ ] **F4.6** Articulações e ligamentos do membro inferior: quadril (iliofemoral, pubofemoral, isquiofemoral, ligamento da
  cabeça do fêmur), joelho (cruzados, colaterais, meniscos, patelar), tornozelo, subtalar, arcos do pé. **G**
- [ ] **F4.7** Atualizar guardas (todo músculo com nervo e com `acoes`), contagens do README e quizzes por região. **P**

Estimativa de escala: ≈ 60–70 músculos (conforme a divisão em cabeças/ventres), 7–9 grupos ósseos, ≈ 20 nervos, ≈ 15
ligamentos principais.

**Saída (marco 3.0):** todos os músculos esqueléticos principais do corpo têm nervo; ossos e articulações do corpo inteiro; o
`.exe` continua dentro do orçamento de §3.5.

---

### F5 — Sistema vascular (3.1) · GG

- [ ] **F5.1** Artérias e veias principais com malhas reais do BodyParts3D (confirmar nomes FMA e decimar); camadas “Artérias” e
  “Veias”, cores convencionais. **G**
- [ ] **F5.2** Ficha de vaso: origem, trajeto, ramos, território irrigado/drenado, relações, pulsos e pontos de compressão. **G**
- [ ] **F5.3** Campo **Irrigação** na ficha de todos os músculos + mapa `IRRIGATION` (como `INNERVATION`) + guarda “todo
  músculo tem ≥ 1 artéria”. **G**
- [ ] **F5.4** **Feixes neurovasculares** como conjunto selecionável (axilar, braquial, femoral, poplíteo, tibial posterior…). **M**
- [ ] **F5.5** Linfonodos regionais principais e ducto torácico (modelagem por código; BodyParts3D não os tem). **G**
- [ ] **F5.6** Quizzes de vasos e “o que irriga isto?”. **P**

**Saída:** cada músculo com irrigação; vasos de todas as regiões já cobertas; linfáticos principais.

---

### F6 — Vísceras e sistemas (3.2 em diante) · GG, uma release por sistema

Ordem sugerida, cada sistema com camada, fichas, inervação autonômica, vasos e quiz:

- [ ] **F6.1** Tórax: coração (câmaras, valvas, coronárias), pulmões e pleuras, traqueia e brônquios, timo, mediastino.
- [ ] **F6.2** Abdome: esôfago, estômago, intestinos, fígado e vias biliares, pâncreas, baço, peritônio e mesentérios.
- [ ] **F6.3** Urinário e endócrino: rins, ureteres, bexiga, uretra; suprarrenais, tireoide e paratireoides, hipófise.
- [ ] **F6.4** Genital masculino e feminino, períneo, canal inguinal (cremaster, cordão espermático). Conferir se o
  BodyParts3D tem modelo feminino utilizável; se não, decidir por esquema ou fonte externa (§9).
- [ ] **F6.5** Regiões e espaços clínicos: triângulos do pescoço, fossa axilar e cubital, canal do carpo, trígono femoral,
  fossa poplítea (A12).

**Saída por release:** o sistema completo, com guardas e links (nervo, vaso, região), dentro do orçamento de dados.

---

### F7 — Sistema nervoso central e órgãos dos sentidos · GG

- [ ] **F7.1** Encéfalo: lobos e giros principais, tálamo, núcleos da base, tronco encefálico, cerebelo, ventrículos;
  medula espinal e meninges; seios venosos e polígono de Willis (liga a F5).
- [ ] **F7.2** Núcleos e origem aparente dos nervos cranianos, ligados às fichas dos nervos (F2).
- [ ] **F7.3** Vias principais (motora, sensitiva, visual, auditiva) como esquemas.
- [ ] **F7.4** Olho em detalhe (túnicas, câmaras, retina) e ouvido (externo, médio com ossículos, interno).

---

### F8 — Clínica e correlações (contínua)

Lotes pequenos que entram assim que a anatomia de base existe: síndromes de lesão nervosa com pose/animação, testes
ortopédicos e neurológicos, pontos de palpação, anatomia de superfície, patologias em 3D (fraturas, luxações), imagens
radiológicas rotuladas de fontes de licença aberta, casos clínicos curtos, galerias de histologia e embriologia.
Cada lote cita fonte e licença no próprio dado.

### F9 — Plataforma estendida (a avaliar)

Inglês e espanhol; modo professor/turma sem backend (quiz e tour compartilhados por arquivo/URL); aplicativo móvel
empacotado; builds para macOS/Linux; assinatura de código do `.exe`; só considerar contas e sincronização depois de decidir
o backend (§9).

## 7. Como executar cada fase (ciclo padrão)

Para **qualquer** estrutura nova, nesta sequência:

1. **Levantar** a lista na Terminologia Anatômica e nas referências; registrar em `docs/cobertura.md` (inclui o que ficou de fora e por quê).
2. **Geometria:** malha real do BodyParts3D (pipeline `tools/`) ou procedural (`proc`, `nerve-geo`); medir pontos no próprio modelo.
3. **Catálogo e textos** nos campos padrão; fontes na `nota`/`fontes`; divergências explícitas.
4. **Vínculos:** nervo, vaso, articulação, ação (cada novo vínculo vira mapa derivado + guarda).
5. **Guardas e testes** (`npm test`); atualizar a lista de ids esperados.
6. **QA visual** por região: capturas com e sem camadas, `window.__app`, console limpo, métrica “fora do osso”.
7. **Docs e release:** README (contagens, fontes), este arquivo (status), `dev` → `main` somente com a fase/lote aprovado.

**Definição de pronto** de um lote: catálogo carrega sem erro; testes verdes; verificação visual feita em ≥ 3 vistas;
nenhum aviso novo no console; tamanho dos dados dentro do orçamento; README e `project_context.md` atualizados;
atribuição de licença intacta.

**Ritmo sugerido:** alternar um lote de conteúdo (F2–F7) com um lote de ferramenta (F1/F8) evita meses sem entrega
visível e mantém o retorno do usuário frequente. Cada lote = um ciclo `dev` → verificação → `main`.

## 8. Medição do ritmo (preencher ao concluir lotes)

| Lote | Itens entregues | Esforço real | Tamanho previsto | Observações |
| --- | --- | --- | --- | --- |
| 2.0 (nervos + atualização automática) | 55 nervos, 154 vínculos, exe auto-atualizável | — | — | referência: um grande lote contínuo |
| 2.0.x (Fase F0 — Alicerce) | F0.1 a F0.10 concluídos (testes, CI, web, PWA, a11y, docs) | ~1 dia | M | Alicerce 100% verde; zero quebras |
| 2.1.0 (Fase F1 — Ferramentas de estudo) | F1.1 a F1.10 (views/hash, favoritos/notas, SM-2, quiz teórico, clipping, cores, 6 tours, export, listas) | ~1 dia + ~1 dia de correções | G | 100% offline; modularizado em src/study/*. A 1ª entrega passou nos testes mas tinha defeitos de interface (ver correções em F1): teste que só chama a API não basta; o de fumaça agora dirige a interface |
| 2.2 (Fase F2 — Fechar músculos e nervos) | F2.3 a F2.15: 44 músculos novos (204), 45 nervos novos (100) e a medula espinal, segmentos medulares, miótomos e dermátomos | ~1 dia de trabalho contínuo | G | Os músculos com malha real saíram do pipeline sem decimar demais; o que não tinha malha foi medido no modelo. O banco tem o “músculo perineal” só como duplicata do esfíncter do ânus: foi preciso modelar o períneo urogenital. Tempo gasto sobretudo em medir (tongue, canal vertebral, mão, órbita) e em textos com fonte. |
| *(próximo: F3 — Articulações, ligamentos e movimento)* | | | | |

Use a coluna “Observações” para anotar o que atrasou (ex.: geometria de nervo que cai dentro do osso, ajuste de decimação).

## 9. Riscos e decisões em aberto

1. **Release quebrada chega a todos.** O atualizador apaga as versões antigas (`RemoveOldVersions`), então não há volta
   local. Mitigação: F0.2/F0.3; se necessário, um canal de pré-lançamento opcional.
2. **Tamanho dos dados.** 11,6 MB hoje; membro inferior soma cerca de 7 MB, vísceras e encéfalo mais. Opções: decimar mais,
   pacotes por região carregados sob demanda, ou pacotes opcionais baixados pelo atualizador. *Decidir antes da F4.*
3. **Geometria procedural.** Nervos e ligamentos são aproximações. Avaliar fontes abertas com mais estruturas (Z-Anatomy
   e similares) **só após checar licença (compatibilidade com CC BY-SA 2.1 JP) e qualidade**; não assumir.
4. **Modelo feminino e variações.** Pode não existir no BodyParts3D; decidir entre esquema, outra fonte ou não cobrir.
5. **Direitos de texto e imagem.** Textos próprios a partir das referências; imagens de terceiros (radiologia, histologia)
   só de bancos com licença aberta, com crédito no dado.
6. **Backend para contas/turmas.** Quebra o princípio offline-first. Preferir arquivos/URLs estáticos até haver necessidade real.
7. **Assinatura do `.exe`.** O SmartScreen avisa; certificado tem custo. Decidir se vale na F9.
8. **`main.js` com ~1 500 linhas.** Features novas (F1) devem sair em módulos (`src/study/*`, `src/tours/*`), não inflar o arquivo.
9. **Conferência de fatos anatômicos.** Número de músculos, segmentos medulares e nomenclatura variam entre fontes; toda
   divergência vai para a ficha. A revisão da F0.4 existe para isso.
10. **Service worker e HTML.** `sw.js` serve do cache e atualiza em segundo plano; uma atualização que mude o `index.html` e o
    `dist/app.js` ao mesmo tempo pode, se um dos dois falhar ao baixar, deixar a versão web com HTML novo e script velho (ou o contrário).
    Mitigado em 2026-10-07: o deploy do Pages passa a versionar o `CACHE_NAME` a cada execução (`docs/publicacao-web.md`); falta testar uma atualização real.
11. **Textos dos tours** sem revisão de fontes; o plano de corte não desenha a superfície da fatia (as malhas são cascas).

## 10. Registro de decisões e andamento

| Data | Registro |
| --- | --- |
| 2026-10-05 | Roteiro criado. Ordem recomendada: F0 → F1 → F2 → F3 → F4 (3.0) → F5 → F6 → F7, com F8/F9 em paralelo. |
| 2026-10-04 | **v2.0.1** publicada: 55 nervos ligados aos 154 músculos; `.exe` com atualização automática (testada de 2.0.0 para 2.0.1); repositório público `KaueChristian/3DBody` (`main` publica, `dev` não). |
| 2026-10-05 | Pendência de ordem a confirmar com o responsável pelo projeto: vasos (F5) antes ou depois de vísceras (F6)? Padrão adotado: vasos antes. |
| 2026-10-06 | **Fase F0 (Alicerce) concluída integralmente (F0.1 a F0.10)**: `npm test` implementado com validação em memória do catálogo (F0.1) e teste de fumaça headless via CDP com zero erros de console (F0.2); CI configurado no GitHub Actions em `dev`/PRs e verificação antes de release (F0.3); auditoria bibliográfica de todas as 209 estruturas em `docs/revisao-conteudo.md` e suporte a `fontes` na ficha (F0.4); distinção visual entre malha real do BodyParts3D e modelada por código (F0.5); workflow para GitHub Pages (F0.6); suporte a PWA com `manifest.webmanifest`, `sw.js` offline e ícones (F0.7); acessibilidade ampliada com teclado na lista/quiz, foco visível e toque (F0.8); linha de base de desempenho documentada em `docs/desempenho.md` e medições em `window.__app.perf` (F0.9); mapa competitivo atualizado em `docs/concorrentes.md` (F0.10). |
| 2026-10-06 | **Fase F1 (Ferramentas de Estudo — v2.1.0) concluída integralmente (F1.1 a F1.10)**: Arquitetura modular isolada em `src/study/` preservando a manutenibilidade do `main.js`. Estado em URL hash e compartilhamento (F1.1); favoritos, notas e exportação/importação JSON (F1.2); rastreamento de progresso e treino de pontos fracos (F1.3); repetição espaçada SM-2 para revisão diária (F1.4); quiz teórico com perguntas conceituais de inervação, ação motora e correlações clínicas (F1.5); planos de corte anatômico sagital, coronal e axial com slider e inversão (F1.6); modos de coloração por camada, nervo inervador, região e grupo muscular funcional (F1.7); 6 tours guiados didáticos passo a passo com câmera e dissecação automáticas (F1.8); exportação de captura em PNG e layout de impressão de fichas (F1.9); listas de estudo customizadas integradas ao quiz via filtros inteligentes (F1.10). `smoke_test.js` ampliado cobrindo todas as ferramentas com 100% de sucesso e zero erros no console. |
| 2026-10-07 | **Correções da F1** (sem publicar; `dev`): tours (cartões, ids, câmera por vista + enquadramento da estrutura, textos), coloração (cor via `applyHighlight`, legenda, grupos explícitos em `groups.js`), quiz teórico como modo de quiz de verdade (rótulos ocultos, respostas únicas, 8 tipos de pergunta, quantidade e filtro), filtros inteligentes nos 3 quizzes (+ “ainda não estudadas” e listas), interface das listas, painel de progresso com histórico, regra de ponto fraco pela janela das últimas 5 respostas, hash e vistas com camadas/ocultos/corte/cores/rótulos, link correto em `file://`, escape de HTML e validação do backup importado, clique respeitando o corte. Testes: `test_catalog.js` (tours e grupos), novo `test_study.js` (≈ 10 700 verificações) e `smoke_test.js` dirigindo a interface (também com `SMOKE_FILE=1`). Contagem correta dos tours: **24 passos** (o registro de 2026-10-06 dizia 22). |
| 2026-10-07 | **Decisão: mobile (Android, HarmonyOS e outros) = site/PWA no GitHub Pages**, sem app nativo por ora. Motivos, o que já existe, o que foi ajustado (`pages.yml` versiona `version.js` e o cache do service worker) e os passos pendentes (ativar Pages, medir em aparelhos reais, passe de usabilidade) em `docs/publicacao-web.md`. Publicar exige push na `main`, que também gera release do `.exe`: só com autorização. |
| 2026-10-07 | **Identidade visual:** logo escolhido (opção A do canvas “Body3D — Logo”, com o traço do B virando um osso) aplicado na barra lateral, favicon SVG, ícones PWA (incluindo `maskable`) e ícone do `.exe`; nome de tela **Body3D** (provisório). Lançador, nome do `.exe` e do repositório inalterados. |
| 2026-10-07 | **Paleta da interface migrada para a identidade:** `--accent` coral → verde-água `#2DD4BF` (e `--accent-soft`), fundos para a família azul-marinho (`--bg #0B1220`, `--panel #0F1828`, `--panel-2 #162033`, sobreposições e gradiente do palco), texto de botão `#04211D`; erro continua vermelho (`#ff5d6c`, antes quase igual ao acento) e “acertou” passou a `#86D36B` para não se confundir com o verde-água (também o realce 3D de acerto). Títulos de ficha, modais e placar mantêm a **serifa** por decisão. Cores anatômicas (camadas, regiões, grupos) inalteradas. Pendente: janela do `.exe` (Windows Forms) e fonte Sora embutida, se um dia o wordmark for tipografado igual ao logo. |
| 2026-10-07 | **Site no ar:** GitHub Pages ativado e publicado (release **v2.1.2** do `.exe` no mesmo push; CI passou a usar Node 22, pois o teste de fumaça precisa do `WebSocket` global). Domínio **body3d.app** (Name.com) apontado por DNS e configurado no Pages; HTTPS válido, `www` redireciona. Pendente: marcar *Enforce HTTPS* no Pages (o `http://` ainda não redireciona), medir em aparelhos reais e decidir a renovação do domínio. Detalhes em `docs/publicacao-web.md`. |
| 2026-10-07 | **Celular e tablet (correção):** no iPhone a gaveta da lista cobria a tela e não havia como fechá-la (o botão de abrir ficava por baixo dela e nada fechava). Agora há botão ×, toque no fundo escurecido, deslizar para a esquerda e Esc; a gaveta fecha ao escolher uma estrutura; `visibility` evita foco em gaveta fechada. Referência mínima **iPhone 11 (414×896)**, também deitado (896×414, por altura ≤ 520 px) e tablets em pé até 11,5" (834×1194); de 861 a 1100 px a lista fixa encolhe para 300 px. Áreas seguras (`env(safe-area-inset-*)`), campos com 16 px em telas de toque (evita o zoom do Safari) e alvos de toque ≥ 40–48 px. Teste de fumaça agora emula os três tamanhos (abrir, fechar por 4 caminhos, rolagem horizontal, tamanho dos botões). **Botão “Baixar para Windows (.exe)”** (canto inferior direito) só no site em https, em Windows desktop, fora do PWA instalado e dispensável; nunca no `.exe` (que abre por `file://`) nem no celular. |
| 2026-10-07 | **Tablet 2200×1440 (229 ppi) e rolagem da gaveta (correção):** (1) no toque só a `<ul>` da lista rolava; busca, dissecação e os 15 chips (maiores no toque) ocupavam ~60 % da gaveta e arrastar sobre eles não fazia nada — no tablet deitado a lista começava abaixo da tela. Agora tudo abaixo da marca rola junto (`.side-scroll`), a marca e o × ficam fixos, o controle de dissecação usa `touch-action: pan-y` e deslizar só fecha a gaveta se o gesto for francamente horizontal. (2) No tablet (≈ 1100×720 e 720×1100 em CSS no DPR 2; 1467×960 no 1,5) os controles passavam por cima do rodapé de licença, a ficha cobria Perfil E/Costas e, em pé, vistas, controles e o aviso “Montando…” se sobrepunham. Controles, chip do corte, legenda, aviso do .exe e rodapé agora ficam numa base flexível (`.dock`, `wrap-reverse`: sem espaço o rodapé sobe), a ficha começa abaixo da barra de vistas, a pilha do topo da gaveta foi refeita (vistas na linha do ☰ a partir de 760 px), celular deitado tem ficha lateral, e quiz e tour têm altura máxima. Teste de fumaça: gesto de toque real (CDP) sobre os chips em 4 tamanhos e verificação de sobreposição/saída da tela em 9 tamanhos (celular e tablet, em pé e deitado, com ficha, legenda e corte); as transições ficam desligadas nessa parte (no Windows o Chrome sem janela não as anima e o teste falhava já antes). |
| 2026-10-08 | **F2.1 e F2.2 concluídas (160 músculos, 277 estruturas):** palmar curto, levantadores curtos e longos das costelas, subcostais, longo do pescoço e escaleno mínimo, todos com inervação e grupo. Malha real para levantadores (os dois lados no banco) e longo do pescoço (só o lado esquerdo no banco: `mirror=True` no `body_parts.py`); palmar curto, subcostais e escaleno mínimo por código, com pontos medidos no modelo (subcostais com ~1 % dos pontos dentro de osso). Pipeline ganhou `fetch_body.py <ids>` e `convert_body.py --append <ids>`, que acrescentam peças ao `anatomy-body.js` sem regenerar as outras (conferido: as 186 peças antigas ficaram idênticas byte a byte; pacote +274 KB, sem decimação para não abrir buracos nas lâminas finas). O escaleno mínimo recebe o ramo da raiz C7 do plexo braquial (vindo do plexo cervical, o ramo descia por dentro dos processos transversos). Divergências na nota: ação dos subcostais e peso respiratório dos levantadores (Moore × Gray’s); a malha dos levantadores longos cobre todo o tórax, embora o Gray’s os descreva sobretudo embaixo. `tools/gen_revisao.js` passou a contar as estruturas em vez de números fixos. |
| 2026-10-08 | **Bateria de testes (navegador e Node) e correções:** todas as 277 fichas abertas (título, campos, chips de ligação, malha sem NaN), 4 regiões × 7 níveis de dissecação, busca, ida e volta do hash, coloração e corte, “Isolar”, os três quizzes jogados pela interface (placar, resultado, opções únicas, nome não vaza) e lint de texto do catálogo. **Corrigido:** (1) selecionar estrutura par distal ou da pelve enquadrava o meio do corpo (o alvo usava o centro das duas mãos e era puxado 10 % para a cabeça): agora usa a esfera só do lado escolhido — 19 → 1 estrutura mal enquadrada (a pele inteira); (2) lumbricais atravessavam a articulação metacarpofalângica (40 % dos pontos dentro de osso → 3 %), com novos pontos da mão `neck.lumb` e `base.rad`; (3) quiz teórico: “inervado pelo nervo Nervo …”, “o músculo Intercostais…” e aspas dentro de aspas; (4) grafia: “ramos dorsais dos nervos espinhais” → “ramos posteriores dos nervos espinais” (20 fichas) e “supraespinhal” → “supraespinal” nos tours. **Achados sem correção (exigem refazer geometria com cuidado anatômico):** estruturas por código com muita interseção com osso — ligamento temporomandibular 56 %, pterigóideo lateral 34 %, ligamento alar 24 %, orbicular da boca 20 %, esfenomandibular 16 %, multífido 15 %; busca sem sinônimos (“flexiona” × “flete”); `hid=` do hash cresce sem limite quando se ocultam muitas estruturas uma a uma. |
| 2026-10-08 | **Levantamento de desempenho no celular** (`docs/otimizacao-mobile.md`, medido com o novo `tools/perf_mobile.js`): 1,82 mi de triângulos, 492 chamadas de desenho, `DoubleSide` e PBR com 5 luzes em tudo, e o laço redesenha 60 quadros/s mesmo parado. Num celular emulado (CPU 4×) o modelo fica pronto em 19 s, 10 deles montando os nervos; só não redesenhar com a tela parada leva a 13 s. Plano em três levas: sem perda (renderização sob demanda, resolução adaptativa, nervos mais leves, sem leitura de layout no laço), sem perda com mais trabalho (faces orientadas + `FrontSide`, −45 % por quadro; nervos pré-calculados; corpo sob demanda; materiais leves) e com redução de resolução (pacote de malhas leve). Nada implementado ainda. |
| 2026-10-09 | **F2 concluída (F2.3 a F2.15); publicada como 2.2 em 2026-10-10 após a última validação de layout (ver a linha seguinte).** 367 estruturas: 204 músculos (+44), 100 nervos e gânglios (+45) e a medula espinal. **Músculos:** língua (8), palato mole e faringe (9), laringe (7), ouvido médio (2), face e olho (9), períneo e pelve (7), mais 3 músculos curtos da coluna cervical que a TA lista e o banco tem; os 3 grupos oral/faríngeo/laríngeo e o puborretal e o obturador interno com malha real (`tools/body_parts.py` + `fetch_body.py` + `convert_body.py --append`; pacote +0,85 MB); o resto por código, medido no modelo. **Achado:** o único “músculo perineal” do BodyParts3D é o esfíncter externo do ânus em duplicata; a entrada `perineo_superficial` foi removida (o id continua no pacote de dados, sem uso). **Nervos:** 12 pares cranianos completos, vago com plexo faríngeo e laríngeos, ramos de V e VII, gânglios autônomos e tronco simpático, 18 nervos sensitivos (os que eram trechos dentro de outro nervo ganharam ficha), medula, 4 fichas dos 31 pares espinais e cauda equina. O pacote de nervos da órbita foi regenerado com as peças separadas (oftálmico, frontal, lacrimal, nasociliar). **F2.14:** `src/segments.js` com os segmentos (132 músculos, 58 nervos/estruturas), linha na ficha, guarda no catálogo, modo de cor e lista do miótomo, `docs/miotomos.md` gerado. **F2.15:** dermátomos por cor de vértice (decisão e limites em `docs/dermatomos.md`). Nova forma procedural `torus`. Cobertura e exclusões: `docs/cobertura.md`. Divergências entre fontes (Moore, Gray’s, Netter) anotadas nas fichas: inervação do feixe lateral dos intertransversários posteriores, limite radial/ulnar no dorso da mão (2½+2½ × 3½+1½), psoas L1–L3 × L2–L4, plexo faríngeo (vago × acessório craniano), vocal como parte do tireoaritenóideo. **Pendências:** os músculos intrínsecos da língua, os do ouvido médio e os lisos do olho são esquemáticos (e os dois últimos grupos, intraósseos ou dentro do globo); as cartilagens da laringe, a glândula lacrimal e os ossículos não estão no modelo; o teste de interface agora cobre o modo por segmento, os dermátomos e as estruturas novas, mas as bordas dos dermátomos não são testadas visualmente. |
| 2026-10-10 | **Validação final da F2 e publicação (2.2):** varredura de layout no navegador embutido em 13 tamanhos (celulares de 568×320 a 430×932, em pé e deitados, com toque emulado; tablets de 768×1024, 834×1194 e 1194×834 e desktop de 1024×768 a 1920×1080, sem toque emulado, que essa ferramenta só liga abaixo de 768 px) com fichas longas (medula, vago, facial, nasociliar, masseter, língua, obturador interno, cauda equina), legendas por segmento e dos dermátomos, modal de estudo em todas as abas (inclusive o painel de segmentos com 32 chips) e configuração do quiz: nenhuma sobreposição, nada fora da tela, sem rolagem horizontal. O teste de fumaça passou a conferir também, nos 9 tamanhos de toque (celular e tablet, em pé e deitado), a legenda por segmento, os dermátomos ligados e o painel de segmentos dentro do modal. A bateria que seleciona as 367 estruturas, percorre 4 regiões × 7 níveis de dissecação, a busca e o hash só acusou os dois limites de busca já conhecidos (“ulnar” e “flexiona” dentro da região cabeça, sem sinônimos). `npm test` e `SMOKE_FILE=1 npm run test:smoke` verdes. Versão do `package.json` 2.1 → 2.2. Não medido: desempenho na máquina de referência (`docs/desempenho.md` §1.4). |


## 11. Referências

- Moore, Dalley & Agur — *Anatomia orientada para a clínica*.
- Standring (ed.) — *Gray's Anatomy*; Netter — *Atlas de anatomia humana*; Sobotta — *Atlas de anatomia humana*.
- *Terminologia Anatomica* (FIPAT, 2ª ed.) e a *Terminologia Anatômica* em português da Sociedade Brasileira de Anatomia.
- Kendall et al. — *Músculos: provas e funções* (miótomos, testes); Kapandji — *Fisiologia articular* (movimentos).
- BodyParts3D, © DBCLS, CC BY-SA 2.1 Japão — <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/>.
