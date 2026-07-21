"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export const getUser = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not found");
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        _count: {
          select: {
            menus: true,
            items: true,
            categories: true,
          },
        },
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};
