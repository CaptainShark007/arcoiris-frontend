import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Fade,
  LinearProgress,
} from '@mui/material';
import { useColorScheme } from '@mui/material';

interface LazyFallbackProps {
  message?: string;
  description?: string;
  showProgress?: boolean;
  variant?: 'circular' | 'linear' | 'dots';
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export default function LazyFallback({
  message = 'Cargando...',
  description = 'Por favor espera mientras cargamos el contenido.',
  showProgress = true,
  variant = 'circular',
  size = 'medium',
  fullScreen = false,
}: LazyFallbackProps) {
  const { mode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          circularSize: 32,
          titleSize: { xs: '1.25rem', sm: '1.5rem' },
          descSize: { xs: '0.875rem', sm: '1rem' },
          spacing: 2,
        };
      case 'large':
        return {
          circularSize: 56,
          titleSize: { xs: '1.75rem', sm: '2rem' },
          descSize: { xs: '1rem', sm: '1.125rem' },
          spacing: 4,
        };
      default: // medium
        return {
          circularSize: 40,
          titleSize: { xs: '1.5rem', sm: '1.75rem' },
          descSize: { xs: '0.875rem', sm: '1rem' },
          spacing: 3,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const renderProgressIndicator = () => {
    switch (variant) {
      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 300, mb: sizeConfig.spacing }}>
            <LinearProgress
              sx={{
                borderRadius: 1,
                height: 6,
                backgroundColor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        );

      case 'dots':
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: sizeConfig.spacing,
              '& .dot': {
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                animation: 'bounce 1.4s ease-in-out infinite both',
              },
              '& .dot:nth-of-type(1)': { animationDelay: '-0.32s' },
              '& .dot:nth-of-type(2)': { animationDelay: '-0.16s' },
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                  opacity: 0.5,
                },
                '40%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          >
            <Box className='dot' />
            <Box className='dot' />
            <Box className='dot' />
          </Box>
        );

      default:
        return (
          <CircularProgress
            size={sizeConfig.circularSize}
            thickness={4}
            sx={{
              mb: sizeConfig.spacing,
              color: 'primary.main',
            }}
          />
        );
    }
  };

  const containerProps = fullScreen
    ? {
        sx: {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'background.default',
          zIndex: 9999,
        },
      }
    : {};

  return (
    <Container maxWidth='sm' {...containerProps}>
      <Fade in timeout={300}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: fullScreen ? '100vh' : '200px',
            textAlign: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: { xs: 120, sm: 160 },
              height: { xs: 120, sm: 160 },
              borderRadius: '50%',
              background: (theme) => `linear-gradient(135deg, 
                ${theme.palette.primary.light}10 0%, 
                ${theme.palette.secondary.light}10 100%)`,
              zIndex: -1,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
                '50%': { transform: 'scale(1.1)', opacity: 0.1 },
              },
            }}
          />

          {showProgress && renderProgressIndicator()}

          <Typography
            variant='h5'
            component='h1'
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
              fontSize: sizeConfig.titleSize,
            }}
          >
            {message}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              maxWidth: 400,
              lineHeight: 1.5,
              fontSize: sizeConfig.descSize,
              opacity: 0.8,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Fade>
    </Container>
  );
}
