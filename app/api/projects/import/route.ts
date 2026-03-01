import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/app/generated/prisma-client";
import prisma from "@/lib/db";
import { parseImportPayload } from "@/lib/export/canvas-import";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

/**
 * POST /api/projects/import
 * Import a project from JSON (project or single-canvas export format).
 * Creates new project, canvases, and blocks with fresh IDs.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError(401, "Unauthorized");
    }

    const body = await req.json().catch(() => null);
    if (body === null) {
      return apiError(400, { message: "Invalid JSON body" });
    }

    const result = parseImportPayload(body);
    if (result.ok === false) {
      return apiError(400, {
        message: "Invalid import file",
        details: result.error,
      });
    }

    const { project: projectData, canvases } = result.data;

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          userId,
          name: projectData.name,
          description: projectData.description ?? null,
          icon: projectData.icon ?? null,
          status: projectData.status ?? "active",
          canvases: {
            create: canvases.map((canvas, canvasOrder) => ({
              name: canvas.name,
              order: canvas.order,
              canvasBlocks: {
                create: canvas.blocks.map((block, blockOrder) => ({
                  order: blockOrder,
                  type: block.type,
                  x: block.x,
                  y: block.y,
                  width: block.width,
                  height: block.height,
                  content: (block.content ?? {}) as Prisma.InputJsonValue,
                  color: block.color ?? null,
                  title: block.title ?? null,
                })),
              },
            })),
          },
        },
        include: {
          canvases: {
            orderBy: { order: "asc" },
          },
        },
      });

      // Create documents for each canvas (requires projectId and canvasId from created records)
      // created.canvases is ordered by order:asc; match by (order, name) since array indices may not align
      for (const canvasData of canvases) {
        const docs = canvasData.documents ?? [];
        if (docs.length === 0) continue;

        const createdCanvas = created.canvases.find(
          (c) => c.order === canvasData.order && c.name === canvasData.name
        );
        if (!createdCanvas) continue;

        await tx.document.createMany({
          data: docs.map((doc, docOrder) => ({
            canvasId: createdCanvas.id,
            projectId: created.id,
            name: doc.name,
            order: doc.order ?? docOrder,
            content: (doc.content ?? null) as Prisma.InputJsonValue,
          })),
        });
      }

      return created;
    });

    const firstCanvas = project.canvases?.[0];
    return NextResponse.json({
      id: project.id,
      name: project.name,
      firstCanvasId: firstCanvas?.id ?? null,
    });
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/projects/import");
  }
}
