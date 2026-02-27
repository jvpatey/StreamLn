-- CreateTable
CREATE TABLE "CanvasShareToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "canvasId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvasShareToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanvasShareToken_token_key" ON "CanvasShareToken"("token");

-- CreateIndex
CREATE INDEX "CanvasShareToken_token_idx" ON "CanvasShareToken"("token");

-- CreateIndex
CREATE INDEX "CanvasShareToken_canvasId_idx" ON "CanvasShareToken"("canvasId");

-- AddForeignKey
ALTER TABLE "CanvasShareToken" ADD CONSTRAINT "CanvasShareToken_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
