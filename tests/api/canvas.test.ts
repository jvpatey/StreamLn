import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT } from "@/app/api/projects/[id]/canvas/route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findUnique: vi.fn(),
    },
    canvasBlock: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn((fn) => fn({
      canvasBlock: {
        deleteMany: vi.fn(),
        upsert: vi.fn(),
      },
    })),
  },
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("GET /api/projects/[id]/canvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvas");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvas");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(404);
  });

  it("returns blocks when project exists and is owned", async () => {
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
    vi.mocked(prisma.canvasBlock.findMany).mockResolvedValue([
      {
        id: "block-1",
        projectId: "proj-1",
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

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvas");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.blocks).toHaveLength(1);
    expect(json.blocks[0].type).toBe("note");
  });
});

describe("PUT /api/projects/[id]/canvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid blocks", async () => {
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

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvas", {
      method: "PUT",
      body: JSON.stringify({
        blocks: [{ id: "b1", type: "invalid", x: 0, y: 0, width: 0, height: 0 }],
      }),
    });
    const res = await PUT(req, createContext("proj-1") as any);

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
    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      const tx = {
        canvasBlock: {
          deleteMany: vi.fn().mockResolvedValue(undefined),
          upsert: vi.fn().mockResolvedValue(undefined),
        },
        project: {
          update: vi.fn().mockResolvedValue({
            id: "proj-1",
            updatedAt: new Date("2024-01-15T10:00:00.000Z"),
          }),
        },
      };
      return fn(tx as any);
    });

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvas", {
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
    });
    const res = await PUT(req, createContext("proj-1") as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.updatedAt).toBeDefined();
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("returns 409 when lastSavedAt is stale", async () => {
    const oldDate = new Date("2024-01-01T00:00:00.000Z");
    const newerDate = new Date("2024-01-02T00:00:00.000Z");

    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "user-123",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: newerDate,
    } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/canvas", {
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
    });
    const res = await PUT(req, createContext("proj-1") as any);

    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toContain("updated elsewhere");
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
