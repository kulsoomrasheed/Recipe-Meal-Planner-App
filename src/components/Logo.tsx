"use client";

import { ChefHat } from "lucide-react";

export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-xl" style={{ background: "#FFE8EF" }}>
        <ChefHat size={size} className="text-pink-500" />
      </div>
      <span className="font-semibold" style={{ color: "#333" }}>RecipèAi</span>
    </div>
  );
}


