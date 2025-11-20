import { formatDateLong, formatPrice, getStatus } from "@/helpers";
import { OrderItemSingle } from "@shared/types";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Props {
  orders: OrderItemSingle[];
}

const tableHeaders = ["ID", "Fecha", "Estado", "Total"];

export const TableOrders = ({ orders }: Props) => {
  const navigate = useNavigate();

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        maxHeight: 500, // calc(10 * 52px + 56px)
        overflow: "auto",
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "background.default" }}>
            {tableHeaders.map((header) => (
              <TableCell
                key={header}
                align="left"
                sx={{ fontWeight: 600, py: 1.5 }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              onClick={() => navigate(`/cuenta/pedidos/${order.id}`)}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transition: "background-color 0.2s ease-in-out",
                },
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell sx={{ fontWeight: 500 }}>
                {order.id}
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {formatDateLong(order.created_at)}
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {getStatus(order.status)}
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>
                {formatPrice(order.total_amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};