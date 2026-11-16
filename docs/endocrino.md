# Sistema endócrino (F6.6)

Entregue na `dev` em 2026-11-16, para a aula de 19/11 e a N2 (26/11). 9 estruturas em `src/catalog-endo.js`, pacote
`dist/anatomy-endo.js` (≈ 72 KB) e camada **“Sistema endócrino”** (não opcional: aparece com as vísceras no nível de dissecação 5).

## 1. Origem de cada estrutura

| Estrutura | Origem | Observação |
| --- | --- | --- |
| Glândulas suprarrenais direita e esquerda | **BodyParts3D** (`right/left adrenal gland`, FJ3130 e FJ3129) | Sobre os polos superiores dos rins, já no lugar |
| Hipófise | **BodyParts3D** (`pituitary gland`, FJ1796) | Na sela turca |
| Glândula pineal | **BodyParts3D** (`pineal body`, FJ1795) | O atlas não tem o encéfalo: fica isolada dentro do crânio |
| Hipotálamo | **BodyParts3D** (`hypothalamus`, FJ1760 e FJ1808, as duas metades unidas) | Idem |
| Timo (lobos direito e esquerdo) | **BodyParts3D** (`lobe of thymus`, FJ3150 e FJ3151) | No mediastino superior e anterior, atrás do manúbrio do esterno e à frente do pericárdio e dos grandes vasos |
| Glândula tireoide (lobos e istmo) | **código** (`proc`) | Não existe no BodyParts3D nem no HRA. Lobos de cada lado da cartilagem cricóidea e da traqueia, da metade da cartilagem tireóidea ao ≈ 6º anel, atrás do esternotireóideo; istmo à frente do 2º ao 4º anel. Sem o lobo piramidal |
| Glândulas paratireoides (4) | **código** | Na face posterior dos lobos: as superiores na altura da margem inferior da cricóidea, as inferiores perto do polo inferior |
| Veias tireóideas (superior, média e inferior) e artéria tireóidea ima | **código** (`proc`) | Esquema venoso e arterial pré-traqueal ligando a tireoide à jugular interna, à veia braquiocefálica e ao tronco braquiocefálico |

Pâncreas, ovários e testículos já existem nos seus sistemas; entram no endócrino pelos vínculos (“relacionados”) da hipófise e no
tour.

Pontos de medida da tireoide (unidades do atlas, lado esquerdo, espelhado): traqueia com x ≤ 0,097 e face anterior em z ≈ 0,23
(y −1,5 a −1,8); cartilagem cricóidea de y −1,48 a −1,30; lâmina da cartilagem tireóidea até x ≈ 0,15 em y −1,35; carótida comum
esquerda em x 0,16–0,21 e z 0,20–0,25 (y −1,6); esternotireóideo em x 0,08–0,20 e z 0,17–0,25. O espaço entre a traqueia e a
carótida do modelo é estreito (≈ 6 mm), por isso o lobo encosta nos dois.

## 2. Regenerar

```bash
cd tools
python fetch_body.py --pack endo && python convert_body.py --pack endo   # → anatomy-endo.js (copie para ../dist/)
```

As peças estão em `tools/body_parts.py` (bloco “Sistema endócrino”, função `adde`).

## 3. Fichas

Campos “Localização e partes”, “Relações”, “Vascularização e inervação” e “Hormônios e clínica”, escritos a partir de Moore,
Dalley & Agur (8ª ed.), Gray's (42ª ed.) e Netter (7ª ed.). Pontos de prova cobertos: eixo hipotálamo-hipófise (neuro-hipófise por
axônios, adeno-hipófise pelo sistema porta); relações da hipófise (quiasma, seios cavernosos, seio esfenoidal) e hemianopsia
bitemporal; pineal como marco calcificado da linha mediana; relações da tireoide com a bainha carótica e os nervos laríngeos,
irrigação pelas tireóideas superior e inferior (e ima) e drenagem venosa; origem embriológica e posição das paratireoides;
hipocalcemia pós-tireoidectomia; zonas do córtex suprarrenal e seus hormônios; três artérias e uma veia de cada suprarrenal (a
direita para a cava, a esquerda para a renal esquerda); medula suprarrenal com fibras pré-ganglionares diretas.

## 4. Pendente

- Lobo piramidal da tireoide: descrito na ficha da tireoide.
- Encéfalo (F7): o hipotálamo e a pineal ficam soltos no crânio até lá.
