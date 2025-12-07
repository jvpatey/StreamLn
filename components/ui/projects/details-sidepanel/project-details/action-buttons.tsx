import {
  ExternalLink,
  Edit3,
  Archive,
  Trash2,
  CheckCircle,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import { Project } from "./types";

interface ActionButtonsProps {
  isEditMode: boolean;
  project: Project;
  isArchived: boolean;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditClick: () => void;
  onStatusChange?: (projectId: string, newStatus: string) => void;
  onDelete: () => void;
  onOpenCanvas?: (project: Project) => void;
}

export function ActionButtons({
  isEditMode,
  project,
  isArchived,
  onSaveEdit,
  onCancelEdit,
  onEditClick,
  onStatusChange,
  onDelete,
  onOpenCanvas,
}: ActionButtonsProps) {
  if (isEditMode) {
    return (
      <div className="flex space-x-2">
        <Button 
          className="flex-1 rounded-full
            backdrop-blur-2xl 
            bg-gradient-to-r from-primary-500/20 via-primary-400/25 to-accent-500/20
            dark:from-primary-500/15 dark:via-primary-400/20 dark:to-accent-500/15
            border border-white/30 dark:border-white/20
            hover:border-white/40 dark:hover:border-white/30
            text-slate-900 dark:text-white
            shadow-lg hover:shadow-xl
            transition-all duration-200" 
          onClick={onSaveEdit}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 rounded-full
            backdrop-blur-2xl bg-white/40 dark:bg-slate-800/40
            border border-white/30 dark:border-slate-700/30
            hover:bg-white/60 dark:hover:bg-slate-800/60
            hover:border-white/40 dark:hover:border-slate-700/40
            shadow-lg hover:shadow-xl
            transition-all duration-200" 
          onClick={onCancelEdit}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        className="w-full rounded-full font-semibold
          backdrop-blur-2xl 
          bg-gradient-to-r from-primary-500/20 via-primary-400/25 to-accent-500/20
          dark:from-primary-500/15 dark:via-primary-400/20 dark:to-accent-500/15
          border border-white/30 dark:border-white/20
          hover:border-white/40 dark:hover:border-white/30
          text-slate-900 dark:text-white
          shadow-lg hover:shadow-xl
          transition-all duration-200
          flex items-center justify-center"
        onClick={() => onOpenCanvas?.(project)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Open Project
      </Button>

      <div className="flex gap-3">
        <Button
          className="flex-1 rounded-full font-semibold
            backdrop-blur-2xl 
            bg-gradient-to-r from-accent-500/20 via-accent-400/25 to-primary-500/20
            dark:from-accent-500/15 dark:via-accent-400/20 dark:to-primary-500/15
            border border-white/30 dark:border-white/20
            hover:border-white/40 dark:hover:border-white/30
            text-slate-900 dark:text-white
            shadow-lg hover:shadow-xl
            transition-all duration-200
            flex items-center justify-center"
          onClick={onEditClick}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Button
          className="flex-1 rounded-full font-semibold
            backdrop-blur-2xl 
            bg-gradient-to-r from-accent-500/20 via-accent-400/25 to-primary-500/20
            dark:from-accent-500/15 dark:via-accent-400/20 dark:to-primary-500/15
            border border-white/30 dark:border-white/20
            hover:border-white/40 dark:hover:border-white/30
            text-slate-900 dark:text-white
            shadow-lg hover:shadow-xl
            transition-all duration-200
            flex items-center justify-center"
          onClick={() => {
            const newStatus = isArchived ? "active" : "archived";
            onStatusChange?.(project.id, newStatus);
          }}
        >
          {isArchived ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Unarchive
            </>
          ) : (
            <>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </>
          )}
        </Button>
      </div>

      <Button
        className="w-full rounded-full font-semibold
          backdrop-blur-2xl 
          bg-gradient-to-r from-red-500/20 via-red-400/25 to-red-600/20
          dark:from-red-500/15 dark:via-red-400/20 dark:to-red-600/15
          border border-white/30 dark:border-white/20
          hover:border-white/40 dark:hover:border-white/30
          text-slate-900 dark:text-white
          shadow-lg hover:shadow-xl
          transition-all duration-200
          flex items-center justify-center"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Project
      </Button>
    </>
  );
}
