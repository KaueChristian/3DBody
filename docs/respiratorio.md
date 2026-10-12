# Sistema respiratório (F6.1)

Registro da fase **F6.1** do roteiro (`project_context.md`): o que entrou, de onde vem, como os pulmões foram ajustados ao corpo do atlas e o que falta. O
catálogo está em `src/catalog-resp.js` (pulmões) e `src/catalog-resp-airways.js` (vias aéreas, pleuras e cartilagens da laringe); as malhas, no pacote
`dist/anatomy-resp.js` (598 KB).

## 1. O que tem (36 fichas)

| Grupo | Fichas | Fonte da malha |
| --- | --- | --- |
| Pulmões | lobos superior, médio e inferior do pulmão direito; superior e inferior do esquerdo | Atlas de Referência Humano (HRA), CC BY 4.0 |
| Traqueia e brônquios principais | traqueia (com os anéis cartilagíneos), brônquio principal direito e esquerdo | BodyParts3D |
| Brônquios segmentares | 20: B1 a B10 de cada lado (a língula tem B4 e B5 no lado esquerdo) | BodyParts3D |
| Cartilagens da laringe | tireóidea, cricóidea, aritenóideas, epiglote, corniculadas e cuneiformes | BodyParts3D |
| Pleuras | pleura e cavidade pleural direita e esquerda, **esquema** (contorno de cada pulmão, inflado) | por código (`src/hull-geo.js`) |

Cada ficha cita as vizinhas (chips): cada lobo lista os seus brônquios segmentares e as artérias e veias pulmonares; cada brônquio segmentar leva ao lobo e ao brônquio
principal. O tour **“Sistema respiratório: da laringe aos pulmões”** (7 passos) vai da cartilagem cricóidea às pleuras. Os brônquios segmentares seguem a numeração de Boyden
(B1 a B10), e as fichas dizem onde as fontes fundem segmentos (apicoposterior, anteromedial basal). Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.).

## 2. Pipeline

```bash
cd tools
python fetch_body.py --pack resp       # 111 elementos do BodyParts3D, ≈ 1,7 MB compactados
python convert_body.py --pack resp     # vias aéreas e cartilagens → anatomy-resp.js (copie para ../dist/)
python fit_hra.py                      # ajusta os pulmões do HRA ao tórax → hra_transform.json
python convert_hra.py --append         # lobos do HRA acrescentados ao pacote em ../dist/ (copie o resultado para ../dist/)
```

(Com `python -P`, defina `PYTHONPATH=.`.) O GLB do HRA (`lung-male` v1.4, 10,9 MB, em `tools/hra/`, fora do git) traz, por segmento broncopulmonar, uma malha de baixa resolução
(≈ 1 a 4 mil triângulos), os hilos, os brônquios lobares e segmentares e as cartilagens brônquicas (estas, de 80 mil vértices, não são usadas). Cada lobo é a fusão dos seus segmentos e
do hilo correspondente (16,7 mil triângulos nos cinco).

As 20 árvores segmentares do BodyParts3D repartem exatamente os 98 elementos de “segment of bronchial tree”, sem sobra nem repetição. O banco **não** tem os brônquios lobares (entre o principal
e o segmentar) nem as pleuras.

## 3. Alinhamento dos pulmões ao corpo do atlas

O corpo do atlas é o do BodyParts3D (uma pessoa viva, de caixa torácica ampla); o do HRA é o Visible Human (cadáver, de pulmões menores). Não há como encaixar os dois com escala única:
`fit_hra.py` procura uma **escala por eixo** e uma translação, sem rotação (os dois estão na posição anatômica, com os mesmos eixos), que minimizam:

- a distância da base dos lobos inferiores ao diafragma;
- as distâncias das faces lateral, posterior e anterior às costelas, às cartilagens costais, ao esterno e à coluna;
- o quanto os pulmões passam para fora do envelope interno da caixa torácica (em coordenadas cilíndricas) e o quanto entram no coração (a incisura cardíaca do pulmão esquerdo acolhe o coração);
- a distância do ápice à 1ª costela e a dos hilos às pontas das artérias pulmonares;
- a distância dos brônquios lobares e segmentares do HRA aos do BodyParts3D (são a mesma árvore), e o quanto as pontas dos brônquios do BodyParts3D ficam fora do casco de cada pulmão.

Resultado: escala **8,99 (x) × 12,00 (y) × 7,14 (z)** e translação (0,00; −8,76; 0,18). Os pulmões ficam entre x = −1,12 e 1,21, y = −4,13 e −1,38 e z = −0,48 e 0,87. Os brônquios segmentares ficam dentro
do casco dos pulmões (erro quadrático médio de ≈ 2 mm para fora) e o desvio entre as duas árvores brônquicas é de ≈ 1,4 cm (raiz do erro quadrático médio). A distorção (os pulmões ficam 33% mais altos e 21% menos profundos do
que no cadáver) é a diferença entre os dois corpos; cada ficha diz que o encaixe é aproximado.

## 4. Medições

- Carga no celular emulado (`tools/perf_mobile.js`, CPU 4× mais lenta): o pacote do respiratório custa **≈ 0,54 s** (0,09 s para decodificar, 0,45 s para montar as 36 fichas); o total ficou em **22,1 s**.
- O teste de fumaça confere a posição dos pulmões (dentro das costelas, ápice perto da 1ª costela, o esquerdo encostando no coração), os 20 brônquios segmentares, os lados e o tour.

## 5. O que ainda falta

| Item | Situação |
| --- | --- |
| Brônquios lobares | Não existem no BodyParts3D; estão no GLB do HRA e poderiam entrar no pacote (≈ 6 peças pequenas) se a prática cobrar |
| Pleuras e mediastino de verdade | Esquema (M26): só o contorno de cada pulmão; sem lâminas, recessos nem cúpula |
| Quiz “localizar” dos brônquios | Os tipos “Órgãos” e “Ossos” já entram no quiz de localizar e no de escolher o nome |
| Nariz, cavidade nasal e seios paranasais | Verificar o que o plano de ensino cobra (ossos e cartilagens nasais existem no atlas) |
| Diafragma, intercostais e músculos acessórios | Já existem no catálogo (músculos do tórax) |
| Fissuras (oblíqua e horizontal) como estruturas separadas | Aparecem como o limite entre os lobos; sem ficha própria |
