import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  IconButton,
  Stack,
  Grid,
  Chip,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { generateCategorySlug } from '@/actions';
import { useCreateCategory, useUpdateCategory, useGetCategoryById } from '@features/admin/hooks';
import { Loader } from '@shared/components';

interface Props {
  titleForm: string;
}

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

const SectionFormCategory = ({ titleSection, children }: { titleSection?: string; children: React.ReactNode }) => (
  <Box
    sx={{
      bgcolor: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 1,
      p: 2.5,
    }}
  >
    {titleSection && (
      <Typography
        variant="subtitle2"
        fontWeight={700}
        color="#374151"
        sx={{ mb: 2, pb: 1, borderBottom: '1px solid #F3F4F6' }}
      >
        {titleSection}
      </Typography>
    )}
    {children}
  </Box>
);

export const FormCategory = ({ titleForm }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CategoryFormValues>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const { category, isLoading: isLoadingCategory } = useGetCategoryById(id || '');
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const isEditing = Boolean(id);
  const isLoading = isCreating || isUpdating || isLoadingCategory;

  useEffect(() => {
    if (category && !isLoadingCategory) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        is_active: category.is_active ?? true,
      });
      if (category.image) {
        setImagePreview(category.image);
      }
    }
  }, [category, isLoadingCategory]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, name }));

    if (!isEditing) {
      setFormData((prev) => ({ ...prev, slug: generateCategorySlug(name) }));
    }
  };

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
    if (category?.image) {
      setImageToDelete(category.image);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim() || null,
      is_active: formData.is_active,
    };

    if (imageFile) {
      payload.image = imageFile;
    } else if (imageToDelete) {
      payload.image = null;
    }

    if (isEditing) {
      updateCategory({ id, data: payload });
    } else {
      createCategory(payload, {
        onSuccess: () => navigate('/panel/categorias'),
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              transition: 'all 400ms',
              '&:hover': { transform: 'scale(1.05)', bgcolor: '#F3F4F6' },
              p: { xs: 0.25, sm: 0.5 },
            }}
          >
            <ArrowBackIosIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              textTransform: 'capitalize',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {titleForm}
          </Typography>
          <Chip
            size="small"
            label={isEditing ? 'Editando' : 'Nuevo'}
            sx={{
              ml: 1,
              bgcolor: isEditing ? '#DBEAFE' : '#DCFCE7',
              color: isEditing ? '#1D4ED8' : '#166534',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} lg={8}>
            <SectionFormCategory titleSection="Información de la Categoría">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre de la categoría"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    fullWidth
                    size="small"
                    placeholder="Ej: Pinturas y Barnices"
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9CA3AF',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Slug (URL amigable)"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    fullWidth
                    size="small"
                    placeholder="pinturas-y-barnices"
                    helperText={!isEditing && "Se genera automáticamente"}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descripción (opcional)"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    placeholder="Describe brevemente esta categoría..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                  />
                </Grid>
              </Grid>
            </SectionFormCategory>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={2.5}>
              <SectionFormCategory titleSection="Estado">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: formData.is_active ? '#F0FDF4' : '#F9FAFB',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: formData.is_active ? '#BBF7D0' : '#E5E7EB',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: formData.is_active ? '#22C55E' : '#9CA3AF',
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="#111827">
                        {formData.is_active ? 'Categoría activa' : 'Categoría inactiva'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formData.is_active
                          ? 'Visible en la tienda'
                          : 'No visible en la tienda'}
                      </Typography>
                    </Box>
                  </Box>
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#22C55E',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#22C55E',
                      },
                    }}
                  />
                </Box>
              </SectionFormCategory>

              <SectionFormCategory titleSection="Imagen de la Categoría">
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 180,
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
                          bgcolor: 'rgba(0,0,0,0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => fileInputRef.current?.click()}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#111827',
                            '&:hover': { bgcolor: '#fff' },
                            textTransform: 'none',
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
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
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
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon sx={{ fontSize: 48, color: '#9CA3AF', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Subir imagen
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
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
              </SectionFormCategory>
            </Stack>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              flex: { xs: 1, sm: 'none' },
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              py: { xs: 0.75, sm: 1 },
              borderColor: '#E5E7EB',
              color: 'text.secondary',
              '&:hover': {
                borderColor: '#9CA3AF',
                bgcolor: '#F9FAFB',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!formData.name.trim() || !formData.slug.trim()}
            sx={{
              flex: { xs: 1, sm: 'none' },
              backgroundColor: '#0007d7ff',
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              fontWeight: 600,
              py: { xs: 0.75, sm: 1 },
              px: { xs: 2, sm: 3 },
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0005a0ff',
                boxShadow: '0px 4px 12px rgba(0, 7, 215, 0.2)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#E5E7EB',
                color: '#9CA3AF',
              },
            }}
          >
            {isEditing ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};