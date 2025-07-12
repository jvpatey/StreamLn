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
        <Button className="flex-1" onClick={onSaveEdit}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" className="flex-1" onClick={onCancelEdit}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        className="w-full rounded-xl font-semibold shadow-md border-0 bg-blue-100/60 dark:bg-blue-900/40 hover:bg-blue-200/80 dark:hover:bg-blue-800/60 focus:ring-2 focus:ring-blue-400/40 text-blue-700 dark:text-blue-200 flex items-center justify-center transition-all duration-200"
        style={{
          boxShadow: "0 0 0 2px #3b82f630, 0 0 16px #3b82f618",
          border: "1.5px solid #3b82f630",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 2px #3b82f680, 0 0 24px #3b82f640, 0 8px 32px rgba(0,0,0,0.10)";
          e.currentTarget.style.border = "1.5px solid #3b82f680";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 0 0 2px #3b82f630, 0 0 16px #3b82f618";
          e.currentTarget.style.border = "1.5px solid #3b82f630";
        }}
        onClick={() => onOpenCanvas?.(project)}
      >
        <ExternalLink className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-300" />
        Open Project
      </Button>

      <div className="flex gap-3">
        <Button
          // Edit button: glassy purple
          className="flex-1 rounded-xl font-semibold shadow-md border-0 bg-purple-100/60 dark:bg-purple-900/40 hover:bg-purple-200/80 dark:hover:bg-purple-800/60 focus:ring-2 focus:ring-purple-400/40 text-purple-700 dark:text-purple-200 flex items-center justify-center transition-all duration-200"
          style={{
            boxShadow: "0 0 0 2px #a78bfa30, 0 0 16px #a78bfa18",
            border: "1.5px solid #a78bfa30",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 2px #a78bfa80, 0 0 24px #a78bfa40, 0 8px 32px rgba(0,0,0,0.10)";
            e.currentTarget.style.border = "1.5px solid #a78bfa80";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 2px #a78bfa30, 0 0 16px #a78bfa18";
            e.currentTarget.style.border = "1.5px solid #a78bfa30";
          }}
          onClick={onEditClick}
        >
          <Edit3 className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-300" />
          Edit
        </Button>

        <Button
          // Archive/Unarchive button: glassy amber
          className="flex-1 rounded-xl font-semibold shadow-md border-0 bg-amber-100/60 dark:bg-amber-900/40 hover:bg-amber-200/80 dark:hover:bg-amber-800/60 focus:ring-2 focus:ring-amber-400/40 text-amber-700 dark:text-amber-200 flex items-center justify-center transition-all duration-200"
          style={{
            boxShadow: "0 0 0 2px #f59e0b30, 0 0 16px #f59e0b18",
            border: "1.5px solid #f59e0b30",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 2px #f59e0b80, 0 0 24px #f59e0b40, 0 8px 32px rgba(0,0,0,0.10)";
            e.currentTarget.style.border = "1.5px solid #f59e0b80";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 0 2px #f59e0b30, 0 0 16px #f59e0b18";
            e.currentTarget.style.border = "1.5px solid #f59e0b30";
          }}
          onClick={() => {
            const newStatus = isArchived ? "active" : "archived";
            onStatusChange?.(project.id, newStatus);
          }}
        >
          {isArchived ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-300" />
              Unarchive
            </>
          ) : (
            <>
              <Archive className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-300" />
              Archive
            </>
          )}
        </Button>
      </div>

      <Button variant="destructive" className="w-full" onClick={onDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Project
      </Button>
    </>
  );
}
