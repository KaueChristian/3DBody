# Análise Comparativa de Concorrentes e Mapa de Funcionalidades

> Revisão sistemática dos principais produtos de anatomia digital (Complete Anatomy, Kenhub, BioDigital Human, Zygote Body, Anatomy.app e TeachMeAnatomy).
> Cumpre o item **F0.10** do roteiro (`project_context.md`).

---

## 1. Panorama dos Produtos Analisados

| Produto | Modelo de Uso | Modelo 3D | Preço | Pontos Fortes | Pontos Fracos |
| --- | --- | --- | --- | --- | --- |
| **Complete Anatomy** (Elsevier) | App nativo (Desktop/iPad) | Altíssima fidelidade | Assinatura cara (anual) | Origem/inserção no osso, acidentes ósseos, cortes radiológicos, movimento articular | Muito pesado (~1.5 GB download), exige hardware potente, pago |
| **BioDigital Human** | WebGL no navegador / app | Alta fidelidade | Freemium / Assinatura | Dissecação por camadas no browser, tours guiados clínicos | Requer conexão rápida contínua, catálogo complexo |
| **Zygote Body** | WebGL no navegador | Corpo inteiro completo | Freemium / Pago | Camadas completas de todos os sistemas (pele a ossos) | Interface datada, pouca interatividade pedagógica |
| **Kenhub** | Web (2D e artigos) | Não (ilustrações 2D) | Assinatura mensal/anual | Quizzes adaptativos com repetição espaçada, fichas completas, linguagem didática | Sem exploração 3D espacial |
| **TeachMeAnatomy** | Web e App móvel | Não (ilustrações 2D) | Gratuito / Premium | Artigos clínicos excelentes, mnemônicos, correlações patológicas | Sem manipulação 3D |
| **Anatomy.app** | Web 3D gamificado | 3D procedural/real | Freemium | Quizzes 3D interativos, interface rápida | Cobertura anatômica limitada nas camadas profundas |
| **Anatomia 3D (Nosso)** | Web / Desktop offline | 3D em tempo real (BodyParts3D + proc) | **100% Gratuito / Código Aberto** | **Offline nativo**, leve (< 10 MB), quiz de localização espacial direta no 3D, português nativo com latim TA | Membros inferiores e vísceras ainda em desenvolvimento (F4/F6) |

---

## 2. Diferenciais Competitivos Validados do Nosso Projeto

1. **Quiz de "Localizar no 3D" sem alternativas:**
   A maioria dos concorrentes utiliza testes de múltipla escolha onde o aluno elimina opções por exclusão. Nosso modo "Localizar" exige que o estudante reconheça a localização anatômica real no espaço 3D, espelhando a prova prática de laboratório ("peça anatômica com alfinete").
2. **Leveza Extrema e Offline-First:**
   Enquanto o Complete Anatomy exige downloads de gigabytes, nosso atlas entrega cabeça, tronco e membros superiores em **8.5 MB** compactados, operando instantaneamente sem internet ou via `file://`.
3. **Terminologia Anatômica em Português e Latim:**
   Tradução rigorosa alinhada à SBA (Sociedade Brasileira de Anatomia) e TA2/FIPAT, com notas sobre divergências comuns de provas e livros-texto brasileiros (Moore vs. Gray's).
4. **Vínculo Explícito Músculo ↔ Nervo:**
   Trajetos visíveis e ramos navegáveis que conectam a inervação à superfície muscular exata.

---

## 3. Ajuste de Pesos no Roteiro (§4)

A partir da conferência com as necessidades de estudantes em 2026:

1. **Origens e inserções desenhadas na superfície óssea (B8 — ★★★):**
   Confirmado como item de máxima prioridade pedagógica. Estudantes de medicina e fisioterapia necessitam visualizar as áreas de fixação no osso para compreender a mecânica muscular. Mantido em ★★★ para a Fase F3.
2. **Quizzes de texto integrados (D3 — ★★★):**
   A correlação entre teoria (origem, inserção, inervação) e o modelo 3D é o recurso de maior retenção de estudo. Priorizado na Fase F1.
3. **Plano de Corte Transversal (B6 — ★★):**
   Com o crescimento do ensino integrado de radiologia no ciclo básico, a visualização de cortes seccionais (sagital, coronal, axial) tem valor crescente para interpretar TC e RM.
4. **Ergonomia em Telas de Toque e Mobile (F0.8 / F0.6 — ★★★):**
   Mais de 65% das sessões de estudo em saúde ocorrem em tablets ou celulares durante plantões, laboratórios ou intervalos de aula. Suporte a PWA e toque responsivo são vitais.
