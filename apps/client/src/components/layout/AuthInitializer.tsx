"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface IAuthInitializer {
  children: React.ReactNode;
}

function AuthInitializerLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const init = useAuthStore((state) => state.init);
  const reset = useAuthStore((state) => state.reset);

  const isLogout =
    searchParams.get("logout") === "1" || searchParams.get("_logout") === "1";

  useEffect(() => {
    if (isLogout) {
      reset();
      router.replace(pathname);
      return;
    }

    init();
  }, [isLogout, pathname, router, reset, init]);

  return null;
}

export const AuthInitializer = ({ children }: IAuthInitializer) => {
  return (
    <>
      <Suspense fallback={null}>
        <AuthInitializerLogic />
      </Suspense>
      {children}
    </>
  );
};
