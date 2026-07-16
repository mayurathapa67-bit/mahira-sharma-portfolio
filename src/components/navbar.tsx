"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Nav } from "@/lib/types";

export function Navbar({ nav }: { nav: Nav }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-charcoal/10">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-charcoal"
        >
          {nav.logo}
          <span className="text-teal">.</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`link-underline text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-teal"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden rounded-full bg-charcoal px-5 py-2 text-sm font-medium text-cream transition-transform hover:scale-[1.03] md:inline-block"
        >
          Get in touch
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-charcoal/10 md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open ? (
        <ul className="border-t border-charcoal/10 px-5 py-3 md:hidden">
          {nav.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.href) ? "text-teal" : "text-charcoal/70"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-charcoal px-5 py-2 text-center text-sm font-medium text-cream"
            >
              Get in touch
            </Link>
          </li>
        </ul>
      ) : null}
    </header>
  );
}
