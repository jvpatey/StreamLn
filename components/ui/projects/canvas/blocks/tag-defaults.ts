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

/**
 * Returns display text for the tag: trimmed label with # prefix.
 * Full text is returned so it can always be visible (no truncation).
 */
export function getTagDisplayLabel(content: TagBlockContent): string {
  const raw = (content.label ?? "").trim().replace(/^#+/, "");
  if (!raw) return "";
  return `#${raw}`;
}
