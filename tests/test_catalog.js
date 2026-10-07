/**
 * Validação rigorosa de integridade do catálogo anatômico (F0.1).
 * Executa sem navegador empacotando src/catalog.js via esbuild em memória.
 */
const esbuild = require('esbuild');
const path = require('path');

/** Empacota e executa um módulo ES de src/ (sem navegador) e devolve os exports. */
function loadModule(rel) {
  const result = esbuild.buildSync({
    entryPoints: [path.resolve(__dirname, rel)],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    write: false,
    logLevel: 'error',
  });
  const mod = { exports: {} };
  new Function('module', 'exports', result.outputFiles[0].text)(mod, mod.exports);
  return mod.exports;
}

function runTests() {
  console.log('--- Iniciando testes de integridade do catálogo ---');
  const failures = [];
  const logFail = (msg) => {
    failures.push(msg);
    console.error(`  ✖ FALHA: ${msg}`);
  };

  // 1. Empacotar src/catalog.js
  let bundleCode = '';
  try {
    const entry = path.resolve(__dirname, '../src/catalog.js');
    const result = esbuild.buildSync({
      entryPoints: [entry],
      bundle: true,
      format: 'cjs',
      platform: 'node',
      write: false,
      logLevel: 'error',
    });
    bundleCode = result.outputFiles[0].text;
  } catch (err) {
    console.error('Erro ao empacotar src/catalog.js com esbuild:', err);
    process.exit(1);
  }

  // 2. Executar módulo em escopo isolado
  const mod = { exports: {} };
  try {
    const fn = new Function('module', 'exports', bundleCode);
    fn(mod, mod.exports);
  } catch (err) {
    console.error('Erro ao avaliar catálogo empacotado:', err);
    process.exit(1);
  }

  const { ITEMS, INNERVATION, LAYERS, NERVES, KIND_LABEL, REGIONS } = mod.exports;

  if (!Array.isArray(ITEMS) || ITEMS.length === 0) {
    logFail('ITEMS não exportado ou vazio.');
    return finish(failures);
  }

  console.log(`Carregadas ${ITEMS.length} estruturas do catálogo.`);

  // 3. Validação de camadas
  const layerIds = new Set(LAYERS.map((l) => l.id));
  for (const l of LAYERS) {
    if (!l.id || !l.label || typeof l.depth !== 'number' || !l.color) {
      logFail(`Definição de camada inválida: ${JSON.stringify(l)}`);
    }
  }

  // 4. Identificadores únicos e formatos válidos
  const itemMap = new Map();
  for (const item of ITEMS) {
    if (!item.id || typeof item.id !== 'string') {
      logFail(`Item com id inválido: ${JSON.stringify(item)}`);
      continue;
    }
    if (itemMap.has(item.id)) {
      logFail(`Identificador duplicado: "${item.id}"`);
    }
    if (/\s/.test(item.id)) {
      logFail(`ID contém espaços: "${item.id}"`);
    }
    itemMap.set(item.id, item);

    // Campos básicos
    if (!item.name || typeof item.name !== 'string') {
      logFail(`Item "${item.id}" sem nome em português válido.`);
    }
    if (!item.latin || typeof item.latin !== 'string') {
      logFail(`Item "${item.id}" sem nome em latim válido.`);
    }
    if (!KIND_LABEL[item.kind]) {
      logFail(`Item "${item.id}" com tipo (kind) inválido: "${item.kind}".`);
    }
    if (!layerIds.has(item.layer)) {
      logFail(`Item "${item.id}" referencia camada inexistente: "${item.layer}".`);
    }

    // Região
    const regions = Array.isArray(item.region) ? item.region : [item.region];
    for (const r of regions) {
      if (!REGIONS[r]) {
        logFail(`Item "${item.id}" referencia região inexistente: "${r}".`);
      }
    }

    // Campos da ficha
    if (!Array.isArray(item.campos) || item.campos.length === 0) {
      logFail(`Item "${item.id}" não possui campos descritivos.`);
    } else {
      for (const campo of item.campos) {
        if (!Array.isArray(campo) || campo.length !== 2) {
          logFail(`Item "${item.id}" campo inválido: ${JSON.stringify(campo)}`);
        } else if (!campo[0] || !campo[1] || typeof campo[1] !== 'string' || !campo[1].trim()) {
          logFail(`Item "${item.id}" campo "${campo[0]}" está vazio.`);
        }
      }
    }
  }

  // 5. Validação de Músculos
  const muscles = ITEMS.filter((i) => i.kind === 'musculo');
  const requiredMuscleFields = ['Ação', 'Origem', 'Inserção', 'Inervação'];
  for (const m of muscles) {
    const camposMap = new Map(m.campos);
    for (const req of requiredMuscleFields) {
      if (!camposMap.has(req) || !camposMap.get(req).trim()) {
        logFail(`Músculo "${m.id}" não possui o campo obrigatório "${req}".`);
      }
    }

    const nerves = INNERVATION.get(m.id);
    if (!nerves || nerves.length === 0) {
      logFail(`Músculo "${m.id}" não possui nenhum nervo associado em INNERVATION.`);
    }
  }

  // 6. Validação de Nervos
  const nerves = ITEMS.filter((i) => i.kind === 'nervo');
  for (const n of nerves) {
    const hasBranch = Array.isArray(n.ramos) && n.ramos.length > 0;
    const hasPaths = Array.isArray(n.paths) && n.paths.length > 0;
    const hasParts = Array.isArray(n.parts) && n.parts.length > 0;
    if (!hasBranch && !hasPaths && !hasParts) {
      logFail(`Nervo "${n.id}" não possui ramos, trajetos nem malha real.`);
    }

    if (Array.isArray(n.ramos)) {
      for (const r of n.ramos) {
        if (!r.m || !itemMap.has(r.m)) {
          logFail(`Nervo "${n.id}" possui ramo para estrutura inexistente: "${r.m}".`);
        }
      }
    }
  }

  // 7. Ferramentas de estudo que dependem do catálogo: tours e grupos musculares
  const { TOURS, TOUR_VIEWS } = loadModule('../src/study/tours.js');
  const { GROUPS, MUSCLE_GROUP } = loadModule('../src/study/groups.js');
  const tourIds = new Set();
  for (const tour of TOURS) {
    if (tourIds.has(tour.id)) logFail(`Tour com id duplicado: "${tour.id}".`);
    tourIds.add(tour.id);
    for (const f of ['title', 'subtitle', 'description']) {
      if (!tour[f] || !String(tour[f]).trim()) logFail(`Tour "${tour.id}" sem ${f}.`);
    }
    if (!REGIONS[tour.region]) logFail(`Tour "${tour.id}" com região inexistente: "${tour.region}".`);
    if (!tour.steps?.length) logFail(`Tour "${tour.id}" sem passos.`);
    (tour.steps ?? []).forEach((st, i) => {
      const at = `Tour "${tour.id}", passo ${i + 1}`;
      if (!st.title || !st.text) logFail(`${at}: sem título ou texto.`);
      if (st.highlight && !itemMap.has(st.highlight)) logFail(`${at}: destaca estrutura inexistente "${st.highlight}".`);
      if (!TOUR_VIEWS.includes(st.view)) logFail(`${at}: vista inválida "${st.view}".`);
      if (!Number.isInteger(st.dissect) || st.dissect < 0 || st.dissect > 6) logFail(`${at}: dissecação inválida "${st.dissect}".`);
      if (!REGIONS[st.region]) logFail(`${at}: região inexistente "${st.region}".`);
      if (st.highlight && itemMap.has(st.highlight)) {
        const it = itemMap.get(st.highlight);
        const regs = Array.isArray(it.region) ? it.region : [it.region];
        if (!regs.includes(st.region) && !regs.includes('todos')) logFail(`${at}: "${st.highlight}" não pertence à região "${st.region}".`);
      }
    });
  }
  const groupIds = new Set(GROUPS.map((g) => g.id));
  for (const m of muscles) {
    const g = MUSCLE_GROUP.get(m.id);
    if (!g) logFail(`Músculo "${m.id}" sem grupo em src/study/groups.js (usado na coloração por grupo).`);
    else if (!groupIds.has(g)) logFail(`Músculo "${m.id}" aponta para grupo inexistente "${g}".`);
  }
  for (const id of MUSCLE_GROUP.keys()) {
    if (!itemMap.has(id) || itemMap.get(id).kind !== 'musculo') logFail(`src/study/groups.js lista "${id}", que não é um músculo do catálogo.`);
  }
  for (const g of groupIds) {
    if (![...MUSCLE_GROUP.values()].includes(g)) logFail(`Grupo "${g}" não tem nenhum músculo.`);
  }

  // 8. Contagens por tipo
  const counts = {};
  for (const item of ITEMS) {
    counts[item.kind] = (counts[item.kind] || 0) + 1;
  }

  finish(failures, counts);
}

function finish(failures, counts = {}) {
  console.log('\n--- Resumo por tipo de estrutura ---');
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k}: ${v}`);
  }

  if (failures.length > 0) {
    console.error(`\n❌ Testes falharam com ${failures.length} erro(s).`);
    process.exit(1);
  } else {
    console.log('\n✔ Todos os testes de integridade do catálogo passaram com sucesso!');
    process.exit(0);
  }
}

runTests();
