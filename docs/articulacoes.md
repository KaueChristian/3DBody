# Articulações e ligamentos (F3)

Registro da fase **F3** do roteiro (`project_context.md`): o modelo de articulação, as decisões de geometria e a cobertura. A F3 foi
quebrada em três lotes: **F3a** (modelo e membro superior — este documento cobre o que já foi feito), **F3b** (coluna, tórax, pelve
e cabeça) e **F3c** (movimento: página de movimentos, origem e inserção no osso, animação, quizzes de função).

## 1. Modelo de dados (F3.1)

Cada articulação é uma entrada `kind: 'articulacao'` em `src/catalog-joints.js`, com id `art_*`:

| Campo | Conteúdo |
| --- | --- |
| `campos` | Tipo · Superfícies articulares · Cápsula e membrana sinovial · Ligamentos · *Movimentos e amplitude* (gerado) · Inervação · Irrigação |
| `ossos` | ossos do catálogo que se articulam |
| `ligamentos` | ids dos ligamentos próprios (fichas `kind: 'ligamento'`, também em `catalog-joints.js`) |
| `movimentos` | `[{ mov, amp, agon: [principais], sin: [auxiliares], obs }]` |
| `nervos` | nervos que dão ramos articulares |
| `fontes` | referências mostradas na ficha |

Vínculos derivados em `src/catalog.js`, no mesmo espírito dos `ramos` dos nervos (uma fonte só para cada vínculo):

- **`MOVEMENTS`**: músculo → `{ articulação, movimento, papel: principal | auxiliar }`. Alimenta a seção *Movimentos
  (articulações)* da ficha do músculo e é a base do item F3.5 (filtro e quiz por movimento ainda não feitos).
- **`JOINTS_OF`**: osso ou ligamento → articulações de que faz parte (seção *Articulação/Articulações* da ficha).
- **Ramos articulares**: cada nervo citado em `nervos` ganha `{ m: art_*, obs: 'ramo articular', sens: true, semRamo: true }`,
  então a ficha do nervo lista a articulação e a da articulação mostra os nervos, sem desenhar ramo novo.

**Guardas na carga** (lançam erro, como as de inervação): osso citado inexistente; cápsula que usa peça de malha fora dos ossos
citados; menos de dois ossos (contando as peças, quando o osso é um grupo como o carpo ou as falanges); ligamento inexistente;
movimento com músculo inexistente; nervo inexistente. O `npm run test:catalog` confere ainda: campos obrigatórios, ao menos um
movimento por articulação, nenhum músculo como principal e auxiliar no mesmo movimento, **todo músculo do membro superior com ao
menos um movimento** (exceto o palmar curto, que só move a pele) e todo ligamento das articulações ligado a uma delas (exceto a
membrana interóssea, que é ela mesma uma sindesmose).

## 2. Geometria

O BodyParts3D não traz cápsulas nem ligamentos do membro superior: tudo aqui é **modelado por código** sobre as malhas reais dos
ossos, e a ficha mostra o selo “Modelada por código (aproximada)”.

- **Cápsula** (`kind: 'capsule'`, `src/joint-geo.js`): na carga do corpo, juntam-se os vértices de um osso que ficam a menos de
  `gap` do outro (a zona em que as superfícies articulares se encaram) e desenha-se um elipsoide translúcido nos eixos principais
  dessa nuvem. É um envoltório esquemático: não mostra recessos, bainhas nem a linha exata de inserção da cápsula. A medida é feita
  uma vez no lado esquerdo e espelhada; um pré-filtro por caixa envolvente evita consultas desnecessárias ao BVH.
- **Ligamentos**: faixas (`tube`) cujas pontas são pontos medidos no modelo e “encaixados” na superfície do osso (`{ on: peça, p,
  d }`, o mesmo resolvedor dos nervos). Os colaterais dos dedos (`kind: 'collateral'`) são calculados pela zona de contato de cada
  articulação, um de cada lado; a membrana interóssea (`kind: 'web'`) é uma lâmina entre as margens mais próximas do rádio e da
  ulna; o ligamento anular é um anel (`torus`).
- **Medida de qualidade:** fração dos vértices de cada ligamento dentro de osso (a mesma métrica dos nervos). Como as pontas se
  prendem ao osso, ≈ 5–12 % é o esperado. Valores medidos na entrega: veja §5.
