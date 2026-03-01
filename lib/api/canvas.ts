import type {
  Canvas,
  CanvasBlock,
  CanvasBlockType,
  Document,
} from "@/lib/types/canvas";

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

export async function fetchCanvases(projectId: string): Promise<Canvas[]> {
  const res = await fetch(`/api/projects/${projectId}/canvases`);
  if (!res.ok) throw new Error("Failed to fetch canvases");
  const data = await res.json();
  return data.canvases ?? [];
}

export async function createCanvas(
  projectId: string,
  name?: string,
  order?: number
): Promise<Canvas> {
  const res = await fetch(`/api/projects/${projectId}/canvases`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name ?? "Untitled Canvas", order }),
  });
  if (!res.ok) throw new Error("Failed to create canvas");
  return res.json();
}

export async function updateCanvas(
  projectId: string,
  canvasId: string,
  updates: { name?: string; order?: number }
): Promise<Canvas> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );
  if (!res.ok) throw new Error("Failed to update canvas");
  return res.json();
}

export async function reorderCanvases(
  projectId: string,
  updates: { id: string; order: number }[]
): Promise<Canvas[]> {
  const res = await fetch(`/api/projects/${projectId}/canvases`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) throw new Error("Failed to reorder canvases");
  const data = await res.json();
  return data.canvases ?? [];
}

export async function deleteCanvas(
  projectId: string,
  canvasId: string
): Promise<void> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete canvas");
}

export async function fetchCanvasBlocks(
  projectId: string,
  canvasId: string
): Promise<CanvasBlock[]> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}`
  );
  if (!res.ok) throw new Error("Failed to fetch canvas blocks");
  const data = await res.json();
  const raw = Array.isArray(data.blocks) ? data.blocks : [];
  return hydrateBlocks(raw);
}

export type SaveCanvasResult =
  | { ok: true; updatedAt: string }
  | { ok: false; conflict: true }
  | { ok: false; conflict: false; error: string };

export async function saveCanvasBlocks(
  projectId: string,
  canvasId: string,
  blocks: CanvasBlock[],
  lastSavedAt?: string
): Promise<SaveCanvasResult> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks, lastSavedAt }),
    }
  );

  if (res.status === 409) {
    return { ok: false, conflict: true };
  }

  if (!res.ok) {
    return { ok: false, conflict: false, error: "Failed to save canvas blocks" };
  }

  const data = await res.json();
  return { ok: true, updatedAt: data.updatedAt ?? new Date().toISOString() };
}

export type SaveCanvasDocumentResult =
  | { ok: true; updatedAt: string }
  | { ok: false; conflict: true }
  | { ok: false; conflict: false; error: string };

export async function saveCanvasDocument(
  projectId: string,
  canvasId: string,
  documentContent: unknown,
  lastSavedAt?: string
): Promise<SaveCanvasDocumentResult> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/document`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentContent, lastSavedAt }),
    }
  );

  if (res.status === 409) {
    return { ok: false, conflict: true };
  }

  if (!res.ok) {
    return {
      ok: false,
      conflict: false,
      error: "Failed to save document",
    };
  }

  const data = await res.json();
  return { ok: true, updatedAt: data.updatedAt ?? new Date().toISOString() };
}

export async function fetchDocuments(
  projectId: string,
  canvasId: string
): Promise<Document[]> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/documents`
  );
  if (!res.ok) throw new Error("Failed to fetch documents");
  const data = await res.json();
  return data.documents ?? [];
}

export async function createDocument(
  projectId: string,
  canvasId: string,
  name?: string,
  order?: number
): Promise<Document> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/documents`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name ?? "Untitled Document", order }),
    }
  );
  if (!res.ok) throw new Error("Failed to create document");
  return res.json();
}

export async function updateDocument(
  projectId: string,
  canvasId: string,
  documentId: string,
  updates: { name?: string; order?: number }
): Promise<Document> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/documents/${documentId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );
  if (!res.ok) throw new Error("Failed to update document");
  return res.json();
}

export async function deleteDocument(
  projectId: string,
  canvasId: string,
  documentId: string
): Promise<void> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/documents/${documentId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete document");
}

export async function reorderDocuments(
  projectId: string,
  canvasId: string,
  updates: { id: string; order: number }[]
): Promise<Document[]> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/documents`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    }
  );
  if (!res.ok) throw new Error("Failed to reorder documents");
  const data = await res.json();
  return data.documents ?? [];
}

export type SaveDocumentResult =
  | { ok: true; updatedAt: string }
  | { ok: false; conflict: true }
  | { ok: false; conflict: false; error: string };

export async function saveDocument(
  projectId: string,
  canvasId: string,
  documentId: string,
  content: unknown,
  lastSavedAt?: string
): Promise<SaveDocumentResult> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/documents/${documentId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, lastSavedAt }),
    }
  );

  if (res.status === 409) {
    return { ok: false, conflict: true };
  }

  if (!res.ok) {
    return {
      ok: false,
      conflict: false,
      error: "Failed to save document",
    };
  }

  const data = await res.json();
  return { ok: true, updatedAt: data.updatedAt ?? new Date().toISOString() };
}
