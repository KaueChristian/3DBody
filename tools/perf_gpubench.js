// Custo de quadro por configuração, medido com readPixels (força terminar o quadro). Rodar no Chrome com GPU por software.
(async () => {
  const A = window.__app, T = A.THREE, R = A.renderer, gl = R.getContext();
  const px = new Uint8Array(4);
  const time = async () => {
    R.render(A.scene, A.camera); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const t = performance.now();
    for (let i = 0; i < 4; i++) { R.render(A.scene, A.camera); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
    return +((performance.now() - t) / 4).toFixed(0);
  };
  const mats = new Set();
  A.scene.traverse((o) => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(m)); });
  const out = {};
  A.setRegion('todos'); A.jump(); A.setDissect(1); A.jump();
  const pr0 = R.getPixelRatio();
  for (const pr of [2, 1.5, 1]) { R.setPixelRatio(pr); out['dpr_' + pr] = await time(); }
  R.setPixelRatio(pr0);
  out.base = await time();
  const saved = [...mats].map((m) => [m, m.side, m.bumpMap]);
  mats.forEach((m) => { m.side = T.FrontSide; m.needsUpdate = true; });
  out.frontSide = await time();
  saved.forEach(([m, s]) => { m.side = s; m.needsUpdate = true; });
  mats.forEach((m) => { if (m.bumpMap) { m.bumpMap = null; m.needsUpdate = true; } });
  out.semBump = await time();
  // troca para Lambert (sem PBR): mantém cor, mapa, transparência e lado
  const swaps = [];
  A.scene.traverse((o) => {
    if (!o.isMesh || !o.material?.isMeshStandardMaterial || o.material.visible === false) return;
    const s = o.material;
    const l = new T.MeshLambertMaterial({ color: s.color, map: s.map, transparent: s.transparent, opacity: s.opacity, depthWrite: s.depthWrite, side: s.side, polygonOffset: s.polygonOffset, polygonOffsetFactor: s.polygonOffsetFactor, polygonOffsetUnits: s.polygonOffsetUnits, clippingPlanes: s.clippingPlanes });
    swaps.push([o, s]); o.material = l;
  });
  out.lambert = await time();
  swaps.forEach(([o, s]) => { o.material.dispose(); o.material = s; });
  saved.forEach(([m, , b]) => { m.bumpMap = b; m.needsUpdate = true; });
  const nerves = [...A.M.values()].filter((m) => m.item.kind === 'nervo');
  nerves.forEach((m) => (m.group.visible = false));
  out.semNervos = await time();
  nerves.forEach((m) => (m.group.visible = true));
  const skin = A.M.get('pele');
  skin.group.visible = false;
  out.semPele = await time();
  skin.group.visible = true;
  A.syncLayers();
  return out;
})();
