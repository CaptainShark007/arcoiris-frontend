import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";

interface Customer {
  id: string;
  fullName: string;
  email: string;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  customerId: string;
  customer: Customer;
}

interface TableOrdersAdminProps {
  orders: Order[];
  onStatusChange: (id: number, status: string) => void;
}

export const TableOrdersAdmin = ({
  orders,
  onStatusChange,
}: TableOrdersAdminProps) => {
  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/dashboard/ordenes/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              hover
              onClick={() => handleRowClick(order.id)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{order.customer.fullName}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                </Select>
              </TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
