import React from "react";
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-l border-border/50"
      >
        <SheetHeader className="space-y-4 pb-6 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                {React.createElement(
                  getIconComponent(project.icon || "Folder"),
                  {
                    className: "h-5 w-5 text-primary",
                  }
                )}
              </div>
              <div>
                <SheetTitle className="text-xl font-semibold text-foreground">
                  {project.name}
                </SheetTitle>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon()}
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {project.description && (
            <SheetDescription className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Project Stats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Project Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Updated</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
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
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Canvas Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-border/50">
                {/* Placeholder grid blocks */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 80"
                  fill="none"
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
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-xs text-slate-700 dark:text-slate-200 px-2 py-1 rounded-full font-medium shadow-sm border border-border/50">
                  6 blocks
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project ID */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Project ID</div>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono text-foreground">
                    {project.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
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
            onClick={() => onDelete?.(project.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Project
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
