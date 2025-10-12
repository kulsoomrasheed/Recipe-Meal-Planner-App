"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { useAuthentication } from "./AuthContext";
import { getStoredToken, RecipesAPI } from "../lib/api";

export type RecipeItem = {
  _id?: string;
  id?: string;
  title: string;
  ingredients: Array<{ name: string }>;
  steps: string[];
  imageUrl?: string;
  createdAt?: number;
  updatedAt?: number;
};

type RecipesContextValue = {
  recipes: RecipeItem[];
  loading: boolean;
  addRecipe: (r: { title: string; ingredients: string[]; steps: string }) => Promise<void>;
  updateRecipe: (id: string, u: { title: string; ingredients: string[]; steps: string }) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
};

const RecipesContext = createContext<RecipesContextValue | null>(null);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const { user } = useAuthentication();

  const refetch = useCallback(async () => {
    if (isFetchingRef.current) return;
    if (!user || !getStoredToken()) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await RecipesAPI.list();
      setRecipes(((res as any).recipes || []) as RecipeItem[]);
    } catch (_) {
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setRecipes([]);
      return;
    }
    refetch();
  }, [user, refetch]);

  const addRecipe = useCallback(async (recipe: { title: string; ingredients: string[]; steps: string }) => {
    
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
      await RecipesAPI.create(payload as any);
      await refetch();
    } catch (err) {
      throw err as Error;
    }
  }, [refetch]);

  const updateRecipe = useCallback(async (id: string, updates: { title: string; ingredients: string[]; steps: string }) => {
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
      await RecipesAPI.update(id, payload as any);
      await refetch();
    } catch (err) {
      throw err as Error;
    }
  }, [refetch]);

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      await RecipesAPI.remove(id);
      await refetch();
    } catch (err) {
      throw err as Error;
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


