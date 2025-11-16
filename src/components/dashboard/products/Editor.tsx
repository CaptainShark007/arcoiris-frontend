import { Box } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

export const Editor = () => {
  const { setValue, watch } = useFormContext();
  const description = watch("description");

  const editor = useEditor({
    extensions: [StarterKit],
    content: description || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("description", html);
    },
  });

  useEffect(() => {
    if (editor && description && editor.getHTML() !== description) {
      editor.commands.setContent(description);
    }
  }, [description, editor]);

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        p: 2,
        minHeight: 200,
        "& .ProseMirror": {
          outline: "none",
        },
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};
