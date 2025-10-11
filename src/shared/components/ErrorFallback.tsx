import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useColorScheme,
} from '@mui/material';
import { ErrorOutline, Refresh, Home, BugReport } from '@mui/icons-material';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  const { mode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    // Aquí podrías integrar con un servicio de reporte de errores
    console.error('Error reported:', error);
    // Por ahora, copiamos el error al clipboard
    if (error && navigator.clipboard) {
      navigator.clipboard.writeText(error.toString());
    }
  };

  return (
    <Container maxWidth='md'>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: 'center',
            maxWidth: 500,
            width: '100%',
            border: 1,
            borderColor: 'error.light',
            bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper',
          }}
        >
          {/* Icono de Error */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    opacity: 0.8,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            >
              <ErrorOutline
                sx={{
                  fontSize: 40,
                  color: 'error.contrastText',
                }}
              />
            </Box>
          </Box>

          {/* Título */}
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            fontWeight={600}
            color='error.main'
          >
            ¡Oops! Algo salió mal
          </Typography>

          {/* Descripción */}
          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            Se ha producido un error inesperado en la aplicación. No te
            preocupes, esto puede suceder ocasionalmente.
          </Typography>

          {/* Mensaje de error (solo en desarrollo) */}
          {error && import.meta.env.DEV && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                bgcolor: mode === 'dark' ? 'grey.800' : 'grey.50',
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography
                variant='caption'
                component='div'
                color='text.secondary'
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  wordBreak: 'break-all',
                }}
              >
                <strong>Error:</strong> {error.message}
              </Typography>
            </Paper>
          )}

          {/* Botones de Acción */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <Button
              variant='contained'
              color='primary'
              startIcon={<Refresh />}
              onClick={handleReload}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Intentar de nuevo
            </Button>

            <Button
              variant='outlined'
              color='primary'
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Ir al inicio
            </Button>

            {error && (
              <Button
                variant='text'
                color='secondary'
                startIcon={<BugReport />}
                onClick={handleReportError}
                size='small'
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Reportar error
              </Button>
            )}
          </Box>

          {/* Mensaje de ayuda */}
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{
              mt: 3,
              display: 'block',
              opacity: 0.8,
            }}
          >
            Si el problema persiste, por favor contacta al soporte técnico.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
