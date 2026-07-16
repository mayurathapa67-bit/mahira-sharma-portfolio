import { getContent, SITE_CONFIG } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { Certifications, ToolGrid } from "@/components/certifications";
import { MetricCounter } from "@/components/metric-counter";
import { Reveal } from "@/components/reveal";
import { MapPin, Phone, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const data = await getContent();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Intro */}
      <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-wider text-growth">
            The Strategist
          </span>
          <h1 className="mt-2 font-heading text-4xl font-extrabold sm:text-5xl">
            Data-driven SEO leadership for enterprise scale
          </h1>
          <p className="mt-5 max-w-2xl text-space/70 dark:text-white/70">
            I&apos;m {SITE_CONFIG.name}, an {SITE_CONFIG.role.toLowerCase()} with a
            track record of compounding organic revenue for top-tier brands. My
            approach fuses technical rigour, entity-based content systems, and
            measurable link strategy — every decision anchored in data.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { v: 7, s: " yrs", l: "Enterprise experience" },
              { v: 1245678, s: "", l: "Sessions / yr managed" },
              { v: 12, s: "M", l: "Attributed revenue" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-space-600/20 bg-white p-4 dark:bg-space-700/60">
                <p className="font-data text-2xl font-bold text-growth">
                  <MetricCounter value={s.v} suffix={s.s} />
                </p>
                <p className="text-xs text-space/50 dark:text-white/50">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-gradient rounded-3xl p-6 text-white">
            <h2 className="font-heading text-lg font-bold">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-data" /> {SITE_CONFIG.locations.join(" / ")}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-data" /> {SITE_CONFIG.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-data" /> {SITE_CONFIG.email}
              </li>
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Timeline */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="Track record"
          title="Professional Timeline"
          subtitle="Milestones measured by impact, not activity."
        />
        <div className="mt-10">
          <Timeline items={data.timeline} />
        </div>
      </section>

      {/* Certifications */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          subtitle="Hover a badge to see issue and validity dates."
        />
        <div className="mt-8">
          <Certifications items={data.certifications} />
        </div>
      </section>

      {/* Technical stack */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="Tooling"
          title="Technical Stack"
          subtitle="The platforms and languages behind the growth engine."
        />
        <div className="mt-8">
          <ToolGrid items={data.tools} />
        </div>
      </section>
    </div>
  );
}
