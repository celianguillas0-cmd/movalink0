import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserStats } from "@/lib/store";

function isAdmin(user: { email: string; isAdmin?: boolean }): boolean {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  return user.email === adminEmail || user.isAdmin === true;
}

export async function GET() {
  const me = await getCurrentUser();
  if (!me || !isAdmin(me)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
  const stats = await getUserStats();
  return NextResponse.json(stats);
}
