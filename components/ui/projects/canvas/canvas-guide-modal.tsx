"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidGlassButton } from "@/components/ui/shared/liquid-glass-button";
import { getKeyboardShortcut } from "@/lib/utils";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import {
  BookOpen,
  FileText,
  Type,
  Kanban,
  Tag,
  Image,
  Link,
  Code2,
  Square,
  Circle,
  Minus,
  ArrowRight,
  MousePointer,
  Hand,
} from "lucide-react";

interface CanvasGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BLOCK_CATEGORIES = [
  {
    label: "Content",
    blocks: [
      { type: "note", label: "Note", description: "Rich text notes with formatting", icon: FileText, color: "#3b82f6" },
      { type: "text", label: "Text", description: "Short labels and comments", icon: Type, color: "#64748b" },
    ],
  },
  {
    label: "Organization",
    blocks: [
      { type: "task-board", label: "Task Board", description: "Kanban-style task management", icon: Kanban, color: "#10b981" },
      { type: "tag", label: "Tag", description: "Labels and categories", icon: Tag, color: "#ef4444" },
    ],
  },
  {
    label: "Media & References",
    blocks: [
      { type: "image", label: "Image", description: "Images and visual content", icon: Image, color: "#f59e0b" },
      { type: "link", label: "Link", description: "Web links and references", icon: Link, color: "#06b6d4" },
    ],
  },
  {
    label: "Technical",
    blocks: [
      { type: "code", label: "Code", description: "Code snippets with syntax highlighting", icon: Code2, color: "#8b5cf6" },
    ],
  },
] as const;

const SHORTCUTS = [
  { keys: "⌘+ / ⌘-", action: "Zoom in / out" },
  { keys: "⌘0", action: "Reset view" },
  { keys: "⌘D", action: "Duplicate selected" },
  { keys: "⌘A", action: "Select all" },
  { keys: "Delete", action: "Remove selected" },
  { keys: "Escape", action: "Deselect" },
  { keys: "E", action: "Edit (from Present mode)" },
  { keys: "H", action: "Pan tool" },
  { keys: "V", action: "Select tool" },
] as const;

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
      {children}
    </kbd>
  );
}

