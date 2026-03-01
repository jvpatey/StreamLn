/**
 * Per-block Markdown serializers for canvas export
 */

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { renderToMarkdown } from "@tiptap/static-renderer/pm/markdown";
import type { CanvasBlock } from "@/lib/types/canvas";
import { getNoteContent } from "@/components/ui/projects/canvas/blocks/note-defaults";
import { getTaskBoardContent } from "@/components/ui/projects/canvas/blocks/task-board-defaults";
import { getCodeContent } from "@/components/ui/projects/canvas/blocks/code-defaults";
import { getTextContent } from "@/components/ui/projects/canvas/blocks/text-defaults";
import { getLinkContent } from "@/components/ui/projects/canvas/blocks/link-defaults";
import { getTagContent } from "@/components/ui/projects/canvas/blocks/tag-defaults";

const TIPTAP_EXTENSIONS = [StarterKit, Placeholder];

const DOCUMENT_EXTENSIONS = [
  StarterKit,
  Placeholder,
  TaskList,
  TaskItem.configure({ nested: true }),
];

function isValidDocContent(content: unknown): content is { type?: string; content?: unknown[] } {
  if (content === null || content === undefined) return false;
  if (typeof content !== "object") return false;
  const obj = content as Record<string, unknown>;
  return obj.type === "doc" || Array.isArray((obj as { content?: unknown[] }).content);
}

/** Convert document (Tiptap) content to Markdown. Used for document editor export. */
export function documentToMarkdown(content: unknown): string {
  if (!content || !isValidDocContent(content)) return "";
  const doc = content as { type: string; content?: unknown[] };
  if (!doc.content || doc.content.length === 0) return "";

  try {
    const md = renderToMarkdown({
      extensions: DOCUMENT_EXTENSIONS,
      content: doc,
    });
    return (md ?? "").trim();
  } catch {
    return "";
  }
}

/** Convert Tiptap/ProseMirror JSON to Markdown */
function noteToMarkdown(content: unknown): string {
  const doc = getNoteContent(content);
  if (!doc.content || doc.content.length === 0) return "";

  try {
    const md = renderToMarkdown({
      extensions: TIPTAP_EXTENSIONS,
      content: doc,
    });
    return (md ?? "").trim();
  } catch {
    return "";
  }
}

/** Convert task board to Markdown table */
function taskBoardToMarkdown(content: unknown): string {
  const { columns, cards } = getTaskBoardContent(content);
  if (columns.length === 0) return "";

  const lines: string[] = [];
  const header = columns.map((c) => c.title || "(Untitled)").join(" | ");
  lines.push(`| ${header} |`);
  lines.push(`| ${columns.map(() => "---").join(" | ")} |`);

  const maxRows = Math.max(
    ...columns.map((col) => col.cardIds.length),
    1
  );

  for (let i = 0; i < maxRows; i++) {
    const row = columns.map((col) => {
      const cardId = col.cardIds[i];
      const card = cardId ? cards[cardId] : null;
      const text = card?.text?.trim() ?? "";
      return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
    });
    lines.push(`| ${row.join(" | ")} |`);
  }

  return lines.join("\n");
}

/** Convert code block to fenced Markdown */
function codeToMarkdown(content: unknown): string {
  const { code, language } = getCodeContent(content);
  if (!code.trim()) return "";

  const lang = language || "text";
  return "```" + lang + "\n" + code + "\n```";
}

/** Convert text block to plain text */
function textToMarkdown(content: unknown): string {
  const { text } = getTextContent(content);
  return (text ?? "").trim();
}

/** Convert link block to Markdown link */
function linkToMarkdown(content: unknown): string {
  const { url, label } = getLinkContent(content);
  if (!url?.trim()) return "";

  const display = (label?.trim() || url).replace(/\]/g, "\\]");
  return `[${display}](${url})`;
}

/** Convert tag block to Markdown */
function tagToMarkdown(content: unknown): string {
  const { label } = getTagContent(content);
  const trimmed = (label ?? "").trim();
  if (!trimmed) return "";
  return `#${trimmed.replace(/\s+/g, "-")}`;
}

/** Serialize a single block to Markdown */
export function blockToMarkdown(block: CanvasBlock): string {
  const title = block.title?.trim();
  const titleLine = title ? `## ${title}\n\n` : "";

  let body = "";
  switch (block.type) {
    case "note":
      body = noteToMarkdown(block.content);
      break;
    case "task-board":
      body = taskBoardToMarkdown(block.content);
      break;
    case "code":
      body = codeToMarkdown(block.content);
      break;
    case "text":
      body = textToMarkdown(block.content);
      break;
    case "link":
      body = linkToMarkdown(block.content);
      break;
    case "tag":
      body = tagToMarkdown(block.content);
      break;
    case "image":
      body = "*[Image block]*";
      break;
    case "shape":
      body = "*[Shape]*";
      break;
    default:
      body = "";
  }

  if (!body.trim()) return titleLine ? titleLine.trim() : "";

  return titleLine + body;
}

/** Sort blocks by position (y then x) for readable flow */
export function sortBlocksForExport(blocks: CanvasBlock[]): CanvasBlock[] {
  return [...blocks].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 50) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });
}
