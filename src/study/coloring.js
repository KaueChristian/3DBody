/**
 * Modos de coloração temática do modelo 3D (F1.7).
 * Alterna as cores das estruturas por: Camada, Nervo inervador, Região ou Grupo funcional.
 */
import * as THREE from 'three';

// Paleta por região
const REGION_COLORS = {
  cabeca: new THREE.Color('#4d88e6'),
  tronco: new THREE.Color('#42b883'),
  membro_sup: new THREE.Color('#e68a3e'),
  todos: new THREE.Color('#9c7be6'),
};

// Paleta por grupos musculares funcionais
const GROUP_COLORS = {
  mimica: new THREE.Color('#e05a47'),
  mastigacao: new THREE.Color('#a43a6d'),
  pescoco: new THREE.Color('#b3624c'),
  torax: new THREE.Color('#d45643'),
  dorso: new THREE.Color('#7a3d8f'),
  ombro: new THREE.Color('#e5833c'),
  braco_ant: new THREE.Color('#389cd4'),
  braco_post: new THREE.Color('#2e7bb0'),
  antibraco_flex: new THREE.Color('#3ea877'),
  antibraco_ext: new THREE.Color('#84b83b'),
  mao: new THREE.Color('#e6a83e'),
  abdome: new THREE.Color('#b54f67'),
  profundo: new THREE.Color('#8c3b52'),
};

function hashColor(str, s = 0.65, l = 0.55) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash % 360) / 360;
  return new THREE.Color().setHSL(h, s, l);
}

function getGroupKey(item) {
  const id = item.id;
  if (['frontal', 'orbicular_olho', 'nasal', 'orbicular_boca', 'zigomatico_maior', 'bucinador', 'platisma', 'risorio'].some((k) => id.includes(k))) return 'mimica';
  if (['masseter', 'temporal', 'pterigoideo'].some((k) => id.includes(k))) return 'mastigacao';
  if (id.includes('peitoral') || id.includes('subclavio') || id.includes('intercostal')) return 'torax';
  if (id.includes('trapezio') || id.includes('dorsal') || id.includes('romboid') || id.includes('esplenio') || id.includes('eretor')) return 'dorso';
  if (id.includes('deltoide') || id.includes('supraespinhal') || id.includes('infraespinhal') || id.includes('redondo') || id.includes('subescapular')) return 'ombro';
  if (id.includes('biceps_braquial') || id.includes('braquial') || id.includes('coracobraquial')) return 'braco_ant';
  if (id.includes('triceps')) return 'braco_post';
  if (id.includes('flexor') || id.includes('pronador') || id.includes('palmar')) return 'antibraco_flex';
  if (id.includes('extensor') || id.includes('supinador') || id.includes('braquiorradial')) return 'antibraco_ext';
  if (id.includes('obliquo') || id.includes('transverso_abd') || id.includes('reto_abd') || id.includes('piramidal')) return 'abdome';
  if (id.includes('interosseo') || id.includes('lumbrical') || id.includes('tenar') || id.includes('hipotenar')) return 'mao';
  return 'profundo';
}

export class ColoringManager {
  /**
   * @param {Map<string, object>} structuresMap - Mapa M de estruturas
   * @param {Map<string, Array<{nervo: string}>>} innervationMap - Mapa INNERVATION
   */
  constructor(structuresMap, innervationMap) {
    this.M = structuresMap;
    this.INNERVATION = innervationMap;
    this.mode = 'camada'; // 'camada' | 'nervo' | 'regiao' | 'grupo'
    this.nerveColors = new Map();
  }

  setMode(mode) {
    this.mode = mode;
    this.apply();
  }

  getNerveColor(nerveId) {
    if (!this.nerveColors.has(nerveId)) {
      this.nerveColors.set(nerveId, hashColor(nerveId));
    }
    return this.nerveColors.get(nerveId);
  }

  apply() {
    for (const [id, m] of this.M.entries()) {
      const item = m.item;
      let targetColor = m.color; // cor padrão original

      if (this.mode === 'camada') {
        targetColor = m.color;
      } else if (this.mode === 'nervo') {
        if (item.kind === 'musculo') {
          const nerves = this.INNERVATION.get(id);
          if (nerves && nerves.length > 0) {
            targetColor = this.getNerveColor(nerves[0].nervo);
          }
        } else if (item.kind === 'nervo') {
          targetColor = new THREE.Color('#f5d442');
        } else if (item.kind === 'osso') {
          targetColor = new THREE.Color('#c9c0aa');
        }
      } else if (this.mode === 'regiao') {
        const reg = Array.isArray(item.region) ? item.region[0] : item.region;
        if (REGION_COLORS[reg]) {
          targetColor = REGION_COLORS[reg];
        }
      } else if (this.mode === 'grupo') {
        if (item.kind === 'musculo') {
          const groupKey = getGroupKey(item);
          targetColor = GROUP_COLORS[groupKey] || m.color;
        }
      }

      // Atualiza os materiais das malhas
      for (const mesh of m.meshes) {
        if (mesh.material && mesh.material.color) {
          mesh.material.color.copy(targetColor);
        }
      }
    }
  }
}
