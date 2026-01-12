import { useState } from 'react';
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
  Button,
  Stack,
  Divider
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { Partner } from '@/shared/types/partner';
import { useDeletePartner } from '../../hooks/partner/useDeletePartner';
import { useTogglePartner } from '../../hooks/partner/useTogglePartner';
import { EditPartnerModal } from './EditPartnerModal';

interface Props {
  partners: Partner[];
  isLoading: boolean;
}

export const PartnersTable = ({ partners, isLoading }: Props) => {
  const { deletePartner, isDeleting } = useDeletePartner();
  const { togglePartner, isToggling } = useTogglePartner();
  
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

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
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {partners.map((partner) => (
            <Card 
              key={partner.id}
              sx={{ p: 2, border: '1px solid #e5e7eb', borderRadius: 2, position: 'relative' }}
            >
              {/* Header: Nombre y Estado */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography fontWeight={600} variant="h6" sx={{ fontSize: '1rem' }}>
                    {partner.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Creado: {new Date(partner.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip 
                  label={partner.is_active ? 'Activo' : 'Inactivo'} 
                  color={partner.is_active ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Información de Contacto (Iconos) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                 <Tooltip title={partner.phone || "Sin teléfono"}>
                    <PhoneIcon fontSize="small" color={partner.phone ? "action" : "disabled"} />
                 </Tooltip>
                 <Tooltip title={partner.email || "Sin email"}>
                    <EmailIcon fontSize="small" color={partner.email ? "action" : "disabled"} />
                 </Tooltip>
                 <Tooltip title={partner.map_url ? "Mapa configurado" : "Sin mapa"}>
                    <MapIcon fontSize="small" color={partner.map_url ? "primary" : "disabled"} />
                 </Tooltip>
              </Box>

              {/* Link Referido */}
              <Box 
                onClick={() => handleCopyLink(partner.code)}
                sx={{ 
                  bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, mb: 2, 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  cursor: 'pointer', border: '1px dashed #cbd5e1'
                }}
              >
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Código Referido</Typography>
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#0f172a' }}>
                        {partner.code}
                    </Typography>
                </Box>
                <CopyIcon fontSize="small" sx={{ color: '#94a3b8' }} />
              </Box>

              {/* Botones de Acción */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                 <Button 
                   size="small" 
                   variant="outlined" 
                   startIcon={<EditIcon />} 
                   onClick={() => setEditingPartner(partner)}
                   fullWidth
                 >
                   Editar
                 </Button>
                 
                 <IconButton 
                   size="small" 
                   onClick={() => handleToggle(partner.id, !!partner.is_active)}
                   color={partner.is_active ? 'warning' : 'success'}
                   sx={{ border: '1px solid', borderColor: 'divider' }}
                 >
                   {partner.is_active ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                 </IconButton>

                 <IconButton 
                   size="small" 
                   color="error" 
                   onClick={() => handleDelete(partner.id)}
                   sx={{ border: '1px solid', borderColor: 'error.main', bgcolor: '#fef2f2' }}
                 >
                   <DeleteIcon fontSize="small" />
                 </IconButton>
              </Box>
            </Card>
          ))}
        </Box>
        
        <EditPartnerModal 
          open={!!editingPartner} 
          partnerToEdit={editingPartner} 
          onClose={() => setEditingPartner(null)} 
        />
      </>
    );
  }

  // --- VISTA DESKTOP (TABLA) ---
  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Datos Contacto</TableCell>
              <TableCell>Link Referido</TableCell>
              <TableCell>Estado</TableCell>
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
                  <Stack direction="row" spacing={1}>
                    {/* Icono Teléfono */}
                    {partner.phone ? (
                        <Tooltip title={`Tel: ${partner.phone}`}>
                            <PhoneIcon fontSize="small" color="action" />
                        </Tooltip>
                    ) : (
                        <PhoneIcon fontSize="small" color="disabled" sx={{ opacity: 0.2 }} />
                    )}

                    {/* Icono Email */}
                    {partner.email ? (
                        <Tooltip title={partner.email}>
                            <EmailIcon fontSize="small" color="action" />
                        </Tooltip>
                    ) : (
                        <EmailIcon fontSize="small" color="disabled" sx={{ opacity: 0.2 }} />
                    )}

                    {/* Icono Mapa */}
                    {partner.map_url ? (
                        <Tooltip title="Mapa configurado">
                            <MapIcon fontSize="small" color="primary" />
                        </Tooltip>
                    ) : (
                        <MapIcon fontSize="small" color="disabled" sx={{ opacity: 0.2 }} />
                    )}
                  </Stack>
                </TableCell>

                <TableCell>
                  <Box 
                    onClick={() => handleCopyLink(partner.code)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>/?ref={partner.code}</Typography>
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
                
                <TableCell align="right">
                  <Box display="flex" gap={1} justifyContent="flex-end">
                    
                    <Tooltip title="Editar">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => setEditingPartner(partner)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

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

      <EditPartnerModal 
        open={!!editingPartner} 
        partnerToEdit={editingPartner} 
        onClose={() => setEditingPartner(null)} 
      />
    </>
  );
};