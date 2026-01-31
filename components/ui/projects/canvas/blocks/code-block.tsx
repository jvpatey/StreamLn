"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { githubLight } from "@uiw/codemirror-theme-github";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import type { Extension } from "@codemirror/state";
import { tooltips } from "@codemirror/view";
import { Copy } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/shared/button";
import {
  getCodeContent,
  CODE_BLOCK_LANGUAGES,
  type CodeBlockContent,
} from "./code-defaults";

const DEBOUNCE_MS = 400;

interface CanvasBlock {
  id: string;
  type: string;
  content: unknown;
  color?: string;
  title?: string;
}

interface CodeBlockProps {
  block: CanvasBlock;
  onUpdate: (updates: Partial<CanvasBlock>) => void;
  isEditable: boolean;
}

function getLanguageExtension(language: string): Extension | null {
  switch (language) {
    case "javascript":
      return javascript({ jsx: true, typescript: false });
    case "typescript":
      return javascript({ jsx: true, typescript: true });
    case "json":
      return json();
    default:
      return null;
  }
}

export function CodeBlock({ block, onUpdate, isEditable }: CodeBlockProps) {
  const content = getCodeContent(block.content);
  const [code, setCode] = useState(content.code);
  const [language, setLanguage] = useState(content.language ?? "javascript");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextPersistRef = useRef(false);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const { resolvedTheme } = useTheme();
  const themeExtension = useMemo<Extension>(
    () => (resolvedTheme === "dark" ? vscodeDark : githubLight),
    [resolvedTheme]
  );

  const languageExtension = useMemo(
    () => getLanguageExtension(language),
    [language]
  );

  // Only add tooltips after mount so SSR and initial client render use the same extensions (avoids hydration mismatch)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const extensions = useMemo<Extension[]>(() => {
    const exts: Extension[] = [themeExtension];
    if (languageExtension) exts.push(languageExtension);
    if (isMounted && typeof document !== "undefined") {
      exts.push(tooltips({ parent: document.body }));
    }
    return exts;
  }, [themeExtension, languageExtension, isMounted]);

  // Sync from block when content changes externally
  useEffect(() => {
    const c = getCodeContent(block.content);
    skipNextPersistRef.current = true;
    setCode(c.code);
    setLanguage(c.language ?? "javascript");
  }, [block.content]);

  // Debounced persist on code or language change (skip when change came from external sync)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      if (skipNextPersistRef.current) {
        skipNextPersistRef.current = false;
        return;
      }
      const payload: CodeBlockContent = {
        code,
        language: language || "javascript",
      };
      onUpdateRef.current({ content: payload });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [code, language]);

  const handleCopy = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code);
    }
  }, [code]);

  const handleLanguageSelect = useCallback((id: string) => {
    setLanguage(id);
  }, []);

  const currentLanguageLabel =
    CODE_BLOCK_LANGUAGES.find((l) => l.id === language)?.label ?? "JavaScript";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-2 py-1.5 dark:border-slate-700"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium text-slate-600 dark:text-slate-400"
              aria-label="Select language"
              aria-haspopup="menu"
            >
              {currentLanguageLabel}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[10rem] rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800 z-[100]"
              sideOffset={4}
              align="start"
            >
              {CODE_BLOCK_LANGUAGES.map(({ id, label }) => (
                <DropdownMenu.Item
                  key={id}
                  className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm outline-none focus:bg-slate-100 dark:focus:bg-slate-700 text-slate-700 dark:text-slate-300 data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-700"
                  onSelect={() => handleLanguageSelect(id)}
                >
                  {label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-slate-600 dark:text-slate-400"
          onClick={handleCopy}
          aria-label="Copy code"
          title="Copy code"
        >
          <Copy size={14} />
          Copy
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-visible px-4">
        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={extensions}
          theme="none"
          editable={isEditable}
          basicSetup={true}
          indentWithTab={true}
          className="h-full text-sm [&_.cm-editor]:h-full [&_.cm-scroller]:min-h-full [&_.cm-content]:min-h-full"
          aria-label="Code editor"
        />
      </div>
    </div>
  );
}
