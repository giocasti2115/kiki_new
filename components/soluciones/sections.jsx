/**
 * Secciones de las páginas de Soluciones (portadas desde template-parts/soluciones/*.php).
 * Mismas clases CSS que el tema de WordPress: soluciones.css se reutiliza tal cual.
 */
import FormPartial from '@/components/FormPartial';

const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

/** Equivalente de kk_sol_btn_url(): anclas locales; el resto lleva al home. */
function solHref(url, lang) {
  if (!url) return '#';
  if (url.startsWith('#')) return url;
  const anchor = url.includes('#') ? url.slice(url.indexOf('#')) : '';
  return `${lang === 'en' ? '/en/' : '/'}${anchor}`;
}

function SolBtn({ btn, lang }) {
  if (!btn?.label) return null;
  return (
    <a className="main_btn" href={solHref(btn.url, lang)}>
      {btn.label} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
    </a>
  );
}

function Hero({ d, title, lang }) {
  const parent = lang === 'en' ? 'Solutions' : 'Soluciones';
  return (
    <section className="sol sol-hero">
      <div className="container">
        <div className="sol-hero__grid">
          <div className="sol-hero__body" data-aos="fade-up" data-aos-duration="900">
            <nav className="sol-hero__crumbs" aria-label="breadcrumb">
              <span>{parent}</span>
              <span aria-hidden="true">/</span>
              <span>{d.crumb || title}</span>
            </nav>
            <h1 className="sol-hero__title">{d.heading}</h1>
            {d.subtitle && <p className="sol-hero__lead">{d.subtitle}</p>}
            <div className="sol-actions">
              <SolBtn btn={d.btn_primary} lang={lang} />
              {d.btn_secondary?.label && (
                <a className="sol-btn-ghost" href={solHref(d.btn_secondary.url, lang)}>
                  <i className="fa-solid fa-circle-play" aria-hidden="true" />
                  {d.btn_secondary.label}
                </a>
              )}
            </div>
            {d.brand_img && <img className="sol-hero__brand" src={d.brand_img} alt={title} />}
          </div>
          {d.img && (
            <div className="sol-hero__media" data-aos="fade-left" data-aos-duration="900">
              <img src={d.img} alt={d.img_alt || ''} fetchPriority="high" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Propuesta({ d }) {
  return (
    <section className="sol sol-prop">
      <div className="container">
        <div className="sol-prop__grid">
          <div className="sol-prop__body" data-aos="fade-up" data-aos-duration="900">
            {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
            <h2 className="sol-title">{d.heading}</h2>
            {arr(d.text).map((p, i) => <p key={i} className="sol-lead">{p}</p>)}
            {d.solucion && <p className="sol-prop__answer">{d.solucion}</p>}
            {d.items && (
              <div className="sol-prop__cards">
                {d.items.map((it) => (
                  <article className="sol-pcard" key={it.title}>
                    <span className="sol-pcard__icon"><i className={`fa-solid ${it.icon || 'fa-circle-check'}`} aria-hidden="true" /></span>
                    <h3 className="sol-pcard__title">{it.title}</h3>
                    {it.text && <p className="sol-pcard__text">{it.text}</p>}
                  </article>
                ))}
              </div>
            )}
          </div>
          {d.img && (
            <div className="sol-prop__media" data-aos="fade-left" data-aos-duration="900">
              <img src={d.img} alt={d.img_alt || ''} loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const STEP_ICONS = ['fa-clipboard-list', 'fa-cube', 'fa-truck', 'fa-credit-card'];

function Proceso({ d }) {
  return (
    <section className="sol sol--sky" id={d.id || 'como-funciona'}>
      <div className="container">
        <div className="sol-head" data-aos="fade-up" data-aos-duration="900">
          {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
          <h2 className="sol-title">{d.heading}</h2>
          {d.sub && <p className="sol-lead">{d.sub}</p>}
        </div>
        <ol className="sol-steps">
          {(d.steps || []).map((s, i) => (
            <li className="sol-step" key={s.title} data-aos="fade-up" data-aos-duration="800" data-aos-delay={i * 100}>
              <div className="sol-step__head">
                <span className="sol-step__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="sol-step__icon"><i className={`fa-solid ${s.icon || STEP_ICONS[i % 4]}`} aria-hidden="true" /></span>
              </div>
              <h3 className="sol-step__title">{s.title}</h3>
              <p className="sol-step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const PHOTO_POS = ['0%', '50%', '100%'];

function Paises({ d, lang }) {
  const split = d.layout === 'split';
  const cards = (
    <div className="sol-countries">
      {(d.items || []).map((it, i) => (
        <article className="sol-country" key={it.pais} data-aos="fade-up" data-aos-duration="800" data-aos-delay={i * 100}>
          <div className="sol-country__top">
            {it.code && <img className="sol-country__map" src={`/assets/images/soluciones/mapas/${it.code}.png`} alt="" loading="lazy" />}
            <div>
              <h3 className="sol-country__name">{it.pais}</h3>
              {it.stats && (
                <div className="sol-country__stats">
                  {it.stats.map((st) => (
                    <div className="sol-country__stat" key={st.label}><b>{st.value}</b><span>{st.label}</span></div>
                  ))}
                </div>
              )}
              {it.source && <div className="sol-country__source">{it.source}</div>}
              {it.text && <p className="sol-country__text">{it.text}</p>}
            </div>
          </div>
          {it.eval && (
            <details className="sol-country__more">
              <summary>{it.eval_label || (lang === 'en' ? 'Learn more' : 'Conocer más')}</summary>
              {arr(it.eval).map((p, j) => <p key={j}>{p}</p>)}
            </details>
          )}
          {it.enfoque && (
            <p className="sol-country__focus">
              <i className={`fa-solid ${it.enfoque_icon || 'fa-crosshairs'}`} aria-hidden="true" />
              <span>{it.enfoque}</span>
            </p>
          )}
          {d.photos && (
            <div className="sol-country__photo" role="img" aria-label={it.pais}
              style={{ backgroundImage: `url('${d.photos}')`, backgroundPositionX: PHOTO_POS[i % 3] }} />
          )}
        </article>
      ))}
    </div>
  );

  return (
    <section className={`sol${split ? ' sol--sky' : ''}`} id={d.id}>
      <div className="container">
        {split ? (
          <div className="sol-split">
            <div data-aos="fade-up" data-aos-duration="900">
              {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
              <h2 className="sol-title">{d.heading}</h2>
              {d.text && <p className="sol-lead">{d.text}</p>}
              {d.btn?.label && <div className="sol-actions"><SolBtn btn={d.btn} lang={lang} /></div>}
            </div>
            {cards}
          </div>
        ) : (
          <>
            <div className="sol-head" data-aos="fade-up" data-aos-duration="900">
              {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
              <h2 className="sol-title">{d.heading}</h2>
              {d.text && <p className="sol-lead">{d.text}</p>}
            </div>
            {cards}
            {d.nota && <p className="sol-countries__note">{d.nota}</p>}
            {d.btn?.label && <div className="sol-countries__cta"><SolBtn btn={d.btn} lang={lang} /></div>}
          </>
        )}
      </div>
    </section>
  );
}

/** Celda del panel simulado (equivalente de kk_sol_cell()). */
function Cell({ c }) {
  if (c == null || typeof c !== 'object') return c;
  if (c.pill) return <span className={`sol-pill sol-pill--${c.pill}`}>{c.text}</span>;
  if (c.skel) return <span className="sol-dash__skel" />;
  if (c.bar != null) return <span className="sol-dash__bar"><i style={{ width: `${Number(c.bar)}%` }} /></span>;
  if (c.map) {
    return (
      <>
        <img src={`/assets/images/soluciones/mapas/${c.map}.png`} alt=""
          style={{ width: 18, height: 20, objectFit: 'contain', mixBlendMode: 'multiply', verticalAlign: 'middle', marginRight: 6 }} />
        {c.text || ''}
      </>
    );
  }
  if (c.link) return <span className="sol-dash__link">{c.link}</span>;
  return null;
}

function Mock({ m }) {
  const side = !!m.aside;
  const dt = m.detail;
  return (
    <div className={`sol-dash${side ? ' sol-dash--aside' : ''}`} aria-hidden="true">
      <aside className="sol-dash__nav">
        <img className="sol-dash__logo" src="/assets/images/kiki/logo-azul.png" alt="" />
        <ul>
          {(m.nav || []).map(([icon, label], i) => (
            <li key={label} className={(m.nav_on || 0) === i ? 'is-on' : undefined}>
              <i className={`fa-solid ${icon}`} />{label}
            </li>
          ))}
        </ul>
      </aside>

      <div className="sol-dash__main">
        <div className="sol-dash__title">
          {m.back && <i className="fa-solid fa-arrow-left" />}
          {m.title}
        </div>
        {m.tabs && (
          <div className="sol-dash__tabs">
            {m.tabs.map((t, i) => <span key={t} className={i === 0 ? 'is-on' : undefined}>{t}</span>)}
          </div>
        )}
        {m.filters && (
          <div className="sol-dash__filters">
            {m.filters.map((f, i) => f.startsWith('search:') ? (
              <span key={i} className="sol-dash__filter sol-dash__filter--search"><i className="fa-solid fa-magnifying-glass" />{f.slice(7)}</span>
            ) : (
              <span key={i} className="sol-dash__filter">{f}<i className="fa-solid fa-chevron-down" /></span>
            ))}
          </div>
        )}
        {m.columns && (
          <div className="sol-dash__tablewrap">
            <table className="sol-dash__table">
              <thead><tr>{m.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
              <tbody>
                {(m.rows || []).map((row, r) => (
                  <tr key={r}>{row.map((c, k) => <td key={k}><Cell c={c} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {dt && (
          <>
            <div className="sol-flow__head">
              <b>{dt.order}</b>
              <span className="sol-pill sol-pill--bad">{dt.status}</span>
            </div>
            <div className="sol-flow">
              <dl className="sol-flow__box">
                {Object.entries(dt.info).map(([k, v]) => (
                  <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
                <span className="sol-dash__link">{dt.link}</span>
              </dl>
              <span className="sol-flow__arrow"><i className="fa-solid fa-arrow-right" /></span>
              <div className="sol-flow__box">
                <h5><i className="fa-regular fa-calendar" />{dt.action.title}</h5>
                <p>{dt.action.text}</p>
                <dt>{dt.action.field}</dt>
                <span className="sol-dash__filter"><i className="fa-regular fa-calendar" />{dt.action.value}<i className="fa-solid fa-chevron-down" /></span>
                <span className="sol-flow__btn">{dt.action.btn}</span>
              </div>
              <span className="sol-flow__arrow"><i className="fa-solid fa-arrow-right" /></span>
              <div className="sol-flow__box sol-flow__box--ok">
                <h5><i className="fa-solid fa-truck" />{dt.result.title}</h5>
                <p>{dt.result.text}</p>
                <dt>{dt.result.field}</dt>
                <dd><b>{dt.result.value}</b></dd>
                <span className="sol-dash__link">{dt.result.link}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {side && (
        <div className="sol-dash__aside">
          <h4><i className={`fa-solid ${m.aside.icon || 'fa-chart-simple'}`} />{m.aside.title}</h4>
          {m.aside.cards.map((card) => (
            <div className="sol-dash__card" key={card.title}>
              <span className={`sol-dash__card-icon${card.tone ? ` is-${card.tone}` : ''}`}><i className={`fa-solid ${card.icon}`} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{card.title}</b>
                {card.text && <p>{card.text}</p>}
                {card.bar != null && <span className="sol-dash__bar"><i style={{ width: `${Number(card.bar)}%` }} /></span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DashHead({ d }) {
  return (
    <>
      {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
      <h2 className="sol-title">{d.heading}</h2>
      {d.text && <p className="sol-lead">{d.text}</p>}
    </>
  );
}

function Dashboard({ d, lang }) {
  const m = d.mock || {};
  if (d.theme === 'dark') {
    return (
      <section className="sol sol-band sol-band--pad">
        <div className="container">
          <div className="sol-dashsplit">
            <div data-aos="fade-up" data-aos-duration="900">
              <DashHead d={d} />
              {d.btn?.label && <div className="sol-actions"><SolBtn btn={d.btn} lang={lang} /></div>}
            </div>
            <div data-aos="fade-left" data-aos-duration="900"><Mock m={m} /></div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="sol">
      <div className="container">
        <div className="sol-head" data-aos="fade-up" data-aos-duration="900"><DashHead d={d} /></div>
        <div data-aos="fade-up" data-aos-duration="900"><Mock m={m} /></div>
        {d.summary && (
          <>
            {d.summary_title && <p className="sol-dash__note"><b>{d.summary_title}</b></p>}
            <div className="sol-dash__summary">
              {d.summary.map(([t, x]) => <div key={t}><b>{t}</b><span>{x}</span></div>)}
            </div>
          </>
        )}
        {d.note && <p className="sol-dash__note">{d.note}</p>}
      </div>
    </section>
  );
}

function Banda({ d, lang }) {
  const chips = d.chips || [];
  return (
    <section className={`sol sol-band${chips.length ? ' sol-band--pad' : ''}`}>
      <div className="container">
        <div className="sol-band__grid">
          <div className="sol-band__body" data-aos="fade-up" data-aos-duration="900">
            {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
            <h2 className="sol-title">{d.heading}</h2>
            {d.text && <p className="sol-lead">{d.text}</p>}
            {d.btn?.label && <div className="sol-actions"><SolBtn btn={d.btn} lang={lang} /></div>}
          </div>
          {chips.length ? (
            <ul className="sol-band__chips" data-aos="fade-left" data-aos-duration="900">
              {chips.map((c) => (
                <li key={c.label} className={c.tone ? `is-${c.tone}` : undefined}>
                  <i className={`fa-solid ${c.icon}`} aria-hidden="true" />{c.label}
                </li>
              ))}
            </ul>
          ) : d.img ? (
            <div className="sol-band__media"><img src={d.img} alt="" loading="lazy" /></div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Cierre({ d, lang }) {
  return (
    <section className="sol sol-close">
      <div className="container">
        <div className="sol-close__grid">
          <div className="sol-close__body" data-aos="fade-up" data-aos-duration="900">
            {d.eyebrow && <span className="sol-eyebrow">{d.eyebrow}</span>}
            <h2 className="sol-title">{d.heading}</h2>
            {d.text && <p className="sol-lead">{d.text}</p>}
            {d.btn?.label && <div className="sol-actions"><SolBtn btn={d.btn} lang={lang} /></div>}
          </div>
          {d.img && (
            <div className="sol-close__media">
              <img src={d.img} alt="" loading="lazy" />
              {d.labels && (
                <ul className="sol-close__labels">
                  {d.labels.map(([icon, label]) => (
                    <li key={label}><i className={`fa-solid ${icon}`} aria-hidden="true" />{label}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const SECTIONS = { hero: Hero, propuesta: Propuesta, proceso: Proceso, paises: Paises, dashboard: Dashboard, banda: Banda, cierre: Cierre };

/** Ensambla la página (equivale a template-parts/solucion-page.php). */
export default function SolucionPage({ page, lang }) {
  return page.sections.map((s, i) => {
    if (s.type === 'form') return <FormPartial key={i} lang={lang} />;
    const Section = SECTIONS[s.type];
    return Section ? <Section key={i} d={s.data || {}} lang={lang} title={page.title} /> : null;
  });
}
