/**
 * Teste de fumaça automatizado no navegador (F0.2).
 * Inicia servidor local temporário, lança Chrome/Edge em modo headless e valida:
 *  - Carga da página e inicialização do Three.js / window.__app
 *  - Ausência total de erros no console
 *  - Seleção de uma estrutura (abre painel de informações)
 *  - Abertura e fechamento do modo quiz (localizar / setup)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(ROOT, reqPath);

      // Bloquear caminhos fora da raiz
      if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Proibido');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('Não encontrado: ' + reqPath);
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Cache-Control': 'no-cache',
        });
        res.end(data);
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

function findBrowser() {
  if (process.env.BROWSER_PATH && fs.existsSync(process.env.BROWSER_PATH)) {
    return process.env.BROWSER_PATH;
  }
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  const candidates = [
    // Windows Chrome / Edge
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runSmokeTest() {
  console.log('--- Teste de fumaça no navegador (F0.2) ---');

  const browserPath = findBrowser();
  if (!browserPath) {
    console.error('Nenhum navegador (Chrome ou Edge) encontrado no sistema.');
    process.exit(1);
  }
  console.log(`Usando navegador: ${browserPath}`);

  const { server, port } = await startServer();
  // SMOKE_FILE=1 abre o index.html por file:// (como no duplo clique do usuário) em vez de usar o servidor
  const url = process.env.SMOKE_FILE
    ? require('url').pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href
    : `http://127.0.0.1:${port}/index.html`;
  console.log(`${process.env.SMOKE_FILE ? 'Abrindo por file://' : 'Servidor local ativo em'}: ${url}`);

  const debugPort = 9333 + Math.floor(Math.random() * 500);
  const browserProc = spawn(browserPath, [
    '--headless=new',
    `--remote-debugging-port=${debugPort}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--mute-audio',
    '--window-size=1280,800',
    url,
  ]);

  let isKilled = false;
  const killBrowser = () => {
    if (!isKilled) {
      isKilled = true;
      try { browserProc.kill(); } catch (_) {}
      try { server.close(); } catch (_) {}
    }
  };

  process.on('exit', killBrowser);
  process.on('SIGINT', killBrowser);
  process.on('SIGTERM', killBrowser);

  // Aguardar CDP estar disponível
  let targets = null;
  // em servidor de CI o Chrome pode levar bem mais de 6 s para abrir a porta de depuração
  for (let i = 0; i < 150; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      targets = await fetchJson(`http://127.0.0.1:${debugPort}/json`);
      if (targets && targets.length > 0) break;
    } catch (_) {}
  }

  if (!targets || targets.length === 0) {
    console.error('Falha ao conectar à porta de depuração do navegador.');
    killBrowser();
    process.exit(1);
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log(`Conectado ao DevTools Protocol: ${pageTarget.title || 'Página'}`);

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const pending = new Map();
  const consoleErrors = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      const type = data.params.type;
      const text = data.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
      if (type === 'error') {
        consoleErrors.push(`[Console error] ${text}`);
      }
    } else if (data.method === 'Runtime.exceptionThrown') {
      const desc = data.params.exceptionDetails?.exception?.description || data.params.exceptionDetails?.text;
      consoleErrors.push(`[Exceção não tratada] ${desc}`);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text;
      throw new Error(`Erro na avaliação: ${desc}`);
    }
    return res.result?.value;
  }

  try {
    // 1. Aguardar carregamento completo de window.__app
    console.log('Aguardando inicialização da cena e carregamento de window.__app...');
    let ready = false;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const res = await evaluate('Boolean(window.__app && window.__app.M && window.__app.M.size > 0)');
      if (res === true) {
        ready = true;
        break;
      }
    }

    if (!ready) {
      throw new Error('Tempo limite excedido aguardando inicialização de window.__app.');
    }
    console.log('✔ Cena 3D e estruturas carregadas.');

    // 2. Verificar seleção de estrutura
    console.log('Testando seleção de estrutura ("frontal")...');
    const selectRes = await evaluate(`
      (() => {
        window.__app.select('frontal', { fly: false });
        const info = document.getElementById('info');
        const infoBody = document.getElementById('infoBody');
        const title = infoBody ? infoBody.querySelector('h2')?.textContent : '';
        const geomBadge = infoBody ? infoBody.querySelector('.geom-badge')?.textContent : '';
        const perf = window.__app.perf;
        return {
          isOpen: info.classList.contains('open'),
          title: title,
          geomBadge: geomBadge,
          hasPerf: Boolean(perf && perf.ttfiMs > 0)
        };
      })()
    `);

    if (!selectRes.isOpen || !selectRes.title.includes('frontal')) {
      throw new Error(`Falha ao selecionar estrutura: ${JSON.stringify(selectRes)}`);
    }
    if (!selectRes.geomBadge || !selectRes.geomBadge.includes('Modelada por código')) {
      throw new Error(`Badge de fidelidade geométrica ausente ou incorreto: ${selectRes.geomBadge}`);
    }
    if (!selectRes.hasPerf) {
      throw new Error('Métricas de desempenho (perf.ttfiMs) não foram registradas.');
    }
    console.log(`✔ Estrutura selecionada com sucesso: "${selectRes.title}" [${selectRes.geomBadge}].`);
    console.log('✔ Métricas de desempenho validadas com sucesso em window.__app.perf.');

    // 3. Testar modo Quiz (abertura do setup)
    console.log('Testando abertura do modal de Quiz...');
    const quizSetupRes = await evaluate(`
      (() => {
        window.__app.openSetup();
        const modal = document.getElementById('quizSetup');
        return !modal.hasAttribute('hidden') && modal.style.display !== 'none';
      })()
    `);

    if (!quizSetupRes) {
      throw new Error('Modal de configuração do Quiz não abriu corretamente.');
    }
    console.log('✔ Modal de configuração do Quiz aberto.');

    // 4. Iniciar Quiz de Localizar e depois sair
    console.log('Testando início do Quiz de Localizar e saída...');
    const quizStartRes = await evaluate(`
      (() => {
        window.__app.startLocate({ region: 'cabeca', kinds: ['musculo'], count: 5, withLatin: false });
        const loc = document.getElementById('locate');
        const locName = document.getElementById('locName')?.textContent;
        return {
          isActive: !loc.hasAttribute('hidden'),
          locName: locName
        };
      })()
    `);

    if (!quizStartRes.isActive || !quizStartRes.locName) {
      throw new Error(`Falha ao iniciar Quiz de Localizar: ${JSON.stringify(quizStartRes)}`);
    }
    console.log(`✔ Quiz de Localizar ativo perguntando por: "${quizStartRes.locName}".`);

    // Sair do quiz
    await evaluate(`
      (() => {
        document.getElementById('locExit').click();
        window.__app.select(null, { fly: false });
      })()
    `);

    const exited = await evaluate(`
      (() => {
        const loc = document.getElementById('locate');
        return loc.hasAttribute('hidden');
      })()
    `);

    if (!exited) {
      throw new Error('Falha ao sair do Quiz de Localizar.');
    }
    console.log('✔ Saída do Quiz executada com sucesso.');

    // 5. Ferramentas de estudo (F1): dirigidas pela interface, não só pela API
    console.log('Testando Ferramentas de Estudo (F1)...');

    // As funções abaixo são serializadas e executadas dentro da página (sem acesso às variáveis deste arquivo).
    const run = async (fn, label) => {
      const failures = await evaluate(`(${fn.toString()})()`);
      if (!Array.isArray(failures)) throw new Error(`${label}: resposta inesperada ${JSON.stringify(failures)}`);
      if (failures.length) throw new Error(`${label}:\n    - ${failures.join('\n    - ')}`);
      console.log(`  ✔ ${label}`);
    };

    // o corpo e os nervos carregam em segundo plano; vários testes abaixo dependem deles
    for (let i = 0; i < 160; i++) {
      if (await evaluate('Boolean(window.__app.state.nervesReady)')) break;
      await new Promise((r) => setTimeout(r, 250));
    }

    await run(async () => {
      const f = [];
      const t = (c, m) => { if (!c) f.push(m); };
      const app = window.__app;
      t(app.studyController && app.userData, 'studyController ou userData ausentes em window.__app');
      document.getElementById('btnStudy').click();
      t(!document.getElementById('studyModal').hidden, 'o modal de estudo não abriu');
      const cards = [...document.querySelectorAll('.tour-card')];
      t(cards.length === 6, `esperava 6 tours, veio ${cards.length}`);
      for (const c of cards) {
        t(!/undefined|null|NaN/.test(c.innerText), `cartão de tour com texto quebrado: ${c.innerText.slice(0, 60)}`);
        t((c.querySelector('.tour-desc')?.innerText.length ?? 0) > 20, 'cartão de tour sem descrição');
      }
      for (const tab of document.querySelectorAll('#studyModal .tab-btn')) {
        tab.click();
        const pane = document.querySelector('#studyModal .tab-pane[data-pane="' + tab.dataset.tab + '"]');
        t(pane && !pane.hidden, 'aba "' + tab.dataset.tab + '" não abriu seu painel');
        t(document.querySelectorAll('#studyModal .tab-pane:not([hidden])').length === 1, 'mais de um painel visível ao abrir "' + tab.dataset.tab + '"');
        t(pane && /\S/.test(pane.innerText), 'painel "' + tab.dataset.tab + '" vazio');
        t(!/undefined|NaN/.test(pane?.innerText ?? ''), 'painel "' + tab.dataset.tab + '" com texto quebrado');
      }
      document.getElementById('studyClose').click();
      t(document.getElementById('studyModal').hidden, 'o modal de estudo não fechou');
      return f;
    }, 'modal, abas e cartões dos tours');

    await run(async () => {
      const f = [];
      const app = window.__app;
      const sc = app.studyController;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      for (const id of ['manguito', 'plexo_braquial', 'nervo_radial', 'mastigacao_v3', 'facial_mimica', 'parede_abdominal']) {
        sc.startTour(id);
        const n = sc.activeTour.steps.length;
        for (let i = 0; i < n; i++) {
          await sleep(30);
          app.jump();
          app.controls.update();
          const step = sc.activeTour.steps[i];
          const where = id + ' passo ' + (i + 1);
          if (step.highlight) {
            if (app.state.selected !== step.highlight) f.push(where + ': destacou "' + app.state.selected + '" em vez de "' + step.highlight + '"');
            const m = app.M.get(step.highlight);
            const near = Math.min(...m.anchors.map((a) => a.pos.distanceTo(app.controls.target)));
            if (!(near < 2.5)) f.push(where + ': a câmera está a ' + near.toFixed(1) + ' da estrutura (não enquadrou)');
          }
          if (document.getElementById('tourBox').hidden) f.push(where + ': painel do tour escondido');
          if (i < n - 1) sc.tourStep(1);
        }
        sc.stopTour();
      }
      if (!document.getElementById('tourBox').hidden) f.push('o painel do tour continua aberto depois de sair');
      return f;
    }, 'os 24 passos dos 6 tours destacam e enquadram a estrutura');

    await run(async () => {
      const f = [];
      const t = (c, m) => { if (!c) f.push(m); };
      const app = window.__app;
      const ud = app.userData;
      const sc = app.studyController;
      ud.setNote('frontal', 'Teste de anotação');
      ud.toggleFavorite('frontal');
      t(ud.isFavorite('frontal') && ud.getNote('frontal') === 'Teste de anotação', 'favorito/anotação não gravaram');

      // progresso: um ponto fraco claro e outro que se recuperou
      ud.recordQuizResult('masseter', 1);
      ud.recordQuizResult('temporal', 1);
      for (let i = 0; i < 4; i++) ud.recordQuizResult('temporal', 5);
      ud.recordSession({ mode: 'locate', region: 'cabeca', smart: 'all', score: 7, total: 10, ms: 60000 });
      sc.openModal('progress');
      const text = document.getElementById('progressPanel').innerText;
      t(/Onde você mais erra/i.test(text), 'painel de progresso sem a lista de pontos fracos');
      t(/Masseter/.test(text), 'o masseter (errou na última) deveria aparecer como ponto fraco');
      t(!/Temporal/.test(document.querySelector('.weak-list')?.innerText ?? ''), 'o temporal (1 erro e 4 acertos) não deveria ser ponto fraco');
      t(/Últimas rodadas/i.test(text) && /7\/10/.test(text), 'histórico de rodadas ausente');
      t(!/undefined|NaN/.test(text), 'painel de progresso com texto quebrado');
      sc.closeModal();
      const weak = sc.smartSet('weak');
      t(weak.has('masseter') && !weak.has('temporal'), 'o filtro "pontos fracos" ficou inconsistente com o painel');
      return f;
    }, 'favoritos, anotações, progresso e pontos fracos');

    await run(async () => {
      const f = [];
      const t = (c, m) => { if (!c) f.push(m); };
      const app = window.__app;
      const sc = app.studyController;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const key = (k) => window.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

      // criar uma lista pela interface
      sc.openModal('lists');
      document.getElementById('newListName').value = 'Mastigação';
      document.getElementById('btnCreateList').click();
      let card = document.querySelector('.list-card');
      t(card, 'a lista não foi criada');
      for (const nome of ['Masseter', 'temporal', 'Pterigóideo medial']) {
        card = document.querySelector('.list-card');
        card.querySelector('.list-add input').value = nome;
        card.querySelector('[data-act="add-name"]').click();
      }
      const list = app.userData.getCustomLists()[0];
      t(list && list.ids.length === 3, 'a lista deveria ter 3 estruturas, tem ' + (list && list.ids.length));
      const ids = new Set(list.ids);

      // "Estudar esta lista" abre a configuração já com o filtro
      document.querySelector('.list-card [data-act="study"]').click();
      t(!document.getElementById('quizSetup').hidden && app.setup.smart === 'list:' + list.id, 'estudar a lista não abriu a configuração filtrada');
      const select = document.getElementById('qsListSel');
      t(!select.hidden && select.value === 'list:' + list.id, 'o seletor de listas não mostra a lista escolhida');
      document.getElementById('quizSetup').hidden = true;

      for (const mode of ['locate', 'choice', 'text']) {
        app.setup.mode = mode;
        app.setup.smart = 'list:' + list.id;
        app.setup.count = 0;
        app.setRegion('cabeca', { fly: false }); // openSetup() parte da região em foco
        app.openSetup();
        t(!document.getElementById('qsStart').disabled, mode + ': botão Começar desabilitado com a lista');
        document.getElementById('qsStart').click();
        await sleep(150);
        const q = app.state.quiz;
        t(q && q.mode === mode, mode + ': o quiz não iniciou');
        if (!q) continue;
        if (mode === 'locate') t(q.ids.length === 3 && q.ids.every((id) => ids.has(id)), 'localizar: perguntas fora da lista ' + q.ids.join(','));
        if (mode === 'choice') {
          for (let i = 0; i < 6; i++) {
            if (!ids.has(app.state.quiz.current)) f.push('escolher: perguntou "' + app.state.quiz.current + '", que não está na lista');
            key('1');
            await sleep(30);
            key('Enter');
            await sleep(30);
          }
          t(app.state.quiz.total === 6, 'escolher: o atalho 1 + Enter não respondeu as 6 perguntas (' + app.state.quiz.total + ')');
        }
        if (mode === 'text') {
          t(q.pool.every((i) => ids.has(i.id)), 'teórico: pool fora da lista');
          t(q.limit === 3, 'teórico: limite de perguntas deveria ser 3, é ' + q.limit);
          for (let i = 0; i < 3; i++) {
            const opts = document.querySelectorAll('#tqOptions button');
            t(opts.length === 4, 'teórico: ' + opts.length + ' alternativas');
            key('1');
            await sleep(30);
            key('Enter');
            await sleep(30);
          }
          t(app.state.quiz.finished, 'teórico: não terminou depois de 3 respostas');
          t(/Fim do quiz/.test(document.getElementById('tqPrompt').innerText), 'teórico: sem tela de resultado');
          t(app.state.selected === null, 'teórico: estrutura ficou selecionada no resultado');
        }
        // durante o quiz os nomes das estruturas não podem aparecer no modelo
        await sleep(120);
        const visibleLabels = [...document.querySelectorAll('.lbl')].filter((e) => e.style.display !== 'none').length;
        t(visibleLabels === 0, mode + ': ' + visibleLabels + ' rótulo(s) visível(is) durante o quiz');
        app.stopQuiz();
        await sleep(60);
        t(app.state.quiz === null, mode + ': não saiu do quiz');
      }
      const modes = app.userData.getSessions().map((s) => s.mode);
      t(['choice', 'text'].every((m) => modes.includes(m)), 'o histórico deveria ter sessões de escolha e teórico, tem: ' + modes.join(','));
      return f;
    }, 'listas na interface, filtro nos 3 quizzes, atalhos, rótulos ocultos e histórico');

    await run(async () => {
      const f = [];
      const t = (c, m) => { if (!c) f.push(m); };
      const app = window.__app;
      const sc = app.studyController;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      app.setRegion('cabeca', { fly: false });
      app.setDissect(3);

      // cores: precisam sobreviver a seleção e hover
      sc.coloring.setMode('grupo');
      const want = sc.coloring.overrides.get('masseter');
      t(want, 'coloração por grupo não definiu cor para o masseter');
      const mat = app.M.get('masseter').mats[0];
      app.select('masseter', { fly: false, panel: false });
      t(mat.color.equals(want), 'a cor do grupo sumiu quando o masseter foi selecionado');
      app.select(null, { fly: false });
      app.state.hover = 'masseter';
      app.applyHighlight();
      t(mat.color.equals(want), 'a cor do grupo sumiu com o mouse em cima');
      app.state.hover = null;
      await sleep(350);
      const legend = document.getElementById('colorLegend');
      t(!legend.hidden && legend.querySelectorAll('li').length >= 3, 'legenda não apareceu');
      for (const mode of ['nervo', 'regiao']) {
        sc.coloring.setMode(mode);
        t(sc.coloring.overrides.size > 20, 'modo ' + mode + ': poucas estruturas coloridas (' + sc.coloring.overrides.size + ')');
      }
      sc.coloring.setMode('camada');
      app.applyHighlight();
      await sleep(350);
      t(legend.hidden, 'a legenda deveria sumir no modo padrão');
      t(mat.color.equals(mat.userData.baseColor), 'a cor original não voltou no modo padrão');

      // corte
      sc.clipping.setAxis('axial');
      sc.clipping.setOffset(0);
      sc.syncClipUi();
      t(app.renderer.clippingPlanes.length === 1, 'o plano de corte não foi registrado');
      t(!document.getElementById('clipChip').hidden, 'o aviso de corte ativo não apareceu');
      sc.resetClip();
      t(app.renderer.clippingPlanes.length === 0 && document.getElementById('clipChip').hidden, 'o corte não desativou');
      return f;
    }, 'coloração (sobrevive à seleção, legenda) e plano de corte');

    await run(async () => {
      const f = [];
      const t = (c, m) => { if (!c) f.push(m); };
      const app = window.__app;
      const sc = app.studyController;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

      // uma vista com bastante coisa
      app.setRegion('tronco', { fly: false });
      app.setDissect(3);
      app.state.layers.delete('nervo');
      app.state.hidden.add('grande_dorsal');
      app.setSkin(0.5);
      app.syncLayers();
      sc.clipping.setAxis('axial');
      sc.clipping.setOffset(0.3);
      sc.coloring.setMode('regiao');
      app.select('trapezio_desc', { fly: false, panel: false });
      const hash = sc.currentHash();
      t(/sel=trapezio_desc/.test(hash) && /clip=axial/.test(hash) && /col=regiao/.test(hash) && /ly=/.test(hash) && /hid=grande_dorsal/.test(hash), 'o hash não guarda tudo: ' + hash);

      // salva com um nome malicioso e uma anotação maliciosa
      const evil = '<img src=x onerror="window.__xss=1">';
      app.userData.saveView(evil, hash);
      app.userData.setNote('masseter', '</textarea><img src=x onerror="window.__xss=2">');

      // bagunça tudo e restaura pela interface
      app.select(null, { fly: false });
      app.setRegion('cabeca', { fly: false });
      app.setDissect(1);
      sc.resetClip();
      sc.coloring.setMode('camada');
      app.state.hidden.clear();
      app.syncLayers();
      sc.openModal('backup');
      t(!document.querySelector('#savedViewsList img'), 'nome de vista com HTML foi interpretado como HTML');
      const btn = [...document.querySelectorAll('#savedViewsList [data-act="apply"]')].pop();
      btn.click();
      await sleep(400);
      const s = app.state;
      t(s.region === 'tronco' && s.dissect === 3, 'região/dissecação não voltaram');
      t(!s.layers.has('nervo'), 'a camada de nervos desligada não voltou');
      t(s.hidden.has('grande_dorsal'), 'a estrutura oculta não voltou');
      t(Math.abs(s.skin - 0.5) < 0.01, 'a opacidade da pele não voltou');
      t(sc.clipping.serialize() === 'axial,0.3,0', 'o corte não voltou: ' + sc.clipping.serialize());
      t(sc.coloring.mode === 'regiao', 'a coloração não voltou');
      t(s.selected === 'trapezio_desc', 'a seleção não voltou');

      // o link copiado precisa ser um endereço de verdade, inclusive em file:// (onde "origin" vale "null")
      const url = sc.shareUrl();
      t(url.startsWith(window.location.protocol) && !/^null/.test(url), 'link de compartilhamento quebrado: ' + url.slice(0, 40));
      t(url.includes('#sel=trapezio_desc'), 'o link não leva a vista: ' + url.slice(-60));

      // uma vista "padrão" (dissecação 1, pele 14%) restaurada sobre outra não pode herdar o estado anterior
      app.setDissect(4);
      app.setSkin(0.9);
      app.state.hidden.add('masseter');
      app.syncLayers();
      app.userData.saveView('padrão', '');
      document.querySelector('#studyModal .tab-btn[data-tab="backup"]').click();
      [...document.querySelectorAll('#savedViewsList [data-act="apply"]')].pop().click();
      await sleep(300);
      t(app.state.dissect === 1 && app.state.region === 'cabeca' && Math.abs(app.state.skin - 0.14) < 0.01 && app.state.hidden.size === 0 && sc.coloring.mode === 'camada' && sc.clipping.serialize() === '',
        'a vista padrão não zerou o estado: dis=' + app.state.dissect + ' reg=' + app.state.region + ' skin=' + app.state.skin);

      // a anotação é texto puro
      app.select('masseter', { fly: false });
      const area = document.getElementById('structureNote');
      t(area && area.value.startsWith('</textarea>'), 'a anotação não apareceu inteira como texto');
      t(!document.querySelector('#infoBody img'), 'anotação com HTML foi interpretada como HTML');
      t(!window.__xss, 'um script de anotação ou de nome de vista foi executado');
      sc.closeModal();
      sc.resetClip();
      sc.coloring.setMode('camada');
      return f;
    }, 'vista na URL (camadas, corte, cores), vistas salvas e proteção contra HTML injetado');

    await run(async () => {
      const f = [];
      const t = (c, m) => { if (!c) f.push(m); };
      const app = window.__app;
      const ud = app.userData;
      const json = ud.exportJson();
      const copy = JSON.parse(json);
      t(copy.format === 'anatomia3d-userdata' && copy.data.customLists.length === 1, 'exportação sem as listas');
      const before = ud.getFavorites().length;
      const res = ud.importJson(json);
      t(res.success && ud.getFavorites().length === before, 'reimportar o próprio backup mudou os dados');
      t(!ud.importJson('{"x":1}').success, 'aceitou um arquivo que não é backup');
      return f;
    }, 'exportar e importar o backup');

    console.log('✔ Ferramentas de Estudo validadas no navegador.');

    // 5b. Celular e tablet: a gaveta da lista precisa abrir E fechar (iPhone 11 = 414×896 é o mínimo; tablets até ~11,5")
    console.log('Testando a gaveta lateral em celular e tablet...');
    const drawerCheck = async (fn, label) => run(fn, label);
    // sem transições: o estado aberto/fechado é o que importa, e o Chrome sem janela nem sempre anima (no Windows a
    // gaveta ficava parada no meio da transição e o teste oscilava)
    await evaluate("(() => { const st = document.createElement('style'); st.id = 'testNoAnim'; st.textContent = '*,*::after{transition:none!important;animation:none!important}'; document.head.appendChild(st); })()");
    const viewports = [
      ['iPhone 11 em pé (414×896)', { width: 414, height: 896, mobile: true }],
      ['iPhone 11 deitado (896×414)', { width: 896, height: 414, mobile: true }],
      ['tablet 11" em pé (834×1194)', { width: 834, height: 1194, mobile: true }],
      ['tablet 2200×1440 em pé (720×1100)', { width: 720, height: 1100, mobile: true }],
    ];
    for (const [name, vp] of viewports) {
      await send('Emulation.setDeviceMetricsOverride', { ...vp, deviceScaleFactor: 2 });
      await new Promise((r) => setTimeout(r, 800));
      await drawerCheck(async () => {
        const f = [];
        const t = (c, m) => { if (!c) f.push(m); };
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const sidebar = document.getElementById('sidebar');
        const open = () => document.body.classList.contains('list-open');
        const vis = () => { const r = sidebar.getBoundingClientRect(); return r.right > 40 && getComputedStyle(sidebar).visibility !== 'hidden'; };
        t(!open() && !vis(), 'a gaveta deveria começar fechada (right ' + Math.round(sidebar.getBoundingClientRect().right) + ', ' + getComputedStyle(sidebar).visibility + ', ' + getComputedStyle(sidebar).transform + ', ' + innerWidth + ')');
        t(document.documentElement.scrollWidth <= window.innerWidth, 'a página tem rolagem horizontal');
        const fab = document.getElementById('openList');
        t(fab.getBoundingClientRect().width > 0, 'o botão de abrir a lista não aparece');
        const fr = fab.getBoundingClientRect();
        t(fr.height >= 32, 'o botão de abrir a lista é pequeno demais para o toque (' + Math.round(fr.height) + ' px)');

        // abre
        fab.click(); await sleep(800);
        t(open() && vis(), 'a gaveta não abriu');
        t(fab.getAttribute('aria-expanded') === 'true', 'aria-expanded não acompanhou a abertura');
        const sr = sidebar.getBoundingClientRect();
        t(sr.width <= window.innerWidth * 0.9, 'a gaveta cobre mais de 90% da largura (' + Math.round(sr.width) + ' de ' + window.innerWidth + ')');
        // o fundo escurecido existe e é o palco: é nele que o toque cai
        const probe = document.elementFromPoint(Math.min(window.innerWidth - 4, sr.right + 10), window.innerHeight / 2);
        t(probe && probe.id === 'stage', 'fora da gaveta o toque não cai no fundo de fechamento (caiu em ' + (probe && (probe.id || probe.tagName)) + ')');
        // fecha tocando fora
        probe.click(); await sleep(800);
        t(!open() && !vis(), 'tocar fora não fechou a gaveta');

        // abre de novo e fecha pelo X
        fab.click(); await sleep(800);
        const x = document.getElementById('closeList');
        const xr = x.getBoundingClientRect();
        t(xr.width >= 40 && xr.height >= 40, 'o botão de fechar é pequeno demais (' + Math.round(xr.width) + '×' + Math.round(xr.height) + ')');
        t(xr.right <= window.innerWidth && xr.left >= 0, 'o botão de fechar está fora da tela');
        x.click(); await sleep(800);
        t(!open() && !vis(), 'o X não fechou a gaveta');

        // abre e escolhe uma estrutura: fecha sozinha
        fab.click(); await sleep(800);
        document.querySelector('#list .item').click(); await sleep(800);
        t(!open(), 'escolher uma estrutura deveria fechar a gaveta');

        // Esc também fecha
        fab.click(); await sleep(800);
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await sleep(800);
        t(!open(), 'Esc não fechou a gaveta');

        // o campo de busca não pode provocar zoom no iPhone (fonte >= 16 px em tela de toque)
        const fs = parseFloat(getComputedStyle(document.getElementById('search')).fontSize);
        t(fs >= 16 || !matchMedia('(pointer: coarse)').matches, 'campo de busca com ' + fs + ' px: o Safari dá zoom ao focar');
        // o botão de baixar o .exe nunca aparece em tela pequena nem fora do https
        t(document.getElementById('getApp').hidden || getComputedStyle(document.getElementById('getApp')).display === 'none', 'o botão do .exe apareceu no celular');
        return f;
      }, name);

      // arrastar o dedo começando sobre os chips rola a gaveta (antes só a <ul> rolava, e no toque os chips ocupam
      // a maior parte da altura: o gesto não fazia nada)
      await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
      const pt = await evaluate(`(async () => {
        document.getElementById('openList').click(); await new Promise((r) => setTimeout(r, 800));
        document.querySelector('#sidebar .side-scroll').scrollTop = 0; // a seleção anterior rolou a lista até o item
        await new Promise((r) => setTimeout(r, 100));
        const r = document.getElementById('chips').getBoundingClientRect();
        const y = Math.round(Math.min(r.top + r.height / 2, innerHeight - 30));
        return { x: Math.round(r.left + r.width / 2), y, dy: Math.min(300, y - 20) };
      })()`);
      await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pt.x, y: pt.y }] });
      for (let i = 1; i <= 12; i++) {
        await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: pt.x, y: pt.y - (pt.dy * i) / 12 }] });
        await new Promise((r) => setTimeout(r, 16));
      }
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      const scrolled = await evaluate(`(async () => {
        await new Promise((r) => setTimeout(r, 400));
        const s = document.querySelector('#sidebar .side-scroll'); const v = s.scrollTop; s.scrollTop = 0;
        const open = document.body.classList.contains('list-open');
        document.getElementById('closeList').click(); await new Promise((r) => setTimeout(r, 800));
        return { v, open };
      })()`);
      await send('Emulation.setTouchEmulationEnabled', { enabled: false });
      if (!(scrolled.v > 40)) throw new Error(`${name}: arrastar o dedo sobre os chips não rolou a gaveta (scrollTop ${scrolled.v})`);
      if (!scrolled.open) throw new Error(`${name}: rolar a gaveta na vertical a fechou`);
      console.log(`  ✔ ${name}: a gaveta rola arrastando o dedo sobre os chips`);
    }

    // 5c. Nada do palco se sobrepõe nem sai da tela em celular e tablet, em pé e deitado, com e sem a ficha aberta
    //     (tablet 2200×1440 a 229 ppi ≈ 1100×720 em CSS; com as barras do navegador, ~1100×600 e ~720×1000)
    const layouts = [
      ['iPhone 11 em pé', { width: 414, height: 715 }], ['iPhone 11 deitado', { width: 896, height: 414 }],
      ['celular 16:9 deitado', { width: 667, height: 375 }], ['tablet 11" em pé', { width: 834, height: 1194 }],
      ['tablet 11" deitado', { width: 1194, height: 834 }], ['tablet 2200×1440 em pé', { width: 720, height: 1000 }],
      ['tablet 2200×1440 deitado', { width: 1100, height: 600 }], ['tablet 2200×1440 a 1,5x deitado', { width: 1467, height: 830 }],
      ['tablet 2200×1440 a 1,5x em pé', { width: 960, height: 1340 }],
    ];
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); // tablets e celulares são de toque: alvos maiores
    for (const [name, vp] of layouts) {
      await send('Emulation.setDeviceMetricsOverride', { ...vp, mobile: true, deviceScaleFactor: 2 });
      await new Promise((r) => setTimeout(r, 600));
      await run(async () => {
        const f = [];
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const A = window.__app;
        const sels = ['#openList', '.toolbar', '#bodyStatus', '#controls', '.hint', '#info.open', '.color-legend', '.floating-chip'];
        const check = (estado) => {
          const W = innerWidth, H = innerHeight;
          const boxes = [];
          for (const s of sels) {
            const el = document.querySelector(s);
            if (!el || el.hidden) continue;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            const r = el.getBoundingClientRect();
            if (r.width && r.height) boxes.push([s, r]);
          }
          for (const [s, r] of boxes) {
            if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1) f.push(`${estado}: ${s} sai da tela`);
          }
          for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
              const [a, P] = boxes[i], [b, Q] = boxes[j];
              const ox = Math.min(P.right, Q.right) - Math.max(P.left, Q.left), oy = Math.min(P.bottom, Q.bottom) - Math.max(P.top, Q.top);
              if (ox > 1 && oy > 1) f.push(`${estado}: ${a} sobrepõe ${b} (${Math.round(ox)}×${Math.round(oy)} px)`);
            }
          }
          if (document.documentElement.scrollWidth > W) f.push(`${estado}: a página rola na horizontal`);
        };
        A.select(null, { fly: false }); await sleep(200);
        check('sem seleção');
        A.select('masseter', { fly: false }); await sleep(300);
        check('com a ficha aberta');
        const sc = A.studyController;
        A.select(null, { fly: false });
        sc.coloring.setMode('grupo'); sc.syncColorUi(); sc.clipping.setAxis('sagittal'); sc.syncClipUi(); sc.updateLegend(); await sleep(200);
        check('com legenda e corte');
        sc.coloring.setMode('camada'); sc.syncColorUi(); sc.resetClip(); sc.updateLegend();
        return f;
      }, `layout sem sobreposição: ${name} (${vp.width}×${vp.height})`);
    }
    await send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await send('Emulation.clearDeviceMetricsOverride');
    await evaluate("document.getElementById('testNoAnim')?.remove()");
    await run(async () => {
      const f = [];
      const side = document.getElementById('sidebar').getBoundingClientRect();
      if (!(side.width > 250 && side.left >= 0)) f.push('no desktop a lista lateral deveria ficar fixa e visível');
      if (getComputedStyle(document.getElementById('closeList')).display !== 'none') f.push('o X da gaveta apareceu no desktop');
      if (!document.getElementById('getApp').hidden) f.push('o botão do .exe apareceu fora do site publicado (http local)');
      return f;
    }, 'desktop: lista fixa, sem X e sem botão do .exe fora do https');

    // 6. Verificar ausência de erros no console
    if (consoleErrors.length > 0) {
      console.error('\nErros detectados no console do navegador:');
      for (const err of consoleErrors) {
        console.error('  ✖', err);
      }
      throw new Error(`${consoleErrors.length} erro(s) encontrados no console durante o teste.`);
    }

    console.log('✔ Zero erros encontrados no console durante a navegação.');
    console.log('\n🎉 Teste de fumaça concluído com 100% de sucesso!');
  } finally {
    try { ws.close(); } catch (_) {}
    killBrowser();
  }
}

runSmokeTest().catch((err) => {
  console.error('\n❌ Teste de fumaça falhou:', err.message);
  process.exit(1);
});
