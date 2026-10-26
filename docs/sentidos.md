# Órgãos dos sentidos e tegumentar (F6.3)

Registro da fase **F6.3** do roteiro (`project_context.md`): o que entrou, de onde vêm as malhas e esquemas por código, como as peças que antes estavam agrupadas foram separadas e o que fica como limitação conhecida. O catálogo está em `src/catalog-sense.js` (25 fichas novas), em `src/catalog-bones.js` (`esclera`, `cornea`, `iris`, `cristalino`, `tarsos` e `orelha`) e em `src/catalog-other.js` (`lingua` e `pele`); as malhas novas estão no pacote `dist/anatomy-sense.js` (227 KB, 167 KB em gzip).

## 1. O que tem (33 estruturas dos sentidos e tegumento)

| Grupo | Fichas | Fonte da malha |
| --- | --- | --- |
| Bulbo do olho — túnica fibrosa e lente | `esclera`, `cornea`, `iris`, `cristalino` | BodyParts3D (`anatomy-data.js`: `esclera_d`/`e`, `cornea_d`/`e`, `iris_d`/`e`, `cristalino_d`/`e`) |
| Bulbo do olho — túnica vascular, retina e câmaras | `corioide`, `corpo_ciliar`, `zonula_ciliar`, `retina`, `corpo_vitreo`, `camara_anterior_olho` | BodyParts3D (`anatomy-sense.js`: `FJ2507`–`FJ2527`, `FJ2557`–`FJ2560`, `FJ2978`, `FJ2987`, `FJ3063`) |
| Anexos da órbita | `anel_tendineo_comum` (de Zinn), `troclea_obliquo_superior`, `tarsos` (placas tarsais superior e inferior) | BodyParts3D (`FJ2509`, `FJ2510`, `FJ2537`, `FJ2538`, `tarsal_sup`/`inf`) |
| Aparelho lacrimal | `glandula_lacrimal`, `lago_lacrimal`, `canaliculos_lacrimais`, `saco_lacrimal`, `ducto_nasolacrimal` | BodyParts3D (`FJ2515`–`FJ2524`, `FJ2531`–`FJ2534`) |
| Orelha externa, média e interna | `orelha` (pavilhão auricular), `meato_acustico_externo`, `membrana_timpanica`, `martelo`, `bigorna`, `estribo`, `tuba_auditiva`, `coclea`, `canais_semicirculares` (vestíbulo e canais) | `orelha`: BodyParts3D (`anatomy-data.js`); demais 8 estruturas: esquema por código (`proc`, `src/catalog-sense.js`) |
| Nariz (cartilagens individualizadas) | `cartilagem_septal`, `cartilagem_nasal_lateral`, `cartilagem_alar_maior` | BodyParts3D (`FJ2815`, `FJ2796`, `FJ2797`, `FJ2799`, `FJ2804`) |
| Cavidade oral e tegumento | `labios`, `lingua`, `pele` (pele, tela subcutânea, supercílios e anexos cutâneos) | BodyParts3D (`FJ2814` em `anatomy-sense.js`; `lingua`, `pele` e `sobrancelha` em `anatomy-data.js` e `pele_inteira` em `anatomy-leg.js`) |

Cada ficha tem quatro campos descritivos completos, `nota` e `relacionados` bidirecionais com os músculos extraoculares e intrínsecos do olho (`reto_sup`, `reto_inf`, `reto_med`, `reto_lat`, `obliquo_sup`, `obliquo_inf`, `levantador_palpebra`, `ciliar`, `esfincter_pupila`, `dilatador_pupila`, `orbicular_olho`), os músculos do ouvido médio e do palato (`tensor_timpano`, `estapedio`, `tensor_veu`, `levantador_veu`, `salpingofaringeo`), os músculos auriculares, nasais, labiais e da língua, os ossos do crânio e da face (`o_temporal`, `o_frontal`, `o_esfenoide`, `o_etmoide`, `o_lacrimal`, `o_nasal`, `o_maxila`, `o_vomer`, `o_concha_inferior`) e as artérias e veias da cabeça (`arteria_oftalmica`, `arteria_facial`, `arteria_lingual`, `arteria_auricular_posterior`, `arteria_temporal_superficial`, `veia_facial`). Além disso, os nervos cranianos e gânglios autônomos (`n_olfatorio`, `n_optico`, `n_lacrimal`, `n_nasociliar`, `n_maxilar`, `n_nasopalatino`, `n_mandibular`, `n_alveolar_inferior`, `n_lingual`, `n_corda_timpano`, `n_petroso_maior`, `g_pterigopalatino`, `n_vestibulococlear`, `n_glossofaringeo`) estão ligados por `ramos` sensitivos/secretomotores (`INNERVATION`) às estruturas correspondentes. O tour **“Órgãos dos sentidos: olho, aparelho lacrimal, orelha e nariz”** (8 passos) percorre todo o conjunto.

