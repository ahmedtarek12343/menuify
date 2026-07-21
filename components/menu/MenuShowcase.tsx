"use client";

import { useRef, useState } from "react";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";

import { useGetMenus } from "@/hooks/menu/useGetMenus";
import { useDeleteMenu } from "@/hooks/menu/useDeleteMenu";
import { useUserQuery } from "@/hooks/useGetUser";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AddMenu from "./AddMenu";
import EditMenu from "./EditMenu";
import MenuCard from "./MenuCard";

gsap.registerPlugin(SplitText);

type editMenuProps = {
  oldName: string;
  menuId: string;
};

const MenuShowcase = () => {
  const [menuFormOpen, setMenuFormOpen] = useState(false);

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
            <MenuCard key={menu.id} menu={menu} />
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
    </div>
  );
};

export default MenuShowcase;
