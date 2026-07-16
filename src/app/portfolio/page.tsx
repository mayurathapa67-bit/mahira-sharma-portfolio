import { getContent } from "@/lib/github";
import { SectionHeading } from "@/components/section-heading";
import { PortfolioExplorer } from "@/components/portfolio-explorer";
import { Reveal } from "@/components/reveal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const content = await getContent();
  const studies = Array.isArray(content.portfolio) ? content.portfolio : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <Reveal>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-teal"
        >
          <ArrowLeft size={15} /> Back home
        </Link>
      </Reveal>
      <div className="mt-4">
        <SectionHeading
          eyebrow="Case studies"
          title="Stories of being found"
          subtitle="Filter by focus area, or search for a client or topic."
        />
      </div>
      <div className="mt-10">
        <PortfolioExplorer studies={studies} />
      </div>
    </div>
  );
}
