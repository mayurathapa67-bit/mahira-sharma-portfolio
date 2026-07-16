"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-space-600/30 bg-white/80 backdrop-blur-md dark:bg-space/80">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-growth to-data text-white">
            <TrendingUp size={18} />
          </span>
          <span>
            Mahira<span className="text-growth">.</span>SEO
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-growth ${
                  isActive(link.href)
                    ? "text-growth"
                    : "text-space/70 dark:text-white/70"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-trust px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] md:inline-block"
          >
            Free Audit
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-md border border-space-600/30 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open ? (
        <ul className="border-t border-space-600/30 px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? "text-growth"
                    : "text-space/70 dark:text-white/70"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
