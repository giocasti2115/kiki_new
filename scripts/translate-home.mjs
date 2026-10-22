/**
 * Genera content/partials/home-en.html a partir de home-es.html, aplicando
 * las traducciones oficiales de Marketing (content/i18n/home-en*.json).
 * Uso: node scripts/translate-home.mjs [--report]
 * --report lista los textos que siguen en español.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseDocument } from 'htmlparser2';
import render from 'dom-serializer';

const root = process.cwd();
const dir = join(root, 'content');
const docx = JSON.parse(await readFile(join(dir, 'i18n', 'home-en.docx.json'), 'utf8'));
const extra = JSON.parse(await readFile(join(dir, 'i18n', 'home-en.json'), 'utf8').catch(() => '{}'));
const MAP = { ...docx, ...extra };
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const NMAP = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [norm(k), v]));

// Enlaces a páginas con versión en inglés.
const BILINGUAL = /href="\/(expandirse-en-latam|escalar-mi-operacion|planear-mi-expansion|vender-con-cod|kiki-pay|logra-mas-entregas-efectivas|recauda-y-recibe|almacenamiento-y-preparacion-de-pedidos|gestion-y-confirmacion-de-ordenes|distribucion-y-ultima-milla|gestion-de-pagos|pagos-y-recaudo|integraciones-tecnologicas|logistica-internacional)\/(#[^"]*)?"/g;

const html = await readFile(join(dir, 'partials', 'home-es.html'), 'utf8');
const doc = parseDocument(html, { decodeEntities: true });
const missing = new Set();
const ATTRS = ['alt', 'placeholder', 'aria-label', 'title'];

function tr(text) {
  const key = norm(text);
  if (!key || !/[a-záéíóúñ]/i.test(key)) return null;
  if (NMAP[key] !== undefined) return NMAP[key];
  missing.add(key);
  return null;
}

(function walk(node) {
  for (const child of node.children || []) {
    if (child.type === 'text') {
      const t = tr(child.data);
      if (t !== null) {
        const lead = child.data.match(/^\s*/)[0];
        const trail = child.data.match(/\s*$/)[0];
        child.data = lead + t + trail;
      }
    } else if (child.type === 'tag' || child.type === 'script' || child.type === 'style') {
      if (child.type !== 'tag') continue;
      for (const a of ATTRS) {
        if (child.attribs?.[a]) {
          const t = tr(child.attribs[a]);
          if (t !== null) child.attribs[a] = t;
        }
      }
      walk(child);
    }
  }
})(doc);

let out = render(doc, { decodeEntities: false, encodeEntities: 'utf8' });
out = out.replace(BILINGUAL, (_, slug, hash = '') => `href="/en/${slug}/${hash}"`);
await writeFile(join(dir, 'partials', 'home-en.html'), out);

console.log(`home-en.html generado · ${missing.size} textos sin traducir`);
if (process.argv.includes('--report')) for (const m of missing) console.log('  - ' + m);
