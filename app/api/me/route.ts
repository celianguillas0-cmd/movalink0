import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, getStats } from "@/lib/store";
import { effectiveLimits, resolvePlan, toPublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  const [profile, stats] = await Promise.all([
    getProfile(user.username),
    getStats(user.username),
  ]);
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  const isAdmin = user.email === adminEmail || user.isAdmin === true;
  return NextResponse.json({
    // Pendant le lancement gratuit, le dashboard reflète le plan effectif (Elite)
    // pour débloquer l'UI (thèmes, options) sans afficher de CTA d'upgrade.
    user: { ...toPublicUser(user), plan: resolvePlan(user.plan), isAdmin },
    profile,
    stats,
    limits: effectiveLimits(user.plan, user.referralCount ?? 0),
  });
}
