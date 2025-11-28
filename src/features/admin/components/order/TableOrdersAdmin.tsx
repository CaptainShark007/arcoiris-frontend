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
  Card,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { formatDateLong, formatPrice } from '@/helpers';
import { OrderWithCustomer } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { useChangeStatusOrder } from '@features/admin/hooks';

const tableHeaders = ['N°', 'Cliente', 'Fecha', 'Estado', 'Total'];

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleStatusChange = (id: number, status: string) => {
    mutate({ id, status });
  };

  // Vista móvil
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orders.map((order) => (
          <Card
            key={order.id}
            onClick={() => navigate(`/panel/pedidos/${order.id}`)}
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
            {/* Header móvil */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}>
                  N°{order.id} - {order.customers?.full_name}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', minWidth: '60px' }}>
                Estado:
              </Typography>
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  flex: 1,
                  '& .MuiSelect-select': { py: 0.5 },
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Contacto */}
            <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px solid #f1f5f9' }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>
                {[order.customers?.email, order.customers?.phone].filter(Boolean).join(' • ')}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  // Vista desktop
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
              {/* N° */}
              <TableCell sx={{ p: 2, fontWeight: 600, fontSize: '0.875rem' }}>
                {order.id}
              </TableCell>
              {/* Cliente */}
              <TableCell sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {order.customers?.full_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {[order.customers?.email, order.customers?.phone].filter(Boolean).join(' | ')}
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