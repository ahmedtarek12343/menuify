"use client";

import { getCategoryByMenuId } from "@/lib/server-actions/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCategoryByMenuId = (menuId: string) => {
  return useQuery({
    queryKey: ["categories", menuId],
    queryFn: () => getCategoryByMenuId(menuId),
  });
};
