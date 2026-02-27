import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { createShareTokenSchema } from "@/lib/validations/canvas";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

async function getCanvasOrError(projectId: string, canvasId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: apiError(401, "Unauthorized") };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { error: apiError(404, "Project not found") };
  }

  if (project.userId !== userId) {
    return { error: apiError(403, "Forbidden") };
  }

  const canvas = await prisma.canvas.findFirst({
    where: { id: canvasId, projectId },
  });

  if (!canvas) {
    return { error: apiError(404, "Canvas not found") };
  }

  return { canvas };
}

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

// GET /api/projects/[id]/canvases/[canvasId]/share - List active tokens
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const tokens = await prisma.canvasShareToken.findMany({
      where: {
        canvasId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      tokens: tokens.map((t) => ({
        id: t.id,
        token: t.token,
        expiresAt: t.expiresAt?.toISOString() ?? null,
        createdAt: t.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "GET /api/projects/[id]/canvases/[canvasId]/share"
    );
  }
}

// POST /api/projects/[id]/canvases/[canvasId]/share - Create share token
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const body = await req.json().catch(() => ({}));
    const parsed = createShareTokenSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const expiresInDays = parsed.data.expiresIn;
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    let token: string;
    let existing: { id: string } | null;
    do {
      token = generateToken();
      existing = await prisma.canvasShareToken.findUnique({
        where: { token },
        select: { id: true },
      });
    } while (existing);

    const shareToken = await prisma.canvasShareToken.create({
      data: {
        token,
        canvasId,
        expiresAt,
      },
    });

    return NextResponse.json({
      id: shareToken.id,
      token: shareToken.token,
      expiresAt: shareToken.expiresAt?.toISOString() ?? null,
      createdAt: shareToken.createdAt.toISOString(),
    });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "POST /api/projects/[id]/canvases/[canvasId]/share"
    );
  }
}
