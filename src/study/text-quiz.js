/**
 * Quiz teórico (F1.5): perguntas de texto geradas a partir dos campos do catálogo, sem escrever pergunta à mão.
 *
 * Músculos: nervo que o inerva · ação · origem · inserção · observação clínica/funcional.
 * Nervos:   qual músculo ele inerva · lesão · sensibilidade.
 *
 * Cuidados com a qualidade das perguntas:
 *  - só há UMA alternativa correta: os distratores nunca são nervos/músculos que também servem como resposta;
 *  - o enunciado não pode conter o nome da resposta (`leaks`); se contiver, aquele tipo é descartado para a estrutura;
 *  - alternativas com o mesmo texto de campo que a correta (ex.: duas cabeças com a mesma inserção) são evitadas.
 */
import { shuffle, norm, esc } from './util.js';

const GENERIC = new Set(['musculo', 'nervo', 'parte', 'ventre', 'cabeca', 'lateral', 'medial', 'superior', 'inferior', 'anterior', 'posterior', 'longo', 'curto', 'maior', 'menor', 'externo', 'interno', 'profundo', 'superficial']);

const MUSCLE_TYPES = ['nervo', 'acao', 'origem', 'insercao', 'nota'];
const NERVE_TYPES = ['musculos', 'lesao', 'sensibilidade'];

const FIELD = { acao: 'Ação', origem: 'Origem', insercao: 'Inserção', lesao: 'Lesão', sensibilidade: 'Sensibilidade' };
const PROMPT = {
  acao: 'Qual músculo tem a seguinte ação?',
  origem: 'Qual músculo se origina em:',
  insercao: 'Qual músculo se insere em:',
  nota: 'A qual músculo se refere esta observação?',
  lesao: 'A lesão de qual nervo causa este quadro?',
  sensibilidade: 'Qual nervo é responsável pela sensibilidade descrita?',
};

