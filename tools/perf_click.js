// Mede o que acontece ao clicar numa estrutura, num "celular" emulado: Chrome sem janela, CPU desacelerada (CDP) e GPU por
// software (SwiftShader), que serve de régua relativa para o trabalho de vértices e pixels.
// Uso: node tools/perf_click.js [lentidão da CPU, padrão 4]
// Mede, para um osso, um músculo e um nervo: o custo do `select()` em JS (CPU lenta), os 4 primeiros quadros depois do clique
// (a compilação de shaders entra aqui) e o custo de um quadro parado, sem e com seleção (GPU por software, CPU normal).
// Também separa o custo de uma seleção em chamadas de desenho, triângulos e programas de shader. Ver docs/otimizacao-mobile.md.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const THROTTLE = Number(process.argv[2] ?? 4);
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
  await send('Page.enable'); await send('Runtime.enable'); await send('Profiler.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 414, height: 896, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.navigate', { url: `http://127.0.0.1:${port}/index.html` });
  let ready = false;
  for (let i = 0; i < 600 && !ready; i++) { await sleep(250); ready = await ev('Boolean(window.__app && window.__app.state && window.__app.state.nervesReady)'); }
  await sleep(1500);
  // estado de partida: corpo inteiro, camadas intermediárias (o que um aluno costuma ver ao tocar numa estrutura)
  await ev(`(async () => { const A = window.__app; A.setRegion('todos'); A.setDissect(3); A.jump(); await new Promise((r) => setTimeout(r, 800)); })()`);

  const frameCost = `(async () => {
    const A = window.__app, R = A.renderer, gl = R.getContext();
    R.render(A.scene, A.camera); gl.finish();
    const t = performance.now();
    for (let i = 0; i < 4; i++) { R.render(A.scene, A.camera); gl.finish(); }
    const ms = +((performance.now() - t) / 4).toFixed(0);
    R.info.autoReset = false; R.info.reset(); R.render(A.scene, A.camera);
    const info = { calls: R.info.render.calls, triangles: R.info.render.triangles, programs: R.info.programs.length };
    R.info.autoReset = true;
    return { ms, ...info };
  })()`;
  const out = { throttle: THROTTLE, parado: await ev(frameCost) };

  // intervalo entre quadros com a CPU lenta e nada selecionado (referência para os quadros depois do clique)
  await send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
  out.quadrosParadoCpuLenta = await ev(`(async () => { const f = []; for (let i = 0; i < 6; i++) { const s = performance.now(); await new Promise((r) => requestAnimationFrame(() => r())); f.push(Math.round(performance.now() - s)); } return f; })()`);
  await send('Emulation.setCPUThrottlingRate', { rate: 1 });
  // custo do clique, com a CPU lenta; cada alvo parte do estado “nada selecionado”
  const alvos = ['o_femur', 'gluteo_maximo', 'n_isquiatico'];
  out.clique = {};
  for (const alvo of alvos) {
    await ev(`window.__app.select(null, { fly: false }); new Promise((r) => setTimeout(r, 600))`);
    await send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
    await send('Profiler.start');
    const r = await ev(`(async () => {
      const A = window.__app;
      const t0 = performance.now(); A.select(${JSON.stringify(alvo)}, { fly: false }); const sync = performance.now() - t0;
      const frames = [];
      const r0 = A.renderStats.frames(); const rend = [];
      for (let i = 0; i < 4; i++) { const s = performance.now(); await new Promise((r) => requestAnimationFrame(() => r())); frames.push(Math.round(performance.now() - s)); rend.push(A.renderStats.frames() - r0); }
      const f0 = A.renderStats.frames(); await new Promise((r) => setTimeout(r, 2500)); const depois = A.renderStats.frames() - f0;
      return { syncMs: Math.round(sync), primeirosQuadrosMs: frames, rendersAcumulados: rend, quadrosDesenhadosEm2500ms: depois, programas: A.renderer.info.programs.length };
    })()`);
    const prof = (await send('Profiler.stop')).result.profile;
    await send('Emulation.setCPUThrottlingRate', { rate: 1 });
    // tempo próprio por função (amostras do perfilador), somando por nome
    const self = new Map();
    const dt = prof.timeDeltas;
    const byId = new Map(prof.nodes.map((n) => [n.id, n]));
    prof.samples.forEach((sid, i) => { const n = byId.get(sid); const k = `${n.callFrame.functionName || '(anon)'}:${n.callFrame.lineNumber}`; self.set(k, (self.get(k) ?? 0) + (dt[i] ?? 0) / 1000); });
    r.topFuncoesMs = [...self.entries()].filter(([k]) => !k.startsWith('(idle)') && !k.startsWith('(program)')).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} ${Math.round(v)}`);
    out.clique[alvo] = r;
  }
  // quadro parado com uma estrutura selecionada (o resto fica translúcido)
  await ev(`window.__app.select('o_femur', { fly: false }); new Promise((r) => setTimeout(r, 600))`);
  out.comSelecao = await ev(frameCost);
  // experimentos sobre o quadro com seleção (o que custa mais?). Cada variante parte do mesmo estado e é desfeita no fim.
  if (process.env.EXP) {
    out.experimentos = await ev(`(async () => {
      const A = window.__app, R = A.renderer, gl = R.getContext();
      const cost = () => {
        R.render(A.scene, A.camera); gl.finish();
        const t = performance.now();
        for (let i = 0; i < 4; i++) { R.render(A.scene, A.camera); gl.finish(); }
        const ms = Math.round((performance.now() - t) / 4);
        R.info.autoReset = false; R.info.reset(); R.render(A.scene, A.camera);
        const r = { ms, calls: R.info.render.calls, tris: R.info.render.triangles };
        R.info.autoReset = true; return r;
      };
      const mats = new Set();
      A.scene.traverse((o) => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(m)); });
      const res = { base: cost() };
      mats.forEach((m) => { m.forceSinglePass = true; });
      res.umaPassada = cost();
      mats.forEach((m) => { m.forceSinglePass = false; });
      const dim = [...A.M.values()].filter((m) => m.mats.every((x) => x.opacity < 0.2 && m.item.id !== 'pele'));
      dim.forEach((m) => (m.group.visible = false));
      res.semOsFantasmas = { ...cost(), ocultos: dim.length };
      dim.forEach((m) => (m.group.visible = true));
      const pr = R.getPixelRatio(); R.setPixelRatio(1); res.pixelRatio1 = cost(); R.setPixelRatio(pr);
      mats.forEach((m) => { m.forceSinglePass = true; }); R.setPixelRatio(1); res.umaPassada_e_pr1 = cost(); R.setPixelRatio(pr);
      mats.forEach((m) => { m.forceSinglePass = false; });
      // sem seleção, para comparar
      A.select(null, { fly: false }); await new Promise((r) => setTimeout(r, 400)); res.semSelecao = cost();
      return res; })()`);
  }
  console.log(JSON.stringify(out, null, 1));
  chrome.kill(); server.close(); process.exit(0);
})();
