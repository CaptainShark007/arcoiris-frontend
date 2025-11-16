import { Box, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useFormContext, useFieldArray } from "react-hook-form";

export const VariantsInput = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAddVariant = () => {
    append({
      color: "",
      colorName: "",
      storage: "",
      price: 0,
      stock: 0,
    });
  };

  return (
    <Box>
      {fields.map((field, index) => {
        const variantErrors = (errors.variants as any)?.[index];

        return (
          <Box
            key={field.id}
            sx={{ mb: 3, p: 2, border: 1, borderColor: "divider", borderRadius: 1 }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">Variante {index + 1}</Typography>
              <IconButton
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                {...register(`variants.${index}.color`)}
                label="Color (hex)"
                error={!!variantErrors?.color}
                helperText={variantErrors?.color?.message}
                fullWidth
              />
              <TextField
                {...register(`variants.${index}.colorName`)}
                label="Nombre del color"
                error={!!variantErrors?.colorName}
                helperText={variantErrors?.colorName?.message}
                fullWidth
              />
              <TextField
                {...register(`variants.${index}.storage`)}
                label="Almacenamiento"
                error={!!variantErrors?.storage}
                helperText={variantErrors?.storage?.message}
                fullWidth
              />
              <TextField
                {...register(`variants.${index}.price`, { valueAsNumber: true })}
                label="Precio"
                type="number"
                error={!!variantErrors?.price}
                helperText={variantErrors?.price?.message}
                fullWidth
              />
              <TextField
                {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                label="Stock"
                type="number"
                error={!!variantErrors?.stock}
                helperText={variantErrors?.stock?.message}
                fullWidth
              />
            </Box>
          </Box>
        );
      })}

      <IconButton onClick={handleAddVariant}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};
