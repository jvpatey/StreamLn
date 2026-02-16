"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CanvasToolbar,
  type CanvasTool,
} from "@/components/ui/projects/canvas/canvas-toolbar";
import { CanvasWorkspace } from "@/components/ui/projects/canvas/canvas-workspace";
import { CanvasSidebar } from "@/components/ui/projects/canvas/canvas-sidebar";
import { CanvasFloatingToolbar } from "@/components/ui/projects/canvas/canvas-floating-toolbar";
import { CanvasHeader } from "@/components/ui/projects/canvas/canvas-header";
import { DEFAULT_NOTE_CONTENT } from "@/components/ui/projects/canvas/blocks/note-defaults";
import { DEFAULT_LINK_CONTENT } from "@/components/ui/projects/canvas/blocks/link-defaults";
import { DEFAULT_TAG_CONTENT } from "@/components/ui/projects/canvas/blocks/tag-defaults";
import { getDefaultTaskBoardContent } from "@/components/ui/projects/canvas/blocks/task-board-defaults";
import { DEFAULT_CODE_CONTENT } from "@/components/ui/projects/canvas/blocks/code-defaults";
import { DEFAULT_TEXT_CONTENT } from "@/components/ui/projects/canvas/blocks/text-defaults";
import {
  DEFAULT_SHAPE_CONTENT,
  type ShapeKind,
} from "@/components/ui/projects/canvas/blocks/shape-defaults";
import {
  fetchCanvasBlocks,
  saveCanvasBlocks,
  fetchCanvases,
  createCanvas,
  updateCanvas,
  deleteCanvas,
} from "@/lib/api/canvas";
import type { CanvasBlock } from "@/lib/types/canvas";
import type { Canvas } from "@/lib/types/canvas";
import { PanelLeftOpen, PanelTopOpen } from "lucide-react";
import { motion } from "framer-motion";

