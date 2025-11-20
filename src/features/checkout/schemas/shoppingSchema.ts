import * as yup from 'yup';

export const shippingSchema = yup.object({
  addressLine1: yup.string().required('La dirección es obligatoria'),
  addressLine2: yup.string(),
  city: yup.string().required('La ciudad es obligatoria'),
  state: yup.string().required('El estado es obligatorio'),
  postalCode: yup.string(),
});