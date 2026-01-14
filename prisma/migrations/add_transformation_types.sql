-- CreateTable
CREATE TABLE "transformation_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transformation_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transformation_types_slug_key" ON "transformation_types"("slug");

-- AddForeignKey (optional - soft reference, not enforced)
-- ALTER TABLE "transformations" ADD CONSTRAINT "transformations_transformation_type_fkey"
-- FOREIGN KEY ("transformation_type") REFERENCES "transformation_types"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
