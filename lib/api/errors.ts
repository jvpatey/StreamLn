import { NextResponse } from "next/server";

export type ApiErrorStatus = 400 | 401 | 403 | 404 | 409 | 500;

export interface ApiErrorOptions {
  message: string;
  details?: string;
}

/**
 * Returns a standardized JSON error response for API routes.
 */
export function apiError(
  status: ApiErrorStatus,
  options: ApiErrorOptions | string
): NextResponse {
  const message = typeof options === "string" ? options : options.message;
  const details = typeof options === "string" ? undefined : options.details;

  const body: { error: string; details?: string } = { error: message };
  if (details) body.details = details;

  return NextResponse.json(body, { status });
}

/**
 * Handles unexpected errors (e.g. from Prisma, JSON parse).
 * Logs in development and production (Vercel captures console.error in function logs).
 */
export function handleUnexpectedError(
  error: unknown,
  context: string
): NextResponse {
  // Always log so Vercel function logs show the real error for debugging
  console.error(`[API Error] ${context}:`, error);
  return apiError(500, {
    message: "An unexpected error occurred.",
  });
}
