"use client";

import { useCallback, useRef, useState } from "react";
import { Image, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/shared/button";
import {
  getImageContent,
  type ImageBlockContent,
} from "./image-defaults";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
}

interface ImageBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Upload failed");
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

export function ImageBlock({ block, onUpdate, isEditable }: ImageBlockProps) {
  const content = getImageContent(block.content);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const handleUpload = useCallback(
    async (file: File) => {
      if (!isEditable) return;
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select an image file");
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setUploadError("Image must be under 5MB");
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const url = await uploadFile(file);
        onUpdateRef.current({
          content: {
            ...content,
            url,
          } as ImageBlockContent,
        });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [content, isEditable]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (!isEditable || isUploading) return;
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [isEditable, isUploading, handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
      e.target.value = "";
    },
    [handleUpload]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      if (!isEditable || isUploading) return;
      const file = e.clipboardData.files[0];
      if (file?.type.startsWith("image/")) {
        e.preventDefault();
        handleUpload(file);
      }
    },
    [isEditable, isUploading, handleUpload]
  );

  const handleChooseFile = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isEditable || isUploading) return;
      fileInputRef.current?.click();
    },
    [isEditable, isUploading]
  );

  const handlePasteButton = useCallback(async () => {
    if (!isEditable || isUploading) return;
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          if (blob) {
            const ext = imageType === "image/png" ? "png" : imageType === "image/jpeg" ? "jpg" : "png";
            const file = new File([blob], `pasted-image.${ext}`, { type: blob.type });
            handleUpload(file);
            return;
          }
        }
      }
      setUploadError("No image found in clipboard");
    } catch {
      setUploadError("Could not read clipboard");
    }
  }, [isEditable, isUploading, handleUpload]);

  const hasImage = !!content.url;

  return (
    <div
      className="h-full min-h-0 flex flex-col overflow-hidden"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />

      {hasImage ? (
        <div className="relative h-full w-full min-h-0 flex items-center justify-center">
          <img
            src={content.url}
            alt={content.alt ?? ""}
            title={content.title ?? undefined}
            className="max-w-full max-h-full w-full h-full object-contain"
          />
        </div>
      ) : (
        <div
          className={`h-full flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? "border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-900/20"
              : "border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30"
          }`}
          data-no-block-drag
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
              <Loader2 size={32} className="animate-spin" />
              <span className="text-sm">Uploading…</span>
            </div>
          ) : uploadError ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-sm text-red-600 dark:text-red-400">
                {uploadError}
              </span>
              <Button
                variant="subtle"
                size="sm"
                type="button"
                onClick={handleChooseFile}
                onMouseDown={(e) => e.stopPropagation()}
                data-no-block-drag
              >
                Try again
              </Button>
            </div>
          ) : isEditable ? (
            <>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Image size={24} />
                <span className="text-sm">Drop image, paste, or choose file</span>
              </div>
              <div className="flex gap-2" data-no-block-drag>
                <Button
                  variant="subtle"
                  size="sm"
                  type="button"
                  onClick={handleChooseFile}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="gap-1.5"
                >
                  <Upload size={14} />
                  Choose file
                </Button>
                <Button
                  variant="subtle"
                  size="sm"
                  type="button"
                  onClick={handlePasteButton}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  Paste
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
