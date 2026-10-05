import * as THREE from 'three';

/** Decodifica o pacote (gzip + base64) gerado por tools/convert.py em geometrias Three.js. */
export async function loadAnatomy(pack = window.__ANATOMY) {
  if (!pack) throw new Error('dados anatômicos não carregados');
  const bin = atob(pack.data);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const buf = await new Response(stream).arrayBuffer();
  const parts = new Map();
  for (const m of pack.manifest) {
    const q = new Uint16Array(buf, m.ov, m.nv * 3);
    const idx = m.i32 ? new Uint32Array(buf, m.oi, m.ni) : new Uint16Array(buf, m.oi, m.ni);
    const pos = new Float32Array(m.nv * 3);
    for (let k = 0; k < pos.length; k++) {
      const a = k % 3;
      pos[k] = m.lo[a] + (q[k] / 65535) * (m.hi[a] - m.lo[a]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(new THREE.BufferAttribute(idx.slice(), 1));
    g.computeVertexNormals();
    g.computeBoundingBox();
    g.computeBoundingSphere();
    parts.set(m.id, { id: m.id, cat: m.cat, region: m.region, geometry: g });
  }
  return parts;
}
