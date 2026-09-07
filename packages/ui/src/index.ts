export { default as Header } from "./header";
export { default as Footer } from "./Footer";
export { CartProvider, useCart } from "./context/CartContext";

// Components from shared
export { Avatar } from "./components/Avatar";
export { Button } from "./components/Button";
export { Loading } from "./components/Loading";
export { NotFound } from "./components/NotFound";
export { NotificationBell } from "./components/NotificationBell";
export { SearchInput } from "./components/SearchInput";
export { StatsCards, type StatConfig } from "./components/StatsCard";
export { VerificationPopup } from "./components/VerificationPopup";
export { CloseButton, type CloseButtonProps } from "./components/CloseButton";

// Profile components
export * from "./components/profile";

// Utils
export * from "./utils/socket";
export * from "./utils/currency";
