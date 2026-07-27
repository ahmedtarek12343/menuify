"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAddMenu } from "@/hooks/menu/useAddMenu";
import { createPortal } from "react-dom";

interface AddMenuProps {
  setMenuFormOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const AddMenu = ({ setMenuFormOpen, inputRef }: AddMenuProps) => {
  const [menuName, setMenuName] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const handleMenuSumbit = () => {
    mutate(menuName);
    setMenuFormOpen(false);
    setMenuName("");
  };
  const { mutate, isPending } = useAddMenu();
  const content = (
    <div className="fixed menu-form bottom-0 translate-y-full left-1/2 -translate-x-1/2 bg-primary p-8 min-w-3xl z-61">
      <p className="form-text text-xl font-semibold mb-5">
        Enter the Name for your Menu:
      </p>
      <Input
        ref={inputRef}
        placeholder="Enter the name"
        className="menu-name"
        value={menuName}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleMenuSumbit();
          }
        }}
        onChange={(e) => {
          setMenuName(e.target.value);
        }}
      />
      <Button
        variant={"outline"}
        onClick={handleMenuSumbit}
        disabled={isPending || !menuName}
        className="mt-2 menu-btn"
      >
        {isPending ? "Adding..." : "Add Menu"}
      </Button>
    </div>
  );
  return mounted && createPortal(content, document.body, "add-menu-portal");
};

export default AddMenu;
