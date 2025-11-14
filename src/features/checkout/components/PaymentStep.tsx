import { Box, Typography, Button, Radio, Stack, Card, CardActionArea } from '@mui/material';
import { RadioButtonChecked } from '@mui/icons-material';
import { useState, useEffect, MutableRefObject } from 'react';
import { useCreateOrder } from '@features/orders';
import { useCartStore } from '@/storage/useCartStore';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import toast from 'react-hot-toast';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  onEditAddress?: () => void;
  onConfirmOrderRef?: MutableRefObject<(() => void) | null>;
  isProcessingRef?: MutableRefObject<boolean>;
}

export const PaymentStep = ({ 
  onNext, 
  onBack, 
  onEditAddress,
  onConfirmOrderRef,
  isProcessingRef
}: PaymentStepProps) => {
  const [selected, setSelected] = useState<'acordar'>('acordar');

  const { mutate: createOrder, isPending } = useCreateOrder();
  const { items, totalPrice, clearCart } = useCartStore();
  const { shippingInfo, clearCheckout } = useCheckoutStore();

  const handleConfirm = () => {
    console.log('🔍 handleConfirm ejecutado');
    console.log('📦 shippingInfo:', shippingInfo);
    console.log('🛒 items:', items);
    console.log('💰 totalPrice:', totalPrice);
    
    if (!shippingInfo) {
      toast.error('Por favor, completa la información de envío antes de continuar.', {
        position: 'bottom-right',
      });
      return;
    }

    const orderData = {
      address: {
        addressLine1: shippingInfo.addressLine1,
        addressLine2: '',
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      },
      cartItems: items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: totalPrice,
    };

    createOrder(orderData, {
      onSuccess: () => {
        clearCart();
        clearCheckout();
        onNext();
      },
    });
  };

  // Exponer la función handleConfirm al componente padre a través del ref
  useEffect(() => {
    if (onConfirmOrderRef) {
      onConfirmOrderRef.current = handleConfirm;
    }
    // No agregamos dependencias para que siempre tenga la versión más reciente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingInfo, items, totalPrice, createOrder, clearCart, clearCheckout, onNext])

  // Sincronizar el estado de procesamiento
  useEffect(() => {
    if (isProcessingRef) {
      isProcessingRef.current = isPending;
    }
  }, [isPending]);

  return (
    <Box>
      {/* Sección de entrega y facturación */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 1,
          bgcolor: 'info.light',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">
            Entrega y facturación
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onEditAddress}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 2,
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                borderColor: 'primary.main',
              },
            }}
          >
            Editar
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Roque Sáenz Peña, Resistencia, Chaco 3500, Argentina
        </Typography>
      </Box>

      {/* Sección de método de pago */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Método de pago
      </Typography>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderColor: selected === 'acordar' ? 'primary.main' : 'divider',
          boxShadow: selected === 'acordar' ? 4 : 0,
          borderWidth: 2,
          transition: '0.2s',
          borderRadius: 2,
        }}
      >
        <CardActionArea onClick={() => setSelected('acordar')}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3 }}>
            <Radio
              checked={selected === 'acordar'}
              color="primary"
              icon={<RadioButtonChecked sx={{ opacity: 0.4 }} />}
              checkedIcon={<RadioButtonChecked color="primary" />}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Acordar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coordinaremos el método de pago y la entrega directamente contigo.
              </Typography>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>

      {/* Botones inferiores - solo en móvil */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={onBack} fullWidth>
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          fullWidth
          disabled={isPending}
        >
          {isPending ? 'Procesando...' : 'Confirmar orden'}
        </Button>
      </Box>
    </Box>
  );
};