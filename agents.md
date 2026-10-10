# agents.md — guia para agentes de código (e para quem mexer no projeto)

Instruções para qualquer agente ou pessoa que trabalhe neste repositório. Leia inteiro antes da primeira alteração; as
seções 6, 7 e 9 são as que mais evitam retrabalho e acidentes.

## 1. Leia primeiro

1. [`project_context.md`](project_context.md) — **o roteiro**: o que fazer, em que ordem, com que critérios de saída.
   Trabalhe no item da fase atual; não pule fases sem registrar a decisão em §10 do roteiro.
2. [`README.md`](README.md) — o que o atlas faz hoje, estrutura de arquivos, licença dos dados, como gerar o `.exe`.
3. Este arquivo — como trabalhar sem quebrar nada.

## 2. O projeto em um minuto

Atlas 3D de anatomia em **português** (cabeça, tronco e membros superiores hoje): pele, fáscias, 160 músculos, 55 nervos,
ossos, ligamentos, glândulas, com dissecação por camadas, fichas e quiz. Roda em qualquer navegador **por `file://`**
(sem servidor) e é empacotado como `Anatomia3D.exe`, que **se atualiza sozinho** a cada release do GitHub
(`KaueChristian/3DBody`). Malhas reais vêm do BodyParts3D (CC BY-SA 2.1 JP); o que o banco não tem é modelado por código.

Stack: Three.js 0.170 + three-mesh-bvh, empacotado com esbuild em um único `dist/app.js` (IIFE). Sem framework de UI.
Ferramentas de dados em Python (numpy); lançador do Windows em C# (.NET Framework, compilado pelo `csc.exe` do sistema).

## 3. Comandos

Windows 11; shell padrão PowerShell, com Git Bash disponível. Node 22+, Python 3.12 com `numpy`.

```bash
npm install          # uma vez
npm run watch        # recompila src/ → dist/app.js ao salvar (com sourcemap)
npm run build        # dist/app.js minificado (obrigatório antes de commitar mudanças em src/)
npm start            # opcional: servidor local em http://localhost:5173 (index.html também abre por file://)
npm run exe          # build completo local: release/Anatomia3D.exe, app.zip e version.json
```

`npm test` roda, em ordem: `tests/test_catalog.js` (catálogo, tours e grupos musculares), `tests/test_study.js` (lógica das
ferramentas de estudo, sem navegador) e `tests/smoke_test.js` (Chrome/Edge sem janela, dirigindo a interface; com
`SMOKE_FILE=1` abre o `index.html` por `file://`). Cada um também roda sozinho: `npm run test:catalog`, `test:study`,
`test:smoke`. A CI roda `npm test`. Antes de terminar mudanças em `src/`, rode `npm run build` e depois `npm test`.

Dados (raramente necessário; baixa ~60 MB e regenera arquivos grandes — só com motivo):
`python tools/fetch_*.py` → `python tools/convert_*.py` (ver README, “Regenerar os dados”).

## 4. Mapa do repositório

| Caminho | O que é | Cuidado |
| --- | --- | --- |
| `src/catalog.js` | Junta os catálogos; camadas, regiões, `INNERVATION`, **guardas** | Guardas lançam erro na carga: não as enfraqueça para “fazer passar” |
| `src/catalog-muscles.js` | Músculos da cabeça e do pescoço | |
| `src/catalog-body-muscles.js` | Músculos do tronco e do membro superior | |
| `src/catalog-bones.js`, `catalog-body-bones.js` | Ossos, dentes, cartilagens, discos | |
| `src/catalog-nerves.js` | 55 nervos: textos, trajetos, `ramos` (fonte única músculo ↔ nervo) | Pontos medidos no modelo; ver §8 |
| `src/catalog-other.js` | Ligamentos, fáscias, glândulas, pele | |
| `src/nerve-geo.js` | `NerveBuilder`: resolve pontos, gera tubos e ramos até os músculos | |
| `src/proc.js`, `surfaces.js`, `landmarks.js` | Geometria procedural, projeção na pele/osso (BVH), pontos de referência | |
| `src/anatomy.js` | Descompacta as malhas de `dist/anatomy-*.js` | |
| `src/main.js` | Cena, interface, rótulos, quizzes de localizar e de escolher o nome (≈ 1 700 linhas) | **Não aumente**: extraia módulos novos |
| `src/framing.js` | Enquadramento de estruturas pares (esfera só do lado escolhido) | |
| `src/study/*.js` | Ferramentas de estudo (modal, progresso, listas, tours, corte, cores, quiz teórico, backup); `groups.js` mapeia cada músculo a um grupo | O `main.js` só expõe uma interface (`api`) ao `StudyController`; veja §8 |
| `index.html`, `styles.css` | Página e estilos | A ordem dos `<script>` importa |
| `dist/` | **Versionado.** `app.js` (build) e pacotes de dados `anatomy-*.js` | Ver §9 |
| `tools/*.py` | Pipeline de dados do BodyParts3D (`body_parts.py` define as peças do corpo por nome de conceito) | Gera arquivos de MB |
| `tools/build_exe.py`, `tools/launcher/Launcher.cs` | Empacotador e lançador com atualização automática | Ver §10 |
| `.github/workflows/release.yml` | CI: push na `main` → release | Ver §9 |
| `project_context.md`, `README.md`, `agents.md` | Documentação | Mantenha em dia |

