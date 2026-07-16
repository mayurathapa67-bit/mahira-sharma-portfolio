import Link from "next/link";
import { MapPin, Phone, Mail, TrendingUp } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-space-600/30 bg-space text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-heading text-lg font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-growth to-data text-white">
              <TrendingUp size={18} />
            </span>
            Mahira<span className="text-growth">.</span>SEO
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Enterprise SEO strategist & digital growth architect scaling organic
            revenue for top-tier brands across Melbourne, Australia and Kathmandu,
            Nepal.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-data" /> Melbourne, Australia / Kathmandu, Nepal
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-data" />
              <a href="tel:+61483959765" className="hover:text-growth">+61 483 959 765</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-data" />
              <a href="mailto:mahira.sharma.seo@gmail.com" className="hover:text-growth">
                mahira.sharma.seo@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white/50">
            Navigate
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Portfolio", "/portfolio"],
              ["Services", "/services"],
              ["Insights", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-growth">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white/50">
            Start a project
          </h3>
          <p className="mt-4 text-sm text-white/70">
            Typically respond within 8 business hours with a free audit.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full bg-growth px-5 py-2 text-sm font-semibold text-space transition-transform hover:scale-[1.03]"
          >
            Get Free Audit
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {year} Mahira Sharma. Built with Next.js, TypeScript & Recharts.
      </div>
    </footer>
  );
}
