"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMenu } from "@/lib/server-actions/menu";
import { toast } from "sonner";

export const useAddMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => addMenu(name),
    onSuccess: ({ name }) => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menusbyuserId"] });
      toast.success(`${name} added successfully`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add menu");
    },
  });
};
