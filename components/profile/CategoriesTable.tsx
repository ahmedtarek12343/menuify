import { useGetCategoryByUserId } from "@/hooks/category/useGetCategoryByUserId";
import { Button } from "../ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "../ui/badge";

const CategoriesTable = () => {
  const { data, isLoading, isError, error } = useGetCategoryByUserId();
  if (isLoading) {
    return <p>loading categories</p>;
  }

  if (isError || !data) {
    return <p>something went wrong</p>;
  }
  return (
    <>
      {" "}
      <div className="overflow-y-auto space-y-2 max-h-[420px]">
        {data?.flatMap((category) => (
          <div
            key={category.id}
            className="category-table-div flex justify-between items-center p-4 bg-background border hover:border-primary transition-all rounded"
          >
            <p>
              <span>{category.name}</span>
              <Badge variant={"outline"} className="ml-2 rounded-2xl">
                {category.menu.name}
              </Badge>
              <Badge variant={"outline"} className="ml-2 rounded-2xl">
                {category._count.items || 0} items
              </Badge>
            </p>
            <div className="flex gap-2">
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
        {!isLoading && !isError && data?.length === 0 && (
          <p>No categories found</p>
        )}
        {data?.length > 0 && <p>Total {data.length} categories</p>}
      </div>
    </>
  );
};

export default CategoriesTable;
