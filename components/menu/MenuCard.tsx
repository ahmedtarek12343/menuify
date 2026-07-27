"use client";
import type { Menu } from "@/types";
import { Link } from "next-view-transitions";
import { Button } from "../ui/button";
import { Edit, Loader2, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDeleteMenu } from "@/hooks/menu/useDeleteMenu";
import { useUserQuery } from "@/hooks/useGetUser";
import type { editMenuProps } from "@/types";
import { useState } from "react";
import EditMenu from "./EditMenu";
import { Badge } from "../ui/badge";

interface MenuCardProps {
  menu: Menu;
}

const MenuCard = ({ menu }: MenuCardProps) => {
  const {
    mutate: deleteMenu,
    isPending: deleteMenuPending,
    variables: deletingMenuId,
  } = useDeleteMenu();
  const { data: user, isLoading, error, isError } = useUserQuery();
  const [editDialog, setEditDialog] = useState<editMenuProps | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-red-500">Something went wrong</div>
      </div>
    );
  }
  return (
    <>
      <Link
        href={`/menus/${menu.id}`}
        key={menu.id}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
      >
        {/* subtle glow accent on hover */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex w-full items-start justify-between gap-2">
          <p className="text-lg font-semibold tracking-tight text-white">
            {menu.name}
          </p>

          {menu.ownerId === user?.id && (
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditDialog({ oldName: menu.name, menuId: menu.id });
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteMenu(menu.id);
                }}
                disabled={deleteMenuPending && deletingMenuId === menu.id}
              >
                {deleteMenuPending && deletingMenuId === menu.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="relative mt-3 inline-flex w-fit items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
            {menu._count.items} {menu._count.items === 1 ? "item" : "items"}
          </span>
          <Badge variant="outline" className="rounded-full mt-2">
            {menu._count.categories}{" "}
            {menu._count.categories === 1 ? "category" : "categories"}
          </Badge>
        </div>

        <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
          <Avatar className="h-7 w-7 ring-2 ring-white/10">
            <AvatarImage
              src={menu.owner?.imageUrl ?? "/download.png"}
              alt={menu.owner?.firstName ?? ""}
            />
            <AvatarFallback className="text-xs">
              {menu.owner?.firstName.slice(0, 1) +
                menu.owner?.lastName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">
            {menu.owner.firstName + " " + menu.owner.lastName}
          </p>
        </div>
      </Link>
      {editDialog && <EditMenu open={editDialog} setOpen={setEditDialog} />}
    </>
  );
};

export default MenuCard;
