import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Error404Props {
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  homeRoute?: string;
}

export const Error404 = ({
  title = '404 - Página no encontrada',
  subtitle = 'La página que buscas no existe o ha sido movida.',
  showHomeButton = true,
  showBackButton = true,
  homeRoute = '/',
}: Error404Props) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(homeRoute);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth='md'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
            fontWeight: 900,
            color: 'primary.main',
            lineHeight: 1,
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          404
        </Typography>

        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          sx={{
            maxWidth: 600,
            mb: 4,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>

        <Box
          sx={{
            width: { xs: 200, sm: 250, md: 300 },
            height: { xs: 150, sm: 180, md: 200 },
            mb: 4,
            background: (theme) => `linear-gradient(135deg, 
              ${theme.palette.primary.light}20 0%, 
              ${theme.palette.secondary.light}20 100%)`,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              background: (theme) => `${theme.palette.primary.main}15`,
              animation: 'float 3s ease-in-out infinite',
            },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: '3rem',
              opacity: 0.3,
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            ?
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {showBackButton && (
            <Button
              variant='outlined'
              size='large'
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Volver atrás
            </Button>
          )}

          {showHomeButton && (
            <Button
              variant='contained'
              size='large'
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                minWidth: { xs: '100%', sm: 'auto' },
              }}
            >
              Ir al inicio
            </Button>
          )}
        </Box>

        <Typography
          variant='caption'
          color='text.secondary'
          sx={{
            mt: 4,
            opacity: 0.7,
            fontSize: '0.875rem',
          }}
        >
          Si crees que esto es un error, por favor contacta al administrador.
        </Typography>
      </Box>
    </Container>
  );
};
