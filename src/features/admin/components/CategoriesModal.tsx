import { useState } from 'react';
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
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useDeleteCategory, useAllCategories, useCountProductsByCategory } from '@features/admin/hooks';
import { CategoryFormModal } from './CategoryFormModal';
import { DeleteCategoryModal } from '@shared/components';

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
}

export const CategoriesModal = ({ open, onClose }: CategoriesModalProps) => {
  const { categories, isLoading } = useAllCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const handleCreateClick = () => {
    setFormMode('create');
    setSelectedCategory(null);
    setFormModalOpen(true);
  };

  const handleEditClick = (category: any) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setFormModalOpen(true);
  };

  const handleFormModalClose = () => {
    setFormModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory({
        id: categoryToDelete.id,
        imageUrl: categoryToDelete.image,
      });
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const isPending = isDeleting;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 2, borderBottom: '1px solid #e5e7eb', bgcolor: '#f9fafb' }}>
          Gestión de Categorías
        </DialogTitle>

        <DialogContent sx={{ minHeight: 400, bgcolor: '#f9fafb' }}>
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
            <Box sx={{ width: '100%', overflow: 'auto', bgcolor: '#f9fafb', p: 2, mt: 2, border: '1px solid #e5e7eb', borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Imagen</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
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
                        <TableCell sx={{ p: 1 }}>
                          {category.image ? (
                            <Box
                              component="img"
                              src={category.image}
                              alt={category.name}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: 'contain',
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                backgroundColor: '#f3f4f6',
                                borderRadius: 1,
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                color: '#9ca3af',
                              }}
                            >
                              Sin imagen
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {category.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {category.description || 'Sin descripción'}
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
                              onClick={() => handleDeleteClick(category)}
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
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            disabled={isPending}
            sx={{ backgroundColor: '#0007d7ff' }}
          >
            Crear Categoría
          </Button>
          <Button variant="outlined" onClick={onClose} disabled={isPending}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal del formulario */}
      <CategoryFormModal
        open={formModalOpen}
        onClose={handleFormModalClose}
        mode={formMode}
        category={selectedCategory}
      />

      {/* Modal de eliminación */}
      {categoryToDelete && (
        <DeleteCategoryModalWrapper
          open={deleteModalOpen}
          category={categoryToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={isPending}
        />
      )}
    </>
  );
};

// Componente wrapper que usa el hook para contar productos
const DeleteCategoryModalWrapper = ({
  open,
  category,
  onConfirm,
  onCancel,
  isLoading,
}: {
  open: boolean;
  category: any;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  const { count } = useCountProductsByCategory(category?.id);

  return (
    <DeleteCategoryModal
      open={open}
      categoryName={category?.name}
      hasImage={!!category?.image}
      productsCount={count}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
};