"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Layout } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import { fetchCanvases } from "@/lib/api/canvas";
import type { Canvas } from "@/lib/types/canvas";
import { Project } from "./types";

interface CanvasesListProps {
  project: Project;
  onOpenCanvas: (project: Project, canvasId: string) => void;
}

export function CanvasesList({ project, onOpenCanvas }: CanvasesListProps) {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Layout size={14} />
          Canvases
        </h3>
        <div className="h-20 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 animate-pulse" />
      </div>
    );
  }

  if (canvases.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Layout size={14} />
        Canvases
      </h3>
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {canvases.map((canvas) => (
          <div
            key={canvas.id}
            className="flex items-center justify-between gap-2 rounded-lg px-3 py-2
              backdrop-blur-sm bg-white/30 dark:bg-slate-800/30
              border border-white/20 dark:border-slate-700/20
              hover:border-white/30 dark:hover:border-slate-600/30 transition-colors"
          >
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex-1">
              {canvas.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 rounded-lg shrink-0
                backdrop-blur-sm bg-primary/10 dark:bg-primary/20
                hover:bg-primary/20 dark:hover:bg-primary/30
                text-primary text-xs font-medium"
              onClick={() => onOpenCanvas(project, canvas.id)}
            >
              <ExternalLink size={12} className="mr-1" />
              Open
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
