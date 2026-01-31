/**
 * Content shape for tag block. Stored in block.content for tag-type blocks.
 */
export type TagBlockContent = {
  label: string;
};

/** Default content for new tag blocks. */
export const DEFAULT_TAG_CONTENT: TagBlockContent = {
  label: "",
};

/**
 * Returns valid tag content from unknown value.
 * Normalizes empty or legacy content to the default.
 */
export function getTagContent(value: unknown): TagBlockContent {
  if (value && typeof value === "object" && "label" in value) {
    const v = value as { label?: unknown };
    return {
      label: typeof v.label === "string" ? v.label : "",
    };
  }
  return { ...DEFAULT_TAG_CONTENT };
}

const MAX_DISPLAY_LENGTH = 30;

/**
 * Returns display text for the tag: trimmed label, optionally truncated.
 * Empty string if no label.
 */
export function getTagDisplayLabel(content: TagBlockContent): string {
  const trimmed = (content.label ?? "").trim();
  if (!trimmed) return "";
  return trimmed.length > MAX_DISPLAY_LENGTH
    ? trimmed.slice(0, MAX_DISPLAY_LENGTH) + "…"
    : trimmed;
}
