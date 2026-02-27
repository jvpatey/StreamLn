import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
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

// DELETE /api/projects/[id]/canvases/[canvasId]/share/[tokenId] - Revoke share token
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; canvasId: string; tokenId: string }> }
) {
  const { id: projectId, canvasId, tokenId } = await context.params;
  try {
    const result = await getCanvasOrError(projectId, canvasId);
    if ("error" in result) return result.error;

    const deleted = await prisma.canvasShareToken.deleteMany({
      where: {
        id: tokenId,
        canvasId,
      },
    });

    if (deleted.count === 0) {
      return apiError(404, "Share link not found");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "DELETE /api/projects/[id]/canvases/[canvasId]/share/[tokenId]"
    );
  }
}
