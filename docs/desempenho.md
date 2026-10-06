# Linha de Base de Desempenho e Orçamento de Pacotes

> Documento de referência de métricas de desempenho e regras de engenharia para controle de tamanho e tempo de carga.
> Cumpre o item **F0.9** do roteiro (`project_context.md`).

---

## 1. Linha de Base Atual (v2.0.x)

### 1.1 Tamanho dos Arquivos e Pacotes de Dados

| Arquivo | Papel | Tamanho não compactado | Carregamento |
| --- | --- | --- | --- |
| `dist/version.js` | Identificador de versão e build | 30 B | Síncrono inicial |
| `dist/app.js` | Bundle da aplicação (Three.js 0.170 + three-mesh-bvh + catálogo + interface) | ~1.0 MB | Síncrono inicial |
| `dist/anatomy-data.js` | Malhas 3D compactadas da cabeça e pescoço (BodyParts3D) | ~3.37 MB | Síncrono inicial |
| `dist/anatomy-nerves.js` | Malhas 3D compactadas dos nervos da órbita | ~0.26 MB | Em segundo plano com os nervos |
| `dist/anatomy-body.js` | Malhas 3D compactadas do tronco e membros superiores | ~7.01 MB | Assíncrono (segundo plano) |
| **Total inicial (Cabeça visível)** | Dados para primeira renderização | **~4.37 MB** | **Imediato (< 1s)** |
| **Total completo (Corpo + Nervos)** | Modelo 3D integral com todas as estruturas | **~11.64 MB** | **Gradual (~1.5s)** |
| `release/app.zip` | Pacote compactado de atualização do lançador | ~8.5 MB | Sob demanda em releases |
| `release/Anatomia3D.exe` | Executável único do Windows (.NET Framework + app.zip embutido) | **~8.5 MB** | Offline local |

---

### 1.2 Tempos de Carregamento e Inicialização (Hardware de Referência)

Medições capturadas via API `window.__app.perf`:

| Marco de Carregamento | Métrica | Valor Medido | Meta do Roteiro (§3.5) |
| --- | --- | --- | --- |
| **Carga de dados da cabeça** | `perf.dataMs` | 30–60 ms | < 500 ms |
| **Montagem das estruturas da cabeça** | `perf.headStructuresMs` | 80–130 ms | < 300 ms |
| **Tempo até a 1ª Imagem (TTFI)** | `perf.ttfiMs` | **250–450 ms** | **< 3 000 ms (< 3 s)** |
| **Carga dos dados do corpo** | `perf.bodyDataMs` | 80–180 ms | < 500 ms |
| **Montagem das estruturas do corpo** | `perf.bodyStructuresMs` | 150–280 ms | < 500 ms |
| **Construção e ancoragem dos 55 nervos** | `perf.nervesMs` | 450–650 ms | < 1 000 ms |
| **Pronto integral (todas as regiões)** | `perf.totalReadyMs` | **1 200–1 600 ms** | **< 3 000 ms** |

### 1.3 Taxa de Quadros (FPS) e Memória

- **Taxa de quadros:** 60 FPS estáveis com amortecimento (damping: 0.09) em GPU dedicada e integrada contemporânea (Intel Iris Xe / AMD Radeon Vega). Meta mínima: ≥ 30 FPS em notebooks modestos e dispositivos móveis.
- **Memória de vídeo (VRAM / Heap):** ~120–180 MB para o conjunto completo de geometrias e buffers de BVH.
- **Otimização de nervos:** Laço de construção cede o controle ao event loop a cada 4 itens (`await new Promise(r => setTimeout(r, 0))`), garantindo zero travamentos na interface visual.

---

## 2. Regras de Orçamento para Novas Fases e Pacotes

Para preservar o princípio de funcionamento offline rápido e abertura em segundos (especialmente em conexões lentas ou computadores escolares):

### Regra 1: Orçamento do Executável Windows
- O binário final `release/Anatomia3D.exe` **não pode ultrapassar 30 MB** (hoje em 8.5 MB).

### Regra 2: Limite Máximo por Pacote Regional Novo
- Cada nova região deve ser empacotada em seu respectivo arquivo JS isolado:
  - Fase F4 (Membro inferior): `dist/anatomy-leg.js` — **teto de 8,0 MB**.
  - Fase F5 (Vasos): `dist/anatomy-vessels.js` — **teto de 5,0 MB**.
  - Fase F6 (Vísceras): `dist/anatomy-viscera.js` — **teto de 6,0 MB**.
- Se a extração bruta do BodyParts3D exceder esse orçamento, deve-se aumentar o fator de decimação na ferramenta Python (`convert_body.py` / `decimate`).

### Regra 3: Arquitetura de Carga em Camadas / Sob Demanda
- Nenhuma adição de dados pode atrasar o **TTFI** (Tempo até a 1ª Imagem).
- A cabeça e o crânio sempre carregam primeiro (`dist/anatomy-data.js`).
- Pacotes novos devem ser carregados sob demanda quando o usuário seleciona a região ou em segundo plano durante a ociosidade do navegador.

### Regra 4: Pré-filtragem de BVH e Consultas Espaciais
- Toda operação de colisão com superfícies (como projeção de nervos procedurais ou acidentes ósseos) deve realizar teste rápido de caixa envolvente (AABB) antes de invocar a travessia detalhada da árvore BVH (`three-mesh-bvh`).

---

## 3. Como Medir Localmente

No console do navegador (DevTools) ou durante testes:

```javascript
console.table(window.__app.perf);
```

Campos expostos:
- `dataMs`: Leitura e descompressão do buffer binário da cabeça.
- `headStructuresMs`: Criação de meshes e materiais da cabeça.
- `ttfiMs`: Tempo real decorrido até o primeiro quadro desenhado no canvas.
- `bodyStructuresMs`: Montagem do tronco e membros superiores.
- `nervesMs`: Execução do `NerveBuilder` para resolução dos 55 trajetos e ancoragens musculares.
- `totalReadyMs`: Tempo total desde o início até a prontidão completa de todos os sistemas.
