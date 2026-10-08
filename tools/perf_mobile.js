// Mede carga e custo de quadro num "celular" emulado: Chrome sem janela, CPU desacelerada (CDP) e GPU por software
// (SwiftShader, --disable-gpu), que serve de régua relativa para o trabalho de vértices e pixels.
// Uso: node tools/perf_mobile.js [lentidão da CPU, padrão 4] [query da URL]
//   IDLE_RAF=1  simula renderização sob demanda (1 quadro por segundo parado)
//   GPUBENCH=1  mede o custo de quadro por configuração (tools/perf_gpubench.js)
// Resultados de referência e leitura deles: docs/otimizacao-mobile.md
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME_BIN ?? [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => fs.existsSync(p));
const THROTTLE = Number(process.argv[2] ?? 4);
const QUERY = process.argv[3] ?? '';
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  if (p === '/sw.js') { res.writeHead(404); return res.end(); }
  fs.readFile(path.join(ROOT, p), (e, d) => {
    if (e) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(d);
  });
});
const getJson = (u) => new Promise((ok, ko) => http.get(u, (r) => { let b = ''; r.on('data', (c) => (b += c)); r.on('end', () => { try { ok(JSON.parse(b)); } catch (e) { ko(e); } }); }).on('error', ko));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const dbg = 9900 + Math.floor(Math.random() * 300);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new', `--remote-debugging-port=${dbg}`, '--disable-gpu', '--no-sandbox', '--window-size=414,896', 'about:blank',
  ]);
  let t = null;
  for (let i = 0; i < 100 && !t; i++) { await sleep(200); try { t = (await getJson(`http://127.0.0.1:${dbg}/json`)).find((x) => x.type === 'page'); } catch (_) {} }
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 1;
  const pend = new Map();
  ws.onmessage = (e) => { const d = JSON.parse(e.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = id++; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
  await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 414, height: 896, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
  // simula renderização sob demanda: com o modelo parado quase não há quadros (1 por segundo)
  if (process.env.IDLE_RAF) await send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 1000);' });
  const t0 = Date.now();
  await send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html${QUERY}` });
  let ready = false;
  for (let i = 0; i < 600 && !ready; i++) { await sleep(250); ready = await ev('Boolean(window.__app && window.__app.state && window.__app.state.nervesReady)'); }
  const wall = Date.now() - t0;
  const perf = await ev('JSON.stringify(window.__app.perf)');
  const metrics = Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map((m) => [m.name, m.value]));
  await send('Emulation.setCPUThrottlingRate', { rate: 1 });
  // quadros desenhados com o modelo parado e custo de um quadro (GPU por software) na vista do corpo inteiro
  const idle = await ev(`(async () => {
    const A = window.__app, R = A.renderer; let n = 0; const o = R.render.bind(R); R.render = (...a) => { n++; return o(...a); };
    await new Promise((r) => setTimeout(r, 3000)); R.render = o; return n / 3; })()`);
  const frame = await ev(`(async () => {
    const A = window.__app, R = A.renderer, gl = R.getContext();
    const time = async () => { R.render(A.scene, A.camera); gl.finish(); const t = performance.now(); for (let i = 0; i < 6; i++) { R.render(A.scene, A.camera); gl.finish(); } return +((performance.now() - t) / 6).toFixed(1); };
    const out = { pixelRatio: R.getPixelRatio() };
    A.setRegion('todos'); A.jump(); A.setDissect(1); A.jump();
    out.todos_d1 = await time();
    A.setRegion('cabeca'); A.jump(); A.setDissect(1); A.jump();
    out.cabeca_d1 = await time();
    return out; })()`);
  const gpu = process.env.GPUBENCH ? await ev(fs.readFileSync(path.join(__dirname, 'perf_gpubench.js'), 'utf8')) : null;
  console.log(JSON.stringify({ throttle: THROTTLE, query: QUERY, wallMs: wall, perf: JSON.parse(perf), heapMB: Math.round(metrics.JSHeapUsedSize / 1e6), idleRendersPerSecond: idle, frameMsSoftwareGPU: frame, gpu }, null, 1));
  chrome.kill(); server.close(); process.exit(0);
})();
