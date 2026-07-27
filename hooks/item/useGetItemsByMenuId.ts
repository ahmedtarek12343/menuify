"use client";

import { getItemsByMenuId } from "@/lib/server-actions/item";
import { useQuery } from "@tanstack/react-query";

export const useGetItemsByMenuId = (menuId: string) => {
  return useQuery({
    queryKey: ["items", menuId],
    queryFn: () => getItemsByMenuId(menuId),
  });
};
