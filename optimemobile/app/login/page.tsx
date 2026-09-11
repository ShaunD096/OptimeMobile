"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, CheckCircle2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("kobe@atlasgo.com");
  const [password, setPassword] = useState("AtlasGo2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate authentication for local environment
    setTimeout(() => {
      if (email === "kobe@atlasgo.com" && password === "AtlasGo2026!") {
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. For local preview, use kobe@atlasgo.com / AtlasGo2026!");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-bold text-xl shadow-lg shadow-cyan-900/40 mb-3">
            Ω
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Atlas Go · Optime</h1>
          <p className="text-xs text-slate-400 mt-1">
            Personal Financial Intelligence Engine
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Authenticating..." : "Sign in to Engine"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Pre-configured Golden Demo Account
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-slate-300 flex justify-between items-center">
            <span>kobe@atlasgo.com</span>
            <span className="text-slate-500">AtlasGo2026!</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            ← Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
