/**
 * Enquadramento da câmera: ao focar uma estrutura par (as duas mãos numa malha só, ou duas cópias procedurais), o
 * alvo tem de ser o lado escolhido, não o centro das duas, que cai no meio do corpo.
 */
import * as THREE from 'three';

const _v3 = new THREE.Vector3();

/** Esfera envolvente da parte de `m` do lado `sx` (+1 esquerdo, −1 direito); a esfera inteira se a estrutura cruza a linha média. */
export function sideSphere(m, sx) {
  m.sides ??= {};
  if (m.sides[sx]) return m.sides[sx];
  const all = { center: m.center, radius: m.radius };
  const box = new THREE.Box3();
  let mid = 0;
  let n = 0;
  for (const mesh of m.meshes) {
    const p = mesh.geometry.attributes.position;
    for (let i = 0; i < p.count; i += 3) {
      const x = p.getX(i);
      n++;
      if (Math.abs(x) < 0.03) mid++;
      if (sx && Math.sign(x) === sx) box.expandByPoint(_v3.set(x, p.getY(i), p.getZ(i)));
    }
  }
  const s = !sx || box.isEmpty() || mid > n * 0.03 ? all : box.getBoundingSphere(new THREE.Sphere());
  m.sides[sx] = s;
  return s;
}
