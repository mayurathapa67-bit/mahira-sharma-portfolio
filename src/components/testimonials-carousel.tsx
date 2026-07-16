"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      6000,
    );
    return () => clearInterval(id);
  }, [testimonials.length]);

  const items = testimonials.length ? testimonials : [];

  return (
    <div className="relative mx-auto max-w-3xl rounded-3xl border border-charcoal/10 bg-white p-10 text-center sm:p-14">
      <Quote className="mx-auto text-teal" size={32} />
      <AnimatePresence mode="wait">
        {items.length ? (
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="mt-5 font-heading text-xl font-medium leading-relaxed text-charcoal sm:text-2xl">
              “{items[index]!.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm text-charcoal/60">
              <span className="font-semibold text-charcoal">
                {items[index]!.name}
              </span>{" "}
              · {items[index]!.role}, {items[index]!.company}
            </figcaption>
          </motion.figure>
        ) : null}
      </AnimatePresence>

      {items.length > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-teal" : "bg-charcoal/20"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
