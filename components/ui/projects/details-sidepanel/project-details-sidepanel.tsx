import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/shared/sheet";
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

  const isArchived = project.status === "archived";

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
          className="w-full sm:max-w-lg flex flex-col overflow-hidden
            backdrop-blur-2xl bg-white/40 dark:bg-slate-900/30 
            border border-white/30 dark:border-white/20
            rounded-[24px] !top-16 !bottom-8 !right-4 !h-[calc(100vh-6rem)]"
        >
          <SheetHeader className="shrink-0 space-y-2 pb-4 border-b border-white/20 dark:border-slate-700/20">
            <ProjectHeader
              project={project}
              isEditMode={isEditMode}
              editForm={editForm}
              onInputChange={handleInputChange}
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
              isArchived={isArchived}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onEditClick={handleEditClick}
              onStatusChange={onStatusChange}
              onDelete={handleDelete}
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
