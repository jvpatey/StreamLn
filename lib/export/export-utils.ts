/**
 * Shared types and utilities for canvas export
 */

import type { CanvasBlock } from "@/lib/types/canvas";

export interface ExportProject {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status: string;
}

export interface ExportCanvas {
  id: string;
  name: string;
  order: number;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExportCanvasWithBlocks {
  id: string;
  name: string;
  order: number;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
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
    order?: number;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface ExportProjectData {
  project: ExportProject;
  canvases: ExportCanvasWithBlocks[];
}

/** Sanitize a string for use in filenames (replace spaces, remove invalid chars) */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/\s+/g, "-")
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "export";
}

/** Trigger a file download in the browser */
export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType?: string
): void {
  const blob =
    typeof content === "string"
      ? new Blob([content], { type: mimeType ?? "application/octet-stream" })
      : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Serialize a block for JSON export (ensure dates are ISO strings) */
export function serializeBlock(block: CanvasBlock): Record<string, unknown> {
  const { createdAt, updatedAt, ...rest } = block;
  return {
    ...rest,
    createdAt:
      createdAt instanceof Date
        ? createdAt.toISOString()
        : typeof createdAt === "string"
          ? createdAt
          : null,
    updatedAt:
      updatedAt instanceof Date
        ? updatedAt.toISOString()
        : typeof updatedAt === "string"
          ? updatedAt
          : null,
  };
}

/** Convert API block to CanvasBlock for serializers and renderers */
export function toCanvasBlock(
  b: ExportCanvasWithBlocks["blocks"][number]
): CanvasBlock {
  return {
    id: b.id,
    type: b.type as CanvasBlock["type"],
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
}
