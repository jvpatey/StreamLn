"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Maximize2,
  Layers,
  Users,
  Clock,
  BarChart3,
  Star,
  Globe,
  MoreHorizontal,
  Folder,
  Hash,
} from "lucide-react";

interface CanvasBlock {
  id: string;
  type: "note" | "task-board" | "image" | "code" | "link";
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

interface CanvasPreviewProps {
  id: string;
  title: string;
  type: "project" | "notes" | "board" | "template";
  lastModified: string;
  blocks: number;
  collaborators: number;
  progress: number;
  starred?: boolean;
  shared?: boolean;
  canvasBlocks?: CanvasBlock[];
  onClick?: () => void;
}

export function CanvasPreview({
  id,
  title,
  type,
  lastModified,
  blocks,
  collaborators,
  progress,
  starred = false,
  shared = false,
  canvasBlocks = [],
  onClick,
}: CanvasPreviewProps) {
  // Generate demo blocks if none provided
  const demoBlocks: CanvasBlock[] =
    canvasBlocks.length > 0
      ? canvasBlocks
      : [
          {
            id: "1",
            type: "note",
            x: 10,
            y: 15,
            width: 35,
            height: 25,
            color: "primary",
          },
          {
            id: "2",
            type: "task-board",
            x: 55,
            y: 10,
            width: 30,
            height: 40,
            color: "accent",
          },
          {
            id: "3",
            type: "note",
            x: 15,
            y: 50,
            width: 25,
            height: 20,
            color: "primary",
          },
          {
            id: "4",
            type: "link",
            x: 70,
            y: 65,
            width: 20,
            height: 15,
            color: "accent",
          },
          {
            id: "5",
            type: "code",
            x: 45,
            y: 55,
            width: 20,
            height: 30,
            color: "primary",
          },
        ];

  const getTypeIcon = () => {
    switch (type) {
      case "project":
        return (
          <Folder
            size={16}
            className="text-primary-600 dark:text-primary-400"
          />
        );
      case "notes":
        return (
          <FileText
            size={16}
            className="text-accent-600 dark:text-accent-400"
          />
        );
      case "board":
        return (
          <Maximize2
            size={16}
            className="text-primary-600 dark:text-primary-400"
          />
        );
      case "template":
        return (
          <Layers size={16} className="text-slate-600 dark:text-slate-400" />
        );
      default:
        return (
          <Folder
            size={16}
            className="text-primary-600 dark:text-primary-400"
          />
        );
    }
  };

  const getBlockColor = (block: CanvasBlock) => {
    const colors = {
      primary: "bg-primary-500/20 border-primary-300 dark:border-primary-600",
      accent: "bg-accent-500/20 border-accent-300 dark:border-accent-600",
      note: "bg-blue-500/20 border-blue-300 dark:border-blue-600",
      task: "bg-green-500/20 border-green-300 dark:border-green-600",
      code: "bg-purple-500/20 border-purple-300 dark:border-purple-600",
    };
    return colors[block.color as keyof typeof colors] || colors.primary;
  };

  const getProgressColor = () => {
    if (progress >= 80) return "text-green-600 dark:text-green-400";
    if (progress >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer">
      {/* Canvas Preview Area */}
      <div className="relative h-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Canvas blocks */}
        <div className="absolute inset-0 p-2">
          {demoBlocks.slice(0, 8).map((block) => (
            <div
              key={block.id}
              className={`absolute border-2 rounded-md transition-all duration-200 group-hover:scale-105 ${getBlockColor(
                block
              )}`}
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.width}%`,
                height: `${block.height}%`,
              }}
            >
              {/* Block type indicator */}
              <div className="absolute top-1 left-1">
                {block.type === "note" && (
                  <FileText
                    size={8}
                    className="text-primary-600 dark:text-primary-400"
                  />
                )}
                {block.type === "task-board" && (
                  <Maximize2
                    size={8}
                    className="text-accent-600 dark:text-accent-400"
                  />
                )}
                {block.type === "code" && (
                  <Hash
                    size={8}
                    className="text-purple-600 dark:text-purple-400"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-slate-900/60" />

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {starred && (
            <div className="p-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <Star size={12} className="text-yellow-500 fill-current" />
            </div>
          )}
          {shared && (
            <div className="p-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <Globe size={12} className="text-blue-500" />
            </div>
          )}
          <div className="p-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <MoreHorizontal
              size={12}
              className="text-slate-600 dark:text-slate-400"
            />
          </div>
        </div>

        {/* Block count indicator */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="outline"
            className="text-xs bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
          >
            {blocks} blocks
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10">
              {getTypeIcon()}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                {title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                {type} canvas
              </p>
            </div>
          </div>
          <div className={`text-xs font-medium ${getProgressColor()}`}>
            {progress}%
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
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
            <span>Active</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-1 rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/20"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </Card>
  );
}

export default CanvasPreview;
