import { NextRequest, NextResponse } from "next/server";
import {
  destroySession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import {
  decrementUserStats,
  deleteUserRecords,
  getUserIdByUsername,
  renameUser,
  saveUser,
} from "@/lib/store";
import { validateUsername } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  let body: {
    currentPassword?: string;
    newPassword?: string;
    newUsername?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const current = body.currentPassword ?? "";

  // Le mot de passe actuel est exigé pour toute modification sensible.
  if (!(await verifyPassword(current, user.passwordHash))) {
    return NextResponse.json(
      { error: "Mot de passe actuel incorrect." },
      { status: 401 }
    );
  }

  // ─── Changement de pseudo ─────────────────────────────────────────────────
  if (typeof body.newUsername === "string") {
    const check = validateUsername(body.newUsername);
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    if (check.username === user.username) {
      return NextResponse.json(
        { error: "C'est déjà ton pseudo actuel." },
        { status: 400 }
      );
    }
    const existingId = await getUserIdByUsername(check.username);
    if (existingId && existingId !== user.id) {
      return NextResponse.json(
        { error: "Ce pseudo est déjà pris." },
        { status: 409 }
      );
    }
    await renameUser(user, check.username);
    return NextResponse.json({ ok: true, username: check.username });
  }

  // ─── Changement de mot de passe ───────────────────────────────────────────
  const next = body.newPassword ?? "";
  if (next.length < 8) {
    return NextResponse.json(
      { error: "Le nouveau mot de passe doit faire au moins 8 caractères." },
      { status: 400 }
    );
  }

  await saveUser({ ...user, passwordHash: await hashPassword(next) });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  // Annule l'abonnement Stripe AVANT d'effacer le compte : sans cela,
  // l'utilisateur continuerait d'être prélevé pour un service supprimé
  // (litiges bancaires, non-conformité). Best-effort : on n'empêche jamais la
  // suppression (droit à l'effacement), mais on tente l'annulation.
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && user.stripeSubscriptionId) {
    try {
      const res = await fetch(
        `https://api.stripe.com/v1/subscriptions/${encodeURIComponent(user.stripeSubscriptionId)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${stripeKey}` } }
      );
      if (!res.ok) {
        console.error(
          "Stripe subscription cancel on account deletion failed:",
          res.status,
          await res.text()
        );
      }
    } catch (e) {
      console.error("Stripe subscription cancel error:", e);
    }
  }

  await deleteUserRecords(user);
  await decrementUserStats(user.plan);
  await destroySession();
  return NextResponse.json({ ok: true });
}
