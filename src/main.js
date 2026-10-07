import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshBVH } from 'three-mesh-bvh';
import { loadAnatomy } from './anatomy.js';
import { Surfaces, TORSO_PARTS } from './surfaces.js';
import { buildProc, makeFiberTexture } from './proc.js';
import { LM } from './landmarks.js';
import { ITEMS as ALL_ITEMS, HEAD_IDS, BODY_ITEMS, NERVES, INNERVATION, LAYERS, KIND_LABEL, REGIONS, inRegion, layersForDissect } from './catalog.js';
import { NerveBuilder } from './nerve-geo.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SKULL_PARTS } from './surfaces.js';
import { StudyController } from './study/ui.js';
import { userData } from './study/storage.js';
import { showDesktopDownload } from './get-app.js';

let studyController = null;

const $ = (s) => document.querySelector(s);
const stage = $('#stage');
const canvas = $('#gl');
const LAYER = Object.fromEntries(LAYERS.map((l) => [l.id, l]));
/** Itens já construídos (a cabeça primeiro; o corpo é carregado em segundo plano). */
const ITEMS = [];
const HEAD_CENTER = new THREE.Vector3(0, -0.35, 0);

/* ───────────────────────── Estado ───────────────────────── */
const state = {
  selected: null,
  hover: null,
  labels: false,
  skin: 0.14,
  dissect: 1,
  layers: new Set(),
  hidden: new Set(),
  collapsed: new Set(),
  region: 'cabeca',
  bodyReady: false,
  nervesReady: false,
  search: '',
  quiz: null,
  /** Realces temporários do quiz: id → 'ok' | 'bad'. */
  flash: new Map(),
};

/* ───────────────────────── Cena ───────────────────────── */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;
/** Corte limpo do pescoço (a malha original é cortada um pouco abaixo). */
const NECK_CLIP = [new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.3)];
const NECK_CLIP_IDS = ['pele'];

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 90);
const TARGET0 = new THREE.Vector3(0, -0.4, 0);
camera.position.set(1.9, 0.2, 7).sub(TARGET0).setLength(7.6).add(TARGET0);

const controls = new OrbitControls(camera, canvas);
controls.target.copy(TARGET0);
controls.enableDamping = true;
controls.dampingFactor = 0.09;
controls.minDistance = 1.2;
controls.maxDistance = 34;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 0.8;
controls.screenSpacePanning = true;
controls.update();

scene.add(new THREE.HemisphereLight(0xe6ecff, 0x3b2c2a, 0.55));
const key = new THREE.DirectionalLight(0xfff0e0, 2.0);
key.position.set(2.5, 3.5, 4.5);
scene.add(key);
const fill = new THREE.DirectionalLight(0x9fb4ff, 0.6);
fill.position.set(-4, 1, 2);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffd9cf, 0.9);
rim.position.set(-1, 2, -4);
scene.add(rim);
const headlight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(headlight, headlight.target);

/* ───────────────────────── Materiais ───────────────────────── */
const fiberTex = makeFiberTexture(0.4);
const fiberTexSoft = makeFiberTexture(0.18);

function makeMaterial(key, color) {
  const std = (o) => new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, ...o });
  switch (key) {
    case 'bone': return std({ color: '#dccfae', roughness: 0.8 });
    case 'tooth': return std({ color: '#fbf8ee', roughness: 0.35 });
    case 'sclera': return std({ color: '#f3eee4', roughness: 0.3 });
    case 'cornea': return std({ color: '#dfe9ee', roughness: 0.05, transparent: true, opacity: 0.28, depthWrite: false });
    case 'iris': return std({ color: '#4d7a8c', roughness: 0.35 });
    case 'lens': return std({ color: '#cdd9de', roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false });
    case 'skin': return std({ color: '#e4b399', roughness: 0.55, transparent: true, opacity: 0.35, depthWrite: false });
    case 'brow': return std({ color: '#2f231d', roughness: 0.9 });
    case 'ligament': return std({ color: '#f1da8c', roughness: 0.4, map: fiberTexSoft });
    case 'fascia': return std({ color: '#aebfd3', roughness: 0.45, transparent: true, opacity: 0.6, depthWrite: false, map: fiberTexSoft });
    case 'gland': return std({ color: '#dca35e', roughness: 0.6 });
    case 'tongue': return std({ color: '#c9606c', roughness: 0.55 });
    case 'cartilage': return std({ color: '#9fc3c9', roughness: 0.5 });
    case 'nerve': return std({ color: '#f0cf55', roughness: 0.42, emissive: '#000000' });
    default: // músculo
      return std({ color, roughness: 0.5, map: fiberTex, bumpMap: fiberTex, bumpScale: 1.2 });
  }
}

/** Resolve disputas de profundidade entre superfícies quase coincidentes: camadas superficiais ganham. */
const DEPTH_OFFSET = { nervo: -2.5, fascia: -3, mimica: -2, sup: -2, pescoco: -1.5, med: -1.5, mastigacao: -1, ligamento: -1, prof: -0.5, osso: 0.5 };

function jitter(hex, id) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const r = (h % 1000) / 1000 - 0.5;
  c.setHSL(hsl.h + r * 0.014, hsl.s, Math.min(0.72, Math.max(0.22, hsl.l + r * 0.1)));
  return c;
}

/* ───────────────────────── Construção dos itens ───────────────────────── */
const modelRoot = new THREE.Group();
scene.add(modelRoot);
/** @type {Map<string, any>} */
const M = new Map();
const lmCache = new Map();
let bodyParts = null;
let headParts = null;
const FINGER = { 2: 'indicador', 3: 'medio', 4: 'anelar', 5: 'minimo' };

/** Pontos de referência calculados a partir das malhas da mão (mão esquerda, x > 0). Ex.: hand.mc.3.head.palm */
function handLandmark(name) {
  const [, kind, k, what, side] = name.split('.');
  const id = kind === 'mc' ? `metacarpal_${k}` : `falange_proximal_${FINGER[k]}`;
  const pos = bodyParts.get(id).geometry.attributes.position;
  const pts = [];
  for (let i = 0; i < pos.count; i++) if (pos.getX(i) > 0) pts.push([pos.getX(i), pos.getY(i), pos.getZ(i)]);
  pts.sort((a, b) => a[1] - b[1]);
  const n = Math.max(3, Math.floor(pts.length * 0.15));
  const avg = (arr) => arr.reduce((acc, p) => [acc[0] + p[0] / arr.length, acc[1] + p[1] / arr.length, acc[2] + p[2] / arr.length], [0, 0, 0]);
  const distal = avg(pts.slice(0, n));
  const proximal = avg(pts.slice(-n));
  const base = what === 'head' ? distal : what === 'base' ? proximal : avg([distal, proximal]);
  // palma voltada para a frente (+z); lado radial = lado do polegar (+x na mão esquerda)
  const dz = side === 'palm' ? 0.05 : -0.03;
  return new THREE.Vector3(base[0] + 0.03, base[1], base[2] + dz);
}

const lm = (name) => {
  if (!lmCache.has(name)) {
    if (name.startsWith('hand.')) lmCache.set(name, handLandmark(name));
    else {
      if (!LM[name]) throw new Error(`Landmark inexistente: ${name}`);
      lmCache.set(name, new THREE.Vector3(...LM[name]));
    }
  }
  return lmCache.get(name);
};

function ensureBVH(g) {
  if (!g.boundsTree) g.boundsTree = new MeshBVH(g);
}

/** Âncora de rótulo: ponto da malha mais externo em relação ao eixo do corpo. */
function outerAnchor(g, side = 0) {
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  let cx = 0;
  let cy = 0;
  let cz = 0;
  let n = 0;
  for (let i = 0; i < pos.count; i += 3) {
    if (side && Math.sign(pos.getX(i)) !== side) continue;
    cx += pos.getX(i); cy += pos.getY(i); cz += pos.getZ(i); n++;
  }
  if (!n) { cx = cy = cz = 0; n = 1; }
  const c = new THREE.Vector3(cx / n, cy / n, cz / n);
  const axis = new THREE.Vector3(0, c.y < -1.5 ? c.y : -0.35, 0.1);
  const d = c.clone().sub(axis);
  if (d.lengthSq() < 1e-6) d.set(side || 0, 0, 1);
  d.normalize();
  let best = -1e9;
  let bi = 0;
  for (let i = 0; i < pos.count; i += 2) {
    if (side && Math.sign(pos.getX(i)) !== side) continue;
    const sc = pos.getX(i) * d.x + pos.getY(i) * d.y + pos.getZ(i) * d.z;
    if (sc > best) { best = sc; bi = i; }
  }
  return {
    pos: new THREE.Vector3(pos.getX(bi), pos.getY(bi), pos.getZ(bi)),
    normal: new THREE.Vector3(nor.getX(bi), nor.getY(bi), nor.getZ(bi)).normalize(),
  };
}

/** Uma âncora por lado quando a malha reúne os dois antímeros. */
function outerAnchors(g) {
  if (!g.boundingBox) g.computeBoundingBox();
  const bb = g.boundingBox;
  const both = bb.min.x < -0.2 && bb.max.x > 0.2;
  return both ? [outerAnchor(g, 1), outerAnchor(g, -1)] : [outerAnchor(g)];
}

function procMatKey(item) {
  if (item.kind === 'ligamento') return 'ligament';
  if (item.kind === 'fascia') return 'fascia';
  if (item.kind === 'glandula') return 'gland';
  return 'muscle';
}

