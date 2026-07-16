import { getContent } from "@/lib/github";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Mail, Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getContent();
  const contact = content.contact;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk search"
        subtitle="Whether you're starting out or untangling a messy migration, I'd love to hear from you."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <div className="rounded-3xl border border-charcoal/10 bg-white p-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
              { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
              { icon: MapPin, label: "Location", value: contact.location, href: null },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal/10 text-teal">
                  <c.icon size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-charcoal/45">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="font-medium text-charcoal link-underline"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="font-medium text-charcoal">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-4 border-t border-charcoal/10 pt-5 text-sm">
              {contact.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-charcoal/70 hover:text-teal"
                >
                  {s.platform}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
