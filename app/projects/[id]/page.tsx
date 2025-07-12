"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { CanvasToolbar } from "@/components/ui/projects/canvas/canvas-toolbar";
import { CanvasWorkspace } from "@/components/ui/projects/canvas/canvas-workspace";
import { CanvasSidebar } from "@/components/ui/projects/canvas/canvas-sidebar";
import { CanvasFloatingToolbar } from "@/components/ui/projects/canvas/canvas-floating-toolbar";
import { CanvasHeader } from "@/components/ui/projects/canvas/canvas-header";

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

export default function ProjectCanvasPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
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
  const [viewMode, setViewMode] = useState<"edit" | "present">("edit");

  // Canvas interaction state
  const [isAddingBlock, setIsAddingBlock] = useState<string | null>(null);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState({
    x: 0,
    y: 0,
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const projectData = await response.json();
        setProject(projectData);

        // Start with empty canvas
        setCanvasBlocks([]);
      } catch (err: any) {
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

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
              // Duplicate selected blocks
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlocks, canvasBlocks]);

  // Canvas block manipulation functions
  const addBlock = (type: string, position: { x: number; y: number }) => {
    const newBlock: CanvasBlock = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      x: position.x,
      y: position.y,
      width: type === "note" ? 300 : type === "task-board" ? 400 : 350,
      height: type === "note" ? 200 : type === "task-board" ? 300 : 250,
      content: getDefaultContent(type),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      color: getDefaultColor(type),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCanvasBlocks((prev) => [...prev, newBlock]);
    setSelectedBlocks([newBlock.id]);
    setIsAddingBlock(null);
  };

  const updateBlock = (id: string, updates: Partial<CanvasBlock>) => {
    setCanvasBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? { ...block, ...updates, updatedAt: new Date() }
          : block
      )
    );
  };

  const deleteSelectedBlocks = () => {
    setCanvasBlocks((prev) =>
      prev.filter((block) => !selectedBlocks.includes(block.id))
    );
    setSelectedBlocks([]);
  };

  const duplicateBlocks = () => {
    const blocksToClone = canvasBlocks.filter((block) =>
      selectedBlocks.includes(block.id)
    );

    const clonedBlocks = blocksToClone.map((block) => ({
      ...block,
      id: `${block.type}-${Date.now()}-${Math.random()}`,
      x: block.x + 20,
      y: block.y + 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setCanvasBlocks((prev) => [...prev, ...clonedBlocks]);
    setSelectedBlocks(clonedBlocks.map((block) => block.id));
  };

  const getDefaultContent = (type: string) => {
    // All blocks are placeholders for now
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
      default:
        return "#6b7280";
    }
  };

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

  if (error || !project) {
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
      {/* Canvas Header */}
      <CanvasHeader
        project={project}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Canvas Layout */}
      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Canvas Sidebar */}
        <CanvasSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddBlock={(type, position) => {
            setIsAddingBlock(type);
            // Handle block addition at canvas center or cursor position
            const canvasCenter = {
              x: (window.innerWidth / 2 - panOffset.x) / zoomLevel,
              y: (window.innerHeight / 2 - panOffset.y) / zoomLevel,
            };
            addBlock(type, position || canvasCenter);
          }}
          selectedBlocks={selectedBlocks}
          canvasBlocks={canvasBlocks}
          onBlockUpdate={updateBlock}
        />

        {/* Canvas Workspace Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Canvas Toolbar */}
          <CanvasToolbar
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            showGrid={showGrid}
            onGridToggle={() => setShowGrid(!showGrid)}
            onResetView={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            canvasBlocks={canvasBlocks}
            selectedBlocks={selectedBlocks}
            onDeleteSelected={deleteSelectedBlocks}
            onDuplicateSelected={duplicateBlocks}
          />

          {/* Canvas Workspace */}
          <CanvasWorkspace
            ref={canvasRef}
            blocks={canvasBlocks}
            selectedBlocks={selectedBlocks}
            onBlockSelect={setSelectedBlocks}
            onBlockUpdate={updateBlock}
            zoomLevel={zoomLevel}
            panOffset={panOffset}
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

      {/* Floating Toolbar */}
      {showFloatingToolbar && selectedBlocks.length > 0 && (
        <CanvasFloatingToolbar
          position={floatingToolbarPosition}
          selectedBlocks={selectedBlocks}
          canvasBlocks={canvasBlocks}
          onBlockUpdate={updateBlock}
          onClose={() => setShowFloatingToolbar(false)}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
        />
      )}
    </div>
  );
}
