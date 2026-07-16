import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { Reveal } from "./reveal";

function categoryColor(category: CaseStudy["category"]): string {
  switch (category) {
    case "Technical SEO":
      return "bg-teal/10 text-teal";
    case "Content Strategy":
      return "bg-charcoal/5 text-charcoal/70";
    case "Local SEO":
      return "bg-teal-soft/10 text-teal-soft";
  }
}

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Reveal>
        <Link
          href={`/portfolio/${study.slug}`}
          className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-charcoal/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="aspect-[16/10] overflow-hidden bg-cream-deep">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.featured_image}
            alt={study.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColor(
                study.category,
              )}`}
            >
              {study.category}
            </span>
            <span className="text-xs text-charcoal/40">{study.client}</span>
          </div>
          <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-charcoal">
            {study.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
            {study.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-charcoal/10 pt-4">
            {study.results.slice(0, 2).map((r) => (
              <div key={r.label}>
                <p className="font-heading text-lg font-bold text-teal">
                  {r.value}
                </p>
                <p className="text-[11px] uppercase tracking-wide text-charcoal/45">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal">
            Read case study <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
