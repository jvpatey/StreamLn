import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

interface ProjectCardMenuProps {
  isArchived: boolean;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}

// Project Card Menu component, used in project-card.tsx
export function ProjectCardMenu({
  isArchived,
  onArchive,
  onUnarchive,
  onDelete,
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
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-t-xl"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              isArchived ? onUnarchive() : onArchive();
            }}
          >
            {isArchived ? "Unarchive" : "Archive"}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-b-xl"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              setConfirmOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      )}
      {/* Confirmation Dialog */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4"
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
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-destructive-600 text-white hover:bg-destructive-700"
                onClick={() => {
                  setConfirmOpen(false);
                  onDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
