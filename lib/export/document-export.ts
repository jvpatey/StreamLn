/**
 * Standalone document export: Markdown, PDF
 */

import { documentToMarkdown } from "./markdown-serializers";
import { sanitizeFilename, downloadFile } from "./export-utils";

/**
 * Export document content as Markdown file
 */
export function exportDocumentAsMarkdown(
  name: string,
  content: unknown
): void {
  const md = documentToMarkdown(content);
  const base = sanitizeFilename(name);
  downloadFile(md || `*Empty document: ${name}*`, `${base}.md`, "text/markdown");
}

/**
 * Export document as PDF (captures the rendered document element)
 * Requires html-to-image and jspdf
 */
export async function exportDocumentAsPDF(
  element: HTMLElement | null,
  name: string
): Promise<void> {
  if (!element) return;

  const { toPng } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");
  const base = sanitizeFilename(name);

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
