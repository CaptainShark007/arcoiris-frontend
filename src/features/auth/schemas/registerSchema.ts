import * as yup from 'yup';

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('El email no es válido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fullName: yup.string().required('El nombre completo es requerido'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, 'El número de celular debe contener solo dígitos')
    .required('El número de celular es requerido'),
  rememberMe: yup.boolean().default(false),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;