"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Layout,
  Pencil,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";
import {
  fetchProjectDocuments,
  updateCanvas,
  updateDocument,
  deleteDocument,
  reorderCanvases,
} from "@/lib/api/canvas";
import type { ProjectDocumentTree } from "@/lib/api/canvas";
import { Project } from "./types";
import {
  SortableCanvasList,
  SortableCanvasItem,
} from "@/components/ui/projects/canvas/sortable-canvas-list";
import { CanvasExportFromListModal } from "@/components/ui/projects/canvas/canvas-export-from-list-modal";
import { ShareCanvasModal } from "@/components/ui/projects/canvas/share-canvas-modal";
import { DocumentDeleteConfirmDialog } from "./document-delete-confirm-dialog";
import { cn } from "@/lib/utils";

type CanvasWithDocs = ProjectDocumentTree["canvases"][number];

interface CanvasesListProps {
  project: Project;
  onOpenCanvas: (project: Project, canvasId: string, documentId?: string) => void;
}

export function CanvasesList({ project, onOpenCanvas }: CanvasesListProps) {
  const [canvases, setCanvases] = useState<CanvasWithDocs[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCanvasIds, setExpandedCanvasIds] = useState<Set<string>>(
    () => new Set()
  );
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingDocCanvasId, setEditingDocCanvasId] = useState<string | null>(
    null
  );
  const [editDocName, setEditDocName] = useState("");
  const [exportCanvasId, setExportCanvasId] = useState<string | null>(null);
  const [shareCanvasId, setShareCanvasId] = useState<string | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{
    canvasId: string;
    documentId: string;
    name: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProjectDocuments(project.id);
        if (!cancelled) setCanvases(data.canvases);
      } catch {
        if (!cancelled) setCanvases([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [project.id]);

  useEffect(() => {
    if (editingCanvasId) {
      const canvas = canvases.find((c) => c.id === editingCanvasId);
      setEditName(canvas?.name ?? "");
      inputRef.current?.focus();
    }
  }, [editingCanvasId, canvases]);

  useEffect(() => {
    if (editingDocId && editingDocCanvasId) {
      const canvas = canvases.find((c) => c.id === editingDocCanvasId);
      const doc = canvas?.documents.find((d) => d.id === editingDocId);
      setEditDocName(doc?.name ?? "");
      docInputRef.current?.focus();
    }
  }, [editingDocId, editingDocCanvasId, canvases]);

  const toggleCanvas = (canvasId: string) => {
    setExpandedCanvasIds((prev) => {
      const next = new Set(prev);
      if (next.has(canvasId)) next.delete(canvasId);
      else next.add(canvasId);
      return next;
    });
  };

  const handleStartEditCanvas = (canvas: CanvasWithDocs) => {
    setEditingCanvasId(canvas.id);
    setEditName(canvas.name);
  };

  const handleSaveCanvasEdit = async () => {
    if (!editingCanvasId || !editName.trim()) {
      setEditingCanvasId(null);
      return;
    }
    try {
      const updated = await updateCanvas(project.id, editingCanvasId, {
        name: editName.trim(),
      });
      setCanvases((prev) =>
        prev.map((c) =>
          c.id === editingCanvasId ? { ...c, name: updated.name } : c
        )
      );
    } catch {
      // Keep edit mode on error so user can retry
    } finally {
      setEditingCanvasId(null);
    }
  };

  const handleCancelCanvasEdit = () => setEditingCanvasId(null);

  const handleStartEditDoc = (
    canvasId: string,
    doc: { id: string; name: string; order: number }
  ) => {
    setEditingDocCanvasId(canvasId);
    setEditingDocId(doc.id);
    setEditDocName(doc.name);
  };

  const handleSaveDocEdit = async () => {
    if (!editingDocCanvasId || !editingDocId || !editDocName.trim()) {
      setEditingDocCanvasId(null);
      setEditingDocId(null);
      return;
    }
    try {
      await updateDocument(
        project.id,
        editingDocCanvasId,
        editingDocId,
        { name: editDocName.trim() }
      );
      setCanvases((prev) =>
        prev.map((c) => {
          if (c.id !== editingDocCanvasId) return c;
          return {
            ...c,
            documents: c.documents.map((d) =>
              d.id === editingDocId ? { ...d, name: editDocName.trim() } : d
            ),
          };
        })
      );
    } catch {
      // Keep edit mode on error
    } finally {
      setEditingDocCanvasId(null);
      setEditingDocId(null);
    }
  };

  const handleCancelDocEdit = () => {
    setEditingDocCanvasId(null);
    setEditingDocId(null);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    const { canvasId, documentId } = documentToDelete;
    try {
      await deleteDocument(project.id, canvasId, documentId);
      setCanvases((prev) =>
        prev.map((c) => {
          if (c.id !== canvasId) return c;
          return {
            ...c,
            documents: c.documents.filter((d) => d.id !== documentId),
          };
        })
      );
    } catch {
      // Could show toast
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleReorder = async (reordered: CanvasWithDocs[]) => {
    setCanvases(reordered);
    try {
      const updated = await reorderCanvases(
        project.id,
        reordered.map((c, i) => ({ id: c.id, order: i }))
      );
      if (updated.length) {
        setCanvases((prev) =>
          prev.map((c, i) => {
            const u = updated.find((x) => x.id === c.id);
            return u ? { ...c, ...u, documents: c.documents } : c;
          })
        );
      }
    } catch {
      // Keep optimistic update on error
    }
  };

  if (loading) {
    return (
      <Card
        className="backdrop-blur-2xl 
        bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
        dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
        border border-white/30 dark:border-white/20 rounded-xl"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layout size={14} />
            Canvases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (canvases.length === 0) return null;

  const exportCanvas = exportCanvasId
    ? canvases.find((c) => c.id === exportCanvasId)
    : null;
  const shareCanvas = shareCanvasId
    ? canvases.find((c) => c.id === shareCanvasId)
    : null;

  const renderCanvasRow = (canvas: CanvasWithDocs) => {
    const isExpanded = expandedCanvasIds.has(canvas.id);
    const hasDocuments = canvas.documents.length > 0;

    return (
      <div key={canvas.id} className="flex-1 min-w-0 space-y-1">
        <div
            className={cn(
              "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 rounded-lg px-3 py-2 min-h-[44px]",
              "backdrop-blur-sm bg-white/30 dark:bg-slate-800/30",
            "border border-white/20 dark:border-slate-700/20",
            "hover:border-white/30 dark:hover:border-slate-600/30 transition-colors"
          )}
        >
          <div className="flex-1 min-w-0 flex items-center gap-2 order-1">
            <button
              type="button"
              onClick={() => toggleCanvas(canvas.id)}
              className="shrink-0 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-2 -m-1 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {hasDocuments ? (
                isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )
              ) : (
                <span className="w-[14px] inline-block" />
              )}
            </button>
            <AnimatePresence mode="wait">
              {editingCanvasId === canvas.id ? (
                <motion.div
                  key={`${canvas.id}-edit`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex-1 min-w-0 flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCanvasEdit();
                      if (e.key === "Escape") handleCancelCanvasEdit();
                    }}
                    className="flex-1 min-w-0 text-sm font-medium text-slate-900 dark:text-slate-100
                      bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600
                      rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg shrink-0
                      bg-primary/20 dark:bg-primary/30 text-primary
                      hover:bg-primary/30 dark:hover:bg-primary/40"
                    onClick={handleSaveCanvasEdit}
                    aria-label="Save"
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-lg shrink-0
                      hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                      text-slate-500 dark:text-slate-400"
                    onClick={handleCancelCanvasEdit}
                    aria-label="Cancel"
                  >
                    <X size={14} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${canvas.id}-view`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex-1 min-w-0 flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => onOpenCanvas(project, canvas.id)}
                    className="text-left text-sm font-medium text-slate-900 dark:text-slate-100 truncate block min-w-0 cursor-pointer hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded"
                    title={`Open ${canvas.name}`}
                  >
                    {canvas.name}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {editingCanvasId !== canvas.id && (
          <div className="flex items-center gap-1 shrink-0 order-2 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px] min-w-[44px] h-9 w-9 sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0 p-0 rounded-lg
                        hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                        text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      onClick={() => handleStartEditCanvas(canvas)}
                      aria-label="Edit canvas name"
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px] min-w-[44px] h-9 w-9 sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0 p-0 rounded-lg
                        hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                        text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      onClick={() => setExportCanvasId(canvas.id)}
                      aria-label="Export canvas"
                    >
                      <Download size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="min-h-[44px] min-w-[44px] h-9 w-9 sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0 p-0 rounded-lg
                        hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                        text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      onClick={() => setShareCanvasId(canvas.id)}
                      aria-label="Share canvas"
                    >
                      <Share2 size={12} />
                    </Button>
                    <Button
                      size="sm"
                      className="min-h-[44px] sm:min-h-0 h-9 sm:h-7 px-3 sm:px-2.5 rounded-lg
                        bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/30 dark:via-primary-400/35 dark:to-accent-500/30
                        hover:from-primary-500/35 hover:via-primary-400/40 hover:to-accent-500/35 dark:hover:from-primary-500/40 dark:hover:via-primary-400/45 dark:hover:to-accent-500/40
                        border border-primary-400/40 dark:border-primary-400/50
                        text-slate-900 dark:text-white text-xs font-semibold
                        shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() => onOpenCanvas(project, canvas.id)}
                    >
                      <ExternalLink size={12} className="mr-1" />
                      Open
                    </Button>
                  </div>
          )}
        </div>

        {isExpanded && hasDocuments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-6 space-y-1"
          >
            {canvas.documents.map((doc) => (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 ml-2 min-h-[44px]",
                  "backdrop-blur-sm bg-white/20 dark:bg-slate-800/20",
                  "border border-white/15 dark:border-slate-700/30",
                  "hover:border-white/25 dark:hover:border-slate-600/40 transition-colors"
                )}
              >
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <FileText
                    size={12}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                  />
                  <AnimatePresence mode="wait">
                    {editingDocId === doc.id &&
                    editingDocCanvasId === canvas.id ? (
                      <motion.div
                        key={`${doc.id}-edit`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="flex-1 min-w-0 flex items-center gap-2"
                      >
                        <input
                          ref={docInputRef}
                          type="text"
                          value={editDocName}
                          onChange={(e) => setEditDocName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveDocEdit();
                            if (e.key === "Escape") handleCancelDocEdit();
                          }}
                          className="flex-1 min-w-0 text-sm text-slate-900 dark:text-slate-100
                            bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600
                            rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded shrink-0
                            bg-primary/20 dark:bg-primary/30 text-primary"
                          onClick={handleSaveDocEdit}
                          aria-label="Save"
                        >
                          <Check size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded shrink-0
                            hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                            text-slate-500 dark:text-slate-400"
                          onClick={handleCancelDocEdit}
                          aria-label="Cancel"
                        >
                          <X size={12} />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`${doc.id}-view`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        className="flex-1 min-w-0 flex items-center justify-between gap-2"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onOpenCanvas(project, canvas.id, doc.id)
                          }
                          className="text-left text-sm text-slate-700 dark:text-slate-300 truncate flex-1 cursor-pointer hover:text-primary dark:hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded"
                          title={`Open ${doc.name}`}
                        >
                          {doc.name}
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded
                              hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                              text-slate-500 dark:text-slate-400"
                            onClick={() => handleStartEditDoc(canvas.id, doc)}
                            aria-label="Edit document name"
                          >
                            <Pencil size={11} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded
                              hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                              text-slate-500 dark:text-slate-400"
                            onClick={() =>
                              setDocumentToDelete({
                                canvasId: canvas.id,
                                documentId: doc.id,
                                name: doc.name,
                              })
                            }
                            aria-label="Delete document"
                          >
                            <Trash2 size={11} />
                          </Button>
                          <Button
                            size="sm"
                            className="h-6 px-2 rounded
                              bg-gradient-to-r from-primary-500/25 via-primary-400/30 to-accent-500/25 dark:from-primary-500/30 dark:via-primary-400/35 dark:to-accent-500/30
                              hover:from-primary-500/35 hover:via-primary-400/40 hover:to-accent-500/35 dark:hover:from-primary-500/40 dark:hover:via-primary-400/45 dark:hover:to-accent-500/40
                              border border-primary-400/40 dark:border-primary-400/50
                              text-slate-900 dark:text-white text-xs font-semibold
                              shadow-sm hover:shadow-md transition-all duration-200"
                            onClick={() =>
                              onOpenCanvas(project, canvas.id, doc.id)
                            }
                          >
                            <ExternalLink size={11} className="mr-0.5" />
                            Open
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card
        className="backdrop-blur-2xl 
        bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
        dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
        border border-white/30 dark:border-white/20
        hover:border-white/40 dark:hover:border-white/30
        transition-all duration-200 hover:shadow-xl rounded-xl"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Layout size={14} />
            Canvases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {canvases.length > 1 ? (
              <SortableCanvasList canvases={canvases} onReorder={handleReorder}>
                <div className="space-y-1.5">
                  {canvases.map((canvas) => (
                    <SortableCanvasItem
                      key={canvas.id}
                      id={canvas.id}
                      className="!gap-0"
                      dragHandleClassName="shrink-0 cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-white/30 dark:hover:text-slate-300 dark:hover:bg-slate-700/50 touch-none opacity-60 hover:opacity-100"
                    >
                      {renderCanvasRow(canvas)}
                    </SortableCanvasItem>
                  ))}
                </div>
              </SortableCanvasList>
            ) : (
              canvases.map((canvas) => renderCanvasRow(canvas))
            )}
          </div>
        </CardContent>
      </Card>

      {exportCanvas && (
        <CanvasExportFromListModal
          open={!!exportCanvasId}
          onOpenChange={(open) => !open && setExportCanvasId(null)}
          project={{
            id: project.id,
            name: project.name,
            description: project.description,
            icon: project.icon,
            status: project.status,
          }}
          canvas={{
            id: exportCanvas.id,
            name: exportCanvas.name,
            order: exportCanvas.order,
            projectId: project.id,
          }}
        />
      )}

      {shareCanvas && (
        <ShareCanvasModal
          open={!!shareCanvasId}
          onOpenChange={(open) => !open && setShareCanvasId(null)}
          projectId={project.id}
          canvasId={shareCanvas.id}
          projectName={project.name}
          canvasName={shareCanvas.name}
        />
      )}

      {documentToDelete && (
        <DocumentDeleteConfirmDialog
          open={!!documentToDelete}
          documentName={documentToDelete.name}
          onCancel={() => setDocumentToDelete(null)}
          onConfirm={handleDeleteDocument}
        />
      )}
    </>
  );
}
