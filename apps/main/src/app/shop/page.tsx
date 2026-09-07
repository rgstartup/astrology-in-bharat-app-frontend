import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { use } from "react";
const ShopPage = () => {
  const locale = use(getLocale());

  return redirect({ href: "/shop/products", locale });
};

export default ShopPage;
