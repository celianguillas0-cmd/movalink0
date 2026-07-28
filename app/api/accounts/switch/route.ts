import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, switchAccount } from "@/lib/auth";
import { getUserById } from "@/lib/store";

export const dynamic = "force-dynamic";

// Bascule vers un autre compte déjà connecté.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  let body: { userId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const userId = typeof body.userId === "string" ? body.userId : "";
  const ok = await switchAccount(userId);
  if (!ok) {
    return NextResponse.json(
      { error: "Ce compte n'est pas disponible." },
      { status: 400 }
    );
  }
  const target = await getUserById(userId);
  return NextResponse.json({ ok: true, username: target?.username });
}
