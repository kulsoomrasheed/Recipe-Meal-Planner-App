"use client";

import { AuthProvider } from "../context/AuthContext";
import { RecipesProvider } from "../context/RecipesContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <RecipesProvider>
        {children}
      </RecipesProvider>
    </AuthProvider>
  );
}


