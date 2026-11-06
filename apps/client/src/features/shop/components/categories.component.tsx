import Link from "next/link";
import { ProductCategory } from "@repo/lib";
import { buildShopHref } from "../utils/shop-params";
import { cn } from "@repo/lib";

interface CategoriesProps {
  categories: ProductCategory[];
  activeCategory?: string;
  search?: string;
  sort?: string;
}

export function Categories({
  categories,
  activeCategory,
  search,
  sort,
}: CategoriesProps) {
  const categoryNames = categories.map((c) => c.name);
  const allCategories = ["All", ...categoryNames];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {allCategories.map((cat) => {
        const isActive =
          activeCategory === cat || (!activeCategory && cat === "All");
        const href = buildShopHref({
          search,
          sort,
          category: cat === "All" ? undefined : cat,
        });

        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "h-9 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border flex items-center",
              isActive
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-[#f5f1ec] text-neutral-700 hover:text-neutral-900 hover:bg-white border-[#e8e4de]",
            )}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
