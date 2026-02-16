"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/shared/button";
import { Download, FileJson, FileText, FileArchive, Loader2 } from "lucide-react";
import {
  exportProjectAsJSON,
  exportProjectAsMarkdown,
  exportProjectAsZip,
} from "@/lib/export/canvas-export";
import { fetchProjectForExport } from "@/lib/api/project-export";

interface ProjectExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: { id: string; name: string };
}

const FORMAT_OPTIONS = [
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
] as const;

export function ProjectExportModal({
  open,
  onOpenChange,
  project,
}: ProjectExportModalProps) {
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<Awaited<
    ReturnType<typeof fetchProjectForExport>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !project?.id) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setExportData(null);

    fetchProjectForExport(project.id)
      .then((data) => {
        if (!cancelled) {
          setExportData(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load project");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, project.id]);

  const handleExport = async (
    format: (typeof FORMAT_OPTIONS)[number]["id"]
  ) => {
    if (!exportData) return;

    setExporting(format);
    try {
      switch (format) {
        case "json":
          exportProjectAsJSON(exportData);
          onOpenChange(false);
          break;
        case "markdown":
          exportProjectAsMarkdown(exportData);
          onOpenChange(false);
          break;
        case "zip":
          await exportProjectAsZip(exportData);
          onOpenChange(false);
          break;
      }
    } catch (err) {
      console.error("Project export failed:", err);
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                  Export Project
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Export all canvases in {project.name}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-1 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                <span>Loading project data...</span>
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
            ) : exportData?.canvases.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No canvases to export. Create a canvas first.
                </p>
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
                const isExporting = exporting === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => !isExporting && handleExport(opt.id)}
                    disabled={!!exporting}
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
                        {opt.description}
                      </p>
                    </div>
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
