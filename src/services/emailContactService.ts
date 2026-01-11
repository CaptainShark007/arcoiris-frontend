import { supabase } from "@/supabase/client";
import { ContactFormValues } from "@features/contact/schemas/contact.schema";

type ContactoPayload = ContactFormValues & {
  destinationEmail?: string | null;
};

export async function enviarEmailContacto(datos: ContactoPayload) {
  try {
    const { data, error } = await supabase.functions.invoke(
      'send-contact-email',
      {
        body: datos,
      }
    );

    if (error) {
      console.error('Error al invocar la función de contacto:', error);
      return { success: false, error: error.message };
    }

    if (data && !data.success) {
      return { success: false, error: data.error || 'Error desconocido del servidor' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error en servicio de contacto:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}