"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { Button } from "@/components/ui/shared/button";
import { Checkbox } from "@/components/ui/shared/checkbox";
import {
  Settings,
  BookOpen,
  Share2,
  Download,
  Grid3x3,
  PanelLeftOpen,
  PanelTopOpen,
  Link2,
} from "lucide-react";
import {
  getDefaultShowGrid,
  setDefaultShowGrid,
  getDefaultZoom,
  setDefaultZoom,
  getDefaultSidebarOpen,
  setDefaultSidebarOpen,
  getDefaultToolbarOpen,
  setDefaultToolbarOpen,
  getDefaultShareExpiry,
  setDefaultShareExpiry,
} from "@/lib/canvas-preferences";

interface CanvasItem {
  id: string;
  name: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CanvasSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvas?: CanvasItem;
  onCanvasRename?: (canvasId: string, name: string) => void;
  showGrid: boolean;
  onGridToggle: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
  toolbarOpen: boolean;
  onToolbarOpenChange: (open: boolean) => void;
  lastSavedAt: string | null;
  onOpenGuide?: () => void;
  onShareClick?: () => void;
  onExportClick?: () => void;
}

const ZOOM_OPTIONS = [
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
] as const;

const EXPIRY_OPTIONS = [
  { value: undefined, label: "Never" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
] as const;

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "Never";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "Never";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CanvasSettingsModal({
  open,
  onOpenChange,
  canvas,
  onCanvasRename,
  showGrid,
  onGridToggle,
  zoomLevel,
  onZoomChange,
  sidebarOpen,
  onSidebarOpenChange,
  toolbarOpen,
  onToolbarOpenChange,
  lastSavedAt,
  onOpenGuide,
  onShareClick,
  onExportClick,
}: CanvasSettingsModalProps) {
  const [nameValue, setNameValue] = useState(canvas?.name ?? "");
  const [nameSaving, setNameSaving] = useState(false);
  const [shareExpiry, setShareExpiry] = useState<number | undefined>(
    () => getDefaultShareExpiry()
  );

  useEffect(() => {
    if (open && canvas) {
      setNameValue(canvas.name);
    }
  }, [open, canvas?.name]);

  useEffect(() => {
    if (open) {
      setShareExpiry(getDefaultShareExpiry());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSaveName = async () => {
    const trimmed = nameValue.trim();
    if (!canvas || !trimmed || trimmed === canvas.name || !onCanvasRename) return;
    setNameSaving(true);
    try {
      await onCanvasRename(canvas.id, trimmed);
    } finally {
      setNameSaving(false);
    }
  };

  const handleGridChange = (checked: boolean) => {
    setDefaultShowGrid(checked);
    if (checked !== showGrid) {
      onGridToggle();
    }
  };

  const handleZoomChange = (value: number) => {
    setDefaultZoom(value);
    onZoomChange(value);
  };

  const handleSidebarChange = (checked: boolean) => {
    setDefaultSidebarOpen(checked);
    onSidebarOpenChange(checked);
  };

  const handleToolbarChange = (checked: boolean) => {
    setDefaultToolbarOpen(checked);
    onToolbarOpenChange(checked);
  };

  const handleShareExpiryChange = (value: number | undefined) => {
    setDefaultShareExpiry(value);
    setShareExpiry(value);
  };

  const handleOpenGuide = () => {
    onOpenChange(false);
    onOpenGuide?.();
  };

  const handleShareClick = () => {
    onOpenChange(false);
    onShareClick?.();
  };

  const handleExportClick = () => {
    onOpenChange(false);
    onExportClick?.();
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
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                    <Settings
                      size={20}
                      className="text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      Canvas Settings
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Configure view defaults and preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
                {/* Canvas name */}
                {canvas && onCanvasRename && (
                  <section>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                      Canvas
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                        }}
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        placeholder="Canvas name"
                        disabled={nameSaving}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={
                          nameSaving ||
                          !nameValue.trim() ||
                          nameValue.trim() === canvas.name
                        }
                      >
                        {nameSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </section>
                )}

                {/* View defaults */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                    View defaults
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={showGrid}
                        onCheckedChange={handleGridChange}
                      />
                      <Grid3x3 size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Show grid
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-700 dark:text-slate-300 w-24 shrink-0">
                        Default zoom
                      </span>
                      <select
                        value={zoomLevel}
                        onChange={(e) =>
                          handleZoomChange(parseFloat(e.target.value))
                        }
                        className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 px-3 py-2"
                      >
                        {ZOOM_OPTIONS.map((opt) => (
                          <option key={opt.label} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={sidebarOpen}
                        onCheckedChange={handleSidebarChange}
                      />
                      <PanelLeftOpen size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Sidebar open by default
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={toolbarOpen}
                        onCheckedChange={handleToolbarChange}
                      />
                      <PanelTopOpen size={16} className="text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Toolbar visible by default
                      </span>
                    </label>
                  </div>
                </section>

                {/* Share defaults */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                    Share defaults
                  </h4>
                  <div className="flex items-center gap-3">
                    <Link2 size={16} className="text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Default link expiry
                    </span>
                    <select
                      value={shareExpiry ?? ""}
                      onChange={(e) =>
                        handleShareExpiryChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="ml-auto rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 px-3 py-2"
                    >
                      {EXPIRY_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value ?? ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                {/* Read-only info */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                    Info
                  </h4>
                  <div className="space-y-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500 dark:text-slate-400">
                        Last saved
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {formatDate(lastSavedAt)}
                      </span>
                    </div>
                    {canvas?.createdAt && (
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500 dark:text-slate-400">
                          Created
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {formatDate(canvas.createdAt)}
                        </span>
                      </div>
                    )}
                    {canvas?.updatedAt && (
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500 dark:text-slate-400">
                          Updated
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {formatDate(canvas.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Quick links */}
                <section>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                    Quick links
                  </h4>
                  <div className="space-y-1">
                    {onOpenGuide && (
                      <button
                        type="button"
                        onClick={handleOpenGuide}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <BookOpen size={16} className="text-slate-500" />
                        Canvas Guide
                      </button>
                    )}
                    {onShareClick && (
                      <button
                        type="button"
                        onClick={handleShareClick}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Share2 size={16} className="text-slate-500" />
                        Share Canvas
                      </button>
                    )}
                    {onExportClick && (
                      <button
                        type="button"
                        onClick={handleExportClick}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Download size={16} className="text-slate-500" />
                        Export Canvas
                      </button>
                    )}
                  </div>
                </section>
              </div>

              <div className="flex items-center justify-end p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <LiquidGlassButton
                  gradient="primary"
                  onClick={() => onOpenChange(false)}
                  className="rounded-xl"
                >
                  Done
                </LiquidGlassButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
