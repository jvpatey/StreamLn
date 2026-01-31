"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import {
  LiquidGlassSurface,
  getLiquidGlassSurfaceClassName,
} from "@/components/ui/shared/liquid-glass-surface";
import {
  FileText,
  Maximize2,
  Code2,
  Image,
  Link,
  Tag,
  Layers,
  Settings,
  Search,
  Plus,
  PanelLeftClose,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Palette,
  Type,
  Move,
} from "lucide-react";

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

interface CanvasSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (type: string, position?: { x: number; y: number }) => void;
  selectedBlocks: string[];
  canvasBlocks: CanvasBlock[];
  onBlockUpdate: (id: string, updates: Partial<CanvasBlock>) => void;
}

const BLOCK_TYPES = [
  {
    type: "note",
    label: "Note",
    description: "Rich text notes with markdown",
    icon: FileText,
    color: "#3b82f6",
  },
  {
    type: "task-board",
    label: "Task Board",
    description: "Kanban-style task management",
    icon: Maximize2,
    color: "#10b981",
  },
  {
    type: "code",
    label: "Code",
    description: "Code snippets with syntax highlighting",
    icon: Code2,
    color: "#8b5cf6",
  },
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
  {
    type: "tag",
    label: "Tag",
    description: "Labels and categories",
    icon: Tag,
    color: "#ef4444",
  },
];

