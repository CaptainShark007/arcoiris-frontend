import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface InputFormProps {
  name: string;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const InputForm = ({
  name,
  label,
  required,
  multiline,
  rows,
}: InputFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <TextField
      {...register(name)}
      label={label}
      error={!!error}
      helperText={error?.message as string}
      required={required}
      multiline={multiline}
      rows={rows}
      fullWidth
    />
  );
};