function CanvasToolbarShowTab({ onShow }: { onShow: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onShow}
      title="Show toolbar"
      aria-label="Show toolbar"
      className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center p-2 rounded-b-xl border border-t-0 border-slate-200/80 dark:border-slate-600/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/90 hover:shadow-lg transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
      initial={{ opacity: 0, scale: 0.8, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <PanelTopOpen size={18} aria-hidden />
    </motion.button>
  );
}

interface Project {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

function generateBlockId(type: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${type}-${crypto.randomUUID()}`;
  }
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ProjectCanvasPage() {
  const { id: projectId, canvasId } = useParams();
  const router = useRouter();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Canvas state
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Canvas view state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [isToolbarExiting, setIsToolbarExiting] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "present">("edit");

  // Canvas tool state (select vs pan)
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");

  // Canvas interaction state
  const [isAddingBlock, setIsAddingBlock] = useState<string | null>(null);
  const [addingShapeKind, setAddingShapeKind] = useState<ShapeKind>("rectangle");
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({
    x: 0,
    y: 0,
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const skipNextSaveRef = useRef(true);
  const lastSavedAtRef = useRef<string | null>(null);
  const [saveConflict, setSaveConflict] = useState(false);

  const handleFitToView = useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || canvasBlocks.length === 0) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      return;
    }
    const viewportWidth = rect.width;
    const viewportHeight = rect.height;
    const bounds = canvasBlocks.reduce(
      (acc, block) => ({
        left: Math.min(acc.left, block.x),
        top: Math.min(acc.top, block.y),
        right: Math.max(acc.right, block.x + block.width),
        bottom: Math.max(acc.bottom, block.y + block.height),
      }),
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
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
  }, [canvasBlocks]);

  // Load project, canvas, and blocks
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || typeof projectId !== "string" || !canvasId || typeof canvasId !== "string") return;

      setLoading(true);
      setError(null);
      skipNextSaveRef.current = true;

      try {
        const [projectRes, canvasesRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch(`/api/projects/${projectId}/canvases`),
        ]);
        if (!projectRes.ok) throw new Error("Project not found");
        const projectData = await projectRes.json();
        setProject(projectData);

        const canvasesData = await canvasesRes.json();
        const canvasesList = canvasesData.canvases ?? [];
        setCanvases(canvasesList);

        const currentCanvas = canvasesList.find((c: Canvas) => c.id === canvasId);
        if (!currentCanvas) throw new Error("Canvas not found");
        setCanvas(currentCanvas);
        lastSavedAtRef.current = currentCanvas.updatedAt ?? null;
        setSaveConflict(false);

        const blocks = await fetchCanvasBlocks(projectId, canvasId);
        setCanvasBlocks(blocks);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load project");
        setCanvasBlocks([]);
      } finally {
        setLoading(false);
        setTimeout(() => {
          skipNextSaveRef.current = false;
        }, 0);
      }
    };

    loadProject();
  }, [projectId, canvasId]);

  // Debounced save (1.5s after last change)
  useEffect(() => {
    if (!projectId || typeof projectId !== "string" || !canvasId || typeof canvasId !== "string") return;
    if (skipNextSaveRef.current) return;

    const timeout = setTimeout(async () => {
      const result = await saveCanvasBlocks(
        projectId,
        canvasId,
        canvasBlocks,
        lastSavedAtRef.current ?? undefined
      );
      if (result.ok) {
        lastSavedAtRef.current = result.updatedAt;
        setSaveConflict(false);
      } else if ("conflict" in result && result.conflict) {
        setSaveConflict(true);
      } else {
        setError("Failed to save canvas");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [projectId, canvasId, canvasBlocks]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "=":
          case "+":
            e.preventDefault();
            setZoomLevel((prev) => Math.min(prev + 0.1, 3));
            break;
          case "-":
            e.preventDefault();
            setZoomLevel((prev) => Math.max(prev - 0.1, 0.1));
            break;
          case "0":
            e.preventDefault();
            setZoomLevel(1);
            setPanOffset({ x: 0, y: 0 });
            break;
          case "d":
            e.preventDefault();
            if (selectedBlocks.length > 0) {
              duplicateBlocks();
            }
            break;
          case "Backspace":
          case "Delete":
            e.preventDefault();
            if (selectedBlocks.length > 0) {
              deleteSelectedBlocks();
            }
            break;
          case "a":
            e.preventDefault();
            setSelectedBlocks(canvasBlocks.map((block) => block.id));
            break;
        }
      }

      if (e.key === "Escape") {
        setSelectedBlocks([]);
        setIsAddingBlock(null);
        setShowFloatingToolbar(false);
        setActiveTool("select");
      }

      const target = e.target as HTMLElement;
      if (
        !target.closest("input") &&
        !target.closest("textarea") &&
        !target.closest("[contenteditable]")
      ) {
        if (e.key === "v" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setActiveTool("select");
        } else if (e.key === "h" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setActiveTool("pan");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlocks, canvasBlocks]);

  // When a single text or shape block is selected, show floating toolbar above it
  useEffect(() => {
    if (selectedBlocks.length === 0) {
      setShowFloatingToolbar(false);
      return;
    }
    if (selectedBlocks.length !== 1) return;

    const block = canvasBlocks.find((b) => b.id === selectedBlocks[0]);
    if (!block || (block.type !== "text" && block.type !== "shape")) return;

    const el = canvasRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX =
      rect.left +
      panOffset.x +
      block.x * zoomLevel +
      (block.width * zoomLevel) / 2;
    const topY = rect.top + panOffset.y + block.y * zoomLevel;
    setFloatingToolbarPosition({
      x: centerX - 120,
      y: Math.max(64, topY - 56),
    });
    setShowFloatingToolbar(true);
  }, [selectedBlocks, canvasBlocks, panOffset, zoomLevel]);

  const addBlock = (type: string, position: { x: number; y: number }) => {
    const shapeKind = type === "shape" ? addingShapeKind : "rectangle";
    const isLineOrArrow =
      type === "shape" &&
      (shapeKind === "line" || shapeKind === "arrow");

    const newBlock: CanvasBlock = {
      id: generateBlockId(type),
      type: type as CanvasBlock["type"],
      x: position.x,
      y: position.y,
      width:
        type === "note"
          ? 300
          : type === "task-board"
            ? 480
            : type === "link"
              ? 320
              : type === "tag"
                ? 240
                : type === "text"
                  ? 220
                  : type === "shape"
                    ? isLineOrArrow
                      ? 150
                      : 120
                    : 350,
      height:
        type === "note"
          ? 200
          : type === "task-board"
            ? 320
            : type === "link"
              ? 180
              : type === "tag"
                ? 56
                : type === "text"
                  ? 80
                  : type === "shape"
                    ? isLineOrArrow
                      ? 24
                      : 80
                    : 250,
      content:
        type === "shape"
          ? { ...DEFAULT_SHAPE_CONTENT, shapeKind }
          : getDefaultContent(type),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      color: getDefaultColor(type),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCanvasBlocks((prev) => [...prev, newBlock]);
    setSelectedBlocks([newBlock.id]);
    setIsAddingBlock(null);
    if (type === "text" || type === "shape") {
      setActiveTool("select");
    }
  };

  const updateBlock = (id: string, updates: Partial<CanvasBlock>) => {
    setCanvasBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (!block) return prev;

      const hasPositionChange = "x" in updates || "y" in updates;
      const isMultiSelect =
        selectedBlocks.length > 1 && selectedBlocks.includes(id);

      if (hasPositionChange && isMultiSelect) {
        const newX = (updates.x ?? block.x) as number;
        const newY = (updates.y ?? block.y) as number;
        const deltaX = newX - block.x;
        const deltaY = newY - block.y;
        return prev.map((b) => {
          if (selectedBlocks.includes(b.id)) {
            return {
              ...b,
              x: b.x + deltaX,
              y: b.y + deltaY,
              updatedAt: new Date(),
            };
          }
          return b;
        });
      }

      return prev.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b,
      );
    });
  };

  const deleteSelectedBlocks = () => {
    setCanvasBlocks((prev) =>
      prev.filter((block) => !selectedBlocks.includes(block.id)),
    );
    setSelectedBlocks([]);
  };

  const duplicateBlocks = () => {
    const blocksToClone = canvasBlocks.filter((block) =>
      selectedBlocks.includes(block.id),
    );

    const clonedBlocks = blocksToClone.map((block) => ({
      ...block,
      id: generateBlockId(block.type),
      x: block.x + 20,
      y: block.y + 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setCanvasBlocks((prev) => [...prev, ...clonedBlocks]);
    setSelectedBlocks(clonedBlocks.map((block) => block.id));
  };

  const deleteBlock = (id: string) => {
    setCanvasBlocks((prev) => prev.filter((block) => block.id !== id));
    setSelectedBlocks((prev) => prev.filter((blockId) => blockId !== id));
  };

  const duplicateBlock = (id: string) => {
    const block = canvasBlocks.find((b) => b.id === id);
    if (!block) return;
    const cloned = {
      ...block,
      id: generateBlockId(block.type),
      x: block.x + 20,
      y: block.y + 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCanvasBlocks((prev) => [...prev, cloned]);
    setSelectedBlocks([cloned.id]);
  };

  const getDefaultContent = (type: string) => {
    if (type === "note") return DEFAULT_NOTE_CONTENT;
    if (type === "link") return DEFAULT_LINK_CONTENT;
    if (type === "tag") return DEFAULT_TAG_CONTENT;
    if (type === "task-board") return getDefaultTaskBoardContent();
    if (type === "code") return DEFAULT_CODE_CONTENT;
    if (type === "text") return DEFAULT_TEXT_CONTENT;
    if (type === "shape") return DEFAULT_SHAPE_CONTENT;
    return {};
  };

  const getDefaultColor = (type: string) => {
    switch (type) {
      case "note":
        return "#3b82f6";
      case "task-board":
        return "#10b981";
      case "code":
        return "#8b5cf6";
      case "image":
        return "#f59e0b";
      case "link":
        return "#06b6d4";
      case "tag":
        return "#ef4444";
      case "text":
        return "#64748b";
      case "shape":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const handleCreateCanvas = useCallback(async () => {
    if (!projectId || typeof projectId !== "string") return;
    try {
      const newCanvas = await createCanvas(projectId, "Untitled Canvas", canvases.length);
      setCanvases((prev) => [...prev, newCanvas]);
      router.push(`/projects/${projectId}/canvas/${newCanvas.id}`);
    } catch {
      setError("Failed to create canvas");
    }
  }, [projectId, canvases.length, router]);

  const handleRenameCanvas = useCallback(
    async (targetCanvasId: string, name: string) => {
      if (!projectId || typeof projectId !== "string") return;
      try {
        const updated = await updateCanvas(projectId, targetCanvasId, { name });
        setCanvases((prev) =>
          prev.map((c) => (c.id === targetCanvasId ? updated : c))
        );
        if (canvas?.id === targetCanvasId) setCanvas(updated);
      } catch {
        setError("Failed to rename canvas");
      }
    },
    [projectId, canvas?.id]
  );

  const handleDeleteCanvas = useCallback(
    async (targetCanvasId: string) => {
      if (!projectId || typeof projectId !== "string") return;
      try {
        await deleteCanvas(projectId, targetCanvasId);
        setCanvases((prev) => prev.filter((c) => c.id !== targetCanvasId));
        if (canvas?.id === targetCanvasId) {
          const remaining = canvases.filter((c) => c.id !== targetCanvasId);
          const next = remaining[0];
          if (next) router.push(`/projects/${projectId}/canvas/${next.id}`);
          else router.push(`/projects/${projectId}`);
        }
      } catch {
        setError("Failed to delete canvas");
      }
    },
    [projectId, canvas?.id, canvases, router]
  );

  const handleReloadFromConflict = useCallback(async () => {
    if (!projectId || typeof projectId !== "string" || !canvasId || typeof canvasId !== "string") return;
    try {
      const [projectRes, canvasesRes, blocks] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/canvases`),
        fetchCanvasBlocks(projectId, canvasId),
      ]);
      if (!projectRes.ok) throw new Error("Failed to reload");
      const projectData = await projectRes.json();
      setProject(projectData);
      const canvasesData = await canvasesRes.json();
      setCanvases(canvasesData.canvases ?? []);
      const currentCanvas = (canvasesData.canvases ?? []).find(
        (c: Canvas) => c.id === canvasId
      );
      if (currentCanvas) {
        setCanvas(currentCanvas);
        lastSavedAtRef.current = currentCanvas.updatedAt ?? null;
      }
      setCanvasBlocks(blocks);
      setSaveConflict(false);
    } catch {
      setError("Failed to reload canvas");
    }
  }, [projectId, canvasId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading canvas...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project || !canvas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Project not found"}
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="text-primary hover:underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <CanvasHeader
        project={project}
        canvas={canvas}
        canvases={canvases}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCanvasCreate={handleCreateCanvas}
        onCanvasRename={handleRenameCanvas}
        onCanvasDelete={handleDeleteCanvas}
      />
      {saveConflict && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Canvas was updated elsewhere. Reload to get the latest version.
          </p>
          <button
            type="button"
            onClick={handleReloadFromConflict}
            className="shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100 transition-colors"
          >
            Reload
          </button>
        </div>
      )}
      <div className="flex h-[calc(100vh-64px)] relative">
        {!sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            title="Show sidebar"
            aria-label="Show sidebar"
            className="absolute left-0 top-4 z-30 flex items-center justify-center p-2 rounded-r-xl border border-l-0 border-slate-200/80 dark:border-slate-600/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/90 hover:shadow-lg transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <PanelLeftOpen size={18} aria-hidden />
          </button>
        )}
        <CanvasSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddBlock={(type, position) => {
            setIsAddingBlock(type);
            const canvasCenter = {
              x: (window.innerWidth / 2 - panOffset.x) / zoomLevel,
              y: (window.innerHeight / 2 - panOffset.y) / zoomLevel,
            };
            addBlock(type, position || canvasCenter);
          }}
          selectedBlocks={selectedBlocks}
          canvasBlocks={canvasBlocks}
          onBlockUpdate={updateBlock}
          onBlockSelect={setSelectedBlocks}
        />
        <div className="flex-1 relative overflow-hidden">
          {!toolbarOpen && !isToolbarExiting && (
            <CanvasToolbarShowTab onShow={() => setToolbarOpen(true)} />
          )}
          {(toolbarOpen || isToolbarExiting) && (
            <CanvasToolbar
              tool={activeTool}
              onToolChange={(newTool) => {
                setActiveTool(newTool);
                if (newTool === "text") setIsAddingBlock("text");
                else if (newTool === "shape") setIsAddingBlock("shape");
                else setIsAddingBlock(null);
              }}
              onAddShape={(shapeKind) => {
                setAddingShapeKind(shapeKind);
                setActiveTool("shape");
                setIsAddingBlock("shape");
              }}
              zoomLevel={zoomLevel}
              onZoomChange={setZoomLevel}
              showGrid={showGrid}
              onGridToggle={() => setShowGrid(!showGrid)}
              onResetView={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              onFitToView={handleFitToView}
              onToolbarToggle={() => setIsToolbarExiting(true)}
              onToolbarExitComplete={() => {
                setToolbarOpen(false);
                setIsToolbarExiting(false);
              }}
              isExiting={isToolbarExiting}
              canvasBlocks={canvasBlocks}
              selectedBlocks={selectedBlocks}
              onDeleteSelected={deleteSelectedBlocks}
              onDuplicateSelected={duplicateBlocks}
            />
          )}
          <CanvasWorkspace
            ref={canvasRef}
            activeTool={activeTool}
            blocks={canvasBlocks}
            canvasName={canvas?.name}
            selectedBlocks={selectedBlocks}
            onBlockSelect={setSelectedBlocks}
            onBlockUpdate={updateBlock}
            onBlockDuplicate={duplicateBlock}
            onBlockDelete={deleteBlock}
            zoomLevel={zoomLevel}
            panOffset={panOffset}
            onZoomChange={setZoomLevel}
            onPanOffsetChange={setPanOffset}
            showGrid={showGrid}
            isDragging={isDragging}
            onDraggingChange={setIsDragging}
            isResizing={isResizing}
            onResizingChange={setIsResizing}
            isAddingBlock={isAddingBlock}
            onAddBlock={addBlock}
            onFloatingToolbarShow={(position) => {
              setFloatingToolbarPosition(position);
              setShowFloatingToolbar(true);
            }}
            viewMode={viewMode}
          />
        </div>
      </div>
      {showFloatingToolbar && selectedBlocks.length > 0 && (
        <CanvasFloatingToolbar
          position={floatingToolbarPosition}
          selectedBlocks={selectedBlocks}
          canvasBlocks={canvasBlocks}
          onBlockUpdate={updateBlock}
          onDelete={(blockIds) => {
            setCanvasBlocks((prev) =>
              prev.filter((block) => !blockIds.includes(block.id)),
            );
            setSelectedBlocks((prev) =>
              prev.filter((id) => !blockIds.includes(id)),
            );
            setShowFloatingToolbar(false);
          }}
          onClose={() => setShowFloatingToolbar(false)}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
        />
      )}
    </div>
  );
}
