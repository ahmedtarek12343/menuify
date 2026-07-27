"use client";

import { addItem } from "@/lib/server-actions/item";
import { useMutation } from "@tanstack/react-query";
import { addItemProps } from "@/lib/server-actions/item";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemName,
      price,
      categoryId,
      menuId,
      description,
      imageUrl,
    }: addItemProps) => {
      return addItem({
        itemName,
        price,
        categoryId,
        menuId,
        description,
        imageUrl,
      });
    },
    onSuccess: ({ name }) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success(`${name} added successfully`);
    },
    onError: () => {
      toast.error("Failed to add item");
    },
  });
};
