"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/shared/button";
import { getKeyboardShortcut } from "@/lib/utils";
import {
  LiquidGlassSurface,
  getLiquidGlassSurfaceClassName,
} from "@/components/ui/shared/liquid-glass-surface";
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
  Type,
} from "lucide-react";
import { getTextContent } from "./blocks/text-defaults";

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
  const [textColorPickerOpen, setTextColorPickerOpen] = useState(false);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

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

  const TEXT_FONTS = [
    { label: "System", value: "system-ui" },
    { label: "Inter", value: "Inter, system-ui, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Mono", value: "ui-monospace, monospace" },
  ];

  const TEXT_SIZES = [12, 14, 16, 18, 24];

  const isSingleTextBlock = singleBlock?.type === "text";

  const updateTextBlockContent = (
    blockId: string,
    updates: Partial<{
      text: string;
      fontFamily: string;
      fontSize: number;
      color: string;
      textAlign: "left" | "center" | "right";
    }>
  ) => {
    const block = canvasBlocks.find((b) => b.id === blockId);
    if (!block || block.type !== "text") return;
    const content = getTextContent(block.content);
    onBlockUpdate(blockId, {
      content: { ...content, ...updates },
    });
  };

  const handleTextFontChange = (fontFamily: string) => {
    if (!singleBlock || singleBlock.type !== "text") return;
    updateTextBlockContent(singleBlock.id, { fontFamily });
    setFontDropdownOpen(false);
  };

  const handleTextSizeChange = (fontSize: number) => {
    if (!singleBlock || singleBlock.type !== "text") return;
    updateTextBlockContent(singleBlock.id, { fontSize });
  };

  const handleTextColorChange = (color: string) => {
    selectedBlocks.forEach((blockId) => {
      const block = canvasBlocks.find((b) => b.id === blockId);
      if (block?.type === "text") {
        updateTextBlockContent(blockId, { color });
      }
    });
    setTextColorPickerOpen(false);
  };

  const handleTextAlignChange = (textAlign: "left" | "center" | "right") => {
    if (!singleBlock || singleBlock.type !== "text") return;
    updateTextBlockContent(singleBlock.id, { textAlign });
  };

  // Position is in viewport (client) coordinates; use directly for fixed positioning
  const toolbarTop = Math.max(64, position.y - 60);
  const toolbarLeft = Math.min(
    Math.max(8, position.x - 120),
    window.innerWidth - 400
  );

  return (
    <LiquidGlassSurface
      variant="toolbar"
      intensity="xl"
      rounded="xl"
      className="fixed z-50 p-2 flex items-center space-x-1"
      style={{
        left: toolbarLeft,
        top: toolbarTop,
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
          <div
            className={getLiquidGlassSurfaceClassName({
              variant: "popover",
              intensity: "xl",
              rounded: "lg",
              className: "absolute bottom-full mb-2 left-0 p-2",
            })}
          >
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

      {/* Text formatting (single text block) */}
      {isSingleTextBlock &&
        singleBlock &&
        (() => {
          const textContent = getTextContent(singleBlock.content);
          return (
            <>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
              <span className="text-xs text-slate-500 dark:text-slate-400 px-0.5">
                Text
              </span>
              {/* Font */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFontDropdownOpen(!fontDropdownOpen);
                    setTextColorPickerOpen(false);
                  }}
                  className="h-8 px-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 min-w-[4rem]"
                  title="Font"
                >
                  {TEXT_FONTS.find((f) => f.value === textContent.fontFamily)
                    ?.label ?? "Font"}
                </Button>
                {fontDropdownOpen && (
                  <div
                    className={getLiquidGlassSurfaceClassName({
                      variant: "popover",
                      intensity: "xl",
                      rounded: "lg",
                      className:
                        "absolute bottom-full mb-1 left-0 py-1 min-w-[7rem]",
                    })}
                  >
                    {TEXT_FONTS.map((f) => (
                      <button
                        key={f.value}
                        onClick={() => handleTextFontChange(f.value)}
                        className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Size */}
              <div className="flex items-center gap-0.5">
                {TEXT_SIZES.map((size) => (
                  <Button
                    key={size}
                    variant={
                      textContent.fontSize === size ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => handleTextSizeChange(size)}
                    className={`h-8 w-8 p-0 text-xs ${
                      textContent.fontSize === size
                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                    title={`${size}px`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {/* Text color */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTextColorPickerOpen(!textColorPickerOpen);
                    setFontDropdownOpen(false);
                  }}
                  className="h-8 w-8 p-0"
                  title="Text color"
                >
                  <Type
                    size={14}
                    className="text-slate-600 dark:text-slate-400"
                  />
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        textContent.color ?? "hsl(var(--foreground))",
                    }}
                  />
                </Button>
                {textColorPickerOpen && (
                  <div
                    className={getLiquidGlassSurfaceClassName({
                      variant: "popover",
                      intensity: "xl",
                      rounded: "lg",
                      className:
                        "absolute bottom-full left-0 z-50 mb-2 w-[7rem] p-2",
                    })}
                  >
                    <div className="grid grid-cols-4 grid-rows-2 gap-1">
                      {QUICK_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleTextColorChange(color)}
                          className="h-6 w-6 shrink-0 rounded border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Text alignment */}
              <Button
                variant={textContent.textAlign === "left" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTextAlignChange("left")}
                className={`h-8 w-8 p-0 ${
                  textContent.textAlign === "left"
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                title="Align text left"
              >
                <AlignLeft size={14} />
              </Button>
              <Button
                variant={
                  textContent.textAlign === "center" ? "default" : "ghost"
                }
                size="sm"
                onClick={() => handleTextAlignChange("center")}
                className={`h-8 w-8 p-0 ${
                  textContent.textAlign === "center"
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                title="Align text center"
              >
                <AlignCenter size={14} />
              </Button>
              <Button
                variant={
                  textContent.textAlign === "right" ? "default" : "ghost"
                }
                size="sm"
                onClick={() => handleTextAlignChange("right")}
                className={`h-8 w-8 p-0 ${
                  textContent.textAlign === "right"
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                title="Align text right"
              >
                <AlignRight size={14} />
              </Button>
            </>
          );
        })()}

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
    </LiquidGlassSurface>
  );
}
