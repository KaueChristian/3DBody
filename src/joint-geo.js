import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';
import { NerveBuilder } from './nerve-geo.js';

/**
 * Geometria das articulações (F3): cápsulas articulares e lâminas entre ossos, calculadas sobre as malhas reais dos ossos.
 *
 * Cápsula — { kind: 'capsule', a: [peças], b: [peças], gap, y?: [min, max], pad?, min?, flat?, one? }
 *   Junta os vértices (lado esquerdo) de `a` que ficam a menos de `gap` de `b`, e vice-versa: é a zona em que as superfícies
 *   articulares se encaram. O envoltório é um elipsoide nos eixos principais dessa nuvem, folgado `pad`; `y` limita a altura
 *   (o rádio e a ulna se tocam em cima e embaixo); `one` usa só os pontos de `a` (a face da escápula voltada para as costelas).
 *   É um desenho esquemático: a cápsula verdadeira se prende em volta das cartilagens e tem recessos, o que um elipsoide não
 *   mostra.
 *
 * Lâmina — { kind: 'web', a: peça, b: peça, y: [y0, y1], n?, thick?, inset? }
 *   Faixa fina entre as margens mais próximas de dois ossos em cada altura (membrana interóssea).
 *
 * Colaterais — { kind: 'collateral', a, b, gap, lat } (ver `collateralPoints`); `group` (proc.js) junta várias numa malha só.
 *
 * As peças são as malhas do pacote de dados (ex.: 'umero', 'carpo_escafoide'), não as estruturas do catálogo.
 */

const _v = new THREE.Vector3();

/** Vértices de `from` (x > 0, dentro da faixa `y`) a menos de `gap` de alguma geometria de `to`. */
function contactPoints(from, to, gap, y) {
  const out = [];
  const hit = {};
  // pré-filtro barato: a consulta exata no BVH só para vértices dentro da caixa de `to` alargada por `gap`
  const boxes = to.map((h) => {
    if (!h.boundingBox) h.computeBoundingBox();
    return h.boundingBox.clone().expandByScalar(gap);
  });
  for (const g of from) {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      _v.fromBufferAttribute(p, i);
      if (_v.x <= 0 || (y && (_v.y < y[0] || _v.y > y[1]))) continue;
      for (let k = 0; k < to.length; k++) {
        if (boxes[k].containsPoint(_v) && to[k].boundsTree.closestPointToPoint(_v, hit, 0, gap)) { out.push(_v.clone()); break; }
      }
    }
  }
  return out;
}

/** Os dois lados usam a mesma medida (feita no lado esquerdo e espelhada): calcula uma vez por especificação. */
const memo = new WeakMap();
const once = (spec, f) => {
  if (!memo.has(spec)) memo.set(spec, f());
  return memo.get(spec);
};

/** Centro e eixos principais (autovetores da covariância, por Jacobi) de uma nuvem de pontos. */
export function principalAxes(pts) {
  const c = new THREE.Vector3();
  pts.forEach((p) => c.add(p));
  c.divideScalar(pts.length);
  const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of pts) {
    const d = [p.x - c.x, p.y - c.y, p.z - c.z];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] += (d[i] * d[j]) / pts.length;
  }
  const V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let it = 0; it < 40; it++) {
    let p = 0;
    let q = 1;
    for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) if (Math.abs(C[i][j]) > Math.abs(C[p][q])) { p = i; q = j; }
    if (Math.abs(C[p][q]) < 1e-14) break;
    const th = 0.5 * Math.atan2(2 * C[p][q], C[q][q] - C[p][p]);
    const cs = Math.cos(th);
    const sn = Math.sin(th);
    for (let k = 0; k < 3; k++) {
      const a = C[k][p];
      const b = C[k][q];
      C[k][p] = cs * a - sn * b;
      C[k][q] = sn * a + cs * b;
    }
    for (let k = 0; k < 3; k++) {
      const a = C[p][k];
      const b = C[q][k];
      C[p][k] = cs * a - sn * b;
      C[q][k] = sn * a + cs * b;
    }
    for (let k = 0; k < 3; k++) {
      const a = V[k][p];
      const b = V[k][q];
      V[k][p] = cs * a - sn * b;
      V[k][q] = sn * a + cs * b;
    }
  }
  const axes = [0, 1, 2].map((k) => new THREE.Vector3(V[0][k], V[1][k], V[2][k]).normalize());
  // semieixo: maior afastamento ao longo de cada eixo (a nuvem é a das superfícies, então o máximo não é ruído)
  const ext = axes.map((ax) => Math.max(...pts.map((p) => Math.abs(_v.copy(p).sub(c).dot(ax)))));
  return { center: c, axes, ext };
}

