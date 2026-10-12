import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Envoltório convexo esquemático (pericárdio, F5.2).
 *
 * { kind: 'hull', of: [[peça, { y: [min, max] }?], …], pad?, step?, relax? }
 *   Casco convexo dos vértices das peças citadas (cada uma pode ser limitada a uma faixa de altura `y`, para pegar só a raiz de
 *   um vaso). O casco tem poucas faces grandes; por isso a superfície é refeita como uma esfera fina cujo raio, em cada direção
 *   a partir do centro, é a distância até o casco, suavizada `relax` vezes entre vizinhos e inflada `pad`. É só um desenho do
 *   contorno: não tem lâminas, cavidade nem seios. As peças são as malhas do pacote de dados (ex.: 'cor_parede_atrio_d'), não
 *   as estruturas do catálogo.
 */
export function buildHull(spec, geo) {
  const pts = [];
  const v = new THREE.Vector3();
  for (const [part, lim] of spec.of) {
    const p = geo(part).attributes.position;
    for (let i = 0; i < p.count; i += spec.step ?? 2) {
      v.fromBufferAttribute(p, i);
      if (lim?.y && (v.y < lim.y[0] || v.y > lim.y[1])) continue;
      pts.push(v.clone());
    }
  }
  const center = pts.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(pts.length);
  // planos das faces do casco: distância do centro ao plano e normal para fora
  const hp = new ConvexGeometry(pts).attributes.position;
  const planes = [];
  const [a, b, c] = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  for (let i = 0; i + 2 < hp.count; i += 3) {
    a.fromBufferAttribute(hp, i); b.fromBufferAttribute(hp, i + 1); c.fromBufferAttribute(hp, i + 2);
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    if (n.lengthSq() < 1e-14) continue;
    n.normalize();
    let off = n.dot(a) - n.dot(center);
    if (off < 0) { n.negate(); off = -off; }
    planes.push([n, off]);
  }
  // esfera fina indexada: a direção de cada vértice dá o raio até o casco
  let g = new THREE.IcosahedronGeometry(1, 14);
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  g = mergeVertices(g, 1e-5);
  const pos = g.attributes.position;
  const n = pos.count;
  let r = new Float32Array(n);
  const d = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    let best = Infinity;
    for (const [pn, off] of planes) {
      const k = pn.dot(d);
      if (k > 1e-6) best = Math.min(best, off / k);
    }
    r[i] = best;
  }
  const nb = Array.from({ length: n }, () => new Set());
  const idx = g.index.array;
  for (let k = 0; k < idx.length; k += 3) {
    for (let e = 0; e < 3; e++) { nb[idx[k + e]].add(idx[k + (e + 1) % 3]); nb[idx[k + (e + 1) % 3]].add(idx[k + e]); }
  }
  for (let it = 0; it < (spec.relax ?? 5); it++) {
    const next = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (const j of nb[i]) s += r[j];
      next[i] = 0.5 * r[i] + 0.5 * (s / nb[i].size);
    }
    r = next;
  }
  const pad = spec.pad ?? 0.04;
  for (let i = 0; i < n; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    pos.setXYZ(i, center.x + d.x * (r[i] + pad), center.y + d.y * (r[i] + pad), center.z + d.z * (r[i] + pad));
  }
  g.computeVertexNormals();
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return { geometry: g, anchors: [] };
}
