import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from "@/components/ui/shared/sheet";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
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
  ActionButtons,
  CanvasesList,
  Project,
} from "./project-details";

interface ProjectDetailsSidepanelProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onRequestDelete?: (project: Project) => void;
  onStatusChange?: (projectId: string, newStatus: string) => void;
  onOpenCanvas?: (
    project: Project,
    canvasId?: string,
    documentId?: string
  ) => void;
  onExportProject?: (project: Project) => void;
  onCanvasCreate?: (project: Project, name: string) => Promise<void> | void;
  canvasesRefreshKey?: number;
}

export function ProjectDetailsSidepanel({
  project,
  isOpen,
  onClose,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onOpenCanvas,
  onExportProject,
  onCanvasCreate,
  canvasesRefreshKey = 0,
}: ProjectDetailsSidepanelProps) {
  const isMobile = useIsMobile();
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Reset state when sidepanel closes
  React.useEffect(() => {
    if (!isOpen) {
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
    onRequestDelete?.(project);
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

  const projectMenuActions = (
    <>
      <Popover open={projectMenuOpen} onOpenChange={setProjectMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-9 w-9 rounded-full flex items-center justify-center
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
            disabled={!onRequestDelete}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </PopoverContent>
      </Popover>
      {!isMobile && (
        <SheetClose
          className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-9 w-9 rounded-full flex items-center justify-center
            bg-white/20 dark:bg-slate-700/50
            hover:bg-white/30 dark:hover:bg-slate-600/50
            transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Close"
        >
          <X size={16} className="text-slate-700 dark:text-slate-200" />
        </SheetClose>
      )}
    </>
  );

  // Mobile: bottom sheet (matches CanvasSidebar, DocumentSidebar pattern)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          hideClose
          className="h-[70vh] max-h-[70vh] rounded-t-2xl border-0 p-0 gap-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <SheetTitle className="sr-only">Project details</SheetTitle>
          <div className="flex flex-col h-full min-h-0">
            {/* Drag handle + close */}
            <div className="flex items-center justify-between pt-3 pb-2 px-4 shrink-0">
              <div className="w-10" />
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 pb-[env(safe-area-inset-bottom)] space-y-3">
              <SheetHeader className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                <ProjectHeader
                  project={project}
                  isEditMode={isEditMode}
                  editForm={editForm}
                  onInputChange={handleInputChange}
                  onStatusChange={onStatusChange}
                  renderActions={projectMenuActions}
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
              <ProjectStats
                project={project}
                isEditMode={isEditMode}
                editForm={editForm}
                onInputChange={handleInputChange}
              />
              <CanvasesList
                project={project}
                onOpenCanvas={(p, canvasId, documentId) =>
                  onOpenCanvas?.(p, canvasId, documentId)
                }
                onCanvasCreate={
                  onCanvasCreate
                    ? (name) => onCanvasCreate(project, name)
                    : undefined
                }
                refreshKey={canvasesRefreshKey}
              />
            </div>
            {isEditMode && (
              <div className="shrink-0 flex flex-col space-y-2 pt-4 pb-[env(safe-area-inset-bottom)] border-t border-slate-200 dark:border-slate-700 px-4">
                <ActionButtons
                  isEditMode={isEditMode}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: right-side panel (unchanged)
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        hideClose
        className="w-full sm:max-w-lg flex flex-col overflow-hidden
            backdrop-blur-2xl
            bg-[linear-gradient(to_bottom,rgba(251,191,36,0.1)_0%,rgba(251,191,36,0.05)_25%,rgba(59,130,246,0.08)_55%,rgba(255,255,255,0.4)_100%)]
            dark:bg-[linear-gradient(to_bottom,rgba(245,158,11,0.12)_0%,rgba(245,158,11,0.06)_25%,rgba(59,130,246,0.1)_55%,rgba(15,23,42,0.3)_100%)]
            border border-white/30 dark:border-white/20
            !top-14 !bottom-0 !right-0 !left-0 !h-[calc(100vh-3.5rem)]
            sm:!top-16 sm:!bottom-8 sm:!right-4 sm:!left-auto sm:!h-[calc(100vh-6rem)]
            rounded-t-2xl sm:rounded-[24px]"
        >
          <SheetHeader className="shrink-0 space-y-3 pb-4 border-b border-white/20 dark:border-slate-700/20">
            <ProjectHeader
              project={project}
              isEditMode={isEditMode}
              editForm={editForm}
              onInputChange={handleInputChange}
              onStatusChange={onStatusChange}
              renderActions={projectMenuActions}
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
            <ProjectStats
              project={project}
              isEditMode={isEditMode}
              editForm={editForm}
              onInputChange={handleInputChange}
            />
            <CanvasesList
              project={project}
              onOpenCanvas={(p, canvasId, documentId) =>
                onOpenCanvas?.(p, canvasId, documentId)
              }
              onCanvasCreate={
                onCanvasCreate
                  ? (name) => onCanvasCreate(project, name)
                  : undefined
              }
              refreshKey={canvasesRefreshKey}
            />
          </div>

          {/* Action Buttons - only shown when editing */}
          {isEditMode && (
            <div className="shrink-0 flex flex-col space-y-2 pt-4 pb-[env(safe-area-inset-bottom)] sm:pb-0 border-t border-white/20 dark:border-slate-700/20">
              <ActionButtons
                isEditMode={isEditMode}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
  );
}
