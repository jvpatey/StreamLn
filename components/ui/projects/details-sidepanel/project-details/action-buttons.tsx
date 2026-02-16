import { ExternalLink, Save, X } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import { Project } from "./types";

interface ActionButtonsProps {
  isEditMode: boolean;
  project: Project;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onOpenCanvas?: (project: Project, canvasId?: string) => void;
}

export function ActionButtons({
  isEditMode,
  project,
  onSaveEdit,
  onCancelEdit,
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
      onClick={() => onOpenCanvas?.(project, undefined)}
    >
      <ExternalLink className="h-4 w-4 mr-2" />
      Open Project
    </Button>
  );
}
