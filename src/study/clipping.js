/**
 * Planos de corte anatômicos (sagital, coronal, axial) com controle deslizante (F1.6).
 *
 * Usa o plano de corte global do Three.js: some tudo o que está do lado negativo do plano (distância assinada < 0).
 * As malhas são casca de dupla face, então o corte mostra o interior das cascas, sem "tampa" na fatia.
 */
import * as THREE from 'three';

/** Limites de reserva (1 unidade = 10 cm) quando o modelo ainda não tem caixa envolvente. */
const FALLBACK = {
  sagittal: [-1.5, 1.5],
  coronal: [-1.5, 1.5],
  axial: [-5.5, 1.5],
};
const AXIS_NORMAL = { sagittal: [1, 0, 0], coronal: [0, 0, 1], axial: [0, 1, 0] };
const AXIS_COMPONENT = { sagittal: 'x', coronal: 'z', axial: 'y' };

export class ClippingManager {
  /**
   * @param {THREE.WebGLRenderer} renderer
   * @param {() => THREE.Box3 | null} [getBox] caixa envolvente do modelo (para o curso do controle deslizante)
   */
  constructor(renderer, getBox = () => null) {
    this.renderer = renderer;
    this.getBox = getBox;
    this.activeAxis = 'none'; // 'none' | 'sagittal' | 'coronal' | 'axial'
    this.inverted = false;
    this.sliderValue = 0; // -1 a 1
    this.plane = new THREE.Plane();
    this.range = [-1, 1];
  }

  get active() {
    return this.activeAxis !== 'none';
  }

  /** Curso do plano no eixo, tirado da caixa do modelo (com uma pequena folga); cai nos limites de reserva. */
  computeRange(axis) {
    const box = this.getBox();
    if (box && !box.isEmpty()) {
      const c = AXIS_COMPONENT[axis];
      const min = box.min[c];
      const max = box.max[c];
      if (Number.isFinite(min) && Number.isFinite(max) && max > min) return [min, max];
    }
    return FALLBACK[axis];
  }

  setAxis(axis) {
    this.activeAxis = axis;
    if (axis === 'none') {
      this.renderer.clippingPlanes = [];
      return;
    }
    this.range = this.computeRange(axis);
    this.updatePlane();
  }

  setOffset(sliderRatio) {
    this.sliderValue = Math.max(-1, Math.min(1, sliderRatio));
    if (this.active) this.updatePlane();
  }

  toggleInvert() {
    this.inverted = !this.inverted;
    if (this.active) this.updatePlane();
    return this.inverted;
  }

  updatePlane() {
    if (!this.active) {
      this.renderer.clippingPlanes = [];
      return;
    }
    const [min, max] = this.range;
    const pos = min + ((this.sliderValue + 1) / 2) * (max - min);
    const normal = new THREE.Vector3(...AXIS_NORMAL[this.activeAxis]);
    if (this.inverted) this.plane.set(normal.negate(), pos);
    else this.plane.set(normal, -pos);
    this.renderer.clippingPlanes = [this.plane];
  }

  /** O ponto está do lado que foi cortado (invisível)? Usado para o clique ignorar o que não aparece. */
  isClipped(point) {
    return this.active && this.plane.distanceToPoint(point) < 0;
  }

  reset() {
    this.activeAxis = 'none';
    this.inverted = false;
    this.sliderValue = 0;
    this.renderer.clippingPlanes = [];
  }

  /** Estado em texto curto para o hash da URL: `eixo,posicao,invertido` (vazio sem corte). */
  serialize() {
    if (!this.active) return '';
    return `${this.activeAxis},${+this.sliderValue.toFixed(2)},${this.inverted ? 1 : 0}`;
  }

  /** Aplica um estado serializado; devolve false se for inválido. */
  restore(text) {
    if (!text) { this.reset(); return true; }
    const [axis, slider, inv] = String(text).split(',');
    if (!AXIS_NORMAL[axis]) return false;
    const s = Number(slider);
    this.inverted = inv === '1';
    this.sliderValue = Number.isFinite(s) ? Math.max(-1, Math.min(1, s)) : 0;
    this.setAxis(axis);
    return true;
  }
}
