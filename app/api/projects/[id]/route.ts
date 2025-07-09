import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        status: body.status,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project status." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        icon: body.icon,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}
