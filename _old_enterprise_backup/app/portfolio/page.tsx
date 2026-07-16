import { getCaseStudies } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import { PortfolioExplorer } from "@/components/portfolio-explorer";
import { Reveal } from "@/components/reveal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const studies = await getCaseStudies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-space/60 hover:text-growth dark:text-white/60"
        >
          <ArrowLeft size={15} /> Back home
        </Link>
      </Reveal>
      <div className="mt-4">
        <SectionHeading
          eyebrow="Enterprise Case Studies"
          title="Proof, not promises"
          subtitle="Filter by category and industry, or search to find relevant engagements."
        />
      </div>
      <div className="mt-8">
        <PortfolioExplorer studies={studies} />
      </div>
    </div>
  );
}
