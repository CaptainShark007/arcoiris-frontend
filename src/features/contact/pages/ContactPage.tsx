import { SeoHead } from "@shared/components";
import { AddressData, ContactForm } from "../components";

const ContactPage = () => {
  return (
    <>
      <SeoHead 
        title="Contacto"
        description="Ponte en contacto con Arcoiris - Estamos aquí para ayudarte con tus consultas y pedidos"
      />
      <ContactForm />
      <AddressData />
    </>
  );
}

export default ContactPage;