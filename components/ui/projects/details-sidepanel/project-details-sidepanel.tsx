import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
} from "@/components/ui/shared/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shared/popover";
import { Pencil, Trash2, X, Download, MoreHorizontal } from "lucide-react";
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
  onExportProject?: (project: Project) => void;
}

export function ProjectDetailsSidepanel({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCanvas,
  onExportProject,
}: ProjectDetailsSidepanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
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
      setProjectMenuOpen(false);
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
            backdrop-blur-2xl
            bg-[linear-gradient(to_bottom,rgba(251,191,36,0.1)_0%,rgba(251,191,36,0.05)_25%,rgba(59,130,246,0.08)_55%,rgba(255,255,255,0.4)_100%)]
            dark:bg-[linear-gradient(to_bottom,rgba(245,158,11,0.12)_0%,rgba(245,158,11,0.06)_25%,rgba(59,130,246,0.1)_55%,rgba(15,23,42,0.3)_100%)]
            border border-white/30 dark:border-white/20
            rounded-[24px] !top-16 !bottom-8 !right-4 !h-[calc(100vh-6rem)]"
        >
          <SheetHeader className="shrink-0 space-y-3 pb-4 border-b border-white/20 dark:border-slate-700/20">
            <ProjectHeader
              project={project}
              isEditMode={isEditMode}
              editForm={editForm}
              onInputChange={handleInputChange}
              onStatusChange={onStatusChange}
              renderActions={
                <>
                  <Popover open={projectMenuOpen} onOpenChange={setProjectMenuOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-9 w-9 rounded-full flex items-center justify-center
                          bg-white/20 dark:bg-slate-700/50
                          hover:bg-white/30 dark:hover:bg-slate-600/50
                          transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="Project menu"
                      >
                        <MoreHorizontal size={16} className="text-slate-700 dark:text-slate-200" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" side="bottom" className="w-48 p-1 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700">
                      {onExportProject && (
                        <button
                          type="button"
                          onClick={() => {
                            onExportProject(project);
                            setProjectMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Download size={16} className="text-slate-600 dark:text-slate-400" />
                          Export
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          handleEditClick();
                          setProjectMenuOpen(false);
                        }}
                        disabled={isEditMode}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Pencil size={16} className="text-slate-600 dark:text-slate-400" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDelete();
                          setProjectMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>
                  <SheetClose
                    className="h-9 w-9 rounded-full flex items-center justify-center
                      bg-white/20 dark:bg-slate-700/50
                      hover:bg-white/30 dark:hover:bg-slate-600/50
                      transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Close"
                  >
                    <X size={16} className="text-slate-700 dark:text-slate-200" />
                  </SheetClose>
                </>
              }
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
