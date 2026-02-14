/**
 * Content shape for shape block. Stored in block.content for shape-type blocks.
 */
export type ShapeKind = "rectangle" | "circle" | "line" | "arrow";

export type ShapeBlockContent = {
  shapeKind: ShapeKind;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
};

const DEFAULT_STROKE = "hsl(var(--foreground) / 0.4)";

/** Default content for new shape blocks. */
export const DEFAULT_SHAPE_CONTENT: ShapeBlockContent = {
  shapeKind: "rectangle",
  strokeColor: DEFAULT_STROKE,
  fillColor: "transparent",
  strokeWidth: 2,
};

/**
 * Returns valid shape block content from unknown value.
 */
export function getShapeContent(value: unknown): ShapeBlockContent {
  if (value && typeof value === "object" && "shapeKind" in value) {
    const v = value as {
      shapeKind?: unknown;
      strokeColor?: unknown;
      fillColor?: unknown;
      strokeWidth?: unknown;
    };
    const kind = v.shapeKind as string | undefined;
    const validKind: ShapeKind =
      kind === "rectangle" || kind === "circle" || kind === "line" || kind === "arrow"
        ? kind
        : "rectangle";
    return {
      shapeKind: validKind,
      strokeColor: typeof v.strokeColor === "string" ? v.strokeColor : DEFAULT_STROKE,
      fillColor: typeof v.fillColor === "string" ? v.fillColor : "transparent",
      strokeWidth:
        typeof v.strokeWidth === "number" && v.strokeWidth > 0 ? v.strokeWidth : 2,
    };
  }
  return { ...DEFAULT_SHAPE_CONTENT };
}
