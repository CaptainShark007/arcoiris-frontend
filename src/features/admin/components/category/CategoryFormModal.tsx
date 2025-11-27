import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useCreateCategory, useUpdateCategory } from '@features/admin/hooks';
import { generateCategorySlug } from '@/actions/categories';
import toast from 'react-hot-toast';
import { compressImageCategory } from '@/helpers';
import CancelIcon from '@mui/icons-material/Cancel';

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  category?: any;
}

export const CategoryFormModal = ({
  open,
  onClose,
  mode,
  category,
}: CategoryFormModalProps) => {
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: null as File | null,
    imagePreview: '',
  });

  const [isCompressing, setIsCompressing] = useState(false);

  // Pre-llenar datos si es edición
  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: null,
        imagePreview: category.image || '',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: null,
        imagePreview: '',
      });
    }
  }, [mode, category, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateCategorySlug(name),
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      // Validar tipo
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
          file.type
        )
      ) {
        toast.error('Solo se permiten imágenes JPEG, PNG o WEBP');
        return;
      }

      // Validar tamaño antes de comprimir
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe exceder 5MB');
        return;
      }

      // Comprimir si es mayor a 1.5MB
      setIsCompressing(true);
      try {
        let processedFile = file;
        if (file.size > 1.5 * 1024 * 1024) {
          processedFile = await compressImageCategory(file, 1.5);
        }

        const previewUrl = URL.createObjectURL(processedFile);
        setFormData({
          ...formData,
          image: processedFile,
          imagePreview: previewUrl,
        });

        /* toast.success(
          `Imagen ${file.size > 1.5 * 1024 * 1024 ? 'comprimida' : 'cargada'} correctamente`
        ); */
        toast.success('Imagen procesada correctamente');
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Error al procesar la imagen');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: '',
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    if (mode === 'create') {
      // Para crear, la imagen es recomendada pero no obligatoria
      createCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        image: formData.image || undefined,
      } as any);
    } else if (mode === 'edit' && category) {
      // Para editar, solo actualizar campos que cambiaron
      updateCategory({
        id: category.id,
        data: {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          //...(formData.image && { image: formData.image }),
          image: formData.image === null && !formData.imagePreview 
            ? null 
            : formData.image || undefined,
        },
      });
    }

    onClose();
  };

  const isPending = isCreating || isUpdating || isCompressing;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      sx={{ gap: 2 }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          bgcolor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {mode === 'create' ? 'Crear Categoría' : 'Editar Categoría'}
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: 2,
          bgcolor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {/* Nombre */}
        <TextField
          fullWidth
          label='Nombre'
          value={formData.name}
          onChange={handleNameChange}
          disabled={isPending}
          size='small'
          sx={{ mt: 2 }}
          required
        />

        {/* Slug */}
        <TextField
          fullWidth
          label='Slug'
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          disabled={isPending}
          size='small'
          helperText='Se genera automáticamente desde el nombre'
          required
        />

        {/* Descripción */}
        <TextField
          fullWidth
          label='Descripción (opcional)'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={isPending}
          size='small'
          multiline
          rows={3}
        />

        {/* Imagen */}
        <Box>
          <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>
            Imagen de la Categoría
          </Typography>

          {formData.imagePreview && (
            <Box
              sx={{
                mb: 2,
                position: 'relative',
                width: 150,
                height: 150,
                border: '1px solid #e5e7eb',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                component='img'
                src={formData.imagePreview}
                alt='Preview'
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  p: 1,
                }}
              />
              <Button
                onClick={handleRemoveImage}
                disabled={isPending}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 'auto',
                  p: 0,
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <CancelIcon sx={{ color: '#ef4444', fontSize: '1.5rem' }} />
              </Button>
            </Box>
          )}

          <Button
            component='label'
            variant='outlined'
            disabled={isPending || isCompressing}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            {isCompressing ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Procesando imagen...
              </>
            ) : (
              'Seleccionar Imagen'
            )}
            <input
              type='file'
              accept='image/*'
              hidden
              onChange={handleImageChange}
              disabled={isPending || isCompressing}
            />
          </Button>

          <Typography
            variant='caption'
            sx={{ display: 'block', mt: 1, color: '#6b7280' }}
          >
            Solo puedes subir 1 sola imagene por categoría. Formatos permitidos:
            JPEG, PNG, WEBP.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 1,
          bgcolor: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <Button
          variant='outlined'
          onClick={onClose}
          disabled={isPending || isCompressing}
        >
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={isPending || isCompressing}
          sx={{ backgroundColor: '#0007d7ff' }}
        >
          {isPending
            ? 'Guardando...'
            : mode === 'create'
              ? 'Crear'
              : 'Actualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
