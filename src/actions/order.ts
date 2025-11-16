import { supabase } from "@/supabase/client";

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      total_amount,
      customer_id,
      customers(id, full_name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Error al obtener las órdenes");
  }

  return data;
};

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error al actualizar el estado de la orden");
  }

  return data;
};

export const getOrderByIdAdmin = async (id: number) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      status,
      total_amount,
      customers(id, full_name, email, phone),
      addresses(
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country
      ),
      order_items(
        id,
        quantity,
        price,
        variants(
          id,
          color_name,
          storage,
          finish,
          products(name, images)
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error al obtener la orden");
  }

  return data;
};
