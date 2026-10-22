/** Footer global: mismo markup que footer.php de WordPress (importado como parcial). */
import Partial from '@/components/Partial';

export default function SiteFooter({ lang = 'es', alt = { es: '/', en: '/en/' } }) {
  return (
    <>
      <Partial
        name={`footer-${lang}.html`}
        lang={lang}
        vars={{
          URL_ES: alt.es,
          URL_EN: alt.en,
          ACTIVE_ES: lang === 'es' ? ' is-active' : '',
          ACTIVE_EN: lang === 'en' ? ' is-active' : '',
        }}
      />
      <a href="#primary" className="scroll-top-btn" aria-label={lang === 'en' ? 'Back to top' : 'Volver al inicio'}>
        <i className="fa-solid fa-arrow-up" />
      </a>
    </>
  );
}
