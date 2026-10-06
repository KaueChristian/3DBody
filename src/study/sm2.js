/**
 * Implementação do algoritmo SuperMemo-2 (SM-2) para repetição espaçada (F1.4).
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function createInitialCard() {
  return {
    attempts: 0,
    correct: 0,
    reps: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    lastDate: 0,
    nextDueDate: 0,
  };
}

/**
 * Atualiza o estado da estrutura após uma resposta.
 * @param {object} card - Registro atual da estrutura
 * @param {number} quality - Grau de retenção (0 a 5):
 *   5 = perfeito / de primeira
 *   3 = com ajuda / dica
 *   1 = erro / tentativa falha
 * @param {number} [now] - Timestamp atual em ms
 * @returns {object} Novo registro atualizado
 */
export function recordReview(card = createInitialCard(), quality, now = Date.now()) {
  const current = { ...createInitialCard(), ...card };
  current.attempts += 1;
  if (quality >= 3) {
    current.correct += 1;
  }

  // Atualiza Fator de Facilidade (mínimo 1.3)
  const efDiff = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  current.easeFactor = Math.max(1.3, +(current.easeFactor + efDiff).toFixed(2));

  if (quality < 3) {
    // Erro reseta a sequência de repetições
    current.reps = 0;
    current.intervalDays = 1;
  } else {
    // Acerto progride o intervalo
    if (current.reps === 0) {
      current.intervalDays = 1;
    } else if (current.reps === 1) {
      current.intervalDays = 3;
    } else {
      current.intervalDays = Math.max(1, Math.round(current.intervalDays * current.easeFactor));
    }
    current.reps += 1;
  }

  current.lastDate = now;
  current.nextDueDate = now + current.intervalDays * ONE_DAY_MS;

  return current;
}

/**
 * Retorna IDs agendados para revisão hoje (vencidos ou nunca revisados com prioridade aos vencidos).
 */
export function getDueStructureIds(progressMap, poolIds, now = Date.now()) {
  const due = [];
  for (const id of poolIds) {
    const card = progressMap.get(id);
    if (!card) continue;
    if (card.nextDueDate && card.nextDueDate <= now) {
      due.push({ id, urgency: now - card.nextDueDate });
    }
  }
  // Mais atrasados primeiro
  due.sort((a, b) => b.urgency - a.urgency);
  return due.map((d) => d.id);
}

/**
 * Retorna as estruturas com pior desempenho (pontos fracos).
 */
export function getWeakStructureIds(progressMap, poolIds, limit = 15) {
  const weak = [];
  for (const id of poolIds) {
    const card = progressMap.get(id);
    if (!card || card.attempts === 0) continue;
    const accuracy = card.correct / card.attempts;
    if (accuracy < 0.8 || card.attempts - card.correct >= 2) {
      weak.push({ id, accuracy, missed: card.attempts - card.correct });
    }
  }
  // Pior precisão e mais erros primeiro
  weak.sort((a, b) => a.accuracy - b.accuracy || b.missed - a.missed);
  return weak.slice(0, limit).map((w) => w.id);
}
