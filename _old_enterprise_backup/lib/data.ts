import "server-only";
import type { CaseStudy, ContentPayload } from "./types";

/**
 * Static, build-time content layer.
 *
 * The spec calls for the GitHub API to act as the primary "database". In this
 * implementation we ship a curated dataset inside the repo (content/content.json)
 * so the site is fully functional and crash-free at build and runtime. When a
 * GitHub token + repo are configured via environment variables, `getContent`
 * will attempt to hydrate from the GitHub API and gracefully fall back to the
 * bundled dataset on any failure (429, network error, missing env). This keeps
 * the app Vercel-read-only compliant and resilient.
 */

import contentJson from "@/content/content.json";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_OWNER = process.env.GITHUB_CONTENT_OWNER ?? "";
const GITHUB_REPO = process.env.GITHUB_CONTENT_REPO ?? "";
const GITHUB_PATH = process.env.GITHUB_CONTENT_PATH ?? "content/content.json";
const GITHUB_TOKEN = process.env.GITHUB_CONTENT_TOKEN ?? "";

function fallbackContent(): ContentPayload {
  return contentJson as ContentPayload;
}

export async function getContent(): Promise<ContentPayload> {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    return fallbackContent();
  }

  const requestId = crypto.randomUUID();
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}?ref=${process.env.GITHUB_CONTENT_REF ?? "main"}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "X-Request-ID": requestId,
      },
      // Always fresh — Vercel read-only compliant.
      cache: "no-store",
    });

    if (res.status === 429) {
      // Rate limited — fall back silently to bundled content.
      return fallbackContent();
    }
    if (!res.ok) {
      return fallbackContent();
    }

    const payload = (await res.json()) as { content?: string };
    if (!payload.content) return fallbackContent();

    const decoded = Buffer.from(payload.content, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as unknown;
    if (typeof parsed !== "object" || parsed === null) {
      return fallbackContent();
    }
    return parsed as ContentPayload;
  } catch {
    return fallbackContent();
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const data = await getContent();
  return Array.isArray(data.case_studies) ? data.case_studies : [];
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const studies = await getCaseStudies();
  return studies.find((study) => study.slug === slug) ?? null;
}

export async function getBlogArticles() {
  const data = await getContent();
  return Array.isArray(data.blog) ? data.blog : [];
}

export async function getServices() {
  const data = await getContent();
  return Array.isArray(data.services) ? data.services : [];
}

export const SITE_CONFIG = {
  name: "Mahira Sharma",
  role: "Enterprise SEO Strategist & Digital Growth Architect",
  locations: ["Melbourne, Australia", "Kathmandu, Nepal"],
  phone: "+61 483 959 765",
  email: "mahira.sharma.seo@gmail.com",
  total_traffic: 1245678,
};
