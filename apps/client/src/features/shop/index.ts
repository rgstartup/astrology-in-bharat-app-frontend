// Explicit exports only

export {
  ShopProvider,
  useShopStore,
  useShopStoreApi,
  type ShopDataState,
  type ShopActions,
  type ShopWishlistItem,
} from "./stores/shop.store";

export { ShopInitializer } from "./stores/shop-initializer";

export { useShopCheckout } from "./hooks/use-shop-checkout";

export { ShopHeader } from "./components/shop-header.component";
export { ShopProfileDropdown } from "./components/shop-profile-dropdown.component";
export { ShopFooter } from "./components/shop-footer.component";
export { ShopCartButton } from "./components/shop-cart-button.component";
export { ProductCard } from "./components/product-card.component";
export { ProductGrid } from "./components/product-grid.component";
export { ShopShippingForm } from "./components/checkout/shop-shipping-form.component";
export { ShopOrderSummary } from "./components/checkout/shop-order-summary.component";
export { ShopPaymentMethod } from "./components/checkout/shop-payment-method.component";

export { ShopCartService } from "./services/shop-cart.service";
export { ShopWishlistService } from "./services/shop-wishlist.service";
export { ShopProductService } from "./services/shop-product.service";
export { ShopOrderService } from "./services/shop-order.service";

export type {
  ShopProduct,
  ShopProductVariant,
  ShopShippingAddress,
  ShopOrderSummary as ShopOrderSummaryType,
} from "./types/shop.types";
