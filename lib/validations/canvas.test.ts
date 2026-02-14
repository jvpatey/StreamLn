import { describe, it, expect } from "vitest";
import {
  canvasBlockSchema,
  saveCanvasBlocksSchema,
} from "./canvas";

describe("canvasBlockSchema", () => {
  const validBlock = {
    id: "note-123",
    type: "note",
    x: 100,
    y: 50,
    width: 300,
    height: 200,
    content: { type: "doc", content: [] },
  };

  it("accepts valid block", () => {
    const result = canvasBlockSchema.safeParse(validBlock);
    expect(result.success).toBe(true);
  });

  it("accepts all block types", () => {
    const types = ["note", "task-board", "code", "image", "link", "tag", "text", "shape"];
    for (const type of types) {
      const result = canvasBlockSchema.safeParse({ ...validBlock, type });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid type", () => {
    const result = canvasBlockSchema.safeParse({
      ...validBlock,
      type: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty id", () => {
    const result = canvasBlockSchema.safeParse({
      ...validBlock,
      id: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero width", () => {
    const result = canvasBlockSchema.safeParse({
      ...validBlock,
      width: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects width over 5000", () => {
    const result = canvasBlockSchema.safeParse({
      ...validBlock,
      width: 5001,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional color and title", () => {
    const result = canvasBlockSchema.safeParse({
      ...validBlock,
      color: "#3b82f6",
      title: "My Note",
    });
    expect(result.success).toBe(true);
  });
});

describe("saveCanvasBlocksSchema", () => {
  const validBlock = {
    id: "note-1",
    type: "note",
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    content: {},
  };

  it("accepts empty blocks array", () => {
    const result = saveCanvasBlocksSchema.safeParse({ blocks: [] });
    expect(result.success).toBe(true);
  });

  it("accepts valid blocks", () => {
    const result = saveCanvasBlocksSchema.safeParse({
      blocks: [validBlock],
    });
    expect(result.success).toBe(true);
  });

  it("rejects blocks over 500", () => {
    const blocks = Array.from({ length: 501 }, (_, i) => ({
      ...validBlock,
      id: `block-${i}`,
    }));
    const result = saveCanvasBlocksSchema.safeParse({ blocks });
    expect(result.success).toBe(false);
  });

  it("rejects missing blocks", () => {
    const result = saveCanvasBlocksSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects non-array blocks", () => {
    const result = saveCanvasBlocksSchema.safeParse({ blocks: "not-array" });
    expect(result.success).toBe(false);
  });
});
