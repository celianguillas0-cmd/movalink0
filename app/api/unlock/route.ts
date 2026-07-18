import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }

  const { username, password } = body;
  if (!username || !password) return NextResponse.json({ error: "Champs manquants." }, { status: 400 });

  const profile = await getProfile(username);
  if (!profile?.pagePassword) return NextResponse.json({ error: "Page non protégée." }, { status: 404 });
  if (profile.pagePassword !== password) return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });

  const cookieValue = Buffer.from(`${username}:${password}`).toString("base64");
  const response = NextResponse.json({ ok: true });
  response.cookies.set(`mova_unlock_${username}`, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
