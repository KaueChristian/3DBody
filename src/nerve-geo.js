import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH } from 'three-mesh-bvh';

/**
 * Geometria dos nervos procedurais: trajetos (tubos) por pontos de referência e ramos gerados até cada músculo.
 *
 * Pontos de um trajeto (lado esquerdo do indivíduo, x > 0; o direito é espelhado):
 *   [x, y, z]                               coordenada absoluta (1 unidade = 10 cm)
 *   'nome'                                  ponto de referência de landmarks.js
 *   { on: id, p: [x,y,z], d }               ponto da superfície de `id` mais próximo de p, afastado d em direção a p
 *                                           (d < 0: para dentro da estrutura)
 *   { cast: id, from: [x,y,z], dir, d }     raio de `from` na direção `dir`: primeira superfície de `id` atingida,
 *                                           recuada d em direção à origem do raio (d < 0: para dentro)
 *   { skin: true, p, d }                    pele mais próxima de p, afundada |d| em direção ao osso (sem entrar nele)
 *   { sec: id, y, x?, at, d }               seção horizontal de `id` na altura y (e perto de x, se dado): at = 'c'
 *                                           (centro), 'ant', 'post', 'med', 'lat', 'sup', 'inf' ou combinações
 *                                           ('post-lat'); d = folga para fora daquele lado (d < 0: para dentro)
 *   { between: [a, b], y, w }               entre as superfícies de a e b na altura y (w: 0 = junto de a, 1 = de b)
 *   qualquer objeto aceita `add: [dx, dy, dz]`
 * `id` pode ser uma estrutura do catálogo (músculo, osso) ou uma peça de malha (ex.: 'umero', 'temporal_e').
 */

const _v = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _n = new THREE.Vector3();

export class NerveBuilder {
  /**
   * @param {object} o
   * @param {(id: string) => THREE.BufferGeometry[]} o.geoms geometrias de uma estrutura ou peça
   * @param {THREE.BufferGeometry[]} o.skins malhas de pele (a mais próxima é usada)
   * @param {(name: string) => THREE.Vector3} o.lm pontos de referência
   */
  constructor({ geoms, skins, bones, lm }) {
    this.geoms = geoms;
    this.skins = skins;
    this.bones = bones;
    this.lm = lm;
    this.secCache = new Map();
    this.rc = new THREE.Raycaster();
    this.rc.firstHitOnly = true;
    this._mesh = new THREE.Mesh(undefined, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  }

  /** Primeira interseção de um raio com as geometrias. */
  cast(list, from, dir) {
    this.rc.set(from, dir.clone().normalize());
    let best = null;
    for (const g of list) {
      this._bvh(g);
      this._mesh.geometry = g;
      const h = this.rc.intersectObject(this._mesh, false)[0];
      if (h && (!best || h.distance < best.distance)) best = h;
    }
    return best;
  }

  /** Ponto da pele mais próximo de p, afundado `depth` em direção ao osso mais próximo (sem atingi-lo). */
  underSkin(p, depth, side = 1) {
    const s = this.closest(this.skins, p, side);
    if (!s) return null;
    const b = this.closest(this.bones, s.point, side);
    if (!b) return s.point;
    const gap = b.point.distanceTo(s.point);
    const dir = b.point.clone().sub(s.point).normalize();
    const d = Math.max(0.003, Math.min(Math.abs(depth), gap - 0.006));
    return s.point.addScaledVector(dir, d);
  }

  /* ───────── consultas geométricas ───────── */

  _bvh(g) {
    if (!g.boundsTree) g.boundsTree = new MeshBVH(g);
    return g.boundsTree;
  }

  /** Ponto mais próximo de p sobre as geometrias (com normal interpolada). */
  closest(list, p, side = 1) {
    let best = null;
    const t = {};
    for (const g of list) {
      this._bvh(g).closestPointToPoint(p, t);
      if (!t.point) continue;
      if (side && Math.sign(t.point.x || side) !== side && Math.abs(t.point.x) > 0.02) continue;
      if (!best || t.distance < best.distance) best = { point: t.point.clone(), distance: t.distance, faceIndex: t.faceIndex, g };
    }
    if (!best) return null;
    const { g, faceIndex } = best;
    const idx = g.index;
    const i0 = idx ? idx.getX(faceIndex * 3) : faceIndex * 3;
    const i1 = idx ? idx.getX(faceIndex * 3 + 1) : faceIndex * 3 + 1;
    const i2 = idx ? idx.getX(faceIndex * 3 + 2) : faceIndex * 3 + 2;
    const pos = g.attributes.position;
    _a.fromBufferAttribute(pos, i0);
    _b.fromBufferAttribute(pos, i1);
    _c.fromBufferAttribute(pos, i2);
    best.normal = new THREE.Vector3().crossVectors(_b.clone().sub(_a), _c.clone().sub(_a)).normalize();
    // orienta a normal para fora: do centro da estrutura (daquele lado) para o ponto
    if (!g.userData.center) {
      g.computeBoundingBox();
      g.userData.center = g.boundingBox.getCenter(new THREE.Vector3());
    }
    const ctr = g.userData.center.clone();
    if (Math.abs(ctr.x) < 0.3 && Math.abs(best.point.x) > 0.3) ctr.x = 0; // malha com os dois lados
    if (best.normal.dot(_n.copy(best.point).sub(ctr)) < 0) best.normal.negate();
    return best;
  }

  /** Vértices (lado esquerdo) de uma estrutura, para seções horizontais. */
  _verts(id) {
    if (!this.secCache.has(id)) {
      const out = [];
      for (const g of this.geoms(id)) {
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) if (p.getX(i) > 0) out.push(p.getX(i), p.getY(i), p.getZ(i));
      }
      if (!out.length) throw new Error(`Sem geometria para "${id}"`);
      this.secCache.set(id, new Float32Array(out));
    }
    return this.secCache.get(id);
  }

