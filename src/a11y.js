/**
 * Acessibilidade de leitura e visualização (conforto ocular, midríase/fotofobia, baixa visão, dislexia, daltonismo e voz).
 *
 * Tudo funciona 100% offline (sem CDN nem fontes externas): usa pilhas tipográficas locais de alta legibilidade,
 * variáveis CSS no documento (`data-theme`, `--text-scale`, etc.) e a Web Speech API nativa do sistema para leitura em
 * voz alta (PT-BR). As preferências ficam salvas apenas neste navegador (`localStorage`, sempre em `try/catch`).
 */
import { esc } from './study/util.js';

export const A11Y_KEY = 'anatomia3d.a11y.v1';

export const THEMES = ['dark', 'sepia', 'light', 'hc-dark', 'hc-light'];
export const TEXT_SCALES = [1, 1.15, 1.3, 1.5, 1.75];
export const FONTS = ['default', 'sans', 'dyslexia'];
export const SPEECH_RATES = [0.85, 1, 1.2, 1.4];

export const A11Y_DEFAULTS = Object.freeze({
  theme: 'dark',
  textScale: 1,
  spacing: false,
  font: 'default',
  strongText: false,
  solidPanels: false,
  wideCard: false,
  dimGlare: false,
  readingGuide: false,
  colorblind: false,
  reduceMotion: false,
  speechRate: 1,
});

export const THEME_META = [
  { id: 'dark', label: 'Escuro', desc: 'Padrão', themeColor: '#0E0F12', swatch: ['#181A1F', '#ECEEF2', '#EBA83A'] },
  { id: 'sepia', label: 'Sépia', desc: 'Conforto ocular', themeColor: '#EDE6D6', swatch: ['#F5EFE2', '#1B1712', '#8B4D00'] },
  { id: 'light', label: 'Claro', desc: 'Papel neutro', themeColor: '#F3F5F8', swatch: ['#FFFFFF', '#12151A', '#8C4E00'] },
  { id: 'hc-dark', label: 'Alto contraste escuro', desc: 'Preto e branco', themeColor: '#000000', swatch: ['#08090C', '#FFFFFF', '#FFD84D'] },
  { id: 'hc-light', label: 'Alto contraste claro', desc: 'Branco e preto', themeColor: '#FFFFFF', swatch: ['#FFFFFF', '#000000', '#0046A8'] },
];

export const A11Y_PRESETS = [
  {
    id: 'midriase',
    label: 'Conforto ocular (pupila dilatada / fotofobia)',
    desc: 'Fundo sépia suave sem ofuscamento, texto 130%, traço encorpado, sem itálico, painéis opacos, ficha ampla e menos brilho no 3D.',
    values: {
      theme: 'sepia',
      textScale: 1.3,
      spacing: true,
      font: 'sans',
      strongText: true,
      solidPanels: true,
      wideCard: true,
      dimGlare: true,
      readingGuide: true,
    },
  },
  {
    id: 'alto_contraste',
    label: 'Alto contraste (baixa visão)',
    desc: 'Fundo preto puro, letras brancas reforçadas, bordas nítidas, texto 130% e ficha ampla.',
    values: {
      theme: 'hc-dark',
      textScale: 1.3,
      spacing: true,
      font: 'sans',
      strongText: true,
      solidPanels: true,
      wideCard: true,
      dimGlare: false,
      readingGuide: false,
    },
  },
  {
    id: 'leitura',
    label: 'Leitura focada (dislexia / fadiga)',
    desc: 'Papel sépia, fonte espaçada sem itálico, espaçamento amplo entre linhas e guia de leitura.',
    values: {
      theme: 'sepia',
      textScale: 1.15,
      spacing: true,
      font: 'dyslexia',
      strongText: true,
      solidPanels: true,
      wideCard: true,
      dimGlare: false,
      readingGuide: true,
    },
  },
];

