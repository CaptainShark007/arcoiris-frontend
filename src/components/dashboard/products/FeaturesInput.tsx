import { Box, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useFormContext, useFieldArray } from "react-hook-form";

export const FeaturesInput = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <Box>
      {fields.map((field, index) => (
        <Box key={field.id} display="flex" gap={1} mb={2}>
          <TextField
            {...register(`features.${index}`)}
            label={`Característica ${index + 1}`}
            fullWidth
          />
          <IconButton onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <IconButton onClick={() => append("")}>
        <AddIcon />
      </IconButton>
    </Box>
  );
};
