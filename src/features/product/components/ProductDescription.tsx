// /src/features/product/components/ProductDescription.tsx
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Paper, Typography } from "@mui/material";

interface Props {
  content: JSONContent | null;
}

export const ProductDescription = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    editorProps: {
      attributes: {
        style:
          "padding: 1rem; font-size: 1rem; line-height: 1.7; color: #333;",
      },
    },
  });

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Descripción del producto
      </Typography>
      <EditorContent editor={editor} />
    </Paper>
  );
};
