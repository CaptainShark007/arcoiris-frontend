import { memo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../../storage/useCartStore';
import { formatPrice } from '@/helpers';
import { ChevronRight, ChevronLeft, ExpandMore } from '@mui/icons-material';
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
  isProcessing = false,
}: CartSummaryProps) => {
  const navigate = useNavigate();
  const { session, isLoading } = useUsers();
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('panel-items');

  const { totalQuantity, items, clearCart } = useCartStore(
    useShallow((state) => ({
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice,
      items: state.items,
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

  const handleViewOrdersHistory = () => {
    navigate('/cuenta/pedidos');
  };

  const handleFinalizarCompra = () => {
    if (!session) {
      sessionStorage.setItem('redirectAfterLogin', '/verificar');
      navigate('/acceder');
    } else {
      onNext?.();
    }
  };

  const renderButtons = () => {
    switch (activeStep) {
      case 0:
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

      case 1:
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

      case 2:
        return (
          <>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={onConfirmOrder}
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

      case 3:
        return (
          <>
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={handleViewOrdersHistory}
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

      {/* ACORDEÓN CON LISTA DE PRODUCTOS */}
      <Accordion
        expanded={expandedAccordion === 'panel-items'}
        onChange={() =>
          setExpandedAccordion(
            expandedAccordion === 'panel-items' ? false : 'panel-items'
          )
        }
        sx={{
          boxShadow: 'none',
          border: 1,
          borderRadius: 1,
          borderColor: 'divider',
          mb: 2,
          //bgcolor: 'red'
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            bgcolor: 'action.hover',
            '&:hover': {
              bgcolor: 'action.selected',
            },
            borderColor: 'divider',
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              Productos ({orderSummary?.totalItems ?? 0})
            </Typography>
            <Typography variant='body1' sx={{ fontWeight: 600 }}>
              {formatPrice(orderSummary?.totalPrice ?? 0)}
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          {/* Tabla con scroll fijo */}
          <TableContainer
            sx={{
              maxHeight: 340,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <Table stickyHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ width: 70, pr: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <Box
                        component='img'
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 56,
                          height: 56,
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      {/* <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {item.variant?.color}/{item.variant?.storage}/{item.variant?.finish}<br />
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Cantidad: {item.quantity}
                      </Typography> */}
                      <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 0.5 }}>
                        {item.variant?.color} - {item.variant?.storage} - {item.variant?.finish}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
                        Cantidad: {item.quantity}
                      </Typography>
                    </TableCell>

                    <TableCell align='right' sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

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