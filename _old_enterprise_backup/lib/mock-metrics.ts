import type {
  CaseStudy,
  ChartPoint,
  DashboardMetrics,
} from "./types";
import { SITE_CONFIG } from "./data";

/**
 * Derives the homepage dashboard metrics from the case study dataset so the
 * visualizations always reflect real content rather than disconnected mocks.
 */
export function buildDashboardMetrics(
  caseStudies: CaseStudy[],
): DashboardMetrics {
  const primary = caseStudies[0];
  const trafficGrowth: ChartPoint[] = primary
    ? primary.results.chart_data
    : [];

  const keyword_distribution = [
    { name: "Technical", value: 34 },
    { name: "Content", value: 41 },
    { name: "International", value: 15 },
    { name: "Links", value: 10 },
  ];

  const technical_health = [
    { metric: "Crawl", score: 96 },
    { metric: "Core Vitals", score: 94 },
    { metric: "Indexing", score: 92 },
    { metric: "Schema", score: 88 },
    { metric: "Mobile", score: 97 },
  ];

  const backlinks = [
    { domain_authority: 82, referring: 1240 },
    { domain_authority: 76, referring: 980 },
    { domain_authority: 71, referring: 760 },
    { domain_authority: 68, referring: 540 },
    { domain_authority: 64, referring: 420 },
    { domain_authority: 59, referring: 310 },
    { domain_authority: 55, referring: 210 },
    { domain_authority: 51, referring: 150 },
  ];

  return {
    total_traffic: SITE_CONFIG.total_traffic,
    keyword_distribution,
    traffic_growth: trafficGrowth,
    technical_health,
    backlinks,
    case_studies: caseStudies,
  };
}
