"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI, parseJwt, setStoredToken, getStoredToken } from "../lib/api";

const STORAGE_KEY = "recipesai_auth_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isAuthenticated = Boolean(user);

  // load session from token on mount
  useEffect(() => {
    try {
      const token = getStoredToken();
      if (token) {
        const decoded = parseJwt(token) || {};
        if (decoded?.userID) {
          setUser({ id: decoded.userID, username: decoded.username });
        }
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
      }
    } catch (_) {}
  }, []);

  // persist user object (optional; primary source is token)
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, [user]);

  const register = useCallback(async (username, email, password) => {
    try {
      await AuthAPI.register({ username, email, pass: password });
      // Auto-login after successful registration
      const res = await AuthAPI.login({ username, pass: password });
      const token = res?.token;
      setStoredToken(token);
      const decoded = parseJwt(token) || {};
      const newUser = { id: decoded.userID, username: decoded.username };
      setUser(newUser);
      return newUser;
    } catch (err) {
      throw err;
    }
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const res = await AuthAPI.login({ username, pass: password });
      const token = res?.token;
      setStoredToken(token);
      const decoded = parseJwt(token) || {};
      const loggedInUser = { id: decoded.userID, username: decoded.username };
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      throw err;
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


