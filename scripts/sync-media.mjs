/**
 * Copia al sitio estático las imágenes del blog que viven en WordPress
 * (imagen destacada + imágenes dentro del contenido), para que el sitio
 * publicado no dependa de WordPress y este pueda quedar privado.
 *
 * Se ejecuta antes de `next build` (script "prebuild").
 * wp-content/uploads/2026/10/foto.webp -> public/media/2026/10/foto.webp
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const API = process.env.WP_API_URL || 'https://kikilatam.com/wp-json/wp/v2';
const OUT = join(process.cwd(), 'public', 'media');
const UPLOADS = /https?:\/\/[^"'\s)]+\/wp-content\/uploads\/([^"'\s)?#]+)/g;

const posts = [];
for (let page = 1; ; page++) {
  const res = await fetch(`${API}/posts?per_page=100&page=${page}&_embed=wp:featuredmedia`);
  if (!res.ok) throw new Error(`WordPress respondió ${res.status}`);
  posts.push(...(await res.json()));
  if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break;
}

const urls = new Map();
for (const p of posts) {
  const text = JSON.stringify([p.content?.rendered, p._embedded?.['wp:featuredmedia']?.[0]?.source_url]);
  for (const m of text.matchAll(UPLOADS)) urls.set(m[0], m[1]);
}

let copied = 0;
for (const [url, rel] of urls) {
  const dest = join(OUT, rel);
  try { await access(dest); continue; } catch {}
  const r = await fetch(url);
  if (!r.ok) { console.warn(`  omitida ${url} (${r.status})`); continue; }
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await r.arrayBuffer()));
  copied++;
}
console.log(`sync-media: ${urls.size} imágenes referenciadas, ${copied} copiadas a public/media`);
