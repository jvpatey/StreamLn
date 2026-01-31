"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  getNoteContent,
  type NoteBlockContent,
} from "./note-defaults";
import type { Editor } from "@tiptap/core";
import { Bold, Italic, Strikethrough, Code } from "lucide-react";

const DEBOUNCE_MS = 350;

/** Toolbar buttons for the bubble menu; uses useEditorState so only re-renders when marks change. */
function NoteBubbleToolbar({ editor }: { editor: Editor }) {
  const { isBold, isItalic, isStrike, isCode } = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      isBold: ed.isActive("bold"),
      isItalic: ed.isActive("italic"),
      isStrike: ed.isActive("strike"),
      isCode: ed.isActive("code"),
    }),
  });

  const buttonClass =
    "p-1.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors";
  const activeClass =
    "bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-slate-100";

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonClass} ${isBold ? activeClass : ""}`}
        title="Bold"
        aria-pressed={isBold}
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonClass} ${isItalic ? activeClass : ""}`}
        title="Italic"
        aria-pressed={isItalic}
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${buttonClass} ${isStrike ? activeClass : ""}`}
        title="Strikethrough"
        aria-pressed={isStrike}
      >
        <Strikethrough size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`${buttonClass} ${isCode ? activeClass : ""}`}
        title="Code"
        aria-pressed={isCode}
      >
        <Code size={14} />
      </button>
    </div>
  );
}

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
}

interface NoteBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

export function NoteBlock({ block, onUpdate, isEditable }: NoteBlockProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialContent = useMemo(
    () => getNoteContent(block.content),
    [block.content]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a note…",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "note-block-editor min-h-full px-4 py-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none",
      },
    },
  });

  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        const json = editor.getJSON() as NoteBlockContent;
        onUpdateRef.current({ content: json });
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
  }, [editor]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!editor) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center p-4 text-slate-400 dark:text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div
      className="h-full min-h-0 overflow-auto"
      onMouseDown={handleMouseDown}
      onPointerDown={handleMouseDown}
    >
      <BubbleMenu
        editor={editor}
        options={{ placement: "top", offset: 8 }}
        className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg px-1 py-0.5"
        onMouseDown={handleMouseDown}
        onPointerDown={handleMouseDown}
      >
        <NoteBubbleToolbar editor={editor} />
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
