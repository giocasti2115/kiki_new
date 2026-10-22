/**
 * Secciones de las páginas de Servicios (portadas desde template-parts/servicios/*.php).
 * Mismas clases CSS que el tema de WordPress, de modo que servicios.css se reutiliza tal cual.
 */
import { linkHref } from '@/lib/servicios';
import FormPartial from '@/components/FormPartial';

const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const num = (i) => String(i + 1).padStart(2, '0');

function Title({ d, as: Tag = 'h2', className = 'svc-title' }) {
  if (!d.heading && !d.accent) return null;
  return (
    <Tag className={className}>
      {d.heading}
      {d.accent ? <> <span>{d.accent}</span></> : null}
    </Tag>
  );
}

function SvcLink({ link, lang }) {
  if (!link?.label) return null;
  return (
    <a className="svc-link" href={linkHref(link, lang)}>
      {link.label} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
    </a>
  );
}

function SvcBtn({ btn, lang }) {
  if (!btn?.label) return null;
  return (
    <a className="main_btn" href={linkHref(btn, lang)}>
      {btn.label} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
    </a>
  );
}

function Head({ d }) {
  return (
    <div className="svc-head">
      {d.eyebrow && <span className="svc-eyebrow">{d.eyebrow}</span>}
      <Title d={d} />
      {d.sub && <p className="svc-lead">{d.sub}</p>}
    </div>
  );
}

