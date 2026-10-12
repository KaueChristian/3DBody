# Inventário do membro inferior no BodyParts3D (F4.1)

Registro do item **F4.1** do roteiro (`project_context.md`): o que o banco tem para o membro inferior e a pelve, o que ficou de
fora, quanto isso pesa e como o pacote de dados foi decidido. Gerado em 2026-10-12 a partir de `tools/isa_element_parts.txt`
(2 906 conceitos) e `tools/zip_index.tsv` com `python body_parts.py leg`; as peças estão definidas em `tools/body_parts.py`
(`pack="leg"`), resolvidas **sem nenhuma peça sem elemento**.

## 1. Decisão do pacote de dados (risco 2 do roteiro)

- **Um pacote por região, carregado em segundo plano logo depois do corpo:** `dist/anatomy-leg.js`
  (`window.__ANATOMY_LEG`). Ele traz as malhas do membro inferior **e a pele inteira** (com as pernas). A ordem de carga é
  cabeça → corpo → membro inferior → nervos, para os nervos já nascerem sobre a pele inteira.
- **Não é sob demanda:** a região “Corpo” precisa das pernas e a pele inteira vem junto, então um pacote sob demanda só adiaria
  o custo sem poupar nada. A decisão volta a ser discutida se o tempo de carga estourar o limite da §3 (M37).
- **Pele inteira em vez de pele das pernas:** a pele do pacote `body` foi cortada na cintura (`pele_corpo`); recortar só as pernas
  e emendar deixaria frestas na cintura. A peça `pele_inteira` (155 mil triângulos, a mesma decimação global) substitui a pele
  assim que o pacote carrega. `pele_corpo` continua no pacote `body`, sem uso depois disso, até esse pacote ser regenerado (≈ 1 MB;
  M40 em `pontos-de-melhoria.md`).
- **Peças pareadas:** o banco traz os dois lados em cada conceito (e também os conceitos “left …/right …”); a união dá o par, e
  nenhuma peça do membro inferior precisou de espelho (`mirror`).

## 2. Tamanho

| Pacote | Peças | Triângulos (teto) | `.js` |
| --- | --- | --- | --- |
| `anatomy-leg.js` após a F4.1 (ossos, sesamoides e pele inteira) | 32 | ≈ 54 mil + 155 mil | 1,85 MB (ossos ≈ 0,45 MB, pele ≈ 1,4 MB) |
| `anatomy-leg.js` **hoje**, com o lote A (24 músculos) | 56 | + 122 mil (real) | **2,9 MB** (os músculos do lote A: 1,05 MB, contra 1,36 MB nos tetos) |
| Mais os músculos e a membrana interóssea (lotes A, B e C), nos tetos da tabela | +52 | +278 mil | **+≤ 2,5 MB** (o real tende a ficar abaixo: várias peças já têm menos triângulos que o teto) |
| Pacote final previsto | 84 | ≈ 490 mil | **≈ 4,4 MB** no pior caso |

Calibragem: 9,1 bytes de `.js` por triângulo (medido em `anatomy-body.js`: 912 559 triângulos em 8,1 MB). O orçamento da F4.1
era ≤ + 8 MB; o previsto é a metade. Com ele, o total de dados vai de 12,05 MB para ≈ 14 MB agora e ≈ 16,5 MB no marco 3.0,
bem abaixo da meta de 30 MB do `.exe` (§3.5).

## 3. Tempo de carga (celular emulado)

`node tools/perf_mobile.js 4` (CPU 4× mais lenta, GPU por software; `docs/otimizacao-mobile.md`), nesta máquina em 2026-10-12:

| Marco | Antes (HEAD, 2 execuções) | Com a F4.1 |
| --- | --- | --- |
| `ttfiMs` (primeira imagem) | 3 496 · 3 574 | 3 471 |
| `bodyDataMs` + `bodyStructuresMs` | 1 740 + 2 993 · 1 702 + 2 548 | 1 594 + 2 804 |
| `legDataMs` + `legStructuresMs` | — | **926 + 368** |
| `nervesMs` | 17 568 · 17 446 | 17 656 |
| `totalReadyMs` | **26 844 · 26 338** | **28 439** |

A F4.1 custa **≈ 1,3 s** (+ 5 %) no celular emulado; os nervos não mudaram com a pele nova. O tempo total antes da F4.1 já é maior
que os 19 s medidos em 2026-10-08 (hoje há 100 nervos, não 55, e a máquina tem ruído). **Limite combinado:** se `totalReadyMs`
passar de **35 000 ms** nesta medição, a otimização do celular (**M37**) passa na frente dos próximos lotes. A medição deve ser
repetida ao fim do lote A (F4.2) e, de novo, depois dos nervos da F4.5, que acrescentam ao laço mais caro (17,6 s).

