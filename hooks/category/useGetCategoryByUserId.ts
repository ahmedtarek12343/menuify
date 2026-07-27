"use client";
import { useQuery } from "@tanstack/react-query";
import { getCategoryByUserId } from "@/lib/server-actions/category";

export const useGetCategoryByUserId = () => {
  return useQuery({
    queryKey: ["categoryByUserId"],
    queryFn: getCategoryByUserId,
  });
};
