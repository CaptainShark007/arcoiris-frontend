import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { CheckCircle, Receipt, LocalShipping, Email } from '@mui/icons-material';

import { useCartStore } from '@/storage/useCartStore';
import { useCheckoutStore } from '@/storage/useCheckoutStore';

interface ConfirmationStepProps {
  onReset: () => void;
}

export const ConfirmationStep = ({ onReset }: ConfirmationStepProps) => {
  const estimatedDelivery = '3-5 días hábiles';

  const { clearCart } = useCartStore();
  const { orderId, clearCheckout } = useCheckoutStore();

  const handleReset = () => {
    clearCart();
    clearCheckout();
    onReset(); // vuelve al step inicial
  };

  return (
    <Box>
      {/* Icono de éxito */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle 
          sx={{ 
            fontSize: 80, 
            color: 'success.main',
            mb: 2 
          }} 
        />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          ¡Orden confirmada!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gracias por tu compra
        </Typography>
      </Box>

      {/* Información de la orden */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Receipt color="primary" />
          <Typography variant="h6">
            Orden #{orderId || 'N/A'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Email color="action" />
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                Email de confirmación enviado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recibirás un correo con los detalles de tu compra
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <LocalShipping color="action" />
            <Box>
              <Typography variant="subtitle2" fontWeight="medium">
                Tiempo estimado de entrega
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {estimatedDelivery}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Próximos pasos */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          ¿Qué sigue?
        </Typography>
        <Box component="ol" sx={{ pl: 2, m: 0 }}>
          <li>
            <Typography variant="body2" paragraph>
              Prepararemos tu pedido
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              Te notificaremos cuando sea enviado
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Podrás rastrear tu envío con el número de seguimiento
            </Typography>
          </li>
        </Box>
      </Paper>

      {/* Botones solo visibles en móviles */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = `/orders/${orderId}`}
          fullWidth
          disabled={!orderId}
        >
          Ver detalles de la orden
        </Button>

        <Button 
          variant="outlined" 
          onClick={handleReset}
          fullWidth
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
};