/**
 * Content shape for text block. Stored in block.content for text-type blocks.
 */
export type TextBlockContent = {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: "left" | "center" | "right";
};

const DEFAULT_FONT_SIZE = 14;
/** Theme-aware default: matches body text (light: dark blue-gray, dark: white) */
const DEFAULT_TEXT_COLOR = "hsl(var(--foreground))";

/** Default content for new text blocks. */
export const DEFAULT_TEXT_CONTENT: TextBlockContent = {
  text: "",
  fontFamily: "system-ui",
  fontSize: DEFAULT_FONT_SIZE,
  color: DEFAULT_TEXT_COLOR,
  textAlign: "left",
};

/**
 * Returns valid text block content from unknown value.
 * Normalizes empty or legacy content to the default.
 */
export function getTextContent(value: unknown): TextBlockContent {
  if (value && typeof value === "object" && "text" in value) {
    const v = value as {
      text?: unknown;
      fontFamily?: unknown;
      fontSize?: unknown;
      color?: unknown;
      textAlign?: unknown;
    };
    const textAlign = v.textAlign as string | undefined;
    const validAlign =
      textAlign === "left" || textAlign === "center" || textAlign === "right"
        ? textAlign
        : "left";
    return {
      text: typeof v.text === "string" ? v.text : "",
      fontFamily: typeof v.fontFamily === "string" ? v.fontFamily : "system-ui",
      fontSize:
        typeof v.fontSize === "number" && v.fontSize > 0
          ? v.fontSize
          : DEFAULT_FONT_SIZE,
      color: typeof v.color === "string" ? v.color : DEFAULT_TEXT_COLOR,
      textAlign: validAlign,
    };
  }
  return { ...DEFAULT_TEXT_CONTENT };
}
