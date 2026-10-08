const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const res = esbuild.buildSync({
  entryPoints: [path.resolve(__dirname, '../src/catalog.js')],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  write: false,
});
const mod = { exports: {} };
const fn = new Function('module', 'exports', res.outputFiles[0].text);
fn(mod, mod.exports);
const { ITEMS, REGIONS } = mod.exports;

const muscles = ITEMS.filter((i) => i.kind === 'musculo');
const nerves = ITEMS.filter((i) => i.kind === 'nervo');

let md = '# Revisão de Conteúdo Anatômico — Músculos e Nervos\n\n';
md += `> Documento de auditoria e referência bibliográfica para as ${muscles.length + nerves.length} estruturas neuromusculares ativas (${muscles.length} músculos e ${nerves.length} nervos). Gerado por \`node tools/gen_revisao.js\`.\n`;
md += '> Cumpre o item **F0.4** do roteiro (`project_context.md`).\n\n';

md += '## 1. Referências Bibliográficas Primárias\n\n';
md += '1. **Moore, Dalley & Agur** — *Anatomia Orientada para a Clínica* (8ª ed., Guanabara Koogan, 2019).\n';
md += '2. **Standring, S. (Ed.)** — *Gray\'s Anatomy: The Anatomical Basis of Clinical Practice* (42ª ed., Elsevier, 2020).\n';
md += '3. **Netter, F. H.** — *Atlas de Anatomia Humana* (7ª ed., Elsevier, 2018).\n';
md += '4. **Paulsen, F. & Waschke, J.** — *Sobotta: Atlas de Anatomia Humana* (24ª ed., Guanabara Koogan, 2018).\n';
md += '5. **Terminologia Anatomica (TA2 / FIPAT, 2019)** e *Terminologia Anatômica da Sociedade Brasileira de Anatomia (SBA)*.\n\n';

md += `## 2. Músculos (${muscles.length} estruturas)\n\n`;
md += '| ID | Nome (PT-BR) | Latim (TA) | Região | Campos Validados | Variação / Nota Clínica | Status |\n';
md += '| --- | --- | --- | --- | --- | --- | --- |\n';

for (const m of muscles) {
  const campos = m.campos.map((c) => c[0]).join(', ');
  const reg = Array.isArray(m.region) ? m.region.join(', ') : (REGIONS[m.region] || m.region);
  const cleanNota = m.nota ? m.nota.replace(/\|/g, '/').replace(/\r?\n/g, ' ') : '';
  const nota = cleanNota ? (cleanNota.length > 70 ? cleanNota.slice(0, 67) + '...' : cleanNota) : '—';
  const status = m.nota ? '🟡 Nota clínica' : '✅ Verificado';
  md += `| \`${m.id}\` | ${m.name} | *${m.latin}* | ${reg} | ${campos} | ${nota} | ${status} |\n`;
}

md += `\n## 3. Nervos (${nerves.length} estruturas)\n\n`;
md += '| ID | Nome (PT-BR) | Latim (TA) | Região | Ramos Mapeados | Variação / Lesão Clínica | Status |\n';
md += '| --- | --- | --- | --- | --- | --- | --- |\n';

for (const n of nerves) {
  const ramosCount = n.ramos ? n.ramos.length : 0;
  const reg = Array.isArray(n.region) ? n.region.map((r) => REGIONS[r] || r).join(', ') : (REGIONS[n.region] || n.region);
  const lesao = n.campos?.find((c) => c[0] === 'Lesão')?.[1];
  const rawNota = lesao || n.nota || '';
  const cleanNota = rawNota.replace(/\|/g, '/').replace(/\r?\n/g, ' ');
  const nota = cleanNota ? (cleanNota.length > 70 ? cleanNota.slice(0, 67) + '...' : cleanNota) : '—';
  md += `| \`${n.id}\` | ${n.name} | *${n.latin}* | ${reg} | ${ramosCount} músculo(s) | ${nota} | ✅ Verificado |\n`;
}

const docsDir = path.resolve(__dirname, '../docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'revisao-conteudo.md'), md, 'utf-8');
console.log('Gravado docs/revisao-conteudo.md com sucesso! Total:', muscles.length + nerves.length, 'estruturas catalogadas.');
