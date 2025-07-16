"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import { Card } from "@/components/ui/shared/card";
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
  X,
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

  const renderBlocksTab = () => (
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
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Block Types */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Add Blocks
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {filteredBlockTypes.map((blockType) => {
            const IconComponent = blockType.icon;
            return (
              <Card
                key={blockType.type}
                className="p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 border border-slate-200 dark:border-slate-700 hover:border-primary/30"
                onClick={() => onAddBlock(blockType.type)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${blockType.color}20` }}
                  >
                    <IconComponent
                      size={16}
                      style={{ color: blockType.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {blockType.label}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {blockType.description}
                    </p>
                  </div>
                  <Plus size={14} className="text-slate-400" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
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
  );

  const renderLayersTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Canvas Layers
        </h3>
        <Badge variant="outline" className="text-xs">
          {canvasBlocks.length}
        </Badge>
      </div>

      {canvasBlocks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 dark:text-slate-500 text-sm mb-2">
            No blocks yet
          </div>
          <Button
            variant="outline"
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
                  className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
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

  const renderPropertiesTab = () => (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
        Properties
      </h3>

      {selectedBlock ? (
        <div className="space-y-4">
          {/* Block Info */}
          <Card className="p-3">
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
                  className="w-full px-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                    className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedBlock.color || "#3b82f6"}
                    onChange={(e) =>
                      onBlockUpdate(selectedBlock.id, { color: e.target.value })
                    }
                    className="flex-1 px-2 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Position & Size */}
          <Card className="p-3">
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
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                  className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
          </Card>

          {/* Block Type */}
          <Card className="p-3">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {selectedBlock.type}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Created {formatDate(selectedBlock.createdAt)}
              </span>
            </div>
          </Card>
        </div>
      ) : selectedBlocks.length > 1 ? (
        <div className="text-center py-8">
          <div className="text-slate-400 dark:text-slate-500 text-sm mb-2">
            Multiple blocks selected
          </div>
          <Badge variant="outline" className="text-xs">
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

  if (!isOpen) return null;

  return (
    <div
      className="w-80 h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-xl"
      style={{ boxShadow: "0 0 24px 0 #3b82f610, 0 0 0 2px #3b82f630" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Canvas Tools
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/60 dark:bg-slate-800/60 rounded-full shadow-md hover:shadow-lg lg:hidden"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/60 dark:border-slate-700/60 bg-transparent">
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
                className="w-full pl-10 pr-4 py-2 text-sm border-0 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                style={{ backdropFilter: "blur(6px)" }}
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
                    <Card
                      key={blockType.type}
                      className="p-3 cursor-pointer transition-all duration-200 border-0 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-md hover:shadow-xl hover:scale-105"
                      style={{
                        boxShadow: `0 0 0 2px ${blockType.color}30, 0 0 16px ${blockType.color}18`,
                        border: `1.5px solid ${blockType.color}30`,
                      }}
                      onClick={() => onAddBlock(blockType.type)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-xl shadow"
                          style={{
                            backgroundColor: `${blockType.color}22`,
                            boxShadow: `0 2px 8px ${blockType.color}22`,
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
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
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
    </div>
  );
}
