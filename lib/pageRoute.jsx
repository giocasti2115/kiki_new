/** Página bilingüe completa (header + secciones + footer). */
import { notFound } from 'next/navigation';
import { getPage, pageUrl } from '@/lib/pages';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ServicioPage from '@/components/servicios/sections';
import SolucionPage from '@/components/soluciones/sections';

export function pageMetadata(slug, lang) {
  const found = getPage(slug, lang);
  const hero = found?.page.sections.find((s) => s.type === 'hero')?.data;
  const sub = Array.isArray(hero?.subtitle) ? hero.subtitle[0] : hero?.subtitle;
  return {
    title: found?.page.title,
    description: sub,
    alternates: { languages: { es: pageUrl(slug, 'es'), en: pageUrl(slug, 'en') } },
  };
}

export function PageRoute({ slug, lang }) {
  const found = getPage(slug, lang);
  if (!found) notFound();
  const Body = found.kind === 'solucion' ? SolucionPage : ServicioPage;
  return (
    <>
      <SiteHeader lang={lang} alt={{ es: pageUrl(slug, 'es'), en: pageUrl(slug, 'en') }} />
      <Body page={found.page} lang={lang} />
      <SiteFooter lang={lang} alt={{ es: pageUrl(slug, 'es'), en: pageUrl(slug, 'en') }} />
    </>
  );
}
