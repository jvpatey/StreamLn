"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-text-style";
import { FontSize } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { TaskList } from "@tiptap/extension-list";
import { TaskItem } from "@tiptap/extension-list";
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CheckSquare,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shared/popover";
import { saveDocument as saveDocumentApi } from "@/lib/api/canvas";
import { getLiquidGlassSurfaceClassName } from "@/components/ui/shared/liquid-glass-surface";
import { cn } from "@/lib/utils";

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, system-ui, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Arial", value: "Arial, sans-serif" },
];

const FONT_SIZES = [
  { label: "10", value: "10px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "32", value: "32px" },
];

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

const buttonClass =
  "p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-center";
const activeClass =
  "bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100";

function FormattingControls({
  editor,
  compact = false,
}: {
  editor: Editor;
  compact?: boolean;
}) {
  const {
    isBold,
    isItalic,
    isStrike,
    isCode,
    isBulletList,
    isOrderedList,
    isTaskList,
    isHeading1,
    isHeading2,
    isHeading3,
    alignLeft,
    alignCenter,
    alignRight,
    alignJustify,
  } = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      isBold: ed.isActive("bold"),
      isItalic: ed.isActive("italic"),
      isStrike: ed.isActive("strike"),
      isCode: ed.isActive("code"),
      isBulletList: ed.isActive("bulletList"),
      isOrderedList: ed.isActive("orderedList"),
      isTaskList: ed.isActive("taskList"),
      isHeading1: ed.isActive("heading", { level: 1 }),
      isHeading2: ed.isActive("heading", { level: 2 }),
      isHeading3: ed.isActive("heading", { level: 3 }),
      alignLeft: ed.isActive({ textAlign: "left" }),
      alignCenter: ed.isActive({ textAlign: "center" }),
      alignRight: ed.isActive({ textAlign: "right" }),
      alignJustify: ed.isActive({ textAlign: "justify" }),
    }),
  });

  return (
    <div
      className="flex items-center gap-3 flex-wrap"
      onMouseDown={(e) => e.preventDefault()}
    >
      {!compact && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(buttonClass, "gap-2 min-w-[90px] justify-between px-3")}
                title="Font"
              >
                <span className="text-sm truncate leading-none">Font</span>
                <ChevronDown size={20} className="shrink-0 self-center" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-40 p-2"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="space-y-0.5">
                {FONT_FAMILIES.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                    style={{ fontFamily: value }}
                    onClick={() => {
                      editor.chain().focus().setFontFamily(value).run();
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(buttonClass, "gap-2 min-w-[70px] justify-between px-3")}
                title="Size"
              >
                <span className="text-sm leading-none">Size</span>
                <ChevronDown size={20} className="shrink-0 self-center" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-24 p-2"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="space-y-0.5">
                {FONT_SIZES.map(({ label, value }) => (
                  <button
                    key={value}
                    type="button"
                    className="w-full flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={() => {
                      editor.chain().focus().setFontSize(value).run();
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn(buttonClass, alignLeft && activeClass)}
        title="Align left"
        aria-pressed={alignLeft}
      >
        <AlignLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn(buttonClass, alignCenter && activeClass)}
        title="Align center"
        aria-pressed={alignCenter}
      >
        <AlignCenter size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={cn(buttonClass, alignRight && activeClass)}
        title="Align right"
        aria-pressed={alignRight}
      >
        <AlignRight size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={cn(buttonClass, alignJustify && activeClass)}
        title="Justify"
        aria-pressed={alignJustify}
      >
        <AlignJustify size={20} />
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />
        </>
      )}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(buttonClass, isHeading1 && activeClass)}
        title="Heading 1"
        aria-pressed={isHeading1}
      >
        <Heading1 size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(buttonClass, isHeading2 && activeClass)}
        title="Heading 2"
        aria-pressed={isHeading2}
      >
        <Heading2 size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(buttonClass, isHeading3 && activeClass)}
        title="Heading 3"
        aria-pressed={isHeading3}
      >
        <Heading3 size={20} />
      </button>
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(buttonClass, isBold && activeClass)}
        title="Bold"
        aria-pressed={isBold}
      >
        <Bold size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(buttonClass, isItalic && activeClass)}
        title="Italic"
        aria-pressed={isItalic}
      >
        <Italic size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(buttonClass, isStrike && activeClass)}
        title="Strikethrough"
        aria-pressed={isStrike}
      >
        <Strikethrough size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(buttonClass, isCode && activeClass)}
        title="Code"
        aria-pressed={isCode}
      >
        <Code size={20} />
      </button>
      <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(buttonClass, isBulletList && activeClass)}
        title="Bullet list"
        aria-pressed={isBulletList}
      >
        <List size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(buttonClass, isOrderedList && activeClass)}
        title="Numbered list"
        aria-pressed={isOrderedList}
      >
        <ListOrdered size={20} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={cn(buttonClass, isTaskList && activeClass)}
        title="Task list"
        aria-pressed={isTaskList}
      >
        <CheckSquare size={20} />
      </button>
    </div>
  );
}

function DocumentFloatingToolbar({ editor }: { editor: Editor }) {
  return <FormattingControls editor={editor} compact />;
}

function DocumentFormattingToolbar({ editor }: { editor: Editor }) {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex items-center gap-2 px-6 py-3 min-h-[52px]",
        "border-b border-slate-200 dark:border-slate-700",
        getLiquidGlassSurfaceClassName({
          variant: "toolbar",
          intensity: "xl",
          rounded: "none",
          border: false,
          shadow: false,
          className: "bg-white/95 dark:bg-slate-900/95",
        })
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        <FormattingControls editor={editor} />
      </div>
    </div>
  );
}

interface CanvasDocumentEditorProps {
  documentId: string;
  documentContent: unknown;
  projectId: string;
  canvasId: string;
  lastSavedAt: string | null;
  onDocumentSaved: (updatedAt: string) => void;
  onSaveConflict?: () => void;
}

export function CanvasDocumentEditor({
  documentId,
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
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
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
          "[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:pl-0 [&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li]:items-start [&_ul[data-type=taskList]_li]:gap-2 [&_ul[data-type=taskList]_li]:my-1",
          "[&_ul[data-type=taskList]_li[data-checked=true]]:line-through [&_ul[data-type=taskList]_li[data-checked=true]]:opacity-60",
          "[&_ul[data-type=taskList]_input[type=checkbox]]:rounded [&_ul[data-type=taskList]_input[type=checkbox]]:border-slate-300 [&_ul[data-type=taskList]_input[type=checkbox]]:dark:border-slate-600 [&_ul[data-type=taskList]_input[type=checkbox]]:mt-0.5 [&_ul[data-type=taskList]_input[type=checkbox]]:cursor-pointer",
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
      saveDocumentApi(
        projectId,
        canvasId,
        documentId,
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
  }, [editor, projectId, canvasId, documentId, onDocumentSaved, onSaveConflict]);

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
      <DocumentFormattingToolbar editor={editor} />
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
