# Otimização para celular — levantamento (2026-10-08)

Por que o atlas pesa no celular, medido, e o que mudar, em ordem de retorno. Nada aqui foi implementado ainda: é o plano.
As medições podem ser repetidas com `node tools/perf_mobile.js` (ver “Como medir” no fim).

## 1. O que foi medido

**Cena completa** (vista “Corpo”, dissecação “Pele translúcida”), contada no navegador:

| Medida | Valor |
| --- | --- |
| Triângulos na cena / desenhados nessa vista | 1,82 mi / 1,66 mi |
| Chamadas de desenho (*draw calls*) por quadro | 492 |
| Malhas / materiais | 597 / 282 (11 programas de *shader*) |
| Geometria na memória (CPU) + árvores BVH | 34 MB + 17 MB |
| Quadros desenhados por segundo **com o modelo parado** | 60 (o laço redesenha sempre) |

**Maiores consumidores de triângulos:** nervos 314 mil (17 %, tubos com um anel a cada 2 mm e 8 lados), pele 118 mil,
globo ocular 47 mil (para uma esfera de 2,4 cm), vértebras torácicas 28 mil, parietal 26 mil, levantadores longos das
costelas 24 mil. Por tipo: músculos 694 mil, nervos 314 mil, ossos 310 mil, demais 219 mil.

**Carga num “celular” emulado** (Chrome sem janela, tela 414×896 a 2×, CPU 4× mais lenta — ordem de grandeza de um
celular intermediário):

| Marco (`__app.perf`) | Hoje | Com o quadro parado sem redesenhar¹ |
| --- | --- | --- |
| Primeira imagem (`ttfiMs`) | 3,5 s | 3,4 s |
| Estruturas do corpo (`bodyStructuresMs`) | 2,4 s | 2,2 s |
| Nervos (`nervesMs`) | **10,4 s** | **6,0 s** |
| Tudo pronto (`totalReadyMs`) | **19,0 s** | **13,1 s** |

¹ Simulado trocando o `requestAnimationFrame` por um quadro por segundo. Sem a CPU desacelerada, o computador de
referência fica pronto em 2,9 s; o celular leva de 5 a 7 vezes isso.

**Custo de um quadro por configuração** (GPU por software, que pesa vértices e pixels como uma GPU fraca; valores
relativos, mesma vista):

| Configuração | Custo | Diferença |
| --- | --- | --- |
| Hoje (resolução 2×) | 334–349 ms | — |
| Resolução 1,5× | 277 ms | −17 % |
| Resolução 1× | 209 ms | −37 % |
| Sem o relevo das fibras (`bumpMap`) | 297 ms | −15 % |
| Sem nervos | 298 ms | −15 % (é o peso deles) |
| Sem pele | 278 ms | −20 % (é o peso dela) |
| Faces só de um lado (`FrontSide`) | 193 ms | **−45 %** |
| Material Lambert em vez de PBR (`MeshStandard`) | 189 ms | **−46 %** (muda o visual) |

A GPU por software exagera o peso de rasterizar e sombrear: numa GPU real os ganhos de `FrontSide` e Lambert tendem a
ser menores (o teste de profundidade já descarta parte das faces de trás), por isso a ordem abaixo põe primeiro o que
ajuda em qualquer aparelho. O computador de desenvolvimento (RTX) disfarça tudo isso; num celular a GPU é dezenas de vezes mais fraca e,
redesenhando 60 vezes por segundo sem parar, esquenta e drena a bateria mesmo com ninguém mexendo.

## 2. O que mudar, em ordem

Legenda — **Ganho**: o que melhora · **Esforço**: P (horas), M (1–2 dias), G (vários dias) · **Perde algo?**

### Primeira leva: sem perder nada

1. **Desenhar só quando algo muda** (renderização sob demanda). Hoje `frame()` em `main.js` chama `renderer.render` e
   `updateLabels` a cada quadro. Passa a haver uma função `invalidate()` chamada por: `controls` (evento `change` e enquanto
   o amortecimento se move), voo da câmera (`goal`), seleção, realce, passar o mouse, camadas, dissecação, pele, corte,
   cores, rótulos, redimensionar e o deslocamento da ficha. Parado, zero quadros.
   **Ganho:** GPU parada quando ninguém mexe (calor e bateria); carga até ~30 % mais rápida no celular (19 → 13 s
   medido) porque o laço deixa de disputar a CPU com a montagem. **Esforço:** M (muitos pontos de mudança de estado;
   um esquecido = tela que não atualiza; o teste de fumaça precisa cobrir). **Perde algo?** Não.
2. **Resolução adaptativa.** Em telas de toque, limitar a densidade de pixels a 1,5 (hoje 2) e baixar para 1 enquanto o
   dedo gira ou dá zoom, voltando ao soltar; sem antialiasing quando a densidade passa de 1,5 (os pixels já são
   pequenos). **Ganho:** −17 % parado, −37 % girando. **Esforço:** P. **Perde algo?** Nitidez levemente menor durante o gesto.
