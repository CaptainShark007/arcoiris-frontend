import React from 'react';
import {
  Box,
  Typography,
  Container,
  Link,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import { useCurrentPartner } from '@shared/hooks';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    component={motion.a}
    href={href}
    color="text.secondary"
    underline="none"
    variants={itemVariants}
    whileHover={{ x: 5, color: '#4dabf5' }}
    sx={{
      display: 'block',
      mb: 1.5,
      fontSize: '0.9rem',
      transition: 'color 0.2s',
      cursor: 'pointer',
    }}
  >
    {children}
  </Link>
);

const DEFAULT_CONTACT = {
  address: "Av. Edison 352, Resistencia, Chaco",
  email: "tienda.arcoiris.team@gmail.com"
};

export const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const { data: partner } = useCurrentPartner();

  const displayAddress = partner?.address || DEFAULT_CONTACT.address;
  const displayEmail = partner?.email || DEFAULT_CONTACT.email;

  return (
    <Box
      component={motion.footer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      sx={{
        bgcolor: '#0f172a',
        color: '#f1f5f9',
        borderTop: `4px solid ${theme.palette.primary.main}`,
        pt: 8,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '2fr 1fr 1fr 2fr', 
            },
            gap: 6,
          }}
        >
          {/* COLUMNA 1: Marca y Newsletter */}
          <Box>
            <Box sx={{ mb: 3 }}>
              <img 
                src="/logo_comercio_v2.png" 
                alt="Logo Arco Iris" 
                style={{ height: 70 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              Expertos en pinturas y construcción. Llevamos la mejor calidad a tu hogar u obra.
            </Typography>

            {/* Newsletter Box */}
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                ¡Recibí ofertas exclusivas!
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField 
                  hiddenLabel 
                  size="small" 
                  placeholder="Tu email..." 
                  variant="outlined"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    borderRadius: 1,
                    input: { color: 'white', py: 1 }, 
                    '& fieldset': { border: 'none' }
                  }}
                />
                <Button variant="contained" color="primary" sx={{ minWidth: '50px', boxShadow: 'none' }}>
                  OK
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* COLUMNA 2: Categorías */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
              Productos
            </Typography>
            <FooterLink href="/tienda">Pinturas Látex</FooterLink>
            <FooterLink href="/tienda">Esmaltes</FooterLink>
            <FooterLink href="/tienda">Impermeabilizantes</FooterLink>
            <FooterLink href="/tienda">Herramientas</FooterLink>
            <FooterLink href="/tienda">Electricidad</FooterLink>
          </Box>

          {/* COLUMNA 3: Ayuda */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
              Ayuda
            </Typography>
            {/* <FooterLink href="#">Seguimiento</FooterLink> */}
            <FooterLink href="#">Devoluciones</FooterLink>
            <FooterLink href="#">Medios de Pago</FooterLink>
            <FooterLink href="#">Preguntas Frecuentes</FooterLink>
            <FooterLink href="/contacto">Contacto</FooterLink>
          </Box>

          {/* COLUMNA 4: Contacto */}
          <Box>
             <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
              Encontranos
            </Typography>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', color: '#94a3b8' }}>
                    <LocationOnIcon fontSize="small" sx={{ color: theme.palette.primary.main, mt: 0.5 }} />
                    <Typography variant="body2">
                        {displayAddress}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: '#94a3b8' }}>
                    <MailOutlineIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2">
                        {displayEmail}
                    </Typography>
                </Box>
                
                {/* Redes Sociales*/}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {[
                        { icon: <FacebookIcon />, url: 'https://www.facebook.com/share/19rHBtzMM2/' },
                        { icon: <InstagramIcon />, url: 'https://www.instagram.com/tiendaarcoiris352' },
                        { icon: <WhatsAppIcon />, url: 'https://wa.me/5493624049548' }
                    ].map((social, index) => (
                        <IconButton
                            key={index}
                            component={motion.a}
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            href={social.url}
                            target="_blank"
                            sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            {social.icon}
                        </IconButton>
                    ))}
                </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* BARRA INFERIOR */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 2 
        }}>
          <Typography variant="caption" sx={{ color: '#64748b', textAlign: 'center' }}>
            © {currentYear} Arcoiris Pinturería. Todos los derechos reservados.
          </Typography>

          {/* MENCIÓN DEL DESARROLLADOR */}
          <Box 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.03)',
                py: 0.5,
                px: 2,
                borderRadius: 50,
                border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <CodeIcon sx={{ fontSize: 16, color: '#64748b' }} />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
                Desarrollado por {' '}
                <Link 
                    href="#"
                    target="_blank"
                    sx={{ 
                        color: theme.palette.primary.light, 
                        fontWeight: 'bold', 
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    .Code
                </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};