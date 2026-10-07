/**
 * Dados do estudante: favoritos, anotações, progresso (SM-2), vistas salvas, listas de estudo e histórico de
 * sessões (F1.2, F1.3, F1.4, F1.10). Tudo fica no `localStorage`, sem rede, e pode ser exportado/importado em JSON.
 *
 * O arquivo importado vem de fora, então passa por `sanitize`: só entram tipos esperados, com tamanho limitado.
 */
import { recordReview, createInitialCard } from './sm2.js';

export const STORAGE_KEY = 'anatomia3d.userdata.v1';
export const FORMAT = 'anatomia3d-userdata';
const MAX_SESSIONS = 100;
const MAX_NOTE = 5000;
const MAX_NAME = 80;
const MAX_VIEW_STATE = 4000;

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
const uid = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function sanitizeCard(c) {
  if (!isObj(c)) return null;
  const base = createInitialCard();
  return {
    attempts: Math.max(0, Math.trunc(num(c.attempts))),
    correct: Math.max(0, Math.trunc(num(c.correct))),
    reps: Math.max(0, Math.trunc(num(c.reps))),
    easeFactor: Math.min(4, Math.max(1.3, num(c.easeFactor, base.easeFactor))),
    intervalDays: Math.max(0, num(c.intervalDays)),
    lastDate: Math.max(0, num(c.lastDate)),
    nextDueDate: Math.max(0, num(c.nextDueDate)),
    recent: Array.isArray(c.recent) ? c.recent.filter((q) => Number.isFinite(q) && q >= 0 && q <= 5).slice(-5) : [],
  };
}

/** Reduz qualquer objeto de entrada ao formato conhecido; o que não reconhece é descartado. */
export function sanitize(input) {
  const d = isObj(input) ? input : {};
  const out = { favorites: [], notes: {}, progress: {}, savedViews: [], customLists: [], sessions: [] };

  if (Array.isArray(d.favorites)) out.favorites = [...new Set(d.favorites.filter((f) => typeof f === 'string' && f && f.length < 80))];
  if (isObj(d.notes)) {
    for (const [k, v] of Object.entries(d.notes)) if (typeof v === 'string' && v.trim()) out.notes[k] = v.slice(0, MAX_NOTE);
  }
  if (isObj(d.progress)) {
    for (const [k, v] of Object.entries(d.progress)) {
      const card = sanitizeCard(v);
      if (card) out.progress[k] = card;
    }
  }
  if (Array.isArray(d.savedViews)) {
    for (const v of d.savedViews) {
      if (!isObj(v) || typeof v.state !== 'string' || !v.state) continue;
      out.savedViews.push({
        id: str(v.id, 40) || uid('v'),
        name: str(v.name, MAX_NAME).trim() || 'Vista sem nome',
        createdAt: num(v.createdAt, Date.now()),
        state: v.state.slice(0, MAX_VIEW_STATE),
      });
    }
  }
  if (Array.isArray(d.customLists)) {
    for (const l of d.customLists) {
      if (!isObj(l)) continue;
      out.customLists.push({
        id: str(l.id, 40) || uid('l'),
        name: str(l.name, MAX_NAME).trim() || 'Nova lista',
        ids: Array.isArray(l.ids) ? [...new Set(l.ids.filter((x) => typeof x === 'string' && x && x.length < 80))] : [],
        createdAt: num(l.createdAt, Date.now()),
      });
    }
  }
  if (Array.isArray(d.sessions)) {
    for (const s of d.sessions) {
      if (!isObj(s) || !['locate', 'choice', 'text'].includes(s.mode)) continue;
      out.sessions.push({
        ts: num(s.ts, Date.now()),
        mode: s.mode,
        region: str(s.region, 20),
        smart: str(s.smart, 60) || 'all',
        score: Math.max(0, num(s.score)),
        total: Math.max(0, Math.trunc(num(s.total))),
        ms: Math.max(0, num(s.ms)),
      });
    }
    out.sessions = out.sessions.slice(-MAX_SESSIONS);
  }
  return out;
}

