import { SITE_CONFIG } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Strategy Consultation"
        title="Let's architect your growth"
        subtitle="Tell me about your site and goals — you'll get a free technical audit and prioritized roadmap."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="rounded-3xl border border-space-600/20 bg-white p-6 sm:p-8 dark:bg-space-700/60">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            <div className="space-gradient rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-growth" />
                <h3 className="font-heading text-lg font-bold">Response Time</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">
                Typically respond within 8 business hours with a free audit.
              </p>
            </div>
            {[
              { icon: MapPin, label: "Locations", value: SITE_CONFIG.locations.join(" / ") },
              { icon: Phone, label: "Phone", value: SITE_CONFIG.phone },
              { icon: Mail, label: "Email", value: SITE_CONFIG.email },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 rounded-2xl border border-space-600/20 bg-white p-4 dark:bg-space-700/60"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-data/10 text-data">
                  <c.icon size={18} />
                </span>
                <div>
                  <p className="text-xs text-space/50 dark:text-white/50">
                    {c.label}
                  </p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
