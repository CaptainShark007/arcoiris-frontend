import { supabase } from "@/supabase/client";

interface IUpdateCustomer {
  customerId: string;
  fullName: string;
  phone: string | null;
}

export const updateCustomer = async ({ customerId, fullName, phone }: IUpdateCustomer) => {

  try {

    const { data, error } = await supabase
      .from("customers")
      .update({ full_name: fullName, phone })
      .eq("id", customerId)
      .select()
      .single();

    if (error) {
      console.error(error);
      throw new Error(error.message || "Error al actualizar el usuario");
    }

    return data;
    
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar el usuario";
    throw new Error(message);
  }

}