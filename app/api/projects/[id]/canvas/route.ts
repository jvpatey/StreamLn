import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/projects/[id]/canvas - Fetch all blocks for a project
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

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
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const blocks = Array.isArray(body.blocks) ? body.blocks : [];

    const incomingIds = blocks.map((b: { id: string }) => b.id);

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
            content: b.content ?? {},
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
            content: b.content ?? {},
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
