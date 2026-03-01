"use client";

import React, { useState } from "react";
import {
  Download,
  FileJson,
  FileText,
  Image,
  FileSpreadsheet,
  LayoutGrid,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shared/popover";
import {
  exportAsJSON,
  exportAsMarkdown,
  exportAsCSV,
  type ExportProject,
  type ExportCanvas,
} from "@/lib/export/canvas-export";
import type { CanvasBlock } from "@/lib/types/canvas";
import { cn } from "@/lib/utils";

export interface DocumentEditorExportHandle {
  exportAsMarkdown: () => void;
  exportAsPDF: () => Promise<void>;
}

interface ExportDropdownProps {
  primaryMode: "canvas" | "document";
  currentDocument: { id: string; name: string } | null;
  project: ExportProject;
  canvas: ExportCanvas;
  blocks: CanvasBlock[];
  onExportPNG?: () => void;
  onExportPDF?: () => void;
  documentEditorRef?: React.RefObject<DocumentEditorExportHandle | null>;
  trigger: React.ReactNode;
  /** Controlled open state (e.g. for opening from settings modal) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CANVAS_OPTIONS = [
  { id: "json" as const, label: "JSON", icon: FileJson },
  { id: "markdown" as const, label: "Markdown", icon: FileText },
  { id: "png" as const, label: "PNG", icon: Image },
  { id: "pdf" as const, label: "PDF", icon: FileText },
  { id: "csv" as const, label: "CSV", icon: FileSpreadsheet },
];

const DOCUMENT_OPTIONS = [
  { id: "markdown" as const, label: "Markdown", icon: FileText },
  { id: "pdf" as const, label: "PDF", icon: FileText },
];

export function ExportDropdown({
  primaryMode,
  currentDocument,
  project,
  canvas,
  blocks,
  onExportPNG,
  onExportPDF,
  documentEditorRef,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ExportDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (v: boolean) => controlledOnOpenChange?.(v)
    : setInternalOpen;

  const hasTaskBoards = blocks.some((b) => b.type === "task-board");
  const hasDocumentContent =
    primaryMode === "document" && currentDocument != null;
  const canExportDocument =
    hasDocumentContent && documentEditorRef?.current != null;

  const handleCanvasExport = (format: (typeof CANVAS_OPTIONS)[number]["id"]) => {
    switch (format) {
      case "json":
        exportAsJSON(project, canvas, blocks);
        break;
      case "markdown":
        exportAsMarkdown(project, canvas, blocks);
        break;
      case "png":
        setOpen(false);
        setTimeout(() => onExportPNG?.(), 150);
        return;
      case "pdf":
        setOpen(false);
        setTimeout(() => onExportPDF?.(), 150);
        return;
      case "csv":
        exportAsCSV(project, canvas, blocks);
        break;
    }
    setOpen(false);
  };

  const handleDocumentExport = (
    format: (typeof DOCUMENT_OPTIONS)[number]["id"]
  ) => {
    const ref = documentEditorRef?.current;
    if (!ref) return;
    if (format === "markdown") {
      ref.exportAsMarkdown();
    } else {
      ref.exportAsPDF();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          "w-56 p-0 overflow-hidden",
          "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
          "border border-slate-200 dark:border-slate-700",
          "rounded-xl shadow-xl"
        )}
      >
        <div className="py-1">
          {/* Canvas / Project section */}
          <div className="px-2 py-1.5">
            <div className="flex items-center gap-2 px-2 py-1 mb-1">
              <LayoutGrid size={12} className="text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Canvas
              </span>
            </div>
            <div className="space-y-0.5">
              {CANVAS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const disabled = opt.id === "csv" && !hasTaskBoards;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => !disabled && handleCanvasExport(opt.id)}
                    disabled={disabled}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors",
                      "text-slate-700 dark:text-slate-300",
                      "hover:bg-slate-100 dark:hover:bg-slate-800",
                      disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <Icon size={14} className="shrink-0 text-slate-500 dark:text-slate-400" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document section */}
          <div className="border-t border-slate-200 dark:border-slate-700" />
          <div
            className={cn(
              "px-2 py-1.5",
              !hasDocumentContent && "opacity-50 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-2 px-2 py-1 mb-1">
              <FileText size={12} className="text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Document
              </span>
            </div>
            <div className="space-y-0.5">
              {DOCUMENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const disabled = !canExportDocument;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => !disabled && handleDocumentExport(opt.id)}
                    disabled={disabled}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors",
                      "text-slate-700 dark:text-slate-300",
                      "hover:bg-slate-100 dark:hover:bg-slate-800",
                      disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <Icon size={14} className="shrink-0 text-slate-500 dark:text-slate-400" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
