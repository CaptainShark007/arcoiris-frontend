import * as yup from 'yup';

export const shippingSchema = yup.object({
  addressLine1: yup.string().required('La dirección es obligatoria'),
  city: yup.string().required('La ciudad es obligatoria'),
  postalCode: yup.string(),
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Ingresa un email válido').required('El email es obligatorio'),
  phone: yup.string().required('El teléfono es obligatorio'),
});