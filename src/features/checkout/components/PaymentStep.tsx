import { Box, Typography, Button, Radio, Stack, Card, CardActionArea } from '@mui/material';
import { RadioButtonChecked } from '@mui/icons-material';
import { useState, useEffect, MutableRefObject } from 'react';
import { useCreateOrder } from '@features/orders';
import { useCartStore } from '@/storage/useCartStore';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import toast from 'react-hot-toast';
//import { enviarEmailOrden } from '@/services/emailService';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  onGoToStep?: (step: number) => void;
  onConfirmOrderRef?: MutableRefObject<(() => void) | null>;
  isProcessingRef?: MutableRefObject<boolean>;
}

export const PaymentStep = ({ 
  onNext, 
  onBack, 
  onGoToStep,
  onConfirmOrderRef,
  isProcessingRef
}: PaymentStepProps) => {
  const [selected, setSelected] = useState<'acordar'>('acordar');

  const { mutate: createOrder, isPending, } = useCreateOrder();
  const { clearCart } = useCartStore();
  // DESCOMENTAR para el funcionamiento real de la creacion orden
  //const { shippingInfo, shippingMethod, setOrderId, orderSummary } = useCheckoutStore();
  const { shippingInfo, shippingMethod, setOrderId } = useCheckoutStore(); // comentar esta linea para el funcionamiento real
  
  
  const handleConfirm = () => {
    if (!shippingInfo) {
      toast.error('Por favor, completa la información de envío antes de continuar.', {
        position: 'bottom-right',
      });
      return;
    }

    // DESCOMENTAR para el funcionamiento real de la creacion orden
    /* toast.loading('Procesando tu orden...', {
      id: 'order-processing',
      position: 'bottom-right',
      duration: 4000,
    }); */

    // DESCOMENTAR para el funcionamiento real de la creacion orden
    /* const orderData = {
      address: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        addressLine1: shippingInfo.addressLine1,
        addressLine2: '',
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      },
      cartItems: orderSummary?.items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
        price: item.price,
      })) ?? [],
      totalAmount: orderSummary?.totalPrice ?? 0,
    }; */

    // DESCOMENTAR para el funcionamiento real de la creacion orden
    /* createOrder(orderData, {
      onSuccess: async (data) => {
        setOrderId(data.id);
        clearCart();

        // SE COMENTA PARA EVITAR COSTOS INNECESARIOS EN ENVÍOS DE EMAILS DURANTE PRUEBAS
        // FUNCIONA UNICAMENTE SI SELECCIONA METODO DE ENVIO 'ACORDAR'
        // REVISAR PORQUE NO MANDA EL EMAIL CUANDO SELECCIONA 'RETIRO POR SUCURSAL'
        //await enviarEmailOrden({
        //  id: data.id,
        //  email: shippingInfo.email,
        //  nombreCliente: shippingInfo.name,
        //  total: orderSummary?.totalPrice ?? 0,
        //  items: (orderSummary?.items ?? []).map(item => ({
        //    nombre: item.name,
        //    cantidad: item.quantity,
        //    precio: item.price,
        //  })),
        //});

        toast.success('¡Orden creada con éxito!', {
          id: 'order-processing',
          position: 'bottom-right',
        });

        onNext();
      },
      onError: () => {
        toast.error('Hubo un error al crear la orden. Por favor, intenta nuevamente.', {
          id: 'order-processing',
          position: 'bottom-right',
        });
      }
    }); */

    // Simulación de creación de orden para evitar costos de email durante pruebas
    // commentar este bloque para el funcionamiento real
    clearCart();
    onNext();
  };

  const handleEditDelivery = () => {
    if (onGoToStep) {
      onGoToStep(1);
    } else {
      onBack();
    }
  };

  useEffect(() => {
    if (onConfirmOrderRef) {
      onConfirmOrderRef.current = handleConfirm;
    }
  }, [shippingInfo, createOrder, clearCart, setOrderId, onNext])

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
            onClick={handleEditDelivery}
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

        {shippingMethod === 'retiro' ? (
          <Box>
            <Typography variant='body1' color='text.primary' fontWeight="bold">
              Retiro en sucursal seleccionado.
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Comunícate con nosotros a través de WhatsApp para coordinar el retiro.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant='body1' color='text.primary' fontWeight="bold">
              Datos de envío cargados:
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {shippingInfo?.addressLine1}, {shippingInfo?.city}, {shippingInfo?.postalCode}, {shippingInfo?.country}
            </Typography>

            <Typography variant='body1' color='text.primary' fontWeight="bold" sx={{ mt: 2 }}>
              Datos de contacto cargados:
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {shippingInfo?.email}, {shippingInfo?.phone}, {shippingInfo?.name}
            </Typography>
          </Box>
        )}
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
        <Button 
          variant="outlined" 
          onClick={onBack} 
          fullWidth
          disabled={isPending}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          fullWidth
          disabled={isPending}
        >
          Confirmar orden
        </Button>
      </Box>
    </Box>
  );
};