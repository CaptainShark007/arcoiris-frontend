import {
  TextField,
  TextFieldProps,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { forwardRef, useState, MouseEvent } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FormPasswordFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'type'> {
  name: FieldPath<T>;
  control: Control<T>;
  showPasswordToggle?: boolean;
}

export const FormPasswordField = forwardRef<
  HTMLDivElement,
  FormPasswordFieldProps<any>
>(({ name, control, showPasswordToggle = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          variant='outlined'
          fullWidth
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
          InputProps={{
            ...props.InputProps,
            endAdornment: showPasswordToggle && (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                  size='small'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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

FormPasswordField.displayName = 'FormPasswordField';
