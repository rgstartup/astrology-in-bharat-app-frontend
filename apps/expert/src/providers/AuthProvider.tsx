"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore, type ExpertUser } from "@/store/auth.store";

export interface IAuthProviderProps {
  children: React.ReactNode;
  initialUser?: ExpertUser | null;
}

function AuthProviderLogic({ initialUser }: { initialUser?: ExpertUser | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const init = useAuthStore((state) => state.init);
  const login = useAuthStore((state) => state.login);
  const reset = useAuthStore((state) => state.reset);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const isLogout =
    searchParams.get("logout") === "1" || searchParams.get("_logout") === "1";

  useEffect(() => {
    if (isLogout) {
      reset();
      router.replace(pathname);
      return;
    }

    if (initialUser && !isInitialized) {
      login(initialUser);
      return;
    }

    init();
  }, [isLogout, pathname, router, reset, init, login, initialUser, isInitialized]);

  return null;
}

export function AuthProvider({ children, initialUser }: IAuthProviderProps) {
  return (
    <>
      <Suspense fallback={null}>
        <AuthProviderLogic initialUser={initialUser} />
      </Suspense>
      {children}
    </>
  );
}

export default AuthProvider;
