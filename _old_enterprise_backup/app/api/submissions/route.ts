import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, clientKey, errorResponse } from "@/lib/rate-limit";
import type { SubmissionInput } from "@/lib/types";

export const dynamic = "force-dynamic";

const LIMIT = 5;
const WINDOW_MS = 60_000;

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  // Rate limiting: max 5 submissions / minute per client.
  const { allowed, retryAfter } = rateLimit(
    `submissions:${clientKey(req)}`,
    LIMIT,
    WINDOW_MS,
  );
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait before submitting again.",
        code: "RATE_LIMITED",
        request_id: requestId,
      },
      {
        status: 429,
        headers: {
          "X-Request-ID": requestId,
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  let body: Partial<SubmissionInput>;
  try {
    body = (await req.json()) as Partial<SubmissionInput>;
  } catch {
    return errorResponse("Invalid JSON body", "BAD_REQUEST", requestId, 400);
  }

  const company = sanitize(body.company ?? "");
  const website = sanitize(body.website ?? "");
  const email = sanitize(body.email ?? "");
  const budget = sanitize(body.budget ?? "");
  const timeline = sanitize(body.timeline ?? "");
  const goals = sanitize(body.goals ?? "");

  if (!company || !website || !email) {
    return errorResponse(
      "Company, website, and email are required.",
      "VALIDATION",
      requestId,
      422,
    );
  }
  if (!isValidUrl(website)) {
    return errorResponse("Website must be a valid http(s) URL.", "VALIDATION", requestId, 422);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return errorResponse("Email is invalid.", "VALIDATION", requestId, 422);
  }

  // Spam protection: a real deployment would verify body.recaptcha_token
  // against Google's reCAPTCHA v3 siteverify endpoint here.
  const token = body.recaptcha_token;
  if (token !== undefined && token.trim() === "") {
    return errorResponse("Spam check failed.", "SPAM", requestId, 403);
  }

  const submission = {
    id: `sub_${requestId.slice(0, 8)}`,
    received_at: new Date().toISOString(),
    company,
    website,
    email,
    budget,
    timeline,
    goals,
  };

  // In a full deployment this would persist to a database.
  console.info(`[submissions] received ${submission.id}`, {
    request_id: requestId,
  });

  return NextResponse.json(
    { id: submission.id, received_at: submission.received_at },
    { status: 201, headers: { "X-Request-ID": requestId } },
  );
}
