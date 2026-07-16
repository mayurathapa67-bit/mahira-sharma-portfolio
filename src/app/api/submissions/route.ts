import { NextResponse, type NextRequest } from "next/server";
import { getSubmissions, saveSubmissions } from "@/lib/github";
import { rateLimit, clientKey, errorResponse } from "@/lib/rate-limit";
import type { Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim().slice(0, 2000);
}

export async function GET() {
  const list = await getSubmissions();
  return NextResponse.json(list, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = rateLimit(
    `submissions:${clientKey(req)}`,
    5,
    60_000,
  );
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many submissions. Please wait.",
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };
  } catch {
    return errorResponse("Invalid JSON", "BAD_REQUEST", 400);
  }

  const name = sanitize(body.name ?? "");
  const email = sanitize(body.email ?? "");
  const message = sanitize(body.message ?? "");

  if (!name || !email || !message) {
    return errorResponse("All fields are required.", "VALIDATION", 422);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return errorResponse("Email is invalid.", "VALIDATION", 422);
  }

  const submission: Submission = {
    id: `sub_${crypto.randomUUID().slice(0, 8)}`,
    name,
    email,
    message,
    created_at: new Date().toISOString(),
  };

  const list = await getSubmissions();
  list.unshift(submission);
  const saved = await saveSubmissions(list);

  if (!saved) {
    // Local/dev fallback: still acknowledge but flag persistence failure.
    return NextResponse.json(
      { id: submission.id, persisted: false },
      { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  return NextResponse.json(
    { id: submission.id, persisted: true },
    { status: 201, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return errorResponse("Missing id", "BAD_REQUEST", 400);
  }
  const list = await getSubmissions();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) {
    return errorResponse("Submission not found", "NOT_FOUND", 404);
  }
  const saved = await saveSubmissions(next);
  if (!saved) {
    return errorResponse("Could not delete", "PERSIST_FAILED", 500);
  }
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
