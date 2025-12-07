import { Card } from "@/components/ui/shared/card";
import { Folder, Users, Clock, BarChart3 } from "lucide-react";
import React, { useState } from "react";
import { ProjectCardMenu } from "./project-card-menu";
import { getIconComponent } from "./icon-picker";

interface ProjectCardProps {
  id: string;
  name: string;
  type: string;
  progress: number;
  lastModified: string;
  collaborators: number;
  blocks: number;
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
  progress,
  lastModified,
  collaborators,
  blocks,
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
  // Color for progress
  const getProgressColor = () => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  const getProgressTextColor = () => {
    if (progress >= 80) return "text-green-500 dark:text-green-400";
    if (progress >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
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
        {/* First line: Icon, Title, Menu */}
        <div className="flex items-center space-x-3 mb-3 pr-8">
          <div
            className="p-2.5 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/20 flex-shrink-0"
            style={{
              color: accentColor || "#3b82f6",
            }}
          >
            {React.createElement(getIconComponent(icon || "Folder"), {
              size: 20,
              style: { color: accentColor || "#3b82f6" },
            })}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg truncate group-hover:text-primary-400 transition-colors">
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
        
        {/* Second line: Description and Progress % */}
        <div className="flex items-center justify-between mb-3">
          {description ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1 pr-2">
              {description}
            </p>
          ) : (
            <div className="flex-1" />
          )}
          <span
            className={`font-bold text-base flex-shrink-0 ${getProgressTextColor()}`}
          >
            {progress}%
          </span>
        </div>
        
        {/* Third line: Progress bar */}
        <div className="w-full h-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Metadata Row - pushed to bottom */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-white/20 dark:border-slate-700/20 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{lastModified}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users size={12} />
              <span>{collaborators}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 size={12} />
            <span className={`font-semibold ${statusColor}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
