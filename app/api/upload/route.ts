import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { apiError, handleUnexpectedError } from "@/lib/api/errors";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return map[mimeType] ?? "png";
}

/**
 * POST /api/upload
 * Upload an image file to Vercel Blob for use in canvas image blocks.
 * Requires authentication. Accepts multipart/form-data with a single file (key: "file").
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError(401, "Unauthorized");
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError(400, { message: "No file provided" });
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError(400, {
        message: "File too large",
        details: `Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return apiError(400, {
        message: "Invalid file type",
        details: "Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed",
      });
    }

    const ext = getExtension(mimeType);
    const pathname = `canvas-images/${crypto.randomUUID()}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeType,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return handleUnexpectedError(error, "upload");
  }
}