function buildItems(parts, S, items) {
  for (const item of items) {
    const layer = LAYER[item.layer];
    const color = jitter(item.color ?? layer.color, item.id);
    const mats = new Map();
    const matFor = (k) => {
      if (!mats.has(k)) {
        const m = makeMaterial(k, color);
        if (NECK_CLIP_IDS.includes(item.id)) m.clippingPlanes = NECK_CLIP;
        const po = DEPTH_OFFSET[item.layer] ?? 0;
        if (po) { m.polygonOffset = true; m.polygonOffsetFactor = po; m.polygonOffsetUnits = po * 2; }
        m.userData.base = { opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite };
        m.userData.baseColor = m.color.clone();
        mats.set(k, m);
      }
      return mats.get(k);
    };
    const group = new THREE.Group();
    group.name = item.id;
    const meshes = [];
    const anchors = [];
    const addMesh = (geometry, mat, an) => {
      ensureBVH(geometry);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.userData.id = item.id;
      group.add(mesh);
      meshes.push(mesh);
      if (an) anchors.push(...an);
    };
    for (const p of item.parts ?? []) {
      const geo = parts.get(p.id).geometry;
      const wantAnchor = !['cornea', 'iris', 'lens'].includes(p.mat);
      addMesh(geo, matFor(item.mat ?? p.mat), wantAnchor ? outerAnchors(geo) : null);
    }
    if (item.proc) {
      const sides = item.paired === false ? [1] : [1, -1];
      for (const side of sides) {
        item.proc.forEach((spec, si) => {
          const { geometry, anchors: an } = buildProc(spec, side, S, lm);
          addMesh(geometry, matFor(procMatKey(item)), si === 0 ? an : null);
        });
      }
    }
    if (!anchors.length && meshes.length) anchors.push(...outerAnchors(meshes[0].geometry));
    const box = new THREE.Box3();
    meshes.forEach((m) => {
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      box.union(m.geometry.boundingBox);
    });
    const sph = box.getBoundingSphere(new THREE.Sphere());
    modelRoot.add(group);
    M.set(item.id, { item, group, meshes, mats: [...mats.values()], anchors, color, radius: sph.radius, center: sph.center });
    ITEMS.push(item);
  }
}

/* ───────────────────────── Nervos ───────────────────────── */
const PICK_MAT = new THREE.MeshBasicMaterial({ visible: false });

/**
 * Monta os nervos depois que cabeça e corpo existem: malhas reais (órbita) + trajetos procedurais e ramos até cada músculo.
 * @param {Map} nerveParts malhas reais dos nervos
 * @param {THREE.BufferGeometry[]} skins
 */
async function buildNerves(nerveParts, skins) {
  const geoms = (id) => {
    if (id === 'cranio') return SKULL_PARTS.filter((p) => headParts.has(p)).map((p) => headParts.get(p).geometry);
    const m = M.get(id);
    if (m) return m.meshes.map((x) => x.geometry);
    const p = bodyParts?.get(id) ?? headParts.get(id) ?? nerveParts.get(id);
    return p ? [p.geometry] : [];
  };
  // todos os ossos numa malha só (uma consulta por ponto, em vez de uma por osso)
  const boneGeo = mergeGeometries([...M.values()].filter((m) => m.item.layer === 'osso').flatMap((m) => m.meshes.map((x) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', x.geometry.attributes.position);
    const idx = x.geometry.index;
    if (idx) g.setIndex(new THREE.BufferAttribute(new Uint32Array(idx.array), 1));
    return g;
  })));
  const bones = [boneGeo];
  const builder = new NerveBuilder({ geoms, skins, bones, lm });
  if (window.__app) window.__app.nerveBuilder = builder;
  const muscleGeoms = (id) => (M.has(id) ? M.get(id).meshes.map((x) => x.geometry) : []);
  const layer = LAYER.nervo;
  let n = 0;
  for (const item of NERVES) {
    if (++n % 4 === 0) await new Promise((r) => setTimeout(r, 0)); // não trava a interface
    const color = jitter(item.color ?? layer.color, item.id);
    const mat = makeMaterial('nerve');
    mat.color.copy(color);
    const po = DEPTH_OFFSET.nervo;
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = po;
    mat.polygonOffsetUnits = po * 2;
    mat.userData.base = { opacity: mat.opacity, transparent: mat.transparent, depthWrite: mat.depthWrite };
    mat.userData.baseColor = mat.color.clone();
    const group = new THREE.Group();
    group.name = item.id;
    const meshes = [];
    const pick = [];
    const anchors = [];
    const add = (geometry, pickGeo, an) => {
      ensureBVH(geometry);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.userData.id = item.id;
      group.add(mesh);
      meshes.push(mesh);
      if (pickGeo) {
        ensureBVH(pickGeo);
        const pm = new THREE.Mesh(pickGeo, PICK_MAT);
        pm.userData.id = item.id;
        group.add(pm);
        pick.push(pm);
      } else pick.push(mesh);
      if (an) anchors.push(...an);
    };
    try {
      for (const p of item.parts ?? []) {
        const geo = nerveParts.get(p.id)?.geometry;
        if (geo) add(geo, null, outerAnchors(geo));
      }
      if (item.paths?.length) {
        for (const side of item.paired === false ? [1] : [1, -1]) {
          const { geometry, pick: pg, anchors: an } = builder.build(item, side, muscleGeoms);
          if (geometry) add(geometry, pg, item.parts?.length ? null : an);
        }
      }
    } catch (err) {
      console.error(`[nervos] ${item.id}:`, err);
      continue;
    }
    if (!meshes.length) continue;
    if (!anchors.length) anchors.push(...outerAnchors(meshes[0].geometry));
    const box = new THREE.Box3();
    meshes.forEach((mm) => {
      if (!mm.geometry.boundingBox) mm.geometry.computeBoundingBox();
      box.union(mm.geometry.boundingBox);
    });
    const sph = box.getBoundingSphere(new THREE.Sphere());
    modelRoot.add(group);
    M.set(item.id, { item, group, meshes, pick, mats: [mat], anchors, color, radius: sph.radius, center: sph.center });
    ITEMS.push(item);
  }
}

/** Estruturas ligadas à selecionada: músculo → seus nervos; nervo → músculos que inerva. */
function relatedIds(id) {
  const m = M.get(id);
  if (!m) return [];
  if (m.item.kind === 'nervo') return (m.item.ramos ?? []).map((r) => r.m);
  return (INNERVATION.get(id) ?? []).map((r) => r.nervo);
}

/* ───────────────────────── Visibilidade e destaque ───────────────────────── */
const isSkin = (m) => m.item.id === 'pele';

function regionOk(item) {
  return inRegion(item, state.region);
}

function itemVisible(m) {
  if (!state.layers.has(m.item.layer) || state.hidden.has(m.item.id) || !regionOk(m.item)) return false;
  // com a pele opaca, o que está por baixo não deve vazar por pequenas diferenças entre as malhas
  if (state.layers.has('pele') && state.skin >= 0.9 && m.item.layer !== 'pele') return false;
  return true;
}

function applyVisibility() {
  for (const m of M.values()) m.group.visible = itemVisible(m);
  applyHighlight();
  studyController?.onViewChanged();
}

/** Cores escolhidas pelo modo de coloração (id → THREE.Color); `null` = cor própria de cada material. */
let colorOverrides = null;
function setColorOverrides(map) {
  colorOverrides = map;
  applyHighlight();
}

const FLASH = { ok: new THREE.Color('#86D36B'), bad: new THREE.Color('#ff4a5c') };

function applyHighlight() {
  const sel = state.selected;
  const dimTo = state.quiz ? 0.09 : 0.16;
  const canHover = !state.quiz || state.quiz.mode === 'locate';
  const related = new Set(sel && !state.quiz ? relatedIds(sel) : []);
  // com um nervo em foco, os músculos dele ficam semitransparentes para o trajeto aparecer por dentro deles
  const selNerve = !!sel && M.get(sel)?.item.kind === 'nervo';
  for (const m of M.values()) {
    const isSel = m.item.id === sel;
    const isRel = related.has(m.item.id);
    const isHover = m.item.id === state.hover && canHover;
    const fb = state.flash.get(m.item.id);
    const dim = !!sel && !isSel && !isRel;
    m.mats.forEach((mat, mi) => {
      const b = mat.userData.base;
      let op = b.opacity;
      let tr = b.transparent;
      let dw = b.depthWrite;
      if (isSkin(m)) {
        op = mi === 1 ? Math.min(1, state.skin * 1.4) : state.skin;
        tr = op < 0.985;
        dw = !tr;
        if (dim) op *= 0.35;
      } else if (dim) {
        op = Math.min(op, dimTo);
        tr = true;
        dw = false;
      } else if (isRel && selNerve) {
        op = Math.min(op, 0.45);
        tr = true;
        dw = false;
      }
      if (mat.transparent !== tr || mat.depthWrite !== dw) { mat.transparent = tr; mat.depthWrite = dw; mat.needsUpdate = true; }
      mat.opacity = op;
      const base = colorOverrides?.get(m.item.id) ?? mat.userData.baseColor;
      mat.color.copy(fb ? FLASH[fb] : base);
      mat.emissive.copy(fb ? FLASH[fb] : base).multiplyScalar(fb ? 0.5 : isSel ? 0.42 : isHover ? (state.quiz ? 0.34 : 0.2) : isRel ? 0.18 : 0);
    });
    m.group.renderOrder = isSkin(m) ? 5 : 0;
  }
  document.body.classList.toggle('has-sel', !!sel && !state.quiz);
}

/* ───────────────────────── Câmera ───────────────────────── */
let goal = null;
const VIEWS = {
  front: [0, 0.02, 1],
  three: [0.78, 0.14, 0.62],
  right: [-1, 0.02, 0],
  left: [1, 0.02, 0],
  back: [0, 0.05, -1],
};

function flyTo(dir, dist, target) {
  const d = new THREE.Vector3(...dir).normalize();
  goal = { target: target.clone(), pos: target.clone().add(d.multiplyScalar(dist)) };
}
/** Enquadramento de cada região (alvo e distância da câmera). */
const REGION_VIEW = {
  todos: { target: [0, -3.8, 0.1], dist: 21 },
  cabeca: { target: [0, -0.4, 0], dist: 7.4 },
  tronco: { target: [0, -3.7, 0.15], dist: 11.5 },
  membro_sup: { target: [0, -5.3, 0.25], dist: 17 },
};
let currentView = 'three';
function viewPreset(name) {
  currentView = name;
  const rv = REGION_VIEW[state.region] ?? REGION_VIEW.cabeca;
  flyTo(VIEWS[name], rv.dist, new THREE.Vector3(...rv.target));
  document.querySelectorAll('.toolbar button[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === name));
}
controls.addEventListener('start', () => {
  goal = null;
  document.querySelectorAll('.toolbar button[data-view]').forEach((b) => b.classList.remove('on'));
});

function setRegion(r, { fly = true } = {}) {
  if (r !== 'cabeca' && r !== 'todos' && !state.bodyReady) return;
  state.region = r;
  document.querySelectorAll('.toolbar button[data-region]').forEach((b) => b.classList.toggle('on', b.dataset.region === r));
  const sel = state.selected && M.get(state.selected);
  if (sel && !regionOk(sel.item)) select(null, { fly: false });
  applyVisibility();
  syncList();
  if (fly) viewPreset(currentView);
}

/**
 * `wide`: vira a câmera para o lado da estrutura, mas sem chegar perto (usado nas dicas do quiz).
 * `side`: 1 ou -1 restringe o enquadramento à cópia esquerda (x > 0) ou direita da estrutura, quando ela existe.
 */
function focusItem(id, wide = false, side = 0) {
  const m = M.get(id);
  if (!m || !m.anchors.length) return;
  const cam = camera.position.clone().sub(controls.target).normalize();
  const sided = side ? m.anchors.filter((a) => a.pos.x * side > 0) : [];
  const anchors = sided.length ? sided : m.anchors;
  let best = anchors[0];
  let bestDot = -9;
  for (const a of anchors) {
    const d = a.normal.dot(cam) + 0.25 * Math.sign(a.pos.x || 1) * Math.sign(cam.x || 1);
    if (d > bestDot) { bestDot = d; best = a; }
  }
  const dir = best.normal.clone().multiplyScalar(0.8).add(new THREE.Vector3(0, 0.1, 0)).add(cam.clone().multiplyScalar(0.3));
  const target = best.pos.clone().multiplyScalar(0.6).add(m.center.clone().multiplyScalar(0.4)).multiplyScalar(0.9);
  const dist = Math.min(14, Math.max(3.2, m.radius * 3.6 + 1.6)) + (wide ? 3.5 : 0);
  flyTo(dir.toArray(), dist, target);
}

/* ───────────────────────── Seleção ───────────────────────── */
function select(id, { fly = true, panel = true } = {}) {
  state.selected = id;
  if (id) {
    const m = M.get(id);
    if (!itemVisible(m)) {
      state.layers.add(m.item.layer);
      state.hidden.delete(id);
      syncLayers();
    }
  }
  applyHighlight();
  syncList();
  if (id) {
    if (fly) focusItem(id);
    if (panel) showInfo(id); else hideInfo();
  } else hideInfo();
  studyController?.onViewChanged();
}

/* ───────────────────────── Painel de informações ───────────────────────── */
const infoEl = $('#info');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Chips das estruturas ligadas (nervo → músculos; músculo → nervos). */
function linksHtml(item) {
  const isNerve = item.kind === 'nervo';
  const list = isNerve
    ? (item.ramos ?? []).map((r) => ({ id: r.m, obs: r.obs, sens: r.sens }))
    : (INNERVATION.get(item.id) ?? []).map((r) => ({ id: r.nervo, obs: r.obs, sens: r.sens }));
  if (!list.length) return '';
  const chip = (l) => {
    const target = M.get(l.id);
    const name = target ? target.item.name : ALL_ITEMS.find((i) => i.id === l.id)?.name ?? l.id;
    const color = target ? target.color.getStyle() : LAYER.nervo.color;
    const extra = [l.obs, l.sens ? 'sensitivo' : ''].filter(Boolean).join(' · ');
    const tag = state.quiz || !target ? 'span' : 'button';
    return `<${tag} class="lchip${l.sens ? ' sens' : ''}" data-go="${esc(l.id)}" style="--c:${color}"><i></i><span>${esc(name)}${extra ? `<small>${esc(extra)}</small>` : ''}</span></${tag}>`;
  };
  const title = isNerve ? 'Músculos e estruturas inervados' : 'Nervos (inervação)';
  const pending = !isNerve && !state.nervesReady ? '<p class="links-note">Os nervos aparecem em instantes, quando terminarem de ser montados.</p>' : '';
  return `<div class="links"><h3>${title}</h3><div class="lchips">${list.map(chip).join('')}</div>${pending}</div>`;
}

function geomBadge(item) {
  const hasParts = Array.isArray(item.parts) && item.parts.length > 0;
  const hasPaths = Array.isArray(item.paths) && item.paths.length > 0;
  if (hasParts && hasPaths) {
    return '<span class="geom-badge real" title="Malha anatômica do BodyParts3D com ramos medidos no modelo">Malha real (BodyParts3D) + ramos</span>';
  }
  if (hasParts) {
    return '<span class="geom-badge real" title="Origem geométrica: BodyParts3D (CC BY-SA 2.1 JP)">Malha real (BodyParts3D)</span>';
  }
  return '<span class="geom-badge proc" title="Geometria modelada por código sobre referências anatômicas">Modelada por código (aproximada)</span>';
}

function sourcesHtml(item) {
  if (!item.fontes || !item.fontes.length) return '';
  return `<div class="sources"><b>Fontes</b><ul>${item.fontes.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>`;
}

function showInfo(id) {
  const { item } = M.get(id);
  const layer = LAYER[item.layer];
  const rel = relatedIds(id).filter((r) => M.has(r));
  $('#infoBody').innerHTML = `
    <div class="info-badges">
      <span class="badge" style="--c:${layer.color}"><i></i>${esc(KIND_LABEL[item.kind] ?? 'Estrutura')} · ${esc(layer.label)}</span>
      ${geomBadge(item)}
    </div>
    <h2>${esc(item.name)}</h2>
    <p class="latin">${esc(item.latin)}</p>
    ${item.campos.map(([k, v], i) => `<div class="field${i === 0 ? ' act' : ''}"><h3>${esc(k)}</h3><p>${esc(v)}</p></div>`).join('')}
    ${linksHtml(item)}
    ${item.nota ? `<div class="note"><b>Para lembrar</b>${esc(item.nota)}</div>` : ''}
    ${sourcesHtml(item)}
    ${item.expressao ? `<div class="expr"><span>Expressão / função:</span><strong>${esc(item.expressao)}</strong></div>` : ''}
    ${state.quiz ? '' : `<div class="info-actions">
      <button class="btn" id="btnIso">Isolar</button>
      ${rel.length ? `<button class="btn" id="btnIsoRel">${item.kind === 'nervo' ? 'Isolar com os músculos' : rel.length > 1 ? 'Isolar com os nervos' : 'Isolar com o nervo'}</button>` : ''}
      <button class="btn" id="btnHideThis">Ocultar</button>
    </div>`}`;
  if (!state.quiz) {
    // "isolar com…" mantém os ossos como referência de posição
    const isolate = (keep, keepBones = false) => {
      for (const m of M.values()) if (!keep.has(m.item.id) && !(keepBones && m.item.layer === 'osso')) state.hidden.add(m.item.id);
      for (const k of keep) {
        state.hidden.delete(k);
        const km = M.get(k);
        if (km) state.layers.add(km.item.layer);
      }
      syncLayers();
    };
    $('#btnIso').onclick = () => isolate(new Set([id]));
    if (rel.length) $('#btnIsoRel').onclick = () => isolate(new Set([id, ...rel]), true);
    $('#btnHideThis').onclick = () => { state.hidden.add(id); select(null, { fly: false }); applyVisibility(); syncList(); };
    $('#infoBody').querySelectorAll('button.lchip').forEach((b) => b.addEventListener('click', () => select(b.dataset.go)));
    studyController?.renderCardExtensions(id, $('#infoBody'));
  }
  infoEl.classList.add('open');
  document.body.classList.add('info-open');
  infoEl.scrollTop = 0;
}
function hideInfo() { infoEl.classList.remove('open'); document.body.classList.remove('info-open'); }
$('#infoClose').onclick = () => { if (state.quiz) hideInfo(); else select(null, { fly: false }); };

/* ───────────────────────── Lista lateral e camadas ───────────────────────── */
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const EYE_ON = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
const EYE_OFF = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10.5 7 10.5 7a17 17 0 0 1-3.2 3.9M6.4 6.5A17 17 0 0 0 1.5 12S5.5 19 12 19a9.6 9.6 0 0 0 4-.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const CHEV = '<svg viewBox="0 0 20 20" width="14" height="14"><path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const listEl = $('#list');
const rows = new Map();
const secs = new Map();

function buildList() {
  listEl.innerHTML = '';
  rows.clear();
  secs.clear();
  for (const layer of LAYERS) {
    const items = ITEMS.filter((i) => i.layer === layer.id);
    if (!items.length) continue;
    const sec = document.createElement('li');
    sec.className = 'sec';
    sec.style.setProperty('--c', layer.color);
    sec.innerHTML = `<div class="sec-head"><button class="sec-toggle" aria-label="Recolher ${esc(layer.label)}">${CHEV}</button><span class="dot"></span><span class="sec-name">${esc(layer.label)}</span><span class="sec-count"></span><button class="eye" aria-label="Mostrar ou ocultar a camada ${esc(layer.label)}"></button></div><ul class="sec-items"></ul>`;
    const ul = sec.querySelector('.sec-items');
    const toggle = () => {
      if (state.collapsed.has(layer.id)) state.collapsed.delete(layer.id); else state.collapsed.add(layer.id);
      syncList();
    };
    sec.querySelector('.sec-toggle').onclick = toggle;
    sec.querySelector('.sec-name').onclick = toggle;
    sec.querySelector('.eye').onclick = () => toggleLayer(layer.id);
    for (const item of items) {
      const li = document.createElement('li');
      li.className = 'item';
      li.tabIndex = 0;
      li.setAttribute('role', 'button');
      li.setAttribute('aria-label', `${item.name} (${item.latin})`);
      li.style.setProperty('--c', M.get(item.id).color.getStyle());
      li.innerHTML = `<span class="dot"></span><span class="txt"><span class="nm">${esc(item.name)}</span><span class="lt">${esc(item.latin)}</span></span><button class="eye" title="Mostrar/ocultar" aria-label="Mostrar ou ocultar ${esc(item.name)}"></button>`;
      li.addEventListener('click', (e) => {
        if (e.target.closest('.eye')) return;
        select(state.selected === item.id ? null : item.id);
        setList(false);
      });
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(state.selected === item.id ? null : item.id);
          setList(false);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const listItems = Array.from(listEl.querySelectorAll('.item:not([hidden])'));
          const idx = listItems.indexOf(li);
          if (idx >= 0 && listItems[idx + 1]) listItems[idx + 1].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const listItems = Array.from(listEl.querySelectorAll('.item:not([hidden])'));
          const idx = listItems.indexOf(li);
          if (idx > 0 && listItems[idx - 1]) listItems[idx - 1].focus();
        }
      });
      li.querySelector('.eye').addEventListener('click', () => {
        if (state.hidden.has(item.id)) state.hidden.delete(item.id); else state.hidden.add(item.id);
        if (state.selected === item.id && state.hidden.has(item.id)) select(null, { fly: false });
        applyVisibility(); syncList();
      });
      li.dataset.search = norm(`${item.name} ${item.latin} ${item.campos.map((c) => c[1]).join(' ')}`);
      ul.appendChild(li);
      rows.set(item.id, li);
    }
    listEl.appendChild(sec);
    secs.set(layer.id, sec);
  }
  const empty = document.createElement('li');
  empty.className = 'empty';
  empty.textContent = 'Nada encontrado.';
  empty.hidden = true;
  listEl.appendChild(empty);
  rows.set('__empty', empty);
}

