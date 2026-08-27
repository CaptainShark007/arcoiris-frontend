import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { BudgetListItem } from '@shared/types';
import { BudgetStatusChip } from './BudgetStatusChip';
import { formatPrice, formatDateLong } from '@/helpers';

interface BudgetTableProps {
  budgets: BudgetListItem[];
  onView: (id: number) => void;
  onDownloadPdf: (id: number) => void;
}

export const BudgetTable = ({ budgets, onView, onDownloadPdf }: BudgetTableProps) => {
  const headers = ['N°', 'Cliente', 'Fecha', 'Vencimiento', 'Total', 'Estado', 'Acciones'];

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table sx={{ minWidth: 720 }}>
        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell
                key={i}
                sx={{
                  height: 48,
                  px: 2,
                  textAlign: i >= 4 ? 'center' : 'left',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#6B7280',
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {budgets.map((b) => (
            <TableRow
              key={b.id}
              sx={{
                borderBottom: '1px solid #E5E7EB',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#f1f1f1' },
                cursor: 'pointer',
              }}
              onClick={() => onView(b.id)}
            >
              <TableCell sx={{ py: 1.5, px: 2, fontWeight: 700, fontSize: '0.85rem', borderBottom: '1px solid #E5E7EB' }}>#{b.id}</TableCell>
              <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.85rem', borderBottom: '1px solid #E5E7EB' }}>
                {b.admin_clients?.full_name ?? '—'}
              </TableCell>
              <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.85rem', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                {formatDateLong(b.created_at)}
              </TableCell>
              <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.85rem', color: '#6B7280', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                {b.valid_until ? formatDateLong(b.valid_until) : '—'}
              </TableCell>
              <TableCell sx={{ py: 1.5, px: 2, fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                {formatPrice(b.total_amount)}
              </TableCell>
              <TableCell sx={{ py: 1.5, px: 2, textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                <BudgetStatusChip status={b.status} />
              </TableCell>
              <TableCell sx={{ py: 1.5, px: 2, textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title="Descargar PDF" arrow>
                    <IconButton size="small" onClick={() => onDownloadPdf(b.id)} sx={{ color: '#6b7280' }}>
                      <PictureAsPdfOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}

          {budgets.length === 0 && (
            <TableRow>
              <TableCell colSpan={headers.length} sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No se encontraron presupuestos
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Intenta cambiar el filtro de estado.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
