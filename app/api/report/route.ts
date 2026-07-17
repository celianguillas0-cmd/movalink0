import { NextRequest, NextResponse } from "next/server";
import { saveReport } from "@/lib/store";
import { newId } from "@/lib/slug";
import { Report } from "@/lib/types";

const REASONS = new Set([
  "contenu-illegal",
  "droit-auteur",
  "harcelement",
  "usurpation",
  "contenu-choquant",
  "autre",
]);

export async function POST(request: NextRequest) {
  let body: {
    username?: string;
    reason?: string;
    details?: string;
    email?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const username = (body.username ?? "").trim().toLowerCase().slice(0, 30);
  const reason = REASONS.has(body.reason ?? "") ? body.reason! : "";
  const details = (body.details ?? "").trim().slice(0, 2000);

  if (!username || !reason || details.length < 10) {
    return NextResponse.json(
      {
        error:
          "Merci d'indiquer le profil concerné, un motif et une description d'au moins 10 caractères.",
      },
      { status: 400 }
    );
  }

  const report: Report = {
    id: newId(),
    username,
    reason,
    details,
    email: (body.email ?? "").trim().slice(0, 120),
    createdAt: new Date().toISOString(),
    status: "open",
  };
  await saveReport(report);

  return NextResponse.json({ ok: true });
}
