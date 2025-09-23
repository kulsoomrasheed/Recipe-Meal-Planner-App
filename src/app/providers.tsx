"use client";

import { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { RecipesProvider } from "../context/RecipesContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RecipesProvider>
        {children}
      </RecipesProvider>
    </AuthProvider>
  );
}


