import { Product, ProductCategory, PaginatedResponse } from "@repo/lib";
import { ProductCard } from "./product-card.component";
import { Categories } from "./categories.component";
import { Sort } from "./sort.component";
import { ShopPagination } from "./shop-pagination.component";
import { getProductPrice, getProductCategory } from "../utils/product-adapter";
import { buildShopHref } from "../utils/shop-params";

interface ProductGridProps {
  products: PaginatedResponse<Product>;
  categories?: ProductCategory[];
  activeCategory?: string;
  search?: string;
  sort?: string;
  onViewProduct?: (product: Product) => void;
}

/**
 * Empty catalog state when no products match current filters.
 */
function ShopEmptyState({ search }: { search?: string }) {
  return (
    <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-12 text-center my-8">
      <p className="text-base font-semibold text-neutral-900 mb-1">
        No items found
      </p>
      <p className="text-xs text-neutral-500 mb-4">
        Try selecting another category or clear your search filters.
      </p>
      <a
        href={buildShopHref({ search })}
        className="h-10 px-6 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-colors cursor-pointer inline-flex"
      >
        Show All Products
      </a>
    </div>
  );
}

/**
 * Product items grid list and pagination orchestration.
 */
function ProductGridList({
  items,
  currentPage,
  lastPage,
  buildPageHref,
  onViewProduct,
  search,
}: {
  items: Product[];
  currentPage: number;
  lastPage: number;
  buildPageHref: (page: number) => string;
  onViewProduct?: (product: Product) => void;
  search?: string;
}) {
  if (items.length === 0) {
    return <ShopEmptyState search={search} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={onViewProduct}
          />
        ))}
      </div>

      <ShopPagination
        currentPage={currentPage}
        lastPage={lastPage}
        buildPageHref={buildPageHref}
      />
    </>
  );
}

/**
 * Product grid component for shop catalog page with filtering, sorting, and pagination.
 *
 * @param props - Product catalog data, categories, filter/sort state, and optional product selection callback.
 * @returns JSX Element rendering the shop catalog layout.
 */
export function ProductGrid({
  products,
  categories,
  activeCategory,
  search,
  sort,
  onViewProduct,
}: ProductGridProps) {
  const rawItems = products?.data || [];
  const currentPage = products?.meta?.page || 1;
  const lastPage = products?.meta?.totalPages || 1;

  // Local filter + sort per page (backend /products supports no category/sort params)
  let items = [...rawItems];
  if (activeCategory && activeCategory !== "All") {
    const cat = activeCategory.toLowerCase();
    items = items.filter(
      (p) =>
        getProductCategory(p).toLowerCase() === cat ||
        p.name.toLowerCase().includes(cat),
    );
  }
  if (sort === "price-asc" || sort === "price-desc") {
    items.sort((a, b) =>
      sort === "price-asc"
        ? getProductPrice(a) - getProductPrice(b)
        : getProductPrice(b) - getProductPrice(a),
    );
  }

  const buildPageHref = (targetPage: number) =>
    buildShopHref({ search, category: activeCategory, sort, page: targetPage });

  return (
    <div className="w-full space-y-6">
      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e8e4de]">
        {/* Pills */}
        <Categories
          categories={categories || []}
          activeCategory={activeCategory}
          search={search}
          sort={sort}
        />

        {/* Sort & Count */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <span className="text-xs text-neutral-500">{items.length} items</span>
          <Sort
            currentSort={sort || "featured"}
            search={search}
            category={activeCategory}
          />
        </div>
      </div>

      {/* Grid */}
      <ProductGridList
        items={items}
        currentPage={currentPage}
        lastPage={lastPage}
        buildPageHref={buildPageHref}
        onViewProduct={onViewProduct}
        search={search}
      />
    </div>
  );
}
