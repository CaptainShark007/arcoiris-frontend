import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme, 
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCreatePartner } from '../../hooks/partner/useCreatePartner';
import { PartnerInput } from '@shared/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreatePartnerModal = ({ open, onClose }: Props) => {
  // Hooks para responsive
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<PartnerInput>({
    name: '', code: '', phone: '', email: '', address: '', schedule: '', map_url: ''
  });
  
  const { createPartner, isLoading } = useCreatePartner();

  const handleChange = (field: keyof PartnerInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPartner(formData); 
      setFormData({ name: '', code: '', phone: '', email: '', address: '', schedule: '', map_url: '' });
      onClose();
    } catch { 
      // El error se maneja en el hook con toast
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={fullScreen}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Nuevo Socio / Referido
          {fullScreen && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3} mt={1}>
            
            <TextField
              label="Nombre del Socio"
              placeholder="Ej: Juan Perez"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              disabled={isLoading}
            />
            
            <TextField
              label="Código de Referido"
              placeholder="Ej: JUAN20"
              fullWidth
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              required
              disabled={isLoading}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              helperText="Nota: Este código NO se podrá modificar una vez creado."
              FormHelperTextProps={{ sx: { color: 'warning.main' } }}
            />

            <TextField
              label="Teléfono / WhatsApp"
              placeholder="+54 9 ..."
              fullWidth
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={isLoading}
            />

            <TextField
              label="Email de Contacto"
              placeholder="socio@email.com"
              fullWidth
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={isLoading}
            />

            <TextField
              label="Dirección Física"
              fullWidth
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={isLoading}
              sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}
            />

            <TextField
              label="Horarios de Atención"
              placeholder={'Ej: Lun-Vie 08-12 y 16-20 \nSábados 08-12'}
              value={formData.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              fullWidth
              disabled={isLoading}
              sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}
              multiline
              rows={3} 
            />

            <TextField
              label="URL del Mapa (src del iframe)"
              fullWidth
              value={formData.map_url || ''}
              onChange={(e) => handleChange('map_url', e.target.value)}
              disabled={isLoading}
              sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}
              placeholder="http://googleusercontent.com/maps.google.com/..."
              helperText="Ve a Google Maps -> Compartir -> Incorporar mapa -> Copia lo que está dentro de src='...'"
            />

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isLoading} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isLoading || !formData.name || !formData.code} fullWidth={fullScreen}>
            {isLoading ? 'Creando...' : 'Crear Socio'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};