/**
 * Content shape for code block. Stored in block.content for code-type blocks.
 */
export type CodeBlockContent = {
  code: string;
  language?: string;
};

/** Default content for new code blocks. */
export const DEFAULT_CODE_CONTENT: CodeBlockContent = {
  code: "",
  language: "javascript",
};

/**
 * Returns valid code content from unknown value.
 * Normalizes empty or legacy content to the default.
 */
export function getCodeContent(value: unknown): CodeBlockContent {
  if (value && typeof value === "object" && "code" in value) {
    const v = value as { code?: unknown; language?: unknown };
    return {
      code: typeof v.code === "string" ? v.code : "",
      language:
        v.language !== undefined &&
        v.language !== null &&
        typeof v.language === "string"
          ? v.language
          : DEFAULT_CODE_CONTENT.language,
    };
  }
  return { ...DEFAULT_CODE_CONTENT };
}

/** Supported languages for the code block dropdown (id, label). */
export const CODE_BLOCK_LANGUAGES: Array<{ id: string; label: string }> = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "json", label: "JSON" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "markdown", label: "Markdown" },
  { id: "python", label: "Python" },
];
