"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMenu } from "@/lib/server-actions/menu";
import { toast } from "sonner";

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, newName }: { menuId: string; newName: string }) =>
      editMenu(menuId, newName),
    onSuccess: ({ name }) => {
      toast.success(`${name} updated successfully`);
      queryClient.invalidateQueries({
        queryKey: ["menus"],
      });
    },
  });
};
