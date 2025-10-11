import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  CheckboxProps,
} from '@mui/material';
import { forwardRef } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues>
  extends Omit<FormControlLabelProps, 'name' | 'control'> {
  name: FieldPath<T>;
  control: Control<T>;
  checkboxProps?: CheckboxProps;
}

export const FormCheckbox = forwardRef<
  HTMLLabelElement,
  FormCheckboxProps<any>
>(({ name, control, checkboxProps, ...props }, ref) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          {...props}
          ref={ref}
          control={
            <Checkbox
              {...checkboxProps}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              color='primary'
            />
          }
        />
      )}
    />
  );
});

FormCheckbox.displayName = 'FormCheckbox';
