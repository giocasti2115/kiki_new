/**
 * Herramienta de migración: importa desde el WordPress actual el HTML ya
 * renderizado de las piezas compartidas y del Home, y lo guarda como
 * parciales en content/partials/*.html (con URLs reescritas a rutas de Next).
 *
 * Se ejecuta a mano cuando cambie algo en el tema de WordPress:
 *   node scripts/import-wp.mjs [http://localhost/wordpress]
 *
 * Piezas:
 *   loader.html            pantalla de carga del sitio
 *   header-es.html / -en   header, mega menús y menú lateral (ES / EN)
 *   home-es.html           secciones del Home (entre header y footer)
 *   form-es.html / -en     formulario de evaluación
 * Además genera public/assets/js/kk-footer-inline.js con los scripts en línea de footer.php.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = (process.argv[2] || 'http://localhost/wordpress').replace(/\/$/, '');
const THEME_DIR = process.env.WP_THEME_DIR || 'C:/xampp/htdocs/wordpress/wp-content/themes/kiki-latam';
const OUT = join(process.cwd(), 'content', 'partials');

// Páginas con versión en inglés (sufijo -en en WordPress, /en/<slug>/ en Next).
const BILINGUAL = [
  'expandirse-en-latam', 'escalar-mi-operacion', 'planear-mi-expansion', 'vender-con-cod', 'kiki-pay',
  'logra-mas-entregas-efectivas', 'recauda-y-recibe',
  'almacenamiento-y-preparacion-de-pedidos', 'gestion-y-confirmacion-de-ordenes', 'distribucion-y-ultima-milla',
  'gestion-de-pagos', 'pagos-y-recaudo', 'integraciones-tecnologicas', 'logistica-internacional',
  'rastreo',
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const HOST = esc(BASE);

/** Reescribe URLs absolutas de WordPress a rutas del sitio Next. */
function rewrite(html) {
  return html
    // Recursos del tema (con o sin ?ver=)
    .replace(new RegExp(`${HOST}/wp-content/themes/kiki-latam/assets/([^"'?\\s)]+)(\\?ver=[^"'\\s)]*)?`, 'g'), '/assets/$1')
    .replace(new RegExp(`${HOST}/wp-content/uploads/`, 'g'), '/media/')
    // Páginas en inglés: /<slug>-en/ -> /en/<slug>/
    .replace(new RegExp(`${HOST}/(${BILINGUAL.map(esc).join('|')})-en/`, 'g'), '/en/$1/')
    // Resto de páginas y anclas del home
    .replace(new RegExp(`${HOST}/`, 'g'), '/')
    .replace(new RegExp(`${HOST}(?=["'#])`, 'g'), '/')
    // Enlaces sin destino (React bloquea javascript:)
    .replace(/href="javascript:void\(0\)"/g, 'href="#"');
}

/** Botones EN / ES del header -> marcadores que se resuelven por página. */
function langPlaceholders(html) {
  return html.replace(
    /<a class="nav-link(?: is-active" aria-current="true)?" href="[^"]*" hreflang="(en|es)" lang="(?:en|es)">/g,
    (_, l) => `<a class="nav-link{{ACTIVE_${l.toUpperCase()}}}" href="{{URL_${l.toUpperCase()}}}" hreflang="${l}" lang="${l}">`,
  );
}

/** Botones ES | EN del footer -> marcadores que se resuelven por página. */
function footerLang(html) {
  return html.replace(
    /<a class="kk-foot__lang(?: is-active)?" href="[^"]*" hreflang="(en|es)" lang="(?:en|es)">/g,
    (_, l) => `<a class="kk-foot__lang{{ACTIVE_${l.toUpperCase()}}}" href="{{URL_${l.toUpperCase()}}}" hreflang="${l}" lang="${l}">`,
  );
}

/** Header EN: el logo y las anclas del home llevan al home en inglés (/en/). */
function enHome(html) {
  return html.replace(/href="(?:\/|https?:\/\/[^"]*\/wordpress\/?)(#[^"]*)?"/g, (_, hash = '') => `href="/en/${hash}"`);
}

function between(html, start, end, label) {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i + start.length);
  if (i < 0 || j < 0) throw new Error(`No se encontró el bloque "${label}"`);
  return html.slice(i, j + end.length);
}

async function page(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${path} respondió ${res.status}`);
  return res.text();
}

const [home, svcEs, svcEn] = await Promise.all([
  page('/'),
  page('/almacenamiento-y-preparacion-de-pedidos/'),
  page('/almacenamiento-y-preparacion-de-pedidos-en/'),
]);

const parts = {
  'loader.html': between(home, '<div class="loader" id="mdiv">', '<!-- loader end -->', 'loader'),
  'header-es.html': langPlaceholders(between(svcEs, '<!-- header section start -->', '<!-- sidebar section end -->', 'header ES')),
  'header-en.html': enHome(langPlaceholders(between(svcEn, '<!-- header section start -->', '<!-- sidebar section end -->', 'header EN'))),
  'home-es.html': between(home, '<!-- sidebar section end -->', '<!-- footer section start -->', 'home')
    .replace('<!-- sidebar section end -->', '').replace('<!-- footer section start -->', ''),
  'form-es.html': between(svcEs, '<section class="Get_in_touch', '</section>', 'form ES'),
  'footer-es.html': footerLang(between(svcEs, '<!-- footer section start -->', '<!-- footer section end -->', 'footer ES')),
  'footer-en.html': enHome(footerLang(between(svcEn, '<!-- footer section start -->', '<!-- footer section end -->', 'footer EN'))),
  'form-en.html': between(svcEn, '<section class="Get_in_touch', '</section>', 'form EN'),
};

await mkdir(OUT, { recursive: true });
for (const [file, html] of Object.entries(parts)) {
  let out = rewrite(html);
  // El header enlaza rastreo.html en ambos idiomas; en inglés va a la versión EN.
  if (file.endsWith('-en.html')) out = out.replace(/href="\/rastreo\/"/g, 'href="/en/rastreo/"');
  await writeFile(join(OUT, file), out.trim() + '\n');
  console.log(`  ${file.padEnd(16)} ${(html.length / 1024).toFixed(1)} KB`);
}

// Scripts en línea de footer.php (pestañas y tarjetas del home), como archivo.
const footer = await readFile(join(THEME_DIR, 'footer.php'), 'utf8');
const inline = [...footer.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1].trim()).join('\n\n');
await writeFile(join(process.cwd(), 'public', 'assets', 'js', 'kk-footer-inline.js'),
  `/* Scripts en línea de footer.php (importados por scripts/import-wp.mjs). */\n${inline}\n`);
console.log('  kk-footer-inline.js generado');
