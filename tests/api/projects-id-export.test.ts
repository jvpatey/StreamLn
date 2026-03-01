import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/projects/[id]/export/route";

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
    },
  },
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("GET /api/projects/[id]/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/export");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
    expect(prisma.project.findUnique).not.toHaveBeenCalled();
    expect(prisma.canvas.findMany).not.toHaveBeenCalled();
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/projects/proj-missing/export");
    const res = await GET(req, createContext("proj-missing") as any);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Project not found");
    expect(prisma.canvas.findMany).not.toHaveBeenCalled();
  });

  it("returns 403 when project belongs to another user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "other-user",
      name: "Other Project",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/export");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Forbidden");
    expect(prisma.canvas.findMany).not.toHaveBeenCalled();
  });

  it("returns project with ordered canvases and blocks with ISO timestamps on success", async () => {
    const project = {
      id: "proj-1",
      userId: "user-123",
      name: "My Project",
      description: "A project",
      icon: "Folder",
      status: "active",
      createdAt: new Date("2025-01-15T10:00:00.000Z"),
      updatedAt: new Date("2025-01-16T12:00:00.000Z"),
    };

    const canvases = [
      {
        id: "canvas-1",
        projectId: "proj-1",
        name: "Overview",
        order: 0,
        createdAt: new Date("2025-01-15T10:01:00.000Z"),
        updatedAt: new Date("2025-01-15T10:01:00.000Z"),
        canvasBlocks: [
          {
            id: "block-1",
            type: "note",
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            content: { text: "Hello" },
            color: null,
            title: null,
            order: 0,
            createdAt: new Date("2025-01-15T10:02:00.000Z"),
            updatedAt: new Date("2025-01-15T10:02:00.000Z"),
          },
        ],
        documents: [],
      },
      {
        id: "canvas-2",
        projectId: "proj-1",
        name: "Details",
        order: 1,
        createdAt: new Date("2025-01-15T10:03:00.000Z"),
        updatedAt: new Date("2025-01-15T10:03:00.000Z"),
        canvasBlocks: [],
        documents: [],
      },
    ];

    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(project as any);
    vi.mocked(prisma.canvas.findMany).mockResolvedValue(canvases as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1/export");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.project).toEqual({
      id: "proj-1",
      name: "My Project",
      description: "A project",
      icon: "Folder",
      status: "active",
      createdAt: "2025-01-15T10:00:00.000Z",
      updatedAt: "2025-01-16T12:00:00.000Z",
    });

    expect(json.canvases).toHaveLength(2);
    expect(json.canvases[0].name).toBe("Overview");
    expect(json.canvases[0].order).toBe(0);
    expect(json.canvases[0].createdAt).toBe("2025-01-15T10:01:00.000Z");
    expect(json.canvases[0].updatedAt).toBe("2025-01-15T10:01:00.000Z");
    expect(json.canvases[0].blocks).toHaveLength(1);
    expect(json.canvases[0].blocks[0]).toEqual({
      id: "block-1",
      type: "note",
      x: 0,
      y: 0,
      width: 200,
      height: 100,
      content: { text: "Hello" },
      color: null,
      title: null,
      order: 0,
      createdAt: "2025-01-15T10:02:00.000Z",
      updatedAt: "2025-01-15T10:02:00.000Z",
    });

    expect(json.canvases[1].name).toBe("Details");
    expect(json.canvases[1].order).toBe(1);
    expect(json.canvases[1].blocks).toEqual([]);
    expect(json.canvases[0].documents).toEqual([]);
    expect(json.canvases[1].documents).toEqual([]);

    expect(prisma.canvas.findMany).toHaveBeenCalledWith({
      where: { projectId: "proj-1" },
      orderBy: { order: "asc" },
      include: {
        canvasBlocks: {
          orderBy: { order: "asc" },
        },
        documents: {
          orderBy: { order: "asc" },
        },
      },
    });
  });
});
