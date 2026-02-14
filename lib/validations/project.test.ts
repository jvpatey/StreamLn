import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  updateProjectSchema,
  updateProjectStatusSchema,
} from "./project";

describe("createProjectSchema", () => {
  it("accepts valid input", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
      description: "A test project",
      icon: "Folder",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal input (name only)", () => {
    const result = createProjectSchema.safeParse({ name: "Minimal" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createProjectSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = createProjectSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects name over 200 chars", () => {
    const result = createProjectSchema.safeParse({
      name: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("rejects description over 2000 chars", () => {
    const result = createProjectSchema.safeParse({
      name: "Valid",
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectSchema", () => {
  it("accepts partial updates", () => {
    const result = updateProjectSchema.safeParse({ name: "Updated" });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = updateProjectSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts null for description and icon", () => {
    const result = updateProjectSchema.safeParse({
      description: null,
      icon: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name when provided", () => {
    const result = updateProjectSchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProjectStatusSchema", () => {
  it("accepts active", () => {
    const result = updateProjectStatusSchema.safeParse({ status: "active" });
    expect(result.success).toBe(true);
  });

  it("accepts archived", () => {
    const result = updateProjectStatusSchema.safeParse({ status: "archived" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = updateProjectStatusSchema.safeParse({ status: "draft" });
    expect(result.success).toBe(false);
  });

  it("rejects missing status", () => {
    const result = updateProjectStatusSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
