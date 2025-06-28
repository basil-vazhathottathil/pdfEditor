import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontSize } from '../extensions/FontSize';
import styles from './Editor.module.css';

export default function Editor({ tiptapJson, onUpdate }) {
  const editor = useEditor({
    extensions: [StarterKit, FontSize],
    content: tiptapJson,
    onUpdate: ({ editor }) => {
      if (onUpdate) onUpdate(editor);
    },
  });

  if (!editor) return null;

  return (
    <div className={styles['editor-wrapper']}>
      {/* Toolbar */}
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
        <button
          onClick={() => editor.chain().focus().setFontSize('14px').run()}
        >
          14px
        </button>
        <button
          onClick={() => editor.chain().focus().setFontSize('18px').run()}
        >
          18px
        </button>
      </div>

      {/* Editable content */}
      <EditorContent editor={editor} />
    </div>
  );
}
