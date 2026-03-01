"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/shared/button";
import { Download, Loader2 } from "lucide-react";
import { CanvasExportRenderer } from "@/components/ui/projects/canvas/canvas-export-renderer";
import { useProjectExport } from "@/components/ui/projects/canvas/use-project-export";
import { CanvasSelectionSection } from "@/components/ui/projects/canvas/canvas-selection-section";
import { ExportFormatOptions } from "@/components/ui/projects/canvas/export-format-options";

interface ProjectExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: { id: string; name: string };
}

export function ProjectExportModal({
  open,
  onOpenChange,
  project,
}: ProjectExportModalProps) {
  const {
    loading,
    error,
    exportData,
    exporting,
    exportProgress,
    selectedCanvasIds,
    excludeEmptyCanvases,
    setExcludeEmptyCanvases,
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
  } = useProjectExport({
    projectId: project.id,
    open,
    onOpenChange,
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
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
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center shrink-0 border-b border-slate-200 dark:border-slate-700 p-4">
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
                  Export canvases from {project.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                <span>Loading project data...</span>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
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
              <>
                <CanvasSelectionSection
                  canvases={sortedCanvases}
                  selectedCanvasIds={selectedCanvasIds}
                  excludeEmptyCanvases={excludeEmptyCanvases}
                  onExcludeEmptyChange={setExcludeEmptyCanvases}
                  onToggleCanvas={toggleCanvas}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  allSelected={allSelected}
                  noneSelected={noneSelected}
                  hasCanvasesToExport={hasCanvasesToExport}
                />
                <ExportFormatOptions
                  exporting={exporting}
                  exportProgress={exportProgress}
                  hasCanvasesToExport={hasCanvasesToExport}
                  onExport={handleExport}
                />
              </>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-end p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
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
