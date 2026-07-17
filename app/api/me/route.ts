import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, getStats } from "@/lib/store";
import { PLAN_LIMITS, toPublicUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  const [profile, stats] = await Promise.all([
    getProfile(user.username),
    getStats(user.username),
  ]);
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase() ?? "";
  const isAdmin = user.email === adminEmail || user.isAdmin === true;
  return NextResponse.json({
    user: { ...toPublicUser(user), isAdmin },
    profile,
    stats,
    limits: PLAN_LIMITS[user.plan],
  });
}
