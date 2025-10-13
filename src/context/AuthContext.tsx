"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { setStoredToken } from "src/lib/api";

type User = { id: string; username: string } | null;

const STORAGE_KEY = "recipesai_auth_user";

type AuthContextValue = {
  user: User;
  // isAuthenticated: boolean;
  // isLoading: boolean;
  // register: (username: string, email: string, password: string) => Promise<{ id: string; username: string }>;
  // login: (username: string, password: string) => Promise<{ id: string; username: string }>;
  // logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  // const isAuthenticated = Boolean(user);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await getToken();
        console.log(token, "my token");
        if (token) {
          setStoredToken(token);
        } else {
          toast.warning("User not authorised")
          router.replace('/login')
        }
      } catch (_) {}
    };
     fetchUserToken()
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   try {
  //     if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  //     else localStorage.removeItem(STORAGE_KEY);
  //   } catch (_) {}
  // }, [user]);

  // const register = useCallback(async (username: string, email: string, password: string) => {
  //   try {
  //     await AuthAPI.register({ username, email, pass: password });
  //     const res = await AuthAPI.login({ username, pass: password });
  //     const token = (res as any)?.token as string;
  //     setStoredToken(token);
  //     const decoded = parseJwt(token) || {} as any;
  //     const newUser = { id: (decoded as any).userID as string, username: (decoded as any).username as string };
  //     setUser(newUser);
  //     return newUser;
  //   } catch (err) {
  //     throw err as Error;
  //   }
  // }, []);

  // const login = useCallback(async (username: string, password: string) => {
  //   try {
  //     const res = await AuthAPI.login({ username, pass: password });
  //     const token = (res as any)?.token as string;
  //     setStoredToken(token);
  //     const decoded = parseJwt(token) || {} as any;
  //     const loggedInUser = { id: (decoded as any).userID as string, username: (decoded as any).username as string };
  //     setUser(loggedInUser);
  //     return loggedInUser;
  //   } catch (err) {
  //     throw err as Error;
  //   }
  // }, []);

  // const logout = useCallback(() => {
  //   setUser(null);
  //   setStoredToken(null);
  //   try {
  //     if (typeof window !== "undefined") {
  //       localStorage.clear();
  //     }
  //   } catch (_) {}
  // }, []);

  const value = useMemo(() => ({ user, getToken }), [user, getToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthentication() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
