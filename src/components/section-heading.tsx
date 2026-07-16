import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal>
      <div className={align === "center" ? "text-center" : ""}>
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            {eyebrow}
          </span>
        ) : null}
        <h2
          className={`mt-3 font-heading text-3xl font-bold sm:text-4xl ${
            light ? "text-cream" : "text-charcoal"
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`mt-3 max-w-2xl text-base leading-relaxed ${
              light ? "text-cream/70" : "text-charcoal/60"
            } ${align === "center" ? "mx-auto" : ""}`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
