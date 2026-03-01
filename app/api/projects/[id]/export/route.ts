import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
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

/**
 * GET /api/projects/[id]/export
 * Returns project with all canvases and their blocks for project-level export.
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params;
  try {
    const result = await getProjectOrError(projectId);
    if (result.error) return result.error;

    const canvases = await prisma.canvas.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      include: {
        canvasBlocks: {
          orderBy: { order: "asc" },
        },
        documents: {
          orderBy: { order: "asc" },
        },
      },
    });

    const project = result.project;
    const canvasesWithBlocks = canvases.map(
      ({ canvasBlocks, documents, ...canvas }) => ({
        ...canvas,
        blocks: canvasBlocks.map((b) => ({
          id: b.id,
          type: b.type,
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height,
          content: b.content,
          color: b.color,
          title: b.title,
          order: b.order,
          createdAt: b.createdAt.toISOString(),
          updatedAt: b.updatedAt.toISOString(),
        })),
        documents: documents.map((d) => ({
          id: d.id,
          name: d.name,
          order: d.order,
          content: d.content,
        })),
      })
    );

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        icon: project.icon,
        status: project.status,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
      canvases: canvasesWithBlocks.map((c) => ({
        id: c.id,
        name: c.name,
        order: c.order,
        projectId: c.projectId,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        blocks: c.blocks,
        documents: c.documents,
      })),
    });
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/projects/[id]/export");
  }
}
