/**
 * Cliente del WordPress que publica el blog. Solo se ejecuta durante el build:
 * el sitio generado no consulta WordPress en tiempo de visita.
 *
 * WP_API_URL: API REST (por defecto, la de producción, que hoy es pública).
 * BLOG_LOCAL_MEDIA=1: usar copias locales de las imágenes (scripts/sync-media.mjs)
 *   en lugar de cargarlas desde WordPress; necesario cuando WordPress sea privado.
 * WP_APP_USER / WP_APP_PASSWORD: contraseña de aplicación de WordPress, para
 *   cuando la API deje de ser pública.
 */
const API = process.env.WP_API_URL || 'https://kikilatam.com/wp-json/wp/v2';
const LOCAL_MEDIA = process.env.BLOG_LOCAL_MEDIA === '1';
const AUTH = process.env.WP_APP_USER && process.env.WP_APP_PASSWORD
  ? { Authorization: 'Basic ' + Buffer.from(`${process.env.WP_APP_USER}:${process.env.WP_APP_PASSWORD}`).toString('base64') }
  : {};

const FIELDS = 'id,slug,date,modified,title,excerpt,content,categories,_links,_embedded';

let all = null;

/** Todas las entradas publicadas (paginando la API), más recientes primero. Se piden una sola vez por build. */
export function getPosts() {
  if (!all) {
    all = (async () => {
      const out = [];
      for (let page = 1; ; page++) {
        const res = await fetch(`${API}/posts?per_page=40&page=${page}&_embed=wp:featuredmedia,wp:term&_fields=${FIELDS}`, { headers: AUTH, cache: 'force-cache' });
        if (!res.ok) throw new Error(`WordPress respondió ${res.status} en la página ${page} de entradas`);
        out.push(...(await res.json()));
        if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break;
      }
      return out;
    })();
  }
  return all;
}

/** Una entrada por slug. */
export async function getPost(slug) {
  return (await getPosts()).find((p) => p.slug === slug) || null;
}

/** Reescribe wp-content/uploads a /media/ solo si se usan copias locales. */
export function localMedia(html = '') {
  return LOCAL_MEDIA ? html.replace(/https?:\/\/[^"'\s)]+\/wp-content\/uploads\//g, '/media/') : html;
}

/** URL de la imagen destacada de una entrada, si existe. */
export function featuredImage(post) {
  const url = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  return url ? localMedia(url) : null;
}

/** Categorías de la entrada (sin la genérica "Blog"). */
export function categories(post) {
  return (post?._embedded?.['wp:term'] || []).flat()
    .filter((t) => t.taxonomy === 'category' && t.name !== 'Blog')
    .map((t) => t.name);
}

/** Texto plano de un fragmento HTML de WordPress. */
export function plainText(html = '') {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&hellip;|&#8230;/g, '…').replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&amp;|&#038;/g, '&')
    .trim();
}

/** Extracto en texto plano, cortado en palabra completa. */
export function excerpt(html = '', max = 150) {
  const text = plainText(html).replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)).replace(/[.,;:]$/, '') + '…';
}
