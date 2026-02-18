"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/shared/button";
import { Download, FileJson, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import {
  exportAsJSON,
  exportAsMarkdown,
  exportAsCSV,
  type ExportProject,
  type ExportCanvas,
} from "@/lib/export/canvas-export";
import { fetchCanvasBlocks } from "@/lib/api/canvas";
import type { CanvasBlock } from "@/lib/types/canvas";

interface CanvasExportFromListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ExportProject;
  canvas: ExportCanvas;
}

const FORMAT_OPTIONS = [
  { id: "json" as const, label: "JSON", icon: FileJson },
  { id: "markdown" as const, label: "Markdown", icon: FileText },
  { id: "csv" as const, label: "CSV (Task Boards)", icon: FileSpreadsheet },
] as const;

export function CanvasExportFromListModal({
  open,
  onOpenChange,
  project,
  canvas,
}: CanvasExportFromListModalProps) {
  const [blocks, setBlocks] = useState<CanvasBlock[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !project.id || !canvas.id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setBlocks(null);

    fetchCanvasBlocks(project.id, canvas.id)
      .then((data) => {
        if (!cancelled) setBlocks(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load canvas");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, project.id, canvas.id]);

  const handleExport = (format: (typeof FORMAT_OPTIONS)[number]["id"]) => {
    if (!blocks) return;
    if (format === "csv") {
      const hasTaskBoards = blocks.some((b) => b.type === "task-board");
      if (!hasTaskBoards) return;
    }
    switch (format) {
      case "json":
        exportAsJSON(project, canvas, blocks);
        break;
      case "markdown":
        exportAsMarkdown(project, canvas, blocks);
        break;
      case "csv":
        exportAsCSV(project, canvas, blocks);
        break;
    }
    onOpenChange(false);
  };

  if (!open) return null;

  const hasTaskBoards = blocks?.some((b) => b.type === "task-board") ?? false;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                  {canvas.name}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                <span>Loading canvas...</span>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              FORMAT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const disabled = opt.id === "csv" && !hasTaskBoards;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => !disabled && handleExport(opt.id)}
                    disabled={disabled}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      <Icon size={18} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {opt.label}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-end p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
