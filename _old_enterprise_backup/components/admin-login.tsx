"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password. Please try again.");
        setLoading(false);
        return;
      }
      localStorage.setItem("ms_admin", "1");
      router.push("/admin");
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-sm rounded-2xl border border-space-600/20 bg-white p-8 shadow-sm dark:bg-space-700/60">
      <div className="flex items-center gap-2">
        <Lock size={18} className="text-trust" />
        <h1 className="font-heading text-lg font-bold">Admin Access</h1>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Admin password"
          className="form-input"
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-trust px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Unlock
        </button>
      </form>
    </div>
  );
}
