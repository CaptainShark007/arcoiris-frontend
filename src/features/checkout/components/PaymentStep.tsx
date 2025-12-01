import {
  Box,
  Typography,
  Button,
  Radio,
  Stack,
  Card,
  CardActionArea,
} from '@mui/material';
import { RadioButtonChecked } from '@mui/icons-material';
import { useState, useEffect, MutableRefObject, useCallback } from 'react';
import { useCreateOrder } from '@features/orders';
import { useCartStore } from '@/storage/useCartStore';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import toast from 'react-hot-toast';
// DESCOMENTAR CUANDO SE HABILITE ENVÍO DE EMAIL
import { enviarEmailOrden } from '@/services/emailService';
import { useCustomer, useUsers } from '@shared/hooks';

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
  isProcessingRef,
}: PaymentStepProps) => {
  // DESCOMENTAR CUANDO SE HABILITE ENVÍO DE EMAIL
  const { session, isLoading } = useUsers();
  const userId = session?.user?.id;
  const { data: customer, isLoading: isLoadingCustomer } = useCustomer(userId);

  const [selected, setSelected] = useState<'acordar'>('acordar');

  const { shippingInfo, shippingMethod, setOrderId, orderSummary } =
    useCheckoutStore();
  const { clearCart } = useCartStore();

  // Callbacks para manejar el éxito y error de la orden
  const handleOrderSuccess = useCallback(
    async (response: any) => {
      // Guardar el ID de la orden
      setOrderId(response.orderId);

      // Limpiar el carrito
      clearCart();

      // ============================================================
      // ENVÍO DE EMAIL
      // ============================================================
      try {
        await enviarEmailOrden({
          id: response.orderId,
          email: customer?.email || '',
          nombreCliente: customer?.full_name || 'Cliente',
          total: orderSummary?.totalPrice ?? 0,
          items: (orderSummary?.items ?? []).map((item) => ({
            nombre: item.name,
            cantidad: item.quantity,
            precio: item.price,
          })),
          addressLine1: shippingInfo?.addressLine1 || '',
          addressLine2: shippingInfo?.addressLine2 || '',
          city: shippingInfo?.city || '',
          state: shippingInfo?.state || '',
          postalCode: shippingInfo?.postalCode || '',
          country: shippingInfo?.country || '',
          shippingMethod: shippingMethod || 'acordar',
          customerPhone: customer?.phone || '',
        });
      } catch (emailError) {
        console.error('Error al enviar email:', emailError);
        toast.error(
          'Orden creada pero hubo un error al enviar el email de confirmación',
          {
            position: 'bottom-right',
          }
        );
      }
      // ============================================================

      // Navegar al siguiente paso
      onNext();
    },
    [onNext, setOrderId, clearCart, shippingMethod, orderSummary]
  );

  // Manejo de error en la creación de la orden
  const handleOrderError = useCallback(async (error: Error) => {
    console.error('Error en la creación de la orden:', error);
    // toast de error ya es manejado en el hook useCreateOrder
  }, []);

  // Hook para crear la orden con callbacks personalizados
  const { mutate: createOrder, isPending } = useCreateOrder({
    onSuccess: handleOrderSuccess,
    onError: handleOrderError,
  });

  // Función para confirmar la orden
  const handleConfirm = useCallback(async () => {
    // Validar que los datos del cliente se hayan cargado
    // DESCOMENTAR CUANDO SE HABILITE ENVÍO DE EMAIL
    if (isLoadingCustomer) {
      toast.error('Por favor espera mientras se cargan tus datos', {
        position: 'top-right',
      });
      return;
    }

    // Validar que la información de envío esté completa
    if (!shippingInfo) {
      toast.error(
        'Por favor, completa la información de envío antes de continuar.',
        {
          position: 'top-right',
        }
      );
      return;
    }

    // Validar que haya items en el carrito
    if (!orderSummary?.items || orderSummary.items.length === 0) {
      toast.error('Tu carrito está vacío.', {
        position: 'top-right',
      });
      return;
    }

    // ============================================================
    // OPCIÓN 1: FUNCIONAMIENTO REAL CON SP (Descomenta este bloque)
    // ============================================================

    // Mostrar toast de procesamiento
    toast.loading('Procesando tu orden...', {
      id: 'order-processing',
      position: 'top-right',
      duration: Infinity,
    });

    // Preparar datos de la orden
    const orderData = {
      address: {
        addressLine1: shippingInfo.addressLine1,
        addressLine2: shippingInfo.addressLine2 || '',
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode || '',
        country: shippingInfo.country,
      },
      cartItems: orderSummary.items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: orderSummary.totalPrice,
    };

    // Ejecutar la mutación
    createOrder(orderData);

    // Cerrar toast después de que la mutación termine
    setTimeout(() => {
      toast.dismiss('order-processing');
    }, 100);

    // ============================================================
    // OPCIÓN 2: SIMULACIÓN (Para pruebas sin ejecutar SP)
    // Comenta esta sección cuando uses OPCIÓN 1
    // ============================================================
    /*toast.loading('Procesando tu orden...', {
      id: 'order-processing',
      position: 'bottom-right',
      duration: 1500,
    });

    setTimeout(() => {
      setOrderId(Math.floor(Math.random() * 100000));
      clearCart();
      
      toast.success('¡Orden creada con éxito! (SIMULACIÓN)', {
        id: 'order-processing',
        position: 'bottom-right',
      });

      onNext();
    }, 1500);*/
  }, [
    shippingInfo,
    orderSummary,
    createOrder,
    setOrderId,
    clearCart,
    onNext,
    isLoadingCustomer,
  ]); // , isLoadingCustomer

  // Actualizar ref con la función de confirmar
  useEffect(() => {
    if (onConfirmOrderRef) {
      onConfirmOrderRef.current = handleConfirm;
    }
  }, [handleConfirm, onConfirmOrderRef]);

  // Actualizar ref con el estado de carga
  useEffect(() => {
    if (isProcessingRef) {
      isProcessingRef.current = isPending;
    }
  }, [isPending, isProcessingRef]);

  const handleEditDelivery = useCallback(() => {
    if (onGoToStep) {
      onGoToStep(1);
    } else {
      onBack();
    }
  }, [onGoToStep, onBack]);

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
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={1}
        >
          <Typography variant='h6' fontWeight='bold'>
            Entrega y facturación
          </Typography>
          <Button
            variant='outlined'
            size='small'
            onClick={handleEditDelivery}
            disabled={isPending}
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
            <Typography variant='body1' color='text.primary' fontWeight='bold'>
              Retiro en sucursal seleccionado.
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Comunícate con nosotros a través de WhatsApp para coordinar el
              retiro.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant='body1' color='text.primary' fontWeight='bold'>
              Datos de envío cargados:
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {shippingInfo?.addressLine1}, {shippingInfo?.addressLine2},{' '}
              {shippingInfo?.city}, {shippingInfo?.state},{' '}
              {shippingInfo?.country}, {shippingInfo?.postalCode}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Sección de método de pago */}
      <Typography variant='h6' fontWeight='bold' gutterBottom>
        Método de pago
      </Typography>

      <Card
        variant='outlined'
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
          <Stack direction='row' alignItems='center' spacing={2} sx={{ p: 3 }}>
            <Radio
              checked={selected === 'acordar'}
              color='primary'
              icon={<RadioButtonChecked sx={{ opacity: 0.4 }} />}
              checkedIcon={<RadioButtonChecked color='primary' />}
            />
            <Box>
              <Typography variant='h6' fontWeight='bold'>
                Acordar
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Coordinaremos el método de pago y la entrega directamente
                contigo.
              </Typography>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>

      {/* Botones inferiores - solo en móvil */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mt: 2 }}>
        <Button
          variant='outlined'
          onClick={onBack}
          fullWidth
          disabled={isPending || isLoading || isLoadingCustomer}
        >
          Volver
        </Button>
        <Button
          variant='contained'
          onClick={handleConfirm}
          fullWidth
          disabled={isPending}
          sx={{
            position: 'relative',
          }}
        >
          {isPending ? 'Procesando...' : isLoading || isLoadingCustomer ? 'Cargando datos...' : 'Confirmar orden'}
        </Button>
      </Box>
    </Box>
  );
};
