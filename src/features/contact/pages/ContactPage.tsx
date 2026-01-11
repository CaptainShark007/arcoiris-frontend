import { SeoHead } from '@shared/components';
import { AddressData, ContactForm } from '../components';
import { useCurrentPartner } from '../../../shared/hooks/useCurrentPartner';
import { useEffect } from 'react';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: partner } = useCurrentPartner();

  return (
    <>
      <SeoHead
        title={partner ? `Contacto - ${partner.name}` : 'Contacto'}
        description='Ponte en contacto con nosotros'
      />
      
      <ContactForm partnerEmail={partner?.email} />
      
      <AddressData partner={partner} />
    </>
  );
};

export default ContactPage;