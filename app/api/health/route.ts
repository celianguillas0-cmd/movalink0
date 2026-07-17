import { NextResponse } from "next/server";
import { kv, usingPersistentStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "degraded" | "down"> = {
    web: "ok",
    store: "down",
    media: process.env.BLOB_READ_WRITE_TOKEN ? "ok" : "down",
    payments: process.env.STRIPE_SECRET_KEY ? "ok" : "degraded",
  };

  try {
    const key = "health:probe";
    const stamp = Date.now();
    await kv.set(key, stamp);
    const read = await kv.get<number>(key);
    if (read === stamp) {
      checks.store = usingPersistentStore() ? "ok" : "degraded";
    }
  } catch {
    checks.store = "down";
  }

  return NextResponse.json({ checks, at: new Date().toISOString() });
}
