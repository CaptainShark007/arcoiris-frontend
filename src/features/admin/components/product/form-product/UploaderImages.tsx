import React, { useEffect, useState } from 'react';
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Typography, Alert } from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';

interface ImagePreview {
  file?: File;
  previewUrl: string;
}

interface UploaderProps {
  setValue: UseFormSetValue<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const MAX_IMAGES = 3;

export const UploaderImages = ({ setValue, watch, errors }: UploaderProps) => {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const formImages = watch('images');

  useEffect(() => {
    if (formImages && formImages.length > 0 && images.length === 0) {
      const existingImages = formImages.map((img: File | string) => {
        if (img instanceof File) {
          return {
            file: img,
            previewUrl: URL.createObjectURL(img),
          };
        }
        return {
          previewUrl: img as string,
        };
      });
      setImages(existingImages);
    }
  }, [formImages, images.length, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      const totalImages = images.length + newImages.length;

      if (totalImages > MAX_IMAGES) {
        const canAdd = MAX_IMAGES - images.length;
        const updatedImages = [...images, ...newImages.slice(0, canAdd)];
        setImages(updatedImages);
        setValue(
          'images',
          updatedImages.map((img) => img.file || img.previewUrl)
        );
        return;
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setValue(
        'images',
        updatedImages.map((img) => img.file || img.previewUrl)
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue(
      'images',
      updatedImages.map((img) => img.file || img.previewUrl)
    );
  };

  const canAddMore = images.length < MAX_IMAGES;
  const imagesRemaining = MAX_IMAGES - images.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1.25 },
      }}
    >
      {/* Feedback informativo */}
      <Alert
        severity="info"
        sx={{
          mb: 1.5,
          py: 0,
          backgroundColor: '#eff6ff',
          color: '#1e3a8a',
          '& .MuiAlert-message': { padding: '8px 0', width: '100%' },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
            <strong>Requisitos:</strong> Formatos permitidos JPEG, JPG, PNG o WEBP. Minimo de 1 imagen y máximo de {MAX_IMAGES} imágenes.
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
            <strong>Nota:</strong> Se recomienda que el nombre de las imágenes no contenga caracteres especiales.
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
            <strong>Nota:</strong> La primera imagen seleccionada será la <strong>PRINCIPAL</strong> (Portada) del producto.
          </Typography>
        </Box>
      </Alert>
      {/* Estado de imágenes */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.75,
        }}
      >
        <Typography
          variant='body2'
          sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
        >
          Imágenes: <strong>{images.length}</strong> / {MAX_IMAGES}
        </Typography>
        {!canAddMore && (
          <Typography
            variant='body2'
            sx={{
              color: '#ef4444',
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              fontWeight: 500,
            }}
          >
            Máximo alcanzado
          </Typography>
        )}
      </Box>

      {/* Barra de progreso */}
      <Box
        sx={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e5e7eb',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${(images.length / MAX_IMAGES) * 100}%`,
            backgroundColor:
              images.length === MAX_IMAGES ? '#10b981' : '#0007d7ff',
            transition: 'width 300ms ease',
          }}
        />
      </Box>

      {/* Botón seleccionar */}
      <Button
        component='label'
        variant='outlined'
        disabled={!canAddMore}
        fullWidth
        sx={{
          py: { xs: 0.75, sm: 1 },
          textTransform: 'none',
          fontSize: { xs: '0.75rem', sm: '0.8rem' },
          opacity: canAddMore ? 1 : 0.5,
          cursor: canAddMore ? 'pointer' : 'not-allowed',
        }}
      >
        {canAddMore
          ? `Seleccionar imágenes (${imagesRemaining} disponibles)`
          : 'Máximo alcanzado'}
        <input
          type='file'
          accept='image/*'
          multiple
          hidden
          onChange={handleImageChange}
          disabled={!canAddMore}
        />
      </Button>

      {/* Galería */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
          },
          gap: { xs: 0.75, sm: 1 },
          p: { xs: 0.5, sm: 0.75 },
          maxWidth: '100%',
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              aspectRatio: '1',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {index === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: '#0007d7ff', // Tu color primario
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  padding: '2px 8px',
                  borderBottomRightRadius: '8px',
                  zIndex: 1,
                  pointerEvents: 'none', // Para que no moleste al click
                }}
              >
                PRINCIPAL
              </Box>
            )}
            <Box
              component='img'
              src={image.previewUrl}
              alt={`Preview ${index}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: 1,
                border: '1px solid #e5e7eb',
                p: 0.25,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            <Button
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                minWidth: 'auto',
                p: 0,
                backgroundColor: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <CancelIcon
                sx={{
                  color: '#ef4444',
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                }}
              />
            </Button>
          </Box>
        ))}
      </Box>

      {/* Errores */}
      {errors.images && (
        <Alert
          severity='error'
          sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
        >
          {errors.images.message}
        </Alert>
      )}

      {/* {images.length === 0 && !errors.images && (
        <Typography
          variant='body2'
          sx={{ color: '#9ca3af', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
        >
          El nombre de la imagen no debe contener caracteres especiales.
        </Typography>
      )} */}
    </Box>
  );
};
