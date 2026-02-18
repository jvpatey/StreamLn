import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/projects/import/route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/export/canvas-import", () => ({
  parseImportPayload: vi.fn(),
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;
const { parseImportPayload } = await import("@/lib/export/canvas-import");

const validProjectPayload = {
  project: { name: "Imported Project", description: null, icon: null, status: "active" },
  canvases: [
    {
      name: "Main",
      order: 0,
      blocks: [
        {
          type: "note" as const,
          x: 0,
          y: 0,
          width: 200,
          height: 100,
          content: {},
          color: null,
          title: null,
          order: 0,
        },
      ],
    },
  ],
};

describe("POST /api/projects/import", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects/import", {
      method: "POST",
      body: JSON.stringify({
        project: { name: "Test" },
        canvases: [],
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
    expect(parseImportPayload).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON body", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);

    const req = new NextRequest("http://localhost/api/projects/import", {
      method: "POST",
      body: "not valid json {{{",
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid JSON body");
    expect(parseImportPayload).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid payload shape", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(parseImportPayload).mockReturnValue({
      ok: false,
      error: "Invalid import file: expected project or single-canvas export format",
    });

    const req = new NextRequest("http://localhost/api/projects/import", {
      method: "POST",
      body: JSON.stringify({ foo: "bar" }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Invalid import file");
    expect(json.details).toBeDefined();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("creates project, canvases, and blocks and returns firstCanvasId on successful import", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(parseImportPayload).mockReturnValue({
      ok: true,
      data: validProjectPayload,
    });

    const createdProject = {
      id: "proj-imported",
      userId: "user-123",
      name: "Imported Project",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      canvases: [
        {
          id: "canvas-imported",
          projectId: "proj-imported",
          name: "Main",
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      const tx = {
        project: {
          create: vi.fn().mockResolvedValue(createdProject),
        },
      };
      return fn(tx as any);
    });

    const req = new NextRequest("http://localhost/api/projects/import", {
      method: "POST",
      body: JSON.stringify({
        project: { name: "Imported Project" },
        canvases: [
          {
            name: "Main",
            order: 0,
            blocks: [
              { type: "note", x: 0, y: 0, width: 200, height: 100, content: {} },
            ],
          },
        ],
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("proj-imported");
    expect(json.name).toBe("Imported Project");
    expect(json.firstCanvasId).toBe("canvas-imported");
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("returns firstCanvasId null when import has no canvases", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(parseImportPayload).mockReturnValue({
      ok: true,
      data: {
        project: { name: "Empty Import", description: null, icon: null, status: "active" },
        canvases: [],
      },
    });

    const createdProject = {
      id: "proj-empty",
      userId: "user-123",
      name: "Empty Import",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      canvases: [],
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (fn) => {
      const tx = {
        project: {
          create: vi.fn().mockResolvedValue(createdProject),
        },
      };
      return fn(tx as any);
    });

    const req = new NextRequest("http://localhost/api/projects/import", {
      method: "POST",
      body: JSON.stringify({
        project: { name: "Empty Import" },
        canvases: [],
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.firstCanvasId).toBeNull();
  });
});
