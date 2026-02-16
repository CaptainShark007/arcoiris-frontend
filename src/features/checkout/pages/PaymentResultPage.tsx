import { useEffect, useState, type ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  ErrorOutline,
} from '@mui/icons-material';
import { getOrderPaymentStatus } from '@/actions';

type PaymentStatus = 'approved' | 'rejected' | 'pending' | 'unknown';

const statusConfig: Record<
  PaymentStatus,
  {
    icon: ReactNode;
    title: string;
    description: string;
    color: string;
  }
> = {
  approved: {
    icon: <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />,
    title: '¡Pago aprobado!',
    description:
      'Tu pago fue procesado exitosamente. Recibirás una confirmación por email.',
    color: 'success.main',
  },
  rejected: {
    icon: <Cancel sx={{ fontSize: 80, color: 'error.main' }} />,
    title: 'Pago rechazado',
    description:
      'No se pudo procesar tu pago. Por favor, intentá con otro medio de pago.',
    color: 'error.main',
  },
  pending: {
    icon: <HourglassEmpty sx={{ fontSize: 80, color: 'warning.main' }} />,
    title: 'Pago pendiente',
    description:
      'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
    color: 'warning.main',
  },
  unknown: {
    icon: <ErrorOutline sx={{ fontSize: 80, color: 'text.secondary' }} />,
    title: 'Estado desconocido',
    description:
      'No pudimos determinar el estado de tu pago. Revisá tu email o contactanos.',
    color: 'text.secondary',
  },
};

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unknown');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const status = searchParams.get('status') as PaymentStatus;
    const orderIdParam = searchParams.get('order_id');

    setOrderId(orderIdParam);

    if (status && ['approved', 'rejected', 'pending'].includes(status)) {
      setPaymentStatus(status);
    }

    // Si tenemos orderId, verificar el estado real en la DB
    if (orderIdParam) {
      getOrderPaymentStatus(Number(orderIdParam))
        .then((data) => {
          if (data?.payment_status) {
            const dbStatusMap: Record<string, PaymentStatus> = {
              paid: 'approved',
              pending: 'pending',
              failed: 'rejected',
            };
            const mappedStatus = dbStatusMap[data.payment_status];
            if (mappedStatus) {
              setPaymentStatus(mappedStatus);
            }
          }
        })
        .catch((err) => {
          console.error('Error al verificar estado de pago:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <Container maxWidth='sm'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <CircularProgress size={48} />
          <Typography variant='body1' color='text.secondary'>
            Verificando el estado de tu pago...
          </Typography>
        </Box>
      </Container>
    );
  }

  const config = statusConfig[paymentStatus];

  return (
    <Container maxWidth='sm'>
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3 }}>{config.icon}</Box>

          <Typography
            variant='h4'
            fontWeight='bold'
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
          >
            {config.title}
          </Typography>

          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}
          >
            {config.description}
          </Typography>

          {orderId && (
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ mb: 4 }}
            >
              Orden #{orderId}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mt: 4,
            }}
          >
            {paymentStatus === 'approved' && orderId && (
              <Button
                variant='contained'
                onClick={() => navigate(`/cuenta/pedidos/${orderId}`)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Ver mi pedido
              </Button>
            )}

            {paymentStatus === 'rejected' && (
              <Button
                variant='contained'
                onClick={() => navigate('/verificar')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Reintentar pago
              </Button>
            )}

            <Button
              variant='outlined'
              onClick={() => navigate('/tienda')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Seguir comprando
            </Button>

            <Button
              variant='outlined'
              onClick={() => navigate('/cuenta/pedidos')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Mis pedidos
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PaymentResultPage;
