"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/shared/button";
import { getKeyboardShortcut } from "@/lib/utils";
import {
  Copy,
  Trash2,
  Palette,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  X,
} from "lucide-react";

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
  hidden?: boolean;
}

interface CanvasFloatingToolbarProps {
  position: { x: number; y: number };
  selectedBlocks: string[];
  canvasBlocks: CanvasBlock[];
  onBlockUpdate: (id: string, updates: Partial<CanvasBlock>) => void;
  onClose: () => void;
  zoomLevel: number;
  panOffset: { x: number; y: number };
}

export function CanvasFloatingToolbar({
  position,
  selectedBlocks,
  canvasBlocks,
  onBlockUpdate,
  onClose,
  zoomLevel,
  panOffset,
}: CanvasFloatingToolbarProps) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const selectedBlocksData = canvasBlocks.filter((block) =>
    selectedBlocks.includes(block.id)
  );

  const hasMultipleBlocks = selectedBlocks.length > 1;
  const singleBlock =
    selectedBlocks.length === 1 ? selectedBlocksData[0] : null;

  // Auto-hide after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleDuplicate = () => {
    // Would be handled by parent component
    console.log("Duplicate blocks:", selectedBlocks);
    onClose();
  };

  const handleDelete = () => {
    // Would be handled by parent component
    console.log("Delete blocks:", selectedBlocks);
    onClose();
  };

  const handleToggleLock = () => {
    const areAllLocked = selectedBlocksData.every((block) => block.locked);
    selectedBlocks.forEach((blockId) => {
      onBlockUpdate(blockId, { locked: !areAllLocked });
    });
  };

  const handleToggleVisibility = () => {
    const areAllVisible = selectedBlocksData.every((block) => !block.hidden);
    selectedBlocks.forEach((blockId) => {
      onBlockUpdate(blockId, { hidden: areAllVisible });
    });
  };

  const handleColorChange = (color: string) => {
    selectedBlocks.forEach((blockId) => {
      onBlockUpdate(blockId, { color });
    });
    setColorPickerOpen(false);
  };

  const handleAlignLeft = () => {
    if (!hasMultipleBlocks) return;
    const leftmost = Math.min(...selectedBlocksData.map((block) => block.x));
    selectedBlocks.forEach((blockId) => {
      onBlockUpdate(blockId, { x: leftmost });
    });
  };

  const handleAlignCenter = () => {
    if (!hasMultipleBlocks) return;
    const leftmost = Math.min(...selectedBlocksData.map((block) => block.x));
    const rightmost = Math.max(
      ...selectedBlocksData.map((block) => block.x + block.width)
    );
    const center = leftmost + (rightmost - leftmost) / 2;

    selectedBlocks.forEach((blockId) => {
      const block = selectedBlocksData.find((b) => b.id === blockId);
      if (block) {
        onBlockUpdate(blockId, { x: center - block.width / 2 });
      }
    });
  };

  const handleAlignRight = () => {
    if (!hasMultipleBlocks) return;
    const rightmost = Math.max(
      ...selectedBlocksData.map((block) => block.x + block.width)
    );
    selectedBlocks.forEach((blockId) => {
      const block = selectedBlocksData.find((b) => b.id === blockId);
      if (block) {
        onBlockUpdate(blockId, { x: rightmost - block.width });
      }
    });
  };

  const handleBringForward = () => {
    // Z-index would be handled by parent component
    console.log("Bring forward:", selectedBlocks);
  };

  const handleSendBackward = () => {
    // Z-index would be handled by parent component
    console.log("Send backward:", selectedBlocks);
  };

  const QUICK_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#8b5cf6", // Purple
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#84cc16", // Lime
  ];

  // Calculate position accounting for zoom and pan
  const adjustedPosition = {
    x: position.x * zoomLevel + panOffset.x,
    y: position.y * zoomLevel + panOffset.y,
  };

  return (
    <div
      className="fixed z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2 flex items-center space-x-1"
      style={{
        left: Math.min(adjustedPosition.x, window.innerWidth - 400),
        top: Math.max(64, adjustedPosition.y - 60),
      }}
    >
      {/* Duplicate */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDuplicate}
        className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        title={`Duplicate (${getKeyboardShortcut("⌘D")})`}
      >
        <Copy size={14} />
      </Button>

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        title="Delete (⌫)"
      >
        <Trash2 size={14} />
      </Button>

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

      {/* Color Picker */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setColorPickerOpen(!colorPickerOpen)}
          className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          title="Change Color"
        >
          <Palette size={14} />
        </Button>

        {colorPickerOpen && (
          <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 shadow-lg">
            <div className="grid grid-cols-4 gap-1">
              {QUICK_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-6 h-6 rounded border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lock/Unlock */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleLock}
        className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        title={
          selectedBlocksData.every((block) => block.locked) ? "Unlock" : "Lock"
        }
      >
        {selectedBlocksData.every((block) => block.locked) ? (
          <Unlock size={14} />
        ) : (
          <Lock size={14} />
        )}
      </Button>

      {/* Show/Hide */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleVisibility}
        className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        title={
          selectedBlocksData.every((block) => !block.hidden) ? "Hide" : "Show"
        }
      >
        {selectedBlocksData.every((block) => !block.hidden) ? (
          <EyeOff size={14} />
        ) : (
          <Eye size={14} />
        )}
      </Button>

      {/* Alignment (only for multiple blocks) */}
      {hasMultipleBlocks && (
        <>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAlignLeft}
            className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            title="Align Left"
          >
            <AlignLeft size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAlignCenter}
            className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            title="Align Center"
          >
            <AlignCenter size={14} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAlignRight}
            className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            title="Align Right"
          >
            <AlignRight size={14} />
          </Button>
        </>
      )}

      {/* Layer Controls */}
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleBringForward}
        className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        title="Bring Forward"
      >
        <ArrowUp size={14} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleSendBackward}
        className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        title="Send Backward"
      >
        <ArrowDown size={14} />
      </Button>

      {/* Link (for single block) */}
      {!hasMultipleBlocks && singleBlock && (
        <>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Copy link to block
              const url = `${window.location.origin}${window.location.pathname}?block=${singleBlock.id}`;
              navigator.clipboard.writeText(url);
              onClose();
            }}
            className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            title="Copy Link to Block"
          >
            <Link2 size={14} />
          </Button>
        </>
      )}

      {/* Close */}
      <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
        title="Close (Esc)"
      >
        <X size={14} />
      </Button>

      {/* Selection Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 px-2">
        {selectedBlocks.length} selected
      </div>
    </div>
  );
}
