"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ChefHat, Github, Linkedin } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/app");
    } catch (err) {
      // console.log(err,'err');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #FFF7F7 0%, #FFFDF5 100%)" }}>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl p-8 shadow-lg" style={{ background: "rgba(255,255,255,0.9)", border: "1px solid #ffe0e0" }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-xl" style={{ background: "#FFE8EF" }}>
              <ChefHat className="text-pink-500" />
            </div>
            <h1 className="text-2xl font-semibold" style={{ color: "#333" }}>RecipèAi</h1>
          </div>

          <h2 className="text-xl mb-2" style={{ color: "#444" }}>Welcome back</h2>
          <p className="text-sm mb-6" style={{ color: "#666" }}>Log in to manage recipes and get AI ideas.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: "#555" }}>Username</label>
              <input
                type="text"
                className="w-full rounded-lg border p-3 outline-none"
                style={{ borderColor: "#ffd6e0", background: "#fff" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: "#555" }}>Password</label>
              <input
                type="password"
                className="w-full rounded-lg border p-3 outline-none"
                style={{ borderColor: "#ffd6e0", background: "#fff" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              style={{ background: "#FFB3C7", color: "#40282c" }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm mt-4 text-center" style={{ color: "#666" }}>
            No account? <Link className="underline" href="/register">Register</Link>
          </p>
        </div>
      </div>
      <footer className="w-full py-4 text-xs text-gray-600 flex items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} Kulsoom Rasheed</span>
        <a
          href="https://github.com/kulsoomrasheed"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kulsoom Rasheed GitHub profile"
          className="inline-flex items-center gap-1 hover:text-gray-800"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/kulsoom-rasheed-a5b5a0278/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kulsoom Rasheed LinkedIn profile"
          className="inline-flex items-center gap-1 hover:text-gray-800"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </footer>
    </div>
  );
}


