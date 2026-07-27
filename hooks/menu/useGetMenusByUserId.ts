"use client";
import { useQuery } from "@tanstack/react-query";
import { getMenusbyUserId } from "@/lib/server-actions/menu";

export const useGetMenusByUserId = () => {
  return useQuery({
    queryKey: ["menusbyuserId"],
    queryFn: getMenusbyUserId,
  });
};
