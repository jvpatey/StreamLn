"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/shared/button";
import { Download, FileJson, FileText, FileArchive, Image, Loader2 } from "lucide-react";
import {
  exportProjectAsJSON,
  exportProjectAsMarkdown,
  exportProjectAsZip,
  captureElementAsPng,
  buildProjectPDF,
  buildProjectPNGZip,
  sanitizeFilename,
} from "@/lib/export/canvas-export";
import { CanvasExportRenderer } from "@/components/ui/projects/canvas/canvas-export-renderer";
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
  const [exportProgress, setExportProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const [imageExportState, setImageExportState] = useState<{
    format: "png" | "pdf";
    canvasIndex: number;
    dataUrls: string[];
    canvasNames: string[];
  } | null>(null);
  const imageExportDataRef = useRef<Awaited<ReturnType<typeof fetchProjectForExport>> | null>(null);
  const canvasExportRef = useRef<HTMLDivElement>(null);
  const captureInProgressRef = useRef(false);

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

  const waitForPaint = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 500);
        });
      });
    });
  }, []);

  useEffect(() => {
    if (!imageExportState || !imageExportDataRef.current) return;
    if (captureInProgressRef.current) return;

    const state = imageExportState;
    const data = imageExportDataRef.current;
    const canvases = [...data.canvases].sort((a, b) => a.order - b.order);
    const canvas = canvases[state.canvasIndex];
    const element = canvasExportRef.current;

    if (!element || !canvas) return;

    captureInProgressRef.current = true;

    const runCapture = async () => {
      await waitForPaint();

      try {
        const dataUrl = await captureElementAsPng(element);
        const newDataUrls = [...state.dataUrls, dataUrl];
        const newCanvasNames = [...state.canvasNames, canvas.name];

        captureInProgressRef.current = false;

        if (state.canvasIndex < canvases.length - 1) {
          setExportProgress({ current: state.canvasIndex + 2, total: canvases.length });
          setImageExportState({
            format: state.format,
            canvasIndex: state.canvasIndex + 1,
            dataUrls: newDataUrls,
            canvasNames: newCanvasNames,
          });
        } else {
          const base = sanitizeFilename(data.project.name);
          if (state.format === "pdf") {
            await buildProjectPDF(newDataUrls, base);
          } else {
            await buildProjectPNGZip(
              newDataUrls.map((url, i) => ({ dataUrl: url, canvasName: newCanvasNames[i] })),
              base
            );
          }
          onOpenChange(false);
          setImageExportState(null);
          setExporting(null);
          setExportProgress(null);
        }
      } catch (err) {
        captureInProgressRef.current = false;
        console.error("Export capture failed:", err);
        setError(err instanceof Error ? err.message : "Export failed");
        setImageExportState(null);
        setExporting(null);
        setExportProgress(null);
      }
    };

    runCapture();
  }, [imageExportState, waitForPaint, onOpenChange]);

  const handleExport = async (
    format: (typeof FORMAT_OPTIONS)[number]["id"]
  ) => {
    if (!exportData) return;

    setExporting(format);
    setExportProgress(null);
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
        case "png":
        case "pdf":
          if (exportData.canvases.length === 0) {
            setError("No canvases to export");
            break;
          }
          imageExportDataRef.current = exportData;
          setExportProgress({ current: 1, total: exportData.canvases.length });
          setImageExportState({
            format,
            canvasIndex: 0,
            dataUrls: [],
            canvasNames: [],
          });
          break;
      }
    } catch (err) {
      console.error("Project export failed:", err);
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      if (format !== "png" && format !== "pdf") {
        setExporting(null);
        setExportProgress(null);
      }
    }
  };

  if (!open) return null;

  const canvases = imageExportDataRef.current
    ? [...imageExportDataRef.current.canvases].sort((a, b) => a.order - b.order)
    : [];
  const currentCanvas =
    imageExportState && canvases[imageExportState.canvasIndex];

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      {imageExportState && currentCanvas && (
        <div
          ref={canvasExportRef}
          className="bg-white dark:bg-slate-900"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: 1400,
            height: 900,
            opacity: 0,
            pointerEvents: "none",
            zIndex: 99999,
          }}
        >
          <CanvasExportRenderer
            blocks={currentCanvas.blocks}
            canvasName={currentCanvas.name}
          />
        </div>
      )}
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
                const showProgress =
                  isExporting &&
                  exportProgress &&
                  (opt.id === "png" || opt.id === "pdf");
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
                        {showProgress
                          ? `Exporting canvas ${exportProgress.current} of ${exportProgress.total}...`
                          : opt.description}
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
