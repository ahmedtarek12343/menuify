"use client";

import { getLatestMenus } from "@/lib/server-actions/menu";
import { useQuery } from "@tanstack/react-query";

export const useGetLatestMenus = () => {
  return useQuery({
    queryKey: ["latestMenus"],
    queryFn: getLatestMenus,
  });
};
