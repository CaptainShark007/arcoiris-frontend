import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdatePartner } from '../../hooks/partner/useUpdatePartner';
import { Partner, PartnerInput } from '@shared/types';

interface Props {
  open: boolean;
  onClose: () => void;
  partnerToEdit: Partner | null;
}

export const EditPartnerModal = ({ open, onClose, partnerToEdit }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<PartnerInput>({
    name: '', code: '', phone: '', email: '', address: '', schedule: '', map_url: '',
  });

  const { updatePartner, isUpdating } = useUpdatePartner();

  useEffect(() => {
    if (partnerToEdit) {
      setFormData({
        name: partnerToEdit.name || '',
        code: partnerToEdit.code || '',
        phone: partnerToEdit.phone || '',
        email: partnerToEdit.email || '',
        address: partnerToEdit.address || '',
        schedule: partnerToEdit.schedule || '',
        map_url: partnerToEdit.map_url || '',
      });
    }
  }, [partnerToEdit]);

  const handleChange = (field: keyof PartnerInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerToEdit) return;

    try {
      await updatePartner({ id: partnerToEdit.id, data: formData });
      onClose();
    } catch { 
      // El error se maneja en el hook con toast
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth='md' 
      fullWidth
      fullScreen={fullScreen}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Editar Socio
          {fullScreen && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Box
            display='grid'
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
            gap={3}
            mt={1}
          >
            {/* --- DATOS PRINCIPALES --- */}
            <TextField
              label='Nombre del Socio'
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              fullWidth
              disabled={isUpdating}
            />

            <TextField
              label='Código (Referido)'
              value={formData.code}
              fullWidth
              disabled={true}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              helperText='El código no es editable.'
            />

            {/* --- DATOS DE CONTACTO --- */}
            <TextField
              label='Teléfono / WhatsApp'
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              fullWidth
              disabled={isUpdating}
            />

            <TextField
              label='Email Público'
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              disabled={isUpdating}
            />

            <TextField
              label='Dirección Física'
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              fullWidth
              disabled={isUpdating}
              sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}
            />

            <TextField
              label='Horarios de Atención'
              value={formData.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              fullWidth
              sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}
              multiline
              rows={3}
            />

            {/* --- CONFIGURACIÓN DEL MAPA --- */}
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField
                label='URL del Mapa (src del iframe)'
                value={formData.map_url}
                onChange={(e) => handleChange('map_url', e.target.value)}
                fullWidth
                disabled={isUpdating}
                placeholder='https://www.google.com/maps/embed?pb=...'
                helperText="Ve a Google Maps -> Compartir -> Incorporar mapa -> Copia lo que está dentro de src='...'"
              />

              {formData.map_url && (
                <Box mt={2} p={1} bgcolor='#f0fdf4' borderRadius={1} border='1px solid #bbf7d0'>
                  <Typography variant='caption' color='success.main' fontWeight='bold'>
                    Vista previa habilitada
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color='inherit' disabled={isUpdating}>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' disabled={isUpdating} fullWidth={fullScreen}>
            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};