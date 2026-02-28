"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { safeFetch } from "@repo/safe-fetch";
import { useRouter } from "next/navigation";

// NOTE: accessToken is an httpOnly cookie set by the server-side proxy.
// JS cannot read httpOnly cookies — that is intentional for security.
// The browser sends them automatically with credentials: "include".
// We do NOT manually read, set, or delete the accessToken cookie from JS.

// Helper: delete a non-httpOnly cookie (only used for legacy cleanup)
const deleteLegacyCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Thin API helper using safeFetch
const isServer = typeof window === "undefined";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6543";
const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

function buildUrl(path: string): string {
  if (isServer) {
    return `${cleanApiUrl}/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
  }
  return `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
}

async function apiGet<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<{ data: T; status: number }> {
  let url = buildUrl(path);
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    ).toString();
    url = `${url}?${qs}`;
  }
  const [data, error] = await safeFetch<T>(url, { credentials: "include" });
  if (error) throw error;
  return { data: data as T, status: 200 };
}

async function apiPost<T>(
  path: string,
  body?: Record<string, unknown>,
): Promise<{ data: T; status: number }> {
  const url = buildUrl(path);
  const [data, error] = await safeFetch<T>(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  } as any);
  if (error) throw error;
  return { data: data as T, status: 200 };
}

// Re-export named apiClient for backward compat with any direct imports
export const apiClient = { get: apiGet, post: apiPost };

interface ClientUser {
  id: number;
  name?: string;
  email?: string;
  roles?: string[];
  avatar?: string;
  profile_picture?: string;
}

interface ClientAuthContextType {
  clientUser: ClientUser | null;
  clientBalance: number;
  clientLogin: (token: string, userData?: ClientUser) => void;
  clientLogout: () => void;
  refreshAuth: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  isClientAuthenticated: boolean;
  clientLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType>({
  clientUser: null,
  clientBalance: 0,
  clientLogin: () => { },
  clientLogout: () => { },
  refreshAuth: async () => { },
  refreshBalance: async () => { },
  isClientAuthenticated: false,
  clientLoading: true,
});

export const ClientAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [clientBalance, setClientBalance] = useState<number>(0);
  const [clientLoading, setClientLoading] = useState(true);
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false);
  const router = useRouter();
  const authCheckRef = useRef(false);

  const clientLogin = (_newToken: string, userData?: ClientUser) => {
    if (userData) setClientUser(userData);
    setIsClientAuthenticated(true);
    refreshBalance();
  };

  const clientLogout = async () => {
    setClientUser(null);
    setIsClientAuthenticated(false);
    setClientLoading(false);
    deleteLegacyCookie("clientAccessToken");

    try {
      await apiPost("/auth/client-logout");
    } catch (err: any) {
      // Even if backend fails, continue with frontend logout
    }

    router.push("/");
  };

  const refreshBalance = async () => {
    try {
      const res = await apiGet<any>("/wallet/balance");
      setClientBalance(res.data);
    } catch (_) { }
  };

  const refreshAuth = async () => {
    const token = getCookie("clientAccessToken");
    if (!token) {
      setIsClientAuthenticated(false);
      setClientLoading(false);
      return;
    }
    if (!isClientAuthenticated) setClientLoading(true);
    try {
      const res = await apiGet<any>("/client/profile", { _t: new Date().getTime() });
      if (res.data?.user) {
        setClientUser(res.data.user);
        setIsClientAuthenticated(true);
        refreshBalance();
      } else if (res.data?.id) {
        setClientUser({
          id: res.data.user?.id || res.data.id,
          name: res.data.user?.name || res.data.full_name,
          email: res.data.user?.email,
          roles: res.data.user?.roles || [],
          profile_picture: res.data.profile_picture || res.data.user?.profile_picture,
          avatar: res.data.profile_picture || res.data.user?.avatar,
        });
        setIsClientAuthenticated(true);
      } else {
        setClientUser(null);
        setIsClientAuthenticated(false);
      }
    } catch (err: any) {
      setIsClientAuthenticated(false);
      setClientUser(null);
    } finally {
      setClientLoading(false);
    }
  };

  useEffect(() => {
    if (authCheckRef.current) return;

    const initClientAuth = async () => {
      if (typeof window === "undefined") return;
      deleteLegacyCookie("clientAccessToken");

      try {
        const res = await apiGet<any>("/client/profile", { _t: new Date().getTime() });

        if (res.data?.user) {
          setClientUser(res.data.user);
          setIsClientAuthenticated(true);
          refreshBalance();
        } else if (res.data?.id) {
          setClientUser({
            id: res.data.user?.id || res.data.id,
            name: res.data.user?.name || res.data.full_name,
            email: res.data.user?.email,
            roles: res.data.user?.roles || [],
            profile_picture: res.data.profile_picture || res.data.user?.profile_picture,
            avatar: res.data.profile_picture || res.data.user?.avatar,
          });
          setIsClientAuthenticated(true);
        } else {
          setClientUser(null);
          setIsClientAuthenticated(false);
        }
      } catch (err: any) {
        setIsClientAuthenticated(false);
        setClientUser(null);
        if (err?.status === 401) {
          localStorage.removeItem("clientAccessToken");
          deleteLegacyCookie("clientAccessToken");
        }
      } finally {
        setClientLoading(false);
        authCheckRef.current = false;
      }
    };

    authCheckRef.current = true;
    initClientAuth();
  }, []);

  return (
    <ClientAuthContext.Provider
      value={{
        clientUser,
        clientBalance,
        clientLogin,
        clientLogout,
        refreshAuth,
        refreshBalance,
        isClientAuthenticated,
        clientLoading,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => useContext(ClientAuthContext);

// Helper to read a cookie value (only for non-httpOnly cookies)
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  if (!match) return null;
  return decodeURIComponent(match[2] ?? "");
}
