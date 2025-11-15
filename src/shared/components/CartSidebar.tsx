import { memo } from 'react';
import { Box, Button, Drawer, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../../storage/useCartStore';
import { CartItem } from './CartItem';
import { formatPrice } from '@/helpers';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = memo(({ isOpen, onClose }: CartSidebarProps) => {
  const navigate = useNavigate();
  const { items, totalQuantity, totalPrice } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice,
    }))
  );

  const handleGoToCart = () => {
    navigate('/verificar'); // verificar | carrito
    onClose();
  };

  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant='h6'>
            Carrito ({totalQuantity})
          </Typography>
          <IconButton onClick={onClose} aria-label='Cerrar carrito'>
            <Close />
          </IconButton>
        </Box>

        {/* Items */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                Tu carrito está vacío
              </Typography>
            </Box>
          ) : (
            items.map((item) => <CartItem key={item.id} item={item} />)
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='h6'>Total:</Typography>
              <Typography 
                variant='h6' 
                fontWeight='bold'
                sx={{ color: '#FFFFFF' }}
              >
                {formatPrice(totalPrice)}
              </Typography>
            </Box>
            <Button
              variant='contained'
              fullWidth
              size='large'
              onClick={handleGoToCart}
              sx={{
                backgroundColor: '#FF6F61',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#FF3B2E',
                },
              }}
            >
              Ver Carrito Completo
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
});

CartSidebar.displayName = 'CartSidebar';
