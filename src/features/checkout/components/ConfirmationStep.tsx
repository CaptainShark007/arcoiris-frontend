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
  Fade,
  Avatar,
  //IconButton
} from '@mui/material';
import {
  CheckCircle,
  Receipt,
  //Email,
  AccountCircle,
  LocationOn,
  WhatsApp,
  Send as SendIcon,
  //Close as CloseIcon
} from '@mui/icons-material';
import { useCheckoutStore } from '@/storage/useCheckoutStore';
import { formatPrice } from '@/helpers';
import { useNavigate } from 'react-router';

// DESCOMENTAR para usar la version real
import { useOrder } from '@features/orders/hooks/useOrder';
import { Loader } from '@shared/components';

//import { mockData } from '../data/mock.data'; // COMENTAR para usar la version de prueba
import { useState } from 'react';

interface ConfirmationStepProps {
  onReset: () => void;
}

export const ConfirmationStep = ({ onReset }: ConfirmationStepProps) => {
  const navigate = useNavigate();
  const { orderId, clearCheckout } = useCheckoutStore();

  // Estado para el hover del botón de notificación (Abre el modal)
  const [showPreview, setShowPreview] = useState(false);
  // Estado para el hover del botón DENTRO del modal
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleResetMobile = () => {
    clearCheckout();
    onReset?.();
    navigate('/', { replace: true });
  };

  const handleViewOrdersHistory = () => {
    navigate('/cuenta/pedidos');
  }

  // DESCOMENTAR para usar la version real
  const { data, isLoading, isError } = useOrder(orderId || 0);
  if (isError) return <Typography variant='body2' sx={{ textAlign: 'center' }}>Error al cargar los detalles de la orden.</Typography>;
  if (isLoading) return <Loader />
  if (!data) return <Typography variant='body2' sx={{ textAlign: 'center' }}>No hay datos disponibles.</Typography>;

  //const data = mockData; // COMENTAR para usar la version de prueba

  // --- LÓGICA DE MENSAJE ---
  const phoneNumber = "5493624105888"; 
  
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
  };
  // ------------------------------------

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 4 } }}>

      {/* Icono de éxito */}
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

      {/* --- SECCIÓN: NOTIFICACIÓN FLOTANTE ANIMADA + MODAL TIPO WIDGET --- */}
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
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
          // onClick={handleNotifyWhatsapp} // Quitamos el click aquí para que no se dispare al intentar interactuar con el modal si se solapara, aunque el modal está encima.
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'white',
            px: 2,
            py: 1.5,
            borderRadius: 1,
            boxShadow: '0 4px 20px rgba(12, 234, 93, 0.1)', // cambiar a una sombra verde
            border: '1px solid #e0e0e0',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(15, 234, 95, 0.25)',
              borderColor: '#25D366'
            }
          }}
        >
          {/* Icono con animación de pulso */}
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
              Notifícanos por WhatsApp aquí
            </Typography>
          </Box>

          {/* --- MODAL ESTILO WIDGET (REEMPLAZA AL TOOLTIP ANTERIOR) --- */}
          <Fade in={showPreview} timeout={300}>
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                bottom: '120%', // Aparece ARRIBA del botón
                left: '50%',
                transform: 'translateX(-50%)', // Centrado horizontalmente
                width: 320, // Un poco más ancho para leer bien el detalle
                borderRadius: 1,
                overflow: 'hidden', // Importante para el header y footer
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#f5f5f5',
                cursor: 'default' // Reset cursor
              }}
              // Eventos para mantener el modal abierto si el mouse sube hacia él
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
            >
              {/* Header Oscuro */}
              <Box
                sx={{
                  bgcolor: "#1f2937",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}
              >
                 <Avatar sx={{ bgcolor: "#25D366", width: 32, height: 32 }}>
                   <WhatsApp fontSize="small" />
                 </Avatar>
                 <Box>
                   <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                     Atención al Cliente
                   </Typography>
                   <Typography variant="caption" sx={{ opacity: 0.8 }}>
                     Arcoiris
                   </Typography>
                 </Box>
              </Box>

              {/* Cuerpo del Mensaje (Gris) */}
              <Box sx={{ p: 2, bgcolor: "#e5e7eb" }}>
                <Box
                  sx={{
                    bgcolor: "white",
                    p: 2,
                    // ESTILO ESPECÍFICO SOLICITADO
                    borderRadius: "0px 12px 12px 12px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    maxWidth: "100%",
                    // SCROLL SOLICITADO
                    maxHeight: 200, 
                    overflowY: 'auto',
                    // Estilo del scrollbar para que sea sutil
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

              {/* Footer con Botón de Acción */}
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
                    py: 1,
                    "&:hover": {
                      bgcolor: "#1EBE57",
                    },
                  }}
                >
                  Enviar mensaje ahora
                </Button>
              </Box>
              
              {/* Triangulito decorativo abajo (opcional, para conectar con el botón) */}
              <Box sx={{
                position: 'absolute', bottom: -8, left: '50%', ml: -1,
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid white', // Color del footer
                zIndex: 1
              }} />
            </Paper>
          </Fade>
        </Box>
      </Box>
      {/* --------------------------------------------------- */}

      {/* Información de la orden */}
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

        {/* DETALLES DEL PEDIDO */}
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography 
            variant='h6' 
            gutterBottom 
            sx={{ fontWeight: 600, mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}
          >
            Detalles del pedido
          </Typography>

          {/* Tabla de items con altura fija y scroll */}
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

          {/* Total */}
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

          {/* Información adicional */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: { xs: 2, md: 3 },
            }}
          >
            {/* Información de contacto */}
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

            {/* Dirección de envío */}
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

      {/* Botones solo visibles en móviles */}
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