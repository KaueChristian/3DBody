/**
 * Gerenciamento de estado da vista na URL (#hash), compartilhamento e vistas salvas (F1.1).
 */
import { userData } from './storage.js';

export function encodeViewState(app, camera, controls) {
  const parts = [];
  if (app.state.selected) parts.push(`sel=${encodeURIComponent(app.state.selected)}`);
  if (app.state.region && app.state.region !== 'cabeca') parts.push(`reg=${encodeURIComponent(app.state.region)}`);
  if (typeof app.state.dissect === 'number' && app.state.dissect !== 1) parts.push(`dis=${app.state.dissect}`);
  if (typeof app.state.skin === 'number' && Math.round(app.state.skin * 100) !== 14) parts.push(`sk=${Math.round(app.state.skin * 100)}`);

  if (camera && controls) {
    const cp = camera.position;
    const tp = controls.target;
    const r = (n) => +n.toFixed(2);
    parts.push(`cam=${r(cp.x)},${r(cp.y)},${r(cp.z)},${r(tp.x)},${r(tp.y)},${r(tp.z)}`);
  }

  return parts.join('&');
}

export function parseViewState(hashStr) {
  const raw = (hashStr || '').replace(/^[#?]/, '');
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const out = {};

  if (params.has('sel')) out.selected = params.get('sel');
  if (params.has('reg')) out.region = params.get('reg');
  if (params.has('dis')) out.dissect = parseInt(params.get('dis'), 10);
  if (params.has('sk')) out.skin = parseInt(params.get('sk'), 10) / 100;

  if (params.has('cam')) {
    const coords = params.get('cam').split(',').map(Number);
    if (coords.length === 6 && coords.every((n) => !isNaN(n))) {
      out.cam = {
        pos: [coords[0], coords[1], coords[2]],
        target: [coords[3], coords[4], coords[5]],
      };
    }
  }

  return Object.keys(out).length > 0 ? out : null;
}

export function applyViewState(app, stateObj) {
  if (!stateObj) return;

  if (stateObj.region && stateObj.region !== app.state.region) {
    app.setRegion(stateObj.region, { fly: false });
  }

  if (typeof stateObj.dissect === 'number') {
    app.setDissect(stateObj.dissect);
  }

  if (stateObj.cam && app.camera && app.controls) {
    const [cx, cy, cz] = stateObj.cam.pos;
    const [tx, ty, tz] = stateObj.cam.target;
    app.camera.position.set(cx, cy, cz);
    app.controls.target.set(tx, ty, tz);
    app.controls.update();
  }

  if (stateObj.selected) {
    setTimeout(() => {
      if (app.M.has(stateObj.selected)) {
        app.select(stateObj.selected, { fly: !stateObj.cam });
      }
    }, 100);
  }
}

export async function copyShareLink(app, camera, controls) {
  const hash = encodeViewState(app, camera, controls);
  const url = `${window.location.origin}${window.location.pathname}${hash ? '#' + hash : ''}`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return { success: true, url };
    }
  } catch (_) {}

  // Fallback via input
  try {
    const inp = document.createElement('input');
    inp.value = url;
    document.body.appendChild(inp);
    inp.select();
    document.execCommand('copy');
    document.body.removeChild(inp);
    return { success: true, url };
  } catch (err) {
    return { success: false, url, error: err.message };
  }
}
