// ✅ Editor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontSize } from '../extensions/FontSize';
import { FontFamily } from '../extensions/FontFamily';
import styles from './Editor.module.css';

const fontSizes = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
];

const fonts = [
  { label: 'Sans Serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: '"Courier New", monospace' },
];

export default function Editor({ tiptapJson, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit, FontSize, FontFamily],
    content: tiptapJson,
    onUpdate: ({ editor }) => {
      if (onUpdate) onUpdate(editor);
    },
  });

  if (!editor) return null;

  return (
    <div className={styles['editor-wrapper']}>
      <div className={styles.toolbar}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? styles.active : ''}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? styles.active : ''}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? styles.active : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? styles.active : ''}
        >
          H2
        </button>

        <select
          onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('fontFamily').family || ''}
          style={{ marginLeft: 8, minWidth: 120 }}
        >
          <option value="">Font</option>
          {fonts.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          value={editor.getAttributes('fontSize').size || ''}
          onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
          style={{ marginLeft: 8, minWidth: 70 }}
        >
          <option value="">Font Size</option>
          {fontSizes.map(size => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>

        <button
          style={{ marginLeft: 'auto' }}
          onClick={() => onUpdate(editor)}
        >
          Export PDF
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}