import * as THREE from 'three';

/**
 * Geração procedural de estruturas (músculos, fáscias, ligamentos) coladas na anatomia real.
 * - ribbon / sheet / ring: desenhados em 2D num plano de projeção e projetados sobre a pele,
 *   afundados `inset` abaixo dela (respeitando o osso).
 * - tube: fusos/faixas entre pontos 3D (inserções ósseas), para planos profundos e ligamentos.
 *
 * Convenção (lado esquerdo do indivíduo, x > 0; o direito é espelhado):
 *   proj 'z+' vista frontal (x, y) · 'z-' posterior (x, y) · 'x+' lateral (z, y) · 'y+' superior (x, z)
 */

const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function curve2(points, closed = false) {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(p[0], p[1], 0)), closed, 'centripetal');
}

function profile(values, f) {
  if (typeof values === 'number') return values;
  const n = values.length - 1;
  const x = Math.min(Math.max(f, 0), 1) * n;
  const i = Math.min(Math.floor(x), n - 1);
  return lerp(values[i], values[i + 1], smooth(x - i));
}

function makeGenerator(spec) {
  if (spec.kind === 'ribbon') {
    const path = curve2(spec.path);
    const t = new THREE.Vector3();
    return (f, c) => {
      const p = path.getPointAt(f);
      path.getTangentAt(f, t);
      const off = (c - 0.5) * profile(spec.width ?? 0.08, f);
      return [p.x - t.y * off, p.y + t.x * off];
    };
  }
  if (spec.kind === 'sheet') {
    const A = curve2(spec.A);
    const B = curve2(spec.B);
    return (f, c) => {
      const a = A.getPointAt(c);
      const b = B.getPointAt(c);
      return [lerp(a.x, b.x, f), lerp(a.y, b.y, f)];
    };
  }
  if (spec.kind === 'ring') {
    const [cx, cy] = spec.c;
    const rot = spec.rot ?? 0;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    return (f, c) => {
      const ang = f * Math.PI * 2;
      const rx = lerp(spec.inner[0], spec.outer[0], c);
      const ry = lerp(spec.inner[1], spec.outer[1], c);
      const ex = Math.cos(ang) * rx;
      const ey = Math.sin(ang) * ry;
      return [cx + ex * cr - ey * sr, cy + ex * sr + ey * cr];
    };
  }
  throw new Error(`Tipo desconhecido: ${spec.kind}`);
}

