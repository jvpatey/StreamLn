"use client";

import { forwardRef, useState, useRef, useEffect, useCallback } from "react";
import { CanvasBlock } from "./canvas-block";

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
}

interface CanvasWorkspaceProps {
  blocks: CanvasBlock[];
  selectedBlocks: string[];
  onBlockSelect: (blockIds: string[]) => void;
  onBlockUpdate: (id: string, updates: Partial<CanvasBlock>) => void;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  onPanOffsetChange: (offset: { x: number; y: number }) => void;
  showGrid: boolean;
  isDragging: boolean;
  onDraggingChange: (dragging: boolean) => void;
  isResizing: boolean;
  onResizingChange: (resizing: boolean) => void;
  isAddingBlock: string | null;
  onAddBlock: (type: string, position: { x: number; y: number }) => void;
  onFloatingToolbarShow: (position: { x: number; y: number }) => void;
  viewMode: "edit" | "present";
}

export const CanvasWorkspace = forwardRef<HTMLDivElement, CanvasWorkspaceProps>(
  (
    {
      blocks,
      selectedBlocks,
      onBlockSelect,
      onBlockUpdate,
      zoomLevel,
      panOffset,
      onPanOffsetChange,
      showGrid,
      isDragging,
      onDraggingChange,
      isResizing,
      onResizingChange,
      isAddingBlock,
      onAddBlock,
      onFloatingToolbarShow,
      viewMode,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [selectionBox, setSelectionBox] = useState<{
      start: { x: number; y: number };
      end: { x: number; y: number };
    } | null>(null);

    // Handle mouse events for panning and selection
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - panOffset.x) / zoomLevel;
        const y = (e.clientY - rect.top - panOffset.y) / zoomLevel;

        // Check if clicking on a block
        const clickedBlock = blocks.find(
          (block) =>
            x >= block.x &&
            x <= block.x + block.width &&
            y >= block.y &&
            y <= block.y + block.height
        );

        if (isAddingBlock) {
          // Add new block at clicked position
          onAddBlock(isAddingBlock, { x, y });
          return;
        }

        if (clickedBlock) {
          // Handle block selection
          if (e.metaKey || e.ctrlKey) {
            // Multi-select
            if (selectedBlocks.includes(clickedBlock.id)) {
              onBlockSelect(
                selectedBlocks.filter((id) => id !== clickedBlock.id)
              );
            } else {
              onBlockSelect([...selectedBlocks, clickedBlock.id]);
            }
          } else if (!selectedBlocks.includes(clickedBlock.id)) {
            onBlockSelect([clickedBlock.id]);
          }
        } else {
          // Start panning or selection box
          if (e.metaKey || e.ctrlKey || e.button === 1) {
            // Pan mode
            setIsPanning(true);
            setPanStart({
              x: e.clientX - panOffset.x,
              y: e.clientY - panOffset.y,
            });
          } else {
            // Selection box mode
            setSelectionBox({
              start: { x, y },
              end: { x, y },
            });
            onBlockSelect([]);
          }
        }
      },
      [
        blocks,
        selectedBlocks,
        onBlockSelect,
        panOffset,
        zoomLevel,
        isAddingBlock,
        onAddBlock,
      ]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (isPanning) {
          onPanOffsetChange({
            x: e.clientX - panStart.x,
            y: e.clientY - panStart.y,
          });
        } else if (selectionBox) {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = (e.clientX - rect.left - panOffset.x) / zoomLevel;
          const y = (e.clientY - rect.top - panOffset.y) / zoomLevel;

          setSelectionBox({
            ...selectionBox,
            end: { x, y },
          });

          // Find blocks within selection box
          const minX = Math.min(selectionBox.start.x, x);
          const maxX = Math.max(selectionBox.start.x, x);
          const minY = Math.min(selectionBox.start.y, y);
          const maxY = Math.max(selectionBox.start.y, y);

          const selectedBlockIds = blocks
            .filter((block) => {
              const blockCenterX = block.x + block.width / 2;
              const blockCenterY = block.y + block.height / 2;
              return (
                blockCenterX >= minX &&
                blockCenterX <= maxX &&
                blockCenterY >= minY &&
                blockCenterY <= maxY
              );
            })
            .map((block) => block.id);

          onBlockSelect(selectedBlockIds);
        }
      },
      [
        isPanning,
        panStart,
        selectionBox,
        onPanOffsetChange,
        blocks,
        onBlockSelect,
        panOffset,
        zoomLevel,
      ]
    );

    const handleMouseUp = useCallback(() => {
      setIsPanning(false);
      setSelectionBox(null);
    }, []);

    // Handle wheel zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        // Zoom behavior would be handled by parent component
      }
    }, []);

    // Double-click to add note
    const handleDoubleClick = useCallback(
      (e: React.MouseEvent) => {
        if (viewMode === "present") return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left - panOffset.x) / zoomLevel;
        const y = (e.clientY - rect.top - panOffset.y) / zoomLevel;

        // Check if double-clicking on empty space
        const clickedBlock = blocks.find(
          (block) =>
            x >= block.x &&
            x <= block.x + block.width &&
            y >= block.y &&
            y <= block.y + block.height
        );

        if (!clickedBlock) {
          onAddBlock("note", { x: x - 150, y: y - 100 }); // Center the new note
        }
      },
      [blocks, onAddBlock, panOffset, zoomLevel, viewMode]
    );

    // Grid pattern
    const gridSize = 20 * zoomLevel;
    const gridOffsetX = panOffset.x % gridSize;
    const gridOffsetY = panOffset.y % gridSize;

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (ref) {
            if (typeof ref === "function") ref(node);
            else ref.current = node;
          }
        }}
        className="relative w-full h-full overflow-hidden cursor-crosshair select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{
          background: showGrid
            ? `
              radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)
            `
            : undefined,
          backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : undefined,
          backgroundPosition: showGrid
            ? `${gridOffsetX}px ${gridOffsetY}px`
            : undefined,
        }}
      >
        {/* Canvas Content */}
        <div
          className="relative origin-top-left transition-transform duration-75"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
        >
          {/* Canvas Blocks */}
          {blocks.map((block) => (
            <CanvasBlock
              key={block.id}
              block={block}
              isSelected={selectedBlocks.includes(block.id)}
              isEditable={viewMode === "edit"}
              onUpdate={(updates) => onBlockUpdate(block.id, updates)}
              onSelect={() => {
                if (!selectedBlocks.includes(block.id)) {
                  onBlockSelect([block.id]);
                }
              }}
              onDragStart={() => onDraggingChange(true)}
              onDragEnd={() => onDraggingChange(false)}
              onResizeStart={() => onResizingChange(true)}
              onResizeEnd={() => onResizingChange(false)}
              onContextMenu={(position) => {
                onBlockSelect([block.id]);
                onFloatingToolbarShow(position);
              }}
            />
          ))}

          {/* Selection Box */}
          {selectionBox && (
            <div
              className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
              style={{
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                height: Math.abs(selectionBox.end.y - selectionBox.start.y),
              }}
            />
          )}

          {/* Canvas Origin Indicator */}
          <div
            className="absolute w-4 h-4 border-2 border-slate-400 dark:border-slate-600 rounded-full bg-white dark:bg-slate-800 pointer-events-none opacity-30"
            style={{ left: -8, top: -8 }}
          />
        </div>

        {/* Adding Block Indicator */}
        {isAddingBlock && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none flex items-center justify-center">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click anywhere to add a {isAddingBlock} block
              </p>
            </div>
          </div>
        )}

        {/* Instructions for empty canvas */}
        {blocks.length === 0 && !isAddingBlock && viewMode === "edit" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-6 shadow-lg max-w-md">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Welcome to your Canvas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Start building your project workspace by adding blocks
                </p>
                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-500">
                  <p>• Double-click to add a note</p>
                  <p>• Use the sidebar to add different block types</p>
                  <p>• Drag blocks to rearrange them</p>
                  <p>• Hold ⌘ to pan around</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Present Mode Overlay */}
        {viewMode === "present" && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm">
            Presentation Mode • Press E to edit
          </div>
        )}
      </div>
    );
  }
);
