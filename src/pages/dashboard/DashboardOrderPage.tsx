import { useOrderAdmin } from "@/hooks/orders/useOrderAdmin";
import { Loader } from "@shared/components";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { useParams } from "react-router";

export const DashboardOrderPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrderAdmin(Number(id));

  if (isLoading) return <Loader />;
  if (!order) return <Typography>Orden no encontrada</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Detalle de Orden #{order.id}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Información del Cliente
        </Typography>
        <Typography>Nombre: {order.customers.full_name}</Typography>
        <Typography>Email: {order.customers.email}</Typography>
        <Typography>Teléfono: {order.customers.phone}</Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dirección de Envío
        </Typography>
        <Typography>{order.addresses.address_line1}</Typography>
        {order.addresses.address_line2 && (
          <Typography>{order.addresses.address_line2}</Typography>
        )}
        <Typography>
          {order.addresses.city}, {order.addresses.state} {order.addresses.postal_code}
        </Typography>
        <Typography>{order.addresses.country}</Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        {order.order_items.map((item: any) => (
          <Box key={item.id} sx={{ mb: 2 }}>
            <Box display="flex" gap={2}>
              <Box sx={{ width: 100 }}>
                <img
                  src={item.variants.products.images[0]}
                  alt={item.variants.products.name}
                  style={{ width: "100%" }}
                />
              </Box>
              <Box flex={1}>
                <Typography>{item.variants.products.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.variants.color_name} - {item.variants.storage}
                  {item.variants.finish && ` - ${item.variants.finish}`}
                </Typography>
              </Box>
              <Box>
                <Typography>Cantidad: {item.quantity}</Typography>
              </Box>
              <Box>
                <Typography>${item.price.toFixed(2)}</Typography>
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen
        </Typography>
        <Typography>Estado: {order.status}</Typography>
        <Typography>Fecha: {new Date(order.created_at).toLocaleDateString()}</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Total: ${order.total_amount.toFixed(2)}
        </Typography>
      </Paper>
    </Box>
  );
};