A pasta acima (`Documents/port/`) tem **outros projetos sem relação**. Não toque neles.

## 5. Modelo de dados e convenções

**Espaço:** x = esquerda do sujeito, y para cima, z para frente, **1 unidade = 10 cm**. Desenha-se só o lado esquerdo
(x > 0); o direito é espelhado (`paired: false` desliga o espelho).

**Entrada de catálogo** (todas as estruturas):

```js
{
  region: 'tronco',            // 'cabeca' | 'tronco' | 'membro_sup' | 'todos' | lista (ex.: ['cabeca','tronco'])
  kind: 'musculo',             // musculo | nervo | osso | ligamento | fascia | glandula | estrutura
  id: 'peitoral_clav',         // único; snake_case sem acento
  name: 'Peitoral maior — parte clavicular',
  latin: 'M. pectoralis major, pars clavicularis',
  layer: 'sup',                // um id de LAYERS em catalog.js (define profundidade e cor)
  parts: [...] ou proc: [...], // malha real (BodyParts3D) ou geometria procedural
  campos: [['Ação', '…'], ['Origem', '…'], ['Inserção', '…'], ['Inervação', '…']],
  nota: '…',                   // curiosidade clínica / divergência entre fontes
}
```

- **Prefixos de id:** `o_` ossos, `lig_` ligamentos, `n_` nervos; músculos sem prefixo (`grande_dorsal`). Lados: sem sufixo.
- **Músculos** são criados por helpers (`bm(...)` no tronco e membro superior, `mus(...)` na cabeça e pescoço) com `campos`
  na ordem Ação · Origem · Inserção · Inervação.
- **Nervos** usam `nervo(id, nome, latim, região, geom, {origem, trajeto, ramos, sensibilidade, lesao, nota}, extra)`;
  `ramos: [{ m, obs?, sens?, path?, t?, semRamo? }]` liga o nervo aos músculos e **gera** `INNERVATION`.
  Trajetos (`paths`) são listas de pontos: coordenadas, `SK` (na pele), `CAST` (raio contra uma estrutura), `{ sec }` /
  `{ between }` (corte entre estruturas), e helpers como `foramen(n)`, `RIB`, `DISC`.
- **Textos em português do Brasil**, acentuados, termos da Terminologia Anatômica; latim em `latin`. Mantenha a densidade e o
  tom das fichas vizinhas.
- Comentários explicam o **porquê** (medida, fonte, armadilha), não o óbvio. Siga o estilo do arquivo que estiver editando.

## 6. Verificar o seu trabalho

### 6.1 Integridade do catálogo (sem navegador)

O catálogo é módulo ES com guardas; empacote e carregue no Node:

```bash
npx esbuild src/catalog.js --bundle --format=cjs --platform=node --outfile="$TEMP/cat.cjs" --log-level=error
node -e "const c=require(process.env.TEMP+'/cat.cjs'); console.log(c.ITEMS.length,'estruturas')"
```

Se lançar `Identificador duplicado…`, `Nervo aponta para estrutura inexistente…` ou `Músculos sem nervo…`, o catálogo está
errado — corrija os dados. Contagens esperadas hoje: 367 estruturas (204 músculos, 100 nervos e gânglios, 38 ossos, 12 ligamentos,
3 fáscias, 3 glândulas, 7 estruturas, entre elas a medula espinal).

### 6.2 Verificação visual (obrigatória para qualquer mudança de geometria ou interface)

Use o navegador embutido do app (ferramentas `mcp__Claude_Browser__*`) abrindo `index.html` (ou `npm start`).

- A API de depuração é `window.__app`: `select(id)`, `setDissect(n)`, `setRegion(r)`, `viewPreset(nome)`, `flyTo(...)`,
  `nerveBuilder`, `scene`, `camera`, `renderer`, `THREE`, `state`, `startLocate`, etc.
- Se o painel do navegador estiver **oculto**, o canvas fica com tamanho 0: use `resize_window` e chame
  `__app.renderer.render(__app.scene, __app.camera)` manualmente antes da captura.
