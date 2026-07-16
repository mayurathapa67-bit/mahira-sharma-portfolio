import "server-only";
import type { ContentPayload, Submission } from "./types";

const GITHUB_API = "https://api.github.com";
const OWNER = process.env.GITHUB_REPO?.split("/")[0] ?? "";
const REPO = process.env.GITHUB_REPO?.split("/")[1] ?? "";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN ?? "";
const CONTENT_PATH = "src/content/content.json";
const SUBMISSIONS_PATH = "src/content/submissions.json";

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export function githubConfigured(): boolean {
  return Boolean(OWNER && REPO && TOKEN);
}

export function isLocalhost(): boolean {
  return process.env.NODE_ENV !== "production";
}

async function getFile(
  path: string,
): Promise<{ content: string; sha: string } | null> {
  if (!githubConfigured()) return null;
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
      { headers: headers(), cache: "no-store", next: { revalidate: 0 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: string;
      sha?: string;
    };
    if (!data.content || !data.sha) return null;
    return {
      content: Buffer.from(data.content, "base64").toString("utf-8"),
      sha: data.sha,
    };
  } catch {
    return null;
  }
}

async function putFile(
  path: string,
  content: string,
  sha: string | null,
  message: string,
): Promise<boolean> {
  if (!githubConfigured()) return false;
  try {
    const body: Record<string, unknown> = {
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: BRANCH,
    };
    if (sha) body.sha = sha;
    const res = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(body),
        cache: "no-store",
        next: { revalidate: 0 },
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

/** Local fallback read (Vercel-safe, guarded by try/catch). */
async function readLocal(path: string): Promise<string | null> {
  try {
    const { readFileSync, existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const full = join(process.cwd(), path);
    if (!existsSync(full)) return null;
    return readFileSync(full, "utf-8");
  } catch {
    return null;
  }
}

export async function getContent(): Promise<ContentPayload> {
  // GitHub first (per spec), local fallback only on localhost / failure.
  const remote = await getFile(CONTENT_PATH);
  if (remote) {
    try {
      return JSON.parse(remote.content) as ContentPayload;
    } catch {
      /* fall through */
    }
  }
  if (isLocalhost()) {
    const local = await readLocal(CONTENT_PATH);
    if (local) return JSON.parse(local) as ContentPayload;
  }
  // Last resort: bundled asset import (always present at build time).
  const bundled = await import("@/content/content.json");
  return bundled.default as ContentPayload;
}

export async function saveContent(payload: ContentPayload): Promise<boolean> {
  const existing = await getFile(CONTENT_PATH);
  const content = JSON.stringify(payload, null, 2);
  return putFile(
    CONTENT_PATH,
    content,
    existing ? existing.sha : null,
    "Update site content via admin",
  );
}

export async function getSubmissions(): Promise<Submission[]> {
  const remote = await getFile(SUBMISSIONS_PATH);
  if (remote) {
    try {
      const parsed = JSON.parse(remote.content);
      return Array.isArray(parsed) ? (parsed as Submission[]) : [];
    } catch {
      return [];
    }
  }
  if (isLocalhost()) {
    const local = await readLocal(SUBMISSIONS_PATH);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return Array.isArray(parsed) ? (parsed as Submission[]) : [];
      } catch {
        return [];
      }
    }
  }
  return [];
}

export async function saveSubmissions(list: Submission[]): Promise<boolean> {
  const existing = await getFile(SUBMISSIONS_PATH);
  return putFile(
    SUBMISSIONS_PATH,
    JSON.stringify(list, null, 2),
    existing ? existing.sha : null,
    "Update contact submissions via admin",
  );
}
