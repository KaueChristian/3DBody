# Anatomia 3D — contexto e roteiro do projeto

> Documento-guia do ritmo e da **ordem** do desenvolvimento. Lê-se de cima para baixo: §1–§3 dão o contexto, §4–§5 mapeiam
> o que sites de estudo de anatomia costumam ter e onde estamos, §6 é o roteiro em fases, §7–§9 dizem como e com que cuidado
> executar. Revisão inicial: 2026-10-05, sobre a versão **2.0.1**. **Reordenado em 2026-10-12** (corpo inteiro e sistemas do
> cronograma da disciplina primeiro; aprofundamentos em [`docs/pontos-de-melhoria.md`](docs/pontos-de-melhoria.md)).
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
| A1 | Ossos individuais com **acidentes ósseos** (forames, processos, tuberosidades) selecionáveis | ★★★ | 🟡 52 ossos/cartilagens/grupos (corpo inteiro + cartilagens da laringe); acidentes só como pontos internos |
| A2 | Articulações (tipo, movimentos, cápsula) | ★★★ | 🟡 13 do membro superior (F3a), com cápsula esquemática; faltam coluna, tórax, pelve, cabeça e membro inferior (F4.6) |
| A3 | Ligamentos | ★★★ | 🟡 29 (10 na cabeça, linha alba, retináculo dos flexores, 16 do membro superior e membrana interóssea da perna) |
| A4 | Músculos esqueléticos | ★★★ | ✅ 255 (101 cabeça/pescoço, 54 tronco, 49 membro superior, 51 membro inferior); faltam só 3 sem malha no banco (M14) |
| A5 | Nervos (cranianos, espinais, plexos, ramos) | ★★★ | ✅ 112 nervos e gânglios (corpo inteiro): os 12 pares, plexos, sensitivos do membro superior e do pescoço, autônomos da cabeça, nervos motores do membro inferior; faltam os cutâneos do membro inferior (M09) e os das vísceras (M22) |
| A6 | Artérias e veias | ★★★ | ✅ 111 artérias e 56 veias (F5): aorta, pulmonares, cavas, ázigo, carótidas (com a externa e ramos por código), círculo arterial do cérebro, tronco celíaco, mesentéricas, sistema porta, ilíacas (com ramos por código), membros superior e inferior |
| A7 | Sistema linfático (linfonodos, ducto torácico) | ★★ | ✅ 15 estruturas por código (cisterna do quilo, ductos torácico e linfático direito e 12 grupos de linfonodos) |
| A8 | Vísceras: respiratório, digestório, urinário, genital, endócrino, coração | ★★★ | 🟡 coração (14 estruturas + pericárdio, F5), respiratório (5 lobos pulmonares do HRA, traqueia, 22 brônquios e pleuras, F6.1) e digestório (34 estruturas do esôfago ao canal anal, fígado em 8 segmentos, vias biliares, pâncreas, baço e mesos, F6.2) ✅; demais sistemas na F6.3+ |
| A9 | Sistema nervoso central (encéfalo, medula, meninges, ventrículos) | ★★★ | 🟡 medula espinal e cauda equina (esquemáticas); sem encéfalo e meninges |
| A10 | Órgãos dos sentidos (olho, ouvido, nariz, língua) | ★★ | 🟡 globo ocular com músculos lisos, 6 extraoculares, língua e seus 8 músculos, músculos do ouvido médio (sem ossículos) |
| A11 | Fáscias, compartimentos, bursas, bainhas sinoviais, retináculos | ★★ | 🟡 3 fáscias da cabeça + retináculo dos flexores |
| A12 | Regiões e espaços clínicos (triângulos do pescoço, fossa cubital, canal do carpo, canal inguinal) | ★★ | 🟡 20 feixes neurovasculares (bainha carótica, axila, sulco do nervo radial, espaço quadrangular, trígono femoral, fossa poplítea…); demais regiões em M25 |
| A13 | Pele e anexos; anatomia de superfície | ★★ | 🟡 pele inteira translúcida, com dermátomos esquemáticos (até o membro superior) e projeção do coração e focos de ausculta |
| A14 | Histologia e embriologia | ★ | 🟡 circulação fetal (placenta e cordão do HRA, vasos umbilicais, ducto venoso e ligamento arterial); sem histologia |
| A15 | Variações (sexo, idade, anatomia comparada de variações comuns) | ★ | 🟡 variações anatômicas frequentes descritas nas notas das fichas |

### B. Visualização e navegação

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| B1 | Camadas / dissecação progressiva | ★★★ | ✅ |
| B2 | Mostrar, ocultar e **isolar** estruturas | ★★★ | ✅ |
| B3 | Rótulos com linhas de chamada; câmera que enquadra a seleção | ★★★ | ✅ |
| B4 | Vistas predefinidas e opacidade da pele | ★★ | ✅ |
| B5 | Salvar/compartilhar uma vista (câmera + camadas + seleção) | ★★ | ✅ vistas salvas e link com `#hash` (região, dissecação, camadas, câmera, corte, cores, seleção) |
| B6 | **Plano de corte** (sagital, coronal, axial) | ★★ | 🟡 plano sagital/coronal/axial ✅; a fatia não é “tampada” (as malhas são cascas) |
| B7 | Colorir por sistema, nervo que inerva, ação ou grupo | ★★ | ✅ por camada, nervo, região, grupo (32 grupos) e segmento medular, com legenda |
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
| C3 | **Irrigação** (artérias) | ★★★ | ✅ todos os 255 músculos (`src/irrigation.js`) com guarda, texto dos ramos e chips para as artérias |
| C4 | Aplicação clínica e lesões | ★★★ | 🟡 nervos têm “Lesão”; artérias principais têm “Pulso e compressão”; demais estruturas em notas |
| C5 | Estruturas vizinhas / relações | ★★ | 🟡 vasos, vias aéreas, órgãos digestórios e glândulas salivares têm `relacionados` nos dois sentidos; artérias palpáveis têm “Relações” e 20 feixes neurovasculares |
| C6 | Nome em inglês, sinônimos e epônimos na busca | ★★ | ⬜ (busca por nome, ação e nervo ✅) |
| C7 | Fontes citadas na ficha | ★★ | 🟡 nas fichas novas (`fontes`), na `nota`, em `docs/revisao-conteudo.md` e no README |
| C8 | Pronúncia dos termos | ★ | ⬜ |
| C9 | Ilustrações 2D, esquemas e fotos | ★★ | ⬜ |
| C10 | Links cruzados: músculo ↔ nervo | ★★★ | ✅ (255 músculos ↔ 112 nervos) |
| C11 | Links cruzados: músculo ↔ artéria, ↔ articulação, ↔ movimento | ★★★ | ✅ músculo ↔ artéria em todos os 255 músculos; 🟡 músculo ↔ articulação ↔ movimento no membro superior (falta membro inferior, F4.6) |

### D. Estudo e avaliação

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| D1 | Quiz “escolha o nome” | ★★★ | ✅ |
| D2 | Quiz “localize no modelo 3D” (3 tentativas, dica, revisão) | ★★ | ✅ |
| D3 | Quiz de **texto**: inervação, irrigação, ação, origem/inserção | ★★★ | ✅ músculos (nervo, irrigação, ação, origem, inserção, nota) e nervos (músculos, lesão, sensibilidade) |
| D4 | Flashcards com **repetição espaçada** | ★★★ | 🟡 repetição espaçada (SM-2) agenda as estruturas dos quizzes; ainda não há flashcards |
| D5 | Progresso e estatísticas por estrutura | ★★ | ✅ painel de progresso: precisão, pontos fracos, revisões e histórico de rodadas |
| D6 | Favoritos e anotações pessoais | ★★ | ✅ favoritos e anotações por estrutura |
| D7 | Listas de estudo personalizadas (“prova de MMSS”) | ★★ | ✅ listas próprias que alimentam os três quizzes |
| D8 | **Tours / aulas guiadas** | ★★ | ✅ 16 tours (98 passos); textos ainda sem revisão formal de fontes |
| D9 | Exportar imagem da vista, imprimir ficha | ★★ | ✅ PNG da vista e impressão da ficha |
| D10 | Modo professor: criar e compartilhar quizzes/tours | ★ | ⬜ |

### E. Clínica e função

| ID | Item | Peso | Aqui hoje |
| --- | --- | --- | --- |
| E1 | Movimentos e amplitude por articulação; músculos agonistas/antagonistas | ★★★ | 🟡 membro superior: amplitude (AAOS) e músculos principais e auxiliares por movimento; antagonistas só implícitos |
| E2 | **Dermátomos e miótomos** | ★★★ | ✅ miótomos por segmento (C1–Co1, 183 músculos e 70 nervos) e dermátomos esquemáticos (até o membro superior; falta membro inferior, M11) |
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
bexiga, próstata, laringe, brônquios, timo, adrenais, hipófise, cerebelo e encéfalo (≈ 116 elementos).
Isso significa que **membros inferiores, vasos e a maioria das vísceras podem usar o pipeline que já existe** (`fetch_*` →
`convert_*` → pacote `.js`), em vez de modelagem por código. **Exceções verificadas em 2026-10-12** (abaixo).

**Conferência do índice em 2026-10-12** (`tools/isa_element_parts.txt`, 2 906 nomes de conceito, busca por nome):

