"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  exportProjectAsJSON,
  exportProjectAsMarkdown,
  exportProjectAsZip,
  copyProjectMarkdownToClipboard,
  captureElementAsPng,
  buildProjectPDF,
  buildProjectPNGZip,
  filterExportData,
  sanitizeFilename,
  PROJECT_EXPORT_FORMATS,
  type ProjectExportFormatId,
} from "@/lib/export/canvas-export";
import { fetchProjectForExport } from "@/lib/api/project-export";
import type { ExportProjectData } from "@/lib/api/project-export";

export interface UseProjectExportOptions {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface UseProjectExportReturn {
  loading: boolean;
  error: string | null;
  exportData: ExportProjectData | null;
  exporting: ProjectExportFormatId | null;
  exportProgress: { current: number; total: number } | null;
  selectedCanvasIds: Set<string>;
  excludeEmptyCanvases: boolean;
  setExcludeEmptyCanvases: (value: boolean) => void;
  filteredData: ExportProjectData | null;
  hasCanvasesToExport: boolean;
  sortedCanvases: ExportProjectData["canvases"];
  allSelected: boolean;
  noneSelected: boolean;
  toggleCanvas: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  handleExport: (format: ProjectExportFormatId) => Promise<void>;
  imageExportState: {
    format: "png" | "pdf";
    canvasIndex: number;
    dataUrls: string[];
    canvasNames: string[];
  } | null;
  currentCanvas: ExportProjectData["canvases"][number] | undefined;
  canvasExportRef: React.RefObject<HTMLDivElement | null>;
}

export function useProjectExport({
  projectId,
  open,
  onOpenChange,
}: UseProjectExportOptions): UseProjectExportReturn {
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<ExportProjectData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<ProjectExportFormatId | null>(
    null,
  );
  const [exportProgress, setExportProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [selectedCanvasIds, setSelectedCanvasIds] = useState<Set<string>>(
    new Set(),
  );
  const [excludeEmptyCanvases, setExcludeEmptyCanvases] = useState(false);
  const [imageExportState, setImageExportState] = useState<{
    format: "png" | "pdf";
    canvasIndex: number;
    dataUrls: string[];
    canvasNames: string[];
  } | null>(null);

  const imageExportDataRef = useRef<ExportProjectData | null>(null);
  const canvasExportRef = useRef<HTMLDivElement>(null);
  const captureInProgressRef = useRef(false);

  useEffect(() => {
    if (!open || !projectId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setExportData(null);

    fetchProjectForExport(projectId)
      .then((data) => {
        if (!cancelled) setExportData(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load project",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, projectId]);

  useEffect(() => {
    if (exportData?.canvases) {
      setSelectedCanvasIds(new Set(exportData.canvases.map((c) => c.id)));
    }
  }, [exportData]);

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
          setExportProgress({
            current: state.canvasIndex + 2,
            total: canvases.length,
          });
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
              newDataUrls.map((url, i) => ({
                dataUrl: url,
                canvasName: newCanvasNames[i],
              })),
              base,
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

  const filteredData = exportData
    ? filterExportData(exportData, selectedCanvasIds, excludeEmptyCanvases)
    : null;
  const hasCanvasesToExport = (filteredData?.canvases.length ?? 0) > 0;

  const sortedCanvases = exportData
    ? [...exportData.canvases].sort((a, b) => a.order - b.order)
    : [];
  const allSelected =
    sortedCanvases.length > 0 &&
    sortedCanvases.every((c) => selectedCanvasIds.has(c.id));
  const noneSelected = sortedCanvases.every(
    (c) => !selectedCanvasIds.has(c.id),
  );

  const toggleCanvas = useCallback((id: string) => {
    setSelectedCanvasIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCanvasIds(new Set(sortedCanvases.map((c) => c.id)));
  }, [sortedCanvases]);

  const deselectAll = useCallback(() => {
    setSelectedCanvasIds(new Set());
  }, []);

  const handleExport = useCallback(
    async (format: ProjectExportFormatId) => {
      if (!exportData || !filteredData) return;
      if (!hasCanvasesToExport) {
        setError("Select at least one canvas to export");
        return;
      }

      setExporting(format);
      setExportProgress(null);
      setError(null);
      try {
        switch (format) {
          case "json":
            exportProjectAsJSON(filteredData);
            onOpenChange(false);
            break;
          case "markdown":
            exportProjectAsMarkdown(filteredData);
            onOpenChange(false);
            break;
          case "copy-markdown":
            await copyProjectMarkdownToClipboard(filteredData);
            onOpenChange(false);
            break;
          case "zip":
            await exportProjectAsZip(filteredData);
            onOpenChange(false);
            break;
          case "png":
          case "pdf":
            imageExportDataRef.current = filteredData;
            setExportProgress({
              current: 1,
              total: filteredData.canvases.length,
            });
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
    },
    [exportData, filteredData, hasCanvasesToExport, onOpenChange],
  );

  const canvasesForCapture = imageExportDataRef.current
    ? [...imageExportDataRef.current.canvases].sort((a, b) => a.order - b.order)
    : [];
  const currentCanvas =
    imageExportState && canvasesForCapture[imageExportState.canvasIndex];

  return {
    loading,
    error,
    exportData,
    exporting,
    exportProgress,
    selectedCanvasIds,
    excludeEmptyCanvases,
    setExcludeEmptyCanvases,
    filteredData,
    hasCanvasesToExport,
    sortedCanvases,
    allSelected,
    noneSelected,
    toggleCanvas,
    selectAll,
    deselectAll,
    handleExport,
    imageExportState,
    currentCanvas,
    canvasExportRef,
  };
}
