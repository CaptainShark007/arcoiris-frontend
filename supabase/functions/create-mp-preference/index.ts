import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  picture_url?: string;
}

interface CreatePreferenceBody {
  orderId: number;
  items: PreferenceItem[];
  payer: {
    name: string;
    email: string;
  };
}

Deno.serve(async (req) => {
  const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN") || "";
  const MP_WEBHOOK_URL = Deno.env.get("MP_WEBHOOK_URL") || "";
  const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  console.log("ENV check:", {
    FRONTEND_URL,
    MP_ACCESS_TOKEN_set: !!MP_ACCESS_TOKEN,
    SUPABASE_URL_set: !!SUPABASE_URL,
    SUPABASE_ANON_KEY_set: !!SUPABASE_ANON_KEY,
    SERVICE_ROLE_KEY_set: !!SUPABASE_SERVICE_ROLE_KEY,
  });

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verificar autenticación del usuario (obligatorio)
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authHeader) {
      throw new Error("Falta el header de autorización");
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error("Error de autenticación:", userError?.message);
      throw new Error("Usuario no autenticado");
    }

    const userId = user.id;
    console.log("Usuario autenticado:", userId);

    const body: CreatePreferenceBody = await req.json();
    const { orderId, items, payer } = body;

    console.log("Request body:", { orderId, itemsCount: items?.length, payer });

    if (!orderId || !items || items.length === 0) {
      throw new Error("Datos incompletos: orderId e items son requeridos");
    }

    if (!payer?.email) {
      throw new Error("El email del pagador es requerido");
    }

    if (!MP_ACCESS_TOKEN) {
      throw new Error("MP_ACCESS_TOKEN no está configurado");
    }

    const isLocalhost =
      FRONTEND_URL.includes("localhost") || FRONTEND_URL.includes("127.0.0.1");

    const preferenceData: Record<string, unknown> = {
      items: items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id || "ARS",
        ...(item.picture_url ? { picture_url: item.picture_url } : {}),
      })),
      payer: {
        name: payer.name,
        email: payer.email,
      },
      back_urls: {
        success: `${FRONTEND_URL}/pago/resultado?status=approved&order_id=${orderId}`,
        failure: `${FRONTEND_URL}/pago/resultado?status=rejected&order_id=${orderId}`,
        pending: `${FRONTEND_URL}/pago/resultado?status=pending&order_id=${orderId}`,
      },
      ...(isLocalhost ? {} : { auto_return: "approved" }),
      external_reference: String(orderId),
      ...(MP_WEBHOOK_URL && MP_WEBHOOK_URL !== "***"
        ? { notification_url: MP_WEBHOOK_URL }
        : {}),
      statement_descriptor: "ARCOIRIS SHOP",
      metadata: {
        order_id: orderId,
        user_id: userId,
      },
    };

    console.log("Creando preferencia en Mercado Pago...");

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(preferenceData),
      }
    );

    if (!mpResponse.ok) {
      const errorData = await mpResponse.text();
      console.error("Error de Mercado Pago:", mpResponse.status, errorData);
      throw new Error(
        `Error de Mercado Pago (${mpResponse.status}): ${errorData}`
      );
    }

    const preference = await mpResponse.json();
    console.log("Preferencia creada:", preference.id);

    // Actualizar la orden con el ID de preferencia usando service role
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        mp_preference_id: preference.id,
        payment_status: "pending",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error al actualizar orden:", updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en create-mp-preference:", errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
