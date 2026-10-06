/**
 * Gerador de Quizzes Conceituais de Texto (F1.5).
 * Cria perguntas de fixação teórica diretamente a partir dos campos do catálogo.
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class TextQuizGenerator {
  /**
   * @param {Array<object>} items - Lista ITEMS do catálogo
   * @param {Map<string, Array<{nervo: string}>>} innervation - Mapa INNERVATION
   * @param {Map<string, object>} structuresMap - Mapa M das estruturas
   */
  constructor(items, innervation, structuresMap) {
    this.items = items;
    this.innervation = innervation;
    this.M = structuresMap;

    this.muscles = items.filter((i) => i.kind === 'musculo');
    this.nerves = items.filter((i) => i.kind === 'nervo');
  }

  generateQuestion(mode = 'any', regionFilter = 'todos') {
    const inReg = (i) => regionFilter === 'todos' || (Array.isArray(i.region) ? i.region.includes(regionFilter) : i.region === regionFilter);
    const validMuscles = this.muscles.filter(inReg);
    const validNerves = this.nerves.filter(inReg);

    const modes = ['musculo_nervo', 'acao', 'origem_insercao', 'descricao'];
    const chosenMode = mode === 'any' ? modes[Math.floor(Math.random() * modes.length)] : mode;

    if (chosenMode === 'musculo_nervo' && validMuscles.length >= 4) {
      return this.makeMuscleNerveQuestion(validMuscles);
    }
    if (chosenMode === 'acao' && validMuscles.length >= 4) {
      return this.makeActionQuestion(validMuscles);
    }
    if (chosenMode === 'origem_insercao' && validMuscles.length >= 4) {
      return this.makeAttachmentQuestion(validMuscles);
    }
    return this.makeDescriptionQuestion(validMuscles.length >= 4 ? validMuscles : this.items.filter(inReg));
  }

  makeMuscleNerveQuestion(pool) {
    const target = pool[Math.floor(Math.random() * pool.length)];
    const nerveLinks = this.innervation.get(target.id) || [];
    if (!nerveLinks.length) return this.makeActionQuestion(pool);

    const correctNerveId = nerveLinks[0].nervo;
    const correctNerveItem = this.items.find((i) => i.id === correctNerveId);
    if (!correctNerveItem) return this.makeActionQuestion(pool);

    const otherNerves = shuffle(this.nerves.filter((n) => n.id !== correctNerveId)).slice(0, 3);
    const options = shuffle([
      { id: correctNerveItem.id, text: correctNerveItem.name },
      ...otherNerves.map((n) => ({ id: n.id, text: n.name })),
    ]);

    return {
      type: 'musculo_nervo',
      prompt: `Qual nervo inerva o músculo <b>${target.name}</b>?`,
      targetId: target.id,
      correctId: correctNerveItem.id,
      options,
      explanation: `${target.name} é inervado por: ${correctNerveItem.name}.`,
    };
  }

  makeActionQuestion(pool) {
    const withAction = pool.filter((m) => m.campos.some(([k]) => k === 'Ação'));
    const target = withAction[Math.floor(Math.random() * withAction.length)];
    const acao = target.campos.find(([k]) => k === 'Ação')[1];

    const others = shuffle(pool.filter((m) => m.id !== target.id)).slice(0, 3);
    const options = shuffle([
      { id: target.id, text: target.name },
      ...others.map((m) => ({ id: m.id, text: m.name })),
    ]);

    return {
      type: 'acao',
      prompt: `Qual músculo tem a seguinte ação principal?<br><i>"${acao}"</i>`,
      targetId: target.id,
      correctId: target.id,
      options,
      explanation: `${target.name} realiza: ${acao}`,
    };
  }

  makeAttachmentQuestion(pool) {
    const withInsert = pool.filter((m) => m.campos.some(([k]) => k === 'Inserção'));
    const target = withInsert[Math.floor(Math.random() * withInsert.length)];
    const insercao = target.campos.find(([k]) => k === 'Inserção')[1];

    const others = shuffle(pool.filter((m) => m.id !== target.id)).slice(0, 3);
    const options = shuffle([
      { id: target.id, text: target.name },
      ...others.map((m) => ({ id: m.id, text: m.name })),
    ]);

    return {
      type: 'origem_insercao',
      prompt: `Qual músculo se insere em:<br><i>"${insercao}"</i>?`,
      targetId: target.id,
      correctId: target.id,
      options,
      explanation: `Inserção de ${target.name}: ${insercao}`,
    };
  }

  makeDescriptionQuestion(pool) {
    const withNotes = pool.filter((i) => i.nota && i.nota.length > 20);
    const target = (withNotes.length ? withNotes : pool)[Math.floor(Math.random() * (withNotes.length || pool.length))];
    const desc = target.nota || target.campos[0][1];

    const others = shuffle(pool.filter((i) => i.id !== target.id)).slice(0, 3);
    const options = shuffle([
      { id: target.id, text: target.name },
      ...others.map((i) => ({ id: i.id, text: i.name })),
    ]);

    return {
      type: 'descricao',
      prompt: `A que estrutura se refere a seguinte observação clínica/funcional?<br><i>"${desc}"</i>`,
      targetId: target.id,
      correctId: target.id,
      options,
      explanation: `${target.name} (${target.latin}): ${desc}`,
    };
  }
}
