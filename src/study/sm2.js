/**
 * Repetição espaçada (SM-2 simplificado) e leitura do desempenho recente (F1.3, F1.4).
 *
 * Cada estrutura tem um "cartão". Notas de resposta (`quality`): 5 = acertou de primeira, 3 = acertou com ajuda
 * (dica ou nova tentativa), 1 = errou ou pulou. Abaixo de 3 conta como falha.
 */
import { DAY_MS } from './util.js';

/** Quantas respostas recentes entram na decisão de "ponto fraco". */
export const RECENT_WINDOW = 5;

export function createInitialCard() {
  return {
    attempts: 0,
    correct: 0,
    reps: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    lastDate: 0,
    nextDueDate: 0,
    recent: [],
  };
}

/** Peso de uma resposta: limpa vale 1, com ajuda 0,5, falha 0. */
export const answerScore = (quality) => (quality >= 4 ? 1 : quality === 3 ? 0.5 : 0);

/**
 * Atualiza o cartão após uma resposta.
 * @param {object} card cartão atual
 * @param {number} quality 5, 3 ou 1 (ver cabeçalho)
 * @param {number} [now] instante da resposta, em ms
 */
export function recordReview(card = createInitialCard(), quality, now = Date.now()) {
  const current = { ...createInitialCard(), ...card };
  current.recent = Array.isArray(card?.recent) ? [...card.recent] : [];
  current.attempts += 1;
  if (quality >= 3) current.correct += 1;
  current.recent.push(quality);
  if (current.recent.length > RECENT_WINDOW) current.recent.splice(0, current.recent.length - RECENT_WINDOW);

  // Fator de facilidade (mínimo 1,3)
  const efDiff = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  current.easeFactor = Math.max(1.3, +(current.easeFactor + efDiff).toFixed(2));

  if (quality < 3) {
    current.reps = 0;
    current.intervalDays = 1;
  } else {
    if (current.reps === 0) current.intervalDays = 1;
    else if (current.reps === 1) current.intervalDays = 3;
    else current.intervalDays = Math.max(1, Math.round(current.intervalDays * current.easeFactor));
    current.reps += 1;
  }

  current.lastDate = now;
  current.nextDueDate = now + current.intervalDays * DAY_MS;
  return current;
}

/** Desempenho recente, de 0 a 1 (média ponderada das últimas respostas); `null` se nunca respondeu. */
export function recentPerformance(card) {
  if (!card || !card.attempts) return null;
  const recent = Array.isArray(card.recent) ? card.recent : [];
  if (!recent.length) return card.correct / card.attempts; // cartão sem janela: usa o acumulado
  return recent.reduce((s, q) => s + answerScore(q), 0) / recent.length;
}

/**
 * Ponto fraco = errou na última resposta, ou o desempenho das últimas respostas está abaixo de 70%.
 * Olha só a janela recente: quem errou no começo e depois acertou várias vezes deixa de ser ponto fraco.
 */
export function isWeak(card) {
  if (!card || !card.attempts) return false;
  const recent = Array.isArray(card.recent) ? card.recent : [];
  if (!recent.length) return card.correct / card.attempts < 0.8;
  if (recent[recent.length - 1] < 3) return true;
  return recentPerformance(card) < 0.7;
}

/** Estruturas com revisão vencida, as mais atrasadas primeiro. */
export function getDueStructureIds(progressMap, poolIds, now = Date.now()) {
  const due = [];
  for (const id of poolIds) {
    const card = progressMap.get(id);
    if (!card) continue;
    if (card.nextDueDate && card.nextDueDate <= now) due.push({ id, urgency: now - card.nextDueDate });
  }
  due.sort((a, b) => b.urgency - a.urgency);
  return due.map((d) => d.id);
}

/** Pontos fracos (ver `isWeak`), do pior desempenho para o melhor. */
export function getWeakStructureIds(progressMap, poolIds, limit = Infinity) {
  const weak = [];
  for (const id of poolIds) {
    const card = progressMap.get(id);
    if (!isWeak(card)) continue;
    weak.push({ id, perf: recentPerformance(card), lastDate: card.lastDate });
  }
  weak.sort((a, b) => a.perf - b.perf || a.lastDate - b.lastDate);
  return weak.slice(0, limit).map((w) => w.id);
}

/** Estruturas que ainda nunca foram respondidas em nenhum quiz. */
export function getNewStructureIds(progressMap, poolIds) {
  return poolIds.filter((id) => !(progressMap.get(id)?.attempts > 0));
}

/** Números do painel de progresso. */
export function summarize(progressMap, poolIds, now = Date.now()) {
  let studied = 0;
  let attempts = 0;
  let correct = 0;
  let mastered = 0;
  const pool = new Set(poolIds);
  for (const [id, card] of progressMap) {
    if (!pool.has(id) || !card.attempts) continue;
    studied++;
    attempts += card.attempts;
    correct += card.correct;
    if (card.reps >= 3 && card.intervalDays >= 7 && !isWeak(card)) mastered++;
  }
  return {
    total: poolIds.length,
    studied,
    fresh: poolIds.length - studied,
    attempts,
    accuracy: attempts ? correct / attempts : null,
    due: getDueStructureIds(progressMap, poolIds, now).length,
    weak: getWeakStructureIds(progressMap, poolIds).length,
    mastered,
  };
}

/** Quantas revisões vencem hoje (já vencidas), amanhã e nos próximos 7 dias. */
export function dueForecast(progressMap, poolIds, now = Date.now()) {
  const out = { today: 0, tomorrow: 0, week: 0 };
  for (const id of poolIds) {
    const card = progressMap.get(id);
    if (!card || !card.nextDueDate) continue;
    const days = (card.nextDueDate - now) / DAY_MS;
    if (days <= 0) out.today++;
    else if (days <= 1) out.tomorrow++;
    else if (days <= 7) out.week++;
  }
  return out;
}
