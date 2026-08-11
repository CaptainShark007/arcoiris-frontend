import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack,
  Chip,
} from '@mui/material';
import { Loader } from '@shared/components';
import CustomPagination from '@shared/components/CustomPagination';
import { useAllCategories } from '../../hooks/category/useAllCategories';
import { useDeleteCategory } from '../../hooks/category/useDeleteCategory';
import { useCountProductsByCategory } from '../../hooks/category/useCountProductsByCategory';
import { useCreateCategory, useUpdateCategory, useGetCategoryById } from '@features/admin/hooks';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

const DEFAULT_IMAGE = 'https://xtfkrazrpzbucxirunqe.supabase.co/storage/v1/object/public/product-images/img-default.png';

interface CategoryFormValues {
  name: string;
  description: string;
}

const CategoryModal = ({
  open,
  onClose,
  categoryId,
}: {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(categoryId);

  const [formData, setFormData] = useState<CategoryFormValues>({
    name: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const { category, isLoading: isLoadingCategory } = useGetCategoryById(categoryId || '');
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isLoading = isCreating || isUpdating || isLoadingCategory;

  useEffect(() => {
    if (open) {
      if (category && isEditing) {
        setFormData({
          name: category.name || '',
          description: category.description || '',
        });
        setImagePreview(category.image || null);
      } else if (!isEditing) {
        setFormData({ name: '', description: '' });
        setImagePreview(null);
      }
      setImageFile(null);
      setImageToDelete(null);
    }
  }, [open, category, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageToDelete(category?.image || null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (category?.image) setImageToDelete(category.image);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    const payload: any = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
    };

    if (imageFile) {
      payload.image = imageFile;
    } else if (imageToDelete) {
      payload.image = null;
    }

    if (isEditing && categoryId) {
      updateCategory({ id: categoryId, data: payload }, { onSuccess: onClose });
    } else {
      createCategory(payload, { onSuccess: onClose });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, overflow: 'hidden' },
      }}
    >
      <Box sx={{ bgcolor: '#F9FAFB', px: 3, py: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={700} color="#111827">
              {isEditing ? 'Editar categoría' : 'Nueva categoría'}
            </Typography>
            <Chip 
              size="small" 
              label={isEditing ? 'Editando' : 'Nuevo'} 
              sx={{ 
                bgcolor: isEditing ? '#DBEAFE' : '#DCFCE7', 
                color: isEditing ? '#1D4ED8' : '#166534', 
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 22,
              }} 
            />
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: '#6B7280' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" fontWeight={600} color="#374151" mb={1.5}>
              Información general
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Nombre de la categoría"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
                fullWidth
                size="medium"
                placeholder="Ej: Pinturas y Barnices"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 1,
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9CA3AF' },
                  },
                }}
              />
              <TextField
                label="Descripción (opcional)"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                fullWidth
                multiline
                rows={2}
                size="medium"
                placeholder="Describe brevemente esta categoría..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600} color="#374151" mb={1.5}>
              Imagen de la categoría
            </Typography>
            <Box 
              sx={{ 
                position: 'relative', 
                width: '100%', 
                height: 200, 
                borderRadius: 1, 
                overflow: 'hidden', 
                border: '1px solid #E5E7EB', 
                bgcolor: '#F9FAFB',
              }}
            >
              {imagePreview ? (
                <>
                  <Box 
                    component="img" 
                    src={imagePreview} 
                    alt="Preview" 
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.2s',
                    }} 
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      inset: 0, 
                      bgcolor: 'rgba(0,0,0,0.5)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      opacity: 0, 
                      transition: 'opacity 0.2s', 
                      '&:hover': { opacity: 1 } 
                    }}
                  >
                    <Button 
                      variant="contained" 
                      onClick={() => fileInputRef.current?.click()} 
                      sx={{ 
                        bgcolor: '#fff', 
                        color: '#111827', 
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#F3F4F6' }, 
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      Cambiar imagen
                    </Button>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={handleRemoveImage} 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#F3F4F6' },
                    p: 2,
                  }} 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Box 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: '50%', 
                      bgcolor: '#E5E7EB', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 32, color: '#9CA3AF' }} />
                  </Box>
                  <Typography variant="body2" fontWeight={500} color="#374151" mb={0.5}>
                    Haz clic para subir una imagen
                  </Typography>
                  <Typography variant="caption" color="#9CA3AF">
                    PNG, JPG hasta 2MB
                  </Typography>
                </Box>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={handleImageChange} 
              />
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <Box sx={{ px: 3, py: 2, bgcolor: '#F9FAFB', borderTop: '1px solid #E5E7EB', display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ 
            borderColor: '#E5E7EB', 
            color: '#6B7280', 
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { borderColor: '#9CA3AF', bgcolor: '#F3F4F6' },
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!formData.name.trim()} 
          sx={{ 
            backgroundColor: '#0007d7ff', 
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#0005a0ff', boxShadow: '0px 4px 12px rgba(0, 7, 215, 0.2)' },
            '&.Mui-disabled': { bgcolor: '#E5E7EB', color: '#9CA3AF' },
          }}
        >
          {isEditing ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </Box>
    </Dialog>
  );
};

