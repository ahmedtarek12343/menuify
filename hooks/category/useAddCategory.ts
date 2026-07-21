"use client";

import { useMutation } from "@tanstack/react-query";
import { addCategory } from "@/lib/server-actions/category";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      menuId,
      imageUrl,
    }: {
      name: string;
      menuId: string;
      imageUrl?: string;
    }) => addCategory(name, menuId, imageUrl),
    onSuccess: ({ name, menuId }) => {
      queryClient.invalidateQueries({ queryKey: ["categories", menuId] });
      toast.success(`${name} added successfully`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
