import React from 'react';
import {
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { ProductFormValues } from '../schema/productSchema';
import { Box, Button, Typography } from '@mui/material';

interface ImagePreview {
	file?: File;
	previewUrl: string;
}

interface Props {
	setValue: UseFormSetValue<ProductFormValues>;
	watch: UseFormWatch<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
}

export const UploaderImages = ({
	setValue,
	errors,
}: Props) => {
	const [images, setImages] = useState<ImagePreview[]>([]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files).map(file => ({
				file,
				previewUrl: URL.createObjectURL(file),
			}));

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

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Button
				component="label"
				variant="outlined"
				sx={{
					py: 1.5,
					textTransform: 'none',
					fontSize: '0.875rem',
				}}
			>
				Seleccionar imágenes
				<input
					type='file'
					accept='image/*'
					multiple
					hidden
					onChange={handleImageChange}
				/>
			</Button>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
				{images.map((image, index) => (
					<Box
						key={index}
						sx={{
							flex: '0 0 calc(25% - 12px)',
							'@media (max-width: 600px)': {
								flex: '0 0 calc(50% - 8px)',
							},
							position: 'relative',
						}}
					>
						<Box
							sx={{
								position: 'relative',
								width: '100%',
								paddingBottom: '100%',
								border: '1px solid #e5e7eb',
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
									top: -8,
									right: -8,
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

			{errors.images && (
				<Typography sx={{ color: '#ef4444', fontSize: '0.75rem' }}>
					{errors.images.message}
				</Typography>
			)}
		</Box>
	);
};