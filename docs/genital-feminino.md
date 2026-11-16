# Sistema genital feminino e mama (F6.5)

Entregue na `dev` em 2026-11-16, para a aula de genital feminino (logo depois de 17/11) e a N2 (26/11). 28 estruturas em
`src/catalog-fem.js`, pacote `dist/anatomy-fem.js` (≈ 400 KB) e camada **“Genital feminino e mama (modelo feminino)”**.

## 1. Como aparece no atlas: o “modelo feminino”

O corpo do atlas é o do BodyParts3D, masculino. O genital feminino não pode simplesmente somar-se a ele: útero e vagina ocupam o
lugar da próstata, das glândulas seminais e do períneo masculino. Por isso:

- A camada `feminino` é **opcional** (como a da circulação fetal): vem desligada e não entra no nível de dissecação.
- Ligar a camada (ou selecionar qualquer estrutura dela, num tour, no quiz ou na busca) liga o **modelo feminino**: as estruturas
  marcadas `sexo: 'm'` em `src/catalog-urin.js` (uretra masculina, próstata, glândulas seminais, ductos deferente e ejaculatório,
  glândulas bulbouretrais, testículo, epidídimo, pênis, vasos testiculares e penianos, funículo espermático e cremaster) saem de
  cena (`itemVisible` em `src/main.js`). Bexiga, ureteres, rins e canal inguinal ficam, porque existem nos dois sexos.
- Selecionar uma estrutura masculina desliga o modelo feminino de novo.
- O estado vai e volta pelo hash da URL junto com as outras camadas (`ly=`).

Limitações que ficam visíveis:

- A **pele** é a masculina. Com a pele opaca ou translúcida, a vulva aparece onde está o escroto. As fichas da vulva dizem isso;
  para estudá-la, deixe a pele transparente ou desligada.
- A **pelve óssea** do modelo continua masculina. A pelve feminina do HRA aparece **ao lado do corpo**, à direita, só para
  comparação (ficha “Pelve feminina (comparação)”).
- A **bexiga** e o **colo sigmoide** são os do corpo masculino: o colo sigmoide encosta no fundo do útero e a bexiga, na face
  anterior do corpo e do colo. A posição do útero é a dos ossos (abaixo), não um encaixe nas vísceras.

## 2. Origem de cada estrutura

| Estrutura | Origem | Posição |
| --- | --- | --- |
| Útero: fundo (com os cornos e o óstio uterino da tuba), corpo, istmo (o HRA o chama de segmento uterino inferior) e colo (com a junção cervicovaginal e os óstios) | **HRA** `uterus-female` v1.2 | ajuste pelos ossos da pelve (§3) |
| Tubas uterinas: istmo, ampola, infundíbulo e fímbrias (os dois lados em cada peça) | **HRA** `fallopian-tube-female-left/right` v1.2 | idem |
| Ovários | **HRA** `ovary-female-left/right` v1.3 (malha simples, sem folículos) | idem |
| Mama: corpo adiposo e ligamentos suspensores; glândula (lobos, ductos e seios lactíferos); papila, aréola e tubérculos areolares | **HRA** `mammary-gland-female-left/right` v1.1 (decimada de ≈ 1 milhão para ≈ 18 mil triângulos) | escala real, papila no 4º espaço intercostal na linha medioclavicular, base no peitoral maior |
| Pelve feminina (comparação) | **HRA** `pelvis-female` v1.3 (ossos do quadril, sacro e cóccix) | escala real, fora do corpo, à direita (x ≈ −4,9) |
| Vagina, uretra feminina, lábios menores e vestíbulo, lábios maiores e monte do púbis, clitóris, bulbos do vestíbulo, glândulas vestibulares maiores | **código** (`proc`, tubos) | pontos medidos no modelo: colo do útero, colo da bexiga, sínfise púbica, ramos do pênis (mesmo trajeto dos ramos do clitóris), canal anal, períneo |
| Ligamentos largo, redondo, útero-ovárico, suspensor do ovário, uterossacro e transverso do colo (cardinal) | **código** | do útero e do ovário (HRA) às paredes da pelve, ao sacro e ao canal inguinal do modelo |
| Artéria uterina | **código** | da artéria ilíaca interna à margem lateral do útero, **por cima do ureter**, com ramos tubário-ovárico e cervicovaginal |
| Artéria ovárica | **código** | mesmo trajeto abdominal medido na artéria testicular do BodyParts3D, depois o ligamento suspensor até o ovário |
| Veia ovárica | **código** | à esquerda, até a veia renal esquerda (trajeto da veia testicular); à direita, até a veia cava inferior |

