import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

// GET /api/share/[token] - Public fetch of canvas by share token (no auth)
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  try {
    if (!token || token.length < 10) {
      return apiError(404, "Share link not found");
    }

    const shareToken = await prisma.canvasShareToken.findUnique({
      where: { token },
      include: {
        canvas: {
          include: {
            project: { select: { name: true } },
            canvasBlocks: { orderBy: { order: "asc" } },
          },
        },
      },
    });

    if (!shareToken) {
      return apiError(404, "Share link not found");
    }

    if (shareToken.expiresAt && shareToken.expiresAt < new Date()) {
      return apiError(404, "Share link has expired");
    }

    const { canvas } = shareToken;
    const blocks = canvas.canvasBlocks.map((b) => ({
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
    }));

    return NextResponse.json({
      projectName: canvas.project.name,
      canvasName: canvas.name,
      blocks,
      expiresAt: shareToken.expiresAt?.toISOString() ?? null,
    });
  } catch (error) {
    return handleUnexpectedError(error, "GET /api/share/[token]");
  }
}
