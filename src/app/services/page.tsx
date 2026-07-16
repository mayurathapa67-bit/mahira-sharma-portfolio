import { getContent } from "@/lib/github";
import { SectionHeading } from "@/components/section-heading";
import { ServicesGrid } from "@/components/services-grid";
import { Reveal } from "@/components/reveal";
import { MagneticButton } from "@/components/magnetic-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = await getContent();
  const services = Array.isArray(content.services) ? content.services : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Services"
        title="Considered SEO, sized to you"
        subtitle="Every engagement starts with a conversation and a clear plan. No retainers you don't understand."
      />

      <div className="mt-12">
        <ServicesGrid services={services} />
      </div>

      <Reveal>
        <div className="mt-16 rounded-3xl bg-charcoal p-10 text-center text-cream sm:p-14">
          <h2 className="font-heading text-3xl font-bold">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/70">
            Tell me about your site and goals. I&apos;ll send a free, honest
            assessment of what would move the needle first.
          </p>
          <div className="mt-6 flex justify-center">
            <MagneticButton href="/contact">Get a free assessment</MagneticButton>
          </div>
        </div>
      </Reveal>

      <div className="mt-12">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal"
        >
          See the results <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
