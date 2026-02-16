import { supabase } from '@/supabase/client';
import { FunctionsHttpError } from '@supabase/supabase-js';

interface MercadoPagoItem {
  title: string;
  quantity: number;
  unit_price: number;
  picture_url?: string;
}

interface CreatePreferenceParams {
  orderId: number;
  items: MercadoPagoItem[];
  payer: {
    name: string;
    email: string;
  };
}

export interface MercadoPagoPreferenceResponse {
  success: boolean;
  preferenceId?: string;
  initPoint?: string;
  sandboxInitPoint?: string;
  error?: string;
}

export const createMercadoPagoPreference = async (
  params: CreatePreferenceParams
): Promise<MercadoPagoPreferenceResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      'create-mp-preference',
      {
        body: params,
      }
    );

    if (error) {
      console.error('Error al crear preferencia de MP:', error);

      // Extraer el mensaje de error real del body de la respuesta
      let errorMessage = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const errorBody = await error.context.json();
          errorMessage = errorBody?.error || errorMessage;
        } catch {
          // Si no se puede parsear el body, usar el mensaje genérico
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || 'Error desconocido al crear preferencia',
      };
    }

    return {
      success: true,
      preferenceId: data.preferenceId,
      initPoint: data.initPoint,
      sandboxInitPoint: data.sandboxInitPoint,
    };
  } catch (error) {
    console.error('Error en createMercadoPagoPreference:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

// Obtener el estado de pago de una orden
export const getOrderPaymentStatus = async (orderId: number) => {
  const { data, error } = await supabase
    .from('orders')
    .select('payment_status, payment_id, mp_preference_id' as string)
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error('Error al obtener estado del pago');
  }

  return data as unknown as {
    payment_status: string;
    payment_id: string | null;
    mp_preference_id: string | null;
  } | null;
};
