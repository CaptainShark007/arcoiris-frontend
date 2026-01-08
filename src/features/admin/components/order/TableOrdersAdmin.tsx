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
  Chip,
} from '@mui/material';
import { PersonOutline as PersonIcon } from '@mui/icons-material';
import { formatDateLong, formatPrice } from '@/helpers';
import { OrderWithCustomer } from '@shared/types';
import { useNavigate } from 'react-router-dom';
import { useChangeStatusOrder } from '@features/admin/hooks';

const tableHeaders = ['N°', 'Cliente', 'Referido', 'Fecha', 'Estado', 'Total'];

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
              position: 'relative', 
              overflow: 'visible', 
              '&:hover': {
                backgroundColor: '#f8fafc',
                borderColor: '#cbd5e1',
                transition: 'all 200ms',
              },
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {order.partners && (
              <Chip
                icon={<PersonIcon style={{ fontSize: 12, color: '#1e40af' }} />}
                label={order.partners.code}
                size='small'
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  bgcolor: '#dbeafe',
                  color: '#1e40af',
                  border: '1px solid #93c5fd',
                  zIndex: 1
                }}
              />
            )}

            {/* Header móvil */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, pr: order.partners ? 8 : 0 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.25, color: '#1f2937' }}>
                  #{order.id}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                  {order.customers?.full_name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 0.5 }}>
                  {formatDateLong(order.created_at)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ my: 1.5, borderTop: '1px dashed #e5e7eb' }} />

            {/* Fila Inferior: Estado y Total */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Select de Estado Compacto */}
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                size='small'
                variant="standard"
                disableUnderline
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#4b5563',
                  '& .MuiSelect-select': { py: 0.5, pl: 0, pr: '24px !important' },
                }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.8rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>
                {formatPrice(order.total_amount)}
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
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {order.customers?.full_name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {[order.customers?.email, order.customers?.phone]
                      .filter(Boolean)
                      .join(' | ')}
                  </Typography>
                </Box>
              </TableCell>

              {/* Referido */}
              <TableCell sx={{ p: 2 }}>
                {order.partners ? (
                  <Chip
                    label={order.partners.code}
                    size='small'
                    color='info'
                    variant='outlined'
                    title={`Socio: ${order.partners.name}`}
                    sx={{ fontWeight: 'bold' }}
                  />
                ) : (
                  <Typography variant='caption' color='text.disabled'>
                    Directo
                  </Typography>
                )}
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
                  size='small'
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
