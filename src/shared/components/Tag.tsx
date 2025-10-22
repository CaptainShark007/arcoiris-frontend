// /src/shared/components/Tag.tsx
import { Chip } from "@mui/material";

type TagType = "nuevo" | "agotado";

interface Props {
  contentTag: TagType;
}

export const Tag = ({ contentTag }: Props) => {
  const color = contentTag === "nuevo" ? "primary" : "default";

  return (
    <Chip
      label={contentTag.toUpperCase()}
      color={color}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: "6px",
        color: contentTag === "agotado" ? "#fff" : undefined,
        backgroundColor: contentTag === "agotado" ? "#000" : undefined,
      }}
    />
  );
};
