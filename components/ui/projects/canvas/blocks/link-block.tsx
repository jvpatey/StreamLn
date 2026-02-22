"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ExternalLink, Link2, Loader2, Pencil, Tag } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import {
  getLinkContent,
  getLinkDisplayLabel,
  type LinkBlockContent,
  type LinkPreviewData,
} from "./link-defaults";

const URL_ERROR_ID = "link-block-url-error";
const LINK_HEADER_HEIGHT = 56;
const MIN_LINK_BLOCK_HEIGHT = 220;

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
  width?: number;
  height?: number;
}

interface LinkBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

const DANGEROUS_URL_SCHEMES = [
  "javascript",
  "data",
  "vbscript",
  "file",
  "blob",
];

function hasDangerousScheme(url: string): boolean {
  const i = url.indexOf(":");
  if (i === -1) return false;
  const scheme = url.slice(0, i).trim().toLowerCase();
  return DANGEROUS_URL_SCHEMES.includes(scheme);
}

function isValidHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://"))
    return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (hasDangerousScheme(trimmed)) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  return `https://${trimmed}`;
}

export function LinkBlock({ block, onUpdate, isEditable }: LinkBlockProps) {
  const content = getLinkContent(block.content);
  const [url, setUrl] = useState(content.url);
  const [label, setLabel] = useState(content.label ?? "");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const onUpdateRef = useRef(onUpdate);
  const blockRef = useRef(block);
  onUpdateRef.current = onUpdate;
  blockRef.current = block;

  useEffect(() => {
    const c = getLinkContent(block.content);
    setUrl(c.url);
    setLabel(c.label ?? "");
    setUrlError(null);
  }, [block.content]);

  // Fetch link preview when we have a valid URL and no preview yet
  useEffect(() => {
    const normalizedUrl = content.url.trim()
      ? normalizeUrl(content.url)
      : "";
    if (!normalizedUrl || !isValidHttpUrl(normalizedUrl)) return;
    if (content.preview) return; // Already have preview

    let cancelled = false;
    const controller = new AbortController();

    async function fetchPreview() {
      try {
        const res = await fetch(
          `/api/link-preview?url=${encodeURIComponent(normalizedUrl)}`,
          { signal: controller.signal }
        );
        if (!res.ok || cancelled) return;
        const preview = (await res.json()) as LinkPreviewData;
        if (cancelled) return;
        onUpdateRef.current({
          content: {
            url: content.url,
            label: content.label,
            preview,
          } as LinkBlockContent,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.warn("[LinkBlock] Preview fetch failed:", err.message);
        }
      }
    }

    fetchPreview();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [content.url, content.label, content.preview]);

  const persistContent = useCallback(
    (nextUrl: string, nextLabel: string, preview?: LinkPreviewData) => {
      const normalizedUrl = normalizeUrl(nextUrl);
      const contentUpdate: LinkBlockContent = {
        url: normalizedUrl,
        label: nextLabel.trim() || undefined,
        ...(preview && { preview }),
      };
      const updates: Partial<CanvasBlock> = {
        content: contentUpdate,
      };
      const displayLabel = getLinkDisplayLabel({
        url: normalizedUrl,
        label: nextLabel.trim() || undefined,
      });
      if (displayLabel) updates.title = displayLabel;
      onUpdateRef.current(updates);
    },
    []
  );

  const handleUrlBlur = useCallback(() => {
    const normalizedUrl = normalizeUrl(url);
    setUrl(normalizedUrl);

    if (!normalizedUrl) {
      setUrlError(null);
      persistContent(normalizedUrl, label);
      return;
    }

    if (isValidHttpUrl(normalizedUrl)) {
      setUrlError(null);
      // Don't persist or collapse here - user may be moving to label field
      // Persist and collapse only on label blur or Done button
    } else {
      setUrlError("Please enter a valid URL");
    }
  }, [url, label, persistContent]);

  const handleLabelBlur = useCallback(() => {
    if (urlError) return; // Don't persist while URL is invalid
    persistContent(url, label);
    setIsEditing(false); // Collapse back to preview after save
  }, [url, label, urlError, persistContent]);

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

  const handleDone = useCallback(() => {
    const normalizedUrl = normalizeUrl(url);
    setUrl(normalizedUrl);

    if (!normalizedUrl) {
      setUrlError(null);
      persistContent(normalizedUrl, label);
      return;
    }

    if (isValidHttpUrl(normalizedUrl)) {
      setUrlError(null);
      persistContent(normalizedUrl, label);
      setIsEditing(false);
    } else {
      setUrlError("Please enter a valid URL");
    }
  }, [url, label, persistContent]);

  const handleUrlPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData("text").trim();
      if (!pasted) return;
      if (hasDangerousScheme(pasted)) return;
      try {
        new URL(pasted.startsWith("http") ? pasted : `https://${pasted}`);
        const normalized = pasted.startsWith("http") ? pasted : `https://${pasted}`;
        setUrl(normalized);
        setUrlError(null);
        setIsEditing(true);
        e.preventDefault();
        requestAnimationFrame(() => labelInputRef.current?.focus());
      } catch {
        // not a URL, allow default paste
      }
    },
    []
  );

  // Resize block to fit content without scrolling. Uses refs to avoid
  // dependency on block.height which would cause an infinite update loop.
  const resizeBlockToFit = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const contentHeight = el.scrollHeight;
    const newHeight = Math.max(
      MIN_LINK_BLOCK_HEIGHT,
      LINK_HEADER_HEIGHT + contentHeight
    );
    const currentHeight = blockRef.current.height ?? MIN_LINK_BLOCK_HEIGHT;
    if (Math.abs(newHeight - currentHeight) > 2) {
      onUpdateRef.current({ height: newHeight });
    }
  }, []);

  useEffect(() => {
    resizeBlockToFit();
  }, [resizeBlockToFit, content.url, content.preview, isEditable, isEditing, urlError]);

  const displayLabel = getLinkDisplayLabel(content);
  const hrefUrl =
    content.url.trim() && isValidHttpUrl(content.url)
      ? normalizeUrl(content.url)
      : null;
  const isFetchingPreview =
    hrefUrl && !content.preview && !urlError;
  const showInputs =
    isEditable &&
    (!hrefUrl || isFetchingPreview || isEditing);

  const normalizedUrlForButton = normalizeUrl(url);
  const isUrlValidForDone = normalizedUrlForButton && isValidHttpUrl(normalizedUrlForButton);
  const doneButtonLabel = content.url.trim() ? "Done" : "Add link";

  return (
    <div
      ref={contentRef}
      className="h-full min-h-0 flex flex-col overflow-hidden px-4 py-3"
    >
      {/* Display row: text + Open/Edit/Done */}
      {content.url.trim() || !isEditable || showInputs ? (
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <span
              className={`text-sm truncate min-w-0 flex-1 px-3 py-2 rounded-lg ${
                hrefUrl && !showInputs
                  ? "font-medium text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600"
                  : "text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-600/80"
              }`}
            >
              {displayLabel || (showInputs ? (label || url || "Link") : "No link")}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0" data-no-block-drag>
            {showInputs && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5
                  backdrop-blur-sm bg-blue-500/10 dark:bg-blue-500/20
                  hover:bg-blue-500/20 dark:hover:bg-blue-500/30
                  text-blue-600 dark:text-blue-400
                  focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2
                  disabled:opacity-50 disabled:pointer-events-none"
                disabled={!isUrlValidForDone}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDone();
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Check size={12} className="shrink-0" aria-hidden />
                {doneButtonLabel}
              </Button>
            )}
            {hrefUrl && !showInputs && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5
                    backdrop-blur-sm bg-blue-500/10 dark:bg-blue-500/20
                    hover:bg-blue-500/20 dark:hover:bg-blue-500/30
                    text-blue-600 dark:text-blue-400
                    focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
                >
                  <a
                    href={hrefUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={12} className="shrink-0" aria-hidden />
                    Open
                  </a>
                </Button>
                {content.preview && isEditable && !showInputs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    className="h-7 w-7 p-0 rounded-lg shrink-0
                      hover:bg-slate-200/50 dark:hover:bg-slate-600/50
                      text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditing(true);
                      requestAnimationFrame(() => urlInputRef.current?.focus());
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="Edit link"
                  >
                    <Pencil size={12} />
                  </Button>
                )}
              </>
            )}
            </div>
          </div>

          {/* Link preview card - only show when not in edit mode */}
          {hrefUrl && !showInputs && (
            <a
              href={hrefUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-no-block-drag
              className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors min-w-0 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {isFetchingPreview ? (
                <div className="flex items-center justify-center gap-2 py-8 text-slate-500 dark:text-slate-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Loading preview…</span>
                </div>
              ) : content.preview ? (
                <>
                  {content.preview.image && (
                    <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={content.preview.image}
                        alt=""
                        className="w-full h-full object-cover"
                        onLoad={resizeBlockToFit}
                      />
                    </div>
                  )}
                  <div className="flex gap-3 p-3">
                    {content.preview.logo && !content.preview.image && (
                      <img
                        src={content.preview.logo}
                        alt=""
                        className="w-10 h-10 rounded flex-shrink-0 object-contain"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {content.preview.title || displayLabel || "Link"}
                      </div>
                      {content.preview.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {content.preview.description}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-3 text-sm text-slate-500 dark:text-slate-400">
                  {displayLabel || "Link"}
                </div>
              )}
            </a>
          )}
        </div>
      ) : null}

      {/* Inline edit: URL + optional label when editable */}
      <AnimatePresence initial={false}>
        {showInputs && (
          <motion.div
            key="link-block-inputs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-3 mt-2 pb-3 overflow-hidden"
            data-no-block-drag
          >
            <div className="flex flex-col gap-1">
              <div className="relative">
              <Link2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                aria-hidden
              />
              <input
                ref={urlInputRef}
                id="link-block-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError(null);
                }}
                onFocus={() => setIsEditing(true)}
                onBlur={handleUrlBlur}
                onKeyDown={handleUrlKeyDown}
                onPaste={handleUrlPaste}
                placeholder="Paste a link or type a URL"
                aria-label="Link URL (required)"
                aria-invalid={!!urlError}
                aria-describedby={urlError ? URL_ERROR_ID : undefined}
                className={`w-full text-sm pl-9 pr-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition ${
                  urlError
                    ? "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500 dark:focus:border-red-400"
                    : "border-slate-200 dark:border-slate-600 focus:ring-primary-400 focus:border-primary-400"
                }`}
                onClick={(e) => e.stopPropagation()}
              />
              </div>
              {urlError && (
              <p
                id={URL_ERROR_ID}
                role="alert"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {urlError}
              </p>
              )}
            </div>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                aria-hidden
              />
              <input
                ref={labelInputRef}
                id="link-block-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onFocus={() => setIsEditing(true)}
                onBlur={handleLabelBlur}
                onKeyDown={handleLabelKeyDown}
                placeholder="Label (optional)"
                aria-label="Link label (optional)"
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button
              variant="subtle"
              size="sm"
              type="button"
              className="h-7 px-2.5 text-xs gap-1.5 w-fit self-end"
              disabled={!isUrlValidForDone}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDone();
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Check size={12} />
              {doneButtonLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
