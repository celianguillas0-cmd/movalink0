import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Ouvre le portail de facturation Stripe pour que l'abonné gère lui-même son
// abonnement (annulation, changement de carte, factures).
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun abonnement à gérer." },
      { status: 400 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "La gestion d'abonnement n'est pas disponible pour le moment." },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    customer: user.stripeCustomerId,
    return_url: `${request.nextUrl.origin}/dashboard/premium`,
  });

  const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
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
      "Stripe portal error:",
      response.status,
      JSON.stringify(session?.error ?? session)
    );
    return NextResponse.json(
      { error: "Impossible d'ouvrir la gestion d'abonnement." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, url: session.url });
}
