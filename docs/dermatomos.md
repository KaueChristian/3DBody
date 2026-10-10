# Dermátomos sobre a pele: decisão e limites (F2.15)

Este documento registra o **spike** do item F2.15 do roteiro (`project_context.md`): escolher entre pintar faixas
esquemáticas na malha da pele ou usar uma textura, e documentar a decisão.

## Decisão: cor de vértice na malha da pele

| Critério | Cor de vértice (escolhida) | Textura |
| --- | --- | --- |
| Pré-requisitos | Nenhum: a malha `pele_corpo` tem só posições | Exige coordenadas de textura (UV), que a pele não tem |
| Dados novos | Nenhum arquivo; ≈ 80 linhas de regras em `src/study/dermatomes.js` | Imagem(ns) e um mapeamento a mais no pacote (orçamento de dados) |
| `file://` e offline | Funciona (tudo é cálculo local) | Funciona, mas é mais um arquivo para carregar e cachear |
| Alinhamento com a anatomia | A regra usa as próprias referências do modelo (altura, ângulo em torno do tronco, eixo do membro medido nos ossos) | Teria de ser desenhada à mão sobre um desdobramento do corpo |
| Resolução das bordas | A da malha (≈ 55 mil vértices); bordas nítidas | A que a imagem permitir; permitiria degradê |
| Custo | Uma passada de ≈ 10 ms ao ligar, pela primeira vez | Memória de textura |

Como a pele do corpo vem de uma malha já decimada (110 mil triângulos no máximo) e o interesse é didático e esquemático,
a cor de vértice dá o melhor custo-benefício. O desenho é mais “faixa” que “mapa”, e isso é dito na interface.

## O que o modelo mostra

- **Cabeça:** divisões do trigêmeo (**V1**: fronte, couro cabeludo até o vértice, pálpebra superior e dorso do nariz; **V2**:
  pálpebra inferior, bochecha, lábio superior e têmpora anterior; **V3**: lábio inferior, queixo, ângulo da mandíbula e região
  pré-auricular) e **C2–C3** atrás da cabeça e na orelha.
- **Pescoço e ombro:** C2 a C4 (C4 é o dermátomo do “alto do ombro”, no nível da clavícula) e **C5** no deltoide.
- **Tronco:** T2 a T12 em faixas oblíquas, que descem da coluna para a frente acompanhando as costelas (T4 no mamilo, T6 no
  processo xifoide, T10 no umbigo); L1 na região inguinal; atrás, L1 a L5 e S1 a S3, até onde a pele do modelo chega.
- **Membro superior:** braço (C5 lateral; T2 e T1 medial), antebraço (C6 radial; C7 no centro; T1 medial proximal e C8 medial
  distal), mão (C6 no polegar e no indicador, C7 no médio, C8 no anular e no mínimo).

Não há dermátomos dos membros inferiores porque o modelo ainda não tem a pele deles (a pele termina na altura da cintura).
Quando houver, as regras entram em `src/study/dermatomes.js` junto com a F4.

## Como usar

Estudo → aba **Coloração** → “Mostrar os dermátomos sobre a pele”. A pele fica quase opaca (a opacidade anterior volta ao
desligar) e a legenda lista os dermátomos. Os botões de segmento (C1 a Co1) destacam um dermátomo e esmaecem os demais. No
modo “Por segmento medular” a escolha destaca também o miótomo (músculos), de modo que um mesmo segmento mostra, na pele,
o dermátomo e, nos músculos, o miótomo. O estado entra no link (`derm=1`, `seg=C7`).

## Limites e fontes (leia antes de estudar por aqui)

1. **É esquemático.** Os dermátomos reais **se sobrepõem** (cada território é inervado por 2 a 3 raízes: a perda de uma raiz só
   raramente deixa a pele insensível), variam entre as pessoas e têm bordas imprecisas. As bordas aqui são linhas nítidas.
2. **Os mapas divergem.** Existem dois mapas clássicos: o de Keegan e Garrett (1948, em faixas contínuas que seguem a linha
   axial) e o de Foerster (1933, com mais sobreposição); os atlas (Moore, Netter, Gray’s) combinam os dois. Segue-se aqui o
   desenho mais comum nos textos de Moore e do Netter. Em particular, o dermátomo do polegar ao dedo mínimo (C6, C7, C8) tem
   limites que variam: C6 no polegar e no indicador, C7 no médio, C8 no anular e no mínimo é a regra mais usada, e há mapas que
   põem C7 também no indicador. T1 e T2 no braço e a posição de C4 no ombro também variam.
3. **O trigêmeo não é um dermátomo espinal**, mas as suas três divisões desenham o mapa sensitivo da face e estão no mesmo
   mapa por conveniência. A pele atrás do ângulo da mandíbula e da orelha é C2–C3 (nervos occipital menor e auricular magno).
4. **A pele do modelo é a do BodyParts3D**, de um adulto jovem; o corpo real é diferente em proporções e em posição das
   costelas. As alturas das faixas do tronco foram ajustadas aos pontos de referência do próprio modelo (mamilo, xifoide,
   umbigo, inguinal), e não à anatomia de superfície de uma pessoa específica.
5. **Uso clínico.** O mapa não serve para localizar lesão no paciente: para isso se usam os mapas padronizados (ISNCSCI/
   ASIA) e a avaliação do examinador.

## Implementação

`src/study/dermatomes.js`: `dermatomeOf(x, y, z)` classifica um ponto da pele (espelhado em `|x|`) e `DermatomeOverlay`
aplica o resultado como atributo `color` da geometria da pele (a pele passa a usar `vertexColors` e fica branca para a cor
dos vértices aparecer). O eixo do membro foi medido nos ossos do modelo (cabeça do úmero, côndilos, punho, 3º metacarpal e
ponta do 3º dedo); o limite entre tronco e braço é uma parede em `x`. O código fica fora do `main.js`, como pede o `agents.md`.