function Hero({ d, lang, title }) {
  const en = lang === 'en';
  return (
    <section className="svc svc-hero">
      {d.img && <div className="svc-hero__bg" role="img" aria-label={d.img_alt || ''} style={{ backgroundImage: `url('${d.img}')` }} />}
      <div className="container">
        <div className="svc-hero__body">
          <ol className="svc-crumbs" aria-label="breadcrumb">
            <li><a href={en ? '/en/' : '/'}>{en ? 'Home' : 'Inicio'}</a></li>
            <li>{en ? 'Services' : 'Servicios'}</li>
            <li aria-current="page">{title}</li>
          </ol>
          {d.eyebrow && <span className="svc-eyebrow">{d.eyebrow}</span>}
          <Title d={d} as="h1" className="svc-hero__title" />
          {arr(d.subtitle).map((p, i) => <p key={i} className="svc-hero__lead">{p}</p>)}
          <div className="svc-actions">
            <SvcBtn btn={d.btn_primary} lang={lang} />
            <SvcLink link={d.btn_secondary} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro({ d }) {
  return (
    <section className="svc">
      <div className="container">
        <div className="svc-intro__grid">
          {d.img && <div className="svc-intro__media"><img src={d.img} alt={d.img_alt || ''} loading="lazy" /></div>}
          <div>
            <Title d={d} />
            {arr(d.text).map((p, i) => <p key={i} className="svc-lead">{p}</p>)}
            {d.items && (
              <ul className="svc-feats">
                {d.items.map((it) => (
                  <li key={it.title}>
                    <span className="svc-feat__icon"><i className={`fa-solid ${it.icon}`} aria-hidden="true" /></span>
                    <h3 className="svc-feat__title">{it.title}</h3>
                    <p className="svc-feat__text">{it.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Servicios({ d }) {
  const layout = d.layout || 'grid3';
  return (
    <section className="svc svc--sky" id={d.id || 'servicios'}>
      <div className="container">
        <Head d={d} />
        {layout === 'tall' ? (
          <div className="svc-tall">
            {d.items.map((it, i) => (
              <article className="svc-tall__card" key={it.title}>
                <span className="svc-num">{num(i)}</span>
                <span className="svc-tall__icon">
                  {it.logo ? <img src={it.logo} alt="" /> : <i className={`fa-solid ${it.icon}`} aria-hidden="true" />}
                </span>
                <h3 className="svc-tall__title">{it.title}</h3>
                {arr(it.text).map((p, j) => <p key={j} className="svc-card__text">{p}</p>)}
                {it.ideal && (
                  <p className="svc-ideal">
                    <i className={`fa-solid ${it.ideal_icon || 'fa-users'}`} aria-hidden="true" />
                    <span>{it.ideal}</span>
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className={`svc-cards${layout === 'grid2' ? ' svc-cards--2' : ''}`}>
            {d.items.map((it, i) => (
              <article className="svc-card" key={it.title}>
                <span className="svc-num">{num(i)}</span>
                <span className={`svc-card__icon${it.tone ? ` svc-tone-${it.tone}` : ' is-round'}`}>
                  <i className={`fa-solid ${it.icon}`} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="svc-card__title">{it.title}</h3>
                  {arr(it.text).map((p, j) => <p key={j} className="svc-card__text">{p}</p>)}
                </div>
              </article>
            ))}
          </div>
        )}
        {d.note && <p className="svc-note">{d.note}</p>}
      </div>
    </section>
  );
}

function Pasos({ d }) {
  const layout = d.layout || 'row';
  const cols = layout === 'cards' ? 2 : d.steps.length;
  return (
    <section className={`svc${d.sky ? ' svc--sky' : ''}`}>
      <div className="container">
        <Head d={d} />
        <ol className={`svc-steps svc-steps--${layout}`} style={{ '--svc-cols': cols }}>
          {d.steps.map((s, i) => (
            <li className="svc-step" key={s.title}>
              <span className="svc-step__num">{num(i)}</span>
              <span className="svc-step__icon"><i className={`fa-solid ${s.icon}`} aria-hidden="true" /></span>
              <div>
                <h3 className="svc-step__title">{s.title}</h3>
                <p className="svc-step__text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ScopeList({ items }) {
  return (
    <ul className="svc-scope" style={{ '--svc-cols': items.length }}>
      {items.map((it) => (
        <li key={it.title}>
          <span className="svc-step__icon"><i className={`fa-solid ${it.icon}`} aria-hidden="true" /></span>
          <div>
            <span className="svc-scope__title">{it.title}</span>
            <span className="svc-scope__text">{it.text}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Alcance({ d }) {
  return (
    <section className="svc svc--sky">
      <div className="container">
        <Head d={d} />
        <ScopeList items={d.items} />
        {d.note && <p className="svc-note">{d.note}</p>}
      </div>
    </section>
  );
}

function Paises({ d }) {
  return (
    <section className="svc">
      <div className="container">
        <Head d={d} />
        <div className="svc-countries">
          {d.items.map((it) => (
            <article className="svc-country" key={it.code}>
              <div className="svc-country__head">
                <span className={`svc-flag svc-flag--${it.code}`} aria-hidden="true" />
                <h3 className="svc-country__name">{it.pais}</h3>
              </div>
              <ul>
                {it.methods.map(([icon, label]) => (
                  <li key={label}><i className={`fa-solid ${icon}`} aria-hidden="true" />{label}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        {d.note && <p className="svc-note">{d.note}</p>}
      </div>
    </section>
  );
}

function Crossborder({ d, lang }) {
  return (
    <section className="svc svc--sky" id={d.id}>
      <div className="container">
        <div className="text-center">{d.eyebrow && <span className="svc-eyebrow">{d.eyebrow}</span>}</div>
        <div className="svc-xb__head">
          <div>
            <Title d={d} />
            {d.sub && <p className="svc-lead">{d.sub}</p>}
          </div>
          {d.flags && (
            <div className="svc-xb__flags">
              {d.flags.map(([code, label]) => (
                <span key={code}><i className={`svc-flag svc-flag--${code}`} aria-hidden="true" />{label}</span>
              ))}
            </div>
          )}
        </div>
        <ScopeList items={d.items} />
        <div className="svc-xb__foot">
          <SvcBtn btn={d.btn} lang={lang} />
          {d.audience && <p><i className="fa-regular fa-user" aria-hidden="true" />{d.audience}</p>}
        </div>
      </div>
    </section>
  );
}

function Conexion({ d, lang }) {
  return (
    <section className="svc svc-conn">
      <div className="container">
        <div className="svc-conn__grid">
          <div>
            {d.eyebrow && <span className="svc-eyebrow">{d.eyebrow}</span>}
            <Title d={d} />
            {arr(d.text).map((p, i) => <p key={i} className="svc-lead">{p}</p>)}
            {d.links && (
              <ul className="svc-conn__links">
                {d.links.map((l) => <li key={l.label}><SvcLink link={l} lang={lang} /></li>)}
              </ul>
            )}
          </div>
          {d.img && (
            <div className={`svc-conn__media${d.photo ? ' svc-conn__media--photo' : ''}`}>
              <img src={d.img} alt="" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Franja({ d, lang }) {
  return (
    <section className="svc svc-strip">
      <div className="container">
        <div className="svc-strip__grid">
          <div>
            <Title d={d} />
            {d.text && <p className="svc-lead">{d.text}</p>}
          </div>
          <div className="svc-strip__actions">
            <SvcBtn btn={d.btn} lang={lang} />
            <SvcLink link={d.link} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq({ d }) {
  return (
    <section className="svc" id="preguntas-frecuentes">
      <div className="container">
        <Head d={d} />
        <div className="svc-faq">
          {d.items.map((it) => (
            <details key={it.q}>
              <summary>
                <span className="svc-faq__q">{it.q}</span>
                <span className="svc-faq__a">{it.a}</span>
              </summary>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ d, lang }) {
  return (
    <section className="svc svc-cta">
      <div className="container">
        <div className="svc-cta__box">
          <div>
            <Title d={d} />
            {d.text && <p className="svc-lead">{d.text}</p>}
            <div className="svc-actions">
              <SvcBtn btn={d.btn} lang={lang} />
              {d.btn2?.label && (
                <a className="svc-cta__btn2" href={linkHref(d.btn2, lang)}>
                  {d.btn2.label} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </a>
              )}
              <SvcLink link={d.link} lang={lang} />
            </div>
            {d.note && <p className="svc-cta__note">{d.note}</p>}
          </div>
          {d.img && <div className="svc-cta__media"><img src={d.img} alt="" loading="lazy" /></div>}
        </div>
      </div>
    </section>
  );
}

const SECTIONS = {
  hero: Hero,
  intro: Intro,
  servicios: Servicios,
  pasos: Pasos,
  alcance: Alcance,
  paises: Paises,
  crossborder: Crossborder,
  conexion: Conexion,
  franja: Franja,
  faq: Faq,
  cta: Cta,
};

/** Ensambla la página a partir de sus secciones (equivale a template-parts/servicio-page.php). */
export default function ServicioPage({ page, lang }) {
  return page.sections.map((s, i) => {
    if (s.type === 'form') return <FormPartial key={i} lang={lang} />;
    const Section = SECTIONS[s.type];
    return Section ? <Section key={i} d={s.data || {}} lang={lang} title={page.title} /> : null;
  });
}
