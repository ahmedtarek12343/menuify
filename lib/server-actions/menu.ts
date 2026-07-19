"use server";
import { prisma } from "../prisma";

import { getUser } from "./user";

export const addMenu = async (name: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const existingMenu = await prisma.menu.findFirst({
      where: {
        name: name,
      },
    });
    if (existingMenu) {
      throw new Error(
        "Menu with the same name exists. Please choose a different name",
      );
    }
    const menu = await prisma.menu.create({
      data: {
        name,
        ownerId: user.id,
      },
    });
    return menu;
  } catch (error) {
    console.error((error as Error).message);
    throw error;
  }
};

export const getMenus = async () => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const menus = await prisma.menu.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
    if (!menus) {
      return [];
    }
    return menus;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteMenu = async (menuId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("user not found");
    }

    const currentMenu = await getMenuByID(menuId);
    if (currentMenu.ownerId !== user.id) {
      throw new Error("you are not authorized to delete this menu");
    }

    const menu = await prisma.menu.delete({
      where: {
        id: menuId,
      },
    });

    return menu;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const editMenu = async (menuId: string, newName: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("user not found");
    }
    const existingMenu = await prisma.menu.findFirst({
      where: {
        name: newName,
      },
    });
    const currentMenu = await getMenuByID(menuId);
    if (currentMenu.ownerId !== user.id) {
      throw new Error("you are not authorized to edit this menu");
    }
    if (existingMenu && existingMenu.id !== menuId) {
      throw new Error(
        "Menu with the same name exists. Please choose a different name",
      );
    }
    const menu = await prisma.menu.update({
      where: {
        id: menuId,
      },
      data: {
        name: newName,
      },
    });
    return menu;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getLatestMenus = async () => {
  try {
    const user = await getUser();
    if (!user) throw new Error("user not found");
    const menus = await prisma.menu.findMany({
      take: 4,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!menus) {
      return [];
    }
    return menus;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getMenuByID = async (menuId: string) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("user not found");
    }
    const menu = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });
    if (!menu) {
      throw new Error("Menu not found");
    }
    return menu;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
