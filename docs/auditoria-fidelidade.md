# Auditoria de fidelidade (2026-10-22)

Pedido do responsável: verificar com rigor os sistemas, as peças e os modelos que já estão no atlas e dar uma nota de 0 a 100
para cada sistema, região e origem de modelo, comparando com o que dizem os atlas e livros de referência (Moore, Gray's,
Netter, Terminologia Anatômica). Estado auditado: catálogo da `dev` com a F6.2 (740 estruturas), sem commit.

Duas rodadas no mesmo dia: a **auditoria** (só medição) e, a pedido do responsável, as **correções** do que ela achou, seguidas da
mesma bateria de novo. As tabelas mostram as duas notas (antes → depois).

## 1. Método

Três notas independentes, todas de 0 a 100:

| Nota | O que mede | Como foi medida |
| --- | --- | --- |
| **Texto** | Exatidão das fichas: origem, inserção, ação, inervação, irrigação, trajeto, relações, clínica, nomes e latim | Leitura integral das 740 fichas (≈ 4 900 linhas despejadas do catálogo) contra Moore, Gray's e a TA; `.claude/lint.js` para forma. Desconto por achado: erro factual −20 na ficha, inconsistência ou nota desatualizada −8, divergência sem nota −5 |
| **Geometria** | Forma, tamanho e posição das malhas | Bateria no navegador (`.claude/fidelidade.js`): para cada estrutura, % dos pontos dentro da pele, % dentro de osso a mais de 3 mm da superfície, tamanho em cm; 35 checagens de posição e tamanho contra valores de livro-texto; sobreposição entre 20 pares de órgãos vizinhos; contenção no pericárdio e nas pleuras. Nota-base pela origem (BodyParts3D 95, HRA 85, trajeto por código 78 ou 70 se declarado esquema, faixa/cápsula 72, volume por código 68, esquema 55) menos as penalidades medidas (`.claude/notas.js`) |
| **Cobertura** | Quanto do sistema que se estuda na graduação está no atlas | Estimativa por grupos de estruturas da TA e do Moore (seção 8), contando o que é selecionável em 3D; o que só está em texto conta pela metade |

**Nota geral** = 35 % texto + 35 % geometria + 30 % cobertura. A nota "do que existe" (sem a cobertura) está à parte, porque um
sistema pequeno e correto não deve parecer ruim por ainda não ter sido feito, nem um sistema extenso parecer bom por ter muitas peças.

## 2. Resultado geral

| Indicador | Antes | Depois |
| --- | ---: | ---: |
| Texto das fichas (média ponderada pelas 740 fichas) | 96 | **98** |
| Geometria (média das 740 estruturas) | 86 | **87** |
| **Fidelidade do que existe** (texto e geometria) | 91 | **92** |
| Checagens de posição e tamanho de livro-texto | 34 de 35 | **34 de 35** |
| Cobertura dos 8 sistemas já iniciados | 63 | 63 |
| **Cobertura do corpo inteiro** (média simples dos 15 sistemas) | 36 | 36 |

Leitura curta: **o que está no atlas está quase todo certo**, e os erros de texto encontrados foram corrigidos. A geometria quase não
muda na média, porque a nota-base de cada origem domina: as correções tiraram os defeitos de cerca de 20 estruturas (seção 7), mas
uma estrutura feita por código continua sendo uma aproximação. Daqui para cima, a nota sobe com malhas reais no lugar de esquemas
e com cobertura, não com mais ajuste fino.

## 3. Por sistema

