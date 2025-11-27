import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../hooks';
import { Loader } from '@shared/components';
import { formatDateLong, formatPrice, getStatus } from '@/helpers';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const tableHeaders = ['Producto', 'Cantidad', 'Total'];

// PAGINA DE UN SOLO PEDIDO DEL USUARIO IDENTIFICADO POR EL ID
const OrderUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id!));
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading || !order) return <Loader />;

  // Vista móvil para productos
  const MobileProducts = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2  }}>
      {order.orderItems.map((product, index) => (
        <Card key={index} sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 1, boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
            <Box
              component='img'
              src={product.productImage}
              alt={product.productName}
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
                {product.productName}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 1 }}>
                {[product.color_name, product.storage].filter(Boolean).join(' • ')}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(product.price)}
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
                {product.quantity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Total:
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {formatPrice(product.price * product.quantity)}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );

  // Vista desktop para productos
  const DesktopProducts = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        maxHeight: 395,
        overflow: 'auto',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.default' }}>
            {tableHeaders.map((header) => (
              <TableCell
                key={header}
                align={header === 'Producto' ? 'left' : 'center'}
                sx={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  py: 2,
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {order.orderItems.map((product, index) => (
            <TableRow
              key={index}
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <TableCell sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box display='flex' gap={2} alignItems='flex-start' >
                  <Box
                    component='img'
                    src={product.productImage}
                    alt={product.productName}
                    sx={{
                      height: 80,
                      width: 80,
                      objectFit: 'contain',
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant='body2' fontWeight='500'>
                      {product.productName}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      display='block'
                    >
                      {product.color_name} / {product.storage}
                    </Typography>
                    <Typography
                      variant='caption'
                      display='block'
                      sx={{ mt: 0.5 }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align='center' sx={{ fontWeight: 500, borderBottom: 1, borderColor: 'divider' }}>
                {product.quantity}
              </TableCell>
              <TableCell align='center' sx={{ fontWeight: 500, borderBottom: 1, borderColor: 'divider' }}>
                {formatPrice(product.price * product.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ 
      mb: 10,
      px: { xs: 1, sm: 0 },
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2.5,
          mb: 5,
        }}
      >
        <Button
          variant='outlined'
          startIcon={<ArrowBackIosIcon fontSize='small' />}
          onClick={() => navigate(-1)}
          size={isMobile ? 'small' : 'medium'}
          sx={{ fontWeight: 'bold' }}
        >
          Volver a los pedidos
        </Button>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            order: { xs: -1, md: 0 },
          }}
        >
          <Typography variant='h4' component='h1' fontWeight='bold' sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Pedido #{id}
          </Typography>
          <Typography variant='caption' color='text.secondary' sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
            {formatDateLong(order.created_at)}
          </Typography>
          <Typography 
            variant='body2' 
            sx={{ 
              fontWeight: 600,
              color: order.status === 'delivered' ? '#10b981' : 
                     order.status === 'shipped' ? '#3b82f6' : 
                     order.status === 'paid' ? '#8b5cf6' : '#f59e0b'
            }}
          >
            {getStatus(order.status)}
          </Typography>
        </Box>
        
        <Box sx={{ width: { xs: 0, md: 148 }, display: { xs: 'none', md: 'block' } }} />
      </Box>

      <Stack spacing={5}>
        {/* Products Table */}
        {isMobile ? <MobileProducts /> : <DesktopProducts />}

        {/* Summary Section */}
        <Box sx={{ 
          alignSelf: { xs: 'stretch', sm: 'flex-end' }, 
          width: { xs: '100%', sm: '50%' } 
        }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Resumen del Pedido
              </Typography>
              <Stack spacing={1.5}>
                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Subtotal
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Envío (Standard)
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {formatPrice(0)}
                  </Typography>
                </Box>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  sx={{
                    pt: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant='subtitle2' fontWeight='600' sx={{ fontSize: { xs: '0.9rem', sm: '0.875rem' } }}>
                    Total
                  </Typography>
                  <Typography variant='subtitle2' fontWeight='600' sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {formatPrice(order.totalAmount)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Address Section */}
        <Box>
          <Typography variant='h6' fontWeight='bold' mb={2} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Información proporcionada
          </Typography>
          <Card variant='outlined'>
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant='subtitle2' fontWeight='600' mb={0.5} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Cliente:
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {order.customer.full_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='subtitle2' fontWeight='600' mb={1} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Dirección de envío:
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {order.address.addressLine1}
                    </Typography>
                    {order.address.addressLine2 && (
                      <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                        {order.address.addressLine2}
                      </Typography>
                    )}
                    <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {order.address.city}, {order.address.state}
                    </Typography>
                    <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {order.address.postalCode}
                    </Typography>
                    <Typography variant='body2' sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {order.address.country}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default OrderUserPage;