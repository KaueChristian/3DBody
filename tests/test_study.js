/**
 * Testes das ferramentas de estudo (src/study/) que não precisam de navegador:
 * repetição espaçada, armazenamento/importação, estado da vista na URL, plano de corte e gerador do quiz teórico.
 * Empacota os módulos com esbuild e os executa no Node.
 */
const esbuild = require('esbuild');
const path = require('path');

const root = path.resolve(__dirname, '..');
const failures = [];
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) { failures.push(msg); console.error(`  ✖ FALHA: ${msg}`); }
};
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), `${msg} (esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)})`);

function load() {
  const result = esbuild.buildSync({
    stdin: {
      contents: `
        import * as sm2 from './src/study/sm2.js';
        import * as storage from './src/study/storage.js';
        import * as views from './src/study/views.js';
        import * as textQuiz from './src/study/text-quiz.js';
        import * as clipping from './src/study/clipping.js';
        import * as util from './src/study/util.js';
        import * as catalog from './src/catalog.js';
        import * as segs from './src/segments.js';
        import * as derm from './src/study/dermatomes.js';
        export { sm2, storage, views, textQuiz, clipping, util, catalog, segs, derm };`,
      resolveDir: root,
    },
    bundle: true, format: 'cjs', platform: 'node', write: false, logLevel: 'error',
  });
  const mod = { exports: {} };
  new Function('module', 'exports', result.outputFiles[0].text)(mod, mod.exports);
  return mod.exports;
}

const { sm2, storage, views, textQuiz, clipping, util, catalog, segs, derm } = load();
const DAY = 24 * 60 * 60 * 1000;

/* ───────────── util ───────────── */
console.log('• util');
eq(util.esc('<img src=x onerror="a()">&\''), '&lt;img src=x onerror=&quot;a()&quot;&gt;&amp;&#39;', 'esc escapa <, >, ", & e aspa simples');
eq(util.norm('Ação Ânulo'), 'acao anulo', 'norm tira acentos');

/* ───────────── SM-2 ───────────── */
console.log('• repetição espaçada');
{
  const t0 = 1_000_000_000_000;
  let c = sm2.recordReview(undefined, 5, t0);
  eq([c.attempts, c.correct, c.reps, c.intervalDays], [1, 1, 1, 1], 'primeiro acerto: intervalo de 1 dia');
  c = sm2.recordReview(c, 5, t0 + DAY);
  eq(c.intervalDays, 3, 'segundo acerto: 3 dias');
  c = sm2.recordReview(c, 5, t0 + 4 * DAY);
  ok(c.intervalDays >= 7, `terceiro acerto cresce pelo fator (veio ${c.intervalDays})`);
  eq(c.nextDueDate, t0 + 4 * DAY + c.intervalDays * DAY, 'próxima revisão = agora + intervalo');
  c = sm2.recordReview(c, 1, t0 + 20 * DAY);
  eq([c.reps, c.intervalDays], [0, 1], 'erro zera as repetições e volta para 1 dia');
  ok(c.easeFactor >= 1.3, 'fator de facilidade nunca passa de 1,3 para baixo');
  eq(c.recent, [5, 5, 5, 1], 'guarda as respostas recentes');
  for (let i = 0; i < 10; i++) c = sm2.recordReview(c, 5, t0 + (30 + i) * DAY);
  eq(c.recent.length, 5, 'a janela recente tem no máximo 5 respostas');

  // ponto fraco olha só a janela recente
  const card = (recent, attempts = recent.length) => ({ attempts, correct: recent.filter((q) => q >= 3).length, recent });
  ok(!sm2.isWeak(undefined), 'sem cartão não é ponto fraco');
  ok(sm2.isWeak(card([5, 5, 1])), 'errou a última vez: ponto fraco');
  ok(sm2.isWeak(card([1, 5, 5])), 'errou e acertou 2 vezes (67%): ainda fraco');
  ok(!sm2.isWeak(card([1, 5, 5, 5])), 'errou e depois acertou 3 vezes: deixa de ser fraco');
  ok(!sm2.isWeak(card([5, 5, 5, 5, 5], 25)), 'muitos acertos recentes: não é fraco');
  // o caso que a regra antiga marcava para sempre: 2 erros antigos e muitos acertos depois
  ok(!sm2.isWeak({ attempts: 22, correct: 20, recent: [5, 5, 5, 5, 5] }), 'dois erros antigos não marcam mais como fraco');
  ok(sm2.isWeak(card([3])), 'uma resposta com ajuda só ainda é fraca (50%)');
  ok(sm2.isWeak({ attempts: 5, correct: 3 }), 'cartão antigo sem janela cai na precisão acumulada (60%)');

  const prog = new Map([
    ['a', card([1, 1])], ['b', card([5, 5, 5, 5, 5])], ['c', card([1, 5])],
    ['d', { ...card([5]), nextDueDate: t0 - DAY }], ['e', { ...card([5]), nextDueDate: t0 + 3 * DAY }],
  ]);
  eq(sm2.getWeakStructureIds(prog, ['a', 'b', 'c', 'd', 'e']), ['a', 'c'], 'pontos fracos, do pior ao menos pior');
  eq(sm2.getDueStructureIds(prog, ['a', 'b', 'c', 'd', 'e'], t0), ['d'], 'revisão vencida');
  eq(sm2.getNewStructureIds(prog, ['a', 'z']), ['z'], 'estruturas novas');
  const sum = sm2.summarize(prog, ['a', 'b', 'c', 'd', 'e', 'z'], t0);
  eq([sum.total, sum.studied, sum.fresh, sum.weak, sum.due], [6, 5, 1, 2, 1], 'resumo do progresso');
  const fc = sm2.dueForecast(prog, ['d', 'e'], t0);
  eq([fc.today, fc.tomorrow, fc.week], [1, 0, 1], 'previsão de revisões');
}

/* ───────────── Armazenamento e backup ───────────── */
console.log('• armazenamento e backup');
{
  const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), _m: m }; };
  const store = mem();
  const u = new storage.UserDataManager(store);
  u.toggleFavorite('masseter');
  u.setNote('masseter', '  mnemônico <b>x</b>  ');
  u.recordQuizResult('masseter', 5);
  u.saveView('Minha vista', 'sel=masseter');
  const list = u.createCustomList('Prova', ['masseter']);
  eq(u.addToList(list.id, ['temporal', 'masseter']), 1, 'addToList conta só as novas');
  u.removeFromList(list.id, 'masseter');
  eq(u.getList(list.id).ids, ['temporal'], 'removeFromList');
  u.recordSession({ mode: 'text', region: 'cabeca', score: 3, total: 4 });
  ok(u.recordSession({ mode: 'text', total: 0 }) === null, 'sessão sem respostas não entra no histórico');
  eq(u.getNote('masseter'), 'mnemônico <b>x</b>', 'anotação é guardada como texto, sem alterar');

  // persistência: outra instância lê o mesmo armazenamento
  const u2 = new storage.UserDataManager(store);
  ok(u2.isFavorite('masseter') && u2.getProgress('masseter').attempts === 1 && u2.getSessions().length === 1, 'dados sobrevivem a recarregar');
  ok(u2.getCustomLists()[0].ids[0] === 'temporal', 'listas sobrevivem a recarregar');

  // sem armazenamento disponível a interface continua funcionando
  const none = new storage.UserDataManager(null);
  none.toggleFavorite('x');
  ok(none.isFavorite('x'), 'funciona sem localStorage');

  // exportar e importar
  const json = u.exportJson();
  const fresh = new storage.UserDataManager(mem());
  const res = fresh.importJson(json);
  ok(res.success && res.counts.favoritos === 1 && res.counts.listas === 1 && res.counts.sessoes === 1, 'importa o que exportou');
  eq(fresh.getNote('masseter'), 'mnemônico <b>x</b>', 'anotação importada igual');

  // mesclagem: fica o cartão respondido por último
  const a = new storage.UserDataManager(mem());
  a.progress.set('x', { attempts: 5, correct: 5, reps: 3, easeFactor: 2.5, intervalDays: 8, lastDate: 200, nextDueDate: 300, recent: [5] });
  const incoming = JSON.stringify({ progress: { x: { attempts: 1, correct: 0, reps: 0, lastDate: 100, nextDueDate: 100, recent: [1] } } });
  a.importJson(incoming);
  eq(a.getProgress('x').attempts, 5, 'mesclagem mantém o cartão mais recente');
  a.importJson(JSON.stringify({ progress: { x: { attempts: 9, correct: 9, lastDate: 999 } } }));
  eq(a.getProgress('x').attempts, 9, 'mesclagem troca por um cartão mais novo');

  // arquivos inválidos ou hostis
  ok(!fresh.importJson('isto não é json').success, 'rejeita texto que não é JSON');
  ok(!fresh.importJson('{"qualquer":1}').success, 'rejeita JSON sem cara de backup');
  ok(!fresh.importJson('[1,2,3]').success, 'rejeita JSON que não é objeto');
  const hostile = new storage.UserDataManager(mem());
  const r = hostile.importJson(JSON.stringify({
    favorites: ['ok', 5, null, { a: 1 }],
    notes: { a: 'texto', b: 42, c: { x: 1 } },
    progress: { p: { attempts: 'muitos', correct: -3, easeFactor: 999, recent: [1, 7, 'a', 5], lastDate: 'ontem' }, q: 'lixo' },
    savedViews: [{ id: 1, name: 'x'.repeat(500), state: 'sel=a' }, { name: 'sem estado' }, 'lixo'],
    customLists: [{ id: 'l1', name: 'L', ids: ['a', 5, 'a', {}] }, null],
    sessions: [{ mode: 'invalido', total: 3 }, { mode: 'choice', score: 2, total: 3 }],
  }));
  ok(r.success, 'importa o que dá para aproveitar de um arquivo malformado');
  eq(hostile.getFavorites(), ['ok'], 'favoritos: só textos');
  eq([...hostile.notes.keys()], ['a'], 'anotações: só textos');
  const p = hostile.getProgress('p');
  eq([p.attempts, p.correct, p.easeFactor, p.recent], [0, 0, 4, [1, 5]], 'progresso é normalizado');
  ok(!hostile.progress.has('q'), 'cartão que não é objeto é descartado');
  eq(hostile.getSavedViews().map((v) => v.name.length), [80], 'vista sem estado é descartada e o nome é limitado');
  eq(hostile.getCustomLists()[0].ids, ['a'], 'lista: ids únicos e só textos');
  eq(hostile.getSessions().length, 1, 'sessão com modo inválido é descartada');
}

