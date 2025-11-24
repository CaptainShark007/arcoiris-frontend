import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';

interface Props {
	className?: string;
	label: string;
	placeholder?: string;
	type: string;
	name: keyof ProductFormValues;
	register: UseFormRegister<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
	required?: boolean;
}

export const InputForm = ({
	label,
	placeholder,
	type,
	name,
	register,
	errors,
	required,
}: Props) => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="caption" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
					{label}:
				</Typography>
				{required && <Typography sx={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold' }}>*</Typography>}
			</Box>

			<TextField
				type={type}
				placeholder={placeholder}
				id={name}
				size="small"
				fullWidth
				error={!!errors[name]}
				{...register(name)}
				sx={{
					'& .MuiOutlinedInput-root': {
						fontSize: '0.875rem',
					},
				}}
			/>
		</Box>
	);
};