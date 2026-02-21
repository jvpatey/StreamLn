"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getTagContent,
  getTagDisplayLabel,
  type TagBlockContent,
} from "./tag-defaults";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
  width?: number;
}

interface TagBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
  isSelected?: boolean;
  /** Rendered at the end of the tag pill (e.g. menu button) */
  trailingAction?: React.ReactNode;
}

const DEFAULT_TAG_COLOR = "#ef4444";
const MAX_LABEL_LENGTH = 30;
const MIN_TAG_WIDTH = 96;
const WRAPPER_PADDING_X = 32;
/** Extra width for selection ring (ring-2 inset) and scale when editing/dragging */
const SELECTION_BUFFER = 12;

const chipStyle = (tagColor: string) => ({
  backgroundColor: `${tagColor}20`,
  color: tagColor,
  borderColor: `${tagColor}40`,
});

export function TagBlock({
  block,
  onUpdate,
  isEditable,
  isSelected = false,
  trailingAction,
}: TagBlockProps) {
  const content = getTagContent(block.content);
  const [label, setLabel] = useState(content.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const showInput = isEditable && isSelected;
  const showChip = !showInput;
  const displayLabel = getTagDisplayLabel(content);

  useEffect(() => {
    const c = getTagContent(block.content);
    setLabel(c.label);
  }, [block.content]);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  useEffect(() => {
    if (!showChip) return;
    const measure = () => {
      const measureEl = measureRef.current;
      if (!measureEl) return;
      const blockWidth = typeof block.width === "number" ? block.width : 240;
      const contentWidth = measureEl.scrollWidth;
      const chipPaddingX = 24;
      const newWidth = Math.ceil(
        contentWidth + chipPaddingX + WRAPPER_PADDING_X + SELECTION_BUFFER
      );
      const clamped = Math.max(
        MIN_TAG_WIDTH,
        Math.min(newWidth, 5000)
      );
      if (clamped !== blockWidth) {
        onUpdateRef.current({ width: clamped });
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }, [showChip, block.width, displayLabel]);

  const stripLeadingHash = (s: string) => s.replace(/^#+/, "").trim();

  const persistContent = useCallback((nextLabel: string) => {
    const trimmed = stripLeadingHash(nextLabel);
    const updates: Partial<CanvasBlock> = {
      content: { label: trimmed } as TagBlockContent,
    };
    updates.title = trimmed || undefined;
    onUpdateRef.current(updates);
  }, []);

  const handleBlur = useCallback(() => {
    persistContent(label);
  }, [label, persistContent]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(stripLeadingHash(e.target.value));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      }
    },
    []
  );

  const tagColor = block.color || DEFAULT_TAG_COLOR;
  const style = chipStyle(tagColor);

  const pillContent = showChip ? (
    <>
      <span
        ref={measureRef}
        className="invisible absolute whitespace-nowrap text-sm font-medium"
        aria-hidden
      >
        {displayLabel || "No tag"}
      </span>
      <div className="relative inline-flex">
        <div
          ref={chipRef}
          className="inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-medium border"
          style={style}
        >
          <span className="whitespace-nowrap">
            {displayLabel || "No tag"}
          </span>
        </div>
        {trailingAction && (
          <span
            className="absolute left-full top-1/2 -translate-y-1/2 ml-0.5 flex items-center"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {trailingAction}
          </span>
        )}
      </div>
    </>
  ) : (
    <div className="relative inline-flex">
      <div
        className="inline-flex w-fit min-w-[8rem] max-w-full items-center rounded-full border px-3 py-1.5 text-sm font-medium focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary/50"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="shrink-0 select-none" aria-hidden>
          #
        </span>
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag…"
          aria-label="Tag label"
          maxLength={MAX_LABEL_LENGTH}
          className="min-w-0 flex-1 bg-transparent placeholder:opacity-70 focus:outline-none"
          style={{ color: "inherit" }}
        />
      </div>
      {trailingAction && (
        <span
          className="absolute left-full top-1/2 -translate-y-1/2 ml-0.5 flex items-center"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {trailingAction}
        </span>
      )}
    </div>
  );

  return (
    <div className="h-full min-h-0 flex items-center overflow-visible px-4 py-3">
      {pillContent}
    </div>
  );
}
