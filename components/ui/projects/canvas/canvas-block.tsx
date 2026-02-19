"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Card } from "@/components/ui/shared/card";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import {
  FileText,
  Kanban,
  Code2,
  Image,
  Link,
  Tag,
  Type,
  Square,
  GripVertical,
  MoreVertical,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Link2,
} from "lucide-react";
import { NoteBlock } from "./blocks/note-block";
import { NoteBlockErrorBoundary } from "./blocks/note-block-error-boundary";
import { TaskBoardBlock } from "./blocks/task-board-block";
import { CodeBlock } from "./blocks/code-block";
import { ImageBlock } from "./blocks/image-block";
import { LinkBlock } from "./blocks/link-block";
import { TagBlock } from "./blocks/tag-block";
import { TextBlock } from "./blocks/text-block";
import { ShapeBlock } from "./blocks/shape-block";

interface CanvasBlock {
  id: string;
  type: "note" | "task-board" | "code" | "image" | "link" | "tag" | "text" | "shape";
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
  entranceIndex?: number;
  isSelected: boolean;
  isEditable: boolean;
  isSelectionDragging?: boolean;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onContextMenu: (position: { x: number; y: number }) => void;
  zoomLevel: number;
  panOffset: { x: number; y: number };
}

const dropdownItemClass =
  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer outline-none focus:bg-slate-100 dark:focus:bg-slate-700 text-slate-700 dark:text-slate-300 data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-700";

const STAGGER_DELAY = 0.045;
const ENTRANCE_EASE = [0.25, 0.46, 0.45, 0.94] as const;

