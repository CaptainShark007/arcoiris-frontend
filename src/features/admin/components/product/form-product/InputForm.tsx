import { ProductFormValues } from "@features/admin/schema/productSchema";
import { Box, TextField, Typography } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface InputProps {
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
}: InputProps) => {
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
    </Box>
  );
};