/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,menuId]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categories_ownerId_menuId_key" ON "categories"("ownerId", "menuId");
