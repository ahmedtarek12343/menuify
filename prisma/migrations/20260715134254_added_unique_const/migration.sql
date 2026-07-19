/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,id]` on the table `menus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "items_menuId_idx" ON "items"("menuId");

-- CreateIndex
CREATE INDEX "items_categoryId_idx" ON "items"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "menus_ownerId_id_key" ON "menus"("ownerId", "id");
