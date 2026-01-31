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

const MAX_TITLE_LENGTH = 50;

/**
 * Extracts the first line of text from a Tiptap doc JSON (first paragraph's text).
 * Used to sync the note block title with the note content.
 */
export function getFirstLineText(doc: NoteBlockContent): string {
  const content = doc.content;
  if (!Array.isArray(content) || content.length === 0) return "";

  const first = content[0];
  if (!first || typeof first !== "object" || (first as { type?: string }).type !== "paragraph")
    return "";

  const paraContent = (first as { content?: Array<{ type?: string; text?: string }> }).content;
  if (!Array.isArray(paraContent)) return "";

  const parts: string[] = [];
  for (const node of paraContent) {
    if (node && typeof node === "object" && (node as { type?: string }).type === "text" && "text" in node)
      parts.push(String((node as { text: string }).text));
  }
  const line = parts.join("").trim();
  return line.length > MAX_TITLE_LENGTH ? line.slice(0, MAX_TITLE_LENGTH) : line;
}
