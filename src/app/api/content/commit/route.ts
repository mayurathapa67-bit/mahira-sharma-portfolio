import { NextResponse, type NextRequest } from "next/server";
import { saveContent } from "@/lib/github";
import { errorResponse } from "@/lib/rate-limit";
import { isContentPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON", "BAD_REQUEST", 400);
  }

  if (!isContentPayload(body)) {
    return errorResponse("Invalid content payload", "VALIDATION", 422);
  }

  const saved = await saveContent(body as Parameters<typeof saveContent>[0]);
  if (!saved) {
    return errorResponse(
      "Could not write to GitHub. Check repository configuration.",
      "WRITE_FAILED",
      500,
    );
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
