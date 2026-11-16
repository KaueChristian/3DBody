# Sistema urinário e genital masculino (F6.4)

Registro da fase **F6.4** do roteiro (`project_context.md`): o que entrou, de onde vêm as malhas e os esquemas por código, como o canal inguinal e o funículo espermático foram ancorados às peças reais e o que fica como limitação conhecida. O catálogo está em `src/catalog-urin.js` (23 fichas novas) e em `src/catalog-nerves.js` (`n_genitofemoral` e ramos viscerais/perineais de `n_ilioinguinal`, `n_plexo_lombar` e `n_pudendo`); as malhas novas estão no pacote `dist/anatomy-urin.js` (213 KB, 157 KB em gzip).

## 1. O que tem (27 estruturas novas do urinário, genital masculino, vasos e nervos)

| Grupo | Fichas | Fonte da malha |
| --- | --- | --- |
| Rins, pelve renal, fáscia renal e ureteres | `rim_direito`, `rim_esquerdo`, `ureter_direito`, `ureter_esquerdo` (BodyParts3D); `pelve_calices_renais`, `fascia_renal_gerota` (por código) | BodyParts3D (`anatomy-urin.js`: `FJ3147`, `FJ3145`, `FJ3146`, `FJ3144`) e por código |
| Bexiga urinária e uretra | `bexiga_urinaria`, `uretra_masculina` (partes intramural, prostática, membranácea e esponjosa) | BodyParts3D (`FJ3149`, `FJ3148`) |
| Glândulas sexuais acessórias e vias espermáticas | `prostata`, `vesicula_seminal`, `ducto_deferente`, `ducto_ejaculatorio`, `glandulas_bulbouretrais` (de Cowper) | `prostata`, `vesicula_seminal`, `ducto_deferente`: BodyParts3D (`FJ3139`, `FJ3137`, `FJ3143`, `FJ3135`, `FJ3140`); `ducto_ejaculatorio` e `glandulas_bulbouretrais`: esquema por código (`proc`, `src/catalog-urin.js`) |
| Testículo, epidídimo, túnicas escrotais e corpos eréteis do pênis | `epididimo`, `testiculo`, `corpo_cavernoso_penis`, `corpo_esponjoso_penis`, `glande_penis` (BodyParts3D); `tunicas_testiculo_escroto` (por código) | BodyParts3D (`FJ3136`, `FJ3141`, `FJ3138`, `FJ3142`, `FJ3132`, `FJ3133`, `FJ3134`) e por código |
| Canal inguinal, funículo espermático e músculo cremaster | `canal_inguinal` (túnel e ligamento inguinal de Poupart), `funiculo_espermatico`, `cremaster` | Esquema por código (`proc`, `src/catalog-urin.js`) medido sobre o osso do quadril, o ducto deferente e os vasos testiculares |
| Vasos gonadais e penianos | `arteria_testicular`, `veia_testicular` (plexo pampiniforme), `arteria_dorsal_penis`, `veia_dorsal_profunda_penis` | BodyParts3D (`FJ3532`, `FJ3617`, `FJ3533`, `FJ3618`, `FJ3496`, `FJ3497`, `FJ3592`, `FJ3593`, `FJ2056`) |
| Inervação inguinogenital | `n_genitofemoral` (L1–L2, ramos genital e femoral) | Trajeto por código (`NerveBuilder`, `src/catalog-nerves.js`) sobre o psoas maior, ligamento inguinal e funículo espermático |

Cada ficha tem quatro campos descritivos completos (`Localização e estrutura`, `Relações anatômicas`, `Vascularização e inervação`, `Importância clínica` — e `Ação`, `Origem`, `Inserção`, `Inervação` e `Irrigação` no músculo `cremaster`), `nota` e `relacionados` bidirecionais com os órgãos retroperitoneais e pélvicos (`glandula_suprarrenal`, `figado`, `duodeno`, `pancreas`, `baco`, `colo_ascendente`, `colo_descendente`, `colo_sigmoide`, `reto`, `canal_anal`), os músculos da parede abdominal, posteriores do abdome, do assoalho pélvico e do períneo (`diafragma`, `psoas_maior`, `quadrado_lombar`, `iliaco`, `transverso_abdome`, `obliquo_interno`, `obliquo_externo`, `reto_abdome`, `levantador_anus`, `obt_interno`, `esfincter_uretra`, `transverso_profundo_perineo`, `bulboesponjoso`, `isquiocavernoso`), os vasos renais, ilíacos e pudendos (`aorta_abdominal`, `veia_cava_inferior`, `arteria_renal`, `veia_renal`, `arteria_mesenterica_superior`, `arteria_iliaca_comum`, `veia_iliaca_comum`, `arteria_iliaca_interna`, `veia_iliaca_interna`, `arteria_vesical_inferior`, `arteria_pudenda_interna`, `veia_pudenda_interna`, `arteria_epigastrica_inferior`, `veia_epigastrica_inferior`) e a drenagem linfática (`linfonodos_lombares`, `linfonodos_iliacos_internos`, `linfonodos_inguinais`, `cisterna_quilo`). O tour **“Sistema urinário e genital masculino: rins, vias urinárias, próstata, canal inguinal e testículo”** (8 passos) percorre todo o conjunto.

