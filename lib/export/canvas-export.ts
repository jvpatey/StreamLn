/**
 * Canvas export utilities - JSON, Markdown, CSV, PNG, PDF
ç * Project-level export: combined JSON, Markdown, ZIP of all canvases
 */

import JSZip from "jszip";
import type { CanvasBlock } from "@/lib/types/canvas";
import { getTaskBoardContent } from "@/components/ui/projects/canvas/blocks/task-board-defaults";
import {
  blockToMarkdown,
  sortBlocksForExport,
} from "./markdown-serializers";

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
function serializeBlock(block: CanvasBlock): Record<string, unknown> {
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

/**
 * Export canvas as JSON (full backup, re-import, data portability)
 */
export function exportAsJSON(
  project: ExportProject,
  canvas: ExportCanvas,
  blocks: CanvasBlock[]
): void {
  const payload = {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      icon: project.icon,
      status: project.status,
    },
    canvas: {
      id: canvas.id,
      name: canvas.name,
      order: canvas.order,
      projectId: canvas.projectId,
      createdAt: canvas.createdAt,
      updatedAt: canvas.updatedAt,
    },
    blocks: blocks.map(serializeBlock),
    exportedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(payload, null, 2);
  const base = sanitizeFilename(project.name) + "-" + sanitizeFilename(canvas.name);
  downloadFile(json, `${base}.json`, "application/json");
}

/**
 * Export canvas as Markdown (developer docs, version control, readability)
 */
export function exportAsMarkdown(
  project: ExportProject,
  canvas: ExportCanvas,
  blocks: CanvasBlock[]
): void {
  const sorted = sortBlocksForExport(blocks);
  const sections = sorted
    .map((block) => blockToMarkdown(block))
    .filter((s) => s.trim());

  const header = `# ${canvas.name}\n\n*Exported from ${project.name} • ${new Date().toISOString().slice(0, 10)}*\n\n---\n\n`;
  const body = sections.join("\n\n---\n\n");
  const md = header + body;

  const base = sanitizeFilename(project.name) + "-" + sanitizeFilename(canvas.name);
  downloadFile(md, `${base}.md`, "text/markdown");
}

/** Escape a CSV field (wrap in quotes if contains comma, newline, or quote) */
function escapeCsvField(value: string): string {
  if (!/[,"\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Export task board blocks as CSV (for spreadsheets)
 */
export function exportAsCSV(
  project: ExportProject,
  canvas: ExportCanvas,
  blocks: CanvasBlock[]
): void {
  const taskBoards = blocks.filter((b) => b.type === "task-board");
  if (taskBoards.length === 0) return;

  const rows: string[][] = [];
  rows.push(["Block Title", "Column", "Card Text"]);

  for (const block of taskBoards) {
    const { columns, cards } = getTaskBoardContent(block.content);
    const blockTitle = block.title?.trim() || "Untitled Board";

    for (const col of columns) {
      const colTitle = col.title?.trim() || "(Untitled)";
      if (col.cardIds.length === 0) {
        rows.push([blockTitle, colTitle, ""]);
      } else {
        for (const cardId of col.cardIds) {
          const card = cards[cardId];
          const text = card?.text?.trim() ?? "";
          rows.push([blockTitle, colTitle, text]);
        }
      }
    }
  }

  const csv = rows.map((row) => row.map(escapeCsvField).join(",")).join("\n");
  const base = sanitizeFilename(project.name) + "-" + sanitizeFilename(canvas.name);
  downloadFile(csv, `${base}-task-boards.csv`, "text/csv");
}

/**
 * Export canvas as PNG (visual snapshot)
 * Requires html-to-image and a ref to the canvas container element
 */
export async function exportCanvasAsPNG(
  element: HTMLElement | null,
  project: ExportProject,
  canvas: ExportCanvas
): Promise<void> {
  if (!element) return;

  const { toPng } = await import("html-to-image");
  const base = sanitizeFilename(project.name) + "-" + sanitizeFilename(canvas.name);

  try {
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
    });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    downloadFile(blob, `${base}.png`, "image/png");
  } catch (err) {
    console.error("PNG export failed:", err);
    throw err;
  }
}

/**
 * Export canvas as PDF (print, archive)
 * Requires html-to-image and jspdf
 */
export async function exportCanvasAsPDF(
  element: HTMLElement | null,
  project: ExportProject,
  canvas: ExportCanvas
): Promise<void> {
  if (!element) return;

  const { toPng } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");
  const base = sanitizeFilename(project.name) + "-" + sanitizeFilename(canvas.name);

  try {
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
    });

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = dataUrl;
    });

    const pdf = new jsPDF({
      orientation: img.width > img.height ? "landscape" : "portrait",
      unit: "px",
      format: [img.width, img.height],
    });
    pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
    pdf.save(`${base}.pdf`);
  } catch (err) {
    console.error("PDF export failed:", err);
    throw err;
  }
}

// --- Project-level export ---

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

