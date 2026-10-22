/** Utilidades de enlaces para las secciones de Servicios. */
import { SERVICIOS, pageUrl } from '@/lib/pages';

export { SERVICIOS };
export const servicioUrl = pageUrl;

/**
 * Destino de un botón o enlace de sección:
 * { svc } -> otra página de servicio; '#ancla' -> ancla local; resto -> home.
 */
export function linkHref(link, lang) {
  if (!link) return '#';
  if (link.svc) return pageUrl(link.svc, lang);
  const url = link.url || '#evaluacion';
  return url.startsWith('#') ? url : lang === 'en' ? '/en/' : '/';
}
