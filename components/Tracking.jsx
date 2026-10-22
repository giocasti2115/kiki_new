'use client';
/**
 * Rastreo de pedidos: prototipo de la versión HTML (rastreo.html del repo kiki),
 * activo temporalmente hasta que Marketing entregue el diseño nuevo.
 *
 * Consulta pública en el navegador: GET {API}/<guía>. El API responde una lista
 * de estados [{ state, date, provider_date, without_tz }] o 404 si no existe.
 * Admite ?guia=, ?guide= o ?tracking= en la URL para consultar al cargar.
 */
import { useEffect, useState } from 'react';
import '@/styles/tracking.css';

const API_URL = 'https://api.kikilogistics.co/api/v1/routes/getRouteByGuide';

const T = {
  es: {
    locale: 'es-CO',
    eyebrow: 'Seguimiento en vivo',
    title: 'Con nosotros siempre tendrá el control de sus paquetes.',
    lead: 'Introduce el número de seguimiento que recibiste por SMS, WhatsApp o correo electrónico y te mostraremos la última actualización disponible.',
    label: 'Número de guía',
    placeholder: 'Introduce el número de seguimiento',
    button: 'Seguir mi pedido',
    start: 'Ingresa el número de tracking para comenzar.',
    status: 'Estado', tracking: 'En seguimiento', statusMsg: 'Actualizaremos apenas recibamos novedades.',
    guide: 'Guía / Tracking', carrier: 'Transportadora: ',
    updated: 'Última actualización', lastLoc: 'Última ubicación: ', location: 'Ubicación disponible al recibir eventos.',
    eta: 'Entrega estimada', etaHelp: 'Las promesas dependen de nuestros partners.',
    timeline: 'Línea de tiempo del envío', timelineHelp: 'Seguimos cada hito desde la creación hasta la entrega.',
    timelineEmpty: 'Aún no hay eventos registrados para esta guía.',
    detail: 'Detalle completo', detailHelp: 'Historial consolidado con la información enviada por la red logística.',
    cols: ['Fecha', 'Estado', 'Descripción', 'Ubicación'],
    detailEmpty: 'Mostraremos el detalle una vez existan movimientos.',
    help: '¿Necesitas ayuda con tu guía?',
    helpText: 'Nuestro equipo puede validar datos adicionales o escalar incidencias con la transportadora.',
    write: 'Escríbenos',
    noData: 'Sin dato', update: 'Actualización', noDesc: 'Sin descripción adicional', noDescShort: 'Sin descripción',
    querying: 'Consultando la guía en la red de Kiki...',
    notFound: 'No encontramos información para este número de guía.',
    failed: 'No pudimos consultar el estado. Inténtalo nuevamente en unos minutos.',
    shown: 'Mostrando la información más reciente disponible.',
    invalid: 'Por favor ingresa un número de guía válido.',
    badChars: 'El número ingresado no contiene caracteres permitidos.',
  },
  en: {
    locale: 'en-US',
    eyebrow: 'Live tracking',
    title: 'With us, you are always in control of your packages.',
    lead: 'Enter the tracking number you received by SMS, WhatsApp or email and we will show you the latest available update.',
    label: 'Tracking number',
    placeholder: 'Enter your tracking number',
    button: 'Track my order',
    start: 'Enter your tracking number to get started.',
    status: 'Status', tracking: 'In progress', statusMsg: 'We will update this as soon as we receive news.',
    guide: 'Tracking number', carrier: 'Carrier: ',
    updated: 'Last update', lastLoc: 'Last location: ', location: 'Location available once events are received.',
    eta: 'Estimated delivery', etaHelp: 'Delivery promises depend on our partners.',
    timeline: 'Shipment timeline', timelineHelp: 'We follow every milestone from creation to delivery.',
    timelineEmpty: 'There are no events recorded for this tracking number yet.',
    detail: 'Full detail', detailHelp: 'Consolidated history with the information sent by the logistics network.',
    cols: ['Date', 'Status', 'Description', 'Location'],
    detailEmpty: 'We will show the detail once there is activity.',
    help: 'Need help with your shipment?',
    helpText: 'Our team can validate additional details or escalate issues with the carrier.',
    write: 'Contact us',
    noData: 'No data', update: 'Update', noDesc: 'No additional description', noDescShort: 'No description',
    querying: 'Checking your tracking number on the Kiki network...',
    notFound: 'We could not find information for this tracking number.',
    failed: 'We could not check the status. Please try again in a few minutes.',
    shown: 'Showing the latest available information.',
    invalid: 'Please enter a valid tracking number.',
    badChars: 'The number entered contains no allowed characters.',
  },
};

