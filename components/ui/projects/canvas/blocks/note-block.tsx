"use client";

import { useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  getNoteContent,
  getFirstLineText,
  type NoteBlockContent,
} from "./note-defaults";

const DEBOUNCE_MS = 350;
const RESIZE_DEBOUNCE_MS = 350;
/** Only update height when change exceeds this (px) to reduce jumpiness. */
const RESIZE_HEIGHT_THRESHOLD = 8;
const MIN_NOTE_HEIGHT = 120;
const MAX_NOTE_HEIGHT = 560;
/** Header (icon, title, padding, border) height for note blocks. */
const NOTE_HEADER_HEIGHT = 56;

} from "./note-defaults";

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
  width?: number;
  height?: number;
}

interface NoteBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

export function NoteBlock({ block, onUpdate, isEditable }: NoteBlockProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resizeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blockRef = useRef(block);
  blockRef.current = block;
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
        const firstLine = getFirstLineText(json);
        const currentTitle = blockRef.current?.title;
        const titleUnset = !currentTitle || currentTitle === "New Note";
        onUpdateRef.current(
          firstLine && titleUnset
            ? { content: json, title: firstLine }
            : { content: json }
        );
      }, DEBOUNCE_MS);
    };

    const handleResize = () => {
      if (resizeDebounceRef.current) clearTimeout(resizeDebounceRef.current);
      resizeDebounceRef.current = setTimeout(() => {
        resizeDebounceRef.current = null;
        requestAnimationFrame(() => {
          if (editor.isDestroyed || !editor.view?.dom) return;
          const contentHeight = editor.view.dom.scrollHeight;
          const newHeight = Math.max(
            MIN_NOTE_HEIGHT,
            Math.min(
              MAX_NOTE_HEIGHT,
              NOTE_HEADER_HEIGHT + contentHeight
            )
          );
          const currentHeight = blockRef.current?.height ?? 0;
          if (
            Math.abs(newHeight - currentHeight) >= RESIZE_HEIGHT_THRESHOLD ||
            newHeight === MIN_NOTE_HEIGHT ||
            newHeight === MAX_NOTE_HEIGHT
          ) {
            onUpdateRef.current({ height: newHeight });
          }
        });
      }, RESIZE_DEBOUNCE_MS);
    };

    const handleUpdateAndResize = () => {
      handleUpdate();
      handleResize();
    };

    editor.on("update", handleUpdateAndResize);
    return () => {
      editor.off("update", handleUpdateAndResize);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (resizeDebounceRef.current) {
        clearTimeout(resizeDebounceRef.current);
        resizeDebounceRef.current = null;
      }
    };
  }, [editor]);

  // Initial resize when editor mounts with existing content
  useEffect(() => {
    if (!editor) return;
    const resizeToFit = () => {
      requestAnimationFrame(() => {
        if (editor.isDestroyed || !editor.view?.dom) return;
        const contentHeight = editor.view.dom.scrollHeight;
        const newHeight = Math.max(
          MIN_NOTE_HEIGHT,
          Math.min(
            MAX_NOTE_HEIGHT,
            NOTE_HEADER_HEIGHT + contentHeight
          )
        );
        onUpdateRef.current({ height: newHeight });
      });
    };
    const id = setTimeout(resizeToFit, 50);
    return () => clearTimeout(id);
  }, [editor]);

  if (!editor) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center p-4 text-slate-400 dark:text-slate-500 text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div
      className="h-full min-h-0 overflow-auto select-text"
      data-no-block-drag
      onWheel={(e) => e.stopPropagation()}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
