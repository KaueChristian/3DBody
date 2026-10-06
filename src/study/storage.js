/**
 * Gerenciador central de persistência e dados do usuário (F1.2, F1.3, F1.4, F1.10).
 * Opera 100% offline via localStorage com tratamento robusto de erros e exportação/importação JSON.
 */
import { recordReview, createInitialCard } from './sm2.js';

const STORAGE_KEY = 'anatomia3d.userdata.v1';

class UserDataManager {
  constructor() {
    this.favorites = new Set();
    this.notes = new Map();
    this.progress = new Map();
    this.savedViews = [];
    this.customLists = [];
    this.listeners = new Set();

    this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      if (Array.isArray(data.favorites)) {
        this.favorites = new Set(data.favorites);
      }
      if (data.notes && typeof data.notes === 'object') {
        this.notes = new Map(Object.entries(data.notes));
      }
      if (data.progress && typeof data.progress === 'object') {
        this.progress = new Map(Object.entries(data.progress));
      }
      if (Array.isArray(data.savedViews)) {
        this.savedViews = data.savedViews;
      }
      if (Array.isArray(data.customLists)) {
        this.customLists = data.customLists;
      }
    } catch (err) {
      console.warn('[UserData] Falha ao ler localStorage:', err);
    }
  }

  save() {
    try {
      const payload = {
        version: '2.1',
        savedAt: new Date().toISOString(),
        favorites: Array.from(this.favorites),
        notes: Object.fromEntries(this.notes),
        progress: Object.fromEntries(this.progress),
        savedViews: this.savedViews,
        customLists: this.customLists,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      this.notify();
    } catch (err) {
      console.warn('[UserData] Falha ao gravar localStorage:', err);
    }
  }

  notify() {
    for (const fn of this.listeners) {
      try { fn(this); } catch (_) {}
    }
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // --- Favoritos ---
  isFavorite(id) {
    return this.favorites.has(id);
  }

  toggleFavorite(id) {
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
    } else {
      this.favorites.add(id);
    }
    this.save();
    return this.favorites.has(id);
  }

  getFavorites() {
    return Array.from(this.favorites);
  }

  // --- Anotações ---
  getNote(id) {
    return this.notes.get(id) || '';
  }

  setNote(id, text) {
    const clean = (text || '').trim();
    if (!clean) {
      this.notes.delete(id);
    } else {
      this.notes.set(id, clean);
    }
    this.save();
  }

  // --- Progresso & SM-2 ---
  getProgress(id) {
    return this.progress.get(id) || createInitialCard();
  }

  recordQuizResult(id, quality) {
    const prev = this.getProgress(id);
    const updated = recordReview(prev, quality);
    this.progress.set(id, updated);
    this.save();
    return updated;
  }

  // --- Vistas Salvas ---
  getSavedViews() {
    return [...this.savedViews];
  }

  saveView(name, stateData) {
    const id = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const entry = {
      id,
      name: (name || '').trim() || 'Vista sem nome',
      createdAt: Date.now(),
      state: stateData,
    };
    this.savedViews.push(entry);
    this.save();
    return entry;
  }

  deleteView(id) {
    this.savedViews = this.savedViews.filter((v) => v.id !== id);
    this.save();
  }

  // --- Listas Personalizadas ---
  getCustomLists() {
    return [...this.customLists];
  }

  createCustomList(name, ids) {
    const id = 'l_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const entry = {
      id,
      name: (name || '').trim() || 'Nova Lista',
      ids: Array.from(new Set(ids || [])),
      createdAt: Date.now(),
    };
    this.customLists.push(entry);
    this.save();
    return entry;
  }

  updateCustomList(id, name, ids) {
    const idx = this.customLists.findIndex((l) => l.id === id);
    if (idx !== -1) {
      if (name) this.customLists[idx].name = name.trim();
      if (ids) this.customLists[idx].ids = Array.from(new Set(ids));
      this.save();
      return this.customLists[idx];
    }
    return null;
  }

  deleteCustomList(id) {
    this.customLists = this.customLists.filter((l) => l.id !== id);
    this.save();
  }

  // --- Exportação e Importação JSON (F1.2) ---
  exportJson() {
    const payload = {
      format: 'anatomia3d-userdata',
      version: '2.1.0',
      exportedAt: new Date().toISOString(),
      data: {
        favorites: Array.from(this.favorites),
        notes: Object.fromEntries(this.notes),
        progress: Object.fromEntries(this.progress),
        savedViews: this.savedViews,
        customLists: this.customLists,
      },
    };
    return JSON.stringify(payload, null, 2);
  }

  importJson(jsonString, merge = true) {
    try {
      const parsed = JSON.parse(jsonString);
      const incoming = parsed.data || parsed;

      if (!merge) {
        this.favorites.clear();
        this.notes.clear();
        this.progress.clear();
        this.savedViews = [];
        this.customLists = [];
      }

      if (Array.isArray(incoming.favorites)) {
        for (const f of incoming.favorites) this.favorites.add(f);
      }
      if (incoming.notes && typeof incoming.notes === 'object') {
        for (const [k, v] of Object.entries(incoming.notes)) this.notes.set(k, v);
      }
      if (incoming.progress && typeof incoming.progress === 'object') {
        for (const [k, v] of Object.entries(incoming.progress)) this.progress.set(k, v);
      }
      if (Array.isArray(incoming.savedViews)) {
        const existingIds = new Set(this.savedViews.map((v) => v.id));
        for (const sv of incoming.savedViews) {
          if (!existingIds.has(sv.id)) this.savedViews.push(sv);
        }
      }
      if (Array.isArray(incoming.customLists)) {
        const existingListIds = new Set(this.customLists.map((l) => l.id));
        for (const cl of incoming.customLists) {
          if (!existingListIds.has(cl.id)) this.customLists.push(cl);
        }
      }

      this.save();
      return { success: true, count: this.favorites.size + this.notes.size };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const userData = new UserDataManager();
