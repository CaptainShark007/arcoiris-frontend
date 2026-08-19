import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { adminClientSchema, AdminClientFormData } from '@features/admin/schema/adminClientSchema';
import { AdminClient } from '@shared/types/admin-client';

interface AdminClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: AdminClientFormData) => void;
  client?: AdminClient | null;
  loading?: boolean;
}

export const AdminClientFormDialog = ({
  open,
  onClose,
  onSave,
  client,
  loading,
}: AdminClientFormDialogProps) => {
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminClientFormData>({
    resolver: yupResolver(adminClientSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: null,
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (client) {
        reset({
          full_name: client.full_name,
          phone: client.phone,
          email: client.email,
          is_active: client.is_active,
        });
      } else {
        reset({
          full_name: '',
          phone: '',
          email: null,
          is_active: true,
        });
      }
    }
  }, [open, client, reset]);

  const onSubmit = (data: AdminClientFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="admin-client-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <TextField
            label="Nombre completo"
            {...register('full_name')}
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
            fullWidth
            autoFocus
          />
          <TextField
            label="Teléfono"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
            inputProps={{ inputMode: 'numeric' }}
          />
          <TextField
            label="Email (opcional)"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            type="email"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="admin-client-form"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
