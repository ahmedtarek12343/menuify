"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteMenu } from "@/lib/server-actions/menu";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (menuId: string) => deleteMenu(menuId),
    onSuccess: ({ name }) => {
      toast.success(`${name} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete menu");
    },
  });
};
