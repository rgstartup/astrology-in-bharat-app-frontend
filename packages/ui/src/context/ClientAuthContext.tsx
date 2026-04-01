"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { api } from "../utils/api";
export { api };
import { ApiError } from "@repo/safe-fetch";
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
      await api.post("/auth/client-logout");
    } catch (err: any) {
      // Even if backend fails, continue with frontend logout
    }

    router.push("/");
  };

  const refreshBalance = async () => {
    try {
      const [res, error] = await api.get<any>("/wallet/balance");
      if (!error && res) {
          setClientBalance(res as any);
      }
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
      const [res, error] = await api.get<any>(`/client/profile?_t=${new Date().getTime()}`);
      const data = res as any;
      if (!error && data?.user) {
        setClientUser(data.user);
        setIsClientAuthenticated(true);
        refreshBalance();
      } else if (!error && data?.id) {
        setClientUser({
          id: data.user?.id || data.id,
          name: data.user?.name || data.full_name,
          email: data.user?.email,
          roles: data.user?.roles || [],
          profile_picture: data.profile_picture || data.user?.profile_picture,
          avatar: data.profile_picture || data.user?.avatar,
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
        const [res, error] = await api.get<any>(`/client/profile?_t=${new Date().getTime()}`);
        const data = res as any;

        if (!error && data?.user) {
          setClientUser(data.user);
          setIsClientAuthenticated(true);
          refreshBalance();
        } else if (!error && data?.id) {
          setClientUser({
            id: data.user?.id || data.id,
            name: data.user?.name || data.full_name,
            email: data.user?.email,
            roles: data.user?.roles || [],
            profile_picture: data.profile_picture || data.user?.profile_picture,
            avatar: data.profile_picture || data.user?.avatar,
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