function syncList() {
  const q = norm(state.search.trim());
  let total = 0;
  for (const layer of LAYERS) {
    const sec = secs.get(layer.id);
    if (!sec) continue;
    let n = 0;
    for (const item of ITEMS.filter((i) => i.layer === layer.id)) {
      const li = rows.get(item.id);
      const match = (!q || li.dataset.search.includes(q)) && regionOk(item);
      li.hidden = !match;
      if (match) n++;
      li.classList.toggle('active', state.selected === item.id);
      li.classList.toggle('fav', userData.isFavorite(item.id));
      const off = state.hidden.has(item.id) || !state.layers.has(layer.id);
      li.classList.toggle('off', off);
      li.querySelector('.eye').innerHTML = state.hidden.has(item.id) ? EYE_OFF : EYE_ON;
    }
    total += n;
    sec.hidden = n === 0;
    sec.classList.toggle('collapsed', state.collapsed.has(layer.id) && !q);
    sec.classList.toggle('off', !state.layers.has(layer.id));
    sec.querySelector('.sec-count').textContent = n;
    sec.querySelector('.sec-head .eye').innerHTML = state.layers.has(layer.id) ? EYE_ON : EYE_OFF;
  }
  rows.get('__empty').hidden = total > 0;
  $('#count').textContent = `${total} estruturas`;
  const act = listEl.querySelector('.item.active');
  if (act && !state.quiz && !act.closest('.sec.collapsed')) act.scrollIntoView({ block: 'nearest' });
}

function toggleLayer(id) {
  if (state.layers.has(id)) state.layers.delete(id); else state.layers.add(id);
  const sel = state.selected && M.get(state.selected);
  if (sel && !state.layers.has(sel.item.layer)) select(null, { fly: false });
  syncLayers();
}

function renderChips() {
  const el = $('#chips');
  el.innerHTML = '';
  for (const l of LAYERS) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.dataset.layer = l.id;
    b.style.setProperty('--c', l.color);
    b.innerHTML = `<i></i>${esc(l.label)}`;
    b.onclick = () => toggleLayer(l.id);
    el.appendChild(b);
  }
}

function syncLayers() {
  document.querySelectorAll('#chips .chip').forEach((b) => b.setAttribute('aria-pressed', String(state.layers.has(b.dataset.layer))));
  applyVisibility();
  syncList();
}

const DISSECT_NAMES = ['Pele opaca', 'Pele translúcida', 'Fáscias e aponeuroses', 'Músculos superficiais', 'Mastigação e planos profundos', 'Estruturas profundas', 'Somente ossos'];

function setSkin(v) {
  state.skin = v;
  $('#optSkin').value = Math.round(v * 100);
  $('#skinVal').textContent = `${Math.round(v * 100)}%`;
}

function setDissect(v) {
  state.dissect = v;
  state.layers = new Set(layersForDissect(v));
  if (v === 0) setSkin(1);
  else if (v === 1) setSkin(0.14);
  $('#dissect').value = v;
  $('#dissectVal').textContent = DISSECT_NAMES[v] ?? '';
  const sel = state.selected && M.get(state.selected);
  if (sel && !state.layers.has(sel.item.layer)) select(null, { fly: false });
  syncLayers();
}

$('#search').addEventListener('input', (e) => { state.search = e.target.value; syncList(); });
$('#showAll').onclick = () => { state.hidden.clear(); state.layers = new Set(LAYERS.map((l) => l.id)); syncLayers(); };
$('#hideAll').onclick = () => { state.layers.clear(); select(null, { fly: false }); syncLayers(); };
/** Abre/fecha a gaveta lateral (celular e tablet em pé). */
function setList(open) {
  document.body.classList.toggle('list-open', open);
  $('#openList').setAttribute('aria-expanded', String(open));
}
$('#openList').onclick = () => setList(!document.body.classList.contains('list-open'));
$('#closeList').onclick = () => setList(false);
// tocar no fundo escurecido (que é o próprio palco) ou arrastar a gaveta para a esquerda também fecha
stage.addEventListener('click', (e) => { if (e.target === stage && document.body.classList.contains('list-open')) setList(false); });
{
  let x0 = null, y0 = 0;
  const side = $('#sidebar');
  side.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  side.addEventListener('touchend', (e) => {
    // só um arrasto francamente horizontal fecha: rolar a lista na diagonal não pode fechar a gaveta
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (x0 !== null && dx < -70 && Math.abs(dx) > 1.5 * Math.abs(dy)) setList(false);
    x0 = null;
  }, { passive: true });
}

/* ───────────────────────── Controles do palco ───────────────────────── */
$('#optLabels').addEventListener('change', (e) => { state.labels = e.target.checked; });
$('#optSkin').addEventListener('input', (e) => {
  setSkin(e.target.value / 100);
  applyVisibility();
});
$('#dissect').addEventListener('input', (e) => setDissect(Number(e.target.value)));
document.querySelectorAll('.toolbar button[data-view]').forEach((b) => b.addEventListener('click', () => viewPreset(b.dataset.view)));
// no quiz de localizar a região fica fixa (a lista de perguntas foi sorteada nela)
document.querySelectorAll('.toolbar button[data-region]').forEach((b) => b.addEventListener('click', () => {
  if (state.quiz?.mode !== 'locate') setRegion(b.dataset.region);
}));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && studyController?.handleEscape()) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
  if (e.key === 'Escape') {
    if (!setupEl.hidden) { closeSetup(); return; }
    if (state.quiz) { stopQuiz(); return; }
    setList(false);
    if (!state.quiz) select(null, { fly: false });
    return;
  }
  if (state.quiz) {
    if (state.quiz.mode === 'choice' || state.quiz.mode === 'text') {
      const q = state.quiz;
      const text = q.mode === 'text';
      if (['1', '2', '3', '4'].includes(e.key) && !q.answered && !q.finished) {
        const btn = $(text ? '#tqOptions' : '#quizOptions')?.querySelectorAll('button')?.[parseInt(e.key, 10) - 1];
        if (btn) btn.click();
      } else if (e.key === 'Enter' && q.answered) {
        const nextBtn = $(text ? '#tqNext' : '#quizNext');
        if (nextBtn) nextBtn.click();
      }
    } else if (state.quiz.mode === 'locate') {
      if (e.key === 'd' || e.key === 'D') {
        const b = $('#locHint');
        if (b && !b.disabled && !b.hidden) b.click();
      } else if (e.key === 'p' || e.key === 'P') {
        const b = $('#locSkip');
        if (b && !b.disabled && !b.hidden) b.click();
      } else if (e.key === 'r' || e.key === 'R') {
        const b = $('#locPeel');
        if (b && !b.disabled && !b.hidden) b.click();
      }
    }
  }
});

/* ───────────────────────── Picking ───────────────────────── */
const raycaster = new THREE.Raycaster();
raycaster.firstHitOnly = true;
const ndc = new THREE.Vector2();
const tooltip = $('#tooltip');
let down = null;

