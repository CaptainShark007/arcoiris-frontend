import { Box, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema, ProductFormData } from "@/lib/validators";
import { SectionFormProduct } from "./SectionFormProduct";
import { InputForm } from "./InputForm";
import { FeaturesInput } from "./FeaturesInput";
import { VariantsInput } from "./VariantsInput";
import { UploaderImages } from "./UploaderImages";
import { Editor } from "./Editor";

interface FormProductProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export const FormProduct = ({
  initialData,
  onSubmit,
  isLoading,
}: FormProductProps) => {
  const methods = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      brand: "",
      description: "",
      features: [""],
      images: [],
      variants: [
        {
          color: "",
          colorName: "",
          storage: "",
          price: 0,
          stock: 0,
        },
      ],
    },
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit}>
        <SectionFormProduct title="Información básica">
          <Box display="flex" flexDirection="column" gap={2}>
            <InputForm name="name" label="Nombre" required />
            <InputForm name="brand" label="Marca" required />
            <InputForm name="slug" label="Slug" required />
          </Box>
        </SectionFormProduct>

        <SectionFormProduct title="Características">
          <FeaturesInput />
        </SectionFormProduct>

        <SectionFormProduct title="Variantes">
          <VariantsInput />
        </SectionFormProduct>

        <SectionFormProduct title="Imágenes">
          <UploaderImages />
        </SectionFormProduct>

        <SectionFormProduct title="Descripción">
          <Editor />
        </SectionFormProduct>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
