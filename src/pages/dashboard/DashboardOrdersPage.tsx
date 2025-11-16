import { useAllOrders } from "@/hooks/orders/useAllOrders";
import { useChangeStatusOrder } from "@/hooks/orders/useChangeStatusOrder";
import { TableOrdersAdmin } from "@/components/dashboard";
import { Loader } from "@shared/components";
import { Box, Typography } from "@mui/material";

export const DashboardOrdersPage = () => {
  const { data, isLoading } = useAllOrders();
  const { mutate: changeStatus } = useChangeStatusOrder();

  if (isLoading) return <Loader />;

  const orders = (data || []).map((order: any) => ({
    ...order,
    createdAt: order.created_at,
    totalAmount: order.total_amount,
    customerId: order.customer_id,
    customer: {
      id: order.customers.id,
      fullName: order.customers.full_name,
      email: order.customers.email,
    },
  }));

  const handleStatusChange = (id: number, status: string) => {
    changeStatus({ id, status });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Órdenes
      </Typography>
      <TableOrdersAdmin orders={orders} onStatusChange={handleStatusChange} />
    </Box>
  );
};