const nearest = (val, allowed, fallback) => {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return allowed.reduce((best, cur) => (Math.abs(cur - n) < Math.abs(best - n) ? cur : best), allowed[0]);
};

/** Normaliza qualquer entrada vinda do armazenamento para valores válidos e seguros. */
export function sanitizeA11y(input) {
  const d = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  return {
    theme: THEMES.includes(d.theme) ? d.theme : A11Y_DEFAULTS.theme,
    textScale: nearest(d.textScale, TEXT_SCALES, A11Y_DEFAULTS.textScale),
    spacing: Boolean(d.spacing),
    font: FONTS.includes(d.font) ? d.font : A11Y_DEFAULTS.font,
    strongText: Boolean(d.strongText),
    solidPanels: Boolean(d.solidPanels),
    wideCard: Boolean(d.wideCard),
    dimGlare: Boolean(d.dimGlare),
    readingGuide: Boolean(d.readingGuide),
    colorblind: Boolean(d.colorblind),
    reduceMotion: Boolean(d.reduceMotion),
    speechRate: nearest(d.speechRate, SPEECH_RATES, A11Y_DEFAULTS.speechRate),
  };
}

export function isDefaultA11y(prefs) {
  return Object.keys(A11Y_DEFAULTS).every((k) => prefs[k] === A11Y_DEFAULTS[k]);
}

export function activePresetId(prefs) {
  for (const p of A11Y_PRESETS) {
    if (Object.entries(p.values).every(([k, v]) => prefs[k] === v)) return p.id;
  }
  return null;
}

export function stepTextScale(current, delta) {
  const cur = nearest(current, TEXT_SCALES, 1);
  const idx = TEXT_SCALES.indexOf(cur);
  const next = Math.max(0, Math.min(TEXT_SCALES.length - 1, idx + Math.sign(delta)));
  return TEXT_SCALES[next];
}

/**
 * Monta o texto limpo de uma ficha anatômica para leitura em voz alta (PT-BR).
 * @param {object} item entrada do catálogo
 * @param {(item:object)=>[string,string][]} [getFields] função que devolve os campos exibidos na ficha
 * @param {string} [kindLabel] rótulo legível do tipo (ex.: "Músculo")
 */
export function buildCardSpeechText(item, getFields, kindLabel = '') {
  if (!item) return '';
  const parts = [];
  const head = [item.name, kindLabel ? `(${kindLabel})` : ''].filter(Boolean).join(' ');
  if (head) parts.push(`${head}.`);
  const fields = typeof getFields === 'function' ? getFields(item) : (item.campos ?? []);
  for (const [k, v] of fields) {
    if (k && v) parts.push(`${k}: ${v}.`);
  }
  if (item.nota) parts.push(`Para lembrar: ${item.nota}.`);
  if (item.expressao) parts.push(`Expressão ou função: ${item.expressao}.`);
  return parts.join(' ').replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').trim();
}

/**
 * Divide textos longos em trechos curtos nas pausas de pontuação.
 * Evita um limite conhecido do Chrome/Edge em que falas muito longas travam após ~15 segundos.
 */
export function splitSpeechChunks(text, maxLen = 220) {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  const sentences = clean.split(/(?<=[.!?;\n])\s+/).filter(Boolean);
  const out = [];
  let buf = '';
  const pushBuf = () => { if (buf.trim()) { out.push(buf.trim()); buf = ''; } };
  for (const s of sentences) {
    if (s.length > maxLen) {
      pushBuf();
      const words = s.split(/\s+/);
      for (const w of words) {
        if (buf.length + w.length + 1 > maxLen && buf) pushBuf();
        buf = buf ? `${buf} ${w}` : w;
      }
      pushBuf();
    } else if (buf.length + s.length + 1 > maxLen) {
      pushBuf();
      buf = s;
    } else {
      buf = buf ? `${buf} ${s}` : s;
    }
  }
  pushBuf();
  return out;
}

function defaultStore() {
  try { return window.localStorage; } catch { return null; }
}

