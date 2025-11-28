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
    <Box sx={{ 
      p: { xs: 1, sm: 3 }, 
      mb: 5,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Box display="flex" flexDirection="row" alignItems="center" gap={1} mb={3}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Pedidos
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary", fontSize: { xs: '0.875rem', sm: '1.25rem' } }}>
          {orders.length}
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="body1" mb={2} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Todavía no has hecho ningún pedido
          </Typography>
          <Button
            component={Link}
            to="/tienda"
            variant="contained"
            color="primary"
            size={window.innerWidth < 600 ? "small" : "medium"}
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