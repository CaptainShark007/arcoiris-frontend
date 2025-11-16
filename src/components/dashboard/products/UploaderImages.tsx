import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

export const UploaderImages = () => {
  const { setValue, watch } = useFormContext();
  const images = watch("images") || [];
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newFiles = Array.from(files);
    setValue("images", [...images, ...newFiles]);
    setUploading(false);
  };

  const handleDelete = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    setValue("images", newImages);
  };

  const getImageUrl = (img: File | string) => {
    if (typeof img === "string") return img;
    return URL.createObjectURL(img);
  };

  return (
    <Box>
      <Button variant="contained" component="label" disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir imágenes"}
        <input type="file" hidden multiple accept="image/*" onChange={handleUpload} />
      </Button>
      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        {images.map((img: File | string, index: number) => (
          <Box key={index} position="relative">
            <img
              src={getImageUrl(img)}
              alt={`Producto ${index + 1}`}
              style={{ width: 150, height: 150, objectFit: "cover" }}
            />
            <IconButton
              onClick={() => handleDelete(index)}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "background.paper",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
