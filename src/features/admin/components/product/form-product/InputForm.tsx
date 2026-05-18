import { ProductFormValues } from "@features/admin/schema/productSchema";
import { Box, TextField, Typography, MenuItem, Select, FormControl } from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";

interface InputProps {
  className?: string;
  label: string;
  placeholder?: string;
  type: string;
  name: keyof ProductFormValues;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  required?: boolean;
  options?: { value: string; label: string }[];
  watch?: UseFormWatch<ProductFormValues>;
  setValue?: UseFormSetValue<ProductFormValues>;
}

export const InputForm = ({
  label,
  placeholder,
  type,
  name,
  register,
  errors,
  required,
  options,
  watch,
  setValue,
}: InputProps) => {
  const currentValue = watch ? watch(name as keyof ProductFormValues) : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.3, sm: 0.5 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'bold',
            textTransform: 'capitalize',
            fontSize: { xs: '0.65rem', sm: '0.75rem' },
          }}
        >
          {label}:
        </Typography>
        {required && (
          <Typography
            sx={{
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            *
          </Typography>
        )}
      </Box>

      {options ? (
        <FormControl fullWidth size="small" error={!!errors[name]}>
          <Select
            value={currentValue || ''}
            displayEmpty
            onChange={(e) => {
              if (setValue) {
                setValue(name, e.target.value as any, { shouldValidate: true });
              }
            }}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              '& .MuiSelect-select': {
                py: '6px',
              },
            }}
          >
            <MenuItem value="" disabled>
              <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' }, color: '#9ca3af' }}>
                {placeholder || 'Selecciona una opción'}
              </Typography>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors[name] && (
            <Typography sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' }, color: '#ef4444', mt: 0.5 }}>
              {errors[name]?.message as string}
            </Typography>
          )}
        </FormControl>
      ) : (
        <TextField
          type={type}
          placeholder={placeholder}
          id={name}
          size="small"
          fullWidth
          error={!!errors[name]}
          helperText={errors[name]?.message as string}
          {...register(name)}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              padding: '4px 8px',
            },
            '& .MuiFormHelperText-root': {
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              margin: '2px 0 0 0',
            },
          }}
        />
      )}
    </Box>
  );
};