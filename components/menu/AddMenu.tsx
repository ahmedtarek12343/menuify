"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useAddMenu } from "@/hooks/useAddMenu";

interface AddMenuProps {
  setMenuFormOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const AddMenu = ({ setMenuFormOpen, inputRef }: AddMenuProps) => {
  const [menuName, setMenuName] = useState("");
  const handleMenuSumbit = () => {
    mutate(menuName);
    setMenuFormOpen(false);
    setMenuName("");
  };
  const { mutate, isPending } = useAddMenu();
  return (
    <div className="fixed menu-form bottom-0 translate-y-full left-1/2 -translate-x-1/2 bg-primary p-8 min-w-3xl z-52">
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
};

export default AddMenu;
