# Sistema digestório e baço (F6.2)

Registro da fase **F6.2** do roteiro (`project_context.md`): o que entrou, de onde vêm as malhas, como foram separados os trechos combinados do BodyParts3D e o que fica para depois. O catálogo está em `src/catalog-digest.js` (34 fichas novas, mais o vínculo com as glândulas salivares maiores e a língua em `src/catalog-other.js`); as malhas estão no pacote `dist/anatomy-digest.js` (687 KB, 510 KB em gzip).

## 1. O que tem (34 fichas novas + 4 da cavidade oral)

| Grupo | Fichas | Fonte da malha |
| --- | --- | --- |
| Esôfago e estômago | `esofago` (cervical, torácico e abdominal), `estomago` (cárdia, fundo, corpo e parte pilórica) | BodyParts3D (`FJ2565`, `FJ2572`) |
| Intestino delgado | `duodeno`, `jejuno`, `ileo` | BodyParts3D (`FJ2563`, `FJ2568`, `FJ2569`) |
| Intestino grosso | `ceco`, `apendice_vermiforme`, `colo_ascendente`, `colo_transverso`, `colo_descendente`, `colo_sigmoide`, `tenias_colo`, `reto`, `canal_anal` | BodyParts3D (`FJ2562`–`FJ2571`, `FJ3081`–`FJ3123`) |
| Fígado (8 segmentos de Couinaud) | `figado_lobo_caudado` (S-I), `figado_seg_ii` (S-II), `figado_seg_iii` (S-III), `figado_lobo_quadrado` (S-IV), `figado_seg_v` (S-V), `figado_seg_vi` (S-VI), `figado_seg_vii` (S-VII), `figado_seg_viii` (S-VIII) | BodyParts3D (`FJ2816`, `FJ2818`–`FJ2824`) |
| Vesícula e vias biliares extra-hepáticas | `vesicula_biliar`, `ducto_cistico`, `ducto_hepatico_direito`, `ducto_hepatico_esquerdo`, `ducto_hepatico_comum`, `ducto_coledoco` | BodyParts3D (`FJ2564`, `FJ3071`–`FJ3080`) |
| Pâncreas e baço | `pancreas`, `ducto_pancreatico` (de Wirsung), `baco` | BodyParts3D (`FJ1895`, `FJ1896`, `FJ2561`) |
| Peritônio e mesos | `mesenterio`, `mesocolo_transverso`, `mesoapendice` | BodyParts3D (`FJ3396`–`FJ3398`) |
| Cavidade oral e faringe (já existentes, agora integradas) | `lingua`, `parotida`, `submandibular`, `sublingual` (`src/catalog-other.js`), músculos da língua, do palato mole e constritores da faringe (`src/catalog-muscles-oral.js`), dentes (`src/catalog-bones.js`) | BodyParts3D |

Cada ficha tem quatro campos descritivos (**Localização e partes**, **Relações e peritônio**, **Irrigação, drenagem e inervação**, **Clínica**), `nota` e `relacionados` bidirecionais com os órgãos vizinhos, os ramos do tronco celíaco e das artérias mesentéricas superior e inferior, o sistema porta hepático, as veias cavas e os linfonodos abdominais. O tour **“Sistema digestório: do esôfago ao reto, fígado e pâncreas”** (8 passos) percorre todo o sistema. Textos próprios, a partir de Moore, Dalley & Agur (8ª ed.), Gray's Anatomy (42ª ed.), Netter (7ª ed.) e Terminologia Anatômica (FIPAT, 2019).

**Nomenclatura dos segmentos do fígado** (acrescentado na auditoria de 2026-10-22): os nomes em português seguem a divisão
cirúrgica (Couinaud, revista em Brisbane, 2000: setores anterior e posterior, segmentos superior e inferior); o latim é o da TA, que
chama de *anterior* o segmento inferior e de *posterior* o superior e, no lobo direito, de *lateral* e *medial* os setores posterior e
anterior. Por isso o VI é "posterior inferior" no nome e *anterius laterale dextrum* no latim, sem contradição: cada ficha dos
segmentos II, III e V a VIII traz uma nota que explica a correspondência.

