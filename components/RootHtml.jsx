/**
 * <html> común a los layouts ES / EN. Carga la misma pila de estilos y
 * scripts que el tema de WordPress (inc/enqueue.php), en el mismo orden,
 * para que el diseño sea idéntico.
 */
import '@/styles/blog.css';
import Partial from '@/components/Partial';

const CSS = [
  'style.css', 'responsive.css', 'aos.css',
  'bootstrap-grid.css', 'bootstrap-reboot.css', 'bootstrap-utilities.css',
  'bootstrap.css', 'bootstrap.min.css', 'bootstrap.rtl.css', 'swiper-bundle.min.css',
  'footer.css', 'soluciones.css', 'servicios.css', 'kk-next.css',
];

// Scripts del tema (se omite code.js: enviaba el formulario a un code.php inexistente).
const JS = [
  '/assets/js/vendor/jquery.min.js',
  '/assets/js/vendor/jquery-migrate.min.js',
  '/assets/js/kk-jquery-alias.js',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js',
  '/assets/js/aos.js',
  '/assets/js/function.js',
  '/assets/js/script.js',
  '/assets/js/popup.js',
  '/assets/js/bootstrap.bundle.min.js',
  '/assets/js/kk-footer-inline.js',
];

// Envío del formulario al CRM: se configura por entorno (vacío = solo simulación local).
const CRM = JSON.stringify({ url: process.env.NEXT_PUBLIC_CRM_URL || '', token: process.env.NEXT_PUBLIC_CRM_TOKEN || '' });

export default function RootHtml({ lang, children }) {
  return (
    <html lang={lang === 'en' ? 'en-US' : 'es-CO'}>
      <head>
        <link rel="icon" href="/assets/images/logo/logo-sonrisa_16x16.svg" sizes="32x32" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" />
        {CSS.map((f) => <link key={f} rel="stylesheet" href={`/assets/css/${f}`} />)}
        <script dangerouslySetInnerHTML={{ __html: `window.KK_CRM=${CRM};` }} />
      </head>
      <body>
        <Partial name="loader.html" />
        {children}
        {JS.map((src) => <script key={src} src={src} defer />)}
      </body>
    </html>
  );
}
