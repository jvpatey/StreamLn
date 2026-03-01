import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  updateDocumentSchema,
  saveDocumentSchema,
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

async function getDocumentOrError(
  projectId: string,
  canvasId: string,
  documentId: string
) {
  const projResult = await getProjectOrError(projectId);
  if ("error" in projResult) return { error: projResult.error };

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      canvasId,
      projectId,
    },
  });

  if (!document) {
    return { error: apiError(404, "Document not found") };
  }

  return { document };
}

// GET /api/projects/[id]/canvases/[canvasId]/documents/[documentId] - Get single document
export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ id: string; canvasId: string; documentId: string }>;
  }
) {
  const { id: projectId, canvasId, documentId } = await context.params;
  try {
    const result = await getDocumentOrError(projectId, canvasId, documentId);
    if ("error" in result) return result.error;

    return NextResponse.json(result.document);
  } catch (error) {
    return handleUnexpectedError(
      error,
      "GET /api/projects/[id]/canvases/[canvasId]/documents/[documentId]"
    );
  }
}

// PATCH /api/projects/[id]/canvases/[canvasId]/documents/[documentId] - Rename, reorder
export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string; canvasId: string; documentId: string }>;
  }
) {
  const { id: projectId, canvasId, documentId } = await context.params;
  try {
    const result = await getDocumentOrError(projectId, canvasId, documentId);
    if ("error" in result) return result.error;

    const body = await req.json().catch(() => ({}));
    const parsed = updateDocumentSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const data: { name?: string; order?: number } = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.order !== undefined) data.order = parsed.data.order;

    const document = await prisma.document.update({
      where: { id: documentId },
      data: { ...data, updatedAt: new Date() },
    });

    return NextResponse.json(document);
  } catch (error) {
    return handleUnexpectedError(
      error,
      "PATCH /api/projects/[id]/canvases/[canvasId]/documents/[documentId]"
    );
  }
}

// DELETE /api/projects/[id]/canvases/[canvasId]/documents/[documentId] - Delete document
export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ id: string; canvasId: string; documentId: string }>;
  }
) {
  const { id: projectId, canvasId, documentId } = await context.params;
  try {
    const result = await getDocumentOrError(projectId, canvasId, documentId);
    if ("error" in result) return result.error;

    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "DELETE /api/projects/[id]/canvases/[canvasId]/documents/[documentId]"
    );
  }
}

// PUT /api/projects/[id]/canvases/[canvasId]/documents/[documentId] - Save document content
export async function PUT(
  req: NextRequest,
  context: {
    params: Promise<{ id: string; canvasId: string; documentId: string }>;
  }
) {
  const { id: projectId, canvasId, documentId } = await context.params;
  try {
    const result = await getDocumentOrError(projectId, canvasId, documentId);
    if ("error" in result) return result.error;

    const body = await req.json();
    const parsed = saveDocumentSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
    }

    const { content, lastSavedAt } = parsed.data;

    const timestamp = new Date();
    const updateResult = await prisma.document.updateMany({
      where: lastSavedAt
        ? { id: documentId, updatedAt: new Date(lastSavedAt) }
        : { id: documentId },
      data: {
        content: content as object,
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
        message: "Document was updated elsewhere. Please reload.",
      });
    }
    return handleUnexpectedError(
      error,
      "PUT /api/projects/[id]/canvases/[canvasId]/documents/[documentId]"
    );
  }
}