/** Parte do nome que identifica a estrutura (sem prefixos genéricos e sem o que vem após "—" ou entre parênteses). */
function stems(item) {
  const cut = (s) => norm(s).split(/\s[—-]\s|\(|,/)[0].replace(/^(musculo|nervo|m\.|n\.)\s+/, '').trim();
  return [cut(item.name), cut(item.latin ?? '')].filter((s) => s.length >= 4);
}

/** O texto entrega o nome da estrutura? */
export function leaks(text, item) {
  const t = norm(text);
  for (const s of stems(item)) if (t.includes(s)) return true;
  for (const w of norm(item.name).split(/[^a-z0-9]+/)) {
    if (w.length >= 7 && !GENERIC.has(w) && new RegExp(`\\b${w}`).test(t)) return true;
  }
  return false;
}

const field = (item, key) => item.campos?.find(([k]) => k === key)?.[1]?.trim() || '';

export class TextQuizGenerator {
  /**
   * @param {Array<object>} items catálogo completo (`ITEMS`)
   * @param {Map<string, Array<{nervo: string}>>} innervation mapa músculo → nervos
   * @param {(item: object, region: string) => boolean} inRegion
   */
  constructor(items, innervation, inRegion) {
    this.items = items;
    this.innervation = innervation;
    this.inRegion = inRegion;
    this.byId = new Map(items.map((i) => [i.id, i]));
    this.muscles = items.filter((i) => i.kind === 'musculo');
    this.nerves = items.filter((i) => i.kind === 'nervo');
    // nervos que inervam músculos (as alternativas de "qual nervo?" saem daqui)
    this.motorNerves = this.nerves.filter((n) => (n.ramos ?? []).length > 0);
    // nervo → conjunto de músculos que ele inerva (ids)
    this.nerveMuscles = new Map();
    for (const [mid, links] of innervation) {
      for (const l of links) {
        if (!this.nerveMuscles.has(l.nervo)) this.nerveMuscles.set(l.nervo, new Set());
        this.nerveMuscles.get(l.nervo).add(mid);
      }
    }
  }

  /**
   * Estruturas que podem virar pergunta.
   * @param {{region?: string, kinds?: string[], allow?: Set<string>|null}} opts
   */
  pool({ region = 'todos', kinds = ['musculo', 'nervo'], allow = null } = {}) {
    const ok = (i) => (region === 'todos' || (i.region !== 'todos' && this.inRegion(i, region))) && (!allow || allow.has(i.id));
    const out = [];
    if (kinds.includes('musculo')) out.push(...this.muscles.filter(ok));
    if (kinds.includes('nervo')) out.push(...this.nerves.filter(ok));
    return out;
  }

  /** Monta uma pergunta para `target`, tentando os tipos viáveis em ordem aleatória; `null` se nenhum servir. */
  question(target, region = 'todos') {
    const types = shuffle(target.kind === 'musculo' ? MUSCLE_TYPES : NERVE_TYPES);
    for (const type of types) {
      const q = this.build(type, target, region);
      if (q) return q;
    }
    return null;
  }

  /** Alternativas erradas: da mesma região e camada quando possível, sem repetir o texto de nenhuma outra. */
  distractors(target, candidates, region, textOf = (i) => i.name, forbidden = new Set()) {
    const near = (i) => (region === 'todos' ? true : this.inRegion(i, region));
    const sameLayer = (i) => i.layer === target.layer;
    const valid = candidates.filter((i) => i.id !== target.id && !forbidden.has(i.id));
    const ranked = [
      ...shuffle(valid.filter((i) => near(i) && sameLayer(i))),
      ...shuffle(valid.filter((i) => near(i) && !sameLayer(i))),
      ...shuffle(valid.filter((i) => !near(i))),
    ];
    const seen = new Set([norm(textOf(target))]);
    const picked = [];
    for (const i of ranked) {
      const t = norm(textOf(i));
      if (!t || seen.has(t)) continue;
      seen.add(t);
      picked.push(i);
      if (picked.length === 3) break;
    }
    return picked.length === 3 ? picked : null;
  }

  make(type, target, correct, wrong, { prompt, explanation, named }) {
    const options = shuffle([correct, ...wrong]).map((i) => ({ id: i.id, text: i.name }));
    return { type, targetId: target.id, correctId: correct.id, options, prompt, explanation, named };
  }

  build(type, t, region) {
    if (type === 'nervo') return this.buildNerveOfMuscle(t, region);
    if (type === 'musculos') return this.buildMuscleOfNerve(t, region);
    if (type === 'nota') {
      const text = (t.nota || '').trim();
      return this.buildByText(type, t, text, region, this.muscles, PROMPT.nota, (i) => i.nota || '');
    }
    const key = FIELD[type];
    const text = field(t, key);
    const pool = t.kind === 'musculo' ? this.muscles : this.nerves;
    return this.buildByText(type, t, text, region, pool, PROMPT[type], (i) => field(i, key));
  }

  /** Pergunta "qual estrutura tem este texto?" (ação, origem, inserção, nota, lesão, sensibilidade). */
  buildByText(type, target, text, region, pool, prompt, textOf) {
    if (type === 'nota' ? text.length < 20 : !text) return null;
    if (leaks(text, target)) return null;
    const wrong = this.distractors(target, pool.filter((i) => textOf(i)), region, textOf);
    if (!wrong) return null;
    return this.make(type, target, target, wrong, {
      prompt: `${esc(prompt)}<br><i>“${esc(text)}”</i>`,
      explanation: `${esc(target.name)} (${esc(target.latin)}): ${esc(text)}`,
      named: false,
    });
  }

  /** Músculo → "qual nervo o inerva?" (a resposta é o nervo principal; os outros nervos do músculo não entram como erro). */
  buildNerveOfMuscle(muscle, region) {
    const links = this.innervation.get(muscle.id) ?? [];
    const nerves = [...new Set(links.map((l) => l.nervo))].map((id) => this.byId.get(id)).filter(Boolean);
    if (!nerves.length) return null;
    const [correct, ...others] = nerves;
    const forbidden = new Set(nerves.map((n) => n.id));
    const wrong = this.distractors(correct, this.motorNerves, region, (i) => i.name, forbidden);
    if (!wrong) return null;
    const all = nerves.map((n) => n.name).join(' e ');
    return this.make('nervo', muscle, correct, wrong, {
      prompt: `Qual nervo inerva o músculo <b>${esc(muscle.name)}</b>?${others.length ? '<br><small>(há mais de um; escolha o principal)</small>' : ''}`,
      explanation: `${esc(muscle.name)} é inervado por: ${esc(all)}.`,
      named: true,
    });
  }

  /** Nervo → "qual destes músculos ele inerva?" (os três errados não são inervados por esse nervo). */
  buildMuscleOfNerve(nerve, region) {
    const mine = [...(this.nerveMuscles.get(nerve.id) ?? [])].map((id) => this.byId.get(id)).filter((m) => m?.kind === 'musculo');
    if (!mine.length) return null;
    const correct = mine[Math.floor(Math.random() * mine.length)];
    const wrong = this.distractors(correct, this.muscles, region, (i) => i.name, new Set(mine.map((m) => m.id)));
    if (!wrong) return null;
    const shown = mine.slice(0, 6).map((m) => m.name).join(', ');
    return this.make('musculos', nerve, correct, wrong, {
      prompt: `Qual destes músculos é inervado pelo nervo <b>${esc(nerve.name)}</b>?`,
      explanation: `${esc(nerve.name)} inerva, entre outros: ${esc(shown)}${mine.length > 6 ? '…' : '.'}`,
      named: true,
    });
  }
}
