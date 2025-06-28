import { Mark } from '@tiptap/core';

export const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (el) => el.style.fontSize || null,
        renderHTML: (attrs) => attrs.size ? { style: `font-size: ${attrs.size}` } : {},
      },
    };
  },
  parseHTML() {
    return [{ style: 'font-size' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ commands }) => {
          return commands.setMark(this.name, { size });
        },
    };
  },
});
