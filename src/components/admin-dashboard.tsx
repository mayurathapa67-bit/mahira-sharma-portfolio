"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  FileText,
  Inbox,
  Settings as SettingsIcon,
  Plus,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";
import type {
  ContentPayload,
  CaseStudy,
  Service,
  Testimonial,
  PortfolioResult,
  Social,
  Contact,
} from "@/lib/types";

type Tab = "content" | "submissions" | "settings";

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<ContentPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    const json = (await res.json()) as ContentPayload;
    setContent(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ms_admin") !== "1") {
      router.replace("/admin/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadContent();
  }, [router, loadContent]);

  function setField<K extends keyof ContentPayload>(
    key: K,
    value: ContentPayload[K],
  ) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/content/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setStatus(res.ok ? "Saved to GitHub ✓" : "Save failed — check config.");
  }

  if (loading || !content) {
    return (
      <div className="mx-auto mt-24 max-w-sm text-center text-charcoal/60">
        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal" />
        <p className="mt-3">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Console</span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-charcoal">
            Admin Dashboard
          </h1>
          <p className="text-sm text-charcoal/50">
            Edit every section of the site and publish to GitHub.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-cream shadow-soft transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            <Save size={15} /> {saving ? "Saving…" : "Save to GitHub"}
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("ms_admin");
              router.replace("/admin/login");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2.5 text-sm font-medium transition-colors hover:border-charcoal/40"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {status ? (
        <p
          className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
            status.includes("✓")
              ? "bg-teal/10 text-teal"
              : "bg-red-50 text-red-600"
          }`}
        >
          <Check size={14} /> {status}
        </p>
      ) : null}

      <div className="mt-6 flex gap-1 border-b border-charcoal/10">
        {(
          [
            ["content", "Content", FileText],
            ["submissions", "Submissions", Inbox],
            ["settings", "Settings", SettingsIcon],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === id
                ? "border-teal text-teal"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "content" ? (
          <ContentTab content={content} setField={setField} />
        ) : null}
        {tab === "submissions" ? <SubmissionsTab /> : null}
        {tab === "settings" ? <SettingsTab content={content} setField={setField} /> : null}
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="text-sm text-charcoal/50 link-underline hover:text-teal"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

/* ---------------- Content tab ---------------- */

function ContentTab({
  content,
  setField,
}: {
  content: ContentPayload;
  setField: <K extends keyof ContentPayload>(
    key: K,
    value: ContentPayload[K],
  ) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function uploadToUrl(
    file: File,
    onUrl: (url: string) => void,
  ) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = (await res.json()) as { url: string };
        onUrl(data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  function updateHero<K extends keyof ContentPayload["hero"]>(
    field: K,
    value: ContentPayload["hero"][K],
  ) {
    setField("hero", { ...content.hero, [field]: value });
  }
  function updateAbout<K extends keyof ContentPayload["about"]>(
    field: K,
    value: ContentPayload["about"][K],
  ) {
    setField("about", { ...content.about, [field]: value });
  }
  function updateCaseStudy(slug: string, patch: Partial<CaseStudy>) {
    setField(
      "portfolio",
      content.portfolio.map((s) => (s.slug === slug ? { ...s, ...patch } : s)),
    );
  }
  function updateService(i: number, patch: Partial<Service>) {
    setField(
      "services",
      content.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    );
  }
  function updateTestimonial(i: number, patch: Partial<Testimonial>) {
    setField(
      "testimonials",
      content.testimonials.map((t, idx) =>
        idx === i ? { ...t, ...patch } : t,
      ),
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <Panel title="Hero" subtitle="The opening statement on the home page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" value={content.hero.title} onChange={(v) => updateHero("title", v)} />
          <Field label="Role" value={content.hero.role} onChange={(v) => updateHero("role", v)} />
          <div className="sm:col-span-2">
            <TextArea label="Subtitle" value={content.hero.subtitle} onChange={(v) => updateHero("subtitle", v)} />
          </div>
          <Field
            label="Primary CTA label"
            value={content.hero.cta_primary.label}
            onChange={(v) =>
              updateHero("cta_primary", { ...content.hero.cta_primary, label: v })
            }
          />
          <Field
            label="Primary CTA link"
            value={content.hero.cta_primary.href}
            onChange={(v) =>
              updateHero("cta_primary", { ...content.hero.cta_primary, href: v })
            }
          />
          <Field
            label="Secondary CTA label"
            value={content.hero.cta_secondary.label}
            onChange={(v) =>
              updateHero("cta_secondary", {
                ...content.hero.cta_secondary,
                label: v,
              })
            }
          />
          <Field
            label="Secondary CTA link"
            value={content.hero.cta_secondary.href}
            onChange={(v) =>
              updateHero("cta_secondary", {
                ...content.hero.cta_secondary,
                href: v,
              })
            }
          />
        </div>
        <div className="mt-4">
          <ImageUrlField
            label="Hero image"
            url={content.hero.image}
            uploading={uploading}
            onUpload={(f) => uploadToUrl(f, (url) => updateHero("image", url))}
            onUrlChange={(url) => updateHero("image", url)}
            onRemove={() => updateHero("image", "")}
          />
        </div>
      </Panel>

      {/* About */}
      <Panel title="About" subtitle="Bio, philosophy, and the headline on /about.">
        <div className="grid gap-4">
          <Field label="Headline" value={content.about.headline} onChange={(v) => updateAbout("headline", v)} />
          <TextArea label="Bio" value={content.about.bio} onChange={(v) => updateAbout("bio", v)} />
          <TextArea label="Philosophy" value={content.about.philosophy} onChange={(v) => updateAbout("philosophy", v)} />
          <div className="mt-2">
            <ImageUrlField
              label="About image"
              url={content.about.image}
              uploading={uploading}
              onUpload={(f) => uploadToUrl(f, (url) => updateAbout("image", url))}
              onUrlChange={(url) => updateAbout("image", url)}
              onRemove={() => updateAbout("image", "")}
            />
          </div>
          <TagEditor
            label="Expertise tags"
            items={content.about.expertise}
            toName={(e) => e.name}
            onChange={(items) => updateAbout("expertise", items)}
            placeholder="Add a skill…"
          />
        </div>
      </Panel>

      {/* Case studies */}
      <Panel
        title="Case Studies"
        subtitle="Each card on the portfolio page."
        action={
          <AddButton
            label="Add case study"
            onClick={() =>
              setField("portfolio", [
                ...content.portfolio,
                {
                  slug: `case-${Date.now()}`,
                  title: "New case study",
                  category: "Technical SEO",
                  excerpt: "",
                  client: "",
                  results: [{ label: "Result", value: "+0%" }],
                  published_date: new Date().toISOString().slice(0, 10),
                  featured_image: "",
                },
              ])
            }
          />
        }
      >
        <div className="space-y-6">
          {content.portfolio.map((s) => (
            <Card key={s.slug}>
              <div className="flex justify-end">
                <RemoveButton
                  onClick={() =>
                    setField(
                      "portfolio",
                      content.portfolio.filter((x) => x.slug !== s.slug),
                    )
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" value={s.title} onChange={(v) => updateCaseStudy(s.slug, { title: v })} />
                <Field
                  label="Category"
                  value={s.category}
                  onChange={(v) =>
                    updateCaseStudy(s.slug, { category: v as CaseStudy["category"] })
                  }
                />
                <div className="sm:col-span-2">
                  <TextArea label="Excerpt" value={s.excerpt} onChange={(v) => updateCaseStudy(s.slug, { excerpt: v })} />
                </div>
                <Field label="Client" value={s.client} onChange={(v) => updateCaseStudy(s.slug, { client: v })} />
                <Field
                  label="Published date"
                  value={s.published_date}
                  onChange={(v) => updateCaseStudy(s.slug, { published_date: v })}
                />
              </div>
              <div className="mt-3">
                <ImageUrlField
                  label="Featured image"
                  url={s.featured_image}
                  uploading={uploading}
                  onUpload={(f) =>
                    uploadToUrl(f, (url) => updateCaseStudy(s.slug, { featured_image: url }))
                  }
                  onUrlChange={(url) => updateCaseStudy(s.slug, { featured_image: url })}
                  onRemove={() => updateCaseStudy(s.slug, { featured_image: "" })}
                />
              </div>
              <ResultsEditor
                results={s.results}
                onChange={(results) => updateCaseStudy(s.slug, { results })}
              />
            </Card>
          ))}
        </div>
      </Panel>

      {/* Services */}
      <Panel
        title="Services"
        subtitle="Cards shown on the services page."
        action={
          <AddButton
            label="Add service"
            onClick={() =>
              setField("services", [
                ...content.services,
                { title: "New service", description: "", icon: "search", price: "" },
              ])
            }
          />
        }
      >
        <div className="space-y-4">
          {content.services.map((s, i) => (
            <Card key={i}>
              <div className="flex justify-end">
                <RemoveButton
                  onClick={() =>
                    setField(
                      "services",
                      content.services.filter((_, idx) => idx !== i),
                    )
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" value={s.title} onChange={(v) => updateService(i, { title: v })} />
                <Field label="Icon key" value={s.icon} onChange={(v) => updateService(i, { icon: v })} />
                <div className="sm:col-span-2">
                  <TextArea label="Description" value={s.description} onChange={(v) => updateService(i, { description: v })} />
                </div>
                <Field label="Price (optional)" value={s.price ?? ""} onChange={(v) => updateService(i, { price: v })} />
              </div>
            </Card>
          ))}
        </div>
      </Panel>

      {/* Testimonials */}
      <Panel
        title="Testimonials"
        subtitle="Quotes shown in the carousel on the home page."
        action={
          <AddButton
            label="Add testimonial"
            onClick={() =>
              setField("testimonials", [
                ...content.testimonials,
                { quote: "", name: "", role: "", company: "", avatar: "" },
              ])
            }
          />
        }
      >
        <div className="space-y-4">
          {content.testimonials.map((t, i) => (
            <Card key={i}>
              <div className="flex justify-end">
                <RemoveButton
                  onClick={() =>
                    setField(
                      "testimonials",
                      content.testimonials.filter((_, idx) => idx !== i),
                    )
                  }
                />
              </div>
              <TextArea label="Quote" value={t.quote} onChange={(v) => updateTestimonial(i, { quote: v })} />
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <Field label="Name" value={t.name} onChange={(v) => updateTestimonial(i, { name: v })} />
                <Field label="Role" value={t.role} onChange={(v) => updateTestimonial(i, { role: v })} />
                <Field label="Company" value={t.company} onChange={(v) => updateTestimonial(i, { company: v })} />
              </div>
              <div className="mt-3">
                <ImageUrlField
                  label="Avatar"
                  url={t.avatar}
                  uploading={uploading}
                  onUpload={(f) => uploadToUrl(f, (url) => updateTestimonial(i, { avatar: url }))}
                  onUrlChange={(url) => updateTestimonial(i, { avatar: url })}
                  onRemove={() => updateTestimonial(i, { avatar: "" })}
                />
              </div>
            </Card>
          ))}
        </div>
      </Panel>

      {/* Blog */}
      <Panel title="Blog" subtitle="Latest writing previews on the home page.">
        <div className="space-y-4">
          {content.blog.map((b, i) => (
            <Card key={b.slug}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Title"
                  value={b.title}
                  onChange={(v) =>
                    setField(
                      "blog",
                      content.blog.map((x, idx) =>
                        idx === i ? { ...x, title: v } : x,
                      ),
                    )
                  }
                />
                <Field
                  label="Category"
                  value={b.category}
                  onChange={(v) =>
                    setField(
                      "blog",
                      content.blog.map((x, idx) =>
                        idx === i
                          ? { ...x, category: v as BlogCategory }
                          : x,
                      ),
                    )
                  }
                />
                <div className="sm:col-span-2">
                  <TextArea
                    label="Excerpt"
                    value={b.excerpt}
                    onChange={(v) =>
                      setField(
                        "blog",
                        content.blog.map((x, idx) =>
                          idx === i ? { ...x, excerpt: v } : x,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Submissions tab ---------------- */

function SubmissionsTab() {
  const [list, setList] = useState<
    { id: string; name: string; email: string; message: string; created_at: string }[]
  >([]);
  const [live, setLive] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const res = await fetch("/api/submissions", { cache: "no-store" });
    const json = (await res.json()) as typeof list;
    setList(json);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    if (live) {
      timer.current = setInterval(() => void refresh(), 8000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [live, refresh]);

  async function remove(id: string) {
    await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    void refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setLive((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium transition-colors"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              live ? "animate-pulse bg-teal" : "bg-charcoal/30"
            }`}
          />
          {live ? "Live · auto-refresh 8s" : "Paused"}
        </button>
        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-teal"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-charcoal/50">No submissions yet.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((s) => (
            <li key={s.id} className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-lg font-bold text-charcoal">
                    {s.name}{" "}
                    <span className="text-sm font-normal text-charcoal/50">
                      · {s.email}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-charcoal/70">{s.message}</p>
                  <p className="mt-2 text-xs text-charcoal/40">
                    {new Date(s.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => void remove(s.id)}
                  aria-label="Delete submission"
                  className="rounded-full border border-charcoal/15 p-2 text-charcoal/50 transition-colors hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Settings tab (contact editing) ---------------- */

function SettingsTab({
  content,
  setField,
}: {
  content: ContentPayload;
  setField: <K extends keyof ContentPayload>(
    key: K,
    value: ContentPayload[K],
  ) => void;
}) {
  const contact = content.contact;

  function updateContact(patch: Partial<Contact>) {
    setField("contact", { ...contact, ...patch });
  }

  return (
    <div className="space-y-6">
      <Panel title="Contact Details" subtitle="Shown on the contact page and footer.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" value={contact.email} onChange={(v) => updateContact({ email: v })} />
          <Field label="Phone" value={contact.phone} onChange={(v) => updateContact({ phone: v })} />
          <div className="sm:col-span-2">
            <Field label="Location" value={contact.location} onChange={(v) => updateContact({ location: v })} />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-charcoal/50">
            Social links
          </p>
          <div className="space-y-3">
            {contact.socials.map((soc, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  aria-label="Social platform"
                  value={soc.platform}
                  onChange={(e) => {
                    const next = [...contact.socials] as Social[];
                    next[i] = { ...soc, platform: e.target.value };
                    updateContact({ socials: next });
                  }}
                  className="field w-32"
                />
                <input
                  aria-label="Social URL"
                  value={soc.url}
                  onChange={(e) => {
                    const next = [...contact.socials] as Social[];
                    next[i] = { ...soc, url: e.target.value };
                    updateContact({ socials: next });
                  }}
                  className="field flex-1"
                />
                <button
                  type="button"
                  aria-label="Remove social"
                  onClick={() =>
                    updateContact({
                      socials: contact.socials.filter((_, idx) => idx !== i),
                    })
                  }
                  className="rounded-full border border-charcoal/15 p-2 text-charcoal/50 transition-colors hover:border-red-300 hover:text-red-600"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              updateContact({
                socials: [...contact.socials, { platform: "New", url: "https://" }],
              })
            }
            className="mt-3 inline-flex items-center gap-1 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium transition-colors hover:border-teal hover:text-teal"
          >
            <Plus size={14} /> Add social
          </button>
        </div>
      </Panel>

      <Panel title="GitHub Integration" subtitle="Where your content is stored.">
        <p className="text-sm text-charcoal/60">
          Content and submissions are committed to the connected GitHub
          repository every time you press “Save to GitHub”. Changes are
          version-controlled and go live immediately.
        </p>
        <div className="mt-4 rounded-lg bg-cream-deep px-4 py-3 text-sm text-charcoal/70">
          Repository: {process.env.NEXT_PUBLIC_GITHUB_REPO ?? "configured"}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Reusable building blocks ---------------- */

type BlogCategory = "Technical SEO" | "Content Strategy" | "Local SEO";

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-charcoal">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-charcoal/50">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-cream/60 p-5">
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-charcoal/60">
        {label}
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field" />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-charcoal/60">
        {label}
      </span>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field resize-y"
      />
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-teal px-4 py-1.5 text-sm font-medium text-cream transition-transform hover:scale-[1.03]"
    >
      <Plus size={14} /> {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="inline-flex items-center gap-1 rounded-full border border-charcoal/15 px-3 py-1 text-xs font-medium text-charcoal/50 transition-colors hover:border-red-300 hover:text-red-600"
    >
      <Trash2 size={13} /> Remove
    </button>
  );
}

function ImageUrlField({
  label,
  url,
  uploading,
  onUpload,
  onUrlChange,
  onRemove,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-charcoal/60">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-charcoal/20 text-charcoal/30">
            <ImageIcon size={18} />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-medium transition-colors hover:border-teal"
            >
              <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
            </button>
            {url ? (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-charcoal/15 px-3 py-2 text-sm font-medium text-charcoal/50 transition-colors hover:border-red-300 hover:text-red-600"
              >
                <X size={14} /> Remove
              </button>
            ) : null}
          </div>
          <input
            aria-label={`${label} URL`}
            placeholder="…or paste an image URL"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="field w-72 max-w-full"
          />
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
          }}
        />
      </div>
    </div>
  );
}

function ResultsEditor({
  results,
  onChange,
}: {
  results: PortfolioResult[];
  onChange: (results: PortfolioResult[]) => void;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-charcoal/50">
        Results
      </p>
      <div className="space-y-2">
        {results.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              aria-label="Result label"
              value={r.label}
              onChange={(e) =>
                onChange(
                  results.map((x, idx) =>
                    idx === i ? { ...x, label: e.target.value } : x,
                  ),
                )
              }
              className="field flex-1"
            />
            <input
              aria-label="Result value"
              value={r.value}
              onChange={(e) =>
                onChange(
                  results.map((x, idx) =>
                    idx === i ? { ...x, value: e.target.value } : x,
                  ),
                )
              }
              className="field w-40"
            />
            <button
              type="button"
              aria-label="Remove result"
              onClick={() => onChange(results.filter((_, idx) => idx !== i))}
              className="rounded-full border border-charcoal/15 p-2 text-charcoal/50 transition-colors hover:border-red-300 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...results, { label: "New result", value: "+0%" }])}
        className="mt-2 inline-flex items-center gap-1 rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-medium transition-colors hover:border-teal hover:text-teal"
      >
        <Plus size={13} /> Add result
      </button>
    </div>
  );
}

function TagEditor<T extends { name: string }>({
  label,
  items,
  toName,
  onChange,
  placeholder,
}: {
  label: string;
  items: T[];
  toName: (item: T) => string;
  onChange: (items: T[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="mt-2">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-charcoal/50">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-cream-deep px-3 py-1.5 text-sm text-charcoal/80"
          >
            {toName(item)}
            <button
              type="button"
              aria-label="Remove tag"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-charcoal/40 hover:text-red-600"
            >
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const v = draft.trim();
          if (!v) return;
          onChange([...items, { name: v } as T]);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="field flex-1"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-full bg-teal px-4 py-2 text-sm font-medium text-cream"
        >
          <Plus size={14} /> Add
        </button>
      </form>
    </div>
  );
}