const sanitizeGuide = (value) => value.replace(/[^a-zA-Z0-9-_.]/g, '').toUpperCase();

function parseDate(value) {
  if (!value && value !== 0) return null;
  const d = typeof value === 'number' ? new Date(value) : new Date(value.toString().replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? null : d;
}

// Estados del API: Recibida, Despachado, En centro de distribución, En transito,
// En tránsito a destino final, Entregado/Entregada, Intento de entrega fallido,
// No entregado, Devuelto a remitente. "No entregado" se evalúa antes que "entregado".
function tone(status = '') {
  const text = status.toString().toLowerCase();
  if (/no entregad|fallid|devuel|incidencia|reten|issue|return/.test(text)) return 'issue';
  if (/entregad|delivered|finalizad/.test(text)) return 'delivered';
  if (/tr[aá]nsit|despachad|distribuci|camino|ruta|recole|route/.test(text)) return 'in-transit';
  return '';
}

/** Lista de estados del API (o un objeto con eventos, por si el formato cambia) → resumen + eventos. */
function normalize(raw, t) {
  if (Array.isArray(raw) && !raw.length) return null;
  const base = Array.isArray(raw) ? { events: raw } : (raw && (raw.data || raw.route || raw.result)) || raw;
  if (!base || typeof base !== 'object') return null;
  let events = base.events || base.history || base.timeline || base.movements || [];
  if (!Array.isArray(events)) events = Object.values(events);
  events = events.filter(Boolean).map((e) => ({
    status: e.state || e.status || e.event || e.title || t.update,
    description: e.description || e.message || e.detail || '',
    location: e.location || [e.city, e.country].filter(Boolean).join(', ') || e.address || '',
    date: e.date || e.provider_date || e.eventDate || e.createdAt || e.timestamp || null,
  }));
  const ts = (d) => parseDate(d)?.getTime() || 0;
  events.sort((a, b) => ts(b.date) - ts(a.date));
  const latest = events[0] || {};
  return {
    guide: base.guide || base.guideNumber || base.trackingNumber || '',
    carrier: base.carrier || base.provider || 'Kiki Logistics',
    status: base.status || base.currentStatus || latest.status || t.tracking,
    eta: base.estimatedDelivery || base.eta || base.promiseDate || '',
    lastUpdate: latest.date || base.updatedAt || '',
    location: latest.location || base.location || '',
    detail: latest.description || base.message || t.statusMsg,
    events,
  };
}

function Pill({ status, fallback }) {
  return <span className={`tracking-status-pill ${tone(status)}`.trim()}>{status || fallback}</span>;
}

export default function Tracking({ lang = 'es' }) {
  const t = T[lang];
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: t.start, type: '' });
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState('');

  const fmt = (value) => {
    if (!value && value !== 0) return t.noData;
    const d = parseDate(value);
    return d ? d.toLocaleString(t.locale, { dateStyle: 'medium', timeStyle: 'short' }) : value;
  };

  async function lookup(value) {
    setResult(null);
    setQuery(value);
    setLoading(true);
    setFeedback({ text: t.querying, type: '' });
    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(value)}`, { headers: { Accept: 'application/json' } });
      if (res.status === 404) throw new Error(t.notFound);
      if (!res.ok) throw new Error(t.failed);
      const data = normalize(await res.json(), t);
      if (!data) throw new Error(t.notFound);
      setResult(data);
      setFeedback({ text: t.shown, type: 'success' });
    } catch (err) {
      setFeedback({ text: err instanceof TypeError ? t.failed : err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    if (!guide.trim()) return setFeedback({ text: t.invalid, type: 'error' });
    const clean = sanitizeGuide(guide.trim());
    if (!clean) return setFeedback({ text: t.badChars, type: 'error' });
    setGuide(clean);
    lookup(clean);
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const auto = sanitizeGuide(p.get('guia') || p.get('guide') || p.get('tracking') || '');
    if (auto) {
      setGuide(auto);
      lookup(auto);
    }
    // Solo al cargar la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeline = result ? [...result.events].reverse() : [];

  return (
    <main id="primary">
      <section className="tracking-hero">
        <div className="container">
          <div className="tracking-hero-card">
            <div className="tracking-hero-visual">
              <img src="/assets/images/rastreo-pedido.webp" alt="" width="900" height="601" />
            </div>
            <div className="tracking-hero-content">
              <span className="tracking-eyebrow">{t.eyebrow}</span>
              <h1>{t.title}</h1>
              <p className="lead">{t.lead}</p>
              <form className="tracking-form" onSubmit={submit} autoComplete="off">
                <label className="visually-hidden" htmlFor="trackingNumber">{t.label}</label>
                <div className="tracking-input-group">
                  <input
                    className="tracking-input" type="text" id="trackingNumber" name="trackingNumber"
                    placeholder={t.placeholder} maxLength={50} required
                    value={guide} onChange={(e) => setGuide(e.target.value)}
                  />
                  <button className={`tracking-submit${loading ? ' is-loading' : ''}`} type="submit" disabled={loading}>
                    <span className="tracking-btn-label">{t.button}</span>
                    <span className="tracking-btn-spinner" aria-hidden="true" />
                  </button>
                </div>
              </form>
              <div className={`tracking-feedback ${feedback.type}`.trim()} role="status" aria-live="polite">{feedback.text}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tracking-data" id="trackingData">
        <div className="container">
          {result && (
            <>
              <div className="tracking-summary-grid">
                <article className="tracking-summary-card">
                  <span>{t.status}</span>
                  <Pill status={result.status} fallback={t.tracking} />
                  <p className="tracking-helper">{result.detail}</p>
                </article>
                <article className="tracking-summary-card">
                  <span>{t.guide}</span>
                  <strong>{result.guide || query}</strong>
                  <p className="tracking-helper">{t.carrier + result.carrier}</p>
                </article>
                <article className="tracking-summary-card">
                  <span>{t.updated}</span>
                  <strong>{fmt(result.lastUpdate)}</strong>
                  <p className="tracking-helper">{result.location ? t.lastLoc + result.location : t.location}</p>
                </article>
                <article className="tracking-summary-card">
                  <span>{t.eta}</span>
                  <strong>{result.eta ? fmt(result.eta).split(',')[0] : t.noData}</strong>
                  <p className="tracking-helper">{t.etaHelp}</p>
                </article>
              </div>

              <div className="tracking-timeline-card">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  <div>
                    <h3 className="main_heading mb-2">{t.timeline}</h3>
                    <p className="pairagraph m-0">{t.timelineHelp}</p>
                  </div>
                  <Pill status={result.status} fallback={t.tracking} />
                </div>
                {timeline.length ? (
                  <ol className="tracking-timeline">
                    {timeline.map((e, i) => (
                      <li className={`tracking-timeline-item ${tone(e.status)}`.trim()} key={i}>
                        <div className="tracking-timeline-marker" />
                        <p className="tracking-helper mb-1">{fmt(e.date)}</p>
                        <h4>{e.status}</h4>
                        <p>{[e.description, e.location].filter(Boolean).join(' · ') || t.noDesc}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="tracking-empty-state">{t.timelineEmpty}</div>
                )}
              </div>

              <div className="tracking-table-card">
                <div className="mb-3">
                  <h3 className="main_heading mb-1">{t.detail}</h3>
                  <p className="pairagraph m-0">{t.detailHelp}</p>
                </div>
                {result.events.length ? (
                  <div className="table-responsive">
                    <table className="tracking-table">
                      <thead>
                        <tr>{t.cols.map((c) => <th key={c}>{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {result.events.map((e, i) => (
                          <tr key={i}>
                            <td>{fmt(e.date)}</td>
                            <td>{e.status}</td>
                            <td>{e.description || t.noDescShort}</td>
                            <td>{e.location || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="tracking-empty-state">{t.detailEmpty}</div>
                )}
              </div>
            </>
          )}

          <div className="tracking-support-card">
            <div>
              <h4 className="mb-1">{t.help}</h4>
              <p className="mb-0">{t.helpText}</p>
            </div>
            <a className="main_btn" href="mailto:tracking@kikilogistics.co">{t.write}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