- Confira: console **sem erros**, ao menos 3 vistas da região, com e sem músculos/pele, e o estado do quiz quando mexer nele.
- Para nervos: nenhum trecho atravessando osso sem motivo (métrica usada até hoje: ≈ 4,4 % dos pontos dentro de osso,
  quase só em trechos intraósseos reais, como canais e forames) e todo ramo chegando à superfície do músculo.

### 6.3 Executável

Mudou `tools/build_exe.py`, `tools/launcher/` ou o fluxo de atualização? Rode `npm run exe` e teste o `.exe` gerado, incluindo
`--extrair` e `--sem-atualizar`, e leia `%LOCALAPPDATA%\Anatomia3D\atualizacao.log`.

## 7. Regras de conteúdo anatômico

Este é um material de estudo: **um fato errado prejudica quem estuda**. Por isso:

1. **Fonte antes de afirmar.** Origem, inserção, ação, inervação, segmentos medulares, trajeto e lesões devem poder ser
   conferidos em Moore/Dalley/Agur, Gray's, Netter, Sobotta ou na Terminologia Anatômica. Não invente nem complete de memória
   o que não souber com segurança — deixe o campo de fora e diga que falta.
2. **Divergência entre fontes** (muito comum em segmentos medulares e variações) vai para a `nota`, citando o que cada uma diz.
3. **Texto próprio.** Não copie frases de atlas nem de sites; escreva a partir dos fatos.
4. **Geometria aproximada é aproximada.** Se uma estrutura foi modelada por código, a ficha não deve sugerir precisão que não há.
5. **Completude:** todo músculo esquelético tem pelo menos um nervo (a guarda exige); ao acrescentar um músculo, acrescente
   a inervação no mesmo lote. O mesmo vale para futuras irrigação e ação (veja o roteiro).
6. **Nomes:** PT-BR da Terminologia Anatômica; se houver mais de um uso corrente, o principal em `name` e o outro na ficha.
7. Atribuição e licença do BodyParts3D permanecem visíveis (rodapé e README). Não remova.

## 8. Receitas

**Acrescentar um músculo**
1. Veja se o BodyParts3D tem a malha (procure o nome do conceito em `tools/isa_element_parts.txt`). Se tiver — tronco e
   membros: defina a peça em `tools/body_parts.py` (por nome de conceito) e rode `fetch_body.py` + `convert_body.py`; cabeça:
   `fetch_parts.py` + `convert.py` (usam `want.json`). Se não tiver, descreva um `proc` (ver README, “Acrescentar uma
   estrutura procedural”).
2. Crie a entrada no catálogo da região, com `campos` completos e fonte.
3. Acrescente-o em `ramos` do(s) nervo(s) que o inervam em `catalog-nerves.js` (sem isso a carga falha).
4. Escolha o grupo dele em `src/study/groups.js` (usado na coloração por grupo; o `npm run test:catalog` falha se faltar).
5. `npm run build`, `npm test`, verificação §6.1 e §6.2 (a ficha mostra o chip do nervo; o nervo chega ao músculo).

**Acrescentar um nervo**
1. Crie com `nervo(...)`; defina `paths` com pontos **medidos no modelo** (use `window.__app.nerveBuilder` para testar
   `section`, `cast`, `closest`); evite pontos soltos no espaço.
2. Liste os músculos em `ramos`; use `path`/`t` quando só um trecho deve gerar ramos.
3. Verifique que não atravessa osso (§6.2). Normais das malhas do BodyParts3D são **inconsistentes**: use os helpers de
   ancoragem (`on`, `cast`, `skin`, `sec`, `between`), não suponha o lado da malha.

**Região ou sistema novo** (membro inferior, vasos, vísceras…)
1. Novo pacote de dados `dist/anatomy-<nome>.js` carregado em segundo plano, **dentro do orçamento de tamanho** do roteiro.
2. Novo valor em `REGIONS`/botões/quiz; camadas novas em `LAYERS` com profundidade coerente.
3. Guardas equivalentes às de `catalog.js` para o novo vínculo (ex.: todo músculo com irrigação).
4. Atualize `index.html` (ordem dos scripts), `tools/build_exe.py` (`FILES`) e o README.

**Funcionalidade de interface**
1. Módulo novo em `src/` (não inflar `main.js`); estilos em `styles.css`; texto em PT-BR.
2. Tem de funcionar **offline e por `file://`**: sem CDN, sem `fetch` de arquivo local, sem módulos ES em tempo de execução.
3. Leitura/escrita de `localStorage` sempre em `try/catch` e com a interface funcionando se falhar.
4. Teclado e `aria-*` desde o começo; teste em celular: **iPhone 11 (414×896) é o tamanho mínimo**, também deitado, e tablets até 11,5" (≈ 834–1194 px; o de 2200×1440 a 229 ppi dá ≈ 1100×720 e 720×1100), em pé e deitados. O `smoke_test.js` emula esses tamanhos e acusa sobreposição entre os painéis do palco; use `var(--safe-*)` em elementos fixos e fonte ≥ 16 px em campos. Painéis da base do palco entram no `.dock` (não em `position: absolute` solto), e regras da gaveta que sobrepõem regras-base ficam no fim do `styles.css`.
5. Tudo que vem de fora (backup importado, hash da URL, nomes digitados) entra no HTML escapado (`esc` de `src/study/util.js`) ou por
   `textContent`/`.value`, nunca em `innerHTML` cru; o importador valida tipos e tamanhos (`sanitize` em `storage.js`).
