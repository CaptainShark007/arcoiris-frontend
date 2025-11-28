import { DatosOrden } from '@shared/types';
import { supabase } from '../supabase/client'

const ADMIN_EMAIL = 'tienda.arcoiris.team@gmail.com';

export async function enviarEmailOrden(datosOrden: DatosOrden) {
  try {
    // Enviar email al admin con todos los detalles
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: {
        ...datosOrden,
        to: ADMIN_EMAIL, // Asegurar que se envíe al admin
        isAdminNotification: true, // Indicador para el backend
      },
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email de orden enviado al admin:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}