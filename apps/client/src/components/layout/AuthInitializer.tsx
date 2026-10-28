"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore, type IAuthUser } from "@/store/authStore";

/**
 * Properties accepted by AuthInitializer.
 */
export interface AuthInitializerProps {
  /**
   * Pre-fetched user data from server layout to seed global auth state without client fetch.
   */
  initialUser?: IAuthUser | null;
  /**
   * Optional children for backward-compatibility if used as wrapper.
   */
  children?: React.ReactNode;
}

/**
 * Inner logic component extracting searchParams and handling lifecycle synchronization.
 *
 * @param props - Component properties.
 * @returns Null as this is a non-visual controller.
 */
function AuthInitializerLogic({
  initialUser,
}: {
  initialUser?: IAuthUser | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const init = useAuthStore((state) => state.init);
  const reset = useAuthStore((state) => state.reset);
  const setInitialUser = useAuthStore((state) => state.setInitialUser);
  const didSyncInitialRef = useRef(false);

  const isLogout =
    searchParams.get("logout") === "1" || searchParams.get("_logout") === "1";

  // Re-sync if initialUser prop updates (inside effect to avoid setState-during-render)
  useEffect(() => {
    if (initialUser !== undefined) {
      setInitialUser(initialUser);
    }
  }, [initialUser, setInitialUser]);

  const lastNavPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLogout) {
      reset();
      router.replace(pathname);
      return;
    }

    // Revalidate once per navigation: a plain init() early-returns once
    // initialized, so a session that died mid-use would stay stale forever.
    // Same-path re-runs (StrictMode double-effect) and the server-seeded
    // first mount must not fire another getMeAction.
    if (lastNavPathRef.current === pathname) return;
    lastNavPathRef.current = pathname;

    // Server layout already validated the session and seeded the user for
    // this navigation — skip the redundant client fetch on first mount.
    if (initialUser !== undefined && !didSyncInitialRef.current) {
      didSyncInitialRef.current = true;
      return;
    }

    init(true);
  }, [isLogout, pathname, router, reset, init, initialUser]);

  return null;
}

/**
 * Global authentication initializer mounted in the root layout.
 * Hydrates initial user from server layout and monitors auth session lifecycle.
 *
 * @param props - Component properties.
 * @returns Suspense-wrapped logic component and optional children.
 */
export const AuthInitializer = ({
  initialUser,
  children,
}: AuthInitializerProps) => {
  if (children) {
    return (
      <>
        <Suspense fallback={null}>
          <AuthInitializerLogic initialUser={initialUser} />
        </Suspense>
        {children}
      </>
    );
  }

  return (
    <Suspense fallback={null}>
      <AuthInitializerLogic initialUser={initialUser} />
    </Suspense>
  );
};
