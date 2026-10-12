# Fonte externa avaliada: Atlas de Referência Humano (HRA / HuBMAP)

Pesquisa de 2026-10-12, feita a pedido do responsável para decidir o spike **F6.0** do roteiro (o que fazer onde o BodyParts3D
não tem malha: aparelho genital feminino, pulmões…). **Nada foi baixado**: só consultas de metadados e cabeçalhos HTTP (tamanho).

## 1. Veredito

**Existe fonte aberta compatível para a maior parte do aparelho genital feminino e também para os pulmões.** O aparelho genital
feminino **não é descartado**: o núcleo da F6.5 passa a usar malhas reais para útero, tubas, ovários, mama e placenta; só a **vagina,
a vulva e os ligamentos do útero** (largo, redondo, útero-ovárico, útero-sacral) ficam por código, declarados como esquemáticos
na ficha (`agents.md` §7.4). Isso é simples (tubos e faixas) e dentro do que o projeto já faz com ligamentos e nervos.

## 2. A fonte

**Human Reference Atlas (HRA) — 3D Reference Object Library**, do consórcio HuBMAP (NIH). Modelos construídos sobre o **Visible Human**
da Biblioteca Nacional de Medicina dos EUA (um corpo feminino, `VH_F`, e um masculino, `VH_M`).

