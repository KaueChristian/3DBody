/**
 * Aba "Progresso": o que o estudante já fez, o que vence hoje e onde ainda erra (F1.3, F1.4).
 * Lê o mesmo registro que os quizzes gravam; nada aqui altera dados.
 */
import { esc } from './util.js';
import { summarize, dueForecast, getWeakStructureIds, recentPerformance } from './sm2.js';

const MODE_LABEL = { locate: 'Localizar', choice: 'Escolher o nome', text: 'Quiz teórico' };
const REGION_LABEL = { todos: 'Corpo', cabeca: 'Cabeça', tronco: 'Tronco', membro_sup: 'Braço' };
const GLYPH = (q) => (q >= 4 ? ['✔', 'ok', 'acertou'] : q === 3 ? ['◐', 'half', 'acertou com ajuda'] : ['✘', 'miss', 'errou']);
const pct = (x) => `${Math.round(x * 100)}%`;

export class ProgressPanel {
  /** @param {import('./ui.js').StudyController} ctl */
  constructor(ctl) {
    this.ctl = ctl;
    this.app = ctl.app;
    this.userData = ctl.userData;
    this.root = document.getElementById('progressPanel');
    this.root?.addEventListener('click', (e) => {
      const smart = e.target.closest('[data-smart]');
      if (smart) { this.ctl.openQuiz(smart.dataset.smart); return; }
      const go = e.target.closest('[data-go]');
      if (go && this.app.M.has(go.dataset.go)) { this.ctl.closeModal(); this.app.select(go.dataset.go); }
    });
  }

  /** Estruturas que entram nos quizzes (e portanto no progresso). */
  eligibleIds() {
    return this.app.catalogItems.filter((i) => i.id !== 'pele' && i.kind !== 'fascia').map((i) => i.id);
  }

  render() {
    if (!this.root) return;
    const progress = this.userData.progress;
    const ids = this.eligibleIds();
    const s = summarize(progress, ids);
    const fc = dueForecast(progress, ids);
    const weak = getWeakStructureIds(progress, ids);
    const sessions = this.userData.getSessions().slice(-8).reverse();

    if (!s.studied && !sessions.length) {
      this.root.innerHTML = `<div class="empty-progress">
        <p><b>Ainda não há progresso.</b></p>
        <p>Cada resposta nos quizzes (Localizar, Escolher o nome e Quiz teórico) é gravada por estrutura. Aqui você verá a precisão, o que vence para revisão e os seus pontos fracos.</p>
        <button type="button" class="primary" data-smart="new">Começar um quiz</button></div>`;
      return;
    }

    this.root.innerHTML = `
      <div class="stat-tiles">
        <div class="tile"><b>${s.studied}<small>/${s.total}</small></b><span>estruturas já estudadas</span></div>
        <div class="tile"><b>${s.accuracy == null ? '—' : pct(s.accuracy)}</b><span>de acerto em ${s.attempts} resposta${s.attempts === 1 ? '' : 's'}</span></div>
        <div class="tile ${s.due ? 'warn' : ''}"><b>${s.due}</b><span>para revisar hoje</span></div>
        <div class="tile ${s.weak ? 'bad' : ''}"><b>${s.weak}</b><span>pontos fracos</span></div>
        <div class="tile good"><b>${s.mastered}</b><span>bem fixadas</span></div>
        <div class="tile"><b>${s.fresh}</b><span>ainda não estudadas</span></div>
      </div>
      <div class="progress-actions">
        <button type="button" class="primary" data-smart="weak" ${s.weak ? '' : 'disabled'}>🎯 Treinar pontos fracos</button>
        <button type="button" class="btn" data-smart="due" ${s.due ? '' : 'disabled'}>🔁 Revisão de hoje</button>
        <button type="button" class="btn" data-smart="new">🆕 Estudar novas</button>
      </div>
      <p class="forecast">Revisões agendadas: <b>${fc.today}</b> hoje · <b>${fc.tomorrow}</b> amanhã · <b>${fc.week}</b> nos próximos 7 dias.</p>
      ${weak.length ? `<h3 class="sub">Onde você mais erra</h3>
        <ul class="weak-list">${weak.slice(0, 10).map((id) => this.weakRow(id)).join('')}</ul>
        ${weak.length > 10 ? `<p class="forecast">e mais ${weak.length - 10}. Use “Treinar pontos fracos” para praticar todos.</p>` : ''}` : ''}
      ${sessions.length ? `<h3 class="sub">Últimas rodadas</h3><ul class="session-list">${sessions.map((x) => this.sessionRow(x)).join('')}</ul>` : ''}
      <p class="forecast">Ponto fraco: errou a última vez ou acertou menos de 70% das últimas 5 respostas. Quando você volta a acertar, ele sai da lista.</p>`;
  }

  weakRow(id) {
    const card = this.userData.progress.get(id);
    const item = this.app.catalog.get(id);
    const trail = (card.recent ?? []).map((q) => { const [g, cls, label] = GLYPH(q); return `<i class="${cls}" title="${label}">${g}</i>`; }).join('');
    const perf = recentPerformance(card);
    const inModel = this.app.M.has(id);
    return `<li>
      <button type="button" class="weak-name" ${inModel ? `data-go="${esc(id)}"` : 'disabled'} title="${inModel ? 'Ver no modelo' : 'Carregando…'}">${esc(item?.name ?? id)}<small>${esc(item?.latin ?? '')}</small></button>
      <span class="trail" aria-label="Últimas respostas">${trail}</span>
      <span class="perf">${perf == null ? '' : pct(perf)}</span>
    </li>`;
  }

  sessionRow(x) {
    const ratio = x.total ? x.score / x.total : 0;
    const when = new Date(x.ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    const filter = x.smart && x.smart !== 'all' ? ` · ${esc(this.ctl.smartLabel(x.smart))}` : '';
    const score = Number.isInteger(x.score) ? x.score : x.score.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
    return `<li>
      <span class="when">${when}</span>
      <span class="what">${esc(MODE_LABEL[x.mode] ?? x.mode)} · ${esc(REGION_LABEL[x.region] ?? x.region)}${filter}</span>
      <span class="bar" role="img" aria-label="${pct(ratio)}"><i style="width:${Math.round(ratio * 100)}%"></i></span>
      <span class="res">${score}/${x.total} · ${pct(ratio)}</span>
    </li>`;
  }
}
