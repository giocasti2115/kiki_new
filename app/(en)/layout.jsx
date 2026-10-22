import RootHtml from '@/components/RootHtml';

const REVIEW = process.env.SITE_ENV !== 'production';

export const metadata = {
  // Sitio de revisión: fuera de Google hasta salir a producción (SITE_ENV=production).
  robots: REVIEW ? { index: false, follow: false } : undefined,
  title: { default: 'Kiki LATAM', template: '%s – Kiki LATAM' },
  description: '5PL platform to scale COD and Prepaid operations across Latin America.',
};

export default function EnLayout({ children }) {
  return <RootHtml lang="en">{children}</RootHtml>;
}