  /** Vértices de `id` na faixa horizontal em torno de y (e, se dado, em torno de x). */
  section(id, y, x = null) {
    const v = this._verts(id);
    for (const h of [0.03, 0.06, 0.12, 0.25, 0.4, 0.6]) {
      const pts = [];
      for (let i = 0; i < v.length; i += 3) {
        if (Math.abs(v[i + 1] - y) > h) continue;
        if (x != null && Math.abs(v[i] - x) > Math.max(0.05, h)) continue;
        pts.push(new THREE.Vector3(v[i], v[i + 1], v[i + 2]));
      }
      if (pts.length >= 4) return pts;
    }
    throw new Error(`Seção vazia: ${id} em y = ${y}${x != null ? `, x = ${x}` : ''}`);
  }

  /* ───────── resolução de pontos ───────── */

  point(spec) {
    let p;
    if (Array.isArray(spec)) p = new THREE.Vector3(...spec);
    else if (typeof spec === 'string') p = this.lm(spec).clone();
    else if (spec.skin) {
      p = this.underSkin(new THREE.Vector3(...spec.p), spec.d ?? -0.03);
      if (!p) throw new Error('Não achei a pele');
    } else if (spec.on) {
      const ref = new THREE.Vector3(...spec.p);
      const h = this.closest(this.geoms(spec.on), ref);
      if (!h) throw new Error(`Não achei a superfície de ${spec.on}`);
      const dir = ref.distanceTo(h.point) > 1e-4 ? ref.clone().sub(h.point).normalize() : h.normal;
      p = h.point.addScaledVector(dir, spec.d ?? 0);
    } else if (spec.cast) {
      const from = new THREE.Vector3(...spec.from);
      const dir = new THREE.Vector3(...spec.dir).normalize();
      const list = this.geoms(spec.cast);
      const h = this.cast(list, from, dir);
      if (h) p = h.point.clone().addScaledVector(dir, -(spec.d ?? 0));
      else {
        // o raio passou ao lado: usa o ponto da estrutura mais próximo da linha do raio, do lado de onde o raio veio
        let best = null;
        for (let t = 0; t <= 3; t += 0.02) {
          const q = from.clone().addScaledVector(dir, t);
          const c = this.closest(list, q);
          if (c && (!best || c.distance < best.c.distance)) best = { q, c };
        }
        if (!best) throw new Error(`Sem geometria para ${spec.cast}`);
        p = best.c.point.clone().addScaledVector(dir, -(spec.d ?? 0));
      }
    } else if (spec.sec) {
      const pts = this.section(spec.sec, spec.y, spec.x ?? null);
      const c = pts.reduce((acc, q) => acc.add(q), new THREE.Vector3()).divideScalar(pts.length);
      const dirs = { ant: [0, 0, 1], post: [0, 0, -1], lat: [1, 0, 0], med: [-1, 0, 0], sup: [0, 1, 0], inf: [0, -1, 0] };
      const at = spec.at ?? 'c';
      if (at === 'c') p = c;
      else {
        const d = new THREE.Vector3();
        for (const k of at.split('-')) d.add(new THREE.Vector3(...dirs[k]));
        d.normalize();
        let best = c;
        let bs = -Infinity;
        for (const q of pts) {
          const s = _v.copy(q).sub(c).dot(d);
          if (s > bs) { bs = s; best = q; }
        }
        p = best.clone().addScaledVector(d, spec.d ?? 0);
      }
    } else if (spec.between) {
      const A = this.section(spec.between[0], spec.y);
      const B = this.section(spec.between[1], spec.y);
      let ba = null;
      let bb = null;
      let bd = Infinity;
      for (const a of A) for (const b of B) {
        const d = a.distanceToSquared(b);
        if (d < bd) { bd = d; ba = a; bb = b; }
      }
      p = ba.clone().lerp(bb, spec.w ?? 0.5);
    } else throw new Error(`Ponto inválido: ${JSON.stringify(spec)}`);
    if (spec.add) p.add(_v.set(...spec.add));
    return p;
  }

