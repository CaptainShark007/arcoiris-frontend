import {
  EditorContent,
  JSONContent,
  useEditor,
  type Editor as EditorType,
} from '@tiptap/react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { ReactNode, useEffect } from 'react';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { ProductFormValues } from '@features/admin/schema/productSchema';

const Icon = ({ d, size = 14 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  bold:        'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z',
  italic:      'M19 4h-9M14 20H5M15 4 9 20',
  strike:      'M17.3 12H6.7M10 8.5c0-1.1.9-2.5 3-2.5s3 1.1 3 2.5c0 2.5-6 2.5-6 5s.9 2.5 3 2.5 3-1.1 3-2.5',
  ul:          'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  ol:          'M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
  quote:       'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z',
  alignLeft:   'M21 6H3M15 12H3M17 18H3',
  alignCenter: 'M21 6H3M17 12H7M19 18H5',
  alignRight:  'M21 6H3M21 12H9M21 18H11',
  code:        'M16 18l6-6-6-6M8 6l-6 6 6 6',
  undo:        'M3 7v6h6M3.51 15a9 9 0 1 0 .49-3.6',
  redo:        'M21 7v6h-6M20.49 15a9 9 0 1 1-.49-3.6',
};

const ToolbarBtn = ({
  label,
  isActive = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <Tooltip title={label} placement="top" arrow enterDelay={600}>
    <Box
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isActive ? '#e8eaff' : 'transparent',
        color: isActive ? '#0007d7ff' : disabled ? '#d1d5db' : '#374151',
        transition: 'background-color 120ms, color 120ms',
        flexShrink: 0,
        '&:hover:not(:disabled)': {
          backgroundColor: isActive ? '#e8eaff' : '#f3f4f6',
        },
      }}
    >
      {children}
    </Box>
  </Tooltip>
);

const Sep = () => (
  <Divider
    orientation="vertical"
    flexItem
    sx={{ borderColor: '#e5e7eb', mx: 0.25, my: 0.5 }}
  />
);

const Toolbar = ({ editor }: { editor: EditorType | null }) => {
  if (!editor) return null;

  const groups: {
    label: string;
    icon: keyof typeof icons;
    isActive: () => boolean;
    action: () => void;
    disabled?: boolean;
  }[][] = [
  ];

  void groups;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 0.25,
        px: 1,
        py: 0.75,
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        borderRadius: '7px 7px 0 0',
      }}
    >
      {/* Headings */}
      {(['H1', 'H2', 'H3'] as const).map((h, i) => (
        <ToolbarBtn
          key={h}
          label={`Título ${i + 1}`}
          isActive={editor.isActive('heading', { level: i + 1 })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: (i + 1) as 1 | 2 | 3 })
              .run()
          }
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {h}
          </Typography>
        </ToolbarBtn>
      ))}

      <Sep />

      {/* Formato inline */}
      {[
        { label: 'Negrita',      icon: 'bold'   as const, active: () => editor.isActive('bold'),   action: () => editor.chain().focus().toggleBold().run() },
        { label: 'Cursiva',      icon: 'italic' as const, active: () => editor.isActive('italic'), action: () => editor.chain().focus().toggleItalic().run() },
        { label: 'Tachado',      icon: 'strike' as const, active: () => editor.isActive('strike'), action: () => editor.chain().focus().toggleStrike().run() },
        { label: 'Código inline',icon: 'code'   as const, active: () => editor.isActive('code'),   action: () => editor.chain().focus().toggleCode().run() },
      ].map(({ label, icon, active, action }) => (
        <ToolbarBtn key={label} label={label} isActive={active()} onClick={action}>
          <Icon d={icons[icon]} />
        </ToolbarBtn>
      ))}

      <Sep />

      {/* Listas */}
      {[
        { label: 'Lista sin orden', icon: 'ul' as const, active: () => editor.isActive('bulletList'),  action: () => editor.chain().focus().toggleBulletList().run() },
        { label: 'Lista ordenada', icon: 'ol' as const,  active: () => editor.isActive('orderedList'), action: () => editor.chain().focus().toggleOrderedList().run() },
        { label: 'Cita',           icon: 'quote' as const, active: () => editor.isActive('blockquote'), action: () => editor.chain().focus().toggleBlockquote().run() },
      ].map(({ label, icon, active, action }) => (
        <ToolbarBtn key={label} label={label} isActive={active()} onClick={action}>
          <Icon d={icons[icon]} />
        </ToolbarBtn>
      ))}

      <Sep />

      {/* Alineación */}
      {[
        { label: 'Alinear izquierda', icon: 'alignLeft'   as const, align: 'left' },
        { label: 'Centrar',           icon: 'alignCenter' as const, align: 'center' },
        { label: 'Alinear derecha',   icon: 'alignRight'  as const, align: 'right' },
      ].map(({ label, icon, align }) => (
        <ToolbarBtn
          key={align}
          label={label}
          isActive={editor.isActive({ textAlign: align })}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
        >
          <Icon d={icons[icon]} />
        </ToolbarBtn>
      ))}

      <Sep />

      {/* Historial */}
      {[
        { label: 'Deshacer', icon: 'undo' as const, disabled: !editor.can().undo(), action: () => editor.chain().focus().undo().run() },
        { label: 'Rehacer',  icon: 'redo' as const, disabled: !editor.can().redo(), action: () => editor.chain().focus().redo().run() },
      ].map(({ label, icon, disabled, action }) => (
        <ToolbarBtn key={label} label={label} disabled={disabled} onClick={action}>
          <Icon d={icons[icon]} />
        </ToolbarBtn>
      ))}
    </Box>
  );
};

