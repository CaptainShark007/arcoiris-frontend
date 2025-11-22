import {
	EditorContent,
	JSONContent,
	useEditor,
	type Editor as EditorType,
} from '@tiptap/react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import StarterKit from '@tiptap/starter-kit';
import { ReactNode, useEffect } from 'react';
import { ProductFormValues } from '../schema/productSchema';
import { Box, Button, Typography, Stack } from '@mui/material';

interface Props {
	setValue: UseFormSetValue<ProductFormValues>;
	errors: FieldErrors<ProductFormValues>;
	initialContent?: JSONContent;
}

export const MenuBar = ({
	editor,
}: {
	editor: EditorType | null;
}) => {
	if (!editor) {
		return null;
	}

	const EditorButton = ({ 
		label, 
		isActive, 
		onClick 
	}: { 
		label: string; 
		isActive: boolean; 
		onClick: () => void;
	}) => (
		<Button
			onClick={onClick}
			type='button'
			variant={isActive ? 'contained' : 'outlined'}
			sx={{
				minWidth: '32px',
				width: '32px',
				height: '28px',
				p: 0,
				fontSize: '0.875rem',
				fontWeight: 600,
				backgroundColor: isActive ? '#3b82f6' : 'white',
				color: isActive ? 'white' : '#4b5563',
				borderColor: isActive ? '#3b82f6' : '#d1d5db',
				'&:hover': {
					backgroundColor: isActive ? '#1d4ed8' : '#f3f4f6',
				},
			}}
		>
			{label}
		</Button>
	);

	return (
		<Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
			<EditorButton 
				label="H1" 
				isActive={editor.isActive('heading', { level: 1 })}
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			/>
			<EditorButton 
				label="H2" 
				isActive={editor.isActive('heading', { level: 2 })}
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			/>
			<EditorButton 
				label="H3" 
				isActive={editor.isActive('heading', { level: 3 })}
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			/>
			<EditorButton 
				label="N" 
				isActive={editor.isActive('bold')}
				onClick={() => editor.chain().focus().toggleBold().run()}
			/>
			<EditorButton 
				label="K" 
				isActive={editor.isActive('italic')}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			/>
			<EditorButton 
				label="S" 
				isActive={editor.isActive('strike')}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			/>
		</Stack>
	);
};

export const Editor = ({
	setValue,
	errors,
	initialContent,
}: Props) => {
	const editor = useEditor({
		extensions: [StarterKit],
		content: initialContent || '',
		onUpdate: ({ editor }) => {
			const content = editor.getJSON();
			setValue('description', content, { shouldValidate: true });
		},
		editorProps: {
			attributes: {
        class:
          'focus:outline-none min-h-[400px] prose prose-sm sm:prose-base p-4 border border-gray-400 rounded-md'
      }
		},
	});

	useEffect(() => {
		if (initialContent && editor) {
			editor.commands.setContent(initialContent);
		}
	}, [initialContent, editor]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <MenuBar editor={editor} />

      <Box
        sx={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          minHeight: '100px',
          p: 2,
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {errors.description && (
        <Typography sx={{ color: '#ef4444', fontSize: '0.75rem', mt: 0.5 }}>
          {(errors.description.message as ReactNode) ||
            'Debe escribir una descripción'}
        </Typography>
      )}
    </Box>
	);
};