export function loadA11y(store) {
  const st = store === undefined ? defaultStore() : store;
  try {
    const raw = st?.getItem(A11Y_KEY);
    if (!raw) return { ...A11Y_DEFAULTS };
    return sanitizeA11y(JSON.parse(raw));
  } catch {
    return { ...A11Y_DEFAULTS };
  }
}

export function saveA11y(prefs, store) {
  const st = store === undefined ? defaultStore() : store;
  try {
    st?.setItem(A11Y_KEY, JSON.stringify(sanitizeA11y(prefs)));
  } catch { /* modo privado ou armazenamento bloqueado: segue em memória */ }
}

/** Aplica tema e escala no `<html>` antes mesmo de o palco 3D terminar de montar (evita clarão na carga). */
export function applyRootAttributes(prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = prefs.theme;
  root.style.setProperty('--text-scale', String(prefs.textScale));
  root.dataset.textScale = String(prefs.textScale);

  const toggleAttr = (name, on, value = 'true') => {
    if (on) root.setAttribute(name, value);
    else root.removeAttribute(name);
  };
  toggleAttr('data-spacing', prefs.spacing, 'wide');
  toggleAttr('data-font', prefs.font !== 'default', prefs.font);
  toggleAttr('data-strong-text', prefs.strongText);
  toggleAttr('data-solid-panels', prefs.solidPanels || prefs.theme === 'hc-dark' || prefs.theme === 'hc-light');
  toggleAttr('data-wide-card', prefs.wideCard);
  toggleAttr('data-reading-guide', prefs.readingGuide);
  toggleAttr('data-colorblind', prefs.colorblind);
  toggleAttr('data-reduce-motion', prefs.reduceMotion);

  const meta = document.querySelector('meta[name="theme-color"]');
  const tm = THEME_META.find((t) => t.id === prefs.theme);
  if (meta && tm) meta.setAttribute('content', tm.themeColor);
}

/* ───────────────────────── Leitura em voz alta (Web Speech API, offline) ───────────────────────── */
class SpeechReader {
  constructor() {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';
    this.voice = null;
    this.activeBtn = null;
    this.activeIdleLabel = '';
    this.token = 0;
    if (this.supported) {
      this.pickVoice();
      try {
        window.speechSynthesis.addEventListener?.('voiceschanged', () => this.pickVoice());
      } catch { /* ignora */ }
    }
  }

  pickVoice() {
    if (!this.supported) return;
    try {
      const voices = window.speechSynthesis.getVoices() || [];
      this.voice = voices.find((v) => /^pt[-_]BR/i.test(v.lang))
        || voices.find((v) => /^pt/i.test(v.lang))
        || null;
    } catch { this.voice = null; }
  }

  get speaking() {
    return this.activeBtn !== null || (this.supported && Boolean(window.speechSynthesis.speaking));
  }

  setBtnState(btn, playing) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(playing));
    btn.classList.toggle('is-speaking', playing);
    const lbl = btn.querySelector('.speak-label');
    if (lbl) lbl.textContent = playing ? 'Parar' : (btn.dataset.idleLabel || 'Ouvir');
    const title = playing ? 'Parar a leitura em voz alta' : (btn.dataset.idleTitle || 'Ouvir em voz alta');
    btn.title = title;
    btn.setAttribute('aria-label', title);
  }

  stop() {
    this.token++;
    if (this.activeBtn) {
      this.setBtnState(this.activeBtn, false);
      this.activeBtn = null;
    }
    if (this.supported) {
      try { window.speechSynthesis.cancel(); } catch { /* ignora */ }
    }
  }

  /**
   * Lê `text` em português. Se o mesmo botão já estiver falando, interrompe.
   * @returns {boolean} true se iniciou leitura
   */
  toggle(text, { rate = 1, button = null } = {}) {
    if (!this.supported) return false;
    const same = button && this.activeBtn === button;
    this.stop();
    if (same) return false;
    const chunks = splitSpeechChunks(text);
    if (!chunks.length) return false;

    const myToken = this.token;
    this.activeBtn = button;
    this.setBtnState(button, true);
    if (!this.voice) this.pickVoice();

    let idx = 0;
    const next = () => {
      if (myToken !== this.token) return;
      if (idx >= chunks.length) {
        if (this.activeBtn === button) {
          this.setBtnState(button, false);
          this.activeBtn = null;
        }
        return;
      }
      const u = new window.SpeechSynthesisUtterance(chunks[idx++]);
      u.lang = this.voice?.lang || 'pt-BR';
      if (this.voice) u.voice = this.voice;
      u.rate = rate;
      u.onend = next;
      u.onerror = () => {
        if (myToken === this.token) this.stop();
      };
      try {
        window.speechSynthesis.speak(u);
      } catch {
        this.stop();
      }
    };
    next();
    return true;
  }
}