/** Convert API block to CanvasBlock for serializers */
function toCanvasBlock(
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

/**
 * Export entire project as a single JSON file (all canvases + blocks)
 */
export function exportProjectAsJSON(data: ExportProjectData): void {
  const payload = {
    project: {
      id: data.project.id,
      name: data.project.name,
      description: data.project.description,
      icon: data.project.icon,
      status: data.project.status,
    },
    canvases: data.canvases.map((c) => ({
      id: c.id,
      name: c.name,
      order: c.order,
      projectId: c.projectId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      blocks: c.blocks.map((b) => serializeBlock(toCanvasBlock(b))),
    })),
    exportedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(payload, null, 2);
  const base = sanitizeFilename(data.project.name);
  downloadFile(json, `${base}-project.json`, "application/json");
}

/**
 * Export entire project as a single combined Markdown file
 */
export function exportProjectAsMarkdown(data: ExportProjectData): void {
  const sections: string[] = [];
  const header = `# ${data.project.name}\n\n*Exported project • ${new Date().toISOString().slice(0, 10)}*\n\n---\n\n`;
  sections.push(header);

  for (const canvas of data.canvases) {
    const blocks = canvas.blocks.map(toCanvasBlock);
    const sorted = sortBlocksForExport(blocks);
    const blockSections = sorted
      .map((block) => blockToMarkdown(block))
      .filter((s) => s.trim());

    if (blockSections.length > 0) {
      sections.push(`## ${canvas.name}\n\n`);
      sections.push(blockSections.join("\n\n---\n\n"));
      sections.push("\n\n");
    }
  }

  const md = sections.join("");
  const base = sanitizeFilename(data.project.name);
  downloadFile(md, `${base}-project.md`, "text/markdown");
}

/**
 * Export entire project as a ZIP containing one JSON and one Markdown per canvas
 */
export async function exportProjectAsZip(data: ExportProjectData): Promise<void> {
  const zip = new JSZip();
  const base = sanitizeFilename(data.project.name);
  const projectFolder = zip.folder(base);

  if (!projectFolder) {
    throw new Error("Failed to create ZIP folder");
  }

  // Add combined project JSON at root
  const projectPayload = {
    project: {
      id: data.project.id,
      name: data.project.name,
      description: data.project.description,
      icon: data.project.icon,
      status: data.project.status,
    },
    canvases: data.canvases.map((c) => ({
      id: c.id,
      name: c.name,
      order: c.order,
      projectId: c.projectId,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      blocks: c.blocks.map((b) => serializeBlock(toCanvasBlock(b))),
    })),
    exportedAt: new Date().toISOString(),
  };
  projectFolder.file(
    `${base}-project.json`,
    JSON.stringify(projectPayload, null, 2)
  );

  // Add combined project Markdown
  const mdSections: string[] = [];
  mdSections.push(`# ${data.project.name}\n\n*Exported project • ${new Date().toISOString().slice(0, 10)}*\n\n---\n\n`);

  for (const canvas of data.canvases) {
    const blocks = canvas.blocks.map(toCanvasBlock);
    const sorted = sortBlocksForExport(blocks);
    const blockSections = sorted
      .map((block) => blockToMarkdown(block))
      .filter((s) => s.trim());

    if (blockSections.length > 0) {
      mdSections.push(`## ${canvas.name}\n\n`);
      mdSections.push(blockSections.join("\n\n---\n\n"));
      mdSections.push("\n\n");
    }
  }
  projectFolder.file(`${base}-project.md`, mdSections.join(""));

  // Add per-canvas JSON and Markdown
  for (const canvas of data.canvases) {
    const canvasBase = sanitizeFilename(canvas.name);
    const canvasPayload = {
      project: {
        id: data.project.id,
        name: data.project.name,
        description: data.project.description,
        icon: data.project.icon,
        status: data.project.status,
      },
      canvas: {
        id: canvas.id,
        name: canvas.name,
        order: canvas.order,
        projectId: canvas.projectId,
        createdAt: canvas.createdAt,
        updatedAt: canvas.updatedAt,
      },
      blocks: canvas.blocks.map((b) => serializeBlock(toCanvasBlock(b))),
      exportedAt: new Date().toISOString(),
    };
    projectFolder.file(`${canvasBase}.json`, JSON.stringify(canvasPayload, null, 2));

    const blocks = canvas.blocks.map(toCanvasBlock);
    const sorted = sortBlocksForExport(blocks);
    const blockSections = sorted
      .map((block) => blockToMarkdown(block))
      .filter((s) => s.trim());
    const canvasHeader = `# ${canvas.name}\n\n*Exported from ${data.project.name} • ${new Date().toISOString().slice(0, 10)}*\n\n---\n\n`;
    const canvasMd = canvasHeader + blockSections.join("\n\n---\n\n");
    projectFolder.file(`${canvasBase}.md`, canvasMd);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadFile(blob, `${base}-project.zip`, "application/zip");
}
