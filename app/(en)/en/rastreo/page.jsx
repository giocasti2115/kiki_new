/** Order tracking (temporary: prototype from the HTML version until the new design). */
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Tracking from '@/components/Tracking';

const ALT = { es: '/rastreo/', en: '/en/rastreo/' };

export const metadata = {
  title: 'Track your order',
  description: 'Check the status of your shipment with the tracking number you received by SMS, WhatsApp or email.',
  alternates: { languages: ALT },
};

export default function TrackingPage() {
  return (
    <>
      <SiteHeader lang="en" alt={ALT} />
      <Tracking lang="en" />
      <SiteFooter lang="en" alt={ALT} />
    </>
  );
}
