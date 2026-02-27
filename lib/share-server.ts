import prisma from "@/lib/db";

/**
 * Server-only: fetch minimal share data for metadata (OG tags, etc.)
 */
export async function getSharedCanvasMetadata(token: string) {
  if (!token || token.length < 10) return null;

  const shareToken = await prisma.canvasShareToken.findUnique({
    where: { token },
    include: {
      canvas: {
        include: {
          project: { select: { name: true } },
        },
      },
    },
  });

  if (!shareToken) return null;
  if (shareToken.expiresAt && shareToken.expiresAt < new Date()) return null;

  return {
    projectName: shareToken.canvas.project.name,
    canvasName: shareToken.canvas.name,
    expiresAt: shareToken.expiresAt?.toISOString() ?? null,
  };
}
