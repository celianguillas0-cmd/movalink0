import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUser } from "@/lib/store";
import { DISCOUNT_CODES } from "@/lib/config";
import { Billing, LIFETIME_PRICE, MONTHLY_PRICES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  let body: { plan?: string; billing?: string; discountCode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const billing: Billing = body.billing === "lifetime" ? "lifetime" : "monthly";
  // L'offre à vie débloque Elite ; les abonnements ciblent le plan choisi.
  const plan =
    billing === "lifetime"
      ? "elite"
      : body.plan === "pro" || body.plan === "elite"
        ? body.plan
        : null;
  if (!plan) {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }

  // Un accès à vie est définitif : rien à racheter.
  if (user.lifetime) {
    return NextResponse.json(
      { error: "Tu as déjà l'accès à vie." },
      { status: 400 }
    );
  }
  // Abonnement déjà actif sur le même plan.
  if (
    billing === "monthly" &&
    user.subscriptionStatus === "active" &&
    user.subscriptionPlan === plan
  ) {
    return NextResponse.json(
      { error: `Tu es déjà abonné au plan ${plan === "pro" ? "Pro" : "Elite"}.` },
      { status: 400 }
    );
  }

  // Code de réduction (uniquement sur l'offre à vie, dont on maîtrise le montant).
  const rawCode =
    typeof body.discountCode === "string"
      ? body.discountCode.trim().toUpperCase()
      : "";
  if (rawCode && !DISCOUNT_CODES[rawCode]) {
    return NextResponse.json(
      { error: "Code de réduction invalide." },
      { status: 400 }
    );
  }
  const discountPct =
    billing === "lifetime" && rawCode ? DISCOUNT_CODES[rawCode] : 0;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const origin = request.nextUrl.origin;

  if (!stripeKey) {
    // Environnement sans Stripe : on débloque directement pour pouvoir tester.
    if (process.env.NODE_ENV !== "production") {
      if (billing === "lifetime") {
        await saveUser({
          ...user,
          plan: "elite",
          lifetime: true,
          billing: "lifetime",
        });
      } else {
        await saveUser({
          ...user,
          plan,
          billing: "monthly",
          subscriptionStatus: "active",
          subscriptionPlan: plan,
        });
      }
      return NextResponse.json({ ok: true, upgraded: true });
    }
    return NextResponse.json(
      { error: "Le paiement n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  const planLabel = plan === "pro" ? "Pro" : "Elite";
  const params = new URLSearchParams({
    success_url: `${origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    customer_email: user.email,
    "metadata[userId]": user.id,
  });

  if (billing === "lifetime") {
    const amountCents =
      discountPct > 0
        ? Math.max(0, Math.round(LIFETIME_PRICE.amountCents * (1 - discountPct / 100)))
        : LIFETIME_PRICE.amountCents;
    const name =
      discountPct > 0
        ? `Movalink à vie — accès Elite (−${discountPct}% · ${rawCode})`
        : "Movalink à vie — accès Elite pour toujours";
    params.set("mode", "payment");
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "eur");
    params.set("line_items[0][price_data][unit_amount]", String(amountCents));
    params.set("line_items[0][price_data][product_data][name]", name);
    params.set("metadata[kind]", "lifetime");
  } else {
    params.set("mode", "subscription");
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "eur");
    params.set("line_items[0][price_data][unit_amount]", String(MONTHLY_PRICES[plan].amountCents));
    params.set("line_items[0][price_data][recurring][interval]", "month");
    params.set(
      "line_items[0][price_data][product_data][name]",
      `Movalink ${planLabel} — abonnement mensuel`
    );
    params.set("metadata[kind]", "monthly");
    params.set("metadata[plan]", plan);
    // Métadonnées reportées sur l'abonnement pour les webhooks de cycle de vie.
    params.set("subscription_data[metadata][userId]", user.id);
    params.set("subscription_data[metadata][plan]", plan);
  }

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
