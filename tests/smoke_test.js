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
  const url = `http://127.0.0.1:${port}/index.html`;
  console.log(`Servidor local ativo em: ${url}`);

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
  for (let i = 0; i < 30; i++) {
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

    // 5. Testar Ferramentas de Estudo (F1.1 a F1.10)
    console.log('Testando Ferramentas de Estudo (F1)...');
    const studyTestRes = await evaluate(`
      (() => {
        const app = window.__app;
        if (!app.studyController || !app.userData) {
          return { ok: false, error: 'studyController ou userData não encontrados em window.__app' };
        }

        // Testar Favoritos e Anotações
        app.userData.toggleFavorite('frontal');
        const isFav = app.userData.isFavorite('frontal');
        app.userData.setNote('frontal', 'Teste de anotação');
        const note = app.userData.getNote('frontal');

        // Testar SM-2
        const prog = app.userData.recordQuizResult('frontal', 5);

        // Testar Exportação e Importação JSON
        const json = app.userData.exportJson();
        const importRes = app.userData.importJson(json);

        // Testar Planos de Corte
        app.studyController.clipping.setAxis('sagittal');
        const clipOk = app.renderer.clippingPlanes.length === 1;
        app.studyController.clipping.reset();

        // Testar Coloração
        app.studyController.coloring.setMode('regiao');
        app.studyController.coloring.setMode('camada');

        // Testar Modal de Estudo
        document.getElementById('btnStudy').click();
        const modalOpen = !document.getElementById('studyModal').hasAttribute('hidden');
        document.getElementById('studyClose').click();
        const modalClosed = document.getElementById('studyModal').hasAttribute('hidden');

        // Testar Tour
        app.studyController.startTour('manguito');
        const tourActive = app.studyController.activeTour !== null;
        app.studyController.stopTour();

        // Testar Quiz Teórico (Texto)
        app.studyController.startTextQuiz({ region: 'cabeca', kinds: ['musculo'], count: 5 });
        const textQuizActive = app.studyController.textQuizState !== null && !document.getElementById('textQuiz').hasAttribute('hidden');
        app.studyController.stopTextQuiz();
        const textQuizStopped = document.getElementById('textQuiz').hasAttribute('hidden');

        return {
          ok: isFav && note === 'Teste de anotação' && prog.reps === 1 && importRes.success && clipOk && modalOpen && modalClosed && tourActive && textQuizActive && textQuizStopped
        };
      })()
    `);

    if (!studyTestRes || !studyTestRes.ok) {
      throw new Error(`Falha nos testes de Ferramentas de Estudo (F1): ${JSON.stringify(studyTestRes)}`);
    }
    console.log('✔ Ferramentas de Estudo (F1.1-F1.10) validadas com sucesso no navegador.');

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
