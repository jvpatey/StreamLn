import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/shared/sheet";
import { IconPicker } from "../project-content/icon-picker";
import {
  ProjectHeader,
  ProjectStats,
  CanvasPreview,
  ProjectDetails,
  ActionButtons,
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
  onOpenCanvas?: (project: Project) => void;
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
          className="w-full sm:max-w-lg overflow-y-auto bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-l border-border/50"
        >
          <SheetHeader className="space-y-4 pb-6 border-b border-border/50">
            <ProjectHeader
              project={project}
              isEditMode={isEditMode}
              editForm={editForm}
              onInputChange={handleInputChange}
            />

            {isEditMode && (
              <div className="space-y-3">
                <div className="space-y-2">
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

          <div className="space-y-6 py-6">
            <ProjectStats project={project} />
            <CanvasPreview />
            <ProjectDetails project={project} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-6 border-t border-border/50">
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
