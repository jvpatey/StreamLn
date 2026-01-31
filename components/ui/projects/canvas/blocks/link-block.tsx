"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  getLinkContent,
  getLinkDisplayLabel,
  type LinkBlockContent,
} from "./link-defaults";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
}

interface LinkBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

function isValidHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  return `https://${trimmed}`;
}

export function LinkBlock({ block, onUpdate, isEditable }: LinkBlockProps) {
  const content = getLinkContent(block.content);
  const [url, setUrl] = useState(content.url);
  const [label, setLabel] = useState(content.label ?? "");
  const urlInputRef = useRef<HTMLInputElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const c = getLinkContent(block.content);
    setUrl(c.url);
    setLabel(c.label ?? "");
  }, [block.content]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const persistContent = useCallback((nextUrl: string, nextLabel: string) => {
    const normalizedUrl = normalizeUrl(nextUrl);
    const updates: Partial<CanvasBlock> = {
      content: {
        url: normalizedUrl,
        label: nextLabel.trim() || undefined,
      } as LinkBlockContent,
    };
    const displayLabel = getLinkDisplayLabel({
      url: normalizedUrl,
      label: nextLabel.trim() || undefined,
    });
    if (displayLabel) updates.title = displayLabel;
    onUpdateRef.current(updates);
  }, []);

  const handleUrlBlur = useCallback(() => {
    const normalizedUrl = normalizeUrl(url);
    setUrl(normalizedUrl);
    persistContent(normalizedUrl, label);
  }, [url, label, persistContent]);

  const handleLabelBlur = useCallback(() => {
    persistContent(url, label);
  }, [url, label, persistContent]);

  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        urlInputRef.current?.blur();
        labelInputRef.current?.focus();
      }
    },
    []
  );

  const handleLabelKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        labelInputRef.current?.blur();
      }
    },
    []
  );

  const handleUrlPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text").trim();
      if (!pasted) return;
      try {
        new URL(pasted.startsWith("http") ? pasted : `https://${pasted}`);
        setUrl(pasted.startsWith("http") ? pasted : `https://${pasted}`);
        e.preventDefault();
        setTimeout(
          () =>
            persistContent(
              pasted.startsWith("http") ? pasted : `https://${pasted}`,
              label
            ),
          0
        );
      } catch {
        // not a URL, allow default paste
      }
    },
    [label, persistContent]
  );

  const displayLabel = getLinkDisplayLabel(content);
  const hrefUrl =
    content.url.trim() && isValidHttpUrl(content.url)
      ? normalizeUrl(content.url)
      : null;

  return (
    <div
      className="h-full min-h-0 flex flex-col overflow-auto px-4 py-3"
      onMouseDown={handleMouseDown}
      onPointerDown={handleMouseDown}
    >
      {/* Display row: icon + text + Open (when URL is set; when not editable show "No link" if empty) */}
      {content.url.trim() || !isEditable ? (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <ExternalLink
            size={16}
            className="flex-shrink-0 text-slate-500 dark:text-slate-400"
            aria-hidden
          />
          <span className="text-sm text-slate-700 dark:text-slate-300 truncate min-w-0">
            {displayLabel || "No link"}
          </span>
          {hrefUrl && (
            <a
              href={hrefUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-1.5 py-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              Open
            </a>
          )}
        </div>
      ) : null}

      {/* Inline edit: URL + optional label when editable */}
      {isEditable && (
        <div className="flex flex-col gap-1.5 mt-2">
          <input
            ref={urlInputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur}
            onKeyDown={handleUrlKeyDown}
            onPaste={handleUrlPaste}
            placeholder="Paste or enter URL"
            aria-label="Link URL"
            className="w-full text-sm px-2 py-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            onClick={(e) => e.stopPropagation()}
          />
          <input
            ref={labelInputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            placeholder="Label (optional)"
            aria-label="Link label"
            className="w-full text-sm px-2 py-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
