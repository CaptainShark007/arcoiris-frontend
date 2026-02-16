import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
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
    const datosOrden = await req.json();
    // Validar datos requeridos
    if (!datosOrden.id || !datosOrden.to) {
      throw new Error("Datos de orden incompletos");
    }
    // Generar HTML solo para notificación al admin
    const emailHtml = generarEmailAdminHTML(datosOrden);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "notificaciones@tiendaarcoiris.net",
        to: datosOrden.to,
        subject: `🔔 Nueva orden #${datosOrden.id} - ${datosOrden.nombreCliente}`,
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
// EMAIL PARA EL ADMIN
// ============================================================
function generarEmailAdminHTML(datosOrden) {
  const itemsHTML = datosOrden.items.map((item)=>`
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 12px; text-align: left;">${item.nombre}</td>
      <td style="padding: 12px; text-align: center;">${item.cantidad}</td>
      <td style="padding: 12px; text-align: right;">$${item.precio.toFixed(2)}</td>
      <td style="padding: 12px; text-align: right;">$${(item.cantidad * item.precio).toFixed(2)}</td>
    </tr>
  `).join("");
  // Mostrar dirección solo si el método es 'acordar'
  const direccionHTML = datosOrden.shippingMethod === 'acordar' && datosOrden.addressLine1 ? `
    <div style="margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; border-left: 4px solid #28a745;">
      <h4 style="margin: 0 0 10px 0; color: #333;">Dirección de Envío:</h4>
      <p style="margin: 5px 0;"><strong>${datosOrden.addressLine1}</strong></p>
      ${datosOrden.addressLine2 ? `<p style="margin: 5px 0;">${datosOrden.addressLine2}</p>` : ''}
      <p style="margin: 5px 0;">${datosOrden.city}, ${datosOrden.state}</p>
      <p style="margin: 5px 0;">CP: ${datosOrden.postalCode}</p>
      <p style="margin: 5px 0;">${datosOrden.country}</p>
    </div>
  ` : '';
  // Mostrar retiro en sucursal si es el método seleccionado
  const retiroHTML = datosOrden.shippingMethod === 'retiro' ? `
    <div style="margin: 15px 0; padding: 15px; background: #e8f4f8; border-radius: 5px; border-left: 4px solid #17a2b8;">
      <h4 style="margin: 0 0 10px 0; color: #333;">Método de Envío:</h4>
      <p style="margin: 5px 0; font-weight: bold; color: #17a2b8;">RETIRO EN SUCURSAL</p>
      <p style="margin: 5px 0; font-size: 12px; color: #666;">El cliente se encargará de coordinar el retiro con nosotros.</p>
    </div>
  ` : '';
  const metodoEnvioHTML = datosOrden.shippingMethod ? `
    <p style="margin: 15px 0; padding: 10px; background: #f0f0f0; border-radius: 3px;">
      <strong>Método de envío:</strong> 
      <span style="color: ${datosOrden.shippingMethod === 'acordar' ? '#28a745' : '#17a2b8'}; font-weight: bold;">
        ${datosOrden.shippingMethod === 'acordar' ? 'Entrega a domicilio' : 'Retiro en sucursal'}
      </span>
    </p>
  ` : '';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 0 0 5px 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; min-width: 500px; }
          th { background: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; font-size: 14px; }
          td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
          .total-row { background: #f9f9f9; font-weight: bold; font-size: 16px; }
          .customer-info { background: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; border-radius: 3px; }
          .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          .table-wrapper { 
            overflow-x: auto; 
            -webkit-overflow-scrolling: touch;
            margin: 20px -20px;
            padding: 0 20px;
          }
          @media only screen and (max-width: 600px) {
            .container { padding: 15px; }
            .content { padding: 15px; }
            .table-wrapper { 
              margin: 20px -15px; 
              padding: 0 15px;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              background: #fafafa;
            }
            table { font-size: 12px; min-width: 450px; }
            th, td { padding: 8px 10px; }
            th { font-size: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Nueva Orden Recibida</h1>
            <p style="margin: 10px 0 0 0;">Orden #${datosOrden.id}</p>
          </div>
          
          <div class="content">
            <div class="customer-info">
              <h3 style="margin: 0 0 10px 0;">Información del Cliente:</h3>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${datosOrden.nombreCliente}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${datosOrden.email}</p>
              ${datosOrden.customerPhone ? `<p style="margin: 5px 0;"><strong>Teléfono:</strong> ${datosOrden.customerPhone}</p>` : ''}
            </div>

            ${metodoEnvioHTML}

            ${direccionHTML}

            ${retiroHTML}

            <h3 style="margin: 20px 0 10px 0;">Detalles de la Orden:</h3>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 12px; text-align: left;">Producto</th>
                    <th style="padding: 12px; text-align: center;">Cantidad</th>
                    <th style="padding: 12px; text-align: right;">Precio Unitario</th>
                    <th style="padding: 12px; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 12px; text-align: right;">TOTAL:</td>
                    <td style="padding: 12px; text-align: right; color: #28a745;">$${datosOrden.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4 style="margin: 0 0 10px 0;">Próximos pasos:</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Verificar disponibilidad de productos</li>
                <li>Confirmar con el cliente si es necesario</li>
                <li>Procesar el pago (si aplica)</li>
                <li>Preparar el envío</li>
              </ul>
            </div>

            <div class="footer">
              <p>Este es un email automático. Por favor no respondas a este mensaje.</p>
              <p>Sistema de Gestión de Órdenes - Tienda Arcoíris</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
