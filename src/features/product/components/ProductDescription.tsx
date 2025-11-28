import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Paper, Typography, Box } from "@mui/material";

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
          "padding: 0; font-size: 0.95rem; line-height: 1.8; color: #555;",
      },
    },
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
        Descripción del producto
      </Typography>
      
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 3,
          backgroundColor: "background.paper",
          borderRadius: 1,
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            fontWeight: 700,
            mt: 2.5,
            mb: 1,
            color: "text.primary",
          },
          "& h1": { fontSize: "1.75rem" },
          "& h2": { fontSize: "1.5rem" },
          "& h3": { fontSize: "1.25rem" },
          "& p": {
            mb: 1.5,
            color: "text.secondary",
          },
          "& ul, & ol": {
            ml: 2.5,
            mb: 1.5,
          },
          "& li": {
            mb: 0.75,
            color: "text.secondary",
          },
          "& strong": {
            fontWeight: 700,
            color: "text.primary",
          },
          "& em": {
            fontStyle: "italic",
          },
          "& code": {
            backgroundColor: "action.hover",
            padding: "0.25rem 0.5rem",
            borderRadius: 0.5,
            fontFamily: "monospace",
            fontSize: "0.9rem",
          },
          "& pre": {
            backgroundColor: "action.hover",
            padding: 1.5,
            borderRadius: 1,
            overflow: "auto",
            mb: 1.5,
          },
          "& blockquote": {
            borderLeft: "4px solid",
            borderColor: "primary.main",
            pl: 2,
            py: 0.5,
            my: 1.5,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& hr": {
            my: 2.5,
            borderColor: "divider",
          },
          "& a": {
            color: "primary.main",
            textDecoration: "none",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Paper>
    </Box>
  );
};