import { ShopProductService } from "@/features/shop/services/shop-product.service";
import { ShopErrorBoundary } from "@/features/shop/components/shop-error-boundary";
import { ProductsSuspense } from "@/features/shop/components/products-suspense";
import { ProductGrid } from "@/features/shop/components/product-grid.component";
import { Sparkles, ShieldCheck } from "@repo/design/lucide";
import type { ProductCategory, PaginatedResponse, Product } from "@repo/lib";

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

// Products + Categories bars render together inside one boundary;
// both fetches start in parallel via Promise.all in the page.
async function ProductsContent({
  products,
  categories,
  activeCategory,
  search,
  sort,
}: {
  products: PaginatedResponse<Product>;
  categories: ProductCategory[];
  activeCategory?: string;
  search?: string;
  sort?: string;
}) {
  return (
    <ProductsSuspense>
      <ShopErrorBoundary fallback={<ProductsErrorFallback />}>
        <ProductGrid
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          search={search}
          sort={sort}
        />
      </ShopErrorBoundary>
    </ProductsSuspense>
  );
}

function ProductsErrorFallback() {
  return (
    <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-8 text-center">
      <p className="text-base font-semibold text-neutral-900 mb-2">
        Failed to load products
      </p>
      <p className="text-xs text-neutral-500 mb-4">Please try again later</p>
      <a
        href="/shop"
        className="h-10 px-6 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-colors inline-flex"
      >
        Retry
      </a>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { search, category, sort, page } = await searchParams;

  // Parallel fetch - both requests run at the same time
  const [productsRes, categoriesRes] = await Promise.all([
    ShopProductService.getProducts({
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: 20,
    }),
    ShopProductService.getProductCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Hero Banner (Cream Floating Card on Pure White Ground) */}
      <div className="relative rounded-3xl bg-[#f5f1ec] border border-[#e8e4de] p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#e8e4de] text-xs font-medium text-neutral-900">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>Vedic Ritual Charged Catalog</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold text-neutral-900 tracking-tight leading-tight">
            Authentic Sacred Items & Energized Gemstones
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Carefully sourced rudraksha beads, certified astrological gemstones,
            sacred yantras, and pure puja samagri purified through traditional
            Vedic mantras.
          </p>

          <div className="flex items-center gap-6 pt-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              Lab Certified Quality
            </span>
            <span>•</span>
            <span>Free Shipping Above ₹499</span>
            <span>•</span>
            <span>Direct Safe Delivery</span>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">
            Explore Collection
          </h2>
          <p className="text-xs text-neutral-500">
            Select by category or browse all verified astrological products
          </p>
        </div>

        <ProductsContent
          products={productsRes}
          categories={categoriesRes}
          activeCategory={category}
          search={search}
          sort={sort}
        />
      </section>
    </div>
  );
}