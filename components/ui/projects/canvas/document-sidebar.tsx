"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LiquidGlassSurface,
  getLiquidGlassSurfaceClassName,
} from "@/components/ui/shared/liquid-glass-surface";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/shared/sheet";
import { SortableCanvasList, SortableCanvasItem } from "./sortable-canvas-list";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { getIconComponent } from "@/components/ui/projects/project-content/icon-picker";
import React from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  LayoutGrid,
  PanelLeftClose,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";
import type { RecentDocument } from "@/lib/recent-documents";

const treeTransition = { duration: 0.2, ease: "easeOut" as const };

interface CanvasWithDocs {
  id: string;
  name: string;
  order: number;
  documents: Array<{ id: string; name: string; order: number }>;
}

interface DocumentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isHighlighted?: boolean;
  onHighlightClear?: () => void;
  projectId: string;
  projectName: string;
  projectIcon?: string;
  projectUpdatedAt?: string;
  canvases: CanvasWithDocs[];
  currentCanvasId: string;
  currentDocumentId: string | null;
  onDocumentSelect: (canvasId: string, documentId: string) => void;
  onDocumentCreate: (canvasId: string) => void;
  onDocumentRename: (
    canvasId: string,
    documentId: string,
    name: string,
  ) => void;
  onDocumentDelete: (canvasId: string, documentId: string) => void;
  onCanvasCreate: () => void;
  onCanvasRename: (canvasId: string, name: string) => void;
  onCanvasDelete: (canvasId: string) => void;
  onCanvasReorder: (reordered: CanvasWithDocs[]) => void;
  onDocumentReorder?: (
    canvasId: string,
    reordered: Array<{ id: string; name: string; order: number }>,
  ) => void;
  onPrimaryModeChange: (mode: "canvas" | "document") => void;
  recentDocuments: RecentDocument[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DocumentSidebar({
  isOpen,
  onClose,
  isHighlighted,
  onHighlightClear,
  projectId,
  projectName,
  projectIcon,
  projectUpdatedAt,
  canvases,
  currentCanvasId,
  currentDocumentId,
  onDocumentSelect,
  onDocumentCreate,
  onDocumentRename,
  onDocumentDelete,
  onCanvasCreate,
  onCanvasRename,
  onCanvasDelete,
  onCanvasReorder,
  onDocumentReorder,
  onPrimaryModeChange,
  recentDocuments,
}: DocumentSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCanvases, setExpandedCanvases] = useState<Set<string>>(
    () => new Set([currentCanvasId]),
  );
  const [renameCanvasId, setRenameCanvasId] = useState<string | null>(null);
  const [renameCanvasValue, setRenameCanvasValue] = useState("");
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [renameDocValue, setRenameDocValue] = useState("");
  const [renameDocCanvasId, setRenameDocCanvasId] = useState<string | null>(
    null,
  );

  const toggleCanvas = (canvasId: string) => {
    setExpandedCanvases((prev) => {
      const next = new Set(prev);
      if (next.has(canvasId)) next.delete(canvasId);
      else next.add(canvasId);
      return next;
    });
  };

  const filteredCanvases = useMemo(() => {
    if (!searchQuery.trim()) return canvases;
    const q = searchQuery.toLowerCase().trim();
    return canvases
      .map((c) => {
        const matchingDocs = c.documents.filter((d) =>
          d.name.toLowerCase().includes(q),
        );
        const canvasMatches = c.name.toLowerCase().includes(q);
        if (canvasMatches || matchingDocs.length > 0) {
          return {
            ...c,
            documents: canvasMatches ? c.documents : matchingDocs,
          };
        }
        return null;
      })
      .filter((c): c is CanvasWithDocs => c !== null);
  }, [canvases, searchQuery]);

  const handleCanvasClick = (canvasId: string) => {
    if (canvasId !== currentCanvasId) {
      onPrimaryModeChange("canvas");
      router.push(`/projects/${projectId}/canvas/${canvasId}`);
    }
  };

  const handleDocumentClick = (canvasId: string, documentId: string) => {
    onDocumentSelect(canvasId, documentId);
    if (canvasId !== currentCanvasId) {
      router.push(
        `/projects/${projectId}/canvas/${canvasId}?doc=${documentId}`,
      );
    }
  };

  const handleRecentClick = (doc: RecentDocument) => {
    if (doc.projectId !== projectId) {
      router.push(
        `/projects/${doc.projectId}/canvas/${doc.canvasId}?doc=${doc.documentId}`,
      );
    } else {
      onDocumentSelect(doc.canvasId, doc.documentId);
      router.push(
        `/projects/${projectId}/canvas/${doc.canvasId}?doc=${doc.documentId}`,
      );
    }
  };

  const filteredRecent = recentDocuments.filter((d) => {
    if (d.projectId !== projectId) return false;
    const canvas = canvases.find((c) => c.id === d.canvasId);
    if (!canvas) return false;
    return canvas.documents.some((doc) => doc.id === d.documentId);
  });

  const isMobile = useIsMobile();

  const handleDocumentClickWithClose = (
    canvasId: string,
    documentId: string,
  ) => {
    handleDocumentClick(canvasId, documentId);
    if (isMobile) onClose();
  };

  const handleCanvasClickWithClose = (canvasId: string) => {
    handleCanvasClick(canvasId);
    if (isMobile) onClose();
  };

  const handleRecentClickWithClose = (doc: RecentDocument) => {
    handleRecentClick(doc);
    if (isMobile) onClose();
  };

  // Mobile: bottom sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          hideClose
          className="h-[60vh] max-h-[60vh] rounded-t-2xl border-0 p-0 gap-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50"
        >
          <SheetTitle className="sr-only">Canvases and documents</SheetTitle>
          <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between pt-3 pb-2 px-4 shrink-0">
              <div className="w-10" />
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
              <div className="p-3 border-b border-slate-200/50 dark:border-slate-700/50 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10 dark:bg-primary/20 shrink-0">
                    {React.createElement(
                      getIconComponent(projectIcon || "Folder"),
                      {
                        className:
                          "h-5 w-5 text-primary-600 dark:text-primary-400",
                      },
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {projectName}
                    </p>
                    {projectUpdatedAt && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Updated {formatDate(projectUpdatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative mb-2">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search canvases and documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-9 pr-8 py-2 text-sm rounded-lg",
                    "bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-600/80",
                    "text-slate-700 dark:text-slate-300 placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {filteredCanvases.map((canvas) => {
                  const isExpanded = expandedCanvases.has(canvas.id);
                  const isCurrentCanvas = canvas.id === currentCanvasId;
                  return (
                    <div key={canvas.id}>
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-2.5 py-2 group transition-colors",
                          isCurrentCanvas
                            ? "bg-primary/10"
                            : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggleCanvas(canvas.id)}
                          className="p-0.5 shrink-0 -ml-0.5"
                        >
                          {isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCanvasClickWithClose(canvas.id)}
                          className="flex-1 text-left text-sm truncate min-w-0 flex items-center gap-1.5"
                        >
                          <LayoutGrid
                            size={14}
                            className="shrink-0 text-slate-500"
                          />
                          {canvas.name}
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={treeTransition}
                          >
                            <div className="ml-6 mt-1 space-y-1 border-l border-slate-200/50 dark:border-slate-600/50 pl-2">
                              {canvas.documents.map((doc) => (
                                <button
                                  key={doc.id}
                                  type="button"
                                  onClick={() =>
                                    handleDocumentClickWithClose(
                                      canvas.id,
                                      doc.id,
                                    )
                                  }
                                  className={cn(
                                    "w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                                    isCurrentCanvas &&
                                      doc.id === currentDocumentId
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                                  )}
                                >
                                  <FileText
                                    size={14}
                                    className="shrink-0 text-slate-500"
                                  />
                                  <span className="truncate">{doc.name}</span>
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => onDocumentCreate(canvas.id)}
                                className="w-full flex items-center gap-2 px-2.5 py-2 mt-2 text-xs text-primary hover:bg-primary/10 rounded-lg"
                              >
                                <Plus size={12} />
                                New document
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
              {filteredRecent.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Recent
                  </h3>
                  <div className="space-y-1">
                    {filteredRecent.map((doc) => (
                      <button
                        key={`${doc.canvasId}-${doc.documentId}`}
                        type="button"
                        onClick={() => handleRecentClickWithClose(doc)}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                      >
                        <FileText
                          size={14}
                          className="shrink-0 text-slate-500"
                        />
                        <span className="truncate">
                          {doc.documentName}
                          <span className="text-slate-400 text-xs ml-1">
                            ({doc.canvasName})
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: left sidebar
  return (
    <div
      className={cn(
        "flex-shrink-0 transition-[width] duration-300 ease-in-out relative md:relative",
        isOpen ? "w-80 overflow-visible z-20" : "w-0 overflow-hidden",
        isOpen &&
          "fixed inset-x-0 top-16 bottom-0 z-50 md:!static md:!inset-auto md:!top-auto md:!bottom-auto",
        !isOpen && "hidden md:block",
      )}
    >
      {/* Mobile backdrop - tap to close */}
      {isOpen && (
        <div
          role="button"
          tabIndex={-1}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-label="Close sidebar"
          className="md:hidden absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"
        />
      )}
      <div
        className="w-80 max-w-[min(320px,85vw)] md:max-w-none h-full animate-sidebar-enter md:relative absolute left-0 top-0 bottom-0 md:left-auto md:top-auto md:bottom-auto z-10 md:z-auto max-h-[calc(100dvh-4rem)] md:max-h-none transition-shadow duration-300"
        onClick={() => onHighlightClear?.()}
      >
        <LiquidGlassSurface
          variant="panel"
          intensity="xl"
          className={cn(
            "relative w-full min-w-0 max-w-80 h-full flex flex-col border-r border-white/30 dark:border-white/15 transition-shadow duration-300",
            isHighlighted &&
              "shadow-[0_0_24px_rgba(59,130,246,0.35)] dark:shadow-[0_0_24px_rgba(59,130,246,0.25)] ring-2 ring-primary/30 ring-inset",
          )}
        >
          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            title="Close sidebar"
            aria-label="Close sidebar"
            className="md:hidden absolute right-0 top-4 translate-x-full z-[60] flex items-center justify-center p-2 rounded-r-xl border border-l-0 border-slate-200/80 dark:border-slate-600/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/90 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <PanelLeftClose size={18} aria-hidden />
          </button>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 pb-2 shrink-0">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search canvases and documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-9 pr-8 py-2 text-sm rounded-lg",
                    "bg-white/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-600/80",
                    "text-slate-700 dark:text-slate-300 placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
              <div className="mb-2">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {projectName}
                </h3>
              </div>

              {onCanvasReorder && canvases.length > 1 && !searchQuery.trim() ? (
                <SortableCanvasList
                  canvases={canvases}
                  onReorder={onCanvasReorder}
                >
                  <div className="space-y-1">
                    {canvases.map((canvas) => {
                      const isExpanded = expandedCanvases.has(canvas.id);
                      const isCurrentCanvas = canvas.id === currentCanvasId;
                      return (
                        <div key={canvas.id}>
                          <SortableCanvasItem
                            id={canvas.id}
                            className={cn(
                              "rounded-lg px-2.5 py-2 group transition-colors duration-200",
                              isCurrentCanvas
                                ? "bg-primary/10"
                                : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                            )}
                            dragHandleClassName="shrink-0 cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-60 hover:opacity-100"
                          >
                            <button
                              type="button"
                              onClick={() => toggleCanvas(canvas.id)}
                              className="p-0.5 shrink-0 -ml-0.5"
                            >
                              {isExpanded ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>
                            {renameCanvasId === canvas.id ? (
                              <input
                                type="text"
                                value={renameCanvasValue}
                                onChange={(e) =>
                                  setRenameCanvasValue(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    onCanvasRename(
                                      canvas.id,
                                      renameCanvasValue.trim() || canvas.name,
                                    );
                                    setRenameCanvasId(null);
                                  }
                                  if (e.key === "Escape")
                                    setRenameCanvasId(null);
                                }}
                                onBlur={() => {
                                  if (renameCanvasValue.trim())
                                    onCanvasRename(
                                      canvas.id,
                                      renameCanvasValue.trim(),
                                    );
                                  setRenameCanvasId(null);
                                }}
                                autoFocus
                                className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm"
                              />
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCanvasClickWithClose(canvas.id)
                                  }
                                  className="flex-1 text-left text-sm truncate min-w-0 flex items-center gap-1.5"
                                >
                                  <LayoutGrid
                                    size={14}
                                    className="shrink-0 text-slate-500"
                                  />
                                  {canvas.name}
                                </button>
                                {onCanvasRename && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRenameCanvasId(canvas.id);
                                      setRenameCanvasValue(canvas.name);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                )}
                                {onCanvasDelete && canvases.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => onCanvasDelete(canvas.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-600 shrink-0"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </>
                            )}
                          </SortableCanvasItem>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={treeTransition}
                              >
                                <div className="ml-6 mt-1 space-y-1 border-l border-slate-200/50 dark:border-slate-600/50 pl-2 overflow-hidden">
                                  {onDocumentReorder &&
                                  canvas.documents.length > 1 ? (
                                    <SortableCanvasList
                                      canvases={canvas.documents}
                                      onReorder={(reordered) =>
                                        onDocumentReorder(canvas.id, reordered)
                                      }
                                    >
                                      <div className="space-y-1">
                                        <AnimatePresence>
                                          {canvas.documents.map((doc) => {
                                            const isCurrent =
                                              isCurrentCanvas &&
                                              doc.id === currentDocumentId;
                                            const isRenaming =
                                              renameDocId === doc.id &&
                                              renameDocCanvasId === canvas.id;
                                            return (
                                              <motion.div
                                                key={doc.id}
                                                layout
                                                initial={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -12 }}
                                                transition={treeTransition}
                                                className="rounded-lg"
                                              >
                                                <SortableCanvasItem
                                                  key={doc.id}
                                                  id={doc.id}
                                                  className={cn(
                                                    "relative rounded-lg px-2.5 py-2 group",
                                                    isCurrent
                                                      ? "text-primary"
                                                      : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                                                  )}
                                                  dragHandleClassName="shrink-0 cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-60 hover:opacity-100"
                                                >
                                                  {isCurrent && (
                                                    <motion.div
                                                      layoutId={`doc-selection-${canvas.id}`}
                                                      className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                                                      transition={
                                                        treeTransition
                                                      }
                                                    />
                                                  )}
                                                  <FileText
                                                    size={14}
                                                    className="shrink-0 text-slate-500"
                                                  />
                                                  {isRenaming ? (
                                                    <input
                                                      type="text"
                                                      value={renameDocValue}
                                                      onChange={(e) =>
                                                        setRenameDocValue(
                                                          e.target.value,
                                                        )
                                                      }
                                                      onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                          onDocumentRename(
                                                            canvas.id,
                                                            doc.id,
                                                            renameDocValue.trim() ||
                                                              doc.name,
                                                          );
                                                          setRenameDocId(null);
                                                          setRenameDocCanvasId(
                                                            null,
                                                          );
                                                        }
                                                        if (
                                                          e.key === "Escape"
                                                        ) {
                                                          setRenameDocId(null);
                                                          setRenameDocCanvasId(
                                                            null,
                                                          );
                                                        }
                                                      }}
                                                      onBlur={() => {
                                                        if (
                                                          renameDocValue.trim()
                                                        )
                                                          onDocumentRename(
                                                            canvas.id,
                                                            doc.id,
                                                            renameDocValue.trim(),
                                                          );
                                                        setRenameDocId(null);
                                                        setRenameDocCanvasId(
                                                          null,
                                                        );
                                                      }}
                                                      autoFocus
                                                      className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm"
                                                    />
                                                  ) : (
                                                    <>
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          handleDocumentClickWithClose(
                                                            canvas.id,
                                                            doc.id,
                                                          )
                                                        }
                                                        className="flex-1 text-left text-sm truncate min-w-0"
                                                      >
                                                        {doc.name}
                                                      </button>
                                                      {onDocumentRename && (
                                                        <button
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            setRenameDocId(
                                                              doc.id,
                                                            );
                                                            setRenameDocCanvasId(
                                                              canvas.id,
                                                            );
                                                            setRenameDocValue(
                                                              doc.name,
                                                            );
                                                          }}
                                                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                                                        >
                                                          <Pencil size={12} />
                                                        </button>
                                                      )}
                                                      {onDocumentDelete && (
                                                        <button
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDocumentDelete(
                                                              canvas.id,
                                                              doc.id,
                                                            );
                                                          }}
                                                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-600 shrink-0"
                                                        >
                                                          <Trash2 size={12} />
                                                        </button>
                                                      )}
                                                    </>
                                                  )}
                                                </SortableCanvasItem>
                                              </motion.div>
                                            );
                                          })}
                                        </AnimatePresence>
                                      </div>
                                    </SortableCanvasList>
                                  ) : (
                                    <>
                                      <AnimatePresence>
                                        {canvas.documents.map((doc) => {
                                          const isCurrent =
                                            isCurrentCanvas &&
                                            doc.id === currentDocumentId;
                                          const isRenaming =
                                            renameDocId === doc.id &&
                                            renameDocCanvasId === canvas.id;
                                          return (
                                            <motion.div
                                              key={doc.id}
                                              layout
                                              initial={{ opacity: 1 }}
                                              exit={{ opacity: 0, x: -12 }}
                                              transition={treeTransition}
                                              className={cn(
                                                "relative flex items-center gap-2 rounded-lg px-2.5 py-2 group",
                                                isCurrent
                                                  ? "text-primary"
                                                  : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                                              )}
                                            >
                                              {isCurrent && (
                                                <motion.div
                                                  layoutId={`doc-selection-${canvas.id}`}
                                                  className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                                                  transition={treeTransition}
                                                />
                                              )}
                                              <FileText
                                                size={14}
                                                className="shrink-0 text-slate-500"
                                              />
                                              {isRenaming ? (
                                                <input
                                                  type="text"
                                                  value={renameDocValue}
                                                  onChange={(e) =>
                                                    setRenameDocValue(
                                                      e.target.value,
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                      onDocumentRename(
                                                        canvas.id,
                                                        doc.id,
                                                        renameDocValue.trim() ||
                                                          doc.name,
                                                      );
                                                      setRenameDocId(null);
                                                      setRenameDocCanvasId(
                                                        null,
                                                      );
                                                    }
                                                    if (e.key === "Escape") {
                                                      setRenameDocId(null);
                                                      setRenameDocCanvasId(
                                                        null,
                                                      );
                                                    }
                                                  }}
                                                  onBlur={() => {
                                                    if (renameDocValue.trim())
                                                      onDocumentRename(
                                                        canvas.id,
                                                        doc.id,
                                                        renameDocValue.trim(),
                                                      );
                                                    setRenameDocId(null);
                                                    setRenameDocCanvasId(null);
                                                  }}
                                                  autoFocus
                                                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm"
                                                />
                                              ) : (
                                                <>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      handleDocumentClickWithClose(
                                                        canvas.id,
                                                        doc.id,
                                                      )
                                                    }
                                                    className="flex-1 text-left text-sm truncate min-w-0"
                                                  >
                                                    {doc.name}
                                                  </button>
                                                  {onDocumentRename && (
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRenameDocId(doc.id);
                                                        setRenameDocCanvasId(
                                                          canvas.id,
                                                        );
                                                        setRenameDocValue(
                                                          doc.name,
                                                        );
                                                      }}
                                                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                                                    >
                                                      <Pencil size={12} />
                                                    </button>
                                                  )}
                                                  {onDocumentDelete && (
                                                    <button
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDocumentDelete(
                                                          canvas.id,
                                                          doc.id,
                                                        );
                                                      }}
                                                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-600 shrink-0"
                                                    >
                                                      <Trash2 size={12} />
                                                    </button>
                                                  )}
                                                </>
                                              )}
                                            </motion.div>
                                          );
                                        })}
                                      </AnimatePresence>
                                    </>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => onDocumentCreate(canvas.id)}
                                    className="w-full flex items-center gap-2 px-2.5 py-2 mt-2 text-xs text-primary hover:bg-primary/10 rounded-lg"
                                  >
                                    <Plus size={12} />
                                    New document
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </SortableCanvasList>
              ) : (
                <div className="space-y-1">
                  {filteredCanvases.map((canvas) => {
                    const isExpanded = expandedCanvases.has(canvas.id);
                    const isCurrentCanvas = canvas.id === currentCanvasId;
                    return (
                      <div key={canvas.id}>
                        <div
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-2 group transition-colors duration-200",
                            isCurrentCanvas
                              ? "bg-primary/10"
                              : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => toggleCanvas(canvas.id)}
                            className="p-0.5 shrink-0 -ml-0.5"
                          >
                            {isExpanded ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleCanvasClickWithClose(canvas.id)
                            }
                            className="flex-1 text-left text-sm truncate min-w-0 flex items-center gap-1.5"
                          >
                            <LayoutGrid
                              size={14}
                              className="shrink-0 text-slate-500"
                            />
                            {canvas.name}
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={treeTransition}
                            >
                              <div className="ml-6 mt-1 space-y-1 border-l border-slate-200/50 dark:border-slate-600/50 pl-2 overflow-hidden">
                                <AnimatePresence>
                                  {canvas.documents.map((doc) => {
                                    const isCurrent =
                                      isCurrentCanvas &&
                                      doc.id === currentDocumentId;
                                    const isRenaming =
                                      renameDocId === doc.id &&
                                      renameDocCanvasId === canvas.id;
                                    return (
                                      <motion.div
                                        key={doc.id}
                                        layout
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -12 }}
                                        transition={treeTransition}
                                        className={cn(
                                          "relative flex items-center gap-2 rounded-lg px-2.5 py-2 group",
                                          isCurrent
                                            ? "text-primary"
                                            : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                                        )}
                                      >
                                        {isCurrent && (
                                          <motion.div
                                            layoutId={`doc-selection-${canvas.id}`}
                                            className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                                            transition={treeTransition}
                                          />
                                        )}
                                        <FileText
                                          size={14}
                                          className="shrink-0 text-slate-500"
                                        />
                                        {isRenaming ? (
                                          <input
                                            type="text"
                                            value={renameDocValue}
                                            onChange={(e) =>
                                              setRenameDocValue(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                onDocumentRename(
                                                  canvas.id,
                                                  doc.id,
                                                  renameDocValue.trim() ||
                                                    doc.name,
                                                );
                                                setRenameDocId(null);
                                                setRenameDocCanvasId(null);
                                              }
                                              if (e.key === "Escape") {
                                                setRenameDocId(null);
                                                setRenameDocCanvasId(null);
                                              }
                                            }}
                                            onBlur={() => {
                                              if (renameDocValue.trim())
                                                onDocumentRename(
                                                  canvas.id,
                                                  doc.id,
                                                  renameDocValue.trim(),
                                                );
                                              setRenameDocId(null);
                                              setRenameDocCanvasId(null);
                                            }}
                                            autoFocus
                                            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm"
                                          />
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleDocumentClickWithClose(
                                                  canvas.id,
                                                  doc.id,
                                                )
                                              }
                                              className="flex-1 text-left text-sm truncate min-w-0"
                                            >
                                              {doc.name}
                                            </button>
                                            {onDocumentRename && (
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setRenameDocId(doc.id);
                                                  setRenameDocCanvasId(
                                                    canvas.id,
                                                  );
                                                  setRenameDocValue(doc.name);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                                              >
                                                <Pencil size={12} />
                                              </button>
                                            )}
                                            {onDocumentDelete && (
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  onDocumentDelete(
                                                    canvas.id,
                                                    doc.id,
                                                  );
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-600 shrink-0"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            )}
                                          </>
                                        )}
                                      </motion.div>
                                    );
                                  })}
                                </AnimatePresence>
                                <button
                                  type="button"
                                  onClick={() => onDocumentCreate(canvas.id)}
                                  className="w-full flex items-center gap-2 px-2.5 py-2 mt-2 text-xs text-primary hover:bg-primary/10 rounded-lg"
                                >
                                  <Plus size={12} />
                                  New document
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent documents */}
            {filteredRecent.length > 0 && (
              <div className="shrink-0 border-t border-slate-200/50 dark:border-slate-600/50 p-4 pt-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Recent
                </h3>
                <div className="space-y-1">
                  {filteredRecent.map((doc) => (
                    <button
                      key={`${doc.canvasId}-${doc.documentId}`}
                      type="button"
                      onClick={() => handleRecentClickWithClose(doc)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    >
                      <FileText size={14} className="shrink-0 text-slate-500" />
                      <span className="truncate">
                        {doc.documentName}
                        <span className="text-slate-400 text-xs ml-1">
                          ({doc.canvasName})
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </LiquidGlassSurface>
      </div>
    </div>
  );
}
