"use client";

export default function Spinner({ size = 20, className = "" }) {
  const style = { width: size, height: size };
  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-block align-middle ${className}`}
    >
      <span
        className="block rounded-full border-2 border-current border-t-transparent animate-spin"
        style={style}
      />
      <span className="sr-only">Loading…</span>
    </span>
  );
}


