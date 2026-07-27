import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, getSavedSlots, getStats } from "@/lib/store";

export const dynamic = "force-dynamic";

// Export des données personnelles (droit à la portabilité — art. 20 RGPD).
// Renvoie l'ensemble des données du compte au format JSON, hors secrets
// (mot de passe haché, identifiants techniques internes non pertinents).
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const [profile, stats, savedSlots] = await Promise.all([
    getProfile(user.username),
    getStats(user.username),
    getSavedSlots(user.id),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    compte: {
      id: user.id,
      email: user.email,
      username: user.username,
      plan: user.plan,
      createdAt: user.createdAt,
      referralCode: user.referralCode,
      referralCount: user.referralCount ?? 0,
      redeemedCodes: user.redeemedCodes ?? [],
      billing: user.billing,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      currentPeriodEnd: user.currentPeriodEnd,
      lifetime: user.lifetime ?? false,
      lastCheckoutConsentAt: user.lastCheckoutConsentAt,
    },
    profil: profile,
    statistiques: stats,
    pagesSauvegardees: savedSlots,
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="movalink-donnees-${user.username}.json"`,
    },
  });
}
