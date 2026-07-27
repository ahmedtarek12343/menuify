"use client";
import { useGetMenusByUserId } from "@/hooks/menu/useGetMenusByUserId";
import { Button } from "../ui/button";
import { Edit2Icon, Eye, Trash2Icon } from "lucide-react";
import { Link } from "next-view-transitions";

const MenusTable = () => {
  const { data, isLoading, error, isError } = useGetMenusByUserId();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-red-500">Something went wrong</div>
      </div>
    );
  }
  return (
    <>
      <div className="overflow-y-auto space-y-2 max-h-[420px]">
        {data?.flatMap((menu) => (
          <div
            key={menu.id}
            className="menu-table-div flex justify-between items-center p-4 bg-background border hover:border-primary transition-all rounded"
          >
            <span>{menu.name}</span>
            <div className="flex gap-2">
              <Link href={`/menus/${menu.id}`}>
                <Button>
                  <Eye className="w-5 h-5" />
                </Button>
              </Link>
              <Button>
                <Edit2Icon className="w-5 h-5" />
              </Button>
              <Button>
                <Trash2Icon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>{" "}
      <div className="text-center text-ring p-4">
        {!isLoading && !isError && data?.length === 0 && <p>No menus found</p>}
        {data?.length > 0 && <p>Total {data.length} menus</p>}
      </div>
    </>
  );
};

export default MenusTable;
