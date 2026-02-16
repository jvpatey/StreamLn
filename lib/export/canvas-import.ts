/**
 * Canvas import utilities - parse and validate JSON exports for restore
 */

import { z } from "zod";

const BLOCK_TYPES = [
  "note",
  "task-board",
  "code",
  "image",
  "link",
  "tag",
  "text",
  "shape",
] as const;

type CanvasBlockType = (typeof BLOCK_TYPES)[number];

/** Permissive block schema for import - unknown types map to "note" */
const importBlockSchema = z.object({
  id: z.string().min(1).optional(),
  type: z.string().transform((val) =>
    BLOCK_TYPES.includes(val as CanvasBlockType) ? (val as CanvasBlockType) : "note"
  ),
  x: z.number(),
  y: z.number(),
  width: z.number().min(1).max(5000),
  height: z.number().min(1).max(5000),
  content: z.unknown().default({}),
  color: z.string().max(50).optional().nullable(),
  title: z.string().max(500).optional().nullable(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

const importProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
  status: z.string().default("active"),
});

const importCanvasSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200).default("Untitled Canvas"),
  order: z.number().int().min(0).default(0),
  projectId: z.string().optional(),
  blocks: z.array(importBlockSchema).max(500).default([]),
});

/** Single-canvas export format */
const singleCanvasPayloadSchema = z.object({
  project: importProjectSchema,
  canvas: z.object({
    id: z.string().optional(),
    name: z.string().min(1).max(200).default("Untitled Canvas"),
    order: z.number().int().min(0).default(0),
    projectId: z.string().optional(),
  }),
  blocks: z.array(importBlockSchema).max(500).default([]),
  exportedAt: z.string().optional(),
});

/** Project-level export format */
const projectPayloadSchema = z.object({
  project: importProjectSchema,
  canvases: z.array(importCanvasSchema).max(100),
  exportedAt: z.string().optional(),
});

export interface ImportBlock {
  type: CanvasBlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: unknown;
  color?: string | null;
  title?: string | null;
  order?: number;
}

export interface ImportCanvas {
  name: string;
  order: number;
  blocks: ImportBlock[];
}

export interface ImportProjectData {
  project: {
    name: string;
    description?: string | null;
    icon?: string | null;
    status: string;
  };
  canvases: ImportCanvas[];
}

export type ParseImportResult =
  | { ok: true; data: ImportProjectData }
  | { ok: false; error: string };

/**
 * Parse and validate JSON import payload.
 * Supports both single-canvas and project-level export formats.
 * Returns normalized data ready for import (IDs are generated server-side).
 */
export function parseImportPayload(json: string | object): ParseImportResult {
  let parsed: unknown;
  if (typeof json === "string") {
    try {
      parsed = JSON.parse(json);
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  } else {
    parsed = json;
  }

  if (parsed === null || typeof parsed !== "object") {
    return { ok: false, error: "Invalid import file: expected an object" };
  }

  const obj = parsed as Record<string, unknown>;

  if ("canvases" in obj && Array.isArray(obj.canvases)) {
    const result = projectPayloadSchema.safeParse(parsed);
    if (!result.success) {
      const msg = result.error.issues.map((i) => i.message).join("; ");
      return { ok: false, error: msg };
    }
    const { project, canvases } = result.data;
    const normalizedCanvases =
      canvases.length === 0
        ? [{ name: "Main", order: 0, blocks: [] }]
        : canvases;
    return {
      ok: true,
      data: {
        project: {
          name: project.name,
          description: project.description ?? null,
          icon: project.icon ?? null,
          status: project.status ?? "active",
        },
        canvases: normalizedCanvases.map((c) => ({
          name: c.name,
          order: c.order,
          blocks: c.blocks.map((b, i) => ({
            type: b.type,
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            content: b.content,
            color: b.color ?? null,
            title: b.title ?? null,
            order: i,
          })),
        })),
      },
    };
  }

  if ("canvas" in obj && "blocks" in obj) {
    const result = singleCanvasPayloadSchema.safeParse(parsed);
    if (!result.success) {
      const msg = result.error.issues.map((i) => i.message).join("; ");
      return { ok: false, error: msg };
    }
    const { project, canvas, blocks } = result.data;
    return {
      ok: true,
      data: {
        project: {
          name: project.name,
          description: project.description ?? null,
          icon: project.icon ?? null,
          status: project.status ?? "active",
        },
        canvases: [
          {
            name: canvas.name,
            order: canvas.order,
            blocks: blocks.map((b, i) => ({
              type: b.type,
              x: b.x,
              y: b.y,
              width: b.width,
              height: b.height,
              content: b.content,
              color: b.color ?? null,
              title: b.title ?? null,
              order: i,
            })),
          },
        ],
      },
    };
  }

  return {
    ok: false,
    error: "Invalid import file: expected project or single-canvas export format",
  };
}
