import { NextResponse, type NextRequest } from "next/server";
import { errorResponse } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";

export async function POST(req: NextRequest) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return errorResponse("Upload not configured", "CONFIG", 500);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return errorResponse("Expected multipart form", "BAD_REQUEST", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return errorResponse("No file provided", "BAD_REQUEST", 400);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `timestamp=${timestamp}${API_SECRET}`;
  const crypto = await import("node:crypto");
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign)
    .digest("hex");

  const body = new FormData();
  body.append("file", new Blob([buffer], { type: file.type }), file.name);
  body.append("api_key", API_KEY);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body },
    );
    const data = (await res.json()) as { secure_url?: string; error?: unknown };
    if (!res.ok || !data.secure_url) {
      return errorResponse("Upload failed", "UPLOAD_FAILED", 500);
    }
    return NextResponse.json(
      { url: data.secure_url },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return errorResponse("Upload error", "UPLOAD_ERROR", 500);
  }
}
