"use client";

import { Link } from "next-view-transitions";
import { useRef, useState } from "react";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";

import { useGetMenus } from "@/hooks/useGetMenus";
import { useDeleteMenu } from "@/hooks/useDeleteMenu";
import { useUserQuery } from "@/hooks/useGetUser";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AddMenu from "./AddMenu";
import EditMenu from "./EditMenu";

gsap.registerPlugin(SplitText);

type editMenuProps = {
  oldName: string;
  menuId: string;
};

const MenuShowcase = () => {
  const [menuFormOpen, setMenuFormOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<editMenuProps | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    const splitText = new SplitText(".form-text", {
      type: "lines",
      mask: "lines",
    });

    if (menuFormOpen) {
      gsap
        .timeline({
          onComplete: () => {
            inputRef.current?.focus();
          },
        })
        .to(".menu-form", {
          y: 0,
          ease: "power2.out",
          duration: 0.5,
        })
        .from(
          ".menu-name",
          {
            y: 80,
            opacity: 0,
            ease: "power2.out",
            duration: 0.5,
          },
          "<",
        )
        .from(
          splitText.lines,
          {
            y: 30,
            stagger: 0.1,
            ease: "power2.out",
            duration: 0.5,
          },
          "<0.2",
        );
    } else {
      gsap
        .timeline()
        .to(splitText.lines, {
          y: 30,
          stagger: 0.1,
          ease: "power2.in",
          duration: 0.5,
        })
        .to(
          ".menu-form",
          {
            y: "100%",
            ease: "power2.in",
            duration: 0.5,
          },
          "<0.2",
        );
    }
  }, [menuFormOpen]);

  const {
    mutate: deleteMenu,
    isPending: deleteMenuPending,
    variables: deletingMenuId,
  } = useDeleteMenu();
  const user = useUserQuery();

  const { data, isLoading, isError, error } = useGetMenus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading menus...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-sm font-medium text-white/70">No menus yet</p>
          <p className="text-xs text-muted-foreground">
            Create your first menu to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((menu) => (
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

                {menu.ownerId === user.data?.id && (
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

              <span className="relative mt-3 inline-flex w-fit items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
                {menu._count.items} {menu._count.items === 1 ? "item" : "items"}
              </span>

              <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
                <Avatar className="h-7 w-7 ring-2 ring-white/10">
                  <AvatarImage
                    src={menu.owner.imageUrl}
                    alt={menu.owner.firstName}
                  />
                  <AvatarFallback className="text-xs">
                    {menu.owner.firstName.slice(0, 1) +
                      menu.owner.lastName.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">
                  {menu.owner.firstName + " " + menu.owner.lastName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Button
        onClick={() => {
          setMenuFormOpen((prev) => !prev);
        }}
        variant="ghost"
        className="w-full rounded-2xl border border-dashed border-white/20 bg-transparent py-6 text-white/60 transition-colors hover:border-primary/60 hover:bg-primary hover:text-primary-foreground"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <div
        onClick={() => {
          setMenuFormOpen(false);
        }}
        className={`${
          menuFormOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } fixed inset-0 z-50 bg-black/50 backdrop-blur-lg transition-opacity duration-300`}
      ></div>

      <AddMenu inputRef={inputRef} setMenuFormOpen={setMenuFormOpen} />
      {editDialog && <EditMenu open={editDialog} setOpen={setEditDialog} />}
    </div>
  );
};

export default MenuShowcase;
