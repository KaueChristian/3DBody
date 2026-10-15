/**
 * Ficha completa dos vasos (F5 / M16): pulsos, pontos de compressão e relações detalhadas dos troncos que o exame físico e a
 * cirurgia usam. Texto próprio, a partir de Moore, Dalley & Agur (8ª ed.) e Gray’s Anatomy (42ª ed.). Só entram os vasos em que
 * há pulso palpável ou uma relação que se cobra; o restante segue só com a ficha básica.
 */

/** Artéria → onde se palpa o pulso e onde se comprime para estancar a hemorragia. */
export const PULSOS = {
  arteria_carotida_comum: 'Palpa-se na face lateral do pescoço, medial ao esternocleidomastóideo, na altura da cartilagem tireóidea. Comprime-se contra o tubérculo carótico (tubérculo anterior do processo transverso de C6). Palpe um lado de cada vez e sem massagear a bifurcação: a pressão sobre o seio carótico pode causar bradicardia e queda da pressão.',
  arteria_subclavia: 'O pulso se sente na fossa supraclavicular, atrás do terço médio da clavícula. A artéria se comprime contra a 1ª costela, no sulco da artéria subclávia, para estancar hemorragia do ombro e do membro superior.',
  arteria_axilar: 'Palpa-se no ápice e na parede lateral da axila, sobre o úmero. A compressão contra o úmero, na axila, controla a hemorragia do braço.',
  arteria_braquial: 'Palpa-se na fossa cubital, medial ao tendão do bíceps, e no braço, medial ao úmero. É a artéria da medida da pressão arterial (estetoscópio na fossa cubital). Comprime-se contra o úmero, na face medial do braço.',
  arteria_radial: 'É o pulso de rotina: palpa-se na face anterior do punho, lateral ao tendão do flexor radial do carpo, sobre o rádio. A conferência da frequência cardíaca costuma ser feita aqui.',
  arteria_ulnar: 'O pulso é mais difícil de sentir: fica na face anterior do punho, lateral ao tendão do flexor ulnar do carpo e proximal ao pisiforme. Na hemorragia da mão, comprimem-se a radial e a ulnar ao mesmo tempo, por causa das anastomoses entre os arcos palmares.',
  arteria_femoral: 'Palpa-se logo abaixo do ligamento inguinal, no ponto médio entre a espinha ilíaca anterossuperior e a sínfise púbica. Comprime-se contra o ramo superior do púbis. É o acesso mais usado nos cateterismos.',
  arteria_poplitea: 'O pulso é difícil de palpar: fica no fundo da fossa poplítea e se sente melhor com o joelho semifletido e a musculatura relaxada.',
  arteria_tibial_posterior: 'Palpa-se atrás do maléolo medial, a meio caminho entre o maléolo e o tendão do calcâneo.',
  arteria_dorsal_pe: 'Palpa-se no dorso do pé, lateral ao tendão do extensor longo do hálux; é o pulso periférico mais distal que se examina no membro inferior.',
  aorta_abdominal: 'A aorta abdominal termina em L4, ao nível das cristas ilíacas; em pessoas magras sua pulsação se sente na linha mediana, entre o apêndice xifoide e o umbigo.',
};

/** Vaso → relações com as estruturas vizinhas. */
export const RELACOES = {
  arteria_carotida_comum: 'Dentro da bainha carótica, medial à veia jugular interna e anterior ao nervo vago. Por trás ficam os processos transversos das vértebras cervicais e os músculos pré-vertebrais; à frente, o esternocleidomastóideo e o ventre superior do omo-hióideo. A tireoide, a laringe e a traqueia estão medialmente.',
  arteria_subclavia: 'O escaleno anterior a divide em três partes: a primeira é medial a ele, a segunda, posterior, e a terceira, lateral, até a margem lateral da 1ª costela. A veia subclávia passa à frente do escaleno anterior; a artéria e os troncos do plexo braquial passam atrás dele, no espaço interescalênico. A cúpula da pleura fica abaixo e atrás da primeira parte.',
  arteria_axilar: 'O peitoral menor a divide em três partes: a primeira é medial a ele, a segunda, posterior, e a terceira, lateral. A veia axilar é medial à artéria; os cordões lateral, medial e posterior do plexo braquial, que levam o nome da relação com a segunda parte, a rodeiam.',
  arteria_braquial: 'No braço é medial ao úmero e ao bíceps, com duas veias braquiais. O nervo mediano, lateral à artéria no alto do braço, a cruza à frente e passa para o lado medial perto da metade do braço. Na fossa cubital o tendão do bíceps é lateral a ela, o nervo mediano é medial, e a aponeurose do bíceps a cobre.',
  arteria_radial: 'No antebraço fica entre o braquiorradial (lateral) e o pronador redondo e o flexor radial do carpo (medial); no terço médio, o ramo superficial do nervo radial é lateral a ela. No punho passa entre o tendão do flexor radial do carpo e o rádio, contorna o carpo pelo assoalho da tabaqueira anatômica e atravessa o 1º espaço interósseo para chegar à palma.',
  arteria_ulnar: 'No antebraço fica profunda ao pronador redondo, ao flexor radial do carpo, ao palmar longo e ao flexor superficial dos dedos; no terço distal passa entre o flexor ulnar do carpo (medial) e o flexor superficial (lateral), com o nervo ulnar medial a ela. No punho atravessa o canal ulnar (de Guyon), superficial ao retináculo dos flexores.',
  arteria_femoral: 'No trígono femoral (limitado pelo ligamento inguinal, pela margem medial do sartório e pela margem medial do adutor longo) a artéria fica entre o nervo femoral (lateral) e a veia femoral (medial). No canal dos adutores a veia passa por trás da artéria e depois fica lateral a ela.',
  arteria_poplitea: 'É a estrutura mais profunda da fossa poplítea, abaixo e à frente da veia e do nervo tibial; encosta na face poplítea do fêmur, na cápsula do joelho e no músculo poplíteo, o que explica sua lesão nas luxações do joelho e nas fraturas supracondilares. O nervo fibular comum segue a margem do tendão do bíceps femoral.',
  arteria_tibial_posterior: 'Desce no compartimento posterior profundo, sob o sóleo, acompanhada pelo nervo tibial. Atrás do maléolo medial passa entre os tendões do flexor longo dos dedos e do flexor longo do hálux, sob o retináculo dos flexores, e se divide em plantares medial e lateral.',
  aorta_abdominal: 'Começa no hiato aórtico do diafragma (T12), à frente dos corpos vertebrais, com a veia cava inferior à direita. À frente dela, de cima para baixo, estão o tronco celíaco, a mesentérica superior, a veia renal esquerda, a parte horizontal do duodeno e a raiz do mesentério; termina em L4, ao se dividir nas ilíacas comuns.',
};