Após o lote A (F4.2), duas execuções: `legDataMs` 1 163 · 1 368, `legStructuresMs` 602 · 698, `nervesMs` 20 218 · 20 312 e `totalReadyMs` **31 739 · 32 739**.
Os 7 nervos novos custaram ≈ 2,6 s (≈ 0,37 s cada; a média dos 100 anteriores é 0,18 s). A F4.5 acrescenta ≈ 7 nervos longos com dezenas de
ramos: previsão de 35–38 s. **A otimização da carga dos nervos (M37, leva 1) deve vir antes da F4.5.** *(Feita em 2026-10-12: com a renderização sob demanda o `totalReadyMs` caiu para 22,6–24,0 s; ver `otimizacao-mobile.md` §0.)*

No computador (navegador embutido, sem emulação), após a F4.1: `legDataMs` 59 ms, `legStructuresMs` 93 ms, `totalReadyMs` 3 603 ms.

## 4. Peças definidas (84, todas com elementos no banco)

Tetos de triângulos por peça como no pacote `body` (músculos de 1 500 a 11 000; ossos e sesamoides menores). “Lote” diz quando a
peça é baixada, convertida e catalogada; as do F4.1 e do lote A (F4.2) já estão em `dist/anatomy-leg.js` (2,9 MB). Comandos, dentro de `tools/`:
`python fetch_body.py --pack leg <ids>` e `python convert_body.py --pack leg [--append] <ids>`.

