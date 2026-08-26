import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell
                key={i}
                sx={{
                  height: 48,
                  px: 2,
                  textAlign: i >= 4 ? 'center' : 'left',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#f3f4f6',
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
              sx={{ borderBottom: '1px solid #f3f4f6', '&:hover': { backgroundColor: '#f9fafb' } }}
            >
              <TableCell sx={{ p: 2, fontWeight: 700, fontSize: '0.85rem' }}>#{b.id}</TableCell>
              <TableCell sx={{ p: 2, fontSize: '0.85rem' }}>
                {b.admin_clients?.full_name ?? '—'}
              </TableCell>
              <TableCell sx={{ p: 2, fontSize: '0.85rem', color: '#6b7280' }}>
                {formatDateLong(b.created_at)}
              </TableCell>
              <TableCell sx={{ p: 2, fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
                {b.valid_until ? formatDateLong(b.valid_until) : '—'}
              </TableCell>
              <TableCell sx={{ p: 2, fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                {formatPrice(b.total_amount)}
              </TableCell>
              <TableCell sx={{ p: 2, textAlign: 'center' }}>
                <BudgetStatusChip status={b.status} />
              </TableCell>
              <TableCell sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title="Ver detalle" arrow>
                    <IconButton size="small" onClick={() => onView(b.id)} sx={{ color: '#2563eb' }}>
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
              <TableCell colSpan={headers.length} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay presupuestos para mostrar
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
