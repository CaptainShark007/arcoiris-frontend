import { SeoHead } from '@shared/components';
import { AddressData, ContactForm } from '../components';
import { useEffect } from 'react';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SeoHead
        title='Contacto'
        description='Ponte en contacto con Arcoiris - Estamos aquí para ayudarte con tus consultas y pedidos'
      />
      <ContactForm />
      <AddressData />
    </>
  );
};

export default ContactPage;
