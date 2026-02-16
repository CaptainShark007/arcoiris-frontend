import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    console.log("Webhook MP recibido:", JSON.stringify(body));

    if (body.type !== "payment" && body.action !== "payment.updated" && body.action !== "payment.created") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const paymentId = body.data?.id;

    if (!paymentId) {
      console.log("No se encontró payment ID en el webhook");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!paymentResponse.ok) {
      console.error("Error al consultar pago en MP:", paymentResponse.status);
      throw new Error(`Error al consultar pago: ${paymentResponse.status}`);
    }

    const paymentData = await paymentResponse.json();

    console.log("Datos del pago:", JSON.stringify({
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
      status_detail: paymentData.status_detail,
    }));

    const orderId = paymentData.external_reference;

    if (!orderId) {
      console.error("No se encontró external_reference (orderId) en el pago");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const paymentStatusMap: Record<string, string> = {
      approved: "paid",
      pending: "pending",
      authorized: "pending",
      in_process: "pending",
      in_mediation: "pending",
      rejected: "failed",
      cancelled: "failed",
      refunded: "refunded",
      charged_back: "charged_back",
    };

    const paymentStatus = paymentStatusMap[paymentData.status] || "pending";

    const orderStatusMap: Record<string, string> = {
      paid: "confirmada",
      pending: "pendiente",
      failed: "cancelada",
      refunded: "reembolsada",
      charged_back: "cancelada",
    };

    const orderStatus = orderStatusMap[paymentStatus] || "pendiente";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_id: String(paymentData.id),
        payment_status: paymentStatus,
        payment_method: paymentData.payment_method_id || null,
        status: orderStatus,
      })
      .eq("id", Number(orderId));

    if (updateError) {
      console.error("Error al actualizar orden:", updateError);
      throw new Error(`Error al actualizar orden: ${updateError.message}`);
    }

    console.log(
      `Orden #${orderId} actualizada - payment_status: ${paymentStatus}, status: ${orderStatus}`
    );

    return new Response(
      JSON.stringify({ success: true, orderId, paymentStatus }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error en mp-webhook:", error);
    return new Response(
      JSON.stringify({
        received: true,
        error: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
