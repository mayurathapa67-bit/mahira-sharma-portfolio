import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, clientKey, errorResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me-please";
const LIMIT = 5; // 5 attempts / minute

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  const { allowed, retryAfter } = rateLimit(
    `admin:${clientKey(req)}`,
    LIMIT,
    60_000,
  );
  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many attempts. Try again shortly.",
        code: "RATE_LIMITED",
        request_id: requestId,
      },
      {
        status: 429,
        headers: { "X-Request-ID": requestId, "Retry-After": String(retryAfter) },
      },
    );
  }

  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return errorResponse("Invalid JSON", "BAD_REQUEST", requestId, 400);
  }

  if (!body.password || body.password !== ADMIN_PASSWORD) {
    return errorResponse("Unauthorized", "UNAUTHORIZED", requestId, 401);
  }

  // A production system would issue a signed, httpOnly session cookie here.
  return NextResponse.json(
    { ok: true, authenticated: true },
    { status: 200, headers: { "X-Request-ID": requestId } },
  );
}
