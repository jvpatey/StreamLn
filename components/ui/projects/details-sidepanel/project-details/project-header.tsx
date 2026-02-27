import React from "react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { SheetTitle } from "@/components/ui/shared/sheet";
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
  /** Renders on the right of row 1 (icons have priority, title truncates) */
  renderActions?: React.ReactNode;
}

export function ProjectHeader({
  project,
  isEditMode,
  editForm,
  onInputChange,
  onStatusChange,
  renderActions,
}: ProjectHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Icon + Title (truncates) | Actions (priority) */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-11 w-11 flex items-center justify-center rounded-xl backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 flex-shrink-0">
          {React.createElement(
            getIconComponent(editForm.icon || project.icon || "Folder"),
            {
              className: cn(
                "h-6 w-6 transition-colors duration-200",
                project.status === "archived"
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-primary"
              ),
            }
          )}
        </div>
        <div className="flex-1 min-w-0 h-11 flex items-center">
          {isEditMode ? (
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              className="w-full h-full text-2xl font-semibold 
                backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                border-b border-white/30 dark:border-slate-700/30
                focus:border-primary/50 focus:outline-none 
                transition-colors duration-200 rounded-t-lg px-2"
              placeholder="Project name"
            />
          ) : (
            <SheetTitle className="text-2xl font-semibold text-foreground truncate block leading-[2.75rem]">
              {project.name}
            </SheetTitle>
          )}
        </div>
        {renderActions && (
          <div className="flex items-center gap-1 shrink-0">{renderActions}</div>
        )}
      </div>

      {/* Row 2: Created/Updated subtext */}
      <p className="text-xs text-muted-foreground">
        {(() => {
          try {
            const created = formatDistanceToNow(new Date(project.createdAt), {
              addSuffix: true,
            });
            const updated = formatDistanceToNow(new Date(project.updatedAt), {
              addSuffix: true,
            });
            return `Created ${created} · Updated ${updated}`;
          } catch {
            return null;
          }
        })()}
      </p>

      {/* Row 3: Toggle left-aligned */}
      <div className="flex justify-start">
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
  );
}
