import { NextRequest, NextResponse } from "next/server";

/**
 * Admin API route — frontend ISR revalidation proxy
 * Client-side hooks call this endpoint (same origin),
 * then this server-side handler forwards to frontend with the secret.
 */

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tags, paths, path } = body as { tags?: string[]; paths?: string[]; path?: string };

    // paths array yoki eski path string'ni qo'llab-quvvatlaymiz
    const pathList = paths || (path ? [path] : ["/"]);

    const res = await fetch(`${FRONTEND_URL}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags, paths: pathList, secret: REVALIDATION_SECRET }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { revalidated: false, error: "Failed to proxy revalidation" },
      { status: 500 }
    );
  }
}
