/** Listado del blog (entradas del WordPress de producción, generadas en el build). */
import { getPosts, featuredImage, excerpt, categories } from '@/lib/wordpress';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'Blog',
  description: 'Guides and insights on logistics, COD, payments and expansion across Latin America.',
};

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
const ALT = { es: '/', en: '/blog/' };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <SiteHeader lang="en" alt={ALT} />
      <main id="primary">
        <section className="kk-blog-head">
          <div className="container">
            <h1>Blog</h1>
            <p>Guides, analysis and insights on logistics, COD, payments and expansion across Latin America.</p>
          </div>
        </section>
        <div className="container">
          <div className="kk-posts">
            {posts.map((p) => {
              const img = featuredImage(p);
              const cat = categories(p)[0];
              return (
                <a className="kk-post-card" href={`/blog/${p.slug}/`} key={p.id}>
                  <div className="kk-post-card__img">{img && <img src={img} alt="" loading="lazy" />}</div>
                  <div className="kk-post-card__body">
                    <time dateTime={p.date}>{fmt(p.date)}{cat ? ` · ${cat}` : ''}</time>
                    <h2 dangerouslySetInnerHTML={{ __html: p.title.rendered }} />
                    <p>{excerpt(p.excerpt.rendered)}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </main>
      <SiteFooter lang="en" alt={ALT} />
    </>
  );
}
