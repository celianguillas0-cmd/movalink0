import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUser } from "@/lib/store";

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
  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Le paiement n'a pas été confirmé." },
      { status: 402 }
    );
  }
  if (session.metadata?.userId !== user.id) {
    return NextResponse.json(
      { error: "Cette session ne correspond pas à ton compte." },
      { status: 403 }
    );
  }

  const plan = session.metadata?.plan;
  if (plan !== "pro" && plan !== "elite") {
    return NextResponse.json({ error: "Plan inconnu." }, { status: 400 });
  }

  if (user.plan !== plan) {
    await saveUser({ ...user, plan });
  }
  return NextResponse.json({ ok: true, plan });
}
