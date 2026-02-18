/**
 * Project-level export: JSON, Markdown, ZIP of all canvases, PNG, PDF
 */

import JSZip from "jszip";
import {
  blockToMarkdown,
  sortBlocksForExport,
} from "./markdown-serializers";
import {
  type ExportProjectData,
  EXPORT_SCHEMA_VERSION,
  sanitizeFilename,
  downloadFile,
  serializeBlock,
  toCanvasBlock,
} from "./export-utils";

/**
 * Export entire project as a single JSON file (all canvases + blocks)
 */
export function exportProjectAsJSON(data: ExportProjectData): void {
  const payload = {
    exportVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    project: {
      id: data.project.id,
      name: data.project.name,
      description: data.project.description,
      icon: data.project.icon,
      status: data.project.status,
      createdAt: data.project.createdAt,
      updatedAt: data.project.updatedAt,
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
  };

  const json = JSON.stringify(payload, null, 2);
  const base = sanitizeFilename(data.project.name);
  downloadFile(json, `${base}-project.json`, "application/json");
}

/**
 * Get project as combined Markdown string (for download or clipboard)
 */
export function getProjectMarkdown(data: ExportProjectData): string {
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

  return sections.join("");
}

/**
 * Export entire project as a single combined Markdown file
 */
export function exportProjectAsMarkdown(data: ExportProjectData): void {
  const md = getProjectMarkdown(data);
  const base = sanitizeFilename(data.project.name);
  downloadFile(md, `${base}-project.md`, "text/markdown");
}

/**
 * Copy project Markdown to clipboard
 */
export async function copyProjectMarkdownToClipboard(
  data: ExportProjectData,
): Promise<void> {
  const md = getProjectMarkdown(data);
  await navigator.clipboard.writeText(md);
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
    exportVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    project: {
      id: data.project.id,
      name: data.project.name,
      description: data.project.description,
      icon: data.project.icon,
      status: data.project.status,
      createdAt: data.project.createdAt,
      updatedAt: data.project.updatedAt,
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
      exportVersion: EXPORT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      project: {
        id: data.project.id,
        name: data.project.name,
        description: data.project.description,
        icon: data.project.icon,
        status: data.project.status,
        createdAt: data.project.createdAt,
        updatedAt: data.project.updatedAt,
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

export type ExportProgressCallback = (current: number, total: number) => void;

/**
 * Capture an HTMLElement as PNG data URL. Element must be in-DOM and painted.
 */
export async function captureElementAsPng(element: HTMLElement): Promise<string> {
  const { toPng } = await import("html-to-image");
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  return toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    style: { opacity: "1" },
  });
}

/**
 * Build a multi-page PDF from canvas image data URLs.
 */
export async function buildProjectPDF(
  dataUrls: string[],
  base: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  if (dataUrls.length === 0) return;

  let pdf: InstanceType<typeof jsPDF> | null = null;

  for (const dataUrl of dataUrls) {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = dataUrl;
    });

    if (!pdf) {
      pdf = new jsPDF({
        orientation: img.width > img.height ? "landscape" : "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
    } else {
      pdf.addPage(
        [img.width, img.height],
        img.width > img.height ? "landscape" : "portrait"
      );
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
    }
  }

  if (pdf) {
    pdf.save(`${base}-project.pdf`);
  }
}

/**
 * Build a ZIP of PNG images from data URLs.
 */
export async function buildProjectPNGZip(
  dataUrls: Array<{ dataUrl: string; canvasName: string }>,
  base: string
): Promise<void> {
  const zip = new JSZip();
  const projectFolder = zip.folder(base) ?? zip;

  for (const { dataUrl, canvasName } of dataUrls) {
    const base64 = dataUrl.split(",")[1];
    if (base64) {
      projectFolder.file(`${sanitizeFilename(canvasName)}.png`, base64, {
        base64: true,
      });
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadFile(blob, `${base}-canvases.zip`, "application/zip");
}
