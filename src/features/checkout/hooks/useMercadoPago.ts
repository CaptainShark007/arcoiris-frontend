import { createMercadoPagoPreference, MercadoPagoPreferenceResponse } from '@/actions';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useMercadoPago = () => {
  const {
    mutateAsync: createPreference,
    isPending,
    data,
    error,
  } = useMutation({
    mutationFn: createMercadoPagoPreference,
    onError: (error: Error) => {
      console.error('Error al crear preferencia MP:', error);
      toast.error('Error al procesar el pago con Mercado Pago', {
        position: 'top-right',
      });
    },
  });

  const redirectToMercadoPago = (response: MercadoPagoPreferenceResponse) => {
    if (!response.success) {
      toast.error(response.error || 'No se pudo crear la preferencia de pago', {
        position: 'top-right',
      });
      return;
    }

    // Usar initPoint (funciona tanto con cuentas de prueba como en producción)
    // sandboxInitPoint es solo para el entorno sandbox antiguo de MP
    const redirectUrl = response.initPoint || response.sandboxInitPoint;

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      toast.error('No se obtuvo la URL de pago de Mercado Pago', {
        position: 'top-right',
      });
    }
  };

  return {
    createPreference,
    redirectToMercadoPago,
    isPending,
    data,
    error,
  };
};
