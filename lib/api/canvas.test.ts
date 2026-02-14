import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCanvasBlocks, saveCanvasBlocks } from "./canvas";

describe("fetchCanvasBlocks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and hydrates blocks with Date objects", async () => {
    const mockBlocks = [
      {
        id: "note-1",
        type: "note",
        x: 100,
        y: 50,
        width: 300,
        height: 200,
        content: {},
        createdAt: "2024-01-15T10:00:00.000Z",
        updatedAt: "2024-01-15T10:00:00.000Z",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ blocks: mockBlocks }),
      })
    );

    const blocks = await fetchCanvasBlocks("project-123");

    expect(blocks).toHaveLength(1);
    expect(blocks[0].id).toBe("note-1");
    expect(blocks[0].type).toBe("note");
    expect(blocks[0].createdAt).toBeInstanceOf(Date);
    expect(blocks[0].updatedAt).toBeInstanceOf(Date);
    expect(blocks[0].createdAt.toISOString()).toBe("2024-01-15T10:00:00.000Z");
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false })
    );

    await expect(fetchCanvasBlocks("project-123")).rejects.toThrow(
      "Failed to fetch canvas blocks"
    );
  });

  it("handles empty blocks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ blocks: [] }),
      })
    );

    const blocks = await fetchCanvasBlocks("project-123");
    expect(blocks).toEqual([]);
  });
});

describe("saveCanvasBlocks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends PUT request with blocks", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ updatedAt: "2024-01-15T10:00:00.000Z" }),
    });

    vi.stubGlobal("fetch", mockFetch);

    const blocks = [
      {
        id: "note-1",
        type: "note" as const,
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        content: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await saveCanvasBlocks("project-123", blocks);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.updatedAt).toBe("2024-01-15T10:00:00.000Z");
    }
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/projects/project-123/canvas",
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      })
    );
  });

  it("returns conflict on 409", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 409 })
    );

    const result = await saveCanvasBlocks("project-123", []);

    expect(result.ok).toBe(false);
    expect(result.conflict).toBe(true);
  });

  it("returns error on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );

    const result = await saveCanvasBlocks("project-123", []);

    expect(result.ok).toBe(false);
    expect(result.conflict).toBe(false);
    expect("error" in result && result.error).toBe("Failed to save canvas blocks");
  });
});
