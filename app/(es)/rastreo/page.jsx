/** Rastreo de pedidos (temporal: prototipo de la versión HTML hasta el diseño nuevo). */
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Tracking from '@/components/Tracking';

const ALT = { es: '/rastreo/', en: '/en/rastreo/' };

export const metadata = {
  title: 'Rastrea tu pedido',
  description: 'Consulta el estado de tu envío con el número de guía que recibiste por SMS, WhatsApp o correo electrónico.',
  alternates: { languages: ALT },
};

export default function RastreoPage() {
  return (
    <>
      <SiteHeader lang="es" alt={ALT} />
      <Tracking lang="es" />
      <SiteFooter lang="es" alt={ALT} />
    </>
  );
}
