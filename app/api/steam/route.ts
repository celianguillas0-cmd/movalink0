import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const steamId = req.nextUrl.searchParams.get("id");
  if (!steamId || !/^\d{17}$/.test(steamId)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const key = process.env.STEAM_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "no_key" }, { status: 503 });
  }

  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("steam_error");
    const data = await res.json();
    const player = data?.response?.players?.[0];
    if (!player) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({
      personaName: player.personaname ?? "",
      gameName: player.gameextrainfo ?? null,
      gameId: player.gameid ?? null,
      avatar: player.avatarmedium ?? null,
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
