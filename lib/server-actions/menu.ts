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
      where: {
        ownerId: user.id,
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
      where: {
        ownerId: user.id,
      },
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
        ownerId_id: {
          id: menuId,
          ownerId: user.id,
        },
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