function pick(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  // no quiz de localizar, pele translúcida e fáscias são "transparentes" ao clique
  const loc = state.quiz?.mode === 'locate';
  const targets = [];
  for (const m of M.values()) {
    if (!m.group.visible) continue;
    if (isSkin(m) && state.skin < (loc ? 0.9 : 0.5)) continue;
    if (loc && m.item.kind === 'fascia') continue;
    targets.push(...(m.pick ?? m.meshes)); // nervos finos têm uma malha de clique mais grossa e invisível
  }
  const clip = studyController?.clipping;
  if (clip?.active) {
    // com corte ativo, o primeiro acerto de cada malha pode estar na parte cortada: pede todos e descarta os invisíveis
    raycaster.firstHitOnly = false;
    const hits = raycaster.intersectObjects(targets, false).filter((h) => !clip.isClipped(h.point));
    raycaster.firstHitOnly = true;
    return hits[0] ? hits[0].object.userData.id : null;
  }
  const hit = raycaster.intersectObjects(targets, false)[0];
  return hit ? hit.object.userData.id : null;
}

canvas.addEventListener('pointermove', (ev) => {
  if (ev.buttons) { tooltip.hidden = true; return; }
  const id = pick(ev);
  if (id !== state.hover) { state.hover = id; applyHighlight(); }
  canvas.style.cursor = id ? (state.quiz?.peel ? 'crosshair' : 'pointer') : 'grab';
  if (id && !state.quiz) {
    const { item } = M.get(id);
    const r = stage.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.innerHTML = `${esc(item.name)}<em>${esc(item.latin)}</em>`;
    tooltip.style.left = `${ev.clientX - r.left}px`;
    tooltip.style.top = `${ev.clientY - r.top}px`;
  } else tooltip.hidden = true;
});
canvas.addEventListener('pointerleave', () => { tooltip.hidden = true; if (state.hover) { state.hover = null; applyHighlight(); } });
canvas.addEventListener('pointerdown', (ev) => { down = { x: ev.clientX, y: ev.clientY }; });
canvas.addEventListener('pointerup', (ev) => {
  if (!down) return;
  const moved = Math.hypot(ev.clientX - down.x, ev.clientY - down.y);
  down = null;
  if (moved > 5) return;
  const q = state.quiz;
  if (q) {
    if (q.mode === 'locate' && !q.finished) locateClick(ev);
    return;
  }
  const id = pick(ev);
  if (id) select(id); else if (state.selected) select(null, { fly: false });
});

/* ───────────────────────── Rótulos 3D ───────────────────────── */
const labelsEl = $('#labels');
const linesEl = $('#lines');
const lblEls = new Map();
const _v = new THREE.Vector3();
const _c = new THREE.Vector3();

function getLabel(id) {
  let el = lblEls.get(id);
  if (!el) {
    const { item, color } = M.get(id);
    el = document.createElement('div');
    el.className = 'lbl';
    el.style.setProperty('--c', color.getStyle());
    el.innerHTML = `<i></i>${esc(item.name)}`;
    el.addEventListener('click', () => select(state.selected === id ? null : id));
    labelsEl.appendChild(el);
    lblEls.set(id, el);
  }
  return el;
}

function labelIds() {
  if (state.quiz) return [];
  if (!state.labels) return state.selected ? [state.selected] : [];
  const vis = [...M.values()].filter((m) => m.group.visible && m.item.label !== false && m.item.id !== 'pele');
  if (!vis.length) return [];
  const d0 = Math.min(...vis.map((m) => LAYER[m.item.layer].depth));
  const ids = vis.filter((m) => LAYER[m.item.layer].depth <= d0 + (d0 >= 5 ? 0 : 1)).map((m) => m.item.id);
  if (state.selected && !ids.includes(state.selected)) ids.push(state.selected);
  return ids;
}

const MAX_LABELS = 34;

function updateLabels(W, H) {
  const items = [];
  for (const id of labelIds()) {
    const m = M.get(id);
    let best = null;
    let bestDot = -2;
    for (const a of m.anchors) {
      _v.copy(camera.position).sub(a.pos).normalize();
      const d = a.normal.dot(_v);
      if (d > bestDot) { bestDot = d; best = a; }
    }
    if (!best) continue;
    if (bestDot < 0.1 && id !== state.selected) continue;
    _v.copy(best.pos).project(camera);
    items.push({ id, dot: bestDot, x: (_v.x * 0.5 + 0.5) * W, y: (-_v.y * 0.5 + 0.5) * H });
  }
  if (items.length > MAX_LABELS) {
    items.sort((a, b) => (b.id === state.selected) - (a.id === state.selected) || b.dot - a.dot);
    items.length = MAX_LABELS;
  }
  _c.set(0, -0.3, 0).project(camera);
  const cx = (_c.x * 0.5 + 0.5) * W;
  let half = 0;
  for (const p of [[0.85, -0.3, 0], [0, -0.3, 1.1], [0, -0.3, -1.1]]) {
    _v.set(...p).project(camera);
    half = Math.max(half, Math.abs((_v.x * 0.5 + 0.5) * W - cx));
  }
  const gap = Math.max(half * 1.18, 90);
  const colL = Math.max(cx - gap, 150);
  const colR = Math.min(cx + gap, W - 160);
  const left = items.filter((i) => i.x < cx).sort((a, b) => a.y - b.y);
  const right = items.filter((i) => i.x >= cx).sort((a, b) => a.y - b.y);
  const place = (arr) => {
    let prev = 24;
    for (const it of arr) { it.ly = Math.max(it.y, prev); prev = it.ly + 25; }
    const over = prev - 25 - (H - 24);
    if (over > 0) for (const it of arr) it.ly -= over;
  };
  place(left); place(right);
  const used = new Set();
  let svg = '';
  const draw = (arr, isLeft) => {
    for (const it of arr) {
      const el = getLabel(it.id);
      used.add(it.id);
      el.style.display = '';
      el.classList.toggle('sel', it.id === state.selected);
      const w = el.offsetWidth;
      const x = isLeft ? colL - w : colR;
      el.style.transform = `translate(${x}px, ${it.ly - 11}px)`;
      const ex = isLeft ? colL + 4 : colR - 4;
      const mid = isLeft ? ex + 18 : ex - 18;
      const cls = it.id === state.selected ? 'sel' : '';
      svg += `<path class="${cls}" d="M${it.x.toFixed(1)} ${it.y.toFixed(1)} L${mid.toFixed(1)} ${it.ly.toFixed(1)} L${ex.toFixed(1)} ${it.ly.toFixed(1)}"/><circle class="${cls}" cx="${it.x.toFixed(1)}" cy="${it.y.toFixed(1)}" r="3"/>`;
    }
  };
  draw(left, true); draw(right, false);
  for (const [id, el] of lblEls) if (!used.has(id)) el.style.display = 'none';
  linesEl.innerHTML = svg;
}

/* ───────────────────────── Quiz ───────────────────────── */
const quizEl = $('#quiz');
const locEl = $('#locate');
const setupEl = $('#quizSetup');
const resultEl = $('#quizResult');
const btnQuiz = $('#btnQuiz');
/** Estado da tela antes do quiz; é restaurado ao sair. */
let baseline = null;
let tick = null;

const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const firstSentence = (item) => (item.campos[0]?.[1] ?? '').split('.')[0];
const fmtPts = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const fmtTime = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

function enterQuiz(quiz) {
  if (!baseline) {
    baseline = { dissect: state.dissect, skin: state.skin, layers: new Set(state.layers), hidden: new Set(state.hidden), region: state.region };
  }
  state.quiz = quiz;
  state.flash.clear();
  state.hidden.clear();
  setColorOverrides(null); // cores temáticas atrapalhariam o quiz (e a legenda some); voltam ao sair
  document.body.classList.remove('quiz-choice', 'quiz-locate', 'quiz-text');
  document.body.classList.add('quiz-on', `quiz-${quiz.mode}`);
  btnQuiz.classList.add('on');
  btnQuiz.textContent = 'Sair do quiz';
  hideInfo();
}

/** Grava a rodada atual (uma vez só) no histórico de progresso. */
function recordSession() {
  const q = state.quiz;
  if (!q || q.recorded) return;
  let rec = null;
  if (q.mode === 'choice') rec = { mode: 'choice', region: state.region, score: q.score, total: q.total };
  else if (q.mode === 'text') rec = { mode: 'text', region: q.setup.region, smart: q.setup.smart, score: q.score, total: q.total, ms: performance.now() - q.t0 };
  else if (q.mode === 'locate') rec = { mode: 'locate', region: q.opts.region, smart: q.opts.smart, score: q.results.reduce((s, r) => s + r.pts, 0), total: q.results.length, ms: q.time };
  if (rec && rec.total) { q.recorded = true; userData.recordSession(rec); }
}

function stopQuiz() {
  recordSession();
  clearInterval(tick);
  tick = null;
  state.quiz = null;
  state.flash.clear();
  document.body.classList.remove('quiz-on', 'quiz-choice', 'quiz-locate', 'quiz-text');
  btnQuiz.classList.remove('on');
  btnQuiz.textContent = 'Modo quiz';
  quizEl.hidden = true;
  locEl.hidden = true;
  resultEl.hidden = true;
  studyController?.textQuiz.onQuizStopped();
  if (baseline) {
    const b = baseline;
    baseline = null;
    state.dissect = b.dissect;
    $('#dissect').value = b.dissect;
    $('#dissectVal').textContent = DISSECT_NAMES[b.dissect] ?? '';
    setSkin(b.skin);
    state.layers = b.layers;
    state.hidden = b.hidden;
    setRegion(b.region, { fly: false });
  }
  select(null, { fly: false });
  syncLayers();
  viewPreset('three');
  studyController?.coloring.apply();
  studyController?.onViewChanged();
}

/** Todas as camadas menos a pele: o que o quiz de escolha e o teórico mostram. */
function showAllLayersForQuiz() {
  state.layers = new Set(LAYERS.filter((l) => l.id !== 'pele').map((l) => l.id));
  syncLayers();
}

