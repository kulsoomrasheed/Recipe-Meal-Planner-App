"use client";

import { useState } from "react";

export default function InputChips({ value = [], onChange, placeholder = "Add ingredient and press Enter" }) {
  const [input, setInput] = useState("");

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = input.trim();
      if (!v) return;
      const next = Array.from(new Set([...(value || []), v]));
      onChange?.(next);
      setInput("");
    }
  }

  function removeChip(chip) {
    onChange?.((value || []).filter((c) => c !== chip));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {(value || []).map((chip) => (
          <span key={chip} className="px-3 py-1 rounded-full text-sm" style={{ background: "#FFE8EF", color: "#6b4a52" }}>
            {chip}
            <button className="ml-2 underline" onClick={() => removeChip(chip)}>x</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-lg border p-3 outline-none"
        style={{ borderColor: "#ffd6e0", background: "#fff" }}
      />
    </div>
  );
}