| Lote | Tipo | Id da peça | Conceito do banco | Elementos | zip (KB) | Teto de triângulos |
| --- | --- | --- | --- | --- | --- | --- |
| F4.1 (no pacote) | pele | `pele_inteira` | skin | 1 | 4130 | 155 000 |
| F4.1 (no pacote) | osso | `falange_pe_distal_halux` | distal phalanx of big toe | 2 | 19 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_distal_minimo` | distal phalanx of little toe | 2 | 10 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_distal_quarto` | distal phalanx of fourth toe | 2 | 10 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_distal_segundo` | distal phalanx of second toe | 2 | 11 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_distal_terceiro` | distal phalanx of third toe | 2 | 13 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_media_minimo` | middle phalanx of little toe | 2 | 8 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_media_quarto` | middle phalanx of fourth toe | 2 | 14 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_media_segundo` | middle phalanx of second toe | 2 | 13 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_media_terceiro` | middle phalanx of third toe | 2 | 13 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_proximal_halux` | proximal phalanx of big toe | 2 | 22 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_proximal_minimo` | proximal phalanx of little toe | 2 | 17 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_proximal_quarto` | proximal phalanx of fourth toe | 2 | 18 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_proximal_segundo` | proximal phalanx of second toe | 2 | 17 | 900 |
| F4.1 (no pacote) | osso | `falange_pe_proximal_terceiro` | proximal phalanx of third toe | 2 | 18 | 900 |
| F4.1 (no pacote) | osso | `femur` | femur | 2 | 124 | 7 000 |
| F4.1 (no pacote) | osso | `fibula` | fibula | 2 | 46 | 5 000 |
| F4.1 (no pacote) | osso | `metatarsal_1` | first metatarsal bone | 2 | 47 | 1 500 |
| F4.1 (no pacote) | osso | `metatarsal_2` | second metatarsal bone | 2 | 34 | 1 500 |
| F4.1 (no pacote) | osso | `metatarsal_3` | third metatarsal bone | 2 | 31 | 1 500 |
| F4.1 (no pacote) | osso | `metatarsal_4` | fourth metatarsal bone | 2 | 30 | 1 500 |
| F4.1 (no pacote) | osso | `metatarsal_5` | fifth metatarsal bone | 2 | 34 | 1 500 |
| F4.1 (no pacote) | osso | `patela` | patella | 2 | 13 | 1 500 |
| F4.1 (no pacote) | osso | `sesamoides_pe` | sesamoid bone of foot | 4 | 13 | 600 |
| F4.1 (no pacote) | osso | `tarso_calcaneo` | calcaneus | 2 | 55 | 2 500 |
| F4.1 (no pacote) | osso | `tarso_cuboide` | cuboid bone | 2 | 39 | 1 500 |
| F4.1 (no pacote) | osso | `tarso_cuneiforme_intermedio` | intermediate cuneiform bone | 2 | 21 | 1 500 |
| F4.1 (no pacote) | osso | `tarso_cuneiforme_lateral` | lateral cuneiform bone | 2 | 28 | 1 500 |
| F4.1 (no pacote) | osso | `tarso_cuneiforme_medial` | medial cuneiform bone | 2 | 43 | 1 500 |
| F4.1 (no pacote) | osso | `tarso_navicular` | navicular bone of foot | 2 | 32 | 1 500 |
| F4.1 (no pacote) | osso | `tarso_talo` | talus | 2 | 59 | 2 500 |
| F4.1 (no pacote) | osso | `tibia` | tibia | 2 | 67 | 7 000 |
| F4.2 (lote A) | musculo | `adutor_curto` | adductor brevis | 2 | 69 | 5 000 |
| F4.2 (lote A) | musculo | `adutor_longo` | adductor longus | 2 | 111 | 6 000 |
| F4.2 (lote A) | musculo | `adutor_magno` | adductor magnus | 2 | 297 | 11 000 |
| F4.2 (lote A) | musculo | `adutor_minimo` | adductor minimus | 2 | 95 | 5 000 |
| F4.2 (lote A) | musculo | `biceps_femoral_curta` | short head of biceps femoris | 2 | 79 | 5 000 |
| F4.2 (lote A) | musculo | `biceps_femoral_longa` | long head of biceps femoris | 2 | 211 | 7 000 |
| F4.2 (lote A) | musculo | `gemeo_inferior` | gemellus inferior | 2 | 31 | 3 000 |
| F4.2 (lote A) | musculo | `gemeo_superior` | gemellus superior | 2 | 24 | 3 000 |
| F4.2 (lote A) | musculo | `gluteo_maximo` | gluteus maximus | 2 | 121 | 9 000 |
| F4.2 (lote A) | musculo | `gluteo_medio` | gluteus medius | 2 | 153 | 8 000 |
| F4.2 (lote A) | musculo | `gluteo_minimo` | gluteus minimus | 2 | 195 | 7 000 |
| F4.2 (lote A) | musculo | `gracil` | gracilis | 2 | 143 | 5 000 |
| F4.2 (lote A) | musculo | `obturador_externo` | obturator externus | 2 | 41 | 4 500 |
| F4.2 (lote A) | musculo | `pectineo` | pectineus | 2 | 63 | 4 500 |
| F4.2 (lote A) | musculo | `piriforme` | piriformis | 2 | 51 | 4 500 |
| F4.2 (lote A) | musculo | `quadrado_femoral` | quadratus femoris | 2 | 59 | 4 500 |
| F4.2 (lote A) | musculo | `reto_femoral` | rectus femoris | 2 | 238 | 8 000 |
| F4.2 (lote A) | musculo | `sartorio` | sartorius | 2 | 164 | 6 000 |
| F4.2 (lote A) | musculo | `semimembranaceo` | semimembranosus | 2 | 194 | 7 000 |
| F4.2 (lote A) | musculo | `semitendineo` | semitendinosus | 2 | 123 | 6 000 |
| F4.2 (lote A) | musculo | `tensor_fascia_lata` | tensor fasciae latae | 2 | 63 | 5 000 |
| F4.2 (lote A) | musculo | `vasto_intermedio` | vastus intermedius | 2 | 188 | 8 000 |
| F4.2 (lote A) | musculo | `vasto_lateral` | vastus lateralis | 2 | 282 | 9 000 |
| F4.2 (lote A) | musculo | `vasto_medial` | vastus medialis | 2 | 198 | 8 000 |
| F4.3 (lote B) | ligamento | `membrana_interossea_perna` | interosseous membrane of leg | 2 | 279 | 6 000 |
| F4.3 (lote B) | musculo | `extensor_longo_dedos` | extensor digitorum longus | 2 | 242 | 7 000 |
| F4.3 (lote B) | musculo | `extensor_longo_halux` | extensor hallucis longus | 2 | 82 | 4 500 |
| F4.3 (lote B) | musculo | `fibular_curto` | fibularis brevis | 2 | 90 | 4 500 |
| F4.3 (lote B) | musculo | `fibular_longo` | fibularis longus | 2 | 189 | 7 000 |
| F4.3 (lote B) | musculo | `fibular_terceiro` | fibularis tertius | 2 | 78 | 3 500 |
| F4.3 (lote B) | musculo | `flexor_longo_dedos` | flexor digitorum longus | 2 | 199 | 7 000 |
| F4.3 (lote B) | musculo | `flexor_longo_halux` | flexor hallucis longus | 2 | 126 | 6 000 |
| F4.3 (lote B) | musculo | `gastrocnemio_lateral` | lateral head of gastrocnemius | 2 | 129 | 5 500 |
| F4.3 (lote B) | musculo | `gastrocnemio_medial` | medial head of gastrocnemius | 2 | 163 | 6 500 |
| F4.3 (lote B) | musculo | `plantar` | plantaris | 2 | 108 | 3 500 |
| F4.3 (lote B) | musculo | `popliteo` | popliteus | 2 | 40 | 4 000 |
| F4.3 (lote B) | musculo | `soleo` | soleus | 2 | 192 | 8 000 |
| F4.3 (lote B) | musculo | `tibial_anterior` | tibialis anterior | 2 | 131 | 6 000 |
| F4.3 (lote B) | musculo | `tibial_posterior` | tibialis posterior | 2 | 293 | 8 000 |
| F4.4 (lote C) | musculo | `abdutor_halux` | abductor hallucis | 2 | 56 | 4 500 |
| F4.4 (lote C) | musculo | `abdutor_minimo_pe` | abductor digiti minimi of foot | 2 | 73 | 4 000 |
| F4.4 (lote C) | musculo | `adutor_halux_obliquo` | oblique head of adductor hallucis | 2 | 60 | 3 000 |
| F4.4 (lote C) | musculo | `adutor_halux_transverso` | transverse head of adductor hallucis | 2 | 51 | 3 000 |
| F4.4 (lote C) | musculo | `extensor_curto_halux` | extensor hallucis brevis | 2 | 67 | 3 000 |
| F4.4 (lote C) | musculo | `flexor_curto_dedos` | flexor digitorum brevis | 2 | 145 | 5 000 |
| F4.4 (lote C) | musculo | `flexor_curto_halux_lateral` | lateral head of flexor hallucis brevis | 2 | 107 | 2 500 |
| F4.4 (lote C) | musculo | `flexor_curto_halux_medial` | medial head of flexor hallucis brevis | 2 | 59 | 2 500 |
| F4.4 (lote C) | musculo | `flexor_curto_minimo_pe` | flexor digiti minimi brevis of foot | 2 | 43 | 2 500 |
| F4.4 (lote C) | musculo | `interosseos_plantares` | first plantar interosseous of foot | 6 | 112 | 4 500 |
| F4.4 (lote C) | musculo | `lumbricais_pe` | first lumbrical of foot | 8 | 100 | 3 500 |
| F4.4 (lote C) | musculo | `oponente_minimo_pe` | opponens digiti minimi of foot | 2 | 13 | 1 500 |
| F4.4 (lote C) | musculo | `quadrado_plantar` | flexor accessorius | 2 | 43 | 3 000 |

