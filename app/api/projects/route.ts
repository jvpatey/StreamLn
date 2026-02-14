import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

// GET /api/projects - List projects for the authenticated user
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId },
  });
  return NextResponse.json(projects);
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, icon } = await req.json();

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
