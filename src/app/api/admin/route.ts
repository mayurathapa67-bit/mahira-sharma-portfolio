import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, clientKey, errorResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me";

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = rateLimit(
    `admin:${clientKey(req)}`,
    5,
    60_000,
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts.", code: "RATE_LIMITED" },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return errorResponse("Invalid JSON", "BAD_REQUEST", 400);
  }

  if (!body.password || body.password !== ADMIN_PASSWORD) {
    return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
  }

  return NextResponse.json(
    { ok: true },
    { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
