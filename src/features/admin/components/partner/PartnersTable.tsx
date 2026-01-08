import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { Partner } from '@/shared/types/partner';
import { useDeletePartner } from '../../hooks/partner/useDeletePartner';
import { useTogglePartner } from '../../hooks/partner/useTogglePartner';

interface Props {
  partners: Partner[];
  isLoading: boolean;
}

export const PartnersTable = ({ partners, isLoading }: Props) => {
  const { deletePartner, isDeleting } = useDeletePartner();
  const { togglePartner, isToggling } = useTogglePartner();

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado al portapapeles');
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este socio?')) {
      await deletePartner(id);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await togglePartner({ id, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (partners.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No hay socios registrados aún.</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Link</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id} hover>
              <TableCell sx={{ fontWeight: 500 }}>{partner.name}</TableCell>
              
              <TableCell>
                <Chip 
                  label={partner.code} 
                  size="small" 
                  sx={{ fontWeight: 'bold', borderRadius: 1 }} 
                />
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={partner.is_active ? 'Activo' : 'Inactivo'} 
                  color={partner.is_active ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell>
                <Tooltip title="Copiar link de referido">
                  <IconButton onClick={() => handleCopyLink(partner.code)} size="small" color="primary">
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
              
              <TableCell align="right">
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Tooltip title={partner.is_active ? "Desactivar" : "Activar"}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggle(partner.id, !!partner.is_active)}
                      disabled={isToggling}
                      color={partner.is_active ? 'warning' : 'success'}
                    >
                      {partner.is_active ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(partner.id)}
                      disabled={isDeleting}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};