# Circulatório (F5): coração e vasos principais

Registro da fase **F5** do roteiro (`project_context.md`): o que entrou, de onde vem, como foi gerado, o que o banco não tem e o que ficou
para depois. O catálogo está em `src/catalog-circ.js`; as malhas, no pacote `dist/anatomy-circ.js`.

## 1. O que tem (66 fichas)

| Grupo | Fichas | Camada |
| --- | --- | --- |
| Câmaras | átrio direito, átrio esquerdo, ventrículo direito, ventrículo esquerdo | Coração |
| Valvas | tricúspide, mitral, da aorta, do tronco pulmonar (as cordas tendíneas vêm junto com a malha das valvas) | Coração |
| Músculos papilares | do ventrículo direito (3, numa ficha), anterolateral do ventrículo esquerdo | Coração |
| Pericárdio | **esquema** por código (ver §3) | Coração |
| Coronárias | coronária direita, ramo interventricular posterior, ramo marginal direito, tronco da coronária esquerda, ramo interventricular anterior, ramo circunflexo | Artérias |
| Veias do coração | seio coronário, veias cardíacas magna, média e pequena, veia posterior do ventrículo esquerdo, veias cardíacas anteriores | Veias |
| Grandes vasos | aorta ascendente, arco, torácica e abdominal; tronco pulmonar e artérias pulmonares direita e esquerda; 4 veias pulmonares; veias cavas superior e inferior; veias braquiocefálicas; ázigo e hemiázigo | Artérias e Veias |
| Pescoço e tórax | tronco braquiocefálico, carótidas comum e interna, vertebral, subclávia, torácica interna | Artérias |
| Membro superior | axilar, braquial, radial e ulnar; jugular interna, subclávia, axilar e braquiais (veias) | Artérias e Veias |
| Abdome e pelve | tronco celíaco, mesentéricas superior e inferior, renal, ilíacas comum, externa e interna; veias ilíaca comum, externa e interna, femoral e renal | Artérias e Veias |
| Membro inferior | artéria e veia femorais (as da perna e do pé vêm depois) | Artérias e Veias |

Totais: 10 estruturas cardíacas + pericárdio, 31 artérias e 24 veias (o catálogo passa a ter **500 estruturas**). Cada artéria e veia tem ficha
com origem (ou formação), trajeto, ramos (ou tributárias), território irrigado (ou drenado) e nota clínica; as câmaras e valvas, localização,
paredes e relações, estruturas internas e função. Cada ficha cita as vizinhas na circulação (chips; a ligação vale nos dois sentidos).
Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.).

Cores: artérias vermelhas e veias azuis; por convenção, o **tronco e as artérias pulmonares são azulados** (sangue pouco oxigenado) e as **veias
pulmonares, avermelhadas**. O tour “Circulação: grande e pequena” (8 passos) e o de “Circulação fetal e o nascimento” (6 passos; texto de apoio,
sem modelo da placenta e do cordão) estão em `src/study/tours.js`. O quiz de localizar ganhou os tipos “Coração”, “Artérias” e “Veias”.

## 2. Fonte e pipeline

Malhas reais do BodyParts3D (CC BY-SA 2.1 JP), definidas por nome de conceito em `tools/body_parts.py` (`addc(...)`, `pack="circ"`):

```bash
cd tools
python fetch_body.py --pack circ     # ≈ 5,8 MB compactados por faixas de bytes (202 elementos)
python convert_body.py --pack circ   # → anatomy-circ.js e parts_circ.npz (copie o .js para ../dist/)
```

(No Windows, com `python -P`, defina `PYTHONPATH=.` para os dois comandos.) O pacote tem **67 peças, 124 mil triângulos, 1,12 MB**.

Decisões do pipeline:

