import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

THREE.Mesh.prototype.raycast = acceleratedRaycast;

export const SKULL_PARTS = [
  'frontal', 'parietal_d', 'parietal_e', 'occipital', 'temporal_d', 'temporal_e', 'esfenoide', 'etmoide',
  'maxila_d', 'maxila_e', 'mandibula', 'zigomatico_d', 'zigomatico_e', 'nasal_d', 'nasal_e',
];
export const TORSO_PARTS = [
  ...Array.from({ length: 12 }, (_, i) => `costela_${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `vertebra_t${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `vertebra_l${i + 1}`),
  'esterno_manubrio', 'esterno_corpo', 'esterno_xifoide', 'sacro', 'osso_quadril', 'escapula', 'clavicula', 'umero',
];

const FAR = 6;
const TORSO_AXIS_Z = 0.12;
const _dir = new THREE.Vector3();
const _org = new THREE.Vector3();
const _tri = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
const _bary = new THREE.Vector3();

function bvhMesh(geometry) {
  const g = geometry.index ? geometry : geometry;
  g.boundsTree = new MeshBVH(g);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
}

/**
 * Superfícies de referência (pele e crânio) para "colar" estruturas sobre a anatomia real.
 */
export class Surfaces {
  constructor(parts, { skin = 'pele', bones = SKULL_PARTS } = {}) {
    this.skin = bvhMesh(parts.get(skin).geometry);
    const skull = mergeGeometries(
      bones.filter((id) => parts.has(id)).map((id) => {
        const g = parts.get(id).geometry.clone();
        for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
        return g.index && g.index.array instanceof Uint16Array
          ? (g.setIndex(new THREE.BufferAttribute(new Uint32Array(g.index.array), 1)), g)
          : g;
      }),
    );
    this.skull = bvhMesh(skull);
    this.rc = new THREE.Raycaster();
    this.rc.firstHitOnly = true;
    this.rc.far = FAR;
  }

  _hit(mesh, ox, oy, oz, dx, dy, dz) {
    _org.set(ox, oy, oz);
    _dir.set(dx, dy, dz);
    this.rc.set(_org, _dir);
    const h = this.rc.intersectObject(mesh, false)[0];
    return h || null;
  }

  _normal(mesh, hit, out) {
    const g = mesh.geometry;
    const nrm = g.attributes.normal;
    const pos = g.attributes.position;
    const { a, b, c } = hit.face;
    _tri[0].fromBufferAttribute(pos, a);
    _tri[1].fromBufferAttribute(pos, b);
    _tri[2].fromBufferAttribute(pos, c);
    THREE.Triangle.getBarycoord(hit.point, _tri[0], _tri[1], _tri[2], _bary);
    out.set(0, 0, 0);
    out.x = nrm.getX(a) * _bary.x + nrm.getX(b) * _bary.y + nrm.getX(c) * _bary.z;
    out.y = nrm.getY(a) * _bary.x + nrm.getY(b) * _bary.y + nrm.getY(c) * _bary.z;
    out.z = nrm.getZ(a) * _bary.x + nrm.getZ(b) * _bary.y + nrm.getZ(c) * _bary.z;
    if (out.lengthSq() < 1e-9) out.copy(hit.face.normal);
    return out.normalize();
  }

  /**
   * Projeta o ponto 2D (a, b) sobre a pele marchando um raio ao longo de `axis` a partir do lado `dir`.
   * @returns {{p: THREE.Vector3, n: THREE.Vector3, gap: number}|null}  gap = distância pele→osso ao longo do raio
   */
  project(a, b, axis, dir) {
    const T = 3;
    let o;
    let d;
    if (axis === 'r') {
      // radial a partir do eixo vertical do tronco: a = ângulo (0 = frente, + = lado esquerdo), b = altura
      o = [0, b, TORSO_AXIS_Z];
      d = [Math.sin(a), 0, Math.cos(a)];
    } else if (axis === 'z') { o = [a, b, T * dir]; d = [0, 0, -dir]; }
    else if (axis === 'x') { o = [T * dir, b, a]; d = [-dir, 0, 0]; }
    else { o = [a, T * dir, b]; d = [0, -dir, 0]; }
    const h = this._hit(this.skin, o[0], o[1], o[2], d[0], d[1], d[2]);
    if (!h) return null;
    const n = this._normal(this.skin, h, new THREE.Vector3());
    const facing = n.x * d[0] + n.y * d[1] + n.z * d[2];
    // raios externos vêm de fora (normal contra o raio); os radiais saem de dentro (normal a favor do raio)
    if (axis === 'r' ? facing < 0 : facing > 0) n.negate();
    let gap = 1;
    const k = this._hit(this.skull, o[0], o[1], o[2], d[0], d[1], d[2]);
    if (k) gap = Math.max(0, k.distance - h.distance);
    return { p: h.point.clone(), n, gap };
  }

  /** Ponto da pele mais próximo de p (usado para posicionar rótulos). */
  nearestSkin(p) {
    const t = {};
    this.skin.geometry.boundsTree.closestPointToPoint(p, t);
    return t.point ?? p;
  }
}
