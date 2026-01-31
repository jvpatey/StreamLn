/**
 * Content shape for task board block. Stored in block.content for task-board-type blocks.
 */

export type TaskBoardCard = {
  id: string;
  text: string;
};

export type TaskBoardColumn = {
  id: string;
  title: string;
  cardIds: string[];
};

export type TaskBoardContent = {
  columns: TaskBoardColumn[];
  cards: Record<string, TaskBoardCard>;
};

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Creates default content with a single blank board. */
function createDefaultContent(): TaskBoardContent {
  return {
    columns: [{ id: generateId(), title: "", cardIds: [] }],
    cards: {},
  };
}

/** Default content for new task board blocks: one board with blank title. */
export function getDefaultTaskBoardContent(): TaskBoardContent {
  return createDefaultContent();
}

/**
 * Returns valid task board content from unknown value.
 * Normalizes empty or legacy content to the default.
 */
export function getTaskBoardContent(value: unknown): TaskBoardContent {
  if (!value || typeof value !== "object") {
    return createDefaultContent();
  }

  const v = value as { columns?: unknown; cards?: unknown };

  const columns: TaskBoardColumn[] = [];
  if (Array.isArray(v.columns) && v.columns.length > 0) {
    for (const c of v.columns) {
      if (
        c &&
        typeof c === "object" &&
        "id" in c &&
        "title" in c &&
        "cardIds" in c
      ) {
        const col = c as { id: unknown; title: unknown; cardIds: unknown };
        columns.push({
          id: typeof col.id === "string" ? col.id : generateId(),
          title: typeof col.title === "string" ? col.title : "",
          cardIds: Array.isArray(col.cardIds)
            ? col.cardIds.filter((id): id is string => typeof id === "string")
            : [],
        });
      }
    }
  }

  if (columns.length === 0) {
    return createDefaultContent();
  }

  const cards: Record<string, TaskBoardCard> = {};
  if (v.cards && typeof v.cards === "object" && !Array.isArray(v.cards)) {
    const cardsObj = v.cards as Record<string, unknown>;
    for (const key of Object.keys(cardsObj)) {
      const card = cardsObj[key];
      if (card && typeof card === "object" && "id" in card && "text" in card) {
        const c = card as { id: unknown; text: unknown };
        if (typeof c.id === "string" && typeof c.text === "string") {
          cards[c.id] = { id: c.id, text: c.text };
        }
      }
    }
  }

  return { columns, cards };
}

/** Generates a new unique ID for columns or cards. */
export function createId(): string {
  return generateId();
}
