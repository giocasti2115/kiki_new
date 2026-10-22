/**
 * Header real del sitio (mega menús + menú lateral), importado de WordPress.
 * `alt` = URL de esta misma página en cada idioma (botones EN / ES).
 */
import Partial from '@/components/Partial';

export default function SiteHeader({ lang = 'es', alt = { es: '/', en: '/' } }) {
  return (
    <Partial
      name={`header-${lang}.html`}
      lang={lang}
      vars={{
        URL_ES: alt.es,
        URL_EN: alt.en,
        ACTIVE_ES: lang === 'es' ? ' is-active' : '',
        ACTIVE_EN: lang === 'en' ? ' is-active' : '',
      }}
    />
  );
}
