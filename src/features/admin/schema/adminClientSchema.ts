import * as yup from 'yup';

export const adminClientSchema = yup.object().shape({
  full_name: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  phone: yup
    .string()
    .required('El teléfono es obligatorio')
    .min(8, 'El teléfono debe tener al menos 8 caracteres')
    .max(20, 'El teléfono no puede superar los 20 caracteres'),
  email: yup
    .string()
    .email('Ingrese un email válido')
    .nullable()
    .default(null),
  is_active: yup.boolean().default(true),
});

export type AdminClientFormData = yup.InferType<typeof adminClientSchema>;
