import { NextRequest, NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { getUserByEmail } from "@/lib/store";

// ─── Rate limiter ────────────────────────────────────────────────────────────
// Per-email: 8 failed attempts max in a 15-minute window.
// Counter resets on successful login so legitimate users aren't locked out.
const failures = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILURES = 8;
const WINDOW_MS = 15 * 60 * 1000;

function recordFailure(email: string): boolean {
  const now = Date.now();
  const entry = failures.get(email);
  if (!entry || now >= entry.resetAt) {
    failures.set(email, { count: 1, resetAt: now + WINDOW_MS });
    return false; // not locked
  }
  entry.count++;
  return entry.count > MAX_FAILURES;
}

function clearFailures(email: string) {
  failures.delete(email);
}

function isLocked(email: string): boolean {
  const now = Date.now();
  const entry = failures.get(email);
  if (!entry || now >= entry.resetAt) return false;
  return entry.count > MAX_FAILURES;
}

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (isLocked(email)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans 15 minutes." },
      { status: 429 }
    );
  }

  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    const locked = recordFailure(email);
    const msg = locked
      ? "Trop de tentatives. Réessaie dans 15 minutes."
      : "Email ou mot de passe incorrect.";
    return NextResponse.json({ error: msg }, { status: locked ? 429 : 401 });
  }

  clearFailures(email);
  await createSession(user.id);
  return NextResponse.json({ ok: true, username: user.username });
}
