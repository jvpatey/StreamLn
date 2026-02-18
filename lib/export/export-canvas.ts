/**
 * Single-canvas export: JSON, Markdown, CSV, PNG, PDF
 */

import type { CanvasBlock } from "@/lib/types/canvas";
import { getTaskBoardContent } from "@/components/ui/projects/canvas/blocks/task-board-defaults";
import {
  blockToMarkdown,
  sortBlocksForExport,
} from "./markdown-serializers";
import {
  type ExportProject,
  type ExportCanvas,
  sanitizeFilename,
  downloadFile,
  serializeBlock,
} from "./export-utils";

/** Escape a CSV field (wrap in quotes if contains comma, newline, or quote) */
function escapeCsvField(value: string): string {
  if (!/[,"\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
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
