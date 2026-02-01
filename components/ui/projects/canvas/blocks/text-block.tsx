"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTextContent, type TextBlockContent } from "./text-defaults";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
  width?: number;
  height?: number;
}

interface TextBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

export function TextBlock({ block, onUpdate, isEditable }: TextBlockProps) {
  const content = getTextContent(block.content);
  const [localText, setLocalText] = useState(content.text);
  const editRef = useRef<HTMLDivElement>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const c = getTextContent(block.content);
    setLocalText(c.text);
    if (editRef.current && document.activeElement !== editRef.current) {
      editRef.current.textContent = c.text;
    }
  }, [block.content]);

  const PADDING_X = 32; // px-4 * 2
  const PADDING_Y = 24; // py-3 * 2
  const MIN_WIDTH = 80;
  const MIN_HEIGHT = 40;

  const persistContent = useCallback(
    (nextText: string) => {
      const updates: Partial<CanvasBlock> = {
        content: {
          ...content,
          text: nextText,
        } as TextBlockContent,
      };
      const trimmed = nextText.trim();
      if (block.title === undefined || block.title === "New Text") {
        updates.title = trimmed ? trimmed.slice(0, 50) : "New Text";
      }
      onUpdateRef.current(updates);
    },
    [content, block.title]
  );

  const resizeBlockToFitContent = useCallback(() => {
    const text = localText.trim() || "";
    const contentWidth = (block.width ?? 220) - PADDING_X;
    const measure = document.createElement("div");
    measure.style.position = "absolute";
    measure.style.left = "-9999px";
    measure.style.visibility = "hidden";
    measure.style.whiteSpace = "pre-wrap";
    measure.style.wordBreak = "break-word";
    measure.style.width = `${Math.max(contentWidth, 1)}px`;
    measure.style.fontFamily = content.fontFamily ?? "system-ui";
    measure.style.fontSize = `${content.fontSize ?? 14}px`;
    measure.style.lineHeight = "1.5";
    measure.textContent = text || " ";
    document.body.appendChild(measure);
    const contentHeight = measure.offsetHeight;
    document.body.removeChild(measure);
    const newHeight = Math.max(MIN_HEIGHT, contentHeight + PADDING_Y);
    onUpdateRef.current({ height: newHeight });
  }, [localText, content.fontFamily, content.fontSize, block.width]);

  const handleBlur = useCallback(() => {
    persistContent(localText);
    resizeBlockToFitContent();
  }, [localText, persistContent, resizeBlockToFitContent]);

  const handleInput = useCallback(() => {
    if (editRef.current) {
      setLocalText(editRef.current.textContent ?? "");
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        editRef.current?.blur();
      }
    },
    []
  );

  const textStyle: React.CSSProperties = {
    fontFamily: content.fontFamily ?? "system-ui",
    fontSize: `${content.fontSize ?? 14}px`,
    color: content.color ?? "hsl(var(--foreground))",
    textAlign: content.textAlign ?? "left",
  };

  const handleWrapperClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        isEditable &&
        editRef.current &&
        !editRef.current.contains(e.target as Node)
      ) {
        editRef.current.focus();
      }
    },
    [isEditable]
  );

  return (
    <div
      className="h-full min-h-0 overflow-auto px-4 py-3 flex items-center cursor-text"
      data-no-block-drag
      style={{
        justifyContent:
          content.textAlign === "center"
            ? "center"
            : content.textAlign === "right"
            ? "flex-end"
            : "flex-start",
      }}
      onClick={handleWrapperClick}
    >
      {!isEditable ? (
        <div
          className="min-w-0 w-full break-words outline-none empty:before:content-['Click to add text…'] empty:before:text-slate-400 dark:empty:before:text-slate-500"
          style={textStyle}
        >
          {content.text || ""}
        </div>
      ) : (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          className="min-w-0 w-full min-h-[2.5rem] break-words outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none empty:before:content-['Add text…'] empty:before:text-slate-400 dark:empty:before:text-slate-500"
          style={textStyle}
          onBlur={handleBlur}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          data-no-block-drag
        />
      )}
    </div>
  );
}
