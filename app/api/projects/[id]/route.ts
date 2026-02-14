import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import {
  updateProjectSchema,
  updateProjectStatusSchema,
} from "@/lib/validations/project";

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

// Get a project by id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;
    return NextResponse.json(result.project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project." },
      { status: 500 }
    );
  }
}

// Delete a project by id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}

// Update a project status by id
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    const body = await req.json();
    const parsed = updateProjectStatusSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return NextResponse.json(
        { error: "Validation failed", details: message },
        { status: 400 }
      );
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project status." },
      { status: 500 }
    );
  }
}

// Update a project by id
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const result = await getProjectOrError(id);
    if (result.error) return result.error;

    const body = await req.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((e) => e.message).join("; ");
      return NextResponse.json(
        { error: "Validation failed", details: message },
        { status: 400 }
      );
    }

    const data: { name?: string; description?: string | null; icon?: string | null } =
      {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.description !== undefined)
      data.description = parsed.data.description;
    if (parsed.data.icon !== undefined) data.icon = parsed.data.icon;

    const updated = await prisma.project.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}
