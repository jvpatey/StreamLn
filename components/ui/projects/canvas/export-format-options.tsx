"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { PROJECT_EXPORT_FORMATS, type ProjectExportFormatId } from "@/lib/export/canvas-export";

interface ExportFormatOptionsProps {
  exporting: ProjectExportFormatId | null;
  exportProgress: { current: number; total: number } | null;
  hasCanvasesToExport: boolean;
  onExport: (format: ProjectExportFormatId) => void;
}

export function ExportFormatOptions({
  exporting,
  exportProgress,
  hasCanvasesToExport,
  onExport,
}: ExportFormatOptionsProps) {
  return (
    <>
      {PROJECT_EXPORT_FORMATS.map((opt) => {
        const Icon = opt.icon;
        const isExporting = exporting === opt.id;
        const showProgress =
          isExporting &&
          exportProgress &&
          (opt.id === "png" || opt.id === "pdf");
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => !isExporting && onExport(opt.id)}
            disabled={!!exporting || !hasCanvasesToExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
              {isExporting ? (
                <Loader2
                  size={18}
                  className="animate-spin text-slate-600 dark:text-slate-400"
                />
              ) : (
                <Icon
                  size={18}
                  className="text-slate-600 dark:text-slate-400"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {opt.label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {showProgress
                  ? `Exporting canvas ${exportProgress.current} of ${exportProgress.total}...`
                  : opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </>
  );
}
