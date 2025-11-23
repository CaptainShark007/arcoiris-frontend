import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { formatDateLong, formatPrice } from '@/helpers';
import { OrderWithCustomer } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { useChangeStatusOrder } from '../hooks';

const tableHeaders = ['Cliente', 'Fecha', 'Estado', 'Total'];

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
];

interface Props {
  orders: OrderWithCustomer[];
}

export const TableOrdersAdmin = ({ orders }: Props) => {
  const navigate = useNavigate();
  const { mutate } = useChangeStatusOrder();

  const handleStatusChange = (id: number, status: string) => {
    mutate({ id, status });
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {tableHeaders.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  height: 48,
                  px: 2,
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  borderBottom: '1px solid #e5e7eb',
                }}
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
              onClick={() => navigate(`/panel/pedidos/${order.id}`)}
              sx={{
                cursor: 'pointer',
                borderBottom: '1px solid #e8eaefff',
                '&:hover': {
                  backgroundColor: '#f4f2f2ff',
                  transition: 'background-color 200ms',
                },
              }}
            >
              {/* Cliente */}
              <TableCell sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {order.customers?.full_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {order.customers?.email}
                  </Typography>
                </Box>
              </TableCell>

              {/* Fecha */}
              <TableCell sx={{ p: 2, fontWeight: 500, fontSize: '0.875rem' }}>
                {formatDateLong(order.created_at)}
              </TableCell>

              {/* Estado */}
              <TableCell sx={{ p: 2 }}>
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                  sx={{
                    fontSize: '0.875rem',
                    minWidth: 120,
                  }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              {/* Total */}
              <TableCell sx={{ p: 2, fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(order.total_amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};