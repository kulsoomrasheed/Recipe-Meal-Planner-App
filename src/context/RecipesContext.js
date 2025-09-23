"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { getStoredToken } from "../lib/api";
import { RecipesAPI } from "../lib/api";

// No localStorage caching for recipes; always rely on API

export function createEmptyRecipe() {
  return {
    id: crypto.randomUUID(),
    title: "",
    ingredients: [],
    steps: "",
    imageUrl: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const RecipesContext = createContext(null);

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const { user } = useAuth();

  const refetch = useCallback(async () => {
    if (isFetchingRef.current) return;
    // Require authenticated user and token before fetching
    if (!user || !getStoredToken()) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await RecipesAPI.list();
      setRecipes(res.recipes || []);
    } catch (_) {
      // ignore fetch errors
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  // Fetch recipes whenever the authenticated user changes
  useEffect(() => {
    if (!user) {
      setRecipes([]);
      return;
    }
    refetch();
  }, [user, refetch]);

  // No persistence side-effect

  const addRecipe = useCallback(async (recipe) => {
    try {
      const payload = {
        title: recipe.title,
        description: recipe.steps?.slice(0, 120) || "",
        ingredients: (recipe.ingredients || []).map((name) => ({ name })),
        steps: (recipe.steps || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await RecipesAPI.create(payload);
      await refetch();
    } catch (err) {
      throw err;
    }
  }, [refetch]);

  const updateRecipe = useCallback(async (id, updates) => {
    try {
      const payload = {
        title: updates.title,
        description: updates.steps?.slice(0, 120) || "",
        ingredients: (updates.ingredients || []).map((name) => ({ name })),
        steps: (updates.steps || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await RecipesAPI.update(id, payload);
      await refetch();
    } catch (err) {
      throw err;
    }
  }, [refetch]);

  const deleteRecipe = useCallback(async (id) => {
    try {
      await RecipesAPI.remove(id);
      await refetch();
    } catch (err) {
      throw err;
    }
  }, [refetch]);

  const value = useMemo(
    () => ({ recipes, loading, addRecipe, updateRecipe, deleteRecipe, refetch }),
    [recipes, loading, addRecipe, updateRecipe, deleteRecipe, refetch]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error("useRecipes must be used within RecipesProvider");
  return ctx;
}


