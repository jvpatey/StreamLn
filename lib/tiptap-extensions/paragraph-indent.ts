/**
 * Extends TipTap Paragraph with first-line indent support.
 * Tab indents the paragraph, Shift-Tab removes indent.
 */
import { Paragraph } from "@tiptap/extension-paragraph";

const INDENT_SIZE = "2em";

export const ParagraphWithIndent = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      indent: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).style.textIndent || null,
        renderHTML: (attrs) =>
          attrs.indent ? { style: `text-indent: ${attrs.indent}` } : {},
      },
    };
  },
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: () => {
        if (
          this.editor.isActive("listItem") ||
          this.editor.isActive("taskItem")
        ) {
          return false;
        }
        return this.editor.commands.updateAttributes("paragraph", {
          indent: INDENT_SIZE,
        });
      },
      "Shift-Tab": () => {
        if (
          this.editor.isActive("listItem") ||
          this.editor.isActive("taskItem")
        ) {
          return false;
        }
        return this.editor.commands.updateAttributes("paragraph", {
          indent: null,
        });
      },
    };
  },
});
