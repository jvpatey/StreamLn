import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  GET,
  DELETE,
  PATCH,
  PUT,
} from "@/app/api/projects/[id]/route";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const { auth } = await import("@clerk/nextjs/server");
const prisma = (await import("@/lib/db")).default;

const createContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

describe("GET /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/projects/proj-1");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe("Project not found");
  });

  it("returns 403 when project belongs to another user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue({
      id: "proj-1",
      userId: "other-user",
      name: "Test",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("Forbidden");
  });

  it("returns project when owned by user", async () => {
    const project = {
      id: "proj-1",
      userId: "user-123",
      name: "My Project",
      description: null,
      icon: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(auth).mockResolvedValue({ userId: "user-123" } as any);
    vi.mocked(prisma.project.findUnique).mockResolvedValue(project as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1");
    const res = await GET(req, createContext("proj-1") as any);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe("My Project");
  });
});

describe("PATCH /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid status", async () => {
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

    const req = new NextRequest("http://localhost/api/projects/proj-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "invalid" }),
    });
    const res = await PATCH(req, createContext("proj-1") as any);

    expect(res.status).toBe(400);
    expect(prisma.project.update).not.toHaveBeenCalled();
  });

  it("updates status when valid", async () => {
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
    vi.mocked(prisma.project.update).mockResolvedValue({} as any);

    const req = new NextRequest("http://localhost/api/projects/proj-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "archived" }),
    });
    const res = await PATCH(req, createContext("proj-1") as any);

    expect(res.status).toBe(200);
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: "proj-1" },
      data: { status: "archived" },
    });
  });
});
