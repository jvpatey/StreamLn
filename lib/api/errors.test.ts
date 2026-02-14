import { describe, it, expect } from "vitest";
import { apiError } from "./errors";

describe("apiError", () => {
  it("returns 401 with message", async () => {
    const res = apiError(401, "Unauthorized");
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toEqual({ error: "Unauthorized" });
  });

  it("returns 400 with message and details", async () => {
    const res = apiError(400, {
      message: "Validation failed",
      details: "Name is required",
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({
      error: "Validation failed",
      details: "Name is required",
    });
  });

  it("returns 404 for not found", async () => {
    const res = apiError(404, "Project not found");
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json).toEqual({ error: "Project not found" });
  });

  it("returns 500 for server error", async () => {
    const res = apiError(500, "Internal server error");
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ error: "Internal server error" });
  });
});
