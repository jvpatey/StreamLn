import { FileJson, FileText, FileArchive, Image } from "lucide-react";

export const PROJECT_EXPORT_FORMATS = [
  {
    id: "json" as const,
    label: "JSON",
    description: "Single file with all canvases and blocks",
    icon: FileJson,
  },
  {
    id: "markdown" as const,
    label: "Markdown",
    description: "Combined document, all canvases in one file",
    icon: FileText,
  },
  {
    id: "zip" as const,
    label: "ZIP Archive",
    description: "All canvases as JSON + Markdown per canvas",
    icon: FileArchive,
  },
  {
    id: "png" as const,
    label: "PNG (all canvases)",
    description: "ZIP of PNG images, one per canvas",
    icon: Image,
  },
  {
    id: "pdf" as const,
    label: "PDF (all canvases)",
    description: "Multi-page PDF, one page per canvas",
    icon: FileText,
  },
] as const;

export type ProjectExportFormatId = (typeof PROJECT_EXPORT_FORMATS)[number]["id"];