/* ── Quiz 1: múltipla escolha (a estrutura aparece destacada) ── */
/** Estruturas da região em foco que o quiz de escolha pode perguntar (respeita o filtro inteligente). */
function choicePool(smart = 'all') {
  const allow = studyController?.smartSet(smart);
  return ITEMS.filter((i) => i.id !== 'pele' && i.kind !== 'fascia' && regionOk(i) && (!allow || allow.has(i.id))).map((i) => i.id);
}
function startChoice(smart = 'all') {
  const targets = choicePool(smart);
  if (!targets.length) return false;
  enterQuiz({ mode: 'choice', score: 0, total: 0, answered: false, current: null, smart, queue: shuffle(targets), recorded: false });
  locEl.hidden = true;
  resultEl.hidden = true;
  quizEl.hidden = false;
  showAllLayersForQuiz();
  nextQuestion();
  return true;
}
function nextQuestion() {
  const q = state.quiz;
  const pool = ITEMS.filter((i) => i.id !== 'pele' && i.kind !== 'fascia' && regionOk(i)).map((i) => i.id);
  // a fila pode ter ficado velha se a pessoa trocou de região no meio do quiz
  const targets = new Set(choicePool(q.smart));
  if (!targets.size) { studyController?.toast('Nenhuma estrutura do filtro escolhido nesta região.'); stopQuiz(); return; }
  q.queue = q.queue.filter((x) => targets.has(x));
  if (!q.queue.length) q.queue = shuffle([...targets]); // acabaram as estruturas: embaralha de novo
  const id = q.queue.shift();
  q.current = id;
  q.answered = false;
  const kind = M.get(id).item.kind;
  const same = pool.filter((p) => p !== id && M.get(p).item.kind === kind);
  const options = shuffle([id, ...shuffle(same).slice(0, 3)]);
  $('#quizOptions').innerHTML = options.map((o, idx) => `<button data-id="${o}"><span class="kbadge" aria-hidden="true">${idx + 1}</span>${esc(M.get(o).item.name)}</button>`).join('');
  $('#quizFeedback').innerHTML = '';
  $('#quizScore').textContent = `${q.score}/${q.total}`;
  select(id, { fly: true, panel: false });
  $('#quizOptions').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => answer(b.dataset.id)));
}
function answer(chosen) {
  const q = state.quiz;
  if (!q || q.answered) return;
  q.answered = true;
  q.total++;
  const ok = chosen === q.current;
  if (ok) q.score++;
  userData.recordQuizResult(q.current, ok ? 5 : 1);
  $('#quizOptions').querySelectorAll('button').forEach((b) => {
    b.disabled = true;
    if (b.dataset.id === q.current) b.classList.add('right');
    else if (b.dataset.id === chosen) b.classList.add('wrong');
  });
  $('#quizScore').textContent = `${q.score}/${q.total}`;
  const { item } = M.get(q.current);
  $('#quizFeedback').innerHTML = `<span>${ok ? '✔ Correto!' : '✘ Era'} <b>${esc(item.name)}</b> — ${esc(firstSentence(item))}.</span><button class="primary" id="quizNext">Próxima</button>`;
  $('#quizNext').onclick = nextQuestion;
  $('#quizNext').focus();
}
$('#quizExit').onclick = stopQuiz;

/* ── Quiz 2: localizar (aparece o nome; clique na estrutura no modelo) ── */
const MAX_TRIES = 3;
const kindGroup = (i) => (i.kind === 'musculo' || i.kind === 'osso' || i.kind === 'nervo' ? i.kind : 'outras');

/** Estruturas que podem virar pergunta. Fáscias e ligamentos minúsculos (`label: false`) são ruins de clicar. */
function locatePool({ region, kinds, smart = 'all' }) {
  let pool = ITEMS.filter((i) => i.id !== 'pele' && i.kind !== 'fascia' && i.label !== false
    && (region === 'todos' || (i.region !== 'todos' && inRegion(i, region))) && kinds.includes(kindGroup(i)));
  const allow = studyController?.smartSet(smart);
  if (allow) pool = pool.filter((i) => allow.has(i.id));
  return pool;
}

function startLocate(opts, only = null) {
  const pool = only ?? locatePool(opts).map((i) => i.id);
  if (!pool.length) return;
  const ids = shuffle(pool).slice(0, only || !opts.count ? pool.length : opts.count);
  closeSetup();
  resultEl.hidden = true;
  quizEl.hidden = true;
  enterQuiz({ mode: 'locate', opts, ids, idx: -1, results: [], time: 0, peel: false, cur: null, finished: false });
  setRegion(opts.region, { fly: false });
  // começa sem as camadas mais superficiais que não têm nenhuma pergunta
  const top = Math.min(...ids.map((id) => LAYER[M.get(id).item.layer].depth));
  setDissect(Math.min(6, Math.max(3, top + 1)));
  viewPreset('three');
  locEl.hidden = false;
  clearInterval(tick);
  tick = setInterval(renderLocStats, 250);
  nextLocate();
}

function nextLocate() {
  const q = state.quiz;
  if (q.idx + 1 >= q.ids.length) { finishLocate(); return; }
  q.idx++;
  q.peel = false;
  q.cur = { id: q.ids[q.idx], tries: 0, hint: 0, hints: [], done: false, wrong: new Set(), t0: performance.now() };
  state.flash.clear();
  state.hidden.clear();
  state.hover = null;
  select(null, { fly: false });
  applyVisibility();
  renderLoc();
}

function renderLoc() {
  const q = state.quiz;
  const c = q.cur;
  const { item } = M.get(c.id);
  $('#locName').textContent = item.name;
  $('#locLatin').textContent = item.latin;
  $('#locLatin').hidden = !q.opts.latin;
  $('#locKind').textContent = KIND_LABEL[item.kind] ?? 'Estrutura';
  $('#locPeel').setAttribute('aria-pressed', 'false');
  $('#locRestore').hidden = true;
  $('#locFeedback').innerHTML = '';
  $('#locProg').style.width = `${(q.idx / q.ids.length) * 100}%`;
  locEl.classList.remove('is-done');
  renderTries();
  renderHints();
  renderLocStats();
}

function renderTries() {
  const left = MAX_TRIES - state.quiz.cur.tries;
  $('#locTries').innerHTML = Array.from({ length: MAX_TRIES }, (_, i) => `<i class="${i < left ? '' : 'off'}"></i>`).join('');
  $('#locTries').title = `${left} tentativa${left === 1 ? '' : 's'} restante${left === 1 ? '' : 's'}`;
}

function renderHints() {
  const c = state.quiz.cur;
  $('#locHintText').hidden = !c.hints.length;
  $('#locHintText').innerHTML = c.hints.join('<br>');
  $('#locHint').textContent = c.hint === 0 ? 'Dica' : c.hint === 1 ? 'Outra dica' : 'Sem mais dicas';
  $('#locHint').disabled = c.hint >= 2;
}

function renderLocStats() {
  const q = state.quiz;
  if (!q || q.mode !== 'locate' || !q.cur) return;
  const pts = q.results.reduce((s, r) => s + r.pts, 0);
  const live = q.cur.done ? 0 : performance.now() - q.cur.t0;
  $('#locCount').textContent = `${Math.min(q.idx + 1, q.ids.length)}/${q.ids.length}`;
  $('#locScore').textContent = `${fmtPts(pts)} pts`;
  $('#locTime').textContent = fmtTime(q.time + live);
}

const setFeedback = (html) => { $('#locFeedback').innerHTML = html; };
function shake() {
  locEl.classList.remove('shake');
  void locEl.offsetWidth;
  locEl.classList.add('shake');
}
function flashBad(id) {
  state.flash.set(id, 'bad');
  applyHighlight();
  setTimeout(() => {
    if (state.flash.get(id) === 'bad') { state.flash.delete(id); applyHighlight(); }
  }, 850);
}

function doneButtons() {
  const q = state.quiz;
  const last = q.idx + 1 >= q.ids.length;
  return `<div class="loc-next"><button class="btn" id="locSheet">Ver ficha</button><button class="primary" id="locNext">${last ? 'Ver resultado' : 'Próxima'}</button></div>`;
}
function bindDone() {
  $('#locSheet').onclick = () => showInfo(state.quiz.cur.id);
  $('#locNext').onclick = nextLocate;
  $('#locNext').focus({ preventScroll: true });
}

/** Fecha a pergunta atual com `pts` pontos. */
function endQuestion(pts) {
  const q = state.quiz;
  const c = q.cur;
  c.done = true;
  const ms = performance.now() - c.t0;
  q.time += ms;
  q.results.push({ id: c.id, pts, tries: c.tries, hint: c.hint, ms });
  locEl.classList.add('is-done');
  $('#locProg').style.width = `${((q.idx + 1) / q.ids.length) * 100}%`;
  renderTries();
  renderLocStats();
}

function locateCorrect() {
  const c = state.quiz.cur;
  const assisted = c.tries > 0 || c.hint > 0;
  const pts = assisted ? 0.5 : 1;
  endQuestion(pts);
  userData.recordQuizResult(c.id, assisted ? 3 : 5);
  state.flash.set(c.id, 'ok');
  applyHighlight();
  const { item } = M.get(c.id);
  setFeedback(`<p class="ok">✔ ${assisted ? `Correto, com ajuda (+${fmtPts(pts)})` : 'Correto!'}</p><p><b>${esc(item.name)}</b> — ${esc(firstSentence(item))}.</p>${doneButtons()}`);
  bindDone();
}

function locateFail(skipped, clicked = null) {
  const c = state.quiz.cur;
  endQuestion(0);
  userData.recordQuizResult(c.id, 1);
  state.flash.clear();
  select(c.id, { fly: true, panel: false });
  const { item } = M.get(c.id);
  const lead = skipped ? 'Pulada.' : `✘ Isso é <b>${esc(M.get(clicked).item.name)}</b>.`;
  setFeedback(`<p class="bad">${lead} A resposta era <b>${esc(item.name)}</b>.</p><p>${esc(firstSentence(item))}.</p>${doneButtons()}`);
  bindDone();
}

function peelItem(id) {
  if (!id || id === 'pele') return;
  state.hidden.add(id);
  state.hover = null;
  applyVisibility();
  $('#locRestore').hidden = false;
}

function locateClick(ev) {
  const q = state.quiz;
  const c = q.cur;
  if (!c || c.done) return;
  const id = pick(ev);
  // botão direito (ou modo "remover"): tira do caminho em vez de responder
  if (ev.button === 2 || q.peel) { peelItem(id); return; }
  if (ev.button !== 0 || !id) return;
  if (id === 'pele') {
    setFeedback('<p>Isso é a pele. Use o controle de <b>dissecação</b> para ver o que há por baixo.</p>');
    return;
  }
  if (id === c.id) { locateCorrect(); return; }
  if (c.wrong.has(id)) { flashBad(id); return; } // a mesma estrutura de novo não gasta tentativa
  c.wrong.add(id);
  c.tries++;
  flashBad(id);
  shake();
  if (c.tries >= MAX_TRIES) { locateFail(false, id); return; }
  renderTries();
  setFeedback(`<p class="bad">✘ Isso é <b>${esc(M.get(id).item.name)}</b>. Tente de novo.</p>`);
}

function locateHint() {
  const c = state.quiz?.cur;
  if (!c || c.done || c.hint >= 2) return;
  c.hint++;
  const { item } = M.get(c.id);
  state.hidden.delete(c.id);
  if (c.hint === 1) {
    setDissect(Math.min(6, LAYER[item.layer].depth + 1));
    c.hints.push(`<b>Dica 1:</b> está em “${esc(LAYER[item.layer].label)}”. Deixei visíveis só essa camada e as mais profundas.`);
  } else {
    focusItem(c.id, true);
    c.hints.push('<b>Dica 2:</b> girei o modelo para o lado em que ela aparece.');
  }
  renderHints();
}

function finishLocate() {
  const q = state.quiz;
  q.finished = true;
  recordSession();
  clearInterval(tick);
  tick = null;
  state.flash.clear();
  state.hidden.clear();
  applyVisibility();
  select(null, { fly: false });
  locEl.hidden = true;
  renderResult();
  resultEl.hidden = false;
  $('#qrAgain').focus();
}

function renderResult() {
  const q = state.quiz;
  const r = q.results;
  const n = r.length;
  const pts = r.reduce((s, x) => s + x.pts, 0);
  const pct = Math.round((pts / n) * 100);
  $('#qrTitle').textContent = pct >= 90 ? 'Excelente!' : pct >= 70 ? 'Muito bom!' : pct >= 50 ? 'Bom caminho' : 'Vale revisar';
  $('#qrPts').textContent = fmtPts(pts);
  $('#qrOf').textContent = `de ${n} · ${pct}%`;
  $('#qrFirst').textContent = r.filter((x) => x.pts === 1).length;
  $('#qrHelped').textContent = r.filter((x) => x.pts === 0.5).length;
  $('#qrMissed').textContent = r.filter((x) => x.pts === 0).length;
  $('#qrTime').textContent = fmtTime(q.time);
  $('#qrAvg').textContent = `média ${fmtTime(q.time / n)} por pergunta`;
  const weak = r.filter((x) => x.pts < 1);
  $('#qrWeakBox').hidden = !weak.length;
  $('#qrWeak').hidden = !weak.length;
  $('#qrList').innerHTML = weak.map((x) => {
    const { item } = M.get(x.id);
    return `<li><span class="nm">${esc(item.name)}<small>${esc(item.latin)}</small></span><span class="tag ${x.pts ? 'half' : 'miss'}">${x.pts ? 'com ajuda' : 'errou'}</span></li>`;
  }).join('');
}
$('#qrWeak').onclick = () => startLocate(state.quiz.opts, state.quiz.results.filter((x) => x.pts < 1).map((x) => x.id));
$('#qrAgain').onclick = () => startLocate(state.quiz.opts);
$('#qrExit').onclick = stopQuiz;

$('#locExit').onclick = stopQuiz;
$('#locHint').onclick = locateHint;
$('#locSkip').onclick = () => { if (state.quiz?.cur && !state.quiz.cur.done) locateFail(true); };
$('#locPeel').onclick = () => {
  const q = state.quiz;
  q.peel = !q.peel;
  $('#locPeel').setAttribute('aria-pressed', String(q.peel));
  setFeedback(q.peel ? '<p>Modo remover: clique nas estruturas que estão no caminho para ocultá-las.</p>' : '');
};
$('#locRestore').onclick = () => {
  state.hidden.clear();
  applyVisibility();
  $('#locRestore').hidden = true;
};

/* ── Configuração ── */
const SETUP_KEY = 'anatomia3d.quiz';
const REGION_SHORT = { todos: 'Corpo', cabeca: 'Cabeça', tronco: 'Tronco', membro_sup: 'Braço' };
const KIND_GROUPS = [['musculo', 'Músculos'], ['nervo', 'Nervos'], ['osso', 'Ossos'], ['outras', 'Ligamentos e outras']];
const COUNT_OPTS = [10, 20, 30, 0]; // 0 = todas
const setup = { mode: 'locate', region: 'cabeca', kinds: KIND_GROUPS.map((k) => k[0]), count: 10, latin: false, smart: 'all' };
try {
  const s = JSON.parse(localStorage.getItem(SETUP_KEY) ?? '{}');
  if (s.mode === 'locate' || s.mode === 'choice' || s.mode === 'text') setup.mode = s.mode;
  if (Array.isArray(s.kinds)) {
    const k = s.kinds.filter((x) => KIND_GROUPS.some((g) => g[0] === x));
    if (k.length) setup.kinds = k;
  }
  if (COUNT_OPTS.includes(s.count)) setup.count = s.count;
  setup.latin = !!s.latin;
  if (typeof s.smart === 'string' && /^(all|fav|due|weak|new|list:.+)$/.test(s.smart)) setup.smart = s.smart;
} catch { /* sem armazenamento: usa o padrão */ }

const SMART_OPTS = [['all', 'Todas'], ['fav', '⭐ Favoritas'], ['due', '🔁 Revisão de hoje'], ['weak', '🎯 Pontos fracos'], ['new', '🆕 Ainda não estudadas']];

function fillButtons(sel, entries) {
  $(sel).innerHTML = entries.map(([v, label]) => `<button type="button" data-v="${v}">${label}</button>`).join('');
}
fillButtons('#qsRegion', Object.entries(REGION_SHORT));
fillButtons('#qsKinds', KIND_GROUPS.map(([k, label]) => [k, `${label} <small></small>`]));
fillButtons('#qsCount', COUNT_OPTS.map((n) => [n, n || 'Todas']));
$('#qsSmartSeg').innerHTML = SMART_OPTS.map(([v, label]) => `<button type="button" data-smart="${v}">${label} <small></small></button>`).join('');

/** Quantas estruturas o quiz do tipo `mode` teria com as opções `o`. */
function poolSize(mode, o) {
  if (mode === 'choice') return choicePool(o.smart).length;
  if (mode === 'text') return studyController ? studyController.textQuiz.poolFor(o).length : 0;
  return locatePool(o).length;
}

function renderSetup() {
  const mode = setup.mode;
  document.querySelectorAll('#qsModes .mode-card').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)));
  $('#qsKindsBox').hidden = mode === 'choice';
  $('#qsCountBox').hidden = mode === 'choice';
  $('#qsLatinRow').hidden = mode !== 'locate';
  $('#qsTipLocate').hidden = mode !== 'locate';
  $('#qsTipText').hidden = mode !== 'text';
  $('#qsTipChoice').hidden = mode !== 'choice';

  if (!state.bodyReady && setup.region !== 'cabeca') setup.region = 'cabeca';
  if (setup.smart.startsWith('list:') && !userData.getList(setup.smart.slice(5))) setup.smart = 'all';
  $('#qsRegion').querySelectorAll('button').forEach((b) => {
    b.disabled = b.dataset.v !== 'cabeca' && !state.bodyReady;
    b.setAttribute('aria-pressed', String(b.dataset.v === setup.region));
  });
  $('#qsKinds').querySelectorAll('button').forEach((b) => {
    const k = b.dataset.v;
    const usable = mode !== 'text' || k === 'musculo' || k === 'nervo'; // o quiz teórico só tem texto de músculos e nervos
    const n = usable ? poolSize(mode, { ...setup, kinds: [k] }) : 0;
    b.disabled = !n;
    b.querySelector('small').textContent = usable ? n : '—';
    b.setAttribute('aria-pressed', String(n > 0 && setup.kinds.includes(k)));
  });
  $('#qsCount').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.v) === setup.count)));
  $('#qsLatin').checked = setup.latin;

  $('#qsSmartSeg').querySelectorAll('button').forEach((b) => {
    const n = poolSize(mode, { ...setup, smart: b.dataset.smart });
    b.querySelector('small').textContent = n;
    b.disabled = b.dataset.smart !== 'all' && !n;
    b.setAttribute('aria-pressed', String(b.dataset.smart === setup.smart));
  });
  const sel = $('#qsListSel');
  const lists = userData.getCustomLists();
  sel.hidden = !lists.length;
  sel.innerHTML = '<option value="">Minhas listas…</option>' + lists.map((l) => `<option value="list:${esc(l.id)}">${esc(l.name)} (${poolSize(mode, { ...setup, smart: `list:${l.id}` })})</option>`).join('');
  sel.value = setup.smart.startsWith('list:') ? setup.smart : '';

  const pool = poolSize(mode, setup);
  const n = setup.count ? Math.min(setup.count, pool) : pool;
  if (!pool) $('#qsInfo').textContent = 'Nenhuma estrutura com esses filtros.';
  else if (mode === 'choice') $('#qsInfo').textContent = `${pool} estruturas possíveis · perguntas sem fim`;
  else $('#qsInfo').textContent = `${n} pergunta${n === 1 ? '' : 's'} · ${pool} estruturas possíveis`;
  $('#qsStart').disabled = !pool;
}

