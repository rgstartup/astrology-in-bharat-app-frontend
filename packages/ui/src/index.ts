export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { ClientAuthProvider, useClientAuth, apiClient } from "./context/ClientAuthContext";
export { CartProvider, useCart } from "./context/CartContext";

// Components from shared
export { Avatar } from "./components/Avatar";
export { Button } from "./components/Button";
export { Loading } from "./components/Loading";
export { NotFound } from "./components/NotFound";
export { NotificationBell } from "./components/NotificationBell";
export { SearchInput } from "./components/SearchInput";
export { StatsCards, type StatConfig } from "./components/StatsCard";

// Profile components
export * from "./components/profile";


