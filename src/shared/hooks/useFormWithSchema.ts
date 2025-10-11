import { useForm, UseFormProps, FieldValues, Path } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObjectSchema } from 'yup';

interface UseFormWithSchemaProps<T extends FieldValues>
  extends Omit<UseFormProps<T>, 'resolver'> {
  schema: AnyObjectSchema;
}

export const useFormWithSchema = <T extends FieldValues>({
  schema,
  ...formProps
}: UseFormWithSchemaProps<T>) => {
  const form = useForm<T>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    ...formProps,
  });

  const getFieldError = (fieldName: Path<T>) => {
    return form.formState.errors[fieldName]?.message as string | undefined;
  };

  const hasFieldError = (fieldName: Path<T>) => {
    return !!form.formState.errors[fieldName];
  };

  return {
    ...form,
    getFieldError,
    hasFieldError,
  };
};