/* ───────────────────────── Controlador da interface ───────────────────────── */
const READING_SCOPE = '#info, #sidebar, .modal-card, #tourBox, #quiz, #locate, #textQuiz';

/**
 * Inicializa as preferências de acessibilidade, o painel na área lateral, a barra rápida da ficha,
 * a régua de leitura e a leitura em voz alta.
 */
export function createAccessibility({ onApply, getCardText, openArea, toggleArea, toast } = {}) {
  let prefs = loadA11y();
  applyRootAttributes(prefs);

  const speech = new SpeechReader();
  const pane = document.getElementById('a11yPane');
  const railBtn = document.getElementById('btnA11y');
  const liveEl = document.getElementById('a11yLive');
  const guideEl = document.getElementById('readingGuide');

  const announce = (msg) => {
    if (!liveEl || !msg) return;
    liveEl.textContent = '';
    setTimeout(() => { liveEl.textContent = msg; }, 20);
  };

  const pct = (s) => `${Math.round(s * 100)}%`;

  function apply(announceMsg = '') {
    applyRootAttributes(prefs);
    saveA11y(prefs);
    railBtn?.classList.toggle('has-prefs', !isDefaultA11y(prefs));
    if (guideEl && !prefs.readingGuide) guideEl.hidden = true;
    syncUi();
    onApply?.({ ...prefs });
    if (announceMsg) announce(announceMsg);
  }

  function update(patch, announceMsg = '') {
    prefs = sanitizeA11y({ ...prefs, ...patch });
    apply(announceMsg);
  }

  function applyPreset(id) {
    const preset = A11Y_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    prefs = sanitizeA11y({ ...prefs, ...preset.values });
    apply(`Perfil ativado: ${preset.label}.`);
    toast?.(`Perfil ativado: ${preset.label.split(' (')[0]}.`);
  }

  function reset() {
    speech.stop();
    prefs = { ...A11Y_DEFAULTS };
    apply('Configurações visuais restauradas para o padrão.');
    toast?.('Visual restaurado para o padrão.');
  }

  function stepScale(delta) {
    const next = stepTextScale(prefs.textScale, delta);
    if (next === prefs.textScale) return next;
    update({ textScale: next }, `Tamanho do texto: ${pct(next)}.`);
    return next;
  }

  /* ── Renderização do painel Acessibilidade (#a11yPane) ── */
  function buildPane() {
    if (!pane) return;
    pane.innerHTML = `
      <div class="a11y-block">
        <h3 class="a11y-sub">Perfis rápidos (1 clique)</h3>
        <div class="a11y-presets" role="group" aria-label="Perfis prontos de leitura">
          ${A11Y_PRESETS.map((p) => `
            <button type="button" class="a11y-preset" data-preset="${esc(p.id)}" aria-pressed="false">
              <b>${esc(p.label)}</b>
              <span>${esc(p.desc)}</span>
            </button>`).join('')}
        </div>
      </div>

      <div class="a11y-block">
        <h3 class="a11y-sub">Tamanho do texto</h3>
        <div class="a11y-stepper">
          <button type="button" class="btn" id="a11yScaleDown" aria-label="Diminuir tamanho do texto">A−</button>
          <output id="a11yScaleOut" aria-live="polite">100%</output>
          <button type="button" class="btn" id="a11yScaleUp" aria-label="Aumentar tamanho do texto">A+</button>
        </div>
        <div class="opt-seg a11y-scales" role="group" aria-label="Escala do texto">
          ${TEXT_SCALES.map((s) => `<button type="button" data-scale="${s}" aria-pressed="false">${pct(s)}</button>`).join('')}
        </div>
      </div>

      <div class="a11y-block">
        <h3 class="a11y-sub">Tema e contraste</h3>
        <div class="a11y-themes" role="radiogroup" aria-label="Esquema de cores">
          ${THEME_META.map((t) => `
            <button type="button" class="a11y-theme" role="radio" data-theme-opt="${esc(t.id)}" aria-checked="false">
              <span class="a11y-swatch" aria-hidden="true" style="--sw-bg:${t.swatch[0]};--sw-fg:${t.swatch[1]};--sw-ac:${t.swatch[2]}">Aa</span>
              <span class="a11y-theme-txt"><b>${esc(t.label)}</b><small>${esc(t.desc)}</small></span>
            </button>`).join('')}
        </div>
      </div>

      <div class="a11y-block">
        <h3 class="a11y-sub">Tipografia e leitura</h3>
        <div class="opt-seg a11y-fonts" role="radiogroup" aria-label="Fonte de leitura">
          <button type="button" role="radio" data-font-opt="default" aria-checked="false">Padrão</button>
          <button type="button" role="radio" data-font-opt="sans" aria-checked="false">Sem serifa</button>
          <button type="button" role="radio" data-font-opt="dyslexia" aria-checked="false">Dislexia</button>
        </div>
        <div class="a11y-toggles">
          ${toggleRow('strongText', 'Traço reforçado e sem itálico', 'Letras mais encorpadas e nomes em latim retos — reduz o borramento.')}
          ${toggleRow('spacing', 'Espaçamento amplo', 'Aumenta o espaço entre letras, palavras e linhas e evita cortar nomes.')}
          ${toggleRow('solidPanels', 'Painéis opacos', 'Remove transparências para o modelo 3D não atrapalhar a leitura.')}
          ${toggleRow('wideCard', 'Ficha ampla (modo leitura)', 'Alarga o painel da ficha para ler com mais conforto.')}
        </div>
      </div>

      <div class="a11y-block">
        <h3 class="a11y-sub">Conforto visual e foco</h3>
        <div class="a11y-toggles">
          ${toggleRow('dimGlare', 'Reduzir brilho do modelo 3D', 'Suaviza luzes e reflexos fortes (indicado para fotofobia e pupila dilatada).')}
          ${toggleRow('readingGuide', 'Guia de leitura', 'Destaca o parágrafo em foco e mostra uma faixa discreta ao acompanhar o texto.')}
          ${toggleRow('colorblind', 'Paleta para daltonismo', 'Troca verde/vermelho por azul/laranja com marcas visuais nos quizzes.')}
          ${toggleRow('reduceMotion', 'Reduzir animações', 'Desativa transições, tremores e movimentos longos da câmera.')}
        </div>
      </div>

      <div class="a11y-block" id="a11ySpeechBox"${speech.supported ? '' : ' hidden'}>
        <h3 class="a11y-sub">Leitura em voz alta (áudio)</h3>
        <p class="opt-desc">Ouça as fichas, os passos dos tours e as perguntas dos quizzes sem forçar a vista.</p>
        <div class="opt-seg a11y-rates" role="group" aria-label="Velocidade da voz">
          ${SPEECH_RATES.map((r) => `<button type="button" data-rate="${r}" aria-pressed="false">${String(r).replace('.', ',')}×</button>`).join('')}
        </div>
        <div class="a11y-speech-actions">
          <button type="button" class="btn" id="a11ySpeakCard" data-idle-label="Ouvir ficha aberta" data-idle-title="Ouvir a ficha da estrutura selecionada">🔊 <span class="speak-label">Ouvir ficha aberta</span></button>
          <button type="button" class="btn" id="a11ySpeakTest" data-idle-label="Testar voz" data-idle-title="Ouvir frase de teste">▶ <span class="speak-label">Testar voz</span></button>
        </div>
      </div>

      <div class="a11y-foot">
        <button type="button" class="btn wide" id="a11yReset">Restaurar padrão</button>
        <p class="a11y-tip">Preferências salvas automaticamente neste navegador. Atalho: <kbd>Alt</kbd>+<kbd>A</kbd>.</p>
      </div>`;

    pane.addEventListener('click', (e) => {
      const presetBtn = e.target.closest('[data-preset]');
      if (presetBtn) { applyPreset(presetBtn.dataset.preset); return; }

      const scaleBtn = e.target.closest('[data-scale]');
      if (scaleBtn) {
        const s = Number(scaleBtn.dataset.scale);
        update({ textScale: s }, `Tamanho do texto: ${pct(s)}.`);
        return;
      }

      const themeBtn = e.target.closest('[data-theme-opt]');
      if (themeBtn) {
        const tm = THEME_META.find((t) => t.id === themeBtn.dataset.themeOpt);
        update({ theme: themeBtn.dataset.themeOpt }, tm ? `Tema: ${tm.label}.` : '');
        return;
      }

      const fontBtn = e.target.closest('[data-font-opt]');
      if (fontBtn) {
        update({ font: fontBtn.dataset.fontOpt }, `Fonte alterada.`);
        return;
      }

      const rateBtn = e.target.closest('[data-rate]');
      if (rateBtn) {
        const r = Number(rateBtn.dataset.rate);
        update({ speechRate: r }, `Velocidade da voz: ${String(r).replace('.', ',')}x.`);
        return;
      }
    });

    pane.querySelector('#a11yScaleDown')?.addEventListener('click', () => stepScale(-1));
    pane.querySelector('#a11yScaleUp')?.addEventListener('click', () => stepScale(1));
    pane.querySelector('#a11yReset')?.addEventListener('click', reset);

    pane.querySelectorAll('input[data-a11y-toggle]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const k = inp.dataset.a11yToggle;
        update({ [k]: inp.checked });
      });
    });

    pane.querySelector('#a11ySpeakCard')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const text = getCardText?.() || '';
      if (!text) {
        toast?.('Selecione uma estrutura primeiro para ouvir a ficha.');
        return;
      }
      speech.toggle(text, { rate: prefs.speechRate, button: btn });
    });

    pane.querySelector('#a11ySpeakTest')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      speech.toggle('Leitura em voz alta ativada no Body3D. Você pode ouvir qualquer ficha anatômica, tour guiado ou pergunta do quiz.', { rate: prefs.speechRate, button: btn });
    });
  }

  function toggleRow(key, title, desc) {
    return `
      <label class="a11y-toggle">
        <span class="a11y-toggle-txt"><b>${esc(title)}</b><small>${esc(desc)}</small></span>
        <span class="switch"><input type="checkbox" data-a11y-toggle="${esc(key)}"><span></span></span>
      </label>`;
  }

  /* ── Barra rápida de leitura no topo da ficha (#info) ── */
  const infoFontDown = document.getElementById('infoFontDown');
  const infoFontUp = document.getElementById('infoFontUp');
  const infoWide = document.getElementById('infoWide');
  const infoSpeak = document.getElementById('infoSpeak');
  const infoOpenA11y = document.getElementById('infoOpenA11y');

  if (infoSpeak && !speech.supported) infoSpeak.hidden = true;
  infoFontDown?.addEventListener('click', () => stepScale(-1));
  infoFontUp?.addEventListener('click', () => stepScale(1));
  infoWide?.addEventListener('click', () => {
    const next = !prefs.wideCard;
    update({ wideCard: next }, next ? 'Ficha ampliada.' : 'Ficha no tamanho padrão.');
  });
  infoSpeak?.addEventListener('click', () => {
    const text = getCardText?.() || '';
    if (!text) return;
    speech.toggle(text, { rate: prefs.speechRate, button: infoSpeak });
  });
  infoOpenA11y?.addEventListener('click', () => openArea?.('acessibilidade'));

  /* ── Sincroniza controles com o estado atual ── */
  function syncUi() {
    if (pane) {
      const activeP = activePresetId(prefs);
      pane.querySelectorAll('[data-preset]').forEach((b) => {
        const on = b.dataset.preset === activeP;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const out = pane.querySelector('#a11yScaleOut');
      if (out) out.textContent = pct(prefs.textScale);
      const down = pane.querySelector('#a11yScaleDown');
      const up = pane.querySelector('#a11yScaleUp');
      if (down) down.disabled = prefs.textScale <= TEXT_SCALES[0];
      if (up) up.disabled = prefs.textScale >= TEXT_SCALES[TEXT_SCALES.length - 1];
      pane.querySelectorAll('[data-scale]').forEach((b) => {
        const on = Number(b.dataset.scale) === prefs.textScale;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      pane.querySelectorAll('[data-theme-opt]').forEach((b) => {
        const on = b.dataset.themeOpt === prefs.theme;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', String(on));
      });
      pane.querySelectorAll('[data-font-opt]').forEach((b) => {
        const on = b.dataset.fontOpt === prefs.font;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', String(on));
      });
      pane.querySelectorAll('input[data-a11y-toggle]').forEach((inp) => {
        inp.checked = Boolean(prefs[inp.dataset.a11yToggle]);
      });
      pane.querySelectorAll('[data-rate]').forEach((b) => {
        const on = Number(b.dataset.rate) === prefs.speechRate;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const resetBtn = pane.querySelector('#a11yReset');
      if (resetBtn) resetBtn.disabled = isDefaultA11y(prefs);
    }

    if (infoFontDown) infoFontDown.disabled = prefs.textScale <= TEXT_SCALES[0];
    if (infoFontUp) infoFontUp.disabled = prefs.textScale >= TEXT_SCALES[TEXT_SCALES.length - 1];
    if (infoWide) {
      infoWide.setAttribute('aria-pressed', String(prefs.wideCard));
      infoWide.classList.toggle('on', prefs.wideCard);
      const lbl = infoWide.querySelector('span');
      if (lbl) lbl.textContent = prefs.wideCard ? 'Normal' : 'Ampliar';
    }
  }

  /* ── Faixa de guia de leitura (só aparece quando o ponteiro está sobre texto) ── */
  if (guideEl) {
    const moveGuide = (ev) => {
      if (!prefs.readingGuide) { guideEl.hidden = true; return; }
      const panel = ev.target?.closest?.(READING_SCOPE);
      if (!panel) { guideEl.hidden = true; return; }
      const r = panel.getBoundingClientRect();
      guideEl.hidden = false;
      guideEl.style.left = `${Math.round(r.left)}px`;
      guideEl.style.width = `${Math.round(r.width)}px`;
      guideEl.style.top = `${Math.round(ev.clientY)}px`;
    };
    document.addEventListener('pointermove', moveGuide, { passive: true });
    document.addEventListener('pointerleave', () => { guideEl.hidden = true; });
  }

  /* ── Atalho de teclado: Alt+A abre/fecha Acessibilidade ── */
  window.addEventListener('keydown', (e) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      (toggleArea ?? openArea)?.('acessibilidade');
    }
  });

  buildPane();
  apply();

  return {
    getPrefs: () => ({ ...prefs }),
    update,
    applyPreset,
    reset,
    stepScale,
    speechSupported: speech.supported,
    speak: (text, button) => speech.toggle(text, { rate: prefs.speechRate, button }),
    stopSpeech: () => speech.stop(),
  };
}
