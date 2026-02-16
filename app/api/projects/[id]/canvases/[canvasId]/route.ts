import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/app/generated/prisma-client";
import prisma from "@/lib/db";
import {
  saveCanvasBlocksSchema,
  updateCanvasSchema,
} from "@/lib/validations/canvas";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

class OptimisticLockConflictError extends Error {
  constructor() {
    super("Optimistic lock conflict");
  }
}

async function getProjectOrError(projectId: string) {
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

  return { project };
}

async function getCanvasOrError(projectId: string, canvasId: string) {
  const projResult = await getProjectOrError(projectId);
  if ("error" in projResult) return { error: projResult.error };

  const canvas = await prisma.canvas.findFirst({
    where: { id: canvasId, projectId },
  });

  if (!canvas) {
    return { error: apiError(404, "Canvas not found") };
  }

  return { canvas };
}

// GET /api/projects/[id]/canvases/[canvasId] - Fetch blocks for canvas
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const blocks = await prisma.canvasBlock.findMany({
      where: { canvasId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ blocks, canvas: result.canvas });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "GET /api/projects/[id]/canvases/[canvasId]"
    );
  }
}

// PUT /api/projects/[id]/canvases/[canvasId] - Full sync: upsert blocks, delete orphans
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const body = await req.json();
    const parsed = saveCanvasBlocksSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const blocks = parsed.data.blocks;
    const lastSavedAt = parsed.data.lastSavedAt;

    const newUpdatedAt = await prisma.$transaction(async (tx) => {
      await tx.canvasBlock.deleteMany({ where: { canvasId } });

      if (blocks.length > 0) {
        await tx.canvasBlock.createMany({
          data: blocks.map((b, i) => ({
            id: b.id,
            canvasId,
            order: i,
            type: b.type ?? "note",
            x: typeof b.x === "number" ? b.x : 0,
            y: typeof b.y === "number" ? b.y : 0,
            width: typeof b.width === "number" ? b.width : 300,
            height: typeof b.height === "number" ? b.height : 200,
            content: (b.content ?? {}) as Prisma.InputJsonValue,
            color: b.color ?? null,
            title: b.title ?? null,
          })),
        });
      }

      const timestamp = new Date();
      const updateResult = await tx.canvas.updateMany({
        where: lastSavedAt
          ? { id: canvasId, updatedAt: new Date(lastSavedAt) }
          : { id: canvasId },
        data: { updatedAt: timestamp },
      });
      if (updateResult.count === 0) {
        throw new OptimisticLockConflictError();
      }
      return timestamp;
    });

    return NextResponse.json({
      success: true,
      updatedAt: newUpdatedAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof OptimisticLockConflictError) {
      return apiError(409, {
        message: "Canvas was updated elsewhere. Please reload.",
      });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiError(400, {
        message: "Block id already exists in another canvas.",
      });
    }
    return handleUnexpectedError(
      error,
      "PUT /api/projects/[id]/canvases/[canvasId]"
    );
  }
}

// PATCH /api/projects/[id]/canvases/[canvasId] - Update canvas (rename, reorder)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const body = await req.json().catch(() => ({}));
    const parsed = updateCanvasSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const data: { name?: string; order?: number } = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.order !== undefined) data.order = parsed.data.order;

    const canvas = await prisma.canvas.update({
      where: { id: canvasId },
      data: { ...data, updatedAt: new Date() },
    });

    return NextResponse.json(canvas);
  } catch (error) {
    return handleUnexpectedError(
      error,
      "PATCH /api/projects/[id]/canvases/[canvasId]"
    );
  }
}

// DELETE /api/projects/[id]/canvases/[canvasId] - Delete canvas and its blocks
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    await prisma.canvas.delete({
      where: { id: canvasId },
    });

    return NextResponse.json({ message: "Canvas deleted successfully" });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "DELETE /api/projects/[id]/canvases/[canvasId]"
    );
  }
}
