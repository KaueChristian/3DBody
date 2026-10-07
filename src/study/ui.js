/**
 * Controlador das ferramentas de estudo (F1.1 a F1.10): liga os módulos de `src/study/` à cena e ao DOM sem inflar o
 * main.js. Aqui ficam o modal, os tours, o corte, a coloração, o backup e as vistas; o quiz teórico, as listas e o
 * painel de progresso têm módulos próprios.
 */
import { userData } from './storage.js';
import { getDueStructureIds, getWeakStructureIds, getNewStructureIds } from './sm2.js';
import { encodeViewState, parseViewState, applyViewState, copyShareLink, shareUrl } from './views.js';
import { ClippingManager } from './clipping.js';
import { ColoringManager, MODES } from './coloring.js';
import { TextQuizRunner } from './text-quiz-ui.js';
import { ListsPanel } from './lists-ui.js';
import { ProgressPanel } from './progress-ui.js';
import { TOURS } from './tours.js';
import { exportSnapshotPng, printCurrentCard } from './export.js';
import { esc } from './util.js';

let toastTimer = null;
export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = true;
  void toast.offsetWidth; // reinicia a animação
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
}

/**
 * Direções de câmera (a partir do alvo) das vistas dos tours. Frente e costas saem um pouco para o lado esquerdo do
 * sujeito (x > 0) para o enquadramento escolher a cópia esquerda da estrutura, a mesma dos passos vizinhos.
 */
const VIEW_DIRS = { front: [0.4, 0.02, 1], three: [0.78, 0.14, 0.62], right: [-1, 0.02, 0], left: [1, 0.02, 0], back: [0.4, 0.05, -1] };
const AXIS_LABEL = { sagittal: 'sagital', coronal: 'coronal', axial: 'axial' };
const FILTER_LABEL = { all: 'Todos', fav: 'Favoritos', due: 'Revisão de hoje', weak: 'Pontos fracos', new: 'Ainda não estudadas' };

export class StudyController {
  /** @param {object} app interface exposta pelo main.js (estado, cena e operações) */
  constructor(app) {
    this.app = app;
    this.userData = userData;
    this.clipping = new ClippingManager(app.renderer, () => app.getModelBox());
    this.coloring = new ColoringManager(app);
    this.activeTour = null;
    this.tourStepIndex = 0;
    this.tourTimer = null;
    this.viewTimer = null;

    this.textQuiz = new TextQuizRunner(this);
    this.lists = new ListsPanel(this);
    this.progress = new ProgressPanel(this);

    this.initElements();
    this.initModal();
    this.initClippingControls();
    this.initColoringControls();
    this.initBackupAndSavedViews();
    this.initQuickButtons();
    this.bindEvents();
    this.checkInitialHash();
  }

