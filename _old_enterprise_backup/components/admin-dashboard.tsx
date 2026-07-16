"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  FileText,
  Users,
  LogOut,
  Server,
  Database,
} from "lucide-react";
import type { ContentPayload } from "@/lib/types";

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<ContentPayload | null>(null);
  const [source, setSource] = useState<string>("—");
  const [health, setHealth] = useState<"operational" | "degraded">("operational");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("ms_admin") !== "1") {
      router.replace("/admin/login");
      return;
    }
    let active = true;
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((json: ContentPayload & { source?: string }) => {
        if (!active) return;
        setData(json);
        setSource(json.source ?? "bundled");
        setHealth(json.source === "github" ? "operational" : "degraded");
      })
      .catch(() => setHealth("degraded"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [router]);

  function logout() {
    localStorage.removeItem("ms_admin");
    router.replace("/admin/login");
  }

  const stats = data
    ? [
        { icon: FileText, label: "Case Studies", value: data.case_studies.length },
        { icon: Users, label: "Clients", value: data.clients.length },
        { icon: Activity, label: "Blog Articles", value: data.blog.length },
        { icon: Server, label: "Services", value: data.services.length },
      ]
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold">Admin Dashboard</h1>
          <p className="text-sm text-space/50 dark:text-white/50">
            Real-time content & system overview.
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border border-space-600/20 px-4 py-2 text-sm font-medium"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 dark:bg-space-700/60">
          <Database size={14} className="text-data" /> Source: {source}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 dark:bg-space-700/60">
          <span
            className={`h-2 w-2 rounded-full ${
              health === "operational" ? "bg-growth" : "bg-amber-400"
            }`}
          />
          System: {health}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-space-600/20"
              />
            ))
          : stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-space-600/20 bg-white p-5 dark:bg-space-700/60"
              >
                <s.icon size={18} className="text-trust" />
                <p className="mt-3 font-data text-3xl font-bold">{s.value}</p>
                <p className="text-xs text-space/50 dark:text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
      </div>

      <section className="mt-10 rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
        <h2 className="font-heading text-lg font-bold">Content Change Log</h2>
        <p className="mt-2 text-sm text-space/60 dark:text-white/60">
          Latest case studies deployed to production:
        </p>
        <ul className="mt-4 divide-y divide-space-600/10">
          {data?.case_studies.slice(0, 5).map((c) => (
            <li key={c.slug} className="flex items-center justify-between py-2 text-sm">
              <span className="font-medium">{c.client}</span>
              <span className="text-space/50 dark:text-white/50">
                {c.category} · {c.published_date}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
