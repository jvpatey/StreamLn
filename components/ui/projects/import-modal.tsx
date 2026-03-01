"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/shared/button";
import { Upload, Loader2, FileJson } from "lucide-react";
import { parseImportPayload } from "@/lib/export/canvas-import";
import { importProjectFromJson } from "@/lib/api/project-import";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (projectId: string, firstCanvasId: string | null) => void;
}

export function ImportModal({
  open,
  onOpenChange,
  onSuccess,
}: ImportModalProps) {
  const [step, setStep] = useState<"pick" | "preview" | "importing">("pick");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    projectName: string;
    canvasCount: number;
    blockCount: number;
    rawData: object;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("pick");
    setError(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const result = parseImportPayload(text);

      if (result.ok === false) {
        setError(result.error);
        setStep("pick");
        return;
      }

      const { project, canvases } = result.data;
      const blockCount = canvases.reduce((sum, c) => sum + c.blocks.length, 0);

      setPreview({
        projectName: project.name,
        canvasCount: canvases.length,
        blockCount,
        rawData: result.data as unknown as object,
      });
      setStep("preview");
    };

    reader.onerror = () => {
      setError("Failed to read file");
    };

    reader.readAsText(file, "utf-8");
  };

  const handleImport = async () => {
    if (!preview) return;

    setStep("importing");
    setError(null);

    try {
      const result = await importProjectFromJson(preview.rawData);
      handleClose(false);
      onSuccess?.(result.id, result.firstCanvasId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
      setStep("preview");
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
          onClick={() => handleClose(false)}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Upload
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Import Project
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Restore from JSON backup
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden
            />

            {step === "pick" && (
              <button
                type="button"
                onClick={handleChooseFile}
                className="w-full flex flex-col items-center justify-center gap-3 px-6 py-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <FileJson
                    size={24}
                    className="text-slate-600 dark:text-slate-400"
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Choose JSON file
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Project or single-canvas export
                  </p>
                </div>
              </button>
            )}

            {step === "preview" && preview && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {preview.projectName}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {preview.canvasCount} canvas
                    {preview.canvasCount !== 1 ? "es" : ""} · {preview.blockCount}{" "}
                    block{preview.blockCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {step === "importing" && (
              <div className="flex items-center justify-center py-12 gap-2 text-slate-500 dark:text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                <span>Importing project...</span>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              onClick={() => handleClose(false)}
              disabled={step === "importing"}
            >
              Cancel
            </Button>
            {step === "preview" && preview && (
              <Button onClick={handleImport}>Import</Button>
            )}
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
