import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('El email no es válido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: yup.boolean().default(false),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;