"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shared/button";
import { getLiquidGlassSurfaceClassName } from "@/components/ui/shared/liquid-glass-surface";
import {
  getTextContent,
  type TextBlockContent,
} from "./text-defaults";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
}

interface TextBlockFormatBarProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
}

const TEXT_FONTS = [
  { label: "System", value: "system-ui" },
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Mono", value: "ui-monospace, monospace" },
];

const TEXT_SIZES = [12, 14, 16, 18, 24];

const QUICK_COLORS = [
  "#1e293b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#64748b",
];

function updateContent(
  block: CanvasBlock,
  onUpdate: (u: Partial<CanvasBlock>) => void,
  updates: Partial<TextBlockContent>
) {
  const content = getTextContent(block.content);
  onUpdate({ content: { ...content, ...updates } as TextBlockContent });
}

export function TextBlockFormatBar({ block, onUpdate }: TextBlockFormatBarProps) {
  const [fontOpen, setFontOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const content = getTextContent(block.content);

  return (
    <div
      className="flex items-center gap-1 px-2 py-1.5 bg-slate-50/80 dark:bg-slate-800/50"
      data-no-block-drag
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Font */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setFontOpen(!fontOpen);
            setColorOpen(false);
          }}
          className="h-7 px-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 min-w-[4rem]"
          title="Font"
        >
          {TEXT_FONTS.find((f) => f.value === content.fontFamily)?.label ?? "Font"}
        </Button>
        {fontOpen && (
          <div
            className={getLiquidGlassSurfaceClassName({
              variant: "popover",
              intensity: "xl",
              rounded: "lg",
              className: "absolute top-full left-0 mt-1 py-1 min-w-[7rem] z-50",
            })}
          >
            {TEXT_FONTS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  updateContent(block, onUpdate, { fontFamily: f.value });
                  setFontOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="flex items-center gap-0.5">
        {TEXT_SIZES.map((size) => (
          <Button
            key={size}
            variant={content.fontSize === size ? "default" : "ghost"}
            size="sm"
            onClick={() => updateContent(block, onUpdate, { fontSize: size })}
            className={`h-7 w-7 p-0 text-xs ${
              content.fontSize === size
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "text-slate-600 dark:text-slate-400"
            }`}
            title={`${size}px`}
          >
            {size}
          </Button>
        ))}
      </div>

      {/* Text color */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setColorOpen(!colorOpen);
            setFontOpen(false);
          }}
          className="h-7 w-7 p-0"
          title="Text color"
        >
          <span
            className="block w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
            style={{ backgroundColor: content.color ?? "hsl(var(--foreground))" }}
          />
        </Button>
        {colorOpen && (
          <div
            className={getLiquidGlassSurfaceClassName({
              variant: "popover",
              intensity: "xl",
              rounded: "lg",
              className: "absolute top-full left-0 mt-1 p-2 z-50",
            })}
          >
            <div className="grid grid-cols-4 gap-1">
              {QUICK_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    updateContent(block, onUpdate, { color });
                    setColorOpen(false);
                  }}
                  className="w-6 h-6 rounded border border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Text alignment */}
      <div className="flex items-center gap-0.5 ml-0.5">
        <Button
          variant={content.textAlign === "left" ? "default" : "ghost"}
          size="sm"
          onClick={() => updateContent(block, onUpdate, { textAlign: "left" })}
          className={`h-7 w-7 p-0 ${
            content.textAlign === "left"
              ? "bg-primary-600 hover:bg-primary-700 text-white"
              : "text-slate-600 dark:text-slate-400"
          }`}
          title="Align left"
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          variant={content.textAlign === "center" ? "default" : "ghost"}
          size="sm"
          onClick={() => updateContent(block, onUpdate, { textAlign: "center" })}
          className={`h-7 w-7 p-0 ${
            content.textAlign === "center"
              ? "bg-primary-600 hover:bg-primary-700 text-white"
              : "text-slate-600 dark:text-slate-400"
          }`}
          title="Align center"
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          variant={content.textAlign === "right" ? "default" : "ghost"}
          size="sm"
          onClick={() => updateContent(block, onUpdate, { textAlign: "right" })}
          className={`h-7 w-7 p-0 ${
            content.textAlign === "right"
              ? "bg-primary-600 hover:bg-primary-700 text-white"
              : "text-slate-600 dark:text-slate-400"
          }`}
          title="Align right"
        >
          <AlignRight size={14} />
        </Button>
      </div>
    </div>
  );
}
