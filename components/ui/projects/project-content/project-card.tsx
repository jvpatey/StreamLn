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

  const [isHovered, setIsHovered] = useState(false);
  // Accent color (use icon color or default blue)
  const accentColor = icon === "Folder" || !icon ? "#3b82f6" : undefined;
  const baseBoxShadow = `0 0 0 2px ${accentColor || "#3b82f6"}30, 0 0 16px ${
    accentColor || "#3b82f6"
  }18`;
  const hoverBoxShadow = `0 0 0 2px ${accentColor || "#3b82f6"}80, 0 0 24px ${
    accentColor || "#3b82f6"
  }40, 0 8px 32px rgba(0,0,0,0.10)`;
  const baseBorder = `1.5px solid ${accentColor || "#3b82f6"}30`;
  const hoverBorder = `1.5px solid ${accentColor || "#3b82f6"}80`;
  return (
    <Card
      className={`group relative overflow-hidden border-0 transition-all duration-200 cursor-pointer rounded-2xl shadow-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-md ${
        isArchived ? "opacity-60" : ""
      }`}
      style={{
        boxShadow: isHovered ? hoverBoxShadow : baseBoxShadow,
        border: isHovered ? hoverBorder : baseBorder,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        .group:hover {
          box-shadow: 0 0 0 2px ${accentColor || "#3b82f6"}80,
            0 0 24px ${accentColor || "#3b82f6"}40,
            0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1.5px solid ${accentColor || "#3b82f6"}80;
        }
      `}</style>
      {/* Menu Button */}
      <div className="absolute top-3 right-3 z-10">
        <ProjectCardMenu
          isArchived={isArchived}
          onArchive={() => onStatusChange?.("archived")}
          onUnarchive={() => onStatusChange?.("active")}
          onDelete={onDelete}
        />
      </div>

      {/* Canvas Preview Area (placeholder) */}
      <div className="relative h-24 bg-gradient-to-br from-slate-100/60 to-slate-200/60 dark:from-slate-800/60 dark:to-slate-900/60 overflow-hidden flex items-center justify-center">
        {/* Placeholder grid blocks */}
        <svg width="100%" height="100%" viewBox="0 0 160 48" fill="none">
          <rect
            x="8"
            y="8"
            width="40"
            height="16"
            rx="3"
            fill="#3b82f6"
            fillOpacity="0.18"
          />
          <rect
            x="56"
            y="8"
            width="32"
            height="12"
            rx="3"
            fill="#f59e42"
            fillOpacity="0.18"
          />
          <rect
            x="96"
            y="8"
            width="24"
            height="20"
            rx="3"
            fill="#3b82f6"
            fillOpacity="0.18"
          />
          <rect
            x="24"
            y="28"
            width="32"
            height="12"
            rx="3"
            fill="#f59e42"
            fillOpacity="0.18"
          />
          <rect
            x="64"
            y="28"
            width="40"
            height="10"
            rx="3"
            fill="#3b82f6"
            fillOpacity="0.18"
          />
        </svg>
        {/* Blocks count */}
        <div className="absolute top-2 left-2 bg-white/80 dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full font-medium shadow">
          {blocks} blocks
        </div>
      </div>

      {/* Main Info */}
      <div className="p-4 pb-2">
        <div className="flex items-center space-x-2 mb-1">
          <div
            className="p-2 rounded-xl shadow"
            style={{
              backgroundColor: `${accentColor || "#3b82f6"}22`,
              boxShadow: `0 2px 8px ${accentColor || "#3b82f6"}22`,
            }}
          >
            {React.createElement(getIconComponent(icon || "Folder"), {
              size: 18,
              style: { color: accentColor || "#3b82f6" },
            })}
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-base truncate max-w-[140px] group-hover:text-primary-400 transition-colors">
            {name}
          </span>
          <span
            className={`ml-auto font-bold text-sm ${getProgressTextColor()}`}
          >
            {progress}%
          </span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
          {type}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-4 pb-3">
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
    </Card>
  );
}