| Sistema | Fichas | Texto | Geometria | Cobertura | **Geral** (antes → depois) | Origem das malhas |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Muscular | 258 | 97 → 99 | 88 | 95 | 93 → **94** | 196 BP3D, 59 volumes por código, 3 fáscias |
| Esquelético | 44 | 95 → 97 | 95 | 70 | 88 → **88** | todas BP3D, várias agrupadas |
| Cardiovascular (coração e vasos) | 187 | 96 → 98 | 90 | 70 | 86 → **87** | 155 BP3D, 22 trajetos e 8 esquemas por código, 2 HRA |
| Digestório e baço | 40 | 90 → 96 | 94 | 70 | 85 → **87** | 39 BP3D, parótida por código |
| Nervoso periférico | 112 | 96 → 98 | 79 | 75 | 84 → **84** | 105 trajetos por código, 7 BP3D |
| Respiratório | 36 | 98 | 91 | 55 | 83 → **83** | 29 BP3D, 5 lobos HRA, 2 pleuras por código |
| Articulações e ligamentos | 42 | 94 → 97 | 74 | 30 | 68 → **69** | 37 faixas e cápsulas por código, 5 BP3D |
| Linfático | 15 | 93 → 97 | 53 → 55 | 35 | 61 → **64** | todos esquemas por código |
| Nervoso central | 1 | 96 → 97 | 65 → 72 | 5 | não iniciado | só a medula espinal (esquema) |
| Sentidos e tegumento | 5 | 93 | 95 | 15 | não iniciado | globo ocular, tarsos, cartilagens do nariz e da orelha, pele |
| Urinário | 0 | — | — | 0 | não iniciado | o banco tem rins, ureteres e bexiga |
| Genital masculino | 0 | — | — | 0 | não iniciado | o banco tem próstata, testículos e pênis |
| Genital feminino | 0 | — | — | 0 | não iniciado | HRA (decidido na F6.0) |
| Endócrino | 0 | — | — | 3 | não iniciado | o banco tem hipófise e suprarrenais; não tem tireoide |

Correção de arredondamento: a primeira rodada registrou o respiratório como 82; a conta (35 % de 98, 35 % de 91,3 e 30 % de 55) dá 83.

## 4. Por região

| Região | Estruturas | Texto | Geometria | Cobertura | **Geral** (antes → depois) | Comentário |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Membro superior | 146 | 96 → 98 | 87 | 88 | 90 → **91** | A região mais completa: músculos, nervos, vasos, 13 articulações e 16 ligamentos |
| Membro inferior | 104 | 97 → 98 | 90 | 65 | 85 → **85** | Malhas reais e boas; faltam todas as articulações e ligamentos (F4.6) e os nervos cutâneos |
| Cabeça e pescoço | 239 | 96 → 98 | 84 | 55 | 79 → **80** | 44 músculos e 62 trajetos por código puxam a geometria; faltam encéfalo, olho e ouvido detalhados, nariz e seios, tireoide |
| Tronco | 291 | 95 → 98 | 87 | 50 | 79 → **80** | Tórax e abdome digestivo bons; faltam urinário, genitais, endócrino, omentos e a coluna articulada |

## 5. Por origem do modelo (geometria)

| Origem | Estruturas | Antes | Depois | O que pesa |
| --- | ---: | ---: | ---: | --- |
| **BodyParts3D** (malha real) | 480 | 95 | **95** | Malhas de um corpo real; a única falha comum é a interpenetração músculo-osso de 3 a 14 mm nos músculos do quadril (glúteo mínimo 29 % dos pontos, pectíneo 18 %, poplíteo 17 %), que vem do próprio banco |
| **HRA** (pulmões, placenta, cordão) | 7 | 84 | **84** | Ajuste por escala por eixo (≈ 2 mm de erro); o lobo superior esquerdo entra 6,5 % no ventrículo esquerdo |
| Código: trajeto em tubo (nervos e vasos) | 128 | 76 | **76** | Ancorados em pontos medidos; os vasos superficiais da cabeça, que saíam da pele, agora ficam sob ela |
| Código: faixa e cápsula (ligamentos e articulações) | 37 | 71 | **71** | Cápsulas atravessam o osso nas pontas (esternoclavicular 12 %, radiulnar proximal 14 %), como esperado de uma cápsula |
| Código: volume (músculos sem malha) | 59 | 68 | **68** | Face, períneo, parede abdominal e latíssimo: forma de atlas (conferida em vista), mas aproximada |
| Código: esquema (linfonodos, pericárdio, pleura, condução) | 29 | 54 | **55** | Declarados como esquema; os linfonodos já não entram no osso nem saem da pele |

## 6. O que a geometria confirmou

Todas medidas no modelo carregado (1 unidade = 10 cm); iguais nas duas rodadas:

