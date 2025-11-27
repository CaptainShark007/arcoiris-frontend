import { Box, Typography, TextField, Button, Container, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import logo from "../../assets/images/logo_comercio_v2.png";
import { FormEvent } from "react";

export const Footer = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Suscribirse");
  };

  return (
    <Box component="footer">
      {/* Main Footer */}
      <Box
        sx={{
          bgcolor: "#f8f9fa",
          py: 8,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 6,
            }}
          >
            {/* Categorías */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "#1a1a1a",
                  fontSize: "1rem",
                }}
              >
                Categorías
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Pinturas Látex Interior / Exterior
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Esmaltes Sintéticos
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Barnices y Selladores
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Herramientas Manuales
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Electricidad y Plomería
                </Link>
              </Box>
            </Box>

            {/* Información */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "#1a1a1a",
                  fontSize: "1rem",
                }}
              >
                Información
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Envíos y Entregas
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Cambios y Devoluciones
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Medios de Pago
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Preguntas Frecuentes
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Guía de Colores
                </Link>
              </Box>
            </Box>

            {/* Sobre Nosotros */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "#1a1a1a",
                  fontSize: "1rem",
                }}
              >
                Sobre Nosotros
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Quiénes Somos
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Sucursales
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Contacto
                </Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ fontSize: "0.9rem", "&:hover": { color: "primary.main" } }}>
                  Trabajá con Nosotros
                </Link>
              </Box>
            </Box>

            {/* Suscribirse */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "#1a1a1a",
                  fontSize: "1rem",
                }}
              >
                Suscribite
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    type="email"
                    placeholder="Tu correo electrónico"
                    required
                    size="small"
                    sx={{
                      flex: 1,
                      bgcolor: "white",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      minWidth: 48,
                      bgcolor: "#0066ff",
                      "&:hover": {
                        bgcolor: "#0052cc",
                      },
                    }}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: "0.875rem" }}>
                Recibí nuestras ofertas, novedades y consejos para tus proyectos de pintura y ferretería.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom Bar */}
      <Box
        sx={{
          bgcolor: "white",
          py: 3,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={logo} alt="Logo Arco Iris" style={{ height: 50 }} />
            </Box>

            {/* Copyright */}
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} ArcoIris Pinturería y Ferretería — Todos los derechos reservados.
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component="a"
                href="https://www.facebook.com/share/19rHBtzMM2/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "text.primary",
                  "&:hover": { color: "primary.main", bgcolor: "rgba(0, 102, 255, 0.08)" },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/tiendaarcoiris352?utm_source=qr&igsh=MWUxNzBrdXBleGpkdg=="
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "text.primary",
                  "&:hover": { color: "primary.main", bgcolor: "rgba(0, 102, 255, 0.08)" },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://wa.me/5493624049548"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "text.primary",
                  "&:hover": { color: "primary.main", bgcolor: "rgba(0, 102, 255, 0.08)" },
                }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="mailto:tienda.arcoiris.team@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "text.primary",
                  "&:hover": { color: "primary.main", bgcolor: "rgba(0, 102, 255, 0.08)" },
                }}
              >
                <MailOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