- Várias cápsulas e colaterais dos dedos são juntados numa malha só (`kind: 'group'`) para não multiplicar chamadas de desenho.

## 3. Cobertura do membro superior (F3.2)

| Articulação (TA) | No atlas | Ligamentos com ficha | Só no texto |
| --- | --- | --- | --- |
| Esternoclavicular | `art_esternoclavicular` | esternoclaviculares anterior e posterior, interclavicular, costoclavicular | disco articular |
| Acromioclavicular | `art_acromioclavicular` | acromioclavicular, coracoclavicular (trapezóideo e conoide) | disco incompleto |
| Escapulotorácica (funcional, fora da TA) | `art_escapulotoracica` | — | — |
| Ombro (glenoumeral) | `art_ombro` | glenoumerais, coracoumeral, coracoacromial | lábio glenoidal, transverso do úmero |
| Cotovelo (umeroulnar e umerorradial) | `art_cotovelo` | colateral ulnar, colateral radial | — |
| Radiulnar proximal | `art_radiulnar_proximal` | anular do rádio | quadrado |
| Radiulnar distal | `art_radiulnar_distal` | — | radiulnares anterior e posterior, disco articular (complexo fibrocartilagíneo triangular) |
| Sindesmose radiulnar | `lig_membrana_interossea` (ficha de ligamento) | — | — |
| Radiocarpal | `art_radiocarpal` | radiocarpais palmar e dorsal, colaterais do carpo | — |
| Intercarpais e mediocarpal (com a do pisiforme) | `art_intercarpais` | — | intercarpais palmares, dorsais e interósseos, pisoamato, pisometacarpal |
| Carpometacarpal do polegar | `art_cmc_polegar` | — | ligamentos próprios (nomenclatura variável) |
| Carpometacarpais II–V e intermetacarpais | `art_carpometacarpais` | — | carpometacarpais e intermetacarpais |
| Metacarpofalângicas | `art_metacarpofalangicas` | colaterais dos dedos, metacarpal transverso profundo | placas palmares |
| Interfalângicas | `art_interfalangicas` | colaterais dos dedos | placas palmares |

O retináculo dos flexores, que já existia, continua como ligamento sem articulação. Bursas, bainhas sinoviais, retináculo dos
extensores e aponeurose palmar são o item F3.7.

## 4. Conteúdo e fontes

- **Fichas** (tipo, superfícies, cápsula, ligamentos, inervação, irrigação, notas clínicas): Moore, Dalley & Agur, cap. 6; Gray’s
  Anatomy (42ª ed.); Terminologia Anatômica (FIPAT, 2019).
- **Músculos principais e auxiliares** de cada movimento: tabelas de movimentos de Moore (ombro, cotovelo, radiulnares, punho,
  dedos e polegar) e da escápula.
- **Amplitudes**: valores de referência da AAOS, como em Norkin & White (*Medida do movimento articular*). Outras tabelas diferem em
  alguns graus (a extensão do ombro, por exemplo, aparece como 45° em Kendall); onde a diferença importa, a ficha diz.
- **Lacunas declaradas na ficha:** a inervação das carpometacarpais (do polegar e do 2º ao 5º dedo) varia entre as fontes e não
  está ligada a nervos; as amplitudes de abdução e adução dos dedos e da esternoclavicular não são dadas.

## 5. Verificação da entrega F3a

Veja o registro de 2026-10-10 em `project_context.md` §10 para o resumo. Fração de vértices dentro de osso por ligamento, medida no
navegador (`.claude/joints.js`, `INBONE`):

| Ligamento | % dentro de osso | Observação |
| --- | --- | --- |
| esternoclaviculares | 2 | |
| interclavicular | 0 | |
| costoclavicular | 13 | curto (≈ 7 mm): as duas pontas pesam |
| acromioclavicular | 0 | |
| coracoclavicular | 8 | |
| coracoacromial | 12 | |
| coracoumeral | 8 | |
| glenoumerais | 0 | desenhados sobre a cabeça do úmero |
| colateral ulnar | 13 | |
| colateral radial | 3 | |
| anular do rádio | 20 | todo dentro da ulna: é o trecho em que a incisura radial fecha o anel |
| membrana interóssea | 13 | ao longo das margens interósseas |
| radiocarpais | 5 | |
| colaterais do carpo | 0 | |
| colaterais dos dedos | 2 | |
| metacarpal transverso profundo | 12 | |