| Checagem | Medido | Referência |
| --- | --- | --- |
| Estatura | 171,6 cm | adulto masculino |
| Fêmur, tíbia, úmero, clavícula | 46,6 / 38,0 / 30,7 / 13,6 cm | ≈ 45 / 36–38 / 30–33 / 15 cm |
| Traqueia: comprimento, largura, desvio da linha mediana | 11,1 cm, 2,6 cm, 0 cm | 10–11 cm, ≈ 2 cm, mediana |
| Carina abaixo da incisura jugular | 4,1 cm | plano do ângulo do esterno (≈ 5 cm) |
| Coração: maior dimensão; % à esquerda; ápice | 11,5 cm; 59 %; 6,7 cm da linha mediana | ≈ 12 cm; ≈ 2/3; ≈ 9 cm (5º EIC) — o ápice está no limite baixo |
| Fígado: largura, altura, % à direita, topo vs cúpula | 21 cm, 15,5 cm, 72 %, 1 cm abaixo | 21–23 cm, 15–17 cm, maioria à direita, sob a cúpula |
| Baço, pâncreas, esôfago | 9,5 / 12,1 / 27,6 cm | ≈ 12 / 12–15 / 25 cm |
| **Vesícula biliar** | **4,8 cm** | **7–10 cm** (única checagem reprovada; limite da malha do banco, agora dito na ficha) |
| Bifurcação da aorta vs topo da crista ilíaca | 1 cm abaixo | L4, plano supracristal |
| Lateralidade: vesícula, ceco, apêndice, colo ascendente, cavas | 100 % à direita | à direita |
| Lateralidade: baço, colo descendente, sigmoide, aorta torácica | 91–100 % à esquerda | à esquerda |
| Câmaras do coração dentro do pericárdio | 100 % | — |
| Pulmões dentro das pleuras | 94,5–100 % | — |
| Pulmão × fígado, estômago e baço (através do diafragma) | 0–1,8 % de sobreposição | 0 |

## 7. Achados e o que foi feito

### 7.1 Conteúdo das fichas

| Gravidade | Ficha | Problema | Situação |
| --- | --- | --- | --- |
| **Erro** | `lig_alar` (Relações) | "Estão posteriores ao dente e à membrana tectória": os alares ficam **à frente** da membrana tectória, que é a camada mais posterior (continuação do ligamento longitudinal posterior) | ✅ Corrigido |
| Divergência sem nota | Segmentos do fígado | Nomes em português pela convenção cirúrgica (VI "posterior inferior", VIII "anterior superior") e latim pela TA (VI *anterius laterale dextrum*, VIII *posterius mediale dextrum*), sem explicação | ✅ Nota em II, III e V a VIII e em `digestorio.md`: as duas nomenclaturas descrevem o mesmo segmento |
| Inconsistência | `n_radial` (Sensibilidade) | "3½ dedos laterais" contra 2½ + 2½ nas fichas vizinhas | ✅ Alinhado em 2½, com a divergência de Moore dita |
| Imprecisão | `obturador_interno` (Inserção) | "Fossa trocantérica": o tendão se insere na face medial do trocanter maior, acima da fossa (que é do obturador externo) | ✅ Corrigido |
| Inconsistência | `gemeo_superior` | Segmentos L5–S1, mas o mesmo nervo é L5–S2 no obturador interno | ✅ L5–S2 (ficha e `segments.js`), com a divergência Moore × Gray's na nota |
| Incompleto | `o_osso_quadril` (Função e inserções) | Só músculos do tronco | ✅ Completo, por região do osso |
| Nota desatualizada | `veia_umbilical`, `ducto_venoso` | "O fígado não existe no modelo" | ✅ Notas revistas e **trajetos redesenhados**: a veia entra pela incisura do ligamento redondo até o ramo esquerdo da veia porta; o ducto venoso segue pela fissura do ligamento venoso até a veia cava inferior (pontos medidos nas malhas do fígado e da porta) |
| Nota desatualizada | `ducto_toracico`, `linfonodos_mediastinais` | "O esôfago não existe" | ✅ Revistas (o ducto passa atrás do esôfago no modelo, conferido) |
| Nota desatualizada | `lingua` | "Os intrínsecos não são individualizados" | ✅ Revista |
| Nota desatualizada | `n_vago` | "O restante exige as vísceras" | ✅ Revista: o que falta é desenhar o vago abaixo de T4–T5 (M22) |
| Divergência sem nota | `peitoral_esternocostal` | C5–T1 × Moore (C7–T1) | ✅ Nota |
| Forma | `jejuno`, `esofago` | "Quylíferos"; "mediastino ( superior" | ✅ Corrigido |
| Estilo | Fichas do digestório | Termo em inglês ("watershed"), "vs.", "porta hepatis" em texto português, "sigmóide" | ✅ Trocados por "zona de fronteira", "ou", "porta do fígado" e "sigmoide". A densidade de epônimos continua: uma revisão de estilo completa fica para depois |
| Limite do banco | `vesicula_biliar` | Malha de ≈ 5 cm | ✅ Dito na nota da ficha |