3. **Nervos mais leves.** Em `nerve-geo.js`, um anel a cada 4 mm (hoje 2 mm) e 6 lados (hoje 8): de 314 mil para
   ~120 mil triângulos, visualmente igual nesses diâmetros (1–3 mm). **Ganho:** ~−10 % por quadro e montagem dos
   nervos mais rápida. **Esforço:** P (conferir que ramos ainda chegam aos músculos). **Perde algo?** Não.
4. **Nada de leitura de layout no laço.** `frame()` lê `offsetWidth`, `offsetHeight` e `clientWidth` a cada quadro, o
   que força o navegador a recalcular o layout; guardar esses valores no `resize` e ao abrir/fechar a ficha.
   **Esforço:** P. **Perde algo?** Não.
5. **Globo ocular decimado** de 47 mil para ~6 mil triângulos (é uma esfera pequena). **Esforço:** P (pipeline de dados
   com `--append`/substituição). **Perde algo?** Não visível.

### Segunda leva: sem perder funcionalidade, com mais trabalho

6. **Faces orientadas e desenho de um lado só.** Todo material usa `DoubleSide` porque as normais do BodyParts3D vêm
   inconsistentes. Corrigir a orientação no conversor (por componente conexo, pelo sinal do volume) e usar `FrontSide`
   nas malhas fechadas, deixando `DoubleSide` só nas abertas (pele cortada, lâminas por código, fáscias).
   **Ganho:** até −45 % por quadro. **Esforço:** M–G (regenerar os pacotes de dados; risco de “buracos” em malhas
   abertas — conferir estrutura por estrutura com a verificação visual). **Perde algo?** Não, se bem feito.
7. **Nervos pré-calculados.** Hoje os 55 nervos são construídos no aparelho (raios contra ossos e músculos, BVH):
   10,4 s no celular emulado. Gerar a geometria uma vez no build (Node + Three) e gravá-la num pacote, como as malhas
   reais. **Ganho:** ~6–10 s a menos de CPU na carga do celular. **Esforço:** G (o construtor depende das malhas e do
   BVH; pacote de ~1–1,5 MB com a versão leve do item 3). **Perde algo?** Não.
8. **Corpo sob demanda no celular.** O pacote do corpo (7,3 MB) é lido e montado em segundo plano mesmo se a pessoa
   só estuda a cabeça. No celular, carregar quando ela escolher Tronco, Braço ou Corpo (ou iniciar quiz/tour que precise).
   **Ganho:** ~4 s de CPU no celular emulado (dados + montagem do corpo) e cerca de metade da geometria a menos na
   memória para quem fica na cabeça (a cabeça tem ~0,87 mi dos 1,82 mi de triângulos). **Esforço:** M. **Perde algo?** Uma
   espera curta na primeira troca de região.
9. **Perfil de materiais leve** (automático em celular, com opção na interface): sem `bumpMap` (−15 %) e 3 luzes em vez
   de 5; se ainda faltar, Lambert (−46 %). **Esforço:** P–M. **Perde algo?** O relevo das fibras e o brilho ficam
   mais simples.

### Terceira leva: muda a resolução do corpo

10. **Pacote de malhas “leve”** (~50 % dos triângulos) escolhido no celular: pele de 118 mil para ~50 mil, ossos do
    crânio e coluna, músculos grandes (diafragma, intercostais, platisma) por decimação quadrática no conversor.
    Também reduz o download. **Esforço:** M (precisa do `fast-simplification` no Python — instalação a autorizar — e
    conferir lâminas finas, que abrem buracos com decimação). **Perde algo?** Detalhe fino das superfícies.
11. **Menos chamadas de desenho** (492 por quadro) agrupando malhas estáticas (`BatchedMesh`). **Esforço:** G e
    arriscado: seleção, realce e visibilidade são por estrutura. Só se o resto não bastar.

### O que não vale a pena agora

- Trocar os pacotes `.js` (base64) por binários: economiza ~25 % de download no site, mas quebra a abertura por
  `file://` do `.exe`; só com dois formatos.
- BVH preguiçoso: o BVH é necessário logo na montagem dos nervos e no toque; só desloca o custo.

## 3. Ordem sugerida e meta

1. Itens 1–4 juntos (uma entrega, sem perda visual) e medir de novo.
2. Itens 6 e 7 (os de maior ganho restante) — se o celular ainda esquentar ou demorar.
3. Itens 8–10 conforme as medições em aparelho real.

Meta (roteiro §3.5): primeira imagem < 3 s e ≥ 30 quadros/s girando num celular intermediário; zero quadros parado.

## 4. Como medir

- `node tools/perf_mobile.js 4` — tela de celular, CPU 4× mais lenta, GPU por software; imprime `__app.perf`, memória JS,
  quadros por segundo com o modelo parado e o custo de quadro em duas vistas.
- `IDLE_RAF=1 node tools/perf_mobile.js 4` — o mesmo, simulando a renderização sob demanda.
- `GPUBENCH=1 node tools/perf_mobile.js 1` — custo de quadro por configuração (tabela da seção 1).
- **Em aparelho real** (o que mais falta): abrir o site, deixar parado 1 min e girar 1 min, anotando tempo até
  aparecer a cabeça, até o corpo inteiro, se esquenta e se trava. Vale acrescentar um modo `#perf` que mostre quadros/s
  e os tempos de carga na tela, para colher números de celulares de verdade.
