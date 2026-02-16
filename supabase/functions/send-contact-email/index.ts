import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "tienda.arcoiris.team@gmail.com";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405
    });
  }
  try {
    const datosContacto = await req.json();
    if (!datosContacto.name || !datosContacto.email || !datosContacto.message) {
      throw new Error("Datos de contacto incompletos");
    }
    const destinatario = datosContacto.destinationEmail ? datosContacto.destinationEmail : ADMIN_EMAIL;
    const emailHtml = generarEmailContactoHTML(datosContacto);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "notificaciones@tiendaarcoiris.net",
        to: [
          destinatario
        ],
        reply_to: datosContacto.email,
        subject: `Nueva consulta web: ${datosContacto.subject || 'Sin asunto'}`,
        html: emailHtml
      })
    });
    if (!response.ok) {
      throw new Error(`Resend error: ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
// ============================================================
// GENERADOR HTML PARA CONTACTO
// ============================================================
function generarEmailContactoHTML(datos) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { border-bottom: 2px solid #007bff; padding-bottom: 15px; margin-bottom: 20px; }
          .header h2 { margin: 0; color: #007bff; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; display: block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { font-size: 16px; color: #000; }
          .message-box { background: #f0f7ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; margin-top: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nuevo Mensaje de Contacto</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Recibido desde formulario web</p>
          </div>
          
          <div class="field">
            <span class="label">Nombre del Cliente</span>
            <div class="value">${datos.name}</div>
          </div>

          <div class="field">
            <span class="label">Email</span>
            <div class="value"><a href="mailto:${datos.email}" style="color: #007bff; text-decoration: none;">${datos.email}</a></div>
          </div>

          <div class="field">
            <span class="label">Teléfono</span>
            <div class="value">${datos.phone || 'No especificado'}</div>
          </div>

          <div class="field">
            <span class="label">Asunto</span>
            <div class="value">${datos.subject}</div>
          </div>

          <div class="message-box">
            <span class="label" style="margin-bottom: 5px;">Mensaje:</span>
            <div style="white-space: pre-wrap;">${datos.message}</div>
          </div>

          <div class="footer">
            <p>Sistema de Notificaciones - Tienda Arcoíris</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
