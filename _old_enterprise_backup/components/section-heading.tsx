import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal>
      <div className={align === "center" ? "text-center" : ""}>
        {eyebrow ? (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-growth">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p
            className={`mt-3 max-w-2xl text-space/60 dark:text-white/60 ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
