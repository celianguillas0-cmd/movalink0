import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getFounderCount, incrementFounderCount, saveUser } from "@/lib/store";
import {
  FOUNDER_CODES,
  FOUNDER_LIMIT,
  PROMO_CODES,
  RESET_CODE,
} from "@/lib/config";
import { Plan } from "@/lib/types";

export const dynamic = "force-dynamic";

const RANK: Record<Plan, number> = { free: 0, pro: 1, elite: 2 };

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Entre un code." }, { status: 400 });
  }

  // Code privé de réinitialisation : retour au plan Gratuit + effacement de
  // l'historique des codes (réutilisable à volonté).
  if (code === RESET_CODE) {
    await saveUser({ ...user, plan: "free", redeemedCodes: [] });
    return NextResponse.json({ ok: true, reset: true, plan: "free" });
  }

  const used = user.redeemedCodes ?? [];

  // ─── Code fondateur : Elite à vie ──────────────────────────────────────────
  // Traité avant le contrôle de rang ci-dessous : un compte déjà Elite doit
  // pouvoir transformer son accès en accès *à vie*, ce que ce contrôle
  // refuserait (le plan n'augmente pas, seul « lifetime » change).
  if (FOUNDER_CODES.includes(code)) {
    if (user.lifetime) {
      return NextResponse.json(
        { error: "Tu as déjà l'accès à vie." },
        { status: 400 }
      );
    }
    if (used.includes(code)) {
      return NextResponse.json(
        { error: "Ce code a déjà été utilisé sur ce compte." },
        { status: 400 }
      );
    }
    // Plafond global : l'offre reste tenable même si le code circule.
    if ((await getFounderCount()) >= FOUNDER_LIMIT) {
      return NextResponse.json(
        { error: "L'offre fondateur est complète. Merci de ton intérêt !" },
        { status: 400 }
      );
    }
    await incrementFounderCount();
    await saveUser({
      ...user,
      plan: "elite",
      lifetime: true,
      billing: "lifetime",
      redeemedCodes: [...used, code],
    });
    return NextResponse.json({ ok: true, plan: "elite", founder: true });
  }

  const grantedPlan = PROMO_CODES[code];
  if (!grantedPlan) {
    return NextResponse.json({ error: "Code invalide." }, { status: 404 });
  }

  // Usage unique par compte.
  if (used.includes(code)) {
    return NextResponse.json(
      { error: "Ce code a déjà été utilisé sur ce compte." },
      { status: 400 }
    );
  }

  // On ne rétrograde jamais : un code Pro n'enlève pas un accès Elite déjà obtenu.
  if (RANK[user.plan] >= RANK[grantedPlan]) {
    return NextResponse.json(
      {
        error:
          user.plan === grantedPlan
            ? `Tu as déjà le plan ${grantedPlan === "pro" ? "Pro" : "Elite"}.`
            : "Ton plan actuel est déjà supérieur à ce code.",
      },
      { status: 400 }
    );
  }

  await saveUser({
    ...user,
    plan: grantedPlan,
    redeemedCodes: [...used, code],
  });
  return NextResponse.json({ ok: true, plan: grantedPlan });
}
