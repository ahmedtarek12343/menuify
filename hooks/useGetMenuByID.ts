"use client";

import { getMenuByID } from "@/lib/server-actions/menu";
import { useQuery } from "@tanstack/react-query";

export const useGetMenuByID = (menuId: string) => {
  return useQuery({
    queryKey: ["menu", menuId],
    queryFn: () => getMenuByID(menuId),
  });
};