function finishGeometry(pos, uv, idx, nf, nc, closedRows, stripeScale) {
  // escala dos UV pela dimensão real → fibras com densidade constante
  const cols = nc + 1;
  const rows = nf + 1;
  let wid = 0;
  let len = 0;
  for (let i = 0; i < rows; i++) {
    const a = i * cols * 3;
    const b = (i * cols + nc) * 3;
    wid += Math.hypot(pos[a] - pos[b], pos[a + 1] - pos[b + 1], pos[a + 2] - pos[b + 2]);
  }
  for (let i = 0; i < nf; i++) {
    const a = (i * cols + (nc >> 1)) * 3;
    const b = ((i + 1) * cols + (nc >> 1)) * 3;
    len += Math.hypot(pos[a] - pos[b], pos[a + 1] - pos[b + 1], pos[a + 2] - pos[b + 2]);
  }
  const us = wid / rows / stripeScale;
  const vs = len / (stripeScale * 1.3);
  for (let k = 0; k < uv.length; k += 2) {
    uv[k] *= us;
    uv[k + 1] *= vs;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  if (closedRows) {
    const n = g.attributes.normal;
    for (let j = 0; j < cols; j++) {
      const i0 = j;
      const i1 = nf * cols + j;
      const x = n.getX(i0) + n.getX(i1);
      const y = n.getY(i0) + n.getY(i1);
      const z = n.getZ(i0) + n.getZ(i1);
      const l = Math.hypot(x, y, z) || 1;
      n.setXYZ(i0, x / l, y / l, z / l);
      n.setXYZ(i1, x / l, y / l, z / l);
    }
  }
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return g;
}

function gridIndices(nf, nc) {
  const idx = [];
  const cols = nc + 1;
  for (let i = 0; i < nf; i++) {
    for (let j = 0; j < nc; j++) {
      const a = i * cols + j;
      idx.push(a, a + cols, a + 1, a + 1, a + cols, a + cols + 1);
    }
  }
  return idx;
}

function flip(g) {
  const idx = g.index.array;
  for (let k = 0; k < idx.length; k += 3) {
    const t = idx[k + 1];
    idx[k + 1] = idx[k + 2];
    idx[k + 2] = t;
  }
  g.index.needsUpdate = true;
  g.computeVertexNormals();
}

/** Garante que as faces frontais apontem para fora (afastando-se do centro da cabeça). */
function orientOutward(g, center) {
  const p = g.attributes.position;
  const n = g.attributes.normal;
  let s = 0;
  for (let k = 0; k < p.count; k++) {
    s += (p.getX(k) - center.x) * n.getX(k) + (p.getY(k) - center.y) * n.getY(k) + (p.getZ(k) - center.z) * n.getZ(k);
  }
  if (s < 0) flip(g);
}

const _c = new THREE.Vector3();

function buildSurfacePart(spec, side, S) {
  const gen = makeGenerator(spec);
  const proj = spec.proj ?? 'z+';
  const axis = proj[0];
  const dir0 = proj[1] === '-' ? -1 : 1;
  const mirrorA = side < 0 && axis !== 'x';
  const dir = side < 0 && axis === 'x' ? -dir0 : dir0;
  const closed = spec.kind === 'ring';
  const nf = spec.nf ?? (closed ? 64 : 28);
  const nc = spec.nc ?? 8;
  const inset = spec.inset ?? 0.05;
  const thick = spec.thick ?? 0.03;
  const minDepth = spec.minDepth ?? 0.008;
  const pos = [];
  const uv = [];
  let last = null;
  for (let i = 0; i <= nf; i++) {
    const f = i / nf;
    const prof = closed ? 1 : 0.25 + 0.75 * Math.pow(Math.sin(Math.PI * Math.min(f, 1 - 1e-6)), 0.7);
    for (let j = 0; j <= nc; j++) {
      const c = j / nc;
      let [a, b] = gen(f, c);
      if (mirrorA) a = -a;
      let h = S.project(a, b, axis, dir);
      if (axis === 'r' && h) { /* sem folga de osso confiável: usa só o recuo pedido */ h.gap = 1; }
      if (!h) h = last;
      if (!h) h = { p: new THREE.Vector3(a, b, 0), n: new THREE.Vector3(0, 0, 1), gap: 1 };
      last = h;
      const cross = Math.pow(Math.max(0, 1 - (2 * c - 1) ** 2), 0.5);
      const ins = Math.min(inset, Math.max(minDepth * 1.6, h.gap * 0.8));
      const depth = Math.max(minDepth, ins - thick * prof * cross);
      pos.push(h.p.x - h.n.x * depth, h.p.y - h.n.y * depth, h.p.z - h.n.z * depth);
      uv.push(c, f);
    }
  }
  const g = finishGeometry(pos, uv, gridIndices(nf, nc), nf, nc, closed, 0.7);
  let my = 0;
  for (let k = 1; k < pos.length; k += 3) my += pos[k];
  orientOutward(g, _c.set(0, my / (pos.length / 3), spec.proj?.[0] === 'r' ? 0.12 : 0));
  const at = (k) => ({
    pos: new THREE.Vector3(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]),
    normal: new THREE.Vector3(g.attributes.normal.getX(k), g.attributes.normal.getY(k), g.attributes.normal.getZ(k)),
  });
  const mid = (nf >> 1) * (nc + 1) + (nc >> 1);
  const anchors = closed ? [at(nc), at(Math.round(nf / 2) * (nc + 1) + nc)] : [at(mid)];
  return { geometry: g, anchors };
}

function buildTube(spec, side, lm, S) {
  const pts = spec.pts.map((p) => {
    let v;
    if (typeof p === 'string') v = lm(p).clone();
    else if (Array.isArray(p)) v = new THREE.Vector3(...p);
    else {
      // ponto projetado sobre a pele (lado esquerdo), afundado `inset`
      const axis = p.proj[0];
      const h = S.project(p.a, p.b, axis, p.proj[1] === '-' ? -1 : 1);
      v = h ? h.p.clone().addScaledVector(h.n, -(p.inset ?? 0)) : new THREE.Vector3(p.a, p.b, 0);
    }
    if (side < 0) v.x = -v.x;
    return v;
  });
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const ref = new THREE.Vector3(...(spec.ref ?? [1, 0, 0]));
  if (side < 0) ref.x = -ref.x;
  const nf = spec.nf ?? 28;
  const nc = spec.nc ?? 10; // vértices ao redor da seção
  const width = spec.width ?? 0.08;
  const thick = spec.thick ?? 0.03;
  const taper = spec.taper ?? 'pointed';
  const pos = [];
  const uv = [];
  const T = new THREE.Vector3();
  const B = new THREE.Vector3();
  const N = new THREE.Vector3();
  for (let i = 0; i <= nf; i++) {
    const f = i / nf;
    const p = curve.getPointAt(f);
    curve.getTangentAt(f, T);
    B.crossVectors(T, ref);
    if (B.lengthSq() < 1e-6) B.crossVectors(T, new THREE.Vector3(0, 1, 0));
    B.normalize();
    N.crossVectors(B, T).normalize();
    const env = taper === 'blunt' ? 0.55 + 0.45 * Math.sin(Math.PI * f) : Math.pow(Math.max(Math.sin(Math.PI * f), 0), 0.6) * 0.92 + 0.08;
    const rb = (profile(width, f) / 2) * env;
    const rn = (profile(thick, f) / 2) * env;
    for (let j = 0; j <= nc; j++) {
      const a = (j / nc) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      pos.push(p.x + B.x * ca * rb + N.x * sa * rn, p.y + B.y * ca * rb + N.y * sa * rn, p.z + B.z * ca * rb + N.z * sa * rn);
      uv.push(j / nc, f);
    }
  }
  const g = finishGeometry(pos, uv, gridIndices(nf, nc), nf, nc, false, 0.7);
  // normais para fora do eixo do tubo
  const nrm = g.attributes.normal;
  const p0 = curve.getPointAt(0.5);
  const mid = (nf >> 1) * (nc + 1);
  let s = 0;
  for (let j = 0; j < nc; j++) {
    const k = mid + j;
    s += (pos[k * 3] - p0.x) * nrm.getX(k) + (pos[k * 3 + 1] - p0.y) * nrm.getY(k) + (pos[k * 3 + 2] - p0.z) * nrm.getZ(k);
  }
  if (s < 0) flip(g);
  const anchors = [{ pos: curve.getPointAt(0.5), normal: ref.clone().normalize() }];
  return { geometry: g, anchors };
}