  /* ───────────── Elementos criados por script ───────────── */
  initElements() {
    const stage = document.getElementById('stage') || document.body;
    // legenda e chip do corte vão para a base do palco (.dock), onde o CSS os arranja com os controles sem sobrepor
    const dock = stage.querySelector('.dock');
    const dockSide = stage.querySelector('.dock-side');
    const make = (tag, id, className, attrs = {}, place = (el) => stage.appendChild(el)) => {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement(tag);
        el.id = id;
        el.className = className;
        el.hidden = true;
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        place(el);
      }
      return el;
    };
    this.tourBox = make('div', 'tourBox', 'tour-box', { role: 'region', 'aria-label': 'Tour guiado', 'aria-live': 'polite' });
    this.legendEl = make('aside', 'colorLegend', 'color-legend', { 'aria-label': 'Legenda das cores' },
      (el) => (dockSide ? dockSide.prepend(el) : stage.appendChild(el)));
    this.clipChip = make('button', 'clipChip', 'floating-chip', { type: 'button', title: 'Desativar o plano de corte' },
      (el) => (dock && dockSide ? dock.insertBefore(el, dockSide) : stage.appendChild(el)));
    this.clipChip.addEventListener('click', () => this.resetClip());
  }

  bindEvents() {
    window.addEventListener('hashchange', () => {
      const st = parseViewState(window.location.hash);
      if (st) applyViewState(this.app, st, { studyController: this });
    });
    this.app.controls?.addEventListener('end', () => this.scheduleViewUpdate());

    window.addEventListener('keydown', (e) => {
      if (!this.activeTour || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); this.tourStep(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.tourStep(-1); }
    });
  }

  checkInitialHash() {
    const st = parseViewState(window.location.hash);
    if (st) applyViewState(this.app, st, { studyController: this });
  }

  toast(msg) { showToast(msg); }

  /** Esc: fecha o modal ou sai do tour. Devolve true se tratou a tecla. */
  handleEscape() {
    if (this.studyModal && !this.studyModal.hidden) { this.closeModal(); return true; }
    if (this.activeTour) { this.stopTour(); return true; }
    return false;
  }

  /* ───────────── Estado na URL ───────────── */
  viewExtra() {
    return { clip: this.clipping.serialize(), color: this.coloring.mode };
  }

  currentHash() {
    return encodeViewState(this.app, this.app.camera, this.app.controls, this.viewExtra());
  }

  shareUrl() {
    return shareUrl(this.app, this.app.camera, this.app.controls, this.viewExtra());
  }

  /** Chamado pelo main.js sempre que seleção, camadas, região ou pele mudam. */
  onViewChanged() { this.scheduleViewUpdate(); }

  scheduleViewUpdate() {
    clearTimeout(this.viewTimer);
    this.viewTimer = setTimeout(() => {
      this.updateUrlHash();
      this.updateLegend();
      this.updateClipChip();
    }, 250);
  }

  updateUrlHash() {
    if (this.app.state.quiz || this.activeTour) return;
    try {
      const hash = this.currentHash();
      const url = window.location.href.split('#')[0] + (hash ? `#${hash}` : '');
      window.history.replaceState(null, '', url);
    } catch { /* alguns ambientes não deixam mexer na URL: o link copiado continua funcionando */ }
  }

  /** O corpo e os nervos terminaram de carregar: recalcula cores e legenda. */
  onModelUpdated() {
    if (this.coloring.mode !== 'camada') this.coloring.apply();
    this.updateLegend();
  }

  /* ───────────── Filtros inteligentes (usados pelos três quizzes) ───────────── */
  eligibleIds() { return this.progress.eligibleIds(); }

  /** Conjunto de ids permitidos pelo filtro, ou `null` quando o filtro é "todos". */
  smartSet(smart) {
    if (!smart || smart === 'all') return null;
    const ids = this.eligibleIds();
    const prog = this.userData.progress;
    if (smart === 'fav') return new Set(this.userData.getFavorites());
    if (smart === 'due') return new Set(getDueStructureIds(prog, ids));
    if (smart === 'weak') return new Set(getWeakStructureIds(prog, ids));
    if (smart === 'new') return new Set(getNewStructureIds(prog, ids));
    if (smart.startsWith('list:')) return new Set(this.userData.getList(smart.slice(5))?.ids ?? []);
    return null;
  }

  smartCount(smart) {
    const set = this.smartSet(smart);
    if (!set) return this.eligibleIds().length;
    const ok = new Set(this.eligibleIds());
    let n = 0;
    for (const id of set) if (ok.has(id)) n++;
    return n;
  }

  smartLabel(smart) {
    if (smart?.startsWith('list:')) return this.userData.getList(smart.slice(5))?.name ?? 'Lista removida';
    return FILTER_LABEL[smart] ?? FILTER_LABEL.all;
  }

  /** Abre a configuração do quiz já com um filtro escolhido (usado pelos painéis de progresso e listas). */
  openQuiz(smart) {
    this.closeModal();
    this.app.openSetup({ smart });
  }

  /* ───────────── Modal ───────────── */
  initModal() {
    this.studyModal = document.getElementById('studyModal');
    document.getElementById('btnStudy')?.addEventListener('click', () => this.openModal());
    document.getElementById('studyClose')?.addEventListener('click', () => this.closeModal());
    this.studyModal?.addEventListener('click', (e) => { if (e.target === this.studyModal) this.closeModal(); });

    this.tabs = [...document.querySelectorAll('#studyModal .tab-btn')];
    this.tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => this.showTab(tab.dataset.tab));
      tab.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const next = this.tabs[(i + d + this.tabs.length) % this.tabs.length];
        next.focus();
        this.showTab(next.dataset.tab);
      });
    });
    this.renderToursList();
  }

  showTab(tabId) {
    this.tabs.forEach((t) => {
      const on = t.dataset.tab === tabId;
      t.classList.toggle('on', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('#studyModal .tab-pane').forEach((pane) => {
      const on = pane.dataset.pane === tabId;
      pane.hidden = !on;
      pane.classList.toggle('on', on);
    });
    this.activeTab = tabId;
    if (tabId === 'progress') this.progress.render();
    else if (tabId === 'lists') this.lists.render();
    else if (tabId === 'backup') this.renderSavedViews();
  }

  openModal(tab) {
    if (!this.studyModal) return;
    if (this.app.state.quiz) { showToast('Saia do quiz para abrir as ferramentas de estudo.'); return; }
    this.studyModal.hidden = false;
    this.showTab(tab ?? this.activeTab ?? 'tours');
    this.syncClipUi();
    this.syncColorUi();
    this.tabs.find((t) => t.classList.contains('on'))?.focus();
  }

  closeModal() {
    if (!this.studyModal || this.studyModal.hidden) return;
    this.studyModal.hidden = true;
    document.getElementById('btnStudy')?.focus();
  }

  /* ───────────── Tours guiados (F1.8) ───────────── */
  renderToursList() {
    const container = document.getElementById('toursList');
    if (!container) return;
    container.innerHTML = TOURS.map((tour) => `
      <div class="tour-card">
        <div class="tour-card-head">
          <h4>${esc(tour.title)}</h4>
          <span class="tour-steps-count">${tour.steps.length} passos</span>
        </div>
        <p class="tour-sub">${esc(tour.subtitle)}</p>
        <p class="tour-desc">${esc(tour.description)}</p>
        <button type="button" class="primary btn-start-tour" data-tour="${esc(tour.id)}">Iniciar tour</button>
      </div>`).join('');
    container.querySelectorAll('.btn-start-tour').forEach((btn) => {
      btn.addEventListener('click', () => { this.closeModal(); this.startTour(btn.dataset.tour); });
    });
  }

  startTour(tourId) {
    const tour = TOURS.find((t) => t.id === tourId);
    if (!tour || this.app.state.quiz) return;
    this.activeTour = tour;
    this.tourStepIndex = 0;
    this.app.select(null, { fly: false });
    this.renderTourStep();
  }

  tourStep(delta) {
    if (!this.activeTour) return;
    const next = this.tourStepIndex + delta;
    if (next < 0) return;
    if (next >= this.activeTour.steps.length) { this.stopTour(); return; }
    this.tourStepIndex = next;
    this.renderTourStep();
  }

  renderTourStep() {
    const tour = this.activeTour;
    const step = tour?.steps[this.tourStepIndex];
    if (!step) return;
    const { app } = this;

    if (step.region && step.region !== app.state.region) app.setRegion(step.region, { fly: false });
    if (typeof step.dissect === 'number') app.setDissect(step.dissect);
    clearTimeout(this.tourTimer);
    if (step.highlight && app.M.has(step.highlight)) {
      // aponta a câmera para o lado pedido e deixa o enquadramento da estrutura (o mesmo das dicas do quiz) fazer o resto
      const dir = VIEW_DIRS[step.view] ?? VIEW_DIRS.three;
      const dist = app.camera.position.distanceTo(app.controls.target);
      app.camera.position.copy(app.controls.target).addScaledVector(new app.THREE.Vector3(...dir).normalize(), dist);
      app.select(step.highlight, { fly: false, panel: false });
      app.focusItem(step.highlight, false, 1); // a cópia esquerda (x > 0), como nos passos vizinhos
    } else {
      app.select(null, { fly: false });
      app.viewPreset(step.view ?? 'three'); // sem estrutura em destaque: mostra a região inteira
    }

    const total = tour.steps.length;
    const last = this.tourStepIndex === total - 1;
    this.tourBox.hidden = false;
    this.tourBox.innerHTML = `
      <div class="tour-head">
        <span class="tour-badge">${esc(tour.title)} · ${this.tourStepIndex + 1}/${total}</span>
        <button type="button" class="close" id="tourClose" aria-label="Sair do tour">×</button>
      </div>
      <h3 class="tour-title">${esc(step.title)}</h3>
      <p class="tour-text">${esc(step.text)}</p>
      <div class="tour-actions">
        <button type="button" class="btn" id="tourPrev" ${this.tourStepIndex === 0 ? 'disabled' : ''}>← Anterior</button>
        <button type="button" class="primary" id="tourNext">${last ? 'Concluir' : 'Próximo →'}</button>
      </div>`;
    this.tourBox.querySelector('#tourClose').onclick = () => this.stopTour();
    this.tourBox.querySelector('#tourPrev').onclick = () => this.tourStep(-1);
    const nextBtn = this.tourBox.querySelector('#tourNext');
    nextBtn.onclick = () => this.tourStep(1);
    nextBtn.focus({ preventScroll: true });
  }

  stopTour() {
    clearTimeout(this.tourTimer);
    this.activeTour = null;
    this.tourBox.hidden = true;
    this.app.select(null, { fly: false });
  }

  /* ───────────── Planos de corte (F1.6) ───────────── */
  initClippingControls() {
    const axisSeg = document.getElementById('clipAxisSeg');
    const slider = document.getElementById('clipSlider');
    if (!axisSeg) return;

    axisSeg.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      this.clipping.setAxis(btn.dataset.axis);
      this.clipping.setOffset(0);
      this.syncClipUi();
      this.afterClipChange();
    });
    slider?.addEventListener('input', () => {
      this.clipping.setOffset(parseFloat(slider.value));
      this.afterClipChange();
    });
    document.getElementById('clipInvert')?.addEventListener('click', () => {
      this.clipping.toggleInvert();
      this.syncClipUi();
      this.afterClipChange();
    });
    document.getElementById('clipReset')?.addEventListener('click', () => this.resetClip());
  }

  resetClip() {
    this.clipping.reset();
    this.syncClipUi();
    this.afterClipChange();
  }

  afterClipChange() {
    this.updateClipChip();
    this.scheduleViewUpdate();
  }

  syncClipUi() {
    const c = this.clipping;
    document.querySelectorAll('#clipAxisSeg button').forEach((b) => {
      const on = b.dataset.axis === c.activeAxis;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const box = document.getElementById('clipSliderBox');
    if (box) box.hidden = !c.active;
    const slider = document.getElementById('clipSlider');
    if (slider) slider.value = String(c.sliderValue);
    const inv = document.getElementById('clipInvert');
    if (inv) inv.setAttribute('aria-pressed', String(c.inverted));
    this.updateClipChip();
  }

  updateClipChip() {
    const c = this.clipping;
    this.clipChip.hidden = !c.active || !!this.app.state.quiz;
    if (c.active) this.clipChip.textContent = `✂ Corte ${AXIS_LABEL[c.activeAxis]} ativo · desativar`;
  }

  /* ───────────── Coloração (F1.7) ───────────── */
  initColoringControls() {
    const container = document.getElementById('colorModes');
    if (!container) return;
    container.innerHTML = MODES.map(([mode, label]) => {
      const desc = {
        camada: 'Cores por profundidade da dissecação (padrão).',
        nervo: 'Músculos inervados pelo mesmo nervo (o principal) têm a mesma cor.',
        regiao: 'Cabeça e pescoço, tronco e membro superior em cores diferentes.',
        grupo: 'Mímica, mastigação, manguito, compartimentos do braço e antebraço, mão e outros.',
      }[mode];
      return `<button type="button" class="mode-card" data-color="${mode}" role="radio" aria-checked="false"><b>${esc(label)}</b><span>${esc(desc)}</span></button>`;
    }).join('');
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-card');
      if (!btn) return;
      this.coloring.setMode(btn.dataset.color);
      this.syncColorUi();
      this.scheduleViewUpdate();
    });
    this.coloring.onChange = () => this.updateLegend();
    this.syncColorUi();
  }

  syncColorUi() {
    document.querySelectorAll('#colorModes .mode-card').forEach((b) => {
      const on = b.dataset.color === this.coloring.mode;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', String(on));
    });
  }

  updateLegend() {
    const el = this.legendEl;
    if (!el) return;
    if (this.coloring.mode === 'camada' || this.app.state.quiz) { el.hidden = true; return; }
    const entries = this.coloring.legend(this.app.state.region);
    const title = MODES.find(([m]) => m === this.coloring.mode)?.[1] ?? '';
    el.hidden = false;
    el.innerHTML = `
      <div class="legend-head"><strong>${esc(title)}</strong><button type="button" class="link" id="legendReset">padrão</button></div>
      <ul>${entries.length
        ? entries.map((e) => `<li><i style="background:${esc(e.color)}"></i><span>${esc(e.label)}</span><small>${e.n}</small></li>`).join('')
        : '<li class="empty-view">Nada para mostrar nesta região (ou ainda carregando).</li>'}</ul>`;
    el.querySelector('#legendReset').onclick = () => { this.coloring.setMode('camada'); this.syncColorUi(); this.scheduleViewUpdate(); };
  }

  /* ───────────── Backup e vistas salvas (F1.1, F1.2) ───────────── */
  initBackupAndSavedViews() {
    document.getElementById('btnExportJson')?.addEventListener('click', () => {
      const blob = new Blob([this.userData.exportJson()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anatomia3d-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Backup exportado.');
    });

    const fileImport = document.getElementById('fileImportJson');
    fileImport?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = this.userData.importJson(String(evt.target.result));
        if (res.success) {
          const c = res.counts;
          showToast(`Backup importado: ${c.favoritos} favoritos, ${c.anotacoes} anotações, ${c.progresso} estruturas com progresso, ${c.vistas} vistas, ${c.listas} listas.`);
          this.app.syncList?.();
          this.renderSavedViews();
          this.lists.render();
          this.progress.render();
        } else {
          showToast(`Falha ao importar: ${res.error}`);
        }
      };
      reader.onerror = () => showToast('Não foi possível ler o arquivo.');
      reader.readAsText(file);
      fileImport.value = '';
    });

    const nameInput = document.getElementById('newViewName');
    const save = () => {
      const name = nameInput?.value.trim() || `Vista ${new Date().toLocaleTimeString('pt-BR')}`;
      this.userData.saveView(name, this.currentHash());
      if (nameInput) nameInput.value = '';
      this.renderSavedViews();
      showToast('Vista salva.');
    };
    document.getElementById('btnSaveCurrentView')?.addEventListener('click', save);
    nameInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } });

    document.getElementById('savedViewsList')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const item = this.userData.getSavedViews().find((v) => v.id === btn.dataset.id);
      if (!item) return;
      if (btn.dataset.act === 'apply') {
        const st = parseViewState(item.state);
        this.closeModal();
        applyViewState(this.app, st ?? {}, { studyController: this });
        showToast(`Vista “${item.name}” restaurada.`);
      } else if (btn.dataset.act === 'delete') {
        this.userData.deleteView(item.id);
        this.renderSavedViews();
      }
    });
  }

  renderSavedViews() {
    const list = document.getElementById('savedViewsList');
    if (!list) return;
    const views = this.userData.getSavedViews();
    if (!views.length) {
      list.innerHTML = '<li class="empty-view">Nenhuma vista salva ainda. Ajuste a câmera, as camadas e a seleção e salve acima.</li>';
      return;
    }
    list.innerHTML = views.map((v) => `
      <li class="saved-view-item">
        <div class="view-info">
          <strong>${esc(v.name)}</strong>
          <small>${new Date(v.createdAt).toLocaleDateString('pt-BR')}</small>
        </div>
        <div class="view-actions">
          <button type="button" class="btn" data-act="apply" data-id="${esc(v.id)}">Restaurar</button>
          <button type="button" class="btn" data-act="delete" data-id="${esc(v.id)}" aria-label="Excluir a vista ${esc(v.name)}">Excluir</button>
        </div>
      </li>`).join('');
  }

  /* ───────────── Botões rápidos: captura e link ───────────── */
  initQuickButtons() {
    document.getElementById('btnCapture')?.addEventListener('click', () => {
      const ok = exportSnapshotPng(this.app.renderer, this.app.scene, this.app.camera);
      showToast(ok ? 'Imagem PNG salva.' : 'Não foi possível exportar a imagem.');
    });
    document.getElementById('btnShareLink')?.addEventListener('click', async () => {
      const res = await copyShareLink(this.app, this.app.camera, this.app.controls, this.viewExtra());
      if (!res.success) showToast('Não foi possível copiar. O endereço da vista está na barra de endereços.');
      else showToast(res.local ? 'Link copiado. Ele só abre neste computador (arquivo local); para compartilhar, use a versão web.' : 'Link da vista copiado.');
    });
  }

  /* ───────────── Ficha: favorito, impressão e anotações (F1.2, F1.9) ───────────── */
  renderCardExtensions(id, container) {
    const fav = this.userData.isFavorite(id);
    const el = document.createElement('div');
    el.className = 'card-study-ext';
    el.innerHTML = `
      <div class="card-ext-actions">
        <button type="button" class="btn btn-fav ${fav ? 'active' : ''}" id="btnFav" aria-pressed="${fav}">
          <span class="star">${fav ? '★' : '☆'}</span> <span class="fav-label">${fav ? 'Favorito' : 'Favoritar'}</span>
        </button>
        <button type="button" class="btn" id="btnPrintCard" title="Imprimir a ficha">🖨 Imprimir</button>
      </div>
      <div class="note-box">
        <label for="structureNote"><b>Minhas anotações</b></label>
        <textarea id="structureNote" placeholder="Escreva observações pessoais ou mnemônicos sobre esta estrutura…"></textarea>
      </div>`;
    const area = el.querySelector('#structureNote');
    area.value = this.userData.getNote(id); // por propriedade: o texto nunca é interpretado como HTML

    el.querySelector('#btnFav').onclick = () => {
      const on = this.userData.toggleFavorite(id);
      const btn = el.querySelector('#btnFav');
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('.star').textContent = on ? '★' : '☆';
      btn.querySelector('.fav-label').textContent = on ? 'Favorito' : 'Favoritar';
      this.app.syncList?.();
    };
    el.querySelector('#btnPrintCard').onclick = () => printCurrentCard();

    let timer = null;
    const flush = () => { clearTimeout(timer); this.userData.setNote(id, area.value); };
    area.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(flush, 350); });
    area.addEventListener('blur', flush);
    container.appendChild(el);
  }
}
