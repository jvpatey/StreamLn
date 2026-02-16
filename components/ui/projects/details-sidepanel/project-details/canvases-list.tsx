"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ExternalLink, Layout, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shared/card";
import { fetchCanvases, updateCanvas, reorderCanvases } from "@/lib/api/canvas";
import type { Canvas } from "@/lib/types/canvas";
import { Project } from "./types";
import {
  SortableCanvasList,
  SortableCanvasItem,
} from "@/components/ui/projects/canvas/sortable-canvas-list";

interface CanvasesListProps {
  project: Project;
  onOpenCanvas: (project: Project, canvasId: string) => void;
}

export function CanvasesList({ project, onOpenCanvas }: CanvasesListProps) {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCanvases(project.id);
        if (!cancelled) setCanvases(data);
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

  const handleStartEdit = (canvas: Canvas) => {
    setEditingCanvasId(canvas.id);
    setEditName(canvas.name);
  };

  const handleSaveEdit = async () => {
    if (!editingCanvasId || !editName.trim()) {
      setEditingCanvasId(null);
      return;
    }
    try {
      const updated = await updateCanvas(project.id, editingCanvasId, {
        name: editName.trim(),
      });
      setCanvases((prev) =>
        prev.map((c) => (c.id === editingCanvasId ? updated : c))
      );
    } catch {
      // Keep edit mode on error so user can retry
    } finally {
      setEditingCanvasId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCanvasId(null);
  };

  const handleReorder = async (reordered: Canvas[]) => {
    setCanvases(reordered);
    try {
      const updated = await reorderCanvases(
        project.id,
        reordered.map((c, i) => ({ id: c.id, order: i }))
      );
      if (updated.length) setCanvases(updated);
    } catch {
      // Keep optimistic update on error
    }
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-2xl 
        bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
        dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
        border border-white/30 dark:border-white/20 rounded-xl">
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

  return (
    <Card className="backdrop-blur-2xl 
      bg-gradient-to-br from-primary-500/10 via-primary-400/15 to-accent-500/10 
      dark:from-primary-500/5 dark:via-primary-400/10 dark:to-accent-500/5
      border border-white/30 dark:border-white/20
      hover:border-white/40 dark:hover:border-white/30
      transition-all duration-200 hover:shadow-xl rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Layout size={14} />
          Canvases
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {canvases.length > 1 ? (
          <SortableCanvasList canvases={canvases} onReorder={handleReorder}>
            <div className="space-y-1.5">
            {canvases.map((canvas) => (
              <SortableCanvasItem
                key={canvas.id}
                id={canvas.id}
                className="justify-between gap-2 rounded-lg px-3 py-2
                  backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                  border border-white/20 dark:border-slate-700/20
                  hover:border-white/30 dark:hover:border-slate-600/30 transition-colors"
                dragHandleClassName="shrink-0 cursor-grab active:cursor-grabbing p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-white/30 dark:hover:text-slate-300 dark:hover:bg-slate-700/50 touch-none opacity-60 hover:opacity-100"
              >
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  {editingCanvasId === canvas.id ? (
                    <>
                      <input
                        ref={inputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") handleCancelEdit();
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
                        onClick={handleSaveEdit}
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
                        onClick={handleCancelEdit}
                        aria-label="Cancel"
                      >
                        <X size={14} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex-1">
                        {canvas.name}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-lg
                            hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                            text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          onClick={() => handleStartEdit(canvas)}
                          aria-label="Edit canvas name"
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 rounded-lg
                            backdrop-blur-sm bg-primary/10 dark:bg-primary/20
                            hover:bg-primary/20 dark:hover:bg-primary/30
                            text-primary text-xs font-medium"
                          onClick={() => onOpenCanvas(project, canvas.id)}
                        >
                          <ExternalLink size={12} className="mr-1" />
                          Open
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SortableCanvasItem>
            ))}
            </div>
          </SortableCanvasList>
        ) : (
          canvases.map((canvas) => (
            <div
              key={canvas.id}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2
                backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
                border border-white/20 dark:border-slate-700/20
                hover:border-white/30 dark:hover:border-slate-600/30 transition-colors"
            >
              {editingCanvasId === canvas.id ? (
                <>
                  <input
                    ref={inputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
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
                    onClick={handleSaveEdit}
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
                    onClick={handleCancelEdit}
                    aria-label="Cancel"
                  >
                    <X size={14} />
                  </Button>
                </>
              ) : (
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex-1">
                  {canvas.name}
                </span>
              )}
              <div className="flex items-center gap-1 shrink-0">
                {editingCanvasId !== canvas.id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-lg
                        hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                        text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      onClick={() => handleStartEdit(canvas)}
                      aria-label="Edit canvas name"
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 rounded-lg
                        backdrop-blur-sm bg-primary/10 dark:bg-primary/20
                        hover:bg-primary/20 dark:hover:bg-primary/30
                        text-primary text-xs font-medium"
                      onClick={() => onOpenCanvas(project, canvas.id)}
                    >
                      <ExternalLink size={12} className="mr-1" />
                      Open
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </CardContent>
    </Card>
  );
}
