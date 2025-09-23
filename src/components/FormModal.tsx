"use client";

import { ReactNode } from "react";

export default function FormModal({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.2)" }} onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl p-6" style={{ background: "#fff", border: "1px solid #ffe0e0" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: "#333" }}>{title}</h3>
          <button onClick={onClose} className="text-sm underline" style={{ color: "#6b4a52" }}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}


