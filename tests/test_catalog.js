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

  const { ITEMS, INNERVATION, IRRIGATION, IRRIGATED, LAYERS, NERVES, KIND_LABEL, REGIONS } = mod.exports;

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

  // 6b. Articulações (F3): ficha completa, ossos, ligamentos e músculos existentes; músculos do membro superior com movimento
  const { MOVEMENTS, JOINTS_OF } = mod.exports;
  const { JOINT_LIGAMENTS } = loadModule('../src/catalog-joints.js');
  const joints = ITEMS.filter((i) => i.kind === 'articulacao');
  const requiredJointFields = ['Tipo', 'Superfícies articulares', 'Cápsula e membrana sinovial', 'Ligamentos', 'Inervação', 'Irrigação'];
  for (const j of joints) {
    const campos = new Map(j.campos);
    for (const req of requiredJointFields) if (!campos.get(req)?.trim()) logFail(`Articulação "${j.id}" sem o campo "${req}".`);
    if (!j.id.startsWith('art_')) logFail(`Articulação "${j.id}" sem o prefixo art_.`);
    for (const o of j.ossos ?? []) if (itemMap.get(o)?.kind !== 'osso') logFail(`Articulação "${j.id}" cita osso inexistente "${o}".`);
    for (const l of j.ligamentos ?? []) if (itemMap.get(l)?.kind !== 'ligamento') logFail(`Articulação "${j.id}" cita ligamento inexistente "${l}".`);
    if (!(j.movimentos ?? []).length) logFail(`Articulação "${j.id}" sem movimentos.`);
    for (const m of j.movimentos ?? []) {
      if (!m.mov?.trim()) logFail(`Articulação "${j.id}" com movimento sem nome.`);
      if (!m.agon.length && !m.obs) logFail(`Movimento "${m.mov}" de "${j.id}" sem músculos e sem observação.`);
      for (const id of [...m.agon, ...m.sin]) if (itemMap.get(id)?.kind !== 'musculo') logFail(`Movimento "${m.mov}" de "${j.id}" cita músculo inexistente "${id}".`);
      const dup = m.agon.filter((id) => m.sin.includes(id));
      if (dup.length) logFail(`Movimento "${m.mov}" de "${j.id}" lista como principal e auxiliar: ${dup.join(', ')}.`);
    }
    if (!(j.proc ?? []).length) logFail(`Articulação "${j.id}" sem geometria (cápsula).`);
  }
  // músculos que cruzam articulações do membro superior: todos têm ao menos um movimento (o palmar curto só move a pele)
  const limbGroups = new Set(['ombro', 'braco_ant', 'braco_post', 'antebraco_flex', 'antebraco_ext', 'mao_tenar', 'mao_hipotenar', 'mao_central']);
  const { MUSCLE_GROUP: MG } = loadModule('../src/study/groups.js');
  for (const m of muscles) {
    if (limbGroups.has(MG.get(m.id)) && m.id !== 'palmar_curto' && !MOVEMENTS.has(m.id)) logFail(`Músculo do membro superior "${m.id}" sem movimento em nenhuma articulação.`);
  }
  // ligamentos das articulações: cada um pertence a uma articulação (a membrana interóssea é ela mesma uma sindesmose)
  for (const l of JOINT_LIGAMENTS) {
    if (l.id !== 'lig_membrana_interossea' && !JOINTS_OF.has(l.id)) logFail(`Ligamento "${l.id}" não pertence a nenhuma articulação.`);
  }
  // ramos articulares: cada nervo citado por uma articulação lista a articulação nos seus ramos
  for (const j of joints) {
    for (const n of j.nervos ?? []) {
      if (!(INNERVATION.get(j.id) ?? []).some((l) => l.nervo === n)) logFail(`Articulação "${j.id}" cita o nervo "${n}", que não aparece na inervação.`);
    }
  }

  // 6c. Circulatório (F5): peças do pacote ↔ fichas, camadas por tipo, vizinhas existentes e câmaras e valvas completas
  {
    const fs = require('fs');
    const readPack = (name) => {
      const pack = fs.readFileSync(path.resolve(__dirname, `../dist/anatomy-${name}.js`), 'utf8');
      return new Set(JSON.parse(pack.slice(pack.indexOf('=') + 1).replace(/;\s*$/, '')).manifest.map((p) => p.id));
    };
    const circPieces = readPack('circ');
    const respPieces = readPack('resp');
    const pieces = new Set([...circPieces, ...respPieces]);
    const circ = ITEMS.filter((i) => ['cardiaco', 'arteria', 'veia', 'orgao'].includes(i.kind) && i.parts?.length);
    // peças usadas por qualquer ficha (as cartilagens da laringe são fichas de osso no pacote do respiratório)
    const used = new Set(ITEMS.flatMap((i) => (i.parts ?? []).map((p) => p.id)));
    for (const i of circ) {
      const want = { cardiaco: 'coracao', arteria: 'arteria', veia: 'veia', orgao: 'respiratorio' }[i.kind];
      if (i.layer !== want) logFail(`"${i.id}" (${i.kind}) deveria estar na camada "${want}", e não em "${i.layer}".`);
      const home = i.kind === 'orgao' ? respPieces : circPieces;
      for (const p of i.parts ?? []) {
        if (!home.has(p.id)) logFail(`"${i.id}" usa a peça "${p.id}", que não está no pacote do ${i.kind === 'orgao' ? 'respiratório' : 'circulatório'}.`);
      }
      if (i.kind === 'orgao' && i.malha === 'hra' && !/Atlas de Referência Humano/.test(i.nota ?? '')) logFail(`"${i.id}" tem malha do HRA e a nota não diz de onde ela vem.`);
      for (const r of i.relacionados ?? []) {
        if (!itemMap.has(r)) logFail(`"${i.id}" relaciona estrutura inexistente "${r}".`);
        else if (!(itemMap.get(r).relacionados ?? []).includes(i.id)) logFail(`"${i.id}" cita "${r}", que não o cita de volta (o catálogo deveria completar a ligação).`);
      }
    }
    for (const p of pieces) if (!used.has(p)) logFail(`A peça "${p}" do pacote do circulatório não é usada por nenhuma ficha.`);
    for (const id of ['atrio_direito', 'atrio_esquerdo', 'ventriculo_direito', 'ventriculo_esquerdo', 'valva_tricuspide', 'valva_mitral', 'valva_aortica', 'valva_pulmonar']) {
      if (itemMap.get(id)?.kind !== 'cardiaco') logFail(`Câmara ou valva "${id}" ausente do coração.`);
    }
    for (const id of ['aorta_ascendente', 'arco_aorta', 'aorta_toracica', 'aorta_abdominal', 'tronco_pulmonar', 'coronaria_direita', 'ramo_interventricular_anterior', 'ramo_circunflexo']) {
      if (itemMap.get(id)?.kind !== 'arteria') logFail(`Artéria "${id}" ausente.`);
    }
    for (const id of ['veia_cava_superior', 'veia_cava_inferior', 'seio_coronario', 'veia_azigo']) {
      if (itemMap.get(id)?.kind !== 'veia') logFail(`Veia "${id}" ausente.`);
    }
  }

  // 6d. Irrigação (M15), ficha completa dos vasos (M16) e feixes neurovasculares (M17)
  {
    const { FEIXES } = loadModule('../src/neurovascular.js');
    for (const m of muscles) {
      const arts = IRRIGATION.get(m.id);
      if (!arts?.length) { logFail(`Músculo "${m.id}" sem artéria em IRRIGATION.`); continue; }
      const texto = m.campos.find(([k]) => k === 'Irrigação')?.[1];
      if (!texto || texto.length < 15) logFail(`Músculo "${m.id}" sem o campo "Irrigação" na ficha.`);
      for (const a of arts) {
        if (itemMap.get(a)?.kind !== 'arteria') logFail(`"${m.id}" é irrigado por "${a}", que não é artéria do catálogo.`);
        if (!(IRRIGATED.get(a) ?? []).includes(m.id)) logFail(`"${a}" não lista "${m.id}" entre os músculos irrigados.`);
      }
    }
    for (const [a, ms] of IRRIGATED) for (const m of ms) if (!(IRRIGATION.get(m) ?? []).includes(a)) logFail(`IRRIGATED lista "${m}" para "${a}", sem volta em IRRIGATION.`);
    for (const id of ['arteria_radial', 'arteria_femoral', 'arteria_carotida_comum', 'arteria_braquial', 'arteria_poplitea']) {
      if (!itemMap.get(id)?.campos.some(([k]) => k === 'Pulso e compressão')) logFail(`"${id}" sem o campo "Pulso e compressão".`);
      if (!itemMap.get(id)?.campos.some(([k]) => k === 'Relações')) logFail(`"${id}" sem o campo "Relações".`);
    }
    if (FEIXES.length < 10) logFail(`Esperados ao menos 10 feixes neurovasculares, há ${FEIXES.length}.`);
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
