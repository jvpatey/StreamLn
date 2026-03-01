"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CanvasToolbar,
  type CanvasTool,
} from "@/components/ui/projects/canvas/canvas-toolbar";
import { CanvasWorkspace } from "@/components/ui/projects/canvas/canvas-workspace";
import { CanvasDocumentEditor } from "@/components/ui/projects/canvas/canvas-document-editor";
import { CanvasSidebar } from "@/components/ui/projects/canvas/canvas-sidebar";
import { DocumentSidebar } from "@/components/ui/projects/canvas/document-sidebar";
import { CanvasFloatingToolbar } from "@/components/ui/projects/canvas/canvas-floating-toolbar";
import { CanvasHeader } from "@/components/ui/projects/canvas/canvas-header";
import { CanvasWorkspaceSkeleton } from "@/components/ui/projects/canvas/canvas-workspace-skeleton";
import { ExportModal } from "@/components/ui/projects/canvas/export-modal";
import { ShareCanvasModal } from "@/components/ui/projects/canvas/share-canvas-modal";
import {
  exportCanvasAsPNG,
  exportCanvasAsPDF,
} from "@/lib/export/canvas-export";
import { DEFAULT_NOTE_CONTENT } from "@/components/ui/projects/canvas/blocks/note-defaults";
import { DEFAULT_LINK_CONTENT } from "@/components/ui/projects/canvas/blocks/link-defaults";
import { DEFAULT_TAG_CONTENT } from "@/components/ui/projects/canvas/blocks/tag-defaults";
import { getDefaultTaskBoardContent } from "@/components/ui/projects/canvas/blocks/task-board-defaults";
import { DEFAULT_CODE_CONTENT } from "@/components/ui/projects/canvas/blocks/code-defaults";
import { DEFAULT_IMAGE_CONTENT } from "@/components/ui/projects/canvas/blocks/image-defaults";
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
  reorderCanvases,
  fetchDocuments,
  fetchProjectDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  reorderDocuments,
} from "@/lib/api/canvas";
import { addProjectToRecent } from "@/lib/recent-projects";
import {
  getRecentDocuments,
  addDocumentToRecent,
} from "@/lib/recent-documents";
import {
  getDefaultShowGrid,
  getDefaultZoom,
  getDefaultSidebarOpen,
  getDefaultToolbarOpen,
} from "@/lib/canvas-preferences";
import type { CanvasBlock, Canvas, Document } from "@/lib/types/canvas";
import { PanelLeftOpen, PanelTopOpen, Edit3, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function CanvasToolbarShowTab({
  onShow,
  viewMode,
  onViewModeChange,
}: {
  onShow: () => void;
  viewMode: "edit" | "present";
  onViewModeChange: (mode: "edit" | "present") => void;
}) {
  return (
    <motion.div
      className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1"
      initial={{ opacity: 0, scale: 0.8, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex items-center rounded-b-xl border border-t-0 border-slate-200/80 dark:border-slate-600/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md overflow-hidden">
        <button
          type="button"
          onClick={() => onViewModeChange("edit")}
          title="Edit mode"
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium transition-colors",
            viewMode === "edit"
              ? "bg-primary/20 text-primary dark:bg-primary/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          <Edit3 size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("present")}
          title="View mode"
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium transition-colors border-l border-slate-200/80 dark:border-slate-600/80",
            viewMode === "present"
              ? "bg-primary/20 text-primary dark:bg-primary/30"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          <Eye size={14} />
          View
        </button>
      </div>
      <button
        type="button"
        onClick={onShow}
        title="Show toolbar"
        aria-label="Show toolbar"
        className="flex items-center justify-center p-2 rounded-b-xl border border-t-0 border-slate-200/80 dark:border-slate-600/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/90 hover:shadow-lg transition-colors text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
      >
        <PanelTopOpen size={18} aria-hidden />
      </button>
    </motion.div>
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
  const searchParams = useSearchParams();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projectDocuments, setProjectDocuments] = useState<
    Array<{
      id: string;
      name: string;
      order: number;
      documents: Array<{ id: string; name: string; order: number }>;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Canvas state
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Canvas view state (initialized from preferences in useEffect)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const docParam = searchParams.get("doc");
  const [isToolbarExiting, setIsToolbarExiting] = useState(false);
  const [primaryMode, setPrimaryMode] = useState<"canvas" | "document">(
    "canvas",
  );
  const [viewMode, setViewMode] = useState<"edit" | "present">("edit");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Canvas tool state (select vs pan)
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");

  // Canvas interaction state
  const [isAddingBlock, setIsAddingBlock] = useState<string | null>(null);
  const [addingShapeKind, setAddingShapeKind] =
    useState<ShapeKind>("rectangle");
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
      if (
        !projectId ||
        typeof projectId !== "string" ||
        !canvasId ||
        typeof canvasId !== "string"
      )
        return;

      setLoading(true);
      setError(null);
      skipNextSaveRef.current = true;

      try {
        const [projectRes, canvasesList] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetchCanvases(projectId),
        ]);
        if (!projectRes.ok) throw new Error("Project not found");
        const projectData = await projectRes.json();
        setProject(projectData);

        setCanvases(canvasesList);

        const currentCanvas = canvasesList.find(
          (c: Canvas) => c.id === canvasId,
        );
        if (!currentCanvas) throw new Error("Canvas not found");
        setCanvas(currentCanvas);
        const updated = currentCanvas.updatedAt ?? null;
        lastSavedAtRef.current = updated;
        setLastSavedAt(updated);
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

  // Fetch documents when in document mode (for current canvas)
  useEffect(() => {
    if (
      !projectId ||
      typeof projectId !== "string" ||
      !canvasId ||
      typeof canvasId !== "string" ||
      primaryMode !== "document"
    )
      return;

    const loadDocuments = async () => {
      try {
        const docs = await fetchDocuments(projectId, canvasId);
        setDocuments(docs);
      } catch {
        setDocuments([]);
      }
    };

    loadDocuments();
  }, [projectId, canvasId, primaryMode]);

  // Fetch project documents tree when in document mode (for sidebar)
  useEffect(() => {
    if (
      !projectId ||
      typeof projectId !== "string" ||
      primaryMode !== "document"
    )
      return;

    const loadProjectDocuments = async () => {
      try {
        const tree = await fetchProjectDocuments(projectId);
        setProjectDocuments(tree.canvases);
      } catch {
        setProjectDocuments([]);
      }
    };

    loadProjectDocuments();
  }, [projectId, primaryMode]);

  // When switching to document mode: if no doc param and documents exist, select first
  useEffect(() => {
    if (primaryMode !== "document" || !projectId || !canvasId) return;
    if (docParam) return; // Already have a doc selected
    if (documents.length === 0) return; // No documents yet

    const first = documents[0];
    router.replace(
      `/projects/${projectId}/canvas/${canvasId}?doc=${first.id}`,
      { scroll: false },
    );
  }, [primaryMode, docParam, documents, projectId, canvasId, router]);

  // Initialize view state from preferences (client-only)
  useEffect(() => {
    setShowGrid(getDefaultShowGrid());
    setZoomLevel(getDefaultZoom());
    setSidebarOpen(getDefaultSidebarOpen());
    setToolbarOpen(getDefaultToolbarOpen());
  }, []);

  // Track project as recently opened
  useEffect(() => {
    if (projectId && typeof projectId === "string") {
      addProjectToRecent(projectId);
    }
  }, [projectId]);

  // Track document as recently opened when viewing
  useEffect(() => {
    const pid = typeof projectId === "string" ? projectId : undefined;
    const cid = typeof canvasId === "string" ? canvasId : undefined;
    const docId = typeof docParam === "string" ? docParam : undefined;
    if (
      primaryMode === "document" &&
      pid &&
      cid &&
      docId &&
      canvas &&
      documents.length > 0
    ) {
      const doc = documents.find((d) => d.id === docId);
      if (doc) {
        addDocumentToRecent(pid, cid, doc.id, doc.name, canvas.name);
      }
    }
  }, [primaryMode, projectId, canvasId, docParam, canvas?.name, documents]);

  // Debounced save (1.5s after last change)
  useEffect(() => {
    if (
      !projectId ||
      typeof projectId !== "string" ||
      !canvasId ||
      typeof canvasId !== "string"
    )
      return;
    if (skipNextSaveRef.current) return;

    const timeout = setTimeout(async () => {
      const result = await saveCanvasBlocks(
        projectId,
        canvasId,
        canvasBlocks,
        lastSavedAtRef.current ?? undefined,
      );
      if (result.ok) {
        lastSavedAtRef.current = result.updatedAt;
        setLastSavedAt(result.updatedAt);
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
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if (
          !target.closest("input") &&
          !target.closest("textarea") &&
          !target.closest("[contenteditable]")
        ) {
          setSidebarOpen((prev) => !prev);
        }
        return;
      }
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
      type === "shape" && (shapeKind === "line" || shapeKind === "arrow");

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
              ? 240
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
    if (type === "image") return DEFAULT_IMAGE_CONTENT;
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

  const handleCreateCanvas = useCallback(
    async (name: string) => {
      if (!projectId || typeof projectId !== "string") return;
      try {
        const newCanvas = await createCanvas(
          projectId,
          name.trim() || "Untitled Canvas",
          canvases.length,
        );
        setCanvases((prev) => [...prev, newCanvas]);
        router.push(`/projects/${projectId}/canvas/${newCanvas.id}`);
      } catch {
        setError("Failed to create canvas");
      }
    },
    [projectId, canvases.length, router],
  );

  const handleReorderCanvases = useCallback(
    async (reordered: Canvas[]) => {
      const pid = typeof projectId === "string" ? projectId : null;
      if (!pid) return;
      setCanvases(reordered);
      try {
        const updated = await reorderCanvases(
          pid,
          reordered.map((c, i) => ({ id: c.id, order: i })),
        );
        if (updated.length) setCanvases(updated);
      } catch {
        setError("Failed to reorder canvases");
      }
    },
    [projectId],
  );

  const handleRenameCanvas = useCallback(
    async (targetCanvasId: string, name: string) => {
      if (!projectId || typeof projectId !== "string") return;
      try {
        const updated = await updateCanvas(projectId, targetCanvasId, { name });
        setCanvases((prev) =>
          prev.map((c) => (c.id === targetCanvasId ? updated : c)),
        );
        if (canvas?.id === targetCanvasId) setCanvas(updated);
      } catch {
        setError("Failed to rename canvas");
      }
    },
    [projectId, canvas?.id],
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
    [projectId, canvas?.id, canvases, router],
  );

  const handleDocumentSelect = useCallback(
    (targetCanvasId: string, documentId: string) => {
      if (!projectId || typeof projectId !== "string") return;
      const targetCanvas = canvases.find((c) => c.id === targetCanvasId);
      const targetDoc =
        targetCanvasId === canvasId
          ? documents.find((d) => d.id === documentId)
          : projectDocuments
              .find((c) => c.id === targetCanvasId)
              ?.documents.find((d) => d.id === documentId);
      const docName = targetDoc?.name ?? "Untitled Document";
      const canvasName = targetCanvas?.name ?? "Canvas";
      addDocumentToRecent(
        projectId,
        targetCanvasId,
        documentId,
        docName,
        canvasName,
      );
      if (targetCanvasId !== canvasId) {
        router.push(
          `/projects/${projectId}/canvas/${targetCanvasId}?doc=${documentId}`,
        );
      } else {
        router.replace(
          `/projects/${projectId}/canvas/${canvasId}?doc=${documentId}`,
          { scroll: false },
        );
      }
    },
    [projectId, canvasId, canvases, documents, projectDocuments, router],
  );

  const handleDocumentCreate = useCallback(
    async (targetCanvasId?: string) => {
      const cid = targetCanvasId ?? canvasId;
      if (
        !projectId ||
        typeof projectId !== "string" ||
        !cid ||
        typeof cid !== "string"
      )
        return;
      try {
        const newDoc = await createDocument(projectId, cid);
        if (cid === canvasId) {
          setDocuments((prev) => [...prev, newDoc]);
        }
        setProjectDocuments((prev) =>
          prev.map((c) =>
            c.id === cid
              ? {
                  ...c,
                  documents: [
                    ...c.documents,
                    { id: newDoc.id, name: newDoc.name, order: newDoc.order },
                  ],
                }
              : c,
          ),
        );
        if (cid !== canvasId) {
          router.push(`/projects/${projectId}/canvas/${cid}?doc=${newDoc.id}`);
        } else {
          router.replace(
            `/projects/${projectId}/canvas/${canvasId}?doc=${newDoc.id}`,
            { scroll: false },
          );
        }
        addDocumentToRecent(
          projectId,
          cid,
          newDoc.id,
          newDoc.name,
          canvases.find((c) => c.id === cid)?.name ?? "Canvas",
        );
      } catch {
        setError("Failed to create document");
      }
    },
    [projectId, canvasId, canvases, router],
  );

  const handleDocumentRename = useCallback(
    async (targetCanvasId: string, documentId: string, name: string) => {
      if (!projectId || typeof projectId !== "string") return;
      try {
        const updated = await updateDocument(
          projectId,
          targetCanvasId,
          documentId,
          { name },
        );
        if (targetCanvasId === canvasId) {
          setDocuments((prev) =>
            prev.map((d) => (d.id === documentId ? updated : d)),
          );
        }
        setProjectDocuments((prev) =>
          prev.map((c) =>
            c.id === targetCanvasId
              ? {
                  ...c,
                  documents: c.documents.map((d) =>
                    d.id === documentId ? { ...d, name } : d,
                  ),
                }
              : c,
          ),
        );
      } catch {
        setError("Failed to rename document");
      }
    },
    [projectId, canvasId],
  );

  const handleDocumentDelete = useCallback(
    async (targetCanvasId: string, documentId: string) => {
      if (!projectId || typeof projectId !== "string") return;
      try {
        await deleteDocument(projectId, targetCanvasId, documentId);
        if (targetCanvasId === canvasId) {
          setDocuments((prev) => prev.filter((d) => d.id !== documentId));
        }
        setProjectDocuments((prev) =>
          prev.map((c) =>
            c.id === targetCanvasId
              ? {
                  ...c,
                  documents: c.documents.filter((d) => d.id !== documentId),
                }
              : c,
          ),
        );
        if (targetCanvasId === canvasId && docParam === documentId) {
          const remaining =
            projectDocuments
              .find((c) => c.id === targetCanvasId)
              ?.documents.filter((d) => d.id !== documentId) ?? [];
          const next = remaining[0];
          if (next) {
            router.replace(
              `/projects/${projectId}/canvas/${canvasId}?doc=${next.id}`,
              { scroll: false },
            );
          } else {
            router.replace(`/projects/${projectId}/canvas/${canvasId}`, {
              scroll: false,
            });
          }
        }
      } catch {
        setError("Failed to delete document");
      }
    },
    [projectId, canvasId, docParam, projectDocuments, router],
  );

  const handleDocumentReorder = useCallback(
    async (reordered: Document[]) => {
      const pid = typeof projectId === "string" ? projectId : null;
      const cid = typeof canvasId === "string" ? canvasId : null;
      if (!pid || !cid) return;
      setDocuments(reordered);
      try {
        const updated = await reorderDocuments(
          pid,
          cid,
          reordered.map((d, i) => ({ id: d.id, order: i })),
        );
        if (updated.length) setDocuments(updated);
      } catch {
        setError("Failed to reorder documents");
      }
    },
    [projectId, canvasId],
  );

  const handleDocumentReorderForSidebar = useCallback(
    async (
      targetCanvasId: string,
      reordered: Array<{ id: string; name: string; order: number }>,
    ) => {
      const pid = typeof projectId === "string" ? projectId : null;
      if (!pid) return;
      const withOrder = reordered.map((d, i) => ({ ...d, order: i }));
      setProjectDocuments((prev) =>
        prev.map((c) =>
          c.id === targetCanvasId ? { ...c, documents: withOrder } : c,
        ),
      );
      if (targetCanvasId === canvasId) {
        setDocuments((prev) => {
          const byId = new Map(prev.map((d) => [d.id, d]));
          return withOrder.map((d) => {
            const existing = byId.get(d.id);
            return existing
              ? { ...existing, order: d.order }
              : ({
                  ...d,
                  canvasId: targetCanvasId,
                  projectId: pid,
                  content: null,
                  createdAt: "",
                  updatedAt: "",
                } as Document);
          });
        });
      }
      try {
        const updated = await reorderDocuments(
          pid,
          targetCanvasId,
          withOrder.map((d) => ({ id: d.id, order: d.order })),
        );
        setProjectDocuments((prev) =>
          prev.map((c) =>
            c.id === targetCanvasId
              ? {
                  ...c,
                  documents: updated.map((d, i) => ({
                    id: d.id,
                    name: d.name,
                    order: i,
                  })),
                }
              : c,
          ),
        );
        if (targetCanvasId === canvasId && updated.length) {
          setDocuments(updated);
        }
      } catch {
        setError("Failed to reorder documents");
      }
    },
    [projectId, canvasId],
  );

  const handleReloadFromConflict = useCallback(async () => {
    if (
      !projectId ||
      typeof projectId !== "string" ||
      !canvasId ||
      typeof canvasId !== "string"
    )
      return;
    try {
      const [projectRes, canvasesList, blocks, docs] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetchCanvases(projectId),
        fetchCanvasBlocks(projectId, canvasId),
        primaryMode === "document"
          ? fetchDocuments(projectId, canvasId)
          : Promise.resolve([]),
      ]);
      if (!projectRes.ok) throw new Error("Failed to reload");
      const projectData = await projectRes.json();
      setProject(projectData);
      setCanvases(canvasesList);
      if (primaryMode === "document") {
        setDocuments(docs);
        const currentDoc = docParam
          ? docs.find((d: Document) => d.id === docParam)
          : docs[0];
        if (currentDoc) {
          lastSavedAtRef.current = currentDoc.updatedAt;
          setLastSavedAt(currentDoc.updatedAt);
        }
      }
      const currentCanvas = canvasesList.find((c: Canvas) => c.id === canvasId);
      if (currentCanvas) {
        setCanvas(currentCanvas);
        if (primaryMode !== "document") {
          const updated = currentCanvas.updatedAt ?? null;
          lastSavedAtRef.current = updated;
          setLastSavedAt(updated);
        }
      }
      setCanvasBlocks(blocks);
      setSaveConflict(false);
    } catch {
      setError("Failed to reload canvas");
    }
  }, [projectId, canvasId, primaryMode, docParam]);

  if (!loading && (error || !project || !canvas)) {
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

  const placeholderProject: Project = {
    id: typeof projectId === "string" ? projectId : "",
    name: "Loading...",
    status: "active",
    userId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const placeholderCanvas: Canvas = {
    id: typeof canvasId === "string" ? canvasId : "",
    name: "Loading...",
    order: 0,
    projectId: typeof projectId === "string" ? projectId : "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const displayProject = project ?? placeholderProject;
  const displayCanvas = canvas ?? placeholderCanvas;
  const displayCanvases = canvases.length > 0 ? canvases : [placeholderCanvas];
  const currentDocument =
    docParam && documents.length > 0
      ? (documents.find((d) => d.id === docParam) ?? null)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <CanvasHeader
        project={displayProject}
        canvas={displayCanvas}
        canvases={displayCanvases}
        primaryMode={primaryMode}
        onPrimaryModeChange={setPrimaryMode}
        onCanvasCreate={handleCreateCanvas}
        onCanvasRename={handleRenameCanvas}
        onCanvasDelete={handleDeleteCanvas}
        onCanvasReorder={handleReorderCanvases}
        documents={documents}
        currentDocument={currentDocument}
        onDocumentSelect={(id) => handleDocumentSelect(canvas?.id ?? "", id)}
        onDocumentCreate={() => handleDocumentCreate()}
        onDocumentRename={handleDocumentRename}
        onDocumentDelete={handleDocumentDelete}
        onDocumentReorder={handleDocumentReorder}
        onExportClick={() => setExportModalOpen(true)}
        onShareClick={() => setShareModalOpen(true)}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid((prev) => !prev)}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={setSidebarOpen}
        toolbarOpen={toolbarOpen}
        onToolbarOpenChange={setToolbarOpen}
        lastSavedAt={lastSavedAt}
      />
      {!loading && project && canvas && (
        <>
          <ShareCanvasModal
            open={shareModalOpen}
            onOpenChange={setShareModalOpen}
            projectId={project.id}
            canvasId={canvas.id}
            projectName={project.name}
            canvasName={canvas.name}
          />
          <ExportModal
            open={exportModalOpen}
            onOpenChange={setExportModalOpen}
            project={project}
            canvas={{
              id: canvas.id,
              name: canvas.name,
              order: canvas.order,
              projectId: canvas.projectId,
              createdAt: canvas.createdAt,
              updatedAt: canvas.updatedAt,
            }}
            blocks={canvasBlocks}
            onExportPNG={() =>
              exportCanvasAsPNG(canvasRef.current, project, {
                id: canvas.id,
                name: canvas.name,
                order: canvas.order,
                projectId: canvas.projectId,
                createdAt: canvas.createdAt,
                updatedAt: canvas.updatedAt,
              })
            }
            onExportPDF={() =>
              exportCanvasAsPDF(canvasRef.current, project, {
                id: canvas.id,
                name: canvas.name,
                order: canvas.order,
                projectId: canvas.projectId,
                createdAt: canvas.createdAt,
                updatedAt: canvas.updatedAt,
              })
            }
          />
        </>
      )}
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
        {primaryMode === "document" ? (
          <>
            <DocumentSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              projectId={project?.id ?? ""}
              projectName={project?.name ?? ""}
              canvases={projectDocuments}
              currentCanvasId={canvas?.id ?? ""}
              currentDocumentId={docParam}
              onDocumentSelect={handleDocumentSelect}
              onDocumentCreate={handleDocumentCreate}
              onDocumentRename={handleDocumentRename}
              onDocumentDelete={handleDocumentDelete}
              onDocumentReorder={handleDocumentReorderForSidebar}
              onCanvasCreate={() => handleCreateCanvas("Untitled Canvas")}
              onCanvasRename={handleRenameCanvas}
              onCanvasDelete={handleDeleteCanvas}
              onCanvasReorder={async (reordered) => {
                setProjectDocuments(reordered);
                try {
                  const updated = await reorderCanvases(
                    projectId as string,
                    reordered.map((c, i) => ({ id: c.id, order: i })),
                  );
                  if (updated.length) {
                    setCanvases(updated);
                    setProjectDocuments(
                      reordered.map((c, i) => ({
                        ...c,
                        ...updated.find((u) => u.id === c.id),
                        order: i,
                      })),
                    );
                  }
                } catch {
                  setError("Failed to reorder canvases");
                }
              }}
              onPrimaryModeChange={setPrimaryMode}
              recentDocuments={
                typeof window !== "undefined"
                  ? getRecentDocuments(projectId as string)
                  : []
              }
            />
            <div className="flex-1 relative overflow-hidden">
              {!loading && project && canvas && currentDocument && (
                <CanvasDocumentEditor
                  key={currentDocument.id}
                  documentId={currentDocument.id}
                  documentContent={currentDocument.content}
                  documentName={currentDocument.name}
                  projectId={project.id}
                  canvasId={canvas.id}
                  lastSavedAt={lastSavedAt}
                  sidebarOpen={sidebarOpen}
                  onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
                  onDocumentSaved={(updatedAt) => {
                    lastSavedAtRef.current = updatedAt;
                    setLastSavedAt(updatedAt);
                    setDocuments((prev) =>
                      prev.map((d) =>
                        d.id === currentDocument.id ? { ...d, updatedAt } : d,
                      ),
                    );
                  }}
                  onSaveConflict={() => setSaveConflict(true)}
                />
              )}
              {!loading &&
                project &&
                canvas &&
                primaryMode === "document" &&
                !currentDocument &&
                documents.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500 dark:text-slate-400">
                    <p className="text-sm">No documents yet</p>
                    <button
                      type="button"
                      onClick={() => handleDocumentCreate()}
                      className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                    >
                      Create first document
                    </button>
                  </div>
                )}
            </div>
          </>
        ) : (
          <>
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
              onAddBlock={
                loading
                  ? () => {}
                  : (type, position) => {
                      setIsAddingBlock(type);
                      const canvasCenter = {
                        x: (window.innerWidth / 2 - panOffset.x) / zoomLevel,
                        y: (window.innerHeight / 2 - panOffset.y) / zoomLevel,
                      };
                      addBlock(type, position || canvasCenter);
                    }
              }
              selectedBlocks={selectedBlocks}
              canvasBlocks={canvasBlocks}
              onBlockUpdate={updateBlock}
              onBlockSelect={setSelectedBlocks}
            />
            <div className="flex-1 relative overflow-hidden">
              {!toolbarOpen && !isToolbarExiting && (
                <CanvasToolbarShowTab
                  onShow={() => setToolbarOpen(true)}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
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
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              )}
              {loading ? (
                <CanvasWorkspaceSkeleton />
              ) : (
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
              )}
            </div>
          </>
        )}
      </div>
      {primaryMode === "canvas" &&
        showFloatingToolbar &&
        selectedBlocks.length > 0 && (
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
