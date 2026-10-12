# Sistema respiratório (F6.1): pulmões

Registro da fase **F6.1** do roteiro (`project_context.md`). **Em andamento:** os pulmões estão prontos; faltam a árvore brônquica, a traqueia e as
cartilagens da laringe (BodyParts3D, aguardando autorização do download), as pleuras, o tour e o quiz do sistema.

## 1. O que tem hoje (5 fichas)

Lobo superior, médio e inferior do pulmão direito e lobo superior e inferior do pulmão esquerdo (`src/catalog-resp.js`), na camada “Sistema respiratório”.
Cada ficha traz localização e limites, faces e relações, segmentos broncopulmonares (numeração S1 a S10), aspectos clínicos e a nota sobre a origem da
malha. As fichas se ligam entre si e às artérias e veias pulmonares do circulatório (nos dois sentidos).

## 2. Fonte e pipeline

O BodyParts3D não tem pulmões. As malhas vêm do **Atlas de Referência Humano** (HuBMAP/NIH; CC BY 4.0; ver [`fonte-hra-atlas-de-referencia.md`](fonte-hra-atlas-de-referencia.md)),
arquivo `lung-male` v1.4 (10,9 MB, GLB), baixado com autorização do responsável para `tools/hra/` (fora do git). O arquivo contém, por segmento broncopulmonar,
uma malha de baixa resolução (≈ 1 a 4 mil triângulos), além do hilo de cada lobo, dos brônquios lobares e segmentares e das cartilagens brônquicas (estas, de 80 mil
vértices cada, não são usadas).

```bash
cd tools
python fit_hra.py        # ajusta os pulmões ao tórax → hra_transform.json
python convert_hra.py    # lobos → anatomy-resp.js (copie para ../dist/)
```

(Com `python -P`, defina `PYTHONPATH=.`.) Cada lobo é a fusão dos seus segmentos e do hilo correspondente (16,7 mil triângulos nos cinco; 114 KB no pacote).

## 3. Alinhamento ao corpo do atlas

O corpo do atlas é o do BodyParts3D (uma pessoa viva, de caixa torácica ampla); o do HRA é o Visible Human (cadáver, de pulmões menores). Não há como encaixar os dois com
escala única: `fit_hra.py` procura uma **escala por eixo** e uma translação, sem rotação (os dois estão na posição anatômica, com os mesmos eixos), que minimizam:

- a distância da base dos lobos inferiores ao diafragma;
- as distâncias das faces lateral, posterior e anterior às costelas, às cartilagens costais, ao esterno e à coluna;
- o quanto os pulmões passam para fora do envelope interno da caixa torácica (em coordenadas cilíndricas);
- o quanto entram no coração (casco convexo do coração); o encaixe é a incisura cardíaca do pulmão esquerdo;
- a distância do ápice à 1ª costela e a dos hilos às pontas das artérias pulmonares.

Resultado: escala **9,16 (x) × 11,01 (y) × 7,51 (z)** e translação (−0,01; −8,32; 0,18). Os pulmões ficam entre x = −1,15 e 1,22, y = −4,07 e −1,55 e z = −0,51 e 0,91;
no navegador ficam dentro das costelas, acima do diafragma e com a incisura cardíaca acolhendo o coração. A distorção (os pulmões ficam 20% mais altos e 18% menos profundos
do que no cadáver) é a diferença entre os dois corpos; a ficha diz que o encaixe é aproximado.

**Refinamento previsto:** assim que os brônquios do BodyParts3D estiverem no pacote, ajustar também os brônquios segmentares do HRA a eles (ICP), o que fixa melhor a posição
dos hilos e da base.

## 4. O que ainda falta na F6.1

| Item | Situação |
| --- | --- |
| Traqueia, brônquios principais e as 20 árvores segmentares | Do BodyParts3D: 29 peças, **1,65 MB, aguardando autorização do download**. As 20 árvores repartem os 98 elementos de “segmento da árvore brônquica” sem sobra |
| Cartilagens da laringe (tireóidea, cricóidea, aritenóideas, epiglote, corniculadas e cuneiformes) | Mesmo download (≈ 0,25 MB dos 1,65 MB) |
| Pleuras e mediastino | Esquemáticos por código (M26), declarados na ficha |
| Segmentos broncopulmonares | Cada lobo cita os seus segmentos; os brônquios segmentares do BodyParts3D darão uma ficha por segmento |
| Tour “Sistema respiratório” e quiz | Depois da árvore brônquica |
| Nariz, cavidade nasal e seios paranasais | Verificar o que o plano de ensino cobra |