### 7.2 Geometria

**Causa principal encontrada:** os vasos, linfonodos e esquemas do pacote circulatório usavam pontos "sob a pele" (`{ skin, p, d }`)
num contexto sem ossos (`jointContext`, em `src/joint-geo.js`). Sem ossos, o `NerveBuilder.underSkin` devolve o próprio ponto da pele e
ignora a profundidade pedida; e a pele usada era a antiga `pele_corpo`, não a `pele_inteira` que está na tela. Além disso, os tubos
por código (`buildTube`, em `src/proc.js`) não punham pontos intermediários sob a pele entre dois pontos de pele distantes, e a curva
cortava por fora as superfícies convexas. **Correção:** o pacote circulatório agora monta com a pele da tela e os ossos
(`src/main.js`, `loadCirc`), e os tubos por código ganharam os pontos intermediários que os nervos já tinham.

| Estrutura | Antes | Depois |
| --- | --- | --- |
| `linfonodos_mediastinais` | 48 % dos pontos dentro de osso (anteriores **dentro do manúbrio**) | 0 %: anteriores atrás do manúbrio e à frente do arco da aorta, posteriores ao lado do esôfago e da aorta descendente |
| `linfonodos_mamarios_internos` | 2 de 6 com o centro em osso ou cartilagem | 0 %: junto da artéria torácica interna, nos espaços intercostais |
| `linfonodos_pericranianos` | 66 % fora da pele | 4 % (só no processo mastoide, onde o modelo tem 3 mm de partes moles) |
| Artérias temporal superficial, auricular posterior e facial; veia facial | 24–33 % fora da pele | 0 % |
| Artéria occipital | 12 % fora | 2 % |
| Veia jugular externa | 41 % fora | 3,5 % (pelo teste de 7 raios; nenhum trecho visível por fora com a pele opaca) |
| Veia umbilical | 22 % fora, sem chegar ao fígado | 0 %, até o ramo esquerdo da veia porta |
| `n_cutaneo_lateral_inf_braco` | 14 % dentro do úmero | 0 % (um ponto lateral ao osso faz o nervo contorná-lo) |
| `medula_espinal` | 13 % dentro de osso | igual, mas a análise mostrou que é **só o filo terminal no canal sacral**, dentro da peça do sacro, que no modelo é maciça (como a cauda equina): agora dito na ficha e isento da penalidade |

O que ficou como está, por ser limite do banco, do ajuste ou do teste:

| Estrutura | Medido | Por quê |
| --- | --- | --- |
| Músculos do quadril e da coxa (BP3D) | 11–29 % dentro de osso a mais de 3 mm | Interpenetração das próprias malhas do BodyParts3D |
| Lobo superior esquerdo (HRA) | 6,5 % dentro do ventrículo esquerdo | Efeito do ajuste por escala por eixo |
| Esôfago (BP3D) | 8,6 % dentro da traqueia | Malhas do banco encostadas |
| Carótida comum e interna | falha de ≈ 6 cm no pescoço | Já dita na ficha |
| `n_facial_cervical`, `n_cutaneo_posterior_braco`, `n_fibular_superficial` | 12–14 % "fora da pele" no teste | Ruído do teste: os pontos acusados ficam a 4–10 mm da pele, e a vista com a pele opaca não mostra nada para fora. Perto da superfície, onde um raio atravessa outro segmento do corpo, a paridade da casca dupla da pele falha; a bateria passou a usar 7 raios (a comparação antes × depois foi feita com os mesmos 3 raios da primeira rodada) |
| Estapédio, tensor do tímpano, nervo do estapédio, alveolar inferior, VIII, corda do tímpano, cauda equina | intraósseos | Trajetos que são de fato intraósseos (ou o sacro maciço do modelo) |

