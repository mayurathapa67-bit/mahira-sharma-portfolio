import { NextResponse } from "next/server";
import { getContent } from "@/lib/github";
import { errorResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST() {
  return errorResponse("Method not allowed", "METHOD_NOT_ALLOWED", 405);
}
