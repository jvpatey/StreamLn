import type { CanvasBlock, CanvasBlockType } from "@/lib/types/canvas";

interface RawBlock {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: unknown;
  color?: string | null;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
}

const BLOCK_TYPES: CanvasBlockType[] = [
  "note",
  "task-board",
  "code",
  "image",
  "link",
  "tag",
  "text",
  "shape",
];

function hydrateBlocks(raw: RawBlock[]): CanvasBlock[] {
  return raw.map((b) => {
    const type = BLOCK_TYPES.includes(b.type as CanvasBlockType)
      ? (b.type as CanvasBlockType)
      : "note";
    return {
      id: b.id,
      type,
      x: b.x,
      y: b.y,
      width: b.width,
      height: b.height,
      content: b.content,
      color: b.color ?? undefined,
      title: b.title ?? undefined,
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.updatedAt),
    };
  });
}

export async function fetchCanvasBlocks(
  projectId: string
): Promise<CanvasBlock[]> {
  const res = await fetch(`/api/projects/${projectId}/canvas`);
  if (!res.ok) throw new Error("Failed to fetch canvas blocks");
  const data = await res.json();
  const raw = Array.isArray(data.blocks) ? data.blocks : [];
  return hydrateBlocks(raw);
}

export async function saveCanvasBlocks(
  projectId: string,
  blocks: CanvasBlock[]
): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/canvas`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
  if (!res.ok) throw new Error("Failed to save canvas blocks");
}
