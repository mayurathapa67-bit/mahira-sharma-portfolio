export type NavLink = {
  label: string;
  href: string;
};

export type Nav = {
  logo: string;
  links: NavLink[];
};

export type Hero = {
  title: string;
  role: string;
  subtitle: string;
  cta_primary: { label: string; href: string };
  cta_secondary: { label: string; href: string };
  image: string;
};

export type Expertise = {
  name: string;
};

export type ExperienceItem = {
  year: string;
  title: string;
  detail: string;
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
};

export type About = {
  headline: string;
  bio: string;
  philosophy: string;
  expertise: Expertise[];
  experience: ExperienceItem[];
  certifications: Certification[];
  image: string;
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  price?: string;
};

export type PortfolioResult = {
  label: string;
  value: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: "Technical SEO" | "Content Strategy" | "Local SEO";
  excerpt: string;
  client: string;
  results: PortfolioResult[];
  published_date: string;
  featured_image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

export type Social = {
  platform: string;
  url: string;
};

export type Contact = {
  email: string;
  phone: string;
  location: string;
  socials: Social[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Technical SEO" | "Content Strategy" | "Local SEO";
  published_date: string;
  read_time: number;
};

export type ContentPayload = {
  nav: Nav;
  hero: Hero;
  about: About;
  services: Service[];
  portfolio: CaseStudy[];
  testimonials: Testimonial[];
  contact: Contact;
  blog: BlogPost[];
};

export type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export function isContentPayload(value: unknown): value is ContentPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.nav === "object" &&
    v.nav !== null &&
    typeof v.hero === "object" &&
    v.hero !== null &&
    Array.isArray(v.services) &&
    Array.isArray(v.portfolio) &&
    Array.isArray(v.testimonials)
  );
}

export function isCaseStudy(value: unknown): value is CaseStudy {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.slug === "string" && typeof v.title === "string";
}

export function isTestimonial(value: unknown): value is Testimonial {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.quote === "string" && typeof v.name === "string";
}