export function CanvasBlock({
  block,
  entranceIndex,
  isSelected,
  isEditable,
  isSelectionDragging = false,
  onUpdate,
  onDuplicate,
  onDelete,
  onSelect,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
  onContextMenu,
  zoomLevel,
  panOffset,
}: CanvasBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const DRAG_THRESHOLD_PX = 8;
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [pendingDrag, setPendingDrag] = useState<{
    startClientX: number;
    startClientY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleEditValue, setTitleEditValue] = useState("");
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const blockRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const getDisplayTitle = useCallback(() => {
    if (block.type === "tag") return "Tag";
    return (
      block.title ||
      `${block.type.charAt(0).toUpperCase() + block.type.slice(1)}`
    );
  }, [block.title, block.type]);

  const handleTitleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditable || block.locked) return;
      setTitleEditValue(getDisplayTitle());
      setIsEditingTitle(true);
    },
    [isEditable, block.locked, getDisplayTitle]
  );

  const handleTitleMouseDown = useCallback(() => {
    // No stopPropagation so mousedown bubbles to block for drag-from-anywhere
  }, []);

  const saveTitleAndClose = useCallback(() => {
    const trimmed = titleEditValue.trim();
    onUpdate({ title: trimmed || undefined });
    setIsEditingTitle(false);
  }, [titleEditValue, onUpdate]);

  const discardTitleEdit = useCallback(() => {
    setTitleEditValue(getDisplayTitle());
    setIsEditingTitle(false);
  }, [getDisplayTitle]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const getBlockIcon = () => {
    switch (block.type) {
      case "note":
        return <FileText size={12} />;
      case "task-board":
        return <Kanban size={12} />;
      case "code":
        return <Code2 size={12} />;
      case "image":
        return <Image size={12} />;
      case "link":
        return <Link size={12} />;
      case "tag":
        return <Tag size={12} />;
      case "text":
        return <Type size={12} />;
      case "shape":
        return <Square size={12} />;
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

      // Don't start block drag when interacting with task board (cards, columns, etc.)
      if ((e.target as HTMLElement).closest("[data-no-block-drag]")) return;

      // Convert screen coordinates to world coordinates
      const worldX = (e.clientX - panOffset.x) / zoomLevel;
      const worldY = (e.clientY - panOffset.y) / zoomLevel;

      // Record pending drag; start real drag only after pointer moves past threshold
      const offsetX = worldX - block.x;
      const offsetY = worldY - block.y;
      setPendingDrag({
        startClientX: e.clientX,
        startClientY: e.clientY,
        offsetX,
        offsetY,
      });
    },
    [onSelect, isEditable, block.locked, panOffset, zoomLevel, block.x, block.y]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (pendingDrag) {
        const dx = e.clientX - pendingDrag.startClientX;
        const dy = e.clientY - pendingDrag.startClientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > DRAG_THRESHOLD_PX) {
          setDragStart({ x: pendingDrag.offsetX, y: pendingDrag.offsetY });
          setIsDragging(true);
          onDragStart();
          setPendingDrag(null);
          const el =
            typeof document !== "undefined" ? document.activeElement : null;
          if (el && "blur" in el && typeof el.blur === "function") el.blur();

          const worldX = (e.clientX - panOffset.x) / zoomLevel;
          const worldY = (e.clientY - panOffset.y) / zoomLevel;
          onUpdate({
            x: worldX - pendingDrag.offsetX,
            y: worldY - pendingDrag.offsetY,
          });
        }
      } else if (isDragging) {
        const worldX = (e.clientX - panOffset.x) / zoomLevel;
        const worldY = (e.clientY - panOffset.y) / zoomLevel;
        const newX = worldX - dragStart.x;
        const newY = worldY - dragStart.y;
        onUpdate({ x: newX, y: newY });
      } else if (isResizing) {
        const minW = block.type === "task-board" ? 400 : 150;
        const minH = block.type === "task-board" ? 280 : 100;
        const newWidth = Math.max(
          minW,
          e.clientX - resizeStart.x + resizeStart.width
        );
        const newHeight = Math.max(
          minH,
          e.clientY - resizeStart.y + resizeStart.height
        );
        onUpdate({ width: newWidth, height: newHeight });
      }
    },
    [
      pendingDrag,
      isDragging,
      isResizing,
      dragStart,
      resizeStart,
      onUpdate,
      onDragStart,
      panOffset,
      zoomLevel,
      block.type,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (pendingDrag) setPendingDrag(null);
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
    if (isResizing) {
      setIsResizing(false);
      onResizeEnd();
    }
  }, [pendingDrag, isDragging, isResizing, onDragEnd, onResizeEnd]);

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

  // Add global mouse event listeners when dragging, resizing, or pending drag
  useEffect(() => {
    if (isDragging || isResizing || pendingDrag !== null) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, pendingDrag, handleMouseMove, handleMouseUp]);

  const renderBlockContent = () => {
    const commonProps = {
      block,
      onUpdate,
      isEditable,
    };

    switch (block.type) {
      case "note":
        return (
          <NoteBlockErrorBoundary>
            <NoteBlock {...commonProps} />
          </NoteBlockErrorBoundary>
        );
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
      case "text":
        return <TextBlock {...commonProps} />;
      case "shape":
        return <ShapeBlock {...commonProps} />;
      default:
        return (
          <NoteBlockErrorBoundary>
            <NoteBlock {...commonProps} />
          </NoteBlockErrorBoundary>
        );
    }
  };

  if (block.hidden) {
    return null;
  }

  const wrapperProps = {
    ref: blockRef,
    className: `absolute group cursor-move select-none ${
      isDragging || (isSelected && isSelectionDragging)
        ? "z-50"
        : isSelected
        ? "z-40"
        : "z-10"
    }`,
    style: {
      left: block.x,
      top: block.y,
      width: block.width,
      height: block.height,
    },
    onMouseDown: handleMouseDown,
    onContextMenu: handleContextMenu,
  };

  const animationProps =
    entranceIndex !== undefined
      ? {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, scale: 0.98 },
          transition: {
            duration: 0.3,
            delay: entranceIndex * STAGGER_DELAY,
            ease: ENTRANCE_EASE,
            layout: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
          },
        }
      : {
          exit: { opacity: 0, scale: 0.98 },
          transition: { layout: { duration: 0.28, ease: [0.32, 0.72, 0, 1] } },
        };

  return (
    <motion.div layout="position" {...wrapperProps} {...animationProps}>
      <div className="relative h-full w-full">
        <Card
          className={`relative h-full w-full flex flex-col min-h-0 transition-all duration-200 ${
          block.type === "tag"
            ? "border"
            : block.type === "shape" && !isSelected
              ? "border-0"
              : isSelected
              ? "border-2"
              : "border"
        } ${
          block.type === "tag"
            ? "rounded-full overflow-visible"
            : block.type === "shape"
              ? "overflow-visible"
              : "overflow-hidden"
        } ${
          isSelected
            ? block.type === "tag"
              ? "ring-2 ring-primary ring-inset shadow-xl"
              : "ring-2 ring-primary ring-offset-2 shadow-xl"
            : "hover:shadow-lg"
        } ${
          isDragging || (isSelected && isSelectionDragging)
            ? "opacity-80 scale-105"
            : ""
        } ${!isEditable ? "cursor-default" : ""}`}
        style={{
          background:
            block.type === "tag" || block.type === "shape"
              ? "transparent"
              : isDark
                ? `linear-gradient(135deg, rgb(30,41,59) 0%, ${getBlockColor()}40 25%, ${getBlockColor()}25 60%, rgb(30,41,59) 100%)`
                : `linear-gradient(135deg, ${getBlockColor()}05 0%, transparent 100%)`,
          backdropFilter:
            block.type === "tag" || block.type === "shape" ? "none" : "blur(10px)",
          borderColor:
            block.type === "tag"
              ? "transparent"
              : block.type === "shape" && !isSelected
                ? "transparent"
                : isSelected
                ? `${getBlockColor()}80`
                : isDark
                ? `${getBlockColor()}50`
                : `${getBlockColor()}30`,
          boxShadow:
            block.type === "tag"
              ? "none"
              : block.type === "shape" && !isSelected
                ? "none"
                : isSelected
                ? `0 0 0 1px ${getBlockColor()}50, 0 0 24px ${getBlockColor()}15, 0 4px 12px rgba(0, 0, 0, 0.1)`
                : `0 0 0 1px ${getBlockColor()}25, 0 0 24px ${getBlockColor()}15, 0 4px 12px rgba(0, 0, 0, 0.1)`,
        }}
      >
        {/* Block Header (hidden for tag, text, and shape – minimal/subtle) */}
        {block.type !== "tag" && block.type !== "text" && block.type !== "shape" && (
          <div
            className="flex shrink-0 items-center justify-between p-3 border-b border-slate-200/50 dark:border-slate-700/50"
            style={{
              background: isDark
                ? `linear-gradient(90deg, ${getBlockColor()}35 0%, ${getBlockColor()}18 50%, ${getBlockColor()}08 100%)`
                : `linear-gradient(90deg, ${getBlockColor()}08 0%, transparent 100%)`,
            }}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div
                className="p-2 rounded-xl shadow-sm ring-1 ring-white/20 dark:ring-white/10"
                style={{
                  backgroundColor: isDark ? `${getBlockColor()}50` : `${getBlockColor()}15`,
                  boxShadow: isDark ? `0 2px 8px ${getBlockColor()}40` : `0 2px 8px ${getBlockColor()}20`,
                }}
              >
                <div style={{ color: getBlockColor() }}>{getBlockIcon()}</div>
              </div>
              <div
                className="flex flex-col min-w-0 flex-1"
                onDoubleClick={handleTitleDoubleClick}
                onMouseDown={handleTitleMouseDown}
                onPointerDown={handleTitleMouseDown}
              >
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={titleEditValue}
                    onChange={(e) => setTitleEditValue(e.target.value)}
                    onBlur={saveTitleAndClose}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveTitleAndClose();
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        discardTitleEdit();
                      }
                    }}
                    className="w-full text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {getDisplayTitle()}
                  </span>
                )}
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
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1 z-[100]"
                      sideOffset={4}
                      align="end"
                    >
                      {onDuplicate && (
                        <DropdownMenu.Item
                          className={dropdownItemClass}
                          onSelect={() => onDuplicate(block.id)}
                        >
                          <Copy size={14} />
                          Duplicate
                        </DropdownMenu.Item>
                      )}
                      {onDelete && (
                        <DropdownMenu.Item
                          className={`${dropdownItemClass} text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300`}
                          onSelect={() => onDelete(block.id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </DropdownMenu.Item>
                      )}
                      {(onDuplicate || onDelete) && (
                        <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                      )}
                      <DropdownMenu.Item
                        className={dropdownItemClass}
                        onSelect={() => onUpdate({ locked: !block.locked })}
                      >
                        {block.locked ? (
                          <>
                            <Unlock size={14} />
                            Unlock
                          </>
                        ) : (
                          <>
                            <Lock size={14} />
                            Lock
                          </>
                        )}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className={dropdownItemClass}
                        onSelect={() => onUpdate({ hidden: !block.hidden })}
                      >
                        {block.hidden ? (
                          <>
                            <Eye size={14} />
                            Show
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} />
                            Hide
                          </>
                        )}
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                      <DropdownMenu.Item
                        className={dropdownItemClass}
                        onSelect={() => {
                          const url = `${
                            typeof window !== "undefined"
                              ? window.location.origin +
                                window.location.pathname
                              : ""
                          }?block=${block.id}`;
                          if (
                            typeof navigator !== "undefined" &&
                            navigator.clipboard?.writeText
                          )
                            navigator.clipboard.writeText(url);
                        }}
                      >
                        <Link2 size={14} />
                        Copy link
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )}
            </div>
          </div>
        )}

        {/* Text block: floating menu (no header, subtle comment style) */}
        {block.type === "text" && (
          <div
            className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {block.locked && (
              <div className="p-1 rounded bg-amber-50 dark:bg-amber-900/20">
                <Lock
                  size={10}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
            )}
            {isEditable && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={12} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1 z-[100]"
                    sideOffset={4}
                    align="end"
                  >
                    {onDuplicate && (
                      <DropdownMenu.Item
                        className={dropdownItemClass}
                        onSelect={() => onDuplicate(block.id)}
                      >
                        <Copy size={14} />
                        Duplicate
                      </DropdownMenu.Item>
                    )}
                    {onDelete && (
                      <DropdownMenu.Item
                        className={`${dropdownItemClass} text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300`}
                        onSelect={() => onDelete(block.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenu.Item>
                    )}
                    {(onDuplicate || onDelete) && (
                      <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    )}
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => onUpdate({ locked: !block.locked })}
                    >
                      {block.locked ? (
                        <>
                          <Unlock size={14} />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          Lock
                        </>
                      )}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => onUpdate({ hidden: !block.hidden })}
                    >
                      {block.hidden ? (
                        <>
                          <Eye size={14} />
                          Show
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Hide
                        </>
                      )}
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => {
                        const url = `${
                          typeof window !== "undefined"
                            ? window.location.origin + window.location.pathname
                            : ""
                        }?block=${block.id}`;
                        if (
                          typeof navigator !== "undefined" &&
                          navigator.clipboard?.writeText
                        )
                          navigator.clipboard.writeText(url);
                      }}
                    >
                      <Link2 size={14} />
                      Copy link
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        )}

        {/* Shape block: floating menu (no header) */}
        {block.type === "shape" && (
          <div
            className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {block.locked && (
              <div className="p-1 rounded bg-amber-50 dark:bg-amber-900/20">
                <Lock
                  size={10}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
            )}
            {isEditable && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={12} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1 z-[100]"
                    sideOffset={4}
                    align="end"
                  >
                    {onDuplicate && (
                      <DropdownMenu.Item
                        className={dropdownItemClass}
                        onSelect={() => onDuplicate(block.id)}
                      >
                        <Copy size={14} />
                        Duplicate
                      </DropdownMenu.Item>
                    )}
                    {onDelete && (
                      <DropdownMenu.Item
                        className={`${dropdownItemClass} text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300`}
                        onSelect={() => onDelete(block.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenu.Item>
                    )}
                    {(onDuplicate || onDelete) && (
                      <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    )}
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => onUpdate({ locked: !block.locked })}
                    >
                      {block.locked ? (
                        <>
                          <Unlock size={14} />
                          Lock
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          Lock
                        </>
                      )}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => onUpdate({ hidden: !block.hidden })}
                    >
                      {block.hidden ? (
                        <>
                          <Eye size={14} />
                          Show
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Hide
                        </>
                      )}
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => {
                        const url = `${
                          typeof window !== "undefined"
                            ? window.location.origin + window.location.pathname
                            : ""
                        }?block=${block.id}`;
                        if (
                          typeof navigator !== "undefined" &&
                          navigator.clipboard?.writeText
                        )
                          navigator.clipboard.writeText(url);
                      }}
                    >
                      <Link2 size={14} />
                      Copy link
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        )}

        {/* Tag block: floating menu (no header, so menu overlays pill) */}
        {block.type === "tag" && (
          <div
            className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {block.locked && (
              <div className="p-1 rounded bg-amber-50 dark:bg-amber-900/20">
                <Lock
                  size={10}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
            )}
            {isEditable && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={12} />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1 z-[100]"
                    sideOffset={4}
                    align="end"
                  >
                    {onDuplicate && (
                      <DropdownMenu.Item
                        className={dropdownItemClass}
                        onSelect={() => onDuplicate(block.id)}
                      >
                        <Copy size={14} />
                        Duplicate
                      </DropdownMenu.Item>
                    )}
                    {onDelete && (
                      <DropdownMenu.Item
                        className={`${dropdownItemClass} text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300`}
                        onSelect={() => onDelete(block.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenu.Item>
                    )}
                    {(onDuplicate || onDelete) && (
                      <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    )}
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => onUpdate({ locked: !block.locked })}
                    >
                      {block.locked ? (
                        <>
                          <Unlock size={14} />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock size={14} />
                          Lock
                        </>
                      )}
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => onUpdate({ hidden: !block.hidden })}
                    >
                      {block.hidden ? (
                        <>
                          <Eye size={14} />
                          Show
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Hide
                        </>
                      )}
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <DropdownMenu.Item
                      className={dropdownItemClass}
                      onSelect={() => {
                        const url = `${
                          typeof window !== "undefined"
                            ? window.location.origin + window.location.pathname
                            : ""
                        }?block=${block.id}`;
                        if (
                          typeof navigator !== "undefined" &&
                          navigator.clipboard?.writeText
                        )
                          navigator.clipboard.writeText(url);
                      }}
                    >
                      <Link2 size={14} />
                      Copy link
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
        )}

        {/* Block Content */}
        <div
          className={
            block.type === "tag" || block.type === "code" || block.type === "shape"
              ? "flex-1 overflow-visible min-h-0"
              : block.type === "task-board"
              ? "flex-1 overflow-auto min-h-0"
              : "flex-1 overflow-hidden"
          }
        >
          {renderBlockContent()}
        </div>

        {/* Drag Preview */}
        {(isDragging || (isSelected && isSelectionDragging)) && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded pointer-events-none" />
        )}
      </Card>

        {/* Selection Indicator - outside Card so always at block bounds */}
        {isSelected && isEditable && (
          <>
            {/* Resize Handle - fixed at block bottom-right corner */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-80 hover:opacity-100 pointer-events-auto"
              style={{
                clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
                backgroundColor: getBlockColor(),
              }}
              onMouseDown={handleResizeStart}
            />

            {/* Drag Handle */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="p-1 bg-white/90 dark:bg-slate-800/90 rounded border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing">
                <GripVertical size={10} className="text-slate-400" />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
