import { getContent } from "@/lib/github";
import { HeroSection } from "@/components/hero-section";
import { CaseStudyCard } from "@/components/case-study-card";
import { ServicesGrid } from "@/components/services-grid";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { BlogPreview } from "@/components/blog-preview";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { MagneticButton } from "@/components/magnetic-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  const studies = Array.isArray(content.portfolio) ? content.portfolio : [];
  const services = Array.isArray(content.services) ? content.services : [];
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials
    : [];
  const blog = Array.isArray(content.blog) ? content.blog : [];

  return (
    <>
      <HeroSection hero={content.hero} />

      {/* Featured case studies */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Selected work"
            title="Case studies"
            subtitle="A few stories of brands that learned to be found."
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal"
          >
            All case studies <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 3).map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="bg-cream-deep">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.about.image}
              alt="Mahira Sharma"
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              About
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-charcoal sm:text-4xl">
              {content.about.headline}
            </h2>
            <p className="mt-4 text-charcoal/65">{content.about.bio}</p>
            <p className="mt-4 font-heading text-lg italic text-charcoal/80">
              {content.about.philosophy}
            </p>
            <div className="mt-6">
              <MagneticButton href="/about" variant="outline">
                More about me
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services overview */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="What I do"
          title="Services"
          subtitle="Focused engagements, sized to where you are."
        />
        <div className="mt-10">
          <ServicesGrid services={services} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            align="center"
            eyebrow="Kind words"
            title="What clients say"
          />
          <div className="mt-10">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="From the journal" title="Latest writing" />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-teal"
          >
            All posts <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10">
          <BlogPreview posts={blog} />
        </div>
      </section>
    </>
  );
}
