import { ALL_SLUGS } from '@/lib/pages';
import { PageRoute, pageMetadata } from '@/lib/pageRoute';

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return pageMetadata(slug, 'es');
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <PageRoute slug={slug} lang="es" />;
}
