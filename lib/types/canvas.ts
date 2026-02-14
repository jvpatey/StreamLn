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
