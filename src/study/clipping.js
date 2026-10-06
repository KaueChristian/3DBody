/**
 * Planos de corte anatômico (Sagital, Coronal, Axial) com controle deslizante (F1.6).
 * Utiliza o suporte nativo a clipping planes do Three.js.
 */
import * as THREE from 'three';

export class ClippingManager {
  /**
   * @param {THREE.WebGLRenderer} renderer
   */
  constructor(renderer) {
    this.renderer = renderer;
    this.activeAxis = 'none'; // 'none' | 'sagittal' | 'coronal' | 'axial'
    this.inverted = false;
    this.plane = new THREE.Plane();
    this.sliderValue = 0; // -1 a 1

    // Limites anatômicos aproximados do modelo no sistema de coordenadas (1 un = 10 cm)
    this.bounds = {
      sagittal: { min: -1.5, max: 1.5, default: 0 },
      coronal:  { min: -1.5, max: 1.5, default: 0 },
      axial:    { min: -5.5, max: 1.5, default: -0.5 },
    };
  }

  setAxis(axis) {
    this.activeAxis = axis;
    if (axis === 'none') {
      this.renderer.clippingPlanes = [];
      return;
    }
    this.updatePlane();
  }

  setOffset(sliderRatio) {
    this.sliderValue = Math.max(-1, Math.min(1, sliderRatio));
    if (this.activeAxis !== 'none') {
      this.updatePlane();
    }
  }

  toggleInvert() {
    this.inverted = !this.inverted;
    if (this.activeAxis !== 'none') {
      this.updatePlane();
    }
    return this.inverted;
  }

  updatePlane() {
    if (this.activeAxis === 'none') {
      this.renderer.clippingPlanes = [];
      return;
    }

    const b = this.bounds[this.activeAxis];
    // Mapeia [-1, 1] para [min, max]
    const t = (this.sliderValue + 1) / 2;
    const pos = b.min + t * (b.max - b.min);

    const normal = new THREE.Vector3();
    if (this.activeAxis === 'sagittal') normal.set(1, 0, 0);
    else if (this.activeAxis === 'coronal') normal.set(0, 0, 1);
    else if (this.activeAxis === 'axial') normal.set(0, 1, 0);

    if (this.inverted) {
      normal.negate();
      this.plane.set(normal, pos);
    } else {
      this.plane.set(normal, -pos);
    }

    this.renderer.clippingPlanes = [this.plane];
  }

  reset() {
    this.activeAxis = 'none';
    this.inverted = false;
    this.sliderValue = 0;
    this.renderer.clippingPlanes = [];
  }
}
