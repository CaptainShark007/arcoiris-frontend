import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'name' | 'value' | 'onChange'> {
  name: FieldPath<T>;
  control: Control<T>;
}

export const FormTextField = forwardRef<
  HTMLDivElement,
  FormTextFieldProps<any>
>(({ name, control, ...props }, ref) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          ref={ref}
          variant='outlined'
          fullWidth
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                fontWeight: 600,
              },
            },
            ...props.sx,
          }}
        />
      )}
    />
  );
});

FormTextField.displayName = 'FormTextField';
