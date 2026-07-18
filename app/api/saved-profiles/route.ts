import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSavedSlots, setSavedSlots } from "@/lib/store";
import { PLAN_LIMITS, SavedProfileSlot } from "@/lib/types";
import { newId } from "@/lib/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  const slots = await getSavedSlots(user.id);
  return NextResponse.json({ slots });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  const limits = PLAN_LIMITS[user.plan];
  if (limits.savedProfiles === 0) {
    return NextResponse.json({ error: "Aucun emplacement disponible sur ce plan." }, { status: 403 });
  }

  let body: { id?: string; name?: string; profile?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : "";
  if (!name) return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  if (!body.profile || typeof body.profile !== "object") {
    return NextResponse.json({ error: "Profil requis." }, { status: 400 });
  }

  const slots = await getSavedSlots(user.id);

  // Update existing slot
  if (body.id) {
    const idx = slots.findIndex((s) => s.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Emplacement introuvable." }, { status: 404 });
    slots[idx] = { ...slots[idx], name, savedAt: new Date().toISOString(), profile: body.profile as SavedProfileSlot["profile"] };
    await setSavedSlots(user.id, slots);
    return NextResponse.json({ slot: slots[idx] });
  }

  // Create new slot
  if (slots.length >= limits.savedProfiles) {
    return NextResponse.json(
      { error: `Limite atteinte (${limits.savedProfiles} emplacements pour ton plan).` },
      { status: 403 }
    );
  }

  const slot: SavedProfileSlot = {
    id: newId(),
    name,
    savedAt: new Date().toISOString(),
    profile: body.profile as SavedProfileSlot["profile"],
  };
  slots.push(slot);
  await setSavedSlots(user.id, slots);
  return NextResponse.json({ slot });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  let body: { id?: string; scheduledAt?: string | null; activeUntil?: string | null };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Requête invalide." }, { status: 400 }); }

  if (!body.id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const slots = await getSavedSlots(user.id);
  const idx = slots.findIndex((s) => s.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "Emplacement introuvable." }, { status: 404 });

  const slot = { ...slots[idx] };
  if ("scheduledAt" in body) {
    if (body.scheduledAt == null) delete slot.scheduledAt;
    else slot.scheduledAt = body.scheduledAt;
  }
  if ("activeUntil" in body) {
    if (body.activeUntil == null) delete slot.activeUntil;
    else slot.activeUntil = body.activeUntil;
  }
  slots[idx] = slot;
  await setSavedSlots(user.id, slots);
  return NextResponse.json({ slot });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non connecté." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const slots = await getSavedSlots(user.id);
  const filtered = slots.filter((s) => s.id !== id);
  if (filtered.length === slots.length) {
    return NextResponse.json({ error: "Emplacement introuvable." }, { status: 404 });
  }
  await setSavedSlots(user.id, filtered);
  return NextResponse.json({ ok: true });
}
