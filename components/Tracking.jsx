/**
 * Rastreo de pedidos: prototipo de la versión HTML (rastreo.html del repo kiki),
 * activo temporalmente hasta que Marketing entregue el diseño nuevo.
 * La consulta se hace en el navegador (public/assets/js/tracking.js).
 */
import '@/styles/tracking.css';

const T = {
  es: {
    eyebrow: 'Seguimiento en vivo',
    title: 'Con nosotros siempre tendrá el control de sus paquetes.',
    lead: 'Introduce el número de seguimiento que recibiste por SMS, WhatsApp o correo electrónico y te mostraremos la última actualización disponible.',
    label: 'Número de guía',
    placeholder: 'Introduce el número de seguimiento',
    button: 'Seguir mi pedido',
    start: 'Ingresa el número de tracking para comenzar.',
    status: 'Estado', tracking: 'En seguimiento', statusMsg: 'Actualizaremos apenas recibamos novedades.',
    guide: 'Guía / Tracking', carrier: 'Transportadora pendiente',
    updated: 'Última actualización', location: 'Ubicación disponible al recibir eventos.',
    eta: 'Entrega estimada', etaHelp: 'Las promesas dependen de nuestros partners.',
    timeline: 'Línea de tiempo del envío', timelineHelp: 'Seguimos cada hito desde la creación hasta la entrega.',
    timelineEmpty: 'Aún no hay eventos registrados para esta guía.',
    detail: 'Detalle completo', detailHelp: 'Historial consolidado con la información enviada por la red logística.',
    cols: ['Fecha', 'Estado', 'Descripción', 'Ubicación'],
    detailEmpty: 'Mostraremos el detalle una vez existan movimientos.',
    help: '¿Necesitas ayuda con tu guía?',
    helpText: 'Nuestro equipo puede validar datos adicionales o escalar incidencias con la transportadora.',
    write: 'Escríbenos',
  },
  en: {
    eyebrow: 'Live tracking',
    title: 'With us, you are always in control of your packages.',
    lead: 'Enter the tracking number you received by SMS, WhatsApp or email and we will show you the latest available update.',
    label: 'Tracking number',
    placeholder: 'Enter your tracking number',
    button: 'Track my order',
    start: 'Enter your tracking number to get started.',
    status: 'Status', tracking: 'In progress', statusMsg: 'We will update this as soon as we receive news.',
    guide: 'Tracking number', carrier: 'Carrier pending',
    updated: 'Last update', location: 'Location available once events are received.',
    eta: 'Estimated delivery', etaHelp: 'Delivery promises depend on our partners.',
    timeline: 'Shipment timeline', timelineHelp: 'We follow every milestone from creation to delivery.',
    timelineEmpty: 'There are no events recorded for this tracking number yet.',
    detail: 'Full detail', detailHelp: 'Consolidated history with the information sent by the logistics network.',
    cols: ['Date', 'Status', 'Description', 'Location'],
    detailEmpty: 'We will show the detail once there is activity.',
    help: 'Need help with your shipment?',
    helpText: 'Our team can validate additional details or escalate issues with the carrier.',
    write: 'Contact us',
  },
};

export default function Tracking({ lang = 'es' }) {
  const t = T[lang];
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
              <form className="tracking-form" id="trackingForm" autoComplete="off">
                <label className="visually-hidden" htmlFor="trackingNumber">{t.label}</label>
                <div className="tracking-input-group">
                  <input className="tracking-input" type="text" id="trackingNumber" name="trackingNumber" placeholder={t.placeholder} maxLength={50} required />
                  <button className="tracking-submit" type="submit" id="trackingSubmit">
                    <span className="tracking-btn-label">{t.button}</span>
                    <span className="tracking-btn-spinner" aria-hidden="true" />
                  </button>
                </div>
              </form>
              <div className="tracking-feedback" id="trackingFeedback" role="status" aria-live="polite">{t.start}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="tracking-data" id="trackingData">
        <div className="container">
          <div className="tracking-summary-grid is-hidden" id="trackingSummaryGrid">
            <article className="tracking-summary-card">
              <span>{t.status}</span>
              <div className="tracking-status-pill" id="summaryStatusPill">{t.tracking}</div>
              <p className="tracking-helper" id="summaryStatusMessage">{t.statusMsg}</p>
            </article>
            <article className="tracking-summary-card">
              <span>{t.guide}</span>
              <strong id="summaryGuide">—</strong>
              <p className="tracking-helper" id="summaryCarrier">{t.carrier}</p>
            </article>
            <article className="tracking-summary-card">
              <span>{t.updated}</span>
              <strong id="summaryUpdated">—</strong>
              <p className="tracking-helper" id="summaryLocation">{t.location}</p>
            </article>
            <article className="tracking-summary-card">
              <span>{t.eta}</span>
              <strong id="summaryEta">—</strong>
              <p className="tracking-helper">{t.etaHelp}</p>
            </article>
          </div>

          <div className="tracking-timeline-card is-hidden" id="trackingTimelineCard">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <h3 className="main_heading mb-2">{t.timeline}</h3>
                <p className="pairagraph m-0">{t.timelineHelp}</p>
              </div>
              <span className="tracking-status-pill" id="timelineStatusPill">{t.tracking}</span>
            </div>
            <ol className="tracking-timeline" id="trackingTimeline" />
            <div className="tracking-empty-state is-hidden" id="trackingTimelineEmpty">{t.timelineEmpty}</div>
          </div>

          <div className="tracking-table-card is-hidden" id="trackingTableCard">
            <div className="mb-3">
              <h3 className="main_heading mb-1">{t.detail}</h3>
              <p className="pairagraph m-0">{t.detailHelp}</p>
            </div>
            <div className="table-responsive">
              <table className="tracking-table">
                <thead>
                  <tr>{t.cols.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody id="trackingTableBody" />
              </table>
            </div>
            <div className="tracking-empty-state is-hidden" id="trackingTableEmpty">{t.detailEmpty}</div>
          </div>

          <div className="tracking-support-card">
            <div>
              <h4 className="mb-1">{t.help}</h4>
              <p className="mb-0">{t.helpText}</p>
            </div>
            <a className="main_btn" href="mailto:tracking@kikilogistics.co">{t.write}</a>
          </div>
        </div>
      </section>
      <script src="/assets/js/tracking.js" defer />
    </main>
  );
}
