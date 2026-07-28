import { NextResponse } from "next/server";
import { logoutCurrent } from "@/lib/auth";

// Déconnecte le compte actif. En multi-comptes, bascule vers un autre compte
// connecté s'il en reste ; sinon efface la session.
export async function POST() {
  const { switchedTo } = await logoutCurrent();
  return NextResponse.json({ ok: true, switchedTo });
}
