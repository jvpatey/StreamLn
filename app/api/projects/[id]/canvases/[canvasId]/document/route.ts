import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { saveCanvasDocumentSchema } from "@/lib/validations/canvas";
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

// PUT /api/projects/[id]/canvases/[canvasId]/document - Save document content
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const body = await req.json();
    const parsed = saveCanvasDocumentSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const { documentContent, lastSavedAt } = parsed.data;

    const timestamp = new Date();
    const updateResult = await prisma.canvas.updateMany({
      where: lastSavedAt
        ? { id: canvasId, updatedAt: new Date(lastSavedAt) }
        : { id: canvasId },
      data: {
        documentContent: documentContent as object,
        updatedAt: timestamp,
      },
    });

    if (updateResult.count === 0) {
      throw new OptimisticLockConflictError();
    }

    return NextResponse.json({
      success: true,
      updatedAt: timestamp.toISOString(),
    });
  } catch (error) {
    if (error instanceof OptimisticLockConflictError) {
      return apiError(409, {
        message: "Canvas was updated elsewhere. Please reload.",
      });
    }
    return handleUnexpectedError(
      error,
      "PUT /api/projects/[id]/canvases/[canvasId]/document"
    );
  }
}
