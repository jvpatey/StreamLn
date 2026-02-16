import { Card } from "@/components/ui/shared/card";
import { Clock, CheckCircle, Archive, Layout, SquareStack } from "lucide-react";
import React from "react";
import { ProjectCardMenu } from "./project-card-menu";
import { getIconComponent } from "./icon-picker";

interface ProjectCardProps {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  blocks: number;
  canvasCount: number;
  status: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  onClick?: () => void;
  onDelete?: () => void;
  onStatusChange?: (newStatus: string) => void;
}

export function ProjectCard({
  id,
  name,
  type,
  lastModified,
  blocks,
  canvasCount,
  status,
  description,
  icon,
  createdAt,
  updatedAt,
  userId,
  onClick,
  onDelete,
  onStatusChange,
}: ProjectCardProps) {
  const isArchived = status === "archived";
  const statusColor = isArchived
    ? "text-slate-500 dark:text-slate-400"
    : "text-green-600 dark:text-green-400";

  // Accent color (use icon color or default blue)
  const accentColor = icon === "Folder" || !icon ? "#3b82f6" : undefined;
  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 cursor-pointer rounded-2xl 
        backdrop-blur-2xl 
        bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
        dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
        border border-white/30 dark:border-white/20
        hover:border-white/40 dark:hover:border-white/30
        shadow-lg hover:shadow-xl
        flex flex-col h-full
        ${isArchived ? "opacity-60" : ""}`}
      onClick={onClick}
    >
      {/* Main Info */}
      <div className="p-5 pb-4 flex flex-col flex-1">
        {/* Primary: Icon + Title + Menu */}
        <div className="flex items-center space-x-3 mb-4 pr-8">
          <div
            className="p-3 rounded-xl backdrop-blur-sm bg-white/40 dark:bg-slate-800/40 border border-white/30 dark:border-slate-700/30 flex-shrink-0"
            style={{
              color: accentColor || "#3b82f6",
            }}
          >
            {React.createElement(getIconComponent(icon || "Folder"), {
              size: 24,
              style: { color: accentColor || "#3b82f6" },
            })}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xl truncate group-hover:text-primary-400 transition-colors">
              {name}
            </h3>
          </div>
          {/* Menu Button */}
          <div className="absolute top-4 right-4 z-10">
            <ProjectCardMenu
              isArchived={isArchived}
              onArchive={() => onStatusChange?.("archived")}
              onUnarchive={() => onStatusChange?.("active")}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Secondary: Description */}
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 truncate mb-2">
            {description}
          </p>
        )}

        {/* Secondary: Stats row */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Layout size={12} />
            {canvasCount} canvas{canvasCount !== 1 ? "es" : ""}
          </span>
          <span className="flex items-center gap-1">
            <SquareStack size={12} />
            {blocks} block{blocks !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Tertiary: Metadata Row - pushed to bottom */}
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2.5 border-t border-white/20 dark:border-slate-700/20 mt-auto">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{lastModified}</span>
          </div>
          <div className="flex items-center space-x-1">
            {isArchived ? (
              <Archive size={12} className={statusColor} />
            ) : (
              <CheckCircle size={12} className={statusColor} />
            )}
            <span className={`font-semibold ${statusColor}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
