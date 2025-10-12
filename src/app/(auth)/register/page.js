// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import {  useAuthentication } from "../../../context/AuthContext";
// import { Utensils, Github, Linkedin } from "lucide-react";
// import { toast } from "sonner";

// export default function RegisterPage() {
//   const router = useRouter();
//   const { register } = useAuthentication();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   function isValidEmail(v) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     if (!username || username.trim().length < 3) {
//       const errorMsg = "Username must be at least 3 characters";
//       setError(errorMsg);
//       toast.warning(errorMsg);
//       return;
//     }
//     if (!isValidEmail(email)) {
//       const errorMsg = "Please enter a valid email address";
//       setError(errorMsg);
//       toast.warning(errorMsg);
//       return;
//     }   if (!password || password.length < 6) {
//       const errorMsg = "Password must be at least 6 characters";
//       setError(errorMsg);
//       toast.warning(errorMsg);
//       return;
//     }
//     if (password !== confirm) {
//       const errorMsg = "Passwords do not match";
//       setError(errorMsg);
//       toast.warning(errorMsg);
//       return;
//     }
//     setLoading(true);
//     try {
//       await register(username, email, password);
//       toast.success("Registration successful! Welcome to RecipeAi!");
//       router.push("/app");
//     } catch (err) {
//       const msg = err?.data?.error || err?.data?.msg || err?.message || "Registration failed. Please try again.";
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #F5FFF7 0%, #FFFDF5 100%)" }}>
//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md rounded-2xl p-8 shadow-lg" style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #d7f5df" }}>
//           <div className="flex items-center gap-2 mb-6">
//             <div className="p-2 rounded-xl" style={{ background: "#DFF7E7" }}>
//               <Utensils className="text-emerald-500" />
//             </div>
//             <h1 className="text-2xl font-semibold" style={{ color: "#333" }}>RecipèAi</h1>
//           </div>

//           <h2 className="text-xl mb-2" style={{ color: "#444" }}>Create your account</h2>
//           <p className="text-sm mb-6" style={{ color: "#666" }}>Start saving recipes, exploring AI suggestions, and planning meals effortlessly.</p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm mb-1" style={{ color: "#555" }}>Username</label>
//               <input
//                 type="text"
//                 className="w-full rounded-lg border p-3 outline-none"
//                 style={{ borderColor: "#bfe8cb", background: "#fff" }}
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 autoComplete="username"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm mb-1" style={{ color: "#555" }}>Email</label>
//               <input
//                 type="email"
//                 className="w-full rounded-lg border p-3 outline-none"
//                 style={{ borderColor: "#bfe8cb", background: "#fff" }}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 autoComplete="email"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm mb-1" style={{ color: "#555" }}>Password</label>
//               <input
//                 type="password"
//                 className="w-full rounded-lg border p-3 outline-none"
//                 style={{ borderColor: "#bfe8cb", background: "#fff" }}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 autoComplete="new-password"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm mb-1" style={{ color: "#555" }}>Confirm Password</label>
//               <input
//                 type="password"
//                 className="w-full rounded-lg border p-3 outline-none"
//                 style={{ borderColor: "#bfe8cb", background: "#fff" }}
//                 value={confirm}
//                 onChange={(e) => setConfirm(e.target.value)}
//                 autoComplete="new-password"
//                 required
//               />
//             </div>

//             {error ? (
//               <div className="text-sm" style={{ color: "#c2274e" }}>{error}</div>
//             ) : null}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-lg p-3 font-medium transition"
//               style={{ background: "#B7EDC8", color: "#1f3a2c" }}
//             >
//               {loading ? "Creating..." : "Create account"}
//             </button>
//           </form>

//           <p className="text-sm mt-4 text-center" style={{ color: "#666" }}>
//             Already have an account? <Link className="underline" href="/login">Log in</Link>
//           </p>
//         </div>
//       </div>
//       <footer className="w-full text-xs pb-4 text-gray-600 flex items-center justify-center gap-4">
//         <span>© {new Date().getFullYear()} Kulsoom Rasheed</span>
//         <a
//           href="https://github.com/kulsoomrasheed"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="Kulsoom Rasheed GitHub profile"
//           className="inline-flex items-center gap-1 hover:text-gray-800"
//         >
//           <Github size={16} /> GitHub
//         </a>
//         <a
//           href="https://www.linkedin.com/in/kulsoom-rasheed-a5b5a0278/"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="Kulsoom Rasheed LinkedIn profile"
//           className="inline-flex items-center gap-1 hover:text-gray-800"
//         >
//           <Linkedin size={16} /> LinkedIn
//         </a>
//       </footer>
//     </div>
//   );
// }