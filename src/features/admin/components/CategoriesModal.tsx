import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useAllCategories } from '@features/admin/hooks';
import { generateCategorySlug } from '@/actions/categories';
import toast from 'react-hot-toast';

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
}

export const CategoriesModal = ({ open, onClose }: CategoriesModalProps) => {
  const { categories, isLoading } = useAllCategories(); // refetch
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '' });
    setEditingId(null);
    setIsCreateMode(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateCategorySlug(name),
    });
  };

  const handleCreateClick = () => {
    setIsCreateMode(true);
    resetForm();
  };

  const handleEditClick = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    if (isCreateMode) {
      createCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
      });
    } else if (editingId) {
      updateCategory({
        id: editingId,
        data: {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
        },
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      deleteCategory(id);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const isPending = isCreating || isUpdating || isDeleting;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', pb: 2 }}>
        Gestión de Categorías
      </DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Formulario de crear/editar */}
            {(isCreateMode || editingId) && (
              <Box sx={{ mb: 3, p: 2, backgroundColor: '#f9fafb', borderRadius: 1 }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.name}
                  onChange={handleNameChange}
                  size="small"
                  sx={{ mb: 1.5 }}
                  disabled={isPending}
                />
                <TextField
                  fullWidth
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  size="small"
                  sx={{ mb: 1.5 }}
                  disabled={isPending}
                />
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  size="small"
                  multiline
                  rows={2}
                  disabled={isPending}
                />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isPending}
                    sx={{ backgroundColor: '#0007d7ff' }}
                  >
                    {isPending ? 'Guardando...' : isCreateMode ? 'Crear' : 'Actualizar'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            )}

            {/* Tabla de categorías */}
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                        No hay categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {category.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {category.slug}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {category.description || '-'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(category)}
                              disabled={isPending}
                              sx={{ color: '#0007d7ff' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(category.id)}
                              disabled={isPending}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          disabled={isPending || isCreateMode || editingId !== null}
          sx={{ backgroundColor: '#0007d7ff' }}
        >
          Crear Categoría
        </Button>
        <Button variant="outlined" onClick={onClose} disabled={isPending}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};