interface EditorProps {
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  initialContent?: JSONContent;
}

export const Editor = ({ setValue, errors, initialContent }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribí una descripción detallada del producto...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      setValue('description', editor.getJSON(), { shouldValidate: true });
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
      },
    },
  });

  useEffect(() => {
    if (initialContent && editor && !editor.isDestroyed) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  const hasError = !!errors.description;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box
        sx={{
          border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white',
          transition: 'border-color 150ms',
          '&:focus-within': {
            borderColor: hasError ? '#ef4444' : '#0007d7ff',
            boxShadow: hasError
              ? '0 0 0 3px rgba(239,68,68,0.1)'
              : '0 0 0 3px rgba(0,7,215,0.08)',
          },

          // Estilos del contenido del editor
          '& .tiptap-editor-content': {
            outline: 'none',
            minHeight: { xs: '180px', sm: '220px', md: '260px' },
            maxHeight: '480px',
            overflowY: 'auto',
            padding: '12px 14px',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            color: '#1f2937',
            fontFamily: 'inherit',
          },

          // Placeholder
          '& .tiptap-editor-content p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            color: '#9ca3af',
            pointerEvents: 'none',
            float: 'left',
            height: 0,
          },

          // Tipografía del contenido
          '& .tiptap-editor-content h1': { fontSize: '1.4rem', fontWeight: 700, mt: 1.5, mb: 0.5 },
          '& .tiptap-editor-content h2': { fontSize: '1.15rem', fontWeight: 700, mt: 1.5, mb: 0.5 },
          '& .tiptap-editor-content h3': { fontSize: '1rem', fontWeight: 600, mt: 1, mb: 0.25 },
          '& .tiptap-editor-content ul':  { pl: 3, my: 0.5 },
          '& .tiptap-editor-content ol':  { pl: 3, my: 0.5 },
          '& .tiptap-editor-content li':  { mb: 0.25 },
          '& .tiptap-editor-content blockquote': {
            borderLeft: '3px solid #e5e7eb',
            pl: 1.5,
            ml: 0,
            color: '#6b7280',
            fontStyle: 'italic',
            my: 1,
          },
          '& .tiptap-editor-content code': {
            backgroundColor: '#f3f4f6',
            borderRadius: '3px',
            px: 0.5,
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            color: '#374151',
          },
          '& .tiptap-editor-content p': { my: 0.25 },
        }}
      >
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </Box>

      {hasError && (
        <Typography sx={{ color: '#ef4444', fontSize: '0.7rem', mt: 0.25 }}>
          {errors.description?.message as ReactNode ?? 'Debe escribir una descripción'}
        </Typography>
      )}
    </Box>
  );
};