- **Parede dos dois ventrículos.** O banco só tem “parede do ventrículo” numa peça única. `convert_body.py` a divide em `cor_parede_ventriculo_d` e
  `_e` atribuindo cada triângulo à cavidade (molde de sangue) mais próxima, com o ventrículo esquerdo favorecido por um fator 0,55 (a parede do
  direito é fina, e sem o fator o limite cairia sobre o lado esquerdo do sulco interventricular), e um filtro de maioria entre faces vizinhas
  para tirar os dentes do limite. Conferido a olho nas vistas anterior e lateral esquerda: o limite cai no sulco interventricular anterior.
- **Cavidades.** Os moldes de sangue das câmaras coincidem com a face interna das paredes (z-fighting no plano de corte) e não acrescentam nada
  ao estudo; ficaram **fora do pacote** e só servem de referência para a divisão acima. O interior se vê com o plano de corte do Estudo: aparecem as
  valvas, as cordas e os músculos papilares.
- **Coronárias.** O banco as tem por conceitos agregados (tronco mais ramos). Foram separadas em coronária direita (com os ramos ventriculares),
  ramo interventricular posterior, ramo marginal direito, tronco da esquerda, ramo interventricular anterior (com os diagonais) e circunflexo.
- **Vasos pares** (carótidas, subclávias, braquiais…) são uma ficha só, com os dois lados; as pulmonares, que não são simétricas, têm uma ficha por veia.

## 3. O que o banco não tem

| Estrutura | O que o atlas faz |
| --- | --- |
| **Pericárdio** | **Esquema por código** (`src/hull-geo.js`): um envoltório liso, translúcido, que acompanha o coração e a raiz dos vasos (casco convexo suavizado). A ficha diz que é esquema e que não mostra lâminas, cavidade nem seios (M26). |
| Aurículas, septos, trabéculas e fossa oval como peças | Fazem parte das malhas das paredes; as fichas as descrevem. |
| Músculo papilar posteromedial do ventrículo esquerdo | Ficha do anterolateral diz que falta. |
| Placenta, cordão umbilical, ducto arterioso, ducto venoso e forame oval | Tour de texto (circulação fetal). A **placenta** existe no HRA (CC BY 4.0; ver [`fonte-hra-atlas-de-referencia.md`](fonte-hra-atlas-de-referencia.md), 4,9 MB originais): M21. |
| Veia oblíqua do átrio esquerdo, ramo do nó sinoatrial e do nó atrioventricular, ramos atriais | Citados nas fichas; não existem como malha. |
| Vasos de menor calibre, vasos da perna e do pé, árvore intrapulmonar | M20; perna e pé entram com a F4.3 em diante. |
| Vasos do abdome ligados às vísceras (hepática, esplênica, porta, gástricas) | Entram com o digestório (F6.2, M23). |

## 4. Medições

- Carga no celular emulado (`tools/perf_mobile.js`, CPU 4× mais lenta): o pacote do circulatório custa **≈ 0,66 s** (0,28 s para decodificar, 0,38 s para
  montar as 66 fichas). A medição total foi de 32,5 a 33,8 s numa máquina mais lenta do que a das medições anteriores (a mesma árvore sem a F5 deu 30,0 s
  no mesmo momento), ainda dentro do limite de 35 s do M37.
- Chamadas de desenho: +≈ 90 malhas.

## 5. Pendências da F5

- **Irrigação nos músculos** e a guarda “todo músculo tem ≥ 1 artéria”: M15 (a ficha da artéria já mostra o território em texto).
- Pulsos, pontos de compressão e relações detalhadas: M16. Feixes neurovasculares: M17. Linfáticos: M18. Quiz “o que irriga isto?”: M19.
- Placenta e cordão (esquemas ou HRA): M21. Seios do pericárdio e pleuras: M26.
- Nomes das cúspides: a Terminologia Anatômica e o BodyParts3D (FMA) usam nomes diferentes para as válvulas da aorta e do tronco pulmonar; as fichas dizem isso,
  mas a correspondência exata entre eles não foi conferida em fonte e por isso não está afirmada.
