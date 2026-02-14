import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { createProjectSchema } from "@/lib/validations/project";

// GET /api/projects - List projects for the authenticated user
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      _count: { select: { canvasBlocks: true } },
    },
  });

  const projectsWithBlocks = projects.map(({ _count, ...project }) => ({
    ...project,
    blocks: _count.canvasBlocks,
  }));

  return NextResponse.json(projectsWithBlocks);
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join("; ");
    return NextResponse.json(
      { error: "Validation failed", details: message },
      { status: 400 }
    );
  }

  const { name, description, icon } = parsed.data;

  const project = await prisma.project.create({
    data: {
      userId,
      name,
      description,
      icon,
    },
  });

  return NextResponse.json(project);
}
