import { Link } from "react-router";
import { useOrders } from "../hooks";
import { Loader } from "@shared/components";
import { TableOrders } from "../components";
import { Box, Typography, Button } from "@mui/material";

// TABLA DE TODOS LOS PEDIDOS DEL USUARIO
const OrdersUserPage = () => {
  const { data: orders, isLoading } = useOrders();
  if (isLoading || !orders) return <Loader />;

  return (
    <Box sx={{ p: 3, mb: 5 }}>
      <Box display="flex" flexDirection="row" alignItems="center" gap={1} mb={3}>
        <Typography variant="h4" component="h1">
          Pedidos
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          {orders.length}
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box>
          <Typography variant="body1" mb={2}>
            Todavia no has hecho ningun pedido
          </Typography>
          <Button
            component={Link}
            to="/tienda"
            variant="contained"
            color="primary"
          >
            Empezar a comprar
          </Button>
        </Box>
      ) : (
        <TableOrders orders={orders} />
      )}
    </Box>
  );
};

export default OrdersUserPage;