export function CanvasGuideModal({ open, onOpenChange }: CanvasGuideModalProps) {
  const isMobile = useIsMobile();

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
          className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-20 sm:px-8"
          onClick={() => onOpenChange(false)}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-xl max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)] flex flex-col min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl min-h-0 flex-1">
          {/* Header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-700 p-4 shrink-0">
            <div className="flex items-center space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <BookOpen
                  size={20}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Canvas Guide
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Quick reference for canvas features
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Getting Started */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Getting Started
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your canvas is an infinite workspace for notes, tasks, code, and more.
              </p>
            </section>

            {/* Projects & Canvases */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Projects & Canvases
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Projects contain multiple canvases. Tap or click the project/canvas name in the header to switch canvases, create new ones, or reorder them.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The project title also opens the documents drawer—where you can create, switch, and manage documents.
              </p>
            </section>

            {/* Documents */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Documents
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Each canvas contains both blocks and documents. Documents are full-screen editors for long-form writing—format with headings, task lists, fonts, and alignment.
              </p>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Create documents via the sidebar (Documents tab)</li>
                <li>• Switch between canvas and document mode in the sidebar</li>
                <li>• Tap or click the document name in the toolbar to rename it</li>
                <li>• Use the Format button (mobile) or toolbar (desktop) for styling</li>
                <li>• Export documents as Markdown or PDF from the navbar</li>
              </ul>
            </section>

            {/* Adding Blocks */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                Adding Blocks
              </h4>
              {isMobile ? (
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <li>• Double-tap on the canvas to add a note</li>
                  <li>• Use the Add blocks button to add different block types</li>
                  <li>• Choose Start blank or add a pre-filled block</li>
                  <li>• Tap and drag blocks to rearrange them</li>
                  <li>• Pinch to zoom, two-finger drag to pan</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <li>• Open the sidebar (left) and pick from Blocks</li>
                  <li>• Double-click on the canvas to add a note</li>
                  <li>• Choose Start blank or add a pre-filled block</li>
                  <li>• Drag blocks to rearrange them</li>
                  <li>• Drag block corners to resize</li>
                  <li>• <Kbd>{getKeyboardShortcut("⇧")}</Kbd>+click or drag to select multiple blocks</li>
                </ul>
              )}
              <div className="space-y-3">
                {BLOCK_CATEGORIES.map((category) => (
                  <div key={category.label}>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wide mb-2">
                      {category.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.blocks.map((block) => {
                        const Icon = block.icon;
                        return (
                          <div
                            key={block.type}
                            className="flex items-start gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-[140px]"
                          >
                            <div
                              className="p-1.5 rounded-md shrink-0 mt-0.5"
                              style={{ backgroundColor: `${block.color}20` }}
                            >
                              <Icon size={14} style={{ color: block.color }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {block.label}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                                {block.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                Tools
              </h4>
              {isMobile ? (
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Pinch to zoom in and out</li>
                  <li>• Two-finger drag to pan around the canvas</li>
                  <li>• Use the toolbar buttons for zoom, Fit to View, and tools</li>
                  <li>• Select, Text, and Shape tools available in the toolbar</li>
                </ul>
              ) : (
                <>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <li>• Scroll to zoom in and out (or use toolbar buttons)</li>
                    <li>• Use Fit to View (toolbar) to frame all blocks</li>
                  </ul>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        <MousePointer size={16} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Select
                        </span>
                        <span className="text-slate-500 dark:text-slate-500"> — </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          Move, resize (drag corners), edit blocks. Press <Kbd>{getKeyboardShortcut("V")}</Kbd>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        <Hand size={16} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Pan
                        </span>
                        <span className="text-slate-500 dark:text-slate-500"> — </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          Scroll around. Press <Kbd>{getKeyboardShortcut("H")}</Kbd> or hold{" "}
                          <Kbd>{getKeyboardShortcut("⌘")}</Kbd> while dragging
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        <Type size={16} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Text
                        </span>
                        <span className="text-slate-500 dark:text-slate-500"> — </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          Add text labels
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 flex gap-0.5">
                        <Square size={12} className="text-slate-600 dark:text-slate-400" />
                        <Circle size={12} className="text-slate-600 dark:text-slate-400" />
                        <Minus size={12} className="text-slate-600 dark:text-slate-400" />
                        <ArrowRight size={12} className="text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Shape
                        </span>
                        <span className="text-slate-500 dark:text-slate-500"> — </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          Add rectangles, circles, lines, arrows
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>

            {!isMobile && (
              <section>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                  Keyboard Shortcuts
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SHORTCUTS.map(({ keys, action }) => (
                    <div
                      key={keys}
                      className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {action}
                      </span>
                      <Kbd>{getKeyboardShortcut(keys)}</Kbd>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Export & Share */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Export & Share
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Share or Export from the navbar or profile menu.
              </p>
              <div className="space-y-2 mb-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                  Export formats
                </p>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• <strong>JSON</strong> — Full backup, re-import, data portability</li>
                  <li>• <strong>Markdown</strong> — Developer docs, version control</li>
                  <li>• <strong>PNG / PDF</strong> — Visual snapshot, print, share</li>
                  <li>• <strong>CSV</strong> — Task board data for spreadsheets</li>
                </ul>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share links can be set to expire (Never, 7 days, or 30 days). Recipients get read-only access.
              </p>
            </section>

            {/* Tips */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Tips
              </h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Use the Layers tab in the sidebar to hide or lock blocks</li>
                <li>• Switch to View Mode for presentations</li>
                <li>• Use the block menu (⋮) for duplicate, delete, lock, and layer order</li>
              </ul>
            </section>
          </div>

          <div className="flex items-center justify-end p-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
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