  /* ───────── tubos ───────── */

  curve(points) {
    const pts = points.filter((p, i) => i === 0 || p.distanceTo(points[i - 1]) > 1e-4);
    return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  }

  tube(curve, r0, r1 = r0) {
    const len = curve.getLength();
    const seg = Math.max(4, Math.ceil(len / 0.02));
    const radial = 8;
    const g = new THREE.TubeGeometry(curve, seg, 1, radial, false);
    // raio variável ao longo do tubo (afina em direção à ponta)
    const pos = g.attributes.position;
    const nor = g.attributes.normal;
    for (let i = 0; i <= seg; i++) {
      const f = i / seg;
      const r = r0 + (r1 - r0) * f;
      const c = curve.getPointAt(f);
      for (let j = 0; j <= radial; j++) {
        const k = i * (radial + 1) + j;
        pos.setXYZ(k, c.x + nor.getX(k) * r, c.y + nor.getY(k) * r, c.z + nor.getZ(k) * r);
      }
    }
    pos.needsUpdate = true;
    g.deleteAttribute('uv');
    return g;
  }

  /**
   * Monta um nervo de um lado.
   * @returns {{ geometry, pick, anchors, curves }}
   */
  build(spec, side, muscleGeoms) {
    const mirror = (p) => (side < 0 ? new THREE.Vector3(-p.x, p.y, p.z) : p);
    const curves = [];
    const tubes = [];
    const picks = [];
    for (const path of spec.paths ?? []) {
      // entre dois pontos sob a pele, acrescenta pontos intermediários também sob a pele, para o tubo não cortar o osso
      const raw = path.pts.map((s) => this.point(s));
      const pts = [];
      raw.forEach((p, i) => {
        const prev = path.pts[i - 1];
        const cur = path.pts[i];
        if (i > 0 && prev?.skin && cur?.skin) {
          const a = raw[i - 1];
          const n = Math.min(6, Math.floor(a.distanceTo(p) / 0.06));
          const da = Math.abs(prev.d ?? 0.03);
          const db = Math.abs(cur.d ?? 0.03);
          for (let k = 1; k <= n; k++) {
            const f = k / (n + 1);
            const q = this.underSkin(a.clone().lerp(p, f), da + (db - da) * f);
            if (q) pts.push(mirror(q));
          }
        }
        pts.push(mirror(p));
      });
      const c = this.curve(pts);
      const r = path.r ?? spec.r ?? 0.01;
      curves.push({ c, r });
      tubes.push(this.tube(c, r, path.r1 ?? r));
      picks.push(this.tube(c, Math.max(r * 2.2, 0.02)));
    }
    // ramos até os músculos
    for (const ram of spec.ramos ?? []) {
      if (ram.semRamo) continue;
      const list = muscleGeoms(ram.m);
      if (!list.length) continue;
      const br = this.branch(curves, list, ram, side, mirror, !!spec.superficial);
      if (!br) continue;
      tubes.push(this.tube(br.curve, br.r, br.r * 0.7));
      picks.push(this.tube(br.curve, 0.014));
    }
    const geometry = tubes.length ? mergeGeometries(tubes) : null;
    if (geometry) {
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    }
    const pick = picks.length ? mergeGeometries(picks) : null;
    // âncora do rótulo: meio do trajeto mais longo, normal saindo do eixo do corpo
    const anchors = [];
    if (curves.length) {
      const main = curves.reduce((a, b) => (b.c.getLength() > a.c.getLength() ? b : a));
      const p = main.c.getPointAt(spec.labelAt ?? 0.5);
      const nrm = new THREE.Vector3(p.x, 0, p.z - 0.1).normalize();
      anchors.push({ pos: p, normal: nrm.lengthSq() ? nrm : new THREE.Vector3(0, 0, 1) });
    }
    return { geometry, pick, anchors, curves };
  }