6. Se o estado afeta a vista (camadas, corte, cores…), ele precisa ir e voltar pelo hash (`views.js`); o que não está no hash vale o padrão.

## 9. Git, releases e limites de autonomia

- **Branches:** `dev` para trabalhar, `main` publica. **Push na `main` gera uma release que chega a todos os usuários do
  `.exe` em minutos.** Não faça push na `main`, não dispare o workflow e não crie/mexa em releases sem pedido explícito do
  responsável. Nunca use `--force` na `main`.
- **Release:** `.github/workflows/release.yml` roda em push na `main` quando mudam `src/`, `index.html`, `styles.css`,
  `dist/`, `tools/launcher/`, `tools/build_exe.py`, `package*.json` ou o próprio workflow (mudanças só em `*.md` ou
  `tools/*.py` de dados **não** publicam). Versão = `major.minor` do `package.json` + número da execução.
- **`dist/` é versionado:** depois de mudar `src/`, rode `npm run build` e commite `dist/app.js` junto. Não regenere
  `dist/anatomy-*.js` sem necessidade (arquivos de vários MB incham o repositório).
- **Commits:** em português, no estilo do histórico (`Nervos: 55 nervos ligados a todos os 154 músculos`); um assunto por
  commit; mensagem diz o que e por quê. Não altere `user.name`/`user.email`: a identidade desta pasta já é configurada por
  `includeIf` em `~/.gitconfig-pessoal`, e a conta do GitHub é **KaueChristian**.
- **Peça confirmação antes de:** publicar (push na `main`, release, tags), criar ou apagar repositórios/branches remotas,
  apagar arquivos do usuário, instalar algo fora do projeto, enviar dados para serviços externos.
- Não faça commit de `node_modules/`, `build/`, `release/`, binários de teste, tokens ou chaves.
- Terminadores de linha: LF (`.gitattributes`). Não converta arquivos para CRLF.

## 10. Armadilhas conhecidas

- **Launcher.cs:** o hash do arquivo (`LauncherHash`) vai para o `version.json`; mudar o lançador faz o `.exe` trocar a si
  mesmo na abertura seguinte. Teste a troca (`npm run exe`) antes de publicar; um lançador quebrado afeta todos.
- **O atualizador apaga versões antigas** (`RemoveOldVersions`): não há volta local. Daí a importância de não publicar com o
  catálogo quebrado.
- **Bundle é IIFE.** Funciona de `file://`; trocar o formato ou usar `type="module"` quebra a abertura por duplo clique.
- **Ordem de scripts em `index.html`:** `version.js` → `anatomy-data.js` → `anatomy-nerves.js` → `app.js` (o corpo é carregado
  depois, em segundo plano).
- **Heredocs com crases no shell** quebram; escreva scripts Python/JS em arquivos temporários (use o diretório de rascunho da
  sessão) em vez de embuti-los no comando.
- **PowerShell vs Bash:** sintaxes diferentes (`$env:VAR` vs `$VAR`, `&&` só no PowerShell 7). Caminhos com espaços entre aspas.
- **Normais do BodyParts3D inconsistentes:** raios e deslocamentos “para fora da malha” falham; use os helpers com fallback.
- **Desempenho:** a construção dos 55 nervos leva ≈ 0,6 s (já foi 4,6 s). Prefiltre por caixa envolvente antes de consultas BVH
  exatas e ceda o laço ao navegador a cada poucos itens.
- **Quiz:** a pele e as fáscias translúcidas não podem bloquear o clique; nomes ficam ocultos durante a pergunta. Teste ao mexer
  em seleção, rótulos ou lista.

## 11. Definição de pronto

Antes de dizer que um trabalho está terminado:

- [ ] Catálogo carrega sem erro (§6.1) e as contagens do README conferem.
- [ ] `npm run build` feito e `dist/app.js` atualizado.
- [ ] Verificação visual feita (§6.2), console limpo.
- [ ] Conteúdo conferido nas fontes (§7); divergências anotadas.
- [ ] Funciona de `file://` e continua dentro do orçamento de dados.
- [ ] `project_context.md` (status, §10) e `README.md` atualizados; atribuição de licença intacta.
- [ ] Nada publicado sem autorização; o relatório final diz o que foi feito, o que foi testado e o que **não** foi.
