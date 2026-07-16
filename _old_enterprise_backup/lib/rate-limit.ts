import { NextResponse, type NextRequest } from "next/server";

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }
  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]!.trim() : "anonymous";
  return ip;
}

export function errorResponse(
  message: string,
  code: string,
  requestId: string,
  status = 400,
): NextResponse {
  return NextResponse.json(
    { error: message, code, request_id: requestId },
    { status, headers: { "X-Request-ID": requestId } },
  );
}
