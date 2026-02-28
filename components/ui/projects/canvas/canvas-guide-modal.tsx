"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/shared/button";
import { getKeyboardShortcut } from "@/lib/utils";
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center py-8 px-4 sm:py-20 sm:px-8"
      onClick={() => onOpenChange(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
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
                  Canvas Guide
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Quick reference for canvas features
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
            {/* Getting Started */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Getting Started
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your canvas is an infinite workspace for notes, tasks, code, and more.
              </p>
            </section>

            {/* Adding Blocks */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-3">
                Adding Blocks
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <li>• Open the sidebar (left) and pick from Blocks</li>
                <li>• Double-click on the canvas to add a note</li>
                <li>• Drag blocks to rearrange them</li>
              </ul>
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
                      Move, resize, edit blocks. Press <Kbd>{getKeyboardShortcut("V")}</Kbd>
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

            {/* Tips */}
            <section>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide mb-2">
                Tips
              </h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Use the Layers tab in the sidebar to hide or lock blocks</li>
                <li>• Switch to View Mode for presentations</li>
                <li>• Share or Export from the navbar or profile menu</li>
              </ul>
            </section>
          </div>

          <div className="flex items-center justify-end p-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button onClick={() => onOpenChange(false)}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
