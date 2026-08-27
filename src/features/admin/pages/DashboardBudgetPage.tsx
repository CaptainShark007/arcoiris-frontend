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
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  PictureAsPdf as PictureAsPdfIcon,
  WhatsApp as WhatsAppIcon,
  ArrowBackIos as ArrowBackIosIcon,
  CheckCircleOutline as CheckCircleIcon,
  SendOutlined as SendIcon,
  CancelOutlined as CancelIcon,
  HourglassDisabledOutlined as ExpireIcon,
  SwapHoriz as ConvertIcon,
} from '@mui/icons-material';
import { Loader, SeoHead } from '@shared/components';
import { useNavigate, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { formatPrice, formatDateLong } from '@/helpers';
import { useBudget } from '../hooks/budget/useBudget';
import { useUpdateBudgetStatus } from '../hooks/budget/useUpdateBudgetStatus';
import { useConvertBudget } from '../hooks/budget/useConvertBudget';
import { generateBudgetPdf } from '../utils/budgetPdf';
import { BudgetStatusChip } from '../components/budget/BudgetStatusChip';
import { BudgetStatus } from '@shared/types';

const normalizePhoneForWhatsapp = (phone?: string | null): string => {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54')) return `9${digits}`;
  return `549${digits}`;
};

const STATUS_ACTIONS: {
  status: BudgetStatus;
  label: string;
  icon: ReactNode;
  color: string;
}[] = [
  { status: 'sent', label: 'Marcar enviado', icon: <SendIcon fontSize="small" />, color: '#2563eb' },
  { status: 'accepted', label: 'Marcar aceptado', icon: <CheckCircleIcon fontSize="small" />, color: '#16a34a' },
  { status: 'rejected', label: 'Marcar rechazado', icon: <CancelIcon fontSize="small" />, color: '#dc2626' },
  { status: 'expired', label: 'Marcar vencido', icon: <ExpireIcon fontSize="small" />, color: '#a16207' },
];

const DashboardBudgetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const budgetId = Number(id);

  const { data: budget, isLoading } = useBudget(budgetId);
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateBudgetStatus(budgetId);
  const { mutate: convert, isPending: converting } = useConvertBudget(budgetId);

  if (isLoading || !budget) {
    return (
      <>
        <SeoHead title="Cargando presupuesto..." description="Cargando el detalle del presupuesto" />
        <Loader />
      </>
    );
  }

  const isConverted = budget.status === 'converted';
  const clientName = budget.client?.full_name ?? 'Cliente no asignado';
  const clientPhone = budget.client?.phone;

  const whatsappNumber = normalizePhoneForWhatsapp(clientPhone);

  const buildWhatsappMessage = () => {
    const itemsList = budget!.items
      .map(
        (item) =>
          `• ${item.quantity} u. - ${item.productName} (${[
            item.color_name,
            item.storage,
            item.finish,
          ]
            .filter(Boolean)
            .join(' - ')}) - ${formatPrice(item.price)}`
      )
      .join('\n');

    return (
      `¡Hola ${clientName}! Te compartimos el detalle de tu presupuesto.\n\n` +
      `Nro de Presupuesto: #${budget!.id}\n` +
      `Válido hasta: ${budget!.valid_until ? formatDateLong(budget!.valid_until) : '—'}\n\n` +
      `Detalle:\n${itemsList}\n\n` +
      `Total: ${formatPrice(budget!.total_amount)}\n\n` +
      `¡Gracias por confiar en Arcoiris!`
    );
  };

  const handleSendWhatsapp = () => {
    if (!whatsappNumber) return;
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildWhatsappMessage())}`,
      '_blank'
    );
  };

  const handleDownloadPdf = () => generateBudgetPdf(budget!);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        px: { xs: 1, sm: 0 },
      }}
    >
      <SeoHead
        title={`Presupuesto n${id}`}
        description={`Detalles del presupuesto n${id} en el panel de administración`}
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
          onClick={() => navigate('/panel/presupuestos')}
          sx={{ transition: 'all 300ms', '&:hover': { transform: 'scale(1.05)' }, flexShrink: 0 }}
        >
          <ArrowBackIosIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
        </IconButton>

        <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            Presupuesto #{id}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            {formatDateLong(budget.created_at)} · Vigencia: {budget.validity_days} días
          </Typography>
        </Box>

        <BudgetStatusChip status={budget.status} size="medium" />
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
        <Tooltip
          title={whatsappNumber ? 'Enviar por WhatsApp' : 'El cliente no tiene teléfono'}
          arrow
        >
          <span>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={handleSendWhatsapp}
              disabled={!whatsappNumber}
              sx={{
                bgcolor: '#25D366',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#1EBE57' },
                '&.Mui-disabled': { bgcolor: 'rgba(37, 211, 102, 0.4)', color: 'rgba(255,255,255,0.8)' },
              }}
            >
              Enviar por WhatsApp
            </Button>
          </span>
        </Tooltip>

        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleDownloadPdf}
          sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
        >
          Descargar PDF
        </Button>

        {!isConverted && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ConvertIcon />}
            onClick={() => convert()}
            disabled={converting}
            sx={{ textTransform: 'none', whiteSpace: 'nowrap', fontWeight: 700 }}
          >
            {converting ? 'Convirtiendo...' : 'Convertir a venta'}
          </Button>
        )}
      </Box>

      {/* Cambio de estado */}
      {!isConverted && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {STATUS_ACTIONS.map((action) => (
            <Button
              key={action.status}
              variant="outlined"
              size="small"
              startIcon={action.icon}
              onClick={() => updateStatus(action.status)}
              disabled={updatingStatus || budget.status === action.status}
              sx={{
                textTransform: 'none',
                color: action.color,
                borderColor: action.color,
                '&:hover': { borderColor: action.color, bgcolor: `${action.color}10` },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}

      {isConverted && budget.converted_order_id && (
        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(124,58,237,0.08)',
            borderRadius: 1,
            border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <ConvertIcon sx={{ color: '#6d28d9' }} />
          <Typography sx={{ fontSize: '0.85rem', color: '#6d28d9', fontWeight: 600 }}>
            Convertido a la orden #{budget.converted_order_id}
          </Typography>
          <Button
            size="small"
            sx={{ textTransform: 'none', color: '#6d28d9', ml: 'auto' }}
            onClick={() => navigate(`/panel/pedidos/${budget.converted_order_id}`)}
          >
            Ver orden
          </Button>
        </Box>
      )}

      {/* Cliente */}
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
        <PersonIcon sx={{ color: '#2563eb' }} />
        <Box>
          <Typography sx={{ fontWeight: 600, color: '#1e3a8a', fontSize: '0.9rem' }}>
            {clientName}
          </Typography>
          {budget.client?.phone && (
            <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 500 }}>
              {budget.client.phone}
            </Typography>
          )}
          {budget.client?.email && (
            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
              {budget.client.email}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Tabla de items */}
      <Card
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          bgcolor: '#F9FAFB',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {['Producto', 'Cantidad', 'Precio', 'Total'].map((header, i) => (
                <TableCell
                  key={i}
                  sx={{
                    height: 48,
                    px: 2,
                    textAlign: i === 0 ? 'left' : 'right',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {budget.items.map((item, index) => (
              <TableRow key={index} sx={{ borderBottom: '1px solid #f3f4f6' }}>
                <TableCell sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      component="img"
                      src={item.image || '/assets/images/img-default.png'}
                      alt={item.productName}
                      sx={{ height: 60, width: 60, objectFit: 'contain', borderRadius: 1, flexShrink: 0 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.productName}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {[item.color_name, item.storage, item.finish].filter(Boolean).join(' • ')}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ p: 2, textAlign: 'right', fontWeight: 600, fontSize: '0.85rem' }}>
                  {item.quantity}
                </TableCell>
                <TableCell sx={{ p: 2, textAlign: 'right', fontWeight: 600, fontSize: '0.85rem' }}>
                  {formatPrice(item.price)}
                </TableCell>
                <TableCell sx={{ p: 2, textAlign: 'right', fontWeight: 700, fontSize: '0.85rem' }}>
                  {formatPrice(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Resumen y observaciones */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: { xs: 2, lg: 3 },
        }}
      >
        <Card
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: '#F9FAFB',
            boxShadow: 'none',
            border: '1px solid #E5E7EB',
            height: 'fit-content',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Resumen
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatPrice(budget.total_amount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Total</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0007d7ff' }}>
                {formatPrice(budget.total_amount)}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>Vigencia</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {budget.validity_days} días
                {budget.valid_until ? ` (hasta ${formatDateLong(budget.valid_until)})` : ''}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: '#F9FAFB',
            boxShadow: 'none',
            border: '1px solid #E5E7EB',
            height: 'fit-content',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Observaciones
          </Typography>
          {budget.notes ? (
            <Typography sx={{ fontSize: '0.85rem', color: '#374151', whiteSpace: 'pre-wrap' }}>
              {budget.notes}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>Sin observaciones</Typography>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardBudgetPage;
