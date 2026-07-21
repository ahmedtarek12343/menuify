"use client";

import { CheckIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetCategoryByMenuId } from "@/hooks/category/useGetCategoryByMenuId";
import { Badge } from "../ui/badge";

export default function MultiSelectBox({
  isFormValid,
  onCategoryChange,
  menuId,
}: {
  isFormValid: boolean;
  onCategoryChange: (category: string) => void;
  menuId: string;
}) {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useGetCategoryByMenuId(menuId);

  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    onCategoryChange(value);
  }, [value]);
  return (
    <div
      className={`*:not-first:mt-2 outline-red-500 ${
        !isFormValid ? "outline-[0.5px]" : "outline-none"
      }`}
    >
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
            id={id}
            role="combobox"
            variant="outline"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? categories?.find((category) => category.id === value)?.name
                : "Select Category"}
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              className="shrink-0 text-muted-foreground/80"
              size={16}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0 z-[60]"
        >
          <Command>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search Categories..."
            />
            <CommandList>
              <CommandEmpty>No Category found.</CommandEmpty>
              {isLoading ? (
                <Loader2Icon className="animate-spin size-6 mx-auto" />
              ) : (
                <CommandGroup>
                  {categories?.map((category) => (
                    <CommandItem
                      key={category.id}
                      onSelect={() => {
                        setValue(category.id);
                        setOpen(false);
                      }}
                      value={category.name}
                      className="w-full"
                    >
                      <Image
                        src={category.imageUrl || "/download.png"}
                        alt={category.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <p>{category.name}</p>
                      <Badge className="rounded-full" variant={"outline"}>
                        Included in {category._count.items} items
                      </Badge>
                      <p className="ml-auto">
                        {value === category.id && (
                          <CheckIcon className="ml-auto" size={16} />
                        )}
                      </p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <Button
                className="w-full mx-auto"
                onClick={() => {
                  setValue("");
                  setOpen(false);
                }}
              >
                Clear Selection
              </Button>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
