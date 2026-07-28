import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recordDiscovery, saveUser } from "@/lib/store";
import { DISCOVERY_OPTIONS } from "@/lib/types";

export const dynamic = "force-dynamic";

// Enregistre la réponse au sondage « Comment as-tu découvert Movalink ? ».
// Idempotent : une seule réponse comptabilisée par compte.
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  if (user.discoverySource) {
    return NextResponse.json({ ok: true, already: true });
  }

  let body: { source?: string; detail?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source : "";
  if (!DISCOVERY_OPTIONS.some((o) => o.key === source)) {
    return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
  }
  const detail =
    source === "other" && typeof body.detail === "string"
      ? body.detail.trim().slice(0, 200)
      : undefined;

  await saveUser({ ...user, discoverySource: source, discoveryDetail: detail });
  await recordDiscovery(source, detail);
  return NextResponse.json({ ok: true });
}
