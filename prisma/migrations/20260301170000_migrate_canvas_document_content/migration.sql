-- Migrate existing canvas documentContent to Document rows
INSERT INTO "Document" (id, "canvasId", "projectId", name, "order", content, "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  c.id,
  c."projectId",
  'Untitled Document',
  0,
  c."documentContent",
  COALESCE(c."updatedAt", c."createdAt"),
  COALESCE(c."updatedAt", c."createdAt")
FROM "Canvas" c
WHERE c."documentContent" IS NOT NULL;
