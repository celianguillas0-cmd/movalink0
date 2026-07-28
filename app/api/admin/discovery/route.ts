import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDiscoveryStats } from "@/lib/store";

export const dynamic = "force-dynamic";

function isAdmin(user: { email: string; isAdmin?: boolean }): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  return user.email === adminEmail || user.isAdmin === true;
}

// Statistiques du sondage de découverte — réservé à l'administrateur.
export async function GET() {
  const me = await getCurrentUser();
  if (!me || !isAdmin(me)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const stats = await getDiscoveryStats();
  return NextResponse.json(stats);
}