function mirrorGeometry(g) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) p.setX(i, -p.getX(i));
  const idx = g.index.array;
  for (let k = 0; k < idx.length; k += 3) {
    const t = idx[k + 1];
    idx[k + 1] = idx[k + 2];
    idx[k + 2] = t;
  }
  g.computeVertexNormals();
}

/** Ponto da superfície do elipsoide na direção `d` a partir do centro. */
function ellipsoidPoint(c, axes, r, d) {
  let s = 0;
  for (let i = 0; i < 3; i++) s += (d.dot(axes[i]) / r[i]) ** 2;
  return c.clone().addScaledVector(d, 1 / Math.sqrt(s));
}

/** @param {(id: string) => THREE.BufferGeometry} geo peça → geometria (com BVH) */
export function buildCapsule(spec, side, geo) {
  const { center, axes, ext } = once(spec, () => {
    const A = spec.a.map(geo);
    const B = spec.b.map(geo);
    const pts = contactPoints(A, B, spec.gap, spec.y);
    if (!spec.one) pts.push(...contactPoints(B, A, spec.gap, spec.y));
    if (pts.length < 8) throw new Error(`Cápsula sem contato suficiente entre ${spec.a} e ${spec.b} (${pts.length} pontos)`);
    return principalAxes(pts);
  });
  const pad = spec.pad ?? 0.03;
  const r = ext.map((e) => Math.max(spec.min ?? 0.03, e + pad));
  // `flat`: achata o menor eixo (espaços como o escapulotorácico, em que a nuvem é uma lâmina)
  if (spec.flat) r[0] = Math.min(r[0], spec.flat);
  const g = new THREE.SphereGeometry(1, spec.seg ?? 28, spec.rings ?? 18);
  g.deleteAttribute('uv');
  const basis = new THREE.Matrix4().makeBasis(axes[0], axes[1], axes[2]);
  const m = new THREE.Matrix4().makeTranslation(center.x, center.y, center.z).multiply(basis).multiply(new THREE.Matrix4().makeScale(r[0], r[1], r[2]));
  g.applyMatrix4(m);
  // âncora do rótulo: superfície do elipsoide do lado de fora do corpo
  const out = new THREE.Vector3(center.x, 0, center.z - 0.1).normalize();
  const pos = ellipsoidPoint(center, axes, r, out);
  const anchors = [{ pos, normal: out.clone() }];
  if (side < 0) {
    mirrorGeometry(g);
    anchors.forEach((a) => { a.pos.x = -a.pos.x; a.normal.x = -a.normal.x; });
  } else g.computeVertexNormals();
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return { geometry: g, anchors };
}

/** Vértices (x > 0) de uma geometria numa faixa horizontal em torno de y. */
function band(g, y, h) {
  const p = g.attributes.position;
  const out = [];
  for (let i = 0; i < p.count; i++) {
    if (p.getX(i) <= 0 || Math.abs(p.getY(i) - y) > h) continue;
    out.push(new THREE.Vector3().fromBufferAttribute(p, i));
  }
  return out;
}

/** Margens das duas peças, de baixo para cima, já afastadas `inset` de cada osso e suavizadas. */
function webRows(spec, geo) {
  const ga = geo(spec.a);
  const gb = geo(spec.b);
  const n = spec.n ?? 24;
  const inset = spec.inset ?? 0.006; // começa logo fora do osso, sem tocar a superfície
  const rows = [];
  for (let i = 0; i <= n; i++) {
    const y = spec.y[0] + ((spec.y[1] - spec.y[0]) * i) / n;
    const [a, b] = closestPair(ga, gb, y);
    const d = b.clone().sub(a).normalize();
    rows.push([a.clone().addScaledVector(d, inset), b.clone().addScaledVector(d, -inset)]);
  }
  // suaviza as margens (a malha decimada dá saltos de um vértice para o outro)
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 1; i < rows.length - 1; i++) {
      for (const k of [0, 1]) rows[i][k] = rows[i - 1][k].clone().add(rows[i][k]).add(rows[i + 1][k]).divideScalar(3);
    }
  }
  return rows;
}

/** Par de pontos mais próximos entre `a` e `b` na altura y (margens interósseas). */
function closestPair(ga, gb, y) {
  for (const h of [0.02, 0.04, 0.08, 0.14]) {
    const A = band(ga, y, h);
    const B = band(gb, y, h);
    if (A.length < 2 || B.length < 2) continue;
    let best = null;
    let bd = Infinity;
    for (const a of A) for (const b of B) {
      const d = a.distanceToSquared(b);
      if (d < bd) { bd = d; best = [a, b]; }
    }
    return best;
  }
  throw new Error(`Sem seção dos ossos em y = ${y}`);
}

