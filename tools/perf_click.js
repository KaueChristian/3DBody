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
  // APPJS=<arquivo>: serve outro app.js (ex.: sem minificar, para o perfil mostrar nomes de função)
  const file = process.env.APPJS && p === '/dist/app.js' ? process.env.APPJS : path.join(ROOT, p);
  fs.readFile(file, (e, d) => {
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
  // PROFILE=1: perfil do toque como o aluno faz (select com voo de câmera), do toque até 2,5 s depois, com a CPU lenta.
  // Com APPJS=<app.js sem minificar> os nomes das funções saem legíveis.
  if (process.env.PROFILE) {
    const alvo = process.env.ALVO ?? 'gluteo_maximo';
    await ev(`window.__app.select(null, { fly: false }); window.__app.setRegion('membro_inf', { fly: false }); window.__app.setDissect(2); window.__app.jump(); new Promise((r) => setTimeout(r, 800))`);
    await send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
    await send('Profiler.setSamplingInterval', { interval: 200 });
    await send('Profiler.start');
    const marcas = await ev(`(async () => {
      const A = window.__app; const t0 = performance.now(); const f0 = A.renderStats.frames();
      A.select(${JSON.stringify(alvo)});
      const sync = Math.round(performance.now() - t0);
      const quadros = []; let ultimo = A.renderStats.frames();
      while (performance.now() - t0 < 2500) { await new Promise((r) => requestAnimationFrame(() => r())); const f = A.renderStats.frames(); if (f !== ultimo) { quadros.push(Math.round(performance.now() - t0)); ultimo = f; } }
      return { syncMs: sync, instantesDosQuadrosDesenhados: quadros, total: A.renderStats.frames() - f0 };
    })()`);
    const prof = (await send('Profiler.stop')).result.profile;
    await send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const byId = new Map(prof.nodes.map((n) => [n.id, n]));
    const parent = new Map();
    prof.nodes.forEach((n) => (n.children ?? []).forEach((c) => parent.set(c, n.id)));
    const self = new Map(); const incl = new Map();
    prof.samples.forEach((sid, i) => {
      const dt = (prof.timeDeltas[i] ?? 0) / 1000;
      const n = byId.get(sid);
      const k = `${n.callFrame.functionName || '(anon)'}`;
      self.set(k, (self.get(k) ?? 0) + dt);
      const seen = new Set();
      for (let cur = sid; cur != null; cur = parent.get(cur)) {
        const nm = byId.get(cur).callFrame.functionName || '(anon)';
        if (seen.has(nm)) continue; seen.add(nm);
        incl.set(nm, (incl.get(nm) ?? 0) + dt);
      }
    });
    const top = (m, n) => [...m.entries()].filter(([k]) => !['(idle)', '(program)', '(root)'].includes(k)).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k}: ${Math.round(v)} ms`);
    console.log(JSON.stringify({ throttle: THROTTLE, alvo, ...marcas, topProprio: top(self, 14), topInclusivo: top(incl, 30) }, null, 1));
    chrome.kill(); server.close(); process.exit(0);
  }
  // EXP2=1: o toque com a câmera perto (como no vídeo do iPhone). Mede quadros por segundo REAIS (renderiza a cada rAF, o que inclui a
  // GPU por software) por variante de “fantasma”. `gl.finish` não serve aqui: não espera o rasterizador.
  if (process.env.EXP2) {
    const alvo = process.env.ALVO ?? 'gluteo_maximo';
    const reg = process.env.REGIAO ?? 'membro_inf';
    const r = await ev(`(async () => {
      const A = window.__app, R = A.renderer, T = A.THREE;
      A.renderStats.keepAlive(0);
      const fps = async () => { await new Promise((r) => setTimeout(r, 500)); const f0 = A.renderStats.frames(); const t0 = performance.now(); await new Promise((r) => setTimeout(r, 2500)); return +((A.renderStats.frames() - f0) / ((performance.now() - t0) / 1000)).toFixed(1); };
      A.setRegion(${JSON.stringify(reg)}, { fly: false }); A.setDissect(2);
      A.select(${JSON.stringify(alvo)}, { fly: true });
      for (let i = 0; i < 60 && A.cameraGoal(); i++) await new Promise((r) => setTimeout(r, 100));
      A.jump();
      const out = { visiveis: [...A.M.values()].filter((m) => m.group.visible).length, pixelRatio: R.getPixelRatio() };
      out.fps_selecionadoPerto = await fps();
      A.select(null, { fly: false });
      out.fps_semSelecaoPerto = await fps();
      A.select(${JSON.stringify(alvo)}, { fly: false });
      const dim = [...A.M.values()].filter((m) => m.group.visible && m.mats.every((x) => x.opacity < 0.2) && m.item.id !== 'pele');
      out.fantasmas = dim.length;
      dim.forEach((m) => (m.group.visible = false)); out.fps_fantasmasOcultos = await fps(); dim.forEach((m) => (m.group.visible = true));
      // fantasmas com escrita de profundidade e ordenados do mais perto para o mais longe: só a camada da frente é sombreada
      const dimMats = dim.flatMap((m) => m.mats);
      const frente = (a, b) => a.groupOrder - b.groupOrder || a.renderOrder - b.renderOrder || a.z - b.z || a.id - b.id;
      R.setTransparentSort(frente); dimMats.forEach((x) => { x.depthWrite = true; });
      out.fps_fantasmasPrimeiraCamada = await fps();
      const saved = [];
      dim.forEach((m) => m.meshes.forEach((me) => { saved.push([me, me.material]); me.material = new T.MeshBasicMaterial({ color: me.material.color, transparent: true, opacity: 0.16, depthWrite: true, side: T.DoubleSide }); me.material.forceSinglePass = true; }));
      out.fps_primeiraCamada_semLuz = await fps();
      saved.forEach(([me, mt]) => { me.material.dispose(); me.material = mt; }); saved.length = 0;
      dim.forEach((m) => m.meshes.forEach((me) => { saved.push([me, me.material]); me.material = new T.MeshLambertMaterial({ color: me.material.color, transparent: true, opacity: 0.16, depthWrite: true, side: T.DoubleSide }); me.material.forceSinglePass = true; }));
      out.fps_primeiraCamada_lambert = await fps();
      saved.forEach(([me, mt]) => { me.material.dispose(); me.material = mt; }); saved.length = 0;
      R.setTransparentSort(null); dimMats.forEach((x) => { x.depthWrite = false; });
      dim.forEach((m) => m.meshes.forEach((me) => { saved.push([me, me.material]); me.material = new T.MeshBasicMaterial({ color: me.material.color, transparent: true, opacity: 0.16, depthWrite: false, side: T.DoubleSide }); me.material.forceSinglePass = true; }));
      out.fps_fantasmasSemLuz = await fps();
      saved.forEach(([me, mt]) => { me.material.dispose(); me.material = mt; });
      const pr = R.getPixelRatio();
      for (const p of [1.5, 1]) { R.setPixelRatio(p); out['fps_pixelRatio_' + p] = await fps(); }
      R.setPixelRatio(pr);
      A.renderStats.keepAlive(2000);
      return out; })()`);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(process.env.SHOT ?? path.join(ROOT, 'perf_click_shot.png'), Buffer.from(shot.result.data, 'base64'));
    console.log(JSON.stringify({ alvo, regiao: reg, ...r }, null, 1));
    chrome.kill(); server.close(); process.exit(0);
  }
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
