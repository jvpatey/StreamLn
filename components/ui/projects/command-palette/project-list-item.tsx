import React from "react";
import { Folder } from "lucide-react";
import { getIconComponent } from "../project-content/icon-picker";
import { ProjectStatusText } from "@/components/ui/projects/shared";
import { Project } from "./types";

interface ProjectListItemProps {
  project: Project;
  index: number;
  selectedIndex: number;
  onSelect: (project: Project) => void;
  onMouseEnter: (index: number) => void;
  showIcon?: boolean;
  showStatus?: boolean;
}

export function ProjectListItem({
  project,
  index,
  selectedIndex,
  onSelect,
  onMouseEnter,
  showIcon = true,
  showStatus = false,
}: ProjectListItemProps) {
  const isSelected = index === selectedIndex;

  return (
    <li
      className={`flex items-center px-6 py-4 cursor-pointer transition-all duration-200 group ${
        isSelected
          ? "bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5 backdrop-blur-sm"
          : "hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
      }`}
      onClick={() => onSelect(project)}
      onMouseEnter={() => onMouseEnter(index)}
    >
      <div className="mr-4 flex-shrink-0">
        {showIcon ? (
          React.createElement(getIconComponent(project.icon || "Folder"), {
            size: 18,
            className:
              project.status === "archived"
                ? "text-slate-400 dark:text-slate-500"
                : "text-primary-500",
          })
        ) : (
          <Folder size={16} />
        )}
      </div>
      <div className="flex-1">
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {project.name}
        </div>
        {showStatus ? (
          <ProjectStatusText 
            status={project.status || "active"} 
            size="sm"
          />
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {project.description}
          </div>
        )}
      </div>
    </li>
  );
}