Toda ficha com malha do HRA tem `malha: 'hra'` (o selo da ficha diz “Malha real (Atlas de Referência Humano)”) e uma nota
“POSIÇÃO DE REFERÊNCIA” que cita a fonte e a doadora do Visible Human feminino (59 anos, pós-menopausa: útero e ovários menores
que na idade reprodutiva). Toda estrutura por código declara `ESQUEMA` na nota. O teste de catálogo confere as duas coisas.

## 3. Ajuste à pelve do atlas (`tools/fit_fem.py`)

Os GLB do útero, das tubas, dos ovários e da pelve feminina do HRA estão **no mesmo referencial** (o corpo do Visible Human
feminino, em metros, com os mesmos eixos do atlas): as tubas encostam nos cornos do útero, os ovários nas fímbrias, e a sínfise
púbica cai no plano mediano do útero. Basta, então, uma transformação calculada pelos ossos:

- pontos sorteados (pela área) na superfície dos ossos do quadril e do sacro do HRA e do atlas (o cóccix fica de fora: o atlas o
  junta ao sacro);
- minimiza a distância nos dois sentidos, com corte robusto (Huber), sobre rotação, **escala por eixo** e translação, com uma
  penalidade pequena para a escala não fugir da proporção real;
- resultado (`tools/fem_transform.json`): rotação < 1°, escala 8,87 × 9,15 × 7,88 (metros → 1 unidade = 10 cm; a pelve masculina é
  mais estreita e mais rasa), distância mediana osso-osso ≈ 4 mm e percentil 90 ≈ 8 mm;
- `ORGAN_SHIFT` em `tools/convert_fem.py` só centra o útero no plano mediano (x + 3 mm).

Tentei também afastar o útero da bexiga e do colo sigmoide do atlas (busca em grade da translação, contando pontos dentro das
malhas): nenhuma posição resolve as duas coisas, porque a pelve masculina não tem o espaço do útero. Ficou a posição dos ossos, que
é a referência anatômica certa; a vista em corte mediano mostra o útero antevertido sobre a bexiga, o colo entre a bexiga e o reto e
o colo sigmoide por cima, como num atlas.

## 4. Regenerar

```bash
cd tools
# GLB em tools/hra/ (fora do git): uterus-female v1.2, fallopian-tube-female-left/right v1.2, ovary-female-left/right v1.3,
# pelvis-female v1.3 e mammary-gland-female-left/right v1.1, de https://cdn.humanatlas.io/digital-objects/ref-organ/<nome>/<versão>/assets/
python fit_fem.py        # → fem_transform.json
python convert_fem.py    # → anatomy-fem.js (copie para ../dist/)
```

Com `PYTHONIOENCODING=utf-8` no Windows, por causa das setas e acentos impressos.

## 5. Conferência das fichas

Textos escritos a partir de Moore, Dalley & Agur (8ª ed.), Gray's (42ª ed.) e Netter (7ª ed.), nos campos “Localização e partes”,
“Relações e peritônio”, “Vascularização e inervação” e “Função e clínica”. Pontos que costumam cair em prova e estão nas fichas:
anteversão e anteflexão; escavações vesicouterina e retouterina (culdocentese); partes da tuba e local da fecundação e da gravidez
ectópica; fossa ovárica e dor referida pelo nervo obturatório; drenagem da veia ovárica (direita na cava, esquerda na renal);
artéria uterina por cima do ureter a cerca de 2 cm do colo; meios de sustentação do útero; ligamento redondo no canal inguinal e
linfa para os linfonodos inguinais; homologias (lábios maiores e escroto, clitóris e corpos cavernosos, bulbos do vestíbulo e corpo
esponjoso, glândulas vestibulares maiores e bulbouretrais); quadrantes e drenagem linfática da mama; diferenças entre as pelves.

Valores numéricos com variação entre as fontes foram escritos como aproximados (“cerca de”). A altura do fundo uterino na gestação
segue os marcos clássicos (12 semanas acima da sínfise, ≈ 20 no umbigo, ≈ 36 no processo xifoide).

## 6. O que ficou de fora (→ M31)

- Músculos do períneo feminino próprios (o bulboesponjoso e o isquiocavernoso do modelo são os masculinos); corpo do períneo como
  peça; hímen; glândulas parauretrais e vestibulares menores (só em texto).
- Artéria e plexo venoso vaginais, artéria do ligamento redondo, linfonodos próprios (só em texto).
- Vagina e vulva com malha real: não há fonte aberta compatível conferida (a da Catherine Vallance, CC BY 4.0, exige conta no
  Sketchfab; ver `fonte-hra-atlas-de-referencia.md`).
- Bexiga feminina do HRA (`urinary-bladder-female` v1.2, 0,77 MB, mesmo referencial do útero): resolveria a sobreposição com a
  bexiga masculina no modelo feminino; **não foi baixada** (não estava na lista autorizada).
