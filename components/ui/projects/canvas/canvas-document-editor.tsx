"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { Editor } from "@tiptap/core";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { saveCanvasDocument } from "@/lib/api/canvas";
import { getLiquidGlassSurfaceClassName } from "@/components/ui/shared/liquid-glass-surface";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 1500;

interface DocContent {
  type?: string;
  content?: unknown[];
}

function isValidDocumentContent(content: unknown): content is DocContent | null | undefined {
  if (content === null || content === undefined) return true;
  if (typeof content !== "object") return false;
  const obj = content as Record<string, unknown>;
  return obj.type === "doc" || Array.isArray((obj as DocContent).content);
}

function getInitialContent(documentContent: unknown): DocContent | undefined {
  if (!documentContent) return undefined;
  if (!isValidDocumentContent(documentContent)) return undefined;
  const doc = documentContent as DocContent;
  if (doc.type === "doc" && doc.content) return doc;
  return { type: "doc", content: [] };
}

function DocumentBubbleToolbar({ editor }: { editor: Editor }) {
  const {
    isBold,
    isItalic,
    isStrike,
    isCode,
    isBulletList,
    isOrderedList,
    isHeading1,
    isHeading2,
    isHeading3,
  } = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      isBold: ed.isActive("bold"),
      isItalic: ed.isActive("italic"),
      isStrike: ed.isActive("strike"),
      isCode: ed.isActive("code"),
      isBulletList: ed.isActive("bulletList"),
      isOrderedList: ed.isActive("orderedList"),
      isHeading1: ed.isActive("heading", { level: 1 }),
      isHeading2: ed.isActive("heading", { level: 2 }),
      isHeading3: ed.isActive("heading", { level: 3 }),
    }),
  });

  const buttonClass =
    "p-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors";
  const activeClass =
    "bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100";

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(buttonClass, isHeading1 && activeClass)}
        title="Heading 1"
        aria-pressed={isHeading1}
      >
        <Heading1 size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(buttonClass, isHeading2 && activeClass)}
        title="Heading 2"
        aria-pressed={isHeading2}
      >
        <Heading2 size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(buttonClass, isHeading3 && activeClass)}
        title="Heading 3"
        aria-pressed={isHeading3}
      >
        <Heading3 size={14} />
      </button>
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 mx-0.5" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(buttonClass, isBold && activeClass)}
        title="Bold"
        aria-pressed={isBold}
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(buttonClass, isItalic && activeClass)}
        title="Italic"
        aria-pressed={isItalic}
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(buttonClass, isStrike && activeClass)}
        title="Strikethrough"
        aria-pressed={isStrike}
      >
        <Strikethrough size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(buttonClass, isCode && activeClass)}
        title="Code"
        aria-pressed={isCode}
      >
        <Code size={14} />
      </button>
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 mx-0.5" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(buttonClass, isBulletList && activeClass)}
        title="Bullet list"
        aria-pressed={isBulletList}
      >
        <List size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(buttonClass, isOrderedList && activeClass)}
        title="Numbered list"
        aria-pressed={isOrderedList}
      >
        <ListOrdered size={14} />
      </button>
    </div>
  );
}

function DocumentFloatingToolbar({ editor }: { editor: Editor }) {
  return <DocumentBubbleToolbar editor={editor} />;
}

interface CanvasDocumentEditorProps {
  documentContent: unknown;
  projectId: string;
  canvasId: string;
  lastSavedAt: string | null;
  onDocumentSaved: (updatedAt: string) => void;
  onSaveConflict?: () => void;
}

export function CanvasDocumentEditor({
  documentContent,
  projectId,
  canvasId,
  lastSavedAt,
  onDocumentSaved,
  onSaveConflict,
}: CanvasDocumentEditorProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedAtRef = useRef(lastSavedAt);
  lastSavedAtRef.current = lastSavedAt;

  const initialContent = getInitialContent(documentContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editable: true,
    editorProps: {
      attributes: {
        class: cn(
          "canvas-document-editor min-h-full w-full max-w-[720px] mx-auto px-8 py-12",
          "text-base text-slate-700 dark:text-slate-300 focus:outline-none",
          "[&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-900 dark:[&_h1]:text-slate-100 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:first:mt-0",
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 dark:[&_h2]:text-slate-100 [&_h2]:mt-6 [&_h2]:mb-3",
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 dark:[&_h3]:text-slate-100 [&_h3]:mt-4 [&_h3]:mb-2",
          "[&_p]:leading-relaxed [&_p]:mb-4",
          "[&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_li]:my-0.5",
          "[&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol_li]:my-0.5",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 dark:[&_blockquote]:text-slate-400 [&_blockquote]:my-4",
          "[&_code]:bg-slate-100 dark:[&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
          "[&_pre]:bg-slate-100 dark:[&_pre]:bg-slate-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
        ),
      },
    },
  });

  const saveDocument = useCallback(() => {
    if (!editor?.isDestroyed) {
      const json = editor.getJSON();
      saveCanvasDocument(
        projectId,
        canvasId,
        json,
        lastSavedAtRef.current ?? undefined
      ).then((result) => {
        if (result.ok) {
          lastSavedAtRef.current = result.updatedAt;
          onDocumentSaved(result.updatedAt);
        } else if ("conflict" in result && result.conflict) {
          onSaveConflict?.();
        }
      });
    }
  }, [editor, projectId, canvasId, onDocumentSaved, onSaveConflict]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        saveDocument();
      }, DEBOUNCE_MS);
    };

    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [editor, saveDocument]);

  const handleMenuMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-slate-400 dark:text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full overflow-auto",
        getLiquidGlassSurfaceClassName({
          variant: "panel",
          intensity: "xl",
          rounded: "none",
          className: "bg-white/95 dark:bg-slate-900/95",
        })
      )}
    >
      <BubbleMenu
        editor={editor}
        updateDelay={300}
        shouldShow={({ editor: ed }) => !ed.isDestroyed}
        options={{ placement: "top", offset: 8 }}
        className={cn(
          "flex items-center rounded-lg border border-slate-200 dark:border-slate-700",
          "bg-white dark:bg-slate-800 shadow-lg px-1 py-0.5 transition-opacity duration-150"
        )}
        onMouseDown={handleMenuMouseDown}
        onPointerDown={handleMenuMouseDown}
      >
        <DocumentBubbleToolbar editor={editor} />
      </BubbleMenu>
      <FloatingMenu
        editor={editor}
        updateDelay={400}
        shouldShow={({ editor: ed }) => !ed.isDestroyed}
        options={{ placement: "top", offset: 8 }}
        className={cn(
          "flex items-center rounded-lg border border-slate-200 dark:border-slate-700",
          "bg-white dark:bg-slate-800 shadow-lg px-1 py-0.5 transition-opacity duration-200"
        )}
        onMouseDown={handleMenuMouseDown}
        onPointerDown={handleMenuMouseDown}
      >
        <DocumentFloatingToolbar editor={editor} />
      </FloatingMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
