import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Loader } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPrice, formatDateLong } from '@/helpers';
import { useOrderAdmin } from '../hooks';

const tableHeaders = ['Producto', 'Cantidad', 'Total'];

const DashboardOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderAdmin(Number(id));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading || !order) return <Loader />;

  // Vista móvil para items del pedido
  const MobileOrderItems = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2  }}>
      {order.orderItems.map((item, index) => (
        <Card key={index} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 1, boxShadow: 'none' }}>
          {/* Producto */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
            <Box
              component='img'
              src={item.productImage}
              alt={item.productName}
              sx={{
                height: 60,
                width: 60,
                objectFit: 'contain',
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}>
                {item.productName}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 1 }}>
                {[item.color_name, item.storage, item.finish].filter(Boolean).join(' • ')}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(item.price)}
              </Typography>
            </Box>
          </Box>

          {/* Cantidad y Total */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 1,
            borderTop: '1px solid #f1f5f9'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Cantidad:
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {item.quantity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Total:
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {formatPrice(item.price * item.quantity)}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );

  // Vista desktop para items del pedido
  const DesktopOrderItems = () => (
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
          {order.orderItems.map((item, index) => (
            <TableRow
              key={index}
              sx={{
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <TableCell sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    component='img'
                    src={item.productImage}
                    alt={item.productName}
                    sx={{
                      height: 80,
                      width: 80,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {item.productName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {[item.color_name, item.storage, item.finish].filter(Boolean).join(' • ')}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ p: 2, textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                {item.quantity}
              </TableCell>
              <TableCell sx={{ p: 2, textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(item.price * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      px: { xs: 1, sm: 0 }, // ← Padding responsive
    }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            transition: 'all 300ms',
            '&:hover': { transform: 'scale(1.05)' },
            flexShrink: 0,
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
        </IconButton>

        <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <Typography variant='h4' sx={{ 
            fontWeight: 'bold', 
            mb: 0.5,
            fontSize: { xs: '1.5rem', sm: '2rem' } 
          }}>
            Pedido #{id}
          </Typography>
          <Typography variant='body2' sx={{ color: '#6b7280', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {formatDateLong(order.created_at)}
          </Typography>
        </Box>

        <Box sx={{ width: { xs: 32, sm: 48 }, flexShrink: 0 }} />
      </Box>

      {/* Tabla de Items */}
      <Card
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          bgcolor: '#F9FAFB',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
      >
        {isMobile ? <MobileOrderItems /> : <DesktopOrderItems />}
      </Card>

      {/* Resumen y Dirección */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: { xs: 2, lg: 3 },
          mb: 3,
        }}
      >
        {/* Resumen */}
        <Card sx={{ 
          p: { xs: 1.5, sm: 2.5 }, 
          bgcolor: '#F9FAFB', 
          boxShadow: 'none', 
          border: '1px solid #E5E7EB',
          height: 'fit-content',
        }}>
          <Typography variant='h6' sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            Resumen del Pedido
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
              <Typography sx={{ color: '#6b7280', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
              <Typography sx={{ color: '#6b7280', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Envío (Standard)
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {formatPrice(0)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '0.875rem' } }}>
                Total
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#0007d7ff' }}>
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Dirección */}
        <Card sx={{ 
          p: { xs: 1.5, sm: 2.5 }, 
          bgcolor: '#F9FAFB', 
          boxShadow: 'none', 
          border: '1px solid #E5E7EB',
          height: 'fit-content',
        }}>
          <Typography variant='h6' sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            Dirección de Envío
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' }, mb: 0.5 }}>
                Cliente:
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#1e293b' }}>
                {order.customer.full_name}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' }, mb: 0.5 }}>
                Dirección:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6b7280' }}>
                  {order.address.addressLine1}
                </Typography>
                {order.address.addressLine2 && (
                  <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6b7280' }}>
                    {order.address.addressLine2}
                  </Typography>
                )}
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6b7280' }}>
                  {order.address.city}, {order.address.state}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6b7280' }}>
                  {order.address.postalCode}
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6b7280' }}>
                  {order.address.country}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardOrderPage;