import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getContent } from "@/lib/github";
import { Reveal } from "@/components/reveal";
import { CaseStudyCard } from "@/components/case-study-card";
import { MagneticButton } from "@/components/magnetic-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const study = (content.portfolio ?? []).find((s) => s.slug === slug);
  if (!study) return { title: "Case Study" };
  return { title: study.title, description: study.excerpt };
}

export async function generateStaticParams() {
  const content = await getContent();
  return (content.portfolio ?? []).map((s) => ({ slug: s.slug }));
}

export default async function CaseStudyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const study = (content.portfolio ?? []).find((s) => s.slug === slug);
  if (!study) notFound();

  const related = (content.portfolio ?? [])
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <Reveal>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-teal"
        >
          <ArrowLeft size={15} /> All case studies
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
            {study.category}
          </span>
          <span className="text-sm text-charcoal/40">{study.client}</span>
        </div>
        <h1 className="mt-4 font-heading text-4xl font-extrabold text-charcoal sm:text-5xl">
          {study.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-charcoal/65">
          {study.excerpt}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={study.featured_image}
          alt={study.title}
          className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-lg"
          loading="lazy"
        />
      </Reveal>

      <Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {study.results.map((r) => (
            <div
              key={r.label}
              className="rounded-2xl border border-charcoal/10 bg-white p-6 text-center"
            >
              <p className="font-heading text-3xl font-bold text-teal">
                {r.value}
              </p>
              <p className="mt-1 text-sm text-charcoal/50">{r.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="mt-10 font-heading text-xl italic leading-relaxed text-charcoal/80">
          “The work wasn&apos;t about tricks — it was about making the site
          genuinely useful, then letting the data confirm it.”
        </p>
      </Reveal>

      <div className="mt-10">
        <MagneticButton href="/contact">Start a project</MagneticButton>
      </div>

      {related.length ? (
        <section className="mt-20 border-t border-charcoal/10 pt-12">
          <h2 className="font-heading text-2xl font-bold text-charcoal">
            More case studies
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((s) => (
              <CaseStudyCard key={s.slug} study={s} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
