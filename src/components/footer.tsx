import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import type { Contact, Nav } from "@/lib/types";

export function Footer({ nav, contact }: { nav: Nav; contact: Contact }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-charcoal/10 bg-cream-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl font-bold text-charcoal">
            {nav.logo}
            <span className="text-teal">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-charcoal/60">
            SEO specialist helping brands earn lasting visibility through honest,
            considered work.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-charcoal/50">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline hover:text-charcoal">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-charcoal/50">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-teal" /> {contact.location}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-teal" />
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="link-underline">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-teal" />
              <a href={`mailto:${contact.email}`} className="link-underline">
                {contact.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm">
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
      </div>
      <div className="border-t border-charcoal/10 py-5 text-center text-xs text-charcoal/40">
        © {year} {nav.logo}. Crafted with care.
      </div>
    </footer>
  );
}
