import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getUserByEmail,
  getProfile,
  getStats,
  saveUser,
  updateUserStatsPlan,
} from "@/lib/store";
import { Plan, toPublicUser } from "@/lib/types";

function isAdmin(user: { email: string; isAdmin?: boolean }): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  return user.email === adminEmail || user.isAdmin === true;
}

export async function GET(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || !isAdmin(me)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const email = request.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "Paramètre email manquant." }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const [profile, stats] = await Promise.all([
    getProfile(user.username),
    getStats(user.username),
  ]);

  return NextResponse.json({ user: toPublicUser(user), profile, stats });
}

export async function PATCH(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me || !isAdmin(me)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  let body: { email?: string; plan?: Plan; isAdmin?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = (body.email ?? "").toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "Email manquant." }, { status: 400 });
  }

  const target = await getUserByEmail(email);
  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const updates: Partial<typeof target> = {};

  if (body.plan !== undefined) {
    const validPlans: Plan[] = ["free", "pro", "elite"];
    if (!validPlans.includes(body.plan)) {
      return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
    }
    await updateUserStatsPlan(target.plan, body.plan);
    updates.plan = body.plan;
  }

  if (body.isAdmin !== undefined) {
    updates.isAdmin = body.isAdmin;
  }

  const updated = { ...target, ...updates };
  await saveUser(updated);

  return NextResponse.json({ ok: true, user: toPublicUser(updated) });
}
