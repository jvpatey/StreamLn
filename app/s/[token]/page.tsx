"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CanvasWorkspace } from "@/components/ui/projects/canvas/canvas-workspace";
import { fetchSharedCanvas } from "@/lib/api/share";
import type { CanvasBlock } from "@/lib/types/canvas";

interface SharedBlock {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: unknown;
  color?: string | null;
  title?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function toCanvasBlock(b: SharedBlock): CanvasBlock {
  return {
    id: b.id,
    type: b.type as CanvasBlock["type"],
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    content: b.content,
    color: b.color ?? undefined,
    title: b.title ?? undefined,
    createdAt: new Date(b.createdAt),
    updatedAt: new Date(b.updatedAt),
  };
}

export default function SharedCanvasPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token ?? null;
  const [projectName, setProjectName] = useState<string>("");
  const [canvasName, setCanvasName] = useState<string>("");
  const [blocks, setBlocks] = useState<CanvasBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchSharedCanvas(token)
      .then((data) => {
        if (cancelled) return;
        setProjectName(data.projectName);
        setCanvasName(data.canvasName);
        setBlocks(data.blocks.map(toCanvasBlock));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleFitToView = useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || blocks.length === 0) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      return;
    }
    const viewportWidth = rect.width;
    const viewportHeight = rect.height;
    const bounds = blocks.reduce(
      (acc, block) => ({
        left: Math.min(acc.left, block.x),
        top: Math.min(acc.top, block.y),
        right: Math.max(acc.right, block.x + block.width),
        bottom: Math.max(acc.bottom, block.y + block.height),
      }),
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const padding = 100;
    const contentWidth = bounds.right - bounds.left + padding * 2;
    const contentHeight = bounds.bottom - bounds.top + padding * 2;
    const scaleX = viewportWidth / contentWidth;
    const scaleY = viewportHeight / contentHeight;
    const newZoom = Math.min(scaleX, scaleY, 1);
    const centerX = (bounds.left + bounds.right) / 2;
    const centerY = (bounds.top + bounds.bottom) / 2;
    setZoomLevel(newZoom);
    setPanOffset({
      x: viewportWidth / 2 - centerX * newZoom,
      y: viewportHeight / 2 - centerY * newZoom,
    });
  }, [blocks]);

  useEffect(() => {
    if (!loading && blocks.length > 0) {
      handleFitToView();
    }
  }, [loading, blocks.length, handleFitToView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 dark:text-slate-400">
          Loading shared canvas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Link expired or invalid
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get started with StreamLn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Minimal header */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors shrink-0"
          >
            StreamLn
          </Link>
          <span className="text-slate-400 dark:text-slate-500">/</span>
          <span className="truncate text-sm text-slate-900 dark:text-slate-100">
            {projectName} · {canvasName}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
          View only
        </span>
      </header>

      <div className="h-[calc(100vh-56px)] relative">
        <CanvasWorkspace
          ref={canvasRef}
          activeTool="pan"
          blocks={blocks}
          canvasName={canvasName}
          selectedBlocks={selectedBlocks}
          onBlockSelect={setSelectedBlocks}
          onBlockUpdate={() => {}}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          onZoomChange={setZoomLevel}
          onPanOffsetChange={setPanOffset}
          showGrid={true}
          isDragging={false}
          onDraggingChange={() => {}}
          isResizing={false}
          onResizingChange={() => {}}
          isAddingBlock={null}
          onAddBlock={() => {}}
          onFloatingToolbarShow={() => {}}
          viewMode="present"
          showPresentModeBadge={false}
        />
      </div>
    </div>
  );
}
