"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Utensils } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }   if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      router.push("/app");
    } catch (err) {
      const msg = err?.data?.error || err?.data?.msg || err?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #F5FFF7 0%, #FFFDF5 100%)" }}>
      <div className="w-full max-w-md rounded-2xl p-8 shadow-lg" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #d7f5df" }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl" style={{ background: "#DFF7E7" }}>
            <Utensils className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: "#333" }}>RecipèAi</h1>
        </div>

        <h2 className="text-xl mb-2" style={{ color: "#444" }}>Create your account</h2>
        <p className="text-sm mb-6" style={{ color: "#666" }}>Start saving recipes and get AI suggestions.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Username</label>
            <input
              type="text"
              className="w-full rounded-lg border p-3 outline-none"
              style={{ borderColor: "#bfe8cb", background: "#fff" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Email</label>
            <input
              type="email"
              className="w-full rounded-lg border p-3 outline-none"
              style={{ borderColor: "#bfe8cb", background: "#fff" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Password</label>
            <input
              type="password"
              className="w-full rounded-lg border p-3 outline-none"
              style={{ borderColor: "#bfe8cb", background: "#fff" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: "#555" }}>Confirm Password</label>
            <input
              type="password"
              className="w-full rounded-lg border p-3 outline-none"
              style={{ borderColor: "#bfe8cb", background: "#fff" }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error ? (
            <div className="text-sm" style={{ color: "#c2274e" }}>{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg p-3 font-medium transition"
            style={{ background: "#B7EDC8", color: "#1f3a2c" }}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center" style={{ color: "#666" }}>
          Already have an account? <Link className="underline" href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}


