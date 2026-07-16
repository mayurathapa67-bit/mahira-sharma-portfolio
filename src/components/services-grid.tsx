import {
  Search,
  PenLine,
  MapPin,
  Grid3x3,
  Code2,
  Heart,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/lib/types";
import { Reveal } from "./reveal";

const ICONS: Record<string, LucideIcon> = {
  search: Search,
  pen: PenLine,
  map: MapPin,
  grid: Grid3x3,
  code: Code2,
  heart: Heart,
};

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const Icon = ICONS[service.icon] ?? Search;
        return (
          <Reveal key={service.title} delay={i * 0.05}>
            <article className="flex h-full flex-col rounded-2xl border border-charcoal/10 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal/10 text-teal">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-charcoal">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
                {service.description}
              </p>
              {service.price ? (
                <p className="mt-4 font-heading text-sm font-semibold text-teal">
                  {service.price}
                </p>
              ) : null}
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
