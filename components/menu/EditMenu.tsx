"use client";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  if (!open) {
    return null;
  }

  return (
    <Dialog open={!!open} onOpenChange={(value) => !value && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Make changes to your menu here. Click save when you&apos;re done.
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
              { menuId: open?.menuId, newName },
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
          <Alert variant={"destructive"}>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="font-bold">Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