/* ───────────── Estado da vista na URL ───────────── */
console.log('• vista na URL');
{
  const { layersForDissect } = catalog;
  const cam = { position: { x: 1.234, y: 0.5, z: 7 } };
  const ctl = { target: { x: 0, y: -0.4, z: 0 } };
  const base = { selected: null, region: 'cabeca', dissect: 1, skin: 0.14, layers: new Set(layersForDissect(1)), hidden: new Set(), labels: false };
  const app = (over) => ({ state: { ...base, ...over } });

  eq(views.encodeViewState(app({}), null, null), '', 'vista padrão não escreve nada na URL');
  const h = views.encodeViewState(app({ selected: 'masseter', region: 'tronco', dissect: 3, skin: 0.5, layers: new Set(['osso', 'nervo']), hidden: new Set(['a', 'b']), labels: true }), cam, ctl, { clip: 'axial,0.3,0', color: 'grupo' });
  const st = views.parseViewState(h);
  eq([st.selected, st.region, st.dissect, st.skin, st.layers, st.hidden, st.clip, st.color, st.labels], ['masseter', 'tronco', 3, 0.5, ['osso', 'nervo'], ['a', 'b'], 'axial,0.3,0', 'grupo', true], 'vai e volta sem perder campos');
  eq(st.cam, { pos: [1.23, 0.5, 7], target: [0, -0.4, 0] }, 'câmera arredondada em 2 casas');
  ok(!views.encodeViewState(app({ dissect: 3, layers: new Set(layersForDissect(3)) }), null, null).includes('ly='), 'camadas padrão da dissecação não vão para a URL');
  ok(views.encodeViewState(app({ dissect: 3, layers: new Set(['osso']) }), null, null).includes('ly=osso'), 'camadas diferentes do padrão vão para a URL');

  eq(views.parseViewState(''), null, 'hash vazio');
  eq(views.parseViewState('#dis=99'), null, 'dissecação fora de 0–6 é ignorada');
  eq(views.parseViewState('#dis=99&sel=a').dissect, undefined, 'dissecação fora de 0–6 não vira estado');
  eq(views.parseViewState('#cam=1,2,x,4,5,6'), null, 'câmera com valor inválido é ignorada');
  eq(views.parseViewState('#sk=500').skin, 1, 'opacidade da pele é limitada a 100%');
  ok(views.parseViewState('#qualquer=coisa') === null, 'campos desconhecidos são ignorados');
}