/**
 * Anel (toroide) em torno de um eixo, de seção elíptica: esfíncteres e músculos circulares (pupila, corpo ciliar, uretra).
 * { kind: 'torus', c: [x,y,z], axis: [x,y,z], R: raio do anel, rb: meia-largura radial, rn: meia-espessura axial }
 */
function buildTorus(spec, side) {
  const c = new THREE.Vector3(...spec.c);
  const ax = new THREE.Vector3(...(spec.axis ?? [0, 0, 1])).normalize();
  if (side < 0) {
    c.x = -c.x;
    ax.x = -ax.x;
  }
  const up = Math.abs(ax.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const e1 = new THREE.Vector3().crossVectors(ax, up).normalize();
  const e2 = new THREE.Vector3().crossVectors(ax, e1).normalize();
  const nf = spec.nf ?? 48;
  const nc = spec.nc ?? 10;
  const pos = [];
  const uv = [];
  const r = new THREE.Vector3();
  for (let i = 0; i <= nf; i++) {
    const t = (i / nf) * Math.PI * 2;
    r.copy(e1).multiplyScalar(Math.cos(t)).addScaledVector(e2, Math.sin(t));
    for (let j = 0; j <= nc; j++) {
      const a = (j / nc) * Math.PI * 2;
      const rad = spec.R + spec.rb * Math.cos(a);
      const ax_ = spec.rn * Math.sin(a);
      pos.push(c.x + r.x * rad + ax.x * ax_, c.y + r.y * rad + ax.y * ax_, c.z + r.z * rad + ax.z * ax_);
      uv.push(j / nc, i / nf);
    }
  }
  const g = finishGeometry(pos, uv, gridIndices(nf, nc), nf, nc, true, 0.7);
  // a seção em a = 0 é a face externa (rad máximo): a normal tem de apontar para fora do eixo do anel
  const nrm = g.attributes.normal;
  const k = 0;
  const out = r.copy(e1);
  if (nrm.getX(k) * out.x + nrm.getY(k) * out.y + nrm.getZ(k) * out.z < 0) flip(g);
  const anchors = [{ pos: c.clone().addScaledVector(e1, spec.R + spec.rb), normal: e1.clone() }];
  return { geometry: g, anchors };
}

/** @param {object} spec @param {number} side +1 esquerdo / -1 direito @param {import('./surfaces.js').Surfaces} S @param {(name:string)=>THREE.Vector3} lm */
export function buildProc(spec, side, S, lm) {
  if (spec.kind === 'torus') return buildTorus(spec, side);
  return spec.kind === 'tube' ? buildTube(spec, side, lm, S) : buildSurfacePart(spec, side, S);
}

/** Textura de fibras (listras finas). */
export function makeFiberTexture(contrast = 0.42) {
  const W = 128;
  const H = 32;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');
  const img = ctx.createImageData(W, H);
  const cols = Array.from({ length: W }, () => Math.random());
  const sm = cols.map((_, i) => (cols[(i + W - 1) % W] + 2 * cols[i] + cols[(i + 1) % W]) / 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = 1 - contrast + contrast * sm[x] + (Math.random() - 0.5) * 0.05;
      const k = Math.max(0, Math.min(255, Math.round(v * 255)));
      const o = (y * W + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = k;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
