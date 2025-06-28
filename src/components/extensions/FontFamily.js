import { Mark } from '@tiptap/core';

export const FontFamily = Mark.create({
  name: 'fontFamily',
  addAttributes() {
    return {
      family: {
        default: null,
        parseHTML: el => el.style.fontFamily?.replace(/['"]/g, '') || null,
        renderHTML: attrs => attrs.family ? { style: `font-family: ${attrs.family}` } : {},
      },
    };
  },
  parseHTML() {
    return [{ style: 'font-family' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0];
  },
  addCommands() {
    return {
      setFontFamily:
        family =>
        ({ commands }) => {
          return commands.setMark(this.name, { family });
        },
    };
  },
});