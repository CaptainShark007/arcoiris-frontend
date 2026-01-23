import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Avatar,
  Dialog,
  IconButton,
  DialogContent,
} from '@mui/material';
import {
  CheckCircle,
  Receipt,
  AccountCircle,
  LocationOn,
  WhatsApp,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { formatPrice } from '@/helpers';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useCurrentPartner } from '@shared/hooks';

// ============================================================
// DESCOMENTAR para usar la version real
import { useOrder } from '@features/orders/hooks/useOrder';
import { Loader } from '@shared/components';
// ============================================================

// ============================================================
// COMENTAR para usar la version de prueba
//import { mockData } from '../data/mock.data'; 
// ============================================================

interface ConfirmationStepProps {
  onReset: () => void;
}

export const ConfirmationStep = ({ onReset }: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const { orderId, clearCheckout } = useCheckoutStore();

  const [showPreview, setShowPreview] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const { data: partner } = useCurrentPartner();

  const handleResetMobile = () => {
    clearCheckout();
    onReset?.();
    navigate('/', { replace: true });
  };

  const handleViewOrdersHistory = () => {
    navigate('/cuenta/pedidos');
  }

  // ============================================================
  // DESCOMENTAR para usar la version real
  const { data, isLoading, isError } = useOrder(orderId || 0);
  if (isError) return <Typography variant='body2' sx={{ textAlign: 'center' }}>Error al cargar los detalles de la orden.</Typography>;
  if (isLoading) return <Loader />
  if (!data) return <Typography variant='body2' sx={{ textAlign: 'center' }}>No hay datos disponibles.</Typography>;
  // ============================================================

  // ============================================================
  // COMENTAR para usar la version de prueba
  //const data = mockData; 
  // ============================================================

  const DEFAULT_PHONE = "5493624049548";
  
  const phoneNumber = partner?.phone 
    ? partner.phone.replace(/\D/g, '')
    : DEFAULT_PHONE;

  const contactName = partner ? partner.name : "arcoiris";
  
  const messageBody = data ? (() => {
    const itemsList = data.orderItems.map(item => 
      `• ${item.quantity} u. - ${item.productName} (${[item.storage, item.color_name, item.finish].filter(Boolean).join(' - ')}) - ${formatPrice(item.price)}`
    ).join('\n');

    return `¡Hola! Acabo de realizar un nuevo pedido.\n\n` +
      `Nro de Orden: #${orderId || '1000'}\n` +
      `Cliente: ${data.customer.full_name}\n` +
      `Email: ${data.customer.email}\n\n` +
      `Detalle del pedido:\n${itemsList}\n\n` +
      `Con un total de: ${formatPrice(data.totalAmount)}\n\n` +
      `Quedo a la espera de la confirmación y detalles del envío. ¡Gracias!`;
  })() : "";

  const handleNotifyWhatsapp = () => {
    if (!data) return;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageBody)}`, '_blank');
    setShowPreview(false);
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 4 } }}>

      <Box sx={{ textAlign: 'center', py: { xs: 2, sm: 3, md: 4 } }}>
        <CheckCircle
          sx={{
            fontSize: { xs: 50, sm: 65, md: 80 },
            color: 'success.main',
            mb: { xs: 1, md: 2 },
          }}
        />
        <Typography 
          variant='h4' 
          gutterBottom 
          fontWeight='bold'
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
        >
          ¡Gracias, {data?.customer.full_name}!
        </Typography>
        <Typography 
          variant='body1' 
          color='text.secondary'
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Tu pedido ha sido recibido con éxito.
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 2, 
          position: 'relative',
          zIndex: 10 
        }}
      >
        <Box 
          onClick={() => setShowPreview(true)}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'white',
            px: 2,
            py: 1.5,
            borderRadius: 1,
            boxShadow: '0 4px 20px rgba(12, 234, 93, 0.1)',
            border: '1px solid #e0e0e0',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(15, 234, 95, 0.25)',
              borderColor: '#25D366'
            }
          }}
        >
          <Box sx={{ position: 'relative', display: 'flex' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: '50%',
                bgcolor: '#25D366',
                opacity: 0.7,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)' },
                  '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(37, 211, 102, 0)' },
                  '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' },
                },
              }}
            />
            <Avatar sx={{ bgcolor: '#25D366', width: 42, height: 42, position: 'relative' }}>
              <WhatsApp sx={{ fontSize: 24 }} />
            </Avatar>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1f2937', lineHeight: 1.2 }}>
              ¿Quieres agilizar tu pedido?
            </Typography>
            <Typography variant="caption" sx={{ color: '#25D366', fontWeight: 600 }}>
              Notifica a {contactName} por WhatsApp aquí
            </Typography>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, overflow: 'hidden' }
        }}
      >
        <Box
          sx={{
            bgcolor: "#1f2937",
            color: "white",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "#25D366", width: 36, height: 36 }}>
              <WhatsApp fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                Atención al Cliente
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {partner ? partner.name : 'Arcoiris'}
              </Typography>
            </Box>
          </Box>
          
          <IconButton size="small" onClick={() => setShowPreview(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, bgcolor: "#e5e7eb" }}>
            <Box
              sx={{
                bgcolor: "white",
                p: 2,
                borderRadius: "0px 12px 12px 12px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                maxWidth: "100%",
                maxHeight: 300, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '3px' }
              }}
            >
              <Typography 
                variant="body2" 
                color="text.primary" 
                sx={{ 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'inherit',
                  fontSize: '0.85rem'
                }}
              >
                {messageBody}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: "block", textAlign: 'right' }}>
                Vista previa del mensaje
            </Typography>
          </Box>

          <Box sx={{ p: 2, bgcolor: "white" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleNotifyWhatsapp}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              startIcon={isButtonHovered ? <SendIcon /> : <WhatsApp />}
              sx={{
                bgcolor: "#25D366",
                borderRadius: 1,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#1EBE57",
                },
              }}
            >
              Enviar mensaje ahora
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Paper
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 2, md: 3 },
          bgcolor: 'background.default',
          boxShadow: 'none',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1.5, md: 2 } }}>
          <Receipt color='primary' sx={{ fontSize: { xs: 20, md: 24 } }} />
          <Typography 
            variant='h6'
            sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            Orden #{orderId || '1000'}
          </Typography>
        </Box>

        <Divider sx={{ my: { xs: 1.5, md: 2 } }} />

        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography 
            variant='h6' 
            gutterBottom 
            sx={{ fontWeight: 600, mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            Detalles del pedido
          </Typography>

          <TableContainer
            sx={{
              mb: { xs: 2, md: 3 },
              maxHeight: { xs: 300, sm: 350, md: 410 },
              overflowY: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <Table stickyHeader>
              <TableBody>
                {data.orderItems.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell 
                      sx={{ 
                        width: { xs: 60, md: 80 }, 
                        pr: { xs: 1, md: 2 }, 
                        borderBottom: 1, 
                        borderColor: 'divider',
                        py: { xs: 1, md: 1.5 }
                      }}
                    >
                      <Box
                        component='img'
                        src={item.productImage}
                        alt={item.productName}
                        sx={{
                          width: { xs: 48, md: 64 },
                          height: { xs: 48, md: 64 },
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: 1, borderColor: 'divider', py: { xs: 1, md: 1.5 } }}>
                      <Typography 
                        variant='subtitle2' 
                        sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        {item.productName}
                      </Typography>
                      <Typography 
                        variant='caption' 
                        color='text.secondary'
                        sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}
                      >
                        {[item.color_name, item.storage, item.finish].filter(Boolean).join(' • ')}
                      </Typography>
                    </TableCell>
                    <TableCell 
                      align='right' 
                      sx={{ borderBottom: 1, borderColor: 'divider', py: { xs: 1, md: 1.5 } }}
                    >
                      <Typography 
                        variant='subtitle2' 
                        sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                      >
                        {formatPrice(item.price)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: { xs: 1.5, md: 2 },
              bgcolor: 'action.hover',
              borderRadius: 1,
              mb: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ display: 'flex', gap: { xs: 4, md: 8 } }}>
              <Typography 
                variant='subtitle2' 
                sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
              >
                Total:
              </Typography>
              <Typography 
                variant='subtitle2' 
                sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
              >
                {formatPrice(data.totalAmount)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: { xs: 2, md: 3 },
            }}
          >

            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: { xs: 0.5, md: 1 } }}>
                <AccountCircle color='primary' sx={{ fontSize: { xs: 18, md: 20 } }} />
                <Typography 
                  variant='subtitle2' 
                  sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                >
                  Información de contacto
                </Typography>
              </Box>
              <Typography 
                variant='body2' 
                color='text.secondary' 
                sx={{ ml: { xs: 3, md: 4 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              >
                {data.customer.email}
              </Typography>
              <Typography 
                variant='body2' 
                color='text.secondary' 
                sx={{ ml: { xs: 3, md: 4 }, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
              >
                {data.customer.phone}
              </Typography>
            </Box>

            {data.address && (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: { xs: 0.5, md: 1 } }}>
                  <LocationOn color='primary' sx={{ fontSize: { xs: 18, md: 20 } }} />
                  <Typography 
                    variant='subtitle2' 
                    sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}
                  >
                    Dirección de envío
                  </Typography>
                </Box>
                <Box sx={{ ml: { xs: 3, md: 4 } }}>
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.addressLine1}
                  </Typography>
                  {data.address.addressLine2 && (
                    <Typography 
                      variant='body2' 
                      color='text.secondary'
                      sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                    >
                      {data.address.addressLine2}
                    </Typography>
                  )}
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.city}, {data.address.state}
                  </Typography>
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.postalCode}
                  </Typography>
                  <Typography 
                    variant='body2' 
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    {data.address.country}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: { xs: 1.5, md: 2 } }} />
      </Paper>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Button
          variant='contained'
          onClick={handleViewOrdersHistory}
          fullWidth
          sx={{ py: { xs: 1, sm: 1.25 } }}
        >
          Ver detalles de la orden
        </Button>

        <Button 
          variant='outlined' 
          onClick={handleResetMobile} 
          fullWidth
          sx={{ py: { xs: 1, sm: 1.25 } }}
        >
          Volver a inicio
        </Button>
      </Box>
    </Box>
  );
};