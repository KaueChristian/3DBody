/**
 * Estado da vista na URL (#hash), compartilhamento e vistas salvas (F1.1).
 *
 * O hash guarda: estrutura selecionada (sel), região (reg), dissecação (dis), opacidade da pele (sk), câmera (cam),
 * camadas visíveis (ly), estruturas ocultas (hid), plano de corte (clip), coloração (col) e rótulos (lb).
 * Campos ausentes significam "padrão"; só o que difere do padrão é gravado.
 */
import { layersForDissect } from '../catalog.js';

const DEFAULT_SKIN = 14;
const MAX_WAIT_MS = 40000;

export function encodeViewState(app, camera, controls, extra = {}) {
  const { state } = app;
  const parts = [];
  if (state.selected) parts.push(`sel=${encodeURIComponent(state.selected)}`);
  if (state.region && state.region !== 'cabeca') parts.push(`reg=${encodeURIComponent(state.region)}`);
  if (typeof state.dissect === 'number' && state.dissect !== 1) parts.push(`dis=${state.dissect}`);
  if (typeof state.skin === 'number' && Math.round(state.skin * 100) !== DEFAULT_SKIN) parts.push(`sk=${Math.round(state.skin * 100)}`);

  // camadas: só se o usuário ligou/desligou camadas além do que a dissecação define
  const base = new Set(layersForDissect(state.dissect));
  const same = state.layers.size === base.size && [...state.layers].every((l) => base.has(l));
  if (!same) parts.push(`ly=${[...state.layers].join('.')}`);
  if (state.hidden.size) parts.push(`hid=${[...state.hidden].join('.')}`);
  if (extra.clip) parts.push(`clip=${extra.clip}`);
  if (extra.color && extra.color !== 'camada') parts.push(`col=${extra.color}`);
  if (state.labels) parts.push('lb=1');

  if (camera && controls) {
    const cp = camera.position;
    const tp = controls.target;
    const r = (n) => +n.toFixed(2);
    parts.push(`cam=${r(cp.x)},${r(cp.y)},${r(cp.z)},${r(tp.x)},${r(tp.y)},${r(tp.z)}`);
  }
  return parts.join('&');
}

const list = (v) => String(v).split('.').filter(Boolean);

export function parseViewState(hashStr) {
  const raw = String(hashStr ?? '').replace(/^[#?]/, '');
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const out = {};

  if (params.has('sel')) out.selected = params.get('sel');
  if (params.has('reg')) out.region = params.get('reg');
  if (params.has('dis')) {
    const d = parseInt(params.get('dis'), 10);
    if (Number.isInteger(d) && d >= 0 && d <= 6) out.dissect = d;
  }
  if (params.has('sk')) {
    const s = parseInt(params.get('sk'), 10);
    if (Number.isFinite(s)) out.skin = Math.max(0, Math.min(100, s)) / 100;
  }
  if (params.has('ly')) out.layers = list(params.get('ly'));
  if (params.has('hid')) out.hidden = list(params.get('hid'));
  if (params.has('clip')) out.clip = params.get('clip');
  if (params.has('col')) out.color = params.get('col');
  if (params.get('lb') === '1') out.labels = true;

  if (params.has('cam')) {
    const coords = params.get('cam').split(',').map(Number);
    if (coords.length === 6 && coords.every((n) => Number.isFinite(n))) {
      out.cam = { pos: coords.slice(0, 3), target: coords.slice(3) };
    }
  }
  return Object.keys(out).length ? out : null;
}

/** O app já tem tudo o que o estado salvo precisa (corpo e nervos carregados, quando a vista os usa)? */
function ready(app, st) {
  const { state, M } = app;
  const needsBody = (st.region && st.region !== 'cabeca' && st.region !== 'todos')
    || (st.selected && !M.has(st.selected))
    || (st.hidden ?? []).some((id) => !M.has(id));
  if (!needsBody) return true;
  return state.bodyReady && state.nervesReady;
}

/**
 * Aplica o estado. Retorna uma Promise que resolve quando terminou (ou desistiu: o corpo é carregado em segundo
 * plano e pode demorar; se não chegar em ~40 s, aplica o que for possível).
 * @param {object} app
 * @param {object} st resultado de `parseViewState`
 * @param {{ studyController?: any }} [hooks]
 */
export function applyViewState(app, st, hooks = {}) {
  if (!st) return Promise.resolve();
  const t0 = performance.now();
  return new Promise((resolve) => {
    const attempt = () => {
      if (!ready(app, st) && performance.now() - t0 < MAX_WAIT_MS) {
        setTimeout(attempt, 250);
        return;
      }
      applyNow(app, st, hooks);
      resolve();
    };
    attempt();
  });
}

function applyNow(app, st, hooks) {
  const { state } = app;
  const ctl = hooks.studyController;

  // o que não está no estado salvo vale o padrão (o hash só guarda o que difere dele)
  const region = st.region ?? 'cabeca';
  if (region !== state.region) app.setRegion(region, { fly: false });
  app.setDissect(st.dissect ?? 1);
  if (st.layers) {
    state.layers = new Set(st.layers.filter((id) => app.LAYERS.some((l) => l.id === id)));
  }
  state.hidden = new Set((st.hidden ?? []).filter((id) => app.M.has(id)));
  app.setSkin(st.skin ?? DEFAULT_SKIN / 100);
  state.labels = !!st.labels;
  const labelsBox = document.getElementById('optLabels');
  if (labelsBox) labelsBox.checked = state.labels;
  app.syncLayers();

  if (ctl) {
    ctl.clipping.restore(st.clip ?? '');
    ctl.syncClipUi();
    ctl.coloring.setMode(st.color ?? 'camada');
    ctl.syncColorUi();
  }

  if (st.cam && app.camera && app.controls) {
    app.camera.position.set(...st.cam.pos);
    app.controls.target.set(...st.cam.target);
    app.controls.update();
  }
  if (st.selected && app.M.has(st.selected)) app.select(st.selected, { fly: !st.cam });
  else if (st.selected === undefined) app.select(null, { fly: false });
}

/** Endereço atual sem o hash. Em `file://` não existe "origem", então usamos o próprio endereço do arquivo. */
export function baseUrl() {
  return window.location.href.split('#')[0];
}

/** Link para a vista atual. */
export function shareUrl(app, camera, controls, extra) {
  const hash = encodeViewState(app, camera, controls, extra);
  return `${baseUrl()}${hash ? '#' + hash : ''}`;
}

export async function copyShareLink(app, camera, controls, extra) {
  const url = shareUrl(app, camera, controls, extra);
  const local = window.location.protocol === 'file:';

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return { success: true, url, local };
    }
  } catch { /* cai no método antigo */ }

  try {
    const inp = document.createElement('input');
    inp.value = url;
    document.body.appendChild(inp);
    inp.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(inp);
    return { success: ok, url, local };
  } catch (err) {
    return { success: false, url, local, error: err.message };
  }
}
