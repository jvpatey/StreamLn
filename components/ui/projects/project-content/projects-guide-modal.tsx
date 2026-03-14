"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { getKeyboardShortcut } from "@/lib/utils";
import {
  BookOpen,
  Plus,
  Upload,
  Filter,
  Grid3x3,
  List,
} from "lucide-react";

interface ProjectsGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { keys: "⌘⇧P", action: "Create project" },
  { keys: "⌘⇧I", action: "Import project" },
  { keys: "⌘K", action: "Command palette" },
  { keys: "⌘⇧S", action: "Search projects" },
  { keys: "⌘/", action: "Filter" },
  { keys: "⌘⇧B", action: "Browse all" },
] as const;

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
      {children}
    </kbd>
  );
}

export function ProjectsGuideModal({ open, onOpenChange }: ProjectsGuideModalProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-20 sm:px-8"
          onClick={() => onOpenChange(false)}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <BookOpen
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Projects Guide
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Quick reference for project hub features
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[min(70vh,calc(100dvh-12rem))] overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Getting Started */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Getting Started
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Projects are workspaces that contain canvases. Each project can have multiple canvases for notes, tasks, and more.
              </p>
            </section>

            {/* Creating Projects */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                Creating Projects
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Plus size={16} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Create Project
                    </span>
                    <span className="text-slate-500 dark:text-slate-500"> — </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Sidebar, header search, or the dashed card in the grid
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Upload size={16} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Import from JSON
                    </span>
                    <span className="text-slate-500 dark:text-slate-500"> — </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Restore from a backup (sidebar)
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Command Palette */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Command Palette
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Press <Kbd>{getKeyboardShortcut("⌘K")}</Kbd> to open the command palette. Search projects, create new ones, filter by status, or browse all—without leaving the keyboard.
              </p>
            </section>

            {/* Keyboard Shortcuts */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                Keyboard Shortcuts
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {SHORTCUTS.map(({ keys, action }) => (
                  <div
                    key={keys}
                    className="flex items-center justify-between gap-4 px-3 py-2 min-h-[44px] rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {action}
                    </span>
                    <Kbd>{getKeyboardShortcut(keys)}</Kbd>
                  </div>
                ))}
              </div>
            </section>

            {/* Filter & View */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Filter & View
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Filter size={16} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Filter
                    </span>
                    <span className="text-slate-500 dark:text-slate-500"> — </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Filter by Active or Archived
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 flex gap-0.5">
                    <Grid3x3 size={14} className="text-slate-600 dark:text-slate-400" />
                    <List size={14} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Grid / List
                    </span>
                    <span className="text-slate-500 dark:text-slate-500"> — </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Switch between grid and list view
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-end p-4 pt-2 pb-[env(safe-area-inset-bottom)] sm:pb-4 border-t border-slate-200 dark:border-slate-700">
            <LiquidGlassButton
              gradient="primary"
              onClick={() => onOpenChange(false)}
              className="rounded-xl min-h-[44px] px-6"
            >
              Got it
            </LiquidGlassButton>
          </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
