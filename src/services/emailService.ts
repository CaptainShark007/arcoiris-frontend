import { supabase } from '../supabase/client'

interface DatosOrden {
  id: string | number;
  email: string;
  nombreCliente: string;
  total: number;
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
}

export async function enviarEmailOrden(datosOrden: DatosOrden) {
  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: datosOrden,
    });

    if (error) {
      console.error('Error al enviar email:', error);
      return { success: false, error: error.message };
    }

    console.log('Email enviado:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}