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
  CircularProgress,
  Card,
  useMediaQuery,
  useTheme,
  Button
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon
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
  
  // Hooks para detectar móvil
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
        <Typography color="text.secondary">No hay socios registrados aún.</Typography>
      </Paper>
    );
  }

  // --- VISTA MÓVIL (TARJETAS) ---
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {partners.map((partner) => (
          <Card 
            key={partner.id}
            sx={{ 
              p: 2, 
              border: '1px solid #e5e7eb', 
              borderRadius: 2,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            {/* Header Tarjeta */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ bgcolor: '#eff6ff', p: 1, borderRadius: '50%' }}>
                   <PersonIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                    {partner.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Creado: {new Date(partner.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={partner.is_active ? 'Activo' : 'Inactivo'} 
                color={partner.is_active ? 'success' : 'default'}
                size="small"
                variant="outlined"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            </Box>

            {/* Código / Link */}
            <Box 
              onClick={() => handleCopyLink(partner.code)}
              sx={{ 
                bgcolor: '#f8fafc', 
                p: 1.5, 
                borderRadius: 1, 
                border: '1px dashed #cbd5e1',
                mb: 2,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:active': { bgcolor: '#e2e8f0' }
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ display: 'block', color: '#64748b', mb: 0.5 }}>
                  Código de referido
                </Typography>
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#0f172a' }}>
                  {partner.code}
                </Typography>
              </Box>
              <CopyIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
            </Box>

            {/* Acciones */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
               <Button 
                 size="small" 
                 variant="outlined"
                 color={partner.is_active ? 'warning' : 'success'}
                 onClick={() => handleToggle(partner.id, !!partner.is_active)}
                 disabled={isToggling}
                 startIcon={partner.is_active ? <BlockIcon /> : <CheckIcon />}
               >
                 {partner.is_active ? 'Desactivar' : 'Activar'}
               </Button>
               <IconButton 
                 size="small" 
                 color="error"
                 onClick={() => handleDelete(partner.id)}
                 disabled={isDeleting}
                 sx={{ border: '1px solid #fecaca', bgcolor: '#fef2f2' }}
               >
                 <DeleteIcon fontSize="small" />
               </IconButton>
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  // --- VISTA DESKTOP (TABLA ORIGINAL) ---
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead sx={{ bgcolor: 'grey.100' }}>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Link Referido</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Creado</TableCell>
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
                  sx={{ fontWeight: 'bold', borderRadius: 1, bgcolor: '#eff6ff', color: '#1d4ed8' }} 
                />
              </TableCell>

              <TableCell>
                <Box 
                  onClick={() => handleCopyLink(partner.code)}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    cursor: 'pointer',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    /?ref={partner.code}
                  </Typography>
                  <CopyIcon fontSize="small" sx={{ fontSize: 16 }} />
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={partner.is_active ? 'Activo' : 'Inactivo'} 
                  color={partner.is_active ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                {new Date(partner.created_at).toLocaleDateString()}
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