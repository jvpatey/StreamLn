"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import {
  LiquidGlassSurface,
  getLiquidGlassSurfaceClassName,
} from "@/components/ui/shared/liquid-glass-surface";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/shared/sheet";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import {
  FileText,
  Kanban,
  Code2,
  Image,
  Link,
  Tag,
  Type,
  Layers,
  Blocks,
  Plus,
  PanelLeftClose,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react";

interface CanvasBlock {
  id: string;
  type:
    | "note"
    | "task-board"
    | "code"
    | "image"
    | "link"
    | "tag"
    | "text"
    | "shape";
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

interface CanvasSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (type: string, position?: { x: number; y: number }) => void;
  selectedBlocks: string[];
  canvasBlocks: CanvasBlock[];
  onBlockUpdate: (id: string, updates: Partial<CanvasBlock>) => void;
  onBlockSelect: (blockIds: string[]) => void;
}

const BLOCK_CATEGORIES = [
  {
    label: "Content",
    blocks: [
      {
        type: "note",
        label: "Note",
        description: "Rich text notes with formatting",
        icon: FileText,
        color: "#3b82f6",
      },
      {
        type: "text",
        label: "Text",
        description: "Short labels and comments",
        icon: Type,
        color: "#64748b",
      },
    ],
  },
  {
    label: "Organization",
    blocks: [
      {
        type: "task-board",
        label: "Task Board",
        description: "Kanban-style task management",
        icon: Kanban,
        color: "#10b981",
      },
      {
        type: "tag",
        label: "Tag",
        description: "Labels and categories",
        icon: Tag,
        color: "#ef4444",
      },
    ],
  },
  {
    label: "Media & References",
    blocks: [
      {
        type: "image",
        label: "Image",
        description: "Images and visual content",
        icon: Image,
        color: "#f59e0b",
      },
      {
        type: "link",
        label: "Link",
        description: "Web links and references",
        icon: Link,
        color: "#06b6d4",
      },
    ],
  },
  {
    label: "Technical",
    blocks: [
      {
        type: "code",
        label: "Code",
        description: "Code snippets with syntax highlighting",
        icon: Code2,
        color: "#8b5cf6",
      },
    ],
  },
] as const;

type BlockTypeInfo = (typeof BLOCK_CATEGORIES)[number]["blocks"][number];

/** Flattened list for Layers tab lookup (icon, color, label) */
const ALL_BLOCK_TYPES: BlockTypeInfo[] = BLOCK_CATEGORIES.flatMap(
  (cat) => [...cat.blocks] as BlockTypeInfo[],
);

