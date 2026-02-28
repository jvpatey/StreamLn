"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/shared/button";
import { Tooltip } from "@/components/ui/shared/tooltip";
import { Download, FileJson, FileText, Image, FileSpreadsheet } from "lucide-react";
import {
  exportAsJSON,
  exportAsMarkdown,
  exportAsCSV,
  type ExportProject,
  type ExportCanvas,
} from "@/lib/export/canvas-export";
import type { CanvasBlock } from "@/lib/types/canvas";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ExportProject;
  canvas: ExportCanvas;
  blocks: CanvasBlock[];
  onExportPNG?: () => void;
  onExportPDF?: () => void;
}

const FORMAT_OPTIONS = [
  {
    id: "json" as const,
    label: "JSON",
    description: "Full backup, re-import, data portability",
    icon: FileJson,
  },
  {
    id: "markdown" as const,
    label: "Markdown",
    description: "Developer docs, version control, readability",
    icon: FileText,
  },
  {
    id: "png" as const,
    label: "PNG Image",
    description: "Quick visual snapshot, social sharing",
    icon: Image,
  },
  {
    id: "pdf" as const,
    label: "PDF",
    description: "Print, archive, share with others",
    icon: FileText,
  },
  {
    id: "csv" as const,
    label: "CSV (Task Boards)",
    description: "Task board data for spreadsheets",
    icon: FileSpreadsheet,
  },
];

export function ExportModal({
  open,
  onOpenChange,
  project,
  canvas,
  blocks,
  onExportPNG,
  onExportPDF,
}: ExportModalProps) {
  const handleExport = (format: (typeof FORMAT_OPTIONS)[number]["id"]) => {
    switch (format) {
      case "json":
        exportAsJSON(project, canvas, blocks);
        onOpenChange(false);
        break;
      case "markdown":
        exportAsMarkdown(project, canvas, blocks);
        onOpenChange(false);
        break;
      case "png":
        onOpenChange(false);
        setTimeout(() => onExportPNG?.(), 150);
        break;
      case "pdf":
        onOpenChange(false);
        setTimeout(() => onExportPDF?.(), 150);
        break;
      case "csv":
        exportAsCSV(project, canvas, blocks);
        onOpenChange(false);
        break;
    }
  };

  const hasTaskBoards = blocks.some((b) => b.type === "task-board");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
          onClick={() => onOpenChange(false)}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Download
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Export Canvas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose a format to download
                </p>
              </div>
            </div>
          </div>

          {/* Format options */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {FORMAT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const disabled =
                  opt.id === "csv" && !hasTaskBoards;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => !disabled && handleExport(opt.id)}
                    disabled={disabled}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      <Icon size={18} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {opt.label}
                      </p>
                      <Tooltip content={opt.description} side="top">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate cursor-default">
                          {opt.description}
                        </p>
                      </Tooltip>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
