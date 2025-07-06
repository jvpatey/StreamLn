import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/projects - List all projects
export async function GET(req: NextRequest) {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  const { userId, name, description } = await req.json();

  // TODO: Add validation and authorization
  const project = await prisma.project.create({
    data: {
      userId,
      name,
      description,
    },
  });

  return NextResponse.json(project);
}
