import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
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

// GET /api/projects/[id]/project-documents - Fetch all canvases with documents for file tree
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params;
  try {
    const result = await getProjectOrError(projectId);
    if ("error" in result) return result.error;

    const canvases = await prisma.canvas.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      include: {
        documents: {
          orderBy: { order: "asc" },
          select: { id: true, name: true, order: true },
        },
      },
    });

    return NextResponse.json({
      canvases: canvases.map((c) => ({
        id: c.id,
        name: c.name,
        order: c.order,
        documents: c.documents,
      })),
    });
  } catch (error) {
    return handleUnexpectedError(
      error,
      "GET /api/projects/[id]/project-documents"
    );
  }
}
