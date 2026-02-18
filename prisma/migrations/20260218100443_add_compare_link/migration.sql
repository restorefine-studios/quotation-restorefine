-- CreateTable
CREATE TABLE "CompareLink" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "quoteIds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompareLink_slug_key" ON "CompareLink"("slug");

-- CreateIndex
CREATE INDEX "CompareLink_slug_idx" ON "CompareLink"("slug");