## 2. Pipeline e malhas reais vs. esquemas por código

```bash
cd tools
python fetch_body.py --pack urin     # 24 elementos do BodyParts3D
python convert_body.py --pack urin   # gera parts_urin.npz e anatomy-urin.js (copie para ../dist/)
```

### 2.1. Malhas reais do BodyParts3D
Embora o inventário inicial do roteiro (`project_context.md` §5) listasse como ausentes o ducto deferente (buscado como *ductus deferens*), a glande e os vasos gonadais/penianos, o BodyParts3D traz malhas reais para todos eles com os nomes `deferent duct` (`FJ3135`, `FJ3140`), `glans penis` (`FJ3134`), `testicular artery` (`FJ3532`, `FJ3617`), `testicular vein` (`FJ3533`, `FJ3618`), `dorsal artery of penis` (`FJ3496`, `FJ3497`, `FJ3592`, `FJ3593`) e `deep dorsal vein of penis` (`FJ2056`). Essas 18 peças compõem o pacote `dist/anatomy-urin.js` (213 KB).

### 2.2. Esquemas por código (`proc`)
Cinco estruturas não existem como malhas no BodyParts3D e foram modeladas por código em `src/catalog-urin.js` sobre as coordenadas exatas medidas nas malhas vizinhas:
- `ducto_ejaculatorio`: tubo pareado da confluência da ampola do `ducto_deferente` com o colo da `vesicula_seminal` na base da `prostata` (`[±0.11, -7.28, -0.35]`) até o colículo seminal na parede posterior da `uretra_masculina` prostática (`[±0.025, -7.50, -0.18]`).
- `glandulas_bulbouretrais` (de Cowper): glândula pareada posterolateral à parte membranácea da `uretra_masculina` (`[±0.065, -7.75, -0.11]`, na bolsa profunda do períneo) com seu ducto excretor de 2,5 cm perfurando a membrana perineal para abrir-se no assoalho da uretra bulbar (`[±0.022, -7.90, 0.03]`).
- `canal_inguinal`: envoltório oblíquo do anel inguinal profundo (`[±0.97, -6.81, 0.42]`, lateral à `arteria_epigastrica_inferior`) ao anel inguinal superficial (`[±0.35, -7.32, 0.65]`, superolateral ao tubérculo púbico), acompanhado da faixa do ligamento inguinal de Poupart entre a espinha ilíaca anterossuperior (`[±1.28, -6.41, 0.54]`) e o tubérculo púbico (`[±0.19, -7.35, 0.54]`).
- `funiculo_espermatico`: bainha tubular envolvendo diretamente os trajetos reais do `ducto_deferente`, da `arteria_testicular` e da `veia_testicular` do anel inguinal profundo até a margem posterior do `testiculo`.
- `cremaster`: alças musculares estriadas esqueléticas originadas da margem inferior do `obliquo_interno` e do ligamento inguinal, descendo ao redor do `funiculo_espermatico` e do `testiculo` e retornando ao tubérculo púbico (`[±0.18, -7.38, 0.56]`).

Todas as cinco fichas trazem `ESQUEMA` na nota e o selo **Modelada por código (aproximada)**.

## 3. O que fica fora ou como limitação conhecida

| Item | Situação |
| --- | --- |
| Pelve renal, cálices renais e fáscia renal (de Gerota) | Entregues como esquemas por código (`pelve_calices_renais` e `fascia_renal_gerota`); o córtex e as pirâmides renais são detalhados nas fichas de `rim_direito`, `rim_esquerdo` e `pelve_calices_renais` |
| Túnica vaginal do testículo, túnica dartos e pele escrotal | Entregues como esquema por código (`tunicas_testiculo_escroto`), com as seis camadas escrotais e a diferença de drenagem linfática (inguinais superficiais vs. lombares) |
| Órgãos genitais femininos (ovário, tuba uterina, útero, vagina, vulva) | Entregues na camada opcional `feminino` (`src/catalog-fem.js`, F6.5) e integrados no tour `urogenital_integrado` (F6.7) |
