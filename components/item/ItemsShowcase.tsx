"use client";

import { useGetItemsByMenuId } from "@/hooks/item/useGetItemsByMenuId";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Search,
  Plus,
  UtensilsCrossed,
  Tag,
  X,
  AlertCircle,
  Check,
} from "lucide-react";

import { useGetCategoryByMenuId } from "@/hooks/category/useGetCategoryByMenuId";

interface ItemCategory {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  categoryId?: string;
  category?: ItemCategory | null;
}

const ItemsShowcase = ({ menuId }: { menuId: string }) => {
  const { data, isLoading, isError, error, refetch } =
    useGetItemsByMenuId(menuId);
  const { data: categoriesData } = useGetCategoryByMenuId(menuId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedItems, setAddedItems] = useState<Record<string, number>>({});

  const items = useMemo(() => (data as MenuItem[]) || [], [data]);

  // Categories fetched directly via getCategoryByMenuId server action, with fallback to items
  const categories = useMemo(() => {
    if (categoriesData && categoriesData.length > 0) {
      return categoriesData.map((cat) => ({ id: cat.id, name: cat.name }));
    }
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (item.category?.id && item.category?.name) {
        map.set(item.category.id, item.category.name);
      } else if (item.categoryId) {
        map.set(item.categoryId, item.categoryId);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [categoriesData, items]);

  // Filter items by search query and selected category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const itemCatId = item.category?.id || item.categoryId;
      const matchesCategory =
        selectedCategory === "all" || itemCatId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleAddToOrder = (item: MenuItem) => {
    setAddedItems((prev) => {
      const currentCount = prev[item.id] || 0;
      return { ...prev, [item.id]: currentCount + 1 };
    });
    toast.success(`Added ${item.name} to order`, {
      description: `$${item.price.toFixed(2)}`,
      icon: <Check className="size-4 text-emerald-500" />,
    });
  };

  // Loading Skeleton View
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            <Skeleton className="h-8 w-16 rounded-full shrink-0" />
            <Skeleton className="h-8 w-24 rounded-full shrink-0" />
            <Skeleton className="h-8 w-20 rounded-full shrink-0" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="overflow-hidden border-border/40 py-0">
              <Skeleton className="w-full aspect-[4/3] rounded-none" />
              <CardContent className="py-0 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center border-t-0 bg-transparent">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error View
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-3 my-4">
        <div className="p-3 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Failed to load menu items
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {error?.message ||
            "An unexpected error occurred while fetching the menu."}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Empty State for menu (no items created yet)
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10 text-primary">
          <UtensilsCrossed className="size-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">
            No items in this menu
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            This menu does not have any items added yet. Click Add Item to start
            building your menu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-card/60 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search delicious items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 bg-background border-border/60 focus-visible:ring-primary/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills & Count */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="rounded-full text-xs shrink-0 transition-all"
          >
            All Items ({items.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full text-xs shrink-0 transition-all"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* No Search Results */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-border/50 bg-card/40 text-center space-y-3">
          <div className="p-3 rounded-full bg-muted text-muted-foreground">
            <Search className="size-6" />
          </div>
          <h4 className="text-base font-semibold">No matching items found</h4>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query or selected category filter.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="text-primary hover:text-primary/80"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Showcase Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const categoryName = item.category?.name;
          const countInOrder = addedItems[item.id] || 0;

          return (
            <Card
              key={item.id}
              className="group pt-0 flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container with Badges */}
              <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                <Image
                  src={item.imageUrl || "/download.png"}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out"
                />

                {/* Dark gradient vignette for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2 z-10 pointer-events-none">
                  {categoryName ? (
                    <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[11px] font-medium rounded-full shadow-sm">
                      <Tag className="size-3 mr-1 text-primary-foreground/80" />
                      {categoryName}
                    </Badge>
                  ) : (
                    <span />
                  )}

                  {/* Price Tag Pill */}
                  <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 text-xs rounded-full shadow-md">
                    ${item.price.toFixed(2)}
                  </Badge>
                </div>

                {/* Active Order Count Indicator */}
                {countInOrder > 0 && (
                  <div className="absolute bottom-3 left-3 z-10 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-in fade-in zoom-in-75 duration-200">
                    <Check className="size-3" />
                    <span>{countInOrder} in order</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.description ||
                      "Freshly prepared with quality ingredients."}
                  </p>
                </div>
              </CardContent>

              {/* Card Action Footer */}
              <CardFooter className="py-4 border-t-0 flex items-center justify-between gap-2">
                <div className="text-lg font-extrabold text-foreground">
                  ${item.price.toFixed(2)}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToOrder(item)}
                  className="rounded-xl font-semibold shadow-sm hover:shadow-md transition-all gap-1.5 group/btn"
                >
                  <Plus className="size-4 transition-transform group-hover/btn:rotate-90 duration-300" />
                  <span>Order</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ItemsShowcase;
