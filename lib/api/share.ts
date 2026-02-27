export interface ShareToken {
  id: string;
  token: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface SharedCanvasData {
  projectName: string;
  canvasName: string;
  expiresAt: string | null;
  blocks: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: unknown;
    color?: string | null;
    title?: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export async function createShareToken(
  projectId: string,
  canvasId: string,
  expiresInDays?: number
): Promise<ShareToken> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/share`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        expiresInDays ? { expiresIn: expiresInDays } : {}
      ),
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to create share link");
  }
  return res.json();
}

export async function listShareTokens(
  projectId: string,
  canvasId: string
): Promise<{ tokens: ShareToken[] }> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/share`
  );
  if (!res.ok) throw new Error("Failed to fetch share links");
  return res.json();
}

export async function revokeShareToken(
  projectId: string,
  canvasId: string,
  tokenId: string
): Promise<void> {
  const res = await fetch(
    `/api/projects/${projectId}/canvases/${canvasId}/share/${tokenId}`,
    { method: "DELETE" }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to revoke share link");
  }
}

export async function fetchSharedCanvas(
  token: string
): Promise<SharedCanvasData> {
  const res = await fetch(`/api/share/${encodeURIComponent(token)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Failed to load shared canvas");
  }
  return res.json();
}
