import { SeoHead } from '@shared/components';
import { AddressData, ContactForm } from '../components';
import { useCurrentPartner } from '../../../shared/hooks/useCurrentPartner';
import { useEffect } from 'react';
import { Box, Container } from '@mui/material';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: partner } = useCurrentPartner();

  //grey.50

  return (
    <>
      <SeoHead
        title={'Contacto'}
        description='Ponte en contacto con nosotros'
      />

      <Box sx={{ bgcolor: 'grey.50', py: { xs: 4, md: 8 }, minHeight: '100vh' }}>
        <Container maxWidth='xl'>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'start',
              //bgcolor: 'green'
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <ContactForm partnerEmail={partner?.email} />
            </Box>

            <Box
              sx={{
                position: { lg: 'sticky' },
                top: { lg: 24 },
              }}
            >
              <AddressData partner={partner} />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ContactPage;
