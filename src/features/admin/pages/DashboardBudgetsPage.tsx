import { Box, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Loader, SeoHead } from '@shared/components';
import CustomPagination from '@shared/components/CustomPagination';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useBudgets } from '../hooks/budget/useBudgets';
import { getBudgetById } from '@/actions/budgets';
import { generateBudgetPdf } from '../utils/budgetPdf';
import { BudgetTable } from '../components/budget/BudgetTable';
import { BudgetStatus } from '@shared/types';

const STATUS_OPTIONS: { value: BudgetStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los presupuestos' },
  { value: 'draft', label: 'Borradores' },
  { value: 'sent', label: 'Enviados' },
  { value: 'accepted', label: 'Aceptados' },
  { value: 'rejected', label: 'Rechazados' },
  { value: 'expired', label: 'Vencidos' },
  { value: 'converted', label: 'Convertidos' },
];

const DashboardBudgetsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState<BudgetStatus | 'all'>('all');

  const { data, isLoading } = useBudgets(page + 1, rowsPerPage, status);

  const handleChangePage = (newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (newRows: number) => {
    setRowsPerPage(newRows);
    setPage(0);
  };

  const handleStatusChange = (value: BudgetStatus | 'all') => {
    setStatus(value);
    setPage(0);
  };

  const handleDownloadPdf = async (id: number) => {
    try {
      const budget = await getBudgetById(id);
      generateBudgetPdf(budget);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo generar el PDF');
    }
  };

  const totalItems = data?.count || 0;
  const totalPage = Math.ceil(totalItems / rowsPerPage);

  if (isLoading) {
    return (
      <>
        <SeoHead title="Cargando presupuestos..." description="Cargando la lista de presupuestos" />
        <Loader />
      </>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, px: { xs: 1, sm: 0 } }}>
      <SeoHead title="Panel de Presupuestos" description="Gestión de presupuestos en el panel de administración" />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: '800', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Presupuestos
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
            <InputLabel id="budget-status-label">Filtrar por estado</InputLabel>
            <Select
              labelId="budget-status-label"
              value={status}
              label="Filtrar por estado"
              onChange={(e) => handleStatusChange(e.target.value as BudgetStatus | 'all')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Box>
      </Box>

      <Card
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          bgcolor: '#F9FAFB',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
      >
        <BudgetTable
          budgets={data?.data || []}
          onView={(id) => navigate(`/panel/presupuestos/${id}`)}
          onDownloadPdf={handleDownloadPdf}
        />
      </Card>

      <Box sx={{ px: { xs: 1, sm: 2 } }}>
        <CustomPagination
          page={page}
          totalPages={totalPage}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    </Box>
  );
};

export default DashboardBudgetsPage;
