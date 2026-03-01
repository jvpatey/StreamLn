"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/shared/button";
import { Plus } from "lucide-react";

interface CreateCanvasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (name: string) => Promise<void> | void;
}

export function CreateCanvasModal({
  open,
  onOpenChange,
  onCreate,
}: CreateCanvasModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setError(null);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (
        e.key === "Enter" &&
        document.activeElement === inputRef.current
      ) {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, name]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Canvas name is required.");
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onCreate?.(trimmed);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <Plus
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Add Canvas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Give your new canvas a name.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            autoComplete="off"
          >
            <div className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="canvas-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1"
                >
                  Canvas Name <span className="text-primary-500">*</span>
                </label>
                <input
                  id="canvas-name"
                  ref={inputRef}
                  type="text"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3 text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                  placeholder="e.g. Main, Overview, Ideas..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={200}
                  disabled={loading}
                  autoFocus
                />
              </div>
              {error && (
                <div className="text-sm text-destructive-600 dark:text-destructive-400 font-medium">
                  {error}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                disabled={loading || !name.trim()}
                className="px-6"
              >
                {loading ? "Creating..." : "Create Canvas"}
              </Button>
            </div>
          </form>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