export function CanvasSidebar({
  isOpen,
  onClose,
  onAddBlock,
  selectedBlocks,
  canvasBlocks,
  onBlockUpdate,
}: CanvasSidebarProps) {
  const [activeTab, setActiveTab] = useState<
    "blocks" | "layers" | "properties"
  >("blocks");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedBlock =
    selectedBlocks.length === 1
      ? canvasBlocks.find((block) => block.id === selectedBlocks[0])
      : null;

  const filteredBlockTypes = BLOCK_TYPES.filter(
    (blockType) =>
      blockType.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blockType.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const renderLayersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
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
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {canvasBlocks
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((block) => {
              const blockType = BLOCK_TYPES.find((t) => t.type === block.type);
              const IconComponent = blockType?.icon || FileText;
              const isSelected = selectedBlocks.includes(block.id);

              return (
                <div
                  key={block.id}
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

  const inputGlass =
    "border border-white/25 dark:border-white/15 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  const renderPropertiesTab = () => (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
        Properties
      </h3>

      {selectedBlock ? (
        <div className="space-y-4">
          {/* Block Info */}
          <LiquidGlassSurface
            variant="panel"
            intensity="md"
            rounded="xl"
            className="p-3"
          >
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Block Title
                </label>
                <input
                  type="text"
                  value={selectedBlock.title || ""}
                  onChange={(e) =>
                    onBlockUpdate(selectedBlock.id, { title: e.target.value })
                  }
                  className={`w-full px-2 py-1 text-sm ${inputGlass}`}
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                  Block Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={selectedBlock.color || "#3b82f6"}
                    onChange={(e) =>
                      onBlockUpdate(selectedBlock.id, { color: e.target.value })
                    }
                    className="w-8 h-8 rounded border border-white/25 dark:border-white/15 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedBlock.color || "#3b82f6"}
                    onChange={(e) =>
                      onBlockUpdate(selectedBlock.id, { color: e.target.value })
                    }
                    className={`flex-1 px-2 py-1 text-sm font-mono ${inputGlass}`}
                  />
                </div>
              </div>
            </div>
          </LiquidGlassSurface>

          {/* Position & Size */}
          <LiquidGlassSurface
            variant="panel"
            intensity="md"
            rounded="xl"
            className="p-3"
          >
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
              Position & Size
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  X
                </label>
                <input
                  type="number"
                  value={Math.round(selectedBlock.x)}
                  onChange={(e) =>
                    onBlockUpdate(selectedBlock.id, {
                      x: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full px-2 py-1 text-xs ${inputGlass}`}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  Y
                </label>
                <input
                  type="number"
                  value={Math.round(selectedBlock.y)}
                  onChange={(e) =>
                    onBlockUpdate(selectedBlock.id, {
                      y: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full px-2 py-1 text-xs ${inputGlass}`}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={selectedBlock.width}
                  onChange={(e) =>
                    onBlockUpdate(selectedBlock.id, {
                      width: parseInt(e.target.value) || 100,
                    })
                  }
                  className={`w-full px-2 py-1 text-xs ${inputGlass}`}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={selectedBlock.height}
                  onChange={(e) =>
                    onBlockUpdate(selectedBlock.id, {
                      height: parseInt(e.target.value) || 100,
                    })
                  }
                  className={`w-full px-2 py-1 text-xs ${inputGlass}`}
                />
              </div>
            </div>
          </LiquidGlassSurface>

          {/* Block Type */}
          <LiquidGlassSurface
            variant="panel"
            intensity="md"
            rounded="xl"
            className="p-3"
          >
            <div className="flex items-center space-x-2">
              <Badge variant="glass" className="text-xs">
                {selectedBlock.type}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Created {formatDate(selectedBlock.createdAt)}
              </span>
            </div>
          </LiquidGlassSurface>
        </div>
      ) : selectedBlocks.length > 1 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 dark:text-slate-500 text-sm mb-2">
            Multiple blocks selected
          </div>
          <Badge variant="glass" className="text-xs">
            {selectedBlocks.length} blocks
          </Badge>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-400 dark:text-slate-500 text-sm">
            Select a block to edit properties
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
        isOpen ? "w-80" : "w-0"
      }`}
    >
      <div className="w-80 h-full min-w-80">
        <LiquidGlassSurface
          variant="panel"
          intensity="xl"
          className="w-80 h-full flex flex-col border-r border-white/30 dark:border-white/15"
        >
          {/* Header */}
          <LiquidGlassSurface
            variant="panel"
            intensity="md"
            rounded="none"
            shadow={false}
            className="flex items-center justify-between p-4 border-b border-white/25 dark:border-white/10"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Canvas Tools
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              title="Hide sidebar"
              aria-label="Hide sidebar"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <PanelLeftClose size={16} />
            </Button>
          </LiquidGlassSurface>

          {/* Tabs */}
          <div className="flex border-b border-white/20 dark:border-white/10 bg-transparent">
            <button
              onClick={() => setActiveTab("blocks")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-t-xl
            ${
              activeTab === "blocks"
                ? "text-primary bg-primary/10 border-b-2 border-primary shadow-none"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-b-2 border-transparent"
            }
          `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus size={14} />
                <span>Blocks</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("layers")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-t-xl
            ${
              activeTab === "layers"
                ? "text-primary bg-primary/10 border-b-2 border-primary shadow-none"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-b-2 border-transparent"
            }
          `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Layers size={14} />
                <span>Layers</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors rounded-t-xl
            ${
              activeTab === "properties"
                ? "text-primary bg-primary/10 border-b-2 border-primary shadow-none"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-b-2 border-transparent"
            }
          `}
            >
              <div className="flex items-center justify-center space-x-2">
                <Settings size={14} />
                <span>Props</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === "blocks" && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-white/25 dark:border-white/15 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Block Types */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Add Blocks
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredBlockTypes.map((blockType) => {
                      const IconComponent = blockType.icon;
                      return (
                        <div
                          key={blockType.type}
                          className={getLiquidGlassSurfaceClassName({
                            variant: "panel",
                            intensity: "md",
                            rounded: "2xl",
                            className:
                              "p-3 cursor-pointer transition-all duration-200 hover:scale-105 border-l-4 hover:border-white/40 dark:hover:border-white/30",
                          })}
                          style={{ borderLeftColor: blockType.color }}
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
                          <div className="flex items-center space-x-3">
                            <div
                              className="p-2 rounded-xl"
                              style={{
                                backgroundColor: `${blockType.color}22`,
                              }}
                            >
                              <IconComponent
                                size={18}
                                style={{ color: blockType.color }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                {blockType.label}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {blockType.description}
                              </p>
                            </div>
                            <Plus size={16} className="text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-white/20 dark:border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {canvasBlocks.length}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Total Blocks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {selectedBlocks.length}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Selected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "layers" && renderLayersTab()}
            {activeTab === "properties" && renderPropertiesTab()}
          </div>
        </LiquidGlassSurface>
      </div>
    </div>
  );
}
