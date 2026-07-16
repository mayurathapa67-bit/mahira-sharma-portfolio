import { getContent } from "@/lib/data";
import { buildDashboardMetrics } from "@/lib/mock-metrics";
import { TypewriterHeadline } from "@/components/typewriter-headline";
import { LiveTrafficCounter } from "@/components/live-traffic-counter";
import { SerpSimulator } from "@/components/serp-simulator";
import { DashboardGrid } from "@/components/dashboard-grid";
import { CaseStudyCard } from "@/components/case-study-card";
import { TrustedBy } from "@/components/trusted-by";
import { Reveal } from "@/components/reveal";
import { MetricCounter } from "@/components/metric-counter";
import { HomeErrorBoundary } from "@/components/home-error-boundary";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getContent();
  const caseStudies = Array.isArray(data.case_studies) ? data.case_studies : [];
  const metrics = buildDashboardMetrics(caseStudies);

  return (
    <HomeErrorBoundary>
      {/* HERO */}
      <section className="relative overflow-hidden space-gradient text-white">
        <div className="data-glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-data/30 bg-data/10 px-3 py-1 text-xs font-medium text-data">
              Enterprise SEO · Melbourne / Kathmandu
            </span>
            <div className="mt-5">
              <TypewriterHeadline />
            </div>
            <p className="mt-6 max-w-xl text-base text-white/70">
              I architect data-driven organic growth for enterprise brands —
              combining technical precision, content systems, and link strategy to
              compound search revenue.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LiveTrafficCounter initial={metrics.total_traffic} />
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-growth px-6 py-3 text-sm font-semibold text-space transition-transform hover:scale-[1.03]"
              >
                Get Free Audit <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { v: 1245678, s: "", l: "Sessions / yr" },
                { v: 98, s: "%", l: "Client retention" },
                { v: 12, s: "M", l: "Attributed revenue" },
              ].map((stat) => (
                <div key={stat.l}>
                  <p className="font-data text-2xl font-bold text-white">
                    <MetricCounter value={stat.v} prefix="" suffix={stat.s} />
                  </p>
                  <p className="text-xs text-white/50">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <SerpSimulator />
          </div>
        </div>
      </section>

      {/* PERFORMANCE DASHBOARD */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl font-extrabold">
                The Strategy Dashboard
              </h2>
              <p className="mt-2 max-w-xl text-space/60 dark:text-white/60">
                Live, interactive visualization of the growth engine — every chart
                supports hover, zoom context, and tooltips.
              </p>
            </div>
            <span className="rounded-full bg-growth/10 px-3 py-1 text-xs font-medium text-growth">
              Updated real-time
            </span>
          </div>
        </Reveal>
        <DashboardGrid metrics={metrics} />
      </section>

      {/* CASE STUDIES */}
      <section className="border-t border-space-600/20 bg-space-700/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-3xl font-extrabold">
                  Enterprise Case Studies
                </h2>
                <p className="mt-2 max-w-xl text-space/60 dark:text-white/60">
                  Selected engagements with measurable, compounding outcomes.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1 text-sm font-semibold text-trust hover:text-growth"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.slice(0, 6).map((study, i) => (
              <Reveal key={study.slug} delay={i * 0.05}>
                <CaseStudyCard study={study} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-space/50 dark:text-white/50">
            Trusted by enterprise teams across industries
          </p>
        </Reveal>
        <TrustedBy clients={data.clients} />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="space-gradient relative overflow-hidden rounded-3xl p-10 text-white sm:p-14">
            <div className="data-glow absolute inset-0" aria-hidden />
            <div className="relative max-w-2xl">
              <h2 className="font-heading text-3xl font-extrabold">
                Ready to scale organic revenue?
              </h2>
              <p className="mt-3 text-white/70">
                Book a free technical audit and get a prioritized growth roadmap
                within 8 business hours.
              </p>
              <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                {[
                  "Technical SEO deep-dive",
                  "Keyword & entity map",
                  "Prioritized action plan",
                  "ROI projection",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-growth" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-growth px-6 py-3 text-sm font-semibold text-space transition-transform hover:scale-[1.03]"
              >
                Get Free Audit <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </HomeErrorBoundary>
  );
}