/* ───────────── Plano de corte ───────────── */
console.log('• plano de corte');
{
  const THREE_BOX = { isEmpty: () => false, min: { x: -3, y: -9, z: -1 }, max: { x: 3, y: 1, z: 1.4 } };
  const renderer = { clippingPlanes: [] };
  const c = new clipping.ClippingManager(renderer, () => THREE_BOX);
  ok(!c.active && !c.isClipped({ x: 0, y: 0, z: 0 }), 'sem corte nada é cortado');
  c.setAxis('axial');
  eq(c.range, [-9, 1], 'o curso do corte vem da caixa do modelo');
  c.setOffset(0);
  eq(renderer.clippingPlanes.length, 1, 'ativar o corte registra um plano no renderizador');
  // centro do curso: y = -4. Sem inverter, mantém o que está acima (y >= -4)
  const P = (y) => ({ x: 0, y, z: 0 });
  ok(!c.isClipped(P(-3)) && c.isClipped(P(-5)), 'sem inverter: some o que está abaixo do plano');
  c.toggleInvert();
  ok(c.isClipped(P(-3)) && !c.isClipped(P(-5)), 'invertido: some o que está acima do plano');
  eq(c.serialize(), 'axial,0,1', 'serializa eixo, posição e inversão');
  const d = new clipping.ClippingManager({ clippingPlanes: [] }, () => THREE_BOX);
  ok(d.restore('sagittal,0.5,0') && d.activeAxis === 'sagittal' && d.sliderValue === 0.5, 'restaura o corte serializado');
  ok(!d.restore('diagonal,0,0'), 'rejeita eixo inválido');
  d.reset();
  eq(d.serialize(), '', 'sem corte serializa vazio');
  const e = new clipping.ClippingManager({ clippingPlanes: [] }, () => null);
  e.setAxis('coronal');
  eq(e.range, [-1.5, 1.5], 'sem caixa do modelo usa os limites de reserva');
}

