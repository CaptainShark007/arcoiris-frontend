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
  Button,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Store as StoreIcon,
  WhatsApp as WhatsAppIcon,
  PictureAsPdf as PictureAsPdfIcon,
  PhoneDisabled as PhoneDisabledIcon,
} from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Loader, SeoHead } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPrice, formatDateLong } from '@/helpers';
import { useOrderAdmin } from '../hooks';

const tableHeaders = ['Producto', 'Cantidad', 'Total'];

// Normaliza un teléfono local argentino a formato internacional para wa.me
// Ej: '3624049548' -> '5493624049548'
const normalizePhoneForWhatsapp = (phone?: string | null): string => {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54')) return `9${digits}`;
  return `549${digits}`;
};

const DashboardOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderAdmin(Number(id));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading || !order) {
    return (
      <>
        <SeoHead
          title='Cargando pedido...'
          description='Cargando los detalles del pedido en el panel de administración'
        />
        <Loader />
      </>
    );
  }

  const isPos = order.sale_channel === 'pos';
  const hasAdminClient = isPos && !!order.adminClient;
  const clientName = hasAdminClient
    ? order.adminClient!.full_name
    : order.customer?.full_name || '';
  const clientEmail = hasAdminClient
    ? order.adminClient!.email
    : order.customer?.email || '';
  const clientPhone = hasAdminClient
    ? order.adminClient!.phone
    : order.customer?.phone;

  const displayClientName = isPos && !hasAdminClient ? 'Cliente Anónimo' : clientName;

  const whatsappNumber = normalizePhoneForWhatsapp(
    isPos ? (hasAdminClient ? order.adminClient!.phone : '') : order.customer?.phone
  );

  const buildWhatsappMessage = () => {
    const itemsList = order.orderItems
      .map(
        (item) =>
          `• ${item.quantity} u. - ${item.productName} (${[
            item.storage,
            item.color_name,
            item.finish,
          ]
            .filter(Boolean)
            .join(' - ')}) - ${formatPrice(item.price)}`
      )
      .join('\n');

    const addressLines = order.address
      ? [
          order.address.addressLine1,
          order.address.addressLine2,
          `${order.address.city}, ${order.address.state}`,
          order.address.postalCode,
          order.address.country,
        ]
          .filter(Boolean)
          .join(', ')
      : null;

    return (
      `¡Hola ${displayClientName}! Te compartimos el detalle de tu pedido.\n\n` +
      `Nro de Pedido: #${order.id}\n` +
      `Fecha: ${formatDateLong(order.created_at)}\n\n` +
      `Detalle del pedido:\n${itemsList}\n\n` +
      `Total: ${formatPrice(order.totalAmount)}\n` +
      (addressLines ? `\nDirección de envío: ${addressLines}\n` : '') +
      `\n¡Gracias por tu compra!`
    );
  };

  const handleSendWhatsapp = () => {
    if (!whatsappNumber) return;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        buildWhatsappMessage()
      )}`,
      '_blank'
    );
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const MARGIN_X = 15;
    const PAGE_WIDTH = 210;
    const BLUE: [number, number, number] = [0, 7, 215];
    const GRAY: [number, number, number] = [107, 114, 128];

    // Encabezado
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, PAGE_WIDTH, 26, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ARCOIRIS', MARGIN_X, 12);

    doc.setFontSize(12);
    doc.text(`Recibo — Pedido #${order.id}`, MARGIN_X, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(formatDateLong(order.created_at), PAGE_WIDTH - MARGIN_X, 12, {
      align: 'right',
    });

    let y = 36;

    // Cliente
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Cliente', MARGIN_X, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(displayClientName || '—', MARGIN_X, y);
    y += 5;
    doc.text(clientEmail || '—', MARGIN_X, y);
    y += 5;

    if (clientPhone) {
      doc.text(`Teléfono: ${clientPhone}`, MARGIN_X, y);
      y += 5;
    }

    y += 4;

    // Tabla de items
    autoTable(doc, {
      startY: y,
      margin: { left: MARGIN_X, right: MARGIN_X },
      head: [['Producto', 'Cant.', 'Precio', 'Total']],
      body: order.orderItems.map((item) => {
        const variant = [item.color_name, item.storage, item.finish]
          .filter(Boolean)
          .join(' • ');
        return [
          variant ? `${item.productName}\n${variant}` : item.productName,
          String(item.quantity),
          formatPrice(item.price),
          formatPrice(item.price * item.quantity),
        ];
      }),
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 2.5,
        textColor: [30, 41, 59],
        lineColor: [229, 231, 235],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: BLUE,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });

    let endY = (doc as any).lastAutoTable.finalY as number;
    y = endY + 8;

    // Resumen
    const summaryX = PAGE_WIDTH - MARGIN_X - 70;
    const summaryWidth = 70;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text('Subtotal', summaryX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(
      formatPrice(order.totalAmount),
      summaryX + summaryWidth,
      y,
      { align: 'right' }
    );
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text('Envío (Standard)', summaryX, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(formatPrice(0), summaryX + summaryWidth, y, { align: 'right' });
    y += 7;

    doc.setFillColor(229, 231, 235);
    doc.rect(summaryX, y - 5, summaryWidth, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(...BLUE);
    doc.text('Total', summaryX + 3, y + 1);
    doc.text(
      formatPrice(order.totalAmount),
      summaryX + summaryWidth - 3,
      y + 1,
      { align: 'right' }
    );
    y += 16;

    // Dirección de envío
    if (order.sale_channel !== 'pos' && order.address) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Dirección de envío', MARGIN_X, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(order.address.addressLine1, MARGIN_X, y);
      y += 5;
      if (order.address.addressLine2) {
        doc.text(order.address.addressLine2, MARGIN_X, y);
        y += 5;
      }
      doc.text(
        `${order.address.city}, ${order.address.state}`,
        MARGIN_X,
        y
      );
      y += 5;
      if (order.address.postalCode) {
        doc.text(order.address.postalCode, MARGIN_X, y);
        y += 5;
      }
      doc.text(order.address.country, MARGIN_X, y);
      y += 5;
    }

    // Pie
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(
      'Gracias por tu compra en Arcoiris',
      PAGE_WIDTH / 2,
      292,
      { align: 'center' }
    );

    doc.save(`recibo-pedido-${order.id}.pdf`);
  };

  // Vista móvil para items del pedido
  const MobileOrderItems = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {order.orderItems.map((item, index) => (
        <Card
          key={index}
          sx={{
            p: 2,
            border: '1px solid #e5e7eb',
            borderRadius: 1,
            boxShadow: 'none',
          }}
        >
          {/* Producto */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              mb: 1.5,
            }}
          >
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
              <Typography
                sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.5 }}
              >
                {item.productName}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 1 }}>
                {[item.color_name, item.storage, item.finish]
                  .filter(Boolean)
                  .join(' • ')}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {formatPrice(item.price)}
              </Typography>
            </Box>
          </Box>

          {/* Cantidad y Total */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 1,
              borderTop: '1px solid #f1f5f9',
            }}
          >
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
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {item.productName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {[item.color_name, item.storage, item.finish]
                        .filter(Boolean)
                        .join(' • ')}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  p: 2,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {item.quantity}
              </TableCell>
              <TableCell
                sx={{
                  p: 2,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {formatPrice(item.price * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        px: { xs: 1, sm: 0 }, // ← Padding responsive
      }}
    >
      <SeoHead
        title={`Pedido n${id}`}
        description={`Detalles del pedido n${id} en el panel de administración`}
      />
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
          <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Pedido #{id}
          </Typography>
          <Typography
            variant='body2'
            sx={{
              color: '#6b7280',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {formatDateLong(order.created_at)}
          </Typography>
        </Box>

        <Box sx={{ width: { xs: 32, sm: 48 }, flexShrink: 0 }} />
      </Box>

      {/* Acciones */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        {isPos ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              alignItems: { xs: 'stretch', sm: 'center' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Tooltip
              title={
                whatsappNumber
                  ? 'Enviar el detalle del pedido por WhatsApp'
                  : 'Ingresa un número de WhatsApp válido'
              }
              arrow
            >
              <span>
                <Button
                  variant='contained'
                  startIcon={<WhatsAppIcon />}
                  onClick={handleSendWhatsapp}
                  disabled={!whatsappNumber}
                  sx={{
                    bgcolor: '#25D366',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: '#1EBE57',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(37, 211, 102, 0.4)',
                      color: 'rgba(255,255,255,0.8)',
                    },
                  }}
                >
                  Enviar por WhatsApp
                </Button>
              </span>
            </Tooltip>
          </Box>
        ) : (
          <Tooltip
            title={
              whatsappNumber
                ? 'Enviar el detalle del pedido por WhatsApp'
                : 'El cliente no tiene un número de teléfono registrado'
            }
            arrow
          >
            <span>
              <Button
                variant='contained'
                startIcon={
                  whatsappNumber ? <WhatsAppIcon /> : <PhoneDisabledIcon />
                }
                onClick={handleSendWhatsapp}
                disabled={!whatsappNumber}
                sx={{
                  bgcolor: '#25D366',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#1EBE57',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(37, 211, 102, 0.4)',
                    color: 'rgba(255,255,255,0.8)',
                  },
                }}
              >
                Enviar por WhatsApp
              </Button>
            </span>
          </Tooltip>
        )}

        <Button
          variant='outlined'
          startIcon={<PictureAsPdfIcon />}
          onClick={handleDownloadPdf}
          sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
        >
          Descargar recibo (PDF)
        </Button>
      </Box>

      {/* Cliente — mostrar solo en ventas POS */}
      {order.sale_channel === 'pos' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            mb: 1.5,
            bgcolor: 'white',
            borderRadius: 1,
            border: '1px solid #e5e7eb',
          }}
        >
          <PersonIcon sx={{ color: '#2563eb' }} />
          <Box>
            <Typography
              sx={{ fontWeight: 600, color: '#1e3a8a', fontSize: '0.9rem' }}
            >
              {displayClientName}
            </Typography>
            {clientPhone && (
              <Typography variant='caption' sx={{ color: '#3b82f6', fontWeight: 500 }}>
                {clientPhone}
              </Typography>
            )}
            {clientEmail && (
              <Typography variant='caption' sx={{ color: '#6b7280', display: 'block' }}>
                {clientEmail}
              </Typography>
            )}
          </Box>
        </Box>
      )}

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
        <Card
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: '#F9FAFB',
            boxShadow: 'none',
            border: '1px solid #E5E7EB',
            height: 'fit-content',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Resumen del Pedido
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1.5,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                Subtotal
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1.5,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <Typography
                sx={{
                  color: '#6b7280',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                Envío (Standard)
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {formatPrice(0)}
              </Typography>
            </Box>

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', sm: '0.875rem' },
                }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  color: '#0007d7ff',
                }}
              >
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Tarjeta de Canal de Venta / Socio */}
        <Card
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: '#F9FAFB',
            boxShadow: 'none',
            border: '1px solid #E5E7EB',
            height: 'fit-content',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            Canal de Venta
          </Typography>

          {order.partner ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: '#eff6ff',
                  borderRadius: 1,
                  border: '1px solid #bfdbfe',
                }}
              >
                <PersonIcon sx={{ color: '#2563eb' }} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1e3a8a',
                      fontSize: '0.9rem',
                    }}
                  >
                    Socio: {order.partner.name}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{ color: '#3b82f6', fontWeight: 500 }}
                  >
                    Código: {order.partner.code}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 0.5 }}
              >
                Esta venta fue generada a través de un link de referido.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: 'white',
                borderRadius: 1,
                border: '1px solid #e5e7eb',
              }}
            >
              <StoreIcon sx={{ color: '#6b7280' }} />
              <Box>
                <Typography
                  sx={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}
                >
                  Venta Directa
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Orgánica / Sin referido
                </Typography>
              </Box>
            </Box>
          )}
        </Card>

        {/* Tarjeta Canal de Venta — reemplazar la existente */}
        <Card
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: '#F9FAFB',
            boxShadow: 'none',
            border: '1px solid #E5E7EB',
            height: 'fit-content',
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Canal de Venta
          </Typography>

          {order.sale_channel === 'pos' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: '#f0fdf4',
                borderRadius: 1,
                border: '1px solid #86efac',
              }}
            >
              <StoreIcon sx={{ color: '#16a34a' }} />
              <Box>
                <Typography
                  sx={{ fontWeight: 600, color: '#15803d', fontSize: '0.9rem' }}
                >
                  Punto de Venta
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Venta presencial registrada por el administrador
                </Typography>
              </Box>
            </Box>
          ) : order.partner ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: '#eff6ff',
                  borderRadius: 1,
                  border: '1px solid #bfdbfe',
                }}
              >
                <PersonIcon sx={{ color: '#2563eb' }} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1e3a8a',
                      fontSize: '0.9rem',
                    }}
                  >
                    Socio: {order.partner.name}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{ color: '#3b82f6', fontWeight: 500 }}
                  >
                    Código: {order.partner.code}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 0.5 }}
              >
                Esta venta fue generada a través de un link de referido.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                bgcolor: 'white',
                borderRadius: 1,
                border: '1px solid #e5e7eb',
              }}
            >
              <StoreIcon sx={{ color: '#6b7280' }} />
              <Box>
                <Typography
                  sx={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}
                >
                  Venta Directa
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Orgánica / Sin referido
                </Typography>
              </Box>
            </Box>
          )}
        </Card>

        {/* Dirección — mostrar solo si no es POS */}
        {order.sale_channel !== 'pos' && order.address && (
          <Card
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              bgcolor: '#F9FAFB',
              boxShadow: 'none',
              border: '1px solid #E5E7EB',
              height: 'fit-content',
            }}
          >
            <Typography
              variant='h6'
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Dirección de Envío
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    mb: 0.5,
                  }}
                >
                  Cliente:
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    color: '#1e293b',
                  }}
                >
                  {displayClientName}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    mb: 0.5,
                  }}
                >
                  Dirección:
                </Typography>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: '#6b7280',
                    }}
                  >
                    {order.address.addressLine1}
                  </Typography>
                  {order.address.addressLine2 && (
                    <Typography
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: '#6b7280',
                      }}
                    >
                      {order.address.addressLine2}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: '#6b7280',
                    }}
                  >
                    {order.address.city}, {order.address.state}
                  </Typography>
                  {order.address.postalCode && (
                    <Typography
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        color: '#6b7280',
                      }}
                    >
                      {order.address.postalCode}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      color: '#6b7280',
                    }}
                  >
                    {order.address.country}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default DashboardOrderPage;
