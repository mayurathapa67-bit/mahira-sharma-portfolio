import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Code2 } from "lucide-react";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/data";
import { TrafficAreaChart, KeywordPieChart, TechnicalBarChart, BacklinkScatterChart } from "@/components/results-chart";
import { MetricCounter } from "@/components/metric-counter";
import { RoiCalculator } from "@/components/roi-calculator";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Case Study Not Found" };
  return {
    title: `${study.client} — Case Study`,
    description: study.challenge,
  };
}

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((s) => ({ slug: s.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const keywordDistribution = [
    { name: "Commercial", value: 42 },
    { name: "Informational", value: 38 },
    { name: "Transactional", value: 20 },
  ];
  const technical = [
    { metric: "Crawl", score: 96 },
    { metric: "Core Vitals", score: 94 },
    { metric: "Indexing", score: 92 },
    { metric: "Schema", score: 88 },
    { metric: "Mobile", score: 97 },
  ];
  const backlinks = [
    { domain_authority: 82, referring: 1240 },
    { domain_authority: 76, referring: 980 },
    { domain_authority: 71, referring: 760 },
    { domain_authority: 68, referring: 540 },
    { domain_authority: 64, referring: 310 },
    { domain_authority: 55, referring: 210 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm text-space/60 hover:text-growth dark:text-white/60"
        >
          <ArrowLeft size={15} /> All case studies
        </Link>
      </Reveal>

      {/* Header */}
      <Reveal>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="rounded-full bg-data/10 px-3 py-1 text-xs font-medium text-data">
              {study.category}
            </span>
            <h1 className="mt-3 font-heading text-4xl font-extrabold">
              {study.client}
            </h1>
            <p className="mt-2 max-w-2xl text-space/60 dark:text-white/60">
              {study.challenge}
            </p>
          </div>
        </div>
      </Reveal>

      {/* 4-panel dashboard */}
      <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-space-600/20 bg-white p-5 dark:bg-space-700/60">
          <h3 className="font-heading text-sm font-bold">Traffic</h3>
          <TrafficAreaChart data={study.results.chart_data} />
        </div>
        <div className="rounded-2xl border border-space-600/20 bg-white p-5 dark:bg-space-700/60">
          <h3 className="font-heading text-sm font-bold">Keywords</h3>
          <KeywordPieChart data={keywordDistribution} />
        </div>
        <div className="rounded-2xl border border-space-600/20 bg-white p-5 dark:bg-space-700/60">
          <h3 className="font-heading text-sm font-bold">Technical</h3>
          <TechnicalBarChart data={technical} />
        </div>
        <div className="rounded-2xl border border-space-600/20 bg-white p-5 dark:bg-space-700/60">
          <h3 className="font-heading text-sm font-bold">Backlinks</h3>
          <BacklinkScatterChart data={backlinks} />
        </div>
      </section>

      {/* Results summary */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { v: study.results.traffic_growth, s: "%", l: "Organic Traffic" },
          { v: study.results.keyword_increase, s: "", l: "Keywords Gained" },
          { v: study.results.revenue_impact, s: "$", l: "Revenue Impact" },
        ].map((r) => (
          <div key={r.l} className="rounded-2xl border border-space-600/20 bg-white p-6 text-center dark:bg-space-700/60">
            <p className="font-data text-3xl font-bold text-growth">
              <MetricCounter value={r.v} prefix={r.s === "$" ? "$" : ""} suffix={r.s === "$" ? "" : r.s} />
            </p>
            <p className="mt-1 text-sm text-space/50 dark:text-white/50">{r.l}</p>
          </div>
        ))}
      </section>

      {/* Strategy breakdown */}
      <section className="mt-16">
        <h2 className="font-heading text-2xl font-extrabold">Strategy Breakdown</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-growth" />
              <h3 className="font-heading font-bold">Technical SEO</h3>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-space p-4 font-data text-xs text-growth-soft scroll-thin">
              <code>{`<!-- Canonical consolidation -->
<link rel="canonical"
  href="https://site.com/{category}" />
<script type="application/ld+json">
{ "@context": "https://schema.org",
  "@type": "ItemList" }</script>`}</code>
            </pre>
          </div>
          <div className="rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-data" />
              <h3 className="font-heading font-bold">Content & Links</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-space/70 dark:text-white/70">
              {study.strategy.map((s) => (
                <li key={s} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-data" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonial + ROI */}
      <section className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <figure className="rounded-2xl border border-space-600/20 bg-white p-6 dark:bg-space-700/60">
          <blockquote className="font-heading text-lg font-medium">
            “{study.testimonial.quote}”
          </blockquote>
          <figcaption className="mt-4 text-sm text-space/60 dark:text-white/60">
            — {study.testimonial.author}, {study.testimonial.role}
          </figcaption>
        </figure>
        <RoiCalculator baseMultiplier={4.1} />
      </section>
    </div>
  );
}
