"use server";

import { getUser } from "./user";
import { prisma } from "../prisma";

export const addCategory = async (
  name: string,
  menuId: string,
  imageUrl?: string,
) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const existingCategory = await prisma.category.findUnique({
      where: {
        ownerId_menuId_name: {
          ownerId: user.id,
          menuId,
          name: name.toLowerCase().trim(),
        },
      },
    });
    if (existingCategory) {
      throw new Error("Category with the same name already exists");
    }
    const category = await prisma.category.create({
      data: {
        name,
        menuId,
        imageUrl: imageUrl || null,
        ownerId: user.id,
      },
    });
    return category;
  } catch (err) {
    console.error((err as Error).message || "Failed to add category");
    throw err;
  }
};

export const getCategoryByMenuId = async (menuId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const category = await prisma.category.findMany({
      where: {
        ownerId: user.id,
        menuId,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
    return category;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const existingCategory = await prisma.category.findUnique({
      where: {
        ownerId: user.id,
        id: categoryId,
      },
      include: {
        items: true,
      },
    });
    if (!existingCategory) {
      throw new Error("Category not found");
    }
    if (existingCategory.items.length > 0) {
      throw new Error(
        "Category cannot be deleted because it contains items. Please edit or delete the items first.",
      );
    }
    const category = await prisma.category.delete({
      where: {
        ownerId: user.id,
        id: categoryId,
      },
    });
    return category;
  } catch (err) {
    console.error((err as Error).message || "Failed to delete category");
    throw err;
  }
};

export const getCategoryByUserId = async () => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const category = await prisma.category.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        menu: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
    return category;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
