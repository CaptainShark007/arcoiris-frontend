import * as yup from "yup";

export const updateCustomerSchema = yup.object({
  full_name: yup
    .string()
    .required("El nombre completo es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre es muy largo"),
  phone: yup
    .string()
    .nullable()
    .notRequired()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono es muy largo"),
});

export type UpdateCustomerFormData = yup.InferType<typeof updateCustomerSchema>;