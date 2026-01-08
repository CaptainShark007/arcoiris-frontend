import React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { useCreatePartner } from '../../hooks/partner/useCreatePartner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreatePartnerModal = ({ open, onClose }: Props) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  
  const { createPartner, isLoading } = useCreatePartner();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPartner({ name, code });
      // Limpiar y cerrar solo si fue exitoso
      setName('');
      setCode('');
      onClose();
    } catch {
      // El hook ya maneja el toast de error
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nuevo Socio / Referido</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Nombre del Socio"
              placeholder="Ej: Juan Perez, Influencer Tech"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
            
            <Box>
              <TextField
                label="Código de Referido"
                placeholder="Ej: JUAN20"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                disabled={isLoading}
                helperText="Este código se usará en la URL: ?ref=CODIGO"
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
              {code && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Preview: {window.location.origin}/?ref={code}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading || !name || !code}
          >
            {isLoading ? 'Creando...' : 'Crear Socio'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};