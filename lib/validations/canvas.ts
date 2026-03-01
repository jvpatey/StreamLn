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

export const canvasBlockSchema = z.object({
  id: z.string().min(1),
  type: z.enum(BLOCK_TYPES),
  x: z.number(),
  y: z.number(),
  width: z.number().min(1).max(5000),
  height: z.number().min(1).max(5000),
  content: z.unknown(),
  color: z.string().max(50).optional().nullable(),
  title: z.string().max(500).optional().nullable(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export const saveCanvasBlocksSchema = z.object({
  blocks: z.array(canvasBlockSchema).max(500),
  lastSavedAt: z
    .string()
    .optional()
    .refine(
      (val) => !val || Number.isFinite(new Date(val).getTime()),
      { message: "lastSavedAt must be a valid ISO datetime string" }
    ),
});

export const createCanvasSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateCanvasSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  order: z.number().int().min(0).optional(),
  documentContent: z.unknown().optional().nullable(),
});

export const saveCanvasDocumentSchema = z.object({
  documentContent: z.unknown(),
  lastSavedAt: z
    .string()
    .optional()
    .refine(
      (val) => !val || Number.isFinite(new Date(val).getTime()),
      { message: "lastSavedAt must be a valid ISO datetime string" }
    ),
});

export const reorderCanvasesSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
      })
    )
    .min(1)
    .max(100),
});

export const createShareTokenSchema = z.object({
  expiresIn: z.number().int().min(1).max(365).optional(),
});

export const createDocumentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  order: z.number().int().min(0).optional(),
});

export const saveDocumentSchema = z.object({
  content: z.unknown(),
  lastSavedAt: z
    .string()
    .optional()
    .refine(
      (val) => !val || Number.isFinite(new Date(val).getTime()),
      { message: "lastSavedAt must be a valid ISO datetime string" }
    ),
});

export const reorderDocumentsSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
      })
    )
    .min(1)
    .max(100),
});

export type CanvasBlockInput = z.infer<typeof canvasBlockSchema>;
export type SaveCanvasBlocksInput = z.infer<typeof saveCanvasBlocksSchema>;
export type SaveCanvasDocumentInput = z.infer<typeof saveCanvasDocumentSchema>;
export type CreateCanvasInput = z.infer<typeof createCanvasSchema>;
export type UpdateCanvasInput = z.infer<typeof updateCanvasSchema>;
export type ReorderCanvasesInput = z.infer<typeof reorderCanvasesSchema>;
export type CreateShareTokenInput = z.infer<typeof createShareTokenSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type SaveDocumentInput = z.infer<typeof saveDocumentSchema>;
export type ReorderDocumentsInput = z.infer<typeof reorderDocumentsSchema>;
