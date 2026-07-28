import { NextResponse } from "next/server";
import { getCurrentUser, listAccounts } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Liste des comptes connectés (multi-comptes) pour le sélecteur.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  return NextResponse.json({ accounts: await listAccounts() });
}
