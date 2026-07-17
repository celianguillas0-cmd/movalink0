import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { PLAN_LIMITS } from "@/lib/types";

export const dynamic = "force-dynamic";

const AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
]);
const AUDIO_MAX_MB = 8;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Le stockage de fichiers n'est pas configuré." },
      { status: 503 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (!AUDIO_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Seuls les fichiers audio (MP3, OGG, WAV) sont acceptés." },
      { status: 400 }
    );
  }

  const limits = PLAN_LIMITS[user.plan];
  if (!limits.music) {
    return NextResponse.json(
      { error: "La musique de fond nécessite un plan Pro ou Elite." },
      { status: 403 }
    );
  }

  if (file.size > AUDIO_MAX_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `Fichier trop lourd (maximum ${AUDIO_MAX_MB} Mo).` },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1].replace("mpeg", "mp3");
  const blob = await put(`media/${user.id}/${Date.now()}.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
