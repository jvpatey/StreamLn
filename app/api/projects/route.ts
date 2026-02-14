import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { createProjectSchema } from "@/lib/validations/project";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

// GET /api/projects - List projects for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError(401, "Unauthorized");
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
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/projects");
  }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError(401, "Unauthorized");
    }

    const body = await req.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return apiError(400, { message: "Validation failed", details: message });
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
  } catch (error) {
    return handleUnexpectedError(error, "POST /api/projects");
  }
}
