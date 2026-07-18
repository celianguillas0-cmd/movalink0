import { NextRequest, NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import {
  createUserRecords,
  getUserByEmail,
  getUserIdByUsername,
  getReferralUserId,
  incrementReferralCount,
  incrementUserStats,
  saveReferralCode,
} from "@/lib/store";
import { newId, validateEmail, validateUsername } from "@/lib/slug";
import { emptyProfile, User } from "@/lib/types";

// ─── Rate limiter ────────────────────────────────────────────────────────────
// Per-email: 3 signups max in a 1-hour window.
const signupAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_SIGNUPS = 3;
const WINDOW_MS = 60 * 60 * 1000;

function checkSignupLimit(email: string): boolean {
  const now = Date.now();
  const entry = signupAttempts.get(email);
  if (!entry || now >= entry.resetAt) {
    signupAttempts.set(email, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX_SIGNUPS) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  let body: { email?: string; username?: string; password?: string; ref?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (checkSignupLimit(email)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessaie dans 1 heure." },
      { status: 429 }
    );
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit faire au moins 8 caractères." },
      { status: 400 }
    );
  }
  const check = validateUsername(body.username ?? "");
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  if (await getUserByEmail(email)) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cette adresse email." },
      { status: 409 }
    );
  }
  if (await getUserIdByUsername(check.username)) {
    return NextResponse.json({ error: "Ce pseudo est déjà pris." }, { status: 409 });
  }

  const ownCode = newId().slice(0, 8);
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  const user: User = {
    id: newId(),
    email,
    username: check.username,
    passwordHash: await hashPassword(password),
    plan: "free",
    isAdmin: adminEmail ? email === adminEmail : false,
    referralCode: ownCode,
    referralCount: 0,
    createdAt: new Date().toISOString(),
  };
  await createUserRecords(user, emptyProfile(check.username));
  await saveReferralCode(ownCode, user.id);
  await incrementUserStats("free");

  // Créditer le parrain si un code valide est fourni.
  const refCode = typeof body.ref === "string" ? body.ref.trim().slice(0, 16) : "";
  if (refCode) {
    const referrerId = await getReferralUserId(refCode);
    if (referrerId && referrerId !== user.id) {
      await incrementReferralCount(referrerId);
    }
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true, username: user.username });
}
