import { NextRequest, NextResponse } from "next/server";
import { bumpStats, getProfile, getStats, getUserById, getUserIdByUsername, updateLeaderboard } from "@/lib/store";
import { PLAN_LIMITS } from "@/lib/types";

export async function POST(request: NextRequest) {
  let body: { username?: string; type?: string; linkId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const username = (body.username ?? "").trim().toLowerCase();
  const type = body.type === "click" ? "click" : body.type === "view" ? "view" : null;
  if (!username || !type) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }
  if (!(await getUserIdByUsername(username))) {
    return NextResponse.json({ error: "Profil inconnu." }, { status: 404 });
  }

  const linkId =
    typeof body.linkId === "string" ? body.linkId.slice(0, 32) : undefined;
  await bumpStats(username, type, linkId);

  if (type === "view") {
    // Fire-and-forget — leaderboard non critique.
    void (async () => {
      try {
        const [profile, userId] = await Promise.all([
          getProfile(username),
          getUserIdByUsername(username),
        ]);
        if (!profile || !userId) return;
        const user = await getUserById(userId);
        const stats = await getStats(username);
        await updateLeaderboard({
          username,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          plan: user?.plan ?? "free",
          totalViews: stats.totalViews,
        });
      } catch { /* non critique */ }
    })();
  }

  return NextResponse.json({ ok: true });
}
