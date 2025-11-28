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
  Box,
  Typography,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface Props {
  orders: OrderItemSingle[];
}

const tableHeaders = ["ID", "Fecha", "Estado", "Total"];

export const TableOrders = ({ orders }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Vista móvil
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orders.map((order) => (
          <Card
            key={order.id}
            onClick={() => navigate(`/cuenta/pedidos/${order.id}`)}
            sx={{
              p: 2,
              cursor: 'pointer',
              border: '1px solid #e5e7eb',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#f8fafc',
                transition: 'background-color 200ms',
              },
              boxShadow: 'none',
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  N°{order.id}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 1 }}>
                  {formatDateLong(order.created_at)}
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {formatPrice(order.total_amount)}
              </Typography>
            </Box>

            {/* Estado */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1,
              borderTop: '1px solid #f1f5f9'
            }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Estado:
              </Typography>
              <Typography 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.75rem',
                  color: order.status === 'delivered' ? '#10b981' : 
                         order.status === 'shipped' ? '#3b82f6' : 
                         order.status === 'paid' ? '#8b5cf6' : '#f59e0b'
                }}
              >
                {getStatus(order.status)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  // Vista desktop
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        maxHeight: 500,
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