/**
 * Content shape for link block. Stored in block.content for link-type blocks.
 */
export type LinkBlockContent = {
  url: string;
  label?: string;
};

/** Default content for new link blocks. */
export const DEFAULT_LINK_CONTENT: LinkBlockContent = {
  url: "",
  label: "",
};

/**
 * Returns valid link content from unknown value.
 * Normalizes empty or legacy content to the default.
 */
export function getLinkContent(value: unknown): LinkBlockContent {
  if (value && typeof value === "object" && "url" in value) {
    const v = value as { url?: unknown; label?: unknown };
    return {
      url: typeof v.url === "string" ? v.url : "",
      label:
        v.label !== undefined && v.label !== null
          ? String(v.label)
          : undefined,
    };
  }
  return { ...DEFAULT_LINK_CONTENT };
}

const MAX_DISPLAY_LENGTH = 50;

/**
 * Returns display text for the link: custom label if set, otherwise hostname
 * from URL or truncated URL. Empty string if no URL.
 */
export function getLinkDisplayLabel(content: LinkBlockContent): string {
  const { url, label } = content;
  if (label && label.trim()) return label.trim();
  if (!url || !url.trim()) return "";

  const trimmed = url.trim();
  try {
    const parsed = new URL(
      trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    );
    const hostname = parsed.hostname.replace(/^www\./, "");
    return hostname.length > MAX_DISPLAY_LENGTH
      ? hostname.slice(0, MAX_DISPLAY_LENGTH) + "…"
      : hostname;
  } catch {
    return trimmed.length > MAX_DISPLAY_LENGTH
      ? trimmed.slice(0, MAX_DISPLAY_LENGTH) + "…"
      : trimmed;
  }
}
