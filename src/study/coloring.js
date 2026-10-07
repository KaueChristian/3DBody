/**
 * Modos de coloração do modelo 3D (F1.7): por camada (padrão), nervo que inerva, região ou grupo funcional.
 *
 * O gerenciador não mexe nos materiais: monta um mapa `id → cor` que o `applyHighlight` do main.js usa no lugar da cor
 * base. Assim a cor sobrevive a hover, seleção e dissecação. Também gera os itens da legenda.
 */
import * as THREE from 'three';
import { GROUPS, MUSCLE_GROUP, GROUP_LABEL, groupColor } from './groups.js';

const REGION_ORDER = ['cabeca', 'tronco', 'membro_sup'];
const REGION_COLORS = { cabeca: '#4d88e6', tronco: '#42b883', membro_sup: '#e68a3e', varias: '#9c7be6' };

export const MODES = [
  ['camada', 'Por camada (padrão)'],
  ['nervo', 'Por nervo que inerva'],
  ['regiao', 'Por região do corpo'],
  ['grupo', 'Por grupo / compartimento'],
];

/** Matiz espaçada pelo ângulo áureo; luminosidade alternada para nervos vizinhos na lista não se confundirem. */
function nerveColor(index) {
  const hue = (index * 137.508) % 360;
  const light = [56, 66, 47][index % 3];
  return `hsl(${hue.toFixed(0)}, 64%, ${light}%)`;
}

export class ColoringManager {
  /**
   * @param {object} app
   * @param {Map<string, any>} app.M estruturas construídas
   * @param {Map<string, object>} app.catalog todas as entradas do catálogo, por id
   * @param {Map<string, Array<{nervo: string}>>} app.INNERVATION
   * @param {Array<object>} app.LAYERS
   * @param {(item: object, region: string) => boolean} app.inRegion
   * @param {object} app.state
   * @param {(map: Map<string, THREE.Color> | null) => void} app.setColorOverrides
   */
  constructor(app) {
    this.app = app;
    this.mode = 'camada';
    this.overrides = new Map();
    this.legendEntries = [];
    this.onChange = null; // ouvinte: legenda e botões
  }

  setMode(mode) {
    if (!MODES.some(([m]) => m === mode)) mode = 'camada';
    this.mode = mode;
    this.apply();
  }

  /** Recalcula o mapa de cores (chamar de novo quando o corpo e os nervos terminarem de carregar). */
  apply() {
    const { M, INNERVATION } = this.app;
    this.overrides = new Map();
    const counts = new Map(); // chave da legenda → { color, label, n }
    const add = (key, color, label, id) => {
      let e = counts.get(key);
      if (!e) counts.set(key, (e = { key, color, label, ids: [] }));
      e.ids.push(id);
    };

    if (this.mode !== 'camada') {
      const nerveIndex = this.mode === 'nervo' ? this.nerveIndex() : null;
      for (const [id, m] of M) {
        const item = m.item;
        if (id === 'pele') continue;
        if (this.mode === 'nervo') {
          if (item.kind !== 'musculo') continue;
          const first = INNERVATION.get(id)?.[0]?.nervo;
          const nerve = first && this.app.catalog.get(first);
          if (!nerve) continue;
          const color = nerveColor(nerveIndex.get(first));
          this.overrides.set(id, new THREE.Color(color));
          add(first, color, nerve.name, id);
        } else if (this.mode === 'regiao') {
          const regs = Array.isArray(item.region) ? item.region : [item.region];
          const key = regs.length === 1 && REGION_COLORS[regs[0]] ? regs[0] : 'varias';
          const color = REGION_COLORS[key];
          this.overrides.set(id, new THREE.Color(color));
          add(key, color, key === 'varias' ? 'Mais de uma região' : this.regionLabel(key), id);
        } else if (this.mode === 'grupo') {
          if (item.kind !== 'musculo') continue;
          const g = MUSCLE_GROUP.get(id);
          if (!g) continue;
          const color = groupColor(g);
          this.overrides.set(id, new THREE.Color(color));
          add(g, color, GROUP_LABEL.get(g), id);
        }
      }
    }
    this.legendEntries = this.sortLegend([...counts.values()]);
    this.app.setColorOverrides(this.overrides.size ? this.overrides : null);
    this.onChange?.(this);
  }

  regionLabel(key) {
    return { cabeca: 'Cabeça e pescoço', tronco: 'Tronco', membro_sup: 'Membro superior' }[key] ?? key;
  }

  /** Índice estável de cada nervo que inerva ao menos um músculo (ordem do mapa `INNERVATION`, que é fixa). */
  nerveIndex() {
    const idx = new Map();
    for (const links of this.app.INNERVATION.values()) {
      const n = links[0]?.nervo;
      if (n && !idx.has(n)) idx.set(n, idx.size);
    }
    return idx;
  }

  sortLegend(entries) {
    if (this.mode === 'regiao') {
      const order = [...REGION_ORDER, 'varias'];
      return entries.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
    }
    if (this.mode === 'grupo') {
      return entries.sort((a, b) => GROUPS.findIndex((g) => g.id === a.key) - GROUPS.findIndex((g) => g.id === b.key));
    }
    return entries.sort((a, b) => b.ids.length - a.ids.length || a.label.localeCompare(b.label, 'pt-BR'));
  }

  /** Itens da legenda restritos ao que existe na região mostrada (com a contagem). */
  legend(region = 'todos') {
    const { M, inRegion } = this.app;
    return this.legendEntries
      .map((e) => ({ ...e, n: e.ids.filter((id) => M.has(id) && inRegion(M.get(id).item, region)).length }))
      .filter((e) => e.n > 0);
  }
}
