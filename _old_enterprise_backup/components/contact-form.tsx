"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const BUSINESS_HOURS_MS = 8 * 60 * 60 * 1000;

export function ContactForm() {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("6500-10000");
  const [timeline, setTimeline] = useState("1-3 months");
  const [goals, setGoals] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  const urlValid = website === "" || isValidUrl(website);

  // Live countdown to the response SLA (8 business hours from now).
  const [start] = useState(() => Date.now());
  const deadline = start + BUSINESS_HOURS_MS;
  const [now, setNow] = useState(start);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(0, deadline - now);
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlValid) {
      setStatus("error");
      setMessage("Please enter a valid website URL (including https://).");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, website, email, budget, timeline, goals }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Submission failed. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(`Received! Reference: ${data.id ?? "pending"}.`);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company Name" htmlFor="company">
          <input
            id="company"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="form-input"
            placeholder="Acme Inc."
          />
        </Field>
        <Field label="Website URL" htmlFor="website">
          <input
            id="website"
            required
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-invalid={!urlValid}
            className="form-input"
            placeholder="https://example.com"
          />
          {!urlValid ? (
            <p className="mt-1 text-xs text-red-500">Enter a valid http(s) URL.</p>
          ) : null}
        </Field>
      </div>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="you@company.com"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Budget Range" htmlFor="budget">
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="form-input"
          >
            <option value="2500-5000">$2.5k – $5k / mo</option>
            <option value="6500-10000">$6.5k – $10k / mo</option>
            <option value="14000+">$14k+ / mo</option>
          </select>
        </Field>
        <Field label="Timeline" htmlFor="timeline">
          <select
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="form-input"
          >
            <option>1-3 months</option>
            <option>3-6 months</option>
            <option>6+ months</option>
          </select>
        </Field>
      </div>

      <Field label="Specific Goals" htmlFor="goals">
        <textarea
          id="goals"
          rows={4}
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="form-input"
          placeholder="What does success look like for your organic channel?"
        />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 rounded-full bg-growth px-6 py-3 text-sm font-semibold text-space transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : null}
        Get Free Audit
      </button>

      {status === "success" ? (
        <p className="flex items-center gap-2 text-sm text-growth">
          <CheckCircle2 size={16} /> {message}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} /> {message}
        </p>
      ) : null}

      <p className="text-xs text-space/50 dark:text-white/50">
        Typically respond within 8 business hours —{" "}
        <span className="font-data text-growth">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </span>{" "}
        remaining.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
