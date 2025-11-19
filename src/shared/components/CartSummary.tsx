import { memo } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../../storage/useCartStore';
import { formatPrice } from '@/helpers';
import { ChevronRight, ChevronLeft } from '@mui/icons-material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { useUsers } from '@shared/hooks';

interface CartSummaryProps {
  activeStep?: number;
  onNext?: () => void;
  onBack?: () => void;
  onReset?: () => void;
  onConfirmOrder?: () => void;
  isProcessing?: boolean;
}

export const CartSummary = memo(({ 
  activeStep = 0, 
  onNext, 
  onBack, 
  onReset,
  onConfirmOrder,
  isProcessing = false
}: CartSummaryProps) => {

  const navigate = useNavigate();
  const { session, isLoading } = useUsers();

  const { totalQuantity, clearCart } = useCartStore(
    useShallow((state) => ({
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice,
      clearCart: state.clearCart,
    }))
  );
  const { clearCheckout, orderSummary } = useCheckoutStore();

  const handleContinueShopping = () => {
    navigate('/tienda');
  };

  const handleClearReviewOrderDesktop = () => {
    clearCart();
    clearCheckout();
  };

  const handleResetDesktop = () => {
    clearCart();
    clearCheckout();
    onReset?.();
    navigate('/', { replace: true });
  };

  // Maneja el click en "Finalizar compra" con validación de login
  const handleFinalizarCompra = () => {
    if (!session) {
      // Usuario no está logueado, redirigir a login
      // Guardar la ruta de redirección después del login
      sessionStorage.setItem('redirectAfterLogin', '/verificar');
      navigate('/acceder');
    } else {
      // Usuario está logueado, proceder al siguiente paso
      onNext?.();
    }
  }

  // Renderiza los botones según el paso activo
  const renderButtons = () => {
    switch (activeStep) {
      case 0: // Revisar orden
        return (
          <>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={handleFinalizarCompra}
              disabled={totalQuantity === 0 || isLoading}
              endIcon={<ChevronRight />}
            >
              Finalizar compra
            </Button>

            <Divider>
              <Typography variant='caption' color='text.secondary'>
                o
              </Typography>
            </Divider>

            <Button
              variant='outlined'
              size='large'
              fullWidth
              onClick={handleContinueShopping}
              startIcon={<ChevronLeft />}
            >
              Seguir comprando
            </Button>
          </>
        );

      case 1: // Entrega
        return (
          <>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={onNext}
              endIcon={<ChevronRight />}
            >
              Confirmar
            </Button>

            <Divider>
              <Typography variant='caption' color='text.secondary'>
                o
              </Typography>
            </Divider>

            <Button
              variant='outlined'
              size='large'
              fullWidth
              onClick={onBack}
              startIcon={<ChevronLeft />}
            >
              Volver al carrito
            </Button>
          </>
        );

      case 2: // Pago - AQUÍ ESTÁ EL CAMBIO PRINCIPAL
        return (
          <>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={onConfirmOrder} // Ahora llama a la función de confirmar orden
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : 'Confirmar orden'}
            </Button>

            <Divider>
              <Typography variant='caption' color='text.secondary'>
                o
              </Typography>
            </Divider>

            <Button
              variant='outlined'
              size='large'
              fullWidth
              onClick={onBack}
              startIcon={<ChevronLeft />}
              disabled={isProcessing}
            >
              Volver a las entregas
            </Button>
          </>
        );

      case 3: // Confirmación
        return (
          <>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={() => window.location.href = '/orders/12345'}
            >
              Ver detalles de la orden
            </Button>

            <Divider>
              <Typography variant='caption' color='text.secondary'>
                o
              </Typography>
            </Divider>

            <Button
              variant='outlined'
              size='large'
              fullWidth
              onClick={handleResetDesktop}
            >
              Volver a inicio
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        position: 'sticky',
        top: 20,
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Typography variant='h5' gutterBottom>
        Resumen de la orden
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body1'>Productos ({orderSummary?.totalItems ?? 0})</Typography>
        <Typography variant='body1'>{formatPrice(orderSummary?.totalPrice ?? 0)}</Typography>
      </Box>

      {/* acordeon con la lista de productos del carrito */}

      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='body1'>Metodo de envío</Typography>
        <Typography variant='body1' color='success.main'>
          {shippingMethod === 'retiro' ? 'Retiro en sucursal' : 'Envío a domicilio'}
        </Typography>
      </Box> */}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' fontWeight='bold'>
          Total
        </Typography>
        <Typography variant='h6' fontWeight='bold' color='primary'>
          {formatPrice(orderSummary?.totalPrice ?? 0)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {renderButtons()}

        {totalQuantity > 0 && activeStep === 0 && (
          <Button
            variant='text'
            size='medium'
            fullWidth
            onClick={handleClearReviewOrderDesktop}
            color='error'
            sx={{ mt: 1 }}
          >
            Vaciar Carrito
          </Button>
        )}
      </Box>
    </Paper>
  );
});

CartSummary.displayName = 'CartSummary';