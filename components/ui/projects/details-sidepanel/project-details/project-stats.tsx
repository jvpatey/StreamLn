import { BarChart3, Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";
import { Project } from "./types";

interface ProjectStatsProps {
  project: Project;
  isEditMode?: boolean;
  editForm?: { description: string };
  onInputChange?: (field: string, value: string) => void;
}

export function ProjectStats({
  project,
  isEditMode = false,
  editForm,
  onInputChange,
}: ProjectStatsProps) {
  return (
    <Card className="backdrop-blur-2xl 
      bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
      dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
      border border-white/30 dark:border-white/20
      hover:border-white/40 dark:hover:border-white/30
      transition-all duration-200 hover:shadow-xl cursor-pointer group rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center space-x-2 transition-colors duration-200 group-hover:text-primary/80">
          <BarChart3 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          <span>Project Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(project.description || isEditMode) && (
          <div className="space-y-1 transition-all duration-200 hover:scale-105">
            <div className="text-sm text-muted-foreground">Description</div>
            {isEditMode && editForm && onInputChange ? (
              <textarea
                value={editForm.description}
                onChange={(e) => onInputChange("description", e.target.value)}
                className="w-full text-sm
                  backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                  border border-white/30 dark:border-slate-700/30
                  rounded-lg p-2
                  focus:border-primary/50 focus:outline-none
                  transition-colors duration-200 resize-none"
                placeholder="Project description (optional)"
                rows={3}
              />
            ) : (
              project.description && (
                <p className="text-sm text-foreground leading-relaxed">
                  {project.description}
                </p>
              )
            )}
          </div>
        )}

        <div className="space-y-1 transition-all duration-200 hover:scale-105">
          <div className="text-sm text-muted-foreground">Project ID</div>
          <div className="flex items-center space-x-2">
            <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono text-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:border group-hover:border-primary/20">
              {project.id}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-md shrink-0
                backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                border border-white/20 dark:border-slate-700/20
                hover:bg-white/50 dark:hover:bg-slate-800/50
                hover:border-white/30 dark:hover:border-slate-700/30
                transition-all duration-200"
              onClick={() => navigator.clipboard.writeText(project.id)}
              aria-label="Copy project ID"
            >
              <Copy size={12} />
            </Button>
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
  );
}
