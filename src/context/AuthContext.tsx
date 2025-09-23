"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { AuthAPI, parseJwt, setStoredToken, getStoredToken } from "../lib/api";

type User = { id: string; username: string } | null;

const STORAGE_KEY = "recipesai_auth_user";

type AuthContextValue = {
  user: User;
  isAuthenticated: boolean;
  register: (username: string, email: string, password: string) => Promise<{ id: string; username: string }>;
  login: (username: string, password: string) => Promise<{ id: string; username: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    try {
      const token = getStoredToken();
      if (token) {
        const decoded = parseJwt(token) || {} as any;
        if ((decoded as any)?.userID) {
          setUser({ id: (decoded as any).userID, username: (decoded as any).username });
        }
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, [user]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      await AuthAPI.register({ username, email, pass: password });
      const res = await AuthAPI.login({ username, pass: password });
      const token = (res as any)?.token as string;
      setStoredToken(token);
      const decoded = parseJwt(token) || {} as any;
      const newUser = { id: (decoded as any).userID as string, username: (decoded as any).username as string };
      setUser(newUser);
      return newUser;
    } catch (err) {
      throw err as Error;
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await AuthAPI.login({ username, pass: password });
      const token = (res as any)?.token as string;
      setStoredToken(token);
      const decoded = parseJwt(token) || {} as any;
      const loggedInUser = { id: (decoded as any).userID as string, username: (decoded as any).username as string };
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      throw err as Error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStoredToken(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    } catch (_) {}
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, register, login, logout }),
    [user, isAuthenticated, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


