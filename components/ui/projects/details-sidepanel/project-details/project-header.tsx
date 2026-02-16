import React from "react";
import { motion } from "framer-motion";
import { SheetTitle, SheetDescription } from "@/components/ui/shared/sheet";
import { getIconComponent } from "../../project-content/icon-picker";
import { getLiquidGlassSurfaceClassName } from "@/components/ui/shared/liquid-glass-surface";
import { Archive, CheckCircle } from "lucide-react";
import { Project } from "./types";
import { cn } from "@/lib/utils";

interface ProjectHeaderProps {
  project: Project;
  isEditMode: boolean;
  editForm: {
    name: string;
    description: string;
    icon: string;
  };
  onInputChange: (field: string, value: string) => void;
  onStatusChange?: (projectId: string, newStatus: string) => void;
}

export function ProjectHeader({
  project,
  isEditMode,
  editForm,
  onInputChange,
  onStatusChange,
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
          <div className="mt-2">
            {onStatusChange ? (
              <div
                role="radiogroup"
                aria-label="Project status"
                className={cn(
                  "flex items-center p-1 gap-0.5 relative w-[11.5rem]",
                  getLiquidGlassSurfaceClassName({
                    variant: "toolbar",
                    intensity: "xl",
                    rounded: "2xl",
                    className: "inline-flex",
                  })
                )}
              >
                {/* Sliding indicator - matches canvas Edit/View toggle pattern */}
                <motion.div
                  className={cn(
                    "absolute left-1 top-1 h-7 rounded-xl pointer-events-none",
                    "w-[calc(50%-6px)]",
                    project.status === "active"
                      ? "bg-gradient-to-r from-green-500/25 via-green-400/30 to-emerald-500/25 dark:from-green-500/20 dark:via-green-400/25 dark:to-emerald-500/20"
                      : "bg-gradient-to-r from-slate-500/25 via-slate-400/30 to-slate-500/25 dark:from-slate-500/20 dark:via-slate-400/25 dark:to-slate-500/20",
                    "backdrop-blur-2xl",
                    "border border-white/30 dark:border-white/20",
                    "shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.2)]",
                    "dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  )}
                  initial={false}
                  animate={{
                    x: project.status === "archived" ? "calc(100% + 4px)" : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                  type="button"
                  role="radio"
                  aria-checked={project.status === "active"}
                  onClick={() => onStatusChange(project.id, "active")}
                  className={cn(
                    "relative z-10 flex-1 min-w-0 text-xs rounded-xl h-7 flex items-center justify-center gap-1.5 font-medium transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset",
                    project.status === "active"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <CheckCircle size={12} className="shrink-0" />
                  Active
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={project.status === "archived"}
                  onClick={() => onStatusChange(project.id, "archived")}
                  className={cn(
                    "relative z-10 flex-1 min-w-0 text-xs rounded-xl h-7 flex items-center justify-center gap-1.5 font-medium transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-inset",
                    project.status === "archived"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <Archive size={12} className="shrink-0" />
                  Archived
                </button>
              </div>
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  project.status === "archived"
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-green-600 dark:text-green-400"
                )}
              >
                {project.status === "archived" ? (
                  <>
                    <Archive size={14} />
                    Archived
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    Active
                  </>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