/** @param {{ smart?: string }} [preset] filtro já escolhido (vem dos painéis de progresso e de listas) */
function openSetup(preset) {
  setup.region = state.region;
  if (preset?.smart) {
    setup.smart = preset.smart;
    // se nada da região em foco entra no filtro (ex.: ponto fraco no tronco), amplia para o corpo todo
    if (!poolSize(setup.mode, setup) && state.bodyReady) setup.region = 'todos';
  }
  renderSetup();
  setupEl.hidden = false;
  $('#qsStart').focus();
}
function closeSetup() { setupEl.hidden = true; }

$('#qsModes').addEventListener('click', (e) => {
  const b = e.target.closest('.mode-card');
  if (b) { setup.mode = b.dataset.mode; renderSetup(); }
});
$('#qsRegion').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b && !b.disabled) { setup.region = b.dataset.v; renderSetup(); }
});
$('#qsKinds').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b || b.disabled) return;
  const k = b.dataset.v;
  setup.kinds = setup.kinds.includes(k) ? setup.kinds.filter((x) => x !== k) : [...setup.kinds, k];
  renderSetup();
});
$('#qsSmartSeg').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b && !b.disabled) { setup.smart = b.dataset.smart; renderSetup(); }
});
$('#qsListSel').addEventListener('change', (e) => {
  setup.smart = e.target.value || 'all';
  renderSetup();
});
$('#qsCount').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (b) { setup.count = Number(b.dataset.v); renderSetup(); }
});
$('#qsLatin').addEventListener('change', (e) => { setup.latin = e.target.checked; });
$('#qsClose').onclick = closeSetup;
setupEl.addEventListener('click', (e) => { if (e.target === setupEl) closeSetup(); });
$('#qsStart').onclick = () => {
  try { localStorage.setItem(SETUP_KEY, JSON.stringify({ mode: setup.mode, kinds: setup.kinds, count: setup.count, latin: setup.latin, smart: setup.smart })); } catch { /* ignora */ }
  closeSetup();
  if (setup.mode === 'choice') {
    setRegion(setup.region, { fly: false });
    startChoice(setup.smart);
  } else if (setup.mode === 'text') {
    studyController?.textQuiz.start({ region: setup.region, kinds: [...setup.kinds], count: setup.count, smart: setup.smart });
  } else {
    startLocate({ region: setup.region, kinds: [...setup.kinds], count: setup.count, latin: setup.latin, smart: setup.smart });
  }
};
btnQuiz.onclick = () => (state.quiz ? stopQuiz() : openSetup());

/* ───────────────────────── Loop ───────────────────────── */
let viewShift = 0;
let viewShiftY = 0;
function applyView() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  if (Math.abs(viewShift) < 0.5 && Math.abs(viewShiftY) < 0.5) camera.clearViewOffset();
  else camera.setViewOffset(w, h, viewShift, viewShiftY, w, h);
}
function resize() {
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w / h < 0.9 ? 40 : 30;
  camera.updateProjectionMatrix();
  applyView();
}
new ResizeObserver(resize).observe(stage);

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (goal) {
    const k = 1 - Math.exp(-dt * 6);
    controls.target.lerp(goal.target, k);
    camera.position.lerp(goal.pos, k);
    if (camera.position.distanceTo(goal.pos) < 0.005 && controls.target.distanceTo(goal.target) < 0.005) goal = null;
  }
  const open = infoEl.classList.contains('open');
  const wide = stage.clientWidth > 860;
  const wantShift = open && wide ? (infoEl.offsetWidth + 28) / 2 : 0;
  const wantShiftY = open && !wide ? Math.min(infoEl.offsetHeight, stage.clientHeight * 0.52) / 2 : 0;
  if (Math.abs(wantShift - viewShift) > 0.3 || Math.abs(wantShiftY - viewShiftY) > 0.3) {
    const k = 1 - Math.exp(-dt * 8);
    viewShift += (wantShift - viewShift) * k;
    viewShiftY += (wantShiftY - viewShiftY) * k;
    applyView();
  }
  controls.update();
  headlight.position.copy(camera.position);
  headlight.target.position.copy(controls.target);
  renderer.render(scene, camera);
  updateLabels(stage.clientWidth, stage.clientHeight);
  requestAnimationFrame(frame);
}

/* ───────────────────────── Corpo (carregado em segundo plano) ───────────────────────── */
function setBodyStatus(text, error = false) {
  const el = $('#bodyStatus');
  el.hidden = !text;
  el.textContent = text ?? '';
  el.classList.toggle('error', error);
}

function swapSkin(parts) {
  const skin = M.get('pele');
  const geo = parts.get('pele_corpo').geometry;
  ensureBVH(geo);
  skin.meshes[0].geometry = geo;
  skin.mats[0].clippingPlanes = null;
  skin.mats[0].needsUpdate = true;
}

function loadBody() {
  setBodyStatus('Carregando tronco e membros…');
  const sc = document.createElement('script');
  sc.src = 'dist/anatomy-body.js';
  sc.onerror = () => setBodyStatus('Não foi possível carregar o corpo (dist/anatomy-body.js).', true);
  sc.onload = async () => {
    try {
      const t0 = performance.now();
      const parts = await loadAnatomy(window.__ANATOMY_BODY);
      perf.bodyDataMs = Math.round(performance.now() - t0);
      bodyParts = parts;
      const tBuild = performance.now();
      const S2 = new Surfaces(parts, { skin: 'pele_corpo', bones: TORSO_PARTS });
      buildItems(parts, S2, BODY_ITEMS);
      perf.bodyStructuresMs = Math.round(performance.now() - tBuild);
      swapSkin(parts);
      state.bodyReady = true;
      document.body.classList.add('body-ready');
      buildList();
      applyVisibility();
      syncList();
      studyController?.onModelUpdated();
      if (!setupEl.hidden) renderSetup();
      console.info('[carga] corpo', perf.bodyStructuresMs, 'ms');
      // nervos: montados em segundo plano, depois que cabeça e corpo já estão na tela
      setBodyStatus('Montando os nervos…');
      const t1 = performance.now();
      try {
        const nerveParts = window.__ANATOMY_NERVES ? await loadAnatomy(window.__ANATOMY_NERVES) : new Map();
        await buildNerves(nerveParts, [parts.get('pele_corpo').geometry]);
      } catch (err) {
        console.error('[nervos]', err);
      }
      perf.nervesMs = Math.round(performance.now() - t1);
      perf.totalReadyMs = Math.round(performance.now() - perf.start);
      console.info('[carga] nervos', perf.nervesMs, 'ms · total', perf.totalReadyMs, 'ms');
      state.nervesReady = true;
      buildList();
      applyVisibility();
      syncList();
      if (state.selected && !M.has(state.selected)) select(null, { fly: false });
      else if (state.selected && infoEl.classList.contains('open')) showInfo(state.selected);
      studyController?.onModelUpdated();
      if (!setupEl.hidden) renderSetup();
      setBodyStatus(null);
    } catch (err) {
      console.error(err);
      setBodyStatus(`Erro ao montar o corpo: ${err.message}`, true);
    }
  };
  document.head.appendChild(sc);
}

/* ───────────────────────── Início ───────────────────────── */
showDesktopDownload();
$('#appVersion').textContent = window.__APP_VERSION && window.__APP_VERSION !== 'dev' ? `versão ${window.__APP_VERSION}` : '';

const perf = {
  start: performance.now(),
  dataMs: 0,
  headStructuresMs: 0,
  ttfiMs: 0,
  bodyDataMs: 0,
  bodyStructuresMs: 0,
  nervesMs: 0,
  totalReadyMs: 0,
};

async function init() {
  try {
    const t0 = performance.now();
    const parts = await loadAnatomy();
    headParts = parts;
    const t1 = performance.now();
    perf.dataMs = Math.round(t1 - t0);
    const S = new Surfaces(parts);
    buildItems(parts, S, ALL_ITEMS.filter((i) => HEAD_IDS.has(i.id)));
    perf.headStructuresMs = Math.round(performance.now() - t1);
    console.info('[carga] dados', perf.dataMs, 'ms · estruturas', perf.headStructuresMs, 'ms');
    buildList();
    renderChips();
    setDissect(1);
    resize();
    setRegion('cabeca', { fly: false });
    viewPreset('three');
    camera.position.copy(goal.pos);
    controls.target.copy(goal.target);
    goal = null;
    frame();
    perf.ttfiMs = Math.round(performance.now() - perf.start);
    $('#loading').classList.add('done');
    const jump = () => { if (goal) { camera.position.copy(goal.pos); controls.target.copy(goal.target); goal = null; controls.update(); } };
    const api = {
      state, M, ITEMS, INNERVATION, LAYERS, inRegion, perf, setup, S, THREE,
      catalogItems: ALL_ITEMS,
      catalog: new Map(ALL_ITEMS.map((i) => [i.id, i])),
      camera, controls, renderer, scene, jump, flyTo, viewPreset,
      select, focusItem, setRegion, setDissect, setSkin, syncLayers, syncList, setColorOverrides, applyHighlight,
      startLocate, locateClick, locateHint, locatePool, openSetup,
      enterQuiz, stopQuiz, recordSession, showAllLayersForQuiz,
      getModelBox: () => new THREE.Box3().setFromObject(modelRoot),
    };
    studyController = new StudyController(api);
    window.__app = { ...api, studyController, userData };
    setTimeout(loadBody, 250);
  } catch (err) {
    console.error(err);
    $('#loading').innerHTML = `<span style="max-width:420px;text-align:center">Não foi possível carregar o modelo 3D.<br><small>${esc(err.message)}</small></span>`;
  }
}
setTimeout(init, 40);
