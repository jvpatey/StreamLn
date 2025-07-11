"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shared/button";
import { Badge } from "@/components/ui/shared/badge";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  MousePointer,
  Hand,
  Square,
  Type,
  Copy,
  Trash2,
  RotateCcw,
  Layers,
  Move,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Send,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shared/popover";

interface CanvasBlock {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  color?: string;
  title?: string;
  locked?: boolean;
}

interface CanvasToolbarProps {
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onGridToggle: () => void;
  onResetView: () => void;
  canvasBlocks: CanvasBlock[];
  selectedBlocks: string[];
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
}

export function CanvasToolbar({
  zoomLevel,
  onZoomChange,
  showGrid,
  onGridToggle,
  onResetView,
  canvasBlocks,
  selectedBlocks,
  onDeleteSelected,
  onDuplicateSelected,
}: CanvasToolbarProps) {
  const [tool, setTool] = useState<"select" | "pan" | "text" | "shape">(
    "select"
  );
  const [alignMenuOpen, setAlignMenuOpen] = useState(false);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);

  const hasSelection = selectedBlocks.length > 0;
  const multiSelection = selectedBlocks.length > 1;

  const zoomPercentage = Math.round(zoomLevel * 100);

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoomLevel + 0.1, 3));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoomLevel - 0.1, 0.1));
  };

  const handleFitToView = () => {
    if (canvasBlocks.length === 0) {
      onResetView();
      return;
    }

    // Calculate bounds of all blocks
    const bounds = canvasBlocks.reduce(
      (acc, block) => ({
        left: Math.min(acc.left, block.x),
        top: Math.min(acc.top, block.y),
        right: Math.max(acc.right, block.x + block.width),
        bottom: Math.max(acc.bottom, block.y + block.height),
      }),
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );

    // Calculate zoom to fit content with padding
    const padding = 100;
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight - 180; // Account for header and toolbar

    const contentWidth = bounds.right - bounds.left + padding * 2;
    const contentHeight = bounds.bottom - bounds.top + padding * 2;

    const scaleX = canvasWidth / contentWidth;
    const scaleY = canvasHeight / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 1);

    onZoomChange(newZoom);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="flex items-center space-x-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg">
        {/* Tools Section */}
        <div className="flex items-center space-x-1 pr-3 border-r border-slate-200 dark:border-slate-700">
          <Button
            variant={tool === "select" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTool("select")}
            className="h-8 w-8 p-0"
          >
            <MousePointer size={14} />
          </Button>
          <Button
            variant={tool === "pan" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTool("pan")}
            className="h-8 w-8 p-0"
          >
            <Hand size={14} />
          </Button>
          <Button
            variant={tool === "text" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTool("text")}
            className="h-8 w-8 p-0"
          >
            <Type size={14} />
          </Button>
          <Button
            variant={tool === "shape" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTool("shape")}
            className="h-8 w-8 p-0"
          >
            <Square size={14} />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 pr-3 border-r border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.1}
            className="h-8 w-8 p-0"
          >
            <ZoomOut size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="h-8 px-2 text-xs font-mono min-w-[3rem]"
          >
            {zoomPercentage}%
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="h-8 w-8 p-0"
          >
            <ZoomIn size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToView}
            className="h-8 w-8 p-0"
          >
            <Maximize2 size={14} />
          </Button>
        </div>

        {/* View Options */}
        <div className="flex items-center space-x-1 pr-3 border-r border-slate-200 dark:border-slate-700">
          <Button
            variant={showGrid ? "default" : "ghost"}
            size="sm"
            onClick={onGridToggle}
            className="h-8 w-8 p-0"
          >
            <Grid3x3 size={14} />
          </Button>
        </div>

        {/* Selection Actions */}
        {hasSelection && (
          <div className="flex items-center space-x-1 pr-3 border-r border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDuplicateSelected}
              className="h-8 w-8 p-0"
            >
              <Copy size={14} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteSelected}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <Trash2 size={14} />
            </Button>

            {/* Alignment Menu */}
            {multiSelection && (
              <Popover open={alignMenuOpen} onOpenChange={setAlignMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <AlignCenter size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-40 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
                  align="center"
                >
                  <div className="space-y-1">
                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <AlignLeft size={14} className="mr-2" />
                      Align Left
                    </button>
                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <AlignCenter size={14} className="mr-2" />
                      Align Center
                    </button>
                    <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                      <AlignRight size={14} className="mr-2" />
                      Align Right
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Layer Controls */}
            <Popover open={layerMenuOpen} onOpenChange={setLayerMenuOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Layers size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-44 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
                align="center"
              >
                <div className="space-y-1">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowUp size={14} className="mr-2" />
                    Bring to Front
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowDown size={14} className="mr-2" />
                    Send to Back
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <Send size={14} className="mr-2" />
                    Send Backward
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Selection Info */}
        {hasSelection && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {selectedBlocks.length} selected
            </Badge>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        {!hasSelection && (
          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span>⌘+/</span>
            <span>for shortcuts</span>
          </div>
        )}
      </div>
    </div>
  );
}
