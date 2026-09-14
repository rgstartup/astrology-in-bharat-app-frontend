import { create } from "zustand";
import type { Product, ProductWithLikes } from "@repo/lib";

export type ProductItem =
  | Product
  | ProductWithLikes
  | (Partial<Product> & { id: string | number; name: string });

export type StateUpdate<T> = T | ((current: T) => T);

export interface ProductListStore<
  T extends { id?: string | number } = ProductItem,
> {
  products: T[];
  isLoading: boolean;
  isloading: boolean; // Lowercase alias matching exact specification
  searchQuery: string;
  selectedProduct: T | null;
  error: string | null;

  // Search Query
  setSearchQuery: (query: string) => void;

  // Loading & Error Actions
  setIsLoading: (isLoading: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD: Create
  addProduct: (product: T) => void;
  addProducts: (products: T[]) => void;

  // CRUD: Read
  getProductById: (id: string | number) => T | undefined;
  setSelectedProduct: (product: T | null) => void;

  // CRUD: Update
  setProducts: (value: StateUpdate<T[]>) => void;
  updateProduct: (id: string | number, updatedFields: Partial<T>) => void;
  upsertProduct: (product: T) => void;

  // CRUD: Delete
  deleteProduct: (id: string | number) => void;
  removeProduct: (id: string | number) => void;
  clearProducts: () => void;

  // Reset
  reset: () => void;
  resetState: () => void;
}

const matchesId = (
  item: { id?: string | number },
  id: string | number,
): boolean => {
  return item.id !== undefined && String(item.id) === String(id);
};

const initialState = {
  products: [] as ProductItem[],
  isLoading: false,
  isloading: false,
  searchQuery: "",
  selectedProduct: null as ProductItem | null,
  error: null as string | null,
};

export const useProductListStore = create<ProductListStore<ProductItem>>(
  (set, get) => ({
    ...initialState,

    // Search Query
    setSearchQuery: (searchQuery: string) => set({ searchQuery }),

    // Loading & Error
    setIsLoading: (isLoading: boolean) =>
      set({ isLoading, isloading: isLoading }),

    setLoading: (loading: boolean) =>
      set({ isLoading: loading, isloading: loading }),

    setError: (error: string | null) => set({ error }),

    // CRUD: Create
    addProduct: (product) =>
      set((state) => ({
        products: [product, ...state.products],
      })),

    addProducts: (newProducts) =>
      set((state) => ({
        products: [...state.products, ...newProducts],
      })),

    // CRUD: Read
    getProductById: (id) => {
      return get().products.find((item) => matchesId(item, id));
    },

    setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

    // CRUD: Update
    setProducts: (value) =>
      set((state) => ({
        products: typeof value === "function" ? value(state.products) : value,
      })),

    updateProduct: (id, updatedFields) =>
      set((state) => ({
        products: state.products.map((item) =>
          matchesId(item, id) ? { ...item, ...updatedFields } : item,
        ),
        selectedProduct:
          state.selectedProduct && matchesId(state.selectedProduct, id)
            ? ({ ...state.selectedProduct, ...updatedFields } as ProductItem)
            : state.selectedProduct,
      })),

    upsertProduct: (product) =>
      set((state) => {
        const exists = state.products.some((item) =>
          matchesId(item, product.id),
        );
        return {
          products: exists
            ? state.products.map((item) =>
                matchesId(item, product.id) ? { ...item, ...product } : item,
              )
            : [product, ...state.products],
        };
      }),

    // CRUD: Delete
    deleteProduct: (id) =>
      set((state) => ({
        products: state.products.filter((item) => !matchesId(item, id)),
        selectedProduct:
          state.selectedProduct && matchesId(state.selectedProduct, id)
            ? null
            : state.selectedProduct,
      })),

    removeProduct: (id) => get().deleteProduct(id),

    clearProducts: () => set({ products: [], selectedProduct: null }),

    reset: () => set({ ...initialState }),

    resetState: () => set({ ...initialState }),
  }),
);

export default useProductListStore;