| Sistema | Tem malha no banco | **Não** encontrado no índice (por código, fonte externa ou ficha de texto) |
| --- | --- | --- |
| Circulatório | coração (câmaras, valvas, músculos papilares, coronárias), tronco pulmonar, artérias e veias pulmonares, arco da aorta, veias cavas, árvore vascular | **pericárdio**; **placenta, cordão e estruturas fetais** (ducto arterioso, forame oval) |
| Respiratório | brônquios (inclui segmentos pulmonares), traqueia, laringe, diafragma | **pulmões** (nenhum conceito “lung”; **há fonte aberta, o HRA, ver abaixo**), **pleuras**, **mediastino** |
| Digestório | esôfago, estômago, duodeno, jejuno, íleo, cólon, apêndice, reto, fígado (com setores), vesícula biliar, pâncreas, baço, glândulas salivares, mesentérios do intestino delgado e grosso e regiões do peritônio (qualidade a conferir) | omentos e recessos peritoneais (não encontrados por nome) |
| Sentidos e tegumentar | olho (córnea, cristalino, íris, corioide, esclera, retina, corpo vítreo), aparelho lacrimal, orelha externa, pele e anexos, cartilagens e ossos do nariz | **membrana timpânica, ossículos, cóclea e labirinto** |
| Urinário e genital masculino | rins, ureteres, bexiga, uretra, próstata, vesículas seminais, testículo, epidídimo, pênis (corpos cavernoso e esponjoso) | ducto deferente, glândulas bulbouretrais |
| Genital feminino | — | **útero, tubas, ovários, vagina, vulva, mama** (nenhum no BodyParts3D; **útero, tubas, ovários e mama existem no HRA, CC BY 4.0**; vagina e vulva por código) |
| Endócrino | hipófise, pineal, hipotálamo, suprarrenais, timo | **tireoide e paratireoides** (a “tireoide” da lista antiga não existe como glândula no índice) |

Antes de prometer qualquer item “fora do banco”, vale rodar o spike da F6.0 (outro índice do BodyParts3D, versão *part-of*, e
fontes abertas) — a busca acima é só por nome no índice que o projeto já baixou.

O que o BodyParts3D **não** traz (ou traz pouco) e continua sendo modelado por código ou buscado em outra fonte:
**nervos** (só os da órbita), **ligamentos** e cápsulas (poucos, como os do pé e da laringe), **fáscias**, **bursas**,
**linfonodos**, meniscos, músculos pequenos (mímica, laringe, ouvido médio), além das lacunas da tabela acima (pulmões,
pericárdio, aparelho genital feminino, ouvido médio e interno, tireoide). Fontes abertas derivadas do BodyParts3D com mais estruturas
(por exemplo, o projeto Z-Anatomy) são **candidatas a avaliar**, com checagem de licença e de qualidade antes de qualquer
uso (§9).

**Fonte externa verificada em 2026-10-12 — Human Reference Atlas (HuBMAP), CC BY 4.0** ([`docs/fonte-hra-atlas-de-referencia.md`](docs/fonte-hra-atlas-de-referencia.md)): tem **útero (20 subestruturas),
tubas, ovários, mama, placenta, pelve feminina e pulmões**, em GLB. Não tem vagina, vulva, ligamentos do útero, tireoide,
paratireoides, estômago, pleuras, mediastino, pericárdio, ossículos nem cóclea. O Z-Anatomy foi avaliado e descartado como fonte
principal (modelo masculino, peças de uso não comercial).

## 6. Roteiro em fases

> **Reordenação de 2026-10-12.** A meta passou a ser **mostrar o corpo inteiro e os sistemas da disciplina o quanto antes**.
> Cada fase abaixo tem um **núcleo** (o que entra na release) e os aprofundamentos que saíram do caminho, registrados em
> [`docs/pontos-de-melhoria.md`](docs/pontos-de-melhoria.md) com IDs `M01…` (aparecem aqui como “→ M…”). Nada foi descartado.
> A regra do que é núcleo está no §1 desse documento.

Visão geral (a ordem é a recomendada; justificativa abaixo da tabela):

| Fase | Versão | Tema | Tam. | Depende de |
| --- | --- | --- | --- | --- |
| F0 | 2.0.x | Alicerce: testes, CI, web, acessibilidade | M | — |
| F1 | 2.1 | Ferramentas de estudo | G | F0 |
| F2 | 2.2 | Fechar músculos e nervos das regiões atuais | G | F0 |
| F3 | 2.3 | Articulações do membro superior (**F3a ✅**); o resto da F3 foi adiado → M01–M08 | M | F2 |
| F4 | **3.0** | **Corpo inteiro**: membros inferiores e pelve, núcleo osteomuscular (ossos, músculos, nervos motores, grandes articulações); **F4.1 a F4.5 ✅; F4.6 (articulações) e F4.7 depois** | GG | F3 |
| F5 | 3.1 | **Coração e vasos principais** (circulatório) | G | F4 |
| F6 | 3.2+ | **Sistemas da disciplina, um por release**, na ordem das aulas: respiratório → digestório → sentidos e tegumentar → urinário e genital masculino → genital feminino → endócrino → urogenital integrado | GG | F5 |
| F7 | 3.x | Sistema nervoso central (encéfalo, meninges, vias) | GG | F5 |
| F8 | contínua | Clínica e correlações | M por lote | F2, F3 em diante |
| F9 | a avaliar | Plataforma estendida (idiomas, turma, apps) | G | F1 |
| F10 | contínua | **Aprofundamentos adiados** (`docs/pontos-de-melhoria.md`), intercalados pelos gatilhos de cada item | M–GG por item | F4 em diante |

**Por que esta ordem.** (1) F0 protege tudo o que vem depois: uma release quebrada chega a todos os usuários do `.exe`.
(2) F1 multiplica o valor de qualquer anatomia nova e não depende de dados novos, por isso vem cedo. (3) F2 fecha lacunas
nas regiões que o usuário já pediu “completas” (músculos e nervos) antes de abrir região nova. (4) F3 estabeleceu o modelo
de articulação/movimento; a F3a (membro superior) basta como modelo para a F4, e o restante da F3 virou aprofundamento.
(5) **F4 vem inteira antes de qualquer víscera**: sem o corpo completo não dá para situar os sistemas (coração no tórax, rins
na região lombar, útero na pelve) e é a maior lacuna visível (corpo sem pernas); por isso o núcleo da F4 é obrigatório e só os
detalhes saem dela. (6) O **coração e os vasos principais (F5)** vêm logo depois, porque abrem o cronograma da disciplina e
os vasos acompanham os nervos e as vísceras; a irrigação detalhada em todos os músculos fica para depois (M15). (7) A F6 segue a
**ordem das aulas** (mapa abaixo), um sistema por release. (8) O sistema nervoso central (F7) é a fase mais pesada em dados e
tem menos reaproveitamento; o olho e o ouvido saíram da F7 e foram para a F6, onde a disciplina os cobra. F1, F8 e F10 podem ser
intercalados com as fases de conteúdo para manter o ritmo entre lotes grandes de dados.

**Inversão de ordem confirmada em 2026-10-12.** Os **sistemas das aulas (F5 e F6) vêm antes dos lotes restantes da perna e do pé
(F4.3 a F4.7)**. Motivo: a N2 (26/11) cobre do circulatório ao urogenital, e a musculatura da perna e do pé não aparece no cronograma.
F4.1 e F4.2 já estão prontas (ossos do membro inferior, pele inteira, quadril e coxa). F4.3 a F4.7 entram na janela do CONPEEX
(10 e 12/11) e o que sobrar fica para depois da prova; não bloqueiam a N2.

Meta por aula (é critério de prioridade, não promessa de data; cada release continua exigindo `npm test` verde e verificação visual):

| Até | Entrega mínima na `main` |
| --- | --- |
| 15/10 | F5.1 coração (câmaras, valvas, coronárias) e F5.2 pericárdio esquemático; a aula teórica de 13/10 sai antes de haver tempo |
| 20/10 | F5.3 a F5.6: artérias e veias principais, fichas, tour e quiz da circulação |
| 27/10 | F6.1 respiratório: traqueia, brônquios, laringe e **pulmões (HRA)**, fichas, tour e quiz |
| 03/11 | F6.2 digestório |
| 05/11 | F6.3 sentidos e tegumentar |
| 10 e 12/11 | CONPEEX: pendências, revisão de fichas e, se houver tempo, F4.3 a F4.5 |
| 17/11 | F6.4 urinário e genital masculino e F6.5 genital feminino |
| 19/11 | F6.6 endócrino |
| 24/11 | F6.7 urogenital integrado (prática) |
| 26/11 | N2: congelar, só correções |

### Mapa do cronograma da disciplina (Anatomia Humana) → fases

Fonte: imagem do cronograma enviada pelo responsável em 2026-10-12 (a aula de genital feminino aparece sem data própria, logo
depois da de 17/11). O mapa serve de **critério de prioridade**, não de promessa de
data: as aulas já começaram (08/10) e a F4 é GG.

| Data(s) | Tema da aula | Fase do roteiro | Observação |
| --- | --- | --- | --- |
| 08/10 | Circulatório — generalidades | F5 (vasos principais) e tour da circulação | |
| 13/10 | Coração, pericárdio, circulação fetal e anexos | F5.1 (coração), F5.2 (pericárdio esquemático) | Circulação fetal e anexos **não têm malha** → M21 (tour e ficha de texto no núcleo) |
| 15/10, 20/10 | Circulatório — prática | F5 completa + quiz | |
| 22/10, 27/10 | Respiratório — teórica e prática | F6.1 | Pulmões: malha do **HRA** (CC BY 4.0); pleuras **não estão no banco**: decidir no spike F6.0 |
| 29/10, 03/11 | Digestório — teórica e prática | F6.2 | |
| 05/11 | Órgãos dos sentidos e tegumentar | F6.3 | Ouvido médio e interno → M28 |
| 10/11, 12/11 | CONPEEX (sem aula) | — | Janela para fechar pendências ou puxar um item de F10 |
| 17/11 e seguinte | Urinário e masculino; genital feminino | F6.4 e F6.5 | Genital feminino **não está no BodyParts3D**: útero, tubas, ovários e mama vêm do **HRA**; vagina e vulva por código |
| 19/11 | Endócrino | F6.6 | Tireoide e paratireoides **não estão no banco nem no HRA** |
| 24/11 | Urogenital — prática | F6.7 | |
| 26/11 | N2 — provas teórica e prática | — | Congelar: só correções |

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

