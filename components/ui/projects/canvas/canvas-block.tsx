"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/shared/card";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import {
  FileText,
  Maximize2,
  Code2,
  Image,
  Link,
  Tag,
  GripVertical,
  MoreVertical,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { NoteBlock } from "./blocks/note-block";
import { TaskBoardBlock } from "./blocks/task-board-block";
import { CodeBlock } from "./blocks/code-block";
import { ImageBlock } from "./blocks/image-block";
import { LinkBlock } from "./blocks/link-block";
import { TagBlock } from "./blocks/tag-block";

interface CanvasBlock {
  id: string;
  type: "note" | "task-board" | "code" | "image" | "link" | "tag";
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  color?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  locked?: boolean;
  hidden?: boolean;
}

interface CanvasBlockProps {
  block: CanvasBlock;
  isSelected: boolean;
  isEditable: boolean;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onContextMenu: (position: { x: number; y: number }) => void;
  zoomLevel: number;
  panOffset: { x: number; y: number };
}

export function CanvasBlock({
  block,
  isSelected,
  isEditable,
  onUpdate,
  onSelect,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
  onContextMenu,
  zoomLevel,
  panOffset,
}: CanvasBlockProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const blockRef = useRef<HTMLDivElement>(null);

  const getBlockIcon = () => {
    switch (block.type) {
      case "note":
        return <FileText size={12} />;
      case "task-board":
        return <Maximize2 size={12} />;
      case "code":
        return <Code2 size={12} />;
      case "image":
        return <Image size={12} />;
      case "link":
        return <Link size={12} />;
      case "tag":
        return <Tag size={12} />;
      default:
        return <FileText size={12} />;
    }
  };

  const getBlockColor = () => {
    return block.color || "#3b82f6";
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();

      if (!isEditable || block.locked) return;

      // Convert screen coordinates to world coordinates
      const worldX = (e.clientX - panOffset.x) / zoomLevel;
      const worldY = (e.clientY - panOffset.y) / zoomLevel;

      // Calculate offset from block's world position
      const offsetX = worldX - block.x;
      const offsetY = worldY - block.y;

      setIsDragging(true);
      setDragStart({ x: offsetX, y: offsetY });
      onDragStart();
    },
    [
      onSelect,
      isEditable,
      block.locked,
      onDragStart,
      panOffset,
      zoomLevel,
      block.x,
      block.y,
    ]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        // Convert screen coordinates to world coordinates
        const worldX = (e.clientX - panOffset.x) / zoomLevel;
        const worldY = (e.clientY - panOffset.y) / zoomLevel;

        // Calculate new block position
        const newX = worldX - dragStart.x;
        const newY = worldY - dragStart.y;

        onUpdate({
          x: newX,
          y: newY,
        });
      } else if (isResizing) {
        const newWidth = Math.max(
          150,
          e.clientX - resizeStart.x + resizeStart.width
        );
        const newHeight = Math.max(
          100,
          e.clientY - resizeStart.y + resizeStart.height
        );

        onUpdate({
          width: newWidth,
          height: newHeight,
        });
      }
    },
    [
      isDragging,
      isResizing,
      dragStart,
      resizeStart,
      onUpdate,
      panOffset,
      zoomLevel,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
    if (isResizing) {
      setIsResizing(false);
      onResizeEnd();
    }
  }, [isDragging, isResizing, onDragEnd, onResizeEnd]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditable || block.locked) return;

      setIsResizing(true);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: block.width,
        height: block.height,
      });
      onResizeStart();
    },
    [isEditable, block.locked, block.width, block.height, onResizeStart]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onContextMenu({ x: e.clientX, y: e.clientY });
    },
    [onContextMenu]
  );

  // Add global mouse event listeners when dragging or resizing
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const renderBlockContent = () => {
    const commonProps = {
      block,
      onUpdate,
      isEditable,
    };

    switch (block.type) {
      case "note":
        return <NoteBlock {...commonProps} />;
      case "task-board":
        return <TaskBoardBlock {...commonProps} />;
      case "code":
        return <CodeBlock {...commonProps} />;
      case "image":
        return <ImageBlock {...commonProps} />;
      case "link":
        return <LinkBlock {...commonProps} />;
      case "tag":
        return <TagBlock {...commonProps} />;
      default:
        return <NoteBlock {...commonProps} />;
    }
  };

  if (block.hidden) {
    return null;
  }

  return (
    <div
      ref={blockRef}
      className={`absolute group cursor-move select-none ${
        isDragging ? "z-50" : isSelected ? "z-40" : "z-10"
      }`}
      style={{
        left: block.x,
        top: block.y,
        width: block.width,
        height: block.height,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <Card
        className={`relative w-full h-full overflow-hidden transition-all duration-200 border ${
          isSelected
            ? "ring-2 ring-primary ring-offset-2 shadow-xl"
            : "hover:shadow-lg"
        } ${isDragging ? "opacity-80 scale-105" : ""} ${
          !isEditable ? "cursor-default" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, ${getBlockColor()}05 0%, transparent 100%)`,
          backdropFilter: "blur(10px)",
          borderColor: `${getBlockColor()}30`,
          boxShadow: `0 0 0 1px ${getBlockColor()}25, 0 0 24px ${getBlockColor()}15, 0 4px 12px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {/* Block Header */}
        <div
          className="flex items-center justify-between p-3 border-b border-slate-200/50 dark:border-slate-700/50"
          style={{
            background: `linear-gradient(90deg, ${getBlockColor()}08 0%, transparent 100%)`,
          }}
        >
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div
              className="p-2 rounded-xl shadow-sm ring-1 ring-white/20"
              style={{
                backgroundColor: `${getBlockColor()}15`,
                boxShadow: `0 2px 8px ${getBlockColor()}20`,
              }}
            >
              <div style={{ color: getBlockColor() }}>{getBlockIcon()}</div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {block.title ||
                  `${block.type.charAt(0).toUpperCase() + block.type.slice(1)}`}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {block.type} block
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            {block.locked && (
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Lock
                  size={12}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
            )}
            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <MoreVertical size={14} />
              </Button>
            )}
          </div>
        </div>

        {/* Block Content */}
        <div className="flex-1 overflow-hidden">{renderBlockContent()}</div>

        {/* Selection Indicator */}
        {isSelected && isEditable && (
          <>
            {/* Resize Handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize opacity-80 hover:opacity-100"
              style={{
                clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
              }}
              onMouseDown={handleResizeStart}
            />

            {/* Drag Handle */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1 bg-white/90 dark:bg-slate-800/90 rounded border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing">
                <GripVertical size={10} className="text-slate-400" />
              </div>
            </div>
          </>
        )}

        {/* Drag Preview */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded pointer-events-none" />
        )}
      </Card>
    </div>
  );
}
