/** Entrada del blog: una página estática por cada post publicado en WordPress. */
import { notFound } from 'next/navigation';
import { getPosts, getPost, featuredImage, plainText, excerpt, localMedia, categories } from '@/lib/wordpress';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FormPartial from '@/components/FormPartial';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const img = featuredImage(post);
  return {
    title: plainText(post.title.rendered),
    description: excerpt(post.excerpt.rendered, 160),
    openGraph: img ? { images: [img] } : undefined,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const img = featuredImage(post);
  const cats = categories(post);
  const alt = { es: '/', en: `/blog/${slug}/` };
  return (
    <>
      <SiteHeader lang="en" alt={alt} />
      <main id="primary">
        <section className="kk-blog-head">
          <div className="container">
            <a className="kk-back" href="/blog/">← Blog</a>
            <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <p>
              {new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              {cats.length ? ` · ${cats.join(', ')}` : ''}
            </p>
          </div>
        </section>
        <article className="kk-article">
          {img && <img className="kk-article__cover" src={img} alt="" />}
          {/* HTML del editor de WordPress (contenido de Marketing). */}
          <div dangerouslySetInnerHTML={{ __html: localMedia(post.content.rendered) }} />
        </article>
        <FormPartial lang="en" />
      </main>
      <SiteFooter lang="en" alt={alt} />
    </>
  );
}
