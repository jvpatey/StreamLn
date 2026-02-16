import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/projects/route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;

describe("GET /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects");
    const res = await GET(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
    expect(prisma.project.findMany).not.toHaveBeenCalled();
  });

  it("returns projects with block count when authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findMany).mockResolvedValue([
      {
        id: "proj-1",
        userId: "user-123",
        name: "Test",
        description: null,
        icon: null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        canvases: [
          {
            id: "canvas-1",
            projectId: "proj-1",
            name: "Main",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            _count: { canvasBlocks: 5 },
          },
        ],
      },
    ] as any);

    const req = new NextRequest("http://localhost/api/projects");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveLength(1);
    expect(json[0].blocks).toBe(5);
    expect(json[0].canvasCount).toBe(1);
    expect(json[0].name).toBe("Test");
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { userId: "user-123" },
      include: {
        canvases: {
          include: { _count: { select: { canvasBlocks: true } } },
        },
      },
    });
  });
});

describe("POST /api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid input", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);

    const req = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Validation failed");
    expect(json.details).toBeDefined();
    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it("creates project with valid input and default canvas", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.create).mockResolvedValue({
      id: "proj-new",
      userId: "user-123",
      name: "New Project",
      description: "Desc",
      icon: "Folder",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      canvases: [
        {
          id: "canvas-new",
          projectId: "proj-new",
          name: "Main",
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    } as any);

    const req = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "New Project",
        description: "Desc",
        icon: "Folder",
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe("New Project");
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        name: "New Project",
        description: "Desc",
        icon: "Folder",
        canvases: {
          create: { name: "Main", order: 0 },
        },
      },
      include: { canvases: true },
    });
  });

  it("creates project with custom canvas name", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.create).mockResolvedValue({
      id: "proj-new",
      userId: "user-123",
      name: "New Project",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      canvases: [
        {
          id: "canvas-new",
          projectId: "proj-new",
          name: "Overview",
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    } as any);

    const req = new NextRequest("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "New Project",
        canvasName: "Overview",
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const createCall = vi.mocked(prisma.project.create).mock.calls[0][0];
    expect(createCall.data.canvases.create.name).toBe("Overview");
    expect(createCall.data.name).toBe("New Project");
  });
});
