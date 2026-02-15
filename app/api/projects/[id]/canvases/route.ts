import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { createCanvasSchema } from "@/lib/validations/canvas";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

async function getProjectOrError(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: apiError(401, "Unauthorized") };
  }

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return { error: apiError(404, "Project not found") };
  }

  if (project.userId !== userId) {
    return { error: apiError(403, "Forbidden") };
  }

  return { project };
}

// GET /api/projects/[id]/canvases - List canvases for project
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    const canvases = await prisma.canvas.findMany({
      where: { projectId: id },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { canvasBlocks: true } },
      },
    });

    const canvasesWithBlocks = canvases.map(({ _count, ...canvas }) => ({
      ...canvas,
      blocksCount: _count.canvasBlocks,
    }));

    return NextResponse.json({ canvases: canvasesWithBlocks });
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/projects/[id]/canvases");
  }
}

// POST /api/projects/[id]/canvases - Create canvas
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    const body = await req.json().catch(() => ({}));
    const parsed = createCanvasSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const { name, order } = parsed.data;

    const maxOrder = await prisma.canvas
      .aggregate({
        where: { projectId: id },
        _max: { order: true },
      })
      .then((r) => (r._max.order ?? -1) + 1);

    const canvas = await prisma.canvas.create({
      data: {
        projectId: id,
        name: name ?? "Untitled Canvas",
        order: order ?? maxOrder,
      },
    });

    return NextResponse.json(canvas);
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/projects/[id]/canvases");
  }
}
