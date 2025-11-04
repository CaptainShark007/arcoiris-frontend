import { memo } from 'react';
import { Box, Button, Divider, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../../storage/useCartStore';
import { formatPrice } from '@/helpers';

export const CartSummary = memo(() => {
  const navigate = useNavigate();
  const { totalQuantity, totalPrice, clearCart } = useCartStore(
    useShallow((state) => ({
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice,
      clearCart: state.clearCart,
    }))
  );

  const handleContinueShopping = () => {
    navigate('/tienda');
  };

  const handleCheckout = () => {
    // aca agregar la lógica de finalizar compra 
    console.log('Proceder al checkout');
    // navigate('/checkout');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
      <Typography variant='h5' gutterBottom>
        Resumen del pedido
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='body1'>
          Productos ({totalQuantity})
        </Typography>
        <Typography variant='body1'>
          {formatPrice(totalPrice)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='body1'>
          Envío
        </Typography>
        <Typography variant='body1' color='success.main'>
          Gratis
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' fontWeight='bold'>
          Total
        </Typography>
        <Typography variant='h6' fontWeight='bold' color='primary'>
          {formatPrice(totalPrice)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant='contained'
          size='large'
          fullWidth
          onClick={handleCheckout}
          disabled={totalQuantity === 0}
        >
          Finalizar Compra
        </Button>
        
        <Button
          variant='outlined'
          size='large'
          fullWidth
          onClick={handleContinueShopping}
        >
          Seguir Comprando
        </Button>

        {totalQuantity > 0 && (
          <Button
            variant='text'
            size='medium'
            fullWidth
            onClick={clearCart}
            color='error'
          >
            Vaciar Carrito
          </Button>
        )}
      </Box>
    </Paper>
  );
});

CartSummary.displayName = 'CartSummary';
