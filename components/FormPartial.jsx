/** Formulario de evaluación (mismo markup del tema; lo envía /assets/js/popup.js). */
import Partial from '@/components/Partial';

export default function FormPartial({ lang = 'es' }) {
  return <Partial name={`form-${lang === 'en' ? 'en' : 'es'}.html`} lang={lang} />;
}
