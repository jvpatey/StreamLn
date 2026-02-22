import { NextRequest, NextResponse } from "next/server";

const DANGEROUS_SCHEMES = ["javascript", "data", "vbscript", "file", "blob"];

function isValidUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://"))
    return false;
  try {
    const parsed = new URL(trimmed);
    const scheme = parsed.protocol.replace(":", "").toLowerCase();
    if (DANGEROUS_SCHEMES.includes(scheme)) return false;
    return true;
  } catch {
    return false;
  }
}

export interface LinkPreviewData {
  title: string | null;
  description: string | null;
  image: string | null;
  logo: string | null;
}

/**
 * GET /api/link-preview?url=...
 * Fetches Open Graph / metadata for a URL via Microlink API.
 */
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam || !urlParam.trim()) {
    return NextResponse.json(
      { error: "Missing or empty url parameter" },
      { status: 400 }
    );
  }

  const targetUrl = urlParam.trim();
  if (!isValidUrl(targetUrl)) {
    return NextResponse.json(
      { error: "Invalid or disallowed URL" },
      { status: 400 }
    );
  }

  try {
    const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(targetUrl)}&screenshot=false&video=false`;
    const res = await fetch(microlinkUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch link metadata" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      status?: string;
      data?: {
        title?: string | null;
        description?: string | null;
        image?: { url?: string } | null;
        logo?: { url?: string } | null;
      };
    };

    if (data.status !== "success" || !data.data) {
      return NextResponse.json(
        { error: "No metadata available" },
        { status: 404 }
      );
    }

    const preview: LinkPreviewData = {
      title: data.data.title ?? null,
      description: data.data.description ?? null,
      image: data.data.image?.url ?? null,
      logo: data.data.logo?.url ?? null,
    };

    return NextResponse.json(preview);
  } catch (error) {
    console.error("[link-preview] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch link metadata" },
      { status: 500 }
    );
  }
}
