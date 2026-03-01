"use client";

import { Plus } from "lucide-react";

interface CreateProjectListRowProps {
  onClick?: () => void;
}

export function CreateProjectListRow({ onClick }: CreateProjectListRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center w-full px-4 py-4 rounded-xl
        border-2 border-dashed border-slate-300 dark:border-slate-600
        hover:border-primary-400 dark:hover:border-primary-500
        bg-slate-50/60 dark:bg-slate-800/40
        hover:bg-primary-50/40 dark:hover:bg-primary-900/20
        backdrop-blur-sm
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:ring-offset-2 focus:ring-offset-background"
    >
      {/* Icon column - matches list w-8 */}
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-primary-100/80 dark:bg-primary-900/50 flex items-center justify-center group-hover:scale-105 group-hover:bg-primary-200/80 dark:group-hover:bg-primary-800/50 transition-all duration-200">
          <Plus size={18} className="text-primary-600 dark:text-primary-400" />
        </div>
      </div>
      {/* Name column - matches list flex-1 */}
      <div className="flex-1 min-w-0 text-left pl-2">
        <div className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          Create Project
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Add a new project workspace
        </div>
      </div>
      {/* Status column - empty, matches list w-24 */}
      <div className="w-24 flex-shrink-0" aria-hidden />
      {/* Actions column - empty, matches list w-36 */}
      <div className="w-36 flex-shrink-0" aria-hidden />
    </button>
  );
}
