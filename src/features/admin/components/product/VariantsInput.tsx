import React from 'react';
import {
	Control,
	useFieldArray,
	FieldErrors,
	UseFormRegister,
	useWatch,
} from 'react-hook-form';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Popover } from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';

interface Props {
	control: Control<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
	register: UseFormRegister<ProductFormValues>;
}

const headersVariants = ['Stock', 'Precio', 'Presentación', 'Color', 'Terminación', ''];

export const VariantsInput = ({
	control,
	errors,
	register,
}: Props) => {
	const { fields, remove, append } = useFieldArray({
		control,
		name: 'variants',
	});

	const [colorActive, setColorActive] = useState<(HTMLElement | null)[]>([]);

	const addVariant = () => {
		append({
			stock: 0,
			price: 0,
			storage: '',
			finish: '',
			color: '',
			colorName: '',
		});
	};

	const removeVariant = (index: number) => {
		remove(index);
	};

	const handleColorOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
		const newActive = [...colorActive];
		newActive[index] = event.currentTarget;
		setColorActive(newActive);
	};

	const handleColorClose = (index: number) => {
		const newActive = [...colorActive];
		newActive[index] = null;
		setColorActive(newActive);
	};

	const colorValues = useWatch({
		control,
		name: fields.map((_, index) => `variants.${index}.color` as const),
	});

	const colorNameValues = useWatch({
		control,
		name: fields.map((_, index) => `variants.${index}.colorName` as const),
	});

	/*
	const getFirstError = (
		variantErrors: FieldErrors<ProductFormValues['variants'][number]>
	) => {
		if (variantErrors) {
			const keys = Object.keys(variantErrors) as (keyof typeof variantErrors)[];
			if (keys.length > 0) {
				return variantErrors[keys[0]]?.message;
			}
		}
	};
	*/

	const getFirstError = (
		variantErrors?: FieldErrors
	) => {
		if (variantErrors) {
			const keys = Object.keys(variantErrors) as (keyof typeof variantErrors)[];
			if (keys.length > 0) {
				return (variantErrors as any)[keys[0]]?.message;
			}
		}
	};

	useEffect(() => {
		setColorActive(fields.map(() => null));
	}, [fields]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
			<Paper variant="outlined" sx={{ overflow: 'auto' }}>
				<Table sx={{ minWidth: 500 }}>
					<TableHead sx={{ backgroundColor: '#f9fafb' }}>
						<TableRow>
							{headersVariants.map((header, index) => (
								<TableCell
									key={index}
									sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}
								>
									{header}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{fields.map((field, index) => (
							<TableRow key={field.id}>
								<TableCell>
									<TextField
										type='number'
										placeholder='Stock'
										size="small"
										{...register(`variants.${index}.stock`, {
											valueAsNumber: true,
										})}
										sx={{ width: '85px' }}
									/>
								</TableCell>
								<TableCell>
									<TextField
										type='number'
										placeholder='Precio'
										size="small"
										inputProps={{ step: '0.01' }}
										{...register(`variants.${index}.price`, {
											valueAsNumber: true,
										})}
										sx={{ width: '100px' }}
									/>
								</TableCell>
								<TableCell>
									<TextField
										type='text'
										placeholder='1 Litro'
										size="small"
										{...register(`variants.${index}.storage`)}
										sx={{ width: '80px' }}
									/>
								</TableCell>
								<TableCell>
									<Button
										onClick={(e) => handleColorOpen(e, index)}
										variant="outlined"
										size="small"
										sx={{
											minWidth: '60px',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										{colorValues[index] && colorNameValues[index] ? (
											<Box
												sx={{
													width: 16,
													height: 16,
													borderRadius: '50%',
													backgroundColor: colorValues[index],
												}}
											/>
										) : (
											'Añadir'
										)}
									</Button>
									<Popover
										open={!!colorActive[index]}
										anchorEl={colorActive[index]}
										onClose={() => handleColorClose(index)}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
									>
										<Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
											<TextField
												type='color'
												{...register(`variants.${index}.color`)}
												size="small"
												sx={{ width: '100px' }}
											/>
											<TextField
												type='text'
												placeholder='Negro'
												{...register(`variants.${index}.colorName`)}
												size="small"
												sx={{ width: '100px' }}
											/>
										</Box>
									</Popover>
								</TableCell>
								<TableCell>
									<TextField
										type='text'
										placeholder='Brillante'
										size="small"
										{...register(`variants.${index}.finish`)}
										sx={{ width: '90px' }}
									/>
								</TableCell>
								<TableCell align="center">
									<Button
										onClick={() => removeVariant(index)}
										sx={{ minWidth: 'auto', p: 0 }}
									>
										<CancelIcon sx={{ fontSize: '1.2rem', color: '#ef4444' }} />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Paper>

			{errors.variants && Array.isArray(errors.variants) && errors.variants.length > 0 && (
				<Typography sx={{ color: '#ef4444', fontSize: '0.75rem' }}>
					{getFirstError(errors.variants[0])}
				</Typography>
			)}

			<Button
				type='button'
				onClick={addVariant}
				startIcon={<AddCircleIcon sx={{ color: '#25D366' }} />}
				sx={{
					alignSelf: 'center',
					textTransform: 'none',
					fontSize: '0.875rem',
					fontWeight: 600,
					color: '#1e293b',
					'&:hover': { backgroundColor: '#f3f4f6' },
				}}
			>
				Añadir Variante
			</Button>

			{fields.length === 0 && errors.variants && (
				<Typography sx={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center' }}>
					Debes añadir al menos una variante
				</Typography>
			)}
		</Box>
	);
};