import * as yup from 'yup';

export const contactFormSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es obligatorio'),
  phone: yup
    .string()
    .min(3, 'El teléfono no es válido')
    .required('El teléfono es obligatorio'),
  email: yup
    .string()
    .email('El email no es válido')
    .required('El email es obligatorio'),
  subject: yup
    .string()
    .min(3, 'El asunto debe tener al menos 3 caracteres')
    .required('El asunto es obligatorio'),
  message: yup
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .required('El mensaje es obligatorio'),
});

export type ContactFormValues = yup.InferType<typeof contactFormSchema>;