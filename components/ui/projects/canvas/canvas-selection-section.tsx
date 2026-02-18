"use client";

import React from "react";
import { Checkbox } from "@/components/ui/shared/checkbox";
import { Tooltip } from "@/components/ui/shared/tooltip";
import type { ExportProjectData } from "@/lib/api/project-export";

interface CanvasSelectionSectionProps {
  canvases: ExportProjectData["canvases"];
  selectedCanvasIds: Set<string>;
  excludeEmptyCanvases: boolean;
  onExcludeEmptyChange: (value: boolean) => void;
  onToggleCanvas: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  allSelected: boolean;
  noneSelected: boolean;
  hasCanvasesToExport: boolean;
}

export function CanvasSelectionSection({
  canvases,
  selectedCanvasIds,
  excludeEmptyCanvases,
  onExcludeEmptyChange,
  onToggleCanvas,
  onSelectAll,
  onDeselectAll,
  allSelected,
  noneSelected,
  hasCanvasesToExport,
}: CanvasSelectionSectionProps) {
  return (
    <div className="space-y-4 pb-4 border-b border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Choose canvases to export
      </p>
      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={excludeEmptyCanvases}
          onCheckedChange={onExcludeEmptyChange}
        />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Exclude empty canvases
        </span>
      </label>
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          onClick={onSelectAll}
          className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={allSelected}
        >
          Select all
        </button>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <button
          type="button"
          onClick={onDeselectAll}
          className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={noneSelected}
        >
          Deselect all
        </button>
      </div>
      <div className="max-h-48 min-h-32 overflow-y-auto space-y-1">
        {canvases.map((canvas) => {
          const isEmpty = canvas.blocks.length === 0;
          return (
            <label
              key={canvas.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Checkbox
                checked={selectedCanvasIds.has(canvas.id)}
                onCheckedChange={() => onToggleCanvas(canvas.id)}
              />
              <Tooltip content={canvas.name} side="top">
                <span className="flex-1 min-w-0 truncate text-sm text-slate-900 dark:text-slate-100 cursor-default">
                  {canvas.name}
                </span>
              </Tooltip>
              <span
                className={`text-xs shrink-0 ${
                  isEmpty
                    ? "text-slate-400 dark:text-slate-500"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {isEmpty ? "Empty" : `${canvas.blocks.length} blocks`}
              </span>
            </label>
          );
        })}
      </div>
      {!hasCanvasesToExport && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Select at least one canvas to export
        </p>
      )}
    </div>
  );
}
