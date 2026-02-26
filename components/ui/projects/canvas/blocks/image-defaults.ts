/**
 * Content shape for image block. Stored in block.content for image-type blocks.
 * The url is typically a Vercel Blob URL after upload.
 */
export type ImageBlockContent = {
  url: string;
  alt?: string;
  title?: string;
};

/** Default content for new image blocks. */
export const DEFAULT_IMAGE_CONTENT: ImageBlockContent = {
  url: "",
};

/**
 * Returns valid image content from unknown value.
 * Normalizes empty or legacy content to the default.
 */
export function getImageContent(value: unknown): ImageBlockContent {
  if (value && typeof value === "object" && "url" in value) {
    const v = value as {
      url?: unknown;
      alt?: unknown;
      title?: unknown;
    };
    return {
      url: typeof v.url === "string" ? v.url : "",
      alt:
        v.alt !== undefined && v.alt !== null ? String(v.alt) : undefined,
      title:
        v.title !== undefined && v.title !== null ? String(v.title) : undefined,
    };
  }
  return { ...DEFAULT_IMAGE_CONTENT };
}