- [x] **F3.1** Novo `kind: 'articulacao'` com ficha: tipo, superfícies articulares, cápsula, ligamentos, movimentos e
  amplitude, músculos motores, inervação e irrigação, notas clínicas. Guarda: toda articulação cita ≥ 2 ossos existentes. **M**
  ✅ `src/catalog-joints.js`; movimentos estruturados (principais e auxiliares) geram `MOVEMENTS`; os nervos da articulação ganham
  ramos articulares; guardas na carga (ossos, peças da cápsula, ligamentos, músculos, nervos). Cápsula esquemática calculada na
  zona de contato entre os ossos (`src/joint-geo.js`). Detalhes em `docs/articulacoes.md`.
- [x] **F3.2** Articulações e ligamentos do **membro superior**: esternoclavicular, acromioclavicular (coracoclavicular),
  glenoumeral (glenoumerais, coracoumeral, coracoacromial), cotovelo (colaterais, anular), radiulnares (membrana
  interóssea), radiocarpal e carpais, carpometacarpais, metacarpofalângicas e interfalângicas. **G** ✅ 13 articulações (inclui a
  escapulotorácica, funcional) e 16 ligamentos, todos por código sobre as malhas reais dos ossos.
**Reordenação de 2026-10-12:** a F3 **fecha na F3a**. O que sobrou dela não bloqueia o corpo inteiro e foi para
`docs/pontos-de-melhoria.md` (os IDs F3.x continuam valendo para citar a origem):

- [ ] **F3.3** Coluna e tórax: ligamentos e articulações. **Adiado → M01** (e a ATM → M02)
- [ ] **F3.4** Pelve: sacroilíacos, sacrotuberal, sacroespinal, inguinal, pubianos. **Movido para a F4.6** (pertence à pelve)
- [ ] **F3.5** Campo estruturado `acoes`/`movimentos`. 🟡 Os dados existem para o membro superior (`movimentos` → mapa derivado
  `MOVEMENTS`, papéis principal e auxiliar); a ficha do músculo já mostra os movimentos, e **a F4.6 repete o mesmo modelo no membro
  inferior**. Página “Movimentos”, filtro, quiz e papéis antagonista e fixador: **adiado → M03**
- [ ] **F3.6** Origem e inserção desenhadas no osso e acidentes ósseos selecionáveis. **Adiado → M04** (primeiro a puxar depois
  dos sistemas do cronograma)
- [ ] **F3.7** Bursas, bainhas sinoviais, retináculos, aponeurose palmar, fáscia toracolombar. **Adiado → M05** (e M13)
- [ ] **F3.8** Spike de animação de movimento. **Adiado → M06**
- [ ] **F3.9** Quizzes de função. **Adiado → M07**
- Pendências da F3a (inervação das carpometacarpais, amplitudes de abdução e adução dos dedos, recessos da cápsula). **→ M08**

**Saída (reduzida):** toda articulação sinovial do **membro superior** tem ficha, ligamentos e movimentos (✅ F3a). O restante
da saída original (coluna, filtro por movimento, origem e inserção no osso) passa a ser cobrado por M01, M03 e M04.

---

### F4 — Membros inferiores e pelve (**3.0**, osteomuscular completo) · GG

Objetivo: **corpo inteiro** com ossos, **todos os músculos**, os nervos que ligam cada músculo e as grandes articulações com
seus ligamentos principais. É a fase que destrava as demais (situar os sistemas no corpo) e **não se reduz abaixo do núcleo**:
só os detalhes marcados “→ M…” saem dela. Quebrar em quatro lotes, cada um entregável. **Ordem (2026-10-12):** F4.1 e F4.2 feitas; **F4.3 a F4.7 passam para depois da F6**
(calendário no início do §6).

**Núcleo × adiado, em uma linha por lote:** A e B — tudo entra; C — o que tem malha entra, aponeurose plantar e músculos sem malha
adiados; D — todos os nervos motores e os ramos musculares entram, os cutâneos, os plexos desenhados e os dermátomos adiados;
articulações — quadril, joelho, tornozelo, subtalar, sacroilíaca e púbica entram, os detalhes do pé adiados.

- [x] **F4.1** ✅ Pipeline: estender `tools/body_parts.py` (peças por nome de conceito) e rodar `fetch_body.py`/`convert_body.py` para o membro inferior; novo pacote
  `dist/anatomy-leg.js` carregado em segundo plano (orçamento: ≤ +8 MB; decimar mais se preciso). Nova região
  “Membro inferior” em `REGIONS`, no quiz e nos botões. **Inclui:** (a) **inventário** das peças do membro inferior e da pelve no
  índice, com a lista do que não tem malha (alimenta M14); (b) **decisão do orçamento de dados** (risco 2 do §9, “decidir antes da
  F4”); (c) medir a carga com `tools/perf_mobile.js` ao fim do lote A — se piorar muito, **M37 passa na frente**. **M**
  ✅ **Entregue em 2026-10-12 (na `dev`):** pacote `dist/anatomy-leg.js` (1,85 MB) com 31 peças ósseas do pé e da perna (fêmur, patela, tíbia,
  fíbula, 7 do tarso, 5 metatarsais, 14 falanges, sesamoides) e a **pele inteira** com as pernas (`pele_inteira`, que substitui a
  `pele_corpo` do pacote do corpo: recortar e emendar deixaria frestas na cintura); 8 fichas de ossos em `src/catalog-leg-bones.js`
  (404 estruturas); região **“Perna”** (`membro_inf`) nos botões, no quiz, na cor por região, no progresso e no hash; carga em segundo
  plano depois do corpo e antes dos nervos; `fetch_body.py` e `convert_body.py` ganharam `--pack`; as 84 peças do membro inferior
  (ossos, 51 músculos e a membrana interóssea) já estão definidas e resolvidas no banco, e os dermátomos deixam as pernas sem cor
  (M11). Inventário, decisão dos dados e medição: [`docs/inventario-membro-inferior.md`](docs/inventario-membro-inferior.md). O
  banco **não** tem ligamentos nem meniscos do quadril, joelho e tornozelo, a articular do joelho, o extensor curto dos dedos (só o
  do hálux) nem os interósseos dorsais do pé.
- [x] **F4.2** ✅ Lote A — **quadril e coxa**: ossos (fêmur, patela, quadril já existe; entregues na F4.1), glúteos (máximo, médio, mínimo), tensor da
  fáscia lata, piriforme, gêmeos superior e inferior, obturadores, quadrado femoral, sartório, quadríceps (reto femoral e três
  vastos), articular do joelho, pectíneo, adutores (longo, curto, magno), grácil, isquiotibiais (bíceps femoral, semitendíneo,
  semimembranáceo), psoas e ilíaco já presentes. **G**
  ✅ **Entregue em 2026-10-12 (na `dev`):** 24 músculos com malha real (+1,05 MB no `anatomy-leg.js`, hoje 2,9 MB), fichas em
  `src/catalog-leg-muscles.js` (ação, origem, inserção, inervação e nota, com segmentos medulares e 4 grupos novos para a cor por
  grupo), e **os nervos que os inervam, adiantados da F4.5**: obturatório, glúteos superior e inferior, nervo do piriforme, do quadrado
  femoral (e gêmeo inferior) e isquiático (até o ápice da fossa poplítea), mais o femoral prolongado pela coxa e o gêmeo superior no nervo
  do obturador interno (`src/catalog-nerves-leg.js`). Todos os ramos chegam ao músculo (≤ 1,2 cm) e nenhum nervo novo atravessa osso.
  O **articular do joelho** não tem malha no banco e ficou de fora (M14); o **adutor mínimo** entra como peça própria, com nota sobre a
  divergência (Moore o inclui no adutor magno). Carga no celular emulado: 31,7–32,7 s (de 28,4 s); **previsão: a F4.5 (≈ 7 nervos longos, com
  dezenas de ramos) leva o total a 35–38 s, no limite, então o M37 deve vir antes dela** (feito em 2026-10-12: renderização sob demanda levou a carga a 22,6–24,0 s; ver §10) (`docs/inventario-membro-inferior.md` §3).
- [x] **F4.3** ✅ Lote B — **perna**: tíbia, fíbula, compartimentos anterior, lateral e posterior (tibial anterior, extensores longo
  dos dedos e do hálux, fibular terceiro, fibulares longo e curto, gastrocnêmio, sóleo, plantar, poplíteo, tibial posterior,
  flexores longo dos dedos e do hálux). **G**
- [x] **F4.4** ✅ Lote C — **pé**: tarso, metatarso, falanges; músculos intrínsecos dorsais e plantares **que tenham malha no banco**
  (extensores curtos, abdutores, flexores curtos, quadrado plantar, lumbricais, adutor do hálux, interósseos). **Adiado:**
  aponeurose plantar e demais retináculos (→ M13); músculos sem malha, por código (→ M14). **G**
