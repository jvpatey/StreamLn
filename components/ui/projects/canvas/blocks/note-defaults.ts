/**
 * Tiptap/ProseMirror JSON document shape for note block content.
 * Stored in block.content for note-type blocks.
 */
export type NoteBlockContent = {
  type: "doc";
  content?: Array<Record<string, unknown>>;
};

/** Minimal empty Tiptap document for new note blocks. */
export const DEFAULT_NOTE_CONTENT: NoteBlockContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

/**
 * Returns valid Tiptap JSON for the note editor.
 * Normalizes empty or legacy content to the default doc.
 */
export function getNoteContent(value: unknown): NoteBlockContent {
  if (
    value &&
    typeof value === "object" &&
    "type" in value &&
    (value as { type: string }).type === "doc"
  ) {
    return value as NoteBlockContent;
  }
  return DEFAULT_NOTE_CONTENT;
}
