// Gera docs/miotomos.md (mapa de miótomos: segmento medular → músculos e nervos) a partir do catálogo.
// Uso: node tools/gen_miotomos.js
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

function load(rel) {
  const res = esbuild.buildSync({ entryPoints: [path.resolve(__dirname, rel)], bundle: true, format: 'cjs', platform: 'node', write: false, logLevel: 'error' });
  const mod = { exports: {} };
  new Function('module', 'exports', res.outputFiles[0].text)(mod, mod.exports);
  return mod.exports;
}
const { ITEMS } = load('../src/catalog.js');
const { SEGMENT_ORDER, AMPLOS, PROPRIOCEPTIVOS, segmentLabel } = load('../src/segments.js');

const com = ITEMS.filter((i) => i.segmentos);
const muscles = com.filter((i) => i.kind === 'musculo');
const nerves = com.filter((i) => i.kind !== 'musculo');
const semSegmento = ITEMS.filter((i) => i.kind === 'musculo' && !i.segmentos);

let md = '# Miótomos: segmento medular → músculos e nervos\n\n';
md += `> Gerado por \`node tools/gen_miotomos.js\` a partir do campo \`segmentos\` do catálogo (\`src/segments.js\`). Cumpre o item **F2.14**. ${muscles.length} músculos e ${nerves.length} nervos/estruturas têm segmentos; ${semSegmento.length} músculos são inervados só por nervos cranianos (face, língua, palato, faringe, laringe, olho, ouvido médio) e não têm segmento.\n\n`;
md += '**Como ler.** O miótomo de um segmento é o conjunto de músculos que recebem fibras dele. Os valores seguem Moore, Dalley & Agur (8ª ed.) e o Gray’s Anatomy (42ª ed.), com Kendall et al. para os miótomos clínicos; **as fontes divergem em vários músculos** (a nota de cada ficha diz quais). Os músculos próprios do dorso e os curtos da coluna (marcados com †) são inervados por ramos posteriores em vários níveis: o intervalo é o da região, e não um miótomo clínico. Os músculos marcados com ‡ (ECM e trapézio) têm segmentos só proprioceptivos: a parte motora é do nervo acessório (XI).\n\n';

md += '## 1. Por segmento\n\n';
for (const s of SEGMENT_ORDER) {
  const ms = muscles.filter((m) => m.segmentos.includes(s));
  const ns = nerves.filter((n) => n.segmentos.includes(s));
  if (!ms.length && !ns.length) continue;
  const fmt = (i) => `${i.name}${AMPLOS.has(i.id) ? ' †' : ''}${PROPRIOCEPTIVOS.has(i.id) ? ' ‡' : ''}`;
  const main = ms.filter((m) => !AMPLOS.has(m.id));
  const broad = ms.filter((m) => AMPLOS.has(m.id));
  md += `### ${s}\n\n`;
  md += `- **Músculos (${main.length}):** ${main.map(fmt).join('; ') || '—'}\n`;
  if (broad.length) md += `- **Também, por inervação regional (${broad.length}):** ${broad.map(fmt).join('; ')}\n`;
  md += `- **Nervos e estruturas (${ns.length}):** ${ns.map((n) => n.name).join('; ') || '—'}\n\n`;
}

md += '## 2. Por músculo\n\n| ID | Músculo | Segmentos |\n| --- | --- | --- |\n';
for (const m of muscles) {
  md += `| \`${m.id}\` | ${m.name}${AMPLOS.has(m.id) ? ' †' : ''}${PROPRIOCEPTIVOS.has(m.id) ? ' ‡' : ''} | ${segmentLabel(m.segmentos)} |\n`;
}
md += `\n## 3. Músculos sem segmento medular (${semSegmento.length})\n\n`;
md += semSegmento.map((m) => m.name).join('; ') + '.\n';

fs.writeFileSync(path.resolve(__dirname, '../docs/miotomos.md'), md, 'utf-8');
console.log('Gravado docs/miotomos.md:', muscles.length, 'músculos,', nerves.length, 'nervos/estruturas com segmentos.');
