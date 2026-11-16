/**
 * Trilho de áreas (Explorar, Camadas, Corte, Estudo, Quiz): um painel por vez ao lado do palco, para a tela ter só o que
 * o estudo do momento pede.
 *
 * No computador o painel fica no fluxo (coluna da grade) e o ícone da área já aberta o recolhe (`body.panel-closed`).
 * No celular e no tablet em pé ele vira gaveta (`body.list-open`), com o fundo escurecido sobre o palco: tocar fora, o X,
 * Esc ou arrastar para a esquerda fecham. A condição da gaveta é a mesma das regras do styles.css.
 */
import { esc } from './study/util.js';

export const DRAWER_MQ = '(max-width: 860px), (max-height: 520px)';
const TITLES = { explorar: 'Explorar', camadas: 'Camadas', corte: 'Plano de corte', estudo: 'Estudo', quiz: 'Quiz' };

/**
 * @param {object} o
 * @param {HTMLElement} o.stage
 * @param {object} o.state          estado do app (lê `region` e `dissect` para a linha de contexto)
 * @param {string[]} o.dissectNames nomes dos níveis de dissecação (0 … 6)
 * @param {(v:number)=>void} o.setDissect
 * @param {(preset?:object)=>void} o.openSetup  abre a configuração do quiz (`{ mode }` ou `{ smart }`)
 * @param {()=>any} o.study         devolve o StudyController (criado depois do primeiro quadro)
 */
export function createAreas({ stage, state, dissectNames, setDissect, openSetup, study }) {
  const $ = (s) => document.querySelector(s);
  const body = document.body;
  const isDrawer = () => matchMedia(DRAWER_MQ).matches;
  const buttons = [...document.querySelectorAll('#rail [data-area]')];
  const panes = [...document.querySelectorAll('#sidebar [data-pane-area]')];
  let area = 'explorar';

  const isOpen = () => (isDrawer() ? body.classList.contains('list-open') : !body.classList.contains('panel-closed'));

  function syncButtons() {
    const open = isOpen();
    for (const b of buttons) {
      const on = open && b.dataset.area === area;
      b.classList.toggle('on', on);
      b.setAttribute('aria-expanded', String(on));
    }
  }

  function show(a) {
    area = a;
    for (const p of panes) p.hidden = p.dataset.paneArea !== a;
    $('#panelTitle').textContent = TITLES[a] ?? '';
    if (a === 'estudo') renderStudy();
    if (a === 'corte') study()?.syncClipUi();
  }

  function setOpen(open) {
    if (isDrawer()) body.classList.toggle('list-open', open);
    else body.classList.toggle('panel-closed', !open);
    syncButtons();
  }

  /** Abre a área; se ela já está aberta, recolhe o painel (no celular, fecha a gaveta). */
  function toggleArea(a) {
    if (isOpen() && area === a) { setOpen(false); return; }
    show(a);
    setOpen(true);
  }

  for (const b of buttons) b.addEventListener('click', () => toggleArea(b.dataset.area));
  $('#closeList').addEventListener('click', () => setOpen(false));
  // ao cruzar o limite gaveta ↔ painel fixo, o estado do outro modo vale de novo: só os botões precisam acompanhar
  matchMedia(DRAWER_MQ).addEventListener?.('change', syncButtons);

  // tocar no fundo escurecido (que é o próprio palco) ou arrastar a gaveta para a esquerda fecha
  stage.addEventListener('click', (e) => { if (e.target === stage && body.classList.contains('list-open')) setList(false); });
  {
    let x0 = null, y0 = 0;
    const side = $('#sidebar');
    side.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    side.addEventListener('touchend', (e) => {
      // só um arrasto francamente horizontal fecha: rolar o painel na diagonal não pode fechar a gaveta
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (x0 !== null && dx < -70 && Math.abs(dx) > 1.5 * Math.abs(dy)) setList(false);
      x0 = null;
    }, { passive: true });
  }

  /** Só a gaveta: escolher uma estrutura ou apertar Esc fecha; no computador o painel fixo não muda. */
  function setList(open) {
    if (!isDrawer() && open) return;
    body.classList.toggle('list-open', open);
    syncButtons();
  }

  /* ───── Camadas: níveis de dissecação como lista (0 = pele opaca … 6 = só ossos) ───── */
  const steps = $('#dissectSteps');
  steps.innerHTML = dissectNames.map((n, i) => `<button type="button" role="radio" data-v="${i}" aria-checked="false" tabindex="-1"><span class="n" aria-hidden="true">${i}</span>${esc(n)}</button>`).join('');
  steps.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) setDissect(Number(b.dataset.v));
  });
  steps.addEventListener('keydown', (e) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const v = Math.max(0, Math.min(dissectNames.length - 1, state.dissect + d));
    setDissect(v);
    steps.querySelector(`[data-v="${v}"]`)?.focus();
  });

  function syncDissect(v) {
    for (const b of steps.querySelectorAll('button')) {
      const on = Number(b.dataset.v) === v;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    }
    syncContext();
  }

  /** Linha discreta no canto do palco: região e nível de dissecação. */
  function syncContext() {
    const r = document.querySelector(`#regionSeg [data-region="${state.region}"]`)?.textContent ?? '';
    $('#stageContext').textContent = [r, dissectNames[state.dissect]].filter(Boolean).join(' · ');
  }

  /* ───── Estudo: revisão do dia e atalhos para as abas do modal ───── */
  function renderStudy() {
    const sc = study();
    if (!sc) return;
    const due = sc.smartCount('due');
    const weak = sc.smartCount('weak');
    $('#dueLine').textContent = due ? `${due} ${due === 1 ? 'estrutura vencida' : 'estruturas vencidas'} para revisar` : 'Nada vencido para revisar hoje';
    const dueBtn = document.querySelector('[data-quiz-smart="due"]');
    const weakBtn = document.querySelector('[data-quiz-smart="weak"]');
    dueBtn.disabled = !due;
    weakBtn.disabled = !weak;
    weakBtn.textContent = weak ? `Treinar os pontos fracos (${weak})` : 'Sem pontos fracos ainda';
  }
  document.querySelectorAll('[data-quiz-smart]').forEach((b) => b.addEventListener('click', () => { setList(false); openSetup({ smart: b.dataset.quizSmart }); }));

  // as abas do modal de estudo abrem por cima do palco: no celular, a gaveta sai da frente
  document.querySelectorAll('[data-study-tab]').forEach((b) => b.addEventListener('click', () => setList(false)));

  /* ───── Quiz: o modo escolhido aqui já vem marcado na configuração ───── */
  document.querySelectorAll('[data-quiz-mode]').forEach((b) => b.addEventListener('click', () => { setList(false); openSetup({ mode: b.dataset.quizMode }); }));

  show(area);
  syncButtons();
  return { setList, syncDissect, syncContext, toggleArea, get area() { return area; }, isOpen };
}
