"use client";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/server-actions/user";

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};