Totais por lote (peças · zip em KB · teto de triângulos): **F4.1 (no pacote)** 32 · 5049 · 208 700; **F4.2 (lote A)** 24 · 3193 · 149 000; **F4.3 (lote B)** 15 · 2341 · 87 000; **F4.4 (lote C)** 13 · 929 · 42 500.

## 5. O que o banco **não** tem (modelar por código, ou adiar)

Buscado por nome no índice em 2026-10-12. Cada item aponta o ponto de melhoria ou a fase em que entra.

| Estrutura | Situação no banco | Destino |
| --- | --- | --- |
| Ligamentos do quadril (iliofemoral, pubofemoral, isquiofemoral, da cabeça do fêmur) | **nenhum** | F4.6, por código sobre os ossos (como na F3a) |
| Joelho: ligamentos cruzados, colaterais e patelar; meniscos | **nenhum** | F4.6, por código |
| Tornozelo: deltóideo, talofibulares e calcaneofibular | **nenhum** | F4.6, por código |
| Pelve: sacrotuberal, sacroespinal, inguinal, membrana obturadora, sínfise púbica e sacroilíaca | **nenhum** | F4.6, por código |
| Articular do joelho | não encontrado | M14 (por código) |
| Extensor curto dos dedos (só existe o extensor curto do **hálux**) | só o do hálux | M14 |
| Interósseos **dorsais** do pé (só os plantares) | só os plantares | M14 |
| Aponeurose plantar e retináculos do tornozelo | **nenhum** | M13 |
| Trato iliotibial (conceito “iliotibial tract”, 695 KB no zip) e zona da fáscia lata | **tem** (pesado: ≈ 2,3 MB de OBJ) | ainda não definido; M13 decide |
| Membrana interóssea da perna | **tem** | F4.3 (peça `membrana_interossea_perna`) |
| Nervos | **nenhum** do membro inferior | F4.5 (pontos medidos no modelo) |

Lembrete de licença: as malhas derivadas (`anatomy-leg.js`) seguem a CC BY-SA 2.1 Japão e a atribuição visível, como as demais.
