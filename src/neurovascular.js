/**
 * Feixes neurovasculares (F5 / M17): conjuntos de artéria, veia e nervo que correm juntos e que o atlas deixa isolar de uma vez.
 * Só entram estruturas que existem no catálogo; a veia ou o nervo que o modelo não tem fica dito no texto. Fontes: Moore, Dalley &
 * Agur (8ª ed.) e Gray’s Anatomy (42ª ed.).
 */

/** @type {Array<{id: string, nome: string, membros: string[], texto: string}>} */
export const FEIXES = [
  {
    id: 'bainha_carotica', nome: 'Bainha carótica',
    membros: ['arteria_carotida_comum', 'veia_jugular_interna', 'n_vago'],
    texto: 'A bainha de fáscia do pescoço envolve a artéria carótida comum (e a interna), a veia jugular interna (lateral) e o nervo vago (posterior, entre as duas). A alça cervical corre na face anterior da bainha.',
  },
  {
    id: 'feixe_axilar', nome: 'Feixe da axila',
    membros: ['arteria_axilar', 'veia_axilar', 'n_plexo_braquial'],
    texto: 'Na axila, a artéria e a veia axilares (esta, medial à artéria) ficam rodeadas pelos cordões do plexo braquial, dentro da bainha axilar, que se continua com a fáscia pré-vertebral.',
  },
  {
    id: 'feixe_braco', nome: 'Feixe do braço (sulco bicipital medial)',
    membros: ['arteria_braquial', 'veia_braquial', 'n_mediano', 'n_ulnar', 'veia_basilica'],
    texto: 'No sulco bicipital medial seguem a artéria braquial, as duas veias braquiais e o nervo mediano, que cruza a artéria de lateral para medial perto da fossa cubital; o nervo ulnar acompanha a artéria só no terço proximal e depois a deixa. A veia basílica perfura a fáscia profunda na metade do braço.',
  },
  {
    id: 'feixe_radial_umero', nome: 'Feixe do sulco do nervo radial',
    membros: ['arteria_profunda_braco', 'n_radial'],
    texto: 'A artéria profunda do braço e o nervo radial contornam o úmero, por trás, no sulco do nervo radial, entre as cabeças do tríceps. A fratura da diáfise do úmero nesse nível põe os dois em risco.',
  },
  {
    id: 'feixe_espaco_quadrangular', nome: 'Feixe do espaço quadrangular',
    membros: ['arteria_circunflexa_posterior_umero', 'n_axilar'],
    texto: 'O nervo axilar e a artéria circunflexa posterior do úmero atravessam juntos o espaço quadrangular e contornam o colo cirúrgico do úmero; a fratura do colo ou a luxação do ombro podem lesar os dois.',
  },
  {
    id: 'feixe_supraescapular', nome: 'Feixe supraescapular',
    membros: ['arteria_supraescapular', 'n_supraescapular'],
    texto: 'Na incisura da escápula, a artéria passa por cima do ligamento transverso superior e o nervo, por baixo dele; na fossa infraespinal voltam a seguir juntos.',
  },
  {
    id: 'feixe_dorsal_escapula', nome: 'Feixe dorsal da escápula',
    membros: ['arteria_escapular_dorsal', 'n_dorsal_escapula'],
    texto: 'A artéria e o nervo dorsal da escápula descem juntos junto à margem medial da escápula, profundos aos rombóides, que ambos irrigam e inervam.',
  },
  {
    id: 'feixe_toracodorsal', nome: 'Feixe toracodorsal',
    membros: ['arteria_toracodorsal', 'n_toracodorsal'],
    texto: 'A artéria e o nervo toracodorsais descem pela parede posterior da axila até o latíssimo do dorso, no pedículo usado no retalho miocutâneo desse músculo.',
  },
  {
    id: 'feixe_toracico_longo', nome: 'Feixe do serrátil anterior',
    membros: ['arteria_toracica_lateral', 'n_toracico_longo'],
    texto: 'A artéria torácica lateral e o nervo torácico longo descem sobre a face do serrátil anterior, na parede medial da axila; o nervo, mais posterior, é lesado nas cirurgias da axila (escápula alada).',
  },
  {
    id: 'feixe_radial_antebraco', nome: 'Feixe radial do antebraço',
    membros: ['arteria_radial', 'n_radial_superficial'],
    texto: 'A artéria radial e o ramo superficial do nervo radial descem lado a lado sob o braquiorradial no terço médio do antebraço; no terço distal o nervo se afasta para o dorso. O pulso radial se palpa no punho, lateral ao flexor radial do carpo.',
  },
  {
    id: 'feixe_ulnar_antebraco', nome: 'Feixe ulnar do antebraço',
    membros: ['arteria_ulnar', 'n_ulnar'],
    texto: 'No terço distal do antebraço a artéria ulnar e o nervo ulnar descem juntos sob o flexor ulnar do carpo e passam pelo canal ulnar (de Guyon), à frente do retináculo dos flexores.',
  },
  {
    id: 'feixe_femoral', nome: 'Feixe do trígono femoral',
    membros: ['arteria_femoral', 'veia_femoral', 'n_femoral'],
    texto: 'No trígono femoral, de lateral para medial, vêm o nervo femoral, a artéria e a veia femorais. O nervo fica fora da bainha femoral; a artéria e a veia estão dentro dela, e o canal femoral é o compartimento medial.',
  },
  {
    id: 'feixe_popliteo', nome: 'Feixe da fossa poplítea',
    membros: ['arteria_poplitea', 'veia_poplitea', 'n_isquiatico'],
    texto: 'Na fossa poplítea, de superficial para profundo, vêm o nervo tibial, a veia e a artéria poplíteas; o nervo isquiático se divide em tibial e fibular comum perto do ápice da fossa (o tibial e o fibular comum não existem separados no modelo).',
  },
  {
    id: 'feixe_intercostal', nome: 'Feixe intercostal',
    membros: ['arteria_intercostais_posteriores', 'n_intercostais'],
    texto: 'Em cada espaço, a veia, a artéria e o nervo intercostais correm no sulco da costela, de cima para baixo, nessa ordem (VAN), protegidos pela margem inferior da costela; a punção do tórax se faz acima da costela de baixo para poupá-los.',
  },
];

/** Feixes de que a estrutura faz parte. @type {Map<string, Array<(typeof FEIXES)[number]>>} */
export const FEIXES_DE = new Map();
for (const f of FEIXES) {
  for (const m of f.membros) {
    if (!FEIXES_DE.has(m)) FEIXES_DE.set(m, []);
    FEIXES_DE.get(m).push(f);
  }
}

export const feixePorId = (id) => FEIXES.find((f) => f.id === id);
