/**
 * Execução do quiz teórico (F1.5) na interface.
 *
 * É um modo de quiz de verdade (`state.quiz.mode === 'text'`): rótulos e destaques de hover ficam desligados, a região
 * é fixada, o atalho 1–4/Enter funciona e a sessão entra no histórico de progresso.
 */
import { esc, shuffle } from './util.js';
import { TextQuizGenerator } from './text-quiz.js';

export class TextQuizRunner {
  /** @param {import('./ui.js').StudyController} ctl */
  constructor(ctl) {
    this.ctl = ctl;
    this.app = ctl.app;
    this.generator = new TextQuizGenerator(this.app.catalogItems, this.app.INNERVATION, this.app.inRegion);
    this.el = document.getElementById('textQuiz');
    this.promptEl = document.getElementById('tqPrompt');
    this.scoreEl = document.getElementById('tqScore');
    this.optionsEl = document.getElementById('tqOptions');
    this.feedbackEl = document.getElementById('tqFeedback');
    const exit = document.getElementById('tqExit');
    if (exit) exit.onclick = () => this.app.stopQuiz();
  }

  /** Estruturas que o quiz teórico consegue usar com as opções escolhidas. */
  poolFor(setup, only = null) {
    const kinds = (setup.kinds ?? []).filter((k) => k === 'musculo' || k === 'nervo');
    const allow = only ? new Set(only) : this.ctl.smartSet(setup.smart);
    return this.generator.pool({ region: setup.region, kinds, allow });
  }

  /**
   * Começa (ou recomeça) o quiz. `only`: lista de ids para treinar só aquelas estruturas.
   * @returns {boolean} false se não há o que perguntar
   */
  start(setup, only = null) {
    const pool = this.poolFor(setup, only);
    if (!pool.length) {
      this.ctl.toast('Nenhuma estrutura de músculo ou nervo com esses filtros.');
      return false;
    }
    const queue = shuffle(pool);
    // como no quiz de localizar, "Todas" = cada estrutura do filtro uma vez
    const total = setup.count ? Math.min(setup.count, pool.length) : pool.length;
    this.app.enterQuiz({
      mode: 'text', setup: { ...setup }, pool, queue, limit: total, only,
      score: 0, total: 0, answered: false, current: null, question: null, missed: [], finished: false, recorded: false, t0: performance.now(),
    });
    this.app.setRegion(setup.region, { fly: false });
    this.app.showAllLayersForQuiz();
    this.app.viewPreset('three');
    for (const id of ['quiz', 'locate', 'quizResult']) {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    }
    this.el.hidden = false;
    this.next();
    return true;
  }

  get q() {
    return this.app.state.quiz?.mode === 'text' ? this.app.state.quiz : null;
  }

  next() {
    const q = this.q;
    if (!q) return;
    if (q.total >= q.limit) { this.finish(); return; }

    let question = null;
    let guard = q.pool.length + 1;
    while (!question && guard-- > 0) {
      if (!q.queue.length) break; // cada estrutura entra uma vez; acabou a fila
      question = this.generator.question(q.queue.shift(), q.setup.region);
    }
    if (!question) {
      if (!q.total) this.ctl.toast('Não foi possível montar perguntas com esses filtros.');
      this.finish();
      return;
    }

    q.question = question;
    q.answered = false;
    this.promptEl.innerHTML = question.prompt;
    this.scoreEl.textContent = this.scoreText();
    this.feedbackEl.innerHTML = '';
    // se o enunciado já cita a estrutura, mostrar onde ela está ajuda; senão, só depois de responder
    if (question.named && this.app.M.has(question.targetId)) this.app.select(question.targetId, { fly: true, panel: false });
    else this.app.select(null, { fly: false });

    this.optionsEl.innerHTML = question.options
      .map((o, i) => `<button type="button" data-id="${esc(o.id)}"><span class="kbadge" aria-hidden="true">${i + 1}</span>${esc(o.text)}</button>`)
      .join('');
    this.optionsEl.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => this.answer(b.dataset.id)));
  }

  scoreText() {
    const q = this.q;
    return `${q.total}/${q.limit} · ${q.score} certas`;
  }

  answer(chosenId) {
    const q = this.q;
    if (!q || q.answered) return;
    q.answered = true;
    q.total++;
    const { question } = q;
    const ok = chosenId === question.correctId;
    if (ok) q.score++; else q.missed.push(question.targetId);
    this.ctl.userData.recordQuizResult(question.targetId, ok ? 5 : 1);

    this.optionsEl.querySelectorAll('button').forEach((b) => {
      b.disabled = true;
      if (b.dataset.id === question.correctId) b.classList.add('right');
      else if (b.dataset.id === chosenId) b.classList.add('wrong');
    });
    this.scoreEl.textContent = this.scoreText();
    if (this.app.M.has(question.targetId)) this.app.select(question.targetId, { fly: true, panel: false });

    const last = q.total >= q.limit;
    this.feedbackEl.innerHTML = `<span>${ok ? '✔ Correto!' : '✘ Incorreta.'} ${question.explanation}</span>
      <button type="button" class="primary" id="tqNext">${last ? 'Ver resultado' : 'Próxima'}</button>`;
    const nextBtn = this.feedbackEl.querySelector('#tqNext');
    nextBtn.onclick = () => this.next();
    nextBtn.focus();
  }

  finish() {
    const q = this.q;
    if (!q) return;
    q.finished = true;
    this.app.recordSession();
    this.app.select(null, { fly: false });
    const pct = q.total ? Math.round((q.score / q.total) * 100) : 0;
    const missed = [...new Set(q.missed)];
    const names = missed.map((id) => this.app.catalog.get(id)?.name).filter(Boolean);
    this.promptEl.innerHTML = `Fim do quiz teórico: <b>${q.score}</b> de ${q.total} (${pct}%)`;
    this.scoreEl.textContent = this.scoreText();
    this.optionsEl.innerHTML = names.length
      ? `<p class="tq-missed"><b>Para revisar:</b> ${names.map(esc).join(' · ')}</p>`
      : '<p class="tq-missed">Sem erros nesta rodada.</p>';
    this.feedbackEl.innerHTML = `<span></span>
      ${missed.length ? '<button type="button" class="btn" id="tqRetry">Treinar só as erradas</button>' : ''}
      <button type="button" class="btn" id="tqAgain">Jogar de novo</button>
      <button type="button" class="primary" id="tqDone">Concluir</button>`;
    this.feedbackEl.querySelector('#tqRetry')?.addEventListener('click', () => this.start(q.setup, missed));
    this.feedbackEl.querySelector('#tqAgain').onclick = () => this.start(q.setup, q.only);
    this.feedbackEl.querySelector('#tqDone').onclick = () => this.app.stopQuiz();
    this.feedbackEl.querySelector('#tqDone').focus();
  }

  /** Chamado pelo main.js ao encerrar qualquer quiz. */
  onQuizStopped() {
    if (this.el) this.el.hidden = true;
  }
}
