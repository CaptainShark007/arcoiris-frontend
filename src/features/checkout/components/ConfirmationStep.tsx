import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Receipt,
  ShoppingBag,
} from '@mui/icons-material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { formatPrice } from '@/helpers';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useNavigate } from 'react-router';

interface ConfirmationStepProps {
  onReset: () => void;
}

export const ConfirmationStep = ({ onReset }: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const { orderId, shippingInfo, orderSummary, clearCheckout } = useCheckoutStore();

  const handleResetMobile = () => {
    clearCheckout();
    onReset?.();
    navigate('/', { replace: true });
  };

  return (
    <Box>
      {/* Icono de éxito */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle
          sx={{
            fontSize: 80,
            color: 'success.main',
            mb: 2,
          }}
        />
        <Typography variant='h4' gutterBottom fontWeight='bold'>
          ¡Orden confirmada!
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Gracias por tu compra{' '}
          <Typography component='span' fontWeight='bold'>
            {shippingInfo?.name}
          </Typography>
          . Te contactaremos pronto.
        </Typography>
      </Box>

      {/* Información de la orden */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: 'background.default',
          boxShadow: 'none',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Receipt color='primary' />
          <Typography variant='h6'>Orden #{orderId || 'N/A'}</Typography>
          <Chip
            label='Pendiente'
            size='small'
            color='warning'
            variant='outlined'
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Resumen de compra */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {/* Cantidad de productos */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShoppingBag color='action' />
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Cantidad de artículos
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {orderSummary?.totalItems || 0} {orderSummary?.totalItems === 1 ? 'artículo' : 'artículos'}
              </Typography>
            </Box>
          </Box>

          {/* Monto total */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Receipt color='action' />
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle2' fontWeight='medium'>
                Monto total
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight='bold'
              >
                {formatPrice(orderSummary?.totalPrice || 0)}
              </Typography>
            </Box>
          </Box>

          {/* Dirección de envío */}
          {shippingInfo && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <MyLocationIcon color='action' />
              <Box sx={{ flex: 1 }}>
                <Typography variant='subtitle2' fontWeight='medium'>
                  Dirección de envío
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {shippingInfo.addressLine1}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {shippingInfo.city}, {shippingInfo.state}{' '}
                  {shippingInfo.postalCode}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sección de contacto */}
        <Box sx={{ mb: 2 }}>
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            ¿Tienes preguntas?
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Nos pondremos en contacto contigo pronto. Si tienes dudas,
            contactanos simplemente a traves del icono de WhatsApp indicando su numero de orden.
          </Typography>
        </Box>
      </Paper>

      {/* Información adicional */}
      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          bgcolor: 'info.lighter',
          boxShadow: 'none',
          border: 1,
          borderColor: 'info.light',
          borderRadius: 1,
        }}
      >
        <Typography variant='subtitle2' fontWeight='bold' gutterBottom>
          Próximos pasos:
        </Typography>
        <Typography variant='body2' color='text.secondary' component='div'>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Revisaremos tu pedido en nuestro sistema</li>
            <li>Te contactaremos para confirmar los detalles</li>
            <li>Acordaremos el método de envío</li>
            <li>Recibirás actualizaciones del estado via WhatsApp o Email (según lo proporcionado)</li>
          </ul>
        </Typography>
      </Paper>

      {/* Botones solo visibles en móviles */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Button
          variant='contained'
          onClick={() => (window.location.href = `/orders/${orderId}`)}
          fullWidth
          disabled={!orderId}
        >
          Ver detalles de la orden
        </Button>

        <Button variant='outlined' onClick={handleResetMobile} fullWidth>
          Volver a inicio
        </Button>
      </Box>
    </Box>
  );
};