/* ───────────── Quiz teórico ───────────── */
console.log('• quiz teórico');
{
  const { ITEMS, INNERVATION, inRegion } = catalog;
  const gen = new textQuiz.TextQuizGenerator(ITEMS, INNERVATION, inRegion);
  const seen = {};
  let asked = 0;
  let built = 0;
  const byId = new Map(ITEMS.map((i) => [i.id, i]));

  for (let pass = 0; pass < 3; pass++) {
    for (const region of ['todos', 'cabeca', 'tronco', 'membro_sup']) {
      for (const target of gen.pool({ region })) {
        asked++;
        const q = gen.question(target, region);
        if (!q) continue;
        built++;
        seen[q.type] = (seen[q.type] || 0) + 1;
        const where = `${q.type} / ${target.id} / ${region}`;
        ok(q.options.length === 4, `4 alternativas (${where})`);
        ok(new Set(q.options.map((o) => o.id)).size === 4, `alternativas distintas (${where})`);
        ok(new Set(q.options.map((o) => o.text)).size === 4, `textos das alternativas distintos (${where})`);
        ok(q.options.filter((o) => o.id === q.correctId).length === 1, `exatamente uma correta (${where})`);
        const wrong = q.options.filter((o) => o.id !== q.correctId).map((o) => byId.get(o.id));
        ok(wrong.every(Boolean), `alternativas existem no catálogo (${where})`);

        if (q.type === 'nervo') {
          const mine = new Set((INNERVATION.get(target.id) ?? []).map((l) => l.nervo));
          ok(mine.has(q.correctId), `a correta inerva o músculo (${where})`);
          ok(wrong.every((n) => !mine.has(n.id)), `nenhuma errada inerva o músculo (${where})`);
          ok(q.named, `enunciado nomeia o músculo (${where})`);
        } else if (q.type === 'musculos') {
          ok(INNERVATION.get(q.correctId)?.some((l) => l.nervo === target.id), `a correta é inervada pelo nervo (${where})`);
          ok(wrong.every((m) => !INNERVATION.get(m.id)?.some((l) => l.nervo === target.id)), `nenhuma errada é inervada pelo nervo (${where})`);
        } else {
          ok(q.correctId === target.id, `a correta é a estrutura sorteada (${where})`);
          ok(!q.named, `enunciado não nomeia a resposta (${where})`);
          ok(!textQuiz.leaks(q.prompt.replace(/<[^>]*>/g, ' ').replace(/^[^“]*/, ''), target), `enunciado não contém o nome da resposta (${where})`);
          const fieldKey = { acao: 'Ação', origem: 'Origem', insercao: 'Inserção', lesao: 'Lesão', sensibilidade: 'Sensibilidade' }[q.type];
          if (fieldKey) {
            const own = target.campos.find(([k]) => k === fieldKey)[1];
            ok(wrong.every((w) => w.campos.find(([k]) => k === fieldKey)?.[1] !== own), `errada com o mesmo texto da correta (${where})`);
          }
        }
      }
    }
  }
  ok(built / asked > 0.9, `o gerador monta pergunta para mais de 90% das estruturas (${built}/${asked})`);
  for (const type of ['nervo', 'acao', 'origem', 'insercao', 'nota', 'musculos', 'lesao', 'sensibilidade']) {
    ok(seen[type] > 0, `o tipo de pergunta "${type}" aparece`);
  }
  console.log('  tipos gerados:', JSON.stringify(seen));

  const only = gen.pool({ region: 'cabeca', kinds: ['nervo'], allow: new Set(['n_facial', 'masseter']) });
  eq(only.map((i) => i.id), ['n_facial'], 'o filtro de ids e de tipo se combinam');
  ok(textQuiz.leaks('o masseter eleva a mandíbula', byId.get('masseter')), 'leaks detecta o nome');
  ok(!textQuiz.leaks('eleva a mandíbula', byId.get('masseter')), 'leaks não acusa texto sem o nome');
}

