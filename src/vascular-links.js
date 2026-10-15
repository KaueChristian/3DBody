/**
 * Seções vasculares da ficha (F5): artérias de cada músculo, músculos irrigados por cada artéria e feixes neurovasculares.
 * Os dados vêm de irrigation.js (via catalog.js) e de neurovascular.js.
 */
import { IRRIGATION, IRRIGATED } from './catalog.js';
import { FEIXES_DE, feixePorId } from './neurovascular.js';

/**
 * @param {object} item estrutura do catálogo
 * @param {(l: {id: string, obs?: string}) => string} chip desenha um chip clicável (o mesmo da inervação)
 * @param {(s: string) => string} esc
 */
export function vascularLinksHtml(item, chip, esc) {
  const out = [];
  if (item.kind === 'musculo') {
    const arts = IRRIGATION.get(item.id) ?? [];
    if (arts.length) out.push(`<div class="links"><h3>Artérias (irrigação)</h3><div class="lchips">${arts.map((id) => chip({ id })).join('')}</div></div>`);
  } else if (item.kind === 'arteria') {
    const ms = IRRIGATED.get(item.id) ?? [];
    if (ms.length) {
      out.push(`<details class="links irrig"><summary><h3>Músculos irrigados (${ms.length})</h3></summary><div class="lchips">${ms.map((id) => chip({ id })).join('')}</div></details>`);
    }
  }
  for (const f of FEIXES_DE.get(item.id) ?? []) {
    out.push(`<div class="links bundle"><h3>Feixe neurovascular</h3><p class="bundle-name"><b>${esc(f.nome)}</b></p><p class="bundle-txt">${esc(f.texto)}</p>`
      + `<div class="lchips">${f.membros.filter((m) => m !== item.id).map((id) => chip({ id })).join('')}</div>`
      + `<button class="btn" data-bundle="${esc(f.id)}">Isolar o feixe</button></div>`);
  }
  return out.join('');
}

/** Ids a manter visíveis ao isolar o feixe. */
export const bundleMembers = (id) => feixePorId(id)?.membros ?? [];
