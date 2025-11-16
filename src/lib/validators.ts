import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  slug: z.string().min(1, "El slug es requerido"),

  features: z.array(z.string()).optional(),

  description: z.string().min(1, "La descripción es requerida"),

  images: z
    .array(z.instanceof(File).or(z.string()))
    .min(1, "Debe subir al menos una imagen"),

  variants: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        stock: z.number().int().min(0, "El stock debe ser mayor o igual a 0"),
        price: z.number().positive("El precio debe ser mayor a 0"),
        storage: z.string().min(1, "El almacenamiento es requerido"),
        color: z.string().min(1, "El color es requerido"),
        colorName: z.string().min(1, "El nombre del color es requerido"),
      })
    )
    .min(1, "Debe tener al menos una variante"),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
