import { getServices } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import { ServicesClient } from "@/components/services-client";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const plans = await getServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Strategic Offerings"
        title="Engagements built for enterprise scale"
        subtitle="From foundation audits to dedicated growth partnerships — every plan is anchored in measurable ROI."
      />
      <div className="mt-10">
        <ServicesClient plans={plans} />
      </div>

      <Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
            <h3 className="font-heading text-lg font-bold">Technical SEO Audit</h3>
            <p className="mt-2 text-sm text-space/60 dark:text-white/60">
              A 4-phase flow: crawl & log analysis → entity & architecture map →
              prioritised fixes → implementation QA.
            </p>
            <ol className="mt-4 space-y-2 text-sm">
              {["Crawl diagnostics", "Core Web Vitals", "Index & schema", "Roadmap"].map(
                (s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-data/15 font-data text-xs font-bold text-data">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ),
              )}
            </ol>
          </div>
          <div className="rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
            <h3 className="font-heading text-lg font-bold">Ongoing Management</h3>
            <p className="mt-2 text-sm text-space/60 dark:text-white/60">
              Monthly deliverables that compound: strategy, content, links, and
              executive reporting.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-space/70 dark:text-white/70">
              {[
                "Weekly technical monitoring",
                "Bi-weekly content sprints",
                "Monthly link acquisition",
                "Quarterly executive review",
              ].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-growth" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
