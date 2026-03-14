"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Trash2 } from "lucide-react";

interface CanvasDeleteConfirmDialogProps {
  open: boolean;
  canvasName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function CanvasDeleteConfirmDialog({
  open,
  canvasName,
  onCancel,
  onConfirm,
}: CanvasDeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          style={{ pointerEvents: "auto" }}
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="canvas-delete-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 border border-border/50 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/20">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3
                  id="canvas-delete-dialog-title"
                  className="text-lg font-bold text-slate-900 dark:text-slate-100"
                >
                  Delete canvas?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This will permanently delete the canvas and all its blocks and
                  documents.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-border/50 flex items-center gap-2">
              <Layout className="h-4 w-4 text-slate-500" />
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {canvasName}
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-destructive text-white hover:bg-destructive/90 transition-colors inline-flex items-center gap-2 touch-manipulation"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
