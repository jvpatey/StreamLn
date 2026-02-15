import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { Prisma } from "@/app/generated/prisma-client";
import {
  GET as GetCanvases,
  POST as PostCanvas,
} from "@/app/api/projects/[id]/canvases/route";
import {
  GET as GetCanvasBlocks,
  PUT as PutCanvasBlocks,
  PATCH as PatchCanvas,
  DELETE as DeleteCanvas,
} from "@/app/api/projects/[id]/canvases/[canvasId]/route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findUnique: vi.fn(),
    },
    canvas: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      aggregate: vi.fn(),
    },
    canvasBlock: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn((fn) =>
      fn({
        canvasBlock: {
          deleteMany: vi.fn(),
          createMany: vi.fn(),
        },
        canvas: {
          updateMany: vi.fn(),
        },
      })
    ),
  },
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;

const createCanvasesContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

const createCanvasContext = (id: string, canvasId: string) => ({
  params: Promise.resolve({ id, canvasId }),
});

describe("GET /api/projects/[id]/canvases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvases");
    const res = await GetCanvases(req, createCanvasesContext("proj-1") as any);

    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvases");
    const res = await GetCanvases(req, createCanvasesContext("proj-1") as any);

    expect(res.status).toBe(404);
  });

  it("returns canvases when project exists", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.findMany).mockResolvedValue([
      {
        id: "canvas-1",
        projectId: "proj-1",
        name: "Main",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { canvasBlocks: 2 },
      },
    ] as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvases");
    const res = await GetCanvases(req, createCanvasesContext("proj-1") as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.canvases).toHaveLength(1);
    expect(json.canvases[0].name).toBe("Main");
    expect(json.canvases[0].blocksCount).toBe(2);
  });
});

describe("POST /api/projects/[id]/canvases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new canvas", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.aggregate).mockResolvedValue({
      _max: { order: 0 },
    } as any);
    vi.mocked(prisma.canvas.create).mockResolvedValue({
      id: "canvas-new",
      projectId: "proj-1",
      name: "Untitled Canvas",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvases", {
      method: "POST",
      body: JSON.stringify({ name: "Untitled Canvas" }),
    });
    const res = await PostCanvas(req, createCanvasesContext("proj-1") as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("canvas-new");
    expect(json.name).toBe("Untitled Canvas");
  });
});

describe("GET /api/projects/[id]/canvases/[canvasId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1"
    );
    const res = await GetCanvasBlocks(
      req,
      createCanvasContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(401);
  });

  it("returns 404 when canvas not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1"
    );
    const res = await GetCanvasBlocks(
      req,
      createCanvasContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(404);
  });

  it("returns blocks when canvas exists", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue({
      id: "canvas-1",
      projectId: "proj-1",
      name: "Main",
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvasBlock.findMany).mockResolvedValue([
      {
        id: "block-1",
        canvasId: "canvas-1",
        order: 0,
        type: "note",
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        content: {},
        color: null,
        title: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1"
    );
    const res = await GetCanvasBlocks(
      req,
      createCanvasContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.blocks).toHaveLength(1);
    expect(json.blocks[0].type).toBe("note");
  });
});

describe("PUT /api/projects/[id]/canvases/[canvasId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid lastSavedAt", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue({
      id: "canvas-1",
      projectId: "proj-1",
      name: "Main",
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1",
      {
        method: "PUT",
        body: JSON.stringify({
          blocks: [
            {
              id: "b1",
              type: "note",
              x: 0,
              y: 0,
              width: 300,
              height: 200,
              content: {},
            },
          ],
          lastSavedAt: "not-a-date",
        }),
      }
    );
    const res = await PutCanvasBlocks(
      req,
      createCanvasContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Validation failed");
  });

  it("saves valid blocks", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue({
      id: "canvas-1",
      projectId: "proj-1",
      name: "Main",
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      const tx = {
        canvasBlock: {
          deleteMany: vi.fn().mockResolvedValue(undefined),
          createMany: vi.fn().mockResolvedValue(undefined),
        },
        canvas: {
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
      };
      return fn(tx as any);
    });

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1",
      {
        method: "PUT",
        body: JSON.stringify({
          blocks: [
            {
              id: "note-1",
              type: "note",
              x: 100,
              y: 50,
              width: 300,
              height: 200,
              content: {},
            },
          ],
        }),
      }
    );
    const res = await PutCanvasBlocks(
      req,
      createCanvasContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.updatedAt).toBeDefined();
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("returns 409 when lastSavedAt is stale", async () => {
    const oldDate = new Date("2024-01-01T00:00:00.000Z");

    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue({
      id: "canvas-1",
      projectId: "proj-1",
      name: "Main",
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      const tx = {
        canvasBlock: {
          deleteMany: vi.fn().mockResolvedValue(undefined),
          createMany: vi.fn().mockResolvedValue(undefined),
        },
        canvas: {
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
        },
      };
      return fn(tx as any);
    });

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1",
      {
        method: "PUT",
        body: JSON.stringify({
          blocks: [
            {
              id: "note-1",
              type: "note",
              x: 0,
              y: 0,
              width: 300,
              height: 200,
              content: {},
            },
          ],
          lastSavedAt: oldDate.toISOString(),
        }),
      }
    );
    const res = await PutCanvasBlocks(
      req,
      createCanvasContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toContain("updated elsewhere");
  });
});
