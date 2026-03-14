/**
 * Default blocks for new canvases. App-scoped, generic sample project.
 */

function generateBlockId(type: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${type}-${crypto.randomUUID()}`;
  }
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Tiptap doc for note: Canvas overview with app features */
const CANVAS_OVERVIEW_NOTE_CONTENT = {
  type: "doc" as const,
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Use blocks for notes, tasks, and code. Documents for long-form writing.",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Add blocks from the sidebar (note, task board, code, link)",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Documents for full-screen editing with headings and lists",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Export as JSON, Markdown, or PDF",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Share links from the navbar",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Use the command palette to search projects",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Task board: single column with sample cards */
function createTaskBoardContent() {
  const col1 = generateId();
  const card1 = generateId();
  const card2 = generateId();
  const card3 = generateId();
  return {
    columns: [{ id: col1, title: "To do", cardIds: [card1, card2, card3] }],
    cards: {
      [card1]: { id: card1, text: "Export to PDF" },
      [card2]: { id: card2, text: "Share link expiry options" },
      [card3]: { id: card3, text: "Document export" },
    },
  };
}

/** Default block types we use in the starter template */
const DEFAULT_TEMPLATE_TYPES = new Set([
  "text",
  "tag",
  "note",
  "task-board",
  "code",
  "link",
]);

/**
 * Returns true if the blocks match the default starter template (6 blocks with expected types).
 */
export function isDefaultTemplate(
  blocks: Array<{ type: string }>
): boolean {
  if (blocks.length !== 6) return false;
  const types = new Set(blocks.map((b) => b.type));
  return (
    types.size === 6 &&
    [...types].every((t) => DEFAULT_TEMPLATE_TYPES.has(t))
  );
}

export interface DefaultBlockInput {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: unknown;
  color?: string;
  title?: string;
}

/**
 * Returns default blocks for a new canvas. IDs are generated per call.
 */
export function getDefaultCanvasBlocks(): DefaultBlockInput[] {
  const taskBoardContent = createTaskBoardContent();

  const GAP = 24;
  const HEADER_H = 52;

  return [
    {
      id: generateBlockId("text"),
      type: "text",
      x: 0,
      y: 0,
      width: 140,
      height: 44,
      content: { text: "Canvas overview" },
      color: "#64748b",
    },
    {
      id: generateBlockId("tag"),
      type: "tag",
      x: 148,
      y: 0,
      width: 120,
      height: 44,
      content: { label: "canvas" },
      color: "#ef4444",
    },
    {
      id: generateBlockId("note"),
      type: "note",
      x: 0,
      y: HEADER_H,
      width: 320,
      height: 340,
      content: CANVAS_OVERVIEW_NOTE_CONTENT,
      color: "#3b82f6",
    },
    {
      id: generateBlockId("task-board"),
      type: "task-board",
      x: 320 + GAP,
      y: HEADER_H,
      width: 480,
      height: 380,
      content: taskBoardContent,
      color: "#10b981",
    },
    {
      id: generateBlockId("code"),
      type: "code",
      x: 0,
      y: HEADER_H + 380 + GAP,
      width: 380,
      height: 320,
      content: {
        code: `interface CanvasBlock {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: unknown;
}`,
        language: "typescript",
      },
      color: "#8b5cf6",
    },
    {
      id: generateBlockId("link"),
      type: "link",
      x: 380 + GAP,
      y: HEADER_H + 380 + GAP,
      width: 420,
      height: 320,
      content: {
        url: "https://streamln.vercel.app",
        label: "StreamLn",
      },
      color: "#06b6d4",
    },
  ];
}
