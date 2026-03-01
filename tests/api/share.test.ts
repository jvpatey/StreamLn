import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  GET as GetShareTokens,
  POST as PostShareToken,
} from "@/app/api/projects/[id]/canvases/[canvasId]/share/route";
import { DELETE as DeleteShareToken } from "@/app/api/projects/[id]/canvases/[canvasId]/share/[tokenId]/route";
import { GET as GetSharedCanvas } from "@/app/api/share/[token]/route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findUnique: vi.fn(),
    },
    canvas: {
      findFirst: vi.fn(),
    },
    canvasShareToken: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;

const createShareContext = (id: string, canvasId: string) => ({
  params: Promise.resolve({ id, canvasId }),
});

const createShareTokenIdContext = (id: string, canvasId: string, tokenId: string) => ({
  params: Promise.resolve({ id, canvasId, tokenId }),
});

const createPublicShareContext = (token: string) => ({
  params: Promise.resolve({ token }),
});

const ownedProject = {
  id: "proj-1",
  userId: "user-123",
  name: "Test Project",
  description: null,
  icon: null,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const ownedCanvas = {
  id: "canvas-1",
  projectId: "proj-1",
  name: "Main Canvas",
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("GET /api/projects/[id]/canvases/[canvasId]/share", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share"
    );
    const res = await GetShareTokens(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share"
    );
    const res = await GetShareTokens(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Project not found");
  });

  it("returns 403 when project belongs to another user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      ...ownedProject,
      userId: "other-user",
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share"
    );
    const res = await GetShareTokens(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Forbidden");
  });

  it("returns 404 when canvas not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share"
    );
    const res = await GetShareTokens(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Canvas not found");
  });

  it("returns tokens when project and canvas exist", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);
    vi.mocked(prisma.canvasShareToken.findMany).mockResolvedValue([
      {
        id: "token-1",
        token: "abc123token",
        canvasId: "canvas-1",
        expiresAt: null,
        createdAt: new Date(),
      },
      {
        id: "token-2",
        token: "def456token",
        canvasId: "canvas-1",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    ] as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share"
    );
    const res = await GetShareTokens(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.tokens).toHaveLength(2);
    expect(json.tokens[0].id).toBe("token-1");
    expect(json.tokens[0].token).toBe("abc123token");
    expect(json.tokens[0].expiresAt).toBeNull();
    expect(json.tokens[1].expiresAt).toBeDefined();
  });
});

describe("POST /api/projects/[id]/canvases/[canvasId]/share", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({}) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({}) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(404);
  });

  it("returns 403 when project belongs to another user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      ...ownedProject,
      userId: "other-user",
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({}) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid expiresIn (out of range)", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({ expiresIn: 500 }) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Validation failed");
    expect(prisma.canvasShareToken.create).not.toHaveBeenCalled();
  });

  it("creates token with no expiry when body is empty", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.canvasShareToken.create).mockResolvedValue({
      id: "token-new",
      token: "generated-token-xyz",
      canvasId: "canvas-1",
      expiresAt: null,
      createdAt: new Date(),
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({}) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("token-new");
    expect(json.token).toBe("generated-token-xyz");
    expect(json.expiresAt).toBeNull();
    expect(prisma.canvasShareToken.create).toHaveBeenCalledWith({
      data: {
        token: expect.any(String),
        canvasId: "canvas-1",
        expiresAt: null,
      },
    });
  });

  it("creates token with 7 days expiry", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue(null);
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    vi.mocked(prisma.canvasShareToken.create).mockResolvedValue({
      id: "token-7d",
      token: "token-7days",
      canvasId: "canvas-1",
      expiresAt: futureDate,
      createdAt: new Date(),
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({ expiresIn: 7 }) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("token-7d");
    expect(json.expiresAt).toBeDefined();
    expect(prisma.canvasShareToken.create).toHaveBeenCalledWith({
      data: {
        token: expect.any(String),
        canvasId: "canvas-1",
        expiresAt: expect.any(Date),
      },
    });
    const callData = vi.mocked(prisma.canvasShareToken.create).mock.calls[0][0]
      .data as { expiresAt: Date };
    const expiresAtMs = callData.expiresAt.getTime();
    const expectedMin = Date.now() + 6.9 * 24 * 60 * 60 * 1000;
    const expectedMax = Date.now() + 7.1 * 24 * 60 * 60 * 1000;
    expect(expiresAtMs).toBeGreaterThanOrEqual(expectedMin);
    expect(expiresAtMs).toBeLessThanOrEqual(expectedMax);
  });

  it("creates token with 30 days expiry", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue(null);
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    vi.mocked(prisma.canvasShareToken.create).mockResolvedValue({
      id: "token-30d",
      token: "token-30days",
      canvasId: "canvas-1",
      expiresAt: futureDate,
      createdAt: new Date(),
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share",
      { method: "POST", body: JSON.stringify({ expiresIn: 30 }) }
    );
    const res = await PostShareToken(
      req,
      createShareContext("proj-1", "canvas-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe("token-30d");
    expect(json.expiresAt).toBeDefined();
  });
});

describe("DELETE /api/projects/[id]/canvases/[canvasId]/share/[tokenId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share/token-1",
      { method: "DELETE" }
    );
    const res = await DeleteShareToken(
      req,
      createShareTokenIdContext("proj-1", "canvas-1", "token-1") as any
    );

    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share/token-1",
      { method: "DELETE" }
    );
    const res = await DeleteShareToken(
      req,
      createShareTokenIdContext("proj-1", "canvas-1", "token-1") as any
    );

    expect(res.status).toBe(404);
  });

  it("returns 403 when project belongs to another user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      ...ownedProject,
      userId: "other-user",
    } as any);

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share/token-1",
      { method: "DELETE" }
    );
    const res = await DeleteShareToken(
      req,
      createShareTokenIdContext("proj-1", "canvas-1", "token-1") as any
    );

    expect(res.status).toBe(403);
  });

  it("returns 404 when share token not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);
    vi.mocked(prisma.canvasShareToken.deleteMany).mockResolvedValue({
      count: 0,
    });

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share/token-nonexistent",
      { method: "DELETE" }
    );
    const res = await DeleteShareToken(
      req,
      createShareTokenIdContext(
        "proj-1",
        "canvas-1",
        "token-nonexistent"
      ) as any
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Share link not found");
  });

  it("revokes share token successfully", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(ownedProject as any);
    vi.mocked(prisma.canvas.findFirst).mockResolvedValue(ownedCanvas as any);
    vi.mocked(prisma.canvasShareToken.deleteMany).mockResolvedValue({
      count: 1,
    });

    const req = new NextRequest(
      "http://localhost/api/projects/proj-1/canvases/canvas-1/share/token-1",
      { method: "DELETE" }
    );
    const res = await DeleteShareToken(
      req,
      createShareTokenIdContext("proj-1", "canvas-1", "token-1") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(prisma.canvasShareToken.deleteMany).toHaveBeenCalledWith({
      where: {
        id: "token-1",
        canvasId: "canvas-1",
      },
    });
  });
});

