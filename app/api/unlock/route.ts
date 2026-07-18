import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/store";

export const dynamic = "force-dynamic";

// ─── Simple in-memory rate limiter ──────────────────────────────────────────
// Keyed by username. Resets after WINDOW_MS. Shared across requests on the
// same server instance — good enough for a small deployment.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now >= entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_ATTEMPTS) return true;
  entry.count++;
  return false;
}

function resetRateLimit(key: string) {
  attempts.delete(key);
}

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }

  const { username, password } = body;
  if (!username || !password) return NextResponse.json({ error: "Champs manquants." }, { status: 400 });

  if (checkRateLimit(username)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans 15 minutes." },
      { status: 429 }
    );
  }

  const profile = await getProfile(username);
  if (!profile?.pagePassword) return NextResponse.json({ error: "Page non protégée." }, { status: 404 });

  if (profile.pagePassword !== password) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  // Correct password — reset counter so legitimate users don't get locked out.
  resetRateLimit(username);

  const cookieValue = Buffer.from(`${username}:${password}`).toString("base64");
  const response = NextResponse.json({ ok: true });
  response.cookies.set(`mova_unlock_${username}`, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
