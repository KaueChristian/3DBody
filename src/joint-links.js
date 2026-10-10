/**
 * Seções da ficha ligadas às articulações (F3): na articulação, ossos, ligamentos e movimentos com os músculos; no músculo, as
 * articulações que ele move; no osso e no ligamento, as articulações de que fazem parte. Os dados vêm de catalog-joints.js.
 */
import { MOVEMENTS, JOINTS_OF } from './catalog.js';

const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * @param {object} item estrutura do catálogo
 * @param {(l: {id: string, obs?: string, cls?: string}) => string} chip desenha um chip clicável (o mesmo da inervação)
 * @param {(s: string) => string} esc
 */
export function functionLinksHtml(item, chip, esc) {
  const box = (title, chips, cls = '') => (chips.length ? `<div class="links${cls}"><h3>${esc(title)}</h3><div class="lchips">${chips.join('')}</div></div>` : '');
  if (item.kind === 'articulacao') {
    const movs = item.movimentos.map((m) => {
      const chips = [...m.agon.map((id) => chip({ id })), ...m.sin.map((id) => chip({ id, obs: 'auxiliar', cls: 'aux' }))];
      return `<div class="mov"><p class="mov-head"><b>${esc(m.mov)}</b>${m.amp ? `<span class="amp">${esc(m.amp)}</span>` : ''}</p>${chips.length ? `<div class="lchips">${chips.join('')}</div>` : ''}${m.obs ? `<p class="mov-obs">${esc(m.obs)}</p>` : ''}</div>`;
    });
    return box('Ossos', item.ossos.map((id) => chip({ id })))
      + box('Ligamentos', item.ligamentos.map((id) => chip({ id })))
      + (movs.length ? `<div class="links movs"><h3>Movimentos e músculos</h3>${movs.join('')}</div>` : '');
  }
  if (item.kind === 'musculo') {
    const byJoint = new Map();
    for (const e of MOVEMENTS.get(item.id) ?? []) {
      if (!byJoint.has(e.art)) byJoint.set(e.art, { principal: [], auxiliar: [] });
      byJoint.get(e.art)[e.papel].push(lower(e.mov));
    }
    const chips = [...byJoint].map(([art, r]) => chip({
      id: art,
      obs: [r.principal.join(', '), r.auxiliar.length ? `auxiliar: ${r.auxiliar.join(', ')}` : ''].filter(Boolean).join(' · '),
    }));
    return box('Movimentos (articulações)', chips);
  }
  const joints = JOINTS_OF.get(item.id) ?? [];
  return box(joints.length > 1 ? 'Articulações' : 'Articulação', joints.map((id) => chip({ id })));
}

/** Estruturas destacadas junto com a selecionada: articulação → ossos e ligamentos; ligamento → ossos das suas articulações. */
export function jointRelatedIds(item, catalog) {
  if (item.kind === 'articulacao') return [...item.ossos, ...item.ligamentos];
  if (item.kind === 'ligamento') return [...new Set((JOINTS_OF.get(item.id) ?? []).flatMap((j) => catalog.get(j)?.ossos ?? []))];
  return null;
}

/** Na ficha da articulação a lista “Movimentos e músculos” substitui a linha de texto equivalente (que fica para busca e quiz). */
export const shownFields = (item) => (item.kind === 'articulacao' ? item.campos.filter(([k]) => k !== 'Movimentos e amplitude') : item.campos);
