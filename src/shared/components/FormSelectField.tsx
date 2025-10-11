import { TextField, TextFieldProps, MenuItem } from '@mui/material';
import { forwardRef } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'select'> {
  name: FieldPath<T>;
  control: Control<T>;
  options: SelectOption[];
}

export const FormSelectField = forwardRef<
  HTMLDivElement,
  FormSelectFieldProps<any>
>(({ name, control, options, ...props }, ref) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          ref={ref}
          select
          variant='outlined'
          fullWidth
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
            ...props.sx,
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
});

FormSelectField.displayName = 'FormSelectField';
