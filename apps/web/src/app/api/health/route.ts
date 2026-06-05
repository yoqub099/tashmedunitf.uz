import { NextResponse } from 'next/server';

// Lightweight liveness probe for Docker/compose healthchecks and uptime monitors.
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'web',
    time: new Date().toISOString(),
  });
}