function defaultStore() {
  try { return window.localStorage; } catch { return null; }
}

export class UserDataManager {
  /** @param {Storage|null} [store] armazenamento (padrão: `localStorage`; injetável nos testes) */
  constructor(store) {
    this.store = store === undefined ? defaultStore() : store;
    this.favorites = new Set();
    this.notes = new Map();
    this.progress = new Map();
    this.savedViews = [];
    this.customLists = [];
    this.sessions = [];
    this.listeners = new Set();
    this.load();
  }

  load() {
    try {
      const raw = this.store?.getItem(STORAGE_KEY);
      if (!raw) return;
      this.assign(sanitize(JSON.parse(raw)));
    } catch (err) {
      console.warn('[UserData] Falha ao ler o armazenamento:', err);
    }
  }

  assign(d) {
    this.favorites = new Set(d.favorites);
    this.notes = new Map(Object.entries(d.notes));
    this.progress = new Map(Object.entries(d.progress));
    this.savedViews = d.savedViews;
    this.customLists = d.customLists;
    this.sessions = d.sessions;
  }

  snapshot() {
    return {
      favorites: [...this.favorites],
      notes: Object.fromEntries(this.notes),
      progress: Object.fromEntries(this.progress),
      savedViews: this.savedViews,
      customLists: this.customLists,
      sessions: this.sessions,
    };
  }

  save() {
    try {
      this.store?.setItem(STORAGE_KEY, JSON.stringify({ formatVersion: 2, savedAt: new Date().toISOString(), ...this.snapshot() }));
    } catch (err) {
      console.warn('[UserData] Falha ao gravar o armazenamento:', err);
    }
    this.notify();
  }