/* ───────────── segmentos medulares, miótomos e dermátomos (F2.14 e F2.15) ───────────── */
console.log('• segmentos medulares e dermátomos');
{
  const { SEGMENT_ORDER, SEGMENTOS, AMPLOS, segmentLabel, principalSegment } = segs;
  eq(SEGMENT_ORDER.length, 31, '31 segmentos: 8 C, 12 T, 5 L, 5 S e 1 coccígeo');
  eq(segmentLabel(['C5', 'C6', 'C7', 'C8']), 'C5–C8', 'segmentos consecutivos viram intervalo');
  eq(segmentLabel(['C5', 'C7', 'C8', 'T1']), 'C5, C7–T1', 'segmentos com lacuna ficam separados');
  eq(segmentLabel(['T12']), 'T12', 'um segmento só');
  eq(principalSegment(['C5', 'C6', 'C7']), 'C6', 'o segmento principal é o do meio');
  const byId = new Map(catalog.ITEMS.map((i) => [i.id, i]));
  for (const [id, list] of Object.entries(SEGMENTOS)) {
    ok(byId.has(id), `segmentos de estrutura inexistente: ${id}`);
    ok(list.length > 0 && list.every((s) => SEGMENT_ORDER.includes(s)), `segmento inválido em ${id}`);
    const idx = list.map((s) => SEGMENT_ORDER.indexOf(s));
    ok(idx.every((v, i) => i === 0 || v > idx[i - 1]), `segmentos fora da ordem craniocaudal em ${id}`);
    ok(byId.get(id)?.segmentos === list, `${id}: o catálogo não recebeu o campo segmentos`);
    ok(byId.get(id)?.campos.some(([k]) => k === 'Segmentos medulares'), `${id}: a ficha não tem a linha "Segmentos medulares"`);
  }
  eq(byId.get('diafragma').segmentos, ['C3', 'C4', 'C5'], 'diafragma: C3–C5');
  eq(byId.get('delt_acro').segmentos, ['C5', 'C6'], 'deltoide: C5–C6');
  eq(byId.get('interosseos_dorsais').segmentos, ['C8', 'T1'], 'interósseos: C8–T1');
  eq(byId.get('psoas_maior').segmentos, ['L1', 'L2', 'L3'], 'psoas maior: L1–L3');
  ok(!byId.get('masseter').segmentos && !byId.get('genioglosso').segmentos, 'músculos só de nervo craniano não têm segmento');
  ok(AMPLOS.has('multifido') && !AMPLOS.has('biceps_longa'), 'só os músculos próprios do dorso são de inervação regional');
  // miótomo: C7 tem de incluir tríceps, extensores do punho e flexor radial do carpo
  const c7 = catalog.ITEMS.filter((i) => i.kind === 'musculo' && i.segmentos?.includes('C7')).map((i) => i.id);
  for (const id of ['triceps_longa', 'fcr', 'ecrl', 'ed', 'grande_dorsal']) ok(c7.includes(id), `C7 deveria incluir ${id}`);
  ok(!c7.includes('delt_acro'), 'C7 não inclui o deltoide');
  // todo músculo inervado por um nervo espinal tem segmentos
  const sem = catalog.ITEMS.filter((i) => i.kind === 'musculo' && !i.segmentos && (catalog.INNERVATION.get(i.id) ?? []).some((l) => SEGMENTOS[l.nervo]));
  eq(sem.map((i) => i.id), [], 'músculos inervados por nervo espinal sem segmentos');

  // o estado do segmento e dos dermátomos vai e volta pelo hash
  const app = { state: { selected: null, region: 'cabeca', dissect: 1, skin: 0.14, layers: new Set(catalog.layersForDissect(1)), hidden: new Set(), labels: false } };
  const hash = views.encodeViewState(app, null, null, { color: 'segmento', segment: 'C7', derm: true });
  ok(/col=segmento/.test(hash) && /seg=C7/.test(hash) && /derm=1/.test(hash), `o hash não guarda segmento e dermátomos: ${hash}`);
  const st = views.parseViewState(hash);
  ok(st.color === 'segmento' && st.segment === 'C7' && st.derm === true, 'o hash não volta com segmento e dermátomos');
  ok(!/seg=|derm=/.test(views.encodeViewState(app, null, null, {})), 'sem segmento nem dermátomos, o hash não os guarda');

  // classificação dos dermátomos em pontos conhecidos do modelo (x esquerda, y cima, z frente; a pele é simétrica em |x|)
  const d = derm.dermatomeOf;
  eq(d(0.2, 0.3, 0.9), 'V1', 'fronte: V1');
  eq(d(0.35, -0.5, 1.0), 'V2', 'bochecha: V2');
  eq(d(0.1, -1.0, 0.8), 'V3', 'queixo: V3');
  eq(d(0.2, -1.0, -0.6), 'C3', 'nuca: C3');
  eq(d(0.55, -3.05, 1.0), 'T4', 'mamilo: T4');
  eq(d(-0.55, -3.05, 1.0), 'T4', 'o lado direito espelha o esquerdo');
  eq(d(0.0, -5.5, 1.2), 'T10', 'umbigo: T10');
  eq(d(2.3, -3.5, -0.1), 'C5', 'face lateral do braço: C5');
  eq(d(2.7, -6.0, 0.2), 'C6', 'face radial do antebraço: C6');
  eq(d(2.76, -8.5, 1.0), 'C7', 'dedo médio: C7');
  eq(d(2.25, -8.4, 0.9), 'C8', 'dedo mínimo: C8');
}

console.log(`\n${checks} verificações.`);
if (failures.length) {
  console.error(`❌ ${failures.length} falha(s) nos testes das ferramentas de estudo.`);
  process.exit(1);
}
console.log('✔ Testes das ferramentas de estudo passaram com sucesso!');