  /** Ramo do ponto do trajeto mais próximo do músculo até a superfície dele. */
  branch(curves, list, ram, side, mirror, superficial = false) {
    // amostras ao longo dos trajetos permitidos
    const pathIdx = ram.path != null ? [ram.path] : curves.map((_, i) => i);
    const [t0, t1] = ram.t ?? [0, 1];
    const samples = [];
    for (const i of pathIdx) {
      const { c, r } = curves[i];
      const n = Math.max(6, Math.ceil(c.getLength() / 0.03));
      for (let k = 0; k <= n; k++) {
        const t = t0 + ((t1 - t0) * k) / n;
        samples.push({ i, t, p: c.getPointAt(t), r });
      }
    }
    // pré-filtro barato: só as amostras mais próximas da caixa envolvente do músculo vão para a consulta exata
    const box = new THREE.Box3();
    for (const g of list) {
      if (!g.boundingBox) g.computeBoundingBox();
      box.union(g.boundingBox);
    }
    if (side < 0 || box.min.x < -0.05) {
      // músculo com os dois lados numa malha só: usa a caixa do lado do nervo
      const half = new THREE.Box3();
      for (const g of list) {
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i += 3) if (Math.sign(p.getX(i)) === side) half.expandByPoint(_v.fromBufferAttribute(p, i));
      }
      if (!half.isEmpty()) box.copy(half);
    }
    samples.sort((a, b) => box.distanceToPoint(a.p) - box.distanceToPoint(b.p));
    let best = null;
    for (const s of samples.slice(0, 14)) {
      const h = this.closest(list, s.p, side);
      if (h && (!best || h.distance < best.h.distance)) best = { s, h };
    }
    if (!best) return null;
    let { s, h } = best;
    // refina perto da melhor amostra
    const { c } = curves[s.i];
    const dt = 0.04 / Math.max(c.getLength(), 0.05);
    for (let k = -4; k <= 4; k++) {
      const t = Math.min(1, Math.max(0, s.t + (k * dt) / 2));
      const p = c.getPointAt(t);
      const hh = this.closest(list, p, side);
      if (hh && hh.distance < h.distance) { h = hh; s = { ...s, t, p }; }
    }
    if (h.distance < 0.015 && !ram.via) return null; // o tronco já passa dentro/junto do músculo
    const P = s.p.clone();
    const Q = h.point.clone().addScaledVector(h.normal, -0.012);
    const pts = [P];
    if (ram.via) for (const v of ram.via) pts.push(mirror(this.point(v)));
    else if (superficial && P.distanceTo(Q) > 0.08) {
      // nervos sob a pele (face): o ramo acompanha a curvatura da pele em vez de cortar caminho por dentro
      const depth = (p) => this.closest(this.skins, p, side)?.distance ?? 0.05;
      const d0 = depth(P);
      const d1 = depth(Q);
      for (let k = 1; k < 5; k++) {
        const f = k / 5;
        const q = this.underSkin(P.clone().lerp(Q, f), d0 + (d1 - d0) * f, side);
        if (q) pts.push(q);
      }
    } else {
      const T = c.getTangentAt(s.t);
      const mid = P.clone().lerp(Q, 0.45).addScaledVector(T, Math.min(0.06, P.distanceTo(Q) * 0.25));
      pts.push(mid);
    }
    pts.push(Q);
    return { curve: this.curve(pts), r: Math.max(0.0035, Math.min(s.r * 0.6, 0.0065)) };
  }
}
