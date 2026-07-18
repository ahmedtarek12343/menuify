"use client";

import { useGetMenus } from "@/hooks/useGetMenus";
import { Button } from "../ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import SplitText from "gsap/src/SplitText";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { useDeleteMenu } from "@/hooks/useDeleteMenu";
import AddMenu from "./AddMenu";
import { useRouter } from "next/navigation";
import EditMenu from "./EditMenu";
import { editMenuProps } from "@/types";
import { Link } from "next-view-transitions";

gsap.registerPlugin(SplitText);

const MenuShowcase = () => {
  const [menuFormOpen, setMenuFormOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<editMenuProps | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { contextSafe } = useGSAP(() => {
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
    variables,
  } = useDeleteMenu();
  // asdasdasdadas
  const { data, isLoading, isError, error } = useGetMenus();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <>Error : {error.message}</>;
  }
  return (
    <div className="space-y-5 p-6">
      {data?.length === 0 ? (
        <p>No menus found</p>
      ) : (
        data?.map((menu) => (
          <Link
            href={`/menus/${menu.id}`}
            key={menu.id}
            className="p-3 border hover:border-primary hover:cursor-pointer transition rounded-md flex justify-between items-center"
          >
            <p>{menu.name}</p>
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditDialog({ oldName: menu.name, menuId: menu.id });
                }}
              >
                <Edit />
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteMenu(menu.id);
                }}
                disabled={deleteMenuPending && menu.id === variables}
              >
                {deleteMenuPending && menu.id === variables ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Link>
        ))
      )}
      <Button
        onClick={() => {
          setMenuFormOpen((prev) => !prev);
        }}
        className="w-full bg-transparent border border-dashed py-2 hover:bg-primary hover:text-primary-foreground hover:border-none transition duration-500 border-white/80"
      >
        <Plus />
      </Button>

      <div
        onClick={() => {
          setMenuFormOpen(false);
        }}
        className={`${menuFormOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} fixed overlay backdrop-blur-lg inset-0 duration-350 transition-all z-51`}
      ></div>
      <AddMenu inputRef={inputRef} setMenuFormOpen={setMenuFormOpen} />
      {editDialog && <EditMenu open={editDialog} setOpen={setEditDialog} />}
    </div>
  );
};

export default MenuShowcase;
