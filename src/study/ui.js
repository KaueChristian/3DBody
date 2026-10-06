/**
 * Controlador de Interface das Ferramentas de Estudo (F1.1 a F1.10).
 * Integra os submódulos de estudo à cena e aos elementos do DOM sem inflar o main.js.
 */
import { userData } from './storage.js';
import { getDueStructureIds, getWeakStructureIds } from './sm2.js';
import { encodeViewState, parseViewState, applyViewState, copyShareLink } from './views.js';
import { ClippingManager } from './clipping.js';
import { ColoringManager } from './coloring.js';
import { TextQuizGenerator } from './text-quiz.js';
import { TOURS } from './tours.js';
import { exportSnapshotPng, printCurrentCard } from './export.js';

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.remove('active');
  void toast.offsetWidth;
  toast.classList.add('active');
  setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

export class StudyController {
  /**
   * @param {object} app - Objeto da aplicação (state, M, camera, controls, etc.)
   */
  constructor(app) {
    this.app = app;
    this.userData = userData;
    this.clipping = new ClippingManager(app.renderer);
    this.coloring = new ColoringManager(app.M, app.INNERVATION);
    this.textQuiz = new TextQuizGenerator(app.ITEMS, app.INNERVATION, app.M);

    this.activeTour = null;
    this.tourStepIndex = 0;
    this.textQuizState = null;

    this.initElements();
    this.bindEvents();
    this.initModal();
    this.initQuickButtons();
    this.checkInitialHash();
  }

  initElements() {
    this.tourBox = document.getElementById('tourBox');
    if (!this.tourBox) {
      this.tourBox = document.createElement('div');
      this.tourBox.id = 'tourBox';
      this.tourBox.className = 'tour-box';
      this.tourBox.hidden = true;
      const stage = document.getElementById('stage') || document.body;
      stage.appendChild(this.tourBox);
    }
  }

  bindEvents() {
    // Monitora mudanças no hash da URL para navegação direta (F1.1)
    window.addEventListener('hashchange', () => {
      const stateObj = parseViewState(window.location.hash);
      if (stateObj) applyViewState(this.app, stateObj);
    });

    // Atualiza o hash quando a vista ou seleção mudar significativamente
    if (this.app.controls) {
      this.app.controls.addEventListener('end', () => {
        this.updateUrlHashSilently();
      });
    }
  }

  checkInitialHash() {
    if (window.location.hash) {
      setTimeout(() => {
        const stateObj = parseViewState(window.location.hash);
        if (stateObj) applyViewState(this.app, stateObj);
      }, 500);
    }
  }

  updateUrlHashSilently() {
    if (this.app.state.quiz || this.activeTour) return;
    const hash = encodeViewState(this.app, this.app.camera, this.app.controls);
    if (hash) {
      history.replaceState(null, '', '#' + hash);
    }
  }

