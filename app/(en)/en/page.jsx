/** Home en inglés (home-en.html: traducción oficial de Marketing, ver scripts/translate-home.mjs). */
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Partial from '@/components/Partial';

export const metadata = {
  title: { absolute: 'Kiki LATAM | 5PL Platform for COD and Prepaid Operations in Latin America' },
  description: 'Scale COD and Prepaid offers in Mexico, Colombia, Peru and the United States with local production, warehousing, fulfillment, delivery, collections, Kiki Pay, integrations and technology in one 5PL platform.',
  alternates: { languages: { es: '/', en: '/en/' } },
};

export default function HomeEn() {
  return (
    <>
      <SiteHeader lang="en" alt={{ es: '/', en: '/en/' }} />
      <Partial name="home-en.html" lang="en" />
      <SiteFooter lang="en" />
    </>
  );
}
