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
        className="w-full"
        onClick={() => {
          // TODO: Navigate to project canvas
          console.log("Navigate to project:", project.id);
        }}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Open Project
      </Button>

      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={onEditClick}>
          <Edit3 className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Button
          variant="outline"
          className="flex-1"
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

      <Button variant="destructive" className="w-full" onClick={onDelete}>
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Project
      </Button>
    </>
  );
}
