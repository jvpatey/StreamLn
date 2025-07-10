import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import { getIconComponent } from "../../project-content/icon-picker";
import { Project } from "./types";

interface DeleteConfirmationDialogProps {
  confirmDelete: boolean;
  project: Project;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export function DeleteConfirmationDialog({
  confirmDelete,
  project,
  onCancelDelete,
  onConfirmDelete,
}: DeleteConfirmationDialogProps) {
  if (!confirmDelete) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
      style={{ pointerEvents: "auto" }}
      onClick={onCancelDelete}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 border border-border/50 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/20">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Delete Project?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            {React.createElement(getIconComponent(project.icon || "Folder"), {
              className: "h-4 w-4 text-primary",
            })}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {project.name}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {project.description}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            asChild
            variant="outline"
            onClick={onCancelDelete}
            className="px-4 py-2 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <button type="button">Cancel</button>
          </Button>
          <Button
            asChild
            variant="destructive"
            onClick={onConfirmDelete}
            className="px-4 py-2 transition-all duration-200 hover:from-destructive/90 hover:to-destructive/80 hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          >
            <button type="button">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
}
