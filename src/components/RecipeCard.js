"use client";

import { Pencil, Trash2 } from "lucide-react";
import Spinner from "./Spinner";

export default function RecipeCard({ recipe, onEdit, onDelete, busy = false }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #ffe0e0" }}>
      {recipe.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40" style={{ background: "#FFF7F7" }} />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold" style={{ color: "#333" }}>{recipe.title}</h3>
            <p className="text-sm mt-1" style={{ color: "#6b4a52" }}>
              {Array.isArray(recipe.ingredients)
                ? recipe.ingredients
                    .slice(0, 3)
                    .map((ing) => (typeof ing === "string" ? ing : ing?.name))
                    .filter(Boolean)
                    .join(", ")
                : ""}
              {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 3 ? "…" : ""}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {busy ? (
              <Spinner size={16} />
            ) : (
              <>
                <button onClick={() => onEdit?.(recipe)} className="p-2 rounded-lg" style={{ background: "#FFF2F7" }}>
                  <Pencil size={16} className="text-pink-500" />
                </button>
                <button onClick={() => onDelete?.(recipe)} className="p-2 rounded-lg" style={{ background: "#FFF2F7" }}>
                  <Trash2 size={16} className="text-rose-500" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