describe("GET /api/share/[token] (public canvas access)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 for token that is too short", async () => {
    const req = new NextRequest("http://localhost/api/share/abc");
    const res = await GetSharedCanvas(
      req,
      createPublicShareContext("abc") as any
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Share link not found");
    expect(prisma.canvasShareToken.findUnique).not.toHaveBeenCalled();
  });

  it("returns 404 for empty token", async () => {
    const req = new NextRequest("http://localhost/api/share/");
    const res = await GetSharedCanvas(
      req,
      createPublicShareContext("") as any
    );

    expect(res.status).toBe(404);
  });

  it("returns 404 for non-existent token", async () => {
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue(null);

    const req = new NextRequest(
      "http://localhost/api/share/invalid-token-that-does-not-exist"
    );
    const res = await GetSharedCanvas(
      req,
      createPublicShareContext("invalid-token-that-does-not-exist") as any
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Share link not found");
  });

  it("returns 404 for expired token", async () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue({
      id: "token-1",
      token: "valid-but-expired-token",
      canvasId: "canvas-1",
      expiresAt: pastDate,
      createdAt: new Date(),
      canvas: {} as any,
    } as any);

    const req = new NextRequest(
      "http://localhost/api/share/valid-but-expired-token"
    );
    const res = await GetSharedCanvas(
      req,
      createPublicShareContext("valid-but-expired-token") as any
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Share link has expired");
  });

  it("returns canvas data for valid token", async () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue({
      id: "token-1",
      token: "valid-share-token-xyz",
      canvasId: "canvas-1",
      expiresAt: futureDate,
      createdAt: new Date(),
      canvas: {
        name: "Shared Canvas",
        project: { name: "My Project" },
        canvasBlocks: [
          {
            id: "block-1",
            type: "note",
            x: 0,
            y: 0,
            width: 300,
            height: 200,
            content: {},
            color: null,
            title: "Note",
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        documents: [],
      },
    } as any);

    const req = new NextRequest(
      "http://localhost/api/share/valid-share-token-xyz"
    );
    const res = await GetSharedCanvas(
      req,
      createPublicShareContext("valid-share-token-xyz") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.projectName).toBe("My Project");
    expect(json.canvasName).toBe("Shared Canvas");
    expect(json.blocks).toHaveLength(1);
    expect(json.blocks[0].type).toBe("note");
    expect(json.blocks[0].title).toBe("Note");
    expect(json.documents).toEqual([]);
    expect(json.expiresAt).toBeDefined();
  });

  it("returns canvas data for valid token with no expiry", async () => {
    vi.mocked(prisma.canvasShareToken.findUnique).mockResolvedValue({
      id: "token-2",
      token: "never-expires-token",
      canvasId: "canvas-1",
      expiresAt: null,
      createdAt: new Date(),
      canvas: {
        name: "Forever Canvas",
        project: { name: "Project" },
        canvasBlocks: [],
        documents: [],
      },
    } as any);

    const req = new NextRequest(
      "http://localhost/api/share/never-expires-token"
    );
    const res = await GetSharedCanvas(
      req,
      createPublicShareContext("never-expires-token") as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.projectName).toBe("Project");
    expect(json.canvasName).toBe("Forever Canvas");
    expect(json.blocks).toEqual([]);
    expect(json.documents).toEqual([]);
    expect(json.expiresAt).toBeNull();
  });
});
