import { NextRequest, NextResponse } from "next/server";
import {
  destroySession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { decrementUserStats, deleteUserRecords, saveUser } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const current = body.currentPassword ?? "";
  const next = body.newPassword ?? "";

  if (!(await verifyPassword(current, user.passwordHash))) {
    return NextResponse.json(
      { error: "Mot de passe actuel incorrect." },
      { status: 401 }
    );
  }
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
  await deleteUserRecords(user);
  await decrementUserStats(user.plan);
  await destroySession();
  return NextResponse.json({ ok: true });
}
