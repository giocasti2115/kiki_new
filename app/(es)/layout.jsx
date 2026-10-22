import RootHtml from '@/components/RootHtml';

const REVIEW = process.env.SITE_ENV !== 'production';

export const metadata = {
  // Sitio de revisión: fuera de Google hasta salir a producción (SITE_ENV=production).
  robots: REVIEW ? { index: false, follow: false } : undefined,
  title: { default: 'Kiki LATAM', template: '%s – Kiki LATAM' },
  description: 'Plataforma 5PL para escalar operaciones COD y Prepaid en América Latina.',
};

export default function EsLayout({ children }) {
  return <RootHtml lang="es">{children}</RootHtml>;
}
