/** Páginas bilingües generadas desde content/*.json (exportado del tema de WordPress). */
import servicios from '@/content/servicios.json';
import soluciones from '@/content/soluciones.json';

export const SOLUCIONES = [
  'expandirse-en-latam', 'escalar-mi-operacion', 'planear-mi-expansion', 'vender-con-cod',
  'kiki-pay', 'logra-mas-entregas-efectivas', 'recauda-y-recibe',
];

export const SERVICIOS = [
  'almacenamiento-y-preparacion-de-pedidos', 'gestion-y-confirmacion-de-ordenes', 'distribucion-y-ultima-milla',
  'gestion-de-pagos', 'pagos-y-recaudo', 'integraciones-tecnologicas', 'logistica-internacional',
];

export const ALL_SLUGS = [...SOLUCIONES, ...SERVICIOS];

/** { kind: 'solucion' | 'servicio', page } o null. */
export function getPage(slug, lang = 'es') {
  const key = `${slug}:${lang}`;
  if (soluciones[key]) return { kind: 'solucion', page: soluciones[key] };
  if (servicios[key]) return { kind: 'servicio', page: servicios[key] };
  return null;
}

/** URL de una página bilingüe: /<slug>/ (ES) o /en/<slug>/ (EN). */
export function pageUrl(slug, lang = 'es') {
  return lang === 'en' ? `/en/${slug}/` : `/${slug}/`;
}

/**
 * Páginas publicadas hoy. Un enlace interno a cualquier otra ruta se muestra
 * sin clic (ver components/Partial.jsx). Para activar una página nueva,
 * agrégala aquí cuando exista.
 */
const EXTRA_ACTIVE = ['/', '/en/'];

export function isActiveHref(href) {
  if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:)/.test(href)) return true;
  if (!href.startsWith('/')) return false;
  const path = href.split('#')[0].split('?')[0];
  if (EXTRA_ACTIVE.includes(path)) return true;
  if (path === '/blog/' || /^\/blog\/[a-z0-9-]+\/$/.test(path)) return true;
  const m = path.match(/^\/(?:en\/)?([a-z0-9-]+)\/$/);
  return !!m && ALL_SLUGS.includes(m[1]);
}
