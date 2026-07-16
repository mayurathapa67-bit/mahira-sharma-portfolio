"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Hero } from "@/lib/types";
import { MagneticButton } from "./magnetic-button";

export function HeroSection({ hero }: { hero: Hero }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 10%, rgba(38,166,154,0.10), transparent 60%), radial-gradient(40% 40% at 0% 100%, rgba(28,28,28,0.04), transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-teal"
          >
            {hero.role}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] text-charcoal sm:text-5xl lg:text-6xl"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal/65"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href={hero.cta_primary.href}>
              {hero.cta_primary.label}
            </MagneticButton>
            <MagneticButton href={hero.cta_secondary.href} variant="outline">
              {hero.cta_secondary.label}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.image}
            alt="Mahira Sharma, SEO specialist"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl"
            loading="eager"
          />
          <div className="absolute -bottom-5 -left-5 hidden h-28 w-28 rounded-2xl bg-teal/10 sm:block" />
          <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-full bg-charcoal/5 sm:block" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="flex items-center gap-2 text-teal">
          <ArrowRight size={16} />
          <span className="font-heading text-sm italic text-charcoal/50">
            Seven years of helping brands be found.
          </span>
        </div>
      </div>
    </section>
  );
}