export function buildWeb(spec, side, geo) {
  const rows = once(spec, () => webRows(spec, geo)).map((r) => r.map((p) => p.clone()));
  const thick = spec.thick ?? 0.006;
  const nc = 6;
  const pos = [];
  const idx = [];
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  rows.forEach(([a, b], i) => {
    const up = rows[Math.min(i + 1, rows.length - 1)][0].clone().sub(rows[Math.max(i - 1, 0)][0]).normalize();
    T.copy(b).sub(a).normalize();
    N.crossVectors(T, up).normalize();
    for (let j = 0; j <= nc; j++) {
      const f = j / nc;
      const p = a.clone().lerp(b, f);
      pos.push(p.x + N.x * thick, p.y + N.y * thick, p.z + N.z * thick);
    }
    for (let j = 0; j <= nc; j++) {
      const f = j / nc;
      const p = a.clone().lerp(b, f);
      pos.push(p.x - N.x * thick, p.y - N.y * thick, p.z - N.z * thick);
    }
  });
  const per = (nc + 1) * 2;
  for (let i = 0; i < rows.length - 1; i++) {
    for (const off of [0, nc + 1]) {
      for (let j = 0; j < nc; j++) {
        const a = i * per + off + j;
        const b = a + per;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  const mid = rows[rows.length >> 1];
  const c = mid[0].clone().lerp(mid[1], 0.5);
  const anchors = [{ pos: c, normal: new THREE.Vector3(0, 0, 1) }];
  if (side < 0) {
    mirrorGeometry(g);
    anchors.forEach((a) => { a.pos.x = -a.pos.x; });
  } else g.computeVertexNormals();
  g.computeBoundingBox();
  g.computeBoundingSphere();
  return { geometry: g, anchors };
}

/**
 * Ligamentos colaterais de um gínglimo — { kind: 'collateral', a: peça, b: peça, gap, lat: [x, y, z], r? }
 * Devolve os dois pares de pontos (lado radial e ulnar da articulação): o eixo do osso vai do centro de `a` ao de `b` e
 * `lat` (o eixo de flexão, aproximado) dá os lados; cada ponta é o ponto da peça mais próximo de um alvo fora do osso.
 */
export function collateralPoints(spec, geo) {
  return once(spec, () => measureCollateral(spec, geo));
}

function measureCollateral(spec, geo) {
  const A = geo(spec.a);
  const B = geo(spec.b);
  const pts = [...contactPoints([A], [B], spec.gap), ...contactPoints([B], [A], spec.gap)];
  if (pts.length < 4) throw new Error(`Colateral sem contato entre ${spec.a} e ${spec.b}`);
  const c = pts.reduce((s, p) => s.add(p), new THREE.Vector3()).divideScalar(pts.length);
  const centroid = (g) => {
    const p = g.attributes.position;
    const s = new THREE.Vector3();
    let n = 0;
    for (let i = 0; i < p.count; i++) if (p.getX(i) > 0) { s.add(_v.fromBufferAttribute(p, i)); n++; }
    return s.divideScalar(n);
  };
  const axis = centroid(B).sub(centroid(A)).normalize();
  const lat = new THREE.Vector3(...spec.lat);
  lat.addScaledVector(axis, -lat.dot(axis)).normalize();
  const r = spec.r ?? 0.12;
  const reach = spec.reach ?? 0.05;
  const hit = {};
  const near = (g, target) => {
    g.boundsTree.closestPointToPoint(target, hit);
    return hit.point.clone().addScaledVector(lat.clone().multiplyScalar(Math.sign(target.clone().sub(c).dot(lat))), 0.006);
  };
  return [1, -1].map((s) => [
    near(A, c.clone().addScaledVector(lat, s * r).addScaledVector(axis, -reach)),
    near(B, c.clone().addScaledVector(lat, s * r).addScaledVector(axis, reach)),
  ]);
}

/**
 * Contexto para montar ligamentos e cápsulas do corpo: peças com BVH e pontos ancorados nas malhas, resolvidos pelo mesmo
 * código dos nervos ({ on }, { cast }, { sec }, { between }).
 * @param {Map<string, {geometry: THREE.BufferGeometry}>} parts peças do pacote do corpo
 * @param {(name: string) => THREE.Vector3} lm pontos de referência
 */
export function jointContext(parts, lm) {
  const geo = (id) => {
    const p = parts.get(id);
    if (!p) throw new Error(`Peça inexistente: ${id}`);
    if (!p.geometry.boundsTree) p.geometry.boundsTree = new MeshBVH(p.geometry);
    return p.geometry;
  };
  const builder = new NerveBuilder({ geoms: (id) => [geo(id)], skins: [geo('pele_corpo')], bones: [], lm });
  return { geo, point: (spec) => builder.point(spec) };
}
