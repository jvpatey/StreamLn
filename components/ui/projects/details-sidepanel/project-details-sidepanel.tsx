import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
} from "@/components/ui/shared/sheet";
import { Pencil, Trash2, X } from "lucide-react";
import { IconPicker } from "../project-content/icon-picker";
import {
  ProjectHeader,
  ProjectStats,
  ProjectDetails,
  ActionButtons,
  CanvasesList,
  DeleteConfirmationDialog,
  Project,
} from "./project-details";

interface ProjectDetailsSidepanelProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onStatusChange?: (projectId: string, newStatus: string) => void;
  onOpenCanvas?: (project: Project, canvasId?: string) => void;
}

export function ProjectDetailsSidepanel({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCanvas,
}: ProjectDetailsSidepanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Reset confirmation state when sidepanel closes
  React.useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(false);
      setIsEditMode(false);
    }
  }, [isOpen]);

  // Initialize edit form when project changes or edit mode is enabled
  React.useEffect(() => {
    if (project && isEditMode) {
      setEditForm({
        name: project.name,
        description: project.description || "",
        icon: project.icon || "Folder",
      });
    }
  }, [project, isEditMode]);

  if (!project) return null;

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteAction = () => {
    onDelete?.(project.id);
    setConfirmDelete(false);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    onEdit?.({
      ...project,
      name: editForm.name,
      description: editForm.description,
      icon: editForm.icon,
    });
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form to original values
    setEditForm({
      name: project.name,
      description: project.description || "",
      icon: project.icon || "Folder",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          hideClose
          className="w-full sm:max-w-lg flex flex-col overflow-hidden
            backdrop-blur-2xl bg-white/40 dark:bg-slate-900/30 
            border border-white/30 dark:border-white/20
            rounded-[24px] !top-16 !bottom-8 !right-4 !h-[calc(100vh-6rem)]"
        >
          <SheetHeader className="shrink-0 space-y-2 pb-4 border-b border-white/20 dark:border-slate-700/20 relative">
            {/* Edit, Delete, Close - aligned row with consistent styling */}
            <div className="absolute right-0 top-0 flex items-center gap-1">
              <button
                type="button"
                onClick={handleEditClick}
                disabled={isEditMode}
                className="h-9 w-9 rounded-full flex items-center justify-center
                  bg-white/20 dark:bg-slate-700/50
                  hover:bg-white/30 dark:hover:bg-slate-600/50
                  transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/20 dark:disabled:hover:bg-slate-700/50"
                aria-label="Edit project"
              >
                <Pencil size={16} className="text-slate-700 dark:text-slate-200" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="h-9 w-9 rounded-full flex items-center justify-center group
                  bg-white/20 dark:bg-slate-700/50
                  hover:bg-red-500/20 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Delete project"
              >
                <Trash2 size={16} className="text-slate-700 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400" />
              </button>
              <SheetClose
                className="h-9 w-9 rounded-full flex items-center justify-center
                  bg-white/20 dark:bg-slate-700/50
                  hover:bg-white/30 dark:hover:bg-slate-600/50
                  transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close"
              >
                <X size={16} className="text-slate-700 dark:text-slate-200" />
              </SheetClose>
            </div>
            <ProjectHeader
              project={project}
              isEditMode={isEditMode}
              editForm={editForm}
              onInputChange={handleInputChange}
              onStatusChange={onStatusChange}
            />

            {isEditMode && (
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Project Icon
                  </label>
                  <IconPicker
                    selectedIcon={editForm.icon}
                    onIconSelect={(icon) => handleInputChange("icon", icon)}
                  />
                </div>
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 py-3">
            <ProjectStats project={project} />
            <CanvasesList
              project={project}
              onOpenCanvas={(p, canvasId) => onOpenCanvas?.(p, canvasId)}
            />
            <ProjectDetails project={project} />
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex flex-col space-y-2 pt-4 border-t border-white/20 dark:border-slate-700/20">
            <ActionButtons
              isEditMode={isEditMode}
              project={project}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onOpenCanvas={onOpenCanvas}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DeleteConfirmationDialog
        confirmDelete={confirmDelete}
        project={project}
        onCancelDelete={cancelDelete}
        onConfirmDelete={confirmDeleteAction}
      />
    </>
  );
}
