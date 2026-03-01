export interface Canvas {
  id: string;
  projectId: string;
  name: string;
  order: number;
  documentContent?: unknown | null;
  createdAt: string;
  updatedAt: string;
  blocksCount?: number;
}

export interface Document {
  id: string;
  canvasId: string;
  projectId: string;
  name: string;
  order: number;
  content?: unknown | null;
  createdAt: string;
  updatedAt: string;
}

export type CanvasBlockType =
  | "note"
  | "task-board"
  | "code"
  | "image"
  | "link"
  | "tag"
  | "text"
  | "shape";

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: unknown;
  color?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}
