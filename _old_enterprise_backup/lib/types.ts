export type ServiceCategory =
  | "Technical SEO"
  | "E-commerce"
  | "SaaS"
  | "International";

export type Industry =
  | "Finance"
  | "E-commerce"
  | "SaaS"
  | "Healthcare"
  | "Travel"
  | "Education";

export interface ChartPoint {
  date: string;
  value: number;
}

export interface CaseStudyResult {
  traffic_growth: number;
  keyword_increase: number;
  revenue_impact: number;
  chart_data: ChartPoint[];
}

export interface CaseStudy {
  slug: string;
  client: string;
  industry: Industry;
  category: ServiceCategory;
  challenge: string;
  strategy: string[];
  results: CaseStudyResult;
  featured_image: string;
  published_date: string;
  client_since: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  before_after: {
    before: number;
    after: number;
    label: string;
  };
}

export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  valid_until: string;
  acronym: string;
}

export interface ToolProficiency {
  name: string;
  category: string;
  proficiency: number;
}

export interface TimelineMilestone {
  year: string;
  achievement: string;
  impact: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  category: "Technical SEO" | "Content Strategy" | "Algorithm Updates";
  excerpt: string;
  read_time: number;
  traffic_potential: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  published_date: string;
}

export interface ServiceTier {
  id: string;
  name: string;
  price: number;
  cadence: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface PricingPlan extends ServiceTier {
  roi_multiplier: number;
}

export interface DashboardMetrics {
  total_traffic: number;
  keyword_distribution: { name: string; value: number }[];
  traffic_growth: ChartPoint[];
  technical_health: { metric: string; score: number }[];
  backlinks: { domain_authority: number; referring: number }[];
  case_studies: CaseStudy[];
}

export interface ContentPayload {
  case_studies: CaseStudy[];
  certifications: Certification[];
  tools: ToolProficiency[];
  timeline: TimelineMilestone[];
  blog: BlogArticle[];
  services: PricingPlan[];
  clients: { name: string; since: string; industry: Industry }[];
}

export interface SubmissionInput {
  company: string;
  website: string;
  email: string;
  budget: string;
  timeline: string;
  goals: string;
  recaptcha_token?: string;
}

export interface SubmissionResult {
  id: string;
  received_at: string;
}

export interface ApiError {
  error: string;
  code: string;
  request_id: string;
}

export function isCaseStudy(value: unknown): value is CaseStudy {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    typeof v.client === "string" &&
    typeof v.challenge === "string" &&
    Array.isArray(v.strategy) &&
    typeof v.results === "object" &&
    v.results !== null
  );
}

export function isContentPayload(value: unknown): value is ContentPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return Array.isArray(v.case_studies) && Array.isArray(v.blog);
}