## 2. Pipeline e recortes geométricos

```bash
cd tools
python fetch_body.py --pack digest     # 96 elementos do BodyParts3D
python convert_body.py --pack digest   # gera parts_digest.npz e anatomy-digest.js (copie para ../dist/)
```

### 2.1. Malhas duplicadas descartadas no BodyParts3D
No arquivo de conceitos do BodyParts3D (`isa_element_parts.txt`), algumas entradas repetem malhas já presentes em conceitos vizinhos:
- **Segmentos hepáticos:** `FJ2409` (listado sob *hepatovenous segment vii*) é cópia exata dos vértices de `FJ2822` (*segment vi*), e `FJ1858` (*segment ix*) é cópia exata de `FJ2823` (que, junto de `FJ2824`, está sob *segment viii*). Os oito segmentos contíguos e sem sobreposição do fígado no BodyParts3D são `FJ2816` (I), `FJ2818` (II), `FJ2819` (III), `FJ2820` (IV), `FJ2821` (V), `FJ2822` (VI), `FJ2823` (VII) e `FJ2824` (VIII).
- **Pâncreas e ducto pancreático:** `FJ2629` (*parenchyma of pancreas*) duplica `FJ1895` (*pancreas*) e `FJ2630` (*pancreatic duct tree*) duplica `FJ1896` (*pancreatic duct*). Usam-se apenas `FJ1895` e `FJ1896` para evitar z-fighting interno.

### 2.2. Recortes de peças fundidas (`split_cut` em `tools/convert_body.py`)
Quatro conceitos do BodyParts3D trazem duas estruturas anatômicas contínuas na mesma malha `.obj`; `split_cut` separa os triângulos pelo centróide na altura anatômica de transição:
- **Ceco e colo ascendente (`FJ2566`):** corte em `y = -6.22` (nível do óstio ileocecal e da junção com o íleo terminal, em `y ≈ -6.22`). Abaixo fica o `ceco` (fossa ilíaca direita, ligado ao `apendice_vermiforme`); acima, o `colo_ascendente` até a flexura direita do colo.
- **Colo descendente e colo sigmoide (`FJ2567`):** corte em `y >= -6.32` e `x >= 0.58` (crista ilíaca esquerda). O trecho retroperitoneal vertical lateral forma o `colo_descendente`; a alça em S que desce para a pelve menor até S3 (`x` de `0.85` a `-0.02`, `y` até `-7.00`) forma o `colo_sigmoide`.
- **Reto e canal anal (`FJ2571`):** corte em `y = -7.46` (flexura anorretal / alça do músculo puborretal no diafragma da pelve). Acima fica o `reto` pélvico; abaixo, o `canal_anal` no períneo.
- **Ducto hepático comum e ducto colédoco (`FJ3079`):** corte em `y = -4.51` (junção com o ducto cístico, `FJ3072`). Acima da junção fica o `ducto_hepatico_comum`; abaixo, o `ducto_coledoco` até a parede posteromedial do duodeno descendente.

## 3. O que fica fora ou como limitação conhecida

| Item | Situação |
| --- | --- |
| Omento maior e omento menor | O BodyParts3D traz o mesentério (`FJ3396`), o mesocolo transverso (`FJ3398`) e o mesoapêndice (`FJ3397`), mas não tem malha para o omento maior nem para o omento menor; ambos são descritos nas fichas do estômago, do duodeno, do fígado e do colo transverso |
| Ductos das glândulas salivares (parotídeo de Stenon, submandibular de Wharton) | Não têm malha no banco; o trajeto e as relações (bucinador / 2º molar superior; nervo lingual / carúncula sublingual) estão nas fichas das glândulas |
| Ducto pancreático acessório (de Santorini) e ampola hepatopancreática (de Vater) | Não estão individualizados da malha de `FJ1896`; descritos nas fichas do ducto pancreático, do colédoco e do duodeno |
