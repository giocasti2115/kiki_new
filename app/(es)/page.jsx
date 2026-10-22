/** Home (secciones importadas de WordPress con scripts/import-wp.mjs). */
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Partial from '@/components/Partial';

export const metadata = {
  title: { absolute: 'Kiki LATAM | Plataforma 5PL para operaciones COD y Prepaid' },
  alternates: { languages: { es: '/', en: '/en/' } },
};

export default function Home() {
  return (
    <>
      <SiteHeader lang="es" alt={{ es: '/', en: '/en/' }} />
      <Partial name="home-es.html" lang="es" />
      <SiteFooter lang="es" />
    </>
  );
}
