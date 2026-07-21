"use client";

import { getMenus } from "@/lib/server-actions/menu";
import { useQuery } from "@tanstack/react-query";

export const useGetMenus = () => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: getMenus,
  });
};