  // --- Modal de Ferramentas de Estudo ---
  initModal() {
    this.studyModal = document.getElementById('studyModal');
    const btnStudy = document.getElementById('btnStudy');
    const studyClose = document.getElementById('studyClose');

    if (btnStudy) {
      btnStudy.onclick = () => this.openModal();
    }
    if (studyClose) {
      studyClose.onclick = () => this.closeModal();
    }
    if (this.studyModal) {
      this.studyModal.addEventListener('click', (e) => {
        if (e.target === this.studyModal) this.closeModal();
      });
    }

    // Abas do modal
    const tabs = document.querySelectorAll('#studyModal .tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('on');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('on');
        tab.setAttribute('aria-selected', 'true');

        const tabId = tab.dataset.tab;
        document.querySelectorAll('#studyModal .tab-pane').forEach((pane) => {
          pane.hidden = true;
          pane.classList.remove('on');
        });
        const activePane = document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
        if (activePane) {
          activePane.hidden = false;
          activePane.classList.add('on');
        }
      });
    });

    this.renderToursList();
    this.initClippingControls();
    this.initColoringControls();
    this.initBackupAndSavedViews();
  }

  openModal() {
    if (!this.studyModal) return;
    this.studyModal.hidden = false;
    this.renderSavedViews();
  }

  closeModal() {
    if (!this.studyModal) return;
    this.studyModal.hidden = true;
  }

  // --- F1.8: Tours Guiados ---
  renderToursList() {
    const container = document.getElementById('toursList');
    if (!container) return;

    container.innerHTML = TOURS.map((tour) => `
      <div class="tour-card">
        <div class="tour-card-head">
          <h4>${tour.title}</h4>
          <span class="tour-steps-count">${tour.steps.length} passos</span>
        </div>
        <p class="tour-desc">${tour.description}</p>
        <button type="button" class="primary btn-start-tour" data-tour="${tour.id}">Iniciar Tour</button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-start-tour').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tourId = btn.dataset.tour;
        this.closeModal();
        this.startTour(tourId);
      });
    });
  }

  startTour(tourId) {
    const tour = TOURS.find((t) => t.id === tourId);
    if (!tour) return;

    this.activeTour = tour;
    this.tourStepIndex = 0;
    this.app.select(null, { fly: false });
    this.renderTourStep();
  }

  renderTourStep() {
    if (!this.activeTour) return;
    const step = this.activeTour.steps[this.tourStepIndex];
    if (!step) return;

    if (step.region && step.region !== this.app.state.region) {
      this.app.setRegion(step.region, { fly: false });
    }
    if (typeof step.dissect === 'number') {
      this.app.setDissect(step.dissect);
    }
    if (step.cam && this.app.camera && this.app.controls) {
      this.app.camera.position.set(...step.cam.pos);
      this.app.controls.target.set(...step.cam.target);
      this.app.controls.update();
    }
    if (step.highlight && this.app.M.has(step.highlight)) {
      setTimeout(() => this.app.select(step.highlight, { fly: false, panel: false }), 200);
    }

    const total = this.activeTour.steps.length;
    this.tourBox.hidden = false;
    this.tourBox.innerHTML = `
      <div class="tour-head">
        <span class="tour-badge">${this.activeTour.title} (${this.tourStepIndex + 1}/${total})</span>
        <button class="close" id="tourClose" aria-label="Sair do tour">×</button>
      </div>
      <h3 class="tour-title">${step.title}</h3>
      <p class="tour-text">${step.text}</p>
      <div class="tour-actions">
        <button class="btn" id="tourPrev" ${this.tourStepIndex === 0 ? 'disabled' : ''}>← Anterior</button>
        <button class="primary" id="tourNext">${this.tourStepIndex === total - 1 ? 'Concluir' : 'Próximo →'}</button>
      </div>
    `;

    this.tourBox.querySelector('#tourClose').onclick = () => this.stopTour();
    this.tourBox.querySelector('#tourPrev').onclick = () => {
      if (this.tourStepIndex > 0) {
        this.tourStepIndex--;
        this.renderTourStep();
      }
    };
    this.tourBox.querySelector('#tourNext').onclick = () => {
      if (this.tourStepIndex < total - 1) {
        this.tourStepIndex++;
        this.renderTourStep();
      } else {
        this.stopTour();
      }
    };
  }

  stopTour() {
    this.activeTour = null;
    this.tourBox.hidden = true;
    this.app.select(null, { fly: false });
  }

  // --- F1.6: Planos de Corte ---
  initClippingControls() {
    const axisSeg = document.getElementById('clipAxisSeg');
    const sliderBox = document.getElementById('clipSliderBox');
    const slider = document.getElementById('clipSlider');
    const btnInvert = document.getElementById('clipInvert');
    const btnReset = document.getElementById('clipReset');

    if (!axisSeg) return;

    axisSeg.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      axisSeg.querySelectorAll('button').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      const axis = btn.dataset.axis;
      this.clipping.setAxis(axis);
      if (sliderBox) sliderBox.hidden = axis === 'none';
      if (slider) slider.value = '0';
    });

    if (slider) {
      slider.addEventListener('input', () => {
        this.clipping.setOffset(parseFloat(slider.value));
      });
    }

    if (btnInvert) {
      btnInvert.addEventListener('click', () => {
        this.clipping.toggleInvert();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.clipping.reset();
        axisSeg.querySelectorAll('button').forEach((b) => b.classList.remove('on'));
        const noneBtn = axisSeg.querySelector('[data-axis="none"]');
        if (noneBtn) noneBtn.classList.add('on');
        if (sliderBox) sliderBox.hidden = true;
        if (slider) slider.value = '0';
      });
    }
  }

  // --- F1.7: Coloração do Modelo ---
  initColoringControls() {
    const modesContainer = document.getElementById('colorModes');
    if (!modesContainer) return;

    modesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-card');
      if (!btn) return;
      modesContainer.querySelectorAll('.mode-card').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      const mode = btn.dataset.color;
      this.coloring.setMode(mode);
    });
  }

  // --- F1.2 / F1.10: Backup & Vistas Salvas ---
  initBackupAndSavedViews() {
    const btnExport = document.getElementById('btnExportJson');
    const fileImport = document.getElementById('fileImportJson');
    const btnSaveView = document.getElementById('btnSaveCurrentView');
    const inputViewName = document.getElementById('newViewName');

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const json = this.userData.exportJson();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `anatomia3d-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Backup exportado com sucesso!');
      });
    }

    if (fileImport) {
      fileImport.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const res = this.userData.importJson(evt.target.result);
          if (res.success) {
            showToast(`Backup importado! (${res.count} itens restaurados)`);
            if (this.app.syncList) this.app.syncList();
            this.renderSavedViews();
          } else {
            showToast(`Falha ao importar: ${res.error}`);
          }
        };
        reader.readAsText(file);
        fileImport.value = '';
      });
    }

    if (btnSaveView) {
      btnSaveView.addEventListener('click', () => {
        const name = (inputViewName ? inputViewName.value.trim() : '') || `Vista ${new Date().toLocaleTimeString()}`;
        const hash = encodeViewState(this.app, this.app.camera, this.app.controls);
        this.userData.saveView(name, hash);
        if (inputViewName) inputViewName.value = '';
        this.renderSavedViews();
        showToast('Vista salva com sucesso!');
      });
    }
  }

  renderSavedViews() {
    const list = document.getElementById('savedViewsList');
    if (!list) return;

    const views = this.userData.getSavedViews();
    if (!views.length) {
      list.innerHTML = '<li class="empty-view">Nenhuma vista salva ainda. Ajuste a câmera e salve acima!</li>';
      return;
    }

    list.innerHTML = views.map((v) => `
      <li class="saved-view-item">
        <div class="view-info">
          <strong>${v.name}</strong>
          <small>${new Date(v.createdAt).toLocaleDateString()}</small>
        </div>
        <div class="view-actions">
          <button type="button" class="btn btn-apply-view" data-id="${v.id}">Restaurar</button>
          <button type="button" class="btn btn-del-view" data-id="${v.id}">Excluir</button>
        </div>
      </li>
    `).join('');

    list.querySelectorAll('.btn-apply-view').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = views.find((v) => v.id === btn.dataset.id);
        if (item) {
          const stateObj = parseViewState(item.state);
          if (stateObj) applyViewState(this.app, stateObj);
          this.closeModal();
          showToast(`Vista "${item.name}" restaurada.`);
        }
      });
    });

    list.querySelectorAll('.btn-del-view').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.userData.deleteView(btn.dataset.id);
        this.renderSavedViews();
      });
    });
  }

  // --- Botões Rápidos da Barra Superior (Captura & Compartilhamento) ---
  initQuickButtons() {
    const btnCapture = document.getElementById('btnCapture');
    const btnShare = document.getElementById('btnShareLink');

    if (btnCapture) {
      btnCapture.addEventListener('click', () => {
        const ok = exportSnapshotPng(this.app.renderer, this.app.scene, this.app.camera);
        if (ok) showToast('Captura PNG salva no seu computador!');
        else showToast('Não foi possível exportar a captura.');
      });
    }

    if (btnShare) {
      btnShare.addEventListener('click', async () => {
        const res = await copyShareLink(this.app, this.app.camera, this.app.controls);
        if (res.success) {
          showToast('Link da vista atual copiado!');
        } else {
          showToast('Link gerado na URL da barra de endereços.');
        }
      });
    }
  }

  // --- F1.2: Favoritos e Anotações na Ficha ---
  renderCardExtensions(id, container) {
    const isFav = this.userData.isFavorite(id);
    const noteText = this.userData.getNote(id);

    const extEl = document.createElement('div');
    extEl.className = 'card-study-ext';
    extEl.innerHTML = `
      <div class="card-ext-actions">
        <button class="btn btn-fav ${isFav ? 'active' : ''}" id="btnFav" title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          <span class="star">${isFav ? '★' : '☆'}</span> ${isFav ? 'Favorito' : 'Favoritar'}
        </button>
        <button class="btn" id="btnPrintCard" title="Imprimir ficha de estudo">
          🖨 Imprimir
        </button>
      </div>
      <div class="note-box">
        <label for="structureNote"><b>Minhas Anotações</b></label>
        <textarea id="structureNote" placeholder="Escreva observações pessoais ou mnemônicos sobre esta estrutura…">${noteText}</textarea>
      </div>
    `;

    extEl.querySelector('#btnFav').onclick = () => {
      const active = this.userData.toggleFavorite(id);
      const btn = extEl.querySelector('#btnFav');
      btn.classList.toggle('active', active);
      btn.querySelector('.star').textContent = active ? '★' : '☆';
      btn.childNodes[2].textContent = active ? ' Favorito' : ' Favoritar';
      if (this.app.syncList) this.app.syncList();
    };

    extEl.querySelector('#btnPrintCard').onclick = () => printCurrentCard();

    const noteArea = extEl.querySelector('#structureNote');
    let timer = null;
    noteArea.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.userData.setNote(id, noteArea.value);
      }, 350);
    });

    container.appendChild(extEl);
  }

  // --- F1.5: Quiz Teórico de Texto ---
  startTextQuiz(setup) {
    this.textQuizState = {
      score: 0,
      total: 0,
      setup,
      answered: false,
      currentQuestion: null,
    };

    const textQuizEl = document.getElementById('textQuiz');
    const quizEl = document.getElementById('quiz');
    const locEl = document.getElementById('locate');
    const resultEl = document.getElementById('quizResult');

    if (quizEl) quizEl.hidden = true;
    if (locEl) locEl.hidden = true;
    if (resultEl) resultEl.hidden = true;
    if (textQuizEl) textQuizEl.hidden = false;

    const exitBtn = document.getElementById('tqExit');
    if (exitBtn) {
      exitBtn.onclick = () => this.stopTextQuiz();
    }

    this.nextTextQuestion();
  }

  nextTextQuestion() {
    if (!this.textQuizState) return;
    const qState = this.textQuizState;
    const question = this.textQuiz.generateQuestion('any', qState.setup.region || 'todos');
    qState.currentQuestion = question;
    qState.answered = false;

    const promptEl = document.getElementById('tqPrompt');
    const scoreEl = document.getElementById('tqScore');
    const optionsEl = document.getElementById('tqOptions');
    const feedbackEl = document.getElementById('tqFeedback');

    if (promptEl) promptEl.innerHTML = question.prompt;
    if (scoreEl) scoreEl.textContent = `${qState.score}/${qState.total}`;
    if (feedbackEl) feedbackEl.innerHTML = '';

    if (question.targetId && this.app.M.has(question.targetId)) {
      this.app.select(question.targetId, { fly: true, panel: false });
    }

    if (optionsEl) {
      optionsEl.innerHTML = question.options.map((opt, idx) => `
        <button type="button" data-id="${opt.id}">
          <span class="kbadge">${idx + 1}</span>${opt.text}
        </button>
      `).join('');

      optionsEl.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.answerTextQuestion(btn.dataset.id);
        });
      });
    }
  }

  answerTextQuestion(chosenId) {
    const qState = this.textQuizState;
    if (!qState || qState.answered) return;
    qState.answered = true;
    qState.total++;

    const q = qState.currentQuestion;
    const isCorrect = chosenId === q.correctId;
    if (isCorrect) qState.score++;

    // Salva progresso no SM-2
    if (q.targetId) {
      this.userData.recordQuizResult(q.targetId, isCorrect ? 5 : 1);
    }

    const optionsEl = document.getElementById('tqOptions');
    if (optionsEl) {
      optionsEl.querySelectorAll('button').forEach((btn) => {
        btn.disabled = true;
        if (btn.dataset.id === q.correctId) btn.classList.add('right');
        else if (btn.dataset.id === chosenId) btn.classList.add('wrong');
      });
    }

    const scoreEl = document.getElementById('tqScore');
    if (scoreEl) scoreEl.textContent = `${qState.score}/${qState.total}`;

    const feedbackEl = document.getElementById('tqFeedback');
    if (feedbackEl) {
      feedbackEl.innerHTML = `
        <span>${isCorrect ? '✔ Correto!' : '✘ Incorreto.'} ${q.explanation}</span>
        <button type="button" class="primary" id="tqNext">Próxima</button>
      `;
      const nextBtn = feedbackEl.querySelector('#tqNext');
      if (nextBtn) {
        nextBtn.onclick = () => this.nextTextQuestion();
        nextBtn.focus();
      }
    }
  }

  stopTextQuiz() {
    this.textQuizState = null;
    const textQuizEl = document.getElementById('textQuiz');
    if (textQuizEl) textQuizEl.hidden = true;
    this.app.select(null, { fly: false });
  }

  // --- F1.4: Repetição Espaçada & Pontos Fracos ---
  getDueIds() {
    const allIds = Array.from(this.app.M.keys());
    return getDueStructureIds(this.userData.progress, allIds);
  }

  getWeakIds() {
    const allIds = Array.from(this.app.M.keys());
    return getWeakStructureIds(this.userData.progress, allIds);
  }
}
