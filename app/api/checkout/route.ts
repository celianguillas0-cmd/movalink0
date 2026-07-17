import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUser } from "@/lib/store";
import { upgradePriceCents } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  let body: { plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const plan = body.plan === "pro" || body.plan === "elite" ? body.plan : null;
  if (!plan) {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }
  if (user.plan === "elite" || user.plan === plan) {
    return NextResponse.json({ error: "Tu as déjà ce plan." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const origin = request.nextUrl.origin;

  if (!stripeKey) {
    // Environnement de développement sans Stripe : upgrade direct pour tester.
    if (process.env.NODE_ENV !== "production") {
      await saveUser({ ...user, plan });
      return NextResponse.json({ ok: true, upgraded: true });
    }
    return NextResponse.json(
      { error: "Le paiement n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  const amountCents = upgradePriceCents(user.plan, plan);
  const isUpgrade = user.plan === "pro" && plan === "elite";
  const productName = isUpgrade
    ? "Movalink Elite — mise à niveau depuis Pro"
    : `Movalink ${plan === "pro" ? "Pro" : "Elite"} — accès à vie`;
  const params = new URLSearchParams({
    mode: "payment",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(amountCents),
    "line_items[0][price_data][product_data][name]": productName,
    success_url: `${origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    "metadata[userId]": user.id,
    "metadata[plan]": plan,
    customer_email: user.email,
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = await response.json();
  if (!response.ok || !session.url) {
    console.error(
      "Stripe checkout error:",
      response.status,
      JSON.stringify(session?.error ?? session)
    );
    return NextResponse.json(
      { error: "Impossible de démarrer le paiement. Réessaie plus tard." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, url: session.url });
}
