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
}

interface TagBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

const DEFAULT_TAG_COLOR = "#ef4444";
const MAX_LABEL_LENGTH = 30;

const chipStyle = (tagColor: string) => ({
  backgroundColor: `${tagColor}20`,
  color: tagColor,
  borderColor: `${tagColor}40`,
});

export function TagBlock({ block, onUpdate, isEditable }: TagBlockProps) {
  const content = getTagContent(block.content);
  const [label, setLabel] = useState(content.label);
  const inputRef = useRef<HTMLInputElement>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const c = getTagContent(block.content);
    setLabel(c.label);
  }, [block.content]);

  const persistContent = useCallback((nextLabel: string) => {
    const trimmed = nextLabel.trim();
    const updates: Partial<CanvasBlock> = {
      content: { label: trimmed } as TagBlockContent,
    };
    updates.title = trimmed || undefined;
    onUpdateRef.current(updates);
  }, []);

  const handleBlur = useCallback(() => {
    persistContent(label);
  }, [label, persistContent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current?.blur();
      }
    },
    []
  );

  const displayLabel = getTagDisplayLabel(content);
  const tagColor = block.color || DEFAULT_TAG_COLOR;
  const style = chipStyle(tagColor);

  return (
    <div className="h-full min-h-0 flex items-center overflow-auto px-4 py-3">
      {!isEditable ? (
        /* Display: single chip only, no icon */
        <div
          className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium border min-w-0 max-w-full"
          style={style}
        >
          <span className="truncate">{displayLabel || "No tag"}</span>
        </div>
      ) : (
        /* Edit: single pill-styled input only */
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag…"
          aria-label="Tag label"
          maxLength={MAX_LABEL_LENGTH}
          className="inline-flex min-w-[8rem] max-w-full rounded-full border px-3 py-1.5 text-sm font-medium placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
          style={style}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