export const TableCategory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const { categories, isLoading } = useAllCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string; image: string | null } | null>(null);

  const paginatedCategories = categories?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  const handleOpenModal = (categoryId: string | null = null) => {
    setEditingCategoryId(categoryId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategoryId(null);
  };

  const handleOpenDeleteDialog = (category: { id: string; name: string; image: string | null }) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTimeout(() => setCategoryToDelete(null), 200);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory({ id: categoryToDelete.id, imageUrl: categoryToDelete.image }, { onSuccess: handleCloseDeleteDialog });
    }
  };

  const StatusChip = ({ isActive }: { isActive: boolean }) => (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 700, bgcolor: isActive ? '#DCFCE7' : '#E5E7EB', color: isActive ? '#14532D' : '#1F2937', border: '1px solid', borderColor: isActive ? '#22C55E' : '#9CA3AF' }}>
      {isActive ? 'Activa' : 'Inactiva'}
    </Box>
  );

  const renderDesktopView = () => (
    <TableContainer sx={{ borderRadius: 1, overflow: 'auto', border: '1px solid #F3F4F6' }}>
      <Table sx={{ minWidth: 600 }}>
        <TableHead sx={{ bgcolor: '#F9FAFB' }}>
          <TableRow>
            {['Categoría', 'Descripción', 'Estado', 'Productos', ''].map((h, i) => (
              <TableCell key={i} align={i === 4 ? 'right' : 'left'} sx={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB', py: 2 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!paginatedCategories.length ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>No se encontraron categorías</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            paginatedCategories.map((category) => (
              <TableRow key={category.id} sx={{ transition: 'background-color 0.2s', '&:hover': { bgcolor: '#F8FAFC' }, '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box component="img" src={category.image || DEFAULT_IMAGE} sx={{ width: 48, height: 48, borderRadius: 1, objectFit: 'cover', display: 'block', flexShrink: 0, border: '1px solid #E5E7EB', bgcolor: '#FFFFFF' }} />
                    <Typography variant="body2" fontWeight={600} color="#111827">{category.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6', maxWidth: 250 }}>
                  <Typography variant="body2" color="#6B7280" noWrap>{category.description || 'Sin descripción'}</Typography>
                </TableCell>
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <StatusChip isActive={category.is_active ?? true} />
                </TableCell>
                <TableCell sx={{ py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
                  <ProductCount categoryId={category.id} />
                </TableCell>
                <TableCell align="right" sx={{ py: 1.5, paddingRight: 3, borderBottom: '1px solid #F3F4F6' }}>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <IconButton size="small" onClick={() => handleOpenModal(category.id)} sx={{ color: 'text.secondary', '&:hover': { bgcolor: '#F3F4F6', color: 'text.primary' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDeleteDialog({ id: category.id, name: category.name, image: category.image })} sx={{ color: 'text.secondary', '&:hover': { bgcolor: '#FEE2E2', color: '#DC2626' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileView = () => {
    if (!paginatedCategories.length) return <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}><Typography>No se encontraron categorías</Typography></Box>;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        {paginatedCategories.map((category) => (
          <Card key={category.id} sx={{ p: 2, border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box component="img" src={category.image || DEFAULT_IMAGE} sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover', flexShrink: 0, border: '1px solid #E5E7EB' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#111827" noWrap>{category.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{category.description || 'Sin descripción'}</Typography>
              </Box>
              <StatusChip isActive={category.is_active ?? true} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px dashed #E5E7EB' }}>
              <ProductCount categoryId={category.id} />
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton size="small" onClick={() => handleOpenModal(category.id)}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => handleOpenDeleteDialog({ id: category.id, name: category.name, image: category.image })} sx={{ '&:hover': { color: '#DC2626' } }}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#FFFFFF', mb: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)', border: '1px solid #E5E7EB', borderRadius: 1, overflow: 'visible' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" fontWeight="700" color="#111827">Gestión de Categorías</Typography>
        <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenModal(null)} sx={{ backgroundColor: '#0007d7ff', py: { xs: 1, sm: 1 }, px: { xs: 2, sm: 2.5 }, fontSize: { xs: '0.8rem', md: '0.875rem' }, fontWeight: 600, textTransform: 'none', boxShadow: 'none', borderRadius: 1, whiteSpace: 'nowrap', '&:hover': { backgroundColor: '#0005a0ff', boxShadow: '0px 4px 12px rgba(0, 7, 215, 0.2)' } }}>
          Nueva Categoría
        </Button>
      </Box>

      {isMobile ? renderMobileView() : renderDesktopView()}

      {categories && categories.length > 0 && (
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
          <CustomPagination page={page} totalPages={Math.ceil(categories.length / rowsPerPage)} totalItems={categories.length} rowsPerPage={rowsPerPage} onPageChange={setPage} onRowsPerPageChange={(n) => { setRowsPerPage(n); setPage(0); }} rowsPerPageOptions={[5, 10, 25, 50]} />
        </Box>
      )}

      <CategoryModal open={modalOpen} onClose={handleCloseModal} categoryId={editingCategoryId} />

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} PaperProps={{ sx: { borderRadius: 1, maxWidth: 400, p: 1 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, px: 3 }}>
          <Box sx={{ bgcolor: '#FEF2F2', borderRadius: '50%', p: 1.5, display: 'flex', mb: 2 }}>
            <WarningAmberIcon sx={{ color: '#EF4444', fontSize: '2rem' }} />
          </Box>
          <DialogTitle sx={{ p: 0, fontWeight: 700, mb: 1, fontSize: '1.25rem' }}>¿Eliminar categoría?</DialogTitle>
        </Box>
        <DialogContent sx={{ textAlign: 'center', px: 3 }}>
          <DialogContentText sx={{ color: '#4B5563' }}>
            Estás a punto de eliminar <strong>&quot;{categoryToDelete?.name}&quot;</strong>.
            <Typography component="span" variant="caption" color="text.secondary" display="block" mt={1}>(Esta acción no se puede deshacer)</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1.5 }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined" color="inherit" disabled={isDeleting} sx={{ flex: 1, textTransform: 'none', borderColor: '#E5E7EB', borderRadius: 1, fontWeight: 600 }}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus disabled={isDeleting} sx={{ flex: 1, textTransform: 'none', bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: 1, fontWeight: 600, boxShadow: 'none' }}>{isDeleting ? 'Eliminando...' : 'Sí, eliminar'}</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const ProductCount = ({ categoryId }: { categoryId: string }) => {
  const { count, isLoading } = useCountProductsByCategory(categoryId);
  if (isLoading) return <Typography variant="body2" color="text.secondary">...</Typography>;
  return <Typography variant="body2" fontWeight={500} color={count === 0 ? '#9CA3AF' : '#374151'}>{count} {count === 1 ? 'producto' : 'productos'}</Typography>;
};