**Testes:** `npm run build`; `npm test` (catálogo com 740 estruturas, 18 422 verificações das ferramentas de estudo e o teste de fumaça
sem erros no console) e o teste de fumaça por `file://` (`SMOKE_FILE=1`). Conferência visual no navegador embutido: linfonodos do
mediastino e paraesternais, veia umbilical e ducto venoso com a veia porta e o lobo caudado, vasos da cabeça sobre o crânio, e
pescoço e braço com a pele opaca.

## 8. Cobertura: o que falta, por tamanho do buraco

Sem mudança nesta rodada (as correções não acrescentaram estruturas).

| Sistema | Cobertura | O que falta (e de onde viria a malha) |
| --- | ---: | --- |
| Muscular | 95 | Articular do joelho, extensor curto dos dedos, interósseos dorsais do pé (por código), cremaster, esfíncter interno do ânus; os demais ausentes são vestigiais |
| Nervoso periférico | 75 | Cutâneos do membro inferior (M09), plexos lombar e sacral desenhados (M10), tronco simpático torácico e lombar, esplâncnicos e plexos autonômicos (M22), vago abaixo de T4–T5 |
| Esquelético | 70 | Vértebras, costelas, carpo, tarso e dentes são peças agrupadas (o banco tem cada peça: P01); ossículos (OpenEar, não testado) |
| Cardiovascular | 70 | Cúspides separadas, septos e fossa oval, seios da dura e veias do encéfalo, veias superficiais menores, artérias de menor calibre dos membros |
| Digestório | 70 | Omentos e ligamentos do fígado (P80–P82), esfíncter interno do ânus, tonsilas, palato e gengiva |
| Respiratório | 55 | Cavidade nasal e seios, laringe por dentro (pregas, ligamentos: o banco tem), segmentos broncopulmonares como peças (HRA já baixado), brônquios lobares, mediastino |
| Linfático | 35 | Timo (o banco tem), tonsilas, troncos linfáticos; linfonodos só como esquema |
| Articulações e ligamentos | 30 | Quadril, joelho, tornozelo e pé (F4.6), pelve, coluna, ATM completa, ligamentos do carpo |
| Sentidos e tegumento | 15 | Olho em partes (o banco tem cristalino e córnea), glândula lacrimal (o banco tem), ouvido médio e interno, nariz por dentro, pele em camadas |
| Nervoso central | 5 | Encéfalo (o banco tem 116 peças), meninges, ventrículos |
| Urinário e genitais | 0 | Rins, ureteres, bexiga, próstata, testículos e pênis no banco; genital feminino pelo HRA |
| Endócrino | 3 | Hipófise e suprarrenais no banco; tireoide e paratireoides por código |

## 9. Limites desta auditoria

- O texto foi conferido por leitura especializada contra o conteúdo de Moore, Gray's, Netter e TA, **não página a página** com os
  livros abertos. Divergências entre edições podem existir além das que já estão nas notas.
- A cobertura é **estimativa** por grupos de estruturas; os denominadores não são uma contagem fechada da TA.
- Os testes de "dentro" usam paridade de raios. Malhas abertas do BodyParts3D e a casca dupla da pele dão falsos positivos perto
  das superfícies; por isso a penalidade de osso só conta pontos a mais de 3 mm da superfície, e os casos de pele acusados foram
  conferidos em vista.
- As notas-base por origem (95, 85, 78/70, 72, 68, 55) são escolha desta auditoria, não medida. As penalidades são medidas.
- A geometria do BodyParts3D representa **um** indivíduo. Variação anatômica normal não foi penalizada.

## 10. Como repetir

No navegador embutido, servidor `site-nocache` (porta 5174):

```js
await import('/.claude/helpers.js?' + Date.now());
await import('/.claude/fidelidade.js?' + Date.now());
await import('/.claude/notas.js?' + Date.now());
await ready();
await FID();        // 7 raios; FID({ rays: 3 }) repete a régua da primeira rodada
NOTAS();            // médias por sistema, região e origem, e a lista de penalidades
```

O despejo das fichas para leitura é feito pelo esbuild do catálogo (`agents.md` §6.1) e por um script que agrupa as fichas por tipo.
