import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  createDocumentSchema,
  reorderDocumentsSchema,
} from "@/lib/validations/canvas";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

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

// GET /api/projects/[id]/canvases/[canvasId]/documents - List documents for canvas
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const documents = await prisma.document.findMany({
      where: { canvasId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "GET /api/projects/[id]/canvases/[canvasId]/documents"
    );
  }
}

// POST /api/projects/[id]/canvases/[canvasId]/documents - Create document
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const body = await req.json().catch(() => ({}));
    const parsed = createDocumentSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const count = await prisma.document.count({ where: { canvasId } });
    const order = parsed.data.order ?? count;

    const document = await prisma.document.create({
      data: {
        canvasId,
        projectId,
        name: parsed.data.name ?? "Untitled Document",
        order,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    return handleUnexpectedError(
      error,
      "POST /api/projects/[id]/canvases/[canvasId]/documents"
    );
  }
}

// PATCH /api/projects/[id]/canvases/[canvasId]/documents - Batch reorder documents
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string }> }
) {
  const { id: projectId, canvasId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const body = await req.json();
    const parsed = reorderDocumentsSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    await Promise.all(
      parsed.data.updates.map(({ id, order }) =>
        prisma.document.updateMany({
          where: { id, canvasId, projectId },
          data: { order, updatedAt: new Date() },
        })
      )
    );

    const documents = await prisma.document.findMany({
      where: { canvasId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "PATCH /api/projects/[id]/canvases/[canvasId]/documents"
    );
  }
}
