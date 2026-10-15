/**
 * Campos que completam as fichas das câmaras e das valvas do coração (F5.2): irrigação, inervação e esqueleto fibroso. Texto próprio, a
 * partir de Moore, Dalley & Agur (8ª ed.) e Gray's Anatomy (42ª ed.). A dominância e os ramos variam entre as pessoas: o texto dá o padrão
 * descrito (circulação “dominante direita”, a mais comum).
 */

const INERVACAO = 'O plexo cardíaco (superficial, sob o arco da aorta, e profundo, entre o arco e a traqueia) recebe fibras simpáticas dos troncos simpáticos cervical e torácico superior (T1 a T4 ou T5), que aceleram a frequência, aumentam a força de contração e dilatam as coronárias, e fibras parassimpáticas do nervo vago, que diminuem a frequência. As fibras aferentes da dor vão com o simpático (a dor da isquemia é referida ao tórax e ao membro superior esquerdo, nos dermátomos T1 a T4); as dos reflexos, com o vago.';

const ESQUELETO = 'Os quatro anéis fibrosos (aórtico, pulmonar, mitral e tricúspide) e os trígonos fibrosos direito e esquerdo formam o esqueleto fibroso do coração: dá inserção às cúspides e às fibras musculares dos átrios e dos ventrículos, mantém os óstios abertos, e separa os átrios dos ventrículos eletricamente, de modo que só o fascículo atrioventricular atravessa o esqueleto. O trígono fibroso direito (o corpo fibroso central) fica entre os anéis aórtico, mitral e tricúspide e a parte membranácea do septo interventricular.';

/** Id → campos acrescentados no fim da ficha. */
export const CARDIO_EXTRAS = {
  atrio_direito: [
    ['Irrigação', 'Ramos atriais da artéria coronária direita, inclusive a artéria do nó sinoatrial (em cerca de 60% das pessoas; nas demais, vem da circunflexa), e a artéria do nó atrioventricular. As veias cardíacas desembocam no seio coronário e, em parte, direto no átrio (veias cardíacas anteriores e mínimas).'],
    ['Inervação', INERVACAO],
  ],
  atrio_esquerdo: [
    ['Irrigação', 'Ramos atriais do ramo circunflexo da artéria coronária esquerda; a veia oblíqua do átrio esquerdo drena a parede posterior para o seio coronário.'],
    ['Inervação', INERVACAO],
  ],
  ventriculo_direito: [
    ['Irrigação', 'Ramos ventriculares anteriores e o ramo marginal direito da coronária direita, e ramos do ramo interventricular anterior (da coronária esquerda) para a parte anterior; o ramo interventricular posterior (da coronária direita, em circulação dominante direita) irriga a parede inferior e o terço posterior do septo.'],
    ['Inervação', INERVACAO],
  ],
  ventriculo_esquerdo: [
    ['Irrigação', 'Ramo interventricular anterior (parede anterior, ápice e dois terços anteriores do septo), ramo circunflexo (parede lateral e parte da posterior) e ramo interventricular posterior, da coronária direita na circulação dominante direita (parede inferior e terço posterior do septo). Em cerca de 15% das pessoas a dominância é esquerda: o interventricular posterior nasce da circunflexa.'],
    ['Inervação', INERVACAO],
  ],
  valva_aortica: [['Anel fibroso e esqueleto do coração', ESQUELETO]],
  valva_mitral: [['Anel fibroso e esqueleto do coração', ESQUELETO]],
  valva_tricuspide: [['Anel fibroso e esqueleto do coração', ESQUELETO]],
  valva_pulmonar: [['Anel fibroso e esqueleto do coração', ESQUELETO + ' O anel pulmonar se liga ao da aorta pelo tendão do cone (do infundíbulo).']],
};