- [x] **F4.5** ✅ Lote D — **nervos (núcleo motor)**: ~~femoral, obturatório, glúteos superior e inferior, ramos curtos do plexo sacral e o
  isquiático até a fossa poplítea (feitos na F4.2)~~; faltam o tibial e o fibular comum (continuação do isquiático), os fibulares
  superficial e profundo, o tibial e seus ramos plantares medial e lateral, e **os ramos musculares dos músculos da perna e do pé**,
  **com `segmentos` medulares** (a guarda os exige). Os ramos curtos entram como ramos do plexo, sem trajeto próprio. **Adiado:** nervos
  cutâneos (sural, safeno, cutâneos femorais, genitofemoral…) → M09; plexos lombar e sacral desenhados → M10; dermátomos L1–S2 →
  M11. **G** (era GG)
  ✅ **Entregue em 2026-10-15 (F4.3 a F4.5, publicados na v2.3.12):** 14 músculos da perna, a membrana interóssea e 13 peças de músculos do pé (66 elementos, 3,3 MB baixados do BodyParts3D com autorização; `anatomy-leg.js` de 2,9 para 3,9 MB), fichas em `catalog-leg-perna.js` e `catalog-leg-pe.js` (segmentos medulares de Moore, com as divergências do Gray's nas notas), 6 nervos com trajetos medidos no modelo (tibial, fibular comum, fibulares superficial e profundo, plantares medial e lateral; 0 a 1 % dentro de osso, ramos a menos de 0,4 cm do músculo), irrigação dos 27 músculos com as artérias tibiais, fibular, poplítea e plantares, 5 grupos de cor novos e o tour “Perna e pé” (8 passos). **Fora:** o extensor curto dos dedos e os interósseos dorsais do pé, que o banco não tem (M14), a aponeurose plantar e os retináculos (M13) e os nervos cutâneos (M09). A carga no celular emulado foi a 33,6–35,8 s; a medida “nervos mais leves” (`otimizacao-mobile.md`, item 3) a levou a **29,6 s**.
- [ ] **F4.6** Articulações e ligamentos do **núcleo**, no mesmo modelo da F3a (`art(...)`, `movimentos` com músculos principais e
  auxiliares → os músculos do membro inferior ganham as ligações sozinhos): **quadril** (iliofemoral, pubofemoral, isquiofemoral,
  ligamento da cabeça do fêmur), **joelho** (cruzados, colaterais, meniscos, patelar), **tornozelo** (colaterais lateral e
  medial/deltóideo) e **subtalar**; da pelve (antigo F3.4): **sacroilíaca** (com sacrotuberal e sacroespinal), **sínfise púbica** e
  ligamento inguinal. **Adiado:** demais articulações do pé, ligamentos plantar longo e mola, arcos do pé → M12. **G**
- [ ] **F4.7** Atualizar guardas (todo músculo com nervo e segmentos; toda articulação com ossos e movimentos), contagens do README
  e quizzes por região. **P**

Estimativa de escala: ≈ 60–70 músculos (conforme a divisão em cabeças/ventres), 7–9 grupos ósseos, ≈ 12 nervos de trajeto
próprio, ≈ 15 ligamentos principais.

**Saída (marco 3.0):** corpo inteiro visível; **todos os músculos esqueléticos principais do corpo têm nervo e segmentos**; ossos e
as grandes articulações do corpo inteiro (a coluna e o tórax ficam para M01); o `.exe` continua dentro do orçamento de §3.5. Os
itens “→ M…” não bloqueiam o 3.0, mas as fichas que dependem deles **dizem que faltam** (`docs/pontos-de-melhoria.md` §1).

---

### F5 — Coração e vasos principais (3.1) · G (era GG)

Objetivo: abrir o circulatório da disciplina (generalidades, coração, pericárdio, circulação pulmonar e sistêmica) com o corpo já
completo da F4. **Núcleo:** o que dá para ver, selecionar, nomear e localizar; **adiado:** a irrigação detalhada de cada músculo,
os linfáticos e a circulação fetal.

- [x] **F5.1** ✅ **Coração**: câmaras, valvas, músculos papilares e coronárias com malhas reais (o banco tem todas, ver §5);
  camada própria. **G**
  ✅ **Entregue em 2026-10-12 (na `dev`):** pacote `dist/anatomy-circ.js` (1,12 MB, 67 peças), 4 câmaras (a parede única dos ventrículos foi dividida
  em direito e esquerdo pela cavidade mais próxima), 4 valvas (as cordas tendíneas vêm na malha delas), músculos papilares, 6 ramos das coronárias e 6 veias do
  coração; camada “Coração”, fichas e cores; o interior se vê com o plano de corte. Detalhes e decisões: [`docs/circulatorio.md`](docs/circulatorio.md).
- [x] **F5.2** ✅ **Pericárdio** (sacos fibroso e seroso) como envoltório **esquemático** por código, declarado na ficha (o banco não
  tem pericárdio); seios do pericárdio → M26. **P**
  ✅ **Entregue em 2026-10-12 (na `dev`):** `src/hull-geo.js` (casco convexo suavizado do coração e da raiz dos vasos), ficha com as camadas e os seios (texto) e
  a nota “ESQUEMA”.
- [x] **F5.3** **Artérias e veias principais** com malhas reais (aorta e ramos principais, tronco e artérias pulmonares, cavas,
  jugulares, subclávias, axilares, braquiais, ilíacas, femorais…; confirmar nomes FMA e decimar); camadas “Artérias” e “Veias”,
  cores convencionais. Vasos de menor calibre → M20. **G**
  ✅ **Entregue em 2026-10-12 (na `dev`):** 31 artérias e 24 veias (aorta e seus segmentos, tronco e artérias pulmonares, 4 veias pulmonares, cavas, braquiocefálicas, ázigo e
  hemiázigo, ramos do arco, carótidas, vertebral, subclávia, torácica interna, membro superior, ramos da aorta abdominal, ilíacas, femorais, renais). **Fora, por ora:**
  vasos da perna e do pé (F4.3+) e os do tubo digestório e das vísceras (F6).
- [x] **F5.4** **Ficha básica de vaso e do coração:** origem, trajeto, ramos principais, território irrigado ou drenado e relações
  importantes, com fonte. Pulsos, pontos de compressão e relações detalhadas → M16. **M**
  ✅ **Entregue em 2026-10-12 (na `dev`):** 65 fichas (origem ou formação, trajeto, ramos ou tributárias, território, nota clínica) e as vizinhas como chips, nos dois sentidos.
- [x] **F5.5** ✅ **Tour “Circulação”** (grande e pequena circulação, 6 a 8 passos) e **quiz de localizar** vasos e câmaras. **P**
  ✅ **Entregue em 2026-10-12 (na `dev`):** tour “Circulação: grande e pequena” (8 passos) e, adiantado do M21, o tour de texto “Circulação fetal e o nascimento” (6 passos); o quiz de
  localizar e o de escolher o nome ganharam os tipos Coração, Artérias e Veias.
- [x] **F5.6** ✅ Guardas equivalentes às do catálogo para o novo vínculo (todo vaso nomeado com ramos válidos; coração com câmaras e
  valvas listadas). **P**
  ✅ **Entregue em 2026-10-12 (na `dev`):** guardas em `catalog.js` (relacionadas existentes e completadas nos dois sentidos, ficha completa nos vasos) e testes de integridade
  (peças do pacote ↔ fichas, camadas por tipo, câmaras e valvas presentes).

- [x] **F5.7** ✅ **Fechamento da fase (2026-10-14):** vasos de menor calibre (M20: 38 artérias e 11 veias com malha real, fichas e relações, pacote
  `anatomy-circ.js` de 1,12 para 2,1 MB, baixados 14,5 MB do BodyParts3D com autorização); **irrigação dos 228 músculos** com guarda (M15); pulsos, pontos de
  compressão e relações (M16); **14 feixes neurovasculares** (M17); **sistema linfático** esquemático, sistema de condução e papilar posteromedial (M18, esquemas);
  quiz “o que irriga isto?” (M19); **circulação fetal** com placenta e cordão do HRA e veia e artérias umbilicais e ducto venoso por código, numa camada opcional
  (M21); ligamento arterial. O catálogo passa a **604 estruturas**. Detalhes: [`docs/circulatorio.md`](docs/circulatorio.md).

- [x] **F5.8** ✅ **Segunda leva do circulatório (2026-10-15, publicada na release v2.3.11):** 25 artérias e 16 veias do BodyParts3D (círculo arterial do cérebro e oftálmica; ramos do tronco celíaco e das
  mesentéricas; suprarrenais, bronquial e esofágicas; veia porta, esplênica, mesentéricas, hepáticas e veias da pelve, da mão e do pé; 3,5 MB baixados com autorização), **19 vasos por código**
  (carótida externa e 9 ramos, jugular externa, retromandibular e facial, glúteas, obturatória, pudenda interna, circunflexa femoral medial e fibular), 6 grupos de linfonodos a mais, projeção
  do coração e focos de ausculta (sobre a pele), irrigação, inervação e esqueleto fibroso nas fichas do coração, 4 feixes neurovasculares a mais e **5 tours novos** (generalidades, coração:
  superfície e condução, artérias da cabeça e do pescoço, polígono de Willis, fígado e veia porta). O catálogo passa a **672 estruturas**.

**Adiados desta fase:** o resto de M18 (vasos coletores, troncos linfáticos, cadeias cervicais superficiais, braquiais e supratrocleares), os vasos que o banco não tem (seios venosos da dura-máter,
veias cerebrais, interóssea posterior, uterina e vesicais, plexos venosos; M20, resto), a árvore segmentar de cada víscera (M23), o forame oval como peça e o fígado na circulação fetal (digestório, F6.2).

**Saída:** coração e vasos principais visíveis em todas as regiões já cobertas, com ficha e quiz; o `.exe` dentro do orçamento.

---

### F6 — Sistemas da disciplina (3.2 em diante) · GG, uma release por sistema

Ordem **das aulas** (mapa do §6). **Núcleo de cada sistema:** camada própria, malhas disponíveis (§5), ficha básica (função,
partes, relações e nota clínica curta, com fonte), tour curto e quizzes de localizar e escolher o nome, com guarda de ids e
ramos. **Adiado de todos:** inervação autonômica detalhada (M22), irrigação e drenagem específicas (M23), subdivisões internas
(M27), histologia e embriologia (M32).

- [ ] **F6.0** *(parcial em 2026-10-12: genital feminino e pulmões resolvidos pelo HRA; faltam pleuras, mediastino, tireoide,
  paratireoides, ossículos e cóclea)* **Spike de 1 dia, antes do primeiro sistema:** conferir no BodyParts3D (índice *part-of* e versão 4.0) e em fontes
  abertas compatíveis com CC BY-SA 2.1 JP (§9, item 3) o que falta em §5: **pulmões, pleuras, mediastino, útero, tubas, ovários,
  vagina, mama, tireoide, paratireoides, ossículos e cóclea**. Saída: decisão registrada em §10 para cada um (malha de outra
  fonte, esquema por código declarado, ou só ficha). **P**
- [x] **F6.1** ✅ *(entregue na `dev` em 2026-10-12: pulmões, traqueia, brônquios principais e 20 segmentares, cartilagens da laringe, pleuras esquemáticas e tour; ver [`docs/respiratorio.md`](docs/respiratorio.md))* **Respiratório** (22 e 27/10): traqueia e brônquios (malhas), cartilagens da laringe (os músculos e o diafragma já
  existem no catálogo), **pulmões com malha real do HRA** (CC BY 4.0, ≈ 11 MB originais, decimar) e pleuras esquemáticas por código, timo e mediastino simples. Pleuras e mediastino por compartimentos
  → M26; mecânica da caixa torácica → M01. **G**
- [x] **F6.2** ✅ *(publicada na v2.3.14 em 2026-10-22; entregue na `dev` em 2026-10-17: 34 estruturas com malha real do BodyParts3D em `dist/anatomy-digest.js` [687 KB], camada própria, fichas completas, ligações com glândulas salivares, língua e árvore vascular/porta, e tour; ver [`docs/digestorio.md`](docs/digestorio.md))* **Digestório** (29/10 e 03/11): esôfago, estômago, duodeno, jejuno, íleo, cólon, apêndice, reto, fígado e vesícula
  biliar, pâncreas, baço; glândulas salivares ligadas às da cabeça. Omentos e recessos → M24. **G**
- [ ] **F6.3** **Órgãos dos sentidos e tegumentar** (05/11): olho (córnea, cristalino, íris, corioide, esclera, retina, corpo vítreo)
  ligado aos músculos que já existem, aparelho lacrimal, orelha externa, nariz, língua (já existe) e pele; **esquema do ouvido
  médio e interno** só como ficha (→ M28); olho em detalhe → M29; pele em camadas → M30. *(Estes itens vieram da antiga F7.4.)* **M**
- [ ] **F6.4** **Urinário e genital masculino** (17/11): rins, ureteres, bexiga, uretra, próstata, vesículas seminais, testículo,
  epidídimo, pênis, e **canal inguinal com cremaster e cordão espermático** (por código); ducto deferente e glândulas
  bulbouretrais por código, esquemáticos. **G**
- [ ] **F6.5** **Genital feminino** (17/11 e seguinte): **decidido em 2026-10-12 (spike F6.0): útero (fundo, corpo, colo e óstios),
  tubas, ovários e mama com malha real do HRA (CC BY 4.0)**, posicionados por pontos de referência da pelve; **vagina, vulva e
  ligamentos do útero por código, declarados esquemáticos na ficha**; botão opcional de pelve feminina (HRA). Se o registro no corpo
  masculino ficar ruim, cai para esquema por código ([`docs/fonte-hra-atlas-de-referencia.md`](docs/fonte-hra-atlas-de-referencia.md) §4). Detalhes → M31. **M** (era G)
- [ ] **F6.6** **Endócrino** (19/11): hipófise, pineal, hipotálamo e suprarrenais (malhas do banco); tireoide e paratireoides
  conforme o spike (por código, esquemáticas); pâncreas e gônadas ligados aos sistemas de origem; tour e quiz do sistema. **M**
- [ ] **F6.7** **Urogenital integrado** (24/11, prática): períneo e pelve em corte sagital, relações entre bexiga, próstata, reto
  (e útero), esfíncteres e músculos do períneo que já existem; tour e quiz integrados dos sistemas F6.4 a F6.6. **M**
- [ ] **F6.8** *(antigo F6.5)* Regiões e espaços clínicos — triângulos do pescoço, fossas axilar e cubital, canal do carpo, trígono
  femoral, fossa poplítea (A12). **Adiado → M25.**

**Saída por release:** o sistema com camada, ficha, tour e quiz, guardas na carga, dentro do orçamento de dados. As
estruturas **sem malha** dizem na ficha que são esquemáticas (`agents.md` §7.4).

---

### F7 — Sistema nervoso central · GG

- [ ] **F7.1** Encéfalo: lobos e giros principais, tálamo, núcleos da base, tronco encefálico, cerebelo, ventrículos;
  medula espinal e meninges; seios venosos e polígono de Willis (liga a F5).
- [ ] **F7.2** Núcleos e origem aparente dos nervos cranianos, ligados às fichas dos nervos (F2).
- [ ] **F7.3** Vias principais (motora, sensitiva, visual, auditiva) como esquemas.
- [ ] **F7.4** *(movido em 2026-10-12)* Olho e ouvido: o núcleo está na **F6.3**; os detalhes (túnicas e câmaras do olho, ossículos,
  cóclea e labirinto) são **M28** e **M29**.

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
| 2.3 (F3a — modelo e membro superior) | F3.1 e F3.2: 13 articulações, 16 ligamentos, movimentos com músculos (dados de F3.5) | ~1 dia de trabalho contínuo | M + G | A cápsula calculada pela zona de contato poupou medir à mão cada articulação; o tempo foi para os ligamentos (pontos encaixados no osso e conferidos pela fração dentro de osso) e para os textos com fonte. Custo na carga: ≈ 0,1 s de cápsulas e ≈ 0,04 s de ligamentos. |
| 2.3+ (F4.1 — pacote e região do membro inferior) | 31 peças ósseas do pé e da perna, pele inteira, 8 fichas de ossos, região “Perna”, `--pack leg` no pipeline, inventário das 84 peças | uma sessão | M | Baixou só 5 MB (ossos e pele). A pele inteira trocou o recorte-e-emenda por uma peça única (sem frestas). Carga no celular emulado: +1,3 s (de ≈ 26,6 s para 28,4 s). Exigiu cuidado: com a pele inteira, `dermatomeOf` classificaria as pernas pelo ramo do membro superior (abaixo da cintura); agora devolve “sem dermátomo”. |
| 2.3+ (F4.2 — lote A: quadril e coxa) | 24 músculos com malha real, 6 nervos novos e o femoral prolongado; segmentos e grupos | uma sessão | G | O que mais pesou foi medir os trajetos no modelo (saída pelo forame isquiático maior, interface entre glúteo médio e mínimo, passagem do isquiático atrás dos gêmeos) e conferir que nenhum ramo atravessa osso (0 % fora o obturatório, 3,7 %). A carga dos nervos no celular emulado subiu 2,6 s com 7 nervos (≈ 0,37 s cada, o dobro da média dos 100 anteriores). |
| 2.3.10–2.3.12 (F5 completa, F6.1 respiratório e F4.3–F4.5 perna/pé/nervos) | 202 estruturas circulatórias, irrigação dos 255 músculos, 20 feixes, linfáticos, circulação fetal, 36 estruturas respiratórias, 27 músculos + membrana interóssea + 6 nervos da perna e do pé (706 estruturas no total) | 3 sessões | GG | Pacotes `anatomy-circ.js` (2,7 MB) e `anatomy-resp.js` (598 KB), mais ampliação de `anatomy-leg.js` (3,9 MB); medida “nervos mais leves” manteve a carga no celular emulado em 29,6 s. |
| 2.3.14+ (F6.2 — sistema digestório e baço) | 34 estruturas digestórias e baço com malha real (`dist/anatomy-digest.js`, 687 KB), camada própria, ligações com glândulas salivares, língua e sistema porta, e tour “Sistema digestório” (740 estruturas no total) | uma sessão | G | Conceitos unidos do BodyParts3D (`cecum` = ceco + ascendente, `descending colon` = descendente + sigmoide, `rectum` = reto + canal anal, `common hepatic duct` = hepático comum + colédoco) separados por corte geométrico nos marcos anatômicos; fígado representado pelos 8 segmentos de Couinaud. |
| *(próximo pelo calendário das aulas: F6.3 — Órgãos dos sentidos e tegumentar; no membro inferior restam F4.6/F4.7 — articulações e ligamentos)* | | | | |

Use a coluna “Observações” para anotar o que atrasou (ex.: geometria de nervo que cai dentro do osso, ajuste de decimação).

## 9. Riscos e decisões em aberto

1. **Release quebrada chega a todos.** O atualizador apaga as versões antigas (`RemoveOldVersions`), então não há volta
   local. Mitigação: F0.2/F0.3; se necessário, um canal de pré-lançamento opcional.
   **Agravante (2026-10-12):** com a F4 e os sistemas saindo em sequência para acompanhar as aulas, haverá mais releases em menos
   tempo. Cada release continua exigindo `npm test` verde e a verificação visual (§7); não relaxar por causa do cronograma.
2. **Tamanho dos dados.** 11,6 MB hoje; membro inferior soma cerca de 7 MB, vísceras e encéfalo mais. Opções: decimar mais,
   pacotes por região carregados sob demanda, ou pacotes opcionais baixados pelo atualizador. *Decidir antes da F4 (item F4.1).*
   Com o plano reordenado, os pacotes de F5 e F6 (coração, vasos, vísceras) chegam logo depois da F4: **um pacote por sistema,
   carregado sob demanda**, é a opção mais coerente; M37 (desempenho no celular) é o plano B.
3. **Geometria procedural.** Nervos e ligamentos são aproximações. Avaliar fontes abertas com mais estruturas (Z-Anatomy
   e similares) **só após checar licença (compatibilidade com CC BY-SA 2.1 JP) e qualidade**; não assumir.
4. **Modelo feminino e variações.** **Confirmado em 2026-10-12: o índice do BodyParts3D não tem útero, tubas, ovários, vagina,
   vulva nem mama.** A aula de genital feminino está no cronograma; decidir no spike F6.0 entre esquema por código declarado,
   outra fonte com licença compatível ou só ficha (F6.5). O mesmo vale para pulmões, pleuras, pericárdio, tireoide e ouvido
   médio e interno (tabela de §5). **Atualização de 2026-10-12:** o HRA (CC BY 4.0) cobre útero, tubas, ovários, mama e pulmões ([`docs/fonte-hra-atlas-de-referencia.md`](docs/fonte-hra-atlas-de-referencia.md));
   continuam sem fonte vagina, vulva, tireoide, paratireoides, pleuras, mediastino, pericárdio e ouvido médio e interno.
5. **Direitos de texto e imagem.** Textos próprios a partir das referências; imagens de terceiros (radiologia, histologia)
   só de bancos com licença aberta, com crédito no dado.
6. **Backend para contas/turmas.** Quebra o princípio offline-first. Preferir arquivos/URLs estáticos até haver necessidade real.
7. **Assinatura do `.exe`.** O SmartScreen avisa; certificado tem custo. Decidir se vale na F9.
8. **`main.js` com ~1 740 linhas.** Features novas (F1) devem sair em módulos (`src/study/*`, `src/tours/*`), não inflar o arquivo.
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
| 2026-10-10 | **F3a iniciada e entregue na `dev` (F3.1 e F3.2; sem publicar).** 396 estruturas: **13 articulações** (`kind: 'articulacao'`, ids `art_*`) e **16 ligamentos** do membro superior, em `src/catalog-joints.js`. Ficha: tipo, superfícies, cápsula, ligamentos, movimentos com amplitude (AAOS, em Norkin & White) e músculos principais e auxiliares (Moore), inervação e irrigação, notas clínicas e fontes. **Vínculos derivados** em `catalog.js`: `MOVEMENTS` (músculo → articulação, movimento e papel; todo músculo do membro superior tem ao menos um, exceto o palmar curto), `JOINTS_OF` (osso/ligamento → articulações) e ramos articulares nos nervos (a articulação declara os nervos; sem desenhar ramo). **Guardas** novas na carga e no `test:catalog`. **Geometria** por código sobre as malhas reais: cápsula elipsoidal calculada na zona de contato entre os ossos (`joint-geo.js`, medida uma vez e espelhada, com pré-filtro por caixa), faixas de ligamento com pontas encaixados no osso (o resolvedor de pontos dos nervos), colaterais dos dedos pela zona de contato, membrana interóssea como lâmina entre as margens, anular como anel; fração dentro de osso de 0 a 13 % (o anular, 20 %, só dentro da ulna, onde a incisura fecha o anel). **Interface:** seções *Ossos*, *Ligamentos* e *Movimentos e músculos* na articulação, *Movimentos (articulações)* no músculo, *Articulação(ões)* no osso e no ligamento (`src/joint-links.js`); selecionar a articulação destaca ossos e ligamentos; no quiz de localizar as cápsulas só respondem ao clique quando a pergunta é uma articulação; o grupo do quiz passou a “Articulações, ligamentos e outras”. Correções colaterais: um erro de geometria de uma estrutura não derruba mais a montagem do corpo (fica no console); cores “por nervo” e distratores “qual nervo?” do quiz teórico contam só nervos que inervam músculos. Versão do `package.json` 2.2 → 2.3. **Não feito:** F3.3–F3.9 (coluna, pelve, página e quiz de movimentos, origem e inserção no osso, bursas e retináculos, animação); inervação das carpometacarpais (fontes divergem) e amplitudes de abdução/adução dos dedos não estão na ficha; a cápsula não mostra recessos nem a linha de inserção. |
| 2026-10-12 | **Roteiro reordenado: corpo inteiro e sistemas da disciplina primeiro.** Pedido do responsável, com base no cronograma de Anatomia (circulatório a partir de 08/10, N2 em 26/11): como todos os sistemas dependem do corpo inteiro para serem situados, a **F4 fica completa no núcleo** e só os detalhes saem dela. **Mudanças:** (1) F3 fecha na F3a; F3.3, F3.5 (restante), F3.6, F3.7, F3.8, F3.9 e as pendências da F3a viram M01–M08, e o antigo F3.4 (ligamentos da pelve) vai para a F4.6. (2) F4: nervos cutâneos, plexos desenhados, dermátomos L1–S2, articulações menores e arcos do pé, aponeurose plantar e músculos do pé sem malha viram M09–M14; F4.1 ganha inventário, decisão do orçamento de dados e medição de carga. (3) F5 vira “coração e vasos principais” (G): irrigação em todos os músculos, linfáticos, feixes neurovasculares, vasos menores e circulação fetal viram M15–M21. (4) F6 passa à ordem das aulas (respiratório → digestório → sentidos e tegumentar → urinário e masculino → feminino → endócrino → urogenital), com **F6.0 spike** antes do primeiro sistema; o coração sai da antiga F6.1 para a F5; olho e ouvido saem da F7.4 para a F6.3; inervação autonômica, irrigação por víscera, peritônio, regiões clínicas e detalhes internos viram M22–M32. (5) **Conferência do índice** (§5): o BodyParts3D local **não tem** pulmões, pleuras, pericárdio, mediastino, aparelho genital feminino, placenta e estruturas fetais, ossículos e cóclea, tireoide e paratireoides; a lista antiga que citava “tireoide” estava errada. (6) Dívida técnica antiga (geometrias com muita interseção, busca sem sinônimos, desempenho no celular) registrada em M33–M39; **M37 passa na frente se a F4 piorar a carga**. **Nada foi implementado nesta mudança**; só documentação: `project_context.md`, `docs/pontos-de-melhoria.md` (novo), `README.md` e `docs/cobertura.md`. |
| 2026-10-12 | **F4.1 entregue na `dev` (sem publicar).** Pacote `dist/anatomy-leg.js` (1,85 MB; carrega depois do corpo e antes dos nervos), região **Perna** (`membro_inf`), 31 peças ósseas do pé e da perna e a **pele inteira** (155 mil triângulos), que substitui a `pele_corpo`; 8 fichas de ossos (`src/catalog-leg-bones.js`, 404 estruturas); `fetch_body.py` e `convert_body.py` com `--pack`; inventário das 84 peças em `docs/inventario-membro-inferior.md`. **Decisões:** um pacote por região em segundo plano (não sob demanda); pele inteira em vez de pele das pernas emendada (frestas na cintura); dermátomos abaixo da cintura ficam sem cor (M11); o osso do quadril aparece também na região “Perna”. **Medido:** +1,3 s de carga no celular emulado (26,3–26,8 s → 28,4 s; limite do M37: 35 s); no computador, 59 + 93 ms. **Achados:** o banco não tem ligamentos nem meniscos do quadril, joelho e tornozelo, nem a articular do joelho, o extensor curto dos dedos (só o do hálux) e os interósseos dorsais do pé; tem o trato iliotibial e a membrana interóssea da perna. Baixados 5 MB do BodyParts3D (ossos e pele). Testes: `npm test` e `SMOKE_FILE=1 npm run test:smoke` verdes, com um bloco novo no teste de fumaça. **Não feito:** músculos, nervos, articulações e ligamentos do membro inferior (F4.2 a F4.6); medição na máquina de referência; publicação. |
| 2026-10-12 | **F4.2 entregue na `dev` (sem publicar).** 24 músculos do quadril e da coxa com malha real (`catalog-leg-muscles.js`), 428 estruturas (228 músculos, 106 nervos). Nervos adiantados da F4.5, porque a guarda exige nervo para todo músculo: obturatório, glúteo superior, glúteo inferior, nervo do piriforme, nervo do quadrado femoral e gêmeo inferior e isquiático (até a fossa poplítea); o femoral foi prolongado pela coxa e o nervo do obturador interno ganhou o gêmeo superior. Segmentos medulares (Moore) e 4 grupos funcionais novos (quadril, coxa anterior, medial e posterior). **Decisões:** o articular do joelho fica de fora (sem malha: M14); o adutor mínimo é peça própria, com a divergência na nota; o isquiático termina no ápice da fossa poplítea e o tibial e o fibular comum entram na F4.5; glúteos, rotadores e demais músculos ficam só na região “Perna” (os nervos pélvicos, também em “Tronco”). **Medido:** nenhum nervo novo atravessa osso (obturatório 3,7 %; os trechos dentro da pelve); todos os ramos chegam a menos de 1,2 cm do músculo; carga no celular emulado **31,7–32,7 s** (antes 28,4 s). **Alerta:** os nervos custam ≈ 0,37 s cada no celular emulado; os ≈ 7 nervos longos da F4.5 (tibial, fibular comum, fibulares superficial e profundo, plantares), com dezenas de ramos, levariam o total a 35–38 s, no limite de 35 s: **fazer o M37 (carga dos nervos) antes da F4.5**. `docs/miotomos.md` e `docs/revisao-conteudo.md` regenerados. Testes: `npm test` verde, com um bloco novo no teste de fumaça. Baixados 3,2 MB do BodyParts3D. **Não feito:** músculos da perna e do pé (F4.3 e F4.4), os demais nervos (F4.5), articulações e ligamentos (F4.6), publicação. |
| 2026-10-12 | **Desempenho do clique e renderização sob demanda (M37, parte feita).** Queixa: o atlas travava ao tocar numa estrutura. Medido com o novo `tools/perf_click.js` (celular emulado): com algo selecionado o quadro custava até 12× mais (79–89 ms contra 7 ms) porque todo o resto fica translúcido e cada material translúcido de dupla face era desenhado duas vezes. **Corrigido:** `forceSinglePass` (quadro com seleção: 9 ms), `warmShaders()` (o 1º clique compilava 4 programas PBR de uma vez), `syncList()` barata e, depois, **renderização sob demanda** (`invalidate()`, quadro de segurança a cada 2 s, passo de animação com o tempo real). Resultado no celular emulado: 60 → 0,33 quadros por segundo parado; nervos 20,2 → 13,3–14,0 s; tudo pronto 31,7–32,7 → **22,6–24,0 s** (a folga até o limite de 35 s volta a ≈ 11 s para a F4.5). Teste de fumaça novo para a renderização sob demanda (com teste de mutação). **Não medido:** aparelho real (a GPU por software só serve de régua relativa). |
| 2026-10-12 | **Travamento do toque no iPhone 11 (vídeo do responsável).** O vídeo mostra o atlas girando bem e, ao tocar num músculo, ≈ 5 quadros parados e um pulo para a estrutura (sem o voo suave). Causa: a seleção transformava as outras estruturas em fantasmas PBR translúcidos empilhados, o que multiplica o preenchimento na GPU de blocos do iPhone. **Corrigido:** fantasmas viram Lambert baratos que escrevem profundidade e são ordenados do mais perto ao mais longe (4,4 → 18,3 quadros/s perto de uma seleção, na GPU por software), sem trocar `transparent` dos materiais PBR, e **resolução adaptativa** (≤ 1,25× em movimento, cheia em repouso). Carga no celular emulado: 21,8 s. Novos experimentos em `tools/perf_click.js` (`EXP2`, `PROFILE`, `APPJS`). **Não medido:** o iPhone de fato; o responsável confirma no aparelho. |
| 2026-10-12 | **Ordem confirmada e fonte aberta para o aparelho genital feminino.** O responsável confirmou a inversão (F5 e F6 antes de F4.3 a F4.7) e aceitou esquemas por código declarados onde não houver malha; pediu para buscar fonte compatível para o aparelho genital feminino e **descartá-lo só se não houvesse fonte e o esquema por código fosse complexo demais**. **Resultado:** o Human Reference Atlas (HuBMAP, CC BY 4.0) tem útero (20 subestruturas), tubas, ovários, mama, placenta, pelve feminina e **pulmões** em GLB; **o aparelho genital feminino fica no escopo** (F6.5 cai de G para M), com vagina, vulva e ligamentos do útero por código esquemático; os pulmões da F6.1 também vêm do HRA. Z-Anatomy descartado como fonte principal. Calendário até a N2 no início do §6. **Não feito:** download (aguarda confirmação com nome, origem e tamanho); registro dos órgãos no corpo masculino (risco em [`docs/fonte-hra-atlas-de-referencia.md`](docs/fonte-hra-atlas-de-referencia.md) §4). **Ainda não recebido do responsável:** plano de ensino ou lista de estruturas por sistema, e o resultado do teste do toque no iPhone. |
| 2026-10-12 | **F5 entregue na `dev` (sem publicar): coração e vasos principais.** Pacote `dist/anatomy-circ.js` (67 peças, 1,12 MB; baixados 5,8 MB do BodyParts3D com autorização), `src/catalog-circ.js` com 66 fichas (10 estruturas cardíacas, pericárdio esquemático, 31 artérias e 24 veias; o catálogo passa a 500 estruturas), camadas Coração, Artérias e Veias, tour da circulação (8 passos) e da circulação fetal (6 passos, texto), quiz com os novos tipos. **Decisões:** a parede dos dois ventrículos, única no banco, é dividida pela cavidade mais próxima; as cavidades (moldes de sangue) ficaram fora do pacote por brigarem com a face interna da parede; o pericárdio é um casco suavizado declarado como esquema; as coronárias, agregadas no banco, foram separadas nos ramos nomeados; cores: tronco e artérias pulmonares azulados, veias pulmonares avermelhadas. **Medido:** +0,66 s de carga no celular emulado. **Não feito:** vasos da perna e do pé, vasos das vísceras, irrigação por músculo (M15), placenta e cordão (M21), publicação; a nomenclatura das cúspides (TA × FMA) está dita nas fichas sem afirmar a correspondência. Detalhes: [`docs/circulatorio.md`](docs/circulatorio.md). |
| 2026-10-12 | **F6.1 em andamento: pulmões pelo Atlas de Referência Humano (HRA).** Baixado com autorização `lung-male` v1.4 (10,9 MB, CC BY 4.0; em `tools/hra/`, fora do git). O arquivo traz os lobos, os 20 segmentos broncopulmonares e a árvore brônquica; o atlas usa os 5 lobos (segmentos fundidos em cada lobo e o hilo de cada lobo, 16,7 mil triângulos, 114 KB) no pacote `dist/anatomy-resp.js` e as fichas em `src/catalog-resp.js` (505 estruturas). **Decisão de alinhamento:** os dois corpos diferem (tórax vivo do BodyParts3D, pulmões de cadáver no HRA); o ajuste é uma escala **por eixo** (9,16 × 11,01 × 7,51) e translação, calculados por `tools/fit_hra.py` (diafragma, costelas, envelope da caixa torácica, coração e pontas das artérias pulmonares), sem rotação. **Medido no navegador:** os pulmões ficam dentro das costelas, acima do diafragma, com a incisura cardíaca acolhendo o coração. **Pendente:** brônquios e traqueia do BodyParts3D (29 peças, 1,65 MB, aguardando autorização do download; as 20 árvores segmentares repartem os 98 elementos do banco sem sobra) para o refinamento do alinhamento (ICP nos brônquios), as fichas de traqueia, brônquios principais, 20 brônquios segmentares e 6 cartilagens da laringe, pleuras esquemáticas, tour e quiz. Detalhes: [`docs/respiratorio.md`](docs/respiratorio.md). |
| 2026-10-12 | **F6.1 entregue na `dev` (sem publicar): sistema respiratório.** Baixado com autorização o resto das vias aéreas do BodyParts3D (111 elementos, 1,7 MB): traqueia (com os anéis), brônquios principais, as 20 árvores segmentares (repartem os 98 elementos do banco sem sobra) e 6 cartilagens da laringe; juntas aos 5 lobos do HRA, o pacote `dist/anatomy-resp.js` tem 598 KB e o catálogo, **536 estruturas** (36 novas: `catalog-resp.js` e `catalog-resp-airways.js`). **Decisões:** o alinhamento dos pulmões ao tórax ganhou dois termos (brônquios do HRA contra os do BodyParts3D e pontas dos brônquios dentro do casco dos pulmões): escala por eixo 8,99 × 12,00 × 7,14, brônquios dentro dos pulmões com erro de ≈ 2 mm para fora; pleuras e cavidade pleural como esquema (contorno inflado de cada pulmão, declarado na ficha); cartilagens da laringe como fichas de osso na camada Cartilagens; brônquios lobares e pleuras reais ficam fora (o banco não tem). **Medido:** +0,54 s de carga no celular emulado (total 22,1 s). Tour “Sistema respiratório” (7 passos). Detalhes: [`docs/respiratorio.md`](docs/respiratorio.md). **Não feito:** quiz específico dos brônquios, nariz e seios paranasais (depende do plano de ensino), publicação. |
| 2026-10-14 | **F5 fechada (M15 a M21) e publicada (`main` 79a8fc4, release v2.3.10, site no ar).** Pedido do responsável: “fazer tudo o que falta do circulatório”, subir na `main` e acompanhar a release. **Baixado com autorização:** 14,5 MB do BodyParts3D (mais que os 10,6 MB estimados, por incluir as intercostais e a femoral profunda) e a placenta do HRA (4,9 MB, `placenta-full-term-female` v1.1, CC BY 4.0). **Entregue:** 49 vasos novos (38 artérias e 11 veias) com malha real; irrigação dos 228 músculos (`src/irrigation.js`, campo “Irrigação”, lista de músculos na ficha da artéria, guarda que lança erro se faltar); pulsos e relações (`vessel-clinical.js`); 14 feixes neurovasculares com “Isolar o feixe”; quiz “qual artéria irriga X?”; 9 fichas linfáticas, 3 estruturas do sistema de condução e o papilar posteromedial (esquemas por código); circulação fetal (placenta e cordão do HRA, veia e artérias umbilicais, ducto venoso) numa camada opcional desligada por padrão (`optional: true`) e o ligamento arterial; tour fetal atualizado. **Decisões:** vasos ausentes do banco (carótida externa e ramos, glúteas, obturatória, pudenda interna…) ficam no texto da irrigação e ligam ao tronco de origem, em vez de inventar malha; a placenta é mostrada fora do corpo (o corpo é adulto e masculino) e a ficha diz que a posição não é real; a descrição clássica das cúspides da valva da aorta entrou na nota (a do tronco pulmonar continua sem correspondência afirmada). **Medido:** `npm test` completo passa (catálogo, estudo, fumaça); carga no celular emulado 23,5 s (limite 35 s); pacote do circulatório +0,9 MB. **Não feito:** o que está nos “Adiados” da F5. |
| 2026-10-15 | **F5, segunda leva (publicada: `main` eeb648d, release v2.3.11, site no ar).** Pedido do responsável: “implementar o que ainda está faltando do sistema circulatório”, antes de seguir para outra parte. **Baixado com autorização:** 85 elementos do BodyParts3D (3,5 MB; o estimado foi 3,5 MB e o baixado, 3,56). **Entregue:** 25 artérias e 16 veias do banco (encéfalo, órbita, tronco celíaco e mesentéricas, veia porta e afluentes, veias da pelve, da mão e do pé); 19 vasos por código (carótida externa e ramos, jugular externa, retromandibular, facial, glúteas, obturatória, pudenda interna, circunflexa femoral medial, fibular); projeção do coração e focos de ausculta; irrigação, inervação e esqueleto fibroso nas câmaras e valvas; 6 grupos de linfonodos; 4 feixes neurovasculares; 5 tours; irrigação dos músculos da cabeça e da pelve religada aos ramos próprios. **Decisões:** os vasos que o banco não tem seguem por código, declarados como esquema, em vez de ficarem só no texto; o modelo tem uma falha de ≈ 6 cm no pescoço entre as malhas da carótida comum e da interna (a bifurcação foi posta no meio); `NerveBuilder.point` passou a achar a pele do lado direito (sinal de x), necessário para a projeção do coração. **Medido:** `npm test` completo passa (inclusive por `file://`); carga no celular emulado ≈ 29 s em duas medições (23,5 s na medição anterior; o computador estava mais lento desta vez; limite de 35 s do M37), pacote do circulatório de 2,1 para 2,7 MB, +0,6 s para montar as 202 estruturas. **Não feito:** o que está nos “Adiados” da F5. O CI da `dev` falhou uma vez por “Falha ao conectar à porta de depuração do navegador” (o Chrome do runner não abriu); os mesmos testes passaram na Release da `main`. |
| 2026-10-15 | **F4.3 a F4.5 entregues e publicados (`main` 6f567ee, release v2.3.12, site no ar): músculos da perna e do pé e seus nervos.** Pedido do responsável (“desenvolver os músculos da perna que estão faltando”). **Baixado com autorização:** 66 elementos do BodyParts3D (3,3 MB). **Entregue:** 14 músculos da perna, a membrana interóssea, 13 peças de músculos do pé, 6 nervos (tibial, fibular comum, fibulares superficial e profundo, plantares medial e lateral), irrigação, segmentos medulares, 5 grupos de cor e o tour “Perna e pé”; o catálogo passa a **706 estruturas** (255 músculos, 112 nervos). **Decisões:** o extensor curto dos dedos e os interósseos dorsais ficam fora (o banco não os tem, M14); as divergências de inervação e de segmentos entre Moore e Gray's estão nas notas (flexores longos, flexor curto do hálux, fibulares). **Medido:** com os 6 nervos, a carga no celular emulado foi a 33,6–35,8 s; fiz a medida “nervos mais leves” (anel a cada 4 mm e 6 lados, nos nervos e nas áreas de clique), que a levou a **29,6 s**. `npm test` verde. **Não feito:** articulações e ligamentos do membro inferior (F4.6), contagens finais (F4.7). |
| 2026-10-17 | **Auditoria e validação completa de todo o conteúdo e código (706 estruturas; publicada na release v2.3.13).** Conferência sistemática de catálogo, vínculos, geometria 3D no navegador, modos de quiz, interface e documentação. **Corrigido:** (1) `src/main.js`: quiz de múltipla escolha (`nextQuestion`) complementava menos de 4 alternativas quando uma região tinha ≤ 3 itens do mesmo tipo (`traqueia` em cabeça, `linha_alba` e `art_esternoclavicular` em tronco, `membrana_interossea_perna` em perna, ou as 3 glândulas); quiz de localizar (`nextLocate` e `locateHint`) não ativava camadas opcionais (`fetal`) quando uma estrutura fetal vinha de lista personalizada ou favoritos; (2) fichas com notas anacrônicas anteriores às fases F4/F5 (`papilar_ve`, `veia_hemiazigo`, `arteria_subclavia`, `obturador_interno`, `n_laringeo_recorrente`, `n_espinais_lombares` e `feixe_popliteo`); (3) vínculos e regiões: acrescentados os feixes neurovasculares tibial anterior e tibial posterior (20 feixes em `src/neurovascular.js`), `relacionados` nas 6 cartilagens da laringe (`src/catalog-resp-airways.js`), `region: ['tronco', 'membro_inf']` nas artérias glúteas, obturatória, pudenda interna e no `n_obturador_interno`, e artérias do catálogo citadas no texto de `src/irrigation.js` (`arteria_meningea_media`, `arteria_escapular_dorsal`, `arteria_tireoidea_inferior`, `arteria_pudenda_interna`, `arteria_glutea_inferior`, `arteria_femoral`, `arteria_poplitea`); (4) `tools/gen_revisao.js` e `docs/revisao-conteudo.md` regenerado, além de `index.html`, `manifest.webmanifest`, `README.md`, `AGENTS.md`, `project_context.md` e `docs/*.md` alinhados às 706 estruturas. |
| 2026-10-17 | **F6.2 entregue na `dev` (sem publicar): sistema digestório e baço.** Pedido do responsável (“começa a F6.2 com o sistema digestório”). **Baixado:** 100 elementos do BodyParts3D (≈ 2,5 MB). **Entregue:** pacote `dist/anatomy-digest.js` (34 peças, 687 KB; 510 KB em gzip), `src/catalog-digest.js` com 34 fichas (esôfago, estômago, duodeno, jejuno, íleo, ceco, apêndice vermiforme, colos ascendente, transverso, descendente e sigmoide, tênias do colo, reto, canal anal, 8 segmentos hepáticos de Couinaud, vesícula biliar, 5 ductos biliares, pâncreas, ducto pancreático, baço e 3 mesos peritoneais; o catálogo passa a **740 estruturas**), camada “Sistema digestório e baço”, ligações cruzadas nos dois sentidos (`relacionados`) com glândulas salivares, língua, faringe, diafragma e árvore vascular/porta, e tour “Sistema digestório: do esôfago ao reto, fígado e pâncreas” (8 passos). **Decisões:** os conceitos que o BodyParts3D agrega numa malha só foram divididos por corte geométrico (`split_cut` em `tools/convert_body.py`) nos marcos anatômicos reais: `FJ2566` em ceco (`y < -6,22`) e colo ascendente (`y >= -6,22`); `FJ2567` em colo descendente (`y >= -6,32` e `x >= 0,58`) e colo sigmoide (alça pélvica); `FJ2571` em reto (`y >= -7,46`) e canal anal (`y < -7,46`, flexura anorretal); `FJ3079` em ducto hepático comum (`y >= -4,51`) e ducto colédoco (`y < -4,51`, junção com o cístico). O segmento IV do fígado usa os dois nomes consagrados (lobo quadrado / segmento IV de Couinaud), com a ressalva de IVa/IVb na nota. **Medido:** `npm test` e `SMOKE_FILE=1 npm run test:smoke` 100% verdes, com bloco específico da F6.2 conferindo posição, cortes, interseção duodeno-pâncreas e ligações. Detalhes: [`docs/digestorio.md`](docs/digestorio.md). **Não feito:** omentos maior e menor e recessos peritoneais (sem malha no banco, M24), publicação. |
| 2026-10-22 | **Auditoria de fidelidade (sem mudança no código do atlas).** Pedido do responsável: nota de 0 a 100 por sistema, região e origem de modelo. Leitura das 740 fichas contra Moore, Gray's e TA e bateria geométrica no navegador (`.claude/fidelidade.js`). **Resultado:** texto 96, geometria 86, fidelidade do que existe 91, 34 de 35 checagens de posição e tamanho de livro-texto, cobertura do corpo inteiro 36 (63 nos 8 sistemas iniciados). **Achados a corrigir:** um erro factual (`lig_alar` × membrana tectória), nomenclatura de Couinaud contraditória sem nota, seis notas desatualizadas pela F6.2, linfonodos do mediastino dentro do manúbrio e vasos superficiais da cabeça fora da pele. Detalhes: [`docs/auditoria-fidelidade.md`](docs/auditoria-fidelidade.md). |
| 2026-10-22 | **Correções da auditoria.** Textos: `lig_alar`, nota TA × Couinaud nos segmentos do fígado (e em `digestorio.md`), seis notas desatualizadas, radial 2½, inserção do obturador interno, segmentos do gêmeo superior (`segments.js`), inserções do osso do quadril, nota do peitoral, grafia e termos do digestório, tamanho da vesícula declarado. **Geometria — causa encontrada:** o `jointContext` não tinha ossos, e por isso os pontos `{ skin, d }` do pacote circulatório ficavam sobre a pele antiga (`pele_corpo`) e ignoravam a profundidade; agora o `loadCirc` passa a `pele_inteira` e os ossos, e o `buildTube` (`proc.js`) põe pontos intermediários sob a pele, como os nervos. Linfonodos do mediastino e paraesternais reposicionados (0 % em osso), veia umbilical e ducto venoso redesenhados até a veia porta e a cava pelo fígado, cutâneo lateral inferior do braço contornando o úmero. **Notas depois:** texto 98, geometria 87, fidelidade 92 (cobertura igual). `npm test` e `SMOKE_FILE=1` verdes. |
| 2026-10-22 | **F6.2 e correções da auditoria publicadas (`main` 4941f76, release v2.3.14, site no ar).** Pedido do responsável (“faz os commits e os merges pra main”). Três commits na `dev` (F6.2; pendências por sistema; auditoria), `npm test` verde no estado commitado, avanço direto da `main` e push; CI, Release e Pages verdes. O rodapé do site mostra 2.3.13 porque o Pages numera pelas próprias execuções (o cache do service worker trocou, então o PWA atualiza). |
| 2026-10-22 | **Site sempre na versão publicada.** O responsável viu a lista lateral toda aberta: era uma versão antiga servida pelo cache do service worker (a lista já começa fechada desde a v2.3.13). O `sw.js` passou de “cache primeiro” para “rede primeiro” com revalidação, com a cópia guardada só offline; transição única da geração antiga (cache `anatomia3d-` → `body3d-`) e recarga única no `index.html` se a versão publicada mudar. Detalhes em `docs/publicacao-web.md`. |

## 11. Referências

- Moore, Dalley & Agur — *Anatomia orientada para a clínica*.
- Standring (ed.) — *Gray's Anatomy*; Netter — *Atlas de anatomia humana*; Sobotta — *Atlas de anatomia humana*.
- *Terminologia Anatomica* (FIPAT, 2ª ed.) e a *Terminologia Anatômica* em português da Sociedade Brasileira de Anatomia.
- Kendall et al. — *Músculos: provas e funções* (miótomos, testes); Kapandji — *Fisiologia articular* (movimentos).
- BodyParts3D, © DBCLS, CC BY-SA 2.1 Japão — <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/>.
