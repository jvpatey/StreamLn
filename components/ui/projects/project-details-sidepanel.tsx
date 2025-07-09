import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/shared/sheet";
import { Button } from "@/components/ui/shared/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";
import {
  Folder,
  Calendar,
  Clock,
  Users,
  BarChart3,
  ExternalLink,
  Edit3,
  Archive,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Circle,
  AlertCircle,
} from "lucide-react";
import { getIconComponent } from "./icon-picker";

interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface ProjectDetailsSidepanelProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onStatusChange?: (projectId: string, newStatus: string) => void;
}

export function ProjectDetailsSidepanel({
  project,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: ProjectDetailsSidepanelProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Reset confirmation state when sidepanel closes
  React.useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(false);
    }
  }, [isOpen]);

  if (!project) return null;

  const isArchived = project.status === "archived";
  const isActive = project.status === "active";

  const getStatusIcon = () => {
    switch (project.status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "archived":
        return <Archive className="h-4 w-4 text-slate-500" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case "active":
        return "text-green-600 dark:text-green-400";
      case "archived":
        return "text-slate-500 dark:text-slate-400";
      default:
        return "text-slate-400";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

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

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-l border-border/50"
        >
          <SheetHeader className="space-y-4 pb-6 border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 transition-all duration-200 hover:bg-primary/20 hover:border-primary/30 hover:scale-105 cursor-pointer">
                  {React.createElement(
                    getIconComponent(project.icon || "Folder"),
                    {
                      className:
                        "h-5 w-5 text-primary transition-colors duration-200 group-hover:text-primary/80",
                    }
                  )}
                </div>
                <div>
                  <SheetTitle className="text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary/80 cursor-pointer">
                    {project.name}
                  </SheetTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon()}
                    <span
                      className={`text-sm font-medium ${getStatusColor()} transition-colors duration-200 group-hover:opacity-80`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {project.description && (
              <SheetDescription className="text-sm text-muted-foreground leading-relaxed transition-colors duration-200 hover:text-foreground/80">
                {project.description}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Project Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center space-x-2 transition-colors duration-200 group-hover:text-primary/80">
                  <BarChart3 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>Project Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 transition-all duration-200 hover:scale-105">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Created</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-1 transition-all duration-200 hover:scale-105">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Updated</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(project.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 transition-all duration-200 hover:scale-105">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Collaborators</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Just you for now
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Preview */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold transition-colors duration-200 group-hover:text-primary/80">
                  Canvas Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-border/50 transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-md">
                  {/* Placeholder grid blocks */}
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 200 80"
                    fill="none"
                    className="transition-transform duration-200 group-hover:scale-105"
                  >
                    <rect
                      x="12"
                      y="12"
                      width="50"
                      height="20"
                      rx="4"
                      fill="#3b82f6"
                      fillOpacity="0.18"
                    />
                    <rect
                      x="70"
                      y="12"
                      width="40"
                      height="15"
                      rx="4"
                      fill="#f59e42"
                      fillOpacity="0.18"
                    />
                    <rect
                      x="120"
                      y="12"
                      width="30"
                      height="25"
                      rx="4"
                      fill="#3b82f6"
                      fillOpacity="0.18"
                    />
                    <rect
                      x="30"
                      y="35"
                      width="40"
                      height="15"
                      rx="4"
                      fill="#f59e42"
                      fillOpacity="0.18"
                    />
                    <rect
                      x="80"
                      y="35"
                      width="50"
                      height="12"
                      rx="4"
                      fill="#3b82f6"
                      fillOpacity="0.18"
                    />
                    <rect
                      x="140"
                      y="35"
                      width="35"
                      height="18"
                      rx="4"
                      fill="#f59e42"
                      fillOpacity="0.18"
                    />
                  </svg>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-xs text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full font-medium shadow-sm border border-border/50 transition-all duration-200 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                    6 blocks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project ID */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold transition-colors duration-200 group-hover:text-primary/80">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Project ID
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono text-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:border group-hover:border-primary/20">
                      {project.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                      onClick={() => navigator.clipboard.writeText(project.id)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-6 border-t border-border/50">
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
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit?.(project)}
              >
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

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          style={{ pointerEvents: "auto" }}
          onClick={cancelDelete}
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
                {React.createElement(
                  getIconComponent(project.icon || "Folder"),
                  {
                    className: "h-4 w-4 text-primary",
                  }
                )}
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
                onClick={cancelDelete}
                className="px-4 py-2 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <button type="button">Cancel</button>
              </Button>
              <Button
                asChild
                variant="destructive"
                onClick={confirmDeleteAction}
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
      )}
    </>
  );
}
