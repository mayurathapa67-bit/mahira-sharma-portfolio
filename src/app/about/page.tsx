import { getContent } from "@/lib/github";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { MagneticButton } from "@/components/magnetic-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;
  const expertise = Array.isArray(about.expertise) ? about.expertise : [];
  const experience = Array.isArray(about.experience) ? about.experience : [];
  const certifications = Array.isArray(about.certifications)
    ? about.certifications
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.image}
            alt="Mahira Sharma"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
            loading="lazy"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            About
          </span>
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-charcoal sm:text-5xl">
            {about.headline}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal/70">
            {about.bio}
          </p>
          <p className="mt-4 font-heading text-lg italic text-charcoal/80">
            {about.philosophy}
          </p>
          <div className="mt-6">
            <MagneticButton href="/contact">Work with me</MagneticButton>
          </div>
        </Reveal>
      </div>

      {/* Expertise */}
      <section className="mt-20">
        <SectionHeading eyebrow="Focus areas" title="Expertise" />
        <div className="mt-8 flex flex-wrap gap-3">
          {expertise.map((e) => (
            <span
              key={e.name}
              className="rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm font-medium text-charcoal/80"
            >
              {e.name}
            </span>
          ))}
        </div>
      </section>

      {/* Experience timeline */}
      <section className="mt-20">
        <SectionHeading eyebrow="The path so far" title="Experience" />
        <ol className="mt-10 border-l border-charcoal/15">
          {experience.map((item, i) => (
            <Reveal key={`${item.year}-${i}`} delay={i * 0.05}>
              <li className="relative mb-10 pl-8">
                <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-teal bg-cream" />
                <p className="font-data text-sm font-bold text-teal">
                  {item.year}
                </p>
                <p className="mt-1 font-heading text-xl font-bold text-charcoal">
                  {item.title}
                </p>
                <p className="mt-1 text-charcoal/60">{item.detail}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Certifications */}
      <section className="mt-20">
        <SectionHeading eyebrow="Credentials" title="Certifications" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-charcoal/10 bg-white p-5"
            >
              <p className="font-heading text-base font-bold text-charcoal">
                {c.name}
              </p>
              <p className="mt-1 text-sm text-charcoal/55">{c.issuer}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-teal">
                {c.year}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal"
        >
          See the work <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
