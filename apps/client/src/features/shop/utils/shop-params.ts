// Single source of truth for the shop page URL state: search, category, sort, page.
export interface ShopQueryState {
  search?: string;
  category?: string;
  sort?: string;
  page?: number | string;
}

export function buildShopHref(state: ShopQueryState): string {
  const params = new URLSearchParams();
  if (state.search) params.set("search", state.search);
  if (state.category && state.category !== "All")
    params.set("category", state.category);
  if (state.sort) params.set("sort", state.sort);
  if (state.page && String(state.page) !== "1")
    params.set("page", String(state.page));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}
