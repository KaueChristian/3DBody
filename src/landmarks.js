/**
 * Pontos de referência ósseos (lado esquerdo do indivíduo, x > 0), medidos no modelo BodyParts3D
 * já convertido para as unidades do site (1 unidade = 10 cm; origem no centro da cabeça).
 * Usados para ancorar músculos profundos e ligamentos nas inserções ósseas.
 */
export const LM = {
  // mandíbula
  'mand.condilo': [0.434, -0.289, 0.096],
  'mand.coronoide': [0.436, -0.405, 0.495],
  'mand.gonio': [0.39, -0.846, 0.172],
  'mand.lingula': [0.37, -0.5, 0.2],
  'mand.colo': [0.425, -0.34, 0.12],
  'mand.ramo_med': [0.36, -0.62, 0.17],
  'mand.ramo_lat': [0.5, -0.6, 0.17],
  'mand.retromolar': [0.38, -0.62, 0.43],
  // esfenoide
  'esf.espinha': [0.337, -0.326, 0.085],
  'esf.fossa_pterigoidea': [0.2, -0.4, 0.27],
  'esf.lamina_lat': [0.3, -0.38, 0.28],
  'esf.hamulo': [0.127, -0.562, 0.364],
  'esf.crista_infratemporal': [0.4, -0.17, 0.33],
  'esf.asa_menor': [0.1, 0.0, 0.5],
  // temporal
  'temp.estiloide': [0.393, -0.596, 0.031],
  'temp.mastoide': [0.439, -0.489, -0.219],
  'temp.tuberculo_articular': [0.49, -0.27, 0.19],
  'temp.fossa_mandibular': [0.45, -0.25, 0.1],
  // arco zigomático
  'arco.post': [0.56, -0.28, 0.08],
  'arco.med': [0.634, -0.31, 0.34],
  'arco.ant': [0.52, -0.34, 0.6],
  // zigomático / maxila / lacrimal
  'zig.tuberculo_orbital': [0.5, -0.05, 0.68],
  'zig.corpo': [0.5, -0.3, 0.62],
  'max.tuberosidade': [0.182, -0.451, 0.415],
  'max.fossa_canina': [0.13, -0.44, 0.876],
  'max.infraorbital': [0.26, -0.36, 0.86],
  'max.crista_lacrimal_ant': [0.12, -0.2, 0.79],
  'max.espinha_nasal': [0.0, -0.555, 0.944],
  'max.alveolar_molares': [0.34, -0.55, 0.52],
  'mand.alveolar_molares': [0.36, -0.76, 0.52],
  // hioide / pescoço
  'hio.corno_maior': [0.183, -0.966, 0.109],
  'hio.corno_menor': [0.07, -0.99, 0.36],
  'hio.corpo': [0.0, -1.03, 0.43],
  'atlas.transversa': [0.402, -0.655, -0.158],
  'axis.dente': [0.0, -0.565, -0.102],
  'occ.condilo': [0.069, -0.468, -0.017],
};