export function CanvasSidebar({
  isOpen,
  onClose,
  onAddBlock,
  selectedBlocks,
  canvasBlocks,
  onBlockUpdate,
  onBlockSelect,
}: CanvasSidebarProps) {
  const [activeTab, setActiveTab] = useState<"blocks" | "layers">("blocks");
  const isMobile = useIsMobile();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleBlockToggleVisibility = (blockId: string) => {
    const block = canvasBlocks.find((b) => b.id === blockId);
    if (block) {
      onBlockUpdate(blockId, { hidden: !block.hidden });
    }
  };

  const handleBlockToggleLock = (blockId: string) => {
    const block = canvasBlocks.find((b) => b.id === blockId);
    if (block) {
      onBlockUpdate(blockId, { locked: !block.locked });
    }
  };

  const renderBlocksTab = () => (
    <motion.div
      key="blocks"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 space-y-3"
    >
      <div className="flex items-center justify-between w-full gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {canvasBlocks.length}
          </span>{" "}
          blocks
        </span>
        <span className="text-slate-400 dark:text-slate-500">·</span>
        <span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {selectedBlocks.length}
          </span>{" "}
          selected
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Add Blocks
        </h3>
        <div className="space-y-2">
          {BLOCK_CATEGORIES.map((category) => (
            <div key={category.label} className="space-y-1">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                {category.label}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {category.blocks.map((blockType) => {
                  const IconComponent = blockType.icon;
                  return (
                    <div
                      key={blockType.type}
                      className={getLiquidGlassSurfaceClassName({
                        variant: "panel",
                        intensity: "md",
                        rounded: "2xl",
                        className:
                          "p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-white/40 dark:hover:border-white/30",
                      })}
                      style={{
                        backgroundImage: `linear-gradient(to right, ${blockType.color}35, transparent)`,
                      }}
                      onClick={() => onAddBlock(blockType.type)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onAddBlock(blockType.type);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="p-2 rounded-xl flex-shrink-0"
                          style={{
                            backgroundColor: `${blockType.color}22`,
                          }}
                        >
                          <IconComponent
                            size={18}
                            style={{ color: blockType.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {blockType.label}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {blockType.description}
                          </p>
                        </div>
                        <Plus
                          size={16}
                          className="text-slate-400 flex-shrink-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderLayersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Canvas Layers
        </h3>
        <Badge variant="glass" className="text-xs">
          {canvasBlocks.length}
        </Badge>
      </div>

      {canvasBlocks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 dark:text-slate-500 text-sm mb-2">
            No blocks yet
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={() => setActiveTab("blocks")}
            className="text-xs"
          >
            Add your first block
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-hidden">
          {canvasBlocks
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((block) => {
              const blockType = ALL_BLOCK_TYPES.find(
                (t) => t.type === block.type,
              );
              const IconComponent = blockType?.icon || FileText;
              const isSelected = selectedBlocks.includes(block.id);

              const handleLayerClick = (e: React.MouseEvent) => {
                if (e.metaKey || e.ctrlKey) {
                  if (selectedBlocks.includes(block.id)) {
                    onBlockSelect(
                      selectedBlocks.filter((id) => id !== block.id),
                    );
                  } else {
                    onBlockSelect([...selectedBlocks, block.id]);
                  }
                } else {
                  onBlockSelect([block.id]);
                }
              };

              const handleLayerKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLayerClick(e as unknown as React.MouseEvent);
                }
              };

              return (
                <div
                  key={block.id}
                  role="button"
                  tabIndex={0}
                  onClick={handleLayerClick}
                  onKeyDown={handleLayerKeyDown}
                  className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer group backdrop-blur-sm ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 bg-white/20 dark:bg-slate-800/20"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="p-1 rounded"
                      style={{
                        backgroundColor: `${block.color || blockType?.color}20`,
                      }}
                    >
                      <IconComponent
                        size={12}
                        style={{ color: block.color || blockType?.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {block.title || `${blockType?.label || "Block"}`}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(block.updatedAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockToggleVisibility(block.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {block.hidden ? (
                          <EyeOff size={10} className="text-slate-400" />
                        ) : (
                          <Eye size={10} className="text-slate-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockToggleLock(block.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {block.locked ? (
                          <Lock size={10} className="text-slate-400" />
                        ) : (
                          <Unlock size={10} className="text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );

  // Mobile: bottom sheet (thumb-friendly, less coverage)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          hideClose
          className="h-[60vh] max-h-[60vh] rounded-t-2xl border-0 p-0 gap-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <SheetTitle className="sr-only">Add blocks and manage layers</SheetTitle>
          <div className="flex flex-col h-full min-h-0">
            {/* Drag handle + close */}
            <div className="flex items-center justify-between pt-3 pb-2 px-4 shrink-0">
              <div className="w-10" />
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            {/* Tabs */}
            <div className="px-4 pb-2 shrink-0">
              <div
                role="radiogroup"
                aria-label="Sidebar panel"
                className={cn(
                  "flex items-center p-1 gap-0.5 relative w-full min-w-0",
                  getLiquidGlassSurfaceClassName({
                    variant: "toolbar",
                    intensity: "xl",
                    rounded: "2xl",
                    className: "flex w-full min-w-0",
                  }),
                )}
              >
                <motion.div
                  className={cn(
                    "absolute left-1 top-1 h-9 rounded-xl pointer-events-none w-[calc(50%-6px)]",
                    "bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/20 dark:via-primary-400/25 dark:to-accent-500/20",
                    "backdrop-blur-2xl border border-white/30 dark:border-white/20",
                  )}
                  animate={{
                    x: activeTab === "layers" ? "calc(100% + 4px)" : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                  type="button"
                  role="radio"
                  aria-checked={activeTab === "blocks"}
                  onClick={() => setActiveTab("blocks")}
                  className={cn(
                    "relative z-10 flex-1 min-w-0 text-sm rounded-xl h-9 flex items-center justify-center gap-2 font-medium transition-colors duration-200",
                    activeTab === "blocks"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10",
                  )}
                >
                  <Blocks size={14} />
                  Blocks
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={activeTab === "layers"}
                  onClick={() => setActiveTab("layers")}
                  className={cn(
                    "relative z-10 flex-1 min-w-0 text-sm rounded-xl h-9 flex items-center justify-center gap-2 font-medium transition-colors duration-200",
                    activeTab === "layers"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10",
                  )}
                >
                  <Layers size={14} />
                  Layers
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 min-h-0 relative overflow-y-auto overflow-x-hidden">
              <AnimatePresence initial={false} mode="wait">
                {activeTab === "blocks" && renderBlocksTab()}
                {activeTab === "layers" && (
                  <motion.div
                    key="layers"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4"
                  >
                    {renderLayersTab()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: left sidebar
  return (
    <div
      className={`flex-shrink-0 transition-[width] duration-300 ease-in-out relative
        md:relative
        ${isOpen ? "w-80 overflow-visible z-20" : "w-0 overflow-hidden"}
        ${isOpen ? "fixed inset-x-0 top-16 bottom-0 z-50 md:!static md:!inset-auto md:!top-auto md:!bottom-auto" : "md:block"}
        ${!isOpen ? "hidden md:block" : ""}
      `}
    >
      {/* Mobile backdrop - tap to close */}
      {isOpen && (
        <div
          role="button"
          tabIndex={-1}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close sidebar"
          className="md:hidden absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"
        />
      )}
      <div className="w-80 max-w-[min(320px,85vw)] md:max-w-none h-full animate-sidebar-enter md:relative absolute left-0 top-0 bottom-0 md:left-auto md:top-auto md:bottom-auto z-10 md:z-auto max-h-[calc(100dvh-4rem)] md:max-h-none">
        <LiquidGlassSurface
          variant="panel"
          intensity="xl"
          className="relative w-full min-w-0 max-w-80 h-full flex flex-col border-r border-white/30 dark:border-white/15"
        >
          {/* Hide sidebar tab - on sidebar margin, extends out into canvas */}
          <button
            type="button"
            onClick={onClose}
            title="Hide sidebar"
            aria-label="Hide sidebar"
            className="absolute right-0 top-4 translate-x-full z-[60] cursor-pointer flex items-center justify-center p-2 rounded-r-xl border border-l-0 border-slate-200/80 dark:border-slate-600/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/90 hover:shadow-lg transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 pointer-events-auto"
          >
            <PanelLeftClose size={18} aria-hidden />
          </button>

          {/* Tabs - Segmented control, same width as block cards below */}
          <div className="px-4 pt-4 pb-2 shrink-0">
            <div
              role="radiogroup"
              aria-label="Sidebar panel"
              className={cn(
                "flex items-center p-1 gap-0.5 relative w-full min-w-0",
                getLiquidGlassSurfaceClassName({
                  variant: "toolbar",
                  intensity: "xl",
                  rounded: "2xl",
                  className: "flex w-full min-w-0",
                }),
              )}
            >
              {/* Sliding indicator - spring-like easing */}
              <motion.div
                className={cn(
                  "absolute left-1 top-1 h-9 rounded-xl pointer-events-none",
                  "w-[calc(50%-6px)]",
                  "bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/20 dark:via-primary-400/25 dark:to-accent-500/20",
                  "backdrop-blur-2xl",
                  "border border-white/30 dark:border-white/20",
                  "shadow-[0_8px_32px_rgba(59,130,246,0.2),0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]",
                  "dark:shadow-[0_8px_32px_rgba(59,130,246,0.15),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
                )}
                animate={{
                  x: activeTab === "layers" ? "calc(100% + 4px)" : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
              <button
                type="button"
                role="radio"
                aria-checked={activeTab === "blocks"}
                onClick={() => setActiveTab("blocks")}
                className={cn(
                  "relative z-10 flex-1 min-w-0 text-sm rounded-xl h-9 flex items-center justify-center gap-2 font-medium transition-colors duration-200",
                  activeTab === "blocks"
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100",
                )}
              >
                <Blocks size={14} />
                Blocks
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={activeTab === "layers"}
                onClick={() => setActiveTab("layers")}
                className={cn(
                  "relative z-10 flex-1 min-w-0 text-sm rounded-xl h-9 flex items-center justify-center gap-2 font-medium transition-colors duration-200",
                  activeTab === "layers"
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-500/10 hover:text-slate-900 dark:hover:text-slate-100",
                )}
              >
                <Layers size={14} />
                Layers
              </button>
            </div>
          </div>

          {/* Content - AnimatePresence for tab transitions */}
          <div className="flex-1 min-w-0 relative overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              {activeTab === "blocks" && renderBlocksTab()}
              {activeTab === "layers" && (
                <motion.div
                  key="layers"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4"
                >
                  {renderLayersTab()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LiquidGlassSurface>
      </div>
    </div>
  );
}
