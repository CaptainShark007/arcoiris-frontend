import React, { useEffect, useRef, useState } from 'react';
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CollectionsIcon from '@mui/icons-material/Collections';
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
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formImages = watch('images');

  useEffect(() => {
    if (formImages && formImages.length > 0 && images.length === 0) {
      const existingImages = formImages.map((img: File | string) => {
        if (img instanceof File) {
          return { file: img, previewUrl: URL.createObjectURL(img) };
        }
        return { previewUrl: img as string };
      });
      setImages(existingImages);
    }
  }, [formImages, images.length]);

  const processFiles = (files: File[]) => {
    const canAdd = MAX_IMAGES - images.length;
    if (canAdd <= 0) return;

    const newImages = files.slice(0, canAdd).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    setValue(
      'images',
      updatedImages.map((img) => img.file || img.previewUrl)
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue(
      'images',
      updatedImages.map((img) => img.file || img.previewUrl)
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (images.length < MAX_IMAGES) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type)
    );
    if (files.length > 0) processFiles(files);
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: `2px dashed ${
            isDragging
              ? '#0007d7ff'
              : errors.images
              ? '#ef4444'
              : '#d1d5db'
          }`,
          borderRadius: '8px',
          backgroundColor: isDragging ? '#eff6ff' : '#fafafa',
          transition: 'all 200ms ease',
          minHeight: images.length === 0 ? '140px' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {images.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              backgroundColor: '#e5e7eb',
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  aspectRatio: '1',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                }}
              >
                {index === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      backgroundColor: '#0007d7ff',
                      color: 'white',
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: '4px',
                      zIndex: 1,
                      letterSpacing: '0.03em',
                    }}
                  >
                    PRINCIPAL
                  </Box>
                )}

                <Box
                  component="img"
                  src={image.previewUrl}
                  alt={`Preview ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    p: 1,
                  }}
                />

                <Box
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    zIndex: 1,
                    transition: 'transform 150ms',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                >
                  <CancelIcon sx={{ fontSize: '1rem', color: '#ef4444' }} />
                </Box>
              </Box>
            ))}

            {canAddMore && (
              <Box
                onClick={() => inputRef.current?.click()}
                sx={{
                  aspectRatio: '1',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  transition: 'background-color 150ms',
                  '&:hover': { backgroundColor: '#f3f4f6' },
                }}
              >
                <CollectionsIcon sx={{ fontSize: '1.5rem', color: '#9ca3af' }} />
                <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 500 }}>
                  Añadir
                </Typography>
              </Box>
            )}
          </Box>
        )}
        
        {images.length === 0 && (
          <Box
            onClick={() => inputRef.current?.click()}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              p: 3,
              cursor: 'pointer',
            }}
          >
            <UploadFileIcon
              sx={{
                fontSize: '2rem',
                color: isDragging ? '#0007d7ff' : '#9ca3af',
                transition: 'color 200ms',
              }}
            />

            <Typography
              sx={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.4 }}
            >
              Arrastrá imágenes aquí o{' '}
              <Box
                component="span"
                sx={{
                  color: '#0007d7ff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                seleccioná archivos
              </Box>
            </Typography>

            <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
              JPEG, PNG o WEBP · Máximo {MAX_IMAGES} imágenes
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: 0,
            borderTop: images.length > 0 ? '1px solid #e5e7eb' : 'none',
          }}
        >
          {images.length > 0 && (
            <>
              <Button
                onClick={() => inputRef.current?.click()}
                disabled={!canAddMore}
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: canAddMore ? '#374151' : '#9ca3af',
                  borderRadius: 0,
                  py: 1,
                  borderRight: '1px solid #e5e7eb',
                  '&:hover': { backgroundColor: '#f9fafb' },
                }}
              >
                Subir nuevo
              </Button>
              <Button
                disabled
                sx={{
                  flex: 1,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  borderRadius: 0,
                  py: 1,
                }}
              >
                Seleccionar existente
              </Button>
            </>
          )}
        </Box>
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        hidden
        onChange={handleInputChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af' }}>
          {images.length} / {MAX_IMAGES} imágenes · La primera será la portada
        </Typography>
        {images.length === MAX_IMAGES && (
          <Typography sx={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
            Máximo alcanzado
          </Typography>
        )}
      </Box>

      {errors.images && (
        <Alert severity="error" sx={{ fontSize: '0.7rem', py: 0 }}>
          {errors.images.message}
        </Alert>
      )}
    </Box>
  );
};