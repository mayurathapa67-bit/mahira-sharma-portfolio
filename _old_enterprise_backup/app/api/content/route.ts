import { NextResponse, type NextRequest } from "next/server";
import contentJson from "@/content/content.json";
import { errorResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_OWNER = process.env.GITHUB_CONTENT_OWNER ?? "";
const GITHUB_REPO = process.env.GITHUB_CONTENT_REPO ?? "";
const GITHUB_PATH = process.env.GITHUB_CONTENT_PATH ?? "content/content.json";
const GITHUB_TOKEN = process.env.GITHUB_CONTENT_TOKEN ?? "";

/**
 * Primary "database" is the GitHub API (read-only, Vercel compliant).
 * On any failure (missing env, 429 rate limit, network error) we fall back to
 * the bundled content.json so the endpoint never crashes.
 */
export async function GET(req: NextRequest) {
  const requestId =
    req.headers.get("x-request-id") ?? crypto.randomUUID();

  const headers: Record<string, string> = { "X-Request-ID": requestId };

  // Cache-busting per spec: never cache.
  headers["Cache-Control"] = "no-store, max-age=0";

  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json(
      { ...contentJson, source: "bundled" },
      { headers },
    );
  }

  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}?ref=${process.env.GITHUB_CONTENT_REF ?? "main"}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "X-Request-ID": requestId,
        },
        cache: "no-store",
      },
    );

    if (res.status === 429) {
      console.warn(`[content] GitHub 429 — falling back. request_id=${requestId}`);
      return NextResponse.json(
        { ...contentJson, source: "bundled-fallback", rate_limited: true },
        { headers },
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { ...contentJson, source: "bundled-fallback", upstream: res.status },
        { headers },
      );
    }

    const payload = (await res.json()) as { content?: string };
    if (!payload.content) {
      return NextResponse.json({ ...contentJson, source: "bundled-fallback" }, { headers });
    }
    const decoded = Buffer.from(payload.content, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded) as unknown;
    return NextResponse.json(
      { ...(parsed as object), source: "github" },
      { headers },
    );
  } catch (err) {
    console.error(`[content] upstream error request_id=${requestId}`, err);
    return NextResponse.json(
      { ...contentJson, source: "bundled-fallback", error: "upstream_unreachable" },
      { headers },
    );
  }
}

export async function POST() {
  const requestId = crypto.randomUUID();
  return errorResponse(
    "Method not allowed",
    "METHOD_NOT_ALLOWED",
    requestId,
    405,
  );
}
