import React from "react";
import { Folder } from "lucide-react";
import { getIconComponent } from "../project-content/icon-picker";
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
      className={`flex items-center px-6 py-4 cursor-pointer transition-colors duration-100 group ${
        isSelected
          ? "bg-primary-50 dark:bg-primary-900/20"
          : "hover:bg-slate-100 dark:hover:bg-slate-800/60"
      }`}
      onClick={() => onSelect(project)}
      onMouseEnter={() => onMouseEnter(index)}
    >
      <div className="mr-4 flex-shrink-0">
        {showIcon ? (
          React.createElement(getIconComponent(project.icon || "Folder"), {
            size: 18,
            className: "text-primary-500",
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
          <div
            className={`text-xs font-semibold ${
              project.status === "archived"
                ? "text-slate-500 dark:text-slate-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {project.status
              ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
              : "Active"}
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {project.description}
          </div>
        )}
      </div>
    </li>
  );
}
