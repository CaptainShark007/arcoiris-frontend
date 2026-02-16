import {
  Box,
  Typography,
  Button,
  Radio,
  Stack,
  Card,
  CardActionArea,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CreditCard, Handshake } from '@mui/icons-material';
import { useState, useEffect, MutableRefObject, useCallback } from 'react';
import { useCreateOrder } from '@features/orders';
import { useCartStore } from '@/storage/useCartStore';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { useMercadoPago } from '@/features/checkout/hooks/useMercadoPago';
import toast from 'react-hot-toast';
import { enviarEmailOrden } from '@/services/emailService';
import { useCustomer, useUsers } from '@shared/hooks';
import { useReferral } from '@shared/hooks/useReferral';

type PaymentMethod = 'acordar' | 'mercadopago';

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { session, isLoading } = useUsers();
  const userId = session?.user?.id;
  const { data: customer, isLoading: isLoadingCustomer } = useCustomer(userId);
  const { referralCode } = useReferral();

  const [selected, setSelected] = useState<PaymentMethod>('mercadopago');

  const { shippingInfo, shippingMethod, setOrderId, orderSummary } =
    useCheckoutStore();
  const { clearCart, items: cartItems } = useCartStore();
  const { createPreference, redirectToMercadoPago, isPending: isMPPending } =
    useMercadoPago();

  // Callback para éxito de la orden con método "acordar"
  const handleOrderSuccessAcordar = useCallback(
    async (response: any) => {
      setOrderId(response.orderId);
      clearCart();

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
          { position: 'bottom-right' }
        );
      }

      onNext();
    },
    [onNext, setOrderId, clearCart, shippingMethod, orderSummary, customer, shippingInfo]
  );

  // Callback para éxito de la orden con Mercado Pago
  const handleOrderSuccessMP = useCallback(
    async (response: any) => {
      setOrderId(response.orderId);

      // Crear preferencia en MP y redireccionar
      toast.loading('Redirigiendo a Mercado Pago...', {
        id: 'mp-redirect',
        position: 'top-right',
        duration: Infinity,
      });

      try {
        const mpResponse = await createPreference({
          orderId: response.orderId,
          items: cartItems.map((item) => ({
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            picture_url: item.image || undefined,
          })),
          payer: {
            name: customer?.full_name || 'Cliente',
            email: customer?.email || session?.user?.email || '',
          },
        });

        toast.dismiss('mp-redirect');

        if (mpResponse.success) {
          // Limpiar el carrito antes de redirigir
          clearCart();
          redirectToMercadoPago(mpResponse);
        } else {
          toast.error(
            mpResponse.error || 'Error al crear la preferencia de pago',
            { position: 'top-right' }
          );
        }
      } catch (err) {
        toast.dismiss('mp-redirect');
        console.error('Error al crear preferencia MP:', err);
        toast.error('Error al procesar el pago con Mercado Pago', {
          position: 'top-right',
        });
      }
    },
    [setOrderId, createPreference, cartItems, customer, session, clearCart, redirectToMercadoPago]
  );

  const handleOrderError = useCallback(async (error: Error) => {
    console.error('Error en la creación de la orden:', error);
  }, []);

  const { mutate: createOrderAcordar, isPending: isPendingAcordar } =
    useCreateOrder({
      onSuccess: handleOrderSuccessAcordar,
      onError: handleOrderError,
    });

  const { mutate: createOrderMP, isPending: isPendingMP } = useCreateOrder({
    onSuccess: handleOrderSuccessMP,
    onError: handleOrderError,
  });

  const isPending = isPendingAcordar || isPendingMP || isMPPending;

  // Función para confirmar la orden
  const handleConfirm = useCallback(async () => {
    if (isLoadingCustomer) {
      toast.error('Por favor espera mientras se cargan tus datos', {
        position: 'top-right',
      });
      return;
    }

    if (!shippingInfo) {
      toast.error(
        'Por favor, completa la información de envío antes de continuar.',
        { position: 'top-right' }
      );
      return;
    }

    if (!orderSummary?.items || orderSummary.items.length === 0) {
      toast.error('Tu carrito está vacío.', { position: 'top-right' });
      return;
    }

    toast.loading('Procesando tu orden...', {
      id: 'order-processing',
      position: 'top-right',
      duration: Infinity,
    });

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
      partnerCode: referralCode || null,
    };

    if (selected === 'mercadopago') {
      createOrderMP(orderData);
    } else {
      createOrderAcordar(orderData);
    }

    setTimeout(() => {
      toast.dismiss('order-processing');
    }, 100);
  }, [
    shippingInfo,
    orderSummary,
    createOrderAcordar,
    createOrderMP,
    selected,
    isLoadingCustomer,
    referralCode,
  ]);

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

      {/* Opción Mercado Pago */}
      <Card
        variant='outlined'
        sx={{
          mb: 2,
          borderColor: selected === 'mercadopago' ? '#009ee3' : 'divider',
          boxShadow: selected === 'mercadopago' ? 4 : 0,
          borderWidth: 2,
          transition: '0.2s',
          borderRadius: 2,
        }}
      >
        <CardActionArea onClick={() => setSelected('mercadopago')}>
          <Stack direction='row' alignItems='center' spacing={2} sx={{ p: 3 }}>
            <Radio
              checked={selected === 'mercadopago'}
              color='primary'
            />
            <CreditCard sx={{ color: '#009ee3', fontSize: 28 }} />
            <Box>
              <Typography variant='h6' fontWeight='bold'>
                Pago Online
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Pagá con tarjeta de crédito, débito, dinero en cuenta o en
                efectivo.
              </Typography>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>

      {selected === 'mercadopago' && (
        <Alert
          severity='info'
          sx={{ mb: 3, '& .MuiAlert-icon': { alignItems: 'center' } }}
        >
          <Typography variant='body2'>
            Al confirmar la orden, serás redirigido a Mercado Pago para
            completar el pago de forma segura.
          </Typography>
        </Alert>
      )}

      {/* Opción Acordar */}
      <Card
        variant='outlined'
        sx={{
          mb: 2,
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
            />
            <Handshake sx={{ color: 'primary.main', fontSize: 28 }} />
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

      {/* Información de cuenta bancaria - solo si se selecciona Acordar */}
      {selected === 'acordar' && (
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
            Datos de cuenta bancaria
          </Typography>

          <Stack spacing={1.5}>
            <Box>
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight={500}
              >
                CBU
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                00700071930004043852937
              </Typography>
            </Box>

            <Box>
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight={500}
              >
                Alias
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                Arcoiris352
              </Typography>
            </Box>

            <Box>
              <Typography
                variant='body2'
                color='text.secondary'
                fontWeight={500}
              >
                Titular
              </Typography>
              <Typography variant='body1' fontWeight='medium'>
                Yedro Maria Sanchez - 27-33548974-3
              </Typography>
            </Box>

            <Alert
              severity='info'
              sx={{
                mt: 2,
                '& .MuiAlert-icon': { alignItems: 'center' },
              }}
            >
              <Typography variant='body2' fontWeight='bold' gutterBottom>
                Nota
              </Typography>
              <Typography variant='body2'>
                Si realizas el pago vía transferencia, por favor enviá el
                comprobante junto con tu número de orden a través de WhatsApp.
              </Typography>
            </Alert>
          </Stack>
        </Box>
      )}

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
            ...(selected === 'mercadopago' && {
              bgcolor: '#009ee3',
              '&:hover': { bgcolor: '#007eb5' },
            }),
          }}
        >
          {isPending ? (
            <CircularProgress size={24} color='inherit' />
          ) : isLoading || isLoadingCustomer ? (
            'Cargando datos...'
          ) : selected === 'mercadopago' ? (
            'Pagar con Mercado Pago'
          ) : (
            'Confirmar orden'
          )}
        </Button>
      </Box>
    </Box>
  );
};
