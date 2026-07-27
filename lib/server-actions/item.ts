"use server";

import { getUser } from "./user";
import { prisma } from "../prisma";

export interface addItemProps {
  itemName: string;
  price: number;
  categoryId: string;
  menuId: string;
  description?: string;
  imageUrl?: string;
}

export const addItem = async ({
  itemName,
  price,
  categoryId,
  menuId,
  description,
  imageUrl,
}: addItemProps) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");
    const item = await prisma.item.create({
      data: {
        name: itemName,
        price,
        description,
        imageUrl,
        ownerId: user.id,
        categoryId,
        menuId,
      },
    });
    return item;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getItemsByMenuId = async (menuId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");
    const items = await prisma.item.findMany({
      where: {
        menuId,
        ownerId: user.id,
      },
      include: {
        category: true,
      },
    });
    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
