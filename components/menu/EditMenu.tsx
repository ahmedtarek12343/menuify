"use client";

import { useUpdateMenu } from "@/hooks/useUpdateMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { editMenuProps } from "@/types";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

const EditMenu = ({
  open,
  setOpen,
}: {
  open: editMenuProps | null;
  setOpen: (value: editMenuProps | null) => void;
}) => {
  const [newName, setNewName] = useState(open?.oldName || "");
  const { mutate, isPending, isError, error } = useUpdateMenu();

  return (
    <Dialog open={!!open} onOpenChange={(value) => !value && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Make changes to your menu here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            mutate(
              { menuId: open?.menuId!, newName },
              {
                onSuccess: () => {
                  setOpen(null);
                  setNewName("");
                },
              },
            );
          }}
          disabled={isPending || !newName}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
        {isError && (
          <p className="mt-2 text-center text-xs text-red-500">
            {error.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
