import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  getUserById,
  getUserIdByStripeCustomer,
  linkStripeCustomer,
  saveUser,
} from "@/lib/store";
import { Plan, User } from "@/lib/types";

export const dynamic = "force-dynamic";

// Vérifie la signature Stripe (header "stripe-signature": t=…,v1=…) sans SDK :
// HMAC-SHA256 de `${t}.${payload}` avec le secret du webhook.
function verifySignature(payload: string, header: string, secret: string): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string])
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  const expected = createHmac("sha256", secret)
    .update(`${t}.${payload}`)
    .digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(v1, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function isDowngrade(status: string): boolean {
  return (
    status === "canceled" ||
    status === "unpaid" ||
    status === "incomplete_expired"
  );
}

// Retrouve l'utilisateur ciblé par un objet abonnement Stripe.
async function resolveUser(obj: {
  customer?: unknown;
  metadata?: { userId?: string };
}): Promise<User | null> {
  const metaId = obj.metadata?.userId;
  if (metaId) {
    const u = await getUserById(metaId);
    if (u) return u;
  }
  if (typeof obj.customer === "string") {
    const id = await getUserIdByStripeCustomer(obj.customer);
    if (id) return getUserById(id);
  }
  return null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook non configuré." },
      { status: 503 }
    );
  }

  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";
  if (!verifySignature(payload, sig, secret)) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Payload invalide." }, { status: 400 });
  }

  const obj = event.data.object as Record<string, unknown>;

  switch (event.type) {
    case "checkout.session.completed": {
      const metaUserId = (obj.metadata as { userId?: string })?.userId;
      const customer = typeof obj.customer === "string" ? obj.customer : undefined;
      if (metaUserId && customer) await linkStripeCustomer(customer, metaUserId);
      const user = metaUserId ? await getUserById(metaUserId) : null;
      if (user) {
        const kind = (obj.metadata as { kind?: string })?.kind;
        const updated: User = { ...user };
        if (customer) updated.stripeCustomerId = customer;
        if (kind === "lifetime" || obj.mode === "payment") {
          updated.plan = "elite";
          updated.lifetime = true;
          updated.billing = "lifetime";
        } else {
          const plan = (obj.metadata as { plan?: string })?.plan;
          const p: Plan = plan === "elite" ? "elite" : "pro";
          updated.plan = p;
          updated.billing = "monthly";
          updated.subscriptionPlan = p;
          updated.subscriptionStatus = "active";
          if (typeof obj.subscription === "string") {
            updated.stripeSubscriptionId = obj.subscription;
          }
        }
        await saveUser(updated);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const user = await resolveUser(obj);
      if (user) {
        const status =
          event.type === "customer.subscription.deleted"
            ? "canceled"
            : String(obj.status ?? "");
        const metaPlan = (obj.metadata as { plan?: string })?.plan;
        const plan: Plan =
          metaPlan === "elite"
            ? "elite"
            : metaPlan === "pro"
              ? "pro"
              : user.subscriptionPlan ?? "pro";
        const updated: User = { ...user, subscriptionStatus: status };
        if (typeof obj.current_period_end === "number") {
          updated.currentPeriodEnd = new Date(
            obj.current_period_end * 1000
          ).toISOString();
        }
        if (isDowngrade(status)) {
          // L'accès à vie n'est jamais retiré par un abonnement qui s'arrête.
          if (!user.lifetime) {
            updated.plan = "free";
            updated.billing = undefined;
            updated.subscriptionPlan = undefined;
            updated.stripeSubscriptionId = undefined;
          }
        } else if (!user.lifetime) {
          // active / past_due / trialing : (ré)accorde le plan de l'abonnement.
          updated.plan = plan;
          updated.subscriptionPlan = plan;
          updated.billing = "monthly";
        }
        await saveUser(updated);
      }
      break;
    }

    default:
      // Événements non gérés : accusé de réception silencieux.
      break;
  }

  return NextResponse.json({ received: true });
}
