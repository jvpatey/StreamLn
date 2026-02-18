"use client";

import { forwardRef, useMemo } from "react";
import { CanvasWorkspace } from "./canvas-workspace";
import { toCanvasBlock } from "@/lib/export/export-utils";
import type { ExportCanvasWithBlocks } from "@/lib/export/export-utils";

const CONTAINER_WIDTH = 1400;
const CONTAINER_HEIGHT = 900;
const PADDING = 100;

interface CanvasExportRendererProps {
  blocks: ExportCanvasWithBlocks["blocks"];
  canvasName: string;
}

/**
 * Renders a canvas for off-screen export capture.
 * Uses fixed dimensions and fit-to-view zoom/pan so content is consistently framed.
 */
export const CanvasExportRenderer = forwardRef<
  HTMLDivElement,
  CanvasExportRendererProps
>(function CanvasExportRenderer({ blocks, canvasName }, ref) {
  const canvasBlocks = useMemo(
    () => blocks.map((b) => toCanvasBlock(b)),
    [blocks]
  );

  const { zoomLevel, panOffset } = useMemo(() => {
    if (canvasBlocks.length === 0) {
      return { zoomLevel: 1, panOffset: { x: 0, y: 0 } };
    }
    const bounds = canvasBlocks.reduce(
      (acc, block) => ({
        left: Math.min(acc.left, block.x),
        top: Math.min(acc.top, block.y),
        right: Math.max(acc.right, block.x + block.width),
        bottom: Math.max(acc.bottom, block.y + block.height),
      }),
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const contentWidth = bounds.right - bounds.left + PADDING * 2;
    const contentHeight = bounds.bottom - bounds.top + PADDING * 2;
    const scaleX = CONTAINER_WIDTH / contentWidth;
    const scaleY = CONTAINER_HEIGHT / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 1);
    const centerX = (bounds.left + bounds.right) / 2;
    const centerY = (bounds.top + bounds.bottom) / 2;
    return {
      zoomLevel: newZoom,
      panOffset: {
        x: CONTAINER_WIDTH / 2 - centerX * newZoom,
        y: CONTAINER_HEIGHT / 2 - centerY * newZoom,
      },
    };
  }, [canvasBlocks]);

  const noop = () => {};

  return (
    <div
      ref={ref}
      style={{
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        overflow: "hidden",
        position: "relative",
      }}
      className="bg-white dark:bg-slate-900"
    >
      <CanvasWorkspace
        activeTool="select"
        blocks={canvasBlocks}
        canvasName={canvasName}
        selectedBlocks={[]}
        onBlockSelect={noop}
        onBlockUpdate={noop}
        zoomLevel={zoomLevel}
        panOffset={panOffset}
        onZoomChange={noop}
        onPanOffsetChange={noop}
        showGrid={true}
        isDragging={false}
        onDraggingChange={noop}
        isResizing={false}
        onResizingChange={noop}
        isAddingBlock={null}
        onAddBlock={noop}
        onFloatingToolbarShow={noop}
        viewMode={canvasBlocks.length === 0 ? "edit" : "present"}
      />
    </div>
  );
});