  notify() {
    for (const fn of this.listeners) {
      try { fn(this); } catch { /* um ouvinte com defeito não derruba os outros */ }
    }
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /* ── Favoritos ── */
  isFavorite(id) { return this.favorites.has(id); }

  toggleFavorite(id) {
    if (this.favorites.has(id)) this.favorites.delete(id); else this.favorites.add(id);
    this.save();
    return this.favorites.has(id);
  }

  getFavorites() { return [...this.favorites]; }

  /* ── Anotações ── */
  getNote(id) { return this.notes.get(id) || ''; }

  setNote(id, text) {
    const clean = String(text ?? '').trim().slice(0, MAX_NOTE);
    if (!clean) this.notes.delete(id); else this.notes.set(id, clean);
    this.save();
  }

  /* ── Progresso (SM-2) ── */
  getProgress(id) { return this.progress.get(id) || createInitialCard(); }

  recordQuizResult(id, quality) {
    const updated = recordReview(this.progress.get(id), quality);
    this.progress.set(id, updated);
    this.save();
    return updated;
  }

  /* ── Histórico de sessões de quiz ── */
  recordSession({ mode, region = '', smart = 'all', score = 0, total = 0, ms = 0 }) {
    if (!total) return null;
    const entry = { ts: Date.now(), mode, region, smart, score, total, ms: Math.round(ms) };
    this.sessions.push(entry);
    if (this.sessions.length > MAX_SESSIONS) this.sessions.splice(0, this.sessions.length - MAX_SESSIONS);
    this.save();
    return entry;
  }

  getSessions() { return [...this.sessions]; }

  /* ── Vistas salvas ── */
  getSavedViews() { return [...this.savedViews]; }

  saveView(name, stateData) {
    const entry = {
      id: uid('v'),
      name: String(name ?? '').trim().slice(0, MAX_NAME) || 'Vista sem nome',
      createdAt: Date.now(),
      state: String(stateData ?? '').slice(0, MAX_VIEW_STATE),
    };
    this.savedViews.push(entry);
    this.save();
    return entry;
  }

  deleteView(id) {
    this.savedViews = this.savedViews.filter((v) => v.id !== id);
    this.save();
  }

  /* ── Listas de estudo ── */
  getCustomLists() { return [...this.customLists]; }

  getList(id) { return this.customLists.find((l) => l.id === id) || null; }

  createCustomList(name, ids) {
    const entry = {
      id: uid('l'),
      name: String(name ?? '').trim().slice(0, MAX_NAME) || 'Nova lista',
      ids: [...new Set(ids || [])],
      createdAt: Date.now(),
    };
    this.customLists.push(entry);
    this.save();
    return entry;
  }

  renameList(id, name) {
    const l = this.getList(id);
    const clean = String(name ?? '').trim().slice(0, MAX_NAME);
    if (!l || !clean) return null;
    l.name = clean;
    this.save();
    return l;
  }

  /** Acrescenta estruturas à lista; devolve quantas eram realmente novas. */
  addToList(id, ids) {
    const l = this.getList(id);
    if (!l) return 0;
    const before = l.ids.length;
    l.ids = [...new Set([...l.ids, ...ids])];
    this.save();
    return l.ids.length - before;
  }

  removeFromList(id, structureId) {
    const l = this.getList(id);
    if (!l) return;
    l.ids = l.ids.filter((x) => x !== structureId);
    this.save();
  }

  deleteCustomList(id) {
    this.customLists = this.customLists.filter((l) => l.id !== id);
    this.save();
  }

  /* ── Backup ── */
  exportJson() {
    return JSON.stringify({ format: FORMAT, formatVersion: 2, exportedAt: new Date().toISOString(), data: this.snapshot() }, null, 2);
  }

  /**
   * Importa um backup. Com `merge` (padrão) soma ao que existe: favoritos e listas/vistas novas entram, a anotação do
   * arquivo vence a local, e no progresso fica o cartão respondido mais recentemente.
   */
  importJson(jsonString, merge = true) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return { success: false, error: 'o arquivo não é um JSON válido.' };
    }
    const raw = isObj(parsed?.data) ? parsed.data : parsed;
    const known = ['favorites', 'notes', 'progress', 'savedViews', 'customLists', 'sessions'];
    if (!isObj(raw) || !known.some((k) => k in raw)) {
      return { success: false, error: 'o arquivo não parece um backup do Anatomia 3D.' };
    }
    const inc = sanitize(raw);
    if (!merge) this.assign(sanitize({}));

    for (const f of inc.favorites) this.favorites.add(f);
    for (const [k, v] of Object.entries(inc.notes)) this.notes.set(k, v);
    for (const [k, card] of Object.entries(inc.progress)) {
      const mine = this.progress.get(k);
      if (!mine || card.lastDate >= mine.lastDate) this.progress.set(k, card);
    }
    const viewIds = new Set(this.savedViews.map((v) => v.id));
    for (const v of inc.savedViews) if (!viewIds.has(v.id)) this.savedViews.push(v);
    const listIds = new Set(this.customLists.map((l) => l.id));
    for (const l of inc.customLists) if (!listIds.has(l.id)) this.customLists.push(l);
    const seen = new Set(this.sessions.map((s) => `${s.ts}:${s.mode}`));
    for (const s of inc.sessions) if (!seen.has(`${s.ts}:${s.mode}`)) this.sessions.push(s);
    this.sessions = this.sessions.sort((a, b) => a.ts - b.ts).slice(-MAX_SESSIONS);

    this.save();
    return {
      success: true,
      counts: {
        favoritos: inc.favorites.length,
        anotacoes: Object.keys(inc.notes).length,
        progresso: Object.keys(inc.progress).length,
        vistas: inc.savedViews.length,
        listas: inc.customLists.length,
        sessoes: inc.sessions.length,
      },
    };
  }
}

export const userData = new UserDataManager();
