"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Archive, Trash2, CheckCircle, Download } from "lucide-react";

interface ProjectCardMenuProps {
  isArchived: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onExport?: () => void;
}

// Project Card Menu component, used in project-card.tsx
export function ProjectCardMenu({
  isArchived,
  onArchive,
  onUnarchive,
  onDelete,
  onExport,
}: ProjectCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click-away logic for menu
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-1.5 rounded-full hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-primary-400"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((v) => !v);
        }}
        aria-label="Project actions"
      >
        <MoreHorizontal size={18} className="text-slate-400" />
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 animate-in fade-in slide-in-from-top-2">
          {onExport && (
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-t-xl"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onExport();
              }}
            >
              <Download size={16} className="text-slate-600 dark:text-slate-400 shrink-0" />
              Export
            </button>
          )}
          <button
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${!onExport ? "rounded-t-xl" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              isArchived ? onUnarchive() : onArchive();
            }}
          >
            {isArchived ? (
              <CheckCircle size={16} className="text-slate-600 dark:text-slate-400 shrink-0" />
            ) : (
              <Archive size={16} className="text-slate-600 dark:text-slate-400 shrink-0" />
            )}
            {isArchived ? "Unarchive" : "Archive"}
          </button>
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-b-xl"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              setConfirmOpen(true);
            }}
          >
            <Trash2 size={16} className="shrink-0" />
            Delete
          </button>
        </div>
      )}
      {/* Confirmation Dialog - portaled to body to escape overflow clipping */}
      {createPortal(
          <AnimatePresence>
            {confirmOpen && (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
              onClick={() => setConfirmOpen(false)}
              aria-modal="true"
              role="dialog"
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
                Delete Project?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-destructive text-white hover:bg-destructive/90 transition-colors"
                  onClick={() => {
                    setConfirmOpen(false);
                    onDelete();
                  }}
                >
                  Delete
                </button>
              </div>
              </motion.div>
            </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
