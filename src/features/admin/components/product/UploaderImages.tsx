import React, { useEffect } from 'react';
import {
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Typography, Alert } from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';

interface ImagePreview {
	file?: File;
	previewUrl: string;
}

interface Props {
	setValue: UseFormSetValue<ProductFormValues>;
	watch: UseFormWatch<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
}

const MAX_IMAGES = 3;
//const MIN_IMAGES = 1;

export const UploaderImages = ({
	setValue,
	watch,
	errors,
}: Props) => {
	const [images, setImages] = useState<ImagePreview[]>([]);

	// Verificar si hay errores con las imágenes
	const formImages = watch('images');

	useEffect(() => {
		if (formImages && formImages.length > 0 && images.length === 0) {
			const existingImages = formImages.map(url => ({
				previewUrl: url
			}))
			setImages(existingImages);
			// Actualizar el valor del formulario
			setValue('images', formImages);
		}
	}, [formImages, images.length, setValue]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files).map(file => ({
				file,
				previewUrl: URL.createObjectURL(file),
			}));

			// Verificar si al agregar las nuevas imágenes se excede el máximo
			const totalImages = images.length + newImages.length;
			
			if (totalImages > MAX_IMAGES) {
				// Solo agregar hasta el máximo permitido
				const canAdd = MAX_IMAGES - images.length;
				const updatedImages = [...images, ...newImages.slice(0, canAdd)];
				setImages(updatedImages);
				setValue(
					'images',
					updatedImages.map(img => img.file || img.previewUrl)
				);
				return;
			}

			const updatedImages = [...images, ...newImages];
			setImages(updatedImages);
			setValue(
				'images',
				updatedImages.map(img => img.file || img.previewUrl)
			);
		}
	};

	const handleRemoveImage = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
		setValue(
			'images',
			updatedImages.map(img => img.file || img.previewUrl)
		);
	};

	const canAddMore = images.length < MAX_IMAGES;
	const imagesRemaining = MAX_IMAGES - images.length;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{/* Estado de imágenes */}
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
					Imágenes: <strong>{images.length}</strong> / {MAX_IMAGES}
				</Typography>
				{!canAddMore && (
					<Typography variant="body2" sx={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500 }}>
						Máximo de imágenes alcanzado
					</Typography>
				)}
			</Box>

			{/* Barra de progreso visual */}
			<Box sx={{ 
				width: '100%', 
				height: '4px', 
				backgroundColor: '#e5e7eb', 
				borderRadius: '2px',
				overflow: 'hidden'
			}}>
				<Box sx={{ 
					height: '100%', 
					width: `${(images.length / MAX_IMAGES) * 100}%`,
					backgroundColor: images.length === MAX_IMAGES ? '#10b981' : '#0007d7ff',
					transition: 'width 300ms ease'
				}} />
			</Box>

			{/* Botón de seleccionar imágenes */}
			<Button
				component="label"
				variant="outlined"
				disabled={!canAddMore}
				sx={{
					py: 1.5,
					textTransform: 'none',
					fontSize: '0.875rem',
					opacity: canAddMore ? 1 : 0.5,
					cursor: canAddMore ? 'pointer' : 'not-allowed',
				}}
			>
				{canAddMore 
					? `Seleccionar imágenes (${imagesRemaining} disponibles)`
					: 'Máximo de imágenes alcanzado'
				}
				<input
					type='file'
					accept='image/*'
					multiple
					hidden
					onChange={handleImageChange}
					disabled={!canAddMore}
				/>
			</Button>

			{/* Galería de imágenes */}
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 1 }}>
				{images.map((image, index) => (
					<Box
						key={index}
						sx={{
							flex: '0 0 calc(30% - 12px)',
							'@media (max-width: 600px)': {
								flex: '0 0 calc(50% - 8px)',
							},
							position: 'relative',
							//bgcolor: 'blue',
						}}
					>
						<Box
							sx={{
								position: 'relative',
								width: '100%',
								paddingBottom: '100%',
								//border: '1px solid #e5e7eb',
								borderRadius: 1,
								overflow: 'hidden',
							}}
						>
							<Box
								component="img"
								src={image.previewUrl}
								alt={`Preview ${index}`}
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									objectFit: 'contain',
									p: 0.5,
								}}
							/>
							<Button
								onClick={() => handleRemoveImage(index)}
								sx={{
									position: 'absolute',
									top: -1,
									right: -1,
									minWidth: 'auto',
									p: 0,
									'&:hover': { transform: 'scale(1.1)' },
								}}
							>
								<CancelIcon
									sx={{ color: '#ef4444', fontSize: '1.5rem' }}
								/>
							</Button>
						</Box>
					</Box>
				))}
			</Box>

			{/* Errores de validación */}
			{errors.images && (
				<Alert severity="error" sx={{ fontSize: '0.75rem' }}>
					{errors.images.message}
				</Alert>
			)}

			{/* Mensaje informativo */}
			{images.length === 0 && !errors.images && (
				<Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
					Carga mínimo 1 imagen y máximo 3 imágenes del producto
				</Typography>
			)}
		</Box>
	);
};