- Página: <https://humanatlas.io/3d-reference-library> · API com a lista e as URLs: <https://apps.humanatlas.io/api/v1/reference-organs> (81 objetos).
- **Licença: CC BY 4.0** (declarada na própria biblioteca — “All CCF 3D reference objects are released under Attribution 4.0
  International” — e no metadado de cada órgão, p. ex. `https://creativecommons.org/licenses/by/4.0/` em
  <https://lod.humanatlas.io/ref-organ/uterus-female/v1.2/>). A exceção da biblioteca é o cérebro do Allen Institute, que não usamos.
- Formato: **GLB** (glTF binário), unidade **milímetro**, uma peça por órgão (alguns trazem subestruturas nomeadas).
- Crédito a manter (rodapé e README, junto ao do BodyParts3D): *Human Reference Atlas 3D Reference Object Library, HuBMAP / NIH,
  modelos derivados do Visible Human (NLM), CC BY 4.0.*

**Compatibilidade de licença.** CC BY 4.0 só exige atribuição, e o conjunto do atlas continua em CC BY-SA 2.1 JP (a licença do
BodyParts3D): material CC BY pode ser incorporado a uma obra CC BY-SA, mantendo o crédito e a licença do trecho. Isto é a leitura
do projeto, **não parecer jurídico**; se o `.exe` for distribuído de forma comercial, vale confirmar.

## 3. O que há para o aparelho genital feminino (e o que mais serve)

Tamanhos são os do arquivo original (cabeçalho `Content-Length`); depois da conversão e da decimação o pacote fica bem menor.

| Estrutura | Arquivo | Original | Para que serve |
| --- | --- | ---: | --- |
| Útero | `uterus-female/v1.2/…/3d-vh-f-uterus.glb` | 0,98 MB | F6.5. **20 subestruturas** nomeadas: fundo, corpo, colo, paredes anterior e posterior, segmento uterino inferior, óstios interno e externo do colo, óstio abdominal da tuba |
| Tubas uterinas E/D | `fallopian-tube-female-left/right/v1.2` | 0,33 MB cada | F6.5 |
| Ovários E/D | `ovary-female-left/right/v1.3` | 9 KB cada | F6.5 (malha muito simples, basta como volume) |
| Mama (glândula mamária) E/D | `mammary-gland-female-left/right/v1.1` | 13,7 e 24,4 MB | F6.5; **precisa de decimação forte** (alvo ≤ 0,3 MB cada) |
| Placenta (termo) | `placenta-full-term-female/v1.1` | 4,9 MB | F5/M21 (anexos fetais); sem cordão |
| Pelve feminina | `pelvis-female/v1.3` | 1,6 MB | opcional na F6.5: mostrar a pelve feminina ao lado da masculina |
| Bexiga feminina | `urinary-bladder-female/v1.2` | 0,77 MB | opcional (a masculina já vem do BodyParts3D) |
| **Pulmões** (masc.) | `lung-male/v1.4` | 10,9 MB | **F6.1** (o BodyParts3D não tem pulmões); decimar |
| Traqueia, brônquio principal, laringe (masc.) | `trachea/main-bronchus/larynx-male` | 1,2 / 0,4 / 0,3 MB | F6.1 (conferir contra as malhas do BodyParts3D, que já tem) |
| Timo, baço, fígado, pâncreas, rins, bexiga, próstata, intestinos | `*-male` | 0,07 a 4 MB | alternativa se uma malha do BodyParts3D vier ruim |
| Vasculatura sanguínea (masc./fem.) | `blood-vasculature-*/v1.3` | 18 MB | alternativa à árvore vascular do BodyParts3D na F5 (não prevista) |

**Não existe na biblioteca:** vagina, vulva, colo do útero como peça separada (vem dentro do útero), ligamentos do útero, **tireoide e
paratireoides**, estômago, pleuras, mediastino, pericárdio, ossículos e cóclea. Esses itens seguem como no roteiro (esquema por código,
só ficha, ou outra fonte).

## 4. O que ainda precisa ser resolvido (riscos)

1. **Registro no corpo.** Os órgãos do HRA estão no espaço do Visible Human, não no do BodyParts3D (que é masculino, 20–30 anos). É
   preciso escalar e posicionar cada órgão por pontos de referência da pelve (promontório, sínfise púbica, bexiga e reto, que já estão
   no corpo). O útero ficará **numa pelve masculina** — anatomicamente aproximado. Mitigação: botão “pelve feminina” (HRA, 1,6 MB) e
   ficha dizendo que a posição é de referência. Custo estimado: 1 a 2 dias, dentro da F6.5.
2. **Nomes das subestruturas** vêm em inglês (FMA); traduzir para a Terminologia Anatômica em PT-BR (`agents.md` §7.6).
3. **Tamanho** (estimativa, a medir na conversão). Soma original de útero, tubas, ovários e pelve ≈ 3,3 MB; depois de decimar e com a
   mama decimada, o pacote feminino deve ficar perto de 1 MB, e os pulmões entre 0,5 e 0,8 MB. Cabe no orçamento do pacote por
   sistema carregado sob demanda (§9, item 2).
4. **Qualidade dos ovários** (9 KB): são formas simples. Aceitável como volume; a ficha não deve sugerir folículos nem corpo lúteo.

## 5. Outras fontes avaliadas

| Fonte | Licença | Resultado |
| --- | --- | --- |
| **Z-Anatomy** (<https://github.com/Z-Anatomy/Models-of-human-anatomy>) | CC BY-SA 4.0 (derivada do BodyParts3D) | O repositório se descreve como “modelo masculino” e o readme não cita útero, ovários nem vagina; o arquivo é um modelo do Blender (tamanho não conferido) e o estado de manutenção do projeto é incerto. Traz peças com licença **não comercial** (ouvido interno CC BY-NC-SA, rim CC BY-NC) que **não podemos usar**. Descartada como fonte principal; só voltaria para um item específico, depois de abrir o arquivo e conferir a licença da peça. |
| **Catherine Vallance — órgãos reprodutivos femininos** (Sketchfab, via AnatomyTOOL, nid 60513) | CC BY 4.0 | Tem tuba, útero, ovário, colo e **vagina**; mas o AnatomyTOOL não oferece arquivo e o Sketchfab exige conta para baixar. Reserva para a vagina, se o esquema por código ficar fraco; teria de ser baixada pelo responsável. |
| NIH 3D (pelve feminina, impressão 3D) | variável por entrada | Não conferida a licença de cada modelo; sem necessidade agora. |
| Lojas (CGTrader, TurboSquid, RenderHub) | proprietária | Descartadas (licença incompatível). |
| BodyParts3D feminino | — | Não encontrado: o banco é masculino e o índice local não tem estas estruturas. |

## 6. Próximos passos propostos (dependem de confirmação do responsável)

1. Aprovar o download dos arquivos da seção 3 que a F6.5 e a F6.1 usam (lista e tamanhos acima) — a F6.5 só ocorre em 17/11, então a
   urgência é baixa; os pulmões (F6.1, 22/10) vêm antes.
2. Escrever `tools/fetch_hra.py` e `tools/convert_hra.py` (GLB → malhas do pacote, com decimação e escala de mm para 1 unidade = 10 cm),
   no mesmo molde dos de BodyParts3D, e registrar a fonte no rodapé e no README.
3. Registrar o posicionamento por pontos de referência (seção 4, item 1) como parte da F6.5.