## 2. Pipeline e separação de peças agrupadas

```bash
cd tools
python fetch_body.py --pack sense     # 34 elementos do BodyParts3D
python convert_body.py --pack sense   # gera parts_sense.npz e anatomy-sense.js (copie para ../dist/)
```

### 2.1. Separação do globo ocular e das cartilagens nasais
- **Globo ocular (`esclera`, `cornea`, `iris`, `cristalino`):** o pacote inicial `dist/anatomy-data.js` já trazia as 8 malhas separadas (`esclera_d`/`e`, `cornea_d`/`e`, `iris_d`/`e`, `cristalino_d`/`e`), antes reunidas numa única ficha `globo_ocular`. A ficha agrupada foi desmembrada nas quatro estruturas individuais em `src/catalog-bones.js`, somadas às seis estruturas internas do bulbo em `src/catalog-sense.js` (`corioide`, `corpo_ciliar`, `zonula_ciliar`, `retina`, `corpo_vitreo`, `camara_anterior_olho`), sem duplicar triângulos nem provocar z-fighting.
- **Cartilagens nasais (`cartilagem_septal`, `cartilagem_nasal_lateral`, `cartilagem_alar_maior`):** a peça única `cartilagem_nasal` foi substituída pelas três cartilagens individualizadas do BodyParts3D no pacote `anatomy-sense.js`.

### 2.2. Esquemas por código da orelha média e interna
O BodyParts3D não possui malhas do meato acústico externo, da membrana timpânica, dos ossículos da audição, da tuba auditiva nem do labirinto ósseo/membranáceo. Essas oito estruturas foram modeladas por código (`proc` em `src/catalog-sense.js`, espelhadas automaticamente para os dois lados) sobre as coordenadas medidas no modelo:
- `meato_acustico_externo`: da concha do pavilhão auricular (`x = 0.64`) até o anel timpânico (`x = 0.425`).
- `membrana_timpanica`: disco oblíquo em `[0.42, -0.305, -0.008]`, junto à extremidade do músculo `tensor_timpano` e ao trajeto da `n_corda_timpano`.
- `martelo`, `bigorna` e `estribo`: cadeia ossicular do umbigo da membrana timpânica e recesso epitimpânico até a janela do vestíbulo (`[0.335, -0.292, -0.035]`), onde o colo do estribo encontra a ponta do músculo `estapedio`.
- `tuba_auditiva`: tubo oblíquo da parede anterior da caixa do tímpano até a parede lateral da nasofaringe (`[0.14, -0.44, 0.28]`), imediatamente abaixo do semicanal do `tensor_timpano`.
- `coclea`: espiral cônica de 2,5 voltas da base no fundo do meato acústico interno (`[0.255, -0.335, -0.032]`, junto ao ramo coclear do `n_vestibulococlear`) ao ápice anterolateral.
- `canais_semicirculares`: vestíbulo (junto à base do estribo e ao ramo vestibular do `n_vestibulococlear`) e os três arcos ortogonais (anterior, posterior e lateral).

Todas as oito fichas trazem `ESQUEMA` na nota e o selo **Modelada por código (aproximada)**.

## 3. O que fica fora ou como limitação conhecida

| Item | Situação |
| --- | --- |
| Túnica conjuntiva e cápsula de Tenon (bainha do bulbo) | Não possuem malha isolada no BodyParts3D; descritas nas fichas da esclera, da córnea, das placas tarsais e da glândula lacrimal |
| Glândula mamária e unhas | O modelo do BodyParts3D usado no atlas é masculino e não traz glândula mamária nem unhas separadas da malha da pele; os anexos cutâneos são descritos na ficha de `pele` |
| Labirinto membranáceo isolado do labirinto ósseo (ducto coclear, utrículo, sáculo, ductos semicirculares) | Representados em conjunto nos esquemas da `coclea` e de `canais_semicirculares` e detalhados nas respectivas fichas |
