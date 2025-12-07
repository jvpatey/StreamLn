import React from "react";
import { SheetTitle, SheetDescription } from "@/components/ui/shared/sheet";
import { getIconComponent } from "../../project-content/icon-picker";
import { ProjectStatusIconText } from "@/components/ui/projects/shared";
import { Project } from "./types";

interface ProjectHeaderProps {
  project: Project;
  isEditMode: boolean;
  editForm: {
    name: string;
    description: string;
    icon: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProjectHeader({
  project,
  isEditMode,
  editForm,
  onInputChange,
}: ProjectHeaderProps) {

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 group">
        <div className="p-4 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:border-white/30 dark:hover:border-slate-700/30 hover:scale-105 cursor-pointer flex-shrink-0">
          {React.createElement(
            getIconComponent(editForm.icon || project.icon || "Folder"),
            {
              className:
                "h-8 w-8 text-primary transition-colors duration-200 group-hover:text-primary/80",
            }
          )}
        </div>
        <div className="flex-1">
          {isEditMode ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                className="w-full text-xl font-semibold 
                  backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                  border-b border-white/30 dark:border-slate-700/30
                  focus:border-primary/50 focus:outline-none 
                  transition-colors duration-200 rounded-t-lg px-2 py-1"
                placeholder="Project name"
              />
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
            </div>
          ) : (
            <>
              <SheetTitle className="text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-primary/80 cursor-pointer">
                {project.name}
              </SheetTitle>
              {project.description && (
                <SheetDescription className="text-sm text-muted-foreground leading-relaxed transition-colors duration-200 hover:text-foreground/80">
                  {project.description}
                </SheetDescription>
              )}
            </>
          )}
          <div className="mt-1">
            <ProjectStatusIconText 
              status={project.status} 
              className="transition-colors duration-200 group-hover:opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
