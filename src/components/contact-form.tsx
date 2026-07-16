"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMsg("Thank you — I'll be in touch within 2 business days.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your site and what you're hoping to achieve."
          className="w-full rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm outline-none focus:border-teal"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3 text-sm font-medium text-cream transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : null}
        Send message
      </button>

      {status === "success" ? (
        <p className="flex items-center gap-2 text-sm text-teal">
          <CheckCircle2 size={16} /> {msg}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} /> {msg}
        </p>
      ) : null}
    </form>
  );
}
