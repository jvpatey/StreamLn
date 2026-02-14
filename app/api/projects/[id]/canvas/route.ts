import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/app/generated/prisma-client";
import prisma from "@/lib/db";
import { saveCanvasBlocksSchema } from "@/lib/validations/canvas";

async function getProjectOrError(id: string) {
  const { userId } = await auth();
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    return { error: NextResponse.json({ error: "Project not found" }, { status: 404 }) };
  }

  if (project.userId !== userId) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { project };
}

// GET /api/projects/[id]/canvas - Fetch all blocks for a project
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    const blocks = await prisma.canvasBlock.findMany({
      where: { projectId: id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch canvas blocks." },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]/canvas - Full sync: upsert blocks, delete orphans
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    const body = await req.json();
    const parsed = saveCanvasBlocksSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return NextResponse.json(
        { error: "Validation failed", details: message },
        { status: 400 }
      );
    }

    const blocks = parsed.data.blocks;
    const incomingIds = blocks.map((b) => b.id);

    await prisma.$transaction(async (tx) => {
      // Delete blocks not in the incoming list
      await tx.canvasBlock.deleteMany({
        where: {
          projectId: id,
          id: { notIn: incomingIds },
        },
      });

      // Upsert each block
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        await tx.canvasBlock.upsert({
          where: { id: b.id },
          create: {
            id: b.id,
            projectId: id,
            order: i,
            type: b.type ?? "note",
            x: typeof b.x === "number" ? b.x : 0,
            y: typeof b.y === "number" ? b.y : 0,
            width: typeof b.width === "number" ? b.width : 300,
            height: typeof b.height === "number" ? b.height : 200,
            content: (b.content ?? {}) as Prisma.InputJsonValue,
            color: b.color ?? null,
            title: b.title ?? null,
          },
          update: {
            order: i,
            type: b.type ?? "note",
            x: typeof b.x === "number" ? b.x : 0,
            y: typeof b.y === "number" ? b.y : 0,
            width: typeof b.width === "number" ? b.width : 300,
            height: typeof b.height === "number" ? b.height : 200,
            content: (b.content ?? {}) as Prisma.InputJsonValue,
            color: b.color ?? null,
            title: b.title ?? null,
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save canvas blocks." },
      { status: 500 }
    );
  }
}
