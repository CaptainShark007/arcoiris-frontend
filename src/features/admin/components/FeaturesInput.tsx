import React from 'react';
import { Control, FieldErrors, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { ProductFormValues } from '../schema/productSchema';
import { Box, TextField, Button, Typography, List } from '@mui/material';

interface Props {
	control: Control<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
}

export const FeaturesInput = ({ control, errors }: Props) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'features',
	});

	const [newFeature, setNewFeature] = useState('');

	const handleAddFeature = () => {
		if (newFeature.trim() === '') return;
		append({ value: newFeature });
		setNewFeature('');
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddFeature();
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			<Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
				Características:
			</Typography>

			{fields.length > 0 && (
				<List sx={{ pl: 2, py: 0 }}>
					{fields.map((field, index) => (
						<Box
							key={field.id}
							sx={{
								display: 'flex',
								gap: 1,
								mb: 1,
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: '#78716c',
										flexShrink: 0,
									}}
								/>
								<Typography variant="body2" sx={{ fontWeight: 500, color: '#4b5563' }}>
									{field.value}
								</Typography>
							</Box>
							<Button
								onClick={() => remove(index)}
								sx={{
									color: '#ef4444',
									fontWeight: 'bold',
									fontSize: '0.875rem',
									'&:hover': { transform: 'scale(1.1)' },
									minWidth: 'auto',
									p: 0.5,
									flexShrink: 0,
								}}
							>
								X
							</Button>
						</Box>
					))}
				</List>
			)}

			<TextField
				type='text'
				placeholder='Facil de aplicar y secado rápido'
				size="small"
				fullWidth
				value={newFeature}
				onChange={e => setNewFeature(e.target.value)}
				onKeyDown={handleKeyDown}
				error={!!errors.features}
				sx={{
					'& .MuiOutlinedInput-root': {
						fontSize: '0.875rem',
					},
				}}
			/>

			{errors.features && (
				<Typography sx={{ color: '#ef4444', fontSize: '0.75rem' }}>
					{errors.features.message}
				</Typography>
			)}
		</Box>
	);
};