/**
 * Renderiza un parcial HTML importado de WordPress (content/partials/*.html)
 * como elementos React, en el build. `vars` reemplaza marcadores {{CLAVE}}.
 *
 * Los enlaces a páginas que todavía no existen (ver isActiveHref en
 * lib/pages.js) se dejan sin clic: pierden el href y llevan la clase is-soon.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import parse from 'html-react-parser';
import { isActiveHref } from '@/lib/pages';

const cache = new Map();

function load(name) {
  if (!cache.has(name)) {
    cache.set(name, readFileSync(join(process.cwd(), 'content', 'partials', name), 'utf8'));
  }
  return cache.get(name);
}

export default function Partial({ name, vars = {}, lang = 'es' }) {
  let html = load(name);
  for (const [k, v] of Object.entries(vars)) html = html.replaceAll(`{{${k}}}`, v);
  const soon = lang === 'en' ? 'Coming soon' : 'Próximamente';
  return parse(html, {
    replace(node) {
      if (node.type === 'tag' && node.name === 'a' && node.attribs && 'href' in node.attribs && !isActiveHref(node.attribs.href)) {
        delete node.attribs.href;
        node.attribs.class = `${node.attribs.class || ''} is-soon`.trim();
        node.attribs['aria-disabled'] = 'true';
        node.attribs.title = soon;
      }
    },
  });
}
