import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { linkStripeCustomer, saveUser } from "@/lib/store";
import { Plan, User } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Session manquante." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Le paiement n'est pas configuré." },
      { status: 503 }
    );
  }

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { Authorization: `Bearer ${stripeKey}` } }
  );
  const session = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }
  if (session.metadata?.userId !== user.id) {
    return NextResponse.json(
      { error: "Cette session ne correspond pas à ton compte." },
      { status: 403 }
    );
  }
  // Une session d'abonnement est "complete" ; un paiement unique est "paid".
  const settled =
    session.status === "complete" || session.payment_status === "paid";
  if (!settled) {
    return NextResponse.json(
      { error: "Le paiement n'a pas été confirmé." },
      { status: 402 }
    );
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : undefined;
  if (customerId) await linkStripeCustomer(customerId, user.id);

  const updated: User = { ...user };
  if (customerId) updated.stripeCustomerId = customerId;

  if (session.metadata?.kind === "lifetime" || session.mode === "payment") {
    updated.plan = "elite";
    updated.lifetime = true;
    updated.billing = "lifetime";
    await saveUser(updated);
    return NextResponse.json({ ok: true, plan: "elite", billing: "lifetime" });
  }

  // Abonnement mensuel.
  const plan: Plan =
    session.metadata?.plan === "pro" || session.metadata?.plan === "elite"
      ? session.metadata.plan
      : "pro";
  updated.plan = plan;
  updated.billing = "monthly";
  updated.subscriptionPlan = plan;
  updated.subscriptionStatus = "active";
  if (typeof session.subscription === "string") {
    updated.stripeSubscriptionId = session.subscription;
  }
  await saveUser(updated);
  return NextResponse.json({ ok: true, plan, billing: "monthly" });
}
